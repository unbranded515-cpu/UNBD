import { deliveryPartners } from '../../data/site'
import Reveal from '../ui/Reveal'

// Order Online / delivery partners row.
// TODO(pre-launch): partner links point to `#` until real store URLs are set
// in data/site.js.
export default function OrderOnline() {
  return (
    <section className="bg-cream py-20 sm:py-24">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Get It Delivered</p>
          <h2 className="text-3xl font-bold text-ink sm:text-4xl">Order Online</h2>
          <p className="mt-4 text-base leading-relaxed text-ink/70">
            Craving Zaika at home? Order through your favourite delivery app and
            we’ll get it to your door.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {deliveryPartners.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-[10rem] items-center justify-center gap-3 rounded-2xl border border-cream-300 bg-cream-100 px-7 py-5 text-base font-semibold text-forest shadow-sm transition-all hover:-translate-y-0.5 hover:border-forest/40 hover:shadow-md"
            >
              {/* Partner logo placeholder — swap for real SVG/PNG once available. */}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest/10 text-forest">
                {partner.name.charAt(0)}
              </span>
              {partner.name}
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
