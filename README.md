# Diamond Sofas MFG — Website

A fast, static marketing site for **Diamond Sofas MFG**, a family-owned furniture
manufacturer and showroom in Kingston, Ontario. Its job is to drive showroom
visits, phone calls, and custom-furniture quote requests. **There is no online
checkout** — every product shows a price and a "Call / Message for this item"
action.

Built with **[Astro](https://astro.build)** + **[Tailwind CSS](https://tailwindcss.com)**.
Static output, mobile-first, no heavy JavaScript.

---

## Quick start

```bash
npm install      # install dependencies
npm run dev      # local dev server at http://localhost:4321
npm run build    # production build into /dist
npm run preview  # preview the production build locally
```

You need **Node 18+**.

---

## Project structure

```
public/
  images/            ← drop real photos here (see public/images/README.md)
  favicon.svg
  robots.txt
src/
  data/
    products.json    ← all products live here (edit this to add/change items)
    site.ts          ← business facts: phone, address, hours, links
  components/         ← Header, Footer, ProductCard, CollectionPage, etc.
  layouts/
    BaseLayout.astro ← <head>, SEO tags, LocalBusiness JSON-LD, header/footer
  pages/             ← one file per URL (index, sofas, beds, custom, …)
  styles/
    global.css       ← Tailwind + a few shared component classes
astro.config.mjs     ← set the live domain here (the `site` field)
tailwind.config.mjs  ← colours, fonts
netlify.toml         ← Netlify build settings
```

---

## How to add or edit a product

All products live in **`src/data/products.json`**. Add an object to the array:

```json
{
  "id": "unique-slug",
  "name": "Product Name",
  "category": "sofas",           // sofas | beds | mattresses | dining
  "price": 499,                   // a number, or null for "Call for price"
  "compareAtPrice": 699,          // optional original price (shows a strike-through), or null
  "clearance": true,              // true = also shows on the Clearance page + home highlights
  "inStock": true,                // used by the "In stock only" filter
  "customSizes": true,            // whether custom sizes are offered
  "description": "One warm, plain sentence.",
  "image": "/images/unique-slug.jpg",
  "tags": ["Clearance", "Solid wood"]   // small pills shown on the card
}
```

Notes:
- **Category** must be one of `sofas`, `beds`, `mattresses`, `dining` for the item
  to appear on the matching page. (Coffee tables and accent chairs currently live
  under `dining` / `sofas` respectively — adjust as you like.)
- **Price `null`** shows **"Call for price"** instead of a number.
- **`clearance: true`** automatically lists the item on `/clearance` and in the
  home-page "Clearance highlights" grid.
- No individual product pages exist in v1 — the grid is one level deep by design.

Save the file and the site updates. No code changes needed.

---

## How to swap images

1. Put your photo in **`public/images/`**.
2. Name it to match — for products, match the `image` field in
   `products.json` (e.g. `storage-bed-queen.jpg`); for page imagery, use the
   filenames listed in **`public/images/README.md`**.

Until a real photo exists, the site shows a labelled grey placeholder box telling
you exactly what photo goes there. As soon as the file is present, it replaces the
placeholder — no code changes.

Recommended: JPG or WebP, ~1200px wide, under ~300 KB each for fast mobile loads.

---

## Forms (quote + contact)

Forms use **[Netlify Forms](https://docs.netlify.com/forms/setup/)**. When the site
is deployed on Netlify, submissions are captured automatically — no server code.

**To receive submissions by email at `diamondsofasmfg@gmail.com`:**
1. Deploy to Netlify (below).
2. In the Netlify dashboard: **Forms → Form notifications → Add notification →
   Email notification**, and enter `diamondsofasmfg@gmail.com`.

Two forms are wired up: `custom-quote` (the `/custom` page) and `contact` (the
`/contact` page). Both redirect to `/thank-you` on success.

### Using Formspree instead (e.g. if you deploy to Vercel)

Netlify Forms only works on Netlify. If you host elsewhere:
1. Create a free form at [formspree.io](https://formspree.io) and copy its endpoint
   (looks like `https://formspree.io/f/abcdwxyz`).
2. In `src/pages/custom.astro` and `src/pages/contact.astro`, change each
   `<form>` tag:
   - set `action="https://formspree.io/f/XX: your-id"`
   - remove `data-netlify="true"` and `netlify-honeypot="bot-field"`
   - remove the hidden `form-name` input
3. Point Formspree to email `diamondsofasmfg@gmail.com` in its dashboard.

---

## Deploy

### Netlify (recommended — enables the forms)
1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import an existing project** and pick the repo.
3. Build settings are read from `netlify.toml` (`npm run build`, publish `dist`).
   Deploy.
4. Set up the form email notification (see **Forms** above).

### Vercel
1. Push to GitHub and import the repo in Vercel.
2. Vercel auto-detects Astro (build `npm run build`, output `dist`). Deploy.
3. Switch the forms to Formspree (see above) — Netlify Forms won't run on Vercel.

---

## Point the domain (diamondsofasmfg.com)

1. Deploy the site first (above) so you have a live URL.
2. In your host (Netlify or Vercel): **Domain settings → Add a custom domain →**
   enter `diamondsofasmfg.com`.
3. At your domain registrar, update DNS as the host instructs — typically:
   - an **A record** for `diamondsofasmfg.com` → the host's IP (Netlify: `75.2.60.5`),
     **or** a Netlify/Vercel nameserver change, and
   - a **CNAME** for `www` → your host's target.
4. Wait for DNS to propagate (minutes to a few hours). HTTPS is issued automatically.
5. In **`astro.config.mjs`**, confirm `site: 'https://diamondsofasmfg.com'` so the
   sitemap and canonical URLs use the real domain, then redeploy.

---

## SEO built in

- Unique `<title>` + meta description per page, each mentioning **Kingston**.
- One `<h1>` per page, semantic headings.
- **LocalBusiness (FurnitureStore) JSON-LD** on every page — name, address, phone,
  hours, geo. Update the coordinates in `src/data/site.ts` (`geo`) with the exact
  showroom location when confirmed.
- Product image alt text comes from product names.
- `robots.txt` (in `public/`) and an auto-generated `sitemap-index.xml`
  (via `@astrojs/sitemap`).

---

## Things to confirm before launch

- Exact showroom **opening hours** (currently shown as "Open 7 days a week").
- Exact **geo coordinates** in `src/data/site.ts` for the map/JSON-LD.
- Replace all placeholder images.
- Set the Netlify form email notification to `diamondsofasmfg@gmail.com`.
