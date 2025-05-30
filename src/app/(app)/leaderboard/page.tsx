
"use client";

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEFAULT_MOCK_USER_PROFILE_TEMPLATE } from "@/lib/mock-data";
import type { LeaderboardEntry, UserProfile } from "@/types";
import { Award, Star, Trophy, Zap, Loader2 } from "lucide-react";

const getRankColor = (rank: number) => {
  if (rank === 1) return "text-yellow-400";
  if (rank === 2) return "text-gray-400";
  if (rank === 3) return "text-orange-400";
  return "text-foreground";
};

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const activeUserEmail = localStorage.getItem('currentUserEmail');
    setCurrentUserEmail(activeUserEmail);

    const allUserKeys = Object.keys(localStorage).filter(key => key.startsWith('user_'));
    const entries: UserProfile[] = [];

    allUserKeys.forEach(key => {
      const userDataString = localStorage.getItem(key);
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          if (userData.profile) { // Ensure profile exists
            entries.push(userData.profile);
          }
        } catch (error) {
          console.error(`Error parsing user data for key ${key}:`, error);
        }
      }
    });
    
    // Add default mock user if they aren't in localStorage (e.g. first load before login)
    // but only if they are the "current user" or if no other users exist, to populate initially
    if (activeUserEmail === DEFAULT_MOCK_USER_PROFILE_TEMPLATE.email && !entries.find(e => e.email === DEFAULT_MOCK_USER_PROFILE_TEMPLATE.email)) {
        entries.push(DEFAULT_MOCK_USER_PROFILE_TEMPLATE);
    } else if (entries.length === 0 && allUserKeys.length === 0){ // If localStorage is truly empty
        entries.push(DEFAULT_MOCK_USER_PROFILE_TEMPLATE); // Show at least one entry
    }


    const sortedEntries = entries
      .sort((a, b) => (b.xp || 0) - (a.xp || 0))
      .map((userProfile, index) => ({
        userId: userProfile.id,
        userName: userProfile.name,
        userAvatarUrl: userProfile.avatarUrl,
        xp: userProfile.xp || 0,
        rank: index + 1,
        badgesCount: (userProfile.badges || []).length,
      }));
    
    setLeaderboardData(sortedEntries);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2"><Trophy className="h-8 w-8 text-primary" /> Leaderboards</h1>
        <p className="text-muted-foreground">
          See how you stack up against other learners in Gamify Language Mastery!
        </p>
      </div>

      <Tabs defaultValue="global-xp" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 md:w-auto">
          <TabsTrigger value="global-xp">Global XP</TabsTrigger>
          <TabsTrigger value="course-specific">Course Champions</TabsTrigger>
          <TabsTrigger value="weekly-streak">Weekly Streaks</TabsTrigger>
        </TabsList>

        <TabsContent value="global-xp" className="mt-6">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Top Galaxy Voyagers (XP)</CardTitle>
              <CardDescription>Highest experience points across all courses and activities.</CardDescription>
            </CardHeader>
            <CardContent>
              {leaderboardData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Rank</TableHead>
                      <TableHead>Learner</TableHead>
                      <TableHead className="text-right">XP</TableHead>
                      <TableHead className="text-right hidden sm:table-cell">Badges</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboardData.map((entry) => (
                      <TableRow key={entry.userId} className={entry.userId === currentUserEmail || (DEFAULT_MOCK_USER_PROFILE_TEMPLATE.email === currentUserEmail && entry.userId === DEFAULT_MOCK_USER_PROFILE_TEMPLATE.id) ? "bg-primary/10" : ""}>
                        <TableCell className={`font-medium text-lg ${getRankColor(entry.rank)}`}>
                          {entry.rank <=3 && <Trophy className={`inline-block h-5 w-5 mr-1 ${getRankColor(entry.rank)}`} />}
                          {entry.rank}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9" data-ai-hint="user avatar small">
                              <AvatarImage src={entry.userAvatarUrl} alt={entry.userName} />
                              <AvatarFallback>{entry.userName.substring(0,2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                              {entry.userName} 
                              {(entry.userId === currentUserEmail || (DEFAULT_MOCK_USER_PROFILE_TEMPLATE.email === currentUserEmail && entry.userId === DEFAULT_MOCK_USER_PROFILE_TEMPLATE.id)) && " (You)"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          <Star className="h-4 w-4 inline-block mr-1 text-yellow-400" />
                          {entry.xp.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right hidden sm:table-cell">
                           <Award className="h-4 w-4 inline-block mr-1 text-blue-500" />
                          {entry.badgesCount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-8">Leaderboard is empty. Be the first to shine!</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="course-specific" className="mt-6">
           <Card>
            <CardHeader>
              <CardTitle>Course Champions</CardTitle>
              <CardDescription>Top performers in specific courses (coming soon).</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-10">
              <p className="text-muted-foreground">This leaderboard is under construction. Check back later!</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="weekly-streak" className="mt-6">
           <Card>
            <CardHeader>
              <CardTitle>Weekly Streak Stars</CardTitle>
              <CardDescription>Learners with the longest active streaks this week (coming soon).</CardDescription>
            </CardHeader>
             <CardContent className="text-center py-10">
              <p className="text-muted-foreground">This leaderboard is under construction. Check back later!</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
