"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "@/app/context/CartContext";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  // Local copy of cart items for editing (changes not yet applied globally)
  const [localCart, setLocalCart] = useState<CartItem[]>([...cart]);

  // Helper to increase item quantity in local state
  const handleIncrease = (id: string, size?: string, color?: string) => {
    setLocalCart((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Helper to decrease item quantity in local state (not below 1)
  const handleDecrease = (id: string, size?: string, color?: string) => {
    setLocalCart((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  // Helper to remove an item from local state
  const handleRemove = (id: string, size?: string, color?: string) => {
    setLocalCart((prev) =>
      prev.filter(
        (item) =>
          !(item.id === id && item.size === size && item.color === color)
      )
    );
  };

  // Apply local changes to global cart context
  const handleUpdateCart = () => {
    // Remove items that were deleted in localCart
    cart.forEach((item) => {
      const stillInCart = localCart.find(
        (it) =>
          it.id === item.id &&
          it.size === item.size &&
          it.color === item.color
      );
      if (!stillInCart) {
        removeFromCart(item.id, item.size, item.color);
      }
    });
    // Update quantities for items that remain
    localCart.forEach((item) => {
      const original = cart.find(
        (it) =>
          it.id === item.id &&
          it.size === item.size &&
          it.color === item.color
      );
      if (original && original.quantity !== item.quantity) {
        updateQuantity(item.id, item.size, item.color, item.quantity);
      }
    });
    // (No need to handle added items here, as cart page does not add new products)
  };

  // Calculate order summary values from localCart (so the summary updates immediately when quantities change locally)
  const subtotal = localCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="container px-4 py-8">
      <h1 className="mb-8 font-serif text-3xl font-bold md:text-4xl">Shopping Cart</h1>

      {localCart.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items Table */}
          <div className="lg:col-span-2">
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Product</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {localCart.map((item) => (
                    <TableRow key={`${item.id}-${item.size}-${item.color}`}>
                      {/* Product image */}
                      <TableCell>
                        <div className="relative h-20 w-16 overflow-hidden rounded-md">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      {/* Product name and variant */}
                      <TableCell>
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.size ? `Size: ${item.size}` : ""}{" "}
                            {item.color ? `| Color: ${item.color}` : ""}
                          </p>
                        </div>
                      </TableCell>
                      {/* Price each */}
                      <TableCell>${item.price.toLocaleString()}</TableCell>
                      {/* Quantity controls */}
                      <TableCell>
                        <div className="flex items-center">
                          <Button 
                            variant="outline" size="icon" className="h-8 w-8 rounded-r-none"
                            onClick={() => handleDecrease(item.id, item.size, item.color)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Decrease quantity</span>
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            readOnly
                            className="h-8 w-12 rounded-none border-x-0 text-center"
                          />
                          <Button 
                            variant="outline" size="icon" className="h-8 w-8 rounded-l-none"
                            onClick={() => handleIncrease(item.id, item.size, item.color)}
                          >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Increase quantity</span>
                          </Button>
                        </div>
                      </TableCell>
                      {/* Total price for this item */}
                      <TableCell>${(item.price * item.quantity).toLocaleString()}</TableCell>
                      {/* Remove item */}
                      <TableCell>
                        <Button 
                          variant="ghost" size="icon" className="h-8 w-8"
                          onClick={() => handleRemove(item.id, item.size, item.color)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove item</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Cart controls: coupon (non-functional) and update button */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex max-w-md items-center gap-2">
                <Input placeholder="Coupon code" className="max-w-[200px]" />
                <Button variant="outline">Apply Coupon</Button>
              </div>
              <Button variant="outline" onClick={handleUpdateCart}>
                Update Cart
              </Button>
            </div>
          </div>

          {/* Order Summary Section */}
          <div>
            <div className="rounded-lg border p-6">
              <h2 className="mb-4 text-lg font-medium">Order Summary</h2>
              <div className="space-y-3">
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
                <div className="border-t pt-3">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Button className="mt-6 w-full bg-black text-white hover:bg-black/90" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>

            <div className="mt-6 rounded-lg border p-6">
              <h3 className="mb-4 text-sm font-medium">We Accept</h3>
              <div className="flex flex-wrap gap-2">
                <div className="rounded border px-3 py-2 text-xs">Visa</div>
                <div className="rounded border px-3 py-2 text-xs">Mastercard</div>
                <div className="rounded border px-3 py-2 text-xs">American Express</div>
                <div className="rounded border px-3 py-2 text-xs">PayPal</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Empty cart state
        <div className="flex flex-col items-center justify-center py-12">
          <div className="mb-6 text-center">
            <h2 className="mb-2 text-2xl font-medium">Your cart is empty</h2>
            <p className="text-muted-foreground">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
          </div>
          <Button asChild className="bg-black text-white hover:bg-black/90">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
