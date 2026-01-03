"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { GraduationCap, Target, Repeat, TrendingUp, Clock } from "lucide-react";

const CHILD_EDU_STATE_KEY = 'childEducationFundCalculatorState';

interface EducationInputs {
  currentCost: number;
  childCurrentAge: number;
  collegeAge: number;
  educationInflation: number;
  expectedReturn: number;
  amountSaved: number;
}

const initialInputs: EducationInputs = {
  currentCost: 2000000,
  childCurrentAge: 5,
  collegeAge: 18,
  educationInflation: 8,
  expectedReturn: 12,
  amountSaved: 100000,
};

const ChildEducationFundCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<EducationInputs>(() => {
    try {
      const saved = localStorage.getItem(CHILD_EDU_STATE_KEY);
      return saved ? JSON.parse(saved) : initialInputs;
    } catch {
      return initialInputs;
    }
  });

  useEffect(() => {
    localStorage.setItem(CHILD_EDU_STATE_KEY, JSON.stringify(inputs));
  }, [inputs]);

  const handleInputChange = (field: keyof EducationInputs, value: string | number) => {
    setInputs(prev => ({ ...prev, [field]: Number(value) || 0 }));
  };

  const formatCurrency = (value: number) => `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const yearsToCollege = Math.max(0, inputs.collegeAge - inputs.childCurrentAge);

  const calculations = useMemo(() => {
    const { currentCost, educationInflation, expectedReturn, amountSaved } = inputs;
    const t = yearsToCollege;
    const i = educationInflation / 100;
    const r = expectedReturn / 100;
    const r_monthly = r / 12;
    const n_months = t * 12;

    // 1. Future Cost of Education
    const futureCost = currentCost * Math.pow(1 + i, t);

    // 2. Future Value of Already Saved Amount
    const fvSavedAmount = amountSaved * Math.pow(1 + r, t);

    // 3. Required Corpus (Gap)
    const requiredCorpus = Math.max(0, futureCost - fvSavedAmount);

    // 4. Required Monthly SIP
    let requiredMonthlySIP = 0;
    if (requiredCorpus > 0 && n_months > 0) {
      if (r_monthly === 0) {
        requiredMonthlySIP = requiredCorpus / n_months;
      } else {
        // FV of Annuity Due factor (assuming SIP at start of month)
        const factor = ((Math.pow(1 + r_monthly, n_months) - 1) / r_monthly) * (1 + r_monthly);
        requiredMonthlySIP = requiredCorpus / factor;
      }
    }

    return {
      futureCost: Math.round(futureCost),
      fvSavedAmount: Math.round(fvSavedAmount),
      requiredCorpus: Math.round(requiredCorpus),
      requiredMonthlySIP: Math.round(requiredMonthlySIP),
    };
  }, [inputs, yearsToCollege]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <GraduationCap className="h-8 w-8 text-primary" />
        Child Education Fund Calculator
      </h1>
      <CardDescription>
        Plan the required monthly investment to meet the rising cost of your child's future education.
      </CardDescription>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Inputs */}
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Goal Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Cost of Education (₹)</Label>
              <Input type="number" value={inputs.currentCost} onChange={(e) => handleInputChange('currentCost', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Child's Current Age</Label>
                <Input type="number" value={inputs.childCurrentAge} onChange={(e) => handleInputChange('childCurrentAge', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>College Start Age</Label>
                <Input type="number" value={inputs.collegeAge} onChange={(e) => handleInputChange('collegeAge', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Amount Already Saved (₹)</Label>
              <Input type="number" value={inputs.amountSaved} onChange={(e) => handleInputChange('amountSaved', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Expected Education Inflation (%)</Label>
              <Input type="number" value={inputs.educationInflation} onChange={(e) => handleInputChange('educationInflation', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Expected Investment Return (%)</Label>
              <Input type="number" value={inputs.expectedReturn} onChange={(e) => handleInputChange('expectedReturn', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-500/20">
              <CardHeader className="p-4 pb-2"><CardDescription className="text-xs uppercase font-bold">Years to Goal</CardDescription><Clock className="h-4 w-4 text-orange-600" /></CardHeader>
              <CardContent className="p-4 pt-0"><div className="text-2xl font-bold text-orange-600">{yearsToCollege} Years</div></CardContent>
            </Card>
            <Card className="bg-red-50 dark:bg-red-950/20 border-red-500/20">
              <CardHeader className="p-4 pb-2"><CardDescription className="text-xs uppercase font-bold">Future Cost of Education</CardDescription><Target className="h-4 w-4 text-red-600" /></CardHeader>
              <CardContent className="p-4 pt-0"><div className="text-2xl font-bold text-red-600">{formatCurrency(calculations.futureCost)}</div></CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-950/20 border-green-500/20">
              <CardHeader className="p-4 pb-2"><CardDescription className="text-xs uppercase font-bold">FV of Current Savings</CardDescription><TrendingUp className="h-4 w-4 text-green-600" /></CardHeader>
              <CardContent className="p-4 pt-0"><div className="text-2xl font-bold text-green-600">{formatCurrency(calculations.fvSavedAmount)}</div></CardContent>
            </Card>
          </div>

          <Card className="border-t-4 border-t-primary">
            <CardHeader><CardTitle>Monthly Investment Required</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-lg">
                <span className="text-muted-foreground">Required Additional Corpus:</span>
                <span className="font-bold text-red-600">{formatCurrency(calculations.requiredCorpus)}</span>
              </div>
              <div className="text-center bg-primary/10 p-6 rounded-lg">
                <p className="text-lg font-semibold text-primary/80">Required Monthly SIP</p>
                <p className="text-4xl font-black text-primary flex items-center justify-center gap-2">
                  <Repeat className="h-6 w-6" />
                  {formatCurrency(calculations.requiredMonthlySIP)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChildEducationFundCalculator;