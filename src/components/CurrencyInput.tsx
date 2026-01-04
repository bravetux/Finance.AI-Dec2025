"use client";

import React from "react";
import { Input } from "@/components/ui/input";

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  id?: string;
  className?: string;
  placeholder?: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ 
  value, 
  onChange, 
  id, 
  className,
  placeholder 
}) => {
  // Format number to Indian currency string without currency symbol
  const formatValue = (num: number) => {
    if (num === 0) return "";
    return num.toLocaleString("en-IN");
  };

  // State to manage the display string
  const [displayValue, setDisplayValue] = React.useState(formatValue(value));

  // Update display value when the underlying number changes (e.g., from parent or initial load)
  React.useEffect(() => {
    setDisplayValue(formatValue(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");
    
    // Only allow numbers
    if (rawValue === "" || /^\d*$/.test(rawValue)) {
      const numValue = rawValue === "" ? 0 : parseInt(rawValue, 10);
      setDisplayValue(formatValue(numValue));
      onChange(numValue);
    }
  };

  return (
    <Input
      id={id}
      type="text"
      value={displayValue}
      onChange={handleChange}
      className={className}
      placeholder={placeholder || "0"}
      inputMode="numeric"
    />
  );
};

export default CurrencyInput;