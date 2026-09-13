import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// POST /api/upload — upload event image to Supabase Storage
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Failed to parse form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // File size guard
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: `File too large. Maximum size is 5MB (received ${(file.size / 1024 / 1024).toFixed(1)}MB).` },
      { status: 413 }
    );
  }

  // Basic MIME type check
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const supabase = getServiceClient();
  const { data: uploadData, error } = await supabase.storage
    .from("event-images")
    .upload(filename, buffer, { contentType: file.type, upsert: false });

  if (error) {
    console.error("[upload] Supabase storage error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage
    .from("event-images")
    .getPublicUrl(uploadData.path);

  return NextResponse.json({ url: urlData.publicUrl });
}
