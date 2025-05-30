
"use client";

import { useState, useEffect, use } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MOCK_COURSES, DEFAULT_MOCK_USER_PROFILE_TEMPLATE, isSubscriptionActive } from "@/lib/mock-data";
import type { Course, UserProfile } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Clock, BarChart, Filter, CheckCircle, Loader2, ShieldAlert, ChevronLeft, ChevronRight } from "lucide-react";
import { SearchBar } from '@/components/shared/search-bar'; 

const allCourses: Course[] = MOCK_COURSES;

function CourseListItem({ course, userProfile, hasActiveSubscription }: { course: Course, userProfile: UserProfile | null, hasActiveSubscription: boolean }) {
  let progress = 0;
  let isCompleted = false;

  if (userProfile && hasActiveSubscription) {
    isCompleted = userProfile.completedCourseIds.includes(course.id);
    progress = isCompleted ? 100 : 0; 
  }

  let dataAiHint = `${course.tags.join(" ")} education language ${course.title.split(" ")[0]}`;
  if (course.id === 'course-go-fundamentals') {
    dataAiHint = "go gopher mascot";
  } else if (course.id === 'course-java-basics') {
    dataAiHint = "java logo coffee";
  } else if (course.id === 'course-python-beginners') {
    dataAiHint = "python snake logo";
  }

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row group">
      <div className="md:w-1/3 relative">
        <Link href={`/courses/${course.id}`} passHref legacyBehavior>
          <a className="block w-full h-48 md:h-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
            <Image
              src={course.imageUrl}
              alt={course.title}
              layout="fill"
              objectFit="cover"
              className="group-hover:opacity-90 transition-opacity"
              data-ai-hint={dataAiHint}
            />
            {isCompleted && hasActiveSubscription && (
              <div className="absolute top-2 right-2 bg-green-500 text-white p-1.5 rounded-full shadow-md z-10">
                <CheckCircle className="h-5 w-5" />
              </div>
            )}
          </a>
        </Link>
      </div>
      <div className="md:w-2/3 flex flex-col">
        <div className="p-6 flex-grow flex flex-col"> {/* Main text content area */}
          <Link href={`/courses/${course.id}`} passHref legacyBehavior>
            <a className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded-md flex-grow flex flex-col">
              <CardTitle className="text-xl mb-1 group-hover:text-primary transition-colors">{course.title}</CardTitle>
              <div className="flex items-center text-xs text-muted-foreground space-x-3 mb-2">
                <span><Clock className="h-3 w-3 mr-1 inline-block" /> {course.estimatedTime}</span>
                <span><BarChart className="h-3 w-3 mr-1 inline-block" /> {course.difficulty}</span>
              </div>
              <CardDescription className="text-sm text-muted-foreground line-clamp-3 mb-3 flex-grow">
                {course.longDescription || course.description}
              </CardDescription>
            </a>
          </Link>
          {userProfile && hasActiveSubscription && (
            <div className="mt-auto pt-2"> {/* Progress bar at the bottom of the text content area */}
                <Progress value={progress} aria-label={`${course.title} progress ${progress}%`} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{progress}% complete</p>
            </div>
          )}
        </div>
        <CardFooter className="p-6 pt-4 border-t md:border-t-0 md:border-l md:mt-0 mt-auto">
          <Link href={`/courses/${course.id}`} passHref className="w-full md:w-auto">
            <Button className="w-full md:w-auto" variant={isCompleted ? "secondary" : "default"} disabled={!userProfile || !hasActiveSubscription}>
                {isCompleted ? "Review Course" : "View Details"}
            </Button>
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
}


export default function CoursesPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userHasActiveSubscription, setUserHasActiveSubscription] = useState(false);


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
    setIsLoading(false);
  }, []);

  const filteredCourses = allCourses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.longDescription && course.longDescription.toLowerCase().includes(searchTerm.toLowerCase())) ||
    course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Courses...</p>
      </div>
    );
  }
  
  if (!user) {
     return (
        <div className="p-8 text-center space-y-4">
            <Card className="max-w-md mx-auto bg-destructive/10 border-destructive">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 justify-center"><ShieldAlert /> Login Required</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-destructive-foreground">
                        Please log in to view courses.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button asChild variant="default">
                        <Link href="/auth">Login / Sign Up</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
  }

  if (!userHasActiveSubscription) {
    return (
        <div className="p-8 text-center space-y-4">
            <Card className="max-w-md mx-auto bg-amber-500/10 border-amber-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 justify-center"><ShieldAlert className="text-amber-600" /> Subscription Required</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-amber-700">
                        You need an active subscription to browse and enroll in courses.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button asChild variant="default" className="bg-amber-600 hover:bg-amber-700">
                        <Link href="/subscription">Subscribe Now</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="bg-card border rounded-lg p-6 shadow">
        <h1 className="text-3xl font-bold mb-2">Explore Courses</h1>
        <p className="text-muted-foreground mb-6">
          Find the perfect course to expand your skills, from beginner fundamentals to advanced topics in Go, Java, Python, and more.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <SearchBar 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search courses (e.g., Go, Java, Python, Web Apps)"
            className="flex-grow"
          />
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </section>

      {filteredCourses.length > 0 ? (
        <div className="space-y-6">
          {filteredCourses.map((course) => (
            <CourseListItem key={course.id} course={course} userProfile={user} hasActiveSubscription={userHasActiveSubscription} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground text-lg">
                {searchTerm ? `No courses found for "${searchTerm}". Try a different search.` : "No courses available at the moment. Check back soon!"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


    