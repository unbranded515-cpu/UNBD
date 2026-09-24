import { Link } from 'react-router-dom'
import { brand, contact, hours, social, navLinks } from '../data/site'
import Logo from './ui/Logo'
import Icon from './ui/Icon'

// Grouped display for hours (collapse identical weekday runs) is skipped for
// clarity — we show each day so edits in data/site.js map 1:1 to the footer.
const usefulLinks = navLinks.filter((l) => l.to !== '/')

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-forest text-cream">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand + social */}
        <div className="space-y-5">
          <Logo variant="light" />
          <p className="max-w-xs text-sm leading-relaxed text-cream/70">
            {brand.tagline}. Authentic Indian & global snacks, made fresh in Belleville.
          </p>
          <div className="flex items-center gap-3">
            <a
              href={social.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram ${social.instagram.label}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/25 text-cream transition-colors hover:bg-cream hover:text-forest"
            >
              <Icon name="instagram" size={18} />
            </a>
            <a
              href={social.facebook.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/25 text-cream transition-colors hover:bg-cream hover:text-forest"
            >
              <Icon name="facebook" size={18} />
            </a>
            <a
              href={social.tiktok.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/25 text-cream transition-colors hover:bg-cream hover:text-forest"
            >
              <Icon name="tiktok" size={18} />
            </a>
          </div>
        </div>

        {/* Opening hours */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-cream">Opening Hours</h3>
          <ul className="space-y-2 text-sm text-cream/75">
            {hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span>{h.day}</span>
                <span className="text-cream/90">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Useful links */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-cream">Useful Links</h3>
          <ul className="space-y-2 text-sm text-cream/75">
            {usefulLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-cream">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-cream">{brand.name}</h3>
          <ul className="space-y-3 text-sm text-cream/75">
            <li className="flex gap-3">
              <Icon name="pin" size={18} className="mt-0.5 shrink-0 text-leaf" />
              <a
                href={contact.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-cream"
              >
                {contact.address.line1}, {contact.address.city}, {contact.address.province}{' '}
                {contact.address.postal}
              </a>
            </li>
            <li className="flex gap-3">
              <Icon name="phone" size={18} className="mt-0.5 shrink-0 text-leaf" />
              <span className="flex flex-col">
                <a
                  href={`tel:${contact.phonePrimary.replace(/[^\d+]/g, '')}`}
                  className="transition-colors hover:text-cream"
                >
                  {contact.phonePrimary}
                </a>
                <a
                  href={`tel:${contact.phoneSecondary.replace(/[^\d+]/g, '')}`}
                  className="transition-colors hover:text-cream"
                >
                  {contact.phoneSecondary}
                </a>
              </span>
            </li>
            <li className="flex gap-3">
              <Icon name="mail" size={18} className="mt-0.5 shrink-0 text-leaf" />
              <a
                href={`mailto:${contact.email}`}
                className="break-all transition-colors hover:text-cream"
              >
                {contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/15">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-cream/60 sm:flex-row">
          <p>Copyright © {year} {brand.name}. All Rights Reserved.</p>
          <p>Made with care in Belleville, Ontario.</p>
        </div>
      </div>
    </footer>
  )
}
