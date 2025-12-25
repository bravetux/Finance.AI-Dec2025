"use client";

import React from 'react';
import { Wallet, Repeat, Shield, ArrowRight, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SWPPage: React.FC = () => {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-extrabold mb-4 text-primary">Systematic Withdrawal Plan (SWP)</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
        SWP allows investors to withdraw a fixed amount of money at regular intervals (monthly, quarterly, etc.) from their mutual fund investments. It is primarily used during the distribution or retirement phase.
      </p>

      {/* --- INFOGRAPHIC SECTION --- */}
      <div className="mb-12 p-6 border rounded-xl bg-secondary/30">
        <h2 className="text-2xl font-bold mb-4 text-center">SWP Explained Visually: Income Generation from Corpus</h2>
        <div className="flex flex-col md:flex-row items-center justify-around text-center space-y-8 md:space-y-0 md:space-x-16">
          
          {/* Step 1: Initial Corpus */}
          <div className="flex flex-col items-center">
            <Wallet className="w-10 h-10 text-indigo-600 mb-2" />
            <p className="font-semibold">Large Initial Corpus</p>
            <p className="text-sm text-muted-foreground">Invested in Mutual Funds</p>
          </div>

          {/* Arrow 1: Withdrawal */}
          <div className="flex flex-col items-center relative">
            <Repeat className="w-10 h-10 text-red-600 mb-2" />
            <p className="font-semibold">Fixed Periodic Withdrawal</p>
            <p className="text-sm text-muted-foreground">Units are redeemed regularly.</p>
            
            {/* Visualizing income flow - Updated font size and arrow size to match others */}
            <div className="absolute top-full mt-4 md:mt-0 md:top-1/2 md:left-full md:ml-4 flex items-center justify-center md:justify-start w-full md:w-max">
                <span className="font-semibold text-red-600">Income Stream</span>
                {/* Arrow size changed to w-8 h-8 to match other connecting arrows */}
                <ArrowDown className="w-8 h-8 text-red-500 md:hidden ml-5" />
                <ArrowRight className="w-8 h-8 text-red-500 hidden md:block ml-5" />
            </div>
          </div>

          {/* Spacer for mobile layout */}
          <div className="h-16 md:hidden"></div> 

          {/* Arrow 2: Growth */}
          <div className="flex items-center hidden md:block">
            <ArrowRight className="w-8 h-8 text-gray-500" />
          </div>
          <div className="flex items-center md:hidden">
            <ArrowDown className="w-8 h-8 text-gray-500" />
          </div>

          {/* Step 3: Remaining Growth */}
          <div className="flex flex-col items-center">
            <Shield className="w-10 h-10 text-green-600 mb-2" />
            <p className="font-semibold">Remaining Corpus Grows</p>
            <p className="text-sm text-muted-foreground">Capital preservation and potential growth.</p>
          </div>
        </div>
      </div>
      {/* ----------------------------- */}

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center mb-2">
            <Wallet className="w-6 h-6 mr-2 text-purple-500" />
            Key Benefits of SWP
          </h2>
          <ul className="space-y-3 list-disc list-inside pl-4">
            <li className="text-lg">
              <span className="font-semibold">Regular Income Stream:</span> Provides predictable cash flow, essential for retirees or those needing periodic income.
            </li>
            <li className="text-lg">
              <span className="font-semibold">Capital Preservation:</span> Only a portion of the investment is withdrawn, allowing the remaining corpus to continue growing.
            </li>
            <li className="text-lg">
              <span className="font-semibold">Tax Efficiency:</span> Withdrawals are often treated favorably for tax purposes compared to traditional fixed income sources (especially after 1 year in equity funds).
            </li>
            <li className="text-lg">
              <span className="font-semibold">Flexibility:</span> Investors can choose the withdrawal amount and frequency, and stop the plan anytime.
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center mb-2">
            <Repeat className="w-6 h-6 mr-2 text-red-500" />
            How SWP Works
          </h2>
          <ol className="space-y-3 list-decimal list-inside pl-4">
            <li className="text-lg">
              <span className="font-semibold">Lump Sum Investment:</span> The investor first invests a lump sum amount into a mutual fund scheme.
            </li>
            <li className="text-lg">
              <span className="font-semibold">Setup Withdrawal:</span> The investor instructs the AMC to redeem a fixed number of units or a fixed amount periodically.
            </li>
            <li className="text-lg">
              <span className="font-semibold">Unit Redemption:</span> On the specified date, the required number of units are redeemed at the prevailing NAV.
            </li>
            <li className="text-lg">
              <span className="font-semibold">Credit to Account:</span> The corresponding amount is credited to the investor's bank account.
            </li>
          </ol>
        </div>
      </div>

      <div className="mt-8 p-6 bg-card rounded-lg shadow-lg border">
        <h3 className="text-xl font-semibold mb-3 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-indigo-600" />
          Who Should Use SWP?
        </h3>
        <p className="text-lg text-muted-foreground">
          SWP is highly beneficial for retired individuals who need a steady income stream from their accumulated corpus while ensuring the remaining capital continues to grow, or for anyone needing periodic cash flow from their investments.
        </p>
        <div className="mt-4 space-x-2">
            <Badge variant="secondary">Retirement Planning</Badge>
            <Badge variant="secondary">Income Generation</Badge>
            <Badge variant="secondary">Post-Accumulation Phase</Badge>
        </div>
      </div>
    </div>
  );
};

export default SWPPage;