"use client";

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FinanceSidebar from '@/components/FinanceSidebar';
import SIPPage from './SIPPage';
import SWPPage from './SWPPage';
import STPPage from './STPPage';

// Placeholder components for other sections
const PlaceholderContent: React.FC<{ title: string }> = ({ title }) => (
  <div className="p-8">
    <h2 className="text-3xl font-bold mb-4">{title}</h2>
    <p className="text-lg text-muted-foreground">Content coming soon for {title}.</p>
  </div>
);

const MoneyMindsPage: React.FC = () => {
  return (
    <div className="container flex min-h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
      <aside className="w-64 border-r pt-8 hidden lg:block">
        <FinanceSidebar />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          <Route path="sip" element={<SIPPage />} />
          <Route path="swp" element={<SWPPage />} />
          <Route path="stp" element={<STPPage />} />
          
          {/* Default/Placeholder Routes */}
          <Route path="mutual-funds" element={<PlaceholderContent title="Mutual Funds Overview" />} />
          <Route path="bonds" element={<PlaceholderContent title="Bonds & Fixed Income" />} />
          <Route path="equity" element={<PlaceholderContent title="Equity & Stocks" />} />
          <Route path="gold" element={<PlaceholderContent title="Gold & Commodities" />} />
          <Route path="pms" element={<PlaceholderContent title="PMS" />} />
          <Route path="sif" element={<PlaceholderContent title="SIF" />} />
          <Route path="aif" element={<PlaceholderContent title="AIF" />} />
          <Route path="/" element={<PlaceholderContent title="Welcome to Money Minds Education" />} />
        </Routes>
      </main>
    </div>
  );
};

export default MoneyMindsPage;