import { Link } from 'react-router-dom'
import { about } from '../../data/site'
import Reveal from '../ui/Reveal'
import Placeholder from '../ui/Placeholder'
import welcomeImg from '../../assets/store.webp'

// Welcome / About section — text left, image right.
export default function WelcomeSection() {
  return (
    <section className="bg-cream py-20 sm:py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">{about.eyebrow}</p>
          {/* Black headline text with the key phrase highlighted in forest green. */}
          <h2 className="text-3xl font-bold leading-tight text-ink sm:text-4xl">
            {about.headlineLead}{' '}
            <span className="text-forest">{about.headlineHighlight}</span>
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-ink/75">
            {about.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Locally owned / "not a franchise" story callout */}
          <div className="mt-6 rounded-2xl border-l-4 border-leaf bg-cream-200 p-5">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-leaf">
              Locally Owned, Not a Franchise
            </p>
            <p className="text-base leading-relaxed text-ink/80">{about.story}</p>
          </div>

          <Link to="/about" className="btn-primary mt-7">
            About Us
          </Link>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative">
            <Placeholder
              src={welcomeImg}
              alt="Zaika on the Bay storefront at 37 Pinnacle St, Belleville"
              ratio="aspect-[4/5]"
              className="shadow-sm"
            />
            {/* Decorative accent frame */}
            <div className="absolute -bottom-4 -left-4 -z-10 hidden h-full w-full rounded-2xl border-2 border-forest/20 sm:block" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
