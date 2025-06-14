import { useState } from "react";
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
    // Your extended fields
    images?: string[];
    details?: string[];
    sizes?: string[];
    colors?: { name: string; value: string }[];
    collection?: string;
  }
  
  // Update your state
  const [product, setProduct] = useState<Product | null>(null);