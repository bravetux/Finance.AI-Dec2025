"use client";

import React from 'react';
import { DollarSign, TrendingUp, Calendar, ArrowRight, ArrowDown, LineChart, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SIPPage: React.FC = () => {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-extrabold mb-4 text-primary">Systematic Investment Plan (SIP)</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
        SIP is a method of investing a fixed amount of money regularly (e.g., monthly) into a mutual fund scheme. It is one of the most popular ways for retail investors in India to build wealth over the long term.
      </p>

      {/* --- INFOGRAPHIC SECTION --- */}
      <div className="mb-12 p-6 border rounded-xl bg-secondary/30">
        <h2 className="text-2xl font-bold mb-4 text-center">SIP Explained Visually: Rupee Cost Averaging & Compounding</h2>
        <div className="flex flex-col md:flex-row items-center justify-around text-center space-y-6 md:space-y-0 md:space-x-8">
          
          {/* Step 1: Regular Investment */}
          <div className="flex flex-col items-center">
            <DollarSign className="w-10 h-10 text-green-600 mb-2" />
            <p className="font-semibold">Small, Regular Amount</p>
            <p className="text-sm text-muted-foreground">e.g., ₹5,000 Monthly</p>
          </div>

          {/* Arrow */}
          <div className="flex items-center">
            <ArrowRight className="w-8 h-8 text-gray-500 hidden md:block" />
            <ArrowDown className="w-8 h-8 text-gray-500 md:hidden" />
          </div>

          {/* Step 2: Market Cycles */}
          <div className="flex flex-col items-center">
            <LineChart className="w-10 h-10 text-blue-600 mb-2" />
            <p className="font-semibold">Buys Units in Cycles</p>
            <p className="text-sm text-muted-foreground">More units when NAV is low, fewer when high.</p>
          </div>

          {/* Arrow */}
          <div className="flex items-center">
            <ArrowRight className="w-8 h-8 text-gray-500 hidden md:block" />
            <ArrowDown className="w-8 h-8 text-gray-500 md:hidden" />
          </div>

          {/* Step 3: Long Term Result */}
          <div className="flex flex-col items-center">
            <Zap className="w-10 h-10 text-yellow-600 mb-2" />
            <p className="font-semibold">Power of Compounding</p>
            <p className="text-sm text-muted-foreground">Small investments grow into a large corpus over 10+ years.</p>
          </div>
        </div>
      </div>
      {/* ----------------------------- */}

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center mb-2">
            <TrendingUp className="w-6 h-6 mr-2 text-green-500" />
            Key Benefits of SIP
          </h2>
          <ul className="space-y-3 list-disc list-inside pl-4">
            <li className="text-lg">
              <span className="font-semibold">Rupee Cost Averaging:</span> Reduces the risk of timing the market by buying more units when prices are low and fewer when prices are high.
            </li>
            <li className="text-lg">
              <span className="font-semibold">Discipline:</span> Instills a regular saving and investing habit.
            </li>
            <li className="text-lg">
              <span className="font-semibold">Affordability:</span> Allows investment with small amounts (as low as ₹500).
            </li>
            <li className="text-lg">
              <span className="font-semibold">Power of Compounding:</span> Allows returns to generate further returns over time, maximizing wealth creation.
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center mb-2">
            <Calendar className="w-6 h-6 mr-2 text-blue-500" />
            How SIP Works
          </h2>
          <ol className="space-y-3 list-decimal list-inside pl-4">
            <li className="text-lg">
              <span className="font-semibold">Registration:</span> Choose a mutual fund scheme and register for a SIP with a fixed amount and frequency (monthly/quarterly).
            </li>
            <li className="text-lg">
              <span className="font-semibold">Auto-Debit:</span> The fixed amount is automatically debited from your bank account on the chosen date.
            </li>
            <li className="text-lg">
              <span className="font-semibold">Unit Allocation:</span> Units of the mutual fund are purchased based on the prevailing Net Asset Value (NAV) on the investment date.
            </li>
            <li className="text-lg">
              <span className="font-semibold">Long-Term Growth:</span> This process repeats, leading to accumulation of units and benefiting from market cycles.
            </li>
          </ol>
        </div>
      </div>

      <div className="mt-8 p-6 bg-card rounded-lg shadow-lg border">
        <h3 className="text-xl font-semibold mb-3 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-yellow-600" />
          Who Should Use SIP?
        </h3>
        <p className="text-lg text-muted-foreground">
          SIP is ideal for salaried individuals, young professionals, and anyone looking to start investing in mutual funds without large lump sums, aiming for long-term financial goals like retirement or children's education.
        </p>
        <div className="mt-4 space-x-2">
            <Badge variant="secondary">Beginner Friendly</Badge>
            <Badge variant="secondary">Long Term Goals</Badge>
            <Badge variant="secondary">Disciplined Investing</Badge>
        </div>
      </div>
    </div>
  );
};

export default SIPPage;