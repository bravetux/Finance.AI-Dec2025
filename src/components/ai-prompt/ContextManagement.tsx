import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Download, X, Upload } from "lucide-react";

interface ContextManagementProps {
  handleUseMyData: () => void;
  handleFileImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploadedFileName: string | null;
  clearUploadedFile: () => void;
  handleExportSettings: () => void;
  handleImportSettings: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ContextManagement: React.FC<ContextManagementProps> = ({
  handleUseMyData, handleFileImport, uploadedFileName, clearUploadedFile,
  handleExportSettings, handleImportSettings
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Context File (JSON)</Label>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleUseMyData} className="flex-grow">
            <Sparkles className="mr-2 h-4 w-4" /> Use My Data
          </Button>
          <Button variant="outline" asChild className="flex-grow">
            <Label htmlFor="import-file" className="cursor-pointer w-full flex items-center justify-center">
              <Download className="mr-2 h-4 w-4" /> Choose File
              <Input id="import-file" type="file" accept=".json" className="hidden" onChange={handleFileImport} />
            </Label>
          </Button>
          {uploadedFileName && (
            <Button variant="ghost" size="icon" onClick={clearUploadedFile}><X className="h-4 w-4" /></Button>
          )}
        </div>
        {uploadedFileName && (
          <p className="text-sm text-muted-foreground mt-2">Using file: <span className="font-medium text-primary">{uploadedFileName}</span></p>
        )}
      </div>

      <div className="flex items-center justify-between rounded-md border p-3">
        <p className="font-semibold text-sm">Settings Management</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportSettings}>
            <Upload className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Label htmlFor="import-settings-file" className="cursor-pointer flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Import
              <Input id="import-settings-file" type="file" accept=".json" className="hidden" onChange={handleImportSettings} />
            </Label>
          </Button>
        </div>
      </div>
    </div>
  );
};