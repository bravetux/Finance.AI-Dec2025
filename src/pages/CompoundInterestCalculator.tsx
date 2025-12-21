"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCcw, Calculator, TrendingUp } from "lucide-react";

type Frequency = "12" | "4" | "2" | "1";
type StepUpType = "amount" | "percent";

const CompoundInterestCalculator: React.FC = () => {
  // Advanced Inputs
  const [principal, setPrincipal] = useState<string>("100000");
  const [deposit, setDeposit] = useState<string>("5000");
  const [depositFreq, setDepositFreq] = useState<Frequency>("12");
  const [holdingPeriod, setHoldingPeriod] = useState<string>("10"); // Years
  const [depositPeriod, setDepositPeriod] = useState<string>("10"); // Years
  const [stepUpValue, setStepUpValue] = useState<string>("0");
  const [stepUpType, setStepUpType] = useState<StepUpType>("amount");
  const [interestRate, setInterestRate] = useState<string>("10");
  const [interestFreq, setInterestFreq] = useState<Frequency>("1"); // Annually/Monthly etc
  const [inflationRate, setInflationRate] = useState<string>("6");
  const [compounding, setCompounding] = useState<Frequency>("12");
  
  const [results, setResults] = useState<{
    totalInvested: number;
    totalInterest: number;
    finalNominal: number;
    finalReal: number;
  } | null>(null);

  const handleReset = () => {
    setPrincipal("");
    setDeposit("");
    setHoldingPeriod("");
    setDepositPeriod("");
    setStepUpValue("0");
    setInterestRate("");
    setInflationRate("0");
    setResults(null);
  };

  const handleCalculate = () => {
    const P = parseFloat(principal) || 0;
    const initialD = parseFloat(deposit) || 0;
    const dFreq = parseInt(depositFreq);
    const holdY = parseFloat(holdingPeriod) || 0;
    const depY = parseFloat(depositPeriod) || 0;
    const stepVal = parseFloat(stepUpValue) || 0;
    const annualR = (parseFloat(interestRate) || 0) / 100;
    const annualInf = (parseFloat(inflationRate) || 0) / 100;
    const compoundFreq = parseInt(compounding);

    if (holdY <= 0) return;

    // Simulation: Month by Month
    const totalMonths = Math.ceil(holdY * 12);
    let balance = P;
    let totalInvested = P;
    let currentMonthlyDeposit = initialD * (dFreq / 12); // Average monthly if freq is yearly/etc
    
    // For more accuracy on specific frequencies, we simulate strictly.
    // But a standard "Monthly Deposit" with "Yearly Increase" is common.
    
    for (let m = 1; m <= totalMonths; m++) {
      // 1. Add Deposit (if within deposit period)
      if (m <= depY * 12) {
        // Handle Step-up every 12 months
        if (m > 1 && (m - 1) % 12 === 0) {
          if (stepUpType === "amount") {
            currentMonthlyDeposit += (stepVal / 12); // Assuming step up is annual amount
          } else {
            currentMonthlyDeposit *= (1 + stepVal / 100);
          }
        }
        balance += currentMonthlyDeposit;
        totalInvested += currentMonthlyDeposit;
      }

      // 2. Apply Compounding
      // Standard approach for mixed frequencies: apply monthly equivalent rate
      // or check if it's a compounding month.
      const monthsPerCompound = 12 / compoundFreq;
      if (m % monthsPerCompound === 0) {
        // Periodic rate = (1 + r/n)^(n/m) - 1? No, usually just r/n.
        const periodicRate = annualR / compoundFreq;
        balance *= (1 + periodicRate);
      }
    }

    // Calculate Real Value (Inflation Adjusted)
    const finalReal = balance / Math.pow(1 + annualInf, holdY);

    setResults({
      totalInvested,
      totalInterest: balance - totalInvested,
      finalNominal: balance,
      finalReal: finalReal
    });
  };

  const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const InputRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 py-1">
      <Label className="md:text-right font-bold text-sm text-gray-700">{label}</Label>
      <div className="flex gap-2">
        {children}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-700 uppercase tracking-tight">
          Compound Interest Calculator - Advanced
        </h1>
      </div>

      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="pt-6">
          <div className="space-y-3 max-w-2xl mx-auto">
            
            <InputRow label="Principal Amount">
              <Input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
            </InputRow>

            <InputRow label="Deposit">
              <Input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} />
              <Select value={depositFreq} onValueChange={(v: Frequency) => setDepositFreq(v)}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">Monthly</SelectItem>
                  <SelectItem value="1">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </InputRow>

            <InputRow label="Holding Period (Years)">
              <Input type="number" value={holdingPeriod} onChange={(e) => setHoldingPeriod(e.target.value)} />
            </InputRow>

            <InputRow label="Deposit Period (Years)">
              <Input type="number" value={depositPeriod} onChange={(e) => setDepositPeriod(e.target.value)} />
            </InputRow>

            <InputRow label="Deposit Increase Each Year">
              <Input type="number" value={stepUpValue} onChange={(e) => setStepUpValue(e.target.value)} />
              <Select value={stepUpType} onValueChange={(v: StepUpType) => setStepUpType(v)}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="percent">Percent</SelectItem>
                </SelectContent>
              </Select>
            </InputRow>

            <InputRow label="Interest Rate (%)">
              <Input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />
              <Select value={interestFreq} onValueChange={(v: Frequency) => setInterestFreq(v)}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Annually</SelectItem>
                  <SelectItem value="12">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </InputRow>

            <InputRow label="Annual Inflation Rate (%)">
              <Input type="number" value={inflationRate} onChange={(e) => setInflationRate(e.target.value)} />
            </InputRow>

            <InputRow label="Compounding">
              <Select value={compounding} onValueChange={(v: Frequency) => setCompounding(v)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">Monthly</SelectItem>
                  <SelectItem value="4">Quarterly</SelectItem>
                  <SelectItem value="2">Half-Yearly</SelectItem>
                  <SelectItem value="1">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </InputRow>

            <div className="grid grid-cols-2 gap-4 pt-8">
              <Button variant="outline" onClick={handleReset} className="h-12 text-lg bg-gray-100 hover:bg-gray-200 text-black border-gray-300">
                Reset
              </Button>
              <Button onClick={handleCalculate} className="h-12 text-lg bg-gray-100 hover:bg-gray-200 text-black border-gray-300">
                Calculate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {results && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Nominal Results
              </CardTitle>
              <CardDescription>Value in future currency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between"><span>Total Invested:</span><span className="font-bold">{formatCurrency(results.totalInvested)}</span></div>
              <div className="flex justify-between"><span>Total Interest:</span><span className="font-bold text-green-600">{formatCurrency(results.totalInterest)}</span></div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-bold">Maturity Value:</span>
                <span className="font-bold text-xl text-blue-700">{formatCurrency(results.finalNominal)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 dark:bg-orange-950 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                Real Value (Inflation Adj.)
              </CardTitle>
              <CardDescription>Purchasing power in today's terms</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-24">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-700">{formatCurrency(results.finalReal)}</p>
                <p className="text-xs text-muted-foreground mt-1">Adjusted for {inflationRate}% annual inflation</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CompoundInterestCalculator;