"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wallet, GraduationCap, TrendingUp, ShieldCheck, PiggyBank, Lightbulb, Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const educationalTopics = [
  {
    icon: <PiggyBank className="h-6 w-6 text-primary" />,
    title: 'The Power of Compounding',
    description: 'Understand how earning interest on interest can exponentially grow your wealth over time. Time is your greatest ally.',
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-primary" />,
    title: 'Asset Allocation',
    description: 'Learn how to balance risk and reward by apportioning a portfolio’s assets according to your goals and risk tolerance.',
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    title: 'Emergency Fund 101',
    description: 'Why you need 3-6 months of expenses in a liquid account before you start aggressive investing.',
  },
  {
    icon: <Lightbulb className="h-6 w-6 text-primary" />,
    title: 'The 50/30/20 Rule',
    description: 'A simple budgeting framework: 50% for needs, 30% for wants, and 20% for savings and debt repayment.',
  },
  {
    icon: <Wallet className="h-6 w-6 text-primary" />,
    title: 'Inflation & Purchasing Power',
    description: 'Why keeping all your cash under the mattress is a losing strategy due to the rising cost of goods.',
  },
  {
    icon: <GraduationCap className="h-6 w-6 text-primary" />,
    title: 'Debt Management',
    description: 'Distinguishing between good debt (assets) and bad debt (consumables), and strategies to pay it off.',
  },
];

const FinanceEducation: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
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

      <main className="flex-1">
        <section className="container py-12 md:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h1 className="text-4xl font-bold leading-[1.1] md:text-6xl">Finance Education</h1>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Master the basics of personal finance. Building wealth starts with understanding the rules of the game.
            </p>
          </div>

          <div className="mx-auto mt-12 grid gap-6 sm:grid-cols-2 md:max-w-[64rem] lg:grid-cols-3">
            {educationalTopics.map((topic, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <div className="mb-2">{topic.icon}</div>
                  <CardTitle className="text-xl">{topic.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    {topic.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 bg-muted/50 rounded-2xl p-8 text-center max-w-[64rem] mx-auto">
            <h2 className="text-2xl font-bold mb-4 italic">"An investment in knowledge pays the best interest."</h2>
            <p className="text-muted-foreground">— Benjamin Franklin</p>
          </div>
        </section>
      </main>

      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Designed by{' '}
            <a href="https://github.com/bravetux" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">
              Bravetux
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
};

export default FinanceEducation;