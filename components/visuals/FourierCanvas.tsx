import React, { useRef, useEffect, useCallback } from 'react'
import { useMousePosition2 } from '../useMousePosition2'
import {
  TWO_PI, WAVE_DEFS,
  setupDpr, fillBackground, drawGrid, drawCenterAxis,
  drawGradientBackdrop, drawSingleWave, drawTravelingNodes,
} from './canvas-utils'

export interface FourierParams {
  waveAmplitude: number
  waveFrequency: number
  phaseSpeed: number
}

const DEFAULT_PARAMS: FourierParams = {
  waveAmplitude: 1.0,
  waveFrequency: 1.0,
  phaseSpeed: 1.0,
}

interface FourierCanvasProps {
  params?: Partial<FourierParams>
  className?: string
}

const FourierCanvas: React.FC<FourierCanvasProps> = ({ params: overrideParams, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useMousePosition2()
  const frozenRef = useRef(false)
  const animRef = useRef(0)
  const startRef = useRef(performance.now())
  const params = { ...DEFAULT_PARAMS, ...overrideParams }

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) { frozenRef.current = true; return }
    const observer = new MutationObserver(() => {
      if (frozenRef.current) return
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule instanceof CSSStyleRule && rule.selectorText === '*' && rule.style.animationDuration === '0s') {
              frozenRef.current = true; observer.disconnect(); return
            }
          }
        } catch { /* cross-origin */ }
      }
    })
    observer.observe(document.documentElement, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    (window as any).__freezeFourierCanvas = () => { frozenRef.current = true }
    return () => { delete (window as any).__freezeFourierCanvas }
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const setup = setupDpr(canvas)
    if (!setup) return
    const { ctx, w, h } = setup

    const t = (performance.now() - startRef.current) / 1000 * params.phaseSpeed
    const amp = params.waveAmplitude
    const freq = params.waveFrequency

    fillBackground(ctx, w, h)
    drawGradientBackdrop(ctx, w, h)
    drawGrid(ctx, w, h)
    drawCenterAxis(ctx, w, h)

    const cy = h / 2
    const mouse = mouseRef.current
    const mouseRelX = (mouse.x + 1) / 2
    const mouseRelY = mouse.y
    const mouseInfluence = Math.max(0, 1 - Math.abs(mouseRelX - 0.5) * 2)
    const bendFactor = mouseInfluence * mouseRelY

    WAVE_DEFS.forEach(wave => drawSingleWave(ctx, wave, w, cy, amp, freq, t, bendFactor))

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)'
    ctx.lineWidth = 2.5
    ctx.shadowColor = 'rgba(139, 92, 246, 0.4)'
    ctx.shadowBlur = 12
    ctx.beginPath()
    const compositePoints: { x: number; y: number }[] = []
    for (let x = 0; x < w; x += 2) {
      const xNorm = x / w
      let ySum = 0
      WAVE_DEFS.forEach(wave => {
        const baseAmp = wave.a * cy * 0.7 * amp
        const baseFreq = wave.f * freq
        const bend = 1 + bendFactor * Math.sin(xNorm * Math.PI) * 0.3
        ySum += Math.sin(xNorm * baseFreq * TWO_PI + t + wave.phase) * baseAmp * bend
      })
      const y = cy + ySum / WAVE_DEFS.length * 1.5
      compositePoints.push({ x, y })
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.shadowBlur = 0

    drawTravelingNodes(ctx, compositePoints, w, t)
  }, [params, mouseRef])

  useEffect(() => {
    const tick = () => {
      if (frozenRef.current) { draw(); return }
      draw()
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [draw])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const observer = new ResizeObserver(() => { if (!frozenRef.current) draw() })
    observer.observe(canvas.parentElement || canvas)
    return () => observer.disconnect()
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}

export default FourierCanvas
