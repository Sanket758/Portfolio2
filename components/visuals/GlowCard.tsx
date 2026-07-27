import React, { useRef, useState } from 'react'

interface GlowCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

/**
 * GlowCard
 * ────────
 * A Vercel/Stripe-style glassmorphic card with a mouse-tracking spotlight radial gradient.
 * Provides instant high-end visual feedback on hover.
 */
export const GlowCard: React.FC<GlowCardProps> = ({ children, className = '', style }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`card relative overflow-hidden transition-all duration-300 ${className}`}
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        background: 'var(--surface)',
        boxShadow: 'var(--shadow-card)',
        padding: '24px',
        ...style,
      }}
    >
      {/* Spotlight glow overlay */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          position: 'absolute',
          inset: '-1px',
          opacity,
          pointerEvents: 'none',
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, color-mix(in oklch, var(--accent) 12%, transparent), transparent 40%)`,
          borderRadius: 'inherit',
        }}
      />
      {/* Border shine effect */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          position: 'absolute',
          inset: '-1px',
          opacity,
          pointerEvents: 'none',
          borderRadius: 'inherit',
          padding: '1px',
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, var(--accent), transparent 40%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  )
}

export default GlowCard
