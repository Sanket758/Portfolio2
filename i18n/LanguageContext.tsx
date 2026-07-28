import React, { createContext, useContext, useEffect, useState } from 'react'
import { de } from './de'
import { en } from './en'

type Lang = 'de' | 'en'
type Dict = typeof de

interface LanguageContextType {
  lang: Lang
  t: Dict
  toggle: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'portfolio-lang'

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return (saved === 'en' || saved === 'de') ? saved : 'de'
  })

  const toggle = () => {
    setLang(prev => (prev === 'de' ? 'en' : 'de'))
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang === 'de' ? 'de' : 'en'
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, t: lang === 'de' ? de : en, toggle }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = (): LanguageContextType => {
  const ctx = useContext(LanguageContext)
  if (ctx === undefined) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
