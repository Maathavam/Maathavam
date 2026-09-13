import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

// Whitelisted fields for insert / update
const ALLOWED_FIELDS = [
  "slug", "name", "name_tamil", "image_url",
  "description", "description_tamil",
  "date", "date_tamil", "details", "details_tamil",
] as const;

type AllowedField = typeof ALLOWED_FIELDS[number];

function pickAllowed(body: Record<string, unknown>) {
  const result: Partial<Record<AllowedField, unknown>> = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in body) result[key] = body[key];
  }
  return result;
}

// ── Simple in-memory rate limiter for auth (5 attempts/min per IP) ────────────
const authRateMap = new Map<string, { count: number; reset: number }>();
function checkAuthRate(ip: string): boolean {
  const now = Date.now();
  const entry = authRateMap.get(ip);
  if (!entry || now > entry.reset) {
    authRateMap.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

function getIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

// GET /api/events — fetch all Supabase events (public)
export async function GET() {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ events: data });
}

// POST /api/events — create a new event (admin only)
export async function POST(req: NextRequest) {
  const ip = getIp(req);
  if (!checkAuthRate(ip)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const secret = req.headers.get("x-admin-secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawBody = await req.json();
  const body = pickAllowed(rawBody);
  const { slug, name, name_tamil } = body as Record<string, string>;

  if (!slug || !name || !name_tamil) {
    return NextResponse.json(
      { error: "slug, name, name_tamil are required" },
      { status: 400 }
    );
  }

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("events")
    .insert([body])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ event: data }, { status: 201 });
}

// PATCH /api/events?id=xxx — update an event (admin only)
export async function PATCH(req: NextRequest) {
  const ip = getIp(req);
  if (!checkAuthRate(ip)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const secret = req.headers.get("x-admin-secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const rawBody = await req.json();
  const body = pickAllowed(rawBody); // only whitelisted fields

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("events")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ event: data });
}

// DELETE /api/events?id=xxx — delete an event (admin only)
export async function DELETE(req: NextRequest) {
  const ip = getIp(req);
  if (!checkAuthRate(ip)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const secret = req.headers.get("x-admin-secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const supabase = getServiceClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
