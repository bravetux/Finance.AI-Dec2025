"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calculator, LineChart } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const tools = [
    {
      title: "SIP Calculator",
      description: "Calculate the future value of your monthly investments.",
      icon: <Calculator className="w-8 h-8 text-blue-500" />,
      path: "/sip"
    },
    {
      title: "SWP Calculator",
      description: "Plan your systematic withdrawals and see how long your fund lasts.",
      icon: <LineChart className="w-8 h-8 text-green-500" />,
      path: "/swp"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Financial Planning Tools
          </h1>
          <p className="text-xl text-muted-foreground">
            Simple calculators to help you plan your investment journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <Card 
              key={tool.path}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(tool.path)}
            >
              <CardHeader className="flex flex-col items-center">
                <div className="p-3 bg-white rounded-full shadow-sm mb-4">
                  {tool.icon}
                </div>
                <CardTitle className="text-2xl">{tool.title}</CardTitle>
                <CardDescription className="text-center mt-2">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <button className="text-blue-600 font-semibold hover:underline">
                  Open Calculator →
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;