"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#10b981", "#3b82f6"];

const SWPCalculator = () => {
  const [calculationType, setCalculationType] = useState<"finalValue" | "duration">("finalValue");
  const [initialInvestment, setInitialInvestment] = useState(1000000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [inflationRate, setInflationRate] = useState(6);
  const [years, setYears] = useState(10);

  const formatWithCommas = (value: number) => {
    return new Intl.NumberFormat("en-IN").format(value);
  };

  const { totalWithdrawal, finalBalance, chartData, durationMonths } = useMemo(() => {
    const monthlyRate = expectedReturn / 12 / 100;
    let currentBalance = initialInvestment;
    let totalWithdrawn = 0;
    let currentMonthlyWithdrawal = monthlyWithdrawal;
    const yearlyData = [];
    
    const maxYears = calculationType === "finalValue" ? years : 100;
    let monthsElapsed = 0;

    for (let y = 1; y <= maxYears; y++) {
      const beginningCorpus = currentBalance;
      let annualInterest = 0;
      let annualWithdrawal = 0;

      for (let m = 1; m <= 12; m++) {
        const interest = currentBalance * monthlyRate;
        const possibleWithdrawal = Math.min(currentBalance + interest, currentMonthlyWithdrawal);
        
        annualInterest += interest;
        annualWithdrawal += possibleWithdrawal;
        currentBalance = currentBalance + interest - possibleWithdrawal;
        monthsElapsed++;

        if (currentBalance <= 0) {
          currentBalance = 0;
          break;
        }
      }

      yearlyData.push({
        year: y,
        beginningCorpus: Math.round(beginningCorpus),
        annualInterest: Math.round(annualInterest),
        annualWithdrawal: Math.round(annualWithdrawal),
        yearEndBalance: Math.round(currentBalance),
        // For chart compatibility
        balance: Math.round(currentBalance)
      });

      totalWithdrawn += annualWithdrawal;
      
      if (currentBalance <= 0) break;
      
      // Step up for next year
      currentMonthlyWithdrawal *= (1 + inflationRate / 100);
    }

    return {
      totalWithdrawal: Math.round(totalWithdrawn),
      finalBalance: Math.round(currentBalance),
      chartData: yearlyData,
      durationMonths: monthsElapsed
    };
  }, [initialInvestment, monthlyWithdrawal, expectedReturn, inflationRate, years, calculationType]);

  const pieData = [
    { name: "Final Balance", value: finalBalance },
    { name: "Total Withdrawn", value: totalWithdrawal },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">SWP Calculator</h1>
          <p className="text-muted-foreground">
            Plan your Systematic Withdrawal Plan and see how long your money lasts
          </p>
        </div>

        <Tabs value={calculationType} onValueChange={(v) => setCalculationType(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="finalValue">Final Value</TabsTrigger>
            <TabsTrigger value="duration">How long will it last?</TabsTrigger>
          </TabsList>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="initialInvestment">Initial Investment (₹)</Label>
                  <Input
                    id="initialInvestment"
                    type="text"
                    value={formatWithCommas(initialInvestment)}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      setInitialInvestment(Number(val));
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyWithdrawal">Monthly Withdrawal (₹)</Label>
                  <Input
                    id="monthlyWithdrawal"
                    type="text"
                    value={formatWithCommas(monthlyWithdrawal)}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      setMonthlyWithdrawal(Number(val));
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedReturn">Expected Return Rate (p.a %)</Label>
                  <Input
                    id="expectedReturn"
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inflationRate">Expected Inflation Rate (p.a %)</Label>
                  <Input
                    id="inflationRate"
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">Adjusts withdrawal amount annually</p>
                </div>

                {calculationType === "finalValue" && (
                  <div className="space-y-2">
                    <Label htmlFor="years">Time Period (Years)</Label>
                    <Input
                      id="years"
                      type="number"
                      value={years}
                      onChange={(e) => setYears(Number(e.target.value))}
                    />
                  </div>
                )}

                <div className="pt-6 space-y-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Withdrawn</span>
                    <span className="font-semibold text-lg text-emerald-600">{formatCurrency(totalWithdrawal)}</span>
                  </div>
                  {calculationType === "finalValue" ? (
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-bold">Final Balance</span>
                      <span className="font-bold text-2xl text-primary">{formatCurrency(finalBalance)}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-bold">Lasts For</span>
                      <span className="font-bold text-2xl text-primary">
                        {Math.floor(durationMonths / 12)}y {durationMonths % 12}m
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="balance" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="balance">Balance Over Time</TabsTrigger>
                    <TabsTrigger value="split">Withdrawal Split</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="balance">
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis 
                            dataKey="year" 
                            label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                          />
                          <YAxis 
                            tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                          />
                          <Tooltip 
                            formatter={(value: number) => formatCurrency(value)}
                            labelFormatter={(label) => `Year ${label}`}
                          />
                          <Area
                            type="monotone"
                            dataKey="balance"
                            stroke="#3b82f6"
                            fillOpacity={1}
                            fill="url(#colorBalance)"
                            name="Balance"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="split">
                    <div className="h-[300px] w-full">
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
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Detailed Report</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead>Beginning Corpus</TableHead>
                    <TableHead>Annual Withdrawal ({inflationRate}% Step-up)</TableHead>
                    <TableHead>Expected Return ({expectedReturn}%)</TableHead>
                    <TableHead className="text-right">Year-End Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chartData.map((row) => (
                    <TableRow key={row.year}>
                      <TableCell className="font-medium">Year {row.year}</TableCell>
                      <TableCell>{formatCurrency(row.beginningCorpus)}</TableCell>
                      <TableCell className="text-red-500">{formatCurrency(row.annualWithdrawal)}</TableCell>
                      <TableCell className="text-emerald-600">{formatCurrency(row.annualInterest)}</TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(row.yearEndBalance)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
};

export default SWPCalculator;