import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from '../../i18n/ThemeContext'
import Icon from './Icon'
import { useGt } from './GtContext'

/**
 * Fixed pipeline nav. The fill bar and the current stage are both a pure
 * function of scroll position, so scrolling back through a position restores
 * the same state (no accumulation, no direction dependence).
 */
const Nav: React.FC = () => {
  const { c, lang, toggleLang } = useGt()
  const { theme, toggle: toggleTheme } = useTheme()
  const [active, setActive] = useState<string | null>('ingest')
  const fill = useRef<HTMLElement | null>(null)
  const ticking = useRef(false)

  useEffect(() => {
    const stages = c.nav.stages
      .map((s) => ({ stage: s.id, el: document.querySelector(s.target) as HTMLElement | null }))
      .filter((t): t is { stage: string; el: HTMLElement } => Boolean(t.el))

    const update = () => {
      ticking.current = false
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      if (fill.current) fill.current.style.width = `${(p * 100).toFixed(2)}%`

      const atTop = window.scrollY <= 2
      const atBottom = max > 0 && window.scrollY >= max - 2
      const line = Math.max(120, window.innerHeight * 0.25)
      let current = stages.length ? stages[0].stage : null

      if (atBottom && stages.length) {
        current = stages[stages.length - 1].stage
      } else if (!atTop) {
        for (const t of stages) {
          if (t.el.getBoundingClientRect().top <= line) current = t.stage
        }
      }
      setActive(current)
    }

    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [c])

  const links: { label: string; href: string; cls?: string; icon?: string; download?: boolean }[] = [
    { label: c.nav.github, href: c.contact.github, icon: 'github' },
    { label: c.nav.linkedin, href: c.contact.linkedin, icon: 'linkedin' },
    { label: 'XING', href: c.contact.xing, cls: 'alt' },
    { label: 'ResearchGate', href: c.contact.researchgate, cls: 'alt' },
    { label: c.nav.email, href: `mailto:${c.contact.email}`, cls: 'mail' },
    { label: c.nav.cv, href: c.contact.cv, cls: 'cv', download: true },
  ]

  return (
    <nav id="topnav" aria-label="Pipeline and site">
      <a className="badge mono" href="#lab">
        {c.nav.badge} <span className="slash">//</span> CV·AI
      </a>
      <p className="avail mono">
        <span className="dot" aria-hidden="true" />
        <span className="txt">{c.identity.availability}</span>
      </p>

      <ol className="pipe mono" id="pipe">
        {c.nav.stages.map((s) => (
          <li key={s.id}>
            <a href={s.target} data-stage={s.id} aria-current={active === s.id ? 'true' : undefined}>
              {s.label}
            </a>
          </li>
        ))}
      </ol>

      <div className="nav-act mono">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className={l.cls}
            {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {})}
            {...(l.download ? { download: '' } : {})}
          >
            {l.icon ? <Icon name={l.icon} size={13} /> : null}
            {l.label}
          </a>
        ))}

        <button
          type="button"
          className="tool"
          onClick={toggleLang}
          aria-label={c.nav.langLabel}
          title={c.nav.langLabel}
        >
          {lang === 'en' ? 'DE' : 'EN'}
        </button>
        <button
          type="button"
          className="tool"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? c.nav.theme.toDark : c.nav.theme.toLight}
          aria-pressed={theme === 'light'}
          title={theme === 'light' ? c.nav.theme.toDark : c.nav.theme.toLight}
        >
          <Icon name={theme === 'light' ? 'moon' : 'sun'} size={14} />
        </button>
      </div>

      <div className="navfill" aria-hidden="true">
        <i id="navfill-i" ref={(el) => { fill.current = el }} />
      </div>
    </nav>
  )
}

export default Nav
