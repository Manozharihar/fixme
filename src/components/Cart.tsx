import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(src: string) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    document.body.appendChild(script);
  });
}

export function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  
  // Calculate actual totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxAmount = subtotal * 0.18; // 18% GST
  const shippingCostUSD = subtotal > 12.5 ? 0 : 2.5; // Free shipping over ₹1000
  const finalTotalUSD = subtotal + taxAmount + shippingCostUSD;
  
  // Convert to INR (multiply by 80 for rough conversion)
  const subtotalINR = Math.round(subtotal * 80);
  const taxAmountINR = Math.round(taxAmount * 80);
  const shippingCostINR = Math.round(shippingCostUSD * 80);
  const finalTotalINR = Math.round(finalTotalUSD * 80);

  useEffect(() => {
    loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  async function handleRazorpayCheckout() {
    try {
      // Create order on backend with calculated amount
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: finalTotalINR * 100, // Convert to paise
          currency: "INR" 
        }),
      });
      const data = await res.json();
      if (!data.order_id) throw new Error(data.error || "Order creation failed");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        order_id: data.order_id,
        name: "Repair Kit Checkout",
        description: `Payment for ${items.length} repair part${items.length > 1 ? 's' : ''}`,
        handler: async function (response: any) {
          // Verify payment signature
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("Payment successful! Your repair kit is ready.");
            clearCart(); // Clear cart after successful payment
          } else {
            alert("Payment verification failed: " + (verifyData.error || "Unknown error"));
          }
        },
        modal: {
          ondismiss: function () {
            alert("Payment cancelled. You can try again anytime.");
          },
        },
        prefill: {},
        theme: { color: "#FF4D00" }, // Match the accent color
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        alert("Payment failed: " + response.error.description);
      });
      rzp.open();
    } catch (err: any) {
      alert("Error: " + (err.message || "Unknown error"));
    }
  }

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:ml-20 min-h-screen">
        <h1 className="text-4xl font-heading mb-4 accent-text">REPAIR_KIT</h1>
        <p className="text-blueprint-muted font-mono text-sm max-w-2xl uppercase opacity-50 mb-16">
          SHOPPING_CART // CHECKOUT_SYSTEM
        </p>

        <div className="flex flex-col items-center justify-center py-20">
          <ShoppingCart size={64} className="opacity-30 mb-8" />
          <h2 className="text-2xl font-bold mb-4 text-center">CART_EMPTY</h2>
          <p className="text-zinc-500 mb-8 text-center max-w-md">
            No parts in your repair kit. Explore the marketplace to add components.
          </p>
          <Link
            to="/shop"
            className="px-12 py-4 bg-artistic-accent text-black font-black uppercase tracking-tighter hover:bg-white transition-colors flex items-center gap-2"
          >
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // Values overridden above to always show 1 rs

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:ml-20 min-h-screen">
      <h1 className="text-4xl font-heading mb-4 accent-text">REPAIR_KIT</h1>
      <p className="text-blueprint-muted font-mono text-sm max-w-2xl uppercase opacity-50 mb-8">
        SHOPPING_CART // CHECKOUT_SYSTEM
      </p>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-artistic-border">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`p-6 flex gap-6 group ${
                  index !== items.length - 1 ? "border-b border-artistic-border" : ""
                }`}
              >
                <div className="w-24 h-24 flex-shrink-0 bg-zinc-900 border border-artistic-border overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 group-hover:grayscale-0 transition-all"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                  <p className="text-sm text-zinc-500 mb-4 font-body italic">
                    {item.category} • Compatibility: {item.compatibility.length} models
                  </p>
                  <div className="text-xl font-bold accent-text">₹{Math.round(item.price * 80).toLocaleString('en-IN')}</div>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-400 transition-colors"
                    title="Remove from cart"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="flex items-center gap-2 border border-artistic-border">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-zinc-900 transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 font-bold text-center w-16">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-zinc-900 transition-colors"
                      title="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="text-lg font-bold">
                    ₹{Math.round(item.price * item.quantity * 80).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={clearCart}
            className="text-sm text-zinc-500 hover:text-artistic-accent transition-colors font-mono uppercase tracking-wider"
          >
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border border-artistic-border p-8 sticky top-32">
            <h2 className="text-xl font-bold mb-8 uppercase tracking-tighter">ORDER SUMMARY</h2>

            <div className="space-y-4 mb-8 border-b border-zinc-800 pb-8">
              <div className="flex justify-between">
                <span className="text-zinc-400">Items ({items.length})</span>
                <span className="font-mono">₹{subtotalINR.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Tax (18% GST)</span>
                <span className="font-mono">₹{taxAmountINR.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Shipping</span>
                <span className="font-mono">{shippingCostINR === 0 ? 'FREE' : `₹${shippingCostINR.toLocaleString('en-IN')}`}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="font-bold uppercase">Total</span>
              <span className="text-2xl font-bold accent-text">₹{finalTotalINR.toLocaleString('en-IN')}</span>
            </div>

            {shippingCostINR > 0 && (
              <p className="text-xs text-zinc-500 mb-6 font-mono">
                Add ₹{(1000 - subtotalINR).toLocaleString('en-IN')} more for free shipping
              </p>
            )}

            <button
              className="w-full bg-artistic-accent text-black font-bold py-4 uppercase text-sm tracking-widest hover:bg-white transition-colors mb-4"
              onClick={handleRazorpayCheckout}
            >
              Proceed to Checkout
            </button>

            <Link
              to="/shop"
              className="block text-center text-sm text-zinc-500 hover:text-artistic-accent transition-colors font-mono uppercase tracking-wider"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
