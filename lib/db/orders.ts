import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Order } from "@/types/mongodb"

export async function getOrdersByUserId(userId: string) {
  try {
    const client = await clientPromise
    const db = client.db("bucci")

    const orders = await db
      .collection("orders")
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray()

    return orders
  } catch (error) {
    console.error(`Error fetching orders for user with ID ${userId}:`, error)
    throw error
  }
}

export async function getOrderById(id: string) {
  try {
    const client = await clientPromise
    const db = client.db("bucci")

    const order = await db.collection("orders").findOne({ _id: new ObjectId(id) })

    return order
  } catch (error) {
    console.error(`Error fetching order with ID ${id}:`, error)
    throw error
  }
}

export async function createOrder(orderData: Omit<Order, "_id" | "createdAt" | "updatedAt">) {
  try {
    const client = await clientPromise
    const db = client.db("bucci")

    // Convert string userId to ObjectId if needed
    const userId = typeof orderData.userId === "string" ? new ObjectId(orderData.userId) : orderData.userId

    const newOrder = {
      ...orderData,
      userId,
      status: orderData.status || "Pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("orders").insertOne(newOrder)

    // Clear the user's cart after successful order
    await db.collection("carts").updateOne({ userId }, { $set: { items: [], updatedAt: new Date() } })

    return {
      _id: result.insertedId,
      ...newOrder,
    }
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

export async function updateOrderStatus(id: string, status: Order["status"]) {
  try {
    const client = await clientPromise
    const db = client.db("bucci")

    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      throw new Error(`Order with ID ${id} not found`)
    }

    return await getOrderById(id)
  } catch (error) {
    console.error(`Error updating status for order with ID ${id}:`, error)
    throw error
  }
}

export async function getAllOrders(options: {
  status?: Order["status"]
  limit?: number
  page?: number
}) {
  const { status, limit = 10, page = 1 } = options

  try {
    const client = await clientPromise
    const db = client.db("bucci")

    const query: any = {}
    if (status) query.status = status

    const total = await db.collection("orders").countDocuments(query)

    const orders = await db
      .collection("orders")
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error("Error fetching all orders:", error)
    throw error
  }
}

