import React from 'react';
import './DamageHeatmap.css';

const DamageHeatmap = ({ damagedZones = [] }) => {
  const isDamaged = (zone) => damagedZones.includes(zone) ? 'damaged-zone' : '';

  return (
    <div className="damage-heatmap">
      <div className="heatmap-header">
        <h3 className="section-title">DAMAGE HEATMAP</h3>
      </div>
      
      <div className="heatmap-svg-wrapper">
        <svg viewBox="0 0 200 400" className="car-svg">
          <defs>
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Base Chassis */}
          <rect x="30" y="20" width="140" height="360" rx="30" fill="#0f0f0f" stroke="#333" strokeWidth="2" />

          {/* Hood */}
          <path className={`car-part ${isDamaged('hood')}`} d="M40,35 Q100,20 160,35 L150,110 L50,110 Z" />
          
          {/* Windshield */}
          <path className={`car-part glass ${isDamaged('windshield')}`} d="M50,110 L150,110 L140,150 L60,150 Z" />

          {/* Roof */}
          <rect className={`car-part ${isDamaged('roof')}`} x="60" y="150" width="80" height="110" />

          {/* Rear Window */}
          <path className={`car-part glass ${isDamaged('rear_window')}`} d="M60,260 L140,260 L145,290 L55,290 Z" />

          {/* Trunk */}
          <path className={`car-part ${isDamaged('trunk')}`} d="M55,290 L145,290 L155,370 Q100,380 45,370 Z" />

          {/* Front Bumper */}
          <path className={`car-part ${isDamaged('front_bumper')}`} d="M35,35 Q100,10 165,35 L160,45 Q100,25 40,45 Z" />

          {/* Rear Bumper */}
          <path className={`car-part ${isDamaged('rear_bumper')}`} d="M40,370 Q100,390 160,370 L165,360 Q100,380 35,360 Z" />

          {/* Left Side */}
          <path className={`car-part ${isDamaged('left_side')}`} d="M30,50 L45,110 L55,290 L40,360 Q25,200 30,50 Z" />

          {/* Right Side */}
          <path className={`car-part ${isDamaged('right_side')}`} d="M170,50 L155,110 L145,290 L160,360 Q175,200 170,50 Z" />
        </svg>
      </div>

      {damagedZones.length === 0 && (
        <div className="no-damage-msg">No external damage mapped</div>
      )}
    </div>
  );
};

export default DamageHeatmap;
