"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Repeat, ArrowRightLeft, BookOpen } from 'lucide-react';
import EducationHeader from '@/fedu/EducationHeader';
import TopicCard from '@/fedu/TopicCard';
import QuoteSection from '@/fedu/QuoteSection';

const FinanceEducation: React.FC = () => {
  const mutualFundTopics = [
    {
      path: "/finance-education/sip",
      icon: <DollarSign className="w-8 h-8 text-green-600" />,
      title: "Systematic Investment Plan (SIP)",
      description: "Learn how to invest small, regular amounts to benefit from Rupee Cost Averaging and compounding over time.",
    },
    {
      path: "/finance-education/swp",
      icon: <Repeat className="w-8 h-8 text-red-600" />,
      title: "Systematic Withdrawal Plan (SWP)",
      description: "Understand how to generate a steady income stream from your accumulated corpus, ideal for retirement.",
    },
    {
      path: "/finance-education/stp",
      icon: <ArrowRightLeft className="w-8 h-8 text-orange-600" />,
      title: "Systematic Transfer Plan (STP)",
      description: "Discover how to gradually shift a lump sum from a low-risk fund to a high-growth fund, mitigating market timing risk.",
    },
  ];

  return (
    <>
      <EducationHeader />
      <main className="container py-12">
        <div className="text-center mb-12">
          <BookOpen className="w-12 h-12 mx-auto text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Financial Education Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Empower your financial journey with knowledge. Explore key investment concepts and strategies tailored for the Indian market.
          </p>
        </div>

        <QuoteSection />

        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-6 border-b pb-2">Mutual Funds: Systematic Plans</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {mutualFundTopics.map((topic) => (
              <Link to={topic.path} key={topic.title}>
                <TopicCard
                  icon={topic.icon}
                  title={topic.title}
                  description={topic.description}
                />
              </Link>
            ))}
          </div>
        </section>
        
        {/* Future sections can be added here */}

      </main>
    </>
  );
};

export default FinanceEducation;