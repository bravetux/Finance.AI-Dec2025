"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const P2P_CALCULATOR_STATE_KEY = 'p2pCalculatorState';

const P2PLendingCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState(50000);
  const [roi, setRoi] = useState(12);
  const [duration, setDuration] = useState(6);
  const [calculationType, setCalculationType] = useState<"emi" | "interest">("emi");
  const [earlyExit, setEarlyExit] = useState(false);
  const [exitMonth, setExitMonth] = useState(1);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem(P2P_CALCULATOR_STATE_KEY);
      if (savedState) {
        const state = JSON.parse(savedState);
        setPrincipal(state.principal || 50000);
        setRoi(state.roi || 12);
        setDuration(state.duration || 6);
        setCalculationType(state.calculationType || 'emi');
        setEarlyExit(state.earlyExit || false);
        setExitMonth(state.exitMonth || 1);
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
    }
  }, []);

  useEffect(() => {
    const state = {
      principal,
      roi,
      duration,
      calculationType,
      earlyExit,
      exitMonth,
    };
    localStorage.setItem(P2P_CALCULATOR_STATE_KEY, JSON.stringify(state));
  }, [principal, roi, duration, calculationType, earlyExit, exitMonth]);


  useEffect(() => {
    setExitMonth(Math.min(exitMonth, duration));
  }, [duration, exitMonth]);

  const monthlyInterestRate = roi / 12 / 100;

  const paymentSchedule = useMemo(() => {
    const schedule = [];
    let remainingPrincipal = principal;
    const finalDuration = earlyExit && calculationType === 'emi' ? exitMonth : duration;
    let cumulativeTotal = 0;

    if (calculationType === "emi") {
      const totalInterest = principal * (roi / 100) * (duration / 12);
      const interestPerMonth = totalInterest / duration;
      const principalPerMonth = principal / duration;
      const emi = principalPerMonth + interestPerMonth;

      for (let i = 1; i <= finalDuration; i++) {
        let currentPayment;
        if (earlyExit && i === exitMonth) {
          const lumpSumPrincipal = principal - (principalPerMonth * (i - 1));
          currentPayment = lumpSumPrincipal + interestPerMonth;
          cumulativeTotal += currentPayment;
          schedule.push({
            month: i,
            principal: lumpSumPrincipal,
            interest: interestPerMonth,
            totalPayment: currentPayment,
            outstandingPrincipal: 0,
            cumulativeTotal: cumulativeTotal,
          });
        } else {
          currentPayment = emi;
          remainingPrincipal -= principalPerMonth;
          cumulativeTotal += currentPayment;
          schedule.push({
            month: i,
            principal: principalPerMonth,
            interest: interestPerMonth,
            totalPayment: currentPayment,
            outstandingPrincipal: remainingPrincipal > 0 ? remainingPrincipal : 0,
            cumulativeTotal: cumulativeTotal,
          });
        }
      }
    } else { // Interest Only
      const interestPayment = principal * monthlyInterestRate;
      for (let i = 1; i <= duration; i++) {
        let totalPayment;
        if (i < duration) {
          totalPayment = interestPayment;
          cumulativeTotal += totalPayment;
          schedule.push({
            month: i,
            principal: 0,
            interest: interestPayment,
            totalPayment: totalPayment,
            outstandingPrincipal: principal,
            cumulativeTotal: cumulativeTotal,
          });
        } else {
          totalPayment = principal + interestPayment;
          cumulativeTotal += totalPayment;
          schedule.push({
            month: i,
            principal: principal,
            interest: interestPayment,
            totalPayment: totalPayment,
            outstandingPrincipal: 0,
            cumulativeTotal: cumulativeTotal,
          });
        }
      }
    }
    return schedule;
  }, [principal, roi, duration, calculationType, monthlyInterestRate, earlyExit, exitMonth]);

  const totalPaid = paymentSchedule.length > 0 ? paymentSchedule[paymentSchedule.length - 1].cumulativeTotal : 0;
  const profit = totalPaid - principal;
  
  const actualDurationInYears = paymentSchedule.length / 12;
  const simpleROI = principal > 0 ? (profit / principal) * 100 : 0;
  const annualizedROI = actualDurationInYears > 0 ? simpleROI / actualDurationInYears : 0;


  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>P2P Lending Calculator</CardTitle>
          <CardDescription>Estimate your returns from P2P lending.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Principal Amount: ₹{principal.toLocaleString()}</Label>
            <Slider
              min={50000}
              max={300000}
              step={1000}
              value={[principal]}
              onValueChange={(value) => setPrincipal(value[0])}
            />
          </div>
          <div className="space-y-2">
            <Label>Rate of Interest (ROI): {roi}%</Label>
            <Slider
              min={8}
              max={28}
              step={0.5}
              value={[roi]}
              onValueChange={(value) => setRoi(value[0])}
            />
          </div>
          <div className="space-y-2">
            <Label>Duration: {duration} months</Label>
            <Slider
              min={1}
              max={12}
              step={1}
              value={[duration]}
              onValueChange={(value) => setDuration(value[0])}
            />
          </div>
          <ToggleGroup
            type="single"
            value={calculationType}
            onValueChange={(value) => {
              if (value) setCalculationType(value as "emi" | "interest");
              if (value === 'interest') setEarlyExit(false);
            }}
          >
            <ToggleGroupItem value="emi">EMI Based</ToggleGroupItem>
            <ToggleGroupItem value="interest">Interest Only</ToggleGroupItem>
          </ToggleGroup>

          <div className="flex items-center space-x-2">
            <Switch 
              id="early-exit" 
              checked={earlyExit} 
              onCheckedChange={setEarlyExit}
              disabled={calculationType === 'interest'}
            />
            <Label htmlFor="early-exit">Early Exit</Label>
          </div>

          {earlyExit && calculationType === 'emi' && (
            <div className="space-y-2">
              <Label>Exit Month: {exitMonth}</Label>
              <Slider
                min={1}
                max={duration}
                step={1}
                value={[exitMonth]}
                onValueChange={(value) => setExitMonth(value[0])}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Payment Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Principal</TableHead>
                <TableHead className="text-right">Interest</TableHead>
                <TableHead className="text-right">Total Payment</TableHead>
                <TableHead className="text-right">Cumulative Total</TableHead>
                <TableHead className="text-right">Outstanding Principal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentSchedule.map((payment) => (
                <TableRow key={payment.month}>
                  <TableCell>{payment.month}</TableCell>
                  <TableCell className="text-right">₹{payment.principal.toFixed(2)}</TableCell>
                  <TableCell className="text-right">₹{payment.interest.toFixed(2)}</TableCell>
                  <TableCell className="text-right">₹{payment.totalPayment.toFixed(2)}</TableCell>
                  <TableCell className="text-right">₹{payment.cumulativeTotal.toFixed(2)}</TableCell>
                  <TableCell className="text-right">₹{payment.outstandingPrincipal.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profit Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-lg flex justify-between items-center">
            <span className="font-semibold">Profit Earned:</span>
            <span className="font-bold text-green-600">₹{profit.toFixed(2)}</span>
          </div>
          <div className="text-lg flex justify-between items-center">
            <span className="font-semibold">Annualized ROI:</span>
            <span className="font-bold text-blue-600">{annualizedROI.toFixed(2)}%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default P2PLendingCalculator;
