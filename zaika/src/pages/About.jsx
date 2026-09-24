import { Link } from 'react-router-dom'
import { about, experience } from '../data/site'
import PageHeader from '../components/ui/PageHeader'
import Reveal from '../components/ui/Reveal'
import Placeholder from '../components/ui/Placeholder'
import Icon from '../components/ui/Icon'

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="Our Story"
        subtitle="Your neighbourhood Indian restaurant on the bay."
      />

      {/* Story */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">{about.eyebrow}</p>
            <h2 className="text-3xl font-bold leading-tight text-ink sm:text-4xl">
              {about.headlineLead}{' '}
              <span className="text-forest">{about.headlineHighlight}</span>
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-ink/75">
              {about.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <Placeholder
              alt="Zaika on the Bay"
              label="Restaurant photo coming soon"
              ratio="aspect-[4/5]"
              className="shadow-sm"
            />
          </Reveal>
        </div>
      </section>

      {/* Values / experience */}
      <section className="bg-cream-200 py-20 sm:py-24">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">{experience.eyebrow}</p>
            <h2 className="text-3xl font-bold text-ink sm:text-4xl">{experience.headline}</h2>
          </Reveal>

          <div className="mx-auto mt-12 grid max-w-4xl gap-7 sm:grid-cols-2">
            {experience.features.map((feature, i) => (
              <Reveal
                key={feature.title}
                delay={i * 0.08}
                className="rounded-2xl border border-cream-300 bg-cream p-7 shadow-sm"
              >
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-forest text-cream">
                  <Icon name={feature.icon} size={22} />
                </span>
                <h3 className="text-lg font-semibold text-ink">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{feature.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-16">
        <div className="container-x flex flex-col items-center gap-6 text-center">
          <h2 className="text-2xl font-bold text-cream sm:text-3xl">
            Come taste it for yourself
          </h2>
          <p className="max-w-xl text-cream/75">
            Browse the full menu or order online — we can’t wait to feed you.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/menu"
              className="inline-flex items-center justify-center rounded-full bg-cream px-7 py-3.5 text-sm font-semibold text-forest transition-colors hover:bg-cream-100"
            >
              View Menu
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full border border-cream/60 px-7 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-cream hover:text-forest"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
