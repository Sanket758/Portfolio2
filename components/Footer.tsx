import React from 'react'
import { useLang } from '../i18n/LanguageContext'

const Footer: React.FC = () => {
  const { t } = useLang()
  const year = new Date().getFullYear()
  return (
    <footer className="pagefoot">
      <div className="container row-between">
        <p className="meta">{t.footer.rights.replace('{year}', String(year))}</p>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <a href="/impressum" className="meta" style={{ color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: 2 }}>Impressum</a>
          <a href="/datenschutz" className="meta" style={{ color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: 2 }}>Datenschutz</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
