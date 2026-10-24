import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { getContent, type GtContent, type Lang } from '../../lib/gt/content'

/**
 * Page state that more than one section needs: language, the skill cross-filter,
 * the copy-to-clipboard toast, and the reduced-motion flag.
 *
 * The filter lives here rather than in the stack section because three places
 * answer to it (evidence table, flagship cases, compact builds) and the readout
 * in the stack bar counts all of them.
 */

interface GtCtx {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
  /** content for the current language */
  c: GtContent
  activeSkills: string[]
  isActiveSkill: (slug: string) => boolean
  toggleSkill: (slug: string) => void
  clearSkills: () => void
  filterOn: boolean
  /** true when a node with these skill slugs is part of the current selection */
  matches: (skills?: string[]) => boolean
  reducedMotion: boolean
  toast: (message: string) => void
  copyEmail: () => void
}

const Ctx = createContext<GtCtx | undefined>(undefined)

const LANG_KEY = 'portfolio-lang'

const readLang = (): Lang => {
  if (typeof window === 'undefined') return 'en'
  const saved = localStorage.getItem(LANG_KEY)
  return saved === 'de' ? 'de' : 'en'
}

export const GtProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(readLang)
  const [activeSkills, setActiveSkills] = useState<string[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const timer = useRef<number | null>(null)

  const c = useMemo(() => getContent(lang), [lang])

  /* language is a persisted preference and it is also the document language:
     screen readers and search engines read the same attribute */
  useEffect(() => {
    document.documentElement.lang = lang
    localStorage.setItem(LANG_KEY, lang)
    document.title = c.meta.title
    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', c.meta.description)
  }, [lang, c])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current)
  }, [])

  const toast = useCallback((next: string) => {
    setMessage(next)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setMessage(null), 2400)
  }, [])

  const copyEmail = useCallback(() => {
    const email = c.contact.email
    const done = () => toast(c.toast.copied(email))

    /* clipboard API needs a secure context; the fallback keeps plain http works */
    const failed = () => toast(c.toast.copyFailed)
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(email).then(done, () => fallbackCopy(email, done, failed))
    } else {
      fallbackCopy(email, done, failed)
    }
  }, [c, toast])

  const setLang = useCallback((next: Lang) => setLangState(next), [])
  const toggleLang = useCallback(() => setLangState((prev) => (prev === 'en' ? 'de' : 'en')), [])

  const toggleSkill = useCallback((slug: string) => {
    setActiveSkills((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug].sort()))
  }, [])
  const clearSkills = useCallback(() => setActiveSkills([]), [])

  const filterOn = activeSkills.length > 0
  const isActiveSkill = useCallback((slug: string) => activeSkills.includes(slug), [activeSkills])
  const matches = useCallback(
    (skills?: string[]) => !filterOn || (skills ?? []).some((s) => activeSkills.includes(s)),
    [activeSkills, filterOn],
  )

  const value: GtCtx = {
    lang,
    setLang,
    toggleLang,
    c,
    activeSkills,
    isActiveSkill,
    toggleSkill,
    clearSkills,
    filterOn,
    matches,
    reducedMotion,
    toast,
    copyEmail,
  }

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className={`toast mono${message ? ' show' : ''}`} role="status" aria-live="polite">
        {message}
      </div>
    </Ctx.Provider>
  )
}

export const useGt = (): GtCtx => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useGt must be used inside GtProvider')
  return ctx
}

function fallbackCopy(text: string, done: () => void, toast: (m: string) => void): void {
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.left = '-999px'
  document.body.appendChild(area)
  area.select()
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  document.body.removeChild(area)
  if (ok) done()
  else toast('Copy failed')
}
