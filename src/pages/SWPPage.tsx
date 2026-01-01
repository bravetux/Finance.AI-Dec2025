"use client";

import React from 'react';
import { Wallet, Repeat, Shield, ArrowRight, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SWPPage: React.FC = () => {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-extrabold mb-4 text-primary">Systematic Withdrawal Plan (SWP)</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
        SWP allows investors to withdraw a fixed amount of money at regular intervals from their mutual fund investments.
      </p>

      <div className="mb-12 p-6 border rounded-xl bg-secondary/30">
        <h2 className="text-2xl font-bold mb-4 text-center">SWP Explained Visually</h2>
        <div className="flex flex-col md:flex-row items-center justify-around text-center space-y-8 md:space-y-0">
          <div className="flex flex-col items-center">
            <Wallet className="w-10 h-10 text-indigo-600 mb-2" />
            <p className="font-semibold">Initial Corpus</p>
          </div>
          <ArrowRight className="w-8 h-8 text-gray-400 hidden md:block" />
          <div className="flex flex-col items-center">
            <Repeat className="w-10 h-10 text-red-600 mb-2" />
            <p className="font-semibold">Periodic Withdrawal</p>
          </div>
          <div className="flex flex-col md:flex-row items-center">
            <span className="font-semibold text-red-600 whitespace-nowrap">Income Stream</span>
            <ArrowRight className="w-8 h-8 text-gray-500 hidden md:block ml-[30px]" />
          </div>
          <div className="flex flex-col items-center">
            <Shield className="w-10 h-10 text-green-600 mb-2" />
            <p className="font-semibold">Remaining Growth</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SWPPage;