import React from 'react'
import { useGt } from './GtContext'

/**
 * 06 · FIELD NOTES — the blog posts the previous site carried. They are kept
 * because a portfolio that drops its writing loses the only public evidence of
 * how this person explains a problem, and it costs one compact list.
 */
const Writing: React.FC = () => {
  const { c } = useGt()

  return (
    <section id="writing" className="sec" aria-labelledby="writing-h">
      <p className="eyebrow">{c.writing.eyebrow}</p>
      <h2 id="writing-h">{c.writing.title}</h2>
      <p className="lede">{c.writing.lede}</p>

      <ul className="gt-write">
        {c.writing.posts.map((post) => (
          <li className="gt-write-row" key={post.url}>
            <p className="gt-write-date mono">{post.date}</p>
            <a className="gt-write-link" href={post.url} target="_blank" rel="noopener">
              {post.title}
            </a>
            <p className="gt-write-desc">{post.description}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Writing
