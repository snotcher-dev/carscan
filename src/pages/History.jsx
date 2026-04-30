import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getScanHistory, clearScanHistory } from '../utils/historyManager';
import './History.css';

const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getScanHistory());
    window.scrollTo(0, 0);
  }, []);

  const handleCardClick = (scan) => {
    navigate('/result', { state: { report: scan.report, imageUrl: scan.imageUrl } });
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear your scan history?")) {
      clearScanHistory();
      setHistory([]);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="history-page">
      <Navbar />
      
      <main className="history-content">
        <div className="history-header">
          <h1 className="history-title">My Scans</h1>
          {history.length > 0 && (
            <button className="clear-history-btn" onClick={handleClear}>Clear History</button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="empty-history">
            <div className="empty-icon">📁</div>
            <h2>No scans yet</h2>
            <p>Your recent car inspections will appear here.</p>
            <button className="start-scan-btn" onClick={() => navigate('/')}>Start a Scan</button>
          </div>
        ) : (
          <div className="history-grid">
            {history.map((scan) => {
              const { make, model, year, condition_score } = scan.report;
              return (
                <div key={scan.id} className="history-card animate-in" onClick={() => handleCardClick(scan)}>
                  <div className="history-card-img-wrapper">
                    <img src={scan.imageUrl} alt={`${make} ${model}`} className="history-card-img" />
                    <div className="history-card-score">{condition_score}/10</div>
                  </div>
                  <div className="history-card-info">
                    <h3>{make} {model} {year !== 'unknown' ? year : ''}</h3>
                    <p className="history-date">{formatDate(scan.date)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
