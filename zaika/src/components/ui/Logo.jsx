import { useState } from 'react'
import { brand } from '../../data/site'

// Brand logo.
//
// It automatically uses a real logo image the moment one exists — no code
// change needed. Drop your file into the `public/` folder as:
//   • public/logo.png        → used on dark backgrounds (the header/nav)
//   • public/logo-dark.png   → optional, used on the dark-green footer.
//     (If logo-dark.png is missing, logo.png is used there too.)
// Transparent PNG or SVG works best. Until a file is present, the styled text
// wordmark below is shown, so the build never breaks.
//
// `variant`: 'dark' = for cream backgrounds (nav); 'light' = for dark
// backgrounds (footer).
export default function Logo({ variant = 'dark', className = '' }) {
  const isLight = variant === 'light'
  // Start hidden: the text wordmark shows until the image actually loads, so a
  // missing logo file never flashes a broken-image icon.
  const [imgOk, setImgOk] = useState(false)

  // Prefer a footer-specific logo on dark backgrounds when provided.
  const src = isLight ? '/logo-dark.png' : '/logo.png'

  const primary = isLight ? 'text-cream' : 'text-forest'
  const script = 'text-leaf'
  const handle = isLight ? 'text-cream/70' : 'text-forest/60'

  return (
    <span className={`inline-flex ${className}`} aria-label={brand.name}>
      {/* Real logo image — shown once it loads; hidden (no broken icon) if absent. */}
      <img
        src={src}
        alt={brand.name}
        onLoad={() => setImgOk(true)}
        onError={(e) => {
          // On dark bg, fall back to the primary logo before giving up.
          if (isLight && e.currentTarget.src.endsWith('/logo-dark.png')) {
            e.currentTarget.src = '/logo.png'
            return
          }
          setImgOk(false)
        }}
        className="h-12 w-auto"
        style={{ display: imgOk ? 'block' : 'none' }}
      />

      {/* Text wordmark fallback */}
      {!imgOk && (
        <span className="flex flex-col leading-none">
          <span className="flex items-baseline gap-1.5">
            <span className={`font-serif text-2xl font-bold tracking-[0.18em] ${primary}`}>
              ZAIKA
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" className={script} aria-hidden="true">
              <path
                fill="currentColor"
                d="M20 4c-8 0-14 4-14 11 0 2 1 4 2 5 1-6 5-9 9-10-4 2-7 5-8 11 1 .3 2 .4 3 .4 7 0 11-6 11-13 0-2 0-3-3-4.8z"
              />
            </svg>
          </span>
          <span className="-mt-0.5 flex items-baseline gap-1.5">
            <span className={`font-serif text-base italic ${script}`}>on the bay</span>
          </span>
          <span className={`mt-0.5 text-[0.6rem] font-medium tracking-wide ${handle}`}>
            {brand.handle}
          </span>
        </span>
      )}
    </span>
  )
}
