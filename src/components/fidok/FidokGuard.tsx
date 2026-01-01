"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LockKeyhole, ShieldAlert, KeyRound } from "lucide-react";
import { useFidok } from "../../context/FidokContext";
import { hashPassword } from "@/utils/cryptoUtils";
import { showError, showSuccess } from "@/utils/toast";

export const FidokGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { masterPassword, setMasterPassword } = useFidok();
  const [input, setInput] = useState("");
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [storedHash, setStoredHash] = useState<string | null>(localStorage.getItem('fidok_pwd_hash'));

  useEffect(() => {
    if (!storedHash) {
      setIsSettingUp(true);
    }
  }, [storedHash]);

  const handleUnlock = async () => {
    const hash = await hashPassword(input);
    if (hash === storedHash) {
      setMasterPassword(input);
      showSuccess("FIDOK module unlocked.");
    } else {
      showError("Incorrect master password.");
    }
  };

  const handleSetup = async () => {
    if (input.length < 8) {
      showError("Password must be at least 8 characters.");
      return;
    }
    if (input !== confirmInput) {
      showError("Passwords do not match.");
      return;
    }
    const hash = await hashPassword(input);
    localStorage.setItem('fidok_pwd_hash', hash);
    setStoredHash(hash);
    setMasterPassword(input);
    showSuccess("Master password set successfully.");
  };

  if (masterPassword) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md border-primary/20 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <LockKeyhole className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>{isSettingUp ? "Set Master Password" : "Unlock FIDOK"}</CardTitle>
          <CardDescription>
            {isSettingUp 
              ? "Choose a strong password to encrypt your sensitive life secrets. This password is never sent to any server."
              : "Enter your master password to decrypt and view your sensitive records."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pwd">Master Password</Label>
            <Input 
              id="pwd" 
              type="password" 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === 'Enter' && (!isSettingUp ? handleUnlock() : handleSetup())}
            />
          </div>
          {isSettingUp && (
            <div className="space-y-2">
              <Label htmlFor="confirm_pwd">Confirm Password</Label>
              <Input 
                id="confirm_pwd" 
                type="password" 
                value={confirmInput} 
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          )}
          <Button className="w-full" onClick={isSettingUp ? handleSetup : handleUnlock}>
            {isSettingUp ? <KeyRound className="mr-2 h-4 w-4" /> : <LockKeyhole className="mr-2 h-4 w-4" />}
            {isSettingUp ? "Enable Encryption" : "Unlock Module"}
          </Button>
          {!isSettingUp && (
             <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted p-3 rounded-md">
                <ShieldAlert className="h-4 w-4 shrink-0 text-amber-500" />
                <p>If you lose this password, your FIDOK data cannot be recovered. We do not store or reset it.</p>
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};