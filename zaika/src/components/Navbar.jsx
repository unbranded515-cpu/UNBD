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
    `text-sm font-medium transition-colors hover:text-white ${
      isActive ? 'text-white' : 'text-cream/75'
    }`

  // Header sits on dark forest green, so the CTAs use cream-on-green styling
  // rather than the global (forest-on-cream) btn-primary / btn-outline.
  const ctaSolid =
    'inline-flex items-center justify-center gap-2 rounded-full bg-cream px-6 py-3 text-sm font-semibold text-forest transition-colors duration-200 hover:bg-white'
  const ctaOutline =
    'inline-flex items-center justify-center gap-2 rounded-full border border-cream/50 bg-transparent px-6 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-cream hover:text-forest'

  return (
    <header
      className={`fixed inset-x-0 z-50 border-b bg-forest transition-all duration-300 ${
        announcement.enabled ? 'top-9' : 'top-0'
      } ${scrolled || open ? 'border-forest-800 shadow-md shadow-forest/20' : 'border-transparent'}`}
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
            className="flex items-center gap-2 text-sm font-semibold text-cream hover:text-white"
          >
            <Icon name="phone" size={16} />
            {contact.phonePrimary}
          </a>
          <a href={orderOnlineUrl} className={ctaSolid} target="_blank" rel="noopener noreferrer">
            Order Online
          </a>
          <a
            href={contact.directionsUrl}
            className={ctaOutline}
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
            className="p-2 text-cream"
            aria-label={`Call ${contact.phonePrimary}`}
          >
            <Icon name="phone" size={20} />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="p-2 text-cream"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <Icon name={open ? 'close' : 'menu'} size={26} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden border-t border-forest-800 bg-forest transition-[max-height] duration-300 ease-out lg:hidden ${
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
                    isActive ? 'bg-forest-700 text-white' : 'text-cream/80 hover:bg-forest-700'
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
              className={`${ctaSolid} w-full`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Order Online
            </a>
            <a
              href={contact.directionsUrl}
              className={`${ctaOutline} w-full`}
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
