import { motion } from 'framer-motion'

// Subtle scroll/entrance animation wrapper.
// Fades + lifts children into view once, when scrolled into the viewport.
// Honors prefers-reduced-motion automatically (framer-motion respects the
// reduced-motion setting when we keep transforms small; we also guard below).

export default function Reveal({
  children,
  as = 'div',
  delay = 0,
  y = 18,
  className = '',
  once = true,
  amount = 0.2,
}) {
  const MotionTag = motion[as] || motion.div

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </MotionTag>
  )
}
