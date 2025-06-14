"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setIsSubscribed(true);
      setEmail("");

      toast({
        title: "Welcome to Bucci!",
        description:
          "Thank you for joining our community. You'll be the first to know about our latest updates.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to subscribe",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <section className="container px-4">
        <div className="mx-auto max-w-3xl rounded-xl bg-black p-8 text-center text-white sm:p-12">
          <h2 className="mb-3 font-serif text-2xl font-bold sm:text-3xl">
            Welcome to the Bucci Community!
          </h2>
          <p className="mb-6 text-white/80">
            Thank you for subscribing. You'll be the first to know about our
            latest collections and exclusive offers.
          </p>
          <Button
            onClick={() => setIsSubscribed(false)}
            className="bg-white text-black hover:bg-white/90"
          >
            Subscribe Another Email
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container px-4">
      <div className="mx-auto max-w-3xl rounded-xl bg-black p-8 text-center text-white sm:p-12">
        <h2 className="mb-3 font-serif text-2xl font-bold sm:text-3xl">
          Join the Bucci Community
        </h2>
        <p className="mb-6 text-white/80">
          Subscribe to receive exclusive updates on new collections, limited
          editions, and private events.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <Input
            type="email"
            placeholder="Your email address"
            className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="bg-white text-black hover:bg-white/90"
            disabled={isLoading}
          >
            {isLoading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>

        <p className="mt-4 text-xs text-white/60">
          By subscribing, you agree to our Privacy Policy and consent to receive
          updates from Bucci.
        </p>
      </div>
    </section>
  );
}
