import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";

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
          <Label htmlFor="providerSelect">AI Provider</Label>
          <Select onValueChange={setProvider} value={provider}>
            <SelectTrigger id="providerSelect">
              <SelectValue placeholder="Select a provider..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI / Other</SelectItem>
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="openrouter">Open Router</SelectItem>
              <SelectItem value="perplexity">Perplexity</SelectItem>
              <SelectItem value="ollama">Ollama (Local)</SelectItem>
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
          </div>
        ) : (
          <div>
            <Label htmlFor="apiKey">API Key</Label>
            <Input id="apiKey" type="password" placeholder="Enter your API key here" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
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