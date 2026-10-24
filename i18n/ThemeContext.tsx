import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = 'portfolio-theme'

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'dark'
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  if (document.documentElement.classList.contains('light')) return 'light'
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light'
  return 'dark'
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  const toggle = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    localStorage.setItem(STORAGE_KEY, theme)

    // Make sure the <html class> and palette (body uses --bg etc.) stay in sync.
    document.body.style.background = 'var(--bg)'
    document.body.style.color = 'var(--fg)'
    return () => {}
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext)
  if (ctx === undefined) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
