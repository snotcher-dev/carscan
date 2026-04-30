export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Use the env var from Vercel dashboard. Fallback to REACT_APP for local testing if present.
  const API_KEY = process.env.GEMINI_API_KEY || process.env.REACT_APP_GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'Gemini API key is not configured on the server.' });
  }

  try {
    const { imagesArray, mimeType } = req.body;

    if (!imagesArray || !Array.isArray(imagesArray)) {
      return res.status(400).json({ error: 'Invalid payload: imagesArray must be an array' });
    }

    const imageParts = imagesArray.map(img => {
      const base64Data = img.includes(',') ? img.split(',')[1] : img;
      return {
        inline_data: {
          mime_type: mimeType || 'image/jpeg',
          data: base64Data
        }
      };
    });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`; 
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `You are an expert Moroccan car inspector with 20 years of experience.
Analyze these 1 to 6 images of a car (front, back, sides, interior) and synthesize a master condition report.
Return ONLY a valid JSON object with no extra text, no markdown, no backticks. The JSON must have exactly these fields:
{
  "make": "string",
  "model": "string",
  "year": "string or unknown",
  "estimated_price_mad": "number",
  "condition_score": "number between 1 and 10",
  "detected_issues": ["array of strings"],
  "damaged_zones": ["array of strings chosen ONLY from: front_bumper, rear_bumper, left_side, right_side, hood, roof, trunk, windshield"],
  "recommendation": "BUY or AVOID",
  "summary": "2-3 sentence string"
}`
            },
            ...imageParts
          ]
        }
      ]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: 'API Error', details: errorData });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
