"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Eye, EyeOff } from "lucide-react";
import { useFidok } from "../../context/FidokContext";
import { encryptData, decryptData } from "@/utils/cryptoUtils";

interface PasswordInfo {
  id: string;
  loginKind: string;
  awarePerson: string;
  remarks: string;
}

const initialPasswords: PasswordInfo[] = [
  { id: '1', loginKind: 'Personal Email', awarePerson: '', remarks: '' },
  { id: '2', loginKind: 'Password Manager', awarePerson: '', remarks: '' },
  { id: '3', loginKind: 'Mobile Phone Unlock', awarePerson: '', remarks: '' },
];

export const FidokOnlinePasswords: React.FC = () => {
  const { masterPassword } = useFidok();
  const [passwords, setPasswords] = useState<PasswordInfo[]>(initialPasswords);
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!masterPassword) return;
      try {
        const saved = localStorage.getItem('fidokOnlinePasswords');
        if (saved) {
          // If the data is plain JSON (legacy), migrate it
          if (saved.startsWith('[')) {
            setPasswords(JSON.parse(saved));
          } else {
            const decrypted = await decryptData(saved, masterPassword);
            setPasswords(JSON.parse(decrypted));
          }
        }
      } catch (e) {
        console.error("Failed to load encrypted passwords", e);
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
        const encrypted = await encryptData(JSON.stringify(passwords), masterPassword);
        localStorage.setItem('fidokOnlinePasswords', encrypted);
      } catch (e) {
        console.error("Failed to save encrypted passwords", e);
      }
    };
    saveData();
  }, [passwords, masterPassword, isLoaded]);

  const handleAddRow = () => {
    setPasswords(prev => [...prev, { id: Date.now().toString(), loginKind: '', awarePerson: '', remarks: '' }]);
  };

  const handleDeleteRow = (id: string) => {
    setPasswords(prev => prev.filter(item => item.id !== id));
  };

  const handleChange = (id: string, field: keyof PasswordInfo, value: string) => {
    setPasswords(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const toggleVisibility = (id: string) => {
    setShowValues(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Online Passwords</CardTitle>
        <Button size="sm" onClick={handleAddRow}><PlusCircle className="mr-2 h-4 w-4" /> Add Row</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Login Kind</TableHead>
              <TableHead>Person who is aware of Password / Secret Info</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {passwords.map(pw => (
              <TableRow key={pw.id}>
                <TableCell className="font-medium p-1">
                    <Input value={pw.loginKind} onChange={e => handleChange(pw.id, 'loginKind', e.target.value)} placeholder="Service name" />
                </TableCell>
                <TableCell className="p-1">
                    <div className="relative group">
                        <Input 
                            type={showValues[pw.id] ? "text" : "password"} 
                            value={pw.awarePerson} 
                            onChange={e => handleChange(pw.id, 'awarePerson', e.target.value)} 
                            className="pr-10"
                        />
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                            onClick={() => toggleVisibility(pw.id)}
                        >
                            {showValues[pw.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                </TableCell>
                <TableCell className="p-1"><Input value={pw.remarks} onChange={e => handleChange(pw.id, 'remarks', e.target.value)} /></TableCell>
                <TableCell className="p-1 text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteRow(pw.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};