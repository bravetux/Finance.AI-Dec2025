import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Edit3, ShieldAlert, Trash2, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type AIProvider = "openai" | "google" | "openrouter" | "ollama" | "perplexity";

interface AISettingsProps {
  provider: AIProvider;
  setProvider: (value: AIProvider) => void;
  modelName: string;
  setModelName: (value: string) => void;
  useManualModel: boolean;
  toggleManualModel: () => void;
  modelsByProvider: Record<AIProvider, string[]>;
  apiKey: string;
  setApiKey: (value: string) => void;
  ollamaUrl: string;
  setOllamaUrl: (value: string) => void;
  responseFormat: 'text' | 'html' | 'pdf';
  setResponseFormat: (value: 'text' | 'html' | 'pdf') => void;
}

export const AISettings: React.FC<AISettingsProps> = ({
  provider,
  setProvider,
  modelName,
  setModelName,
  useManualModel,
  toggleManualModel,
  modelsByProvider,
  apiKey,
  setApiKey,
  ollamaUrl,
  setOllamaUrl,
  responseFormat,
  setResponseFormat
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Provider Select */}
        <div>
          <Label htmlFor="providerSelect" className="flex items-center gap-2">
            AI Provider
            {provider !== 'ollama' && (
               <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ShieldAlert className="h-3 w-3 text-amber-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-[10px]">Cloud providers require sensitive API keys which are risky to store in a browser. Use Ollama for 100% privacy.</p>
                    </TooltipContent>
                  </Tooltip>
               </TooltipProvider>
            )}
          </Label>
          <Select onValueChange={setProvider} value={provider}>
            <SelectTrigger id="providerSelect">
              <SelectValue placeholder="Select a provider..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ollama">Ollama (Privacy First - Recommended)</SelectItem>
              <SelectItem value="openai">OpenAI / Other</SelectItem>
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="openrouter">Open Router</SelectItem>
              <SelectItem value="perplexity">Perplexity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Model Name Input/Select */}
        <div>
          <Label htmlFor="modelNameInput">Model Name</Label>
          <div className="flex gap-2">
            {useManualModel ? (
              <Input
                id="modelNameInput"
                placeholder="Enter model name"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
              />
            ) : (
              <Select
                value={modelName}
                onValueChange={(value) => {
                  if (provider === 'openrouter' && value === 'custom') {
                    toggleManualModel();
                    setModelName('');
                  } else {
                    setModelName(value);
                  }
                }}
              >
                <SelectTrigger id="modelNameSelect">
                  <SelectValue placeholder="Select a model..." />
                </SelectTrigger>
                <SelectContent>
                  {modelsByProvider[provider]?.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                  {provider === 'openrouter' && <SelectItem value="custom">Custom Model</SelectItem>}
                </SelectContent>
              </Select>
            )}
            <Button variant="outline" size="icon" onClick={toggleManualModel} title={useManualModel ? "Use predefined models" : "Enter model name manually"}>
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* API Key / Ollama URL */}
        {provider === 'ollama' ? (
          <div>
            <Label htmlFor="ollamaUrl">Ollama URL</Label>
            <Input id="ollamaUrl" placeholder="http://localhost:11434" value={ollamaUrl} onChange={(e) => setOllamaUrl(e.target.value)} />
            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
              <Info className="h-3 w-3" /> No data leaves your machine with local providers.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label htmlFor="apiKey">API Key</Label>
              {apiKey && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setApiKey("")}
                  className="h-6 text-[10px] text-destructive hover:text-destructive hover:bg-destructive/10 px-2"
                >
                  <Trash2 className="h-3 w-3 mr-1" /> Wipe Key from Memory
                </Button>
              )}
            </div>
            <Input id="apiKey" type="password" placeholder="Enter your API key here" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            <p className="text-[10px] text-destructive font-semibold flex items-center gap-1">
                <ShieldAlert className="h-3 w-3" /> WARNING: Paste at your own risk. Browser storage is vulnerable to theft.
            </p>
          </div>
        )}

        {/* Response Format */}
        <div>
          <Label htmlFor="responseFormat">Response Format</Label>
          <Select onValueChange={setResponseFormat} value={responseFormat}>
            <SelectTrigger id="responseFormat">
              <SelectValue placeholder="Select response format..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Plain Text</SelectItem>
              <SelectItem value="html">HTML Report</SelectItem>
              <SelectItem value="pdf">PDF Report</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};