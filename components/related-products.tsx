"use client";

import ProductCard from "@/components/product-card";
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

export default function RelatedProducts({ currentProductId }: { currentProductId?: number }) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        const products = await fetchProducts();
        
        // Filter out current product and get random 4 products
        const filteredProducts = products
          .filter(product => product.id !== currentProductId)
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);

        setRelatedProducts(filteredProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load related products");
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId]);

  if (loading) {
    return (
      <section className="mt-16">
        <div className="mb-8">
          <h2 className="font-serif text-2xl font-bold">You May Also Like</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
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
      <section className="mt-16">
        <div className="mb-8">
          <h2 className="font-serif text-2xl font-bold">You May Also Like</h2>
          <p className="text-red-500 mt-2">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16">
      <div className="mb-8">
        <h2 className="font-serif text-2xl font-bold">You May Also Like</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
        {relatedProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={{
              id: product.id.toString(),
              name: product.title,
              price: product.price,
              image: product.image,
              category: product.category,
              isNew: product.rating.rate > 4 // Mark products with high rating as "New"
            }} 
          />
        ))}
      </div>
    </section>
  );
}