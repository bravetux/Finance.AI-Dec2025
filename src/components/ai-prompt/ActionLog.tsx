import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal } from "lucide-react";

interface ActionLogProps {
  logs: string[];
}

export const ActionLog: React.FC<ActionLogProps> = ({ logs }) => {
  if (logs.length === 0) return null;

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Terminal className="h-5 w-5" />Action Log</CardTitle></CardHeader>
      <CardContent><pre className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">{logs.join('\n')}</pre></CardContent>
    </Card>
  );
};