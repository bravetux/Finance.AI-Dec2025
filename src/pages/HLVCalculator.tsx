"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield, DollarSign, Home, GraduationCap, Heart, TrendingDown, TrendingUp, Percent } from "lucide-react";

const HLV_STATE_KEY = 'hlvCalculatorState';

interface HLVInputs {
  annualIncome: number;
  yearsToRetirement: number;
  annualExpenses: number;
  yearsUntilDependenceEnds: number;
  existingLiabilities: number;
  futureGoalsCost: number;
  existingInsurance: number;
  liquidAssets: number;
  expectedReturnRate: number;
}

const initialInputs: HLVInputs = {
  annualIncome: 1000000,
  yearsToRetirement: 25,
  annualExpenses: 500000,
  yearsUntilDependenceEnds: 15,
  existingLiabilities: 1000000,
  futureGoalsCost: 5000000,
  existingInsurance: 1000000,
  liquidAssets: 500000,
  expectedReturnRate: 7,
};

const HLVCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<HLVInputs>(() => {
    try {
      const saved = localStorage.getItem(HLV_STATE_KEY);
      return saved ? JSON.parse(saved) : initialInputs;
    } catch {
      return initialInputs;
    }
  });

  useEffect(() => {
    localStorage.setItem(HLV_STATE_KEY, JSON.stringify(inputs));
  }, [inputs]);

  const handleInputChange = (field: keyof HLVInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: Number(value) || 0 }));
  };

  const formatCurrency = (value: number) => `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const calculations = useMemo(() => {
    const { 
      annualExpenses, yearsUntilDependenceEnds, existingLiabilities, 
      futureGoalsCost, existingInsurance, liquidAssets, expectedReturnRate 
    } = inputs;

    // 1. Calculate Corpus Needed for Expenses (Needs-Based)
    // We need a corpus that generates (Annual Expenses) adjusted for inflation, 
    // but since we don't have inflation here, we use a simple perpetuity model.
    // Corpus = Annual Expense / (Expected Return Rate - Inflation Rate)
    // Since this is complex, we simplify: Corpus = Annual Expense * 25 (4% withdrawal rule proxy)
    
    // Simplified Needs-Based Approach:
    // A. Expense Corpus: Corpus needed to generate annual expenses for the dependence period.
    // We assume the corpus is invested at the expected return rate (r) and withdrawn over (t) years.
    // This is complex. Let's use a simpler multiplier (e.g., 15x to 25x) or just straight multiplication.
    
    // Let's use a simplified "Years of Expense" multiplier for the dependence period.
    const expenseCorpusNeeded = annualExpenses * yearsUntilDependenceEnds;

    // B. Total Needs
    const totalNeeds = expenseCorpusNeeded + existingLiabilities + futureGoalsCost;

    // C. Available Resources
    const availableResources = existingInsurance + liquidAssets;

    // D. Net HLV (Insurance Gap)
    const netHLV = Math.max(0, totalNeeds - availableResources);

    return {
      expenseCorpusNeeded,
      totalNeeds,
      availableResources,
      netHLV,
    };
  }, [inputs]);

  const renderInputField = (label: string, field: keyof HLVInputs, icon: React.ReactNode, isNegative = false) => (
    <div className="space-y-1">
      <Label htmlFor={field} className="flex items-center gap-2 text-sm font-medium">
        {icon} {label}
      </Label>
      <Input 
        id={field} 
        type="number" 
        value={inputs[field]} 
        onChange={e => handleInputChange(field, e.target.value)} 
        className={`text-right ${isNegative ? 'text-red-600' : 'text-green-600'}`}
      />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Shield className="h-8 w-8 text-primary" />
        Human Life Value (HLV) Calculator
      </h1>
      <CardDescription>
        Estimate the total insurance coverage needed to secure your family's financial future.
      </CardDescription>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Inputs */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Needs & Resources</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4 border-r pr-4">
              <h3 className="font-semibold text-lg text-red-600 flex items-center gap-2"><TrendingDown className="h-4 w-4" /> Financial Needs (Liabilities)</h3>
              {renderInputField("Annual Family Expenses (Today's ₹)", 'annualExpenses', <DollarSign className="h-4 w-4" />)}
              {renderInputField("Years Until Dependence Ends", 'yearsUntilDependenceEnds', <Heart className="h-4 w-4" />)}
              {renderInputField("Existing Liabilities (Home Loan, etc.)", 'existingLiabilities', <Home className="h-4 w-4" />)}
              {renderInputField("Future Goals Cost (Education, Marriage)", 'futureGoalsCost', <GraduationCap className="h-4 w-4" />)}
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-green-600 flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Available Resources (Assets)</h3>
              {renderInputField("Existing Term/Life Insurance Coverage", 'existingInsurance', <Shield className="h-4 w-4" />, true)}
              {renderInputField("Liquid Assets (FDs, Stocks, Cash)", 'liquidAssets', <DollarSign className="h-4 w-4" />, true)}
              {renderInputField("Expected Post-Death Return Rate (%)", 'expectedReturnRate', <Percent className="h-4 w-4" />)}
              <p className="text-xs text-muted-foreground pt-2">
                * Note: This calculation uses a simplified Needs-Based approach.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="lg:col-span-1 bg-primary/5 border-primary/20">
          <CardHeader><CardTitle>HLV Summary</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expense Corpus Needed:</span>
                <span className="font-medium text-red-600">{formatCurrency(calculations.expenseCorpusNeeded)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Financial Needs:</span>
                <span className="font-medium text-red-600">{formatCurrency(calculations.totalNeeds)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Available Resources:</span>
                <span className="font-medium text-green-600">{formatCurrency(calculations.availableResources)}</span>
              </div>
            </div>
            <div className="border-t pt-4 space-y-2">
              <p className="text-lg font-bold">Recommended Insurance Coverage (HLV)</p>
              <p className={`text-3xl font-black ${calculations.netHLV > 0 ? 'text-red-700' : 'text-green-700'}`}>
                {formatCurrency(calculations.netHLV)}
              </p>
              {calculations.netHLV > 0 ? (
                <p className="text-sm text-red-600">This is your insurance gap. You need a term plan for this amount.</p>
              ) : (
                <p className="text-sm text-green-600">Your existing coverage and assets are sufficient.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HLVCalculator;