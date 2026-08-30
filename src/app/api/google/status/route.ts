import { NextResponse } from "next/server";
import { googleConfig, isConnected } from "@/lib/google";

export const runtime = "nodejs";

export async function GET() {
  const { configured } = googleConfig();
  return NextResponse.json({ configured, connected: configured && isConnected() });
}
