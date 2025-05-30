
"use client";

import { useState, useEffect, use } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MOCK_COURSES, DEFAULT_MOCK_USER_PROFILE_TEMPLATE, isSubscriptionActive } from "@/lib/mock-data";
import type { Course, UserProfile, PersonalizedMission } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Award, BarChart, Briefcase, CheckCircle, Clock, Star, Zap, Target as TargetIcon, Lightbulb, Loader2, ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react';
import { PersonalizedChallengesDisplay } from '@/components/ai/personalized-challenges-display';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

// Define which courses are considered "main" or "featured"
const MAIN_COURSE_IDS = ['course-go-fundamentals', 'course-java-basics', 'course-python-beginners'];

function GamificationSummary({ user }: { user: UserProfile }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Experience Points</CardTitle>
          <Star className="h-5 w-5 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user.xp.toLocaleString()} XP</div>
          <p className="text-xs text-muted-foreground">Level {Math.floor(user.xp / 1000) + 1}</p>
        </CardContent>
      </Card>
      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
          <Zap className="h-5 w-5 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user.streaks} Days</div>
          <p className="text-xs text-muted-foreground">Keep it up!</p>
        </CardContent>
      </Card>
      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
          <Award className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user.badges.length}</div>
          <p className="text-xs text-muted-foreground">Collect them all</p>
        </CardContent>
      </Card>
    </div>
  );
}

