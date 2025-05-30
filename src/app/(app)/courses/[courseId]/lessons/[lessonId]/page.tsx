
"use client";

import { useState, useEffect, use } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getCourseById, DEFAULT_MOCK_USER_PROFILE_TEMPLATE, MOCK_BADGES, MOCK_COURSES, createInitialUserProfile, isSubscriptionActive } from "@/lib/mock-data";
import type { Lesson as LessonType, Course as CourseType, UserProfile, UserBadge } from "@/types";
import { ArrowLeft, ArrowRight, CheckCircle, PlayCircle, FileText, Puzzle, Zap, Eye, Clock, Loader2, ShieldAlert, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AiCodeExplainer } from "@/components/ai/ai-code-explainer";
import { useToast } from '@/hooks/use-toast';

const getLessonDetailsFromAllCourses = (courseId: string, lessonId: string): { lesson: LessonType | undefined, moduleIndex: number, lessonIndexInModule: number, prevLesson: LessonType | null, nextLesson: LessonType | null, course: CourseType | undefined } => {
  const course = getCourseById(courseId);
  if (!course) return { lesson: undefined, moduleIndex: -1, lessonIndexInModule: -1, prevLesson: null, nextLesson: null, course: undefined };

  let foundLesson: LessonType | undefined;
  let moduleIndex = -1;
  let lessonIndexInModule = -1;
  let prevLesson: LessonType | null = null;
  let nextLesson: LessonType | null = null;
  
  let allLessonsInOrder: LessonType[] = [];
  course.modules.forEach(m => allLessonsInOrder.push(...m.lessons));
  
  const currentLessonGlobalIndex = allLessonsInOrder.findIndex(l => l.id === lessonId);
  if (currentLessonGlobalIndex !== -1) {
    foundLesson = allLessonsInOrder[currentLessonGlobalIndex];
    if (currentLessonGlobalIndex > 0) {
      prevLesson = allLessonsInOrder[currentLessonGlobalIndex - 1];
    }
    if (currentLessonGlobalIndex < allLessonsInOrder.length - 1) {
      nextLesson = allLessonsInOrder[currentLessonGlobalIndex + 1];
    }

    for (let i = 0; i < course.modules.length; i++) {
        const mod = course.modules[i];
        const lIdx = mod.lessons.findIndex(l => l.id === lessonId);
        if (lIdx !== -1) {
            moduleIndex = i;
            lessonIndexInModule = lIdx;
            break;
        }
    }
  }
  
  return { lesson: foundLesson, moduleIndex, lessonIndexInModule, prevLesson, nextLesson, course };
};


