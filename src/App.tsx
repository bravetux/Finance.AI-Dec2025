"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import FinanceEducation from './pages/FinanceEducation';
import SIPPage from './fedu/SIPPage';
import SWPPage from './fedu/SWPPage';
import STPPage from './fedu/STPPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/finance-education" element={<FinanceEducation />} />
        <Route path="/finance-education/sip" element={<SIPPage />} />
        <Route path="/finance-education/swp" element={<SWPPage />} />
        <Route path="/finance-education/stp" element={<STPPage />} />
        {/* Placeholder routes for header links */}
        <Route path="/features" element={<div className="p-8">Features Page Placeholder</div>} />
        <Route path="/dashboard" element={<div className="p-8">Dashboard Page Placeholder</div>} />
      </Routes>
    </Router>
  );
}

export default App;