function CourseCard({ course, userProfile, hasActiveSubscription }: { course: Course, userProfile: UserProfile, hasActiveSubscription: boolean }) {
  const isCompleted = userProfile.completedCourseIds.includes(course.id);
  const progress = isCompleted ? 100 : 0;

  let dataAiHint = `${course.tags.join(" ")} course thumbnail`;
  if (course.id === 'course-go-fundamentals') {
    dataAiHint = "go gopher mascot";
  } else if (course.id === 'course-java-basics') {
    dataAiHint = "java logo coffee";
  } else if (course.id === 'course-python-beginners') {
    dataAiHint = "python snake logo";
  }


  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col group">
      <Link href={`/courses/${course.id}`} passHref legacyBehavior>
        <a className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-t-lg flex flex-col flex-grow">
          <div className="relative h-48 w-full"> {/* Container for image */}
            <Image
              src={course.imageUrl}
              alt={course.title}
              layout="fill" 
              objectFit="cover" 
              className="group-hover:opacity-90 transition-opacity"
              data-ai-hint={dataAiHint}
            />
            {isCompleted && hasActiveSubscription && (
              <div className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full z-10">
                <CheckCircle className="h-5 w-5" />
              </div>
            )}
          </div>
          <div className="p-6 flex flex-col flex-grow"> {/* Mimicking CardContent padding */}
            <CardTitle className="text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors">{course.title}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow">
              {course.description}
            </CardDescription>
            <div className="flex items-center text-xs text-muted-foreground mt-auto"> {/* mt-auto pushes this to bottom of its container */}
              <Clock className="h-4 w-4 mr-1" /> {course.estimatedTime}
              <span className="mx-2">|</span>
              <BarChart className="h-4 w-4 mr-1" /> {course.difficulty}
            </div>
          </div>
        </a>
      </Link>
      {hasActiveSubscription && (
        <div className="px-6 pb-4 pt-2"> {/* Progress bar outside the link, but before footer */}
          <div className="w-full">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} aria-label={`${course.title} progress ${progress}%`} className="h-2" />
          </div>
        </div>
      )}
      <CardFooter className="p-6 pt-0 border-t"> 
        <Link href={`/courses/${course.id}`} passHref className="w-full">
          <Button className="w-full" variant={isCompleted ? "secondary" : "default"} disabled={!hasActiveSubscription}>
            {hasActiveSubscription ? (isCompleted ? "Review Course" : "Start Learning") : "View Details (Requires Subscription)"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [coursesToDisplay, setCoursesToDisplay] = useState<Course[]>([]);
  const [userHasActiveSubscription, setUserHasActiveSubscription] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const userEmail = localStorage.getItem('currentUserEmail');
    if (userEmail) {
      const userDataString = localStorage.getItem(`user_${userEmail}`);
      if (userDataString) {
        const loadedUser = JSON.parse(userDataString).profile;
        setUser(loadedUser);
        setUserHasActiveSubscription(isSubscriptionActive(loadedUser));
      } else if (userEmail === DEFAULT_MOCK_USER_PROFILE_TEMPLATE.email) {
         const defaultUser = DEFAULT_MOCK_USER_PROFILE_TEMPLATE;
         setUser(defaultUser);
         setUserHasActiveSubscription(isSubscriptionActive(defaultUser));
      }
    }
    
    const mainCourses = MOCK_COURSES.filter(course => MAIN_COURSE_IDS.includes(course.id));
    setCoursesToDisplay(mainCourses);

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user && user.subscriptionEndDate) {
      const endDate = new Date(user.subscriptionEndDate);
      const now = new Date();
      // Check if subscription is expired AND not currently considered active by isSubscriptionActive
      // This handles cases where isSubscriptionActive might be true due to just subscribing but page hasn't reloaded
      if (endDate < now && !isSubscriptionActive(user)) { 
        toast({
          title: "Subscription Expired",
          description: "Your access to courses and features is now limited. Please renew your subscription.",
          variant: "destructive",
          action: (
            <Button onClick={() => router.push('/subscription')} size="sm" className="bg-white hover:bg-gray-100 text-destructive-foreground">
              Renew Now
            </Button>
          ),
          duration: Infinity, 
        });
      }
    }
  }, [user, toast, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <p className="text-xl text-muted-foreground">Please log in to view your dashboard.</p>
         <Button asChild className="mt-4"><Link href="/auth">Go to Login</Link></Button>
      </div>
    );
  }
  
  const userSkillsForAI = Object.values(user.skillPoints || {}).map(s => `${s.name} Level ${s.level}`);
  const userWeakAreasForAI = user.email === DEFAULT_MOCK_USER_PROFILE_TEMPLATE.email ? ["Advanced Channel Patterns", "Error Handling Best Practices"] : ["Getting started with programming", "Basic syntax understanding"];


  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}!</h1>
        <p className="text-muted-foreground">Ready to conquer new language challenges today?</p>
      </section>

      <GamificationSummary user={user} />

      {!userHasActiveSubscription && (
        <Card className="bg-amber-500/10 border-amber-500 text-center shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-amber-700"><ShieldAlert /> Unlock Your Learning Potential!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-600 text-lg mb-4">
              An active subscription is required to access courses and track your progress.
            </p>
            <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white">
              <Link href="/subscription">Subscribe Now</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Featured Courses</h2>
          <Link href="/courses">
            <Button variant="outline">View All Courses</Button>
          </Link>
        </div>
        {coursesToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesToDisplay.map((course) => (
              <CourseCard key={course.id} course={course} userProfile={user} hasActiveSubscription={userHasActiveSubscription} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No featured courses available. <Link href="/courses" className="text-primary hover:underline">Explore all courses</Link>.</p>
        )}
      </section>
      
      {userHasActiveSubscription && (
        <>
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Lightbulb className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-semibold">Personalized Missions</h2>
            </div>
            <PersonalizedChallengesDisplay 
              userSkills={userSkillsForAI}
              weakAreas={userWeakAreasForAI}
            />
          </section>

          <section>
             <div className="flex items-center gap-2 mb-6">
              <TargetIcon className="h-6 w-6 text-secondary" />
              <h2 className="text-2xl font-semibold">Active Challenges</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">You have no active challenges. <Link href="/challenges" className="text-primary hover:underline">Explore challenges</Link>.</p>
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}


    