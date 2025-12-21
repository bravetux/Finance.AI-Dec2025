"use client";

import React, { useMemo, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Upload, Trash2 } from "lucide-react";
import { showError, showSuccess } from "@/utils/toast";
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
import { Slider } from "@/components/ui/slider";

interface Asset {
  name: string;
  currentValue: number;
  roi: number;
  futureValue: number;
  isIncomeSource?: boolean;
}

// Helper function to calculate future value for compounding assets
const calculateFutureValue = (pv: number, r: number, t: number) => {
  return pv * Math.pow(1 + r / 100, t);
};

// Helper function to calculate accumulated future value for income sources (Annuity)
const calculateAccumulatedFutureValue = (monthlyValue: number, r: number, t: number) => {
  if (t <= 0) return 0;
  const annualValue = monthlyValue * 12;
  const rate = r / 100;
  if (rate === 0) return annualValue * t;
  // FV of an Ordinary Annuity: P * [((1 + r)^t - 1) / r]
  return annualValue * (Math.pow(1 + rate, t) - 1) / rate;
};

const FutureValueCalculator: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [duration, setDuration] = useState(10);
  const [maxDuration, setMaxDuration] = useState(50);
  const [currentAge, setCurrentAge] = useState(0);

  useEffect(() => {
    try {
      const savedRetirementData = localStorage.getItem('retirementData');
      if (savedRetirementData) {
        const retirementData = JSON.parse(savedRetirementData);
        const age = retirementData.currentAge || 0;
        const retirementAge = retirementData.retirementAge || 0;
        const lifeExpectancy = retirementData.lifeExpectancy || 0;
        
        setCurrentAge(age);
        
        const initialDuration = Math.max(0, retirementAge - age);
        const maxSliderDuration = Math.max(0, lifeExpectancy - age);

        setDuration(initialDuration);
        setMaxDuration(maxSliderDuration > 0 ? maxSliderDuration : 50);
      }
    } catch (error) {
      console.error("Failed to load retirement data for duration calculation:", error);
    }
  }, []);

  useEffect(() => {
    const initializeAssets = () => {
      const netWorthData = (() => {
        try {
          const savedData = localStorage.getItem('netWorthData');
          return savedData ? JSON.parse(savedData) : {};
        } catch { return {}; }
      })();

      const financeData = (() => {
        try {
          const savedData = localStorage.getItem('finance-data');
          return savedData ? JSON.parse(savedData) : {};
        } catch { return {}; }
      })();

      const futureValueData = (() => {
        try {
          const savedData = localStorage.getItem('future-value-data');
          return savedData ? JSON.parse(savedData) : [];
        } catch { return []; }
      })();

      const defaultAssets = [
        // Illiquid Assets
        { name: "Home Value", key: "homeValue", source: 'netWorth', roi: 6 },
        { name: "Other Real Estate", key: "otherRealEstate", source: 'netWorth', roi: 7 },
        { name: "Jewellery", key: "jewellery", source: 'netWorth', roi: 4 },
        
        // Liquid Assets (Existing)
        { name: "Sovereign Gold Bonds", key: "sovereignGoldBonds", source: 'netWorth', roi: 5 },
        { name: "ULIPs Surrender Value", key: "ulipsSurrenderValue", source: 'netWorth', roi: 8 },
        { name: "EPF / PPF / VPF", key: "epfPpfVpf", source: 'netWorth', roi: 7.1 },
        { name: "Fixed Deposits", key: "fixedDeposits", source: 'netWorth', roi: 6.5 },
        { name: "Debt Funds", key: "debtFunds", source: 'netWorth', roi: 7.5 },
        { name: "Domestic Stocks", key: "domesticStocks", source: 'netWorth', roi: 12 },
        { name: "Domestic Mutual Funds", key: "domesticMutualFunds", source: 'netWorth', roi: 11 },
        { name: "International Funds", key: "internationalFunds", source: 'netWorth', roi: 10 },
        { name: "Small Cases", key: "smallCases", source: 'netWorth', roi: 13 },
        { name: "Savings Balance", key: "savingsBalance", source: 'netWorth', roi: 4 },
        { name: "Precious Metals", key: "preciousMetals", source: 'netWorth', roi: 6 },
        { name: "Cryptocurrency", key: "cryptocurrency", source: 'netWorth', roi: 15 },
        { name: "REITs", key: "reits", source: 'netWorth', roi: 9 },

        // Liquid Assets (New from Cashflow/Finance Data - treated as Income Sources)
        { name: "Business Income", key: "businessIncome", source: 'finance', roi: 7, isIncomeSource: true },
        { name: "Rental Income Prop 1", key: "rentalProperty1", source: 'finance', roi: 7, isIncomeSource: true },
        { name: "Rental Income Prop 2", key: "rentalProperty2", source: 'finance', roi: 7, isIncomeSource: true },
        { name: "Rental Income Prop 3", key: "rentalProperty3", source: 'finance', roi: 7, isIncomeSource: true },
        { name: "FD Interest Income", key: "fdInterest", source: 'finance', roi: 7, isIncomeSource: true },
        { name: "Bond Income", key: "bondIncome", source: 'finance', roi: 7, isIncomeSource: true },
        { name: "Dividend Income", key: "dividendIncome", source: 'finance', roi: 7, isIncomeSource: true },
      ];

      const newAssets = defaultAssets.map(defaultAsset => {
        const savedAsset = futureValueData.find((a: { name: string, roi: number }) => a.name === defaultAsset.name);
        
        let currentValue = 0;
        if (defaultAsset.source === 'netWorth') {
          currentValue = netWorthData[defaultAsset.key] || 0;
        } else if (defaultAsset.source === 'finance') {
          currentValue = financeData[defaultAsset.key] || 0;
        }

        const roi = savedAsset ? savedAsset.roi : defaultAsset.roi;
        const futureValue = defaultAsset.isIncomeSource 
          ? calculateAccumulatedFutureValue(currentValue, roi, duration)
          : calculateFutureValue(currentValue, roi, duration);

        return {
          name: defaultAsset.name,
          currentValue,
          roi,
          futureValue,
          isIncomeSource: defaultAsset.isIncomeSource,
        };
      });
      setAssets(newAssets);
    };
    
    initializeAssets();
    
    const handleStorageChange = () => {
        initializeAssets();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);

  }, [duration]);

  const handleInputChange = (assetName: string, field: 'roi', value: string) => {
    if (value.length > 4) return;

    setAssets(prev => {
      const newAssets = [...prev];
      const assetIndex = newAssets.findIndex(a => a.name === assetName);
      if (assetIndex === -1) return prev;

      const updatedAsset = {
        ...newAssets[assetIndex],
        [field]: Number(value) || 0
      };

      updatedAsset.futureValue = updatedAsset.isIncomeSource
        ? calculateAccumulatedFutureValue(updatedAsset.currentValue, updatedAsset.roi, duration)
        : calculateFutureValue(updatedAsset.currentValue, updatedAsset.roi, duration);
      
      newAssets[assetIndex] = updatedAsset;
      return newAssets;
    });
  };

  const illiquidAssetNames = ["Home Value", "Other Real Estate", "Jewellery"];
  const liquidAssets = useMemo(() => assets.filter(asset => !illiquidAssetNames.includes(asset.name)), [assets]);
  const illiquidAssets = useMemo(() => assets.filter(asset => illiquidAssetNames.includes(asset.name)), [assets]);
  
  const totalLiquidFutureValue = useMemo(() => liquidAssets.reduce((sum, asset) => sum + asset.futureValue, 0), [liquidAssets]);
  const totalCurrentValue = useMemo(() => assets.reduce((sum, asset) => sum + asset.currentValue, 0), [assets]);
  const totalFutureValue = useMemo(() => assets.reduce((sum, asset) => sum + asset.futureValue, 0), [assets]);
  
  const averageRoi = useMemo(() => {
    if (totalCurrentValue === 0) return 0;
    const weightedSum = assets.reduce((sum, asset) => sum + asset.currentValue * asset.roi, 0);
    return weightedSum / totalCurrentValue;
  }, [assets, totalCurrentValue]);

  useEffect(() => {
    const dataToSave = assets.map(({ name, roi }) => ({ name, roi }));
    if (dataToSave.length > 0) {
      localStorage.setItem('future-value-data', JSON.stringify(dataToSave));
    }
    localStorage.setItem('liquidFutureValueTotal', JSON.stringify(totalLiquidFutureValue));

    const ageAtGoal = currentAge + duration;
    const summaryData = {
        totalFutureValue: totalFutureValue,
        averageROI: averageRoi,
        ageAtGoal: ageAtGoal,
        duration: duration,
    };
    localStorage.setItem('futureValueSummary', JSON.stringify(summaryData));

    window.dispatchEvent(new Event('storage'));
  }, [assets, totalLiquidFutureValue, totalFutureValue, averageRoi, duration, currentAge]);

  const exportData = () => {
    const dataToSave = assets.map(({ name, roi }) => ({ name, roi }));
    const dataStr = JSON.stringify(dataToSave, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'future-value-roi-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        if (!Array.isArray(importedData) || !importedData.every(item => 'name' in item && 'roi' in item)) {
          throw new Error("Invalid file format.");
        }
        localStorage.setItem('future-value-data', JSON.stringify(importedData));
        showSuccess('Data imported successfully! Page will now reload.');
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        showError('Error parsing file. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    localStorage.removeItem('future-value-data');
    showSuccess("Future Value ROI data has been cleared.");
    setTimeout(() => window.location.reload(), 1000);
  };

  const AssetTable = ({ title, data }: { title: string, data: Asset[] }) => {
    const tableCurrentTotal = data.reduce((sum, asset) => sum + asset.currentValue, 0);
    const tableFutureTotal = data.reduce((sum, asset) => sum + asset.futureValue, 0);

    return (
      <Card>
        <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Asset / Income Source</th>
                  <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Current Value (₹)</th>
                  <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ROI / Growth (%)</th>
                  <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Future Value (₹)</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {data.map((asset) => (
                  <tr key={asset.name} className="h-10">
                    <td className="px-2 py-0 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {asset.name}
                      {asset.isIncomeSource && <span className="ml-1 text-[10px] text-muted-foreground">(Monthly)</span>}
                    </td>
                    <td className="px-2 py-0 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{asset.currentValue.toLocaleString('en-IN')}</td>
                    <td className="px-2 py-0 whitespace-nowrap">
                      <Input type="number" value={asset.roi} onChange={(e) => handleInputChange(asset.name, 'roi', e.target.value)} className="w-16 h-7 text-sm" />
                    </td>
                    <td className="px-2 py-0 whitespace-nowrap text-sm font-medium">₹{asset.futureValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-800">
                <tr className="font-bold">
                  <td className="px-2 py-2 text-left text-sm">Total</td>
                  <td className="px-2 py-2 text-left text-sm">
                    -
                  </td>
                  <td className="px-2 py-2"></td>
                  <td className="px-2 py-2 text-left text-sm">
                    ₹{tableFutureTotal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 italic">
            * Income sources are calculated as annual accumulations growing at the specified ROI.
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Future Value Calculator</h1>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Clear ROI Data</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>This will reset all ROI values on this page to their defaults. This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearData}>Yes, clear data</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="outline" onClick={exportData}><Upload className="mr-2 h-4 w-4" /> Export</Button>
          <Button variant="outline" asChild>
            <Label htmlFor="import-file"><Download className="mr-2 h-4 w-4" /> Import<Input id="import-file" type="file" accept=".json" className="hidden" onChange={importData} /></Label>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projection Duration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Slider
              value={[duration]}
              onValueChange={(val) => setDuration(val[0])}
              min={0}
              max={maxDuration}
              step={1}
              className="flex-1"
            />
            <div className="font-bold text-lg w-24 text-center border rounded-md p-2">
              {duration} Years
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Adjust the slider to project asset values over different time horizons. The maximum duration ({maxDuration} years) is calculated from the Retirement page (Life Expectancy - Current Age).
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <AssetTable title="Illiquid Assets" data={illiquidAssets} />
        <AssetTable title="Liquid Assets & Income Sources" data={liquidAssets} />

        <Card>
          <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between"><span className="font-medium">Total Current Monthly Income:</span><span className="font-bold">₹{assets.filter(a => a.isIncomeSource).reduce((sum, a) => sum + a.currentValue, 0).toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between"><span className="font-medium">Average ROI/Growth:</span><span className="font-bold">{averageRoi.toFixed(2)}%</span></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="font-medium">Total Future Value:</span><span className="font-bold text-green-600">₹{totalFutureValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span></div>
                <div className="flex justify-between"><span className="font-medium">Projected Age:</span><span className="font-bold text-blue-600">{currentAge + duration}</span></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FutureValueCalculator;