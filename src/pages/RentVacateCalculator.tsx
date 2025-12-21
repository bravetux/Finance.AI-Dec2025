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
  ArrowRight,
  FileText
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
  // Electrical - Qty & Unit Cost
  qtyElecTubelight: number; costElecTubelight: number;
  qtyElecBulbs: number; costElecBulbs: number;
  qtyElecFan: number; costElecFan: number;
  qtyElecSwitches: number; costElecSwitches: number;
  qtyElecPlug: number; costElecPlug: number;
  // Plumbing - Qty & Unit Cost
  qtyPlumbHose: number; costPlumbHose: number;
  qtyPlumbTaps: number; costPlumbTaps: number;
  qtyPlumbDrainTaps: number; costPlumbDrainTaps: number;
  qtyPlumbPlugs: number; costPlumbPlugs: number;
  qtyPlumbAngleValve: number; costPlumbAngleValve: number;
  qtyPlumbWashbasinValve: number; costPlumbWashbasinValve: number;
  qtyPlumbFaucet: number; costPlumbFaucet: number;
  qtyPlumbFlushTank: number; costPlumbFlushTank: number;
  qtyPlumbKitchenSink: number; costPlumbKitchenSink: number;
  // Other
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
  qtyElecTubelight: 0, costElecTubelight: 0,
  qtyElecBulbs: 0, costElecBulbs: 0,
  qtyElecFan: 0, costElecFan: 0,
  qtyElecSwitches: 0, costElecSwitches: 0,
  qtyElecPlug: 0, costElecPlug: 0,
  qtyPlumbHose: 0, costPlumbHose: 0,
  qtyPlumbTaps: 0, costPlumbTaps: 0,
  qtyPlumbDrainTaps: 0, costPlumbDrainTaps: 0,
  qtyPlumbPlugs: 0, costPlumbPlugs: 0,
  qtyPlumbAngleValve: 0, costPlumbAngleValve: 0,
  qtyPlumbWashbasinValve: 0, costPlumbWashbasinValve: 0,
  qtyPlumbFaucet: 0, costPlumbFaucet: 0,
  qtyPlumbFlushTank: 0, costPlumbFlushTank: 0,
  qtyPlumbKitchenSink: 0, costPlumbKitchenSink: 0,
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
      qtyElecTubelight, costElecTubelight, qtyElecBulbs, costElecBulbs, qtyElecFan, costElecFan, qtyElecSwitches, costElecSwitches, qtyElecPlug, costElecPlug,
      qtyPlumbHose, costPlumbHose, qtyPlumbTaps, costPlumbTaps, qtyPlumbDrainTaps, costPlumbDrainTaps, qtyPlumbPlugs, costPlumbPlugs,
      qtyPlumbAngleValve, costPlumbAngleValve, qtyPlumbWashbasinValve, costPlumbWashbasinValve, qtyPlumbFaucet, costPlumbFaucet, qtyPlumbFlushTank, costPlumbFlushTank, qtyPlumbKitchenSink, costPlumbKitchenSink,
      paintingExpenses, masonExpenses, cleaningAgreement, cleaningMisc
    } = inputs;

    const ebCharge = ebUnits * ebRate;
    
    const electricalTotal = (qtyElecTubelight * costElecTubelight) + 
                            (qtyElecBulbs * costElecBulbs) + 
                            (qtyElecFan * costElecFan) + 
                            (qtyElecSwitches * costElecSwitches) + 
                            (qtyElecPlug * costElecPlug);

    const plumbingTotal = (qtyPlumbHose * costPlumbHose) + 
                          (qtyPlumbTaps * costPlumbTaps) + 
                          (qtyPlumbDrainTaps * costPlumbDrainTaps) + 
                          (qtyPlumbPlugs * costPlumbPlugs) +
                          (qtyPlumbAngleValve * costPlumbAngleValve) +
                          (qtyPlumbWashbasinValve * costPlumbWashbasinValve) +
                          (qtyPlumbFaucet * costPlumbFaucet) +
                          (qtyPlumbFlushTank * costPlumbFlushTank) +
                          (qtyPlumbKitchenSink * costPlumbKitchenSink);

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
    saveAs(blob, 'rental-vacate-data.json');
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

  const handlePrint = () => {
    window.print();
  };

  const renderInputField = (label: string, field: keyof VacateInputs, placeholder = "0") => (
    <div className="space-y-1">
      <Label htmlFor={field} className="text-[10px] uppercase font-bold text-muted-foreground">{label}</Label>
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

  const renderQtyPriceRow = (label: string, qtyField: keyof VacateInputs, costField: keyof VacateInputs) => (
    <div className="grid grid-cols-5 gap-2 items-end">
      <div className="col-span-2">
        <Label className="text-[10px] uppercase font-bold text-muted-foreground">{label}</Label>
      </div>
      <div className="col-span-1">
        <Input 
          type="number" 
          placeholder="Qty" 
          value={inputs[qtyField] === 0 ? "" : inputs[qtyField]} 
          onChange={e => handleInputChange(qtyField, e.target.value)}
          className="h-7 text-xs px-2"
        />
      </div>
      <div className="col-span-2">
        <Input 
          type="number" 
          placeholder="Unit ₹" 
          value={inputs[costField] === 0 ? "" : inputs[costField]} 
          onChange={e => handleInputChange(costField, e.target.value)}
          className="h-7 text-xs px-2"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto print:p-0 print:m-0">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Home className="h-6 w-6" />
          Rental House Vacate Calculator
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}><FileText className="mr-2 h-4 w-4" /> Export to PDF</Button>
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
          <Button variant="outline" size="sm" onClick={exportData}><Upload className="mr-2 h-4 w-4" /> Export JSON</Button>
          <Button variant="outline" size="sm" asChild>
            <Label htmlFor="import-file" className="cursor-pointer">
              <Download className="mr-2 h-4 w-4" /> Import JSON
              <Input id="import-file" type="file" accept=".json" className="hidden" onChange={importData} />
            </Label>
          </Button>
        </div>
      </div>

      <div className="hidden print:block text-center mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-widest">Rental Vacate Settlement Statement</h1>
        <p className="text-sm text-muted-foreground">Detailed breakdown of security deposit deductions and final refund.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-1 border-primary/20 bg-primary/5 print:border-black print:bg-white">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2"><Wallet className="h-4 w-4" />Advance Amount</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold mb-2">{formatCurrency(inputs.advanceAmount)}</div>
                <div className="print:hidden">
                    {renderInputField("Enter Security Deposit", "advanceAmount")}
                </div>
            </CardContent>
        </Card>

        <Card className="md:col-span-2 border-red-500/20 bg-red-500/5 print:border-black print:bg-white">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2"><Calculator className="h-4 w-4" />Total Deductions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold text-red-600 print:text-black">{formatCurrency(calculations.totalDeductions)}</div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">Calculated from all repairs & arrears</p>
            </CardContent>
        </Card>

        <Card className={`md:col-span-1 ${calculations.balanceDue > 0 ? "border-orange-500 bg-orange-50" : "border-green-500/20 bg-green-500/5"} print:border-black print:bg-white`}>
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {calculations.balanceDue > 0 ? "Extra Due to Owner" : "Final Refund Amount"}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className={`text-2xl font-bold ${calculations.balanceDue > 0 ? "text-orange-600" : "text-green-600"} print:text-black`}>
                    {formatCurrency(calculations.balanceDue > 0 ? calculations.balanceDue : calculations.finalRefund)}
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">
                    {calculations.balanceDue > 0 ? "Deposit fully consumed" : "Net amount to return"}
                </p>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:gap-4">
        {/* Rent & Utilities */}
        <Card className="print:border-black shadow-none">
          <CardHeader className="p-4">
            <CardTitle className="text-md flex items-center gap-2"><Zap className="h-4 w-4 text-yellow-500 print:text-black" /> Rent & Utilities</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4 print:space-y-2">
            <div className="print:hidden">{renderInputField("Rental Balance Arrears", "rentalBalance")}</div>
            <div className="hidden print:flex justify-between text-sm"><span>Rent Arrears:</span><span>{formatCurrency(inputs.rentalBalance)}</span></div>
            
            <div className="grid grid-cols-2 gap-2 print:hidden">
                {renderInputField("EB Units Consumed", "ebUnits")}
                {renderInputField("EB Rate/Unit", "ebRate")}
            </div>
            
            <div className="hidden print:flex justify-between text-sm">
                <span>EB Bill ({inputs.ebUnits} units @ ₹{inputs.ebRate}):</span>
                <span>{formatCurrency(calculations.ebCharge)}</span>
            </div>

            <div className="flex justify-between items-center text-sm font-medium bg-muted p-2 rounded print:hidden">
                <span className="text-xs">Calculated EB Bill:</span>
                <span>{formatCurrency(calculations.ebCharge)}</span>
            </div>

            <div className="print:hidden">{renderInputField("Common Area EB Charges", "commonEbCharges")}</div>
            <div className="hidden print:flex justify-between text-sm"><span>Common EB:</span><span>{formatCurrency(inputs.commonEbCharges)}</span></div>
          </CardContent>
        </Card>

        {/* Repairs */}
        <Card className="print:border-black shadow-none">
          <CardHeader className="p-4">
            <CardTitle className="text-md flex items-center gap-2"><Wrench className="h-4 w-4 text-blue-500 print:text-black" /> Maintenance & Repairs</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3 print:space-y-1">
            <div className="print:hidden">{renderInputField("Wood Work Repairs", "repairWood")}</div>
            <div className="hidden print:flex justify-between text-sm"><span>Wood Work:</span><span>{formatCurrency(inputs.repairWood)}</span></div>
            
            <div className="space-y-2 border-t pt-2 mt-2 print:border-black print:mt-1">
                <div className="flex justify-between items-center mb-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Electrical Items</p>
                    <span className="text-[10px] font-bold text-blue-600 print:text-black">{formatCurrency(calculations.electricalTotal)}</span>
                </div>
                <div className="space-y-1.5 print:hidden">
                    {renderQtyPriceRow("Tubelight", "qtyElecTubelight", "costElecTubelight")}
                    {renderQtyPriceRow("Bulbs", "qtyElecBulbs", "costElecBulbs")}
                    {renderQtyPriceRow("Fan Repair", "qtyElecFan", "costElecFan")}
                    {renderQtyPriceRow("Switches", "qtyElecSwitches", "costElecSwitches")}
                    {renderQtyPriceRow("Plug Point", "qtyElecPlug", "costElecPlug")}
                </div>
                <div className="hidden print:block space-y-0.5 text-xs">
                    {inputs.qtyElecTubelight > 0 && <div className="flex justify-between"><span>Tubelight (x{inputs.qtyElecTubelight})</span><span>{formatCurrency(inputs.qtyElecTubelight * inputs.costElecTubelight)}</span></div>}
                    {inputs.qtyElecBulbs > 0 && <div className="flex justify-between"><span>Bulbs (x{inputs.qtyElecBulbs})</span><span>{formatCurrency(inputs.qtyElecBulbs * inputs.costElecBulbs)}</span></div>}
                    {inputs.qtyElecFan > 0 && <div className="flex justify-between"><span>Fan Repair (x{inputs.qtyElecFan})</span><span>{formatCurrency(inputs.qtyElecFan * inputs.costElecFan)}</span></div>}
                    {inputs.qtyElecSwitches > 0 && <div className="flex justify-between"><span>Switches (x{inputs.qtyElecSwitches})</span><span>{formatCurrency(inputs.qtyElecSwitches * inputs.costElecSwitches)}</span></div>}
                    {inputs.qtyElecPlug > 0 && <div className="flex justify-between"><span>Plug Point (x{inputs.qtyElecPlug})</span><span>{formatCurrency(inputs.qtyElecPlug * inputs.costElecPlug)}</span></div>}
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Plumbing & Masonry */}
        <Card className="print:border-black shadow-none">
          <CardHeader className="p-4">
            <CardTitle className="text-md flex items-center gap-2"><Wrench className="h-4 w-4 text-emerald-500 print:text-black" /> Plumbing & Masonry</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3 print:space-y-1">
            <div className="space-y-2">
                <div className="flex justify-between items-center mb-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Plumbing Items</p>
                    <span className="text-[10px] font-bold text-emerald-600 print:text-black">{formatCurrency(calculations.plumbingTotal)}</span>
                </div>
                <div className="space-y-1.5 print:hidden">
                    {renderQtyPriceRow("Hose Pipe", "qtyPlumbHose", "costPlumbHose")}
                    {renderQtyPriceRow("Taps", "qtyPlumbTaps", "costPlumbTaps")}
                    {renderQtyPriceRow("Drain Taps", "qtyPlumbDrainTaps", "costPlumbDrainTaps")}
                    {renderQtyPriceRow("Plugs/Cover", "qtyPlumbPlugs", "costPlumbPlugs")}
                    {renderQtyPriceRow("Angle Valve", "qtyPlumbAngleValve", "costPlumbAngleValve")}
                    {renderQtyPriceRow("Washbasin Valve", "qtyPlumbWashbasinValve", "costPlumbWashbasinValve")}
                    {renderQtyPriceRow("Faucet", "qtyPlumbFaucet", "costPlumbFaucet")}
                    {renderQtyPriceRow("Flush Tank", "qtyPlumbFlushTank", "costPlumbFlushTank")}
                    {renderQtyPriceRow("Kitchen Sink", "qtyPlumbKitchenSink", "costPlumbKitchenSink")}
                </div>
                <div className="hidden print:block space-y-0.5 text-xs">
                    {inputs.qtyPlumbHose > 0 && <div className="flex justify-between"><span>Hose Pipe (x{inputs.qtyPlumbHose})</span><span>{formatCurrency(inputs.qtyPlumbHose * inputs.costPlumbHose)}</span></div>}
                    {inputs.qtyPlumbTaps > 0 && <div className="flex justify-between"><span>Taps (x{inputs.qtyPlumbTaps})</span><span>{formatCurrency(inputs.qtyPlumbTaps * inputs.costPlumbTaps)}</span></div>}
                    {inputs.qtyPlumbDrainTaps > 0 && <div className="flex justify-between"><span>Drain Taps (x{inputs.qtyPlumbDrainTaps})</span><span>{formatCurrency(inputs.qtyPlumbDrainTaps * inputs.costPlumbDrainTaps)}</span></div>}
                    {inputs.qtyPlumbPlugs > 0 && <div className="flex justify-between"><span>Plugs/Cover (x{inputs.qtyPlumbPlugs})</span><span>{formatCurrency(inputs.qtyPlumbPlugs * inputs.costPlumbPlugs)}</span></div>}
                    {inputs.qtyPlumbAngleValve > 0 && <div className="flex justify-between"><span>Angle Valve (x{inputs.qtyPlumbAngleValve})</span><span>{formatCurrency(inputs.qtyPlumbAngleValve * inputs.costPlumbAngleValve)}</span></div>}
                    {inputs.qtyPlumbWashbasinValve > 0 && <div className="flex justify-between"><span>Washbasin Valve (x{inputs.qtyPlumbWashbasinValve})</span><span>{formatCurrency(inputs.qtyPlumbWashbasinValve * inputs.costPlumbWashbasinValve)}</span></div>}
                    {inputs.qtyPlumbFaucet > 0 && <div className="flex justify-between"><span>Faucet (x{inputs.qtyPlumbFaucet})</span><span>{formatCurrency(inputs.qtyPlumbFaucet * inputs.costPlumbFaucet)}</span></div>}
                    {inputs.qtyPlumbFlushTank > 0 && <div className="flex justify-between"><span>Flush Tank (x{inputs.qtyPlumbFlushTank})</span><span>{formatCurrency(inputs.qtyPlumbFlushTank * inputs.costPlumbFlushTank)}</span></div>}
                    {inputs.qtyPlumbKitchenSink > 0 && <div className="flex justify-between"><span>Kitchen Sink (x{inputs.qtyPlumbKitchenSink})</span><span>{formatCurrency(inputs.qtyPlumbKitchenSink * inputs.costPlumbKitchenSink)}</span></div>}
                </div>
            </div>
            <div className="border-t pt-2 mt-2 print:border-black print:mt-1">
                <div className="print:hidden">{renderInputField("Masonry / Civil Work", "masonExpenses")}</div>
                <div className="hidden print:flex justify-between text-xs pt-1"><span>Masonry Work:</span><span>{formatCurrency(inputs.masonExpenses)}</span></div>
            </div>
          </CardContent>
        </Card>

        {/* Cleaning & Painting */}
        <Card className="md:col-span-2 lg:col-span-1 print:border-black shadow-none">
          <CardHeader className="p-4">
            <CardTitle className="text-md flex items-center gap-2"><Brush className="h-4 w-4 text-purple-500 print:text-black" /> Finishing & Cleaning</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4 print:space-y-1">
            <div className="print:hidden">{renderInputField("Painting Expenses", "paintingExpenses")}</div>
            <div className="hidden print:flex justify-between text-sm"><span>Painting:</span><span>{formatCurrency(inputs.paintingExpenses)}</span></div>
            
            <div className="space-y-2 border-t pt-2 mt-2 print:border-black print:mt-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Cleaning Fees</p>
                <div className="print:hidden">
                    {renderInputField("Agreement Cleaning Charge", "cleaningAgreement")}
                    {renderInputField("Misc. Cleaning / Shifting", "cleaningMisc")}
                </div>
                <div className="hidden print:block space-y-0.5 text-xs">
                    <div className="flex justify-between"><span>Agreement Cleaning:</span><span>{formatCurrency(inputs.cleaningAgreement)}</span></div>
                    <div className="flex justify-between"><span>Misc. Cleaning:</span><span>{formatCurrency(inputs.cleaningMisc)}</span></div>
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Breakdown */}
        <Card className="md:col-span-2 lg:col-span-2 print:border-black shadow-none">
            <CardHeader className="p-4">
                <CardTitle className="text-md">Deduction Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 text-xs">
                    <div className="flex justify-between border-b pb-1 print:border-black">
                        <span className="text-muted-foreground print:text-black">Rent Arrears:</span>
                        <span className="font-medium">{formatCurrency(inputs.rentalBalance)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1 print:border-black">
                        <span className="text-muted-foreground print:text-black">Total EB Bill:</span>
                        <span className="font-medium">{formatCurrency(calculations.ebCharge + inputs.commonEbCharges)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1 print:border-black">
                        <span className="text-muted-foreground print:text-black">Electrical Total:</span>
                        <span className="font-medium">{formatCurrency(calculations.electricalTotal)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1 print:border-black">
                        <span className="text-muted-foreground print:text-black">Plumbing Total:</span>
                        <span className="font-medium">{formatCurrency(calculations.plumbingTotal)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1 print:border-black">
                        <span className="text-muted-foreground print:text-black">Wood & Masonry:</span>
                        <span className="font-medium">{formatCurrency(inputs.repairWood + inputs.masonExpenses)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1 print:border-black">
                        <span className="text-muted-foreground print:text-black">Painting:</span>
                        <span className="font-medium">{formatCurrency(inputs.paintingExpenses)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1 print:border-black">
                        <span className="text-muted-foreground print:text-black">Cleaning:</span>
                        <span className="font-medium">{formatCurrency(calculations.cleaningTotal)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1 bg-red-50 dark:bg-red-950/20 px-1 rounded print:border-black print:bg-white">
                        <span className="font-bold">Total Deductions:</span>
                        <span className="font-bold text-red-600 print:text-black">{formatCurrency(calculations.totalDeductions)}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="bg-muted/50 p-4 rounded-b-xl flex justify-between items-center print:bg-white print:border-t print:border-black">
                <div className="flex items-center gap-2 font-bold text-lg print:text-sm">
                    <span className="text-muted-foreground text-sm uppercase print:text-black">Deposit</span>
                    <ArrowRight className="h-4 w-4" />
                    <span className="text-primary print:text-black">{formatCurrency(inputs.advanceAmount)}</span>
                </div>
                <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground print:text-black">Refund Balance</p>
                    <p className={`text-2xl font-black ${calculations.balanceDue > 0 ? "text-orange-600" : "text-green-600"} print:text-black print:text-xl`}>
                        {formatCurrency(calculations.balanceDue > 0 ? -calculations.balanceDue : calculations.finalRefund)}
                    </p>
                </div>
            </CardFooter>
        </Card>
      </div>

      <div className="hidden print:block mt-12 text-center text-[10px] text-muted-foreground">
        <p>This statement is generated for mutual settlement between the Landlord and Tenant.</p>
        <p className="mt-4 border-t border-dashed border-gray-300 pt-2">Tenant Signature / Date &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Landlord Signature / Date</p>
      </div>
    </div>
  );
};

export default RentVacateCalculator;