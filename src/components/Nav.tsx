"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Dashboard", icon: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" },
  { href: "/reviews", label: "Reviews", icon: "M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z", flag: "AI" },
  { href: "/seo", label: "SEO & Ranking", icon: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3" },
  { href: "/blog", label: "Blog writer", icon: "M4 4h16v16H4zM8 8h8M8 12h8M8 16h5", flag: "AI" },
  { href: "/settings", label: "Brand voice", icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1l2-1.6-2-3.4-2.4 1a7 7 0 0 0-1.7-1L14.5 2h-4l-.3 2.5a7 7 0 0 0-1.7 1l-2.4-1-2 3.4L4 11a7 7 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.3 2.5h4l.3-2.5a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6a7 7 0 0 0 .1-1z" },
];

export function Nav() {
  const path = usePathname();
  return (
    <aside className="flex w-[68px] flex-none flex-col gap-1 border-r border-line bg-surface2 p-3 sm:w-56 sm:p-4">
      <div className="mb-4 flex items-center gap-2.5 px-1 py-2">
        <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-ink text-paper">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" /></svg>
        </span>
        <span className="hidden font-display text-lg font-extrabold tracking-tight sm:block">Unbranded</span>
      </div>
      {items.map((it) => {
        const active = it.href === "/" ? path === "/" : path.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            className={`flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm font-semibold transition ${
              active ? "bg-coral text-white" : "text-ink2 hover:bg-line/50"
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] flex-none" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={it.icon} />
            </svg>
            <span className="hidden sm:block">{it.label}</span>
            {it.flag && <span className="ml-auto hidden rounded bg-white/20 px-1.5 py-0.5 font-mono text-[10px] sm:block">{it.flag}</span>}
          </Link>
        );
      })}
      <div className="mt-auto hidden rounded-xl border border-line bg-surface p-3 sm:block">
        <p className="text-xs font-bold text-ink">Draft mode</p>
        <p className="mt-1 text-[11px] text-muted">Connect Google to sync & post replies live.</p>
      </div>
    </aside>
  );
}
