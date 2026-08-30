import { brand } from '../../data/site'

// Brand wordmark.
//
// Placeholder text logo until the real artwork lands. To use the real file:
//   1. Drop the image at src/assets/logo.png
//   2. Uncomment the import + <img> below and delete the text markup.
// (Left as a text logo so the build has no missing-asset dependency.)
//
// import logo from '../../assets/logo.png'

export default function Logo({ variant = 'dark', className = '' }) {
  // `dark` = for cream backgrounds (forest text); `light` = for dark backgrounds.
  const isLight = variant === 'light'
  const primary = isLight ? 'text-cream' : 'text-forest'
  const script = isLight ? 'text-leaf' : 'text-leaf'
  const handle = isLight ? 'text-cream/70' : 'text-forest/60'

  // return <img src={logo} alt={brand.name} className={`h-12 w-auto ${className}`} />

  return (
    <span className={`flex flex-col leading-none ${className}`} aria-label={brand.name}>
      <span className="flex items-baseline gap-1.5">
        <span className={`font-serif text-2xl font-bold tracking-[0.18em] ${primary}`}>
          ZAIKA
        </span>
        {/* small green leaf flourish */}
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
  )
}
