
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ShieldCheck, ShieldAlert, CreditCard, CalendarDays, CheckCircle } from "lucide-react";
import type { UserProfile } from '@/types';
import { DEFAULT_MOCK_USER_PROFILE_TEMPLATE, isSubscriptionActive, MONTHLY_SUBSCRIPTION_FEE_ETB } from '@/lib/mock-data';
import { PaymentModal } from '@/components/payment/payment-modal';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SubscriptionPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

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

  const handleSubscriptionPaymentSuccess = (transactionId: string) => {
    if (!user) return;

    const newSubscriptionEndDate = new Date();
    newSubscriptionEndDate.setDate(newSubscriptionEndDate.getDate() + 30);

    const updatedUserProfile: UserProfile = {
      ...user,
      subscriptionStatus: 'active',
      subscriptionEndDate: newSubscriptionEndDate.toISOString(),
    };

    const userEmail = localStorage.getItem('currentUserEmail');
    if (userEmail) {
      const authDataString = localStorage.getItem(`user_${userEmail}`);
      if (authDataString) {
        const authData = JSON.parse(authDataString);
        authData.profile = updatedUserProfile;
        localStorage.setItem(`user_${userEmail}`, JSON.stringify(authData));
        setUser(updatedUserProfile);
        toast({
          title: "Subscription Activated!",
          description: `Your monthly subscription is now active. Enjoy full access! Transaction ID: ${transactionId}`,
        });
        router.push('/dashboard'); 
      }
    }
    setShowPaymentModal(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Subscription Status...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center space-y-4">
        <Card className="max-w-md mx-auto bg-destructive/10 border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-center"><ShieldAlert /> Not Logged In</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive-foreground">
              Please log in to manage your subscription.
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

  const hasActiveSub = isSubscriptionActive(user);
  const isExpired = user.subscriptionEndDate && new Date(user.subscriptionEndDate) < new Date();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Manage Your Subscription</h1>
        <p className="text-muted-foreground">
          Access all courses and features with an active subscription.
        </p>
      </div>

      {hasActiveSub ? (
        <Card className="shadow-lg bg-green-500/10 border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <ShieldCheck className="h-7 w-7" />
              Subscription Active
            </CardTitle>
            <CardDescription className="text-green-600">
              You have full access to all learning materials.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-green-700" />
                <span>Renews on: {new Date(user.subscriptionEndDate!).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </p>
              <p className="text-sm text-green-600">
                Your learning journey continues uninterrupted!
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
                <Link href="/courses">Explore Courses</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="shadow-lg bg-amber-500/10 border-amber-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <ShieldAlert className="h-7 w-7" />
              Subscription Inactive
            </CardTitle>
            <CardDescription className="text-amber-600">
              {isExpired 
                ? "Your subscription has expired. Renew now to regain full access." 
                : "Subscribe now to unlock all courses and features."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6 bg-background rounded-lg border border-dashed border-amber-400">
                <h3 className="text-2xl font-semibold text-primary mb-2">Monthly Plan</h3>
                <p className="text-4xl font-bold text-foreground mb-1">
                    {MONTHLY_SUBSCRIPTION_FEE_ETB} <span className="text-lg font-normal text-muted-foreground">ETB/month</span>
                </p>
                <p className="text-muted-foreground mb-6">Full access to all current and future courses, AI assistant, and more.</p>
                 <ul className="text-left space-y-2 mb-6 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500"/> Access All Courses</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500"/> Unlimited AI Assistant Usage</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500"/> Earn Certificates (fee per certificate applies)</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500"/> Track Progress & Achievements</li>
                </ul>
                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => setShowPaymentModal(true)}
                >
                  <CreditCard className="mr-2 h-5 w-5" /> {isExpired ? "Renew Subscription" : "Subscribe Now"}
                </Button>
            </div>
             {isExpired && (
                <Alert variant="default" className="mt-6 bg-destructive/10 border-destructive/50 text-destructive-foreground">
                    <ShieldAlert className="h-4 w-4 text-destructive" />
                    <AlertTitle className="text-destructive">Subscription Expired!</AlertTitle>
                    <AlertDescription>
                        Your subscription ended on {new Date(user.subscriptionEndDate!).toLocaleDateString()}. 
                        Please renew to continue enjoying full access.
                    </AlertDescription>
                </Alert>
            )}
          </CardContent>
           <CardFooter className="text-xs text-muted-foreground text-center block">
              <p>Payments are processed securely via M-Pesa. You can manage your subscription anytime.</p>
           </CardFooter>
        </Card>
      )}

      {user && showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          itemName="Monthly Subscription"
          itemId="monthly_subscription_plan"
          amount={MONTHLY_SUBSCRIPTION_FEE_ETB}
          userEmail={user.email}
          onPaymentSuccess={handleSubscriptionPaymentSuccess}
        />
      )}
    </div>
  );
}
