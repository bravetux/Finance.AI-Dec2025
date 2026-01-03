"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, XCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CanYouRetireNow: React.FC = () => {
  const [data, setData] = useState({
    corpus: 0,
    annualExpenses: 0,
    inflation: 6,
    expectedReturn: 8,
    lifeExpectancy: 85,
    currentAge: 40
  });

  useEffect(() => {
    const loadData = () => {
      try {
        const assets = JSON.parse(localStorage.getItem('assets') || '[]');
        const retirementData = JSON.parse(localStorage.getItem('retirementData') || '{}');
        
        const totalCorpus = assets.reduce((sum: number, asset: any) => sum + (Number(asset.value) || 0), 0);
        
        setData({
          corpus: totalCorpus,
          annualExpenses: retirementData.currentAnnualExpenses || 0,
          inflation: retirementData.inflation || 6,
          expectedReturn: retirementData.expectedReturn || 8,
          lifeExpectancy: retirementData.lifeExpectancy || 85,
          currentAge: retirementData.currentAge || 40
        });
      } catch (e) {
        console.error("Error loading data for retirement check", e);
      }
    };

    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  // Save current state for PostRetirementStrategy page to pick up
  useEffect(() => {
    localStorage.setItem('canRetireNowData', JSON.stringify({ corpus: data.corpus }));
  }, [data.corpus]);

  const simulation = useMemo(() => {
    const results = [];
    let currentCorpus = data.corpus;
    let currentExpense = data.annualExpenses;
    const yearsToSimulate = Math.max(1, data.lifeExpectancy - data.currentAge);
    
    // If corpus is already zero or expenses are not set, return empty
    if (currentCorpus <= 0 || currentExpense <= 0) {
        return { projections: [], yearsLasted: 0, status: 'insufficient' };
    }

    for (let year = 1; year <= yearsToSimulate; year++) {
      const openingBalance = currentCorpus;
      const earnings = currentCorpus * (data.expectedReturn / 100);
      
      // Withdraw at the start of the year
      currentCorpus -= currentExpense;
      
      if (currentCorpus < 0) {
        // Did not last the full year
        break;
      }
      
      // Add earnings on the remaining balance
      currentCorpus += (currentCorpus * (data.expectedReturn / 100));
      
      results.push({
        year,
        age: data.currentAge + year,
        openingBalance,
        withdrawal: currentExpense,
        closingBalance: currentCorpus
      });

      // Inflate expenses for next year
      currentExpense *= (1 + data.inflation / 100);
    }

    const yearsLasted = results.length;
    const status = yearsLasted >= yearsToSimulate ? 'success' : 'warning';

    return { projections: results, yearsLasted, status };
  }, [data]);

  const formatCurrency = (value: number) => `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const isDataMissing = data.corpus === 0 || data.annualExpenses === 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Can You Retire Now?</h1>
      <p className="text-muted-foreground">This analysis checks if your current assets are enough to sustain your current lifestyle indefinitely.</p>

      {isDataMissing ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Missing Information</AlertTitle>
          <AlertDescription>
            Please ensure you have added your <strong>Assets</strong> and <strong>Retirement Goals</strong> (Current Expenses) to see the verdict.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Current Corpus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(data.corpus)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Annual Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(data.annualExpenses)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Corpus Lasts For</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${simulation.status === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                  {simulation.yearsLasted} Years
                </div>
                <p className="text-xs text-muted-foreground mt-1">Until age {data.currentAge + simulation.yearsLasted}</p>
              </CardContent>
            </Card>
          </div>

          <Card className={`border-2 ${simulation.status === 'success' ? 'border-green-500 bg-green-50/30' : 'border-orange-500 bg-orange-50/30'}`}>
            <CardHeader className="flex flex-row items-center gap-4">
              {simulation.status === 'success' ? (
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              ) : (
                <XCircle className="h-10 w-10 text-orange-600" />
              )}
              <div>
                <CardTitle>
                  {simulation.status === 'success' 
                    ? "Yes, You Can Retire!" 
                    : simulation.yearsLasted > 0 
                      ? "Not Quite Ready" 
                      : "Action Required"}
                </CardTitle>
                <CardDescription className="text-foreground/80">
                  {simulation.status === 'success' 
                    ? `Your corpus is projected to last until age ${data.currentAge + simulation.yearsLasted}+.` 
                    : `Your corpus will only last for ${simulation.yearsLasted} years (until age ${data.currentAge + simulation.yearsLasted}).`}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Yearly Breakdown</CardTitle>
              <CardDescription>How your corpus changes over time considering inflation and returns.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto max-h-96">
                <Table>
                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead className="text-right">Opening Balance</TableHead>
                      <TableHead className="text-right">Withdrawal</TableHead>
                      <TableHead className="text-right">Closing Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {simulation.projections.map((p) => (
                      <TableRow key={p.year}>
                        <TableCell>{p.year}</TableCell>
                        <TableCell>{p.age}</TableCell>
                        <TableCell className="text-right">{formatCurrency(p.openingBalance)}</TableCell>
                        <TableCell className="text-right text-red-500">({formatCurrency(p.withdrawal)})</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(p.closingBalance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default CanYouRetireNow;