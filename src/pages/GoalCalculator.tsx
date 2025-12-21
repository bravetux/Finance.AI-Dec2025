"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  TrendingUp, 
  PieChart as PieChartIcon,
  ArrowUpCircle,
  HelpCircle
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import ReportTable, { ReportRow } from "@/components/ReportTable";

const COLORS = ["#94a3b8", "#4f46e5"]; // Saved vs SIP

type DisplayUnit = 'actual' | 'lakh' | 'crore';

const formatCurrency = (value: number) => {
  return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
};

const numberToIndianWords = (num: number): string => {
  if (num === 0) return "Zero";
  if (num < 0) return "Negative " + numberToIndianWords(Math.abs(num));

  const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const convertLessThanThousand = (n: number): string => {
    let res = "";
    if (n >= 100) {
      res += units[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 10 && n <= 19) {
      res += teens[n - 10];
    } else if (n >= 20 || n > 0) {
      res += tens[Math.floor(n / 10)] + (n % 10 > 0 ? " " + units[n % 10] : "");
    }
    return res.trim();
  };

  let result = "";
  let remaining = Math.floor(num);

  const crore = Math.floor(remaining / 10000000);
  remaining %= 10000000;
  const lakh = Math.floor(remaining / 100000);
  remaining %= 100000;
  const thousand = Math.floor(remaining / 1000);
  remaining %= 1000;

  if (crore > 0) result += convertLessThanThousand(crore) + " Crore ";
  if (lakh > 0) result += convertLessThanThousand(lakh) + " Lakh ";
  if (thousand > 0) result += convertLessThanThousand(thousand) + " Thousand ";
  if (remaining > 0) result += convertLessThanThousand(remaining);

  return result.trim() + " Rupees";
};

const GoalCalculator: React.FC = () => {
  const [goalCost, setGoalCost] = useState(5000000);
  const [amountSaved, setAmountSaved] = useState(500000);
  const [timePeriod, setTimePeriod] = useState(10);
  const [inflationRate, setInflationRate] = useState(6);
  const [returnRate, setReturnRate] = useState(12);
  const [unit, setUnit] = useState<DisplayUnit>('lakh');

  const LAKH = 100000;
  const CRORE = 10000000;

  const getUnitMultiplier = (u: DisplayUnit) => {
    if (u === 'lakh') return LAKH;
    if (u === 'crore') return CRORE;
    return 1;
  };

  const currentMultiplier = getUnitMultiplier(unit);

  const handleGoalCostChange = (val: number) => {
    setGoalCost(val * currentMultiplier);
  };

  const handleAmountSavedChange = (val: number) => {
    setAmountSaved(val * currentMultiplier);
  };

  const { results, yearlyData, monthlyData, chartData, pieData } = useMemo(() => {
    const t = timePeriod;
    const i = inflationRate / 100;
    const r = returnRate / 100;
    const r_monthly = r / 12;
    const n_months = t * 12;

    const futureGoalCost = goalCost * Math.pow(1 + i, t);
    const fvSavedAmount = amountSaved * Math.pow(1 + r, t);
    const requiredCorpus = Math.max(0, futureGoalCost - fvSavedAmount);

    let requiredMonthlySIP = 0;
    if (requiredCorpus > 0 && n_months > 0) {
      if (r_monthly === 0) {
        requiredMonthlySIP = requiredCorpus / n_months;
      } else {
        const factor = ((Math.pow(1 + r_monthly, n_months) - 1) / r_monthly) * (1 + r_monthly);
        requiredMonthlySIP = requiredCorpus / factor;
      }
    }

    const yearlyReport: ReportRow[] = [];
    const monthlyReport: ReportRow[] = [];
    const chartPoints = [];
    
    let currentBalance = amountSaved;
    let totalInvested = amountSaved;

    chartPoints.push({ year: 0, invested: Math.round(totalInvested), balance: Math.round(currentBalance) });

    for (let year = 1; year <= t; year++) {
      let annualSIP = 0;
      let annualInterest = 0;
      for (let month = 1; month <= 12; month++) {
        currentBalance += requiredMonthlySIP;
        totalInvested += requiredMonthlySIP;
        annualSIP += requiredMonthlySIP;
        const interest = currentBalance * r_monthly;
        currentBalance += interest;
        annualInterest += interest;
        monthlyReport.push({
          period: (year - 1) * 12 + month,
          label: `Month ${(year - 1) * 12 + month}`,
          amountDeposited: requiredMonthlySIP,
          returnsEarned: interest,
          endBalance: currentBalance
        });
      }
      yearlyReport.push({
        period: year,
        label: `Year ${year}`,
        amountDeposited: year === 1 ? annualSIP + amountSaved : annualSIP,
        returnsEarned: annualInterest,
        endBalance: currentBalance
      });
      chartPoints.push({ year: year, invested: Math.round(totalInvested), balance: Math.round(currentBalance) });
    }

    return {
      results: { futureGoalCost, fvSavedAmount, requiredCorpus, requiredMonthlySIP, totalInvestment: totalInvested, totalReturns: currentBalance - totalInvested },
      yearlyData: yearlyReport,
      monthlyData: monthlyReport,
      chartData: chartPoints,
      pieData: [
        { name: "FV of Saved Amount", value: fvSavedAmount },
        { name: "FV of SIP Contributions", value: requiredCorpus },
      ]
    };
  }, [goalCost, amountSaved, timePeriod, inflationRate, returnRate]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Target className="h-8 w-8 text-primary" />
          Financial Goal Calculator
        </h1>
        <p className="text-muted-foreground">Calculate how much you need to save to reach your future milestones.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center mb-2">
              <CardTitle>Goal Details</CardTitle>
              <div className="flex bg-muted p-1 rounded-md">
                {(['actual', 'lakh', 'crore'] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    className={`px-2 py-1 text-[10px] uppercase font-bold rounded transition-colors ${unit === u ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-background/50'}`}
                  >
                    {u === 'actual' ? '₹' : u}
                  </button>
                ))}
              </div>
            </div>
            <CardDescription>Adjust inputs to match your specific goal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Current Goal Cost ({unit === 'actual' ? '₹' : unit})</Label>
              <Input 
                type="number" 
                value={Number((goalCost / currentMultiplier).toFixed(2))} 
                onChange={(e) => handleGoalCostChange(Number(e.target.value))} 
              />
              <p className="text-[10px] text-muted-foreground font-medium italic">
                {numberToIndianWords(goalCost)}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Already Saved ({unit === 'actual' ? '₹' : unit})</Label>
              <Input 
                type="number" 
                value={Number((amountSaved / currentMultiplier).toFixed(2))} 
                onChange={(e) => handleAmountSavedChange(Number(e.target.value))} 
              />
              <p className="text-[10px] text-muted-foreground font-medium italic">
                {numberToIndianWords(amountSaved)}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Time Period (Years)</Label>
                <span className="font-bold text-primary">{timePeriod} Yr</span>
              </div>
              <Slider value={[timePeriod]} onValueChange={(v) => setTimePeriod(v[0])} min={1} max={40} step={1} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Inflation (%)</Label>
                <Input type="number" value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Returns (%)</Label>
                <Input type="number" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <p className="text-xs uppercase font-bold text-muted-foreground mb-1">Required Monthly SIP</p>
                <p className="text-3xl font-black text-primary">{formatCurrency(results.requiredMonthlySIP)}</p>
                <p className="text-[10px] text-muted-foreground italic mt-1">{numberToIndianWords(results.requiredMonthlySIP)} / month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs uppercase font-bold text-muted-foreground mb-1">Future Goal Cost</p>
                <p className="text-3xl font-bold text-orange-600">{formatCurrency(results.futureGoalCost)}</p>
                <p className="text-[10px] text-muted-foreground italic mt-1">{numberToIndianWords(results.futureGoalCost)}</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="growth" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="growth"><TrendingUp className="mr-2 h-4 w-4" /> Accumulation Path</TabsTrigger>
              <TabsTrigger value="allocation"><PieChartIcon className="mr-2 h-4 w-4" /> Contribution Split</TabsTrigger>
            </TabsList>
            <TabsContent value="growth" className="h-[350px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/><stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                  <YAxis tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`} />
                  <Tooltip formatter={(val: number) => formatCurrency(val)} labelFormatter={(year) => `Year ${year}`} />
                  <Area type="monotone" dataKey="balance" stroke="#4f46e5" fillOpacity={1} fill="url(#colorBalance)" name="Projected Corpus" />
                  <Area type="monotone" dataKey="invested" stroke="#94a3b8" fill="transparent" strokeDasharray="5 5" name="Total Capital Invested" />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="allocation" className="h-[350px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={100} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(val: number) => formatCurrency(val)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <ReportTable yearlyData={yearlyData} monthlyData={monthlyData} />
    </div>
  );
};

export default GoalCalculator;