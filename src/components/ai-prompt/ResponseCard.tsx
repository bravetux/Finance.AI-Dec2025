import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bot, Sparkles, Download } from "lucide-react";

interface ResponseCardProps {
  isLoading: boolean;
  response: string;
  responseFormat: 'text' | 'html' | 'pdf';
  handleAnalyseResponse: () => void;
  handleSaveAsHtml: () => void;
  handleSaveAsPdf: () => void;
  handleSaveAsTxt: () => void;
}

export const ResponseCard: React.FC<ResponseCardProps> = ({
  isLoading, response, responseFormat, handleAnalyseResponse,
  handleSaveAsHtml, handleSaveAsPdf, handleSaveAsTxt
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Response</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center space-x-2 text-muted-foreground"><Bot className="h-5 w-5 animate-pulse" /><span>The AI is analyzing your data...</span></div>
        ) : response ? (
          (responseFormat === 'html' || responseFormat === 'pdf') && response.includes('<html') ? (
            <iframe
              srcDoc={response}
              className="w-full h-96 border rounded-md"
              title="AI HTML Response"
              sandbox="allow-scripts"
            />
          ) : (
            <div className="prose dark:prose-invert max-w-full whitespace-pre-wrap"><p>{response}</p></div>
          )
        ) : (
          <div className="text-muted-foreground">The AI's response will appear here.</div>
        )}
      </CardContent>
      {response && !isLoading && (
        <CardFooter className="flex flex-wrap gap-2">
          <Button onClick={handleAnalyseResponse}>
            <Sparkles className="mr-2 h-4 w-4" />
            Analyse Response
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                <Download className="mr-2 h-4 w-4" />
                Save Report
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSaveAsHtml} disabled={!response.includes('<html')}>
                Save as HTML
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSaveAsPdf} disabled={!response.includes('<html')}>
                Save as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSaveAsTxt}>
                Save as TXT
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      )}
    </Card>
  );
};