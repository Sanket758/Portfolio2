import React from 'react'
import { useLang } from '../i18n/LanguageContext'
import { getEducation } from '../lib/dataLoader'
import ScrollReveal from './ScrollReveal'

const Education: React.FC = () => {
  const { t } = useLang()
  const [items, setItems] = React.useState<any[]>([])
  React.useEffect(() => { getEducation().then(setItems) }, [])

  const eduItems = items.filter((e: any) => e.type === 'education').sort((a: any, b: any) => {
    if (a.period.includes('present')) return -1
    if (b.period.includes('present')) return 1
    return (b.period.match(/\d{4}/)?.[0] || '0').localeCompare(a.period.match(/\d{4}/)?.[0] || '0')
  })

  return (
    <section id="education" className="section">
      <div className="container max-w-4xl">
        <header className="mb-16" style={{textAlign: 'center'}}>
          <p className="eyebrow">{t.nav.education}</p>
          <ScrollReveal delay={0.1}><h2 className="h2">{t.education.title}</h2></ScrollReveal>
        </header>
        <div className="grid-3">
          {eduItems.map((edu, i) => (
            <div key={i} className="card">
              <p className="eyebrow" style={{ marginBottom: 8 }}>{edu.role}</p>
              <h3 className="h3" style={{ marginBottom: 4 }}>{edu.company}</h3>
              <span className="meta">{edu.period}</span>
              <p className="meta" style={{ marginTop: 12 }}>{Array.isArray(edu.description) ? edu.description.join(' · ') : edu.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Education
