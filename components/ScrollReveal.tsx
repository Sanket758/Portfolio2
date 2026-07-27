import { motion, useInView, type Variants } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

/**
 * ScrollReveal — wraps an element and animates it on IntersectionObserver entry.
 * Respects prefers-reduced-motion (disables animation).
 */
const ScrollReveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({
  children,
  className = '',
  delay = 0,
}) => {
  const reduceMotion = useReducedMotion()
  const ref = useInView({ once: true, margin: '-40px 0px -60px 0px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduceMotion ? false : 'hidden'}
      animate={ref ? 'visible' : 'hidden'}
      variants={fadeUp}
      style={{ transitionDelay: delay }}
    >
      {children}
    </motion.div>
  )
}

export default ScrollReveal