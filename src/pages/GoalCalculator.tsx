"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import CalculatorInput from "@/components/CalculatorInput";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const GoalCalculator: React.FC = () => {
  // State for Goal Calculator
  const [goalCost, setGoalCost] = useState(5000000);
  const [amountSaved, setAmountSaved] = useState(500000);
  const [timePeriod, setTimePeriod] = useState(10);
  const [inflationRate, setInflationRate] = useState(6);
  const [returnRate, setReturnRate] = useState(12);

  const calculations = useMemo(() => {
    const C = goalCost;
    const S = amountSaved;
    const t = timePeriod;
    const i = inflationRate / 100;
    const r = returnRate / 100;

    // 1. Future Value of Goal Cost (Adjusted for Inflation)
    const futureGoalCost = C * Math.pow(1 + i, t);

    // 2. Future Value of Amount Already Saved
    const fvSavedAmount = S * Math.pow(1 + r, t);

    // 3. Required Corpus (Amount needed to be accumulated via SIP)
    const requiredCorpus = Math.max(0, futureGoalCost - fvSavedAmount);

    // 4. Required Monthly SIP (Future Value of Annuity Due formula rearranged)
    // FV = P * [((1+r)^n - 1) / r] * (1+r)
    // P = FV / ([((1+r)^n - 1) / r] * (1+r))
    const r_monthly = r / 12;
    const n_months = t * 12;

    let requiredMonthlySIP = 0;
    if (requiredCorpus > 0 && n_months > 0) {
      if (r_monthly === 0) {
        requiredMonthlySIP = requiredCorpus / n_months;
      } else {
        const factor = ((Math.pow(1 + r_monthly, n_months) - 1) / r_monthly) * (1 + r_monthly);
        requiredMonthlySIP = requiredCorpus / factor;
      }
    }

    // 5. Total Investment (SIP + Saved Amount)
    const totalSIPInvestment = requiredMonthlySIP * n_months;
    const totalInvestment = S + totalSIPInvestment;

    // 6. Total Returns
    const totalReturns = futureGoalCost - totalInvestment;

    return {
      futureGoalCost,
      fvSavedAmount,
      requiredCorpus,
      requiredMonthlySIP,
      totalInvestment,
      totalReturns,
      totalSIPInvestment,
    };
  }, [goalCost, amountSaved, timePeriod, inflationRate, returnRate]);

  const chartData = [
    { name: "Amount Already Saved (FV)", value: calculations.fvSavedAmount },
    { name: "SIP Contribution (FV)", value: calculations.requiredCorpus },
  ];

  const COLORS = ["#E0E7FF", "#4F46E5"];

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Calculator className="h-8 w-8" />
        Financial Goal Calculator
      </h1>

      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <CalculatorInput
                label="Current Goal Cost"
                value={goalCost}
                onChange={setGoalCost}
                min={10000}
                max={100000000}
                step={10000}
                isCurrency
              />
              <CalculatorInput
                label="Amount Already Saved"
                value={amountSaved}
                onChange={setAmountSaved}
                min={0}
                max={100000000}
                step={10000}
                isCurrency
              />
              <CalculatorInput
                label="Time Period"
                value={timePeriod}
                onChange={setTimePeriod}
                min={1}
                max={40}
                step={1}
                unit=" Yr"
              />
              <CalculatorInput
                label="Expected Inflation Rate"
                value={inflationRate}
                onChange={setInflationRate}
                min={1}
                max={20}
                step={0.1}
                unit="%"
              />
              <CalculatorInput
                label="Expected Return Rate (p.a)"
                value={returnRate}
                onChange={setReturnRate}
                min={1}
                max={30}
                step={0.5}
                unit="%"
              />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full max-w-sm space-y-4 text-lg">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-bold">Future Goal Cost</span>
                  <span className="font-bold text-xl text-indigo-600">
                    {formatCurrency(calculations.futureGoalCost)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">FV of Saved Amount</span>
                  <span className="font-medium">{formatCurrency(calculations.fvSavedAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Required Corpus via SIP</span>
                  <span className="font-medium">{formatCurrency(calculations.requiredCorpus)}</span>
                </div>
                <div className="flex justify-between border-t pt-4 mt-4">
                  <span className="font-bold">Required Monthly SIP</span>
                  <span className="font-bold text-xl text-green-600">
                    {formatCurrency(calculations.requiredMonthlySIP)}
                  </span>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={250} className="mt-8">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="w-full max-w-sm mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total SIP Investment</span>
                  <span className="font-medium">{formatCurrency(calculations.totalSIPInvestment)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Investment (Saved + SIP)</span>
                  <span className="font-medium">{formatCurrency(calculations.totalInvestment)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Returns Earned</span>
                  <span className="font-medium">{formatCurrency(calculations.totalReturns)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalCalculator;