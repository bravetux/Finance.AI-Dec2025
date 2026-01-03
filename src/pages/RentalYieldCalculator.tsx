"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Home, Upload, Download, Trash2, Calculator } from "lucide-react";
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

interface RentalProperty {
  id: string;
  name: string;
  value: number;
  rent: number;
}

const initialRentalProperties: RentalProperty[] = [
  { id: 'rp1', name: 'Home 1', value: 0, rent: 0 },
  { id: 'rp2', name: 'Commercial 1', value: 0, rent: 0 },
  { id: 'rp3', name: 'Home 2', value: 0, rent: 0 },
];

const RentalYieldCalculator: React.FC = () => {
  const [rentalProperties, setRentalProperties] = useState<RentalProperty[]>(() => {
    try {
      const saved = localStorage.getItem('realEstateRentalProperties');
      return saved ? JSON.parse(saved) : initialRentalProperties;
    } catch {
      return initialRentalProperties;
    }
  });

  useEffect(() => {
    localStorage.setItem('realEstateRentalProperties', JSON.stringify(rentalProperties));
  }, [rentalProperties]);

  const handleRentalPropertyChange = (id: string, field: 'value' | 'rent', value: string) => {
    const numericValue = Number(value.replace(/,/g, ''));
    if (isNaN(numericValue)) return;
    setRentalProperties(prev =>
      prev.map(p => (p.id === id ? { ...p, [field]: numericValue } : p))
    );
  };

  const rentalCalculations = useMemo(() => {
    return rentalProperties.map(p => {
      const annualRent = p.rent * 12;
      const yieldPercent = p.value > 0 ? (annualRent / p.value) * 100 : 0;
      return { ...p, annualRent, yieldPercent };
    });
  }, [rentalProperties]);

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(rentalProperties, null, 2)], { type: 'application/json' });
    saveAs(blob, 'rental-yield-data.json');
    showSuccess('Rental yield data exported successfully!');
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        if (Array.isArray(data)) {
          setRentalProperties(data);
          showSuccess('Rental yield data imported successfully!');
        } else {
          showError('Invalid file format.');
        }
      } catch (err) {
        showError('Failed to parse the file.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleClearData = () => {
    setRentalProperties(initialRentalProperties.map(p => ({ ...p, value: 0, rent: 0 })));
    showSuccess('Rental yield data has been cleared.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calculator className="h-8 w-8" />
          Rental Yield Calculator
        </h1>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Clear Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset all values in this calculator. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearData}>Yes, clear data</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="outline" onClick={exportData}>
            <Upload className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button variant="outline" asChild>
            <Label htmlFor="import-file" className="cursor-pointer">
              <Download className="mr-2 h-4 w-4" /> Import
              <Input id="import-file" type="file" accept=".json" className="hidden" onChange={importData} />
            </Label>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Properties & Yields</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property Name</TableHead>
                  <TableHead>Property Value (INR)</TableHead>
                  <TableHead>Monthly Rent (INR)</TableHead>
                  <TableHead className="text-right">Annual Rent</TableHead>
                  <TableHead className="text-right">Gross Yield %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentalCalculations.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        value={p.value.toLocaleString('en-IN')}
                        onChange={e => handleRentalPropertyChange(p.id, 'value', e.target.value)}
                        className="w-36"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        value={p.rent.toLocaleString('en-IN')}
                        onChange={e => handleRentalPropertyChange(p.id, 'rent', e.target.value)}
                        className="w-32"
                      />
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(p.annualRent)}</TableCell>
                    <TableCell className="text-right font-bold text-primary">{p.yieldPercent.toFixed(2)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>📉 Rental Yield &lt; 6%</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Low yield territory</strong> — the rental income isn’t compensating you enough for the property’s market value.</p>
            <p>This usually happens in metro/prime city areas where prices are high but rents haven’t kept pace.</p>
            <p>Treat the property more as a <strong>capital appreciation play</strong> rather than a pure income generator. You’re banking on long-term price growth.</p>
            <p>But if capital appreciation is also sluggish, your money is working too slowly — better to consider selling and reallocating to higher-yield or faster-growth assets.</p>
            <p>Alternative investments (REITs, bonds, dividend stocks) could beat your current yield with less headache.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>✅ Rental Yield ≥ 6%</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Healthy income zone</strong> — you’re getting decent cash flow relative to property value.</p>
            <p>Can be a sign of undervalued property or high rental demand (often in tier-2/tier-3 cities or commercial spaces).</p>
            <p>You can hold and reinvest the rental income, potentially compounding returns.</p>
            <p>Still, compare with local REIT yields (often 6–8%) — if you’re earning more, you’ve got a solid asset.</p>
            <p>Factor in maintenance, vacancy, and tax — real net yield after expenses might be 1–2% lower.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>💡 Golden Rule</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium text-muted-foreground">
            For long-term investors, a rental yield below 6% needs strong capital growth to justify holding. A yield above 6% can justify holding even without significant price appreciation, as the cash flow itself is robust.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RentalYieldCalculator;