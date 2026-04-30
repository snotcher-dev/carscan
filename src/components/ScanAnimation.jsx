import React, { useState, useEffect } from 'react';
import './ScanAnimation.css';

const LOADING_TEXTS = [
  "UPLOADING IMAGE",
  "AI IS INSPECTING EXTERIOR",
  "CHECKING FOR DAMAGES",
  "ESTIMATING MARKET VALUE",
  "GENERATING REPORT"
];

const ScanAnimation = ({ imageUrl, text }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    if (text) return;
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % LOADING_TEXTS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [text]);

  if (!imageUrl) return null;

  const displayText = text || LOADING_TEXTS[currentTextIndex];

  return (
    <div className="scan-overlay">
      <div className="scan-grid-bg"></div>
      <div className="scan-container">
        <div className="scan-image-wrapper">
          <img src={imageUrl} alt="Car being scanned" className="scan-image" />
          <div className="scan-line"></div>
        </div>
        <div className="scan-text">
          {displayText}<span className="blinking-dots">...</span>
        </div>
      </div>
    </div>
  );
};

export default ScanAnimation;
