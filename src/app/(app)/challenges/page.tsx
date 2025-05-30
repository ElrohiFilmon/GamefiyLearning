
"use client";

import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_CHALLENGES, DEFAULT_MOCK_USER_PROFILE_TEMPLATE, createInitialUserProfile } from "@/lib/mock-data";
import type { Challenge as ChallengeType, UserProfile } from "@/types";
import { Award, CheckCircle, Clock, Sparkles, Target as TargetIcon, Loader2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const allChallenges: ChallengeType[] = MOCK_CHALLENGES;

const getDifficultyColor = (difficulty: ChallengeType['difficulty']) => {
  switch (difficulty) {
    case 'Easy': return 'bg-green-500 hover:bg-green-600';
    case 'Medium': return 'bg-yellow-500 hover:bg-yellow-600';
    case 'Hard': return 'bg-red-500 hover:bg-red-600';
    default: return 'bg-gray-500 hover:bg-gray-600';
  }
};

function ChallengeCard({ 
  challenge, 
  userProfile,
  onCompleteChallenge 
}: { 
  challenge: ChallengeType, 
  userProfile: UserProfile | null,
  onCompleteChallenge: (challengeId: string, xpBonus: number) => void;
}) {
  const isCompleted = userProfile?.completedChallengeIds?.includes(challenge.id) || false;

  const handleCardClick = () => {
    if (userProfile && !isCompleted) {
      onCompleteChallenge(challenge.id, challenge.xpBonus);
    }
  };

  return (
    <Card 
      className={cn(
        "shadow-lg transition-shadow flex flex-col",
        !isCompleted && userProfile ? "hover:shadow-xl cursor-pointer" : "opacity-70",
        isCompleted && "bg-muted/50"
      )}
      onClick={handleCardClick}
      role={!isCompleted && userProfile ? "button" : undefined}
      tabIndex={!isCompleted && userProfile ? 0 : -1}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !isCompleted && userProfile) {
          handleCardClick();
        }
      }}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{challenge.title}</CardTitle>
          <Badge className={`${getDifficultyColor(challenge.difficulty)} text-white text-xs`}>{challenge.difficulty}</Badge>
        </div>
        <CardDescription className="text-sm line-clamp-3 h-[60px]">{challenge.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="flex items-center"><Sparkles className="h-4 w-4 mr-2 text-yellow-400" /> {challenge.xpBonus} XP Bonus</p>
          {challenge.badgeBonusId && (
            <p className="flex items-center"><Award className="h-4 w-4 mr-2 text-blue-500" /> Badge Reward</p>
          )}
          {challenge.relatedSkills && challenge.relatedSkills.length > 0 && (
            <p className="flex items-center"><TargetIcon className="h-4 w-4 mr-2 text-purple-500" /> Skills: {challenge.relatedSkills.join(', ')}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        {isCompleted ? (
          <div className="w-full text-center text-green-600 font-semibold flex items-center justify-center">
            <CheckCircle className="mr-2 h-5 w-5" /> Completed
          </div>
        ) : (
          <div className="w-full text-center text-primary">
            {userProfile ? "Click card to complete" : "Login to attempt"}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export default function ChallengesPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const userEmail = localStorage.getItem('currentUserEmail');
    if (userEmail) {
      const userDataString = localStorage.getItem(`user_${userEmail}`);
      if (userDataString) {
        setUser(JSON.parse(userDataString).profile);
      } else if (userEmail === DEFAULT_MOCK_USER_PROFILE_TEMPLATE.email) {
        setUser(DEFAULT_MOCK_USER_PROFILE_TEMPLATE);
      }
    }
    setIsLoading(false);
  }, []);

  const handleCompleteChallenge = (challengeId: string, xpBonus: number) => {
    if (!user) return;

    const userEmail = user.email;
    const userDataString = localStorage.getItem(`user_${userEmail}`);
    if (!userDataString) return;

    let userData = JSON.parse(userDataString);
    let updatedProfile = { ...userData.profile };

    updatedProfile.completedChallengeIds = [...(updatedProfile.completedChallengeIds || []), challengeId];
    updatedProfile.xp = (updatedProfile.xp || 0) + xpBonus;
    // Potentially add badge logic here if challenge.badgeBonusId exists

    userData.profile = updatedProfile;
    localStorage.setItem(`user_${userEmail}`, JSON.stringify(userData));
    setUser(updatedProfile); // Update local state to re-render

    toast({
      title: "Challenge Complete!",
      description: `You earned ${xpBonus} XP for "${allChallenges.find(c=>c.id === challengeId)?.title}".`,
    });
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Challenges...</p>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><TargetIcon className="h-8 w-8 text-primary" /> Challenges & Quests</h1>
          <p className="text-muted-foreground">
            Test your knowledge, earn rewards, and complete epic quests on your learning journey.
          </p>
        </div>
        <Card className="mt-8 bg-destructive/10 border-destructive/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldAlert /> Login Required</CardTitle>
                <CardDescription>Please log in to participate in challenges and save your progress.</CardDescription>
            </CardHeader>
            <CardFooter>
                <Button asChild variant="default">
                    <Link href="/auth">Login / Sign Up</Link>
                </Button>
            </CardFooter>
        </Card>
        <div className="text-center text-muted-foreground py-8">
            <p>Log in to see available challenges.</p>
        </div>
      </div>
    );
  }
  
  const dailyChallenges = allChallenges.filter(c => c.type === 'daily');
  const weeklyChallenges = allChallenges.filter(c => c.type === 'weekly');
  const specialChallenges = allChallenges.filter(c => c.type === 'special' || c.type === 'quest_step');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2"><TargetIcon className="h-8 w-8 text-primary" /> Challenges & Quests</h1>
        <p className="text-muted-foreground">
          Test your knowledge, earn rewards, and complete epic quests on your learning journey.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 md:w-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="special">Special</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="all">
            {allChallenges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allChallenges.map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} userProfile={user} onCompleteChallenge={handleCompleteChallenge} />)}
              </div>
            ) : <p className="text-muted-foreground text-center py-8">No challenges available right now.</p>}
          </TabsContent>
          <TabsContent value="daily">
             {dailyChallenges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dailyChallenges.map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} userProfile={user} onCompleteChallenge={handleCompleteChallenge} />)}
              </div>
            ) : <p className="text-muted-foreground text-center py-8">No daily challenges today. Check back tomorrow!</p>}
          </TabsContent>
          <TabsContent value="weekly">
            {weeklyChallenges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {weeklyChallenges.map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} userProfile={user} onCompleteChallenge={handleCompleteChallenge} />)}
              </div>
            ) : <p className="text-muted-foreground text-center py-8">No weekly challenges currently active.</p>}
          </TabsContent>
          <TabsContent value="special">
            {specialChallenges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specialChallenges.map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} userProfile={user} onCompleteChallenge={handleCompleteChallenge}/>)}
              </div>
            ) : <p className="text-muted-foreground text-center py-8">No special quests or events at this time.</p>}
          </TabsContent>
        </div>
      </Tabs>
      
      {user && (
        <Card className="mt-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="h-6 w-6 text-accent"/>AI Personalized Missions</CardTitle>
                <CardDescription>Looking for challenges tailored to your weak areas? Our AI can help!</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    Your AI assistant can suggest personalized missions based on your learning progress and areas you might want to improve. These missions are designed to help you focus and grow effectively.
                </p>
            </CardContent>
            <CardFooter>
                <Button asChild variant="default">
                    <Link href="/ai-assistant">
                        Get AI Missions
                    </Link>
                </Button>
            </CardFooter>
        </Card>
      )}
    </div>
  );
}
