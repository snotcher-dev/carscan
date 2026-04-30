import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import UploadZone from '../components/UploadZone';
import ScanAnimation from '../components/ScanAnimation';
import ScoreGauge from '../components/ScoreGauge';
import { analyzeCarImage } from '../services/geminiService';
import { compressImage } from '../utils/imageUtils';
import './Compare.css';

const FREE_LIMIT = 5;
const STORAGE_KEY = 'carscan_uses';
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const Compare = () => {
  const [scanUses, setScanUses] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [retryMsg, setRetryMsg] = useState(null);
  
  const [fileA, setFileA] = useState(null);
  const [previewA, setPreviewA] = useState(null);
  const [fileB, setFileB] = useState(null);
  const [previewB, setPreviewB] = useState(null);

  const [isScanning, setIsScanning] = useState(false);
  const [resultA, setResultA] = useState(null);
  const [resultB, setResultB] = useState(null);
  const [verdict, setVerdict] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      setScanUses(parseInt(saved, 10));
    } else {
      localStorage.setItem(STORAGE_KEY, '0');
    }
  }, []);

  const handleSelectA = (file, url) => { setFileA(file); setPreviewA(url); setErrorMsg(null); setRetryMsg(null); };
  const handleSelectB = (file, url) => { setFileB(file); setPreviewB(url); setErrorMsg(null); setRetryMsg(null); };

  const fetchVerdict = async (jsonA, jsonB) => {
    if (!API_KEY) throw new Error("Gemini API key is configured incorrectly.");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
    
    const prompt = `You are a Moroccan car buying expert. Given these two car inspection reports, give a 2-3 sentence verdict on which car is the better purchase and why. Be direct and specific. Return only plain text, no JSON, no markdown.\n\nReport A: ${JSON.stringify(jsonA)}\n\nReport B: ${JSON.stringify(jsonB)}`;
    
    const payload = {
      contents: [{ parts: [{ text: prompt }] }]
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Verdict API error response:", errText);
      throw new Error(`Verdict API failed with status ${res.status}`);
    }
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Verdict not clear.";
  };

  const handleCompare = async () => {
    if (!fileA || !fileB) return;
    if (scanUses + 2 > FREE_LIMIT) {
      setErrorMsg('Comparing costs 2 scans. Limit reached — contact us for full access.');
      return;
    }

    setIsScanning(true);
    setErrorMsg(null);
    setRetryMsg(null);

    try {
      const b64A = await compressImage(fileA);
      const b64B = await compressImage(fileB);

      const [resA, resB] = await Promise.all([
        analyzeCarImage(b64A, 'image/jpeg', setRetryMsg),
        analyzeCarImage(b64B, 'image/jpeg', setRetryMsg)
      ]);

      const newUses = scanUses + 2;
      setScanUses(newUses);
      localStorage.setItem(STORAGE_KEY, newUses.toString());

      // Pass json straight into expert model
      const verd = await fetchVerdict(resA, resB);

      setResultA(resA);
      setResultB(resB);
      setVerdict(verd);
      window.scrollTo(0, 0);

    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred during comparison. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const resetCompare = () => {
    setResultA(null);
    setResultB(null);
    setVerdict(null);
    setFileA(null);
    setFileB(null);
    setPreviewA(null);
    setPreviewB(null);
    window.scrollTo(0, 0);
  };

  const formatPrice = (price) => {
    return price 
      ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(price).replace(/\u202f/g, ' ') 
      : 'N/A';
  };

  // Pre-calculate winner to apply structural glow classes
  let winner = null; // 'A', 'B', or 'TIE'
  if (resultA && resultB) {
    const scoreA = (resultA.condition_score * 10) - ((resultA.detected_issues?.length || 0) * 5);
    const scoreB = (resultB.condition_score * 10) - ((resultB.detected_issues?.length || 0) * 5);
    if (scoreA > scoreB) winner = 'A';
    else if (scoreB > scoreA) winner = 'B';
    else winner = 'TIE';
  }

  const renderResultColumn = (report, img, label, isWinner) => {
    const validYear = report.year && report.year.toLowerCase() !== 'unknown';
    const isBuy = report.recommendation?.toUpperCase() === 'BUY';

    return (
      <div className={`compare-result-col ${label === 'A' ? 'col-glow-red' : 'col-glow-blue'} ${isWinner === 'WIN' ? 'winner-glow' : ''}`}>
        
        {isWinner === 'WIN' && <div className="crown-badge">👑 BETTER PICK</div>}
        {isWinner === 'TIE' && <div className="crown-badge tied">🤝 EQUAL MATCH</div>}

        <div className="compare-img-wrapper">
          <img src={img} alt={`Car ${label}`} className="compare-img" />
          <div className={`compare-lbl-chip ${label === 'A' ? 'bg-red' : 'bg-blue'}`}>Car {label}</div>
        </div>

        <div className="compare-meta">
          <h2>{report.make} {report.model} {validYear && <span className="compare-year-badge">{report.year}</span>}</h2>
        </div>

        <div className={`compare-rec-badge ${isBuy ? 'buy-bg' : 'avoid-bg'}`}>
          {isBuy ? 'BUY' : 'AVOID'}
        </div>

        <div className="comparison-rows">
          <div className="compare-metric-box">
            <span>Score</span>
            <ScoreGauge score={report.condition_score} />
          </div>
          <div className="compare-metric-box">
            <span>Market Price</span>
            <div className="c-price-val">{formatPrice(report.estimated_price_mad)}</div>
          </div>
          <div className="compare-metric-box">
            <span>Issues Count</span>
            <div className="c-issues-val">{report.detected_issues?.length || 0}</div>
          </div>
        </div>
      </div>
    );
  };

  const limitReached = scanUses + 2 > FREE_LIMIT;
  const isUploadStep = (!resultA || !resultB);

  return (
    <div className="compare-page">
      <Navbar />
      {isScanning && <ScanAnimation imageUrl={previewA} text="ANALYZING BOTH CARS" />}

      <main className="compare-content">
        
        {isUploadStep ? (
          <div className="compare-upload-sequence animate-in">
            <h1 className="compare-page-title">Compare Vehicles</h1>
            <p className="compare-page-subtitle">Upload two cars simultaneously to see which one stands out.</p>
            
            <div className="compare-grid">
              <div className="compare-upload-col glow-red">
                <div className="col-header bg-red">Car A</div>
                <UploadZone onFileSelect={handleSelectA} />
              </div>

              <div className="compare-upload-col glow-blue">
                <div className="col-header bg-blue">Car B</div>
                <UploadZone onFileSelect={handleSelectB} />
              </div>
            </div>

            <div className="compare-action-area">
              {retryMsg && <div className="c-error-message" style={{backgroundColor: 'rgba(255, 152, 0, 0.1)', color: '#ff9800', borderColor: 'rgba(255, 152, 0, 0.3)'}}>{retryMsg}</div>}
              {errorMsg && <div className="c-error-message">{errorMsg}</div>}
              
              <button 
                className={`compare-massive-btn ${(!fileA || !fileB || limitReached) ? 'disabled' : ''}`}
                onClick={handleCompare}
                disabled={!fileA || !fileB || limitReached || isScanning}
              >
                <div className="shimmer-effect"></div>
                <span>COMPARE BOTH CARS</span>
              </button>
              
              <div className="c-demo-counter">
                {scanUses} / {FREE_LIMIT} scans used (Cost: 2 units)
              </div>
            </div>
          </div>
        ) : (
          <div className="compare-results-sequence animate-in">
             <div className="c-results-grid">
               {renderResultColumn(resultA, previewA, 'A', winner === 'A' ? 'WIN' : winner === 'TIE' ? 'TIE' : 'LOSE')}
               {renderResultColumn(resultB, previewB, 'B', winner === 'B' ? 'WIN' : winner === 'TIE' ? 'TIE' : 'LOSE')}
             </div>

             {verdict && (
               <div className="ai-verdict-card animate-in-delayed">
                 <div className="verdict-icon">🧠</div>
                 <h3>AI VERDICT</h3>
                 <p>{verdict}</p>
               </div>
             )}

             <div className="exterior-warning bottom-warn animate-in-delayed">
                <h3 className="warning-title">⚠️ EXTERIOR ANALYSIS ONLY</h3>
                <p>
                  This report is based on visible exterior condition only. 
                  The following require physical inspection before purchase:
                  <br/>
                  <strong>Engine condition · Interior wear · Transmission · Electrical systems · Odometer accuracy</strong>
                </p>
             </div>

             <div className="reset-action animate-in-delayed">
                <button className="reset-compare-btn" onClick={resetCompare}>Start Over</button>
             </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Compare;
