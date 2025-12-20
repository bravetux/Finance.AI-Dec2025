import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import SWPReportTable, { SWPReportRow } from "./SWPReportTable";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function SWPCalculator() {
  // --- STATE ---
  // Mode: "final_value" or "longevity"
  const [calculationMode, setCalculationMode] = useState<"final_value" | "longevity">("final_value");

  // Common Inputs
  const [initialInvestment, setInitialInvestment] = useState(5000000);
  const [withdrawalPerMonth, setWithdrawalPerMonth] = useState(30000);
  const [expectedReturnRate, setExpectedReturnRate] = useState(10); // % per annum

  // "Final Value" specific
  const [durationYears, setDurationYears] = useState(10);

  // "Longevity" specific
  const [targetCorpus, setTargetCorpus] = useState(0); // usually 0

  // Inflation
  const [enableInflation, setEnableInflation] = useState(false);
  const [inflationRate, setInflationRate] = useState(6); // %

  // Taxes (Basic implementation: flat capital gains tax on withdrawals for simplicity?
  // Or just reduce return rate? Let's add a simple "Tax on Gains" switch if needed,
  // but for MVP, maybe just stick to pre-tax or net-return inputs.
  // We'll stick to the requirements: Inflation is the key advanced feature.)

  // --- CALCULATIONS ---
  const [results, setResults] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [yearlyReport, setYearlyReport] = useState<SWPReportRow[]>([]);
  const [monthlyReport, setMonthlyReport] = useState<SWPReportRow[]>([]);

  useEffect(() => {
    calculateSWP();
  }, [
    calculationMode,
    initialInvestment,
    withdrawalPerMonth,
    expectedReturnRate,
    durationYears,
    targetCorpus,
    enableInflation,
    inflationRate,
  ]);

  const calculateSWP = () => {
    let currentBalance = initialInvestment;
    let monthlyRate = expectedReturnRate / 12 / 100;
    let currentWithdrawal = withdrawalPerMonth;
    
    // For reporting
    let totalWithdrawn = 0;
    let totalReturnsEarned = 0;
    
    const monthlyData: SWPReportRow[] = [];
    const yearlyData: SWPReportRow[] = [];

    let months = 0;
    let limitMonths = calculationMode === "final_value" ? durationYears * 12 : 1200; // Cap at 100 years for safety in longevity mode

    // Temp variables for yearly aggregation
    let yearWithdrawal = 0;
    let yearReturns = 0;

    for (let m = 1; m <= limitMonths; m++) {
      // 1. Earn returns on opening balance (assuming withdrawal at end of month)
      // OR withdrawal at start? Usually SWP is start or end. Let's assume End for calculation ease, 
      // or Start? standard SWP often deducted on a specific date.
      // Let's do: Returns added to balance, then withdrawal deducted.
      
      const returns = currentBalance * monthlyRate;
      let withdrawal = currentWithdrawal;

      // Adjust withdrawal for inflation annually? Or monthly?
      // Usually inflation adjustment happens once a year.
      if (enableInflation && m > 1 && (m - 1) % 12 === 0) {
        currentWithdrawal = currentWithdrawal * (1 + inflationRate / 100);
        withdrawal = currentWithdrawal;
      }

      // Check if funds depleted
      if (currentBalance + returns < withdrawal) {
        withdrawal = currentBalance + returns; // Take whatever is left
        currentBalance = 0;
      } else {
        currentBalance = currentBalance + returns - withdrawal;
      }

      totalWithdrawn += withdrawal;
      totalReturnsEarned += returns;
      
      yearWithdrawal += withdrawal;
      yearReturns += returns;

      monthlyData.push({
        period: m,
        label: `Month ${m}`,
        withdrawal: withdrawal,
        returnsEarned: returns,
        endBalance: currentBalance,
      });

      // End of Year or End of Simulation
      if (m % 12 === 0 || currentBalance === 0) {
        yearlyData.push({
          period: Math.ceil(m / 12),
          label: `Year ${Math.ceil(m / 12)}`,
          withdrawal: yearWithdrawal,
          returnsEarned: yearReturns,
          endBalance: currentBalance,
        });
        yearWithdrawal = 0;
        yearReturns = 0;
      }

      months = m;
      if (currentBalance === 0) break;
      if (calculationMode === "longevity" && currentBalance <= targetCorpus && targetCorpus > 0) break; 
    }

    setMonthlyReport(monthlyData);
    setYearlyReport(yearlyData);

    const finalValue = currentBalance;
    const totalDurationYears = (months / 12).toFixed(1);

    setResults({
      totalInvestment: initialInvestment,
      totalWithdrawal: totalWithdrawn,
      finalValue: finalValue,
      totalDuration: totalDurationYears,
      isDepleted: currentBalance === 0
    });

    // Chart Data
    // 1. Pie Chart: Total Investment vs Total Returns (Net Gain concept)
    // Actually SWP Pie is usually: Current Value vs Withdrawn? Or Investment vs Profit?
    // Let's show: Total Payout vs Final Value (remaining) vs Cost? 
    // A simple view: What you put in vs What you got out + What you have left.
    // Wait, "Total Returns Earned" is the growth.
    // Let's do a breakdown of the Final Corpus source? No.
    // Let's do: Total Withdrawal vs Final Balance
    
    // For Line Chart: Balance over time
    // We'll downsample monthlyData for the chart if it's too long
    const chartPoints = monthlyData.filter((_, idx) => idx % 12 === 0 || idx === monthlyData.length - 1).map(d => ({
      name: d.label, // Year X
      balance: d.endBalance,
      investment: initialInvestment // Constant line? Or reducing? Usually just balance curve.
    }));
    setChartData(chartPoints);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleDownloadCSV = () => {
    // Generate CSV content
    const headers = ["Period", "Withdrawal", "Returns Earned", "Balance"];
    const rows = yearlyReport.map(row => [
      row.label,
      row.withdrawal.toFixed(2),
      row.returnsEarned.toFixed(2),
      row.endBalance.toFixed(2)
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "swp_report_yearly.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* 1. Header / Mode Selection */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SWP Calculator</h1>
          <p className="text-muted-foreground">
            Systematic Withdrawal Plan Analysis
          </p>
        </div>
        <Tabs value={calculationMode} onValueChange={(v: any) => setCalculationMode(v)}>
          <TabsList>
            <TabsTrigger value="final_value">Target Final Value</TabsTrigger>
            <TabsTrigger value="longevity">Corpus Longevity</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. Inputs Column */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Adjust your investment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Initial Investment */}
            <div className="space-y-2">
              <Label>Total Investment</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                <Input 
                  type="number" 
                  value={initialInvestment} 
                  onChange={(e) => setInitialInvestment(Number(e.target.value))}
                  className="pl-7"
                />
              </div>
              <Slider 
                value={[initialInvestment]} 
                min={100000} max={10000000} step={10000} 
                onValueChange={(v) => setInitialInvestment(v[0])}
              />
            </div>

            {/* Withdrawal Per Month */}
            <div className="space-y-2">
              <Label>Monthly Withdrawal</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                <Input 
                  type="number" 
                  value={withdrawalPerMonth} 
                  onChange={(e) => setWithdrawalPerMonth(Number(e.target.value))}
                  className="pl-7"
                />
              </div>
              <Slider 
                value={[withdrawalPerMonth]} 
                min={1000} max={200000} step={500} 
                onValueChange={(v) => setWithdrawalPerMonth(v[0])}
              />
            </div>

            {/* Expected Return */}
            <div className="space-y-2">
              <Label>Expected Return Rate (p.a)</Label>
              <div className="flex items-center gap-4">
                <Slider 
                  value={[expectedReturnRate]} 
                  min={1} max={30} step={0.1} 
                  onValueChange={(v) => setExpectedReturnRate(v[0])}
                  className="flex-1"
                />
                <div className="w-16 border rounded px-2 py-1 text-center text-sm">
                  {expectedReturnRate}%
                </div>
              </div>
            </div>

            {/* Duration (Only for Final Value mode) */}
            {calculationMode === "final_value" && (
              <div className="space-y-2">
                <Label>Time Period (Years)</Label>
                <div className="flex items-center gap-4">
                  <Slider 
                    value={[durationYears]} 
                    min={1} max={50} step={1} 
                    onValueChange={(v) => setDurationYears(v[0])}
                    className="flex-1"
                  />
                  <div className="w-16 border rounded px-2 py-1 text-center text-sm">
                    {durationYears} Y
                  </div>
                </div>
              </div>
            )}

            {/* Inflation Switch */}
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5">
                <Label className="text-base">Inflation Adjustment</Label>
                <div className="text-xs text-muted-foreground">
                  Increase withdrawal yearly?
                </div>
              </div>
              <Switch 
                checked={enableInflation} 
                onCheckedChange={setEnableInflation} 
              />
            </div>

            {enableInflation && (
              <div className="space-y-2 pt-2 border-t">
                <Label>Inflation Rate (%)</Label>
                 <div className="flex items-center gap-4">
                <Slider 
                  value={[inflationRate]} 
                  min={1} max={15} step={0.5} 
                  onValueChange={(v) => setInflationRate(v[0])}
                  className="flex-1"
                />
                <div className="w-16 border rounded px-2 py-1 text-center text-sm">
                  {inflationRate}%
                </div>
              </div>
              </div>
            )}

          </CardContent>
        </Card>

        {/* 3. Results & Visualization Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Investment</CardDescription>
                <CardTitle className="text-xl">{formatCurrency(results?.totalInvestment || 0)}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Withdrawn</CardDescription>
                <CardTitle className="text-xl text-red-500">{formatCurrency(results?.totalWithdrawal || 0)}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>
                  {calculationMode === 'longevity' && results?.isDepleted ? "Duration Lasted" : "Final Value"}
                </CardDescription>
                <CardTitle className={`text-xl ${results?.isDepleted ? 'text-orange-500' : 'text-green-500'}`}>
                  {calculationMode === 'longevity' && results?.isDepleted 
                    ? `${results?.totalDuration} Years` 
                    : formatCurrency(results?.finalValue || 0)
                  }
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Charts Tabs */}
          <Tabs defaultValue="chart_line" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chart_line">Growth Curve</TabsTrigger>
              <TabsTrigger value="chart_pie">Summary Breakdown</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart_line">
              <Card>
                <CardHeader>
                  <CardTitle>Balance Projection</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                      <XAxis dataKey="name" hide />
                      <YAxis tickFormatter={(val) => `₹${val/1000}k`} />
                      <RechartsTooltip formatter={(val:number) => formatCurrency(val)} />
                      <Legend />
                      <Line type="monotone" dataKey="balance" stroke="#8884d8" strokeWidth={2} dot={false} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chart_pie">
              <Card>
                <CardHeader>
                  <CardTitle>Investment vs Withdrawal vs Balance</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Final Balance', value: results?.finalValue },
                          { name: 'Total Withdrawn', value: results?.totalWithdrawal },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                         <Cell key="cell-0" fill="#00C49F" />
                         <Cell key="cell-1" fill="#FF8042" />
                      </Pie>
                      <RechartsTooltip formatter={(val:number) => formatCurrency(val)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadCSV}>
              Download CSV
            </Button>
          </div>

        </div>
      </div>

      {/* 4. Detailed Report Table */}
      <Card>
        <CardHeader>
          <CardTitle>Amortization Schedule</CardTitle>
        </CardHeader>
        <CardContent>
           <SWPReportTable yearlyData={yearlyReport} monthlyData={monthlyReport} />
        </CardContent>
      </Card>
    </div>
  );
}