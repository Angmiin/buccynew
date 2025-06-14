import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import clientPromise from "@/lib/mongodb"
import { initializeDatabase } from "@/lib/db/init-db"

// Sample data for seeding the database
const sampleProducts = [
  {
    name: "Silk Blend Blazer",
    description: "Crafted from the finest silk blend, this blazer embodies luxury and sophistication.",
    price: 2450,
    images: [
      "/placeholder.svg?height=800&width=600&text=Silk Blazer 1",
      "/placeholder.svg?height=800&width=600&text=Silk Blazer 2",
    ],
    category: "Outerwear",
    collection: "Fall/Winter",
    gender: "Unisex",
    dimensions: {
      length: "28 inches",
      chest: "42 inches",
      sleeve: "25 inches",
    },
    stock: 12,
    featured: true,
  },
  {
    name: "Cashmere Sweater",
    description: "Luxuriously soft cashmere sweater for ultimate comfort and style.",
    price: 1250,
    images: [
      "/placeholder.svg?height=800&width=600&text=Cashmere Sweater 1",
      "/placeholder.svg?height=800&width=600&text=Cashmere Sweater 2",
    ],
    category: "Tops",
    collection: "Fall/Winter",
    gender: "Unisex",
    dimensions: {
      length: "26 inches",
      chest: "40 inches",
      sleeve: "24 inches",
    },
    stock: 8,
    featured: true,
  },
  {
    name: "Leather Trousers",
    description: "Premium leather trousers with a modern cut and exceptional craftsmanship.",
    price: 1850,
    images: [
      "/placeholder.svg?height=800&width=600&text=Leather Trousers 1",
      "/placeholder.svg?height=800&width=600&text=Leather Trousers 2",
    ],
    category: "Pants",
    collection: "Fall/Winter",
    gender: "Unisex",
    dimensions: {
      waist: "32 inches",
      inseam: "32 inches",
      rise: "10 inches",
    },
    stock: 5,
    featured: true,
  },
  {
    name: "Signature Scarf",
    description: "Iconic patterned scarf made from the finest materials.",
    price: 650,
    images: [
      "/placeholder.svg?height=800&width=600&text=Signature Scarf 1",
      "/placeholder.svg?height=800&width=600&text=Signature Scarf 2",
    ],
    category: "Accessories",
    collection: "All Seasons",
    gender: "Unisex",
    dimensions: {
      length: "72 inches",
      width: "12 inches",
    },
    stock: 20,
    featured: true,
  },
  {
    name: "Designer T-Shirt",
    description: "Premium cotton t-shirt with signature embroidered logo.",
    price: 450,
    images: [
      "/placeholder.svg?height=800&width=600&text=Designer T-Shirt 1",
      "/placeholder.svg?height=800&width=600&text=Designer T-Shirt 2",
    ],
    category: "Tops",
    collection: "Spring/Summer",
    gender: "Unisex",
    dimensions: {
      length: "28 inches",
      chest: "40 inches",
      sleeve: "8 inches",
    },
    stock: 15,
    featured: false,
  },
  {
    name: "Wool Coat",
    description: "Elegant wool coat with satin lining and horn buttons.",
    price: 3200,
    images: [
      "/placeholder.svg?height=800&width=600&text=Wool Coat 1",
      "/placeholder.svg?height=800&width=600&text=Wool Coat 2",
    ],
    category: "Outerwear",
    collection: "Fall/Winter",
    gender: "Unisex",
    dimensions: {
      length: "40 inches",
      chest: "44 inches",
      sleeve: "26 inches",
    },
    stock: 3,
    featured: true,
  },
]

// Sample admin user
const adminUser = {
  name: "Admin User",
  email: "admin@bucci.com",
  password: "Admin123!",
  role: "admin",
}

// Sample regular user
const regularUser = {
  name: "Regular User",
  email: "user@bucci.com",
  password: "User123!",
  role: "customer",
}

export async function GET() {
  try {
    // Initialize database (create collections and indexes)
    await initializeDatabase()

    const client = await clientPromise
    const db = client.db("bucci")

    // Seed users
    const hashedAdminPassword = await hash(adminUser.password, 10)
    const hashedUserPassword = await hash(regularUser.password, 10)

    // Check if users already exist
    const existingAdmin = await db.collection("users").findOne({ email: adminUser.email })
    const existingUser = await db.collection("users").findOne({ email: regularUser.email })

    if (!existingAdmin) {
      await db.collection("users").insertOne({
        ...adminUser,
        password: hashedAdminPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    if (!existingUser) {
      await db.collection("users").insertOne({
        ...regularUser,
        password: hashedUserPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    // Seed products
    const existingProducts = await db.collection("products").countDocuments()

    if (existingProducts === 0) {
      const productsWithTimestamps = sampleProducts.map((product) => ({
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))

      await db.collection("products").insertMany(productsWithTimestamps)
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      credentials: {
        admin: {
          email: adminUser.email,
          password: adminUser.password,
        },
        user: {
          email: regularUser.email,
          password: regularUser.password,
        },
      },
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ success: false, error: "Failed to seed database" }, { status: 500 })
  }
}

