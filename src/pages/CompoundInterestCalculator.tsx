"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCcw, TrendingUp, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type CompoundingFrequency = "12" | "4" | "2" | "1";

const CompoundInterestCalculator: React.FC = () => {
  // Inputs
  const [mode, setMode] = useState<"basic" | "advanced">("basic");
  const [principal, setPrincipal] = useState<string>("100000");
  const [monthlyDeposit, setMonthlyDeposit] = useState<string>("5000");
  const [years, setYears] = useState<string>("10");
  const [months, setMonths] = useState<string>("0");
  const [annualRate, setAnnualRate] = useState<string>("10");
  const [compounding, setCompounding] = useState<CompoundingFrequency>("12");
  
  const [results, setResults] = useState<{
    totalPrincipal: number;
    totalInterest: number;
    finalBalance: number;
  } | null>(null);

  const handleReset = () => {
    setPrincipal("");
    setMonthlyDeposit("");
    setYears("");
    setMonths("");
    setAnnualRate("");
    setCompounding("12");
    setResults(null);
  };

  const handleCalculate = () => {
    const P = parseFloat(principal) || 0;
    const PMT = mode === "advanced" ? (parseFloat(monthlyDeposit) || 0) : 0;
    const totalYears = (parseFloat(years) || 0) + (parseFloat(months) || 0) / 12;
    const totalMonths = (parseFloat(years) || 0) * 12 + (parseFloat(months) || 0);
    const r = (parseFloat(annualRate) || 0) / 100;
    const n = mode === "advanced" ? parseInt(compounding) : 12; // Default basic to monthly compounding

    if (totalMonths <= 0 && totalYears <= 0) return;

    // Part 1: Future Value of Principal
    // FV = P * (1 + r/n)^(n*t)
    const FV_principal = P * Math.pow(1 + r / n, n * totalYears);
    
    // Part 2: Future Value of Monthly Deposits (Annuity)
    // We use the monthly rate for the PMT part to remain consistent with standard SIP/Deposit models
    let FV_deposits = 0;
    if (PMT > 0) {
        const monthlyR = r / 12;
        // FV = PMT * [((1 + r/12)^n - 1) / (r/12)] * (1 + r/12) -- Assuming start of month
        FV_deposits = PMT * (Math.pow(1 + monthlyR, totalMonths) - 1) / monthlyR * (1 + monthlyR);
    }

    const finalBalance = FV_principal + FV_deposits;
    const totalPrincipalInvested = P + (PMT * totalMonths);
    const totalInterest = finalBalance - totalPrincipalInvested;

    setResults({
      totalPrincipal: totalPrincipalInvested,
      totalInterest: totalInterest,
      finalBalance: finalBalance
    });
  };

  // Trigger calculation whenever inputs change
  useEffect(() => {
    handleCalculate();
  }, [mode, principal, monthlyDeposit, years, months, annualRate, compounding]);

  const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-red-700">Compound Interest Calculator</h1>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}><RefreshCcw className="mr-2 h-4 w-4" /> Reset</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="principal" className="font-semibold">Principal Amount (₹)</Label>
                <Input
                  id="principal"
                  type="number"
                  placeholder="e.g. 1,00,000"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                />
              </div>

              {mode === "advanced" && (
                <div className="space-y-2">
                  <Label htmlFor="deposit" className="font-semibold">Monthly Deposit (₹)</Label>
                  <Input
                    id="deposit"
                    type="number"
                    placeholder="e.g. 5,000"
                    value={monthlyDeposit}
                    onChange={(e) => setMonthlyDeposit(e.target.value)}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="years" className="font-semibold">Years</Label>
                  <Input
                    id="years"
                    type="number"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="months" className="font-semibold">Months</Label>
                  <Input
                    id="months"
                    type="number"
                    value={months}
                    onChange={(e) => setMonths(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate" className="font-semibold">Annual Interest Rate (%)</Label>
                <Input
                  id="rate"
                  type="number"
                  placeholder="e.g. 12"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(e.target.value)}
                />
              </div>

              {mode === "advanced" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="compounding" className="font-semibold">Compounding Frequency</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>How often interest is calculated and added back to the principal.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select value={compounding} onValueChange={(v: CompoundingFrequency) => setCompounding(v)}>
                    <SelectTrigger id="compounding">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">Monthly</SelectItem>
                      <SelectItem value="4">Quarterly</SelectItem>
                      <SelectItem value="2">Half-Yearly</SelectItem>
                      <SelectItem value="1">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Results Column */}
            <div className="flex flex-col justify-center">
              {results ? (
                <div className="space-y-6 bg-muted/30 p-6 rounded-xl border border-primary/10">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <h3 className="font-bold text-lg">Results</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-muted-foreground">Total Principal</span>
                      <span className="font-bold">{formatCurrency(results.totalPrincipal)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-muted-foreground">Total Interest Earned</span>
                      <span className="font-bold text-green-600">+{formatCurrency(results.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-bold">Final Balance</span>
                      <span className="text-2xl font-black text-blue-600">{formatCurrency(results.finalBalance)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground italic text-center pt-4">
                    {mode === 'basic' 
                        ? "* Calculation assumes monthly compounding for basic growth." 
                        : `* Calculation based on ${parseInt(compounding) === 12 ? 'Monthly' : parseInt(compounding) === 4 ? 'Quarterly' : parseInt(compounding) === 2 ? 'Half-Yearly' : 'Yearly'} compounding.`}
                  </p>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground italic border-2 border-dashed rounded-xl p-8">
                  Enter values to see calculation results...
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompoundInterestCalculator;