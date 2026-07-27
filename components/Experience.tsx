import React from 'react'
import { useLang } from '../i18n/LanguageContext'
import { getExperience } from '../lib/dataLoader'
import ScrollReveal from './ScrollReveal'
import { PhaseStripe } from './visuals/PhaseStripe'

const Experience: React.FC = () => {
  const { t } = useLang()
  const [items, setItems] = React.useState<any[]>([])
  React.useEffect(() => { getExperience().then(setItems) }, [])
  const workItems = items.filter((e: any) => e.type === 'work').sort((a: any, b: any) => {
    if (a.period.includes('present')) return -1
    if (b.period.includes('present')) return 1
    return (b.period.match(/\d{4}/)?.[0] || '0').localeCompare(a.period.match(/\d{4}/)?.[0] || '0')
  })

  return (
    <section id="experience" className="section">
      <div className="container max-w-4xl">
        <header className="mb-16" style={{textAlign: 'center'}}>
          <p className="eyebrow">{t.nav.experience}</p>
          <ScrollReveal delay={0.1}><h2 className="h2">{t.experience.title}</h2></ScrollReveal>
        </header>
        <div className="timeline">
          {workItems.map((exp, i) => (
            <div key={i} className="timeline-item">
              <h3 className="h3">{exp.role}</h3>
              <span className="company">{exp.company}</span>
              <span className="period">{exp.period}</span>
              <ul>
                {(exp.description as string[]).map((p: string, j: number) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
              <div style={{ marginTop: 8 }}>
                <PhaseStripe width={200} height={10} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience
