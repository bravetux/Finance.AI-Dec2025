"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import AiRules from './pages/AiRules';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/ai-rules" element={<AiRules />} />
      </Routes>
    </Router>
  );
}

export default App;