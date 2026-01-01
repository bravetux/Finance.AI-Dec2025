"use client";

import React from 'react';
import { Landmark, Building2, ArrowRight, ShieldCheck, XCircle, Coins } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const BondsPage: React.FC = () => {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-extrabold mb-4 text-primary">Bond Investments in India</h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card className="border-green-200 bg-green-50/30">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold flex items-center mb-4 text-green-700">
              <ShieldCheck className="w-6 h-6 mr-2" /> Do's
            </h2>
            <ul className="space-y-2">
              <li>• Check credit ratings (AAA/AA+)</li>
              <li>• Understand Yield to Maturity (YTM)</li>
              <li>• Consider Tax-Free bonds</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/30">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold flex items-center mb-4 text-red-700">
              <XCircle className="w-6 h-6 mr-2" /> Don'ts
            </h2>
            <ul className="space-y-2">
              <li>• Don't chase unrealistic high yields</li>
              <li>• Don't ignore interest rate risk</li>
              <li>• Don't forget to check liquidity</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BondsPage;