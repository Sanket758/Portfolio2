import React, { useRef, useEffect } from 'react'

interface EQBarsProps {
  width?: number
  height?: number
  className?: string
}

export const EQBars: React.FC<EQBarsProps> = ({
  width = 200,
  height = 40,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef(0)
  const startRef = useRef(performance.now())
  const scrollVelRef = useRef(0)

  useEffect(() => {
    let lastScroll = window.scrollY
    let lastTime = performance.now()

    const onScroll = () => {
      const now = performance.now()
      const dt = now - lastTime
      if (dt > 0) {
        const vel = Math.abs(window.scrollY - lastScroll) / dt
        scrollVelRef.current = Math.min(vel * 10, 1)
      }
      lastScroll = window.scrollY
      lastTime = now
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const draw = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)

      ctx.fillStyle = '#0b0d18'
      ctx.fillRect(0, 0, width, height)

      const numBars = 8
      const barWidth = width / numBars * 0.6
      const gap = width / numBars * 0.4
      const t = (performance.now() - startRef.current) / 1000
      const scrollBoost = scrollVelRef.current

      for (let i = 0; i < numBars; i++) {
        const baseHeight = (0.3 + 0.7 * Math.abs(Math.sin(t * 2 + i * 0.8))) * height * 0.8
        const h = Math.min(baseHeight * (1 + scrollBoost * 0.5), height * 0.95)
        const x = i * (barWidth + gap) + gap / 2
        const y = height - h

        const gradient = ctx.createLinearGradient(x, height, x, y)
        gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)')
        gradient.addColorStop(1, 'rgba(45, 212, 191, 0.6)')
        ctx.fillStyle = gradient
        ctx.fillRect(x, y, barWidth, h)
      }

      // Decay scroll velocity
      scrollVelRef.current *= 0.95
    }

    if (reduceMotion) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const dpr = window.devicePixelRatio || 1
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)
        ctx.fillStyle = '#0b0d18'
        ctx.fillRect(0, 0, width, height)
        const numBars = 8
        const barWidth = width / numBars * 0.6
        const gap = width / numBars * 0.4
        for (let i = 0; i < numBars; i++) {
          const h = height * 0.5
          const x = i * (barWidth + gap) + gap / 2
          ctx.fillStyle = 'rgba(139, 92, 246, 0.4)'
          ctx.fillRect(x, height - h, barWidth, h)
        }
      }
    } else {
      const tick = () => { draw(); animRef.current = requestAnimationFrame(tick) }
      animRef.current = requestAnimationFrame(tick)
    }
    return () => cancelAnimationFrame(animRef.current)
  }, [width, height])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width, height, display: 'block', borderRadius: 4 }}
    />
  )
}

export default EQBars
