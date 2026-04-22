import React from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

export function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();

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

  const taxAmount = total * 0.05; // Assuming 5% tax
  const shippingCostUSD = total > 781.25 ? 0 : 6.25; // Free shipping over ₹62,500 (6.25 USD)
  const finalTotalUSD = total + taxAmount + shippingCostUSD;

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
                <span className="text-zinc-400">Items ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                <span className="font-mono">₹{Math.round(total * 80).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Tax (5%)</span>
                <span className="font-mono">₹{Math.round(taxAmount * 80).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Shipping</span>
                <span className="font-mono">
                  {shippingCostUSD === 0 ? (
                    <span className="text-artistic-accent">FREE</span>
                  ) : (
                    `₹${Math.round(shippingCostUSD * 80).toLocaleString('en-IN')}`
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="font-bold uppercase">Total</span>
              <span className="text-2xl font-bold accent-text">₹{Math.round(finalTotalUSD * 80).toLocaleString('en-IN')}</span>
            </div>

            {shippingCostUSD > 0 && (
              <p className="text-xs text-zinc-500 mb-6 font-mono">
                Add ₹{Math.round((781.25 - total) * 80).toLocaleString('en-IN')} more for free shipping
              </p>
            )}

            <button className="w-full bg-artistic-accent text-black font-bold py-4 uppercase text-sm tracking-widest hover:bg-white transition-colors mb-4">
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
