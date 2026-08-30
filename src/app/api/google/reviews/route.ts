import { NextResponse } from "next/server";
import { GBP, getAccessToken, googleConfig, starToNumber } from "@/lib/google";
import type { Review } from "@/lib/types";

export const runtime = "nodejs";

/**
 * Pull live reviews from the connected Google Business Profile.
 *
 * Flow: list accounts → list locations → list reviews for the first location.
 * The reviews endpoint is on the legacy v4 API, which requires your project to
 * be allow-listed. Errors are returned clearly rather than thrown so the UI can
 * explain what's still needed.
 */
export async function GET() {
  const { configured } = googleConfig();
  if (!configured) return NextResponse.json({ error: "Google not configured.", code: "not_configured" }, { status: 400 });

  const token = await getAccessToken();
  if (!token) return NextResponse.json({ error: "Not connected to Google.", code: "not_connected" }, { status: 401 });

  const auth = { Authorization: `Bearer ${token}` };

  try {
    const accRes = await fetch(GBP.accounts, { headers: auth });
    if (!accRes.ok) return NextResponse.json({ error: `Couldn't list accounts (HTTP ${accRes.status}). Your project may not be allow-listed for the Business Profile API yet.`, code: "api" }, { status: 200 });
    const accData = await accRes.json();
    const account = accData.accounts?.[0]?.name;
    if (!account) return NextResponse.json({ error: "No Google Business accounts found for this login.", code: "no_account" }, { status: 200 });

    const locRes = await fetch(GBP.locations(account), { headers: auth });
    const locData = locRes.ok ? await locRes.json() : { locations: [] };
    const location = locData.locations?.[0]?.name;
    if (!location) return NextResponse.json({ error: "No business locations found on this account.", code: "no_location" }, { status: 200 });

    const revRes = await fetch(GBP.reviews(`${account}/${location}`), { headers: auth });
    if (!revRes.ok) return NextResponse.json({ error: `Reviews API returned HTTP ${revRes.status}. The v4 reviews endpoint requires allow-listing.`, code: "api" }, { status: 200 });
    const revData = await revRes.json();

    const reviews: Review[] = (revData.reviews || []).map((r: Record<string, unknown>, i: number) => {
      const reviewer = r.reviewer as { displayName?: string } | undefined;
      const reply = r.reviewReply as { comment?: string } | undefined;
      return {
        id: (r.reviewId as string) || (r.name as string) || `g${i}`,
        author: reviewer?.displayName || "Google user",
        rating: starToNumber((r.starRating as string) || ""),
        text: (r.comment as string) || "",
        date: (r.updateTime as string) || "",
        replied: Boolean(reply?.comment),
        reply: reply?.comment,
      };
    });

    return NextResponse.json({ reviews, location });
  } catch {
    return NextResponse.json({ error: "Failed to reach the Google Business Profile API.", code: "network" }, { status: 200 });
  }
}
