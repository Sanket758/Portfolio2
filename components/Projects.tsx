import React from 'react'
import ScrollReveal from './ScrollReveal'
import { GlowCard } from './visuals/GlowCard'
import { ProjectSpecimen } from './visuals/ProjectSpecimen'
import { useLang } from '../i18n/LanguageContext'
import {
  projects,
  projectGroupOrder,
  PROJECT_GROUPS,
  type Project,
  type ProjectGroup,
} from '../lib/projects'

const GROUP_GLYPH: Record<ProjectGroup, string> = {
  'computer-vision': 'CV',
  'applied-ml': 'ML',
  robotics: 'ROB',
  agentic: 'AGENT',
  edge: 'EDGE',
  backend: 'PY',
}

const ProjectCard: React.FC<{ p: Project }> = ({ p }) => {
  const { t } = useLang()
  const repoHref = p.repo && !p.localOnly ? `https://github.com/${p.repo}` : undefined

  return (
    <GlowCard className="h-full flex flex-col min-w-0" style={{ padding: 22 }}>
      {/* Full-bleed technical specimen — category-specific core */}
      <div
        style={{
          marginBottom: 14,
          borderRadius: 6,
          overflow: 'hidden',
          width: '100%',
          border: '1px solid var(--border)',
        }}
      >
        <ProjectSpecimen seed={p.seeds.wave} group={p.group} height={80} />
      </div>

      {/* Title + meta */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <h3 className="h3" style={{ margin: 0, fontSize: 'clamp(17px, 2vw, 21px)' }}>
            {p.title}
          </h3>
          <span
            className="pill"
            style={{ flexShrink: 0, color: 'var(--accent-indigo)', background: 'color-mix(in oklch, var(--accent-indigo) 10%, transparent)' }}
          >
            {GROUP_GLYPH[p.group]}
          </span>
        </div>
        {p.localOnly && (
          <span
            className="meta"
            style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}
          >
            ⚡ local build · pre-public
          </span>
        )}
      </div>

      <p className="text-sm text-muted" style={{ margin: 0, marginBottom: 12, flexGrow: 1, color: 'var(--fg-soft)' }}>
        {p.description}
      </p>

      {/* Verified metric */}
      {p.metric && (
        <div
          className="num"
          style={{
            marginBottom: 12,
            fontSize: 13,
            color: 'var(--accent-teal)',
            background: 'color-mix(in oklch, var(--accent-teal) 8%, transparent)',
            border: '1px solid color-mix(in oklch, var(--accent-teal) 25%, transparent)',
            borderRadius: 6,
            padding: '6px 10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            alignSelf: 'flex-start',
          }}
        >
          <span style={{ opacity: 0.75 }}>↗</span>
          {p.metric}
        </div>
      )}

      {/* Tech pills */}
      <div className="pill-row" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {p.tech.map((tech) => (
          <span className="tag" key={tech}>{tech}</span>
        ))}
      </div>

      {/* Source link */}
      {repoHref ? (
        <a
          href={repoHref}
          target="_blank"
          rel="noreferrer"
          className="num"
          style={{
            fontSize: 12,
            color: 'var(--accent)',
            textDecoration: 'none',
            borderTop: '1px solid var(--border)',
            paddingTop: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: '1 1 auto' }}>
            github.com/{p.repo}
          </span>
          <span aria-hidden="true" style={{ flexShrink: 0, marginLeft: 8 }}>↗</span>
        </a>
      ) : (
        <div
          className="num"
          style={{
            fontSize: 12,
            color: 'var(--muted)',
            borderTop: '1px solid var(--border)',
            paddingTop: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {t.projects.localEvidence}
          </span>
          {p.localOnly && <span aria-hidden="true" style={{ flexShrink: 0 }}>local</span>}
        </div>
      )}
    </GlowCard>
  )
}

const ProjectGroupRail: React.FC = () => (
  <nav className="project-rail" aria-label="Project categories">
    {projectGroupOrder.map((group) => (
      <a key={group} href={`#project-group-${group}`}>
        <span className="pill" aria-hidden="true">{GROUP_GLYPH[group]}</span>
        <span>{PROJECT_GROUPS[group].label}</span>
      </a>
    ))}
  </nav>
)

const GroupSection: React.FC<{ group: ProjectGroup; index: number }> = ({ group, index }) => {
  const items = projects.filter((p) => p.group === group)
  if (items.length === 0) return null
  return (
    <div id={`project-group-${group}`} style={{ marginBottom: index === projectGroupOrder.length - 1 ? 0 : 48 }}>
      <ScrollReveal>
        <p className="eyebrow" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            aria-hidden="true"
            style={{
              display: 'inline-block',
              width: 22,
              height: 1,
              background: 'var(--accent)',
              opacity: 0.6,
            }}
          />
          {PROJECT_GROUPS[group].label}
        </p>
      </ScrollReveal>
      <div className="grid-2" style={{ gap: 20 }}>
        {items.map((p) => (
          <ScrollReveal key={p.id} delay={40} className="min-w-0">
            <ProjectCard p={p} />
          </ScrollReveal>
        ))}
      </div>
    </div>
  )
}

const Projects: React.FC = () => {
  const { t } = useLang()
  return (
    <section id="projects" className="section">
      <div className="container max-w-5xl">
        <header className="mb-12" style={{ textAlign: 'center' }}>
          <p className="eyebrow">{t.nav.projects}</p>
          <ScrollReveal><h2 className="h2">{t.projects.title}</h2></ScrollReveal>
          <ScrollReveal delay={80}>
            <p className="lead" style={{ margin: '16px auto 0' }}>{t.projects.lead}</p>
          </ScrollReveal>
          <ProjectGroupRail />
        </header>
        {projectGroupOrder.map((group, i) => (
          <GroupSection key={group} group={group} index={i} />
        ))}
      </div>
    </section>
  )
}

export default Projects
