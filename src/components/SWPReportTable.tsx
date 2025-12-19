"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Define the structure for the SWP report data
export interface SWPReportRow {
  period: number; // Year or Month number
  label: string; // 'Year 1' or 'Month 1'
  withdrawal: number;
  returnsEarned: number;
  endBalance: number;
}

interface SWPReportTableProps {
  yearlyData: SWPReportRow[];
  monthlyData: SWPReportRow[];
}

const formatCurrency = (value: number) => {
  return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
};

const SWPReportTable: React.FC<SWPReportTableProps> = ({ yearlyData, monthlyData }) => {
  const [view, setView] = useState<"yearly" | "monthly">("yearly");
  const data = view === "yearly" ? yearlyData : monthlyData;

  if (data.length === 0) {
    return null;
  }

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Withdrawal Report</CardTitle>
        <Tabs defaultValue="yearly" onValueChange={(v) => setView(v as "yearly" | "monthly")}>
          <TabsList>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto max-h-[400px]">
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead className="w-[100px]">{view === "yearly" ? "Year" : "Month"}</TableHead>
                <TableHead>Withdrawal</TableHead>
                <TableHead>Returns Earned</TableHead>
                <TableHead className="text-right">End Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.label}>
                  <TableCell className="font-medium">{row.label}</TableCell>
                  <TableCell>{formatCurrency(row.withdrawal)}</TableCell>
                  <TableCell>{formatCurrency(row.returnsEarned)}</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(row.endBalance)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SWPReportTable;