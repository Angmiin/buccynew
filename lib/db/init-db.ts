import clientPromise from "@/lib/mongodb"

export async function initializeDatabase() {
  try {
    const client = await clientPromise
    const db = client.db("bucci")

    // Create collections if they don't exist
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((c) => c.name)

    // Define collections to create
    const requiredCollections = ["users", "products", "orders", "reviews", "carts", "favorites"]

    // Create collections that don't exist
    for (const collection of requiredCollections) {
      if (!collectionNames.includes(collection)) {
        await db.createCollection(collection)
        console.log(`Created collection: ${collection}`)
      }
    }

    // Create indexes for better query performance
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("products").createIndex({ name: 1 })
    await db.collection("products").createIndex({ category: 1 })
    await db.collection("products").createIndex({ collection: 1 })
    await db.collection("products").createIndex({ gender: 1 })
    await db.collection("products").createIndex({ price: 1 })
    await db.collection("orders").createIndex({ userId: 1 })
    await db.collection("reviews").createIndex({ productId: 1 })
    await db.collection("carts").createIndex({ userId: 1 }, { unique: true })
    await db.collection("favorites").createIndex({ userId: 1 }, { unique: true })

    console.log("Database initialized successfully")
    return true
  } catch (error) {
    console.error("Failed to initialize database:", error)
    return false
  }
}

