import { NextResponse, type NextRequest } from "next/server";
import { getPropertiesByIds } from "@/lib/listings";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_IDS = 50;

/** GET /api/properties?ids=a,b,c — published listings by id, for the device-local saved list. */
export async function GET(request: NextRequest) {
  const ids = [...new Set((request.nextUrl.searchParams.get("ids") ?? "").split(","))]
    .filter(id => UUID.test(id))
    .slice(0, MAX_IDS);
  const properties = await getPropertiesByIds(ids);
  return NextResponse.json({ properties }, { headers: { "Cache-Control": "public, max-age=60" } });
}
