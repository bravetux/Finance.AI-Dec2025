"use client";

import React from 'react';
import { 
  ArrowRight, 
  Calculator, 
  PieChart, 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  ExternalLink 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <header className="bg-white border-b">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">TaxWise</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#services" className="text-slate-600 hover:text-blue-600 transition-colors">Services</a>
            <Button variant="outline" className="mr-2">Log In</Button>
            <Button>Get Started</Button>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Content */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-3xl">
            <h1 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Smarter Tax Planning for a <span className="text-blue-600">Secure Future</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Optimize your finances with our advanced tax strategies. We help individuals and businesses minimize liabilities and maximize growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                Start Your Plan <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                View Pricing
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">Why Choose TaxWise?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Calculator className="w-10 h-10 text-blue-600" />,
                  title: "Precision Math",
                  description: "Our algorithms ensure every penny is accounted for with 100% accuracy."
                },
                {
                  icon: <ShieldCheck className="w-10 h-10 text-blue-600" />,
                  title: "Compliant & Secure",
                  description: "Stay ahead of changing regulations with our constantly updated platform."
                },
                {
                  icon: <TrendingUp className="w-10 h-10 text-blue-600" />,
                  title: "Growth Focused",
                  description: "We don't just save you money; we help you find ways to reinvest it wisely."
                }
              ].map((feature, idx) => (
                <Card key={idx} className="border-none shadow-lg bg-slate-50">
                  <CardHeader>
                    <div className="mb-4">{feature.icon}</div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">Our Specialized Services</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Tax Planning Card */}
              <Card className="hover:shadow-xl transition-shadow border-2 border-blue-50">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                        <PieChart className="w-6 h-6 text-blue-600" />
                        Tax Planning
                      </CardTitle>
                      <CardDescription>Strategic advice for long-term savings</CardDescription>
                    </div>
                    {/* FinSmart Link Button */}
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                      asChild
                    >
                      <a href="https://emerald-owl-zoom.vercel.app/" target="_blank" rel="noopener noreferrer">
                        FinSmart <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-center gap-2">• Retirement account optimization</li>
                    <li className="flex items-center gap-2">• Investment tax strategies</li>
                    <li className="flex items-center gap-2">• Estate planning coordination</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Business Services Card */}
              <Card className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                    Business Tax
                  </CardTitle>
                  <CardDescription>Corporate solutions for modern companies</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-center gap-2">• Payroll tax management</li>
                    <li className="flex items-center gap-2">• R&D tax credit filing</li>
                    <li className="flex items-center gap-2">• Multi-state compliance</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to optimize your taxes?</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of satisfied clients who have transformed their financial future with TaxWise.
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
              Get Started for Free
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2 text-white">
              <DollarSign className="w-6 h-6 text-blue-400" />
              <span className="text-lg font-bold">TaxWise</span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="text-sm">
              © {new Date().getFullYear()} TaxWise Inc. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;