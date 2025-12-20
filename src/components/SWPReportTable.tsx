import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface SWPReportRow {
  period: number;
  label: string; // "Year 1", "Month 1", etc.
  withdrawal: number;
  returnsEarned: number;
  endBalance: number;
}

interface SWPReportTableProps {
  yearlyData: SWPReportRow[];
  monthlyData: SWPReportRow[];
}

const SWPReportTable: React.FC<SWPReportTableProps> = ({
  yearlyData,
  monthlyData,
}) => {
  const formatCurrency = (val: number) =>
    `₹${val.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;

  const renderTable = (data: SWPReportRow[]) => {
    if (!data || data.length === 0) {
      return <div className="p-4 text-center text-gray-500">No data available for this view.</div>;
    }
    return (
      <div className="rounded-md border max-h-[500px] overflow-y-auto print:max-h-none print:overflow-visible">
        <Table>
          <TableHeader className="sticky top-0 bg-secondary print:static">
            <TableRow>
              <TableHead className="w-[100px]">Period</TableHead>
              <TableHead className="text-right">Withdrawal</TableHead>
              <TableHead className="text-right">Returns</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.label}>
                <TableCell className="font-medium">{row.label}</TableCell>
                <TableCell className="text-right text-red-600">
                  -{formatCurrency(row.withdrawal)}
                </TableCell>
                <TableCell className="text-right text-green-600">
                  +{formatCurrency(row.returnsEarned)}
                </TableCell>
                <TableCell className="text-right font-bold">
                  {formatCurrency(row.endBalance)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Tabs defaultValue="yearly" className="w-full">
      <div className="flex justify-between items-center mb-4 print:hidden">
        <h3 className="text-lg font-semibold">Detailed Report</h3>
        <TabsList>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
      </div>

      {/* For Print: Show only Yearly or whatever is active? 
          Usually detailed monthly report is too long for print. 
          Let's stick to showing whatever is active in the tabs, 
          OR strictly show Yearly if we want a summary. 
          Radix Tabs hides content with `hidden` attribute which print respects.
          So it will print whatever view is selected. 
      */}
      
      <div className="hidden print:block mb-4">
        <h3 className="text-lg font-semibold">Projected Cash Flow</h3>
      </div>

      <TabsContent value="yearly">{renderTable(yearlyData)}</TabsContent>
      <TabsContent value="monthly">{renderTable(monthlyData)}</TabsContent>
    </Tabs>
  );
};

export default SWPReportTable;