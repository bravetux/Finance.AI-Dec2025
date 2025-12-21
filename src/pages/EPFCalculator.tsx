"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
  Cell
} from "recharts";
import { Calculator, TrendingUp, PieChart as PieChartIcon, Table as TableIcon } from "lucide-react";

const COLORS = ["#94a3b8", "#4f46e5"]; // Investment vs Interest

const formatCurrency = (value: number) => {
  return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
};

const EPFCalculator: React.FC = () => {
  const [monthlySalary, setMonthlySalary] = useState(50000);
  const [age, setAge] = useState(30);
  const [contribution, setContribution] = useState(12);
  const [salaryIncrease, setSalaryIncrease] = useState(5);
  const [interestRate, setInterestRate] = useState(8.25);
  const retirementAge = 58;

  const results = useMemo(() => {
    let balance = 0;
    let currentMonthlySalary = monthlySalary;
    let totalInvested = 0;
    const yearsToRetire = retirementAge - age;

    const yearlyData = [];
    const monthlyData = [];

    if (yearsToRetire <= 0) return null;

    for (let y = 1; y <= yearsToRetire; y++) {
      let annualEmpContribution = 0;
      let annualEmployerContribution = 0;
      let annualInterest = 0;

      for (let m = 1; m <= 12; m++) {
        // Employee: 12% of Basic + DA
        // Employer: 12% total, but only 3.67% goes to EPF (8.33% goes to EPS)
        const empContrib = currentMonthlySalary * (contribution / 100);
        const employerContrib = currentMonthlySalary * 0.0367; // Standard EPF rules
        
        const monthlyTotalContrib = empContrib + employerContrib;
        const interest = (balance + monthlyTotalContrib / 2) * (interestRate / 100 / 12);
        
        balance += monthlyTotalContrib + interest;
        totalInvested += monthlyTotalContrib;
        
        annualEmpContribution += empContrib;
        annualEmployerContribution += employerContrib;
        annualInterest += interest;

        monthlyData.push({
          period: `M${(y - 1) * 12 + m}`,
          label: `Month ${(y - 1) * 12 + m}`,
          contribution: empContrib + employerContrib,
          interest: interest,
          balance: balance
        });
      }

      yearlyData.push({
        year: y,
        age: age + y,
        invested: Math.round(totalInvested),
        interest: Math.round(annualInterest),
        balance: Math.round(balance),
        contribution: Math.round(annualEmpContribution + annualEmployerContribution)
      });

      // Annual salary hike
      currentMonthlySalary *= (1 + salaryIncrease / 100);
    }

    return {
      accumulatedAmount: balance,
      totalInvestment: totalInvested,
      totalInterest: balance - totalInvested,
      yearlyData,
      monthlyData,
      pieData: [
        { name: "Total Investment", value: totalInvested },
        { name: "Total Interest", value: balance - totalInvested },
      ]
    };
  }, [monthlySalary, age, contribution, salaryIncrease, interestRate]);

  if (!results) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calculator className="h-8 w-8 text-primary" />
          EPF Retirement Calculator
        </h1>
        <p className="text-muted-foreground">Estimate your Employee Provident Fund corpus at age {retirementAge}.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Inputs Column */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Monthly Salary (Basic + DA)</Label>
                <span className="font-bold text-primary">{formatCurrency(monthlySalary)}</span>
              </div>
              <Slider value={[monthlySalary]} onValueChange={(v) => setMonthlySalary(v[0])} min={15000} max={500000} step={1000} />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Current Age</Label>
                <span className="font-bold text-primary">{age} Yr</span>
              </div>
              <Slider value={[age]} onValueChange={(v) => setAge(v[0])} min={18} max={57} step={1} />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>EPF Contribution (%)</Label>
                <span className="font-bold text-primary">{contribution}%</span>
              </div>
              <Slider value={[contribution]} onValueChange={(v) => setContribution(v[0])} min={12} max={25} step={0.5} />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Annual Salary Hike (%)</Label>
                <span className="font-bold text-primary">{salaryIncrease}%</span>
              </div>
              <Slider value={[salaryIncrease]} onValueChange={(v) => setSalaryIncrease(v[0])} min={0} max={20} step={1} />
            </div>

            <div className="space-y-2">
              <Label>Current Interest Rate (% p.a)</Label>
              <Input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} />
            </div>
          </CardContent>
        </Card>

        {/* Visualization Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <p className="text-xs uppercase font-bold text-muted-foreground mb-1">Maturity Corpus</p>
                <p className="text-3xl font-black text-primary">{formatCurrency(results.accumulatedAmount)}</p>
                <p className="text-xs text-muted-foreground mt-2">At age {retirementAge}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs uppercase font-bold text-muted-foreground mb-1">Wealth Gained</p>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(results.totalInterest)}</p>
                <p className="text-xs text-muted-foreground mt-2">Interest earned over {retirementAge - age} years</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="growth" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="growth"><TrendingUp className="mr-2 h-4 w-4" /> Growth Chart</TabsTrigger>
              <TabsTrigger value="breakdown"><PieChartIcon className="mr-2 h-4 w-4" /> Breakdown</TabsTrigger>
            </TabsList>
            
            <TabsContent value="growth" className="h-[350px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={results.yearlyData}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="age" label={{ value: 'Age', position: 'insideBottom', offset: -5 }} />
                  <YAxis tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`} />
                  <Tooltip formatter={(val: number) => formatCurrency(val)} labelFormatter={(age) => `Age ${age}`} />
                  <Area type="monotone" dataKey="balance" stroke="#4f46e5" fillOpacity={1} fill="url(#colorBalance)" name="Total Corpus" />
                  <Area type="monotone" dataKey="invested" stroke="#94a3b8" fill="transparent" strokeDasharray="5 5" name="Cumulative Investment" />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="breakdown" className="h-[350px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={results.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {results.pieData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: number) => formatCurrency(val)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Amortization Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Detailed Schedule</CardTitle>
            <CardDescription>Year-by-year and Month-by-month projection of your EPF growth.</CardDescription>
          </div>
          <TableIcon className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="yearly">
            <TabsList className="mb-4">
              <TabsTrigger value="yearly">Yearly View</TabsTrigger>
              <TabsTrigger value="monthly">Monthly View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="yearly">
              <div className="max-h-[400px] overflow-y-auto border rounded-md">
                <Table>
                  <TableHeader className="sticky top-0 bg-background shadow-sm">
                    <TableRow>
                      <TableHead>Age</TableHead>
                      <TableHead className="text-right">Annual Contribution</TableHead>
                      <TableHead className="text-right">Interest Earned</TableHead>
                      <TableHead className="text-right">End Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.yearlyData.map((row) => (
                      <TableRow key={row.year}>
                        <TableCell className="font-medium">{row.age}</TableCell>
                        <TableCell className="text-right">{formatCurrency(row.contribution)}</TableCell>
                        <TableCell className="text-right text-green-600">+{formatCurrency(row.interest)}</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(row.balance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="monthly">
              <div className="max-h-[400px] overflow-y-auto border rounded-md">
                <Table>
                  <TableHeader className="sticky top-0 bg-background shadow-sm">
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead className="text-right">Contribution</TableHead>
                      <TableHead className="text-right">Interest</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.monthlyData.map((row) => (
                      <TableRow key={row.period}>
                        <TableCell className="font-medium">{row.label}</TableCell>
                        <TableCell className="text-right">{formatCurrency(row.contribution)}</TableCell>
                        <TableCell className="text-right text-green-600">+{formatCurrency(row.interest)}</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(row.balance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EPFCalculator;