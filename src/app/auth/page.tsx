
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, User as UserIcon, Rocket } from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { createInitialUserProfile, DEFAULT_MOCK_USER_PROFILE_TEMPLATE, CHRIS_COMPLETER_PROFILE_TEMPLATE } from '@/lib/mock-data';
import type { UserProfile } from '@/types';
import { AccessibilitySettings } from '@/types';

const MOCK_PASSWORD_ALEX = "password123";
const MOCK_PASSWORD_CHRIS = "password456";

const defaultAccessibilitySettings: AccessibilitySettings = {
  fontSize: 'medium',
  contrastMode: 'default',
  reduceMotion: false,
  dyslexiaFriendlyFont: false,
};


export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Sign In States
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up States
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();

    // Special handling for Alex Nova if not in localStorage
    if (signInEmail === DEFAULT_MOCK_USER_PROFILE_TEMPLATE.email && !localStorage.getItem(`user_${signInEmail}`)) {
      localStorage.setItem(`user_${signInEmail}`, JSON.stringify({ profile: DEFAULT_MOCK_USER_PROFILE_TEMPLATE, password: MOCK_PASSWORD_ALEX }));
      if (!localStorage.getItem(`accessibilitySettings_${signInEmail}`)){
        localStorage.setItem(`accessibilitySettings_${signInEmail}`, JSON.stringify(defaultAccessibilitySettings));
      }
    }
    // Special handling for Chris Completer if not in localStorage
    if (signInEmail === CHRIS_COMPLETER_PROFILE_TEMPLATE.email && !localStorage.getItem(`user_${signInEmail}`)) {
      localStorage.setItem(`user_${signInEmail}`, JSON.stringify({ profile: CHRIS_COMPLETER_PROFILE_TEMPLATE, password: MOCK_PASSWORD_CHRIS }));
      if (!localStorage.getItem(`accessibilitySettings_${signInEmail}`)){
        localStorage.setItem(`accessibilitySettings_${signInEmail}`, JSON.stringify(defaultAccessibilitySettings));
      }
    }

    const userDataString = localStorage.getItem(`user_${signInEmail}`);
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      if (userData.password === signInPassword) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUserEmail', signInEmail);
        toast({
          title: "Sign In Successful",
          description: `Welcome back, ${userData.profile.name.split(' ')[0]}!`,
        });
        // Redirect to subscription page if subscription is inactive, otherwise dashboard
        if (userData.profile.subscriptionStatus === 'inactive') {
          router.push('/subscription');
        } else {
          router.push('/dashboard');
        }
      } else {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('currentUserEmail');
        toast({
          title: "Sign In Failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
      }
    } else {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('currentUserEmail');
      toast({
        title: "Sign In Failed",
        description: "User not found. Please sign up.",
        variant: "destructive",
      });
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpPassword !== signUpConfirmPassword) {
      toast({
        title: "Sign Up Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (localStorage.getItem(`user_${signUpEmail}`)) {
      toast({
        title: "Sign Up Error",
        description: "An account with this email already exists. Please sign in.",
        variant: "destructive",
      });
      return;
    }

    const newUserProfile = createInitialUserProfile(signUpName, signUpEmail);
    const userAuthData = {
      profile: newUserProfile,
      password: signUpPassword,
    };

    localStorage.setItem(`user_${signUpEmail}`, JSON.stringify(userAuthData));
    localStorage.setItem(`accessibilitySettings_${signUpEmail}`, JSON.stringify(defaultAccessibilitySettings));
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUserEmail', signUpEmail);

    toast({
      title: "Sign Up Successful!",
      description: `Welcome, ${signUpName.split(' ')[0]}! Your learning journey begins now. Please subscribe to access courses.`,
    });
    router.push('/subscription'); // Redirect new users to subscription page
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6 flex justify-center">
            <Link href="/" aria-label="Go to homepage">
              <Rocket className="h-16 w-16 text-primary" />
            </Link>
          </div>
          <CardTitle className="text-3xl font-bold">Gamify Language Mastery</CardTitle>
          <CardDescription>
            Sign in or create an account to continue your learning odyssey.
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue="signin" className="w-full" onValueChange={() => {
          setSignInEmail(''); setSignInPassword('');
          setSignUpName(''); setSignUpEmail(''); setSignUpPassword(''); setSignUpConfirmPassword('');
        }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Sign In Tab */}
          <TabsContent value="signin">
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email Address</Label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-2">
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
                 <p className="text-xs text-muted-foreground text-center">
                    Demo users: <br/>
                    {DEFAULT_MOCK_USER_PROFILE_TEMPLATE.email} / {MOCK_PASSWORD_ALEX} <br/>
                    {CHRIS_COMPLETER_PROFILE_TEMPLATE.email} / {MOCK_PASSWORD_CHRIS}
                 </p>
                <Button variant="link" size="sm" className="text-sm text-muted-foreground hover:text-primary" asChild>
                  <Link href="#">Forgot your password?</Link>
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup">
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative flex items-center">
                    <UserIcon className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Your Full Name"
                      required
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email Address</Label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Create Password</Label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Choose a strong password"
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      required
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-2">
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
                <p className="px-6 text-center text-xs text-muted-foreground">
                  By creating an account, you agree to our{" "}
                  <Link href="#" className="underline hover:text-primary">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="underline hover:text-primary">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
         <div className="p-6 text-center text-sm text-muted-foreground border-t mt-2">
            <p>Explore the galaxy of language learning!</p>
        </div>
      </Card>
    </div>
  );
}
