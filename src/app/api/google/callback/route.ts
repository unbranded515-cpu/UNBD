import { NextRequest, NextResponse } from "next/server";
import { exchangeCode } from "@/lib/google";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const jar = cookies();
  const expected = jar.get("g_state")?.value;

  const home = new URL("/reviews", url.origin);

  if (error) {
    home.searchParams.set("google", "denied");
    return NextResponse.redirect(home);
  }
  if (!code || !state || state !== expected) {
    home.searchParams.set("google", "error");
    return NextResponse.redirect(home);
  }

  try {
    const tokens = await exchangeCode(code);
    jar.set("g_access", tokens.access_token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: tokens.expires_in });
    jar.set("g_expiry", String(Date.now() + tokens.expires_in * 1000), { httpOnly: true, sameSite: "lax", path: "/" });
    if (tokens.refresh_token) {
      jar.set("g_refresh", tokens.refresh_token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 180 });
    }
    jar.delete("g_state");
    home.searchParams.set("google", "connected");
  } catch {
    home.searchParams.set("google", "error");
  }
  return NextResponse.redirect(home);
}
