"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { fetchProducts } from "@/lib/fakestore-api";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const products = await fetchProducts();
        
        // Get top-rated products (rating > 4) as featured products
        const featured = products
          .filter(product => product.rating.rate > 4)
          .slice(0, 4); // Take first 4 featured products

        setFeaturedProducts(featured);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load featured products");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section className="container px-4 py-12">
        <div className="mb-10 text-center">
          <h2 className="mb-2 font-serif text-3xl font-bold tracking-tight md:text-4xl">
            Featured Products
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Discover our most coveted pieces, meticulously crafted for the
            discerning individual.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-gray-100 rounded-lg"></div>
              <div className="mt-4 h-4 bg-gray-100 rounded"></div>
              <div className="mt-2 h-4 bg-gray-100 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container px-4 py-12">
        <div className="mb-10 text-center">
          <h2 className="mb-2 font-serif text-3xl font-bold tracking-tight md:text-4xl">
          Featured Products
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Discover our most coveted pieces, meticulously crafted for the
            discerning individual.
          </p>
          <p className="text-red-500 mt-4">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container px-4 py-12">
      <div className="mb-10 text-center">
        <h2 className="mb-2 font-serif text-3xl font-bold tracking-tight md:text-4xl">
        Featured Products
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Discover our most coveted pieces, meticulously crafted for the
          discerning individual.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featuredProducts.map((product) => (
          <Card key={product.id} className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
            <Link href={`/products/${product.id}`} className="block">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {product.rating.rate > 4 && (
                  <Badge className="absolute right-3 top-3 bg-black px-2 py-1 text-white">
                    New
                  </Badge>
                )}
              </div>
            </Link>
            <CardContent className="p-4">
              <Link href={`/products/${product.id}`}>
                <h3 className="font-medium hover:underline">{product.title}</h3>
              </Link>
              <div className="mt-1 flex items-center justify-between">
                <p className="font-serif text-lg">
                  ${product.price.toLocaleString()}
                </p>
                <span className="text-sm text-muted-foreground capitalize">
                  {product.category}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link href="/products">
          <Button
            variant="outline"
            className="border-black text-black hover:bg-black hover:text-white"
          >
            View All Products
          </Button>
        </Link>
      </div>
    </section>
  );
}