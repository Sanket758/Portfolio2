import React from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import { downloadCV } from '../lib/generateCV'
import FourierCanvas from './visuals/FourierCanvas'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
}

const Hero: React.FC = () => {
  const { t, lang } = useLang()
  const reduceMotion = useReducedMotion()

  return (
    <section id="hero" className="hero-section" data-od-id="hero">
      <div style={{ position: 'absolute', inset: 0 }}>
        <FourierCanvas />
      </div>

      <div className="hero-overlay">
        <motion.p
          className="eyebrow"
          variants={fadeUp}
          custom={0}
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
        >
          <span
            className="dot"
            style={{
              background: 'var(--accent-blue)',
              boxShadow: '0 0 0 4px color-mix(in oklch, var(--accent-blue) 18%, transparent)',
            }}
          />
          {t.hero.eyebrow}
        </motion.p>

        <motion.h1
          className="display"
          variants={fadeUp}
          custom={1}
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
        >
          {t.hero.headline}
        </motion.h1>

        <motion.p
          className="lead hero-lead"
          variants={fadeUp}
          custom={2}
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
        >
          {t.hero.lead}
        </motion.p>

        <motion.div
          className="hero-cta"
          variants={fadeUp}
          custom={3}
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
        >
          <motion.button
            className="btn btn-primary btn-arrow"
            whileHover={reduceMotion ? undefined : { scale: 1.02 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            onClick={() => {
              const el = document.getElementById('projects')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            {t.hero.primaryCta}
          </motion.button>
          <motion.button
            className="btn btn-ghost"
            whileHover={reduceMotion ? undefined : { scale: 1.02 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            onClick={() => downloadCV(lang)}
          >
            {t.hero.secondaryCta}
          </motion.button>
        </motion.div>

        {t.hero.workPermit && (
          <motion.p
            className="meta"
            style={{ marginTop: 24 }}
            variants={fadeUp}
            custom={4}
            initial={reduceMotion ? false : 'hidden'}
            animate="visible"
          >
            {t.hero.workPermit}
          </motion.p>
        )}
      </div>
    </section>
  )
}

export default Hero
