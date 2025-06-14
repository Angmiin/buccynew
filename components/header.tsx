"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, User, Menu, X, LogOut } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/products" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { cart, clearCart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSignOut = async () => {
    clearCart();
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px]">
            <div className="flex h-full flex-col">
              <div className="border-b py-4">
                <Link href="/" className="font-serif text-2xl font-bold">
                  BUCCI
                </Link>
              </div>
              <nav className="flex-1 py-4">
                <ul className="space-y-2">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`block px-2 py-2 text-lg ${
                          pathname === item.href
                            ? "font-medium text-black"
                            : "text-muted-foreground hover:text-black"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="border-t py-4">
                {session ? (
                  <div className="space-y-3">
                    <Link
                      href="/account"
                      className="flex items-center gap-2 px-2 py-2 text-muted-foreground hover:text-black"
                    >
                      <User className="h-5 w-5" />
                      My Account
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 px-2 py-2 text-muted-foreground hover:text-black"
                    >
                      <LogOut className="h-5 w-5" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/auth/login"
                      className="block px-2 py-2 text-muted-foreground hover:text-black"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      className="block px-2 py-2 text-muted-foreground hover:text-black"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="font-serif text-2xl font-bold">
          BUCCI
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`text-sm ${
                    pathname === item.href
                      ? "font-medium text-black"
                      : "text-muted-foreground hover:text-black"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-1">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-xs text-white">
                {itemCount}
              </span>
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          {session ? (
            <div className="flex items-center gap-2">
              <Link href="/account">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Link href="/auth/login">
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
