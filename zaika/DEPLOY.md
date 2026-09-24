# Going live — deployment guide

The site is **production-ready**. Hosting is **free**; you only pay for a domain
name (~$10–15/year). Below is the simplest path (Netlify), then how to attach a
custom domain. Vercel and Cloudflare Pages work the same way — config for both is
already in the repo (`netlify.toml`, `vercel.json`).

## 1. Deploy to Netlify (free, ~5 minutes)

1. Go to <https://app.netlify.com> and sign up (use "Log in with GitHub").
2. **Add new site → Import an existing project → GitHub**, and pick the
   `unbranded515-cpu/UNBD` repository.
3. Set these build settings (important — the app is in a subfolder):
   - **Base directory:** `zaika`
   - **Build command:** `npm run build`
   - **Publish directory:** `zaika/dist`  *(Netlify shows this as `dist` once the
     base directory is `zaika`)*
4. Click **Deploy**. In ~1 minute you get a live URL like
   `https://your-site-name.netlify.app`.

That temporary `.netlify.app` URL is a real, shareable live site — good for a
final check before pointing your domain at it.

## 2. Attach your custom domain

1. Buy a domain if you don't have one (Namecheap, Cloudflare, GoDaddy…), e.g.
   `zaikaonthebay.ca` or `.com`.
2. In Netlify: **Site settings → Domain management → Add a custom domain** →
   enter your domain.
3. Netlify shows the DNS records to add. At your domain registrar, add either:
   - Netlify's **name servers** (easiest — Netlify manages DNS), **or**
   - An **A record** → Netlify's load-balancer IP, plus a **CNAME** for `www`.
4. HTTPS (the padlock) is turned on automatically once DNS resolves — nothing to
   configure.

## 3. Before you announce it — final content pass

These need your real info (I left clearly marked placeholders; search the code
for `TODO`):

- [ ] **Prices** — verify every price in `src/data/menu.js` against the current
      in-store menu.
- [ ] **Order Online / delivery links** — set the real Uber Eats, Skip and
      DoorDash store URLs in `src/data/site.js` (`orderOnlineUrl`,
      `deliveryPartners`).
- [ ] **Facebook page** — set `social.facebook.url` in `src/data/site.js`.
- [ ] **Photos** — drop real images in `src/assets/` and pass them to the
      `Placeholder`/hero components (one line each).
- [ ] **Logo** — add `src/assets/logo.png` and switch on the image in
      `src/components/ui/Logo.jsx`.
- [ ] **Testimonials** — replace placeholder quotes with real Google reviews in
      `src/data/site.js`.
- [ ] **Domain references** — update the domain in `index.html` (canonical,
      Open Graph, JSON-LD), `public/robots.txt` and `public/sitemap.xml`.

Once those are in, push to the branch and Netlify redeploys automatically.
