// lib/fakestore-api.ts
export interface Product {
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
  
  export async function fetchProducts(): Promise<Product[]> {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const products: Product[] = await response.json();
    
    // Filter out products that are in the "electronics" category
    return products.filter((product) => product.category !== 'electronics');
  }
  
  export async function fetchCategories(): Promise<string[]> {
    const response = await fetch('https://fakestoreapi.com/products/categories');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const categories = await response.json();
    // Filter out the 'electronics' category
    return categories.filter((category: string) => category !== 'electronics');
  }
  
  export async function fetchProduct(id: string) {
    try {
      const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  
      if (!res.ok) {
        // Improved error handling: capture response status and message
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch product ${id}`);
      }
  
      const text = await res.text(); // Get raw text
      if (!text) {
        throw new Error(`Empty response for product ${id}`);
      }
  
      const data = JSON.parse(text); // Manually parse the JSON
  
      // Validate response structure
      if (!data.id || !data.title) {
        throw new Error('Invalid product data structure');
      }
  
      return data;
    } catch (error) {
      console.error(`API Error - fetchProduct(${id}):`, error);
      throw error; // Re-throw for error boundaries
    }
  }
  