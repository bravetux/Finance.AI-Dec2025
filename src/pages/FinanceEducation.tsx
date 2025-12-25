"use client";

import React from 'react';
import { TrendingUp, ShieldCheck, PiggyBank, Lightbulb, Wallet, GraduationCap } from 'lucide-react';
import EducationHeader from '../fedu/EducationHeader';
import TopicCard from '../fedu/TopicCard';
import QuoteSection from '../fedu/QuoteSection';

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
      <EducationHeader />

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
              <TopicCard 
                key={index}
                icon={topic.icon}
                title={topic.title}
                description={topic.description}
              />
            ))}
          </div>

          <QuoteSection />
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