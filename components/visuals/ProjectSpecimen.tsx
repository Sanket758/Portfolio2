import React, { useEffect, useRef } from 'react'
import type { ProjectGroup } from '../../lib/projects'

interface ProjectSpecimenProps {
  seed: number
  group: ProjectGroup
  height?: number
  className?: string
}

type Point = { x: number; y: number }
type Route = { points: Point[]; length: number }
type Module = { x: number; y: number; w: number; h: number; tone: number }

const TAU = Math.PI * 2

/** A tiny deterministic random source: thumbnails never change between renders. */
const mulberry32 = (value: number) => {
  let state = value >>> 0
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const GROUP_TONE: Record<ProjectGroup, [number, number, number]> = {
  'computer-vision': [129, 140, 248],
  robotics: [45, 212, 191],
  agentic: [192, 132, 252],
  'applied-ml': [56, 189, 248],
  edge: [244, 164, 96],
  backend: [167, 139, 250],
}

const distance = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y)

const routeLength = (points: Point[]) =>
  points.reduce((total, point, i) => (i === 0 ? 0 : total + distance(points[i - 1], point)), 0)

function pointAlongRoute(route: Route, distanceAlong: number): Point {
  let remaining = distanceAlong
  for (let i = 1; i < route.points.length; i++) {
    const from = route.points[i - 1]
    const to = route.points[i]
    const segment = distance(from, to)
    if (remaining <= segment) {
      const ratio = segment === 0 ? 0 : remaining / segment
      return { x: from.x + (to.x - from.x) * ratio, y: from.y + (to.y - from.y) * ratio }
    }
    remaining -= segment
  }
  return route.points[route.points.length - 1]
}

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

function drawCore(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, group: ProjectGroup, phase: number, tone: string) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(phase * 0.12)
  ctx.strokeStyle = tone
  ctx.lineWidth = 1
  ctx.globalAlpha = 0.9

  // A different instrument-like core for each discipline.
  if (group === 'computer-vision') {
    ctx.strokeRect(-radius * 0.62, -radius * 0.62, radius * 1.24, radius * 1.24)
    ctx.strokeRect(-radius * 0.28, -radius * 0.28, radius * 0.56, radius * 0.56)
    for (const sign of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(sign * radius * 0.78, -radius * 0.22); ctx.lineTo(sign * radius * 1.12, -radius * 0.22); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(sign * radius * 0.78, radius * 0.22); ctx.lineTo(sign * radius * 1.12, radius * 0.22); ctx.stroke()
    }
  } else if (group === 'robotics') {
    ctx.beginPath(); ctx.moveTo(0, -radius); ctx.lineTo(radius * 0.86, radius * 0.56); ctx.lineTo(-radius * 0.86, radius * 0.56); ctx.closePath(); ctx.stroke()
    ctx.beginPath(); ctx.arc(0, 0, radius * 0.28, 0, TAU); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(-radius * 1.05, 0); ctx.lineTo(radius * 1.05, 0); ctx.stroke()
  } else if (group === 'agentic') {
    ctx.beginPath(); ctx.arc(0, 0, radius * 0.65, 0, TAU); ctx.stroke()
    for (let i = 0; i < 3; i++) {
      const a = i * TAU / 3 - Math.PI / 2
      ctx.beginPath(); ctx.arc(Math.cos(a) * radius * 0.98, Math.sin(a) * radius * 0.98, radius * 0.16, 0, TAU); ctx.stroke()
    }
  } else if (group === 'applied-ml') {
    ctx.beginPath(); ctx.moveTo(-radius * 0.82, radius * 0.62); ctx.lineTo(-radius * 0.18, -radius * 0.72); ctx.lineTo(radius * 0.25, radius * 0.1); ctx.lineTo(radius * 0.86, -radius * 0.55); ctx.stroke()
    for (const p of [[-0.82, 0.62], [-0.18, -0.72], [0.25, 0.1], [0.86, -0.55]]) {
      ctx.beginPath(); ctx.arc(p[0] * radius, p[1] * radius, radius * 0.12, 0, TAU); ctx.stroke()
    }
  } else if (group === 'edge') {
    drawRoundedRect(ctx, -radius * 0.65, -radius * 0.65, radius * 1.3, radius * 1.3, radius * 0.16)
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath(); ctx.moveTo(-radius * 0.92, i * radius * 0.38); ctx.lineTo(-radius * 0.72, i * radius * 0.38); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(radius * 0.72, i * radius * 0.38); ctx.lineTo(radius * 0.92, i * radius * 0.38); ctx.stroke()
    }
  } else {
    drawRoundedRect(ctx, -radius * 0.68, -radius * 0.68, radius * 1.36, radius * 1.36, radius * 0.16)
    ctx.beginPath(); ctx.moveTo(-radius * 0.4, -radius * 0.12); ctx.lineTo(radius * 0.4, -radius * 0.12); ctx.lineTo(-radius * 0.4, radius * 0.42); ctx.lineTo(radius * 0.4, radius * 0.42); ctx.stroke()
  }
  ctx.restore()
}

