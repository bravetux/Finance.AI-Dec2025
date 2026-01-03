"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TrendingDown, TrendingUp, Clock, Percent } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const INFLATION_STATE_KEY = 'inflationImpactCalculatorState';

interface InflationInputs {
  currentExpense: number;
  currentSavings: number;
  years: number;
  inflationRate: number;
  returnRate: number;
}

const initialInputs: InflationInputs = {
  currentExpense: 50000,
  currentSavings: 100000,
  years: 10,
  inflationRate: 6,
  returnRate: 10,
};

const InflationImpactCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<InflationInputs>(() => {
    try {
      const saved = localStorage.getItem(INFLATION_STATE_KEY);
      return saved ? JSON.parse(saved) : initialInputs;
    } catch {
      return initialInputs;
    }
  });

  useEffect(() => {
    localStorage.setItem(INFLATION_STATE_KEY, JSON.stringify(inputs));
  }, [inputs]);

  const handleInputChange = (field: keyof InflationInputs, value: string | number) => {
    setInputs(prev => ({ ...prev, [field]: Number(value) || 0 }));
  };

  const formatCurrency = (value: number) => `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const calculations = useMemo(() => {
    const { currentExpense, currentSavings, years, inflationRate, returnRate } = inputs;
    const i = inflationRate / 100;
    const r = returnRate / 100;

    const chartData = [];
    let futureCost = currentExpense;
    let purchasingPower = currentSavings;
    let futureValue = currentSavings;

    for (let y = 0; y <= years; y++) {
      if (y > 0) {
        futureCost = currentExpense * Math.pow(1 + i, y);
        // Purchasing power: PV / (1 + i)^t
        purchasingPower = currentSavings / Math.pow(1 + i, y);
        // Future Value of Savings: PV * (1 + r)^t
        futureValue = currentSavings * Math.pow(1 + r, y);
      }

      chartData.push({
        year: y,
        futureCost: Math.round(futureCost),
        purchasingPower: Math.round(purchasingPower),
        futureValue: Math.round(futureValue),
      });
    }

    const finalYearData = chartData[chartData.length - 1] || { futureCost: 0, purchasingPower: 0, futureValue: 0 };

    return {
      finalFutureCost: finalYearData.futureCost,
      finalPurchasingPower: finalYearData.purchasingPower,
      finalFutureValue: finalYearData.futureValue,
      chartData,
    };
  }, [inputs]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <TrendingDown className="h-8 w-8 text-red-600" />
        Inflation Impact Calculator
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Inputs */}
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Inputs</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Annual Expense (₹)</Label>
              <Input type="number" value={inputs.currentExpense} onChange={(e) => handleInputChange('currentExpense', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Current Savings / Lumpsum (₹)</Label>
              <Input type="number" value={inputs.currentSavings} onChange={(e) => handleInputChange('currentSavings', e.target.value)} />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between"><Label>Time Period (Years)</Label><span className="font-bold">{inputs.years} Yr</span></div>
              <Slider value={[inputs.years]} onValueChange={(v) => handleInputChange('years', v[0])} min={1} max={50} step={1} />
            </div>
            <div className="space-y-2">
              <Label>Expected Inflation Rate (%)</Label>
              <Input type="number" value={inputs.inflationRate} onChange={(e) => handleInputChange('inflationRate', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Expected Investment Return Rate (%)</Label>
              <Input type="number" value={inputs.returnRate} onChange={(e) => handleInputChange('returnRate', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="bg-red-50 dark:bg-red-950/20 border-red-500/20">
              <CardHeader className="p-4 pb-2"><CardDescription className="text-xs uppercase font-bold">Future Cost of Expense</CardDescription><TrendingUp className="h-4 w-4 text-red-600" /></CardHeader>
              <CardContent className="p-4 pt-0"><div className="text-2xl font-bold text-red-600">{formatCurrency(calculations.finalFutureCost)}</div><p className="text-xs text-muted-foreground">In {inputs.years} years</p></CardContent>
            </Card>
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-500/20">
              <CardHeader className="p-4 pb-2"><CardDescription className="text-xs uppercase font-bold">Purchasing Power of Savings</CardDescription><TrendingDown className="h-4 w-4 text-blue-600" /></CardHeader>
              <CardContent className="p-4 pt-0"><div className="text-2xl font-bold text-blue-600">{formatCurrency(calculations.finalPurchasingPower)}</div><p className="text-xs text-muted-foreground">Value of ₹{inputs.currentSavings.toLocaleString()} in {inputs.years} years</p></CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-950/20 border-green-500/20">
              <CardHeader className="p-4 pb-2"><CardDescription className="text-xs uppercase font-bold">Future Value of Savings</CardDescription><Clock className="h-4 w-4 text-green-600" /></CardHeader>
              <CardContent className="p-4 pt-0"><div className="text-2xl font-bold text-green-600">{formatCurrency(calculations.finalFutureValue)}</div><p className="text-xs text-muted-foreground">If invested at {inputs.returnRate}%</p></CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Projection Chart</CardTitle></CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={calculations.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                  <YAxis tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`} />
                  <Tooltip formatter={(val: number, name: string) => [formatCurrency(val), name]} />
                  <Legend />
                  <Line type="monotone" dataKey="futureCost" stroke="#ef4444" name="Future Cost of Expense" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="futureValue" stroke="#10b981" name="Future Value of Savings" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="purchasingPower" stroke="#3b82f6" name="Purchasing Power" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InflationImpactCalculator;