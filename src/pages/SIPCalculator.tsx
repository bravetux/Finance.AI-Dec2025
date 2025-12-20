"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);

  const { totalInvestment, estimatedReturns, totalValue, chartData } = useMemo(() => {
    const monthlyRate = expectedReturn / 12 / 100;
    const months = timePeriod * 12;
    const invested = monthlyInvestment * months;
    
    // Future Value formula for SIP: P * [ (1+i)^n - 1 ] * (1+i) / i
    const futureValue =
      (monthlyInvestment *
        (Math.pow(1 + monthlyRate, months) - 1) *
        (1 + monthlyRate)) /
      monthlyRate;

    const returns = futureValue - invested;

    const data = [];
    for (let i = 0; i <= timePeriod; i++) {
      const currentMonths = i * 12;
      const currentInvested = monthlyInvestment * currentMonths;
      const currentTotal = currentMonths === 0 ? 0 : 
        (monthlyInvestment * (Math.pow(1 + monthlyRate, currentMonths) - 1) * (1 + monthlyRate)) / monthlyRate;
      
      data.push({
        year: i,
        invested: Math.round(currentInvested),
        returns: Math.round(currentTotal - currentInvested),
        total: Math.round(currentTotal),
      });
    }

    return {
      totalInvestment: Math.round(invested),
      estimatedReturns: Math.round(returns),
      totalValue: Math.round(futureValue),
      chartData: data,
    };
  }, [monthlyInvestment, expectedReturn, timePeriod]);

  const pieData = [
    { name: "Invested Amount", value: totalInvestment },
    { name: "Est. Returns", value: estimatedReturns },
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
          <h1 className="text-3xl font-bold">SIP Calculator</h1>
          <p className="text-muted-foreground">
            Calculate how much wealth you can create through Systematic Investment Plan
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Investment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="monthlyInvestment">Monthly Investment (₹)</Label>
                <Input
                  id="monthlyInvestment"
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
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
                  <span className="text-muted-foreground">Invested Amount</span>
                  <span className="font-semibold text-lg">{formatCurrency(totalInvestment)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Estimated Returns</span>
                  <span className="font-semibold text-lg text-emerald-600">{formatCurrency(estimatedReturns)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-bold">Total Value</span>
                  <span className="font-bold text-2xl text-primary">{formatCurrency(totalValue)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Growth Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="growth" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="growth">Wealth Growth</TabsTrigger>
                  <TabsTrigger value="allocation">Allocation</TabsTrigger>
                </TabsList>
                
                <TabsContent value="growth">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
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
                          dataKey="total"
                          stroke="#3b82f6"
                          fillOpacity={1}
                          fill="url(#colorTotal)"
                          name="Total Value"
                        />
                        <Area
                          type="monotone"
                          dataKey="invested"
                          stroke="#94a3b8"
                          fill="transparent"
                          name="Invested Amount"
                          strokeDasharray="5 5"
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
      </div>
    </div>
  );
};

export default SIPCalculator;