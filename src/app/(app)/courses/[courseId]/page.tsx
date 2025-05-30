
"use client";

import { useState, useEffect, use } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"; // Added CardFooter
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getCourseById, DEFAULT_MOCK_USER_PROFILE_TEMPLATE, MOCK_BADGES, isSubscriptionActive } from "@/lib/mock-data";
import type { Course as CourseType, Module as ModuleType, Lesson as LessonType, UserProfile } from "@/types";
import { CheckCircle, Clock, BarChart, BookOpen, ChevronRight, Zap, PlayCircle, FileText, Puzzle, Loader2, Award as AwardIcon, DollarSign, Download, ShieldAlert } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PaymentModal } from '@/components/payment/payment-modal';
import { useToast } from '@/hooks/use-toast';

export default function CoursePage({ params: paramsProp }: { params: { courseId: string } }) {
  const params = use(paramsProp as any); // Unwrap params
  const [course, setCourse] = useState<CourseType | undefined>(undefined);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { toast } = useToast();
  const [userHasActiveSubscription, setUserHasActiveSubscription] = useState(false);

  useEffect(() => {
    setCourse(getCourseById(params.courseId));
    
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
    setIsLoading(false);
  }, [params.courseId]);

  const handlePaymentSuccess = (transactionId: string) => {
    if (!user || !course) return;

    const updatedCertificates = [
      ...(user.certificatesEarned || []),
      {
        courseId: course.id,
        courseName: course.title,
        earnedDate: new Date().toISOString(),
        transactionId: transactionId,
        certificateUrl: `/courses/${course.id}/certificate`
      }
    ];
    
    const updatedUserProfile: UserProfile = {
      ...user,
      certificatesEarned: updatedCertificates,
    };
    
    const userEmail = localStorage.getItem('currentUserEmail');
    if (userEmail) {
      const authDataString = localStorage.getItem(`user_${userEmail}`);
      if (authDataString) {
        const authData = JSON.parse(authDataString);
        authData.profile = updatedUserProfile;
        localStorage.setItem(`user_${userEmail}`, JSON.stringify(authData));
        setUser(updatedUserProfile); 
        toast({ title: "Payment Successful!", description: `Certificate for ${course.title} is now available.`});
      }
    }
    setShowPaymentModal(false);
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Course Details...</p>
      </div>
    );
  }

  if (!course) {
    return <div className="p-8 text-center">Course not found.</div>;
  }

  if (!user || !userHasActiveSubscription) {
    return (
        <div className="p-8 text-center space-y-4">
            <Card className="max-w-md mx-auto bg-destructive/10 border-destructive">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 justify-center"><ShieldAlert />Subscription Required</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-destructive-foreground">
                        You need an active subscription to access course details and content.
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-center gap-2">
                    <Button asChild variant="default">
                        <Link href="/subscription">Subscribe Now</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/courses">Explore Other Courses</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
  }

  const isCourseCompletedByUser = user ? user.completedCourseIds.includes(course.id) : false;
  const userProgress = isCourseCompletedByUser ? 100 : 0; 
  
  const badgeOnCompletion = course.badgeOnCompletionId ? MOCK_BADGES.find(b => b.id === course.badgeOnCompletionId) : null;
  const hasCertificate = user && user.certificatesEarned?.some(cert => cert.courseId === course.id);

  const getLessonIcon = (type: LessonType['type']) => {
    switch (type) {
      case 'video': return <PlayCircle className="h-5 w-5 text-secondary" />;
      case 'text': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'quiz': return <Puzzle className="h-5 w-5 text-orange-500" />;
      case 'interactive_code': return <Zap className="h-5 w-5 text-purple-500" />;
      default: return <BookOpen className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const firstLessonId = course.modules[0]?.lessons[0]?.id || 'start';

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden shadow-xl">
        <div className="relative">
          <Image
            src={course.imageUrl}
            alt={course.title}
            width={1200}
            height={400}
            className="object-cover w-full h-48 md:h-64"
            data-ai-hint={`${course.tags.join(" ")} hero banner`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{course.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-200">
              <span><Clock className="h-4 w-4 mr-1 inline-block" /> {course.estimatedTime}</span>
              <span><BarChart className="h-4 w-4 mr-1 inline-block" /> {course.difficulty}</span>
            </div>
          </div>
        </div>
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <CardDescription className="text-base mb-4">{course.longDescription || course.description}</CardDescription>
              <div className="flex flex-wrap gap-2 mb-4">
                {course.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
              </div>
            </div>
            <div className="w-full md:w-auto mt-4 md:mt-0 md:ml-6 shrink-0 space-y-2">
               <Link href={`/courses/${params.courseId}/lessons/${firstLessonId}`} passHref>
                <Button size="lg" className="w-full md:w-auto" disabled={!user || !userHasActiveSubscription}>
                  {isCourseCompletedByUser ? "Review Course" : (course.modules && course.modules.length > 0 && course.modules[0].lessons.length > 0 ? "Start Course" : "Content Coming Soon")}
                </Button>
              </Link>
              {user && isCourseCompletedByUser && !hasCertificate && course.certificateFee && userHasActiveSubscription && (
                <Button size="lg" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => setShowPaymentModal(true)}>
                  <DollarSign className="mr-2 h-5 w-5" /> Get Certificate ({course.certificateFee} ETB)
                </Button>
              )}
              {user && hasCertificate && (
                 <Link href={`/courses/${params.courseId}/certificate`} passHref>
                    <Button size="lg" variant="outline" className="w-full md:w-auto">
                        <Download className="mr-2 h-5 w-5" /> View Certificate
                    </Button>
                 </Link>
              )}
              {!user && <p className="text-xs text-muted-foreground mt-2 text-center md:text-left">Login to start courses and track progress.</p>}
            </div>
          </div>

          {user && userHasActiveSubscription && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>Overall Progress</span>
                <span>{userProgress}%</span>
              </div>
              <Progress value={userProgress} aria-label={`${course.title} progress ${userProgress}%`} className="h-3" />
            </div>
          )}

          {badgeOnCompletion && userHasActiveSubscription && (
            <Card className="bg-muted/30 mb-6">
              <CardHeader className="flex flex-row items-center gap-3 p-4">
                {typeof badgeOnCompletion.icon !== 'string' ? <badgeOnCompletion.icon className="h-10 w-10 text-accent" /> : <Image src={badgeOnCompletion.icon} alt={badgeOnCompletion.name} width={40} height={40} data-ai-hint="badge icon small"/>}
                <div>
                  <CardTitle className="text-lg">Completion Reward</CardTitle>
                  <CardDescription>Earn the "{badgeOnCompletion.name}" badge!</CardDescription>
                </div>
              </CardHeader>
            </Card>
          )}
        </CardContent>
      </Card>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
        {userHasActiveSubscription && course.modules && course.modules.length > 0 ? (
          <div className="space-y-6">
            {course.modules.map((module: ModuleType, moduleIndex) => (
              <Card key={module.id} className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">Module {moduleIndex + 1}: {module.title}</CardTitle>
                  {module.description && <CardDescription>{module.description}</CardDescription>}
                </CardHeader>
                <CardContent>
                  {module.lessons && module.lessons.length > 0 ? (
                    <ul className="space-y-3">
                      {module.lessons.map((lesson: LessonType, lessonIndex) => {
                        const isLessonAccessible = !!user && userHasActiveSubscription; 
                        return (
                          <li key={lesson.id}>
                            <Link href={isLessonAccessible ? `/courses/${params.courseId}/lessons/${lesson.id}` : '#'}
                                  className={`flex items-center justify-between p-3 -mx-3 rounded-lg ${isLessonAccessible ? 'hover:bg-muted/50' : 'opacity-70 cursor-not-allowed'} transition-colors group`}>
                              <div className="flex items-center gap-3">
                                {getLessonIcon(lesson.type)}
                                <div>
                                  <span className={`font-medium ${isLessonAccessible ? 'group-hover:text-primary': ''}`}>Lesson {lessonIndex + 1}: {lesson.title}</span>
                                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> {lesson.estimatedTime}
                                    <span className="mx-1">|</span>
                                    {lesson.xpValue} XP
                                  </p>
                                </div>
                              </div>
                              <ChevronRight className={`h-5 w-5 text-muted-foreground ${isLessonAccessible ? 'group-hover:text-primary' : ''}`} />
                            </Link>
                            {lessonIndex < module.lessons.length -1 && <Separator className="my-1"/>}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No lessons in this module yet.</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            {userHasActiveSubscription ? "Course content is being prepared. Check back soon!" : "Subscribe to access course content."}
          </p>
        )}
         {!user && <p className="text-muted-foreground mt-4 text-center">Please <Link href="/auth" className="text-primary hover:underline">log in</Link> to access course content and track your progress.</p>}
      </section>
      {user && userHasActiveSubscription && course && course.certificateFee && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          itemName={course.title + " Certificate"}
          itemId={course.id + "_certificate"}
          amount={course.certificateFee}
          userEmail={user.email}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
