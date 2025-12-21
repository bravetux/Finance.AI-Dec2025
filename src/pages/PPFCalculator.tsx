"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from "recharts";
import { Calculator, TrendingUp, PieChart as PieChartIcon, Table as TableIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const COLORS = ["#94a3b8", "#10b981"]; // Principal vs Interest

const formatCurrency = (value: number) => {
  return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
};

const PPFCalculator: React.FC = () => {
  // Mode 1: Yearly Investment
  const [yearlyP, setYearlyP] = useState(150000);
  const [yearlyN, setYearlyN] = useState(15);
  const [yearlyR, setYearlyR] = useState(7.1);

  // Mode 2: Accumulated (Lumpsum)
  const [lumpP, setLumpP] = useState(1000000);
  const [lumpN, setLumpN] = useState(15);
  const [lumpR, setLumpR] = useState(7.1);

  // Mode 3: Combo
  const [comboLump, setComboLump] = useState(500000);
  const [comboYearly, setComboYearly] = useState(50000);
  const [comboN, setComboN] = useState(15);
  const [comboR, setComboR] = useState(7.1);

  const calculateGrowth = (initial: number, recurringYearly: number, rate: number, years: number) => {
    const r = rate / 100;
    const monthlyRate = r / 12;
    const yearlyData = [];
    const monthlyData = [];
    let currentBalance = initial;
    let totalInvested = initial;

    yearlyData.push({
      year: 0,
      invested: Math.round(totalInvested),
      balance: Math.round(currentBalance),
      interest: 0,
      contribution: 0
    });

    for (let i = 1; i <= years; i++) {
      let annualInterest = 0;
      let annualContribution = recurringYearly;
      
      // Assumption: Yearly contribution is made at the start of the year (April) for max interest
      let openingBalanceForYear = currentBalance;
      currentBalance += recurringYearly;
      totalInvested += recurringYearly;

      for (let m = 1; m <= 12; m++) {
        // In PPF, interest is calculated monthly but credited annually
        const monthlyInterest = currentBalance * monthlyRate;
        annualInterest += monthlyInterest;
        
        monthlyData.push({
          period: `Y${i} M${m}`,
          label: `Year ${i}, Month ${m}`,
          contribution: m === 1 ? recurringYearly : 0,
          interest: monthlyInterest,
          balance: currentBalance + (m === 12 ? annualInterest : 0) // Show balance after interest credit in month 12
        });
      }

      currentBalance += annualInterest;

      yearlyData.push({
        year: i,
        invested: Math.round(totalInvested),
        interest: Math.round(annualInterest),
        balance: Math.round(currentBalance),
        contribution: Math.round(annualContribution)
      });
    }

    const maturityValue = currentBalance;
    const totalInterest = maturityValue - totalInvested;

    return {
      investedAmount: totalInvested,
      totalInterest,
      maturityValue,
      chartData: yearlyData,
      monthlyData,
      pieData: [
        { name: "Total Investment", value: totalInvested },
        { name: "Total Interest", value: totalInterest },
      ]
    };
  };

  const yearlyRes = useMemo(() => calculateGrowth(0, yearlyP, yearlyR, yearlyN), [yearlyP, yearlyR, yearlyN]);
  const lumpRes = useMemo(() => calculateGrowth(lumpP, 0, lumpR, lumpN), [lumpP, lumpR, lumpN]);
  const comboRes = useMemo(() => calculateGrowth(comboLump, comboYearly, comboR, comboN), [comboLump, comboYearly, comboR, comboN]);

  const CalculatorLayout = ({ results, inputs }: any) => (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-8 mt-6">
        {/* Input Section */}
        <div className="space-y-8">
          {inputs}
          
          <div className="grid grid-cols-2 gap-4 pt-6 border-t">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase text-muted-foreground">Total Investment</p>
              <p className="text-lg font-semibold">{formatCurrency(results.investedAmount)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase text-muted-foreground">Total Interest</p>
              <p className="text-lg font-semibold text-green-600">+{formatCurrency(results.totalInterest)}</p>
            </div>
            <div className="col-span-2 pt-2">
              <p className="text-xs font-bold uppercase text-muted-foreground">Maturity Value</p>
              <p className="text-3xl font-black text-primary">{formatCurrency(results.maturityValue)}</p>
            </div>
          </div>
        </div>

        {/* Visual Section */}
        <div className="space-y-6">
          <Tabs defaultValue="growth" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="growth"><TrendingUp className="mr-2 h-4 w-4" /> Growth</TabsTrigger>
              <TabsTrigger value="split"><PieChartIcon className="mr-2 h-4 w-4" /> Breakdown</TabsTrigger>
            </TabsList>
            
            <TabsContent value="growth" className="h-[350px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={results.chartData}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                  <YAxis tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`} />
                  <Tooltip formatter={(val: number) => formatCurrency(val)} labelFormatter={(label) => `Year ${label}`} />
                  <Area type="monotone" dataKey="balance" stroke="#10b981" fillOpacity={1} fill="url(#colorBalance)" name="Total Balance" />
                  <Area type="monotone" dataKey="invested" stroke="#94a3b8" fill="transparent" strokeDasharray="5 5" name="Invested" />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="split" className="h-[350px] pt-4">
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

      {/* Table Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Detailed Schedule</CardTitle>
            <CardDescription>View your wealth accumulation progress.</CardDescription>
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
                      <TableHead>Year</TableHead>
                      <TableHead className="text-right">Annual Deposit</TableHead>
                      <TableHead className="text-right">Interest Credited</TableHead>
                      <TableHead className="text-right">Closing Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.chartData.filter((d: any) => d.year > 0).map((row: any) => (
                      <TableRow key={row.year}>
                        <TableCell className="font-medium">Year {row.year}</TableCell>
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
                      <TableHead className="text-right">Deposit</TableHead>
                      <TableHead className="text-right">Accrued Interest</TableHead>
                      <TableHead className="text-right">Running Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.monthlyData.map((row: any) => (
                      <TableRow key={row.period}>
                        <TableCell className="font-medium">{row.label}</TableCell>
                        <TableCell className="text-right">{row.contribution > 0 ? formatCurrency(row.contribution) : "-"}</TableCell>
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calculator className="h-8 w-8 text-primary" />
          PPF Wealth Calculator
        </h1>
        <p className="text-muted-foreground">Estimate your maturity value based on Public Provident Fund rules (Compounded Annually).</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="yearly">
            <TabsList className="grid w-full grid-cols-3 max-w-[500px] mb-8">
              <TabsTrigger value="yearly">Yearly Investment</TabsTrigger>
              <TabsTrigger value="lumpsum">Previous Corpus</TabsTrigger>
              <TabsTrigger value="combo">Combo</TabsTrigger>
            </TabsList>

            {/* Yearly Investment */}
            <TabsContent value="yearly">
              <CalculatorLayout 
                results={yearlyRes}
                inputs={
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between"><Label>Yearly Investment</Label><span className="font-bold">{formatCurrency(yearlyP)}</span></div>
                      <Slider value={[yearlyP]} onValueChange={(v) => setYearlyP(v[0])} min={500} max={150000} step={500} />
                      <Input type="number" value={yearlyP} onChange={(e) => setYearlyP(Number(e.target.value))} />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between"><Label>Duration (Years)</Label><span className="font-bold">{yearlyN} Yr</span></div>
                      <Slider value={[yearlyN]} onValueChange={(v) => setYearlyN(v[0])} min={1} max={50} step={1} />
                    </div>
                    <div className="space-y-2">
                      <Label>Interest Rate (% p.a)</Label>
                      <Input type="number" value={yearlyR} onChange={(e) => setYearlyR(Number(e.target.value))} />
                    </div>
                  </div>
                }
              />
            </TabsContent>

            {/* Lumpsum */}
            <TabsContent value="lumpsum">
              <CalculatorLayout 
                results={lumpRes}
                inputs={
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between"><Label>Current Accumulated Corpus</Label><span className="font-bold">{formatCurrency(lumpP)}</span></div>
                      <Slider value={[lumpP]} onValueChange={(v) => setLumpP(v[0])} min={10000} max={10000000} step={10000} />
                      <Input type="number" value={lumpP} onChange={(e) => setLumpP(Number(e.target.value))} />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between"><Label>Time to Maturity (Years)</Label><span className="font-bold">{lumpN} Yr</span></div>
                      <Slider value={[lumpN]} onValueChange={(v) => setLumpN(v[0])} min={1} max={50} step={1} />
                    </div>
                    <div className="space-y-2">
                      <Label>Interest Rate (% p.a)</Label>
                      <Input type="number" value={lumpR} onChange={(e) => setLumpR(Number(e.target.value))} />
                    </div>
                  </div>
                }
              />
            </TabsContent>

            {/* Combo */}
            <TabsContent value="combo">
              <CalculatorLayout 
                results={comboRes}
                inputs={
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between"><Label>Initial Corpus</Label><span className="font-bold">{formatCurrency(comboLump)}</span></div>
                      <Slider value={[comboLump]} onValueChange={(v) => setComboLump(v[0])} min={0} max={5000000} step={10000} />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between"><Label>Additional Yearly Investment</Label><span className="font-bold">{formatCurrency(comboYearly)}</span></div>
                      <Slider value={[comboYearly]} onValueChange={(v) => setComboYearly(v[0])} min={0} max={150000} step={500} />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between"><Label>Duration (Years)</Label><span className="font-bold">{comboN} Yr</span></div>
                      <Slider value={[comboN]} onValueChange={(v) => setComboN(v[0])} min={1} max={50} step={1} />
                    </div>
                    <div className="space-y-2">
                      <Label>Interest Rate (% p.a)</Label>
                      <Input type="number" value={comboR} onChange={(e) => setComboR(Number(e.target.value))} />
                    </div>
                  </div>
                }
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PPFCalculator;