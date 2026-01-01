"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, Calculator, TrendingUp, Shield } from 'lucide-react';
import Link from 'next/link';

const IndexPage: React.FC = () => {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-extrabold mb-4 text-primary">Welcome to Your Financial Dashboard</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
        Manage your investments, track your goals, and learn about smart financial strategies.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-6 h-6" />
              Investment Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Use our calculators to plan your SIPs, SWPs, and retirement goals.
            </p>
            <Link href="/tools" passHref>
              <Button variant="outline" className="w-full">
                Go to Tools <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Finance Education (FinSmart)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Learn about mutual funds, bonds, SWP, and smart investment strategies.
            </p>
            <Link href="https://emerald-owl-zoom.vercel.app/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full">
                Visit FinSmart <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Investment Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Explore different investment approaches and strategies.
            </p>
            <Link href="/strategies" passHref>
              <Button variant="outline" className="w-full">
                Learn Strategies <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Risk Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Understand how to manage risk in your investment portfolio.
            </p>
            <Link href="/risk" passHref>
              <Button variant="outline" className="w-full">
                Manage Risk <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IndexPage;