import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Navbar from '../components/Navbar';
import ReportCard from '../components/ReportCard';
import PdfReport from '../components/PdfReport';
import './Result.css';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); // start at top
  }, []);

  if (!location.state || !location.state.report) {
    setTimeout(() => navigate('/'), 0);
    return null;
  }

  const { report, imageUrl } = location.state;

  const validYear = report.year && report.year.toLowerCase() !== 'unknown';

  return (
    <div className="result-page">
      <Navbar />
      
      <div className="hero-car-section">
        <div className="hero-car-image-container">
          <img src={imageUrl} alt="Car" className="hero-car-image" />
          <div className="hero-gradient-overlay"></div>
        </div>
        
        <div className="hero-car-info">
          <h1 className="hero-car-name">
            {report.make} {report.model}
            {validYear && <span className="hero-year-badge">{report.year}</span>}
          </h1>
        </div>
      </div>

      <main className="result-content">
        <div className="report-container">
          <ReportCard report={report} />
        </div>

        <div className="action-footer">
          <button className="scan-another-btn" onClick={() => navigate('/')}>
            SCAN ANOTHER CAR
          </button>
          <PDFDownloadLink 
            document={<PdfReport report={report} imageUrl={imageUrl} />} 
            fileName={`CarScan-${report.make}-${report.model}.pdf`}
            className="download-pdf-btn"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {({ blob, url, loading, error }) =>
              loading ? 'GENERATING...' : 'DOWNLOAD PDF'
            }
          </PDFDownloadLink>
        </div>
      </main>

      <footer className="footer">
        CarScan.ma — Powered by Gemini AI
      </footer>
    </div>
  );
};

export default Result;
