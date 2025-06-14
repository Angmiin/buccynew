"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Compute summary values (same 10% tax and free shipping as cart page)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  const tax = subtotal * 0.1;
  const grandTotal = subtotal + shipping + tax;

  // Submit handler for placing order
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();            // clear the cart after checkout
    setOrderPlaced(true);   // show success message
  };

  return (
    <div className="container px-4 py-8">
      <h1 className="mb-8 font-serif text-3xl font-bold md:text-4xl">Checkout</h1>

      {orderPlaced ? (
        // Order success message
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="mb-2 text-2xl font-medium">Order Placed Successfully!</h2>
          <p className="mb-6 text-muted-foreground">
            Thank you for your purchase. Your order is on its way!
          </p>
          <Button asChild className="bg-black text-white hover:bg-black/90">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      ) : cart.length === 0 ? (
        // Empty cart state (if user navigated to checkout with no items)
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="mb-2 text-2xl font-medium">Your cart is empty</h2>
          <p className="mb-6 text-muted-foreground">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Button asChild className="bg-black text-white hover:bg-black/90">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        // Checkout form and summary
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Checkout Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePlaceOrder}>
              {/* Shipping Information */}
              <h2 className="mb-4 text-lg font-medium">Shipping Information</h2>
              <div className="mb-4">
                <label htmlFor="name" className="mb-1 block text-sm font-medium">Full Name</label>
                <Input id="name" type="text" required placeholder="Jane Doe" />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
                <Input id="email" type="email" required placeholder="jane@example.com" />
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="mb-1 block text-sm font-medium">Address</label>
                <Input id="address" type="text" required placeholder="1234 Street Name" />
              </div>
              <div className="mb-4">
                <label htmlFor="city" className="mb-1 block text-sm font-medium">City</label>
                <Input id="city" type="text" required placeholder="City" />
              </div>
              <div className="mb-4 flex gap-4">
                <div className="flex-1">
                  <label htmlFor="state" className="mb-1 block text-sm font-medium">State/Province</label>
                  <Input id="state" type="text" required placeholder="State" />
                </div>
                <div className="flex-1">
                  <label htmlFor="postal" className="mb-1 block text-sm font-medium">Postal Code</label>
                  <Input id="postal" type="text" required placeholder="ZIP / Postal Code" />
                </div>
              </div>

              {/* Payment Details */}
              <h2 className="mt-8 mb-4 text-lg font-medium">Payment Details</h2>
              <div className="mb-4">
                <label htmlFor="card" className="mb-1 block text-sm font-medium">Card Number</label>
                <Input id="card" type="text" required placeholder="xxxx xxxx xxxx xxxx" />
              </div>
              <div className="mb-4 flex gap-4">
                <div className="flex-1">
                  <label htmlFor="expiry" className="mb-1 block text-sm font-medium">Expiry Date</label>
                  <Input id="expiry" type="text" required placeholder="MM/YY" />
                </div>
                <div className="flex-1">
                  <label htmlFor="cvv" className="mb-1 block text-sm font-medium">CVV</label>
                  <Input id="cvv" type="text" required placeholder="CVV" />
                </div>
              </div>

              <Button type="submit" className="mt-4 w-full bg-black text-white hover:bg-black/90">
                Place Order
              </Button>
            </form>
          </div>

          {/* Order Summary Section */}
          <div>
            <div className="rounded-lg border p-6">
              <h2 className="mb-4 text-lg font-medium">Order Summary</h2>
              {/* List of items */}
              <ul className="mb-4 space-y-2 text-sm">
                {cart.map((item) => (
                  <li key={`${item.id}-${item.size}-${item.color}`} className="flex justify-between">
                    {/* Item name and variant */}
                    <span>
                      {item.name}{" "}
                      {(item.size || item.color) && (
                        <span className="text-muted-foreground">
                          ({[item.size, item.color].filter(Boolean).join(", ")})
                        </span>
                      )} x{item.quantity}
                    </span>
                    {/* Line total for item */}
                    <span>${(item.price * item.quantity).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              {/* Summary totals */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-medium">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
