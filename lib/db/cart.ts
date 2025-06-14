import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import type { CartItem } from "@/types/mongodb";

export async function getUserCart(userId: string) {
  try {
    const client = await clientPromise;
    const db = client.db("bucci");

    let cart = await db
      .collection("carts")
      .findOne({ userId: new ObjectId(userId) });

    // If cart doesn't exist, create an empty one
    if (!cart) {
      const newCart = {
        userId: new ObjectId(userId),
        items: [],
        updatedAt: new Date(),
      };

      await db.collection("carts").insertOne(newCart);
      cart = newCart;
    }

    // Populate product details for each cart item
    if (cart.items.length > 0) {
      const productIds = cart.items.map((item) => new ObjectId(item.productId));

      const products = await db
        .collection("products")
        .find({ _id: { $in: productIds } })
        .toArray();

      const productsMap = products.reduce((map, product) => {
        map[product._id.toString()] = product;
        return map;
      }, {});

      cart.items = cart.items.map((item) => {
        const product = productsMap[item.productId.toString()];
        return {
          ...item,
          product: product
            ? {
                _id: product._id,
                name: product.name,
                price: product.price,
                images: product.images,
              }
            : null,
        };
      });
    }

    return cart;
  } catch (error) {
    console.error(`Error fetching cart for user with ID ${userId}:`, error);
    throw error;
  }
}

export async function addToCart(
  userId: string,
  item: Omit<CartItem, "productId"> & { productId: string }
) {
  try {
    const client = await clientPromise;
    const db = client.db("bucci");

    const productId = new ObjectId(item.productId);

    // Check if product exists and has enough stock
    const product = await db.collection("products").findOne({ _id: productId });

    if (!product) {
      throw new Error(`Product with ID ${item.productId} not found`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`Not enough stock for product with ID ${item.productId}`);
    }

    // Check if cart exists
    const cart = await db
      .collection("carts")
      .findOne({ userId: new ObjectId(userId) });

    if (!cart) {
      // Create new cart
      await db.collection("carts").insertOne({
        userId: new ObjectId(userId),
        items: [
          {
            productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          },
        ],
        updatedAt: new Date(),
      });
    } else {
      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(
        (cartItem) =>
          cartItem.productId.toString() === item.productId &&
          cartItem.size === item.size &&
          cartItem.color === item.color
      );

      if (existingItemIndex !== -1) {
        // Update existing item quantity
        await db.collection("carts").updateOne(
          {
            userId: new ObjectId(userId),
            "items.productId": productId,
            "items.size": item.size,
            "items.color": item.color,
          },
          {
            $inc: { "items.$.quantity": item.quantity },
            $set: { updatedAt: new Date() },
          }
        );
      } else {
        // Add new item to cart
        await db.collection("carts").updateOne(
          { userId: new ObjectId(userId) },
          {
            $push: {
              items: {
                productId,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
              },
            },
            $set: { updatedAt: new Date() },
          }
        );
      }
    }

    return await getUserCart(userId);
  } catch (error) {
    console.error(
      `Error adding item to cart for user with ID ${userId}:`,
      error
    );
    throw error;
  }
}

export async function updateCartItem(
  userId: string,
  productId: string,
  size: string,
  color: string,
  quantity: number
) {
  try {
    const client = await clientPromise;
    const db = client.db("bucci");

    if (quantity <= 0) {
      // Remove item from cart if quantity is 0 or negative
      await db.collection("carts").updateOne(
        { userId: new ObjectId(userId) },
        {
          $pull: {
            items: {
              productId: new ObjectId(productId),
              size,
              color,
            },
          },
          $set: { updatedAt: new Date() },
        }
      );
    } else {
      // Update item quantity
      await db.collection("carts").updateOne(
        {
          userId: new ObjectId(userId),
          "items.productId": new ObjectId(productId),
          "items.size": size,
          "items.color": color,
        },
        {
          $set: {
            "items.$.quantity": quantity,
            updatedAt: new Date(),
          },
        }
      );
    }

    return await getUserCart(userId);
  } catch (error) {
    console.error(
      `Error updating cart item for user with ID ${userId}:`,
      error
    );
    throw error;
  }
}

export async function removeFromCart(
  userId: string,
  productId: string,
  size: string,
  color: string
) {
  try {
    const client = await clientPromise;
    const db = client.db("bucci");

    await db.collection("carts").updateOne(
      { userId: new ObjectId(userId) },
      {
        $pull: {
          items: {
            productId: new ObjectId(productId),
            size,
            color,
          },
        },
        $set: { updatedAt: new Date() },
      }
    );

    return await getUserCart(userId);
  } catch (error) {
    console.error(
      `Error removing item from cart for user with ID ${userId}:`,
      error
    );
    throw error;
  }
}

export async function clearCart(userId: string) {
  try {
    const client = await clientPromise;
    const db = client.db("bucci");

    await db.collection("carts").updateOne(
      { userId: new ObjectId(userId) },
      {
        $set: {
          items: [],
          updatedAt: new Date(),
        },
      }
    );

    return { success: true };
  } catch (error) {
    console.error(`Error clearing cart for user with ID ${userId}:`, error);
    throw error;
  }
}

export async function setUserCart(userId: string, items: any[]) {
  try {
    const client = await clientPromise;
    const db = client.db("bucci");
    const itemsWithObjectId = items.map((item) => ({
      ...item,
      productId: new ObjectId(item.productId),
    }));
    await db.collection("carts").updateOne(
      { userId: new ObjectId(userId) },
      {
        $set: {
          items: itemsWithObjectId,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
    return await getUserCart(userId);
  } catch (error) {
    console.error(`Error setting cart for user with ID ${userId}:`, error);
    throw error;
  }
}
