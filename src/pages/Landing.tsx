"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  ExternalLink, 
  Calculator, 
  ShieldCheck, 
  TrendingUp, 
  PieChart, 
  Wallet, 
  Target, 
  Flame, 
  Bot 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <Link className="flex items-center justify-center gap-2" to="/">
          <div className="bg-primary p-1.5 rounded-lg">
            <Calculator className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">Finance.AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors hidden sm:block" to="/features">
            Features
          </Link>
          <Button asChild variant="ghost">
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Take Control of Your <span className="text-primary">Financial Future</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl lg:text-2xl">
                  Privacy-first financial planning. Your data never leaves your browser. Track net worth, plan retirement, and reach your goals.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="h-12 px-8 text-lg">
                  <Link to="/dashboard">
                    Open Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8 text-lg" asChild>
                   <a href="https://github.com/bravetux/Finance.AI" target="_blank" rel="noopener noreferrer">
                    View on GitHub
                   </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features Designed for You</h2>
              <p className="mt-4 text-muted-foreground md:text-xl">Everything you need to manage your money effectively.</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Tax Planning Card */}
              <div className="flex flex-col p-6 bg-background rounded-xl border shadow-sm transition-all hover:shadow-md">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <PieChart className="h-6 w-6 text-primary" />
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">Tax planning</h3>
                  {/* The requested FinSmart button */}
                  <Button variant="secondary" size="sm" asChild className="h-7 px-2 text-[10px] uppercase tracking-wider font-bold gap-1 bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20">
                    <a href="https://emerald-owl-zoom.vercel.app/" target="_blank" rel="noopener noreferrer">
                      FinSmart <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
                <p className="text-muted-foreground">
                  Optimize your tax liability with our advanced calculators and planning strategies.
                </p>
              </div>

              {/* Cashflow Card */}
              <div className="flex flex-col p-6 bg-background rounded-xl border shadow-sm transition-all hover:shadow-md">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Cashflow Planning</h3>
                <p className="text-muted-foreground">
                  Track income and expenses. Forecast savings and visualize the impact of expense reduction.
                </p>
              </div>

              {/* Privacy Card */}
              <div className="flex flex-col p-6 bg-background rounded-xl border shadow-sm transition-all hover:shadow-md">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">100% Privacy</h3>
                <p className="text-muted-foreground">
                  Your sensitive financial data is stored locally in your browser. Nothing is ever sent to a server.
                </p>
              </div>

              {/* Retirement Card */}
              <div className="flex flex-col p-6 bg-background rounded-xl border shadow-sm transition-all hover:shadow-md">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <Flame className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Retirement Planning</h3>
                <p className="text-muted-foreground">
                  Simulate retirement strategies, calculate FIRE targets, and project future asset values.
                </p>
              </div>

              {/* Goal Card */}
              <div className="flex flex-col p-6 bg-background rounded-xl border shadow-sm transition-all hover:shadow-md">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Goal Tracking</h3>
                <p className="text-muted-foreground">
                  Set long-term goals and calculate the monthly SIP required to achieve them.
                </p>
              </div>

              {/* AI Card */}
              <div className="flex flex-col p-6 bg-background rounded-xl border shadow-sm transition-all hover:shadow-md">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI Insights</h3>
                <p className="text-muted-foreground">
                  Chat with an AI financial assistant to get personalized insights on your uploaded data.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              <span className="font-bold">Finance.AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Finance.AI. Built with privacy in mind.
            </p>
            <div className="flex gap-6">
              <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" to="#">
                Terms
              </Link>
              <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" to="#">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;