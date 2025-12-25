"use client";

import React from 'react';
import { ArrowRightLeft, Zap, Target, Banknote, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const STPPage: React.FC = () => {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-extrabold mb-4 text-primary">Systematic Transfer Plan (STP)</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
        STP is a strategy where an investor transfers a fixed amount of money periodically from one mutual fund scheme (usually a debt or liquid fund) to another (usually an equity fund) within the same fund house.
      </p>

      {/* --- INFOGRAPHIC SECTION --- */}
      <div className="mb-12 p-6 border rounded-xl bg-secondary/30">
        <h2 className="text-2xl font-bold mb-4 text-center">STP Explained Visually: Gradual Market Entry</h2>
        <div className="flex flex-col md:flex-row items-center justify-around text-center space-y-6 md:space-y-0 md:space-x-8">
          
          {/* Step 1: Source Fund */}
          <div className="flex flex-col items-center p-4 border-2 border-orange-500 rounded-lg bg-orange-100/50 dark:bg-orange-900/30">
            <Banknote className="w-10 h-10 text-orange-600 mb-2" />
            <p className="font-semibold">Source Fund (Liquid/Debt)</p>
            <p className="text-sm text-muted-foreground">Lump sum parked here (Low Risk)</p>
          </div>

          {/* Transfer Arrow */}
          <div className="flex flex-col items-center">
            <ArrowRightLeft className="w-10 h-10 text-cyan-500 animate-pulse" />
            <p className="text-sm font-medium text-cyan-600 mt-1">Periodic Transfer</p>
          </div>

          {/* Step 3: Target Fund */}
          <div className="flex flex-col items-center p-4 border-2 border-green-500 rounded-lg bg-green-100/50 dark:bg-green-900/30">
            <TrendingUp className="w-10 h-10 text-green-600 mb-2" />
            <p className="font-semibold">Target Fund (Equity)</p>
            <p className="text-sm text-muted-foreground">Gradual investment (High Growth)</p>
          </div>
        </div>
      </div>
      {/* ----------------------------- */}

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center mb-2">
            <ArrowRightLeft className="w-6 h-6 mr-2 text-orange-500" />
            Key Benefits of STP
          </h2>
          <ul className="space-y-3 list-disc list-inside pl-4">
            <li className="text-lg">
              <span className="font-semibold">Risk Mitigation:</span> Allows large lump sums to enter the volatile equity market gradually, mitigating timing risk (similar to SIP).
            </li>
            <li className="text-lg">
              <span className="font-semibold">Higher Returns on Idle Cash:</span> The lump sum remains invested in a safer debt/liquid fund, earning better returns than a savings account while awaiting transfer.
            </li>
            <li className="text-lg">
              <span className="font-semibold">Rebalancing:</span> Can be used to systematically shift profits from equity to debt (or vice versa) to maintain asset allocation.
            </li>
            <li className="text-lg">
              <span className="font-semibold">Flexibility:</span> Transfers can be fixed amount or capital appreciation (transferring only the gains).
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center mb-2">
            <Zap className="w-6 h-6 mr-2 text-cyan-500" />
            How STP Works
          </h2>
          <ol className="space-y-3 list-decimal list-inside pl-4">
            <li className="text-lg">
              <span className="font-semibold">Source Fund:</span> Investor places a lump sum into a low-risk scheme (e.g., Liquid Fund).
            </li>
            <li className="text-lg">
              <span className="font-semibold">Target Fund:</span> Investor selects a higher-risk scheme (e.g., Equity Fund) for the eventual investment.
            </li>
            <li className="text-lg">
              <span className="font-semibold">Periodic Transfer:</span> On specified dates, units are redeemed from the Source Fund and the proceeds are used to purchase units in the Target Fund.
            </li>
            <li className="text-lg">
              <span className="font-semibold">Averaging:</span> This systematic transfer ensures rupee cost averaging into the Target Fund.
            </li>
          </ol>
        </div>
      </div>

      <div className="mt-8 p-6 bg-card rounded-lg shadow-lg border">
        <h3 className="text-xl font-semibold mb-3 flex items-center">
          <Target className="w-5 h-5 mr-2 text-green-600" />
          Who Should Use STP?
        </h3>
        <p className="text-lg text-muted-foreground">
          STP is ideal for investors who receive a large lump sum (like a bonus or maturity proceeds) and want to invest it in equity markets without exposing the entire amount to market volatility immediately.
        </p>
        <div className="mt-4 space-x-2">
            <Badge variant="secondary">Lump Sum Investment</Badge>
            <Badge variant="secondary">Risk Averse Entry</Badge>
            <Badge variant="secondary">Asset Allocation</Badge>
        </div>
      </div>
    </div>
  );
};

export default STPPage;