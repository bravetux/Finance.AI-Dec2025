"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import IndexPage from './pages/Index';

// Placeholder components for other routes
const ToolsPage = () => <div className="container py-20 text-center"><h1>Investment Tools</h1><p>Coming Soon...</p></div>;
const StrategiesPage = () => <div className="container py-20 text-center"><h1>Strategies</h1><p>Coming Soon...</p></div>;
const RiskPage = () => <div className="container py-20 text-center"><h1>Risk Management</h1><p>Coming Soon...</p></div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/strategies" element={<StrategiesPage />} />
            <Route path="/risk" element={<RiskPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;