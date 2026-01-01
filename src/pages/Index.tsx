"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, Calculator, TrendingUp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const IndexPage: React.FC = () => {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-extrabold mb-4 text-primary font-heading">Welcome to Your Financial Dashboard</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
        Manage your investments, track your goals, and learn about smart financial strategies.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card className="hover:shadow-lg transition-shadow border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-6 h-6 text-blue-500" />
              Investment Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Use our calculators to plan your SIPs, SWPs, and retirement goals.
            </p>
            <Link to="/tools">
              <Button variant="outline" className="w-full group">
                Go to Tools <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              Finance Education (FinSmart)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Learn about mutual funds, bonds, SWP, and smart investment strategies on our dedicated platform.
            </p>
            <a href="https://emerald-owl-zoom.vercel.app/" target="_blank" rel="noopener noreferrer">
              <Button className="w-full group">
                Visit FinSmart <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="hover:shadow-lg transition-shadow border-2">
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
              <Button variant="outline" className="w-full group">
                Learn Strategies <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-2">
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
              <Button variant="outline" className="w-full group">
                Manage Risk <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IndexPage;