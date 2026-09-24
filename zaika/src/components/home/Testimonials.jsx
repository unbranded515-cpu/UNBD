import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { brand, testimonials } from '../../data/site'
import Reveal from '../ui/Reveal'
import Icon from '../ui/Icon'

// Testimonials slider. Placeholder quotes for now — swap in real Google reviews
// via data/site.js `testimonials`.
export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const count = testimonials.length

  const go = (dir) => setIndex((i) => (i + dir + count) % count)
  const active = testimonials[index]

  // Render the Google rating as filled stars up to the score (rounded to .5).
  const fullStars = Math.round(brand.rating.score)

  return (
    <section className="bg-cream-200 py-20 sm:py-24">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Reviews</p>
          <h2 className="text-3xl font-bold text-ink sm:text-4xl">What Our Clients Say</h2>

          {/* Google rating badge */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-cream-300 bg-cream px-5 py-2.5 shadow-sm">
            <span className="font-serif text-2xl font-bold text-forest">
              {brand.rating.score.toFixed(1)}
            </span>
            <span className="flex text-leaf" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon
                  key={i}
                  name="star"
                  size={18}
                  className={i < fullStars ? 'text-leaf' : 'text-cream-300'}
                />
              ))}
            </span>
            <span className="text-sm text-ink/70">
              {brand.rating.score} of 5 · {brand.rating.count}+ Google reviews
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-10 max-w-3xl">
          <div className="relative rounded-3xl border border-cream-300 bg-cream p-8 shadow-sm sm:p-12">
            <Icon name="quote" size={40} className="mx-auto mb-5 text-forest/25" />

            <div className="min-h-[7rem]">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="text-center"
                >
                  <p className="text-lg leading-relaxed text-ink/85 sm:text-xl">
                    “{active.quote}”
                  </p>
                  <footer className="mt-6">
                    <p className="font-semibold text-forest">{active.author}</p>
                    <p className="text-sm text-ink/60">{active.location}</p>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous review"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-forest/30 text-forest transition-colors hover:bg-forest hover:text-cream"
              >
                <Icon name="arrowRight" size={18} className="rotate-180" />
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Go to review ${i + 1}`}
                    className={`h-2.5 rounded-full transition-all ${
                      i === index ? 'w-6 bg-forest' : 'w-2.5 bg-forest/25 hover:bg-forest/50'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next review"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-forest/30 text-forest transition-colors hover:bg-forest hover:text-cream"
              >
                <Icon name="arrowRight" size={18} />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
