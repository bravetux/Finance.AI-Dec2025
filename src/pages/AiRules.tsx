"use client";

import React from 'react';
import { 
  ShieldCheck, 
  Search, 
  Scale, 
  Lock, 
  UserCheck, 
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const AiRules = () => {
  const rules = [
    {
      icon: <Lock className="w-8 h-8 text-blue-600" />,
      title: "Data Privacy & Ownership",
      description: "Your financial data is yours. Our AI models do not train on your personal financial records, and all sensitive data is processed locally or in encrypted environments."
    },
    {
      icon: <Search className="w-8 h-8 text-green-600" />,
      title: "Transparency",
      description: "Every AI-generated suggestion comes with an explanation. We prioritize 'Explainable AI' so you understand the logic behind every financial projection."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-purple-600" />,
      title: "Accuracy & Verification",
      description: "While our AI provides advanced modeling, financial calculations are verified against current tax codes and regulatory standards to ensure maximum precision."
    },
    {
      icon: <Scale className="w-8 h-8 text-orange-600" />,
      title: "Bias Mitigation",
      description: "We actively monitor and audit our algorithms to ensure they provide fair and unbiased financial advice across all demographic groups."
    },
    {
      icon: <UserCheck className="w-8 h-8 text-indigo-600" />,
      title: "Human-in-the-Loop",
      description: "AI is a tool for empowerment, not a replacement for judgment. Users have the final say in all financial decisions and can override AI suggestions at any time."
    },
    {
      icon: <AlertCircle className="w-8 h-8 text-red-600" />,
      title: "Clear Disclaimers",
      description: "AI suggestions are for informational purposes. We provide clear distinctions between automated insights and certified professional financial advice."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-12">
          <Button variant="ghost" asChild className="mb-6 -ml-2">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Link>
          </Button>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            AI Rules & Ethical Guidelines
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl">
            Our commitment to responsible AI in financial planning. These rules ensure that our 
            technology remains a secure, transparent, and helpful partner in your financial journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {rules.map((rule, idx) => (
            <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="mb-4">{rule.icon}</div>
                <CardTitle className="text-xl">{rule.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  {rule.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Continuous Oversight</h2>
          <p className="text-slate-600 mb-6">
            These rules are not static. As AI technology evolves, our ethics committee regularly reviews 
            and updates these guidelines to maintain the highest standards of financial security 
            and algorithmic integrity.
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>Last Updated: January 2024</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span>Version 1.2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiRules;