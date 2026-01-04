"use client";

import React from "react";
import {
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

const formatIndianCurrency = (value: number) => {
  if (value === 0) return "₹0";
  
  const absValue = Math.abs(value);
  if (absValue >= 10000000) { // 1 Crore
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  }
  if (absValue >= 100000) { // 1 Lakh
    return `₹${(value / 100000).toFixed(0)}L`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
};

const NetWorthTrendChart: React.FC<NetWorthTrendChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground italic border-2 border-dashed rounded-lg">
        Record your net worth monthly to see the trend here.
      </div>
    );
  }

  const chartData = data.map((point) => {
    const [year, month] = point.date.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return {
      ...point,
      displayName: date.toLocaleString("default", { month: "short", year: "numeric" }),
    };
  });

  return (
    <div className="w-full space-y-4">
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorLiabilities" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
          <XAxis 
            dataKey="displayName" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            tickFormatter={formatIndianCurrency}
            width={60}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-background border rounded-lg p-3 shadow-lg text-xs space-y-1">
                    <p className="font-bold border-b pb-1 mb-1">{payload[0].payload.displayName}</p>
                    <div className="flex justify-between gap-4">
                        <span className="text-emerald-600 font-medium">Assets:</span>
                        <span>{formatIndianCurrency(payload[0].payload.assets)}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-red-600 font-medium">Liabilities:</span>
                        <span>{formatIndianCurrency(payload[0].payload.liabilities)}</span>
                    </div>
                    <div className="flex justify-between gap-4 border-t pt-1 mt-1 font-bold">
                        <span>Net Worth:</span>
                        <span className="text-primary">{formatIndianCurrency(payload[0].payload.netWorth)}</span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="assets"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorAssets)"
            name="Assets"
          />
          <Area
            type="monotone"
            dataKey="liabilities"
            stroke="#ef4444"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorLiabilities)"
            name="Liabilities"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend dots like the image */}
      <div className="flex justify-center items-center gap-8 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#10b981]" />
          <span className="text-sm font-medium">Assets</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
          <span className="text-sm font-medium">Liabilities</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#1e293b]" />
          <span className="text-sm font-medium">Net Worth</span>
        </div>
      </div>
    </div>
  );
};

export default NetWorthTrendChart;