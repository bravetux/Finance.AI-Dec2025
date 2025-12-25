"use client";

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EducationHeader from './fedu/EducationHeader';
import Index from './pages/Index';
import MoneyMindsPage from './pages/MoneyMindsPage';

// We wrap the entire application in BrowserRouter in index.tsx/main.tsx
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <EducationHeader />
      <Routes>
        <Route path="/" element={<Index />} />
        {/* Both / and /finance-education now point to the combined landing page */}
        <Route path="/finance-education" element={<Index />} /> 
        
        {/* Nested routes for Money Minds content */}
        <Route path="/money-minds/*" element={<MoneyMindsPage />} />
        
        {/* Placeholder routes for other header links */}
        <Route path="/features" element={<div className="container py-12">Features Page</div>} />
        <Route path="/dashboard" element={<div className="container py-12">Dashboard Page</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;