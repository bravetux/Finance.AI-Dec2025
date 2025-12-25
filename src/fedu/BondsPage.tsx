"use client";

import React from 'react';
import { 
  Building2, 
  Landmark, 
  ArrowRight, 
  ArrowDown, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  TrendingDown, 
  Coins,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const BondsPage: React.FC = () => {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-extrabold mb-4 text-primary">Investing in Bonds (India)</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
        Bonds are fixed-income instruments where you lend money to an issuer (like the Government or a Corporation) for a specific period in exchange for regular interest payments (coupons) and the return of your principal at maturity.
      </p>

      {/* --- INFOGRAPHIC SECTION --- */}
      <div className="mb-12 p-6 border rounded-xl bg-secondary/30">
        <h2 className="text-2xl font-bold mb-6 text-center">How Bond Investing Works</h2>
        <div className="flex flex-col md:flex-row items-center justify-around text-center space-y-8 md:space-y-0">
          
          {/* Step 1: Investor */}
          <div className="flex flex-col items-center">
            <Coins className="w-10 h-10 text-yellow-600 mb-2" />
            <p className="font-semibold">Investor</p>
            <p className="text-sm text-muted-foreground">Lends Capital</p>
          </div>

          {/* Arrow */}
          <div className="flex items-center">
            <ArrowRight className="w-8 h-8 text-gray-400 hidden md:block" />
            <ArrowDown className="w-8 h-8 text-gray-400 md:hidden" />
          </div>

          {/* Step 2: Issuer */}
          <div className="flex flex-col items-center p-4 border-2 border-primary rounded-lg bg-background">
            <div className="flex gap-4 mb-2">
              <Landmark className="w-8 h-8 text-blue-600" />
              <Building2 className="w-8 h-8 text-indigo-600" />
            </div>
            <p className="font-semibold">Issuer (Govt / Corp)</p>
            <p className="text-sm text-muted-foreground">Issues Bond Certificate</p>
          </div>

          {/* Arrow */}
          <div className="flex items-center">
            <ArrowRight className="w-8 h-8 text-gray-400 hidden md:block" />
            <ArrowDown className="w-8 h-8 text-gray-400 md:hidden" />
          </div>

          {/* Step 3: Returns */}
          <div className="flex flex-col items-center">
            <TrendingDown className="w-10 h-10 text-green-600 mb-2 rotate-180" />
            <p className="font-semibold">Regular Interest</p>
            <p className="text-sm text-muted-foreground">+ Principal at Maturity</p>
          </div>
        </div>
      </div>

      {/* --- DO'S AND DON'TS SECTION --- */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card className="border-green-200 bg-green-50/30 dark:bg-green-950/10">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold flex items-center mb-4 text-green-700 dark:text-green-400">
              <CheckCircle2 className="w-6 h-6 mr-2" />
              Do's
            </h2>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-1" />
                <div>
                  <span className="font-semibold">Check Credit Ratings:</span> Always look for AAA or AA+ ratings from agencies like CRISIL, ICRA, or CARE to ensure safety.
                </div>
              </li>
              <li className="flex gap-3">
                <Info className="w-5 h-5 text-green-600 shrink-0 mt-1" />
                <div>
                  <span className="font-semibold">Understand the Yield:</span> Look at 'Yield to Maturity' (YTM) rather than just the coupon rate to know your true returns.
                </div>
              </li>
              <li className="flex gap-3">
                <Coins className="w-5 h-5 text-green-600 shrink-0 mt-1" />
                <div>
                  <span className="font-semibold">Consider Tax-Free Bonds:</span> If you are in the 30% tax bracket, look for tax-free bonds issued by PSUs like NHAI or REC.
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/30 dark:bg-red-950/10">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold flex items-center mb-4 text-red-700 dark:text-red-400">
              <XCircle className="w-6 h-6 mr-2" />
              Don'ts
            </h2>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-1" />
                <div>
                  <span className="font-semibold">Don't Chase High Yields:</span> Extremely high interest rates often signal high default risk. Avoid "Junk Bonds" if you want safety.
                </div>
              </li>
              <li className="flex gap-3">
                <TrendingDown className="w-5 h-5 text-red-600 shrink-0 mt-1" />
                <div>
                  <span className="font-semibold">Don't Ignore Interest Rate Risk:</span> Remember that when market interest rates go up, the price of your existing bonds will fall.
                </div>
              </li>
              <li className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-1" />
                <div>
                  <span className="font-semibold">Don't Forget Liquidity:</span> Some corporate bonds are hard to sell before maturity. Ensure you don't need the money urgently.
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* --- TYPES OF BONDS --- */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Popular Bond Types in India</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg mb-2">Government Securities (G-Secs)</h3>
            <p className="text-sm text-muted-foreground mb-3">Issued by the Central Government. The safest investment in India with zero default risk.</p>
            <Badge>Highest Safety</Badge>
          </div>
          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg mb-2">Corporate Bonds</h3>
            <p className="text-sm text-muted-foreground mb-3">Issued by private companies. Offers higher interest than G-Secs but carries credit risk.</p>
            <Badge variant="secondary">Higher Returns</Badge>
          </div>
          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg mb-2">Sovereign Gold Bonds (SGB)</h3>
            <p className="text-sm text-muted-foreground mb-3">Govt bonds linked to gold price. Pays 2.5% annual interest plus gold price appreciation.</p>
            <Badge variant="outline">Gold Exposure</Badge>
          </div>
        </div>
      </div>

      <div className="mt-12 p-6 bg-muted rounded-lg border">
        <h3 className="text-xl font-semibold mb-3">Summary for Indian Investors</h3>
        <p className="text-lg text-muted-foreground">
          Bonds are an excellent way to diversify away from the stock market. With the introduction of the <strong>RBI Retail Direct</strong> portal and various Bond IPOs, it has become easier than ever for retail investors in India to build a stable, income-generating portfolio.
        </p>
      </div>
    </div>
  );
};

export default BondsPage;