"use client";

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import MoneyMindsPage from './pages/MoneyMindsPage';
import SIPPage from './fedu/SIPPage';
import STPPage from './fedu/STPPage';
import SWPPage from './fedu/SWPPage';
import BondsPage from './fedu/BondsPage';
import EducationHeader from './fedu/EducationHeader';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <EducationHeader />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/finance-education" element={<MoneyMindsPage />} />
        <Route path="/finance-education/sip" element={<SIPPage />} />
        <Route path="/finance-education/stp" element={<STPPage />} />
        <Route path="/finance-education/swp" element={<SWPPage />} />
        <Route path="/finance-education/bonds" element={<BondsPage />} />
        {/* Add other routes as needed */}
      </Routes>
    </div>
  );
}

export default App;