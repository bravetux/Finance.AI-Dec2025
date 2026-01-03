"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Home, DollarSign, TrendingUp, ArrowRightLeft } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const BUY_VS_RENT_STATE_KEY = 'buyVsRentCalculatorState';

interface BuyVsRentInputs {
  propertyPrice: number;
  downPaymentPercent: number;
  loanInterestRate: number;
  loanTenure: number;
  propertyTaxAnnual: number;
  maintenanceAnnual: number;
  appreciationRate: number;
  
  initialRentMonthly: number;
  rentIncreaseRate: number;
  investmentReturnRate: number;
  comparisonYears: number;
}

const initialInputs: BuyVsRentInputs = {
  propertyPrice: 5000000,
  downPaymentPercent: 20,
  loanInterestRate: 8.5,
  loanTenure: 20,
  propertyTaxAnnual: 10000,
  maintenanceAnnual: 12000,
  appreciationRate: 5,
  
  initialRentMonthly: 15000,
  rentIncreaseRate: 5,
  investmentReturnRate: 12,
  comparisonYears: 15,
};

const BuyVsRentCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<BuyVsRentInputs>(() => {
    try {
      const saved = localStorage.getItem(BUY_VS_RENT_STATE_KEY);
      return saved ? JSON.parse(saved) : initialInputs;
    } catch {
      return initialInputs;
    }
  });

  useEffect(() => {
    localStorage.setItem(BUY_VS_RENT_STATE_KEY, JSON.stringify(inputs));
  }, [inputs]);

  const handleInputChange = (field: keyof BuyVsRentInputs, value: string | number) => {
    setInputs(prev => ({ ...prev, [field]: Number(value) || 0 }));
  };

  const formatCurrency = (value: number) => `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const calculations = useMemo(() => {
    const { 
      propertyPrice, downPaymentPercent, loanInterestRate, loanTenure, propertyTaxAnnual, maintenanceAnnual, appreciationRate,
      initialRentMonthly, rentIncreaseRate, investmentReturnRate, comparisonYears
    } = inputs;

    const downPayment = propertyPrice * (downPaymentPercent / 100);
    const loanAmount = propertyPrice - downPayment;
    const r_loan = loanInterestRate / 12 / 100;
    const n_loan = loanTenure * 12;
    
    // EMI Calculation
    const emi = loanAmount > 0 && r_loan > 0 && n_loan > 0
      ? (loanAmount * r_loan * Math.pow(1 + r_loan, n_loan)) / (Math.pow(1 + r_loan, n_loan) - 1)
      : 0;
    
    const r_invest = investmentReturnRate / 12 / 100;
    const r_appreciation = appreciationRate / 100;
    const r_rent_increase = rentIncreaseRate / 100;

    const chartData = [];
    
    let currentRent = initialRentMonthly;
    let rentInvestmentCorpus = downPayment; // Initial investment is the down payment saved
    let currentPropertyValue = propertyPrice;
    let totalInterestPaid = 0;
    let totalRentPaid = 0;

    for (let y = 1; y <= comparisonYears; y++) {
      let annualRentPaid = 0;
      let annualPropertyCost = propertyTaxAnnual + maintenanceAnnual;
      let annualEMI = 0;
      let annualInterest = 0;
      
      // Monthly simulation for the year
      for (let m = 1; m <= 12; m++) {
        // Buying Path: EMI (only if loan tenure hasn't ended)
        if (y <= loanTenure) {
          annualEMI += emi;
          // Simplified interest calculation for annual reporting
          annualInterest += (loanAmount * r_loan * 12) / loanTenure; 
        }

        // Renting Path: Rent payment
        annualRentPaid += currentRent;
        
        // Renting Path: Calculate the difference to invest
        const monthlyBuyingCost = (y <= loanTenure ? emi : 0) + (annualPropertyCost / 12);
        const monthlyRentingCost = currentRent;
        
        const monthlyDifference = monthlyBuyingCost - monthlyRentingCost;
        
        // Invest the difference (or withdraw if renting is more expensive)
        if (monthlyDifference > 0) {
            rentInvestmentCorpus += monthlyDifference;
        } else {
            // If renting is more expensive, assume the difference is covered by the corpus
            rentInvestmentCorpus += monthlyDifference;
        }
        
        // Apply monthly return to the corpus
        rentInvestmentCorpus *= (1 + r_invest);
      }
      
      totalInterestPaid += annualInterest;
      totalRentPaid += annualRentPaid;

      // Annual Property Value Appreciation
      currentPropertyValue *= (1 + r_appreciation);
      
      // Annual Rent Increase for next year
      currentRent *= (1 + r_rent_increase);

      // Buying Path Net Worth: Property Value - Remaining Loan (Simplified: Loan reduces linearly)
      const remainingLoan = y < loanTenure ? loanAmount * (1 - y / loanTenure) : 0;
      const buyingNetWorth = currentPropertyValue - remainingLoan;
      
      // Renting Path Net Worth: Investment Corpus
      const rentingNetWorth = rentInvestmentCorpus;

      chartData.push({
        year: y,
        BuyingNetWorth: Math.round(buyingNetWorth),
        RentingNetWorth: Math.round(rentingNetWorth),
      });
    }

    const finalBuyingNetWorth = chartData[chartData.length - 1]?.BuyingNetWorth || 0;
    const finalRentingNetWorth = chartData[chartData.length - 1]?.RentingNetWorth || 0;

    return {
      emi: Math.round(emi),
      downPayment: Math.round(downPayment),
      totalInterestPaid: Math.round(totalInterestPaid),
      totalRentPaid: Math.round(totalRentPaid),
      finalBuyingNetWorth,
      finalRentingNetWorth,
      chartData,
    };
  }, [inputs]);

  const verdict = calculations.finalBuyingNetWorth > calculations.finalRentingNetWorth ? "Buying Wins" : "Renting & Investing Wins";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <ArrowRightLeft className="h-8 w-8 text-primary" />
        Buy vs. Rent Calculator
      </h1>
      <CardDescription>
        Compare the long-term financial outcome of buying a property versus renting and investing the difference.
      </CardDescription>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Inputs */}
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <h3 className="font-semibold text-blue-600">Buying Path</h3>
            <div className="space-y-2">
              <Label>Property Price (₹)</Label>
              <Input type="number" value={inputs.propertyPrice} onChange={(e) => handleInputChange('propertyPrice', e.target.value)} />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between"><Label>Down Payment (%)</Label><span className="font-bold">{inputs.downPaymentPercent}%</span></div>
              <Slider value={[inputs.downPaymentPercent]} onValueChange={(v) => handleInputChange('downPaymentPercent', v[0])} min={0} max={50} step={5} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Loan Rate (%)</Label><Input type="number" value={inputs.loanInterestRate} onChange={(e) => handleInputChange('loanInterestRate', e.target.value)} /></div>
              <div className="space-y-2"><Label>Loan Tenure (Yrs)</Label><Input type="number" value={inputs.loanTenure} onChange={(e) => handleInputChange('loanTenure', e.target.value)} /></div>
            </div>
            <div className="space-y-2"><Label>Annual Appreciation (%)</Label><Input type="number" value={inputs.appreciationRate} onChange={(e) => handleInputChange('appreciationRate', e.target.value)} /></div>
            <div className="space-y-2"><Label>Annual Tax + Maintenance (₹)</Label><Input type="number" value={inputs.propertyTaxAnnual + inputs.maintenanceAnnual} onChange={(e) => handleInputChange('propertyTaxAnnual', Number(e.target.value) / 2)} /></div>
            
            <h3 className="font-semibold text-green-600 pt-4 border-t">Renting Path</h3>
            <div className="space-y-2"><Label>Initial Monthly Rent (₹)</Label><Input type="number" value={inputs.initialRentMonthly} onChange={(e) => handleInputChange('initialRentMonthly', e.target.value)} /></div>
            <div className="space-y-2"><Label>Annual Rent Increase (%)</Label><Input type="number" value={inputs.rentIncreaseRate} onChange={(e) => handleInputChange('rentIncreaseRate', e.target.value)} /></div>
            <div className="space-y-2"><Label>Investment Return Rate (%)</Label><Input type="number" value={inputs.investmentReturnRate} onChange={(e) => handleInputChange('investmentReturnRate', e.target.value)} /></div>
            
            <h3 className="font-semibold pt-4 border-t">Comparison</h3>
            <div className="space-y-2"><Label>Comparison Period (Years)</Label><Input type="number" value={inputs.comparisonYears} onChange={(e) => handleInputChange('comparisonYears', e.target.value)} /></div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-500/20">
              <CardHeader className="p-4 pb-2"><CardDescription className="text-xs uppercase font-bold">Buying Path Net Worth</CardDescription><Home className="h-4 w-4 text-blue-600" /></CardHeader>
              <CardContent className="p-4 pt-0"><div className="text-2xl font-bold text-blue-600">{formatCurrency(calculations.finalBuyingNetWorth)}</div><p className="text-xs text-muted-foreground">After {inputs.comparisonYears} years</p></CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-950/20 border-green-500/20">
              <CardHeader className="p-4 pb-2"><CardDescription className="text-xs uppercase font-bold">Renting Path Net Worth</CardDescription><DollarSign className="h-4 w-4 text-green-600" /></CardHeader>
              <CardContent className="p-4 pt-0"><div className="text-2xl font-bold text-green-600">{formatCurrency(calculations.finalRentingNetWorth)}</div><p className="text-xs text-muted-foreground">After {inputs.comparisonYears} years</p></CardContent>
            </Card>
          </div>
          
          <Card className={`border-t-4 ${verdict === 'Buying Wins' ? 'border-blue-500' : 'border-green-500'}`}>
            <CardHeader><CardTitle>Verdict: {verdict}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-lg">
                <span className="text-muted-foreground">Monthly EMI:</span>
                <span className="font-bold text-blue-600">{formatCurrency(calculations.emi)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-muted-foreground">Total Interest Paid (Buying):</span>
                <span className="font-bold text-red-600">{formatCurrency(calculations.totalInterestPaid)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-muted-foreground">Total Rent Paid (Renting):</span>
                <span className="font-bold text-red-600">{formatCurrency(calculations.totalRentPaid)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Net Worth Projection</CardTitle></CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={calculations.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                  <YAxis tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`} />
                  <Tooltip formatter={(val: number, name: string) => [formatCurrency(val), name]} />
                  <Legend />
                  <Line type="monotone" dataKey="BuyingNetWorth" stroke="#3b82f6" name="Buying Net Worth" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="RentingNetWorth" stroke="#10b981" name="Renting & Investing Net Worth" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BuyVsRentCalculator;