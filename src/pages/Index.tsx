"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index: React.FC = () => {
  return (
    <div className="container py-24 text-center">
      <h1 className="text-5xl font-bold mb-4">Welcome to Financial Planner</h1>
      <p className="text-xl text-muted-foreground mb-8">Your guide to smart financial decisions.</p>
      <Button size="lg" asChild>
        <Link to="/finance-education">Explore Education</Link>
      </Button>
    </div>
  );
};

export default Index;