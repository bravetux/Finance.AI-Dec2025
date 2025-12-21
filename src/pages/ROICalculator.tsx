"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TrendingUp, RefreshCcw, Calculator } from "lucide-react";
import { format, differenceInDays } from "date-fns";

const ROICalculator: React.FC = () => {
  const [originalInvestment, setOriginalInvestment] = useState<string>("");
  const [investmentReturn, setInvestmentReturn] = useState<string>("");
  const [years, setYears] = useState<string>("");
  const [months, setMonths] = useState<string>("");
  const [useDateRange, setUseDateRange] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  
  const [results, setResults] = useState<{
    roi: number;
    annualizedRoi: number;
    totalProfit: number;
    durationYears: number;
  } | null>(null);

  const handleReset = () => {
    setOriginalInvestment("");
    setInvestmentReturn("");
    setYears("");
    setMonths("");
    setUseDateRange(false);
    setFromDate("");
    setToDate("");
    setResults(null);
  };

  const handleCalculate = () => {
    const P = parseFloat(originalInvestment);
    const R = parseFloat(investmentReturn);
    
    if (isNaN(P) || isNaN(R) || P <= 0) return;

    let totalYears = 0;

    if (useDateRange) {
      if (!fromDate || !toDate) return;
      const start = new Date(fromDate);
      const end = new Date(toDate);
      const days = differenceInDays(end, start);
      totalYears = days / 365.25;
    } else {
      const y = parseFloat(years) || 0;
      const m = parseFloat(months) || 0;
      totalYears = y + (m / 12);
    }

    if (totalYears <= 0) totalYears = 0.0001; // Avoid division by zero

    const totalProfit = R - P;
    const roi = (totalProfit / P) * 100;
    
    // Annualized ROI formula: [(Current Value / Original Investment)^(1/n) - 1] * 100
    const annualizedRoi = (Math.pow(R / P, 1 / totalYears) - 1) * 100;

    setResults({
      roi,
      annualizedRoi,
      totalProfit,
      durationYears: totalYears
    });
  };

  const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-red-600 flex items-center gap-2">
        Return On Investment (ROI) Calculator
      </h1>

      <Card>
        <CardHeader>
          <CardDescription>
            Calculate the efficiency of an investment or compare the efficiencies of several different investments.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="originalInvestment" className="font-bold">Original Investment</Label>
              <Input
                id="originalInvestment"
                type="number"
                placeholder="0.00"
                value={originalInvestment}
                onChange={(e) => setOriginalInvestment(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="investmentReturn" className="font-bold">Investment Return</Label>
              <Input
                id="investmentReturn"
                type="number"
                placeholder="0.00"
                value={investmentReturn}
                onChange={(e) => setInvestmentReturn(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-6">
              <Label className="font-bold min-w-[60px]">Term</Label>
              <div className="flex items-center gap-2 flex-grow">
                <Input
                  type="number"
                  placeholder="Years"
                  value={years}
                  disabled={useDateRange}
                  onChange={(e) => setYears(e.target.value)}
                  className="w-full"
                />
                <span className="text-sm font-medium">Years</span>
              </div>
              <div className="flex items-center gap-2 flex-grow">
                <Input
                  type="number"
                  placeholder="Months"
                  value={months}
                  disabled={useDateRange}
                  onChange={(e) => setMonths(e.target.value)}
                  className="w-full"
                />
                <span className="text-sm font-medium">Months</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="useDateRange" 
                checked={useDateRange} 
                onCheckedChange={(checked) => setUseDateRange(!!checked)} 
              />
              <Label htmlFor="useDateRange" className="font-bold cursor-pointer">
                Or select investment period (yyyy-MM-dd)
              </Label>
            </div>

            <div className={`grid gap-4 md:grid-cols-2 transition-opacity ${!useDateRange ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex items-center gap-4">
                <Label className="font-bold min-w-[60px]">From</Label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                <Label className="font-bold min-w-[60px]">To</Label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button variant="outline" onClick={handleReset} className="flex-1 h-12 text-lg">
              <RefreshCcw className="mr-2 h-5 w-5" />
              Reset
            </Button>
            <Button onClick={handleCalculate} className="flex-1 h-12 text-lg">
              <Calculator className="mr-2 h-5 w-5" />
              Calculate
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card className="bg-muted/50 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              Investment Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground uppercase font-semibold">Investment Gain</p>
                <p className={`text-2xl font-bold ${results.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(results.totalProfit)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground uppercase font-semibold">Simple ROI</p>
                <p className={`text-2xl font-bold ${results.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {results.roi.toFixed(2)}%
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground uppercase font-semibold">Annualized ROI</p>
                <p className={`text-2xl font-bold ${results.annualizedRoi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {results.annualizedRoi.toFixed(2)}%
                </p>
              </div>
            </div>
            <p className="mt-6 text-xs text-muted-foreground italic">
              Calculation based on a duration of {results.durationYears.toFixed(2)} years.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ROICalculator;