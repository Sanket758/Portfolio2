import React from 'react'

/**
 * AboutPortrait
 * ─────────────
 * Replaces flat SVG monogram with high-resolution photo asset, subtle glow border,
 * and live experience status badge.
 */
export const AboutPortrait: React.FC = () => {
  return (
    <div className="relative group max-w-sm mx-auto">
      {/* Ambient background glow */}
      <div 
        className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 blur-xl group-hover:opacity-40 transition duration-500"
        style={{
          position: 'absolute',
          inset: '-4px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-pink))',
          opacity: 0.25,
          filter: 'blur(16px)',
          transition: 'opacity 0.5s ease',
        }}
      />
      
      {/* Main image container */}
      <div 
        className="relative overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-surface shadow-2xl"
        style={{
          position: 'relative',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          overflow: 'hidden',
          aspectRatio: '3 / 4',
        }}
      >
        <img
          src="/assets/headshot.jpg"
          alt="Sanket Gadge - AI/ML Engineer"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.5s ease',
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Live Experience Badge Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px',
            padding: '8px 12px',
            background: 'color-mix(in oklch, var(--surface) 85%, transparent)',
            backdropFilter: 'blur(8px)',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981',
              }}
            />
            <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
              Berlin, Germany
            </span>
          </div>
          <span className="meta" style={{ fontSize: '11px', opacity: 0.8 }}>
            4+ Yrs AI/ML
          </span>
        </div>
      </div>
    </div>
  )
}

export default AboutPortrait
