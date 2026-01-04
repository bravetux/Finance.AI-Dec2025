"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Landmark, Upload, Download, Trash2, PlusCircle, DollarSign } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CurrencyInput from "@/components/CurrencyInput";

type AssetCategory = 'US Stocks' | 'ETF' | 'Custom';

interface USEquityAsset {
  id: string;
  name: string;
  category: AssetCategory;
  usdValue: number;
  value: number; // This remains INR for compatibility with Net Worth calculator
}

const initialAssets: USEquityAsset[] = [];

const USEquity: React.FC = () => {
  const [conversionRate, setConversionRate] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('usdToInrRate');
      return saved ? parseFloat(saved) : 83.50;
    } catch {
      return 83.50;
    }
  });

  const [assets, setAssets] = useState<USEquityAsset[]>(() => {
    try {
      const saved = localStorage.getItem('usEquityData');
      return saved ? JSON.parse(saved) : initialAssets;
    } catch {
      return initialAssets;
    }
  });

  useEffect(() => {
    localStorage.setItem('usdToInrRate', conversionRate.toString());
  }, [conversionRate]);

  useEffect(() => {
    localStorage.setItem('usEquityData', JSON.stringify(assets));
    window.dispatchEvent(new Event('storage'));
  }, [assets]);

  // Update all INR values if conversion rate changes
  const handleRateChange = (newRate: number) => {
    setConversionRate(newRate);
    setAssets(prev => prev.map(asset => ({
      ...asset,
      value: asset.usdValue * newRate
    })));
  };

  const handleAddRow = () => {
    const newAsset: USEquityAsset = {
      id: Date.now().toString(),
      name: '',
      category: 'US Stocks',
      usdValue: 0,
      value: 0,
    };
    setAssets(prev => [...prev, newAsset]);
  };

  const handleDeleteRow = (id: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
  };

  const handleAssetChange = (id: string, field: keyof USEquityAsset, value: any) => {
    setAssets(prev =>
      prev.map(asset => {
        if (asset.id === id) {
          const updated = { ...asset, [field]: value };
          if (field === 'usdValue') {
            updated.value = (value as number) * conversionRate;
          }
          return updated;
        }
        return asset;
      })
    );
  };

  const allocationSummary = useMemo(() => {
    const allocation: { [key in AssetCategory]: number } = {
      'US Stocks': 0,
      'ETF': 0,
      'Custom': 0,
    };

    assets.forEach(asset => {
      allocation[asset.category] += asset.value;
    });

    const totalInr = Object.values(allocation).reduce((sum, val) => sum + val, 0);
    const totalUsd = totalInr / conversionRate;
    
    const chartData = Object.entries(allocation)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);
    
    const allocationWithContribution = Object.entries(allocation).map(([name, value]) => ({
      name,
      value,
      contribution: totalInr > 0 ? (value / totalInr) * 100 : 0,
    }));

    return { allocationWithContribution, totalInr, totalUsd, chartData };
  }, [assets, conversionRate]);

  const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;
  const formatUSD = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ assets, conversionRate }, null, 2)], { type: 'application/json' });
    saveAs(blob, 'us-equity-data.json');
    showSuccess('US Equity data exported successfully!');
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        if (data.assets && Array.isArray(data.assets)) {
          setAssets(data.assets);
          if (data.conversionRate) setConversionRate(data.conversionRate);
          showSuccess('Data imported successfully!');
        } else if (Array.isArray(data)) {
          setAssets(data);
          showSuccess('Data imported successfully!');
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
    setAssets([]);
    showSuccess('All US Equity data has been cleared.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Landmark className="h-8 w-8" />
          US Equity
        </h1>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-muted p-2 rounded-lg border">
            <DollarSign className="h-4 w-4 text-primary" />
            <Label htmlFor="rate" className="text-sm font-medium whitespace-nowrap">1 USD = ₹</Label>
            <Input
              id="rate"
              type="number"
              step="0.01"
              value={conversionRate}
              onChange={(e) => handleRateChange(parseFloat(e.target.value) || 0)}
              className="w-24 h-8 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" /> Clear
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will delete all asset entries on this page. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearData}>Yes, clear data</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button variant="outline" size="sm" onClick={exportData}>
              <Upload className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Label htmlFor="import-file" className="cursor-pointer">
                <Download className="mr-2 h-4 w-4" /> Import
                <Input id="import-file" type="file" accept=".json" className="hidden" onChange={importData} />
              </Label>
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>US Holdings</CardTitle>
            <CardDescription>Enter values in USD. INR is auto-calculated based on current rate.</CardDescription>
          </div>
          <Button onClick={handleAddRow}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Asset
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[5%] py-1 px-1 text-center">S.No</TableHead>
                  <TableHead className="py-1 px-1">Asset Name</TableHead>
                  <TableHead className="py-1 px-1 w-[150px]">Category</TableHead>
                  <TableHead className="py-1 px-1 w-[180px] text-right">Value (USD)</TableHead>
                  <TableHead className="py-1 px-1 w-[180px] text-right">Value (INR)</TableHead>
                  <TableHead className="text-right py-1 px-1 w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.length > 0 ? assets.map((asset, index) => (
                  <TableRow key={asset.id} className="h-10">
                    <TableCell className="py-0 px-1 text-center text-xs text-muted-foreground">{index + 1}</TableCell>
                    <TableCell className="p-0">
                      <Input
                        value={asset.name}
                        onChange={e => handleAssetChange(asset.id, 'name', e.target.value)}
                        placeholder="e.g., Apple Inc."
                        className="bg-transparent border-0 focus-visible:ring-0 h-9 text-sm"
                      />
                    </TableCell>
                    <TableCell className="p-0">
                      <Select
                        value={asset.category}
                        onValueChange={(value: AssetCategory) => handleAssetChange(asset.id, 'category', value)}
                      >
                        <SelectTrigger className="bg-transparent border-0 focus:ring-0 h-9 w-full text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US Stocks">US Stocks</SelectItem>
                          <SelectItem value="ETF">ETF</SelectItem>
                          <SelectItem value="Custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-0">
                      <Input
                        type="text"
                        value={asset.usdValue.toLocaleString('en-US')}
                        onChange={e => {
                          const numericValue = Number(e.target.value.replace(/,/g, ''));
                          if (!isNaN(numericValue)) {
                            handleAssetChange(asset.id, 'usdValue', numericValue);
                          }
                        }}
                        placeholder="0.00"
                        className="bg-transparent border-0 focus-visible:ring-0 h-9 text-sm text-right font-medium"
                      />
                    </TableCell>
                    <TableCell className="py-0 px-4 text-right text-sm text-muted-foreground font-medium">
                      {formatCurrency(asset.value)}
                    </TableCell>
                    <TableCell className="text-right py-0 px-1">
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteRow(asset.id)} className="h-8 w-8">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground text-sm">
                      No assets added yet. Click "Add Asset" to begin.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell colSpan={3} className="py-2 px-1 text-sm">Total Portfolio Value</TableCell>
                  <TableCell className="text-right py-2 px-1 text-sm">{formatUSD(allocationSummary.totalUsd)}</TableCell>
                  <TableCell className="text-right py-2 px-4 text-sm">{formatCurrency(allocationSummary.totalInr)}</TableCell>
                  <TableCell className="py-2 px-1" />
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Asset Allocation Summary</CardTitle>
          <CardDescription>Breakdown of your US portfolio by category (in INR).</CardDescription>
        </CardHeader>
        <CardContent>
          <ResizablePanelGroup direction="horizontal" className="min-h-[300px] w-full border rounded-xl overflow-hidden">
            <ResizablePanel defaultSize={50}>
              <div className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="py-1 px-1">Category</TableHead>
                      <TableHead className="text-right py-1 px-1">Value (INR)</TableHead>
                      <TableHead className="text-right py-1 px-1">Contribution</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allocationSummary.allocationWithContribution.map(item => (
                      <TableRow key={item.name} className="h-10">
                        <TableCell className="font-medium py-0 px-1 text-sm">{item.name}</TableCell>
                        <TableCell className="text-right py-0 px-1 text-sm font-medium">{formatCurrency(item.value)}</TableCell>
                        <TableCell className="text-right py-0 px-1 text-sm text-muted-foreground">{item.contribution.toFixed(2)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow className="bg-muted/30 font-bold border-t-2">
                      <TableCell className="py-2 px-1 text-sm">Total</TableCell>
                      <TableCell className="text-right py-2 px-1 text-sm">{formatCurrency(allocationSummary.totalInr)}</TableCell>
                      <TableCell className="text-right py-2 px-1 text-sm">100.00%</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
              <div className="h-full flex items-center justify-center p-4">
                <GenericPieChart data={allocationSummary.chartData} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </CardContent>
      </Card>
    </div>
  );
};

export default USEquity;