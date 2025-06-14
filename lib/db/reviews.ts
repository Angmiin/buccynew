import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Review } from "@/types/mongodb"

export async function getProductReviews(productId: string) {
  try {
    const client = await clientPromise
    const db = client.db("bucci")

    const reviews = await db
      .collection("reviews")
      .find({ productId: new ObjectId(productId) })
      .sort({ createdAt: -1 })
      .toArray()

    return reviews
  } catch (error) {
    console.error(`Error fetching reviews for product with ID ${productId}:`, error)
    throw error
  }
}

export async function getUserReviews(userId: string) {
  try {
    const client = await clientPromise
    const db = client.db("bucci")

    const reviews = await db
      .collection("reviews")
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray()

    return reviews
  } catch (error) {
    console.error(`Error fetching reviews for user with ID ${userId}:`, error)
    throw error
  }
}

export async function createReview(reviewData: Omit<Review, "_id" | "createdAt">) {
  try {
    const client = await clientPromise
    const db = client.db("bucci")

    // Convert string IDs to ObjectIds if needed
    const productId =
      typeof reviewData.productId === "string" ? new ObjectId(reviewData.productId) : reviewData.productId

    const userId = typeof reviewData.userId === "string" ? new ObjectId(reviewData.userId) : reviewData.userId

    // Check if user has already reviewed this product
    const existingReview = await db.collection("reviews").findOne({
      productId,
      userId,
    })

    if (existingReview) {
      throw new Error("User has already reviewed this product")
    }

    const newReview = {
      ...reviewData,
      productId,
      userId,
      createdAt: new Date(),
    }

    const result = await db.collection("reviews").insertOne(newReview)

    // Update product rating
    const allReviews = await getProductReviews(productId.toString())
    const avgRating = allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length

    await db
      .collection("products")
      .updateOne({ _id: productId }, { $set: { rating: avgRating, reviewCount: allReviews.length } })

    return {
      _id: result.insertedId,
      ...newReview,
    }
  } catch (error) {
    console.error("Error creating review:", error)
    throw error
  }
}

export async function deleteReview(id: string) {
  try {
    const client = await clientPromise
    const db = client.db("bucci")

    // Get the review to find the product ID
    const review = await db.collection("reviews").findOne({ _id: new ObjectId(id) })

    if (!review) {
      throw new Error(`Review with ID ${id} not found`)
    }

    // Delete the review
    await db.collection("reviews").deleteOne({ _id: new ObjectId(id) })

    // Update product rating
    const productId = review.productId
    const allReviews = await getProductReviews(productId.toString())

    if (allReviews.length > 0) {
      const avgRating = allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length

      await db
        .collection("products")
        .updateOne({ _id: productId }, { $set: { rating: avgRating, reviewCount: allReviews.length } })
    } else {
      // No reviews left, remove rating
      await db
        .collection("products")
        .updateOne({ _id: productId }, { $unset: { rating: "" }, $set: { reviewCount: 0 } })
    }

    return { success: true }
  } catch (error) {
    console.error(`Error deleting review with ID ${id}:`, error)
    throw error
  }
}

