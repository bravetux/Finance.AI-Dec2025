"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, Calculator, TrendingUp, Shield, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const IndexPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Section */}
      <section className="bg-slate-50 py-20 px-4 border-b">
        <div className="container max-w-5xl text-center space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tight text-primary sm:text-6xl">
            Master Your Personal Finance
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get access to professional investment tools and our comprehensive education platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a 
              href="https://emerald-owl-zoom.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button size="lg" className="h-12 px-8 text-lg gap-2 shadow-lg hover:shadow-xl transition-all">
                Visit FinSmart Education <ExternalLink className="h-5 w-5" />
              </Button>
            </a>
            <Link to="/tools">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                View Calculators
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="container space-y-12">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-all border-2 border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                FinSmart Education Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Deep dive into mutual funds, bonds, and advanced investment strategies. Our specialized education portal helps you become a smarter investor.
              </p>
              <a href="https://emerald-owl-zoom.vercel.app/" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" className="w-full group">
                  Go to FinSmart <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-6 h-6 text-blue-500" />
                Investment Calculators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Calculate your returns for SIP, SWP, and Lumpsum investments. Plan your financial future with precision.
              </p>
              <Link to="/tools">
                <Button variant="outline" className="w-full group">
                  Try Tools <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-all border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-500" />
                Investment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Explore different investment approaches and strategies for wealth creation.
              </p>
              <Link to="/strategies">
                <Button variant="ghost" className="w-full group">
                  Learn More <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-orange-500" />
                Risk Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Understand how to protect your capital and manage risk in your portfolio.
              </p>
              <Link to="/risk">
                <Button variant="ghost" className="w-full group">
                  Learn More <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;