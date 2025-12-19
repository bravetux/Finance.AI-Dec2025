"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Gem, Upload, Download, Trash2 } from "lucide-react";
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

interface SilverAsset {
  id: string;
  particulars: string;
  value: number;
  grams?: number;
}

const initialAssets: SilverAsset[] = [
  { id: '1', particulars: 'Silver Jewellery', value: 0, grams: 0 },
  { id: '2', particulars: 'Silver Bars', value: 0, grams: 0 },
  { id: '3', particulars: 'Silver ETF', value: 0 },
];

const Silver: React.FC = () => {
  const [assets, setAssets] = useState<SilverAsset[]>(initialAssets);
  const [silverPrice, setSilverPrice] = useState<number>(0);

  useEffect(() => {
    try {
      const savedPrice = localStorage.getItem('silverPrice');
      if (savedPrice) {
        setSilverPrice(JSON.parse(savedPrice));
      }

      const saved = localStorage.getItem('silverData');
      if (saved) {
        let savedAssets = JSON.parse(saved) as SilverAsset[];
        
        const savedAssetsMap = new Map(savedAssets.map(a => [a.particulars, a]));

        const mergedAssets = initialAssets.map(initialAsset => {
          const savedAsset = savedAssetsMap.get(initialAsset.particulars);
          return savedAsset ? { ...initialAsset, value: savedAsset.value, grams: savedAsset.grams } : initialAsset;
        });
        
        setAssets(mergedAssets);
      }
    } catch (e) {
      console.error("Failed to load or migrate silver data", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('silverData', JSON.stringify(assets));
    localStorage.setItem('silverPrice', JSON.stringify(silverPrice));
  }, [assets, silverPrice]);

  useEffect(() => {
    setAssets(prev =>
      prev.map(p => {
        if (p.particulars === 'Silver Jewellery' || p.particulars === 'Silver Bars') {
          return { ...p, value: (p.grams || 0) * silverPrice };
        }
        return p;
      })
    );
  }, [silverPrice]);

  const handleValueChange = (id: string, value: number) => {
    setAssets(prev =>
      prev.map(p => (p.id === id ? { ...p, value: value } : p))
    );
  };

  const handleGramsChange = (id: string, grams: number) => {
    setAssets(prev =>
      prev.map(p => (p.id === id ? { ...p, grams, value: grams * silverPrice } : p))
    );
  };

  const totalValue = useMemo(() => {
    return assets.reduce((sum, p) => sum + p.value, 0);
  }, [assets]);

  const chartData = useMemo(() => {
    return assets
      .filter(p => p.value > 0)
      .map(p => ({
        name: p.particulars,
        value: p.value,
      }));
  }, [assets]);

  const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

  const exportData = () => {
    const dataToExport = { silverPrice, assets };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    saveAs(blob, 'silver-data.json');
    showSuccess('Silver data exported successfully!');
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
          if (typeof data.silverPrice === 'number') {
            setSilverPrice(data.silverPrice);
          }
          showSuccess('Data imported successfully!');
        } else if (Array.isArray(data)) { // Legacy import
          setAssets(data);
          showSuccess('Legacy data imported successfully!');
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
    const clearedAssets = assets.map(asset => ({
      ...asset,
      value: 0,
      ...(asset.grams !== undefined && { grams: 0 }),
    }));
    setAssets(clearedAssets);
    setSilverPrice(0);
    showSuccess('Silver data values have been cleared.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Gem className="h-8 w-8" />
            Silver
          </h1>
          <div className="flex items-center gap-2">
            <Label htmlFor="silver-price" className="whitespace-nowrap">Silver Price/gram (₹)</Label>
            <Input
              id="silver-price"
              type="text"
              value={silverPrice.toLocaleString('en-IN')}
              onChange={(e) => setSilverPrice(Number(e.target.value.replace(/,/g, '')) || 0)}
              className="w-32"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Clear Values
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset all silver asset values to zero. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearData}>Yes, clear values</AlertDialogAction>
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
        className="min-h-[400px] w-full rounded-lg border"
      >
        <ResizablePanel defaultSize={50}>
          <Card className="h-full border-0 shadow-none rounded-none">
            <CardHeader>
              <CardTitle>Silver Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="py-1 px-2">Particulars</TableHead>
                    <TableHead className="text-right py-1 px-2">Grams</TableHead>
                    <TableHead className="text-right py-1 px-2">Value (INR)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.map(p => {
                    const isGramsBased = p.particulars === 'Silver Jewellery' || p.particulars === 'Silver Bars';
                    return (
                      <TableRow key={p.id} className="h-10">
                        <TableCell className="font-medium py-1 px-2">{p.particulars}</TableCell>
                        <TableCell className="p-1">
                          {isGramsBased ? (
                            <Input
                              type="text"
                              value={(p.grams || 0).toLocaleString('en-IN')}
                              onChange={e => handleGramsChange(p.id, Number(e.target.value.replace(/,/g, '')))}
                              className="bg-transparent border-0 focus-visible:ring-1 h-8 text-sm text-right"
                            />
                          ) : (
                            <div className="text-right text-muted-foreground pr-3">—</div>
                          )}
                        </TableCell>
                        <TableCell className="p-1">
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-muted-foreground">₹</span>
                            <Input
                              type="text"
                              value={p.value.toLocaleString('en-IN')}
                              onChange={e => !isGramsBased && handleValueChange(p.id, Number(e.target.value.replace(/,/g, '')))}
                              readOnly={isGramsBased}
                              className={`bg-transparent border-0 focus-visible:ring-1 h-8 text-sm text-right pl-7 ${isGramsBased ? 'text-muted-foreground' : ''}`}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={2} className="font-bold py-2 px-2 text-sm">Total</TableCell>
                    <TableCell className="text-right font-bold py-2 px-2 text-sm">{formatCurrency(totalValue)}</TableCell>
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
              <CardTitle>Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <GenericPieChart data={chartData} />
            </CardContent>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Silver;