import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AnnouncementBar from './AnnouncementBar'
import Navbar from './Navbar'
import Footer from './Footer'
import { announcement } from '../data/site'

// Scrolls to the top of the page on every route change.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [pathname])
  return null
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <AnnouncementBar />
      <Navbar />
      {/* Offset the fixed header: 5rem navbar, plus the 2.25rem announcement bar when enabled. */}
      <main className={`flex-1 ${announcement.enabled ? 'pt-[7.25rem]' : 'pt-20'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
