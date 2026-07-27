import React from 'react'
import { useLang } from '../i18n/LanguageContext'
import ScrollReveal from './ScrollReveal'
import { GlowCard } from './visuals/GlowCard'
import { MiniOscilloscope } from './visuals/MiniOscilloscope'

const Projects: React.FC = () => {
  const { t } = useLang()
  return (
    <section id="projects" className="section">
      <div className="container max-w-4xl">
        <header className="mb-16" style={{ textAlign: 'center' }}>
          <p className="eyebrow">{t.nav.projects}</p>
          <ScrollReveal><h2 className="h2">{t.projects.title}</h2></ScrollReveal>
        </header>
        <div className="grid-2" style={{ gap: 24 }}>
          <GlowCard>
            <div style={{ marginBottom: 12, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <MiniOscilloscope seed={1} width={240} height={60} />
            </div>
            <div style={{ marginBottom: 12, borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <img
                src="/assets/cv_pipeline_illustration.jpg"
                alt="Computer Vision Pipeline 3D Diagram"
                style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <h3 className="h3" style={{ marginBottom: 8 }}>Computer Vision Pipeline</h3>
            <p className="text-sm text-muted" style={{ marginBottom: 12 }}>Colgate retail shelf monitoring with YOLOv5 fine-tuning on 500+ SKUs. Achieved 95% precision and 60% reduction in manual audits.</p>
            <div className="pill-row" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <span className="tag">PyTorch</span><span className="tag">OpenCV</span><span className="tag">AWS</span>
            </div>
          </GlowCard>

          <GlowCard>
            <div style={{ marginBottom: 12, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <MiniOscilloscope seed={2} width={240} height={60} />
            </div>
            <h3 className="h3" style={{ marginBottom: 8 }}>OCR-Inc Sanctions Pipeline</h3>
            <p className="text-sm text-muted" style={{ marginBottom: 12 }}>Data ingestion from 6 sources, deduplication via hash-based matching — 95% duplicate removal at scale.</p>
            <div className="pill-row" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <span className="tag">Python</span><span className="tag">AWS Lambda</span><span className="tag">S3</span>
            </div>
          </GlowCard>

          <GlowCard>
            <div style={{ marginBottom: 12, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <MiniOscilloscope seed={3} width={240} height={60} />
            </div>
            <h3 className="h3" style={{ marginBottom: 8 }}>HRI Streax Auto-Counting</h3>
            <p className="text-sm text-muted" style={{ marginBottom: 12 }}>SAM + DINOv2 segmentation for 10,000+ images/month — 90% reduction in manual product checks.</p>
            <div className="pill-row" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <span className="tag">Segment Anything</span><span className="tag">DINOv2</span><span className="tag">Python</span>
            </div>
          </GlowCard>

          <GlowCard>
            <div style={{ marginBottom: 12, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <MiniOscilloscope seed={4} width={240} height={60} />
            </div>
            <h3 className="h3" style={{ marginBottom: 8 }}>Generative-AI Ad Prototype</h3>
            <p className="text-sm text-muted" style={{ marginBottom: 12 }}>FAISS embeddings + PSD-layer parsing for Kellogg's creative replacement — 40% speedup with browser resource conservation.</p>
            <div className="pill-row" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <span className="tag">FAISS</span><span className="tag">Generative AI</span><span className="tag">PyTorch</span>
            </div>
          </GlowCard>
        </div>
      </div>
    </section>
  )
}

export default Projects
