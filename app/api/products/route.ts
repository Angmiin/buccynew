import { NextResponse } from "next/server";
import { 
  ProductService,
  type LuxuryCategory,
  type Product,
  LUXURY_CATEGORIES
} from "@/lib/fakeshop-api";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

type ProductListResponse = {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};

type ProductQueryParams = {
  category?: LuxuryCategory;
  limit?: number;
  sort?: 'price-asc' | 'price-desc' | 'rating' | 'newest';
  search?: string;
  page?: number;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse and validate query parameters with defaults
    const queryParams: ProductQueryParams = {
      category: validateCategory(searchParams.get("category")),
      limit: validateNumber(searchParams.get("limit")),
      sort: validateSort(searchParams.get("sort")),
      search: searchParams.get("search") || undefined,
      page: validateNumber(searchParams.get("page"), 1) // Default to page 1
    };

    const { products, total } = await ProductService.getAll(queryParams);
    
    // Calculate pagination with guaranteed numbers
    const limit = queryParams.limit ?? total;
    const page = queryParams.page ?? 1;
    const totalPages = queryParams.limit ? Math.ceil(total / queryParams.limit) : 1;

    return NextResponse.json<ApiResponse<ProductListResponse>>({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page,
          limit,
          pages: totalPages,
        },
      }
    });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json<ApiResponse<null>>(
      { 
        success: false,
        error: error.message || "Failed to fetch products" 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const productData = await request.json();
    
    if (!productData.title || !productData.price || !productData.category) {
      throw new Error("Missing required fields: title, price, category");
    }

    const newProduct = await ProductService.create(productData);
    
    return NextResponse.json<ApiResponse<Product>>(
      {
        success: true,
        data: newProduct
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json<ApiResponse<null>>(
      { 
        success: false,
        error: error.message || "Failed to create product" 
      },
      { status: error.statusCode || 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updateData } = await request.json();
    
    if (!id) {
      throw new Error("Product ID is required");
    }

    const updatedProduct = await ProductService.update(id, updateData);
    
    return NextResponse.json<ApiResponse<Product>>(
      {
        success: true,
        data: updatedProduct
      }
    );
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json<ApiResponse<null>>(
      { 
        success: false,
        error: error.message || "Failed to update product" 
      },
      { status: error.statusCode || 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      throw new Error("Product ID is required");
    }

    await ProductService.delete(id);
    
    return NextResponse.json<ApiResponse<null>>(
      {
        success: true,
        data: null
      }
    );
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json<ApiResponse<null>>(
      { 
        success: false,
        error: error.message || "Failed to delete product" 
      },
      { status: error.statusCode || 500 }
    );
  }
}

// Helper functions for validation
function validateCategory(category: string | null): LuxuryCategory | undefined {
  return category && LUXURY_CATEGORIES.includes(category as LuxuryCategory) 
    ? category as LuxuryCategory 
    : undefined;
}

function validateSort(sort: string | null): ProductQueryParams['sort'] {
  const validSorts = ['price-asc', 'price-desc', 'rating', 'newest'] as const;
  return sort && validSorts.includes(sort as any) 
    ? sort as ProductQueryParams['sort']
    : undefined;
}

function validateNumber(value: string | null, defaultValue?: number): number | undefined {
  if (value === null) return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}