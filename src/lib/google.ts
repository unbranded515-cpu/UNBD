import { cookies } from "next/headers";

/**
 * Google Business Profile integration helpers.
 *
 * This wires the full OAuth + review-sync flow. It becomes live once you:
 *   1. Create OAuth credentials in Google Cloud Console
 *   2. Get your project allow-listed for the Business Profile APIs
 *      (https://developers.google.com/my-business — approval can take weeks)
 *   3. Set GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REDIRECT_URI in .env
 *
 * Until then every route reports `configured: false` and the app stays in
 * draft mode. Tokens are stored in httpOnly cookies — fine for single-business
 * testing; move to a database when you add multi-user accounts.
 */

export const GOOGLE_SCOPE = "https://www.googleapis.com/auth/business.manage";
const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

export function googleConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/google/callback";
  return { clientId, clientSecret, redirectUri, configured: Boolean(clientId && clientSecret) };
}

export function buildAuthUrl(state: string): string {
  const { clientId, redirectUri } = googleConfig();
  const p = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: GOOGLE_SCOPE,
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `${AUTH_URL}?${p.toString()}`;
}

export async function exchangeCode(code: string) {
  const { clientId, clientSecret, redirectUri } = googleConfig();
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) throw new Error(`Token exchange failed (${res.status})`);
  return (await res.json()) as { access_token: string; refresh_token?: string; expires_in: number };
}

async function refresh(refreshToken: string): Promise<string> {
  const { clientId, clientSecret } = googleConfig();
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`Token refresh failed (${res.status})`);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  const jar = cookies();
  jar.set("g_access", data.access_token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: data.expires_in });
  jar.set("g_expiry", String(Date.now() + data.expires_in * 1000), { httpOnly: true, sameSite: "lax", path: "/" });
  return data.access_token;
}

export function isConnected(): boolean {
  return Boolean(cookies().get("g_access")?.value || cookies().get("g_refresh")?.value);
}

/** Returns a valid access token, refreshing if expired. null if not connected. */
export async function getAccessToken(): Promise<string | null> {
  const jar = cookies();
  const access = jar.get("g_access")?.value;
  const expiry = Number(jar.get("g_expiry")?.value || 0);
  if (access && Date.now() < expiry - 60_000) return access;
  const refreshToken = jar.get("g_refresh")?.value;
  if (refreshToken) {
    try {
      return await refresh(refreshToken);
    } catch {
      return null;
    }
  }
  return access || null;
}

/** Google Business Profile API base endpoints (v4 reviews require allow-listing). */
export const GBP = {
  accounts: "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
  locations: (account: string) => `https://mybusinessbusinessinformation.googleapis.com/v1/${account}/locations?readMask=name,title`,
  reviews: (name: string) => `https://mybusiness.googleapis.com/v4/${name}/reviews`,
  reply: (reviewName: string) => `https://mybusiness.googleapis.com/v4/${reviewName}/reply`,
};

const STAR: Record<string, number> = { STAR_RATING_UNSPECIFIED: 0, ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
export function starToNumber(s: string): number {
  return STAR[s] ?? 0;
}
