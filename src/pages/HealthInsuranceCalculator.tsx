"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Heart, Home, TrendingUp, Clock, Users } from "lucide-react";

const HEALTH_INSURANCE_STATE_KEY = 'healthInsuranceCalculatorState';

type CityTier = 'Tier 1' | 'Tier 2' | 'Tier 3';

interface InsuranceInputs {
  eldestAge: number;
  yearsToRetirement: number;
  cityTier: CityTier;
  inflationRate: number;
  adults: number;
  children: number;
}

const initialInputs: InsuranceInputs = {
  eldestAge: 40,
  yearsToRetirement: 20,
  cityTier: 'Tier 1',
  inflationRate: 7,
  adults: 2,
  children: 1,
};

const cityBaseCoverage: Record<CityTier, number> = {
  'Tier 1': 1000000,
  'Tier 2': 700000,
  'Tier 3': 500000,
};

const HealthInsuranceCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<InsuranceInputs>(() => {
    try {
      const saved = localStorage.getItem(HEALTH_INSURANCE_STATE_KEY);
      return saved ? JSON.parse(saved) : initialInputs;
    } catch {
      return initialInputs;
    }
  });

  useEffect(() => {
    localStorage.setItem(HEALTH_INSURANCE_STATE_KEY, JSON.stringify(inputs));
  }, [inputs]);

  const handleInputChange = (field: keyof InsuranceInputs, value: string | number) => {
    setInputs(prev => ({ ...prev, [field]: typeof value === 'string' ? Number(value) || 0 : value }));
  };

  const handleSelectChange = (field: keyof InsuranceInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value as CityTier }));
  };

  const formatCurrency = (value: number) => `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const yearsToCollege = Math.max(0, inputs.yearsToRetirement);

  const calculations = useMemo(() => {
    const { eldestAge, cityTier, inflationRate, yearsToRetirement, adults, children } = inputs;

    // 1. Base Coverage based on City Tier
    const baseCoverage = cityBaseCoverage[cityTier];

    // 2. Age Multiplier
    let ageMultiplier = 1;
    if (eldestAge >= 55) {
      ageMultiplier = 1.5;
    } else if (eldestAge >= 40) {
      ageMultiplier = 1.2;
    }

    // 3. Family Multiplier (Simplified)
    let familyMultiplier = 0;
    if (adults === 1) familyMultiplier = 1;
    if (adults >= 2) familyMultiplier = 1.5;
    familyMultiplier += children * 0.2;
    familyMultiplier = Math.max(1, familyMultiplier); // Ensure minimum 1x

    // 4. Recommended Coverage (Today's Value)
    const recommendedToday = baseCoverage * ageMultiplier * familyMultiplier;

    // 5. Future Value of Recommended Coverage (at retirement/goal)
    const futureRecommended = recommendedToday * Math.pow(1 + inflationRate / 100, yearsToRetirement);

    return {
      recommendedToday: Math.round(recommendedToday),
      futureRecommended: Math.round(futureRecommended),
      ageMultiplier,
      familyMultiplier,
    };
  }, [inputs, yearsToCollege]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Shield className="h-8 w-8 text-primary" />
        Health Insurance Calculator
      </h1>
      <CardDescription>
        Estimate the recommended health insurance coverage needed today and project its future cost based on inflation.
      </CardDescription>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Inputs */}
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            
            <div className="space-y-2">
              <Label>City Tier</Label>
              <Select value={inputs.cityTier} onValueChange={(v: CityTier) => handleSelectChange('cityTier', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tier 1">Tier 1 (Metro)</SelectItem>
                  <SelectItem value="Tier 2">Tier 2 (Major Cities)</SelectItem>
                  <SelectItem value="Tier 3">Tier 3 (Other)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Adults (1-2)</Label>
                    <Input type="number" min={1} max={2} value={inputs.adults} onChange={(e) => handleInputChange('adults', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Children (0-3)</Label>
                    <Input type="number" min={0} max={3} value={inputs.children} onChange={(e) => handleInputChange('children', e.target.value)} />
                </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between"><Label>Age of Eldest Member</Label><span className="font-bold">{inputs.eldestAge} Yr</span></div>
              <Slider value={[inputs.eldestAge]} onValueChange={(v) => handleInputChange('eldestAge', v[0])} min={20} max={70} step={1} />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between"><Label>Years to Goal/Retirement</Label><span className="font-bold">{inputs.yearsToRetirement} Yr</span></div>
              <Slider value={[inputs.yearsToRetirement]} onValueChange={(v) => handleInputChange('yearsToRetirement', v[0])} min={1} max={40} step={1} />
            </div>

            <div className="space-y-2">
              <Label>Medical Inflation Rate (%)</Label>
              <Input type="number" value={inputs.inflationRate} onChange={(e) => handleInputChange('inflationRate', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="p-4 pb-2"><CardDescription className="text-xs uppercase font-bold">Recommended Coverage (Today)</CardDescription><Shield className="h-4 w-4 text-primary" /></CardHeader>
              <CardContent className="p-4 pt-0"><div className="text-3xl font-black text-primary">{formatCurrency(calculations.recommendedToday)}</div></CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-950/20 border-green-500/20">
              <CardHeader className="p-4 pb-2"><CardDescription className="text-xs uppercase font-bold">Future Cost of Coverage</CardDescription><TrendingUp className="h-4 w-4 text-green-600" /></CardHeader>
              <CardContent className="p-4 pt-0"><div className="text-3xl font-black text-green-600">{formatCurrency(calculations.futureRecommended)}</div><p className="text-xs text-muted-foreground">In {inputs.yearsToRetirement} years</p></CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Calculation Breakdown</CardTitle></CardHeader>
            <CardContent className="space-y-3">
                <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-2"><Home className="h-4 w-4" /> Base Coverage ({inputs.cityTier}):</span>
                    <span className="font-medium">{formatCurrency(cityBaseCoverage[inputs.cityTier])}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" /> Age Multiplier ({inputs.eldestAge} yrs):</span>
                    <span className="font-medium">{calculations.ageMultiplier.toFixed(1)}x</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-2"><Users className="h-4 w-4" /> Family Multiplier ({inputs.adults}A + {inputs.children}C):</span>
                    <span className="font-medium">{calculations.familyMultiplier.toFixed(1)}x</span>
                </div>
                <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
                    <span>Total Recommended Coverage (Today):</span>
                    <span className="text-primary">{formatCurrency(calculations.recommendedToday)}</span>
                </div>
                <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
                    <span>Future Value (at {inputs.inflationRate}% inflation):</span>
                    <span className="text-green-600">{formatCurrency(calculations.futureRecommended)}</span>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HealthInsuranceCalculator;