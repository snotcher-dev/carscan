import React from 'react';
import ScoreGauge from './ScoreGauge';
import DamageHeatmap from './DamageHeatmap';
import './ReportCard.css';

const ReportCard = ({ report }) => {
  if (!report) return null;

  const {
    estimated_price_mad,
    condition_score,
    detected_issues,
    damaged_zones,
    recommendation,
    summary
  } = report;

  const isBuy = recommendation?.toUpperCase() === 'BUY';
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'MAD', 
      maximumFractionDigits: 0 
    }).format(price).replace(/\u202f/g, ' '); // use spaces
  };

  return (
    <div className="report-card">
      <div className={`recommendation-badge ${isBuy ? 'badge-buy' : 'badge-avoid'}`}>
        {isBuy ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        )}
        <span>{isBuy ? 'BUY' : 'AVOID'}</span>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">CONDITION SCORE</div>
          <ScoreGauge score={condition_score} />
        </div>
        
        <div className="stat-card">
          <div className="stat-label">ESTIMATED PRICE</div>
          <div className="price-value">{estimated_price_mad ? formatPrice(estimated_price_mad) : 'N/A'}</div>
        </div>
      </div>

      <div className="summary-card">
        <h3 className="section-title">INSPECTION SUMMARY</h3>
        <p>{summary}</p>
      </div>

      <div className="issues-heatmap-row">
        <div className="issues-container">
          <h3 className="section-title">DETECTED ISSUES</h3>
          {detected_issues && detected_issues.length > 0 ? (
            <div className="issues-list">
              {detected_issues.map((issue, index) => (
                <span 
                  key={index} 
                  className="issue-chip"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {issue}
                </span>
              ))}
            </div>
          ) : (
            <p className="no-issues">No significant issues detected.</p>
          )}
        </div>
        
        <div className="heatmap-container">
          <DamageHeatmap damagedZones={damaged_zones || []} />
        </div>
      </div>

      <div className="exterior-warning">
        <h3 className="warning-title">⚠️ EXTERIOR ANALYSIS ONLY</h3>
        <p>
          This report is based on visible exterior condition only. 
          The following require physical inspection before purchase:
          <br/>
          <strong>Engine condition · Interior wear · Transmission · Electrical systems · Odometer accuracy</strong>
        </p>
      </div>
    </div>
  );
};

export default ReportCard;
