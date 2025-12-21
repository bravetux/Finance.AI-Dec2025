"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calculator, RefreshCcw, TrendingUp } from "lucide-react";
import { differenceInDays, addDays, format } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ["#94a3b8", "#10b981"];

const InterestCalculator: React.FC = () => {
  const [interestType, setInterestType] = useState<"simple" | "compound">("simple");
  const [principal, setPrincipal] = useState<string>("100000");
  const [rate, setRate] = useState<string>("10");
  const [durationYears, setDurationYears] = useState<string>("1");
  const [durationMonths, setDurationMonths] = useState<string>("0");
  const [durationDays, setDurationDays] = useState<string>("0");
  const [useDateRange, setUseDateRange] = useState(false);
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 365), 'yyyy-MM-dd'));
  const [compoundingFrequency, setCompoundingFrequency] = useState<string>("12");

  const [results, setResults] = useState<{
    interest: number;
    total: number;
    days: number;
  } | null>(null);

  const calculate = () => {
    const P = parseFloat(principal) || 0;
    const R = parseFloat(rate) || 0;
    
    let T_days = 0;
    if (useDateRange) {
      T_days = differenceInDays(new Date(endDate), new Date(startDate));
    } else {
      T_days = (parseFloat(durationYears) || 0) * 365.25 + 
               (parseFloat(durationMonths) || 0) * 30.44 + 
               (parseFloat(durationDays) || 0);
    }

    if (T_days <= 0 || P <= 0) return;

    const T_years = T_days / 365;
    let interest = 0;

    if (interestType === "simple") {
      // SI = P * R * T / 100
      interest = (P * R * T_years) / 100;
    } else {
      // CI = P * (1 + r/n)^(nt) - P
      const n = parseInt(compoundingFrequency);
      const r = R / 100;
      interest = P * Math.pow(1 + r / n, n * T_years) - P;
    }

    setResults({
      interest,
      total: P + interest,
      days: Math.round(T_days)
    });
  };

  useEffect(() => {
    calculate();
  }, [interestType, principal, rate, durationYears, durationMonths, durationDays, useDateRange, startDate, endDate, compoundingFrequency]);

  const handleReset = () => {
    setPrincipal("100000");
    setRate("10");
    setDurationYears("1");
    setDurationMonths("0");
    setDurationDays("0");
    setUseDateRange(false);
    setResults(null);
  };

  const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const pieData = results ? [
    { name: "Principal", value: parseFloat(principal) || 0 },
    { name: "Interest", value: results.interest }
  ] : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Interest Calculator</h1>
        <Button variant="outline" size="sm" onClick={handleReset}><RefreshCcw className="mr-2 h-4 w-4" /> Reset</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Tabs value={interestType} onValueChange={(v: any) => setInterestType(v)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="simple">Simple Interest</TabsTrigger>
                <TabsTrigger value="compound">Compound Interest</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Principal Amount (₹)</Label>
              <Input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Interest Rate (% p.a.)</Label>
              <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
            </div>

            {interestType === "compound" && (
              <div className="space-y-2">
                <Label>Compounding Frequency</Label>
                <Select value={compoundingFrequency} onValueChange={setCompoundingFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Yearly</SelectItem>
                    <SelectItem value="2">Half-Yearly</SelectItem>
                    <SelectItem value="4">Quarterly</SelectItem>
                    <SelectItem value="12">Monthly</SelectItem>
                    <SelectItem value="365">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="pt-2">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox id="date-range" checked={useDateRange} onCheckedChange={(v) => setUseDateRange(!!v)} />
                <Label htmlFor="date-range" className="cursor-pointer">Use Specific Date Range</Label>
              </div>

              {useDateRange ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs">From</Label>
                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">To</Label>
                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Years</Label>
                    <Input type="number" value={durationYears} onChange={(e) => setDurationYears(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Months</Label>
                    <Input type="number" value={durationMonths} onChange={(e) => setDurationMonths(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Days</Label>
                    <Input type="number" value={durationDays} onChange={(e) => setDurationDays(e.target.value)} />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {results && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" /> Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-muted-foreground">Interest Earned</span>
                  <span className="text-2xl font-bold text-green-600">{formatCurrency(results.interest)}</span>
                </div>
                <div className="flex justify-between items-end border-t pt-4">
                  <span className="text-muted-foreground">Total Value</span>
                  <span className="text-3xl font-black text-primary">{formatCurrency(results.total)}</span>
                </div>
                <p className="text-xs text-center text-muted-foreground pt-2">
                  Calculated for approximately <strong>{results.days} days</strong>.
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InterestCalculator;