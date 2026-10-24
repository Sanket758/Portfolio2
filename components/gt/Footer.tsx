import React from 'react'
import { useGt } from './GtContext'

/**
 * Footer. The legal pages are not decoration in Germany — Impressum and
 * Datenschutz stay one click away from every scroll position, which is why they
 * live here and not only in a nav that hides items on small screens.
 */
const Footer: React.FC = () => {
  const { c } = useGt()

  return (
    <footer className="gt-foot">
      <p className="gt-foot-note mono">{c.footer.note}</p>
      <nav className="gt-foot-nav mono" aria-label={c.footer.legalAria}>
        <a href="#writing">{c.writing.title}</a>
        <a href="#impressum">{c.footer.impressum}</a>
        <a href="#datenschutz">{c.footer.datenschutz}</a>
        <a href={`mailto:${c.contact.email}`}>{c.contact.email}</a>
        <a href="#lab">{c.footer.top}</a>
      </nav>
    </footer>
  )
}

export default Footer
