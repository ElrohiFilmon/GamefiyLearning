
"use client";

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';
import { processMpesaPayment } from '@/services/paymentService';
import { useToast } from '@/hooks/use-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string; // Generic item name (e.g., course name or "Monthly Subscription")
  itemId: string; // Generic item ID (e.g., courseId or "monthly_subscription")
  amount: number; // Amount in ETB
  userEmail: string;
  onPaymentSuccess: (transactionId: string) => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  itemName,
  itemId,
  amount,
  userEmail,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!phoneNumber.trim()) {
      setError("Please enter your M-Pesa phone number.");
      return;
    }
    setError(null);
    setIsProcessing(true);

    try {
      const result = await processMpesaPayment(userEmail, itemId, itemName, amount, phoneNumber);
      if (result.success && result.transactionId) {
        toast({
          title: "Payment Initiated",
          description: "Please check your phone to complete the M-Pesa payment.",
        });
        // Simulate waiting for M-Pesa callback / STK push confirmation
        setTimeout(() => {
            onPaymentSuccess(result.transactionId!);
            toast({
                title: "Payment Confirmed!",
                description: `Successfully paid ETB ${amount} for ${itemName}.`,
                variant: "default",
            });
            onClose(); // Close modal on success
        }, 3000); // Simulate M-Pesa processing time
      } else {
        setError(result.message || "Payment failed. Please try again.");
        toast({
          title: "Payment Failed",
          description: result.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred during payment.");
      toast({
        title: "Payment Error",
        description: e.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setPhoneNumber('');
      setError(null);
      setIsProcessing(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            Complete Payment
          </DialogTitle>
          <DialogDescription>
            Pay {amount} ETB for "{itemName}" using M-Pesa.
            An STK push will be sent to your phone.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone-number" className="text-right col-span-1">
              M-Pesa No.
            </Label>
            <Input
              id="phone-number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="07XXXXXXXX / 01XXXXXXXX"
              className="col-span-3"
              disabled={isProcessing}
            />
          </div>
          {error && (
            <div className="col-span-4 p-2 bg-destructive/10 text-destructive text-sm rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4"/> {error}
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isProcessing}>Cancel</Button>
          </DialogClose>
          <Button onClick={handlePayment} disabled={isProcessing || !phoneNumber.trim()}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ${amount} ETB`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
