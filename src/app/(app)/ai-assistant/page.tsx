
"use client";

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AiCodeExplainer } from "@/components/ai/ai-code-explainer";
import { PersonalizedChallengesDisplay } from "@/components/ai/personalized-challenges-display";
import { DEFAULT_MOCK_USER_PROFILE_TEMPLATE } from "@/lib/mock-data"; // For props fallback
import type { UserProfile } from '@/types';
import { Lightbulb, Code, Loader2 } from "lucide-react";

export default function AiAssistantPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userEmail = localStorage.getItem('currentUserEmail');
    if (userEmail) {
      const userDataString = localStorage.getItem(`user_${userEmail}`);
      if (userDataString) {
        setUser(JSON.parse(userDataString).profile);
      } else if (userEmail === DEFAULT_MOCK_USER_PROFILE_TEMPLATE.email) {
        setUser(DEFAULT_MOCK_USER_PROFILE_TEMPLATE); // Fallback for mock user
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading AI Assistant...</p>
      </div>
    );
  }

  // Fallback to default mock if user isn't loaded, to prevent PersonalizedChallengesDisplay from erroring
  const profileForAI = user || DEFAULT_MOCK_USER_PROFILE_TEMPLATE; 
  const userSkills = Object.values(profileForAI.skillPoints || {}).map(s => `${s.name} Level ${s.level}`);
  // Mock weak areas or derive them if possible from user profile
  const weakAreas = profileForAI.email === DEFAULT_MOCK_USER_PROFILE_TEMPLATE.email ? ["Error Handling in Go", "Advanced Concurrency Patterns"] : ["Getting Started with Go", "Understanding Basic Syntax"];


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">AI Learning Assistant</h1>
        <p className="text-muted-foreground">
          Your personal AI tutor to help you understand code and suggest learning paths.
        </p>
      </div>

      <Tabs defaultValue="code-explainer" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="code-explainer">
            <Code className="mr-2 h-4 w-4" /> Code Explainer
          </TabsTrigger>
          <TabsTrigger value="personalized-missions">
            <Lightbulb className="mr-2 h-4 w-4" /> Personalized Missions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="code-explainer" className="mt-6">
          <AiCodeExplainer />
        </TabsContent>
        <TabsContent value="personalized-missions" className="mt-6">
          <PersonalizedChallengesDisplay 
            userSkills={userSkills} 
            weakAreas={weakAreas} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

    