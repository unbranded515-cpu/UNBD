import { Link } from 'react-router-dom'
import { menuHighlights, formatPrice } from '../../data/menu'
import Reveal from '../ui/Reveal'
import Placeholder from '../ui/Placeholder'

// "Taste The Best" — 3-card grid of featured dishes.
export default function MenuHighlights() {
  return (
    <section className="bg-cream-200 py-20 sm:py-24">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Our Culinary Offerings</p>
          <h2 className="text-3xl font-bold text-ink sm:text-4xl">
            Taste The Best — <span className="text-forest">Fresh & Made to Order</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {menuHighlights.map((dish, i) => (
            <Reveal
              key={dish.name}
              delay={i * 0.08}
              className="group overflow-hidden rounded-2xl border border-cream-300 bg-cream shadow-sm transition-shadow hover:shadow-md"
            >
              <Placeholder
                src={dish.image}
                alt={dish.name}
                label="Dish photo coming soon"
                rounded="rounded-none"
                ratio="aspect-[4/3]"
              />
              <div className="flex items-center justify-between gap-4 p-5">
                <h3 className="text-lg font-semibold text-ink">{dish.name}</h3>
                <span className="whitespace-nowrap rounded-full bg-forest/10 px-3 py-1 text-sm font-semibold text-forest">
                  {formatPrice(dish.price)}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/menu" className="btn-primary">
            View Full Menu
          </Link>
        </div>
      </div>
    </section>
  )
}
