import { announcement, contact } from '../data/site'
import Icon from './ui/Icon'

// Thin bar fixed above the header. Shows the address, linked to directions.
// Height is 2.25rem (h-9) — the Navbar and Layout offsets assume this.
export default function AnnouncementBar() {
  if (!announcement.enabled) return null

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-9 bg-forest-700 text-cream">
      <div className="container-x flex h-9 items-center justify-center gap-2 text-center text-xs font-medium sm:text-sm">
        <Icon name="pin" size={14} className="hidden shrink-0 text-leaf sm:block" />
        <span className="truncate">{announcement.text}</span>
        <a
          href={contact.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden shrink-0 items-center gap-1 font-semibold text-leaf underline-offset-2 hover:underline sm:inline-flex"
        >
          {announcement.cta}
          <Icon name="arrowRight" size={13} />
        </a>
      </div>
    </div>
  )
}
