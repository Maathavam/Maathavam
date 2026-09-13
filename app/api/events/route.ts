import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

// GET /api/events — fetch all Supabase events
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
  // Simple secret key check
  const secret = req.headers.get("x-admin-secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    slug, name, name_tamil, image_url,
    description, description_tamil,
    date, date_tamil, details, details_tamil,
  } = body;

  if (!slug || !name || !name_tamil) {
    return NextResponse.json({ error: "slug, name, name_tamil are required" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("events")
    .insert([{ slug, name, name_tamil, image_url, description, description_tamil, date, date_tamil, details, details_tamil }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ event: data }, { status: 201 });
}

// PATCH /api/events?id=xxx — update an event
export async function PATCH(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const body = await req.json();
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

// DELETE /api/events?id=xxx — delete an event
export async function DELETE(req: NextRequest) {
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
