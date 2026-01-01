"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { HeartHandshake, Upload, Download, Trash2, ShieldCheck, LogOut } from "lucide-react";
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

// Import context and guard
import { FidokProvider, useFidok } from "../context/FidokContext";
import { FidokGuard } from "@/components/fidok/FidokGuard";

// Import all the components
import { FidokFamilyMembers } from "@/components/fidok/FidokFamilyMembers";
import { FidokImportantContacts } from "@/components/fidok/FidokImportantContacts";
import { FidokBankAccounts } from "@/components/fidok/FidokBankAccounts";
import { FidokFinancialDocuments } from "@/components/fidok/FidokFinancialDocuments";
import { FidokLockerDetails } from "@/components/fidok/FidokLockerDetails";
import { FidokOnlinePasswords } from "@/components/fidok/FidokOnlinePasswords";
import { FidokInsurancePolicies } from "@/components/fidok/FidokInsurancePolicies";
import { FidokCards } from "@/components/fidok/FidokCards";
import { FidokPropertyDetails } from "@/components/fidok/FidokPropertyDetails";
import { FidokLiabilityDetails } from "@/components/fidok/FidokLiabilityDetails";
import { FidokInvestmentAccounts } from "@/components/fidok/FidokInvestmentAccounts";

const fidokStorageKeys = [
  'fidokFamilyMembers',
  'fidokImportantContacts',
  'fidokBankAccounts',
  'fidokFinancialDocuments',
  'fidokLockerDetails',
  'fidokOnlinePasswords',
  'fidokInsurancePolicies',
  'fidokCards',
  'fidokPropertyDetails',
  'fidokLiabilityDetails',
  'fidokInvestments1',
  'fidokInvestments2',
];

const FIDOKContent: React.FC = () => {
  const { setMasterPassword } = useFidok();

  const handleLock = () => {
    setMasterPassword(null);
    showSuccess("FIDOK module locked.");
  };

  const exportData = () => {
    try {
      const allFidokData = fidokStorageKeys.reduce((acc, key) => {
        const data = localStorage.getItem(key);
        if (data) {
          acc[key] = data; // Export the encrypted strings
        }
        return acc;
      }, {} as Record<string, any>);

      const blob = new Blob([JSON.stringify(allFidokData, null, 2)], { type: 'application/json' });
      saveAs(blob, 'fidok-data-encrypted.json');
      showSuccess('FIDOK data exported successfully (Encrypted)!');
    } catch (error) {
      showError('Failed to export data.');
    }
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        let importedSomething = false;
        fidokStorageKeys.forEach(key => {
          if (data[key]) {
            localStorage.setItem(key, data[key]);
            importedSomething = true;
          }
        });

        if (importedSomething) {
          showSuccess('FIDOK data imported! Please re-unlock to refresh.');
          setMasterPassword(null);
        } else {
          showError('File does not contain valid FIDOK data.');
        }
      } catch (err) {
        showError('Failed to parse the file.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleClearData = () => {
    fidokStorageKeys.forEach(key => localStorage.removeItem(key));
    localStorage.removeItem('fidok_pwd_hash');
    showSuccess("All FIDOK data and Master Password cleared.");
    setMasterPassword(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <HeartHandshake className="h-8 w-8" />
          FIDOK (Kin Planning)
        </h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={handleLock}><LogOut className="mr-2 h-4 w-4" /> Lock</Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4" /> Reset All</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>This will delete all FIDOK entries AND your master password. This cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearData}>Yes, clear all</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="outline" size="sm" onClick={exportData} title="Back up encrypted data"><Upload className="mr-2 h-4 w-4" /> Export</Button>
          <Button variant="outline" size="sm" asChild>
            <Label htmlFor="import-file" className="cursor-pointer"><Download className="mr-2 h-4 w-4" /> Import<Input id="import-file" type="file" accept=".json" className="hidden" onChange={importData} /></Label>
          </Button>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm">
            <p className="font-bold">Encryption Enabled</p>
            <p className="text-muted-foreground">Your passwords, locker codes, and bank accounts are now encrypted with AES-GCM before being stored. Only you hold the key.</p>
        </div>
      </div>

      <FidokFamilyMembers />
      <FidokImportantContacts />
      <FidokBankAccounts />
      <FidokFinancialDocuments />
      <FidokLockerDetails />
      <FidokOnlinePasswords />
      <FidokInsurancePolicies />
      <FidokCards />
      <FidokPropertyDetails />
      <FidokLiabilityDetails />
      <FidokInvestmentAccounts />

    </div>
  );
};

const FIDOK: React.FC = () => {
    return (
        <FidokProvider>
            <FidokGuard>
                <FIDOKContent />
            </FidokGuard>
        </FidokProvider>
    );
};

export default FIDOK;