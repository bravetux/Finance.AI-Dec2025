"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Landmark, Upload, Download, Trash2, PlusCircle } from "lucide-react";
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

type AssetCategory = 'US Stocks' | 'ETF' | 'Custom';

interface USEquityAsset {
  id: string;
  name: string;
  category: AssetCategory;
  value: number;
}

const initialAssets: USEquityAsset[] = [];

const USEquity: React.FC = () => {
  const [assets, setAssets] = useState<USEquityAsset[]>(() => {
    try {
      const saved = localStorage.getItem('usEquityData');
      return saved ? JSON.parse(saved) : initialAssets;
    } catch {
      return initialAssets;
    }
  });

  useEffect(() => {
    localStorage.setItem('usEquityData', JSON.stringify(assets));
    window.dispatchEvent(new Event('storage'));
  }, [assets]);

  const handleAddRow = () => {
    const newAsset: USEquityAsset = {
      id: Date.now().toString(),
      name: '',
      category: 'US Stocks',
      value: 0,
    };
    setAssets(prev => [...prev, newAsset]);
  };

  const handleDeleteRow = (id: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
  };

  const handleAssetChange = (id: string, field: keyof USEquityAsset, value: string | number) => {
    setAssets(prev =>
      prev.map(asset => (asset.id === id ? { ...asset, [field]: value } : asset))
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

    const totalValue = Object.values(allocation).reduce((sum, val) => sum + val, 0);
    
    const chartData = Object.entries(allocation)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);
    
    const allocationWithContribution = Object.entries(allocation).map(([name, value]) => ({
      name,
      value,
      contribution: totalValue > 0 ? (value / totalValue) * 100 : 0,
    }));

    return { allocationWithContribution, totalValue, chartData };
  }, [assets]);

  const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

  const exportData = () => {
    const blob = new Blob([JSON.stringify(assets, null, 2)], { type: 'application/json' });
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
        if (Array.isArray(data)) {
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Landmark className="h-8 w-8" />
          US Equity
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
                  This will delete all asset entries on this page. This action cannot be undone.
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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>US Holdings</CardTitle>
            <CardDescription>Track your international investments in US stocks and ETFs.</CardDescription>
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
                  <TableHead className="w-[5%] py-1 px-1">S.No</TableHead>
                  <TableHead className="py-1 px-1">Asset Name</TableHead>
                  <TableHead className="py-1 px-1">Category</TableHead>
                  <TableHead className="py-1 px-1">Current Value (INR)</TableHead>
                  <TableHead className="text-right py-1 px-1">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.length > 0 ? assets.map((asset, index) => (
                  <TableRow key={asset.id} className="h-9">
                    <TableCell className="py-0 px-1 align-middle text-xs">{index + 1}</TableCell>
                    <TableCell className="p-0">
                      <Input
                        value={asset.name}
                        onChange={e => handleAssetChange(asset.id, 'name', e.target.value)}
                        placeholder="Enter asset name"
                        className="bg-transparent border-0 focus-visible:ring-0 h-7 text-sm"
                      />
                    </TableCell>
                    <TableCell className="p-0">
                      <Select
                        value={asset.category}
                        onValueChange={(value: AssetCategory) => handleAssetChange(asset.id, 'category', value)}
                      >
                        <SelectTrigger className="bg-transparent border-0 focus:ring-0 h-7 w-full text-sm">
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
                        value={asset.value.toLocaleString('en-IN')}
                        onChange={e => {
                          const numericValue = Number(e.target.value.replace(/,/g, ''));
                          if (!isNaN(numericValue)) {
                            handleAssetChange(asset.id, 'value', numericValue);
                          }
                        }}
                        className="bg-transparent border-0 focus-visible:ring-0 h-7 text-sm"
                      />
                    </TableCell>
                    <TableCell className="text-right py-0 px-1">
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteRow(asset.id)} className="h-7 w-7">
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-20 text-muted-foreground text-sm">
                      No assets added yet. Click "Add Asset" to begin.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell colSpan={3} className="py-1 px-1 text-sm">Total Portfolio Value</TableCell>
                  <TableCell className="text-right py-1 px-1 text-sm">{formatCurrency(allocationSummary.totalValue)}</TableCell>
                  <TableCell className="py-1 px-1" />
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Asset Allocation Summary</CardTitle>
          <CardDescription>Breakdown of your US portfolio by category.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResizablePanelGroup direction="horizontal" className="min-h-[300px] w-full">
            <ResizablePanel defaultSize={50}>
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
                    <TableRow key={item.name} className="h-9">
                      <TableCell className="font-medium py-0 px-1 text-sm">{item.name}</TableCell>
                      <TableCell className="text-right py-0 px-1 text-sm">{formatCurrency(item.value)}</TableCell>
                      <TableCell className="text-right py-0 px-1 text-sm">{item.contribution.toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell className="py-1 px-1 text-sm">Total</TableCell>
                    <TableCell className="font-bold text-right py-1 px-1 text-sm">{formatCurrency(allocationSummary.totalValue)}</TableCell>
                    <TableCell className="font-bold text-right py-1 px-1 text-sm">100.00%</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
              <GenericPieChart data={allocationSummary.chartData} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </CardContent>
      </Card>
    </div>
  );
};

export default USEquity;