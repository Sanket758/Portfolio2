import React from 'react'
import { useLang } from '../i18n/LanguageContext'

const useMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false)
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

interface HeaderProps {
  active: string
  onNavigate: (id: string) => void
}

const Header: React.FC<HeaderProps> = ({ active, onNavigate }) => {
  const { lang, t, toggle } = useLang()
  const [menuOpen, setMenuOpen] = React.useState(false)
  const isMobile = useMobile()

  const links = [
    { id: 'about', label: t.nav.about },
    { id: 'experience', label: t.nav.experience },
    { id: 'education', label: t.nav.education },
    { id: 'projects', label: t.nav.projects },
    { id: 'skills', label: t.nav.skills },
    { id: 'writing', label: t.nav.writing },
    { id: 'contact', label: t.nav.contact },
  ]

  return (
    <header className="topnav" style={{ background: 'color-mix(in oklch, var(--bg) 92%, transparent)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
      <div className="container topnav-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBlock: 14 }}>
        <a href="#hero" className="logo" onClick={e => { e.preventDefault(); onNavigate('hero') }}>
          Sanket Gadge
        </a>

        {/* Desktop Nav */}
        {!isMobile && (
          <nav aria-label={t.nav.primary} style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {links.map(l => (
            <a
              key={l.id}
              href={`#${l.id}`}
              aria-current={active === l.id ? 'location' : undefined}
              className={active === l.id ? 'active' : undefined}
              onClick={e => { e.preventDefault(); onNavigate(l.id) }}
              style={{
                fontSize: 14, color: active === l.id ? 'var(--fg)' : 'var(--muted)',
                fontWeight: active === l.id ? 600 : 500,
                transition: 'color 0.15s ease'
              }}
            >
              {l.label}
            </a>
          ))}
          <button
            type="button"
            onClick={toggle}
            aria-label={t.nav.language}
            style={{
              background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)',
              padding: '6px 12px', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--muted)',
              cursor: 'pointer', letterSpacing: '.04em', textTransform: 'uppercase'
            }}
          >
            {lang === 'de' ? 'EN' : 'DE'}
          </button>
        </nav>
        )}

        {/* Mobile menu button */}
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: isMobile ? 'block' : 'none', background: 'transparent', border: 0, color: 'var(--fg)', fontSize: 24 }}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-navigation" className="mobile-nav" aria-label={t.nav.mobile} style={{ padding: '16px 0', borderTop: '1px solid var(--border)' }}>
          <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {links.map(l => (
              <a
                key={l.id} href={`#${l.id}`}
                aria-current={active === l.id ? 'location' : undefined}
                className={active === l.id ? 'active' : undefined}
                onClick={e => { e.preventDefault(); setMenuOpen(false); onNavigate(l.id) }}
                style={{ color: active === l.id ? 'var(--fg)' : 'var(--muted)', fontSize: 15, fontWeight: active === l.id ? 600 : 500 }}
              >
                {l.label}
              </a>
            ))}
            <button type="button" onClick={toggle} aria-label={t.nav.language} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)', padding: '6px 12px', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--muted)', cursor: 'pointer', alignSelf: 'flex-start' }}>
              {lang === 'de' ? 'EN' : 'DE'}
            </button>
          </div>
        </nav>
      )}
    </header>
  )
}

export default Header
