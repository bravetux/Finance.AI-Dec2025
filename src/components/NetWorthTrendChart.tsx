"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { NetWorthHistoryPoint } from "@/utils/localStorageUtils";

interface NetWorthTrendChartProps {
  data: NetWorthHistoryPoint[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const NetWorthTrendChart: React.FC<NetWorthTrendChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground italic border-2 border-dashed rounded-lg">
        Record your net worth monthly to see the trend here.
      </div>
    );
  }

  // Format dates for display (e.g., "Jan 2024")
  const chartData = data.map((point) => {
    const [year, month] = point.date.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return {
      ...point,
      displayName: date.toLocaleString("default", { month: "short", year: "2-digit" }),
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.1} />
        <XAxis 
          dataKey="displayName" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          dy={10}
        />
        <YAxis 
          hide
          domain={['auto', 'auto']}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background border rounded-lg p-2 shadow-sm text-sm">
                  <p className="font-bold">{payload[0].payload.displayName}</p>
                  <p className="text-primary">{formatCurrency(payload[0].value as number)}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorNetWorth)"
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default NetWorthTrendChart;