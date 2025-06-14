import type { ObjectId } from "mongodb"

// User Collection Schema
export interface User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  role: "admin" | "customer"
  addresses?: Address[]
  createdAt: Date
  updatedAt: Date
}

// Address Schema (embedded in User)
export interface Address {
  _id?: ObjectId
  name: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  isDefault: boolean
}

// Product Collection Schema
export interface Product {
  _id?: ObjectId
  name: string
  description: string
  price: number
  images: string[]
  category: string
  collection: string
  gender: "Men" | "Women" | "Unisex"
  dimensions: Record<string, string>
  stock: number
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

// Order Collection Schema
export interface Order {
  _id?: ObjectId
  userId: ObjectId
  items: OrderItem[]
  totalAmount: number
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled"
  shippingAddress: Address
  paymentMethod: string
  createdAt: Date
  updatedAt: Date
}

// Order Item Schema (embedded in Order)
export interface OrderItem {
  productId: ObjectId
  name: string
  price: number
  quantity: number
  size: string
  color: string
}

// Review Collection Schema
export interface Review {
  _id?: ObjectId
  productId: ObjectId
  userId: ObjectId
  userName: string
  rating: number
  comment: string
  createdAt: Date
}

// Cart Collection Schema
export interface Cart {
  _id?: ObjectId
  userId: ObjectId
  items: CartItem[]
  updatedAt: Date
}

// Cart Item Schema (embedded in Cart)
export interface CartItem {
  productId: ObjectId
  quantity: number
  size: string
  color: string
}

// Favorites Collection Schema
export interface Favorites {
  _id?: ObjectId
  userId: ObjectId
  productIds: ObjectId[]
}

