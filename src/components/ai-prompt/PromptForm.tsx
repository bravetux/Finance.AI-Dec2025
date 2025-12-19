import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download, Sparkles } from "lucide-react";

interface PromptFormProps {
  prompt: string;
  setPrompt: (value: string) => void;
  handleExportPrompt: () => void;
  handleChat: () => void;
  isLoading: boolean;
}

export const PromptForm: React.FC<PromptFormProps> = ({
  prompt, setPrompt, handleExportPrompt, handleChat, isLoading
}) => {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-1">
          <Label htmlFor="prompt">Your Prompt</Label>
          {prompt && <Button variant="outline" size="sm" onClick={handleExportPrompt}><Download className="mr-2 h-4 w-4" />Export Prompt</Button>}
        </div>
        <Textarea id="prompt" placeholder="e.g., 'Based on my cashflow, what are the top 3 areas where I can cut costs?'" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4} />
      </div>

      <Button onClick={handleChat} disabled={isLoading}>
        {isLoading ? (<><Sparkles className="mr-2 h-4 w-4 animate-spin" />Thinking...</>) : (<><Sparkles className="mr-2 h-4 w-4" />Analyse with AI</>)}
      </Button>
    </div>
  );
};