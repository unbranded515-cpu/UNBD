# Unbranded

**AI review replies + local SEO for small businesses.**

Unbranded turns a small business's reputation into rankings. It drafts warm,
human, on-brand replies to every Google review, audits a website's local-SEO
signals, and (soon) writes ranking-focused blogs — all from one dashboard.

This repo is the **MVP**, built flagship-first around the **AI review reply
engine**. It runs today in **draft mode** with zero external accounts, and
upgrades to live AI the moment you add a Claude API key.

---

## What's built

| Feature | Status | Notes |
|---|---|---|
| **Review reply engine** | ✅ Working | Sentiment-aware (positive/neutral/negative), brand-voice, keyword-smart replies. `src/app/api/reply` |
| **Review inbox UI** | ✅ Working | Draft, edit, regenerate, copy. Add your own reviews. `src/app/reviews` |
| **Brand voice profile** | ✅ Working | Tone, keywords, sign-off, notes — drives every reply. `src/app/settings` |
| **Website / SEO audit** | ✅ Working | Real on-page crawl + scored report + AI action plan. `src/app/seo` |
| **AI blog writer** | ✅ Working | SEO posts in your brand voice; copy HTML or download. `src/app/blog` |
| **Google connect (OAuth)** | ✅ Wired | Full OAuth + sync + post-reply flow; goes live once you add creds + API access |
| Auto-blog publishing to site | 🔜 Phase 2 | One-click publish to WordPress/Shopify (export works today) |
| Accounts + Stripe billing | 🔜 Phase 2 | Multi-user, plans |

**Draft mode vs. live:** every feature works without any key using sensible
fallbacks, so you can demo the product immediately. Add `ANTHROPIC_API_KEY`
and the real model takes over automatically — no code change.

---

## Getting started

```bash
npm install
cp .env.example .env.local     # then add your ANTHROPIC_API_KEY (optional to start)
npm run dev                    # http://localhost:3000
```

Open **/reviews** and click **Draft reply** on any review. Set your voice in
**/settings** first for the best results.

### Environment

See `.env.example`. The only one that matters to start:

- `ANTHROPIC_API_KEY` — from [console.anthropic.com](https://console.anthropic.com). Without it, the app uses template fallbacks.
- `ANTHROPIC_MODEL` — defaults to `claude-opus-5`. For high-volume review
  replies, `claude-sonnet-5` or `claude-haiku-4-5` cut cost sharply while
  staying strong on short text. Change it in one place.

---

## Tech stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** for styling (brand palette in `tailwind.config.ts`)
- **@anthropic-ai/sdk** — Claude for reply + audit generation
- Server-side API routes (`src/app/api/*`) keep the API key off the client

```
src/
  app/
    page.tsx           Dashboard
    reviews/           ⭐ Review inbox (flagship)
    seo/               SEO audit
    settings/          Brand voice
    api/reply/         POST → generate a review reply
    api/audit/         POST → crawl + score a website
  lib/
    anthropic.ts       Claude client, model config, key detection
    types.ts           Review + BrandVoice types, sentiment logic
    useBrand.ts        Brand voice persistence (localStorage for now)
    sampleReviews.ts   Seed data
  components/Nav.tsx    Sidebar
```

---

## Phase 2 — connecting Google (the roadmap)

The flagship becomes fully automatic once connected to the **Google Business
Profile API**. Honest sequencing, because this is the gating dependency:

1. **Apply for API access early.** Google reviews/replies run through the
   [Business Profile APIs](https://developers.google.com/my-business), which
   require an application + allow-listing that can take weeks. Do this first.
2. **OAuth connect.** Each business owner signs in with Google and grants
   access to the profile they manage (`GOOGLE_CLIENT_ID/SECRET` in `.env`).
3. **Sync reviews** into the inbox instead of the sample data.
4. **Post approved replies** back with one click (or auto-post above a
   confidence threshold).

Until approval lands, **draft mode** is the product: generate → copy → paste
into Google. That's fully functional today.

### Turning Google on (once you have access)

The OAuth flow is already built (`/api/google/*` + the Connect banner on the
Reviews page). To activate:

1. In [Google Cloud Console](https://console.cloud.google.com): create an OAuth
   2.0 Client ID (Web application), and add the redirect URI
   `http://localhost:3000/api/google/callback` (and your production URL).
2. Enable the Business Profile APIs and request access for review management.
3. Put the values in `.env.local`:
   ```
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/google/callback
   ```
4. Restart, open **/reviews**, click **Connect Google**, then **Sync live
   reviews**. Approved replies post back with **Post to Google**.

Tokens are stored in httpOnly cookies (fine for single-business testing).
Move them to a database when you add multi-user accounts.

> ⚠️ **Never generate fake reviews.** Unbranded only replies to real reviews
> and helps happy customers leave genuine ones. Fake reviews violate Google
> policy and get businesses banned.

---

## Deploy (get a live URL)

The app is a standard Next.js project — **Vercel** deploys it with zero config.

1. Push this branch to GitHub (already done).
2. Go to [vercel.com/new](https://vercel.com/new), import the **UNBD** repo,
   and pick this branch.
3. Add environment variables in the Vercel project settings:
   - `ANTHROPIC_API_KEY` (for live AI; omit to run in draft mode)
   - `ANTHROPIC_MODEL` (optional, e.g. `claude-haiku-4-5` for cheaper replies)
   - the `GOOGLE_*` vars later, when you activate Google
4. Deploy. You'll get a URL like `unbranded.vercel.app` to open on your phone
   and share with your test clients.
5. **After deploy, set your production redirect URI** in Google Cloud to
   `https://YOUR-URL/api/google/callback` and add it to `GOOGLE_REDIRECT_URI`.

> Any Node host works too (`npm run build && npm run start`). It needs a Node
> runtime — the API routes are server-side, so it can't be a purely static host.

## Scripts

```bash
npm run dev     # dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```
