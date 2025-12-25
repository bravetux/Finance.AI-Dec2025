"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

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
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({});

  // Initialize state: check if any item in a section is currently active based on location.pathname
  React.useEffect(() => {
    const initialOpenState: Record<string, boolean> = {};
    educationSections.forEach(section => {
      const isActive = section.items.some(item => location.pathname === item.href);
      initialOpenState[section.title] = isActive;
    });
    setOpenSections(initialOpenState);
  }, [location.pathname]);

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <nav className="flex flex-col space-y-6 p-4">
      <h3 className="text-lg font-semibold tracking-tight">Investment Strategies</h3>
      <div className="space-y-4">
        {educationSections.map((section, index) => (
          <Collapsible 
            key={index} 
            open={openSections[section.title]} 
            onOpenChange={() => toggleSection(section.title)}
            className="space-y-2"
          >
            <CollapsibleTrigger asChild>
              <button className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium text-muted-foreground uppercase tracking-wider hover:bg-muted/50 transition-colors">
                {section.title}
                <ChevronDown className={cn("h-4 w-4 transition-transform", openSections[section.title] && "rotate-180")} />
              </button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="pl-3">
              <div className="flex flex-col space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "text-muted-foreground hover:text-primary hover:bg-muted"
                      )}
                    >
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </CollapsibleContent>
            {index < educationSections.length - 1 && <Separator className="mt-4" />}
          </Collapsible>
        ))}
      </div>
    </nav>
  );
};

export default FinanceSidebar;