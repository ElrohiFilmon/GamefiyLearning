
"use client";

import { useState, useEffect, useTransition } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Sparkles, Target, Lightbulb } from 'lucide-react';
import { suggestPersonalizedChallenges, type SuggestPersonalizedChallengesInput, type SuggestPersonalizedChallengesOutput } from '@/ai/flows/suggest-personalized-challenges';
import { useToast } from "@/hooks/use-toast";

interface PersonalizedChallengesDisplayProps {
  userSkills: string[];
  weakAreas: string[];
  numberOfSuggestions?: number;
}

export function PersonalizedChallengesDisplay({
  userSkills,
  weakAreas,
  numberOfSuggestions = 3,
}: PersonalizedChallengesDisplayProps) {
  const [challenges, setChallenges] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const fetchChallenges = () => {
    setError(null);
    setChallenges(null);

    if (weakAreas.length === 0) {
        // Optionally, provide a default message or don't fetch if no weak areas
        // setChallenges(["Explore new topics or strengthen existing skills!"]);
        return;
    }

    startTransition(async () => {
      try {
        const input: SuggestPersonalizedChallengesInput = {
          userSkills,
          weakAreas,
          numberOfSuggestions,
        };
        const result: SuggestPersonalizedChallengesOutput = await suggestPersonalizedChallenges(input);
        if (result && result.challenges && result.challenges.length > 0) {
          setChallenges(result.challenges);
          toast({
            title: "Missions Updated!",
            description: "AI has suggested new challenges for you.",
          });
        } else {
          setChallenges([]); // Set to empty array to indicate no challenges were returned
           toast({
            title: "No New Missions",
            description: "AI couldn't find specific missions right now. Try again later or expand your skill profile!",
            variant: "default",
          });
        }
      } catch (e: any) {
        console.error("Error suggesting challenges:", e);
        let errorMessage = e.message || "An unexpected error occurred while fetching challenges.";
        if (typeof e.message === 'string' && e.message.includes("503 Service Unavailable")) {
          errorMessage = "The AI assistant is currently experiencing high demand. Please try refreshing in a few moments.";
        }
        setError(errorMessage);
        toast({
          title: "Error Fetching Missions",
          description: errorMessage,
          variant: "destructive",
        });
      }
    });
  };
  
  // Fetch challenges on initial mount if weak areas are present
  useEffect(() => {
    if (weakAreas && weakAreas.length > 0) {
        fetchChallenges();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(userSkills), JSON.stringify(weakAreas), numberOfSuggestions]); // Re-fetch if inputs change

  if (isPending && !challenges && !error) {
    return (
      <Card className="w-full shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            Loading Missions...
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">AI is crafting your challenges...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Sparkles className="h-4 w-4" />
        <AlertTitle>Error Fetching Challenges</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  if (!challenges && weakAreas.length === 0) {
    return (
      <Card className="w-full shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
             <Lightbulb className="h-5 w-5 text-accent" />
            Personalized Missions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Tell us more about your weak areas or skills you want to improve to get personalized missions!
          </p>
        </CardContent>
         <CardFooter>
          <Button onClick={fetchChallenges} disabled={isPending || weakAreas.length === 0}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Refresh Missions
          </Button>
        </CardFooter>
      </Card>
    )
  }


  if (!challenges || challenges.length === 0) {
    return (
      <Card className="w-full shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
             <Lightbulb className="h-5 w-5 text-accent" />
            Personalized Missions
          </CardTitle>
           <CardDescription>No specific missions from AI right now. Keep learning or try refreshing!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Explore existing <Link href="/challenges" className="text-primary hover:underline">challenges</Link> or <Link href="/courses" className="text-primary hover:underline">courses</Link>.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={fetchChallenges} disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Refresh Missions
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-accent" />
          Your AI-Suggested Missions
        </CardTitle>
        <CardDescription>
          Here are some challenges tailored to help you grow, based on your profile.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {challenges.map((challenge, index) => (
          <div key={index} className="p-4 border rounded-lg bg-background hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-primary mt-1 shrink-0" />
              <p className="text-sm">{challenge}</p>
            </div>
            <div className="mt-3 flex justify-end">
              <Button size="sm" variant="ghost">View Details</Button> 
              {/* This button would ideally link to the challenge or related content */}
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={fetchChallenges} disabled={isPending} variant="outline">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Suggest New Missions
        </Button>
      </CardFooter>
    </Card>
  );
}

// Add a Link component if not globally available
const Link = ({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) => (
  <a href={href} className={className}>{children}</a>
);
