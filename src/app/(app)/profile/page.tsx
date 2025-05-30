
"use client";

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge as UiBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MOCK_BADGES, MOCK_COURSES, DEFAULT_MOCK_USER_PROFILE_TEMPLATE, createInitialUserProfile } from "@/lib/mock-data";
import type { UserProfile, Badge as BadgeType, Course, SkillDetail, UserBadge } from "@/types";
import { Award, BarChart3, CalendarDays, CheckCircle, Edit3, Layers, Activity, Star, Zap, Loader2, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const userEmail = localStorage.getItem('currentUserEmail');
    if (userEmail) {
      const userDataString = localStorage.getItem(`user_${userEmail}`);
      if (userDataString) {
        const storedUserData = JSON.parse(userDataString);
        const profileWithHydratedBadges = {
          ...storedUserData.profile,
          badges: (storedUserData.profile.badges || []).map((badge: UserBadge) => {
            const mockBadge = MOCK_BADGES.find(mb => mb.id === badge.id);
            return {
              ...badge,
              icon: mockBadge ? mockBadge.icon : Star,
            };
          }),
          certificatesEarned: storedUserData.profile.certificatesEarned || [],
        };
        setUser(profileWithHydratedBadges);
      } else if (userEmail === DEFAULT_MOCK_USER_PROFILE_TEMPLATE.email) {
        const defaultProfileWithHydratedBadges = {
            ...DEFAULT_MOCK_USER_PROFILE_TEMPLATE,
            badges: DEFAULT_MOCK_USER_PROFILE_TEMPLATE.badges.map((badge: UserBadge) => {
                const mockBadge = MOCK_BADGES.find(mb => mb.id === badge.id);
                return {...badge, icon: mockBadge ? mockBadge.icon : Star };
            }),
            certificatesEarned: DEFAULT_MOCK_USER_PROFILE_TEMPLATE.certificatesEarned || [],
        };
        setUser(defaultProfileWithHydratedBadges);
      }
    }
    setIsLoading(false);
  }, []);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center">
        <p className="text-xl text-muted-foreground">User profile not found. Please ensure you are logged in.</p>
        <Button asChild className="mt-4">
          <Link href="/auth">Go to Login</Link>
        </Button>
      </div>
    );
  }

  const completedCourses = MOCK_COURSES.filter(course => (user.completedCourseIds || []).includes(course.id));
  const skills: SkillDetail[] = Object.values(user.skillPoints || {});
  const badges: UserBadge[] = user.badges || [];
  const certificates = user.certificatesEarned || [];


  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Card className="mb-8 shadow-xl">
        <CardHeader className="relative bg-gradient-to-br from-primary to-primary/70 p-8 rounded-t-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg" data-ai-hint="user avatar large">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="text-4xl">{user.initials || user.name.substring(0,2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-primary-foreground">{user.name}</h1>
              <p className="text-lg text-primary-foreground/80">{user.email}</p>
              <p className="text-sm text-primary-foreground/70 mt-1">Joined: {new Date(user.joinedDate).toLocaleDateString()}</p>
            </div>
            <Button variant="outline" size="icon" className="absolute top-4 right-4 bg-background/20 hover:bg-background/40 text-primary-foreground">
              <Edit3 className="h-5 w-5" />
              <span className="sr-only">Edit Profile</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {user.bio && <p className="text-muted-foreground mb-6">{user.bio}</p>}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-6">
            <div>
              <p className="text-2xl font-bold">{user.xp.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><Star className="h-4 w-4 text-yellow-400" /> XP</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{user.points.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><Activity className="h-4 w-4 text-green-500" /> Points</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{user.streaks}</p>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><Zap className="h-4 w-4 text-orange-500" /> Day Streak</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{completedCourses.length}</p>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><Layers className="h-4 w-4 text-blue-500" /> Courses</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Award className="h-6 w-6 text-primary" /> Badges Earned ({badges.length})</CardTitle>
              <CardDescription>Your collection of achievements and milestones.</CardDescription>
            </CardHeader>
            <CardContent>
              {badges.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {badges.map((badge) => {
                    const IconComponent = typeof badge.icon !== 'string' ? badge.icon : Star; 
                    return (
                      <div key={badge.id} title={`${badge.name}: ${badge.description}\nEarned: ${new Date(badge.earnedDate).toLocaleDateString()}`} className="flex flex-col items-center text-center p-3 border rounded-lg hover:shadow-md transition-shadow cursor-help">
                        {typeof badge.icon !== 'string' ? <IconComponent className={`h-12 w-12 mb-2 ${badge.grade === 'gold' ? 'text-yellow-500' : badge.grade === 'silver' ? 'text-gray-400' : badge.grade === 'bronze' ? 'text-orange-400' : 'text-primary'}`} />
                         : <Image src={badge.icon} alt={badge.name} width={48} height={48} className="mb-2" data-ai-hint={`${badge.name.toLowerCase()} badge icon`} />}
                        <p className="text-sm font-medium line-clamp-1">{badge.name}</p>
                        {badge.grade && <UiBadge variant="secondary" className="mt-1 capitalize text-xs">{badge.grade}</UiBadge>}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">No badges earned yet. Keep learning!</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Download className="h-6 w-6 text-green-600" /> Earned Certificates ({certificates.length})</CardTitle>
              <CardDescription>Your official course completion certificates.</CardDescription>
            </CardHeader>
            <CardContent>
              {certificates.length > 0 ? (
                <ul className="space-y-4">
                  {certificates.map((cert) => (
                    <li key={cert.courseId} className="flex items-center justify-between gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <p className="font-medium">{cert.courseName}</p>
                        <p className="text-xs text-muted-foreground">Earned: {new Date(cert.earnedDate).toLocaleDateString()}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={cert.certificateUrl || `/courses/${cert.courseId}/certificate`}>View Certificate <ExternalLink className="ml-2 h-3 w-3"/></Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No certificates earned yet. Complete courses and get certified!</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CheckCircle className="h-6 w-6 text-blue-600" /> Completed Courses ({completedCourses.length})</CardTitle>
              <CardDescription>Courses you have successfully finished.</CardDescription>
            </CardHeader>
            <CardContent>
              {completedCourses.length > 0 ? (
                <ul className="space-y-4">
                  {completedCourses.map((course) => (
                    <li key={course.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <Image src={course.imageUrl} alt={course.title} width={80} height={45} className="rounded-md object-cover" data-ai-hint={`${course.tags[0]} course thumbnail`} />
                      <div className="flex-1">
                        <Link href={`/courses/${course.id}`} className="font-medium hover:text-primary hover:underline">{course.title}</Link>
                        <p className="text-xs text-muted-foreground">{course.difficulty} &middot; {course.estimatedTime}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/courses/${course.id}`}>View Details</Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No courses completed yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
           <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart3 className="h-6 w-6 text-accent" /> Skill Levels</CardTitle>
              <CardDescription>Your proficiency in various skills.</CardDescription>
            </CardHeader>
            <CardContent>
              {skills.length > 0 ? (
                 <div className="space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium">{skill.name}</p>
                        <UiBadge variant="outline">{`Lvl ${skill.level}`}</UiBadge>
                      </div>
                      <Progress value={(skill.points % 1000) / 10} aria-label={`${skill.name} progress to next level`} className="h-2"/>
                      <p className="text-xs text-muted-foreground text-right mt-0.5">{skill.points % 1000} / 1000 XP to Lvl {skill.level + 1}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Skill data not available. Start learning to build your skills!</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Learning Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 flex items-center justify-center bg-muted/50 rounded-md">
                <Image src="https://placehold.co/300x150/A9CCE3/2C3E50.png?text=Activity+Chart" alt="Activity chart placeholder" width={300} height={150} data-ai-hint="learning activity graph" />
                <p className="text-muted-foreground sr-only">Activity chart coming soon!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

    