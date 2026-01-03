"use client";

import React, { useState, useRef } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Calculator,
  Landmark,
  Menu,
  TrendingUp,
  ArrowDownUp,
  Target,
  LineChart,
  Bot,
  FileText,
  Briefcase,
  Flame,
  Sheet as SheetIcon,
  FileInput,
  Wallet,
  Home,
  BarChart2,
  Gem,
  PieChart,
  Repeat,
  CheckCircle,
  HandCoins,
  ShieldCheck,
  Bitcoin,
  HeartHandshake,
  Sparkles,
  Car,
  MoreHorizontal,
  ArrowUpRight,
  Percent,
  CreditCard,
  Handshake,
  DoorOpen,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  Shield,
  GraduationCap,
  ArrowRightLeft,
  Receipt,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ImperativePanelHandle } from "react-resizable-panels";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, type: 'link' },
  { 
    name: "CashFlow Planning", 
    icon: Calculator,
    type: 'section',
    children: [
      { name: "Summary", path: "/dashboard/cashflow-summary", icon: LayoutDashboard, type: 'link' },
      { name: "Cashflow", path: "/dashboard/cashflow", icon: ArrowDownUp, type: 'link' },
    ]
  },
  { 
    name: "Net Worth", 
    icon: Wallet,
    type: 'section',
    children: [
      { name: "Net Worth Calculator", path: "/dashboard/net-worth", icon: Calculator, type: 'link' },
      { name: "Real Estate", path: "/dashboard/real-estate", icon: Home, type: 'link' },
      { 
        name: "Equity", 
        icon: BarChart2,
        type: 'section',
        children: [
          { name: "Domestic Equity", path: "/dashboard/domestic-equity", icon: BarChart2, type: 'link' },
          { name: "Mutual Fund Allocation", path: "/dashboard/mutual-fund-allocation", icon: PieChart, type: 'link' },
          { name: "Mutual Fund SIP", path: "/dashboard/mutual-fund-sip", icon: Repeat, type: 'link' },
          { name: "Small Case", path: "/dashboard/small-case", icon: Briefcase, type: 'link' },
          { name: "US Equity", path: "/dashboard/us-equity", icon: Landmark, type: 'link' },
        ]
      },
      { name: "Debt", path: "/dashboard/debt", icon: FileText, type: 'link' },
      { 
        name: "Precious Metals", 
        icon: Gem,
        type: 'section',
        children: [
          { name: "Summary", path: "/dashboard/precious-metals-summary", icon: LayoutDashboard, type: 'link' },
          { name: "Gold", path: "/dashboard/gold", icon: Gem, type: 'link' },
          { name: "Silver", path: "/dashboard/silver", icon: Gem, type: 'link' },
          { name: "Platinum", path: "/dashboard/platinum", icon: Gem, type: 'link' },
          { name: "Diamond", path: "/dashboard/diamond", icon: Gem, type: 'link' },
        ]
      },
      { name: "Cryptocurrency", path: "/dashboard/cryptocurrency", icon: Bitcoin, type: 'link' },
      { name: "Loan Tracker", path: "/dashboard/loan-tracker", icon: HandCoins, type: 'link' },
    ]
  },
  { name: "Insurance Hub", path: "/dashboard/insurance-hub", icon: ShieldCheck, type: 'link' },
  { name: "Goals", path: "/dashboard/goals", icon: Target, type: 'link' },
  { 
    name: "Retirement Planning", 
    icon: Landmark,
    type: 'section',
    children: [
      { name: "Retirement", path: "/dashboard/retirement", icon: Landmark, type: 'link' },
      { name: "FIRE Calculator", path: "/dashboard/fire-calculator", icon: Flame, type: 'link' },
      { name: "Future Value", path: "/dashboard/future-value", icon: TrendingUp, type: 'link' },
      { name: "Projected Cashflow", path: "/dashboard/projected-cashflow", icon: LineChart, type: 'link' },
      { name: "Post-Retirement Strategy", path: "/dashboard/post-retirement-strategy", icon: LineChart, type: 'link' },
      { name: "Can you retire now?", path: "/dashboard/can-you-retire-now", icon: CheckCircle, type: 'link' },
    ]
  },
  { name: "Reports", path: "/dashboard/reports", icon: FileText, type: 'link' },
  { name: "FIDOK", path: "/dashboard/fidok", icon: HeartHandshake, type: 'link' },
  { 
    name: "AI", 
    icon: Bot,
    type: 'section',
    children: [
      { name: "AI Prompt", path: "/dashboard/ai-prompt", icon: Bot, type: 'link' },
    ]
  },
  { 
    name: "Calculators", 
    icon: Calculator,
    type: 'section',
    path: "/dashboard/calculators",
    children: [
      { name: "Overview", path: "/dashboard/calculators", icon: LayoutDashboard, type: 'link' },
      { 
        name: "Planning & Risk", 
        icon: Target,
        type: 'section',
        children: [
          { name: "Goal Calculator", path: "/dashboard/goal-calculator", icon: Target, type: 'link' },
          { name: "Child Education Fund", path: "/dashboard/child-education-fund-calculator", icon: GraduationCap, type: 'link' },
          { name: "HLV (Insurance) Calculator", path: "/dashboard/hlv-calculator", icon: Shield, type: 'link' },
          { name: "Health Insurance Calculator", path: "/dashboard/health-insurance-calculator", icon: ShieldCheck, type: 'link' },
          { name: "Inflation Impact", path: "/dashboard/inflation-impact-calculator", icon: TrendingDown, type: 'link' },
          { name: "Expense Reduction Planner", path: "/dashboard/expense-reduction-planner", icon: SheetIcon, type: 'link' },
        ]
      },
      { 
        name: "Investment", 
        icon: TrendingUp,
        type: 'section',
        children: [
          { name: "Growth Calculator", path: "/dashboard/investment-calculator", icon: TrendingUp, type: 'link' },
          { name: "Asset Allocation", path: "/dashboard/asset-allocation-calculator", icon: PieChart, type: 'link' },
          { name: "SIP Calculator", path: "/dashboard/sip-calculator", icon: Repeat, type: 'link' },
          { name: "SWP Calculator", path: "/dashboard/swp-calculator", icon: Calculator, type: 'link' },
          { name: "PPF Calculator", path: "/dashboard/ppf-calculator", icon: Calculator, type: 'link' },
          { name: "EPF Calculator", path: "/dashboard/epf-calculator", icon: Calculator, type: 'link' },
          { name: "ROI Calculator", path: "/dashboard/roi-calculator", icon: TrendingUp, type: 'link' },
        ]
      },
      { 
        name: "Real Estate & Loans", 
        icon: Home,
        type: 'section',
        children: [
          { name: "Buy vs. Rent Calculator", path: "/dashboard/buy-vs-rent-calculator", icon: ArrowRightLeft, type: 'link' },
          { name: "Rental Yield Calculator", path: "/dashboard/rental-yield-calculator", icon: Home, type: 'link' },
          { name: "EMI Calculator", path: "/dashboard/emi-calculator", icon: CreditCard, type: 'link' },
          { name: "P2P Lending Calculator", path: "/dashboard/p2p-lending-calculator", icon: Handshake, type: 'link' },
        ]
      },
      { 
        name: "Taxation", 
        icon: Receipt,
        type: 'section',
        children: [
          { name: "Advance Tax Calculator", path: "/dashboard/advance-tax-calculator", icon: Calculator, type: 'link' },
        ]
      },
      { 
        name: "Interest & General", 
        icon: Percent,
        type: 'section',
        children: [
          { name: "Interest Calculator", path: "/dashboard/interest-calculator", icon: Percent, type: 'link' },
          { name: "Compound Interest", path: "/dashboard/compound-interest-calculator", icon: Sparkles, type: 'link' },
          { name: "Percentage Calculator", path: "/dashboard/percentage-calculator", icon: Percent, type: 'link' },
        ]
      },
      { 
        name: "Misc", 
        icon: MoreHorizontal,
        type: 'section',
        children: [
          { name: "Car Affordable Calculator", path: "/dashboard/car-affordable-calculator", icon: Car, type: 'link' },
          { name: "Rental House Vacate Calculator", path: "/dashboard/rent-vacate-calculator", icon: DoorOpen, type: 'link' },
        ]
      },
    ]
  },
];

const DashboardLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarPanelRef = useRef<ImperativePanelHandle>(null);

  const handleAccordionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isCollapsed) return;
    const trigger = e.currentTarget;
    if (trigger.getAttribute('data-state') === 'closed') {
      const accordionItem = trigger.closest('[data-radix-accordion-item]');
      if (accordionItem) {
        setTimeout(() => {
          accordionItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 200);
      }
    }
  };

  const toggleCollapse = () => {
    if (isCollapsed) {
      sidebarPanelRef.current?.expand();
    } else {
      sidebarPanelRef.current?.collapse();
    }
    setIsCollapsed(!isCollapsed);
  };

  const SidebarContent = ({ collapsed }: { collapsed?: boolean }) => (
    <div className={cn(
      "flex h-full flex-col p-4 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
      collapsed ? "p-2 items-center" : "p-4"
    )}>
      <div className={cn("flex items-center mb-6", collapsed ? "justify-center" : "justify-between")}>
        <Link to="/" className={cn("font-bold text-sidebar-primary-foreground truncate transition-all", collapsed ? "w-0 overflow-hidden" : "text-xl block")}>
          Financial Planner
        </Link>
        {!isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleCollapse} className="h-8 w-8">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <nav className={cn("flex flex-col gap-1", collapsed ? "" : "pr-4")}>
          {navItems.map((item) =>
            item.type === 'section' && item.children ? (
              <Accordion key={item.name} type="single" collapsible className="w-full">
                <AccordionItem value={item.name} className="border-none">
                  <div className="flex items-center gap-1 group">
                    <AccordionTrigger
                      onClick={handleAccordionClick}
                      className={cn(
                        "justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:no-underline rounded-md px-3 py-2 w-full font-medium transition-all",
                        collapsed ? "px-2 justify-center [&>svg:last-child]:hidden" : ""
                      )}
                    >
                      <div className="flex items-center">
                        <item.icon className={cn("h-4 w-4", collapsed ? "m-0" : "mr-2")} aria-label={item.name} />
                        {!collapsed && <span>{item.name}</span>}
                      </div>
                    </AccordionTrigger>
                    {!collapsed && item.path && (
                      <Link 
                        to={item.path} 
                        className="p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-sidebar-accent rounded-md"
                        title={`Go to ${item.name} Overview`}
                        onClick={() => isMobile && setIsSheetOpen(false)}
                      >
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                  {!collapsed && (
                    <AccordionContent className="pt-1 pb-0">
                      <div className="flex flex-col gap-1 pl-4">
                        {item.children.map((child) =>
                          child.type === 'section' && child.children ? (
                            <Accordion key={child.name} type="single" collapsible className="w-full">
                              <AccordionItem value={child.name} className="border-none">
                                <AccordionTrigger
                                  onClick={handleAccordionClick}
                                  className="justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:no-underline rounded-md px-3 py-2 w-full"
                                >
                                  <div className="flex items-center">
                                    <child.icon className="mr-2 h-4 w-4" />
                                    {child.name}
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-1 pb-0">
                                  <div className="flex flex-col gap-1 pl-4">
                                    {child.children.map((grandchild) => (
                                      <Button
                                        key={grandchild.name}
                                        variant="ghost"
                                        className="justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                        asChild
                                        onClick={() => isMobile && setIsSheetOpen(false)}
                                      >
                                        <Link to={grandchild.path!}>
                                          <grandchild.icon className="mr-2 h-4 w-4" />
                                          {grandchild.name}
                                        </Link>
                                      </Button>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          ) : (
                            <Button
                              key={child.name}
                              variant="ghost"
                              className="justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                              asChild
                              onClick={() => isMobile && setIsSheetOpen(false)}
                            >
                              <Link to={child.path!}>
                                <child.icon className="mr-2 h-4 w-4" />
                                {child.name}
                              </Link>
                            </Button>
                          )
                        )}
                      </div>
                    </AccordionContent>
                  )}
                </AccordionItem>
              </Accordion>
            ) : (
              <Link
                key={item.name}
                to={item.path!}
                title={item.name}
                onClick={() => isMobile && setIsSheetOpen(false)}
                className={cn(
                  "flex items-center text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:no-underline rounded-md px-3 py-2 w-full font-medium transition-all",
                  collapsed ? "justify-center px-2" : "justify-start"
                )}
              >
                <item.icon className={cn("h-4 w-4", collapsed ? "m-0" : "mr-2")} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          )}
        </nav>
      </ScrollArea>

      <div className={cn("mt-auto pt-4 flex flex-col", collapsed ? "items-center" : "")}>
        {!collapsed && (
          <div className="text-sm text-sidebar-foreground/80 px-2 mb-2">
            <p className="font-semibold">Designed and Developed by B.Vignesh Kumar</p>
            <a href="mailto:vigneshkumarb@bravetux.com" className="hover:underline">
              vigneshkumarb@bravetux.com
            </a>
          </div>
        )}
        <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-end")}>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center justify-between p-4 border-b bg-background">
          <h1 className="text-xl font-bold">Financial Planner</h1>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-grow p-4">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen w-full">
      <ResizablePanel 
        ref={sidebarPanelRef}
        defaultSize={20} 
        minSize={15} 
        maxSize={25}
        collapsible={true}
        collapsedSize={4}
        onCollapse={() => setIsCollapsed(true)}
        onExpand={() => setIsCollapsed(false)}
        className="transition-all duration-300 ease-in-out"
      >
        <SidebarContent collapsed={isCollapsed} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={80}>
        <ScrollArea className="h-full">
          <main className="p-6">
            <Outlet />
          </main>
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default DashboardLayout;