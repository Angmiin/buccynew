import { NextRequest, NextResponse } from "next/server";
import {
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
} from "@/lib/db/favorites";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ favorites: [] });
  const favs = await getUserFavorites(userId);
  return NextResponse.json({ favorites: favs?.products || [] });
}

export async function POST(req: NextRequest) {
  const { userId, product } = await req.json();
  if (!userId || !product)
    return NextResponse.json({ favorites: [] }, { status: 400 });
  await addToFavorites(userId, product.id);
  const favs = await getUserFavorites(userId);
  return NextResponse.json({ favorites: favs?.products || [] });
}

export async function DELETE(req: NextRequest) {
  const { userId, productId } = await req.json();
  if (!userId || !productId)
    return NextResponse.json({ favorites: [] }, { status: 400 });
  await removeFromFavorites(userId, productId);
  const favs = await getUserFavorites(userId);
  return NextResponse.json({ favorites: favs?.products || [] });
}
