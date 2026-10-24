import React, { useEffect, useRef, useState } from 'react'
import { useGt } from './GtContext'

/**
 * 05 · EVIDENCE — measured-only benchmark table. Every row carries its source,
 * and every row is a filter target. Rows register on scroll-in; the stagger is
 * per-property so hovering a row never waits for it.
 */
const Evidence: React.FC = () => {
  const { c, filterOn, matches } = useGt()
  const box = useRef<HTMLDivElement | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = box.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => setInView(entry.isIntersecting)),
      { rootMargin: '-10% 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const total = c.evidence.rows.length
  const lit = c.evidence.rows.filter((r) => matches(r.skills)).length
  const header = filterOn ? (lit ? c.evidence.litCount(lit, total) : c.evidence.none) : c.evidence.count(total)

  return (
    <section id="evidence" className="sec" aria-labelledby="evidence-h">
      <p className="eyebrow">{c.evidence.eyebrow}</p>
      <h2 id="evidence-h">{c.evidence.title}</h2>
      <p className="lede">{c.evidence.lede}</p>

      <div className={`gt-ev${inView ? ' in' : ''}`} id="ev" ref={box} data-rv="on">
        <div className="gt-ev-head">
          <p className="gt-ev-note mono">{c.evidence.note}</p>
          <p className="gt-ev-count mono" id="ev-count" data-src="lib/gt/content.ts — evidence.rows">
            {header}
          </p>
        </div>

        <table role="table" aria-label={c.evidence.tableAria}>
          <thead>
            <tr>
              {c.evidence.columns.map((col, i) => (
                <th key={col} scope="col" className={i === 0 ? 'idx' : undefined}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody id="ev-body">
            {c.evidence.rows.map((row, i) => {
              const state = filterOn ? (matches(row.skills) ? ' lit' : ' dim') : ''
              return (
                <tr
                  key={`${row.task}-${i}`}
                  className={state.trim() || undefined}
                  data-src={row.src}
                  data-skills={row.skills.join(' ')}
                  style={{ ['--d' as string]: `${i * 36}ms` }}
                >
                  <td className="idx" data-th={c.evidence.columns[0]}>
                    E.{i < 9 ? '0' : ''}
                    {i + 1}
                  </td>
                  <td className="task" data-th={c.evidence.columns[1]}>
                    {row.task}
                  </td>
                  <td className="method" data-th={c.evidence.columns[2]}>
                    {row.method}
                  </td>
                  <td className="result" data-th={c.evidence.columns[3]}>
                    {row.result}
                  </td>
                  <td className="src" data-th={c.evidence.columns[4]}>
                    {row.src}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <p className="gt-ev-edu mono" id="ev-edu" data-src="education.json — MSc">
          {c.evidence.eduNote}
        </p>
      </div>
    </section>
  )
}

export default Evidence
