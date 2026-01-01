"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Eye, EyeOff } from "lucide-react";
import { useFidok } from "../../context/FidokContext";
import { encryptData, decryptData } from "@/utils/cryptoUtils";

interface BankAccount {
  id: string;
  holderName: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  nominees: string;
  email: string;
  mobile: string;
}

export const FidokBankAccounts: React.FC = () => {
  const { masterPassword } = useFidok();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [showAccNums, setShowAccNums] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!masterPassword) return;
      try {
        const saved = localStorage.getItem('fidokBankAccounts');
        if (saved) {
          if (saved.startsWith('[')) {
            setAccounts(JSON.parse(saved));
          } else {
            const decrypted = await decryptData(saved, masterPassword);
            setAccounts(JSON.parse(decrypted));
          }
        }
      } catch (e) {
        console.error("Failed to load encrypted bank accounts", e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
  }, [masterPassword]);

  useEffect(() => {
    const saveData = async () => {
      if (!masterPassword || !isLoaded) return;
      try {
        const encrypted = await encryptData(JSON.stringify(accounts), masterPassword);
        localStorage.setItem('fidokBankAccounts', encrypted);
      } catch (e) {
        console.error("Failed to save encrypted bank accounts", e);
      }
    };
    saveData();
  }, [accounts, masterPassword, isLoaded]);

  const handleAddRow = () => {
    setAccounts(prev => [...prev, { id: Date.now().toString(), holderName: '', bankName: '', accountNumber: '', accountType: '', nominees: '', email: '', mobile: '' }]);
  };

  const handleDeleteRow = (id: string) => {
    setAccounts(prev => prev.filter(item => item.id !== id));
  };

  const handleChange = (id: string, field: keyof BankAccount, value: string) => {
    setAccounts(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const toggleVisibility = (id: string) => {
    setShowAccNums(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Bank Account Details</CardTitle>
        <Button size="sm" onClick={handleAddRow}><PlusCircle className="mr-2 h-4 w-4" /> Add Row</Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>A/C Holder Name</TableHead>
                <TableHead>Bank Name & Branch</TableHead>
                <TableHead>Account Number</TableHead>
                <TableHead>Type of Account</TableHead>
                <TableHead>Nominee/s</TableHead>
                <TableHead>Registered Email</TableHead>
                <TableHead>Registered Mobile</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map(acc => (
                <TableRow key={acc.id}>
                  <TableCell className="p-1"><Input value={acc.holderName} onChange={e => handleChange(acc.id, 'holderName', e.target.value)} /></TableCell>
                  <TableCell className="p-1"><Input value={acc.bankName} onChange={e => handleChange(acc.id, 'bankName', e.target.value)} /></TableCell>
                  <TableCell className="p-1">
                    <div className="relative">
                        <Input 
                            type={showAccNums[acc.id] ? "text" : "password"} 
                            value={acc.accountNumber} 
                            onChange={e => handleChange(acc.id, 'accountNumber', e.target.value)} 
                            className="pr-10"
                        />
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute right-0 top-0 h-full px-2 py-1 text-muted-foreground"
                            onClick={() => toggleVisibility(acc.id)}
                        >
                            {showAccNums[acc.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                  </TableCell>
                  <TableCell className="p-1"><Input value={acc.accountType} onChange={e => handleChange(acc.id, 'accountType', e.target.value)} /></TableCell>
                  <TableCell className="p-1"><Input value={acc.nominees} onChange={e => handleChange(acc.id, 'nominees', e.target.value)} /></TableCell>
                  <TableCell className="p-1"><Input value={acc.email} onChange={e => handleChange(acc.id, 'email', e.target.value)} /></TableCell>
                  <TableCell className="p-1"><Input value={acc.mobile} onChange={e => handleChange(acc.id, 'mobile', e.target.value)} /></TableCell>
                  <TableCell className="p-1"><Button variant="ghost" size="icon" onClick={() => handleDeleteRow(acc.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};