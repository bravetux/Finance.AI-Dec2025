"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target } from "lucide-react";

const GoalPlanner: React.FC = () => {
  const [goalAmount, setGoalAmount] = useState(1000000);
  const [years, setYears] = useState(10);
  const [returns, setReturns] = useState(12);

  const monthlyInvestment = (goalAmount * (returns / 1200)) / (Math.pow(1 + returns / 1200, years * 12) - 1);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Goal Planner</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" /> Calculate Target Savings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Target Amount (Current Value)</Label>
              <Input type="number" value={goalAmount} onChange={(e) => setGoalAmount(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Time Horizon (Years)</Label>
              <Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Expected Returns (%)</Label>
              <Input type="number" value={returns} onChange={(e) => setReturns(Number(e.target.value))} />
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400">Monthly Investment Required:</p>
            <p className="text-3xl font-bold">₹{Math.round(monthlyInvestment).toLocaleString("en-IN")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalPlanner;