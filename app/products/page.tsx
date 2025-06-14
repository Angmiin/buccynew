"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/product-card";
import { Slider } from "@/components/ui/slider";
import { fetchProducts, fetchCategories } from "@/lib/fakestore-api";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("featured");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);
        setProducts(productsData);
        setCategories(["All Categories", ...categoriesData]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCategoryChange = (category: string) => {
    if (category === "All Categories") {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(prev =>
        prev.includes(category)
          ? prev.filter(c => c !== category)
          : [...prev, category]
      );
    }
  };

  const filteredProducts = products
    .filter(product => {
      // Filter by category
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }
      // Filter by price range
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      // Filter by search query
      if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return b.id - a.id; // Assuming higher IDs are newer products
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "featured":
        default:
          return b.rating.rate - a.rating.rate;
      }
    });

  if (loading) return <div className="container px-4 py-8 text-center">Loading...</div>;
  if (error) return <div className="container px-4 py-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 font-serif text-3xl font-bold md:text-4xl">Shop All Products</h1>
        <p className="text-muted-foreground">Discover our curated selection of products.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filters */}
        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="mb-4 font-medium">Search</h3>
              <Input 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div>
              <h3 className="mb-4 font-medium">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category}`}
                      checked={
                        category === "All Categories" 
                          ? selectedCategories.length === 0
                          : selectedCategories.includes(category)
                      }
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <label htmlFor={`category-${category}`} className="text-sm text-muted-foreground">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-medium">Price Range</h3>
              <div className="space-y-4">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={0}
                  max={1000}
                  step={10}
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">${priceRange[0]}</span>
                  <span className="text-sm text-muted-foreground">${priceRange[1]}</span>
                </div>
              </div>
            </div>

            <Button 
              className="w-full"
              onClick={() => {
                // Filters are already applied in real-time
                // This button can be used to reset if needed
                setSelectedCategories([]);
                setPriceRange([0, 1000]);
                setSearchQuery("");
                setSortOption("featured");
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Sort Options */}
          <div className="mb-6 flex justify-end">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={{
                  id: product.id.toString(),
                  name: product.title,
                  price: product.price,
                  image: product.image,
                  category: product.category,
                  isNew: product.rating.rate > 4
                }} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}