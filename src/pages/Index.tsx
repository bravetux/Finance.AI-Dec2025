"use client";

import React from 'react';
import { Wallet, Sun, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-6 h-6" />
            <span className="text-xl font-bold tracking-tight">Financial Planner</span>
          </div>
          
          <div className="flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <div className="flex items-center gap-4">
              <a href="#tax-planning" className="hover:text-slate-900 transition-colors">Tax Planning</a>
              <a 
                href="https://emerald-owl-zoom.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-slate-900 hover:bg-slate-200 transition-colors"
              >
                FinSmart <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Sun className="w-5 h-5 text-slate-600" />
            </button>
            <Button className="bg-[#111827] text-white hover:bg-slate-800 rounded-md px-6">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-32">
        <div className="max-w-4xl text-center">
          <h1 className="text-[64px] font-extrabold text-[#111827] leading-[1.1] mb-8 tracking-tight">
            Take Control of Your Financial Future
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed max-w-3xl mx-auto">
            An all-in-one, open-source financial planner to track your net worth, manage 
            cashflow, set goals, and plan for retirement. All your data stays on your device.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center border-t">
        <div className="flex flex-col gap-4">
          <div className="text-slate-500 text-sm">
            Designed by <a href="#" className="underline text-slate-600 hover:text-slate-900">Bravetux</a>. 
            The Website Source Code is Published in <a href="#" className="underline text-slate-600 hover:text-slate-900">Github</a>.
          </div>
          <div className="flex justify-center gap-6 text-sm">
            <Link to="/ai-rules" className="text-slate-500 hover:text-slate-900 transition-colors">AI Rules</Link>
            <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;