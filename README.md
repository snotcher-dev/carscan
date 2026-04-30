# CarScan.ma

CarScan.ma is an AI-Powered Car Inspection application built with React and the Google Gemini API. It allows users to upload a photo of a car and instantly receive a professional analysis including make, model, condition score, estimated price (in MAD), and a structural review.

## Features

- **AI-Powered Diagnostics**: Uses `gemini-2.0-flash` to act as an expert car inspector.
- **Drag & Drop Upload**: Smooth and intuitive image uploading.
- **Modern UI**: Built securely with standard React practices and custom responsive CSS.
- **Demo Limits**: Includes a local-storage based usage limit logic for showcasing limit systems.

## Prerequisites

- Node.js (v18+)
- npm or yarn

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```
   *(Note: This project uses `react-router-dom` on top of the default CRA dependencies).*

2. **Configure Environment Variables:**
   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Get an API key from [Google AI Studio](https://aistudio.google.com/) and add it to your `.env` file:
     ```
     REACT_APP_GEMINI_API_KEY=your_actual_api_key_here
     ```

3. **Start the development server:**
   ```bash
   npm start
   ```

## Folder Structure

- `src/components/`: Reusable UI components like `Navbar`, `UploadZone`, `ScanAnimation`, `ReportCard`, and `ScoreGauge`.
- `src/pages/`: Main application pages `Home` and `Result`.
- `src/services/`: Services for external API communication, such as `geminiService.js`.
- `src/App.jsx` & `index.js`: App routing and global layout setups.

## Technologies Used

- React (Create React App)
- React Router DOM
- Plain CSS Variables + Flexbox layout
- Google Gemini API (REST over `fetch`)

## License

This project is licensed under the MIT License.
