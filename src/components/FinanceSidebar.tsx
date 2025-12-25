"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface NavItem {
  title: string;
  href: string;
}

interface Section {
  title: string;
  items: NavItem[];
}

const educationSections: Section[] = [
  {
    title: "Mutual Funds",
    items: [
      { title: "Overview", href: "/money-minds/mutual-funds" },
      { title: "SIP (Systematic Investment Plan)", href: "/money-minds/sip" },
      { title: "SWP (Systematic Withdrawal Plan)", href: "/money-minds/swp" },
      { title: "STP (Systematic Transfer Plan)", href: "/money-minds/stp" },
    ],
  },
  {
    title: "Bonds & Fixed Income",
    items: [
      { title: "Introduction to Bonds", href: "/money-minds/bonds" },
    ],
  },
  {
    title: "Equity & Stocks",
    items: [
      { title: "Basics of Stock Market", href: "/money-minds/equity" },
    ],
  },
  {
    title: "Gold & Commodities",
    items: [
      { title: "Investing in Gold", href: "/money-minds/gold" },
    ],
  },
  {
    title: "Alternative Investments",
    items: [
      { title: "PMS (Portfolio Management Services)", href: "/money-minds/pms" },
      { title: "SIF (Special Investment Funds)", href: "/money-minds/sif" },
      { title: "AIF (Alternative Investment Funds)", href: "/money-minds/aif" },
    ],
  },
];

const FinanceSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="flex flex-col space-y-6 p-4">
      <h3 className="text-lg font-semibold tracking-tight">Investment Strategies</h3>
      <div className="space-y-4">
        {educationSections.map((section, index) => (
          <div key={index} className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{section.title}</h4>
            <div className="flex flex-col space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted",
                    location.pathname === item.href
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </div>
            {index < educationSections.length - 1 && <Separator className="mt-4" />}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default FinanceSidebar;