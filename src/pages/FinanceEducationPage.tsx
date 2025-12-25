"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Zap } from 'lucide-react';
import TopicCard from '@/fedu/TopicCard';
import QuoteSection from '@/fedu/QuoteSection';

const FinanceEducationPage: React.FC = () => {
  return (
    <div className="container py-16">
      <div className="text-center max-w-4xl mx-auto mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">
          Master Your Money with <span className="text-primary">Money Minds</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Dive into comprehensive guides on mutual funds, stocks, bonds, and alternative investments tailored for the Indian market.
        </p>
        <Button size="lg" asChild>
          <Link to="/money-minds">
            <BookOpen className="w-5 h-5 mr-2" />
            Start Learning Now
          </Link>
        </Button>
      </div>

      <QuoteSection />

      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Core Investment Topics</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <TopicCard 
            icon={<Zap className="w-8 h-8 text-yellow-500" />}
            title="Mutual Funds"
            description="Understand SIP, SWP, and STP strategies to build and withdraw wealth systematically."
          />
          <TopicCard 
            icon={<BookOpen className="w-8 h-8 text-blue-500" />}
            title="Equity Markets"
            description="Learn the basics of stock investing, fundamental analysis, and long-term wealth creation."
          />
          <TopicCard 
            icon={<BookOpen className="w-8 h-8 text-green-500" />}
            title="Fixed Income"
            description="Explore bonds, FDs, and other debt instruments for stable, low-risk returns."
          />
        </div>
      </div>
    </div>
  );
};

export default FinanceEducationPage;