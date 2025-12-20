"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CalculatorInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  isCurrency?: boolean;
}

const CalculatorInput: React.FC<CalculatorInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  isCurrency = false,
}) => {
  // Use local state to manage the input value as a string.
  const [localValue, setLocalValue] = useState(value.toString());

  // Sync local state with prop value when it changes externally
  useEffect(() => {
    // Only update if the parsed local value differs from the prop value
    // This prevents cursor jumping or re-formatting while typing
    const parsedLocal = parseFloat(localValue);
    if (parsedLocal !== value) {
        // Special case: if user is typing "10." we don't want to force "10"
        // But if the prop changed significantly (e.g. from parent calculation reset), we update.
        // For simple inputs, simple check is usually enough.
        setLocalValue(value.toString());
    }
  }, [value]); // Removed localValue from dependency to avoid loop, but kept logic safe

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (newValue === "") return;

    // Only allow updating parent if it's a valid number
    const parsedValue = parseFloat(newValue);
    if (!isNaN(parsedValue)) {
      onChange(parsedValue);
    }
  };

  const handleBlur = () => {
    let parsed = parseFloat(localValue);
    if (isNaN(parsed)) {
      parsed = min;
    }
    
    // Clamp values on blur
    if (parsed < min) parsed = min;
    if (parsed > max) parsed = max;

    setLocalValue(parsed.toString());
    onChange(parsed);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="relative w-full">
        {isCurrency && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            ₹
          </span>
        )}
        <Input
          type="number"
          value={localValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          step={step}
          className={`h-12 text-lg ${isCurrency ? "pl-8" : "pl-3"} ${
            unit ? "pr-10" : ""
          }`}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};

export default CalculatorInput;