"use client";

import React, { createContext, useContext, useState } from 'react';

interface FidokContextType {
  masterPassword: string | null;
  setMasterPassword: (password: string | null) => void;
}

const FidokContext = createContext<FidokContextType | undefined>(undefined);

export const FidokProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [masterPassword, setMasterPassword] = useState<string | null>(null);

  return (
    <FidokContext.Provider value={{ masterPassword, setMasterPassword }}>
      {children}
    </FidokContext.Provider>
  );
};

export const useFidok = () => {
  const context = useContext(FidokContext);
  if (context === undefined) {
    throw new Error('useFidok must be used within a FidokProvider');
  }
  return context;
};