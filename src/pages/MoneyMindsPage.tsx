"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRightLeft, Wallet, Landmark, GraduationCap } from 'lucide-react';
import TopicCard from '@/fedu/TopicCard';
import QuoteSection from '@/fedu/QuoteSection';

const MoneyMindsPage: React.FC = () => {
  return (
    <div className="container py-12">
      <div className="flex flex-col items-center text-center mb-16">
        <GraduationCap className="h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          Money Minds Education
        </h1>
        <p className="text-xl text-muted-foreground max-w-[42rem]">
          Master the fundamentals of Indian mutual funds and debt instruments through our visual guides.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <Link to="/finance-education/sip">
          <TopicCard
            icon={<TrendingUp className="h-10 w-10 text-green-500" />}
            title="Systematic Investment Plan (SIP)"
            description="Learn how to build wealth through regular, disciplined investing and the power of compounding."
          />
        </Link>
        <Link to="/finance-education/stp">
          <TopicCard
            icon={<ArrowRightLeft className="h-10 w-10 text-orange-500" />}
            title="Systematic Transfer Plan (STP)"
            description="Understand how to move lump sums into equity gradually while keeping your money productive."
          />
        </Link>
        <Link to="/finance-education/swp">
          <TopicCard
            icon={<Wallet className="h-10 w-10 text-red-500" />}
            title="Systematic Withdrawal Plan (SWP)"
            description="Discover how to create a regular income stream from your accumulated corpus efficiently."
          />
        </Link>
        <Link to="/finance-education/bonds">
          <TopicCard
            icon={<Landmark className="h-10 w-10 text-blue-500" />}
            title="Investing in Bonds"
            description="A guide to safe, fixed-income investing with G-Secs, Corporate Bonds, and Sovereign Gold Bonds."
          />
        </Link>
      </div>

      <QuoteSection />
    </div>
  );
};

export default MoneyMindsPage;