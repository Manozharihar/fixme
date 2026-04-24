import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import Razorpay from "razorpay";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import nodemailer from "nodemailer";
import firebaseConfig from "./firebase-applet-config.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

// Razorpay configuration
const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (!razorpayKeyId || !razorpayKeySecret) {
  console.error('❌ Razorpay environment variables missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.');
  process.exit(1);
}

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const expressApp = express();
const PORT = process.env.PORT || 3000;

expressApp.use(cors());
expressApp.use(express.json());

// Create Razorpay Order
expressApp.post("/api/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;
    
    console.log('💳 Creating Razorpay order:', { amount, currency, receipt });
    
    if (!amount || amount < 100) {
      return res.status(400).json({ error: "Amount must be at least 100 paise (₹1)" });
    }
    
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('❌ Razorpay environment variables not set');
      return res.status(500).json({ error: "Razorpay not configured on server" });
    }
    
    const options = {
      amount: Math.round(amount), // in paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    };
    
    const order = await razorpay.orders.create(options);
    console.log('✅ Razorpay order created:', order.id);
    
    res.json({ 
      order_id: order.id, 
      amount: order.amount, 
      currency: order.currency 
    });
  } catch (err: any) {
    console.error("❌ Razorpay order creation error:", err);
    
    if (err.statusCode === 401) {
      return res.status(401).json({ error: "Razorpay authentication failed - check your API keys" });
    }
    if (err.statusCode === 400) {
      return res.status(400).json({ error: "Invalid order parameters" });
    }
    
    res.status(500).json({ error: "Failed to create order: " + (err.message || "Unknown error") });
  }
});

// Verify Razorpay Payment Signature
expressApp.post("/api/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, receiptEmail, amount } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing payment fields" });
  }
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");
  if (expectedSignature === razorpay_signature) {
    // Send confirmation email
    if (receiptEmail && process.env.SMTP_USER) {
      try {
        await transporter.sendMail({
          from: `"Fix Me Repair Kits" <${process.env.SMTP_USER}>`,
          to: receiptEmail,
          subject: "Your Repair Kit Order Confirmation",
          text: `Thank you for your order!\n\nOrder ID: ${razorpay_order_id}\nPayment ID: ${razorpay_payment_id}\nTotal Amount: ₹${amount / 100}\n\nYour parts are being prepared for shipment.`,
          html: `
            <h2>Thank you for your order!</h2>
            <p>Order ID: <strong>${razorpay_order_id}</strong></p>
            <p>Payment ID: <strong>${razorpay_payment_id}</strong></p>
            <p>Total Amount: <strong>₹${amount / 100}</strong></p>
            <p>Your parts are being prepared for shipment.</p>
          `
        });
        console.log(`✅ Order confirmation email sent to ${receiptEmail}`);
      } catch (error) {
        console.error("❌ Failed to send confirmation email:", error);
      }
    }

    return res.json({ success: true });
  } else {
    return res.status(400).json({ error: "Signature mismatch" });
  }
});

// Test Razorpay connection
expressApp.get("/api/test-razorpay", async (req, res) => {
  try {
    const testOrder = await razorpay.orders.create({
      amount: 100, // ₹1
      currency: "INR",
      receipt: "test_connection",
    });
    res.json({ 
      success: true, 
      message: "Razorpay connection successful",
      test_order_id: testOrder.id 
    });
  } catch (error: any) {
    console.error("Razorpay test failed:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      code: error.statusCode 
    });
  }
});

// Firebase Data API - Guides
expressApp.get("/api/guides", async (req, res) => {
  try {
    const guidesRef = collection(db, "guides");
    const snapshot = await getDocs(guidesRef);
    const guides = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(guides);
  } catch (error) {
    console.error("Error fetching guides:", error);
    res.status(500).json({ error: "Failed to fetch guides" });
  }
});

expressApp.get("/api/guides/:id", async (req, res) => {
  try {
    const guideRef = doc(db, "guides", req.params.id);
    const snapshot = await getDoc(guideRef);
    if (snapshot.exists()) {
      res.json({
        id: snapshot.id,
        ...snapshot.data()
      });
    } else {
      res.status(404).json({ error: "Guide not found" });
    }
  } catch (error) {
    console.error("Error fetching guide:", error);
    res.status(500).json({ error: "Failed to fetch guide" });
  }
});

// Firebase Data API - Parts
expressApp.get("/api/parts", async (req, res) => {
  try {
    const partsRef = collection(db, "parts");
    const snapshot = await getDocs(partsRef);
    const parts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(parts);
  } catch (error) {
    console.error("Error fetching parts:", error);
    res.status(500).json({ error: "Failed to fetch parts" });
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    expressApp.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    expressApp.use(express.static(distPath));
    expressApp.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  expressApp.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
