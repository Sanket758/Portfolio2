import React from 'react'
import GtSite from './components/gt/GtSite'
import { ThemeProvider } from './i18n/ThemeContext'
import Datenschutz from './pages/Datenschutz'
import Impressum from './pages/Impressum'

/**
 * Static portfolio, no backend, no router: one page plus the two legal pages
 * that German law requires. Both legal sections stay in the same document so
 * they are reachable from the footer at any scroll position and there is no
 * 404 to maintain.
 */
const App: React.FC = () => (
  <ThemeProvider>
    <GtSite />
    <div className="gt-legal" id="legal">
      <Impressum />
      <Datenschutz />
    </div>
  </ThemeProvider>
)

export default App
