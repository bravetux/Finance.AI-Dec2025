"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CalculatorInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  isCurrency?: boolean;
}

const formatCurrency = (value: number) => {
  return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
};

const CalculatorInput: React.FC<CalculatorInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  isCurrency = false,
}) => {
  const displayValue = isCurrency ? formatCurrency(value) : `${value}${unit || ""}`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, "");
    const numValue = parseFloat(rawValue);

    if (!isNaN(numValue)) {
      // Clamp the value between min and max
      const clampedValue = Math.max(min, Math.min(max, numValue));
      onChange(clampedValue);
    } else if (rawValue === "") {
      // Allow clearing the input temporarily, but set to min if empty on blur
      onChange(0); // We use 0 temporarily, the parent component might handle validation on blur if needed.
    }
  };

  const handleBlur = () => {
    // Ensure the value is within bounds and not 0 if a minimum is required
    if (value < min) {
      onChange(min);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <Label className="font-medium">{label}</Label>
        <span className="text-lg font-bold text-primary bg-primary/10 px-3 py-1 rounded-md">
          {displayValue}
        </span>
      </div>
      <Input
        type="text"
        inputMode="numeric"
        value={value === 0 ? "" : value} // Show empty string if value is 0 for better UX when typing
        onChange={handleInputChange}
        onBlur={handleBlur}
        min={min}
        max={max}
        step={step}
        className="text-lg h-12"
      />
    </div>
  );
};

export default CalculatorInput;