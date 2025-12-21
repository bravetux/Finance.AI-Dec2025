"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Calculator, RefreshCcw, TrendingUp, PieChart as PieChartIcon } from "lucide-react";

const ASSET_COLORS = {
  stock: "#3b82f6",
  bond: "#10b981",
  cash: "#f59e0b"
};

const AssetAllocationCalculator: React.FC = () => {
  const [currentlySaved, setCurrentlySaved] = useState<string>("10000");
  const [monthlySaving, setMonthlySaving] = useState<string>("1000");
  const [yearsToRetirement, setYearsToRetirement] = useState<string>("20");

  const [returns, setReturns] = useState({ stock: "8", bond: "4", cash: "2" });
  const [allocation, setAllocation] = useState({ stock: "60", bond: "30", cash: "10" });

  const [results, setResults] = useState<any>(null);

  const handleReset = () => {
    setCurrentlySaved("10000");
    setMonthlySaving("1000");
    setYearsToRetirement("20");
    setReturns({ stock: "8", bond: "4", cash: "2" });
    setAllocation({ stock: "60", bond: "30", cash: "10" });
    setResults(null);
  };

  const calculate = () => {
    const totalSaved = parseFloat(currentlySaved) || 0;
    const monthlyTotal = parseFloat(monthlySaving) || 0;
    const years = parseInt(yearsToRetirement) || 0;
    
    const stockAlloc = (parseFloat(allocation.stock) || 0) / 100;
    const bondAlloc = (parseFloat(allocation.bond) || 0) / 100;
    const cashAlloc = (parseFloat(allocation.cash) || 0) / 100;

    const stockReturn = (parseFloat(returns.stock) || 0) / 100;
    const bondReturn = (parseFloat(returns.bond) || 0) / 100;
    const cashReturn = (parseFloat(returns.cash) || 0) / 100;

    const chartData = [];
    let currentStock = totalSaved * stockAlloc;
    let currentBond = totalSaved * bondAlloc;
    let currentCash = totalSaved * cashAlloc;

    chartData.push({
      year: 0,
      Stock: Math.round(currentStock),
      Bond: Math.round(currentBond),
      Cash: Math.round(currentCash),
      Total: Math.round(totalSaved)
    });

    for (let y = 1; y <= years; y++) {
      // Annual growth + Monthly deposits (calculated monthly for accuracy)
      for (let m = 1; m <= 12; m++) {
        currentStock = (currentStock * (1 + stockReturn / 12)) + (monthlyTotal * stockAlloc);
        currentBond = (currentBond * (1 + bondReturn / 12)) + (monthlyTotal * bondAlloc);
        currentCash = (currentCash * (1 + cashReturn / 12)) + (monthlyTotal * cashAlloc);
      }

      chartData.push({
        year: y,
        Stock: Math.round(currentStock),
        Bond: Math.round(currentBond),
        Cash: Math.round(currentCash),
        Total: Math.round(currentStock + currentBond + currentCash)
      });
    }

    const totalInvested = totalSaved + (monthlyTotal * 12 * years);
    const finalValue = currentStock + currentBond + currentCash;

    setResults({
      finalValue,
      totalInvested,
      gains: finalValue - totalInvested,
      chartData,
      breakdown: [
        { name: "Stock", value: Math.round(currentStock), color: ASSET_COLORS.stock },
        { name: "Bond", value: Math.round(currentBond), color: ASSET_COLORS.bond },
        { name: "Cash", value: Math.round(currentCash), color: ASSET_COLORS.cash },
      ]
    });
  };

  // Run initial calculation
  useMemo(() => {
    // We don't auto-calculate to match the screenshot's "Calculate" button behavior
  }, []);

  const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-red-700">Asset Allocation Calculator</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Portfolio Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Currently Saved (₹)</Label>
              <Input type="number" value={currentlySaved} onChange={(e) => setCurrentlySaved(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Monthly Saving (₹)</Label>
              <Input type="number" value={monthlySaving} onChange={(e) => setMonthlySaving(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Years until Retirement</Label>
              <Input type="number" value={yearsToRetirement} onChange={(e) => setYearsToRetirement(e.target.value)} />
            </div>

            <div className="pt-4 space-y-4 border-t">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-8 px-0"></TableHead>
                    <TableHead className="h-8 text-center text-xs uppercase font-bold">Stock</TableHead>
                    <TableHead className="h-8 text-center text-xs uppercase font-bold">Bond</TableHead>
                    <TableHead className="h-8 text-center text-xs uppercase font-bold">Cash</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-transparent">
                    <TableCell className="p-2 text-xs font-semibold whitespace-nowrap">Annual Return (%)</TableCell>
                    <TableCell className="p-1"><Input className="h-8 text-center" type="number" value={returns.stock} onChange={(e) => setReturns({...returns, stock: e.target.value})} /></TableCell>
                    <TableCell className="p-1"><Input className="h-8 text-center" type="number" value={returns.bond} onChange={(e) => setReturns({...returns, bond: e.target.value})} /></TableCell>
                    <TableCell className="p-1"><Input className="h-8 text-center" type="number" value={returns.cash} onChange={(e) => setReturns({...returns, cash: e.target.value})} /></TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-transparent">
                    <TableCell className="p-2 text-xs font-semibold whitespace-nowrap">Allocation (%)</TableCell>
                    <TableCell className="p-1"><Input className="h-8 text-center" type="number" value={allocation.stock} onChange={(e) => setAllocation({...allocation, stock: e.target.value})} /></TableCell>
                    <TableCell className="p-1"><Input className="h-8 text-center" type="number" value={allocation.bond} onChange={(e) => setAllocation({...allocation, bond: e.target.value})} /></TableCell>
                    <TableCell className="p-1"><Input className="h-8 text-center" type="number" value={allocation.cash} onChange={(e) => setAllocation({...allocation, cash: e.target.value})} /></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button variant="outline" onClick={handleReset} className="w-full">
                <RefreshCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
              <Button onClick={calculate} className="w-full">
                <Calculator className="mr-2 h-4 w-4" /> Calculate
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {results ? (
            <>
              <div className="grid sm:grid-cols-3 gap-4">
                <Card className="bg-primary/5">
                  <CardHeader className="p-4 pb-2">
                    <CardDescription className="text-xs font-bold uppercase">Total Value</CardDescription>
                    <CardTitle className="text-xl">{formatCurrency(results.finalValue)}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardDescription className="text-xs font-bold uppercase">Total Invested</CardDescription>
                    <CardTitle className="text-xl">{formatCurrency(results.totalInvested)}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-green-50 dark:bg-green-950/20">
                  <CardHeader className="p-4 pb-2">
                    <CardDescription className="text-xs font-bold uppercase">Total Gains</CardDescription>
                    <CardTitle className="text-xl text-green-600">{formatCurrency(results.gains)}</CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" /> Portfolio Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={results.chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                        <YAxis tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`} />
                        <Tooltip formatter={(val: any) => formatCurrency(val)} />
                        <Legend />
                        <Area type="monotone" dataKey="Stock" stackId="1" stroke={ASSET_COLORS.stock} fill={ASSET_COLORS.stock} fillOpacity={0.6} />
                        <Area type="monotone" dataKey="Bond" stackId="1" stroke={ASSET_COLORS.bond} fill={ASSET_COLORS.bond} fillOpacity={0.6} />
                        <Area type="monotone" dataKey="Cash" stackId="1" stroke={ASSET_COLORS.cash} fill={ASSET_COLORS.cash} fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <PieChartIcon className="h-4 w-4" /> Final Allocation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={results.breakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {results.breakdown.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(val: any) => formatCurrency(val)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground italic border-2 border-dashed rounded-xl p-12 space-y-4">
              <Calculator className="h-12 w-12 opacity-20" />
              <p>Enter your details and click Calculate to see your projected portfolio growth.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetAllocationCalculator;