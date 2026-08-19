import React from 'react'
import { useLang } from '../i18n/LanguageContext'
import ScrollReveal from './ScrollReveal'
import AboutPortrait from './visuals/AboutPortrait'

const About: React.FC = () => {
  const { t } = useLang()
  return (
    <section id="about" className="section">
      <div className="container grid-2-1" style={{ alignItems: 'center' }}>
        <div>
          <p className="eyebrow">{t.nav.about}</p>
          <ScrollReveal>
            <h2 className="h2">{t.about.title}</h2>
          </ScrollReveal>
          <p className="lead" style={{ marginTop: 20 }}>{t.about.text}</p>
          <div style={{ marginTop: 24, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div><strong>{t.about.location}</strong></div>
            <span className="meta">·</span>
            <div className="meta">{t.about.status}</div>
          </div>
          {t.about.permit && (
            <p className="meta" style={{ marginTop: 8 }}>{t.about.permit}</p>
          )}
          <a
            href={t.about.researchProfileUrl}
            target="_blank"
            rel="noreferrer"
            className="num"
            aria-label={t.about.researchProfile}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 22,
              color: 'var(--accent)',
              textDecoration: 'none',
              borderBottom: '1px solid color-mix(in oklch, var(--accent) 35%, transparent)',
              paddingBottom: 5,
            }}
          >
            <span aria-hidden="true">↗</span>
            {t.about.researchProfile}
          </a>
        </div>
        <div>
          <AboutPortrait />
        </div>
      </div>
    </section>
  )
}

export default About

