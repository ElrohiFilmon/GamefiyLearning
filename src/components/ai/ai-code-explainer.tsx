
"use client";

import { useState, useTransition } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Sparkles, Terminal } from 'lucide-react';
import { explainCode, type ExplainCodeInput, type ExplainCodeOutput } from '@/ai/flows/ai-powered-code-explanation';
import { useToast } from "@/hooks/use-toast";

const programmingLanguages = [
  "Go", "JavaScript", "Python", "Java", "TypeScript", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Rust", "HTML", "CSS", "SQL", "Other"
];

export function AiCodeExplainer() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('Go');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setExplanation(null);

    if (!code.trim()) {
      setError("Please enter some code to explain.");
      return;
    }

    startTransition(async () => {
      try {
        const input: ExplainCodeInput = { code, programmingLanguage: language };
        const result: ExplainCodeOutput = await explainCode(input);
        if (result && result.explanation) {
          setExplanation(result.explanation);
           toast({
            title: "Explanation Generated!",
            description: "AI has provided an explanation for your code.",
          });
        } else {
          setError("Failed to get an explanation. The AI might be busy or the response was empty.");
          toast({
            title: "Error",
            description: "Could not generate explanation.",
            variant: "destructive",
          });
        }
      } catch (e: any) {
        console.error("Error explaining code:", e);
        setError(e.message || "An unexpected error occurred while fetching the explanation.");
        toast({
          title: "Error",
          description: e.message || "Failed to generate explanation.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          AI Code Explainer
        </CardTitle>
        <CardDescription>
          Paste your code snippet below and let our AI assistant explain it to you.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code-input">Code Snippet</Label>
            <Textarea
              id="code-input"
              placeholder="Enter your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={10}
              className="font-mono text-sm"
              aria-label="Code input area"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language-select">Programming Language (Optional)</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language-select" aria-label="Select programming language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {programmingLanguages.map((lang) => (
                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Explaining...
              </>
            ) : (
              "Explain Code"
            )}
          </Button>
        </CardFooter>
      </form>

      {error && (
        <div className="p-6 pt-0">
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {explanation && (
        <div className="p-6 pt-0">
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Explanation</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed bg-background p-4 rounded-md border">
                {explanation}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  );
}
