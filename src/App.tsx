"use client";

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import SIPPage from './fedu/SIPPage';
import STPPage from './fedu/STPPage';
import SWPPage from './fedu/SWPPage';
import BondsPage from './pages/BondsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/finance-education/sip" element={<SIPPage />} />
      <Route path="/finance-education/stp" element={<STPPage />} />
      <Route path="/finance-education/swp" element={<SWPPage />} />
      <Route path="/money-minds/bonds" element={<BondsPage />} />
    </Routes>
  );
}

export default App;