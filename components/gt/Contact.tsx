import React from 'react'
import Icon from './Icon'
import { useGt } from './GtContext'

/**
 * 07 · CONTACT — one endpoint, no form. The JSON payload is the whole handshake
 * and it is also the thing a recruiter can copy in one click; the ID card
 * repeats the facts that decide whether they write at all.
 */
const Contact: React.FC = () => {
  const { c, copyEmail } = useGt()

  const pairs: [string, string][] = [
    ['name', c.identity.name],
    ['role', c.identity.role],
    ['location', c.identity.location],
    ['availability', c.identity.availability],
    ['work_permit', c.hero.hire[2]?.v ?? ''],
    ['email', c.contact.email],
    ['github', c.contact.github],
    ['linkedin', c.contact.linkedin],
    ['xing', c.contact.xing],
    ['researchgate', c.contact.researchgate],
    ['cv', c.contact.cv],
  ]

  const links: { name: string; href: string; label: string }[] = [
    { name: 'github', href: c.contact.github, label: 'GitHub — Sanket758' },
    { name: 'linkedin', href: c.contact.linkedin, label: 'LinkedIn — sanket758' },
    { name: 'xing', href: c.contact.xing, label: 'XING — Sanket Gadge' },
    { name: 'researchgate', href: c.contact.researchgate, label: 'ResearchGate — Sanket Gadge' },
  ]

  return (
    <section id="contact" className="sec" aria-labelledby="contact-h">
      <p className="eyebrow">{c.contact.eyebrow}</p>
      <h2 id="contact-h">{c.contact.title}</h2>
      <p className="lede">{c.contact.lede}</p>

      <div className="gt-ct">
        <div className="gt-ct-pay">
          <p className="gt-ct-cmd mono" aria-hidden="true">
            $ curl -s /api/contact
          </p>
          <p className="gt-ct-status mono" aria-hidden="true">
            <span className="ok">HTTP/1.1 200 OK</span>
            <span className="meta">content-type: application/json · cache-control: no-store</span>
          </p>
          <pre className="gt-ct-json mono" id="ct-json" tabIndex={0} aria-label={c.contact.payloadAria}>
            {'{\n'}
            {pairs.map(([key, value], i) => (
              <span className="ln" key={key}>
                {'  '}
                <span className="k">&quot;{key}&quot;</span>
                {': '}
                <span className="s">&quot;{value}&quot;</span>
                {i < pairs.length - 1 ? ',' : ''}
                {'\n'}
              </span>
            ))}
            {'}'}
          </pre>
          <div className="gt-ct-acts">
            <button className="gt-ct-btn is-acc" id="ct-copy" type="button" onClick={copyEmail} aria-label={c.contact.copyAria}>
              <Icon name="copy" size={14} />
              {c.contact.copy}
            </button>
            <a className="gt-ct-btn" id="ct-mail" href={`mailto:${c.contact.email}`} aria-label={`Email — ${c.contact.email}`}>
              <Icon name="mail" size={14} />
              {c.contact.mail}
            </a>
            <a className="gt-ct-btn is-acc" id="ct-cv" href={c.contact.cv} download aria-label={c.contact.cvAria}>
              <Icon name="download" size={14} />
              {c.contact.cvLabel}
            </a>
          </div>
        </div>

        <aside className="gt-ct-id" aria-label={c.contact.cardAria}>
          <div className="gt-ct-idtop">
            <img
              className="gt-ct-photo"
              id="ct-photo"
              src={c.contact.headshot}
              alt=""
              width={480}
              height={480}
              loading="lazy"
            />
            <div className="gt-ct-idtex">
              <p className="gt-ct-name" id="ct-name">
                {c.identity.name}
              </p>
              <p className="gt-ct-role" id="ct-role">
                {c.identity.role}
              </p>
            </div>
          </div>

          <dl className="gt-ct-meta mono">
            <div className="gt-ct-row">
              <dt>{c.contact.location}</dt>
              <dd id="ct-loc">{c.identity.location}</dd>
            </div>
            <div className="gt-ct-row">
              <dt>{c.contact.status}</dt>
              <dd>
                <span className="gt-ct-dot" aria-hidden="true" />
                <span id="ct-avail">{c.identity.availability}</span>
              </dd>
            </div>
          </dl>

          <div className="gt-ct-links" id="ct-links">
            {links.map((l) => (
              <a
                key={l.name}
                className="gt-ct-lnk mono"
                href={l.href}
                target="_blank"
                rel="noopener"
                aria-label={l.label}
              >
                <Icon name={l.name} size={14} />
                {l.name}
              </a>
            ))}
          </div>

          <p className="gt-ct-foot mono">{c.contact.foot}</p>
        </aside>
      </div>
    </section>
  )
}

export default Contact
