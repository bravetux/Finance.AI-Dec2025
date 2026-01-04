"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Pencil, Trash2, Home, GraduationCap, Car, User, CreditCard, HandCoins } from "lucide-react";
import { Button } from "@/components/ui/button";

type LoanCategory = 'Home' | 'Education' | 'Car' | 'Personal' | 'Credit Card' | 'Other';

interface Loan {
  id: string;
  name: string;
  category: LoanCategory;
  totalAmount: number;
  amountPaid: number;
  interestRate: number;
  emi: number;
  nextPaymentDate: string;
}

interface LoanCardProps {
  loan: Loan;
  onEdit: (loan: Loan) => void;
  onDelete: (id: string) => void;
}

const getCategoryIcon = (category: LoanCategory) => {
  switch (category) {
    case 'Home': return <Home className="h-5 w-5 text-red-500" />;
    case 'Education': return <GraduationCap className="h-5 w-5 text-blue-500" />;
    case 'Car': return <Car className="h-5 w-5 text-orange-500" />;
    case 'Personal': return <User className="h-5 w-5 text-green-500" />;
    case 'Credit Card': return <CreditCard className="h-5 w-5 text-purple-500" />;
    default: return <HandCoins className="h-5 w-5 text-gray-500" />;
  }
};

const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

const LoanCard: React.FC<LoanCardProps> = ({ loan, onEdit, onDelete }) => {
  const outstanding = loan.totalAmount - loan.amountPaid;
  const percentPaid = loan.totalAmount > 0 ? (loan.amountPaid / loan.totalAmount) * 100 : 0;

  return (
    <Card className="overflow-hidden border-muted-foreground/20">
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="p-2 rounded-full bg-muted/50">
              {getCategoryIcon(loan.category)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{loan.name || 'Untitled Loan'}</h3>
              <p className="text-sm text-muted-foreground">{loan.category} Loan</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(loan)} className="h-8 w-8 text-muted-foreground">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(loan.id)} className="h-8 w-8 text-red-400 hover:text-red-500">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Amount Section */}
        <div className="space-y-1">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-muted-foreground font-medium">Outstanding</span>
            <span className="text-3xl font-bold text-red-500">{formatCurrency(outstanding)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Original Amount</span>
            <span className="font-semibold">{formatCurrency(loan.totalAmount)}</span>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          <Progress value={percentPaid} className="h-2 bg-muted [&>div]:bg-emerald-500" />
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-muted-foreground">{percentPaid.toFixed(1)}% Paid</span>
            <span className="text-muted-foreground">{formatCurrency(loan.amountPaid)} paid</span>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Monthly EMI</span>
            <span className="font-bold">{formatCurrency(loan.emi)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Interest Rate</span>
            <span className="font-bold">{loan.interestRate}% p.a.</span>
          </div>
          <div className="pt-2 border-t flex justify-between text-sm font-semibold">
            <span className="text-muted-foreground">Next Payment</span>
            <span>{loan.nextPaymentDate ? new Date(loan.nextPaymentDate).toLocaleDateString('en-GB') : 'N/A'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoanCard;