"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold inline-block text-xl">FinSmart Dash</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link to="/tools" className="text-sm font-medium transition-colors hover:text-primary">Tools</Link>
            <Link to="/strategies" className="text-sm font-medium transition-colors hover:text-primary">Strategies</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <a 
            href="https://emerald-owl-zoom.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <Button variant="default" size="sm" className="gap-2 bg-primary hover:bg-primary/90">
              <GraduationCap className="h-4 w-4" />
              <span>FinSmart Education</span>
            </Button>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;