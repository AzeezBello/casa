// app/api/saved-searches/route.ts
import { NextResponse } from "next/server";
import { repository } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const searches = await repository.listSavedSearches(userId);
  return NextResponse.json(searches);
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const payload = await request.json();
  const created = await repository.createSavedSearch(userId, payload);
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId"); // not used for auth here; kept for consistency
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await repository.deleteSavedSearch(id);
  return NextResponse.json({ ok: true });
}
