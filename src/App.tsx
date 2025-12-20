"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import SIPCalculator from './pages/SIPCalculator';
import SWPCalculatorPage from './pages/SWPCalculator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/sip" element={<SIPCalculator />} />
        <Route path="/swp" element={<SWPCalculatorPage />} />
      </Routes>
    </Router>
  );
}

export default App;