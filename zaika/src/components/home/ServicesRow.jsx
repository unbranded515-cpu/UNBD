import { services } from '../../data/site'
import Reveal from '../ui/Reveal'
import Icon from '../ui/Icon'

// Service icons row (Takeout / Delivery / Dine-In).
// NOTE(client): confirm which services apply before launch — toggle each in
// data/site.js via `enabled`. Only enabled services render here.
export default function ServicesRow() {
  const active = services.filter((s) => s.enabled)

  return (
    <section className="bg-forest py-14">
      <div className="container-x grid gap-8 sm:grid-cols-3">
        {active.map((service, i) => (
          <Reveal
            key={service.key}
            delay={i * 0.08}
            className="flex flex-col items-center gap-3 text-center"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-cream/25 text-leaf">
              <Icon name={service.icon} size={26} />
            </span>
            <h3 className="text-xl font-semibold text-cream">{service.title}</h3>
            <p className="max-w-xs text-sm leading-relaxed text-cream/70">
              {service.description}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
