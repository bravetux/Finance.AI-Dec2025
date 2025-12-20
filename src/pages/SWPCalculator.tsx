"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, Clock, Wallet } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SWPReportTable, { SWPReportRow } from "@/components/SWPReportTable";

type Frequency = "monthly" | "annual";
type WithdrawalType = "rupees" | "percentage";
type CalcMode = "value" | "longevity";

const SWPCalculator: React.FC = () => {
  // State for SWP Calculator
  const [calcMode, setCalcMode] = useState<CalcMode>("value");
  const [initialInvestment, setInitialInvestment] = useState(5000000);
  const [returnRate, setReturnRate] = useState(8);
  const [inflationRate, setInflationRate] = useState(0); 
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
    inflation_rate: number, // Annual Inflation Rate (percentage)
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
    
    // Track the current withdrawal amount (it may increase due to inflation)
    let currentWithdrawalBase = w_value;
    
    // Track if funds depleted
    let depletionPeriod = -1;

    for (let year = 1; year <= t_years; year++) {
      // Apply annual inflation adjustment to the withdrawal amount at the start of each year (after year 1)
      if (year > 1 && w_type === "rupees" && inflation_rate > 0) {
        currentWithdrawalBase = currentWithdrawalBase * (1 + inflation_rate / 100);
      }

      let yearlyWithdrawn = 0;
      let yearlyReturns = 0;
      // let yearStartBalance = currentBalance; // Unused variable removed

      for (let period = 1; period <= periodsPerYear; period++) {
        const periodIndex = (year - 1) * periodsPerYear + period;
        
        if (currentBalance <= 0.1) { 
           if (depletionPeriod === -1) depletionPeriod = periodIndex - 1;
        }

        // 1. Calculate Withdrawal Amount
        let withdrawal;
        if (w_type === "rupees") {
          withdrawal = currentWithdrawalBase;
        } else { // percentage
          withdrawal = currentBalance * (w_value / 100);
        }
        
        // Ensure withdrawal doesn't exceed balance
        const actualWithdrawal = Math.min(withdrawal, Math.max(0, currentBalance));

        // 2. Apply Withdrawal
        currentBalance -= actualWithdrawal;
        totalWithdrawn += actualWithdrawal;
        yearlyWithdrawn += actualWithdrawal;

        // 3. Apply Returns (compounded on the remaining balance)
        const returnsThisPeriod = Math.max(0, currentBalance * r_period);
        currentBalance += returnsThisPeriod;
        totalReturns += returnsThisPeriod;
        yearlyReturns += returnsThisPeriod;

        // Monthly Report Generation
        if (w_frequency === "monthly") {
          monthlyReport.push({
            period: periodIndex,
            label: `Month ${periodIndex}`,
            withdrawal: actualWithdrawal,
            returnsEarned: returnsThisPeriod,
            endBalance: Math.max(0, currentBalance),
          });
        }
      }

      // Yearly Report Generation
      yearlyReport.push({
        period: year,
        label: `Year ${year}`,
        withdrawal: yearlyWithdrawn,
        returnsEarned: yearlyReturns,
        endBalance: Math.max(0, currentBalance),
      });

      if (currentBalance <= 0.1 && depletionPeriod === -1) {
          // If we depleted exactly at year end
          depletionPeriod = year * periodsPerYear;
      }
    }
    
    return {
      totalInvestment: P,
      totalWithdrawn,
      finalCorpus: Math.max(0, currentBalance),
      totalReturns,
      yearlyReport,
      monthlyReport: w_frequency === "annual" ? [] : monthlyReport,
      depletionPeriod, // Index of period (month or year depending on freq logic, but here we track total periods)
      periodsPerYear
    };
  };

  // --- SWP Calculations ---

  const swpReportData = useMemo(() => {
    const r_annual = returnRate / 100;
    
    // In Longevity mode, we simulate for a long time (e.g., 60 years) to find depletion
    // In Value mode, we simulate for the specific timePeriod
    const simulationYears = calcMode === "longevity" ? 60 : timePeriod;

    const data = generateSWPReport(
      initialInvestment,
      r_annual,
      inflationRate,
      simulationYears,
      withdrawalAmount,
      withdrawalType,
      withdrawalFrequency
    );

    // If in Longevity mode, we might want to slice the report data to where it hits 0
    if (calcMode === "longevity" && data.depletionPeriod !== -1) {
        // Find the index in report arrays
        const endYear = Math.ceil(data.depletionPeriod / data.periodsPerYear);
        data.yearlyReport = data.yearlyReport.slice(0, endYear);
        if (data.monthlyReport.length > 0) {
            data.monthlyReport = data.monthlyReport.slice(0, data.depletionPeriod);
        }
    }

    return data;
  }, [initialInvestment, returnRate, inflationRate, timePeriod, withdrawalAmount, withdrawalType, withdrawalFrequency, calcMode]);

  // --- Duration Formatter ---
  const formatDuration = (totalPeriods: number, freq: Frequency) => {
      if (totalPeriods === -1) return "More than 60 Years"; // Or Sustainable
      
      const periodsPerYear = freq === "monthly" ? 12 : 1;
      const years = Math.floor(totalPeriods / periodsPerYear);
      const remainingPeriods = totalPeriods % periodsPerYear;
      
      if (freq === "annual") return `${years} Years`;
      
      if (years === 0) return `${remainingPeriods} Months`;
      if (remainingPeriods === 0) return `${years} Years`;
      return `${years} Yrs ${remainingPeriods} Months`;
  };
  
  const longevityResult = useMemo(() => {
      if (calcMode !== "longevity") return null;
      return formatDuration(swpReportData.depletionPeriod, withdrawalFrequency);
  }, [swpReportData, withdrawalFrequency, calcMode]);


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
        SWP Calculator
      </h1>

      <Tabs 
        defaultValue="value" 
        value={calcMode} 
        onValueChange={(v) => setCalcMode(v as CalcMode)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="value" className="flex items-center gap-2">
            <Wallet className="w-4 h-4" /> Final Value
          </TabsTrigger>
          <TabsTrigger value="longevity" className="flex items-center gap-2">
            <Clock className="w-4 h-4" /> How Long Will It Last?
          </TabsTrigger>
        </TabsList>

        <Card>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-8">
                {/* Inputs */}
                <CalculatorInput
                  label="Initial Investment (Corpus)"
                  value={initialInvestment}
                  onChange={setInitialInvestment}
                  min={100000}
                  max={100000000}
                  step={100000}
                  isCurrency
                />
                <div className="grid grid-cols-2 gap-4">
                  <CalculatorInput
                    label="Return Rate (p.a)"
                    value={returnRate}
                    onChange={setReturnRate}
                    min={1}
                    max={30}
                    step={0.5}
                    unit="%"
                  />
                  <div className={withdrawalType === "percentage" ? "opacity-50 pointer-events-none" : ""}>
                     <CalculatorInput
                      label="Inflation Rate (p.a)"
                      value={inflationRate}
                      onChange={setInflationRate}
                      min={0}
                      max={20}
                      step={0.5}
                      unit="%"
                    />
                  </div>
                </div>

                {/* Hide Time Period in Longevity Mode */}
                {calcMode === "value" && (
                  <CalculatorInput
                    label="Time Period"
                    value={timePeriod}
                    onChange={setTimePeriod}
                    min={1}
                    max={40}
                    step={1}
                    unit=" Yr"
                  />
                )}
                
                {/* Withdrawal Options */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <CalculatorInput
                      label={`Withdrawal (${withdrawalFrequency === "monthly" ? "Per Month" : "Per Year"})`}
                      value={withdrawalAmount}
                      onChange={setWithdrawalAmount}
                      min={0}
                      max={withdrawalType === "percentage" ? 100 : 1000000000} 
                      step={0.01}
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
                {/* Dynamic Result Display */}
                {calcMode === "longevity" ? (
                   <div className="w-full max-w-sm mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-center space-y-2">
                      <p className="text-sm text-indigo-600 font-medium uppercase tracking-wide">Your Corpus Will Last</p>
                      <p className="text-3xl font-bold text-indigo-900">{longevityResult}</p>
                      <p className="text-xs text-muted-foreground">
                        {swpReportData.depletionPeriod === -1 
                          ? "Your returns exceed withdrawals. The corpus grows perpetually." 
                          : "Based on current inputs and inflation."}
                      </p>
                   </div>
                ) : null}

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
                  
                  {/* Final Corpus - Only relevant if not 0 */}
                  <div className="flex justify-between border-t pt-4 mt-4">
                    <span className="font-bold">Final Corpus Value</span>
                    <span className={`font-bold text-xl ${calculations.finalCorpus > 0 ? "text-green-600" : "text-gray-500"}`}>
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
      </Tabs>
    </div>
  );
};

export default SWPCalculator;