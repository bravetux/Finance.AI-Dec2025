"use client";

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calculator, 
  Target, 
  TrendingUp, 
  LogOut, 
  Wallet,
  Coins,
  ShieldCheck,
  TrendingDown
} from "lucide-react";
import Index from "./pages/Index";
import FutureValueCalculator from "./pages/FutureValueCalculator";
import GoalPlanner from "./pages/GoalPlanner";
import RetirementDashboard from "./pages/RetirementDashboard";
import ProjectedCashflow from "./pages/ProjectedCashflow";
import CanRetireNow from "./pages/CanRetireNow";
import LifeInsurance from "./pages/LifeInsurance";
import PostRetirementStrategy from "./pages/PostRetirementStrategy";

const SidebarItem = ({ icon: Icon, label, path }: { icon: any, label: string, path: string }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? "bg-blue-600 text-white" 
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 p-4 hidden md:flex flex-col fixed h-screen">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Coins size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold">RetireSmart</span>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/" />
          <SidebarItem icon={Calculator} label="Retirement Planner" path="/retirement" />
          <SidebarItem icon={Target} label="Goal Planner" path="/goals" />
          <SidebarItem icon={TrendingUp} label="FV Calculator" path="/fv" />
          <SidebarItem icon={TrendingDown} label="Projected Cashflow" path="/cashflow" />
          <SidebarItem icon={ShieldCheck} label="Post-Retirement Strategy" path="/post-retirement" />
          <SidebarItem icon={Wallet} label="Can you Retire Now?" path="/can-retire" />
          <SidebarItem icon={ShieldCheck} label="Life Insurance Needs" path="/insurance" />
        </nav>

        <div className="pt-4 mt-auto border-t border-gray-800">
          <button className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white w-full transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/retirement" element={<RetirementDashboard />} />
          <Route path="/goals" element={<GoalPlanner />} />
          <Route path="/fv" element={<FutureValueCalculator />} />
          <Route path="/cashflow" element={<ProjectedCashflow />} />
          <Route path="/can-retire" element={<CanRetireNow />} />
          <Route path="/insurance" element={<LifeInsurance />} />
          <Route path="/post-retirement" element={<PostRetirementStrategy />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;