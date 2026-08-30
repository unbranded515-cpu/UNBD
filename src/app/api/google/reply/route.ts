import { NextRequest, NextResponse } from "next/server";
import { GBP, getAccessToken, googleConfig } from "@/lib/google";

export const runtime = "nodejs";

/**
 * Post (or update) a reply to a Google review.
 * `reviewName` is the full v4 resource name:
 *   accounts/{id}/locations/{id}/reviews/{id}
 */
export async function POST(req: NextRequest) {
  const { configured } = googleConfig();
  if (!configured) return NextResponse.json({ error: "Google not configured." }, { status: 400 });

  const token = await getAccessToken();
  if (!token) return NextResponse.json({ error: "Not connected to Google." }, { status: 401 });

  let reviewName: string, comment: string;
  try {
    const b = await req.json();
    reviewName = String(b.reviewName || "");
    comment = String(b.comment || "");
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }
  if (!reviewName || !comment.trim()) return NextResponse.json({ error: "Missing reviewName or comment." }, { status: 400 });

  try {
    const res = await fetch(GBP.reply(reviewName), {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ comment }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: `Google rejected the reply (HTTP ${res.status}).` }, { status: 200 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to reach Google." }, { status: 200 });
  }
}
