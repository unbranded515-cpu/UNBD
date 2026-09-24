import { motion } from 'framer-motion'
import { brand, contact, orderOnlineUrl } from '../../data/site'
import heroImage from '../../assets/hero.webp'

// Full-width hero. `heroImage` (stock food photography) renders behind a dark
// overlay. Swap it for a real photo of the restaurant later — one-line change.

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background: real photo if provided, else a warm branded gradient. */}
      {heroImage ? (
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 -z-10 bg-forest"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(78,156,110,0.35), transparent 45%), radial-gradient(circle at 85% 75%, rgba(15,38,29,0.65), transparent 50%), linear-gradient(135deg, #1F4A3A 0%, #153328 100%)',
          }}
        />
      )}
      {/* Readability overlay — darker on the left, where the text sits. */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(15,38,29,0.85) 0%, rgba(15,38,29,0.6) 45%, rgba(15,38,29,0.35) 100%)',
        }}
      />

      <div className="container-x flex min-h-[78vh] flex-col items-start justify-center py-24 sm:min-h-[86vh]">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 inline-block rounded-full border border-cream/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cream/90"
        >
          {brand.name} · Belleville, ON
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="max-w-3xl text-4xl font-bold leading-[1.08] text-cream sm:text-5xl md:text-6xl"
        >
          Authentic Indian & Global Snacks,{' '}
          <span className="text-leaf">Belleville’s Own</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-5 max-w-xl text-base leading-relaxed text-cream/85 sm:text-lg"
        >
          Momos, biryani, Indo-Chinese, wraps and more — bold, homestyle cooking
          made fresh, steps from the bay’s scenic waterfront.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <a
            href={orderOnlineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-cream px-7 py-3.5 text-sm font-semibold text-forest transition-colors hover:bg-cream-100"
          >
            Order Online
          </a>
          <a
            href={contact.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/60 px-7 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-cream hover:text-forest"
          >
            Get Directions
          </a>
        </motion.div>
      </div>
    </section>
  )
}
