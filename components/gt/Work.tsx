import React, { useState } from 'react'
import { archFigure } from '../../lib/gt/arch'
import type { Chip, GtCase } from '../../lib/gt/content'
import Icon from './Icon'
import { useGt } from './GtContext'

/**
 * 03 · WORK — three flagship cases with their architecture on the record, plus
 * three compact builds. Every claim prints its source; every card and chip
 * carries the skill slugs the cross-filter matches against.
 */

const CHIP_ICONS: Record<string, string> = { turtlebot: 'crosshair', drone: 'target', crop: 'activity' }

const RepoLink: React.FC<{ href: string; title: string; label: string }> = ({ href, title, label }) => (
  <a
    className="gt-repo"
    href={href}
    target="_blank"
    rel="noopener"
    aria-label={`GitHub repo — ${title}`}
  >
    <Icon name="github" size={14} />
    {label}
  </a>
)

const DemoLink: React.FC<{ href: string; title: string; label: string }> = ({ href, title, label }) => (
  <a
    className="gt-demo"
    href={href}
    target="_blank"
    rel="noopener"
    aria-label={`Live demo — ${title}`}
  >
    <Icon name="external-link" size={14} />
    {label}
  </a>
)

const CaseCard: React.FC<{ item: GtCase; open: boolean; onToggle: () => void }> = ({
  item,
  open,
  onToggle,
}) => {
  const { c, filterOn, matches } = useGt()
  const drawerId = `drawer-${item.arch}`
  const state = filterOn ? (matches(item.skills) ? 'lit' : 'dim') : undefined

  return (
    <article
      className={`gt-case${state ? ` ${state}` : ''}`}
      id={`case-${item.id}`}
      data-skills={item.skills.join(' ')}
      data-src={item.src}
    >
      <header className="gt-case-head">
        <p className="gt-case-idx">{item.index}</p>
        <h3 className="gt-case-title">{item.title}</h3>
        <p className="gt-case-org">{item.org}</p>
        <ul className="gt-proof">
          {item.proof.map((p) => (
            <li className="gt-badge" key={p.k}>
              <span className="gt-badge-v">{p.v}</span>
              <span className="gt-badge-k">{p.k}</span>
            </li>
          ))}
        </ul>
      </header>

      <div className="gt-case-body">
        <div className="gt-block">
          <p className="gt-block-lab">{c.work.problem}</p>
          <p className="gt-block-txt">{item.problem}</p>
        </div>
        <div className="gt-block">
          <p className="gt-block-lab">{c.work.system}</p>
          <p className="gt-block-txt">{item.system}</p>
        </div>
      </div>

      <footer className="gt-case-foot">
        <ul className="gt-tags">
          {item.skills.map((slug) => (
            <li key={slug}>
              <span className="gt-tag" data-skills={slug}>
                {slug}
              </span>
            </li>
          ))}
        </ul>
        {(item.repo || item.demo) && (
          <div className="gt-case-links">
            {item.demo && <DemoLink href={item.demo} title={item.title} label={c.work.demo} />}
            {item.repo && (
              <RepoLink
                href={item.repo}
                title={item.title}
                label={item.repoName ?? c.work.repo}
              />
            )}
          </div>
        )}
      </footer>

      <div className="gt-case-arch">
        <button
          className="gt-arch-btn"
          type="button"
          aria-expanded={open}
          aria-controls={drawerId}
          onClick={onToggle}
        >
          {c.work.architecture}
          <span className="gt-arch-glyph" aria-hidden="true">
            ▸
          </span>
        </button>
        <div
          className="gt-drawer"
          id={drawerId}
          hidden={!open}
          tabIndex={0}
          role="region"
          aria-label={c.work.drawerAria(item.title)}
          dangerouslySetInnerHTML={{ __html: open ? archFigure(item.arch) : '' }}
        />
      </div>
    </article>
  )
}

const CompactChip: React.FC<{ item: Chip; index: number }> = ({ item, index }) => {
  const { c, filterOn, matches } = useGt()
  const state = filterOn ? (matches(item.skills) ? 'lit' : 'dim') : undefined

  return (
    <li
      className={`gt-chip${state ? ` ${state}` : ''}`}
      id={`chip-${item.id}`}
      data-skills={item.skills.join(' ')}
      data-src={item.src}
    >
      <span className="gt-chip-idx">C.{index < 9 ? '0' : ''}{index + 1}</span>
      <span className="gt-chip-ic" aria-hidden="true">
        <Icon name={CHIP_ICONS[item.id] ?? 'activity'} size={15} />
      </span>
      <h3 className="gt-chip-title">{item.title}</h3>
      <p className="gt-chip-line">{item.line}</p>
      <p className="gt-chip-metric">{item.metric}</p>
      {item.repo ? (
        <RepoLink href={item.repo} title={item.title} label={item.repoName ?? c.work.repo} />
      ) : (
        <span />
      )}
    </li>
  )
}

const Work: React.FC = () => {
  const { c } = useGt()
  const [open, setOpen] = useState<string[]>([])

  const toggle = (arch: string) =>
    setOpen((prev) => (prev.includes(arch) ? prev.filter((a) => a !== arch) : [...prev, arch]))

  return (
    <section id="work" className="sec" aria-labelledby="work-h">
      <p className="eyebrow">{c.work.eyebrow}</p>
      <h2 id="work-h">{c.work.title}</h2>
      <p className="lede">{c.work.lede}</p>

      <div className="gt-cases" id="work-cases">
        {c.work.cases.map((item) => (
          <CaseCard
            key={item.id}
            item={item}
            open={open.includes(item.arch)}
            onToggle={() => toggle(item.arch)}
          />
        ))}
      </div>

      <p className="gt-sub" id="work-chips-lab">
        {c.work.compact}
      </p>
      <ul className="gt-chips" id="work-chips" aria-labelledby="work-chips-lab">
        {c.work.chips.map((item, i) => (
          <CompactChip key={item.id} item={item} index={i} />
        ))}
      </ul>
    </section>
  )
}

export default Work
