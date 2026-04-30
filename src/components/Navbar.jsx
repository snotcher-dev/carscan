import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          CarScan<span className="navbar-logo-accent">.ma</span>
          <span className="live-dot"></span>
        </Link>
        <div className="navbar-actions">
          <Link to="/history" className="nav-compare-btn">
            My Scans
          </Link>
          <Link to="/compare" className="nav-compare-btn">
            Compare Cars
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
