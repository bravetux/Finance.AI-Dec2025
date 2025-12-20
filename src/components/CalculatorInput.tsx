"use client";

import React, { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
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
  // This prevents the input from rejecting intermediate states like "12."
  const [localValue, setLocalValue] = useState(value.toString());

  // Sync local state with prop value when it changes externally (e.g. slider drag)
  useEffect(() => {
    const parsedLocal = parseFloat(localValue);
    // Only update if the values are actually different to avoid overwriting "10.0" with "10"
    if (parsedLocal !== value) {
      setLocalValue(value.toString());
    }
  }, [value, localValue]);

  const handleSliderChange = (vals: number[]) => {
    const newValue = vals[0];
    setLocalValue(newValue.toString());
    onChange(newValue);
  };

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
    // Clamp values on blur
    let parsed = parseFloat(localValue);
    if (isNaN(parsed)) {
      parsed = min;
    }
    
    // Optional: Strictly clamp to min/max on blur? 
    // Usually friendly to allow typing 1000000 even if slider max is small?
    // But let's respect the props for consistency with the slider.
    if (parsed < min) parsed = min;
    if (parsed > max) parsed = max;

    setLocalValue(parsed.toString());
    onChange(parsed);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <Label className="text-base font-medium text-gray-700">{label}</Label>
        <div className="relative w-32 shrink-0">
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
            className={`h-10 text-right ${isCurrency ? "pl-7" : ""} ${
              unit ? "pr-8" : ""
            }`}
          />
          {unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              {unit}
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Slider
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={handleSliderChange}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{isCurrency ? `₹${min.toLocaleString()}` : `${min}${unit || ''}`}</span>
          <span>{isCurrency ? `₹${max.toLocaleString()}` : `${max}${unit || ''}`}</span>
        </div>
      </div>
    </div>
  );
};

export default CalculatorInput;