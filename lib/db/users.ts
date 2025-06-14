import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { User, Address } from "@/types/mongodb"
import { hash, compare } from "bcryptjs"

export async function getUserById(id: string) {
  try {
    const client = await clientPromise
    const db = client.db("bucci")

    const user = await db.collection("users").findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } })

    return user
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error)
    throw error
  }
}

export async function getUserByEmail(email: string) {
  try {
    const client = await clientPromise
    const db = client.db("bucci")

    const user = await db.collection("users").findOne({ email })

    return user
  } catch (error) {
    console.error(`Error fetching user with email ${email}:`, error)
    throw error
  }
}

export async function createUser(userData: Omit<User, "_id" | "createdAt" | "updatedAt">) {
  try {
    const client = await clientPromise
    const db = client.db("bucci")

    // Check if user already exists
    const existingUser = await getUserByEmail(userData.email)
    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Hash password
    const hashedPassword = await hash(userData.password, 10)

    const newUser = {
      ...userData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("users").insertOne(newUser)

    const { password, ...userWithoutPassword } = newUser

    return {
      _id: result.insertedId,
      ...userWithoutPassword,
    }
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function updateUser(id: string, userData: Partial<User>) {
  try {
    const client = await clientPromise
    const db = client.db("bucci")

    // If updating password, hash it
    if (userData.password) {
      userData.password = await hash(userData.password, 10)
    }

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...userData,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      throw new Error(`User with ID ${id} not found`)
    }

    return await getUserById(id)
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error)
    throw error
  }
}

export async function addUserAddress(userId: string, address: Omit<Address, "_id">) {
  try {
    const client = await clientPromise
    const db = client.db("bucci")

    // If this is the default address, unset any existing default
    if (address.isDefault) {
      await db
        .collection("users")
        .updateOne(
          { _id: new ObjectId(userId) },
          { $set: { "addresses.$[elem].isDefault": false } },
          { arrayFilters: [{ "elem.isDefault": true }] },
        )
    }

    // Add the new address
    const addressWithId = {
      ...address,
      _id: new ObjectId(),
    }

    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, { $push: { addresses: addressWithId } })

    if (result.matchedCount === 0) {
      throw new Error(`User with ID ${userId} not found`)
    }

    return addressWithId
  } catch (error) {
    console.error(`Error adding address for user with ID ${userId}:`, error)
    throw error
  }
}

export async function verifyUserPassword(userId: string, password: string) {
  try {
    const client = await clientPromise
    const db = client.db("bucci")

    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })

    if (!user) {
      throw new Error(`User with ID ${userId} not found`)
    }

    const isPasswordValid = await compare(password, user.password)

    return isPasswordValid
  } catch (error) {
    console.error(`Error verifying password for user with ID ${userId}:`, error)
    throw error
  }
}

