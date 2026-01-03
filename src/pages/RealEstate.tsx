"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Home, Upload, Download, Trash2 } from "lucide-react";
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
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import GenericPieChart from "@/components/GenericPieChart";

// Interfaces for our data structures
interface PropertyValue {
  id: string;
  name: string;
  value: number;
}

// Initial data now excludes REIT
const initialPropertyValues: PropertyValue[] = [
  { id: 'pv1', name: 'Home 1', value: 0 },
  { id: 'pv2', name: 'Home 2', value: 0 },
  { id: 'pv3', name: 'Commercial 1', value: 0 },
  { id: 'pv4', name: 'Commercial 2', value: 0 },
  { id: 'pv5', name: 'Land', value: 0 },
];

const RealEstate: React.FC = () => {
  // State for property values
  const [propertyValues, setPropertyValues] = useState<PropertyValue[]>(() => {
    try {
      const saved = localStorage.getItem('realEstatePropertyValues');
      return saved ? JSON.parse(saved) : initialPropertyValues;
    } catch {
      return initialPropertyValues;
    }
  });

  // State for REIT value
  const [reitValue, setReitValue] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('realEstateReitValue');
      return saved ? JSON.parse(saved) : 0;
    } catch {
      return 0;
    }
  });

  // Persist data to localStorage
  useEffect(() => {
    localStorage.setItem('realEstatePropertyValues', JSON.stringify(propertyValues));
  }, [propertyValues]);

  useEffect(() => {
    localStorage.setItem('realEstateReitValue', JSON.stringify(reitValue));
  }, [reitValue]);

  // Update net worth data in localStorage whenever property or REIT values change
  useEffect(() => {
    try {
      const home1 = propertyValues.find(p => p.name === 'Home 1');
      const home1Value = home1 ? home1.value : 0;

      const totalPropertyValue = propertyValues.reduce((sum, p) => sum + p.value, 0);
      const otherRealEstateValue = totalPropertyValue - home1Value;

      const savedNetWorthData = localStorage.getItem('netWorthData');
      const netWorthData = savedNetWorthData ? JSON.parse(savedNetWorthData) : {};
      
      const updatedNetWorthData = {
        ...netWorthData,
        homeValue: home1Value,
        otherRealEstate: otherRealEstateValue,
        reits: reitValue,
      };

      localStorage.setItem('netWorthData', JSON.stringify(updatedNetWorthData));
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error("Failed to update net worth data from Real Estate page:", error);
    }
  }, [propertyValues, reitValue]);

  // Handlers for input changes
  const handlePropertyValueChange = (id: string, value: string) => {
    const numericValue = Number(value.replace(/,/g, ''));
    if (isNaN(numericValue)) return;
    if (numericValue.toString().length > 9) return;
    setPropertyValues(prev =>
      prev.map(p => (p.id === id ? { ...p, value: numericValue } : p))
    );
  };

  const handleReitValueChange = (value: string) => {
    const numericValue = Number(value.replace(/,/g, ''));
    if (isNaN(numericValue)) return;
    if (numericValue.toString().length > 9) return;
    setReitValue(numericValue);
  };

  // Calculations
  const totalPropertyValue = useMemo(() => {
    return propertyValues.reduce((sum, p) => sum + p.value, 0);
  }, [propertyValues]);

  const propertyChartData = useMemo(() => {
    return propertyValues
      .filter(p => p.value > 0)
      .map(p => ({
        name: p.name,
        value: p.value,
      }));
  }, [propertyValues]);

  // Helper for formatting currency
  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 10000000) { // 1 Crore
      const crores = value / 10000000;
      const formattedCrores = parseFloat(crores.toFixed(2));
      return `₹ ${formattedCrores.toLocaleString('en-IN')} Crores`;
    }
    if (Math.abs(value) >= 100000) { // 1 Lakh
      const lakhs = value / 100000;
      const formattedLakhs = parseFloat(lakhs.toFixed(2));
      return `₹ ${formattedLakhs.toLocaleString('en-IN')} Lakhs`;
    }
    return `₹ ${value.toLocaleString('en-IN')}`;
  };

  // Data management functions
  const exportData = () => {
    const dataToExport = {
      propertyValues,
      reitValue,
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    saveAs(blob, 'real-estate-data.json');
    showSuccess('Real estate data exported successfully!');
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        if (data.propertyValues) {
          setPropertyValues(data.propertyValues);
          if (typeof data.reitValue === 'number') {
            setReitValue(data.reitValue);
          }
          showSuccess('Real estate data imported successfully!');
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
    setPropertyValues(initialPropertyValues.map(p => ({ ...p, value: 0 })));
    setReitValue(0);
    showSuccess('Real estate data has been cleared.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Home className="h-8 w-8" />
          Real Estate
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
                  This will reset all data on this page to its default state. This action cannot be undone.
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

      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[450px] w-full rounded-lg border"
      >
        <ResizablePanel defaultSize={50}>
          <Card className="h-full border-0 shadow-none rounded-none">
            <CardHeader>
              <CardTitle>Property Value</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Particulars</TableHead>
                    <TableHead className="text-right">Value (INR)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {propertyValues.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="p-1">
                        <Input
                          type="text"
                          value={p.value.toLocaleString('en-IN')}
                          onChange={e => handlePropertyValueChange(p.id, e.target.value)}
                          className="w-full text-right bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-offset-0 h-auto"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(totalPropertyValue)}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <Card className="h-full border-0 shadow-none rounded-none">
            <CardHeader>
              <CardTitle>Property Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <GenericPieChart data={propertyChartData} showLegend={false} />
            </CardContent>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>

      <Card>
        <CardHeader>
          <CardTitle>REIT (Real Estate Investment Trust)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="reit-value" className="text-lg font-medium">Current Value (INR)</Label>
            <div className="w-1/3">
              <Input
                id="reit-value"
                type="text"
                value={reitValue.toLocaleString('en-IN')}
                onChange={e => handleReitValueChange(e.target.value)}
                className="text-right text-lg font-bold"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealEstate;