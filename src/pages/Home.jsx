import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import UploadZone from '../components/UploadZone';
import ScanAnimation from '../components/ScanAnimation';
import { analyzeCarImage } from '../services/geminiService';
import { compressImage } from '../utils/imageUtils';
import { saveScanToHistory } from '../utils/historyManager';
import './Home.css';

const FREE_LIMIT = 5;
const STORAGE_KEY = 'carscan_uses';

const Home = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [retryMsg, setRetryMsg] = useState(null);
  const [scanUses, setScanUses] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      setScanUses(parseInt(saved, 10));
    } else {
      localStorage.setItem(STORAGE_KEY, '0');
    }
  }, []);

  const handleFileSelect = (files, urls) => {
    setErrorMsg(null);
    setRetryMsg(null);
    setSelectedFiles(files);
    setPreviewUrls(urls);
  };

  const handleScanClick = async () => {
    if (selectedFiles.length === 0) return;
    
    if (scanUses >= FREE_LIMIT) {
      setErrorMsg('Demo limit reached - contact us for full access');
      return;
    }

    setIsScanning(true);
    setErrorMsg(null);
    setRetryMsg(null);

    try {
      const compressedImages = await Promise.all(
        selectedFiles.map(file => compressImage(file))
      );
      const result = await analyzeCarImage(compressedImages, 'image/jpeg', setRetryMsg);
      
      saveScanToHistory(result, compressedImages[0]);
      
      const newCount = scanUses + 1;
      setScanUses(newCount);
      localStorage.setItem(STORAGE_KEY, newCount.toString());

      navigate('/result', { state: { report: result, imageUrl: previewUrls[0] } });
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred during scanning. Please try again.');
      setIsScanning(false);
    }
  };

  const limitReached = scanUses >= FREE_LIMIT;

  return (
    <div className="home-page">
      <Navbar />
      
      {isScanning && <ScanAnimation imageUrl={previewUrls[0]} />}
      
      <main className="main-content">
        <section className="hero-section">
          <h1 className="hero-title">AI-Powered Car Inspection</h1>
          <p className="hero-subtitle">Upload any car photo and get an instant professional analysis</p>
        </section>

        <section className="upload-container">
          <UploadZone onFileSelect={handleFileSelect} />
          
          <div className="action-area">
            {retryMsg && <div className="error-message" style={{backgroundColor: 'rgba(255, 152, 0, 0.1)', color: '#ff9800', borderColor: 'rgba(255, 152, 0, 0.3)'}}>{retryMsg}</div>}
            {errorMsg && <div className="error-message">{errorMsg}</div>}
            
            <button 
              className={`scan-button ${selectedFiles.length === 0 || limitReached ? 'disabled' : ''}`}
              onClick={handleScanClick}
              disabled={selectedFiles.length === 0 || limitReached || isScanning}
            >
              <div className="shimmer-effect"></div>
              <span>Scan This Car</span>
            </button>
            <div className="demo-counter">
              {scanUses} / {FREE_LIMIT} free scans used
            </div>
            {limitReached && (
              <div className="limit-message">
                Demo limit reached — contact us for full access.
              </div>
            )}
          </div>
        </section>

        <section className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step-item">
              <div className="step-circle">1</div>
              <h3>Upload Photo</h3>
              <p>Drag, drop, or select a photo of the car from your device.</p>
            </div>
            <div className="step-item">
              <div className="step-circle">2</div>
              <h3>AI Analyzes</h3>
              <p>Our fine-tuned AI acts as an expert car inspector.</p>
            </div>
            <div className="step-item">
              <div className="step-circle">3</div>
              <h3>Get Report</h3>
              <p>Receive a detailed condition, issues, and market value.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        CarScan.ma — Powered by Gemini AI
      </footer>
    </div>
  );
};

export default Home;
