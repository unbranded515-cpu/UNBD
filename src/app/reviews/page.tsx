"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useBrand } from "@/lib/useBrand";
import { GoogleConnect } from "@/components/GoogleConnect";
import { SAMPLE_REVIEWS } from "@/lib/sampleReviews";
import { sentimentForRating, type Review, type Sentiment } from "@/lib/types";

function Stars({ n }: { n: number }) {
  return (
    <span className="text-warn" aria-label={`${n} star${n === 1 ? "" : "s"}`}>
      {"★".repeat(n)}
      <span className="text-line">{"★".repeat(5 - n)}</span>
    </span>
  );
}

const sentimentStyle: Record<Sentiment, string> = {
  positive: "bg-good/15 text-good",
  neutral: "bg-warn/15 text-warn",
  negative: "bg-bad/15 text-bad",
};

export default function ReviewsPage() {
  const [brand, , ready] = useBrand();
  const [reviews, setReviews] = useState<Review[]>(SAMPLE_REVIEWS);
  const [busy, setBusy] = useState<string | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<Record<string, string>>({});
  const [connected, setConnected] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newReview, setNewReview] = useState({ author: "", rating: 5, text: "" });

  useEffect(() => {
    fetch("/api/google/status").then((r) => r.json()).then((s) => setConnected(Boolean(s.connected))).catch(() => {});
  }, []);

  const unreplied = reviews.filter((r) => !r.replied);
  const done = reviews.filter((r) => r.replied);

  async function generate(r: Review): Promise<string | null> {
    setNotice((n) => ({ ...n, [r.id]: "" }));
    try {
      const res = await fetch("/api/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review: { author: r.author, rating: r.rating, text: r.text }, brand }),
      });
      const data = await res.json();
      if (data.reply) {
        setDrafts((d) => ({ ...d, [r.id]: data.reply }));
        if (data.source === "fallback") setNotice((n) => ({ ...n, [r.id]: "Preview reply — add ANTHROPIC_API_KEY for live AI." }));
        return data.reply;
      }
      setNotice((n) => ({ ...n, [r.id]: data.error || "Couldn't generate a reply." }));
      return null;
    } catch {
      setNotice((n) => ({ ...n, [r.id]: "Network error — please try again." }));
      return null;
    }
  }

  async function generateOne(r: Review) {
    setBusy(r.id);
    await generate(r);
    setBusy(null);
  }

  async function draftAll() {
    setBulkBusy(true);
    for (const r of reviews.filter((x) => !x.replied && drafts[x.id] === undefined)) {
      setBusy(r.id);
      await generate(r);
    }
    setBusy(null);
    setBulkBusy(false);
  }

  function markReplied(id: string, text: string) {
    setReviews((rs) => rs.map((r) => (r.id === id ? { ...r, replied: true, reply: text } : r)));
  }

  async function approve(r: Review) {
    const text = drafts[r.id];
    if (!text) return;
    setBusy(r.id);
    // Live review on a connected account → post straight to Google.
    if (connected && r.id.includes("reviews/")) {
      try {
        const res = await fetch("/api/google/reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviewName: r.id, comment: text }),
        });
        const data = await res.json();
        if (data.ok) markReplied(r.id, text);
        else setNotice((n) => ({ ...n, [r.id]: data.error || "Couldn't post to Google." }));
      } catch {
        setNotice((n) => ({ ...n, [r.id]: "Network error posting to Google." }));
      } finally {
        setBusy(null);
      }
      return;
    }
    // Draft mode → copy the approved reply so it can be pasted into Google.
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch {
      /* ignore */
    }
    document.body.removeChild(ta);
    markReplied(r.id, text);
    setBusy(null);
  }

  function addReview() {
    if (!newReview.text.trim()) return;
    setReviews((rs) => [{ id: "u" + Date.now(), author: newReview.author.trim() || "Anonymous", rating: newReview.rating, text: newReview.text.trim(), date: "just now" }, ...rs]);
    setNewReview({ author: "", rating: 5, text: "" });
    setAdding(false);
  }

  const approveLabel = connected ? "Approve & post to Google" : "Approve & copy reply";

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="eyebrow">Reviews</span>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Review inbox</h1>
          <p className="mt-2 text-ink2">
            AI drafts each reply in <Link href="/settings" className="font-semibold text-coralink hover:underline">your brand voice</Link>. You approve, then it posts.
          </p>
        </div>
        <button className="btn-ghost" onClick={() => setAdding((a) => !a)}>{adding ? "Cancel" : "+ Add a review"}</button>
      </div>

      <GoogleConnect onSync={(live) => live.length && setReviews(live)} />

      {/* Summary bar with the unreplied counter */}
      <div className="mt-5 flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-surface2 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-coral font-display text-2xl font-extrabold text-white">{unreplied.length}</span>
          <div>
            <p className="font-display text-lg font-extrabold leading-none">{unreplied.length === 0 ? "All caught up 🎉" : `${unreplied.length} unreplied review${unreplied.length === 1 ? "" : "s"}`}</p>
            <p className="text-sm text-muted">{done.length} replied{connected ? " · synced from Google" : ""}</p>
          </div>
        </div>
        {unreplied.length > 0 && (
          <button className="btn-primary ml-auto" onClick={draftAll} disabled={bulkBusy || !ready}>
            {bulkBusy ? "Drafting…" : "Draft all replies"}
          </button>
        )}
      </div>

      {adding && (
        <div className="card mt-5">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input className="inp" placeholder="Reviewer name" value={newReview.author} onChange={(e) => setNewReview({ ...newReview, author: e.target.value })} />
            <select className="inp sm:w-32" value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}>
              {[5, 4, 3, 2, 1].map((n) => (<option key={n} value={n}>{n} ★</option>))}
            </select>
          </div>
          <textarea className="inp mt-3 min-h-[80px]" placeholder="Paste the review text…" value={newReview.text} onChange={(e) => setNewReview({ ...newReview, text: e.target.value })} />
          <div className="mt-3 flex justify-end"><button className="btn-primary" onClick={addReview}>Add to inbox</button></div>
        </div>
      )}

      {/* Unreplied reviews — the work queue */}
      <div className="mt-6 flex flex-col gap-4">
        {unreplied.map((r) => {
          const sentiment = sentimentForRating(r.rating);
          const draft = drafts[r.id];
          return (
            <div key={r.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <b className="font-semibold">{r.author}</b>
                    <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold uppercase ${sentimentStyle[sentiment]}`}>{sentiment}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-sm"><Stars n={r.rating} /><span className="text-muted">· {r.date}</span></div>
                </div>
                {draft === undefined && (
                  <button className="btn-ghost flex-none" disabled={busy === r.id || !ready} onClick={() => generateOne(r)}>
                    {busy === r.id ? "Writing…" : "Suggest reply"}
                  </button>
                )}
              </div>

              <p className="mt-3 text-[15px] text-ink2">{r.text}</p>

              {draft !== undefined && (
                <div className="mt-4 rounded-xl border border-line bg-surface2 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-coralink">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" /></svg>
                    AI-suggested reply — edit if you like
                  </div>
                  <textarea className="inp min-h-[92px]" value={draft} onChange={(e) => setDrafts((d) => ({ ...d, [r.id]: e.target.value }))} />
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-muted">{notice[r.id]}</span>
                    <div className="flex gap-2">
                      <button className="btn-ghost !py-2 !text-xs" disabled={busy === r.id} onClick={() => generateOne(r)}>Regenerate</button>
                      <button className="btn-primary !py-2 !text-xs" disabled={busy === r.id} onClick={() => approve(r)}>
                        {busy === r.id ? "Posting…" : approveLabel}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {draft === undefined && notice[r.id] && <p className="mt-3 text-xs text-bad">{notice[r.id]}</p>}
            </div>
          );
        })}
      </div>

      {/* Replied — done pile */}
      {done.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 font-display text-lg font-extrabold text-muted">Replied ({done.length})</h2>
          <div className="flex flex-col gap-3">
            {done.map((r) => (
              <div key={r.id} className="rounded-xl border border-line bg-surface p-4 opacity-90">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-good">✓ Replied</span>
                  <b>{r.author}</b>
                  <Stars n={r.rating} />
                </div>
                <p className="mt-1 text-sm text-muted">{r.text}</p>
                {r.reply && <p className="mt-2 border-l-2 border-coral pl-3 text-sm text-ink2">{r.reply}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {!connected && (
        <p className="mt-8 rounded-xl border border-line bg-surface2 px-4 py-3 text-sm text-ink2">
          <b className="text-ink">Not connected yet:</b> replies are copied for you to paste into Google. Once you connect your Google Business Profile above, unreplied reviews sync automatically and <b>Approve</b> posts the reply straight to Google.
        </p>
      )}
    </div>
  );
}
