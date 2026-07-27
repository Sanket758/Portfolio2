import React from 'react'
import { useLang } from '../i18n/LanguageContext'
import { downloadCV } from '../lib/generateCV'
import ScrollReveal from './ScrollReveal'
import { EQBars } from './visuals/EQBars'

const Contact: React.FC = () => {
  const { t, lang } = useLang()
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nMessage: ${data.get('message')}`
    window.open(`mailto:gadgesanket75@gmail.com?subject=Portfolio Contact&body=${encodeURIComponent(body)}`, '_self')
    setSubmitted(true)
  }

  return (
    <section id="contact" className="section">
      <div className="container max-w-3xl">
        <header className="mb-12" style={{textAlign: 'center'}}>
          <p className="eyebrow">{t.nav.contact}</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <EQBars width={200} height={32} />
          </div>
          <ScrollReveal><h2 className="h2">{t.contact.title}</h2></ScrollReveal>
          <p className="lead" style={{ marginInline: 'auto' }}>{t.contact.lead}</p>
        </header>

        <div className="contact-grid">
          <form onSubmit={handleSubmit} className="stack" style={{ gap: 16 }}>
            {submitted ? (
              <div className="card" style={{ textAlign: 'center', padding: 32 }}>
                <p style={{ fontWeight: 600 }}>Thanks — I'll get back to you soon.</p>
                <p className="meta">gadgesanket75@gmail.com</p>
              </div>
            ) : (
              <>
                <div className="field">
                  <label htmlFor="c-name">{t.contact.name}</label>
                  <input id="c-name" name="name" className="input" type="text" autoComplete="name" required />
                </div>
                <div className="field">
                  <label htmlFor="c-email">{t.contact.email}</label>
                  <input id="c-email" name="email" className="input" type="email" autoComplete="email" required />
                </div>
                <div className="field" style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="c-message">{t.contact.message}</label>
                  <textarea id="c-message" name="message" className="textarea" rows={4} autoComplete="off" required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  {t.contact.send}
                </button>
              </>
            )}
          </form>

          <div className="stack" style={{ gap: 24 }}>
            <div>
              <h3 className="h3" style={{ marginBottom: 8 }}>{t.contact.connectHeading}</h3>
              <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                <a href="https://github.com/sanket758" target="_blank" rel="noopener noreferrer" className="meta" style={{ fontWeight: 600 }}>GitHub</a>
                <a href="https://www.linkedin.com/in/sanket758/" target="_blank" rel="noopener noreferrer" className="meta" style={{ fontWeight: 600 }}>LinkedIn</a>
              </div>
            </div>
            <div>
              <h3 className="h3" style={{ marginBottom: 8 }}>{t.contact.emailHeading}</h3>
              <a href="mailto:gadgesanket75@gmail.com" className="meta" style={{ color: 'var(--accent)' }}>gadgesanket75@gmail.com</a>
            </div>
            <div>
              <h3 className="h3" style={{ marginBottom: 8 }}>{t.contact.locationHeading}</h3>
              <p className="meta">{t.contact.location}</p>
              <p className="meta" style={{ marginTop: 4 }}>{t.contact.workPermit}</p>
            </div>
            <button className="btn btn-ghost cv-download" onClick={() => downloadCV(lang)} style={{ display: 'inline-flex' }}>
              {t.nav.cv}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
