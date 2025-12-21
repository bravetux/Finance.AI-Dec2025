"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Zap, 
  Wrench, 
  Brush, 
  Trash2, 
  Download, 
  Upload, 
  Calculator, 
  Wallet,
  ArrowRight
} from "lucide-react";
import { saveAs } from "file-saver";
import { showSuccess, showError } from "@/utils/toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface VacateInputs {
  advanceAmount: number;
  rentalBalance: number;
  ebUnits: number;
  ebRate: number;
  commonEbCharges: number;
  repairWood: number;
  elecTubelight: number;
  elecBulbs: number;
  elecFan: number;
  elecSwitches: number;
  elecPlug: number;
  plumbHose: number;
  plumbTaps: number;
  plumbDrainTaps: number;
  plumbPlugs: number;
  paintingExpenses: number;
  masonExpenses: number;
  cleaningAgreement: number;
  cleaningMisc: number;
}

const initialInputs: VacateInputs = {
  advanceAmount: 0,
  rentalBalance: 0,
  ebUnits: 0,
  ebRate: 8,
  commonEbCharges: 0,
  repairWood: 0,
  elecTubelight: 0,
  elecBulbs: 0,
  elecFan: 0,
  elecSwitches: 0,
  elecPlug: 0,
  plumbHose: 0,
  plumbTaps: 0,
  plumbDrainTaps: 0,
  plumbPlugs: 0,
  paintingExpenses: 0,
  masonExpenses: 0,
  cleaningAgreement: 0,
  cleaningMisc: 0,
};

const RentVacateCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<VacateInputs>(() => {
    try {
      const saved = localStorage.getItem('rentVacateCalculatorData');
      return saved ? { ...initialInputs, ...JSON.parse(saved) } : initialInputs;
    } catch {
      return initialInputs;
    }
  });

  useEffect(() => {
    localStorage.setItem('rentVacateCalculatorData', JSON.stringify(inputs));
  }, [inputs]);

  const handleInputChange = (field: keyof VacateInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: Number(value) || 0 }));
  };

  const calculations = useMemo(() => {
    const { 
      ebUnits, ebRate, rentalBalance, commonEbCharges, repairWood,
      elecTubelight, elecBulbs, elecFan, elecSwitches, elecPlug,
      plumbHose, plumbTaps, plumbDrainTaps, plumbPlugs,
      paintingExpenses, masonExpenses, cleaningAgreement, cleaningMisc
    } = inputs;

    const ebCharge = ebUnits * ebRate;
    
    const electricalTotal = elecTubelight + elecBulbs + elecFan + elecSwitches + elecPlug;
    const plumbingTotal = plumbHose + plumbTaps + plumbDrainTaps + plumbPlugs;
    const cleaningTotal = cleaningAgreement + cleaningMisc;

    const totalDeductions = (
      rentalBalance +
      ebCharge +
      commonEbCharges +
      repairWood +
      electricalTotal +
      plumbingTotal +
      paintingExpenses +
      masonExpenses +
      cleaningTotal
    );

    const finalRefund = Math.max(0, inputs.advanceAmount - totalDeductions);
    const balanceDue = totalDeductions > inputs.advanceAmount ? totalDeductions - inputs.advanceAmount : 0;

    return {
      ebCharge,
      electricalTotal,
      plumbingTotal,
      cleaningTotal,
      totalDeductions,
      finalRefund,
      balanceDue
    };
  }, [inputs]);

  const formatCurrency = (value: number) => `₹${value.toLocaleString("en-IN")}`;

  const exportData = () => {
    const blob = new Blob([JSON.stringify(inputs, null, 2)], { type: 'application/json' });
    saveAs(blob, 'rent-vacate-data.json');
    showSuccess('Vacate calculator data exported!');
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        setInputs({ ...initialInputs, ...data });
        showSuccess('Data imported successfully!');
      } catch (err) {
        showError('Failed to parse the file.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleClearData = () => {
    setInputs(initialInputs);
    showSuccess('All fields have been reset.');
  };

  const renderInputField = (label: string, field: keyof VacateInputs, placeholder = "0") => (
    <div className="space-y-1">
      <Label htmlFor={field} className="text-xs">{label}</Label>
      <Input 
        id={field} 
        type="number" 
        value={inputs[field] === 0 ? "" : inputs[field]} 
        placeholder={placeholder}
        onChange={e => handleInputChange(field, e.target.value)} 
        className="h-8 text-sm"
      />
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Home className="h-6 w-6" />
          Rent Vacate Calculator
        </h1>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm"><Trash2 className="mr-2 h-4 w-4" /> Clear</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>This will reset all fields to zero.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearData}>Yes, clear</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="outline" size="sm" onClick={exportData}><Upload className="mr-2 h-4 w-4" /> Export</Button>
          <Button variant="outline" size="sm" asChild>
            <Label htmlFor="import-file" className="cursor-pointer">
              <Download className="mr-2 h-4 w-4" /> Import
              <Input id="import-file" type="file" accept=".json" className="hidden" onChange={importData} />
            </Label>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-1 border-primary/20 bg-primary/5">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2"><Wallet className="h-4 w-4" />Advance Amount</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{formatCurrency(inputs.advanceAmount)}</div>
                {renderInputField("Enter Security Deposit", "advanceAmount")}
            </CardContent>
        </Card>

        <Card className="md:col-span-2 border-red-500/20 bg-red-500/5">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2"><Calculator className="h-4 w-4" />Total Deductions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold text-red-600">{formatCurrency(calculations.totalDeductions)}</div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">Calculated from all repairs & arrears</p>
            </CardContent>
        </Card>

        <Card className={`md:col-span-1 ${calculations.balanceDue > 0 ? "border-orange-500 bg-orange-50" : "border-green-500/20 bg-green-500/5"}`}>
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {calculations.balanceDue > 0 ? "Extra Due to Owner" : "Final Refund Amount"}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className={`text-2xl font-bold ${calculations.balanceDue > 0 ? "text-orange-600" : "text-green-600"}`}>
                    {formatCurrency(calculations.balanceDue > 0 ? calculations.balanceDue : calculations.finalRefund)}
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">
                    {calculations.balanceDue > 0 ? "Deposit fully consumed" : "Net amount to return"}
                </p>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Rent & Utilities */}
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-md flex items-center gap-2"><Zap className="h-4 w-4 text-yellow-500" /> Rent & Utilities</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            {renderInputField("Rental Balance Arrears", "rentalBalance")}
            <div className="grid grid-cols-2 gap-2">
                {renderInputField("EB Units Consumed", "ebUnits")}
                {renderInputField("EB Rate/Unit", "ebRate")}
            </div>
            <div className="flex justify-between items-center text-sm font-medium bg-muted p-2 rounded">
                <span>Calculated EB Bill:</span>
                <span>{formatCurrency(calculations.ebCharge)}</span>
            </div>
            {renderInputField("Common Area EB Charges", "commonEbCharges")}
          </CardContent>
        </Card>

        {/* Repairs */}
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-md flex items-center gap-2"><Wrench className="h-4 w-4 text-blue-500" /> Maintenance & Repairs</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            {renderInputField("Wood Work Repairs", "repairWood")}
            <div className="space-y-2 border-t pt-2 mt-2">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Electrical Items</p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                    {renderInputField("Tubelight", "elecTubelight")}
                    {renderInputField("Bulbs", "elecBulbs")}
                    {renderInputField("Fan Repair", "elecFan")}
                    {renderInputField("Switches", "elecSwitches")}
                    {renderInputField("Plug Points", "elecPlug")}
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Plumbing & Masonry */}
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-md flex items-center gap-2"><Wrench className="h-4 w-4 text-emerald-500" /> Plumbing & Masonry</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Plumbing Items</p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                    {renderInputField("Hose Pipe", "plumbHose")}
                    {renderInputField("Taps", "plumbTaps")}
                    {renderInputField("Drain Taps", "plumbDrainTaps")}
                    {renderInputField("Plugs/Covers", "plumbPlugs")}
                </div>
            </div>
            <div className="border-t pt-2 mt-2">
                {renderInputField("Masonry / Civil Work", "masonExpenses")}
            </div>
          </CardContent>
        </Card>

        {/* Cleaning & Painting */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="p-4">
            <CardTitle className="text-md flex items-center gap-2"><Brush className="h-4 w-4 text-purple-500" /> Finishing & Cleaning</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            {renderInputField("Painting Expenses", "paintingExpenses")}
            <div className="space-y-2 border-t pt-2 mt-2">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Cleaning Fees</p>
                {renderInputField("Agreement Cleaning Charge", "cleaningAgreement")}
                {renderInputField("Misc. Cleaning / Shifting", "cleaningMisc")}
            </div>
          </CardContent>
        </Card>

        {/* Summary Breakdown */}
        <Card className="md:col-span-2 lg:col-span-2">
            <CardHeader className="p-4">
                <CardTitle className="text-md">Deduction Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Rent Arrears:</span>
                        <span className="font-medium">{formatCurrency(inputs.rentalBalance)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Total EB Bill:</span>
                        <span className="font-medium">{formatCurrency(calculations.ebCharge + inputs.commonEbCharges)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Electrical Total:</span>
                        <span className="font-medium">{formatCurrency(calculations.electricalTotal)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Plumbing Total:</span>
                        <span className="font-medium">{formatCurrency(calculations.plumbingTotal)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Wood & Masonry:</span>
                        <span className="font-medium">{formatCurrency(inputs.repairWood + inputs.masonExpenses)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Painting:</span>
                        <span className="font-medium">{formatCurrency(inputs.paintingExpenses)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Cleaning:</span>
                        <span className="font-medium">{formatCurrency(calculations.cleaningTotal)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1 bg-red-50 dark:bg-red-950/20 px-1 rounded">
                        <span className="font-bold">Total Deductions:</span>
                        <span className="font-bold text-red-600">{formatCurrency(calculations.totalDeductions)}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="bg-muted/50 p-4 rounded-b-xl flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-lg">
                    <span className="text-muted-foreground">Deposit</span>
                    <ArrowRight className="h-4 w-4" />
                    <span className="text-primary">{formatCurrency(inputs.advanceAmount)}</span>
                </div>
                <div className="text-right">
                    <p className="text-xs uppercase font-bold text-muted-foreground">Final Balance</p>
                    <p className={`text-2xl font-black ${calculations.balanceDue > 0 ? "text-orange-600" : "text-green-600"}`}>
                        {formatCurrency(calculations.balanceDue > 0 ? -calculations.balanceDue : calculations.finalRefund)}
                    </p>
                </div>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RentVacateCalculator;