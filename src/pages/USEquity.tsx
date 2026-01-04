"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Landmark, Upload, Download, Trash2, PlusCircle } from "lucide-react";
import { saveAs } from "file-saver";
import { showSuccess, showError } from "@/utils/toast";
import CurrencyInput from "@/components/CurrencyInput";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import GenericPieChart from "@/components/GenericPieChart";

interface USEquityAsset {
  id: string;
  name: string;
  type: string;
  value: number;
}

const initialAssets: USEquityAsset[] = [
  { id: '1', name: 'US Stocks', type: 'US Stocks', value: 0 },
  { id: '2', name: 'S&P 500 ETF', type: 'ETF', value: 0 },
];

const USEquity: React.FC = () => {
  const [assets, setAssets] = useState<USEquityAsset[]>(() => {
    try {
      const saved = localStorage.getItem('usEquityData');
      return saved ? JSON.parse(saved) : initialAssets;
    } catch {
      return initialAssets;
    }
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAsset, setNewAsset] = useState<{ name: string; type: string; value: number }>({
    name: "",
    type: "US Stocks",
    value: 0,
  });

  useEffect(() => {
    localStorage.setItem('usEquityData', JSON.stringify(assets));
    // Trigger storage event for other components like NetWorthCalculator
    window.dispatchEvent(new Event('storage'));
  }, [assets]);

  const handleValueChange = (id: string, value: number) => {
    setAssets(prev =>
      prev.map(p => (p.id === id ? { ...p, value } : p))
    );
  };

  const handleAddAsset = () => {
    const finalName = newAsset.type === "Custom" ? newAsset.name : newAsset.type;
    
    if (newAsset.type === "Custom" && !newAsset.name) {
      showError("Please provide a name for the custom asset.");
      return;
    }

    const asset: USEquityAsset = {
      id: Date.now().toString(),
      name: finalName,
      type: newAsset.type,
      value: newAsset.value,
    };

    setAssets(prev => [...prev, asset]);
    setIsDialogOpen(false);
    setNewAsset({ name: "", type: "US Stocks", value: 0 });
    showSuccess("Asset added successfully!");
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
    showSuccess("Asset removed.");
  };

  const totalValue = useMemo(() => {
    return assets.reduce((sum, p) => sum + p.value, 0);
  }, [assets]);

  const chartData = useMemo(() => {
    return assets
      .filter(p => p.value > 0)
      .map(p => ({
        name: p.name,
        value: p.value,
      }));
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
    showSuccess('US Equity data has been cleared.');
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
                  This will reset all data on this page. This action cannot be undone.
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
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <PlusCircle className="h-4 w-4" /> Add Asset
          </Button>
        </div>
      </div>

      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[400px] w-full rounded-lg border"
      >
        <ResizablePanel defaultSize={60}>
          <Card className="h-full border-0 shadow-none rounded-none">
            <CardHeader>
              <CardTitle>US Equity Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Value (INR)</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{p.type}</TableCell>
                      <TableCell className="p-1">
                        <CurrencyInput
                          value={p.value}
                          onChange={val => handleValueChange(p.id, val)}
                          className="w-full text-right bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-offset-0 h-9"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-50"
                          onClick={() => handleDeleteAsset(p.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {assets.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No holdings added. Click "Add Asset" to start.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={2} className="font-bold">Total</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(totalValue)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40}>
          <Card className="h-full border-0 shadow-none rounded-none">
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <GenericPieChart data={chartData} />
            </CardContent>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Add Asset Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add US Equity Holding</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Asset Type</Label>
              <Select 
                value={newAsset.type} 
                onValueChange={(val) => setNewAsset({ ...newAsset, type: val, name: val === "Custom" ? "" : val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US Stocks">US Stocks</SelectItem>
                  <SelectItem value="ETF">ETF</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newAsset.type === "Custom" && (
              <div className="grid gap-2">
                <Label htmlFor="custom-name">Custom Name</Label>
                <Input
                  id="custom-name"
                  placeholder="e.g., NASDAQ 100 Index"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="asset-value">Current Value (INR)</Label>
              <CurrencyInput
                id="asset-value"
                value={newAsset.value}
                onChange={(val) => setNewAsset({ ...newAsset, value: val })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddAsset}>Add Holding</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default USEquity;