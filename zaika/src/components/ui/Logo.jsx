import { useState } from 'react'
import { brand } from '../../data/site'
import logoImg from '../../assets/logo-header.png'

// Brand logo.
//
// Header (variant "dark", on the green nav) uses logo-header.webp — the
// uploaded logo recoloured to solid cream and thickened so its fine lines read
// on dark green (the original logo.webp is a very faint dark-green line art).
// The footer (variant "light") keeps the cream text wordmark.
// To change the logo, replace src/assets/logo.webp and regenerate logo-header.webp.
export default function Logo({ variant = 'dark', className = '' }) {
  const isLight = variant === 'light'
  const [imgOk, setImgOk] = useState(false)

  // Both the header (green) and footer (dark green) sit on dark grounds now,
  // so the text-wordmark fallback uses cream in both variants.
  const primary = 'text-cream'
  const script = 'text-leaf'
  const handle = 'text-cream/70'

  const showText = isLight || !imgOk

  return (
    <span className={`inline-flex items-center ${className}`} aria-label={brand.name}>
      {/* Real logo image — only on the header (dark variant). */}
      {!isLight && (
        <img
          src={logoImg}
          alt={brand.name}
          onLoad={() => setImgOk(true)}
          onError={() => setImgOk(false)}
          className="h-12 w-auto sm:h-14"
          style={{ display: imgOk ? 'block' : 'none' }}
        />
      )}

      {/* Text wordmark fallback (and the footer logo) */}
      {showText && (
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
