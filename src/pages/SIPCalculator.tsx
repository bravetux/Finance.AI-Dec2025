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

const SIPCalculator: React.FC = () => {
  // State for SIP Calculator
  const [monthlyInvestment, setMonthlyInvestment] = useState(25000);
  const [sipReturnRate, setSipReturnRate] = useState(12);
  const [sipTimePeriod, setSipTimePeriod] = useState(10);
  const [sipFrequency, setSipFrequency] = useState<Frequency>("monthly");

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

  const sipCalculations = useMemo(() => {
    const P = monthlyInvestment;
    const compoundingPeriods = sipFrequency === "monthly" ? 12 : 1;
    const i = sipReturnRate / compoundingPeriods / 100;
    const n = sipTimePeriod * compoundingPeriods;

    if (n <= 0) {
      return { investedAmount: 0, estimatedReturns: 0, totalValue: 0 };
    }

    if (i === 0) {
      const totalValue = P * n;
      return { investedAmount: totalValue, estimatedReturns: 0, totalValue };
    }

    // Future Value of Annuity Due (investment at the start of the period)
    const totalValue = P * (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
    const investedAmount = P * n;
    const estimatedReturns = totalValue - investedAmount;

    return { investedAmount, estimatedReturns, totalValue };
  }, [monthlyInvestment, sipReturnRate, sipTimePeriod, sipFrequency]);

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
    const compoundingPeriods = comboFrequency === "monthly" ? 12 : 1;
    const i = comboReturnRate / compoundingPeriods / 100;
    const n = comboTimePeriod * compoundingPeriods;

    if (n <= 0) {
      const invested = L + S * n;
      return { investedAmount: invested, estimatedReturns: 0, totalValue: invested };
    }

    // Lumpsum part (compounded annually)
    const r_annual = comboReturnRate / 100;
    const n_years = comboTimePeriod;
    const fvLumpsum = L * Math.pow(1 + r_annual, n_years);

    // SIP part (compounded based on frequency)
    let fvSip;
    if (i === 0) {
      fvSip = S * n;
    } else {
      // Future Value of Annuity Due
      fvSip = S * (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
    }
    
    const totalValue = fvLumpsum + fvSip;
    const investedAmount = L + (S * n);
    const estimatedReturns = totalValue - investedAmount;

    return { investedAmount, estimatedReturns, totalValue };
  }, [comboLumpsum, comboMonthlyInvestment, comboReturnRate, comboTimePeriod, comboFrequency]);

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