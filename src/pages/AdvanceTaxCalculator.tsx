"use client";

import { Slider } from "@/components/ui/slider";
import React, { useState, useMemo, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ADVANCE_TAX_STATE_KEY = 'advanceTaxCalculatorState';

const quarters = ["q1", "q2", "q3", "q4"] as const;
const incomeHeads = ["ltcg", "stcg", "houseRent", "dividend"] as const;
const incomeHeadLabels: Record<IncomeHead, string> = {
  ltcg: "LTCG",
  stcg: "STCG",
  houseRent: "Income from House Property",
  dividend: "Dividend Income",
};

type Quarter = typeof quarters[number];
type IncomeHead = typeof incomeHeads[number];

type Breakdown = {
  totalQuarterlyTax: number;
  taxOnLTCG: number;
  taxOnSTCG: number;
  taxOnRegularIncome: number;
  cess: number;
  totalTaxBeforeCess: number;
  currentLtcg: number;
  exemptionToApply: number;
  taxableLtcg: number;
  regularIncome: number;
  stcg: number;
  paymentPercentage?: number;
  totalLiability?: number;
  paid?: number;
};


const initialIncomeState = {
  ...Object.fromEntries(quarters.map(q => [q, Object.fromEntries(incomeHeads.map(h => [h, 0]))]))
} as Record<Quarter, Record<IncomeHead, number>>;

const AdvanceTaxCalculator: React.FC = () => {
  console.log("AdvanceTaxCalculator component rendered");
  const [income, setIncome] = useState(initialIncomeState);
  const [slabTaxPercentage, setSlabTaxPercentage] = useState(30);
  const [taxPaid, setTaxPaid] = useState<Record<Quarter, number>>({ q1: 0, q2: 0, q3: 0, q4: 0 });

  const handleTaxPaidChange = (value: string, quarter: Quarter) => {
    const numericValue = parseFloat(value) || 0;
    setTaxPaid(prev => ({ ...prev, [quarter]: numericValue }));
  };


  useEffect(() => {
    try {
      const savedState = localStorage.getItem(ADVANCE_TAX_STATE_KEY);
      if (savedState) {
        const loadedState = JSON.parse(savedState);
        const mergedState = { ...initialIncomeState };
        for (const q of quarters) {
          mergedState[q] = { ...initialIncomeState[q], ...(loadedState[q] || {}) };
        }
        setIncome(mergedState);
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
      setIncome(initialIncomeState);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(ADVANCE_TAX_STATE_KEY, JSON.stringify(income));
  }, [income]);

  const handleIncomeChange = ( value: string, head: IncomeHead, quarter: Quarter) => {
    const numericValue = parseFloat(value) || 0;
    setIncome(prev => ({
      ...prev,
      [quarter]: { ...prev[quarter], [head]: numericValue },
    }));
  };

  const handleExport = () => {
    const data = {
      income,
      slabTaxPercentage,
      taxPaid,
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'advance-tax-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const text = e.target?.result;
          if (typeof text === 'string') {
            const data = JSON.parse(text);
            if (data.income) {
              setIncome(data.income);
            }
            if (data.slabTaxPercentage) {
              setSlabTaxPercentage(data.slabTaxPercentage);
            }
            if (data.taxPaid) {
              setTaxPaid(data.taxPaid);
            }
          }
        } catch (error) {
          console.error('Error parsing JSON file', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const taxCalculations = useMemo(() => {
    let remainingLtcgExemption = 125000;
    const quarterlyTaxDetails = quarters.map(q => {
      const currentLtcg = parseFloat(String(income[q].ltcg)) || 0;
      const exemptionToApply = Math.min(remainingLtcgExemption, Math.max(0, currentLtcg));
      const taxableLtcg = currentLtcg - exemptionToApply;
      const taxOnLTCG = Math.max(0, taxableLtcg) * 0.125;
      remainingLtcgExemption -= exemptionToApply;

      const stcg = parseFloat(String(income[q].stcg)) || 0;
      const houseRent = parseFloat(String(income[q].houseRent)) || 0;
      const dividend = parseFloat(String(income[q].dividend)) || 0;

      const taxOnSTCG = Math.max(0, stcg) * 0.20;
      const regularIncome = houseRent + dividend;
      const taxOnRegularIncome = regularIncome * (slabTaxPercentage / 100);
      const totalTaxBeforeCess = taxOnLTCG + taxOnSTCG + taxOnRegularIncome;
      const cess = totalTaxBeforeCess * 0.04;
      const totalQuarterlyTax = totalTaxBeforeCess + cess;
      return {
        totalQuarterlyTax,
        taxOnLTCG,
        taxOnSTCG,
        taxOnRegularIncome,
        cess,
        totalTaxBeforeCess,
        currentLtcg,
        exemptionToApply,
        taxableLtcg,
        regularIncome,
        stcg,
      };
    });

    const quarterlyTaxes = quarterlyTaxDetails.map(detail => detail.totalQuarterlyTax);

    const [taxQ1, taxQ2, taxQ3, taxQ4] = quarterlyTaxes;

    const paymentQ1 = taxQ1 * 0.15;
    const paymentQ2 = (taxQ1 * 0.30) + (taxQ2 * 0.30);
    const paymentQ3 = (taxQ1 * 0.30) + (taxQ2 * 0.30) + (taxQ3 * 0.15);
    const totalLiability = taxQ1 + taxQ2 + taxQ3 + taxQ4;
    const paymentQ4 = totalLiability - (paymentQ1 + paymentQ2 + paymentQ3);

    const result: { quarter: string; amount: number; breakdown: Breakdown }[] = [
      { quarter: "Q1", amount: paymentQ1, breakdown: { ...quarterlyTaxDetails[0], paymentPercentage: 0.15 } },
      { quarter: "Q2", amount: paymentQ2, breakdown: { ...quarterlyTaxDetails[1], paymentPercentage: 0.30 } },
      { quarter: "Q3", amount: paymentQ3, breakdown: { ...quarterlyTaxDetails[2], paymentPercentage: 0.30 } },
      { quarter: "Q4", amount: paymentQ4, breakdown: { ...quarterlyTaxDetails[3], totalLiability, paid: paymentQ1 + paymentQ2 + paymentQ3 } },
    ];
    return result;
  }, [income, slabTaxPercentage]);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Advance Tax Calculator</CardTitle>
          <CardDescription>
            Calculates advance tax using a custom "Quarterly Amortization" model.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="slabTaxPercentage">Slab Tax Percentage: {slabTaxPercentage}%</Label>
              <Slider
                id="slabTaxPercentage"
                min={0}
                max={50}
                step={5}
                value={[slabTaxPercentage]}
                onValueChange={value => setSlabTaxPercentage(value[0])}
              />
            </div>
            <div className="flex items-end space-x-2">
              <Button onClick={handleExport}>Export to JSON</Button>
              <Button asChild>
                <Label>
                  Import from JSON
                  <Input type="file" accept=".json" className="hidden" onChange={handleImport} />
                </Label>
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Income Source</TableHead>
                <TableHead className="text-right font-semibold">Quarter 1</TableHead>
                <TableHead className="text-right font-semibold">Quarter 2</TableHead>
                <TableHead className="text-right font-semibold">Quarter 3</TableHead>
                <TableHead className="text-right font-semibold">Quarter 4</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incomeHeads.map(head => (
                <TableRow key={head}>
                  <TableCell className="font-medium">{incomeHeadLabels[head]}</TableCell>
                  {quarters.map(q => (
                    <TableCell key={`${head}-${q}`}>
                      <Input 
                        type="number" 
                        className="text-right" 
                        value={income[q][head]} 
                        placeholder="0" 
                        onChange={e => handleIncomeChange(e.target.value, head, q)} 
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advance Tax Payment Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quarter</TableHead>
                <TableHead className="text-right">Tax to be Paid</TableHead>
                <TableHead className="text-right">Tax Paid</TableHead>
                <TableHead className="text-right">Difference</TableHead>
                <TableHead className="text-center">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxCalculations.map((tax, i) => (
                <Collapsible asChild key={tax.quarter}>
                  <>
                    <TableRow>
                      <TableCell className="font-medium">{tax.quarter} (by {[`June 15`, `Sep 15`, `Dec 15`, `Mar 15`][i]})</TableCell>
                      <TableCell className="text-right font-bold">₹{tax.amount > 0 ? tax.amount.toFixed(2) : '0.00'}</TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          className="text-right"
                          value={taxPaid[tax.quarter.toLowerCase() as Quarter]}
                          placeholder="0"
                          onChange={e => handleTaxPaidChange(e.target.value, tax.quarter.toLowerCase() as Quarter)}
                        />
                      </TableCell>
                      <TableCell className="text-right font-bold">₹{(tax.amount - taxPaid[tax.quarter.toLowerCase() as Quarter]).toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">Details</Button>
                        </CollapsibleTrigger>
                      </TableCell>
                    </TableRow>
                    <CollapsibleContent asChild>
                      <tr className="bg-muted/50">
                        <td colSpan={5} className="p-4">
                          <div className="space-y-2 text-sm">
                            <div className="font-semibold underline">Detailed Tax Computation for {tax.quarter}</div>
                            <div className="flex justify-between"><span>LTCG Income:</span> <span>₹{tax.breakdown.currentLtcg.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>LTCG Exemption Applied:</span> <span>- ₹{tax.breakdown.exemptionToApply.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Taxable LTCG:</span> <span>₹{tax.breakdown.taxableLtcg.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Tax on LTCG (12.5%):</span> <span>₹{tax.breakdown.taxOnLTCG.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>STCG Income:</span> <span>₹{tax.breakdown.stcg.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Tax on STCG (20%):</span> <span>₹{tax.breakdown.taxOnSTCG.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Regular Income (House Rent + Dividend):</span> <span>₹{tax.breakdown.regularIncome.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Tax on Regular Income ({slabTaxPercentage}%):</span> <span>₹{tax.breakdown.taxOnRegularIncome.toFixed(2)}</span></div>
                            <hr />
                            <div className="flex justify-between font-semibold"><span>Total Tax Before Cess:</span> <span>₹{tax.breakdown.totalTaxBeforeCess.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Cess (4%):</span> <span>₹{tax.breakdown.cess.toFixed(2)}</span></div>
                            <div className="flex justify-between font-semibold"><span>Total Quarterly Tax Liability:</span> <span>₹{tax.breakdown.totalQuarterlyTax.toFixed(2)}</span></div>
                            <hr />
                            <div className="font-semibold underline mt-4">Installment Calculation for {tax.quarter}</div>
                            {i === 0 && (
                              <div className="flex justify-between"><span>15% of Q1 Tax (₹{tax.breakdown.totalQuarterlyTax.toFixed(2)}):</span> <span>₹{(tax.breakdown.totalQuarterlyTax * 0.15).toFixed(2)}</span></div>
                            )}
                            {i === 1 && (
                              <>
                                {taxCalculations[0] && (
                                  <div className="flex justify-between"><span>30% of Q1 Tax (₹{taxCalculations[0].breakdown.totalQuarterlyTax.toFixed(2)}):</span> <span>₹{(taxCalculations[0].breakdown.totalQuarterlyTax * 0.30).toFixed(2)}</span></div>
                                )}
                                <div className="flex justify-between"><span>30% of Q2 Tax (₹{tax.breakdown.totalQuarterlyTax.toFixed(2)}):</span> <span>+ ₹{(tax.breakdown.totalQuarterlyTax * 0.30).toFixed(2)}</span></div>
                              </>
                            )}
                            {i === 2 && (
                              <>
                                {taxCalculations[0] && (
                                  <div className="flex justify-between"><span>30% of Q1 Tax (₹{taxCalculations[0].breakdown.totalQuarterlyTax.toFixed(2)}):</span> <span>₹{(taxCalculations[0].breakdown.totalQuarterlyTax * 0.30).toFixed(2)}</span></div>
                                )}
                                {taxCalculations[1] && (
                                  <div className="flex justify-between"><span>30% of Q2 Tax (₹{taxCalculations[1].breakdown.totalQuarterlyTax.toFixed(2)}):</span> <span>+ ₹{(taxCalculations[1].breakdown.totalQuarterlyTax * 0.30).toFixed(2)}</span></div>
                                )}
                                <div className="flex justify-between"><span>15% of Q3 Tax (₹{tax.breakdown.totalQuarterlyTax.toFixed(2)}):</span> <span>+ ₹{(tax.breakdown.totalQuarterlyTax * 0.15).toFixed(2)}</span></div>
                              </>
                            )}
                            {i === 3 && (
                              <>
                                <div className="flex justify-between"><span>Total Annual Tax Liability:</span> <span>₹{(tax.breakdown.totalLiability || 0).toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Less: Paid in Q1-Q3:</span> <span className="text-red-500">- ₹{(tax.breakdown.paid || 0).toFixed(2)}</span></div>
                              </>
                            )}
                            <hr />
                            <div className="flex justify-between font-semibold"><span>Total Installment:</span> <span>₹{tax.amount > 0 ? tax.amount.toFixed(2) : '0.00'}</span></div>
                          </div>
                        </td>
                      </tr>
                    </CollapsibleContent>
                  </>
                </Collapsible>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvanceTaxCalculator;