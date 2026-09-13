import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (secret === process.env.ADMIN_SECRET) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
