"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const EducationHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link to="/" className="flex items-center">
            <Wallet className="h-6 w-6 mr-2" />
            <span className="font-bold">Financial Planner</span>
          </Link>
        </div>
        <nav className="hidden md:flex flex-1 items-center justify-end space-x-4">
          <Link to="/features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Features
          </Link>
          <Link to="/finance-education" className="text-sm font-medium text-primary">
            Education
          </Link>
          <a href="https://tax-compute.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Tax Planning
          </a>
          <ThemeToggle />
          <Button asChild>
            <Link to="/dashboard">Get Started</Link>
          </Button>
        </nav>
        <div className="md:hidden flex flex-1 items-center justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 p-4">
                <Link to="/features" className="text-lg font-medium">Features</Link>
                <Link to="/finance-education" className="text-lg font-medium text-primary">Education</Link>
                <a href="https://tax-compute.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-lg font-medium">Tax Planning</a>
                <hr/>
                <div className="flex justify-between items-center">
                  <span>Switch Theme</span>
                  <ThemeToggle />
                </div>
                <Button asChild className="w-full">
                  <Link to="/dashboard">Get Started</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default EducationHeader;