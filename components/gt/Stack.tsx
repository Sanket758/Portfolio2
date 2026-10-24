import React from 'react'
import { useGt } from './GtContext'

/**
 * 04 · STACK — skill columns and the filter bar.
 *
 * There are no percentage bars anywhere: selecting a skill lights the work and
 * evidence that proves it, and the bar says what changed. A skill the page has
 * no evidence for says so instead of reporting a dead "0 projects".
 */
const Stack: React.FC = () => {
  const { c, activeSkills, isActiveSkill, toggleSkill, clearSkills, filterOn, matches } = useGt()

  const litProjects =
    c.work.cases.filter((x) => matches(x.skills)).length +
    c.work.chips.filter((x) => matches(x.skills)).length
  const litRows = c.evidence.rows.filter((r) => matches(r.skills)).length
  const total = c.evidence.rows.length
  const skills = activeSkills.join(' + ')

  const status = !filterOn
    ? ''
    : litProjects + litRows === 0
      ? c.stack.noEvidence(skills)
      : c.stack.status(skills, litProjects, litRows, total)

  return (
    <section id="stack" className="sec" aria-labelledby="stack-h">
      <p className="eyebrow">{c.stack.eyebrow}</p>
      <h2 id="stack-h">{c.stack.title}</h2>
      <p className="lede">{c.stack.lede}</p>

      <div className="stack-bar">
        <p className="stack-hint mono">{c.stack.hint}</p>
        <button className="gt-clear mono" type="button" onClick={clearSkills} hidden={!filterOn}>
          {filterOn ? c.stack.clearWith(activeSkills.length) : c.stack.clear}
        </button>
        <p className="stack-status mono" id="stack-status" aria-live="polite" hidden={!filterOn}>
          {status}
        </p>
      </div>

      <div className="stack-grid" id="stack-grid">
        {c.stack.columns.map((col, i) => {
          const headId = `stack-col-${col.id}`
          return (
            <div className="gt-col" data-col={col.id} key={col.id}>
              <h3 className="gt-col-head" id={headId}>
                <span className="gt-col-idx">S.{i + 1 < 10 ? '0' : ''}{i + 1}</span>
                <span className="gt-col-title">{col.title}</span>
                <span className="gt-col-count">
                  {col.items.length} {col.items.length === 1 ? 'skill' : 'skills'}
                </span>
              </h3>
              <div className="gt-col-chips" role="group" aria-labelledby={headId}>
                {col.items.map((item) => {
                  const on = isActiveSkill(item.slug)
                  return (
                    <button
                      key={item.slug}
                      type="button"
                      className={`gt-skill${on ? ' lit' : filterOn ? ' dim' : ''}`}
                      data-skill={item.slug}
                      data-src={item.src}
                      aria-pressed={on}
                      title={item.src}
                      onClick={() => toggleSkill(item.slug)}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Stack
