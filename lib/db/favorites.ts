import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function getUserFavorites(userId: string) {
  try {
    const client = await clientPromise
    const db = client.db("bucci")

    let favorites = await db.collection("favorites").findOne({ userId: new ObjectId(userId) })

    // If favorites doesn't exist, create an empty one
    if (!favorites) {
      const newFavorites = {
        userId: new ObjectId(userId),
        productIds: [],
      }

      await db.collection("favorites").insertOne(newFavorites)
      favorites = newFavorites
    }

    // Populate product details
    if (favorites.productIds.length > 0) {
      const products = await db
        .collection("products")
        .find({ _id: { $in: favorites.productIds } })
        .toArray()

      favorites.products = products
    } else {
      favorites.products = []
    }

    return favorites
  } catch (error) {
    console.error(`Error fetching favorites for user with ID ${userId}:`, error)
    throw error
  }
}

export async function addToFavorites(userId: string, productId: string) {
  try {
    const client = await clientPromise
    const db = client.db("bucci")

    // Check if product exists
    const product = await db.collection("products").findOne({ _id: new ObjectId(productId) })

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`)
    }

    // Check if favorites exists
    const favorites = await db.collection("favorites").findOne({ userId: new ObjectId(userId) })

    if (!favorites) {
      // Create new favorites
      await db.collection("favorites").insertOne({
        userId: new ObjectId(userId),
        productIds: [new ObjectId(productId)],
      })
    } else {
      // Check if product is already in favorites
      const productExists = favorites.productIds.some((id) => id.toString() === productId)

      if (!productExists) {
        // Add product to favorites
        await db
          .collection("favorites")
          .updateOne({ userId: new ObjectId(userId) }, { $push: { productIds: new ObjectId(productId) } })
      }
    }

    return await getUserFavorites(userId)
  } catch (error) {
    console.error(`Error adding product to favorites for user with ID ${userId}:`, error)
    throw error
  }
}

export async function removeFromFavorites(userId: string, productId: string) {
  try {
    const client = await clientPromise
    const db = client.db("bucci")

    await db
      .collection("favorites")
      .updateOne({ userId: new ObjectId(userId) }, { $pull: { productIds: new ObjectId(productId) } })

    return await getUserFavorites(userId)
  } catch (error) {
    console.error(`Error removing product from favorites for user with ID ${userId}:`, error)
    throw error
  }
}

