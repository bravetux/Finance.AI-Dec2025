"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";

const LifeInsurance: React.FC = () => {
  const [annualExpenses, setAnnualExpenses] = useState(1200000);
  const [liabilities, setLiabilities] = useState(5000000);
  const [existingAssets, setExistingAssets] = useState(2000000);
  const multiplier = 20; // Rule of thumb: 20x annual expenses

  const insuranceNeeded = (annualExpenses * multiplier) + liabilities - existingAssets;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Life Insurance Needs</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" /> Human Life Value Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Current Annual Expenses</Label>
              <Input type="number" value={annualExpenses} onChange={(e) => setAnnualExpenses(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Total Liabilities (Loans)</Label>
              <Input type="number" value={liabilities} onChange={(e) => setLiabilities(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Existing Assets/Insurance</Label>
              <Input type="number" value={existingAssets} onChange={(e) => setExistingAssets(Number(e.target.value))} />
            </div>
          </div>
          <div className="mt-6 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-purple-600 dark:text-purple-400">Recommended Term Insurance Cover:</p>
            <p className="text-4xl font-bold text-purple-700 dark:text-purple-300">
              ₹{(Math.max(0, insuranceNeeded) / 10000000).toFixed(2)} Crores
            </p>
            <p className="text-xs mt-2 text-muted-foreground">Based on {multiplier}x annual expenses + debt coverage.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LifeInsurance;