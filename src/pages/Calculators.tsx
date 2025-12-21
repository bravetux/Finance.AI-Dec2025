"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calculator, 
  TrendingUp, 
  Target, 
  Repeat, 
  PiggyBank, 
  Receipt, 
  Sheet, 
  CircleDollarSign, 
  Car, 
  Handshake, 
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Percent,
  CreditCard
} from "lucide-react";

const calculatorList = [
  {
    name: "Goal Calculator",
    description: "Calculate the monthly SIP required to achieve your specific financial milestones.",
    path: "/dashboard/goal-calculator",
    icon: Target,
    color: "text-blue-500",
    category: "Planning"
  },
  {
    name: "Investment Growth",
    description: "Advanced growth projection with Lumpsum, monthly SIP, annual Step-up and tax impacts.",
    path: "/dashboard/investment-calculator",
    icon: BarChart3,
    color: "text-indigo-600",
    category: "Investing"
  },
  {
    name: "EMI Calculator",
    description: "Calculate your monthly installments, total interest, and view a detailed repayment schedule.",
    path: "/dashboard/emi-calculator",
    icon: CreditCard,
    color: "text-blue-600",
    category: "Interest"
  },
  {
    name: "SIP Calculator",
    description: "See how your Systematic Investment Plans grow over time with the power of compounding.",
    path: "/dashboard/sip-calculator",
    icon: Repeat,
    color: "text-green-500",
    category: "Investing"
  },
  {
    name: "Percentage Calculator",
    description: "Perform common percentage calculations like X% of Y, percentage change, and more.",
    path: "/dashboard/percentage-calculator",
    icon: Percent,
    color: "text-red-500",
    category: "General"
  },
  {
    name: "Interest Calculator",
    description: "Calculate Simple or Compound interest with precision using durations or specific date ranges.",
    path: "/dashboard/interest-calculator",
    icon: Percent,
    color: "text-violet-500",
    category: "Interest"
  },
  {
    name: "SWP Calculator",
    description: "Plan your Systematic Withdrawal Plan and see how long your retirement corpus will last.",
    path: "/dashboard/swp-calculator",
    icon: CircleDollarSign,
    color: "text-orange-500",
    category: "Investing"
  },
  {
    name: "Compound Interest",
    description: "Visualize how regular deposits and interest rates affect your long-term wealth.",
    path: "/dashboard/compound-interest-calculator",
    icon: Sparkles,
    color: "text-indigo-500",
    category: "Interest"
  },
  {
    name: "Advance Tax Calculator",
    description: "Compute your quarterly tax liability and stay ahead of your payment schedule.",
    path: "/dashboard/advance-tax-calculator",
    icon: Receipt,
    color: "text-red-500",
    category: "Taxation"
  },
  {
    name: "PPF Calculator",
    description: "Estimate maturity values for your Public Provident Fund investments.",
    path: "/dashboard/ppf-calculator",
    icon: PiggyBank,
    color: "text-emerald-500",
    category: "Investing"
  },
  {
    name: "EPF Calculator",
    description: "Forecast your Employee Provident Fund corpus at the time of retirement.",
    path: "/dashboard/epf-calculator",
    icon: Calculator,
    color: "text-cyan-500",
    category: "Investing"
  },
  {
    name: "ROI Calculator",
    description: "Measure the efficiency and percentage gains of your various investments.",
    path: "/dashboard/roi-calculator",
    icon: TrendingUp,
    color: "text-purple-500",
    category: "Investing"
  },
  {
    name: "Car Affordability",
    description: "Determine if a vehicle fits your budget based on income and EMI rules.",
    path: "/dashboard/car-affordable-calculator",
    icon: Car,
    color: "text-pink-500",
    category: "Purchases"
  },
  {
    name: "P2P Lending",
    description: "Estimate returns and schedules for Peer-to-Peer lending investments.",
    path: "/dashboard/p2p-lending-calculator",
    icon: Handshake,
    color: "text-amber-500",
    category: "Interest"
  },
  {
    name: "Expense Planner",
    description: "Analyze your spending habits and find opportunities to save and optimize.",
    path: "/dashboard/expense-reduction-planner",
    icon: Sheet,
    color: "text-slate-500",
    category: "Budgeting"
  }
];

const Calculators: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Financial Calculators</h1>
        <p className="text-muted-foreground text-lg">
          A suite of powerful tools to help you plan, project, and optimize your financial decisions.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {calculatorList.map((calc) => (
          <Link key={calc.name} to={calc.path} className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-2">
                  <div className={`p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors`}>
                    <calc.icon className={`h-6 w-6 ${calc.color}`} />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground bg-muted px-2 py-1 rounded">
                    {calc.category}
                  </span>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors flex items-center gap-2">
                  {calc.name}
                  <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {calc.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Calculators;