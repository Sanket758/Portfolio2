import React from 'react'
import { useLang } from '../i18n/LanguageContext'
import { getBlogPosts } from '../lib/dataLoader'
import ScrollReveal from './ScrollReveal'

const Writing: React.FC = () => {
  const { t } = useLang()
  const [posts, setPosts] = React.useState<any[]>([])
  React.useEffect(() => { getBlogPosts().then(setPosts) }, [])

  return (
    <section id="writing" className="section">
      <div className="container max-w-4xl">
        <header className="mb-16" style={{textAlign: 'center'}}>
          <p className="eyebrow">{t.nav.writing}</p>
          <ScrollReveal><h2 className="h2">{t.writing.title}</h2></ScrollReveal>
        </header>
        <div>
          {(posts.length > 0 ? posts : []).map((post, i) => (
            <a key={i} href={post.blogUrl} target="_blank" rel="noopener noreferrer" className="log-row" style={{ display: 'grid', gridTemplateColumns: '100px 1fr auto', gap: 24, padding: '18px 0', borderTop: '1px solid var(--border)', alignItems: 'baseline', textDecoration: 'none', color: 'inherit' }}>
              <span className="meta">{post.date}</span>
              <div>
                <h3 style={{ fontSize: 18, margin: 0 }}>{post.title}</h3>
                <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: 14 }}>{post.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Writing
