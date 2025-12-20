"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [chartType, setChartType] = useState<'pie' | 'line'>('line');

  const { totalInvestment, estimatedReturns, totalValue, yearlyData } = useMemo(() => {
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

    // Calculate yearly data for Line Chart
    const data = [];
    let currentInvested = 0;
    let currentValue = 0;

    for (let year = 0; year <= timePeriod; year++) {
        if (year === 0) {
            data.push({
                year: 0,
                invested: 0,
                value: 0
            });
            continue;
        }
        
        const n = year * 12;
        const yearInvested = monthlyInvestment * n;
        const yearValue = (monthlyInvestment * (Math.pow(1 + monthlyRate, n) - 1) * (1 + monthlyRate)) / monthlyRate;
        
        data.push({
            year,
            invested: Math.round(yearInvested),
            value: Math.round(yearValue)
        });
    }

    return {
      totalInvestment: Math.round(invested),
      estimatedReturns: Math.round(returns),
      totalValue: Math.round(futureValue),
      yearlyData: data
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
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            SIP Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="monthly-investment">Monthly Investment</Label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input
                      id="monthly-investment"
                      type="number"
                      value={monthlyInvestment}
                      onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                      className="pl-7"
                    />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected-return">Expected Return Rate (p.a)</Label>
                <div className="relative">
                    <Input
                      id="expected-return"
                      type="number"
                      value={expectedReturn}
                      onChange={(e) => setExpectedReturn(Number(e.target.value))}
                      className="pr-7"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time-period">Time Period</Label>
                <div className="relative">
                    <Input
                      id="time-period"
                      type="number"
                      value={timePeriod}
                      onChange={(e) => setTimePeriod(Number(e.target.value))}
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">Years</span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Invested Amount</span>
                  <span className="font-semibold">{formatCurrency(totalInvestment)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Est. Returns</span>
                  <span className="font-semibold">{formatCurrency(estimatedReturns)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total Value</span>
                  <span className="text-primary">{formatCurrency(totalValue)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
               <div className="flex space-x-2 bg-muted p-1 rounded-lg">
                  <Button 
                    variant={chartType === 'line' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setChartType('line')}
                  >
                    Growth Chart
                  </Button>
                  <Button 
                    variant={chartType === 'pie' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setChartType('pie')}
                  >
                    Allocation
                  </Button>
               </div>

              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'pie' ? (
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                      </PieChart>
                  ) : (
                      <LineChart
                        data={yearlyData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                            dataKey="year" 
                            label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }} 
                        />
                        <YAxis 
                            tickFormatter={(value) => 
                                new Intl.NumberFormat('en-IN', { notation: "compact", compactDisplay: "short" }).format(value)
                            }
                        />
                        <Tooltip 
                            formatter={(value: number) => formatCurrency(value)}
                            labelFormatter={(label) => `Year ${label}`}
                        />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="invested" 
                            name="Invested Amount" 
                            stroke="#8884d8" 
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="value" 
                            name="Total Value" 
                            stroke="#82ca9d" 
                            strokeWidth={2}
                            dot={false}
                        />
                      </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SIPCalculator;