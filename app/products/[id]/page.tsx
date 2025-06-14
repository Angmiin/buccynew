"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Share2, Star } from "lucide-react";
import RelatedProducts from "@/components/related-products";
import { fetchProduct } from "@/lib/fakestore-api";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState("Black");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Validate product ID
        if (!id || isNaN(Number(id))) {
          throw new Error("Invalid product ID");
        }

        const productData = await fetchProduct(id as string);

        if (!productData || !productData.id) {
          throw new Error("Product not found");
        }

        // Create image variations only if base image exists
        const images = productData.image
          ? [
              productData.image,
              `${productData.image}?auto=format&q=80`,
              `${productData.image}?auto=format&q=60`,
              `${productData.image}?auto=format&q=40`,
            ]
          : ["/placeholder.svg"];

        setProduct({
          ...productData,
          images,
          details: [
            "Premium quality materials",
            "Expert craftsmanship",
            "Designed for comfort and style",
            "Includes care instructions",
            "Model measurements available",
          ],
          sizes: ["XS", "S", "M", "L", "XL"],
          colors: [
            { name: "Black", value: "#000000" },
            { name: "Navy", value: "#0a192f" },
            { name: "Charcoal", value: "#36454F" },
          ],
          collection: "Featured Collection",
        });
      } catch (err) {
        console.error("Error loading product:", err);
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Loading skeleton */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-gray-200 animate-pulse rounded-lg"></div>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-200 animate-pulse rounded"
                ></div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-20 w-full bg-gray-200 animate-pulse rounded"></div>
            <div className="h-12 w-full bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 py-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => window.location.reload()}>Try Again</Button>
          <Button asChild variant="outline">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container px-4 py-8 text-center">
        <p>Product not found</p>
        <Button asChild className="mt-4">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <div className="mb-4">
        <Link
          href="/products"
          className="text-muted-foreground hover:underline"
        >
          &larr; Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
            <Image
              src={product.images[activeImage]}
              alt={product.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image: string, index: number) => (
              <button
                key={index}
                className={`relative aspect-square overflow-hidden rounded transition-opacity ${
                  activeImage === index
                    ? "ring-2 ring-black"
                    : "opacity-80 hover:opacity-100"
                }`}
                onClick={() => setActiveImage(index)}
              >
                <Image
                  src={image}
                  alt={`${product.title} - View ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-6">
            <div className="mb-2 flex items-center space-x-2">
              <span className="text-sm text-muted-foreground capitalize">
                {product.category}
              </span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                {product.collection}
              </span>
            </div>
            <h1 className="mb-2 font-serif text-3xl font-bold md:text-4xl">
              {product.title}
            </h1>
            <div className="mb-4 flex items-center space-x-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating.rate)
                        ? "fill-black text-black"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating.rate} ({product.rating.count} reviews)
              </span>
            </div>
            <p className="mb-6 font-serif text-2xl">
              ${product.price.toLocaleString()}
            </p>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {/* Product Options */}
          <div className="mb-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Color</label>
              <div className="flex space-x-2">
                {product.colors.map((color: any) => (
                  <button
                    key={color.name}
                    className={`relative h-8 w-8 rounded-full border-2 p-1 ${
                      selectedColor === color.name
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                    onClick={() => setSelectedColor(color.name)}
                  >
                    <span
                      className="block h-full w-full rounded-full"
                      style={{ backgroundColor: color.value }}
                    />
                    <span className="sr-only">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Size</label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {product.sizes.map((size: string) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Quantity</label>
              <div className="flex items-center">
                <button
                  className="px-3 py-1 border border-gray-300 rounded-l hover:bg-gray-100"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <div className="px-4 py-1 border-t border-b border-gray-300">
                  {quantity}
                </div>
                <button
                  className="px-3 py-1 border border-gray-300 rounded-r hover:bg-gray-100"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-8 flex space-x-4">
            <Button
              className="flex-1 bg-black text-white hover:bg-black/90"
              onClick={() =>
                addToCart(
                  {
                    id: product.id.toString(),
                    name: product.title,
                    price: product.price,
                    image: product.image || "/placeholder.svg",
                    size: selectedSize,
                    color: selectedColor,
                  },
                  quantity // add the selected quantity to cart
                )
              }
            >
              Add to Cart
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-5 w-5" />
              <span className="sr-only">Share</span>
            </Button>
          </div>

          {/* Product Details Tabs */}
          <Tabs defaultValue="details">
            <TabsList className="w-full">
              <TabsTrigger value="details" className="flex-1">
                Details
              </TabsTrigger>
              <TabsTrigger value="shipping" className="flex-1">
                Shipping & Returns
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1">
                Reviews
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4">
              <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                {product.details.map((detail: string, index: number) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="shipping" className="mt-4">
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Free standard shipping on all orders over $200. Delivery time
                  is typically 3-5 business days.
                </p>
                <p>
                  Express shipping is available for an additional fee. Orders
                  placed before 12pm local time may ship the same day.
                </p>
                <p>
                  Returns are accepted within 30 days of delivery. Items must be
                  unworn, unwashed, and with all original tags attached.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Customer Reviews</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.rating.count} reviews
                    </p>
                  </div>
                  <Button variant="outline">Write a Review</Button>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating.rate)
                            ? "fill-black text-black"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm">
                    {product.rating.rate} out of 5
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {product.rating.count} customer ratings
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts currentProductId={product.id} />
    </div>
  );
}
