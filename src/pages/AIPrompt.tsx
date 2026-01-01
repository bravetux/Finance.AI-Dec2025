"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { showError, showSuccess } from "@/utils/toast";
import { saveAs } from "file-saver";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { gatherAllData } from "@/utils/dataUtils";
import useLocalStorage from "@/hooks/useLocalStorage";
import useSessionStorage from "@/hooks/useSessionStorage";

import { AISettings } from "../components/ai-prompt/AISettings";
import { ContextManagement } from "../components/ai-prompt/ContextManagement";
import { PromptForm } from "../components/ai-prompt/PromptForm";
import { ActionLog } from "../components/ai-prompt/ActionLog";
import { ResponseCard } from "../components/ai-prompt/ResponseCard";

type AIProvider = "openai" | "google" | "openrouter" | "ollama" | "perplexity";

const modelsByProvider: Record<AIProvider, string[]> = {
  openai: ["gpt-4-turbo", "gpt-4o", "gpt-3.5-turbo"],
  google: ["gemini-2.5-pro", "gemini-2.5-flash", "gemini-1.5-pro-latest", "gemini-1.5-flash-latest", "gemini-pro"],
  openrouter: [
    "x-ai/grok-4-fast:free", "nvidia/nemotron-nano-9b-v2:free", "deepseek/deepseek-r1:free",
    "google/gemma-3n-e2b-it:free", "openai/gpt-4o", "google/gemini-flash-1.5",
    "anthropic/claude-3-haiku", "meta-llama/llama-3-8b-instruct",
  ],
  ollama: ["llama3", "mistral", "gemma"],
  perplexity: ["llama-3-sonar-small-32k-online", "llama-3-sonar-large-32k-online", "llama-3-8b-instruct", "mixtral-8x7b-instruct"],
};

