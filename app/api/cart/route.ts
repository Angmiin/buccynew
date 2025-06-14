import { NextRequest, NextResponse } from "next/server";
import { getUserCart, setUserCart } from "@/lib/db/cart";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ cart: [] });
  const cart = await getUserCart(userId);
  return NextResponse.json({ cart: cart || [] });
}

export async function POST(req: NextRequest) {
  const { userId, cart } = await req.json();
  if (!userId || !Array.isArray(cart))
    return NextResponse.json({ cart: [] }, { status: 400 });
  await setUserCart(userId, cart);
  return NextResponse.json({ cart });
}
