import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Result from './pages/Result';
import Compare from './pages/Compare';
import History from './pages/History';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </div>
  );
}

export default App;
