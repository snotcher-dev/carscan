import React, { useState, useEffect } from 'react';
import './ScoreGauge.css';

const ScoreGauge = ({ score }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const normalizedScore = Math.min(Math.max(score, 0), 10);

  useEffect(() => {
    let current = 0;
    const intervalTime = 30; // ms per tick
    // Total animation time ~1s
    const ticks = 1000 / intervalTime;
    const step = normalizedScore / ticks;

    if (normalizedScore > 0) {
      const timer = setInterval(() => {
        current += step;
        if (current >= normalizedScore) {
          setDisplayScore(normalizedScore);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.floor(current * 10) / 10); // keep 1 decimal internally if needed, but rounding for display usually
        }
      }, intervalTime);
      return () => clearInterval(timer);
    }
  }, [normalizedScore]);

  // Round displayScore for typical visual if we don't want decimals, but condition_score is usually integer
  const finalDisplay = Math.round(displayScore);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (finalDisplay / 10) * circumference;
  
  let gaugeColor = 'var(--red)'; // 1-4
  let glowColor = 'var(--red-glow)';
  
  if (finalDisplay >= 8) {
    gaugeColor = '#00c853'; // Green
    glowColor = 'rgba(0, 200, 83, 0.4)';
  } else if (finalDisplay >= 5) {
    gaugeColor = '#ff9800'; // Orange
    glowColor = 'rgba(255, 152, 0, 0.4)';
  }

  return (
    <div className="score-gauge-container">
      <svg className="score-gauge" width="160" height="160" viewBox="0 0 160 160" style={{ filter: `drop-shadow(0 0 15px ${glowColor})` }}>
        <circle
          className="gauge-bg"
          cx="80"
          cy="80"
          r={radius}
          strokeWidth="12"
          fill="none"
        />
        <circle
          className="gauge-progress"
          cx="80"
          cy="80"
          r={radius}
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          stroke={gaugeColor}
          transform="rotate(-90 80 80)"
        />
      </svg>
      <div className="score-text">
        <span className="score-value">{finalDisplay}</span>
      </div>
    </div>
  );
};

export default ScoreGauge;
