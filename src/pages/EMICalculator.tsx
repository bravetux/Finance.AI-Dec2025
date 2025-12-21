"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { CreditCard, IndianRupee, Calendar, Percent } from "lucide-react";

const COLORS = ["#3b82f6", "#ef4444"];

const EMICalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState(2500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(15);

  const calculations = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;

    // EMI formula: [P * r * (1+r)^n] / [(1+r)^n - 1]
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - P;

    // Amortization Schedule (Yearly)
    const schedule = [];
    let balance = P;
    for (let y = 1; y <= tenureYears; y++) {
      let annualInterest = 0;
      let annualPrincipal = 0;
      for (let m = 1; m <= 12; m++) {
        const monthlyInterest = balance * r;
        const monthlyPrincipal = emi - monthlyInterest;
        annualInterest += monthlyInterest;
        annualPrincipal += monthlyPrincipal;
        balance -= monthlyPrincipal;
      }
      schedule.push({
        year: y,
        principal: Math.round(annualPrincipal),
        interest: Math.round(annualInterest),
        balance: Math.max(0, Math.round(balance))
      });
    }

    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount),
      schedule,
      pieData: [
        { name: "Principal Amount", value: P },
        { name: "Total Interest", value: Math.round(totalInterest) }
      ]
    };
  }, [loanAmount, interestRate, tenureYears]);

  const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold flex items-center gap-2">
            <CreditCard className="h-8 w-8 text-primary" />
            EMI Calculator
        </h1>
        <p className="text-muted-foreground">Calculate your monthly loan payments and view your repayment schedule.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Inputs Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Loan Amount</Label>
                <span className="font-bold text-primary">{formatCurrency(loanAmount)}</span>
              </div>
              <Slider 
                value={[loanAmount]} 
                min={100000} max={10000000} step={50000} 
                onValueChange={(v) => setLoanAmount(v[0])}
              />
              <Input 
                type="number" 
                value={loanAmount} 
                onChange={(e) => setLoanAmount(Number(e.target.value))} 
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Interest Rate (% p.a)</Label>
                <span className="font-bold text-primary">{interestRate}%</span>
              </div>
              <Slider 
                value={[interestRate]} 
                min={5} max={20} step={0.1} 
                onValueChange={(v) => setInterestRate(v[0])}
              />
              <Input 
                type="number" 
                value={interestRate} 
                onChange={(e) => setInterestRate(Number(e.target.value))} 
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Tenure (Years)</Label>
                <span className="font-bold text-primary">{tenureYears} Yr</span>
              </div>
              <Slider 
                value={[tenureYears]} 
                min={1} max={30} step={1} 
                onValueChange={(v) => setTenureYears(v[0])}
              />
              <Input 
                type="number" 
                value={tenureYears} 
                onChange={(e) => setTenureYears(Number(e.target.value))} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Results & Visuals */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6 text-center">
                <p className="text-xs uppercase font-bold text-muted-foreground mb-1">Monthly EMI</p>
                <p className="text-2xl font-black">{formatCurrency(calculations.monthlyEmi)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-xs uppercase font-bold text-muted-foreground mb-1">Total Interest</p>
                <p className="text-2xl font-bold text-red-500">{formatCurrency(calculations.totalInterest)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-xs uppercase font-bold text-muted-foreground mb-1">Total Payout</p>
                <p className="text-2xl font-bold">{formatCurrency(calculations.totalAmount)}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
                <CardTitle className="text-lg">Breakup of Total Payment</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={calculations.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {calculations.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yearly Repayment Schedule</CardTitle>
          <CardDescription>See how your loan balance decreases over time.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[400px] overflow-y-auto border rounded-md">
            <Table>
              <TableHeader className="sticky top-0 bg-background shadow-sm">
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead className="text-right">Principal Paid</TableHead>
                  <TableHead className="text-right">Interest Paid</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculations.schedule.map((row) => (
                  <TableRow key={row.year}>
                    <TableCell className="font-medium">Year {row.year}</TableCell>
                    <TableCell className="text-right text-blue-600">{formatCurrency(row.principal)}</TableCell>
                    <TableCell className="text-right text-red-500">{formatCurrency(row.interest)}</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(row.balance)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EMICalculator;