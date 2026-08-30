"use client";

import { useState } from "react";
import Link from "next/link";
import { useBrand } from "@/lib/useBrand";
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
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<Record<string, string>>({});
  const [adding, setAdding] = useState(false);
  const [newReview, setNewReview] = useState({ author: "", rating: 5, text: "" });

  async function generate(r: Review) {
    setBusy(r.id);
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
        if (data.source === "fallback") setNotice((n) => ({ ...n, [r.id]: "Preview reply (no API key set — add ANTHROPIC_API_KEY for live AI)." }));
      } else {
        setNotice((n) => ({ ...n, [r.id]: data.error || "Couldn't generate a reply." }));
      }
    } catch {
      setNotice((n) => ({ ...n, [r.id]: "Network error — please try again." }));
    } finally {
      setBusy(null);
    }
  }

  function copy(id: string) {
    const text = drafts[id];
    if (!text) return;
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      setNotice((n) => ({ ...n, [id]: "Copied ✓ — paste into Google to reply." }));
    } catch {
      setNotice((n) => ({ ...n, [id]: "Select the text and copy manually." }));
    }
    document.body.removeChild(ta);
  }

  function addReview() {
    if (!newReview.text.trim()) return;
    const r: Review = {
      id: "u" + Date.now(),
      author: newReview.author.trim() || "Anonymous",
      rating: newReview.rating,
      text: newReview.text.trim(),
      date: "just now",
    };
    setReviews((rs) => [r, ...rs]);
    setNewReview({ author: "", rating: 5, text: "" });
    setAdding(false);
  }

  const unreplied = reviews.filter((r) => !drafts[r.id]).length;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="eyebrow">Reviews</span>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Review inbox</h1>
          <p className="mt-2 text-ink2">
            {unreplied} awaiting a reply · replies use{" "}
            <Link href="/settings" className="font-semibold text-coralink hover:underline">your brand voice</Link>.
          </p>
        </div>
        <button className="btn-ghost" onClick={() => setAdding((a) => !a)}>
          {adding ? "Cancel" : "+ Add a review"}
        </button>
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
          <div className="mt-3 flex justify-end">
            <button className="btn-primary" onClick={addReview}>Add to inbox</button>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {reviews.map((r) => {
          const sentiment = sentimentForRating(r.rating);
          return (
            <div key={r.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <b className="font-semibold">{r.author}</b>
                    <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold uppercase ${sentimentStyle[sentiment]}`}>{sentiment}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-sm">
                    <Stars n={r.rating} />
                    <span className="text-muted">· {r.date}</span>
                  </div>
                </div>
                <button className="btn-primary flex-none" disabled={busy === r.id || !ready} onClick={() => generate(r)}>
                  {busy === r.id ? "Writing…" : drafts[r.id] ? "Regenerate" : "Draft reply"}
                </button>
              </div>

              <p className="mt-3 text-[15px] text-ink2">{r.text}</p>

              {drafts[r.id] !== undefined && (
                <div className="mt-4 rounded-xl border border-line bg-paper p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-coralink">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" /></svg>
                    Your reply
                  </div>
                  <textarea
                    className="inp min-h-[92px] bg-surface"
                    value={drafts[r.id]}
                    onChange={(e) => setDrafts((d) => ({ ...d, [r.id]: e.target.value }))}
                  />
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-xs text-muted">{notice[r.id]}</span>
                    <button className="btn-ghost !py-1.5 !text-xs" onClick={() => copy(r.id)}>Copy reply</button>
                  </div>
                </div>
              )}
              {drafts[r.id] === undefined && notice[r.id] && (
                <p className="mt-3 text-xs text-bad">{notice[r.id]}</p>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-8 rounded-xl border border-line bg-surface2 px-4 py-3 text-sm text-ink2">
        <b className="text-ink">Phase 2:</b> connect your Google Business Profile to pull these reviews automatically and post approved replies with one click — no copy-paste.
      </p>
    </div>
  );
}