function drawPath(ctx: CanvasRenderingContext2D, points: Point[]) {
  ctx.beginPath()
  points.forEach((point, i) => (i === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y)))
  ctx.stroke()
}

function drawSpecimen(ctx: CanvasRenderingContext2D, width: number, height: number, seed: number, group: ProjectGroup, now: number) {
  const rand = mulberry32(seed * 7919 + 17)
  const [r, g, b] = GROUP_TONE[group]
  const tone = `rgb(${r}, ${g}, ${b})`
  const softTone = `rgba(${r}, ${g}, ${b}, 0.22)`
  const time = now / 1000
  const center = { x: width * 0.5, y: height * 0.5 }
  const radius = Math.max(12, Math.min(18, height * 0.24))

  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = '#0b0d18'
  ctx.fillRect(0, 0, width, height)

  // A faint calibration field gives the thumbnail a full-width instrument plate.
  ctx.strokeStyle = 'rgba(255,255,255,0.045)'
  ctx.lineWidth = 0.5
  const grid = Math.max(18, width / 18)
  for (let x = grid / 2; x < width; x += grid) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke()
  }
  for (let y = 12; y < height; y += 18) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke()
  }

  const moduleCount = width < 360 ? 5 : 7
  const modules: Module[] = []
  for (let i = 0; i < moduleCount; i++) {
    const side = i % 2 === 0 ? -1 : 1
    const row = Math.floor(i / 2)
    const x = side < 0
      ? width * (0.07 + (row % 2) * 0.055) + rand() * width * 0.04
      : width * (0.76 - (row % 2) * 0.055) - rand() * width * 0.04
    const y = height * (0.18 + (row % 3) * 0.31) + (rand() - 0.5) * 7
    modules.push({ x, y, w: 27 + rand() * 12, h: 15 + rand() * 7, tone: rand() })
  }

  const routes: Route[] = modules.map((module, i) => {
    const start = { x: module.x + (module.x < center.x ? module.w : 0), y: module.y + module.h / 2 }
    const elbowX = module.x < center.x
      ? center.x - radius - 13 - (i % 2) * 7
      : center.x + radius + 13 + (i % 2) * 7
    const points = [start, { x: elbowX, y: start.y }, { x: elbowX, y: center.y }, { x: center.x + (module.x < center.x ? -radius : radius), y: center.y }]
    return { points, length: routeLength(points) }
  })

  // Signal lanes, with a soft duplicate underneath for a restrained glow.
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  for (const route of routes) {
    ctx.strokeStyle = `rgba(${r},${g},${b},0.10)`
    ctx.lineWidth = 4
    drawPath(ctx, route.points)
    ctx.strokeStyle = `rgba(${r},${g},${b},0.48)`
    ctx.lineWidth = 0.8
    drawPath(ctx, route.points)
  }

  // Small modules: each looks like a different miniature instrument, not a generic card.
  for (const module of modules) {
    const q = 0.3 + module.tone * 0.35
    ctx.fillStyle = `rgba(${r},${g},${b},0.07)`
    ctx.strokeStyle = `rgba(${r},${g},${b},${q})`
    ctx.lineWidth = 0.8
    drawRoundedRect(ctx, module.x, module.y, module.w, module.h, 2)
    ctx.fill(); ctx.stroke()
    ctx.strokeStyle = `rgba(232,234,240,${0.18 + module.tone * 0.22})`
    ctx.lineWidth = 1
    const bars = 2 + Math.floor(module.tone * 3)
    for (let j = 0; j < bars; j++) {
      const barX = module.x + 5 + j * 5
      const barH = 2 + ((j + Math.floor(seed)) % 3) * 2
      ctx.beginPath(); ctx.moveTo(barX, module.y + module.h - 4); ctx.lineTo(barX, module.y + module.h - 4 - barH); ctx.stroke()
    }
    ctx.fillStyle = tone
    ctx.beginPath(); ctx.arc(module.x + module.w - 5, module.y + 5, 1.3, 0, TAU); ctx.fill()
  }

  // Core halo and rotating instrument face.
  const pulse = 0.68 + 0.18 * Math.sin(time * 2.2 + seed)
  const halo = ctx.createRadialGradient(center.x, center.y, radius * 0.5, center.x, center.y, radius * 2.2)
  halo.addColorStop(0, `rgba(${r},${g},${b},${0.18 * pulse})`)
  halo.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = halo
  ctx.fillRect(center.x - radius * 2.5, center.y - radius * 2.5, radius * 5, radius * 5)
  ctx.fillStyle = '#0b0d18'
  ctx.strokeStyle = tone
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.arc(center.x, center.y, radius * 1.15, 0, TAU); ctx.fill(); ctx.stroke()
  drawCore(ctx, center.x, center.y, radius, group, time, tone)

  // One tracer loops through the network, making the system feel alive.
  const totalRouteLength = routes.reduce((sum, route) => sum + route.length, 0)
  let cursor = ((time * 42 + seed * 31) % Math.max(1, totalRouteLength))
  let active: Point | undefined
  for (const route of routes) {
    if (cursor <= route.length) { active = pointAlongRoute(route, cursor); break }
    cursor -= route.length
  }
  if (active) {
    const glow = ctx.createRadialGradient(active.x, active.y, 0, active.x, active.y, 9)
    glow.addColorStop(0, 'rgba(255,255,255,0.9)')
    glow.addColorStop(1, `rgba(${r},${g},${b},0)`)
    ctx.fillStyle = glow
    ctx.fillRect(active.x - 9, active.y - 9, 18, 18)
    ctx.fillStyle = '#ffffff'
    ctx.beginPath(); ctx.arc(active.x, active.y, 1.5, 0, TAU); ctx.fill()
  }

  // Calibration ticks along the full bottom edge make use of the available width.
  ctx.strokeStyle = softTone
  ctx.lineWidth = 0.7
  for (let x = 8; x < width - 8; x += Math.max(16, width / 24)) {
    const tick = x % 3 === 0 ? 4 : 2
    ctx.beginPath(); ctx.moveTo(x, height - 5); ctx.lineTo(x, height - 5 - tick); ctx.stroke()
  }
}

export const ProjectSpecimen: React.FC<ProjectSpecimenProps> = ({
  seed,
  group,
  height = 80,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const sizeRef = useRef({ width: 0, height })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let disposed = false
    let lastFrame = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const width = Math.max(1, Math.round(rect.width))
      const logicalHeight = Math.max(1, Math.round(rect.height))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const nextWidth = Math.round(width * dpr)
      const nextHeight = Math.round(logicalHeight * dpr)
      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth
        canvas.height = nextHeight
      }
      sizeRef.current = { width, height: logicalHeight }
    }

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()

    const draw = (now: number) => {
      if (disposed) return
      // Cap each thumbnail at ~30fps; the cards stay calm while scrolling.
      if (now - lastFrame >= 32) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        drawSpecimen(ctx, sizeRef.current.width, sizeRef.current.height, seed, group, now)
        lastFrame = now
      }
      frameRef.current = requestAnimationFrame(draw)
    }
    frameRef.current = requestAnimationFrame(draw)

    return () => {
      disposed = true
      observer.disconnect()
      cancelAnimationFrame(frameRef.current)
    }
  }, [group, height, seed])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ width: '100%', height, display: 'block', borderRadius: 4 }}
    />
  )
}

export default ProjectSpecimen
