import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export const razorpayService = {
  async createOrder(amount: number) {
    const response = await fetch(`${API_BASE}/api/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to paise
        currency: "INR",
      }),
    });
    if (!response.ok) {
      let errorMessage = `Server returned ${response.status}`;
      try {
        const errData = await response.json();
        errorMessage = errData.error || errorMessage;
      } catch (e) {
        // Fallback if the server didn't return JSON
      }
      throw new Error(`Failed to create order: ${errorMessage}`);
    }
    return response.json();
  },

  async verifyAndSavePayment(paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    amount: number;
    items: any[];
  }) {
    // 1. Verify signature via backend
    const verifyRes = await fetch(`${API_BASE}/api/verify-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });

    if (!verifyRes.ok) {
      throw new Error(`Payment verification failed: Server returned ${verifyRes.status}`);
    }

    const verification = await verifyRes.json();
    if (!verification.success) throw new Error("Payment verification failed");

    // 2. Save receipt to Firebase
    const receiptRef = await addDoc(collection(db, "receipts"), {
      userId: auth.currentUser?.uid || "anonymous",
      email: auth.currentUser?.email || "guest",
      orderId: paymentData.razorpay_order_id,
      paymentId: paymentData.razorpay_payment_id,
      amount: paymentData.amount,
      items: paymentData.items,
      status: "paid",
      createdAt: serverTimestamp(),
    });

    // 3. Trigger Email via Firebase Extension (Trigger Email from Firestore)
    // This assumes you have the "Trigger Email" extension configured to watch the 'mail' collection
    await addDoc(collection(db, "mail"), {
      to: auth.currentUser?.email,
      message: {
        subject: `Order Confirmation - ${paymentData.razorpay_order_id}`,
        html: `<p>Thank you for your order!</p>`
      }
    });
  }
};
