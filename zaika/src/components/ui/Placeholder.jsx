// Reusable image placeholder.
//
// Renders a real <img> when `src` is provided, otherwise a tasteful branded
// block so the layout is complete before real photography arrives. Swapping in
// a real photo later is a one-line change: pass `src` (an imported asset or URL).

export default function Placeholder({
  src = null,
  alt = '',
  label = 'Photo coming soon',
  className = '',
  rounded = 'rounded-2xl',
  ratio = 'aspect-[4/3]',
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`${ratio} w-full ${rounded} object-cover ${className}`}
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={alt || label}
      className={`${ratio} w-full ${rounded} relative overflow-hidden border border-cream-300
        bg-cream-200 ${className}`}
    >
      {/* Soft diagonal texture so empty blocks still feel designed. */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, rgba(31,74,58,0.06) 0 12px, transparent 12px 24px)',
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-forest/50">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
        <span className="px-3 text-center text-xs font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
    </div>
  )
}
