import { motion } from 'framer-motion'

// Compact hero banner for interior pages (Menu, About, Gallery, Contact).
export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <section
      className="relative isolate overflow-hidden bg-forest"
      style={{
        backgroundImage:
          'radial-gradient(circle at 15% 20%, rgba(78,156,110,0.3), transparent 45%), linear-gradient(135deg, #1F4A3A 0%, #153328 100%)',
      }}
    >
      <div className="container-x py-16 text-center sm:py-20">
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-leaf"
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-4xl font-bold text-cream sm:text-5xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-cream/80"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  )
}
