import React, { useRef, useEffect } from 'react'

interface PhaseStripeProps {
  width?: number
  height?: number
  className?: string
}

export const PhaseStripe: React.FC<PhaseStripeProps> = ({
  width = 300,
  height = 12,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef(0)
  const startRef = useRef(performance.now())

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

      // Center axis
      const cy = height / 2
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)'
      ctx.lineWidth = 0.5
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(width, cy); ctx.stroke()

      if (!reduceMotion) {
        const t = (performance.now() - startRef.current) / 2000
        const nodeX = (t % 1) * width
        ctx.fillStyle = 'rgba(167, 139, 250, 0.8)'
        ctx.beginPath()
        ctx.arc(nodeX, cy, 3, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    if (reduceMotion) {
      draw()
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
      style={{ width, height, display: 'block' }}
    />
  )
}

export default PhaseStripe
