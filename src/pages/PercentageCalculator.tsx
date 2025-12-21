"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Percent, RefreshCcw, Calculator } from "lucide-react";

const PercentageCalculator: React.FC = () => {
  // Scenario 1: What is X% of Y?
  const [s1X, setS1X] = useState("");
  const [s1Y, setS1Y] = useState("");
  const [s1Res, setS1Res] = useState<number | null>(null);

  // Scenario 2: What percent is X of Y?
  const [s2X, setS2X] = useState("");
  const [s2Y, setS2Y] = useState("");
  const [s2Res, setS2Res] = useState<number | null>(null);

  // Scenario 3: What percentage change from X to Y?
  const [s3X, setS3X] = useState("");
  const [s3Y, setS3Y] = useState("");
  const [s3Res, setS3Res] = useState<number | null>(null);

  // Scenario 4: X is Y% of what number?
  const [s4X, setS4X] = useState("");
  const [s4Y, setS4Y] = useState("");
  const [s4Res, setS4Res] = useState<number | null>(null);

  // Scenario 5: What is X with change of Y%?
  const [s5X, setS5X] = useState("");
  const [s5Y, setS5Y] = useState("");
  const [s5Res, setS5Res] = useState<number | null>(null);

  const calculateS1 = () => {
    const x = parseFloat(s1X);
    const y = parseFloat(s1Y);
    if (!isNaN(x) && !isNaN(y)) setS1Res((x / 100) * y);
  };

  const calculateS2 = () => {
    const x = parseFloat(s2X);
    const y = parseFloat(s2Y);
    if (!isNaN(x) && !isNaN(y) && y !== 0) setS2Res((x / y) * 100);
  };

  const calculateS3 = () => {
    const x = parseFloat(s3X);
    const y = parseFloat(s3Y);
    if (!isNaN(x) && !isNaN(y) && x !== 0) setS3Res(((y - x) / x) * 100);
  };

  const calculateS4 = () => {
    const x = parseFloat(s4X);
    const y = parseFloat(s4Y);
    if (!isNaN(x) && !isNaN(y) && y !== 0) setS4Res(x / (y / 100));
  };

  const calculateS5 = () => {
    const x = parseFloat(s5X);
    const y = parseFloat(s5Y);
    if (!isNaN(x) && !isNaN(y)) setS5Res(x * (1 + y / 100));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Percent className="h-8 w-8 text-primary" />
        Percentage Calculator
      </h1>

      <div className="grid gap-6">
        {/* Scenario 1 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">What is X% of Y?</CardTitle>
            <CardDescription className="text-xs font-mono">(X/100) * Y</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Input type="number" placeholder="X" value={s1X} onChange={(e) => setS1X(e.target.value)} className="w-24" />
                <Label>% of</Label>
                <Input type="number" placeholder="Y" value={s1Y} onChange={(e) => setS1Y(e.target.value)} className="w-32" />
              </div>
              <div className="flex gap-2">
                <Button onClick={calculateS1} size="sm"><Calculator className="mr-2 h-4 w-4" /> Calculate</Button>
                <Button variant="outline" size="sm" onClick={() => { setS1X(""); setS1Y(""); setS1Res(null); }}><RefreshCcw className="h-4 w-4" /></Button>
              </div>
              {s1Res !== null && (
                <div className="text-lg font-bold text-primary">Result: {s1Res.toLocaleString()}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Scenario 2 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">What percent is X of Y?</CardTitle>
            <CardDescription className="text-xs font-mono">(X/Y) * 100</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Input type="number" placeholder="X" value={s2X} onChange={(e) => setS2X(e.target.value)} className="w-24" />
                <Label>of</Label>
                <Input type="number" placeholder="Y" value={s2Y} onChange={(e) => setS2Y(e.target.value)} className="w-32" />
              </div>
              <div className="flex gap-2">
                <Button onClick={calculateS2} size="sm"><Calculator className="mr-2 h-4 w-4" /> Calculate</Button>
                <Button variant="outline" size="sm" onClick={() => { setS2X(""); setS2Y(""); setS2Res(null); }}><RefreshCcw className="h-4 w-4" /></Button>
              </div>
              {s2Res !== null && (
                <div className="text-lg font-bold text-primary">Result: {s2Res.toFixed(2)}%</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Scenario 3 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">What percentage change from X to Y?</CardTitle>
            <CardDescription className="text-xs font-mono">((Y-X)/X) * 100</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Label>From</Label>
                <Input type="number" placeholder="X" value={s3X} onChange={(e) => setS3X(e.target.value)} className="w-32" />
                <Label>to</Label>
                <Input type="number" placeholder="Y" value={s3Y} onChange={(e) => setS3Y(e.target.value)} className="w-32" />
              </div>
              <div className="flex gap-2">
                <Button onClick={calculateS3} size="sm"><Calculator className="mr-2 h-4 w-4" /> Calculate</Button>
                <Button variant="outline" size="sm" onClick={() => { setS3X(""); setS3Y(""); setS3Res(null); }}><RefreshCcw className="h-4 w-4" /></Button>
              </div>
              {s3Res !== null && (
                <div className={`text-lg font-bold ${s3Res >= 0 ? "text-green-600" : "text-red-600"}`}>
                  Result: {s3Res.toFixed(2)}%
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Scenario 4 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">X is Y% of what number?</CardTitle>
            <CardDescription className="text-xs font-mono">X / (Y/100)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Input type="number" placeholder="X" value={s4X} onChange={(e) => setS4X(e.target.value)} className="w-32" />
                <Label>is</Label>
                <Input type="number" placeholder="Y" value={s4Y} onChange={(e) => setS4Y(e.target.value)} className="w-24" />
                <Label>% of</Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={calculateS4} size="sm"><Calculator className="mr-2 h-4 w-4" /> Calculate</Button>
                <Button variant="outline" size="sm" onClick={() => { setS4X(""); setS4Y(""); setS4Res(null); }}><RefreshCcw className="h-4 w-4" /></Button>
              </div>
              {s4Res !== null && (
                <div className="text-lg font-bold text-primary">Result: {s4Res.toLocaleString()}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Scenario 5 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">What is X with change of Y%?</CardTitle>
            <CardDescription className="text-xs font-mono">X * (1 + Y/100)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Input type="number" placeholder="X" value={s5X} onChange={(e) => setS5X(e.target.value)} className="w-32" />
                <Label>with</Label>
                <Input type="number" placeholder="Y" value={s5Y} onChange={(e) => setS5Y(e.target.value)} className="w-24" />
                <Label>% change</Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={calculateS5} size="sm"><Calculator className="mr-2 h-4 w-4" /> Calculate</Button>
                <Button variant="outline" size="sm" onClick={() => { setS5X(""); setS5Y(""); setS5Res(null); }}><RefreshCcw className="h-4 w-4" /></Button>
              </div>
              {s5Res !== null && (
                <div className="text-lg font-bold text-primary">Result: {s5Res.toLocaleString()}</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PercentageCalculator;