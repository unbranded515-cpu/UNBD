import { experience } from '../../data/site'
import Reveal from '../ui/Reveal'
import Placeholder from '../ui/Placeholder'
import Icon from '../ui/Icon'

// Experience section — feature blocks left, large photo right.
export default function ExperienceSection() {
  return (
    <section className="bg-cream py-20 sm:py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <Reveal className="order-2 lg:order-1">
          <div className="relative">
            <Placeholder
              alt="Homestyle Indian cooking at Zaika on the Bay"
              label="Kitchen photo coming soon"
              ratio="aspect-[5/4]"
              className="shadow-sm"
            />
            <div className="absolute -right-4 -top-4 -z-10 hidden h-full w-full rounded-2xl border-2 border-forest/20 sm:block" />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="order-1 lg:order-2">
          <p className="eyebrow">{experience.eyebrow}</p>
          <h2 className="text-3xl font-bold text-ink sm:text-4xl">{experience.headline}</h2>

          <div className="mt-8 space-y-7">
            {experience.features.map((feature) => (
              <div key={feature.title} className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-forest text-cream">
                  <Icon name={feature.icon} size={22} />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-ink">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink/70">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