export default function LessonPage({ params: paramsProp }: { params: { courseId: string, lessonId: string } }) {
  const params = use(paramsProp as any);
  const router = useRouter();
  const [lessonDetails, setLessonDetails] = useState<{ lesson: LessonType | undefined, moduleIndex: number, lessonIndexInModule: number, prevLesson: LessonType | null, nextLesson: LessonType | null, course: CourseType | undefined } | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [lessonProgress, setLessonProgress] = useState(0); 
  const [userHasActiveSubscription, setUserHasActiveSubscription] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setLessonDetails(getLessonDetailsFromAllCourses(params.courseId, params.lessonId)); 
    
    const userEmail = localStorage.getItem('currentUserEmail');
    if (userEmail) {
      const userDataString = localStorage.getItem(`user_${userEmail}`);
      if (userDataString) {
        const loadedUser = JSON.parse(userDataString).profile;
        setUser(loadedUser);
        setUserHasActiveSubscription(isSubscriptionActive(loadedUser));
        // Check if this specific lesson is completed for this user
        // This logic for determining if a lesson is completed is very simplified.
        // In a real app, you'd track individual lesson completions.
        const courseCompleted = loadedUser.completedCourseIds.includes(params.courseId); 
        const lessonActuallyCompleted = courseCompleted || (Math.random() > 0.7 && !courseCompleted); // Simplified
        setIsLessonCompleted(lessonActuallyCompleted);
        setLessonProgress(lessonActuallyCompleted ? 100 : Math.floor(Math.random() * 80) + 10);
      } else if (userEmail === DEFAULT_MOCK_USER_PROFILE_TEMPLATE.email) {
         const defaultUser = DEFAULT_MOCK_USER_PROFILE_TEMPLATE;
         setUser(defaultUser);
         setUserHasActiveSubscription(isSubscriptionActive(defaultUser));
         const isDefaultUserCourseCompleted = defaultUser.completedCourseIds.includes(params.courseId); 
         const defaultUserLessonCompleted = isDefaultUserCourseCompleted || Math.random() > 0.7;
         setIsLessonCompleted(defaultUserLessonCompleted);
         setLessonProgress(defaultUserLessonCompleted ? 100 : Math.floor(Math.random() * 80) + 10);
      }
    } else {
        // If no user logged in, redirect to auth, they shouldn't be here.
        router.push('/auth');
    }
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.courseId, params.lessonId, router]); // Removed isLessonCompleted from deps to avoid loops

  const handleMarkAsCompleted = () => {
    if (!user || !lessonDetails?.lesson || !lessonDetails?.course) return;

    const userEmail = localStorage.getItem('currentUserEmail');
    if (!userEmail) return;

    let userData = JSON.parse(localStorage.getItem(`user_${userEmail}`) || '{}');
    let userProfile = userData.profile || createInitialUserProfile(user.name, user.email, user.id);
    
    userProfile.xp = Number(userProfile.xp || 0);
    userProfile.points = Number(userProfile.points || 0);
    userProfile.badges = userProfile.badges || [];
    userProfile.completedCourseIds = userProfile.completedCourseIds || [];
    
    userProfile.xp += lessonDetails.lesson.xpValue;
    userProfile.points += Math.floor(lessonDetails.lesson.xpValue / 10); 
    
    const { course, nextLesson } = lessonDetails;
    if (!nextLesson) { 
        if (!userProfile.completedCourseIds.includes(course.id)) {
            userProfile.completedCourseIds.push(course.id);
            toast({ title: "Course Completed!", description: `You've finished ${course.title} and earned ${lessonDetails.lesson.xpValue} XP!`});

            if (course.badgeOnCompletionId) {
                const badgeToAward = MOCK_BADGES.find(b => b.id === course.badgeOnCompletionId);
                if (badgeToAward && !userProfile.badges.find((ub: UserBadge) => ub.id === badgeToAward.id)) {
                    userProfile.badges.push({ ...badgeToAward, earnedDate: new Date().toISOString() });
                    toast({ title: "Badge Earned!", description: `You've earned the "${badgeToAward.name}" badge!` });
                }
            }
        }
    } else {
       toast({ title: "Lesson Completed!", description: `You've earned ${lessonDetails.lesson.xpValue} XP!`});
    }

    userData.profile = userProfile;
    localStorage.setItem(`user_${userEmail}`, JSON.stringify(userData));
    setUser(userProfile); 
    setIsLessonCompleted(true);
    setLessonProgress(100);
  };


  if (isLoading || !lessonDetails) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Lesson...</p>
      </div>
    );
  }

  if (!user || !userHasActiveSubscription) {
     return (
        <div className="p-8 text-center space-y-4">
            <Card className="max-w-md mx-auto bg-destructive/10 border-destructive">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 justify-center"><ShieldAlert /> Subscription Required</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-destructive-foreground">
                        An active subscription is required to access lessons.
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-center gap-2">
                    <Button asChild variant="default">
                        <Link href="/subscription">Subscribe Now</Link>
                    </Button>
                    <Button asChild variant="secondary">
                        <Link href={`/courses/${params.courseId}`}>Back to Course</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
  }

  const { lesson, prevLesson, nextLesson, course } = lessonDetails;

  if (!lesson || !course) {
    return (
      <div className="p-8 text-center">
        <Alert variant="destructive">
          <FileText className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Lesson or course not found. Please check the URL or navigate back.</AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link href={`/courses/${params.courseId}`}>Back to Course</Link>
        </Button>
      </div>
    );
  }

  const renderLessonContent = () => {
    switch (lesson.type) {
      case 'video':
        const isYouTubeUrl = lesson.content.includes('youtube.com/watch') || lesson.content.includes('youtu.be/');
        return (
          <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center p-4 text-center">
            <PlayCircle className="h-16 w-16 text-primary mb-4" />
            <p className="text-lg font-semibold mb-2">Video Lesson: {lesson.title}</p>
            {isYouTubeUrl ? (
              <Button asChild>
                <a href={lesson.content} target="_blank" rel="noopener noreferrer">
                  Watch on YouTube <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            ) : (
              <p className="text-muted-foreground">Video content: {lesson.content}</p>
            )}
            {!isLessonCompleted && user && (
                 <Button size="sm" className="mt-6 bg-green-600 hover:bg-green-700" onClick={handleMarkAsCompleted}>
                    <CheckCircle className="mr-2 h-4 w-4" /> Mark as Watched & Complete
                </Button>
            )}
          </div>
        );
      case 'text':
        return (
          <div>
            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content || "<p>This lesson content is primarily text-based. Read through the material carefully.</p>" }} />
            {!isLessonCompleted && user && (
              <Button size="lg" className="mt-6 bg-green-600 hover:bg-green-700" onClick={handleMarkAsCompleted}>
                <CheckCircle className="mr-2 h-5 w-5" /> Mark as Read & Complete
              </Button>
            )}
          </div>
        );
      case 'quiz':
        return (
          <Card className="bg-secondary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Puzzle className="h-6 w-6 text-secondary"/>Quiz Time!</CardTitle>
              <CardDescription>Test your knowledge from this lesson.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Interactive quiz elements will appear here.</p>
              <div className="space-y-4">
                <p><strong>Question 1:</strong> What is a goroutine?</p>
                <Button variant="outline">Option A</Button> <Button variant="outline">Option B</Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleMarkAsCompleted} disabled={!user || isLessonCompleted}>Submit Quiz & Complete</Button>
            </CardFooter>
          </Card>
        );
      case 'interactive_code':
        return (
          <div>
            <p className="mb-4 text-muted-foreground">Engage with the code directly. Try modifying it and see the results!</p>
            <AiCodeExplainer />
            <Button onClick={handleMarkAsCompleted} disabled={!user || isLessonCompleted} className="mt-4">Complete Interactive Session</Button>
          </div>
        );
      default:
        return <p>Unsupported lesson type.</p>;
    }
  };


  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <Link href={`/courses/${params.courseId}`} className="text-sm text-primary hover:underline mb-2 inline-block">
            &larr; Back to {course.title}
          </Link>
          <CardTitle className="text-3xl">{lesson.title}</CardTitle>
          <CardDescription className="flex items-center gap-4 text-sm">
            <span><Clock className="h-4 w-4 mr-1 inline-block" /> {lesson.estimatedTime}</span>
            <span><Zap className="h-4 w-4 mr-1 inline-block" /> {lesson.xpValue} XP</span>
            {isLessonCompleted && <span className="flex items-center text-green-600"><CheckCircle className="h-4 w-4 mr-1 inline-block" /> Completed</span>}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {user && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Lesson Progress</span>
                <span>{lessonProgress}%</span>
              </div>
              <Progress value={lessonProgress} aria-label={`Lesson progress ${lessonProgress}%`} className="h-2" />
            </div>
          )}
          
          {renderLessonContent()}
           {!user && <p className="text-muted-foreground mt-4 text-center">Please <Link href="/auth" className="text-primary hover:underline">log in</Link> to save your progress.</p>}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {prevLesson ? (
            <Button variant="outline" asChild disabled={!user}>
              <Link href={`/courses/${params.courseId}/lessons/${prevLesson.id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Link>
            </Button>
          ) : <div className="w-[120px]" />} {/* Placeholder for spacing */}
          
          {!isLessonCompleted && user && lesson.type !== 'video' && lesson.type !== 'text' && ( // Moved general complete button here
            <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={handleMarkAsCompleted}>
              <CheckCircle className="mr-2 h-5 w-5" /> Mark as Completed
            </Button>
          )}
           {isLessonCompleted && user && (
            <Button size="lg" variant="secondary" disabled>
              <CheckCircle className="mr-2 h-5 w-5" /> Completed
            </Button>
          )}

          {nextLesson ? (
            <Button variant="outline" asChild disabled={!user}>
              <Link href={`/courses/${params.courseId}/lessons/${nextLesson.id}`}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : <div className="w-[120px]" />} {/* Placeholder for spacing */}
        </CardFooter>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5 text-primary" /> Focus Mode Assistant</CardTitle>
          <CardDescription>Need help with code in this lesson? Use the AI explainer.</CardDescription>
        </CardHeader>
        <CardContent>
           <AiCodeExplainer />
        </CardContent>
      </Card>
    </div>
  );
}
