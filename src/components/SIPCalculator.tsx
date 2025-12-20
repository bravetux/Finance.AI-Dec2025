"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [annualRate, setAnnualRate] = useState(12);
  const [years, setYears] = useState(10);

  const calculateResults = useMemo(() => {
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;
    
    // SIP Formula: P * [((1 + r)^n - 1) / r] * (1 + r)
    const totalValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalInvested = monthlyInvestment * months;
    const estReturns = totalValue - totalInvested;

    // Generate chart data
    const chartData = [];
    for (let i = 0; i <= years; i++) {
      const currentMonths = i * 12;
      const currentValue = currentMonths === 0 ? 0 : 
        monthlyInvestment * ((Math.pow(1 + monthlyRate, currentMonths) - 1) / monthlyRate) * (1 + monthlyRate);
      const currentInvested = monthlyInvestment * currentMonths;
      
      chartData.push({
        year: i,
        "Total Value": Math.round(currentValue),
        "Invested Amount": Math.round(currentInvested)
      });
    }

    return {
      totalValue: Math.round(totalValue),
      totalInvested: Math.round(totalInvested),
      estReturns: Math.round(estReturns),
      chartData
    };
  }, [monthlyInvestment, annualRate, years]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>SIP Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Monthly Investment</Label>
              <span className="text-sm font-medium">{formatCurrency(monthlyInvestment)}</span>
            </div>
            <Input
              type="number"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
              className="mb-2"
            />
            <Slider
              value={[monthlyInvestment]}
              onValueChange={(val) => setMonthlyInvestment(val[0])}
              max={100000}
              step={500}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Expected Return Rate (p.a)</Label>
              <span className="text-sm font-medium">{annualRate}%</span>
            </div>
            <Slider
              value={[annualRate]}
              onValueChange={(val) => setAnnualRate(val[0])}
              max={30}
              step={0.5}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Time Period (Years)</Label>
              <span className="text-sm font-medium">{years}Y</span>
            </div>
            <Slider
              value={[years]}
              onValueChange={(val) => setYears(val[0])}
              max={40}
              step={1}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Investment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Invested Amount</span>
                <span className="font-semibold">{formatCurrency(calculateResults.totalInvested)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Est. Returns</span>
                <span className="font-semibold text-green-600">+{formatCurrency(calculateResults.estReturns)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="font-bold">Total Value</span>
                <span className="font-bold text-lg">{formatCurrency(calculateResults.totalValue)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Growth Projection</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={calculateResults.chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="year" 
                  label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }} 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tickFormatter={(val) => `₹${val/100000}L`} 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="Invested Amount" 
                  stroke="#94a3b8" 
                  fill="#f1f5f9" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="Total Value" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SIPCalculator;