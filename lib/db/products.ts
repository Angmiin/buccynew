import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Product } from "@/types/mongodb"

export async function getProducts(options: {
  category?: string
  collection?: string
  gender?: string
  minPrice?: number
  maxPrice?: number
  featured?: boolean
  sort?: string
  limit?: number
  page?: number
}) {
  const {
    category,
    collection,
    gender,
    minPrice,
    maxPrice,
    featured,
    sort = "featured",
    limit = 12,
    page = 1,
  } = options

  const query: any = {}

  if (category) query.category = category
  if (collection) query.collection = collection
  if (gender) query.gender = gender
  if (featured !== undefined) query.featured = featured

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {}
    if (minPrice !== undefined) query.price.$gte = minPrice
    if (maxPrice !== undefined) query.price.$lte = maxPrice
  }

  const sortOptions: any = {}
  switch (sort) {
    case "newest":
      sortOptions.createdAt = -1
      break
    case "price-asc":
      sortOptions.price = 1
      break
    case "price-desc":
      sortOptions.price = -1
      break
    case "featured":
    default:
      sortOptions.featured = -1
      sortOptions.createdAt = -1
      break
  }

  try {
    const client = await clientPromise
    const db = client.db("bucci")

    const total = await db.collection("products").countDocuments(query)

    const products = await db
      .collection("products")
      .find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error("Error fetching products:", error)
    throw error
  }
}

export async function getProductById(id: string) {
  try {
    const client = await clientPromise
    const db = client.db("bucci")

    const product = await db.collection("products").findOne({ _id: new ObjectId(id) })

    return product
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error)
    throw error
  }
}

export async function createProduct(productData: Omit<Product, "_id" | "createdAt" | "updatedAt">) {
  try {
    const client = await clientPromise
    const db = client.db("bucci")

    const newProduct = {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("products").insertOne(newProduct)

    return {
      _id: result.insertedId,
      ...newProduct,
    }
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}

export async function updateProduct(id: string, productData: Partial<Product>) {
  try {
    const client = await clientPromise
    const db = client.db("bucci")

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...productData,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      throw new Error(`Product with ID ${id} not found`)
    }

    return await getProductById(id)
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error)
    throw error
  }
}

export async function deleteProduct(id: string) {
  try {
    const client = await clientPromise
    const db = client.db("bucci")

    const result = await db.collection("products").deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      throw new Error(`Product with ID ${id} not found`)
    }

    return { success: true }
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error)
    throw error
  }
}

