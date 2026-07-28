import { jsPDF } from 'jspdf'
import { en } from '../i18n/en'
import { de } from '../i18n/de'
import experienceData from '../experience.json' assert { type: 'json' }
import educationData from '../education.json' assert { type: 'json' }
import skillsData from '../skills.json' assert { type: 'json' }

type Lang = 'en' | 'de'

// ── Layout constants (mm) ────────────────────────────────────────────
const PAGE_W = 210
const PAGE_H = 297
const MARGIN_L = 18
const MARGIN_R = 18
const MARGIN_T = 16
const CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R
const FOOTER_Y = PAGE_H - 10

// ── Colour palette ───────────────────────────────────────────────────
const C = {
  heading: [30, 30, 30] as [number, number, number],
  body: [50, 50, 50] as [number, number, number],
  accent: [0, 90, 160] as [number, number, number],
  light: [130, 130, 130] as [number, number, number],
}

// ── Helpers ──────────────────────────────────────────────────────────

/** Simple word-wrap that returns lines staying within `maxW` mm. */
function wrapText(
  doc: jsPDF,
  text: string,
  font: string,
  size: number,
  maxW: number,
): string[] {
  doc.setFont(font)
  doc.setFontSize(size)
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (doc.getTextWidth(test) <= maxW) {
      line = test
    } else {
      if (line) lines.push(line)
      line = w
    }
  }
  if (line) lines.push(line)
  return lines
}

/** Print wrapped text starting at (x, y). Returns the Y after the last line. */
function printWrapped(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  font: string,
  size: number,
  maxW: number,
  colour: [number, number, number] = C.body,
): number {
  doc.setFont(font)
  doc.setFontSize(size)
  doc.setTextColor(...colour)
  const lines = wrapText(doc, text, font, size, maxW)
  const leading = size * 0.38
  for (const l of lines) {
    doc.text(l, x, y)
    y += leading + size
  }
  return y
}

/** Print a section heading with a bottom rule. Returns Y below the rule. */
function sectionHeading(doc: jsPDF, label: string, y: number): number {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...C.accent)
  doc.text(label.toUpperCase(), MARGIN_L, y)
  y += 1.5
  doc.setDrawColor(...C.accent)
  doc.setLineWidth(0.4)
  doc.line(MARGIN_L, y, PAGE_W - MARGIN_R, y)
  return y + 5
}

// ── Section renderers ────────────────────────────────────────────────

function renderHeader(doc: jsPDF, lang: Lang): number {
  const t = lang === 'de' ? de : en
  let y = MARGIN_T

  // Name
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(...C.heading)
  doc.text(t.hero.headline, MARGIN_L, y + 6)
  y += 10

  // Tagline + contact line
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...C.light)
  const contactLine = [
    t.contact.emailAddr,
    t.contact.location,
    'github.com/sanket758',
  ].join('  ·  ')
  doc.text(t.hero.eyebrow, MARGIN_L, y)
  doc.text(contactLine, MARGIN_L, y + 4.5)
  y += 10

  // Divider
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.3)
  doc.line(MARGIN_L, y, PAGE_W - MARGIN_R, y)
  return y + 5
}

function renderAbout(doc: jsPDF, lang: Lang, startY: number): number {
  const t = lang === 'de' ? de : en
  let y = sectionHeading(doc, t.about.title, startY)
  y = printWrapped(doc, t.about.text, MARGIN_L, y, 'helvetica', 9.5, CONTENT_W)
  return y + 3
}

function renderExperience(doc: jsPDF, lang: Lang, startY: number): number {
  const t = lang === 'de' ? de : en
  let y = sectionHeading(doc, t.experience.title, startY)

  const items = t.experience.items
  for (const exp of items) {
    // Company + role
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...C.heading)
    doc.text(exp.company, MARGIN_L, y)
    y += 4

    // Role · Period
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(9)
    doc.setTextColor(...C.light)
    doc.text(`${exp.role}  ·  ${exp.period}`, MARGIN_L, y)
    y += 5

    // Bullet points
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(...C.body)
    for (const pt of exp.points) {
      doc.text('\u2022', MARGIN_L + 1, y)
      y = printWrapped(doc, pt, MARGIN_L + 5, y, 'helvetica', 8.5, CONTENT_W - 5)
      y += 0.5
    }
    y += 3
  }
  return y
}

function renderEducation(doc: jsPDF, lang: Lang, startY: number): number {
  const t = lang === 'de' ? de : en
  let y = sectionHeading(doc, t.education.title, startY)

  for (const edu of t.education.items) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...C.heading)
    doc.text(edu.degree, MARGIN_L, y)
    y += 4

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...C.light)
    doc.text(`${edu.institution}  ·  ${edu.period}`, MARGIN_L, y)
    y += 4

    if (edu.detail) {
      doc.setTextColor(...C.body)
      doc.text(edu.detail, MARGIN_L, y)
      y += 4
    }
    y += 2
  }
  return y
}

function renderSkills(doc: jsPDF, lang: Lang, startY: number): number {
  const t = lang === 'de' ? de : en
  let y = sectionHeading(doc, t.skills.title, startY)

  const skills = skillsData as { name: string; level: number }[]
  const colCount = 3
  const colW = CONTENT_W / colCount
  const rowH = 6

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)

  for (let i = 0; i < skills.length; i++) {
    const col = i % colCount
    const row = Math.floor(i / colCount)
    const x = MARGIN_L + col * colW
    const itemY = y + row * rowH

    doc.setTextColor(...C.body)
    doc.text(skills[i].name, x, itemY)

    // Tiny proficiency bar
    const barX = x + doc.getTextWidth(skills[i].name) + 2
    const barMaxW = colW - doc.getTextWidth(skills[i].name) - 8
    const barW = (skills[i].level / 100) * barMaxW
    doc.setFillColor(220, 220, 220)
    doc.roundedRect(barX, itemY - 3, barMaxW, 2.5, 0.5, 0.5, 'F')
    doc.setFillColor(...C.accent)
    doc.roundedRect(barX, itemY - 3, barW, 2.5, 0.5, 0.5, 'F')
  }

  const totalRows = Math.ceil(skills.length / colCount)
  return y + totalRows * rowH + 3
}

function renderFooter(doc: jsPDF, lang: Lang): void {
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(...C.light)
  const label = lang === 'de' ? 'Erstellt am' : 'Generated on'
  doc.text(`${label}: ${new Date().toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US')}`, MARGIN_L, FOOTER_Y)
}

// ── Page-break helper ────────────────────────────────────────────────
function ensureSpace(doc: jsPDF, currentY: number, needed: number): number {
  if (currentY + needed > PAGE_H - 20) {
    doc.addPage()
    return MARGIN_T
  }
  return currentY
}

// ── Main export ──────────────────────────────────────────────────────

export function downloadCV(lang: Lang = 'de'): void {
  const doc = new jsPDF({ format: 'a4', unit: 'mm' })

  let y = renderHeader(doc, lang)
  y = renderAbout(doc, lang, y)
  y = ensureSpace(doc, y, 60)
  y = renderExperience(doc, lang, y)
  y = ensureSpace(doc, y, 40)
  y = renderEducation(doc, lang, y)
  y = ensureSpace(doc, y, 30)
  y = renderSkills(doc, lang, y)

  renderFooter(doc, lang)

  const filename = lang === 'de' ? 'Lebenslauf-Sanket-Gadge.pdf' : 'CV-Sanket-Gadge.pdf'
  doc.save(filename)
}
