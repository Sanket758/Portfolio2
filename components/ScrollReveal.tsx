import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion'
import { useRef } from 'react'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

/**
 * ScrollReveal — wraps an element and animates it on IntersectionObserver entry.
 * Respects prefers-reduced-motion (disables animation and shows content immediately).
 *
 * `delay` is in milliseconds.
 */
const ScrollReveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({
  children,
  className = '',
  delay = 0,
}) => {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px 0px -60px 0px' })

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      transition={{ delay: delay / 1000 }}
    >
      {children}
    </motion.div>
  )
}

export default ScrollReveal
