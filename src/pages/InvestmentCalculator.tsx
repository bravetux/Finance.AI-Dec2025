"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, Info } from "lucide-react";
import { Tooltip as ShcnTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const InvestmentCalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState(100000);
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [stepUpPercentage, setStepUpPercentage] = useState(5);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(15);
  const [taxRate, setTaxRate] = useState(10);

  const calculations = useMemo(() => {
    const monthlyRate = expectedReturn / 12 / 100;
    const data = [];
    let currentBalance = initialInvestment;
    let currentMonthlySIP = monthlyInvestment;
    let totalInvested = initialInvestment;

    data.push({
        year: 0,
        invested: Math.round(totalInvested),
        value: Math.round(currentBalance),
        gains: 0
    });

    for (let y = 1; y <= timePeriod; y++) {
      let annualSipInvested = 0;
      for (let m = 1; m <= 12; m++) {
        const interest = currentBalance * monthlyRate;
        currentBalance = currentBalance + interest + currentMonthlySIP;
        annualSipInvested += currentMonthlySIP;
      }
      totalInvested += annualSipInvested;
      
      data.push({
        year: y,
        invested: Math.round(totalInvested),
        value: Math.round(currentBalance),
        gains: Math.round(currentBalance - totalInvested)
      });

      // Apply annual step-up
      currentMonthlySIP *= (1 + stepUpPercentage / 100);
    }

    const finalValue = currentBalance;
    const totalGains = finalValue - totalInvested;
    const estimatedTax = totalGains > 0 ? totalGains * (taxRate / 100) : 0;
    const postTaxValue = finalValue - estimatedTax;

    return {
      totalInvested: Math.round(totalInvested),
      totalGains: Math.round(totalGains),
      finalValue: Math.round(finalValue),
      estimatedTax: Math.round(estimatedTax),
      postTaxValue: Math.round(postTaxValue),
      chartData: data,
    };
  }, [initialInvestment, monthlyInvestment, stepUpPercentage, expectedReturn, timePeriod, taxRate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            Investment Growth Calculator
        </h1>
        <p className="text-muted-foreground">Estimate your wealth growth with initial lumpsum and monthly step-up SIPs.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar Inputs */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="initial">Initial Lumpsum (₹)</Label>
              <Input id="initial" type="number" value={initialInvestment} onChange={(e) => setInitialInvestment(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly">Monthly Investment (₹)</Label>
              <Input id="monthly" type="number" value={monthlyInvestment} onChange={(e) => setMonthlyInvestment(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="stepup">Annual Step-up (%)</Label>
                <TooltipProvider>
                    <ShcnTooltip>
                        <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Percentage by which you increase your monthly investment every year.</p>
                        </TooltipContent>
                    </ShcnTooltip>
                </TooltipProvider>
              </div>
              <Input id="stepup" type="number" value={stepUpPercentage} onChange={(e) => setStepUpPercentage(Number(e.target.value))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="roi">Expected ROI (%)</Label>
                    <Input id="roi" type="number" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="years">Duration (Years)</Label>
                    <Input id="years" type="number" value={timePeriod} onChange={(e) => setTimePeriod(Number(e.target.value))} />
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax">Estimated Tax on Gains (%)</Label>
              <Input id="tax" type="number" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="bg-primary/5">
                    <CardHeader className="p-4 pb-2">
                        <CardDescription className="text-xs uppercase font-bold">Total Invested</CardDescription>
                        <CardTitle className="text-xl">{formatCurrency(calculations.totalInvested)}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-green-50 dark:bg-green-950/20">
                    <CardHeader className="p-4 pb-2">
                        <CardDescription className="text-xs uppercase font-bold">Wealth Gained</CardDescription>
                        <CardTitle className="text-xl text-green-600">{formatCurrency(calculations.totalGains)}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-blue-50 dark:bg-blue-950/20">
                    <CardHeader className="p-4 pb-2">
                        <CardDescription className="text-xs uppercase font-bold">Maturity Value</CardDescription>
                        <CardTitle className="text-xl text-blue-600">{formatCurrency(calculations.finalValue)}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Growth Projection</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={calculations.chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                                <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                                <Tooltip formatter={(value: number) => formatCurrency(value)} labelFormatter={(label) => `Year ${label}`} />
                                <Legend />
                                <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" name="Maturity Value" />
                                <Area type="monotone" dataKey="invested" stroke="#94a3b8" fill="transparent" name="Capital Invested" strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-t-4 border-t-orange-500">
                <CardHeader className="pb-2">
                    <CardTitle>Post-Tax Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Estimated Tax on Gains ({taxRate}%):</span>
                        <span className="font-semibold text-red-500">-{formatCurrency(calculations.estimatedTax)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-2">
                        <span className="text-lg font-bold">Post-Tax Maturity Value:</span>
                        <span className="text-2xl font-black text-green-600">{formatCurrency(calculations.postTaxValue)}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCalculator;