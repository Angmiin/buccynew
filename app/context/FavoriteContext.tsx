"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";

interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface FavoriteContextType {
  favorites: FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;
  refreshFavorites: () => void;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(
  undefined
);

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context)
    throw new Error("useFavorites must be used within a FavoriteProvider");
  return context;
};

export const FavoriteProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Fetch favorites from API
  const fetchFavorites = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch(`/api/favorites?userId=${session.user.id}`);
      if (res.ok) {
        const data = await res.json();
        setFavorites(data.favorites || []);
      }
    } catch (e) {
      // handle error
    }
  };

  useEffect(() => {
    fetchFavorites();
    // eslint-disable-next-line
  }, [session?.user?.id]);

  const addToFavorites = async (item: FavoriteItem) => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, product: item }),
      });
      if (res.ok) {
        const data = await res.json();
        setFavorites(data.favorites || []);
      }
    } catch (e) {
      // handle error
    }
  };

  const removeFromFavorites = async (id: string) => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, productId: id }),
      });
      if (res.ok) {
        const data = await res.json();
        setFavorites(data.favorites || []);
      }
    } catch (e) {
      // handle error
    }
  };

  const isFavorite = (id: string) => favorites.some((item) => item.id === id);

  const refreshFavorites = fetchFavorites;

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        refreshFavorites,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};
