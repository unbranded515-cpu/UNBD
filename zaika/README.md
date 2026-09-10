# Zaika on the Bay — Website

Marketing website for **Zaika on the Bay**, an Indian & global snacks restaurant
in Belleville, Ontario. Built with **React + Vite**, **Tailwind CSS**,
**React Router** and **Framer Motion**. Mobile-first and fully responsive.

## Quick start

```bash
cd zaika
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview the production build
```

## Project structure

```
zaika/
├─ index.html
├─ src/
│  ├─ main.jsx              # app entry + router
│  ├─ App.jsx               # routes (Home, Menu, About, Gallery, Contact)
│  ├─ index.css             # Tailwind + shared component classes
│  ├─ data/
│  │  ├─ site.js            # brand, contact, hours, nav, services, copy
│  │  └─ menu.js            # full menu data + highlights
│  ├─ components/
│  │  ├─ Navbar.jsx  Footer.jsx  Layout.jsx
│  │  ├─ home/              # Home page sections
│  │  └─ ui/                # Logo, Icon, Placeholder, Reveal, PageHeader
│  └─ pages/                # Home, MenuPage, About, Gallery, Contact, NotFound
└─ tailwind.config.js       # brand palette + fonts
```

## Editing content (no layout code needed)

All copy, contact info, hours, links and menu data live in **`src/data/`**:

- **`data/site.js`** — restaurant name, phone/email/address, opening hours,
  nav links, service row, delivery partners, testimonials, about/experience copy.
- **`data/menu.js`** — full categorised menu, home-page highlights, price
  formatting.

## Brand

- **Palette:** cream `#FAF7F0` background, forest green `#1F4A3A` accent, leaf
  `#4E9C6E` highlight. (Configured in `tailwind.config.js`.)
- **Type:** Fraunces (serif headings) + Work Sans (body), via Google Fonts.

## Placeholders to replace before launch

Search the codebase for these `TODO` / `NOTE` markers:

1. **Prices** — every price in `data/menu.js` is a best-available **estimate**
   and must be **verified against the current in-store menu**.
2. **Images** — `src/components/ui/Placeholder.jsx` renders branded blocks until
   real photos exist. Pass a `src` (imported asset or URL) to swap any in.
   Hero (`components/home/Hero.jsx`) and Experience use the same pattern.
3. **Logo** — drop the real artwork at `src/assets/logo.png` and follow the
   commented lines in `components/ui/Logo.jsx` (currently a text placeholder).
4. **Order / delivery links** — `orderOnlineUrl` and `deliveryPartners` in
   `data/site.js` point to `#` until real store URLs are confirmed.
5. **Facebook URL** — placeholder in `data/site.js` → `social.facebook.url`.
6. **Testimonials** — placeholder quotes in `data/site.js` → swap for real
   Google reviews.

> Services: client confirmed **takeout + delivery only** (no dine-in /
> reservations). Dine-in is disabled via `enabled: false` in `data/site.js`.
