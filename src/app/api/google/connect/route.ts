import { NextResponse } from "next/server";
import { buildAuthUrl, googleConfig } from "@/lib/google";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET() {
  const { configured } = googleConfig();
  if (!configured) {
    return NextResponse.json(
      { error: "Google is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env." },
      { status: 400 },
    );
  }
  // CSRF state stored in a cookie and echoed back on the callback.
  const state = crypto.randomUUID();
  cookies().set("g_state", state, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 600 });
  return NextResponse.redirect(buildAuthUrl(state));
}
