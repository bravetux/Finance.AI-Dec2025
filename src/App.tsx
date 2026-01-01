"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IndexPage from './pages/Index';
import SWPPage from './pages/SWPPage';
import BondsPage from './pages/BondsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <main>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/swp" element={<SWPPage />} />
            <Route path="/bonds" element={<BondsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;