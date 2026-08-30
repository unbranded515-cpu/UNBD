import Link from "next/link";

function Tile({ href, title, desc, tag, icon }: { href: string; title: string; desc: string; tag?: string; icon: string }) {
  return (
    <Link href={href} className="card group transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface2 text-coral">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={icon} /></svg>
        </span>
        {tag && <span className="rounded-md bg-coral/12 px-2 py-1 font-mono text-[10px] font-bold text-coralink">{tag}</span>}
      </div>
      <h3 className="font-display text-lg font-extrabold">{title}</h3>
      <p className="mt-1.5 text-sm text-ink2">{desc}</p>
      <span className="mt-3 inline-block text-sm font-bold text-coralink group-hover:underline">Open →</span>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <span className="eyebrow">Dashboard</span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Get found on Google. Get reviewed. Reply to everyone.</h1>
      <p className="mt-3 max-w-2xl text-ink2">
        Unbranded turns your reputation into rankings. Reply to every review in your brand voice, audit your local SEO, and know exactly what to fix — all from one place.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Tile href="/reviews" title="Review replies" tag="FLAGSHIP" desc="Auto-draft warm, human, keyword-smart replies to every Google review — tuned to sentiment and your brand voice." icon="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        <Tile href="/seo" title="SEO & ranking audit" desc="Scan any website for the on-page signals that decide your local Google ranking, with the exact fixes." icon="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3" />
        <Tile href="/settings" title="Brand voice" desc="Set your tone, keywords, and sign-off once — every reply and suggestion uses it." icon="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        <div className="card flex flex-col justify-center bg-ink text-paper">
          <p className="font-mono text-[11px] uppercase tracking-widest text-coral">Coming next</p>
          <h3 className="mt-2 font-display text-lg font-extrabold text-paper">Live Google sync + auto-blog</h3>
          <p className="mt-1.5 text-sm text-paper/70">Connect your Google Business Profile to pull reviews and post replies automatically, plus AI blogs that publish to your site.</p>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-line bg-surface2 px-4 py-3 text-sm text-ink2">
        <b className="text-ink">Draft mode.</b> Everything works right now without any connection. Add an <code className="font-mono text-coralink">ANTHROPIC_API_KEY</code> for live AI, and connect Google (Phase 2) to sync and post automatically.
      </div>
    </div>
  );
}
