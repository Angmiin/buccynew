import type React from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/auth-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { FavoriteProvider } from "./context/FavoriteContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bucci | Luxury Clothing",
  description: "Discover the finest luxury clothing at Bucci",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <FavoriteProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem={false}
              >
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
                <Toaster />
              </ThemeProvider>
            </FavoriteProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
