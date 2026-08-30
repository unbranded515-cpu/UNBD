import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST() {
  const jar = cookies();
  for (const c of ["g_access", "g_refresh", "g_expiry", "g_state"]) jar.delete(c);
  return NextResponse.json({ ok: true });
}
