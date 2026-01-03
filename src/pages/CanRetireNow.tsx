"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet } from "lucide-react";

const CanRetireNow: React.FC = () => {
  const [corpus, setCorpus] = useState(50000000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(100000);
  const [swr, setSwr] = useState(4); // Safe Withdrawal Rate

  useEffect(() => {
    localStorage.setItem('canRetireNowData', JSON.stringify({ corpus, monthlyExpenses, swr }));
  }, [corpus, monthlyExpenses, swr]);

  const annualExpenses = monthlyExpenses * 12;
  const sustainableWithdrawal = (corpus * swr) / 100;
  const isEnough = sustainableWithdrawal >= annualExpenses;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Can You Retire Now?</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" /> Retirement Readiness Check
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Current Total Corpus</Label>
              <Input type="number" value={corpus} onChange={(e) => setCorpus(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Monthly Expenses</Label>
              <Input type="number" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Safe Withdrawal Rate (%)</Label>
              <Input type="number" value={swr} onChange={(e) => setSwr(Number(e.target.value))} />
            </div>
          </div>
          <div className={`mt-6 p-6 rounded-lg border-2 ${isEnough ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'}`}>
            <h3 className="text-xl font-bold mb-2">{isEnough ? "Yes, You're Set!" : "Not Quite Yet"}</h3>
            <p className="text-sm">
              Your corpus can sustainably provide ₹{Math.round(sustainableWithdrawal/12).toLocaleString("en-IN")} per month.
              Your current need is ₹{monthlyExpenses.toLocaleString("en-IN")} per month.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CanRetireNow;