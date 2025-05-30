
"use server";

// Mock M-Pesa Payment Service

export interface MpesaPaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
}

/**
 * Simulates processing an M-Pesa payment.
 * In a real application, this would involve API calls to Safaricom's M-Pesa API.
 */
export async function processMpesaPayment(
  userId: string, // Can be userEmail for this mock
  itemId: string, // e.g. courseId or "monthly_subscription"
  itemName: string, // e.g. courseName or "Monthly Subscription"
  amount: number, // Amount in ETB
  phoneNumber: string
): Promise<MpesaPaymentResult> {
  console.log(
    `Initiating M-Pesa payment for User ID: ${userId}, Item: ${itemName} (ID: ${itemId}), Amount: ${amount} ETB, Phone: ${phoneNumber}`
  );

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2500));

  // Simulate random success or failure (e.g., insufficient funds, technical error)
  const isValidPhoneNumber = /^(07|01)\d{8}$/.test(phoneNumber); // Basic Kenyan mobile number check

  if (!isValidPhoneNumber) {
    console.error("M-Pesa Payment Failed: Invalid phone number format.");
    return {
      success: false,
      message: "Payment failed. Please enter a valid M-Pesa phone number (e.g., 07XXXXXXXX or 01XXXXXXXX).",
    };
  }
  
  const shouldSucceed = Math.random() > 0.1; // 90% success rate for demo

  if (shouldSucceed) {
    const transactionId = `MPESA_TXN_${Date.now()}_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    console.log(`M-Pesa Payment Successful: Transaction ID ${transactionId}`);
    return {
      success: true,
      transactionId: transactionId,
      message: `Payment for ${itemName} successful! Your access is being updated.`,
    };
  } else {
    console.error("M-Pesa Payment Failed: Simulated payment error.");
    return {
      success: false,
      message: "Payment failed. This could be due to insufficient funds or a temporary issue. Please try again.",
    };
  }
}
