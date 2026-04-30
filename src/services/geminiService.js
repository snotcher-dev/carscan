async function callWithRetry(fn, onRetry, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (err.status === 400) {
        throw new Error("Invalid image format or payload");
      }
      
      const isRetryable = err.status === 503 || err.status === 500 || err.status === 429;
      
      if (!isRetryable || i === retries - 1) {
        throw new Error("Our AI is temporarily overloaded. Please try again in a few seconds.");
      }
      
      const retryMsg = `AI is busy, retrying... (attempt ${i + 1}/${retries})`;
      console.log(retryMsg);
      
      if (onRetry) {
        onRetry(retryMsg);
      }

      const currentDelay = err.status === 429 ? 5000 : delay;
      await new Promise(res => setTimeout(res, currentDelay));
      
      if (onRetry) {
        onRetry(null);
      }
    }
  }
}

export const analyzeCarImage = async (base64Images, mimeType, onRetry = null) => {
  // Ensure we are working with an array of images
  const imagesArray = Array.isArray(base64Images) ? base64Images : [base64Images];

  // Call our own secure Vercel Serverless Function instead of Google directly
  const url = '/api/analyze'; 
  const payload = {
    imagesArray,
    mimeType
  };

  const executeApi = async () => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = new Error(`API error: ${response.status} ${response.statusText}`);
      error.status = response.status;
      
      try {
        const errorData = await response.json();
        error.details = errorData;
        console.error("Full API Error Response details:", errorData);
      } catch (e) {}
      
      throw error;
    }

    const data = await response.json();
    
    let responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      const structureErr = new Error('Invalid response structure from API');
      structureErr.status = 500;
      throw structureErr;
    }

    responseText = responseText.trim();
    if (responseText.startsWith('```json')) {
      responseText = responseText.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (responseText.startsWith('```')) {
      responseText = responseText.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    const parsedContext = JSON.parse(responseText);
    return parsedContext;
  };

  try {
    const parsedContext = await callWithRetry(executeApi, onRetry);
    return parsedContext;
  } catch (err) {
    console.error("Gemini Scan Error:", err);
    throw err; 
  }
};
