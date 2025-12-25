"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index: React.FC = () => {
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Financial Planner</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Navigate to the Education Hub to start learning.
      </p>
      <Button asChild size="lg">
        <Link to="/finance-education">Go to Education Hub</Link>
      </Button>
    </div>
  );
};

export default Index;