# Assets

## Current images (placeholders)

These `.webp` files are **AI-generated stock food/ambiance photography** used so
the site looks complete before real photos exist. They are **not** photos of the
restaurant's actual dishes or space — replace them with real photography before
(or shortly after) launch:

- `hero.webp` — homepage hero background
- `welcome.webp` — welcome/about section
- `experience.webp` — "experience" section (kitchen)
- `dish-tandoori-fish.webp`, `dish-malai-momo.webp`, `dish-chicken-biryani.webp`
  — the three menu-highlight cards

To swap any of them: drop a new file in this folder and update the matching
`import` (in `data/menu.js`, `components/home/Hero.jsx`,
`components/home/WelcomeSection.jsx`, `components/home/ExperienceSection.jsx`).
Any component still using the `Placeholder` block without a `src` (e.g. the
Gallery page) shows a branded placeholder until you pass it an image.

## Logo

Drop `logo.png` here and follow the commented `import` + `<img>` lines in
`../components/ui/Logo.jsx` to replace the text placeholder wordmark.
