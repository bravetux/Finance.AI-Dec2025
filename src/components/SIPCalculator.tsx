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

const COLORS = ["#0088FE", "#00C49F"];

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [chartType, setChartType] = useState<'line' | 'pie'>('line');

  const { totalInvestment, estimatedReturns, totalValue, yearlyData } = useMemo(() => {
    const monthlyRate = expectedReturn / 12 / 100;
    const months = timePeriod * 12;
    
    // Future Value formula for SIP
    const futureValue =
      (monthlyInvestment *
        (Math.pow(1 + monthlyRate, months) - 1) *
        (1 + monthlyRate)) /
      monthlyRate;

    const invested = monthlyInvestment * months;
    const returns = futureValue - invested;

    // Generate yearly data points for the line chart
    const data = [];
    for (let year = 0; year <= timePeriod; year++) {
        if (year === 0) {
            data.push({ year: 0, invested: 0, value: 0 });
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
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">
            SIP Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="monthly-investment" className="text-base">Monthly Investment</Label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
                    <Input
                      id="monthly-investment"
                      type="number"
                      min="0"
                      value={monthlyInvestment}
                      onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                      className="pl-8 text-lg"
                    />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="expected-return" className="text-base">Expected Return Rate (p.a)</Label>
                <div className="relative">
                    <Input
                      id="expected-return"
                      type="number"
                      min="0"
                      value={expectedReturn}
                      onChange={(e) => setExpectedReturn(Number(e.target.value))}
                      className="pr-8 text-lg"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">%</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="time-period" className="text-base">Time Period</Label>
                <div className="relative">
                    <Input
                      id="time-period"
                      type="number"
                      min="0"
                      value={timePeriod}
                      onChange={(e) => setTimePeriod(Number(e.target.value))}
                      className="pr-16 text-lg"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">Years</span>
                </div>
              </div>

              <div className="pt-6 space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">Invested Amount</span>
                  <span className="font-bold text-lg">{formatCurrency(totalInvestment)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">Est. Returns</span>
                  <span className="font-bold text-lg text-green-600">{formatCurrency(estimatedReturns)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <span className="text-lg font-bold">Total Value</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(totalValue)}</span>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="flex flex-col space-y-6">
               <div className="flex justify-center p-1 bg-muted rounded-xl self-center">
                  <Button 
                    variant={chartType === 'line' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setChartType('line')}
                    className="rounded-lg px-6"
                  >
                    Growth Chart
                  </Button>
                  <Button 
                    variant={chartType === 'pie' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setChartType('pie')}
                    className="rounded-lg px-6"
                  >
                    Allocation
                  </Button>
               </div>

              <div className="flex-1 min-h-[350px] w-full border rounded-xl p-4 bg-card/50">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'pie' ? (
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={110}
                          fill="#8884d8"
                          paddingAngle={2}
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
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                  ) : (
                      <LineChart
                        data={yearlyData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 20,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                        <XAxis 
                            dataKey="year" 
                            label={{ value: 'Years', position: 'insideBottom', offset: -10 }} 
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis 
                            tickFormatter={(value) => 
                                new Intl.NumberFormat('en-IN', { notation: "compact", compactDisplay: "short" }).format(value)
                            }
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip 
                            formatter={(value: number) => [formatCurrency(value), ""]}
                            labelFormatter={(label) => `Year ${label}`}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Legend verticalAlign="top" height={36} />
                        <Line 
                            type="monotone" 
                            dataKey="invested" 
                            name="Invested Amount" 
                            stroke="#0088FE" 
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="value" 
                            name="Total Value" 
                            stroke="#00C49F" 
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                      </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                {chartType === 'line' 
                  ? "Projected wealth growth over time" 
                  : "Breakdown of principal vs interest"
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SIPCalculator;