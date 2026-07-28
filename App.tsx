import React from 'react'
import { LanguageProvider, useLang } from './i18n/LanguageContext'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Education from './components/Education'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Writing from './components/Writing'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Impressum from './pages/Impressum'
import Datenschutz from './pages/Datenschutz'

type SectionId = 'hero' | 'about' | 'experience' | 'education' | 'projects' | 'skills' | 'writing' | 'contact' | 'impressum' | 'datenschutz'

const NAV_MAP: { id: SectionId; label: string }[] = [
  { id: 'about', label: 'about' },
  { id: 'experience', label: 'experience' },
  { id: 'education', label: 'education' },
  { id: 'projects', label: 'projects' },
  { id: 'skills', label: 'skills' },
  { id: 'writing', label: 'writing' },
  { id: 'contact', label: 'contact' },
  { id: 'impressum', label: 'impressum' },
  { id: 'datenschutz', label: 'datenschutz' },
]

const Portfolio: React.FC = () => {
  const { t } = useLang()
  const [active, setActive] = React.useState<SectionId>('hero')

  React.useEffect(() => {
    const ids = NAV_MAP.map(n => n.id)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id as SectionId
            if (ids.includes(id)) setActive(id)
          }
        })
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    )
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: SectionId) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-surface text-fg transition-colors duration-300">
      <Header active={active} onNavigate={scrollTo} />
      <main>
        <Hero />
        <About />
        <Experience />
        <Education />
        <Projects />
        <Skills />
        <Writing />
        <Contact />
      </main>
      <Footer />

      {/* Impressum & Datenschutz as sections within main */}
      <Impressum />
      <Datenschutz />
    </div>
  )
}

const App: React.FC = () => {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/'

  return (
    <LanguageProvider>
      <Portfolio />
    </LanguageProvider>
  )
}

export default App
