import React, { useState, useRef, useEffect } from 'react';
import './UploadZone.css';

const UploadZone = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processFiles = (filesList) => {
    if (!filesList || filesList.length === 0) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const newFiles = Array.from(filesList).filter(f => validTypes.includes(f.type));
    
    if (newFiles.length !== filesList.length) {
      alert('Some files were ignored. Please upload only JPG, PNG, or WEBP images.');
    }

    // Limit to 6 photos max
    const combinedFiles = [...selectedFiles, ...newFiles].slice(0, 6);
    
    const urls = combinedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    setSelectedFiles(combinedFiles);
    
    if (onFileSelect) {
      onFileSelect(combinedFiles, urls);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e) => {
    processFiles(e.target.files);
  };

  const handleClick = () => {
    if (selectedFiles.length < 6) {
      fileInputRef.current.click();
    }
  };

  const removeFile = (e, index) => {
    e.stopPropagation();
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    const newUrls = [...previewUrls];
    newUrls.splice(index, 1);
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
    if (onFileSelect) {
      onFileSelect(newFiles, newUrls);
    }
  };

  return (
    <div 
      className={`upload-zone ${isDragging ? 'dragging' : ''} ${previewUrls.length > 0 ? 'has-image' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input 
        type="file" 
        multiple
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/jpeg, image/png, image/webp" 
        className="upload-input" 
      />
      
      {previewUrls.length > 0 ? (
        <div className="upload-gallery">
          {previewUrls.map((url, idx) => (
            <div key={idx} className="gallery-item">
              <img src={url} alt={`Car view ${idx + 1}`} className="gallery-img" />
              <button className="remove-img-btn" onClick={(e) => removeFile(e, idx)}>×</button>
            </div>
          ))}
          {previewUrls.length < 6 && (
            <div className="add-more-placeholder">
              <span>+ Add More</span>
              <small>({previewUrls.length}/6)</small>
            </div>
          )}
        </div>
      ) : (
        <div className="upload-placeholder">
          {/* Car Icon SVG */}
          <svg className="upload-icon" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H9.3a2 2 0 0 0-1.6.8L5 11l-5.16.86a1 1 0 0 0-.84.99V16h3" />
            <circle cx="6.5" cy="16.5" r="2.5" />
            <circle cx="16.5" cy="16.5" r="2.5" />
          </svg>
          <h3>Upload up to 6 photos</h3>
          <p>Front, back, sides, and interior</p>
          <span className="upload-formats">Supported: JPG, PNG, WEBP</span>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
