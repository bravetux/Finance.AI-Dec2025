"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { History, PlusCircle, Wallet, TrendingUp, TrendingDown, PieChart as PieChartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getNetWorthData,
  getNetWorthHistory,
  saveNetWorthSnapshot,
  NetWorthHistoryPoint,
} from "@/utils/localStorageUtils";
import NetWorthTrendChart from "@/components/NetWorthTrendChart";
import GenericPieChart from "@/components/GenericPieChart";
import { showSuccess } from "@/utils/toast";

const NetWorthOverview: React.FC = () => {
  const [history, setHistory] = React.useState<NetWorthHistoryPoint[]>([]);
  const [netWorthSummary, setNetWorthSummary] = React.useState({ assets: 0, liabilities: 0, netWorth: 0 });
  const [allocationData, setAllocationData] = React.useState<{ name: string; value: number }[]>([]);

  const getCurrentSnapshotData = () => {
    const netWorth = getNetWorthData();
    
    // Categorize for Allocation Chart
    const realEstate = (netWorth.homeValue || 0) + (netWorth.otherRealEstate || 0) + (netWorth.reits || 0);
    const equity = (netWorth.domesticStocks || 0) + (netWorth.domesticMutualFunds || 0) + (netWorth.internationalFunds || 0) + (netWorth.smallCases || 0);
    const debtCash = (netWorth.fixedDeposits || 0) + (netWorth.debtFunds || 0) + (netWorth.savingsBalance || 0);
    const preciousMetals = (netWorth.jewellery || 0) + (netWorth.sovereignGoldBonds || 0) + (netWorth.preciousMetals || 0);
    const retirement = (netWorth.epfPpfVpf || 0) + (netWorth.ulipsSurrenderValue || 0);
    const crypto = (netWorth.cryptocurrency || 0);

    const allocation = [
      { name: "Real Estate", value: realEstate },
      { name: "Equity", value: equity },
      { name: "Debt & Cash", value: debtCash },
      { name: "Precious Metals", value: preciousMetals },
      { name: "Retirement/ULIP", value: retirement },
      { name: "Crypto", value: crypto },
    ].filter(item => item.value > 0);

    const totalIlliquidAssets = (netWorth.homeValue || 0) + (netWorth.otherRealEstate || 0) + (netWorth.jewellery || 0) + (netWorth.sovereignGoldBonds || 0) + (netWorth.ulipsSurrenderValue || 0) + (netWorth.epfPpfVpf || 0);
    const totalLiquidAssets = (netWorth.fixedDeposits || 0) + (netWorth.debtFunds || 0) + (netWorth.domesticStocks || 0) + (netWorth.domesticMutualFunds || 0) + (netWorth.internationalFunds || 0) + (netWorth.smallCases || 0) + (netWorth.savingsBalance || 0) + (netWorth.preciousMetals || 0) + (netWorth.cryptocurrency || 0) + (netWorth.reits || 0);
    const totalAssets = totalIlliquidAssets + totalLiquidAssets;
    const totalLiabilities = (netWorth.homeLoan || 0) + (netWorth.educationLoan || 0) + (netWorth.carLoan || 0) + (netWorth.personalLoan || 0) + (netWorth.creditCardDues || 0) + (netWorth.otherLiabilities || 0);
    
    return { totalAssets, totalLiabilities, netWorth: totalAssets - totalLiabilities, allocation };
  };

  React.useEffect(() => {
    const updateValues = () => {
      setHistory(getNetWorthHistory());
      const snapshot = getCurrentSnapshotData();
      setNetWorthSummary({ 
        assets: snapshot.totalAssets, 
        liabilities: snapshot.totalLiabilities, 
        netWorth: snapshot.netWorth 
      });
      setAllocationData(snapshot.allocation);
    };

    updateValues();
    window.addEventListener('storage', updateValues);
    return () => window.removeEventListener('storage', updateValues);
  }, []);

  const handleRecordSnapshot = () => {
    const { totalAssets, totalLiabilities } = getCurrentSnapshotData();
    saveNetWorthSnapshot(totalAssets, totalLiabilities);
    showSuccess("Monthly net worth snapshot recorded!");
  };

  const formatCurrency = (value: number) => `₹${value.toLocaleString("en-IN")}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Net Worth Overview</h1>
        <Button size="sm" className="gap-2" onClick={handleRecordSnapshot}>
          <PlusCircle className="h-4 w-4" />
          Record Monthly Snapshot
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Net Worth</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(netWorthSummary.netWorth)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(netWorthSummary.assets)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(netWorthSummary.liabilities)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Growth Trend
            </CardTitle>
            <CardDescription>Historical view of your assets and liabilities over the last 24 months.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <NetWorthTrendChart data={history} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              Asset Allocation
            </CardTitle>
            <CardDescription>Distribution of your wealth across major asset classes.</CardDescription>
          </CardHeader>
          <CardContent>
            <GenericPieChart data={allocationData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NetWorthOverview;