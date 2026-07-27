import React from 'react'
import { useLang } from '../i18n/LanguageContext'
import { getSkills } from '../lib/dataLoader'
import ScrollReveal from './ScrollReveal'
import { CompositeWaveUnderline } from './visuals/CompositeWaveUnderline'

const SKILL_CATEGORIES: Record<string, { label: string; keys: string[] }> = {
  ml: { label: 'Machine Learning', keys: ['Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'FAISS'] },
  mlops: { label: 'MLOps & Infra', keys: ['MLOps', 'Data Engineering', 'Automation', 'AWS Lambda', 'CI/CD'] },
  frontend: { label: 'Frontend & Full Stack', keys: ['Python', 'FastAPI', 'MySQL', 'MongoDB', 'React'] },
  dev: { label: 'Developer Tools', keys: ['GitHub', 'Linux', 'Shell Scripting', 'Feature Engineering', 'AI Ethics', 'Research'] },
}

const Skills: React.FC = () => {
  const { t } = useLang()
  const [skills, setSkills] = React.useState<any[]>([])
  React.useEffect(() => { getSkills().then(setSkills) }, [])

  return (
    <section id="skills" className="section">
      <div className="container max-w-5xl">
        <header className="mb-16" style={{textAlign: 'center'}}>
          <p className="eyebrow">{t.nav.skills}</p>
          <ScrollReveal><h2 className="h2">{t.skills.title}</h2></ScrollReveal>
        </header>
        {Object.entries(SKILL_CATEGORIES).map(([key, { label, keys }]) => {
          const items = skills.filter((s: any) => keys.includes(s.name))
          if (items.length === 0) return null
          return (
            <div key={key} className="skill-group">
              <h3>{label}</h3>
              <CompositeWaveUnderline width={160} height={6} />
              <div className="pill-row">
                {items.map((s: any) => (
                  <span key={s.name} className="pill">{s.name}</span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Skills
