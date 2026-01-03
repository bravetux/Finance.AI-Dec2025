"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Home, Upload, Download, Trash2, Calculator, Clock, TrendingUp, PlusCircle, FileText } from "lucide-react";
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

interface RentalCalculation extends RentalProperty {
  annualRent: number;
  yieldPercent: number;
  futureRent: number;
  futureYieldPercent: number;
}

const initialRentalProperties: RentalProperty[] = [
  { id: 'rp1', name: 'Home 1', value: 0, rent: 0 },
  { id: 'rp2', name: 'Commercial 1', value: 0, rent: 0 },
  { id: 'rp3', name: 'Home 2', value: 0, rent: 0 },
];

const RENTAL_YIELD_STATE_KEY = 'realEstateRentalProperties';
const RENTAL_PROJECTION_SETTINGS_KEY = 'rentalProjectionSettings';

const initialProjectionSettings = {
  yearsToProject: 10,
  rentalInflationRate: 5,
  propertyAppreciationRate: 5,
};

const RentalYieldCalculator: React.FC = () => {
  const [rentalProperties, setRentalProperties] = useState<RentalProperty[]>(() => {
    try {
      const saved = localStorage.getItem(RENTAL_YIELD_STATE_KEY);
      return saved ? JSON.parse(saved) : initialRentalProperties;
    } catch {
      return initialRentalProperties;
    }
  });

  const [projectionSettings, setProjectionSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem(RENTAL_PROJECTION_SETTINGS_KEY);
      return savedSettings ? JSON.parse(savedSettings) : initialProjectionSettings;
    } catch (e) {
      return initialProjectionSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem(RENTAL_YIELD_STATE_KEY, JSON.stringify(rentalProperties));
  }, [rentalProperties]);

  useEffect(() => {
    localStorage.setItem(RENTAL_PROJECTION_SETTINGS_KEY, JSON.stringify(projectionSettings));
  }, [projectionSettings]);

  const handleRentalPropertyChange = (id: string, field: 'value' | 'rent' | 'name', value: string) => {
    setRentalProperties(prev =>
      prev.map(p => {
        if (p.id === id) {
          if (field === 'name') {
            return { ...p, name: value };
          }
          const numericValue = Number(value.replace(/,/g, ''));
          if (isNaN(numericValue)) return p;
          return { ...p, [field]: numericValue };
        }
        return p;
      })
    );
  };

  const handleProjectionSettingChange = (field: keyof typeof initialProjectionSettings, value: string) => {
    setProjectionSettings(prev => ({ ...prev, [field]: Number(value) || 0 }));
  };

  const handleAddRow = () => {
    const newProperty: RentalProperty = {
      id: Date.now().toString(),
      name: `Property ${rentalProperties.length + 1}`,
      value: 0,
      rent: 0,
    };
    setRentalProperties(prev => [...prev, newProperty]);
  };

  const handleDeleteRow = (id: string) => {
    setRentalProperties(prev => prev.filter(p => p.id !== id));
  };

  const rentalCalculations = useMemo((): RentalCalculation[] => {
    const { yearsToProject, rentalInflationRate, propertyAppreciationRate } = projectionSettings;
    
    return rentalProperties.map(p => {
      const annualRent = p.rent * 12;
      const yieldPercent = p.value > 0 ? (annualRent / p.value) * 100 : 0;

      // Future Calculations
      const futureRent = p.rent * Math.pow(1 + rentalInflationRate / 100, yearsToProject);
      const futurePropertyValue = p.value * Math.pow(1 + propertyAppreciationRate / 100, yearsToProject);
      const futureAnnualRent = futureRent * 12;
      const futureYieldPercent = futurePropertyValue > 0 ? (futureAnnualRent / futurePropertyValue) * 100 : 0;

      return { 
        ...p, 
        annualRent, 
        yieldPercent, 
        futureRent: Math.round(futureRent),
        futureYieldPercent,
      };
    });
  }, [rentalProperties, projectionSettings]);

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const exportData = () => {
    const dataToExport = {
      rentalProperties,
      projectionSettings,
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
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
        if (data.rentalProperties && Array.isArray(data.rentalProperties)) {
          setRentalProperties(data.rentalProperties);
          if (data.projectionSettings) {
            setProjectionSettings(data.projectionSettings);
          }
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
    setProjectionSettings(initialProjectionSettings);
    showSuccess('Rental yield data has been cleared.');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calculator className="h-8 w-8" />
          Rental Yield Calculator
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <FileText className="mr-2 h-4 w-4" /> Export to PDF
          </Button>
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
            <Upload className="mr-2 h-4 w-4" /> Export JSON
          </Button>
          <Button variant="outline" asChild>
            <Label htmlFor="import-file" className="cursor-pointer">
              <Download className="mr-2 h-4 w-4" /> Import JSON
              <Input id="import-file" type="file" accept=".json" className="hidden" onChange={importData} />
            </Label>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projection Settings</CardTitle>
          <CardDescription>Define the time horizon and expected growth rates for future value calculations.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="yearsToProject" className="flex items-center gap-2"><Clock className="h-4 w-4" /> Years to Project</Label>
            <Input
              id="yearsToProject"
              type="number"
              value={projectionSettings.yearsToProject}
              onChange={e => handleProjectionSettingChange('yearsToProject', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rentalInflationRate" className="flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Rental Inflation Rate (%)</Label>
            <Input
              id="rentalInflationRate"
              type="number"
              value={projectionSettings.rentalInflationRate}
              onChange={e => handleProjectionSettingChange('rentalInflationRate', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="propertyAppreciationRate" className="flex items-center gap-2"><Home className="h-4 w-4" /> Property Appreciation Rate (%)</Label>
            <Input
              id="propertyAppreciationRate"
              type="number"
              value={projectionSettings.propertyAppreciationRate}
              onChange={e => handleProjectionSettingChange('propertyAppreciationRate', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Properties & Yields</CardTitle>
          <Button size="sm" onClick={handleAddRow}><PlusCircle className="mr-2 h-4 w-4" /> Add Property</Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property Name</TableHead>
                  <TableHead>Property Value (INR)</TableHead>
                  <TableHead>Monthly Rent (INR)</TableHead>
                  <TableHead className="text-right">Gross Yield % (Today)</TableHead>
                  <TableHead className="text-right">Future Monthly Rent</TableHead>
                  <TableHead className="text-right">Future Yield %</TableHead>
                  <TableHead className="w-[50px] print:hidden">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentalCalculations.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium p-1">
                      <Input
                        type="text"
                        value={p.name}
                        onChange={e => handleRentalPropertyChange(p.id, 'name', e.target.value)}
                        className="w-full bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-offset-0 h-auto"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        type="text"
                        value={p.value.toLocaleString('en-IN')}
                        onChange={e => handleRentalPropertyChange(p.id, 'value', e.target.value)}
                        className="w-36 text-right bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-offset-0 h-auto"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        type="text"
                        value={p.rent.toLocaleString('en-IN')}
                        onChange={e => handleRentalPropertyChange(p.id, 'rent', e.target.value)}
                        className="w-32 text-right bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-offset-0 h-auto"
                      />
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary">{p.yieldPercent.toFixed(2)}%</TableCell>
                    <TableCell className="text-right text-green-600 font-medium">{formatCurrency(p.futureRent)}</TableCell>
                    <TableCell className="text-right font-bold text-orange-500">{p.futureYieldPercent.toFixed(2)}%</TableCell>
                    <TableCell className="p-1 text-center print:hidden">
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteRow(p.id)} className="h-8 w-8">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
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

      <Card className="print:hidden">
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