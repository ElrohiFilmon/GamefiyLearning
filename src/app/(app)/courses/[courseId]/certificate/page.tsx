
"use client";

import { useState, useEffect, use } from 'react'; // Added 'use'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_MOCK_USER_PROFILE_TEMPLATE, getCourseById, CHRIS_COMPLETER_PROFILE_TEMPLATE } from "@/lib/mock-data";
import type { UserProfile, Course } from "@/types";
import { Award, Printer, Share2, Download, Loader2, AlertCircle } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';

export default function CertificatePage({ params: paramsProp }: { params: { courseId: string } }) {
  const params = use(paramsProp as any); // Unwrap params using React.use()
  const [user, setUser] = useState<UserProfile | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [certificateData, setCertificateData] = useState<{
    courseName: string;
    userName: string;
    earnedDate: string;
  } | null>(null);

  useEffect(() => {
    const courseDetails = getCourseById(params.courseId); // Use unwrapped params
    setCourse(courseDetails || null);

    const userEmail = localStorage.getItem('currentUserEmail');
    if (userEmail) {
      const userDataString = localStorage.getItem(`user_${userEmail}`);
      let loadedUser: UserProfile | null = null;

      if (userDataString) {
        loadedUser = JSON.parse(userDataString).profile;
      } else if (userEmail === DEFAULT_MOCK_USER_PROFILE_TEMPLATE.email) {
        loadedUser = DEFAULT_MOCK_USER_PROFILE_TEMPLATE;
      } else if (userEmail === CHRIS_COMPLETER_PROFILE_TEMPLATE.email) {
        loadedUser = CHRIS_COMPLETER_PROFILE_TEMPLATE;
      }
      
      setUser(loadedUser);

      if (loadedUser && courseDetails) {
        const foundCertificate = loadedUser.certificatesEarned?.find(cert => cert.courseId === params.courseId); // Use unwrapped params
        if (foundCertificate) {
          setCertificateData({
            courseName: foundCertificate.courseName || courseDetails.title,
            userName: loadedUser.name,
            earnedDate: new Date(foundCertificate.earnedDate).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            }),
          });
        }
      }
    }
    setIsLoading(false);
  }, [params.courseId]); // Dependency on unwrapped params property

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Certificate...</p>
      </div>
    );
  }

  if (!user || !course || !certificateData) {
    return (
      <div className="p-8 text-center space-y-4">
        <Card className="max-w-md mx-auto bg-destructive/10 border-destructive">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-center"><AlertCircle /> Certificate Not Found</CardTitle>
            </CardHeader>
            <CardContent>
                 <p className="text-destructive-foreground">
                    We couldn't find a certificate for this course for your account.
                    Please ensure you have completed the course and the certificate payment has been processed.
                </p>
            </CardContent>
            <CardFooter className="flex justify-center">
                 <Button asChild variant="secondary">
                    <Link href={`/courses/${params.courseId}`}>Back to Course</Link>
                </Button>
            </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 print:p-0 bg-background print:bg-white">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-certificate, .printable-certificate * {
            visibility: visible;
          }
          .printable-certificate {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 20px; 
            box-shadow: none;
            border: none;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <Card className="max-w-4xl mx-auto shadow-2xl printable-certificate" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", backgroundColor: '#F7F3E9' /* Lighter, elegant beige */ }}>
        <CardContent className="p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full border-[12px] border-yellow-700/20 box-border pointer-events-none"></div>
          <div className="absolute top-3 left-3 w-[calc(100%-24px)] h-[calc(100%-24px)] border-2 border-yellow-800/40 box-border pointer-events-none"></div>


          <div className="text-center mb-8 pt-8">
            <div className="h-12 w-48 mx-auto mb-4 bg-center bg-no-repeat" style={{ backgroundImage: "url('https://placehold.co/200x50/B08D57/F7F3E9.png?text=Elegant+Ornament')", backgroundSize: 'contain' }} data-ai-hint="elegant certificate ornament top"></div>
            <h1 className="text-5xl font-bold text-yellow-900 tracking-wider" style={{ fontFamily: "'Trajan Pro', 'Georgia', serif" }}>Certificate</h1>
            <p className="text-xl text-yellow-800 mt-1">OF COMPLETION</p>
          </div>

          <div className="text-center text-lg text-yellow-950 leading-relaxed my-10 px-4">
            <p className="mb-4">This certificate is proudly presented to</p>
            <p className="text-3xl font-semibold text-yellow-800 underline decoration-yellow-800/50 underline-offset-8 my-6">
              {certificateData.userName}
            </p>
             <p className="mt-4">
              For successfully completing all requirements of the course:
            </p>
            <p className="text-2xl font-medium text-yellow-800 mt-2">
              {certificateData.courseName}
            </p>
          </div>
          
          <div className="flex justify-between items-end mt-16 mb-8 px-4 text-yellow-950">
            <div className="text-center">
               <Image src="https://placehold.co/100x100/DAA520/FFFFFF.png?text=Official+Seal" alt="Official Seal" width={80} height={80} className="mx-auto rounded-full border-2 border-yellow-700" data-ai-hint="official gold seal certificate"/>
               <p className="text-sm mt-1">Official Seal</p>
            </div>
            <div className="text-center">
              <Image src="https://placehold.co/150x50/000000/FFFFFF.png?text=Gamify+Language+Mastery&font=calibri" alt="Gamify Language Mastery" width={120} height={40} data-ai-hint="platform logo certificate"/>
            </div>
            <div className="text-center">
              <p className="border-b border-dotted border-yellow-900 pb-1 w-40 mb-1">{certificateData.earnedDate}</p>
              <p className="text-sm">Date Issued</p>
              <div className="mt-4 h-10 w-32 mx-auto bg-center bg-no-repeat" style={{ backgroundImage: "url('https://placehold.co/120x40/000000/F7F3E9.png?text=Dr.+Lingua+Franca&font=caveat')", backgroundSize: 'contain' }} data-ai-hint="instructor signature script"></div>
              <p className="text-sm border-t border-dotted border-yellow-900 pt-1 mt-1 w-40">Dr. Lingua Franca</p>
              <p className="text-xs">Chief Learning Officer</p>
            </div>
          </div>
           <div className="h-8 w-32 mx-auto mt-8 bg-center bg-no-repeat" style={{ backgroundImage: "url('https://placehold.co/120x30/B08D57/F7F3E9.png?text=Lower+Ornament')", backgroundSize: 'contain' }} data-ai-hint="elegant certificate ornament bottom"></div>
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-center gap-4 no-print">
        <Button onClick={handlePrint} size="lg">
          <Printer className="mr-2 h-5 w-5" /> Print Certificate
        </Button>
        <Button variant="outline" size="lg" disabled>
          <Share2 className="mr-2 h-5 w-5" /> Share (Coming Soon)
        </Button>
        <Button variant="outline" size="lg" asChild>
            <Link href="/profile">
                Back to Profile
            </Link>
        </Button>
      </div>
    </div>
  );
}

    
