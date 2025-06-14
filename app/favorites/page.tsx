"use client";

import { useFavorites } from "@/app/context/FavoriteContext";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function FavoritesPage() {
  const { favorites, removeFromFavorites } = useFavorites();

  return (
    <div className="container px-4 py-8">
      <h1 className="mb-6 font-serif text-3xl font-bold">My Favorites</h1>
      {favorites.length === 0 ? (
        <div className="text-center text-muted-foreground">
          <p>No favorite products yet.</p>
          <Button asChild className="mt-4">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {favorites.map((item) => (
            <div
              key={item.id}
              className="relative border rounded-lg p-4 bg-white shadow-sm flex flex-col"
            >
              <Link href={`/products/${item.id}`} className="flex-1">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={300}
                  height={400}
                  className="object-cover rounded mb-2"
                />
                <h3 className="font-medium text-lg mb-1">{item.name}</h3>
                <p className="font-serif text-xl mb-2">
                  ${item.price.toLocaleString()}
                </p>
              </Link>
              <Button
                variant="outline"
                onClick={() => removeFromFavorites(item.id)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
