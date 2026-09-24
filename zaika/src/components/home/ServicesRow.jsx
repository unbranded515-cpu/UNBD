import { services } from '../../data/site'
import Reveal from '../ui/Reveal'
import Icon from '../ui/Icon'

// Service icons row. Client confirmed takeout + delivery only (no dine-in).
// Services are toggled in data/site.js via `enabled`; only enabled ones render.
export default function ServicesRow() {
  const active = services.filter((s) => s.enabled)

  // Adapt the column count to how many services are enabled so the row stays
  // balanced (2 = two centred columns, 3 = three) and doesn't leave a gap.
  const cols = active.length >= 3 ? 'sm:grid-cols-3 max-w-4xl' : 'sm:grid-cols-2 max-w-2xl'

  return (
    <section className="bg-forest py-14">
      <div className="container-x">
        <div className={`mx-auto grid gap-8 ${cols}`}>
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
      </div>
    </section>
  )
}
