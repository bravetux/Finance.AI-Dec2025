"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Calculator } from "lucide-react";
import CalculatorInput from "@/components/CalculatorInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type Frequency = "monthly" | "annual";
type StepUpType = "rupees" | "percentage";

const SIPCalculator: React.FC = () => {
  // State for SIP Calculator
  const [monthlyInvestment, setMonthlyInvestment] = useState(25000);
  const [sipReturnRate, setSipReturnRate] = useState(12);
  const [sipTimePeriod, setSipTimePeriod] = useState(10);
  const [sipFrequency, setSipFrequency] = useState<Frequency>("monthly");
  const [sipStepUpValue, setSipStepUpValue] = useState(0); // Annual increase value
  const [sipStepUpType, setSipStepUpType] = useState<StepUpType>("percentage");

  // State for Lumpsum Calculator (no change needed here)
  const [lumpsumInvestment, setLumpsumInvestment] = useState(1000000);
  const [lumpsumReturnRate, setLumpsumReturnRate] = useState(12);
  const [lumpsumTimePeriod, setLumpsumTimePeriod] = useState(10);

  // State for Lumpsum + SIP Calculator
  const [comboLumpsum, setComboLumpsum] = useState(500000);
  const [comboMonthlyInvestment, setComboMonthlyInvestment] = useState(10000);
  const [comboReturnRate, setComboReturnRate] = useState(12);
  const [comboTimePeriod, setComboTimePeriod] = useState(10);
  const [comboFrequency, setComboFrequency] = useState<Frequency>("monthly");
  const [comboStepUpValue, setComboStepUpValue] = useState(0); // Annual increase value
  const [comboStepUpType, setComboStepUpType] = useState<StepUpType>("percentage");

  // --- Calculation Logic ---

  const calculateStepUpSIP = (
    P: number, // Periodic Investment
    r: number, // Annual Return Rate (as a decimal, e.g., 0.12)
    t: number, // Time Period (in years)
    f: Frequency, // Investment Frequency
    s: number, // Step-up Value
    s_type: StepUpType // Step-up Type
  ) => {
    const compoundingPeriods = f === "monthly" ? 12 : 1;
    const i = r / compoundingPeriods; // Rate per period
    const n_periods = t * compoundingPeriods; // Total number of periods
    const n_years = t;

    let totalValue = 0;
    let investedAmount = 0;

    // Step-up SIP calculation is done year by year
    for (let year = 1; year <= n_years; year++) {
      let currentInvestment = P;
      
      // Adjust investment for the current year based on step-up
      if (year > 1) {
        if (s_type === "percentage") {
          // P is the initial investment, which is stepped up annually
          currentInvestment = P * Math.pow(1 + s / 100, year - 1);
        } else { // rupees
          currentInvestment = P + s * (year - 1);
        }
      }

      // Calculate Future Value of the current year's investment
      // The investment is made for 'compoundingPeriods' times in this year.
      // The total compounding periods remaining for this year's investment is:
      // (n_years - year) * compoundingPeriods + compoundingPeriods (for the current year)
      const remainingPeriods = (n_years - year) * compoundingPeriods + compoundingPeriods;

      // Future Value of Annuity Due for the current year's investment
      let fv_year;
      if (i === 0) {
        fv_year = currentInvestment * compoundingPeriods;
      } else {
        fv_year = currentInvestment * (((Math.pow(1 + i, compoundingPeriods) - 1) / i) * (1 + i));
      }

      // Compound the year's FV for the remaining years
      const fv_compounded = fv_year * Math.pow(1 + r, n_years - year);
      totalValue += fv_compounded;
      
      // Calculate invested amount for the current year
      investedAmount += currentInvestment * compoundingPeriods;
    }

    const estimatedReturns = totalValue - investedAmount;
    return { investedAmount, estimatedReturns, totalValue };
  };

  const sipCalculations = useMemo(() => {
    const r_annual = sipReturnRate / 100;

    if (sipStepUpValue > 0) {
      return calculateStepUpSIP(
        monthlyInvestment,
        r_annual,
        sipTimePeriod,
        sipFrequency,
        sipStepUpValue,
        sipStepUpType
      );
    }

    // Standard SIP calculation (if no step-up)
    const P = monthlyInvestment;
    const compoundingPeriods = sipFrequency === "monthly" ? 12 : 1;
    const i = r_annual / compoundingPeriods;
    const n = sipTimePeriod * compoundingPeriods;

    if (n <= 0) {
      return { investedAmount: 0, estimatedReturns: 0, totalValue: 0 };
    }

    if (i === 0) {
      const totalValue = P * n;
      return { investedAmount: totalValue, estimatedReturns: 0, totalValue };
    }

    // Future Value of Annuity Due
    const totalValue = P * (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
    const investedAmount = P * n;
    const estimatedReturns = totalValue - investedAmount;

    return { investedAmount, estimatedReturns, totalValue };
  }, [monthlyInvestment, sipReturnRate, sipTimePeriod, sipFrequency, sipStepUpValue, sipStepUpType]);

  const lumpsumCalculations = useMemo(() => {
    const P = lumpsumInvestment;
    const r = lumpsumReturnRate / 100;
    const n = lumpsumTimePeriod;

    const totalValue = P * Math.pow(1 + r, n);
    const investedAmount = P;
    const estimatedReturns = totalValue - investedAmount;

    return { investedAmount, estimatedReturns, totalValue };
  }, [lumpsumInvestment, lumpsumReturnRate, lumpsumTimePeriod]);

  const comboCalculations = useMemo(() => {
    const L = comboLumpsum;
    const S = comboMonthlyInvestment;
    const r_annual = comboReturnRate / 100;
    const n_years = comboTimePeriod;

    // 1. Lumpsum part (compounded annually)
    const fvLumpsum = L * Math.pow(1 + r_annual, n_years);

    // 2. SIP part (with or without step-up)
    let sipResult;
    if (comboStepUpValue > 0) {
      sipResult = calculateStepUpSIP(
        S,
        r_annual,
        n_years,
        comboFrequency,
        comboStepUpValue,
        comboStepUpType
      );
    } else {
      // Standard SIP calculation
      const compoundingPeriods = comboFrequency === "monthly" ? 12 : 1;
      const i = r_annual / compoundingPeriods;
      const n = n_years * compoundingPeriods;

      if (n <= 0) {
        sipResult = { investedAmount: 0, estimatedReturns: 0, totalValue: 0 };
      } else if (i === 0) {
        const totalValue = S * n;
        sipResult = { investedAmount: totalValue, estimatedReturns: 0, totalValue };
      } else {
        // Future Value of Annuity Due
        const totalValue = S * (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
        const investedAmount = S * n;
        sipResult = { investedAmount, estimatedReturns: totalValue - investedAmount, totalValue };
      }
    }
    
    const totalValue = fvLumpsum + sipResult.totalValue;
    const investedAmount = L + sipResult.investedAmount;
    const estimatedReturns = totalValue - investedAmount;

    return { investedAmount, estimatedReturns, totalValue };
  }, [comboLumpsum, comboMonthlyInvestment, comboReturnRate, comboTimePeriod, comboFrequency, comboStepUpValue, comboStepUpType]);

  // --- Chart Data and Formatting ---

  const sipChartData = [
    { name: "Invested amount", value: sipCalculations.investedAmount },
    { name: "Est. returns", value: sipCalculations.estimatedReturns },
  ];

  const lumpsumChartData = [
    { name: "Invested amount", value: lumpsumCalculations.investedAmount },
    { name: "Est. returns", value: lumpsumCalculations.estimatedReturns },
  ];

  const comboChartData = [
    { name: "Invested amount", value: comboCalculations.investedAmount },
    { name: "Est. returns", value: comboCalculations.estimatedReturns },
  ];

  const COLORS = ["#E0E7FF", "#4F46E5"];

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  };

  // --- Component Render ---

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Calculator className="h-8 w-8" />
        SIP & Lumpsum Calculator
      </h1>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="sip">
            <TabsList className="grid w-full grid-cols-3 md:w-1/2">
              <TabsTrigger value="sip">SIP</TabsTrigger>
              <TabsTrigger value="lumpsum">Lumpsum</TabsTrigger>
              <TabsTrigger value="combo">Lumpsum + SIP</TabsTrigger>
            </TabsList>
            
            {/* SIP Calculator Content */}
            <TabsContent value="sip">
              <div className="grid md:grid-cols-2 gap-8 mt-6">
                <div className="space-y-8">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <CalculatorInput
                        label={sipFrequency === "monthly" ? "Monthly investment" : "Annual investment"}
                        value={monthlyInvestment}
                        onChange={setMonthlyInvestment}
                        min={500}
                        max={50000000}
                        step={500}
                        isCurrency
                      />
                    </div>
                    <div className="col-span-1">
                      <Label className="font-medium block mb-2">Frequency</Label>
                      <Select
                        value={sipFrequency}
                        onValueChange={(value) => setSipFrequency(value as Frequency)}
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
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <CalculatorInput
                        label={`Annual Step-up (${sipStepUpType === "percentage" ? "in %" : "in ₹"})`}
                        value={sipStepUpValue}
                        onChange={setSipStepUpValue}
                        min={0}
                        max={sipStepUpType === "percentage" ? 100 : 500000}
                        step={sipStepUpType === "percentage" ? 0.5 : 100}
                        isCurrency={sipStepUpType === "rupees"}
                      />
                    </div>
                    <div className="col-span-1">
                      <Label className="font-medium block mb-2">Type</Label>
                      <Select
                        value={sipStepUpType}
                        onValueChange={(value) => setSipStepUpType(value as StepUpType)}
                      >
                        <SelectTrigger className="text-lg h-12">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="rupees">Rupees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <CalculatorInput
                    label="Expected return rate (p.a)"
                    value={sipReturnRate}
                    onChange={setSipReturnRate}
                    min={1}
                    max={30}
                    step={0.5}
                    unit="%"
                  />
                  <CalculatorInput
                    label="Time period"
                    value={sipTimePeriod}
                    onChange={setSipTimePeriod}
                    min={1}
                    max={40}
                    step={1}
                    unit=" Yr"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={sipChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                        {sipChartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                      </Pie>
                      <Legend iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="w-full max-w-sm mt-6 space-y-2 text-lg">
                    <div className="flex justify-between"><span className="text-muted-foreground">Invested amount</span><span className="font-medium">{formatCurrency(sipCalculations.investedAmount)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Est. returns</span><span className="font-medium">{formatCurrency(sipCalculations.estimatedReturns)}</span></div>
                    <div className="flex justify-between border-t pt-2 mt-2"><span className="font-bold">Total value</span><span className="font-bold text-xl">{formatCurrency(sipCalculations.totalValue)}</span></div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Lumpsum Calculator Content (No change) */}
            <TabsContent value="lumpsum">
              <div className="grid md:grid-cols-2 gap-8 mt-6">
                <div className="space-y-8">
                  <CalculatorInput
                    label="Total investment"
                    value={lumpsumInvestment}
                    onChange={setLumpsumInvestment}
                    min={10000}
                    max={100000000}
                    step={10000}
                    isCurrency
                  />
                  <CalculatorInput
                    label="Expected return rate (p.a)"
                    value={lumpsumReturnRate}
                    onChange={setLumpsumReturnRate}
                    min={1}
                    max={30}
                    step={0.5}
                    unit="%"
                  />
                  <CalculatorInput
                    label="Time period"
                    value={lumpsumTimePeriod}
                    onChange={setLumpsumTimePeriod}
                    min={1}
                    max={40}
                    step={1}
                    unit=" Yr"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={lumpsumChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                        {lumpsumChartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                      </Pie>
                      <Legend iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="w-full max-w-sm mt-6 space-y-2 text-lg">
                    <div className="flex justify-between"><span className="text-muted-foreground">Invested amount</span><span className="font-medium">{formatCurrency(lumpsumCalculations.investedAmount)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Est. returns</span><span className="font-medium">{formatCurrency(lumpsumCalculations.estimatedReturns)}</span></div>
                    <div className="flex justify-between border-t pt-2 mt-2"><span className="font-bold">Total value</span><span className="font-bold text-xl">{formatCurrency(lumpsumCalculations.totalValue)}</span></div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Lumpsum + SIP Calculator Content */}
            <TabsContent value="combo">
              <div className="grid md:grid-cols-2 gap-8 mt-6">
                <div className="space-y-8">
                  <CalculatorInput
                    label="Initial Lumpsum"
                    value={comboLumpsum}
                    onChange={setComboLumpsum}
                    min={0}
                    max={5000000}
                    step={10000}
                    isCurrency
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <CalculatorInput
                        label={comboFrequency === "monthly" ? "Monthly Investment (SIP)" : "Annual Investment (SIP)"}
                        value={comboMonthlyInvestment}
                        onChange={setComboMonthlyInvestment}
                        min={0}
                        max={500000}
                        step={500}
                        isCurrency
                      />
                    </div>
                    <div className="col-span-1">
                      <Label className="font-medium block mb-2">Frequency</Label>
                      <Select
                        value={comboFrequency}
                        onValueChange={(value) => setComboFrequency(value as Frequency)}
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
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <CalculatorInput
                        label={`Annual Step-up (${comboStepUpType === "percentage" ? "in %" : "in ₹"})`}
                        value={comboStepUpValue}
                        onChange={setComboStepUpValue}
                        min={0}
                        max={comboStepUpType === "percentage" ? 100 : 500000}
                        step={comboStepUpType === "percentage" ? 0.5 : 100}
                        isCurrency={comboStepUpType === "rupees"}
                      />
                    </div>
                    <div className="col-span-1">
                      <Label className="font-medium block mb-2">Type</Label>
                      <Select
                        value={comboStepUpType}
                        onValueChange={(value) => setComboStepUpType(value as StepUpType)}
                      >
                        <SelectTrigger className="text-lg h-12">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="rupees">Rupees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <CalculatorInput
                    label="Expected return rate (p.a)"
                    value={comboReturnRate}
                    onChange={setComboReturnRate}
                    min={1}
                    max={30}
                    step={0.5}
                    unit="%"
                  />
                  <CalculatorInput
                    label="Time period"
                    value={comboTimePeriod}
                    onChange={setComboTimePeriod}
                    min={1}
                    max={40}
                    step={1}
                    unit=" Yr"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={comboChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                        {comboChartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                      </Pie>
                      <Legend iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="w-full max-w-sm mt-6 space-y-2 text-lg">
                    <div className="flex justify-between"><span className="text-muted-foreground">Invested amount</span><span className="font-medium">{formatCurrency(comboCalculations.investedAmount)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Est. returns</span><span className="font-medium">{formatCurrency(comboCalculations.estimatedReturns)}</span></div>
                    <div className="flex justify-between border-t pt-2 mt-2"><span className="font-bold">Total value</span><span className="font-bold text-xl">{formatCurrency(comboCalculations.totalValue)}</span></div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SIPCalculator;