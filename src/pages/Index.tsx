"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, Calculator, TrendingUp, Shield, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

const IndexPage: React.FC = () => {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-extrabold mb-4 text-primary text-center">Your Financial Dashboard</h1>
      <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto text-center">
        Empower your financial journey with expert education, smart tools, and strategic insights.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {/* Bonds Education */}
        <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              Bond Investments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Learn about G-Secs, Corporate Bonds, and Sovereign Gold Bonds in India.
            </p>
            <Link to="/bonds">
              <Button variant="outline" className="w-full">
                Learn Bonds <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* SWP Education */}
        <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-6 h-6 text-green-600" />
              SWP Strategy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Discover how Systematic Withdrawal Plans can provide regular income.
            </p>
            <Link to="/swp">
              <Button variant="outline" className="w-full">
                Learn SWP <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* External Education */}
        <Card className="hover:shadow-lg border-primary/20 bg-primary/5 transition-all hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              FinSmart Edu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Access the full suite of financial education at FinSmart.
            </p>
            <a href="https://emerald-owl-zoom.vercel.app/" target="_blank" rel="noopener noreferrer">
              <Button className="w-full">
                Visit FinSmart <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-6 h-6" />
              Investment Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Coming soon: Plan your retirement and SIP goals with precision.
            </p>
            <Button variant="secondary" className="w-full" disabled>
              Tools Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Market Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Get the latest updates on Indian market trends and debt instruments.
            </p>
            <Button variant="secondary" className="w-full" disabled>
              Insights Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IndexPage;