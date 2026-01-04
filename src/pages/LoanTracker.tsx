"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { HandCoins, Upload, Download, Trash2, PlusCircle } from "lucide-react";
import { saveAs } from "file-saver";
import { showSuccess, showError } from "@/utils/toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LoanCard from "@/components/LoanCard";

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

const initialLoans: Loan[] = [];

const LoanTracker: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>(() => {
    try {
      const saved = localStorage.getItem('loanTrackerData');
      return saved ? JSON.parse(saved) : initialLoans;
    } catch {
      return initialLoans;
    }
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [formData, setFormData] = useState<Partial<Loan>>({});

  useEffect(() => {
    localStorage.setItem('loanTrackerData', JSON.stringify(loans));
    window.dispatchEvent(new Event('storage'));
  }, [loans]);

  const handleOpenDialog = (loan?: Loan) => {
    if (loan) {
      setEditingLoan(loan);
      setFormData(loan);
    } else {
      setEditingLoan(null);
      setFormData({
        category: 'Other',
        totalAmount: 0,
        amountPaid: 0,
        interestRate: 0,
        emi: 0,
        nextPaymentDate: new Date().toISOString().split('T')[0]
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) {
      showError("Please enter a loan name.");
      return;
    }

    if (editingLoan) {
      setLoans(prev => prev.map(l => l.id === editingLoan.id ? { ...l, ...formData } as Loan : l));
      showSuccess("Loan updated successfully!");
    } else {
      const newLoan: Loan = {
        ...formData,
        id: Date.now().toString(),
      } as Loan;
      setLoans(prev => [...prev, newLoan]);
      showSuccess("Loan added successfully!");
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setLoans(prev => prev.filter(loan => loan.id !== id));
    showSuccess("Loan removed.");
  };

  const totals = useMemo(() => {
    return loans.reduce(
      (acc, loan) => {
        acc.totalAmount += (loan.totalAmount || 0);
        acc.amountPaid += (loan.amountPaid || 0);
        acc.remainingPrincipal += ((loan.totalAmount || 0) - (loan.amountPaid || 0));
        acc.totalEmi += (loan.emi || 0);
        return acc;
      },
      { totalAmount: 0, amountPaid: 0, remainingPrincipal: 0, totalEmi: 0 }
    );
  }, [loans]);

  const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

  const exportData = () => {
    const blob = new Blob([JSON.stringify(loans, null, 2)], { type: 'application/json' });
    saveAs(blob, 'loan-tracker-data.json');
    showSuccess('Loan data exported successfully!');
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        if (Array.isArray(data)) {
          setLoans(data);
          showSuccess('Loan data imported successfully!');
        } else {
          showError('Invalid file format.');
        }
      } catch (err) {
        showError('Failed to parse the file.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleClearData = () => {
    setLoans([]);
    showSuccess('All loan data has been cleared.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <HandCoins className="h-8 w-8 text-primary" />
            Loan & Liability Tracker
          </h1>
          <p className="text-muted-foreground mt-1">Manage and track your outstanding debts and EMIs.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                <Trash2 className="mr-2 h-4 w-4" /> Clear
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>This will delete all loan entries. This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearData} className="bg-red-500 hover:bg-red-600">Yes, clear data</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="outline" size="sm" onClick={exportData}><Upload className="mr-2 h-4 w-4" /> Export</Button>
          <Button variant="outline" size="sm" asChild>
            <Label htmlFor="import-file" className="cursor-pointer">
              <Download className="mr-2 h-4 w-4" /> Import
              <Input id="import-file" type="file" accept=".json" className="hidden" onChange={importData} />
            </Label>
          </Button>
          <Button size="sm" onClick={() => handleOpenDialog()} className="gap-2">
            <PlusCircle className="h-4 w-4" /> Add Loan
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-card p-4 rounded-lg border shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Total Loans</p>
          <p className="text-2xl font-bold text-foreground">{loans.length}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Total Outstanding</p>
          <p className="text-2xl font-bold text-red-500">{formatCurrency(totals.remainingPrincipal)}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Monthly EMI Commitment</p>
          <p className="text-2xl font-bold text-primary">{formatCurrency(totals.totalEmi)}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Total Repaid</p>
          <p className="text-2xl font-bold text-emerald-500">{formatCurrency(totals.amountPaid)}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loans.length > 0 ? (
          loans.map(loan => (
            <LoanCard 
              key={loan.id} 
              loan={loan} 
              onEdit={handleOpenDialog} 
              onDelete={handleDelete} 
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-xl">
            <HandCoins className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">No loans tracked yet.</p>
            <Button variant="link" onClick={() => handleOpenDialog()}>Add your first loan</Button>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingLoan ? 'Edit Loan' : 'Add New Loan'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Loan Name</Label>
              <Input 
                id="name" 
                value={formData.name || ''} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                placeholder="e.g., HDFC Home Loan"
              />
            </div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value: LoanCategory) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home">Home Loan</SelectItem>
                  <SelectItem value="Education">Education Loan</SelectItem>
                  <SelectItem value="Car">Car Loan</SelectItem>
                  <SelectItem value="Personal">Personal Loan</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="total">Total Amount</Label>
                <Input 
                  id="total" 
                  type="number"
                  value={formData.totalAmount || 0} 
                  onChange={e => setFormData({ ...formData, totalAmount: Number(e.target.value) })} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="paid">Amount Paid</Label>
                <Input 
                  id="paid" 
                  type="number"
                  value={formData.amountPaid || 0} 
                  onChange={e => setFormData({ ...formData, amountPaid: Number(e.target.value) })} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="rate">Interest Rate (%)</Label>
                <Input 
                  id="rate" 
                  type="number"
                  step="0.1"
                  value={formData.interestRate || 0} 
                  onChange={e => setFormData({ ...formData, interestRate: Number(e.target.value) })} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="emi">Monthly EMI</Label>
                <Input 
                  id="emi" 
                  type="number"
                  value={formData.emi || 0} 
                  onChange={e => setFormData({ ...formData, emi: Number(e.target.value) })} 
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nextDate">Next Payment Date</Label>
              <Input 
                id="nextDate" 
                type="date"
                value={formData.nextPaymentDate || ''} 
                onChange={e => setFormData({ ...formData, nextPaymentDate: e.target.value })} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoanTracker;