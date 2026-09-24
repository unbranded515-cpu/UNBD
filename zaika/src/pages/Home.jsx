import Hero from '../components/home/Hero'
import WelcomeSection from '../components/home/WelcomeSection'
import ServicesRow from '../components/home/ServicesRow'
import MenuHighlights from '../components/home/MenuHighlights'
import ExperienceSection from '../components/home/ExperienceSection'
import Testimonials from '../components/home/Testimonials'
import OrderOnline from '../components/home/OrderOnline'

// Home page — composed from the section components in components/home/.
// Section order mirrors the requested flow (hero → welcome → services →
// highlights → experience → testimonials → order online).
export default function Home() {
  return (
    <>
      <Hero />
      <WelcomeSection />
      <ServicesRow />
      <MenuHighlights />
      <ExperienceSection />
      <Testimonials />
      <OrderOnline />
    </>
  )
}