const AIPrompt: React.FC = () => {
  const [provider, setProvider] = useLocalStorage<AIProvider>("ai-provider", "openai");
  const [modelName, setModelName] = useLocalStorage<string>("ai-modelName", modelsByProvider.openai[0]);
  const [ollamaUrl, setOllamaUrl] = useLocalStorage<string>("ai-ollamaUrl", "http://localhost:11434");
  const [prompt, setPrompt] = useLocalStorage<string>("ai-prompt", "");
  const [responseFormat, setResponseFormat] = useLocalStorage<'text' | 'html' | 'pdf'>("ai-responseFormat", 'html');
  
  // SECURE: Use sessionStorage for sensitive keys so they are cleared when the tab/browser is closed
  const [apiKey, setApiKey] = useSessionStorage<string>("ai-apiKey", "");
  
  const [useManualModel, setUseManualModel] = useState(false);
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [uploadedData, setUploadedData] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const isInitialMount = useRef(true);

  // SECURE: Cleanup legacy plaintext keys from localStorage if they exist
  useEffect(() => {
    const legacyKey = localStorage.getItem("ai-apiKey");
    if (legacyKey) {
      // If we don't have a session key yet, migrate it once then wipe
      if (!apiKey && legacyKey !== '""') {
        try {
          const parsed = JSON.parse(legacyKey);
          if (parsed) setApiKey(parsed);
        } catch (e) {
          setApiKey(legacyKey);
        }
      }
      localStorage.removeItem("ai-apiKey");
      console.log("Cleanup: Legacy plaintext API key removed from permanent storage.");
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (provider && modelsByProvider[provider] && !useManualModel) {
      setModelName(modelsByProvider[provider][0]);
    }
  }, [provider, setModelName, useManualModel]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const getFormattedDateTime = () => {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(d.getDate())}${pad(d.getMonth() + 1)}${d.getFullYear()}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  };

  const handleSaveAsTxt = () => {
    if (!response) { showError("No response to save."); return; }
    const blob = new Blob([response], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `AIResponse_${getFormattedDateTime()}.txt`);
    showSuccess(`Response saved as TXT.`);
  };

  const handleExportPrompt = () => {
    if (!prompt) { showError("No prompt to export."); return; }
    const blob = new Blob([prompt], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `AIPrompt_${getFormattedDateTime()}.txt`);
    showSuccess(`Prompt exported.`);
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    addLog(`Reading file: ${file.name}...`);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        JSON.parse(content);
        setUploadedData(content);
        setUploadedFileName(file.name);
        addLog(`Successfully imported ${file.name}.`);
        showSuccess("File uploaded!");
      } catch (error) {
        showError('Invalid JSON file.');
        addLog(`ERROR: Failed to parse ${file.name}.`);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const clearUploadedFile = () => {
    setUploadedData(null);
    setUploadedFileName(null);
    addLog("Cleared uploaded file.");
  };

  const handleAnalyseResponse = () => {
    addLog("Analyzing response...");
    showSuccess("Analysis complete.");
  };

  const handleExportSettings = () => {
    // SECURE: Do NOT export the apiKey in the settings JSON
    const settings = { provider, modelName, ollamaUrl };
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    saveAs(blob, 'ai-provider-settings.json');
    showSuccess('Settings exported (API Key excluded for security)!');
    addLog('Exported AI settings.');
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    addLog(`Importing settings from ${file.name}...`);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const settings = JSON.parse(content);
        if (settings.provider && settings.modelName) {
          setProvider(settings.provider);
          // SECURE: We don't import API keys from files
          setModelName(settings.modelName);
          setOllamaUrl(settings.ollamaUrl || "http://localhost:11434");
          showSuccess("Settings imported!");
          addLog("Imported AI settings.");
        } else { throw new Error("Invalid settings file."); }
      } catch (error: any) {
        showError(`Failed to import: ${error.message}`);
        addLog(`ERROR: Failed to import settings.`);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleSaveAsHtml = () => {
    if (!response || !response.includes('<html')) { showError("Response is not a valid HTML report."); return; }
    const blob = new Blob([response], { type: "text/html;charset=utf-8" });
    saveAs(blob, `ai_report_${getFormattedDateTime()}.html`);
    showSuccess(`Report saved as HTML.`);
    addLog(`Exported HTML response.`);
  };

  const handleSaveAsPdf = async () => {
    if (!response || !response.includes('<html')) { showError("Response is not a valid HTML report for PDF conversion."); return; }
    addLog("Generating PDF...");
    const reportElement = document.createElement('div');
    reportElement.innerHTML = response;
    reportElement.style.position = 'absolute';
    reportElement.style.left = '-9999px';
    reportElement.style.width = '210mm';
    document.body.appendChild(reportElement);
    try {
      const canvas = await html2canvas(reportElement, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = pdfHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
      while (heightLeft > 0) {
        position -= pdf.internal.pageSize.getHeight();
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
      pdf.save(`ai_report_${getFormattedDateTime()}.pdf`);
      showSuccess(`Report saved as PDF.`);
      addLog(`Exported PDF report.`);
    } catch (error: any) {
      showError(`Failed to generate PDF: ${error.message}`);
      addLog(`ERROR: PDF generation failed.`);
    } finally {
      document.body.removeChild(reportElement);
    }
  };

  const handleChat = async () => {
    setLogs([]);
    addLog("Chat initiated.");
    if ((provider !== 'ollama' && !apiKey) || !modelName || !prompt) {
      showError("Please fill in all required fields.");
      addLog("ERROR: Missing required fields.");
      return;
    }
    setIsLoading(true);
    setResponse("");
    let textPrompt = uploadedData
      ? `Data from "${uploadedFileName}":\n${uploadedData}\n\nUser's Question:\n${prompt}`
      : prompt;
    if (responseFormat === 'html' || responseFormat === 'pdf') {
      textPrompt += "\n\nPlease format your response as a single, complete HTML document with inline CSS.";
    }
    try {
      let apiResponse = "";
      const headers: HeadersInit = { "Content-Type": "application/json" };
      let url = "";
      let body: any = {};
      switch (provider) {
        case "openai": case "perplexity":
          url = provider === "openai" ? "https://api.openai.com/v1/chat/completions" : "https://api.perplexity.ai/chat/completions";
          headers["Authorization"] = `Bearer ${apiKey}`;
          body = { model: modelName, messages: [{ role: "user", content: textPrompt }] };
          break;
        case "openrouter":
          url = "https://openrouter.ai/api/v1/chat/completions";
          headers["Authorization"] = `Bearer ${apiKey}`;
          body = { model: modelName, messages: [{ role: "user", content: textPrompt }] };
          break;
        case "google":
          url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
          body = { contents: [{ parts: [{ text: textPrompt }] }] };
          break;
        case "ollama":
          url = `${ollamaUrl}/api/chat`;
          body = { model: modelName, prompt: textPrompt, stream: false };
          break;
      }
      addLog(`Requesting ${url} with model ${modelName}...`);
      const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`API Error (${res.status}): ${errorData.error?.message || JSON.stringify(errorData)}`);
      }
      const data = await res.json();
      addLog("Response received.");
      switch (provider) {
        case "openai": case "openrouter": case "perplexity":
          apiResponse = data.choices[0]?.message?.content; break;
        case "google":
          apiResponse = data.candidates[0]?.content?.parts[0]?.text; break;
        case "ollama":
          apiResponse = data.message?.content; break;
      }
      if (!apiResponse) throw new Error("Could not parse a valid response.");
      setResponse(apiResponse);
      showSuccess("Received AI response!");
    } catch (error: any) {
      const errorMessage = `An error occurred: ${error.message}`;
      showError(errorMessage);
      setResponse(`Error: ${error.message}`);
      addLog(`ERROR: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseMyData = () => {
    addLog("Gathering application data...");
    const data = gatherAllData();
    if (data) {
      setUploadedData(JSON.stringify(data, null, 2));
      setUploadedFileName("My Financial Report.json");
      addLog("Loaded financial data as context.");
      showSuccess("Your financial data has been loaded.");
    } else {
      addLog("ERROR: Failed to gather data.");
      showError("Could not gather your financial data.");
    }
  };

  const toggleManualModel = () => setUseManualModel(!useManualModel);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2"><Bot className="h-8 w-8" />AI Financial Assistant</h1>

      <Card>
        <CardHeader>
          <CardTitle>Chat with your Financial Data</CardTitle>
          <CardDescription>Configure the AI, provide context, and ask a question to get insights.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <AISettings
            provider={provider} setProvider={setProvider}
            modelName={modelName} setModelName={setModelName}
            useManualModel={useManualModel} toggleManualModel={toggleManualModel}
            modelsByProvider={modelsByProvider}
            apiKey={apiKey} setApiKey={setApiKey}
            ollamaUrl={ollamaUrl} setOllamaUrl={setOllamaUrl}
            responseFormat={responseFormat} setResponseFormat={setResponseFormat}
          />
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-md p-3 text-xs text-amber-800 dark:text-amber-200">
            <strong>Security Note:</strong> API keys are now stored in <em>sessionStorage</em>. They will be automatically cleared when you close this tab. They are excluded from settings exports.
          </div>
          <ContextManagement
            handleUseMyData={handleUseMyData}
            handleFileImport={handleFileImport}
            uploadedFileName={uploadedFileName}
            clearUploadedFile={clearUploadedFile}
            handleExportSettings={handleExportSettings}
            handleImportSettings={handleImportSettings}
          />
          <PromptForm
            prompt={prompt} setPrompt={setPrompt}
            handleExportPrompt={handleExportPrompt}
            handleChat={handleChat}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <ActionLog logs={logs} />

      <ResponseCard
        isLoading={isLoading}
        response={response}
        responseFormat={responseFormat}
        handleAnalyseResponse={handleAnalyseResponse}
        handleSaveAsHtml={handleSaveAsHtml}
        handleSaveAsPdf={handleSaveAsPdf}
        handleSaveAsTxt={handleSaveAsTxt}
      />
    </div>
  );
};

export default AIPrompt;