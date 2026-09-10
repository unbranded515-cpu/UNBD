import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { navLinks, contact, orderOnlineUrl, announcement } from '../data/site'
import Logo from './ui/Logo'
import Icon from './ui/Icon'

// Sticky navigation bar. Collapses to a hamburger drawer on mobile.
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Add shadow / stronger background once the page is scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-forest ${
      isActive ? 'text-forest' : 'text-ink/80'
    }`

  return (
    <header
      className={`fixed inset-x-0 z-50 transition-all duration-300 ${
        announcement.enabled ? 'top-9' : 'top-0'
      } ${
        scrolled || open
          ? 'border-b border-cream-300 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-x flex h-20 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="shrink-0" aria-label="Zaika on the Bay — home">
          <Logo />
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} className={linkClass} end={link.to === '/'}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop right cluster: phone + CTAs */}
        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={`tel:${contact.phonePrimary.replace(/[^\d+]/g, '')}`}
            className="flex items-center gap-2 text-sm font-semibold text-forest hover:text-forest-700"
          >
            <Icon name="phone" size={16} />
            {contact.phonePrimary}
          </a>
          <a href={orderOnlineUrl} className="btn-primary" target="_blank" rel="noopener noreferrer">
            Order Online
          </a>
          <a
            href={contact.directionsUrl}
            className="btn-outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get Directions
          </a>
        </div>

        {/* Mobile: phone + hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={`tel:${contact.phonePrimary.replace(/[^\d+]/g, '')}`}
            className="p-2 text-forest"
            aria-label={`Call ${contact.phonePrimary}`}
          >
            <Icon name="phone" size={20} />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="p-2 text-forest"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <Icon name={open ? 'close' : 'menu'} size={26} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden border-t border-cream-300 bg-cream transition-[max-height] duration-300 ease-out lg:hidden ${
          open ? 'max-h-[80vh]' : 'max-h-0'
        }`}
      >
        <ul className="container-x flex flex-col gap-1 py-4">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                    isActive ? 'bg-cream-200 text-forest' : 'text-ink/80 hover:bg-cream-200'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          <li className="mt-3 flex flex-col gap-3 px-1">
            <a
              href={orderOnlineUrl}
              className="btn-primary w-full"
              target="_blank"
              rel="noopener noreferrer"
            >
              Order Online
            </a>
            <a
              href={contact.directionsUrl}
              className="btn-outline w-full"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Directions
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
