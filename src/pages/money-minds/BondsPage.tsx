"use client";

import React from 'react';
import { ShieldCheck, Lock, AlertTriangle, Scale, Coins, BarChart3, Info, Landmark, TrendingUp, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EducationHeader from '@/fedu/EducationHeader';

const BondsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <EducationHeader />
      
      <main className="container py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Hero Section */}
          <section className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
              Investing in Bonds in India
            </h1>
            <p className="text-xl text-muted-foreground">
              Bonds are essentially IOUs. When you buy a bond, you are lending money to a company or the government for a fixed period in exchange for regular interest.
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <Badge variant="outline" className="px-3 py-1 text-sm">Fixed Income</Badge>
              <Badge variant="outline" className="px-3 py-1 text-sm">Predictable Returns</Badge>
              <Badge variant="outline" className="px-3 py-1 text-sm">Wealth Preservation</Badge>
            </div>
          </section>

          {/* Core Philosophy: The Bond Investor's Mindset */}
          <section className="grid md:grid-cols-3 gap-6">
            <Card className="border-orange-200 bg-orange-50/30 dark:bg-orange-900/10">
              <CardHeader className="pb-2">
                <Lock className="w-8 h-8 text-orange-600 mb-2" />
                <CardTitle className="text-lg">Hold Till Maturity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Bonds in India are often <strong>illiquid</strong>. Selling before the end date (maturity) can be difficult or lead to losses. Only invest money you don't need until the bond expires.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50/30 dark:bg-blue-900/10">
              <CardHeader className="pb-2">
                <Scale className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Investor Discipline</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Don't panic if market prices fluctuate. If you are a disciplined investor holding till maturity, these daily price changes do not affect your final returns.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/30 dark:bg-green-900/10">
              <CardHeader className="pb-2">
                <CalendarDays className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle className="text-lg">Monthly Income</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We prefer bonds that pay interest <strong>monthly</strong>. This provides a steady cash flow (Passive Income) and reduces the risk of waiting a whole year for your payout.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Infographic: Safety & Security */}
          <section className="bg-muted/50 rounded-2xl p-8 border">
            <h2 className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-2">
              <ShieldCheck className="text-primary" /> The Safety Checklist
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12">
              {/* Ratings Explanation */}
              <div className="space-y-6">
                <h3 className="font-semibold text-lg border-b pb-2">1. Credit Ratings</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-600 text-white font-bold px-3 py-1 rounded text-sm w-16 text-center">AAA</div>
                    <p className="text-sm">Highest Safety. Negligible risk of default.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-yellow-500 text-white font-bold px-3 py-1 rounded text-sm w-16 text-center">AA / A</div>
                    <p className="text-sm">High Safety. Low risk but slightly more than AAA.</p>
                  </div>
                  <div className="flex items-center gap-4 opacity-50">
                    <div className="bg-red-500 text-white font-bold px-3 py-1 rounded text-sm w-16 text-center">BBB / C</div>
                    <p className="text-sm">Moderate to High Risk. Avoid unless expert.</p>
                  </div>
                </div>
                <p className="text-xs italic text-muted-foreground mt-4">
                  *Always check ratings from agencies like CRISIL, ICRA, or CARE.
                </p>
              </div>

              {/* Senior Secured Explanation */}
              <div className="space-y-6">
                <h3 className="font-semibold text-lg border-b pb-2">2. Senior Secured Status</h3>
                <div className="relative border-l-4 border-primary pl-6 py-2 space-y-6">
                  <div className="relative">
                    <div className="absolute -left-[34px] top-0 w-4 h-4 rounded-full bg-primary" />
                    <h4 className="font-bold text-primary">Senior Secured (Preferred)</h4>
                    <p className="text-sm text-muted-foreground">Backed by company assets. If the company fails, these investors are <strong>first in line</strong> to get paid.</p>
                  </div>
                  <div className="relative opacity-60">
                    <div className="absolute -left-[34px] top-0 w-4 h-4 rounded-full bg-muted-foreground" />
                    <h4 className="font-bold">Unsecured / Subordinated</h4>
                    <p className="text-sm text-muted-foreground">No assets backing them. High risk if the company faces financial trouble.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Example Section: The Math of Bonds */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="text-primary" /> How the Returns Work (Example)
            </h2>
            
            <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
              <div className="bg-primary/5 p-4 border-b flex items-center gap-2">
                <Landmark className="w-5 h-5" />
                <span className="font-medium">The Scenario: 10% Annual Bond</span>
              </div>
              <div className="p-6 grid md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Face Value</p>
                  <p className="text-2xl font-bold">₹1,000</p>
                  <p className="text-xs text-muted-foreground">The actual price of one bond unit at issue.</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Coupon Rate (Fixed)</p>
                  <p className="text-2xl font-bold text-green-600">10% p.a.</p>
                  <p className="text-xs text-muted-foreground">You get ₹100 interest every year (₹8.33/month).</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Current Market Price</p>
                  <p className="text-2xl font-bold text-orange-600">₹950</p>
                  <p className="text-xs text-muted-foreground">Bonds often trade at a discount or premium in the market.</p>
                </div>
              </div>

              <div className="px-6 py-4 bg-secondary/20 border-t">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary rounded-full">
                      <TrendingUp className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Yield to Maturity (YTM)</p>
                      <p className="text-lg font-bold text-primary">~11.4%</p>
                    </div>
                  </div>
                  <div className="max-w-md">
                    <p className="text-sm italic">
                      "Why is YTM higher? Because you bought the bond for <strong>₹950</strong> but you will receive <strong>₹1,000</strong> back at the end, PLUS all the interest."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Warning Section */}
          <section className="p-6 border-2 border-dashed border-destructive/50 rounded-xl bg-destructive/5 flex items-start gap-4">
            <AlertTriangle className="w-10 h-10 text-destructive flex-shrink-0" />
            <div>
              <h3 className="font-bold text-destructive text-lg">The Golden Warning</h3>
              <p className="text-muted-foreground">
                Bonds are not risk-free. If a company goes bankrupt, even senior secured investors may face delays or losses. Always diversify your bond portfolio across different companies and industries.
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default BondsPage;