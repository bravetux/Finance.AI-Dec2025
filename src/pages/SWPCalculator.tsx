"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import CalculatorInput from "@/components/CalculatorInput";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import SWPReportTable, { SWPReportRow } from "@/components/SWPReportTable";

type Frequency = "monthly" | "annual";
type WithdrawalType = "rupees" | "percentage";

const SWPCalculator: React.FC = () => {
  // State for SWP Calculator
  const [initialInvestment, setInitialInvestment] = useState(5000000);
  const [returnRate, setReturnRate] = useState(8);
  const [timePeriod, setTimePeriod] = useState(15);
  const [withdrawalAmount, setWithdrawalAmount] = useState(30000);
  const [withdrawalFrequency, setWithdrawalFrequency] = useState<Frequency>("monthly");
  const [withdrawalType, setWithdrawalType] = useState<WithdrawalType>("rupees");

  // --- Helper Functions ---

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  };

  // --- Report Generation Logic ---

  const generateSWPReport = (
    P: number, // Initial Investment
    r_annual: number, // Annual Return Rate (as a decimal)
    t_years: number, // Time Period (in years)
    w_value: number, // Withdrawal Value (Rupees or Percentage)
    w_type: WithdrawalType,
    w_frequency: Frequency
  ) => {
    const monthlyReport: SWPReportRow[] = [];
    const yearlyReport: SWPReportRow[] = [];

    const periodsPerYear = w_frequency === "monthly" ? 12 : 1;
    const r_period = r_annual / periodsPerYear;
    const totalPeriods = t_years * periodsPerYear;

    let currentBalance = P;
    let totalWithdrawn = 0;
    let totalReturns = 0;

    for (let year = 1; year <= t_years; year++) {
      let yearlyWithdrawn = 0;
      let yearlyReturns = 0;
      let yearStartBalance = currentBalance;

      for (let period = 1; period <= periodsPerYear; period++) {
        const periodIndex = (year - 1) * periodsPerYear + period;
        if (periodIndex > totalPeriods) break;

        // 1. Calculate Withdrawal Amount
        let withdrawal;
        if (w_type === "rupees") {
          withdrawal = w_value;
        } else { // percentage
          // Withdrawal is a percentage of the current balance
          withdrawal = currentBalance * (w_value / 100);
        }
        
        // Ensure withdrawal doesn't exceed balance
        withdrawal = Math.min(withdrawal, currentBalance);

        // 2. Apply Withdrawal
        currentBalance -= withdrawal;
        totalWithdrawn += withdrawal;
        yearlyWithdrawn += withdrawal;

        // 3. Apply Returns (compounded on the remaining balance)
        const returnsThisPeriod = currentBalance * r_period;
        currentBalance += returnsThisPeriod;
        totalReturns += returnsThisPeriod;
        yearlyReturns += returnsThisPeriod;

        // Monthly Report Generation (only if frequency is monthly)
        if (w_frequency === "monthly") {
          const monthIndex = (year - 1) * 12 + period;
          monthlyReport.push({
            period: monthIndex,
            label: `Month ${monthIndex}`,
            withdrawal: withdrawal,
            returnsEarned: returnsThisPeriod,
            endBalance: currentBalance,
          });
        }
      }

      // Yearly Report Generation
      yearlyReport.push({
        period: year,
        label: `Year ${year}`,
        withdrawal: yearlyWithdrawn,
        returnsEarned: yearlyReturns,
        endBalance: currentBalance,
      });
    }

    // If withdrawal frequency is annual, the monthly report is empty
    const finalMonthlyReport = w_frequency === "annual" ? [] : monthlyReport;

    return {
      totalInvestment: P,
      totalWithdrawn,
      finalCorpus: currentBalance,
      totalReturns,
      yearlyReport,
      monthlyReport: finalMonthlyReport,
    };
  };

  // --- SWP Calculations (Updated to use generateSWPReport) ---

  const swpReportData = useMemo(() => {
    const r_annual = returnRate / 100;
    return generateSWPReport(
      initialInvestment,
      r_annual,
      timePeriod,
      withdrawalAmount,
      withdrawalType,
      withdrawalFrequency
    );
  }, [initialInvestment, returnRate, timePeriod, withdrawalAmount, withdrawalType, withdrawalFrequency]);

  const calculations = {
    totalInvestment: swpReportData.totalInvestment,
    totalWithdrawn: swpReportData.totalWithdrawn,
    finalCorpus: swpReportData.finalCorpus,
    totalReturns: swpReportData.totalReturns,
  };

  // --- Chart Data ---

  const chartData = [
    { name: "Total Withdrawn", value: calculations.totalWithdrawn },
    { name: "Final Corpus", value: calculations.finalCorpus },
  ];

  const COLORS = ["#4F46E5", "#E0E7FF"];

  // --- Component Render ---

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Calculator className="h-8 w-8" />
        SWP (Systematic Withdrawal Plan) Calculator
      </h1>

      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <CalculatorInput
                label="Initial Investment (Corpus)"
                value={initialInvestment}
                onChange={setInitialInvestment}
                min={100000}
                max={100000000}
                step={100000}
                isCurrency
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
              <CalculatorInput
                label="Time Period"
                value={timePeriod}
                onChange={setTimePeriod}
                min={1}
                max={40}
                step={1}
                unit=" Yr"
              />
              
              {/* Withdrawal Options */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <CalculatorInput
                    label={`Withdrawal (${withdrawalFrequency === "monthly" ? "Per Month" : "Per Year"})`}
                    value={withdrawalAmount}
                    onChange={setWithdrawalAmount}
                    min={0}
                    // Removed the practical limit for rupees by setting a very high max
                    max={withdrawalType === "percentage" ? 100 : 1000000000} 
                    step={withdrawalType === "percentage" ? 0.1 : 100}
                    isCurrency={withdrawalType === "rupees"}
                    unit={withdrawalType === "percentage" ? "%" : undefined}
                  />
                </div>
                <div className="col-span-1">
                  <Label className="font-medium block mb-2">Type</Label>
                  <Select
                    value={withdrawalType}
                    onValueChange={(value) => setWithdrawalType(value as WithdrawalType)}
                  >
                    <SelectTrigger className="text-lg h-12">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rupees">Rupees</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-3">
                  <Label className="font-medium block mb-2">Withdrawal Frequency</Label>
                  <Select
                    value={withdrawalFrequency}
                    onValueChange={(value) => setWithdrawalFrequency(value as Frequency)}
                  >
                    <SelectTrigger className="text-lg h-12">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Results and Chart */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-sm space-y-4 text-lg">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-bold">Initial Investment</span>
                  <span className="font-bold text-xl text-indigo-600">
                    {formatCurrency(calculations.totalInvestment)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Returns Earned</span>
                  <span className="font-medium">{formatCurrency(calculations.totalReturns)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount Withdrawn</span>
                  <span className="font-medium">{formatCurrency(calculations.totalWithdrawn)}</span>
                </div>
                <div className="flex justify-between border-t pt-4 mt-4">
                  <span className="font-bold">Final Corpus Value</span>
                  <span className="font-bold text-xl text-green-600">
                    {formatCurrency(calculations.finalCorpus)}
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
            </div>
          </div>
          
          {/* SWP Report Table Integration */}
          <SWPReportTable 
            yearlyData={swpReportData.yearlyReport} 
            monthlyData={swpReportData.monthlyReport} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SWPCalculator;