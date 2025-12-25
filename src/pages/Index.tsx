"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] text-center px-4">
      <GraduationCap className="h-20 w-20 text-primary mb-6" />
      <h1 className="text-5xl font-extrabold tracking-tight mb-4">
        Master Your Finances
      </h1>
      <p className="text-xl text-muted-foreground max-w-[42rem] mb-8">
        Learn how to invest wisely with our visual guides on SIP, STP, SWP, and Bonds.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg" className="gap-2">
          <Link to="/finance-education">
            Start Learning <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;