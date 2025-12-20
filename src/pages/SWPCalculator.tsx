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
  const [initialInvestment, setInitialInvestment] = useState(1000000);
  const [withdrawalPerMonth, setWithdrawalPerMonth] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);

  const formatWithCommas = (value: number) => {
    return new Intl.NumberFormat("en-IN").format(value);
  };

  const { totalWithdrawal, finalValue, chartData } = useMemo(() => {
    const monthlyRate = expectedReturn / 12 / 100;
    const months = timePeriod * 12;
    let currentBalance = initialInvestment;
    let totalWithdrawn = 0;
    const data = [];

    data.push({
      year: 0,
      balance: Math.round(currentBalance),
      withdrawn: 0,
    });

    for (let month = 1; month <= months; month++) {
      const interest = currentBalance * monthlyRate;
      currentBalance = currentBalance + interest - withdrawalPerMonth;
      totalWithdrawn += withdrawalPerMonth;

      if (month % 12 === 0) {
        data.push({
          year: month / 12,
          balance: Math.max(0, Math.round(currentBalance)),
          withdrawn: Math.round(totalWithdrawn),
        });
      }

      if (currentBalance <= 0) {
        // If balance hits zero, add the final year and break
        const finalYear = Math.ceil(month / 12);
        if (month % 12 !== 0) {
          data.push({
            year: finalYear,
            balance: 0,
            withdrawn: Math.round(totalWithdrawn),
          });
        }
        break;
      }
    }

    return {
      totalWithdrawal: Math.round(totalWithdrawn),
      finalValue: Math.max(0, Math.round(currentBalance)),
      chartData: data,
    };
  }, [initialInvestment, withdrawalPerMonth, expectedReturn, timePeriod]);

  const pieData = [
    { name: "Total Withdrawal", value: totalWithdrawal },
    { name: "Final Value", value: finalValue },
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
            Plan your Systematic Withdrawal Plan and see how long your corpus lasts
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="initialInvestment">Initial Investment (Corpus) (₹)</Label>
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
                <Label htmlFor="withdrawalPerMonth">Withdrawal (Per Month) (₹)</Label>
                <Input
                  id="withdrawalPerMonth"
                  type="text"
                  value={formatWithCommas(withdrawalPerMonth)}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setWithdrawalPerMonth(Number(val));
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
                <Label htmlFor="timePeriod">Time Period (Years)</Label>
                <Input
                  id="timePeriod"
                  type="number"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(Number(e.target.value))}
                />
              </div>

              <div className="pt-6 space-y-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Withdrawal</span>
                  <span className="font-semibold text-lg">{formatCurrency(totalWithdrawal)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-bold">Final Value (Balance)</span>
                  <span className="font-bold text-2xl text-primary">{formatCurrency(finalValue)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Corpus Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="growth" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="growth">Balance Projection</TabsTrigger>
                  <TabsTrigger value="allocation">Allocation</TabsTrigger>
                </TabsList>
                
                <TabsContent value="growth">
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
                          name="Remaining Balance"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="allocation">
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

        <Card>
          <CardHeader>
            <CardTitle>Detailed Report</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead>Total Withdrawn</TableHead>
                  <TableHead className="text-right">Remaining Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chartData.map((row) => (
                  <TableRow key={row.year}>
                    <TableCell className="font-medium">Year {row.year}</TableCell>
                    <TableCell>{formatCurrency(row.withdrawn)}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(row.balance)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SWPCalculator;