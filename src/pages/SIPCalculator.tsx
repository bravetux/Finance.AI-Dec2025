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
import ReportTable, { ReportRow } from "@/components/ReportTable";

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

  // --- Helper Functions ---

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  };

  // --- Report Generation Logic ---

  const generateSIPReport = (
    initialInvestment: number, // Lumpsum for combo, 0 for pure SIP
    periodicInvestment: number,
    r_annual: number, // Annual Return Rate (as a decimal)
    t_years: number, // Time Period (in years)
    f: Frequency, // Investment Frequency
    s: number, // Step-up Value
    s_type: StepUpType // Step-up Type
  ) => {
    const monthlyReport: ReportRow[] = [];
    const yearlyReport: ReportRow[] = [];

    const compoundingPeriods = f === "monthly" ? 12 : 1;
    const i_period = r_annual / compoundingPeriods; // Rate per period
    const i_month = r_annual / 12; // Monthly rate for monthly report
    const totalPeriods = t_years * compoundingPeriods;

    let currentBalance = initialInvestment;
    let totalInvested = initialInvestment;
    let totalReturns = 0;
    let currentPeriodicInvestment = periodicInvestment;

    let yearlyInvested = 0;
    let yearlyReturns = 0;

    for (let year = 1; year <= t_years; year++) {
      // Apply step-up at the start of the year (after year 1)
      if (year > 1) {
        if (s_type === "percentage") {
          currentPeriodicInvestment *= (1 + s / 100);
        } else if (s_type === "rupees") {
          currentPeriodicInvestment += s;
        }
      }

      yearlyInvested = 0;
      yearlyReturns = 0;

      for (let period = 1; period <= compoundingPeriods; period++) {
        const periodIndex = (year - 1) * compoundingPeriods + period;
        if (periodIndex > totalPeriods) break;

        // Investment is made at the start of the period (Annuity Due)
        const investmentThisPeriod = currentPeriodicInvestment;
        currentBalance += investmentThisPeriod;
        totalInvested += investmentThisPeriod;
        yearlyInvested += investmentThisPeriod;

        // Calculate returns for the period
        const returnsThisPeriod = currentBalance * i_period;
        currentBalance += returnsThisPeriod;
        totalReturns += returnsThisPeriod;
        yearlyReturns += returnsThisPeriod;

        // Monthly Report Generation (only if frequency is monthly)
        if (f === "monthly") {
          const monthIndex = (year - 1) * 12 + period;
          monthlyReport.push({
            period: monthIndex,
            label: `Month ${monthIndex}`,
            amountDeposited: investmentThisPeriod,
            returnsEarned: returnsThisPeriod,
            endBalance: currentBalance,
          });
        }
      }

      // Yearly Report Generation
      yearlyReport.push({
        period: year,
        label: `Year ${year}`,
        amountDeposited: yearlyInvested + (year === 1 ? initialInvestment : 0),
        returnsEarned: yearlyReturns + (year === 1 ? initialInvestment * (Math.pow(1 + r_annual, 1) - 1) : 0), // Simplified for yearly report
        endBalance: currentBalance,
      });
    }

    // If frequency is annual, the monthly report is just the yearly report broken down by month
    // For simplicity and accuracy, we will only show the monthly report if the investment frequency is monthly.
    // If frequency is annual, we will generate a simplified monthly view for the report.
    let finalMonthlyReport = monthlyReport;
    if (f === "annual") {
        // For annual SIP, we can't accurately show monthly returns on the SIP amount, 
        // so we'll just show the yearly report and keep the monthly report empty.
        // The user chose annual, so the detailed monthly breakdown is less relevant.
        finalMonthlyReport = [];
    }


    return {
      investedAmount: totalInvested,
      estimatedReturns: totalReturns,
      totalValue: currentBalance,
      yearlyReport,
      monthlyReport: finalMonthlyReport,
    };
  };

  // --- SIP Calculations (Updated to use generateSIPReport) ---

  const sipReportData = useMemo(() => {
    const r_annual = sipReturnRate / 100;
    return generateSIPReport(
      0, // initialInvestment
      monthlyInvestment,
      r_annual,
      sipTimePeriod,
      sipFrequency,
      sipStepUpValue,
      sipStepUpType
    );
  }, [monthlyInvestment, sipReturnRate, sipTimePeriod, sipFrequency, sipStepUpValue, sipStepUpType]);

  const sipCalculations = {
    investedAmount: sipReportData.investedAmount,
    estimatedReturns: sipReportData.estimatedReturns,
    totalValue: sipReportData.totalValue,
  };

  // --- Lumpsum Calculations (No Change) ---

  const lumpsumCalculations = useMemo(() => {
    const P = lumpsumInvestment;
    const r = lumpsumReturnRate / 100;
    const n = lumpsumTimePeriod;

    const totalValue = P * Math.pow(1 + r, n);
    const investedAmount = P;
    const estimatedReturns = totalValue - investedAmount;

    return { investedAmount, estimatedReturns, totalValue };
  }, [lumpsumInvestment, lumpsumReturnRate, lumpsumTimePeriod]);

  // --- Combo Calculations (Updated to use generateSIPReport) ---

  const comboReportData = useMemo(() => {
    const r_annual = comboReturnRate / 100;
    return generateSIPReport(
      comboLumpsum, // initialInvestment
      comboMonthlyInvestment,
      r_annual,
      comboTimePeriod,
      comboFrequency,
      comboStepUpValue,
      comboStepUpType
    );
  }, [comboLumpsum, comboMonthlyInvestment, comboReturnRate, comboTimePeriod, comboFrequency, comboStepUpValue, comboStepUpType]);

  const comboCalculations = {
    investedAmount: comboReportData.investedAmount,
    estimatedReturns: comboReportData.estimatedReturns,
    totalValue: comboReportData.totalValue,
  };

  // --- Chart Data ---

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
              <ReportTable yearlyData={sipReportData.yearlyReport} monthlyData={sipReportData.monthlyReport} />
            </TabsContent>

            {/* Lumpsum Calculator Content */}
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
              {/* Lumpsum Report Table (Simple yearly report) */}
              <ReportTable 
                yearlyData={[{
                  period: 1,
                  label: "Lumpsum",
                  amountDeposited: lumpsumCalculations.investedAmount,
                  returnsEarned: lumpsumCalculations.estimatedReturns,
                  endBalance: lumpsumCalculations.totalValue,
                }]} 
                monthlyData={[]} 
              />
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
              <ReportTable yearlyData={comboReportData.yearlyReport} monthlyData={comboReportData.monthlyReport} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SIPCalculator;