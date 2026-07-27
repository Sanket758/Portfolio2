import React, { useRef, useEffect } from 'react'

const TWO_PI = Math.PI * 2

interface MiniOscilloscopeProps {
  seed: number
  width?: number
  height?: number
  className?: string
}

export const MiniOscilloscope: React.FC<MiniOscilloscopeProps> = ({
  seed,
  width = 240,
  height = 80,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Background
    ctx.fillStyle = '#0b0d18'
    ctx.fillRect(0, 0, width, height)

    // Grid
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.08)'
    ctx.lineWidth = 0.5
    for (let x = 0; x < width; x += 20) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke()
    }
    for (let y = 0; y < height; y += 20) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke()
    }

    // Center axis
    const cy = height / 2
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)'
    ctx.lineWidth = 0.5
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(width, cy); ctx.stroke()

    // Deterministic pseudo-random from seed
    const pseudoRandom = (n: number) => {
      const x = Math.sin(seed * 127.1 + n * 311.7) * 43758.5453
      return x - Math.floor(x)
    }

    // 5 waves
    const waves = [
      { f: 1.0, a: 0.4, color: '139, 92, 246' },
      { f: 2.0, a: 0.25, color: '20, 184, 166' },
      { f: 3.0, a: 0.15, color: '99, 102, 241' },
      { f: 0.5, a: 0.3, color: '168, 85, 247' },
      { f: 4.0, a: 0.1, color: '45, 212, 191' },
    ]

    waves.forEach((wave, i) => {
      const phase = pseudoRandom(i) * TWO_PI
      ctx.strokeStyle = `rgba(${wave.color}, 0.5)`
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = 0; x < width; x += 2) {
        const xNorm = x / width
        const y = cy + Math.sin(xNorm * wave.f * TWO_PI + phase) * wave.a * height * 0.35
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    })
  }, [seed, width, height])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width, height, display: 'block', borderRadius: 6 }}
    />
  )
}

export default MiniOscilloscope
