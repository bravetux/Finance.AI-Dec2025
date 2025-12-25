"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Zap, Wallet } from 'lucide-react';
import TopicCard from '@/fedu/TopicCard';
import QuoteSection from '@/fedu/QuoteSection';

const Index: React.FC = () => {
  return (
    <div className="container py-16">
      {/* Financial Planner Hero Section */}
      <div className="text-center max-w-5xl mx-auto mb-16 pt-8">
        <Wallet className="w-12 h-12 mx-auto text-primary mb-4" />
        <h1 className="text-6xl font-extrabold tracking-tight mb-4">
          Your Path to Financial Freedom
        </h1>
        <p className="text-2xl text-muted-foreground mb-8">
          We provide tools and education to help you plan, invest, and secure your future.
        </p>
        <Button size="lg" asChild className="mr-4">
          <Link to="/dashboard">Start Planning</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link to="/money-minds">
            <BookOpen className="w-5 h-5 mr-2" />
            Explore Education
          </Link>
        </Button>
      </div>

      {/* Financial Education Overview Section */}
      <div className="mt-16">
        <h2 className="text-4xl font-bold mb-4 text-center">Money Minds: Learn to Invest Smarter</h2>
        <p className="text-lg text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
          Dive into comprehensive guides on mutual funds, stocks, bonds, and alternative investments tailored for the Indian market.
        </p>
        
        <QuoteSection />

        <div className="mt-16">
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
    </div>
  );
};

export default Index;