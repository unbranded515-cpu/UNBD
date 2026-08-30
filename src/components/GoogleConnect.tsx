"use client";

import { useEffect, useState } from "react";
import type { Review } from "@/lib/types";

export function GoogleConnect({ onSync }: { onSync: (reviews: Review[]) => void }) {
  const [status, setStatus] = useState<{ configured: boolean; connected: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function refresh() {
    try {
      const r = await fetch("/api/google/status");
      setStatus(await r.json());
    } catch {
      setStatus({ configured: false, connected: false });
    }
  }

  useEffect(() => {
    refresh();
    const p = new URLSearchParams(window.location.search).get("google");
    if (p === "connected") setMsg("Connected to Google ✓");
    else if (p === "denied") setMsg("Google connection was cancelled.");
    else if (p === "error") setMsg("Something went wrong connecting to Google.");
    if (p) window.history.replaceState({}, "", window.location.pathname);
  }, []);

  async function sync() {
    setBusy(true);
    setMsg("");
    try {
      const r = await fetch("/api/google/reviews");
      const data = await r.json();
      if (data.reviews) {
        onSync(data.reviews);
        setMsg(`Synced ${data.reviews.length} live review${data.reviews.length === 1 ? "" : "s"} from Google.`);
      } else {
        setMsg(data.error || "Couldn't sync reviews.");
      }
    } catch {
      setMsg("Network error while syncing.");
    } finally {
      setBusy(false);
    }
  }

  async function disconnect() {
    await fetch("/api/google/disconnect", { method: "POST" });
    setMsg("Disconnected from Google.");
    refresh();
  }

  if (!status) return null;

  // Not set up in .env → guidance, not a dead button.
  if (!status.configured) {
    return (
      <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface2 px-4 py-3 text-sm">
        <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-white">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#EA4335"><path d="M12 11v2h5.5A5.5 5.5 0 1 1 12 6.5c1.4 0 2.7.5 3.7 1.4l1.5-1.5A7.5 7.5 0 1 0 19.5 12H12z" /></svg>
        </span>
        <div className="flex-1">
          <b className="text-ink">Connect Google Business Profile</b>
          <p className="text-muted">Add <code className="font-mono text-coralink">GOOGLE_CLIENT_ID</code> &amp; <code className="font-mono text-coralink">GOOGLE_CLIENT_SECRET</code> to <code className="font-mono">.env</code> to sync reviews and post replies automatically. (Requires Business Profile API access — see README.)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface2 px-4 py-3 text-sm">
      <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-white">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#4285F4"><path d="M12 11v2h5.5A5.5 5.5 0 1 1 12 6.5c1.4 0 2.7.5 3.7 1.4l1.5-1.5A7.5 7.5 0 1 0 19.5 12H12z" /></svg>
      </span>
      {status.connected ? (
        <>
          <div className="flex-1"><b className="text-good">Google connected</b><p className="text-muted">{msg || "Pull your latest reviews from Google."}</p></div>
          <button className="btn-primary !py-2 !text-xs" onClick={sync} disabled={busy}>{busy ? "Syncing…" : "Sync live reviews"}</button>
          <button className="btn-ghost !py-2 !text-xs" onClick={disconnect}>Disconnect</button>
        </>
      ) : (
        <>
          <div className="flex-1"><b className="text-ink">Connect your Google Business Profile</b><p className="text-muted">{msg || "Sync reviews and post replies with one click."}</p></div>
          <a className="btn-primary !py-2 !text-xs" href="/api/google/connect">Connect Google</a>
        </>
      )}
    </div>
  );
}
