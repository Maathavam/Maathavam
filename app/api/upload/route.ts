import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

// POST /api/upload — upload event image to Supabase Storage
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (secret !== process.env.ADMIN_SECRET) {
    console.error("[upload] Unauthorized — secret mismatch");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch (e) {
    console.error("[upload] Failed to parse formData:", e);
    return NextResponse.json({ error: "Failed to parse form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    console.error("[upload] No file in form data");
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  console.log("[upload] File received:", file.name, file.type, file.size, "bytes");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const supabase = getServiceClient();

  const { data: uploadData, error } = await supabase.storage
    .from("event-images")
    .upload(filename, buffer, { contentType: file.type, upsert: false });

  if (error) {
    console.error("[upload] Supabase storage error:", error.message, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log("[upload] Upload success:", uploadData.path);

  const { data: urlData } = supabase.storage
    .from("event-images")
    .getPublicUrl(filename);

  return NextResponse.json({ url: urlData.publicUrl });
}
