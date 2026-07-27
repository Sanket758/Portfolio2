export const TWO_PI = Math.PI * 2

export interface WaveDef {
  f: number
  a: number
  phase: number
  color: string
  lw: number
}

export function setupDpr(canvas: HTMLCanvasElement): { ctx: CanvasRenderingContext2D; w: number; h: number } | null {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  const w = rect.width
  const h = rect.height
  canvas.width = w * dpr
  canvas.height = h * dpr
  ctx.scale(dpr, dpr)
  return { ctx, w, h }
}

export function fillBackground(ctx: CanvasRenderingContext2D, w: number, h: number, color = '#05070f') {
  ctx.fillStyle = color
  ctx.fillRect(0, 0, w, h)
}

export function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number, step = 40, color = 'rgba(139, 92, 246, 0.06)') {
  ctx.strokeStyle = color
  ctx.lineWidth = 0.5
  for (let x = 0; x < w; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
  }
  for (let y = 0; y < h; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
  }
}

export function drawCenterAxis(ctx: CanvasRenderingContext2D, w: number, h: number, color = 'rgba(139, 92, 246, 0.15)') {
  ctx.strokeStyle = color
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke()
}

export function drawGradientBackdrop(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, w, h)
  grad.addColorStop(0, 'rgba(139, 92, 246, 0.03)')
  grad.addColorStop(0.5, 'rgba(20, 184, 166, 0.02)')
  grad.addColorStop(1, 'rgba(139, 92, 246, 0.03)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)
}

export function drawSingleWave(
  ctx: CanvasRenderingContext2D,
  wave: WaveDef,
  w: number,
  cy: number,
  amp: number,
  freq: number,
  t: number,
  bendFactor: number
) {
  const baseAmp = wave.a * cy * 0.7 * amp
  const baseFreq = wave.f * freq
  ctx.strokeStyle = `rgba(${wave.color}, 0.5)`
  ctx.lineWidth = wave.lw
  ctx.beginPath()
  for (let x = 0; x < w; x += 2) {
    const xNorm = x / w
    const bend = 1 + bendFactor * Math.sin(xNorm * Math.PI) * 0.3
    const y = cy + Math.sin(xNorm * baseFreq * TWO_PI + t + wave.phase) * baseAmp * bend
    if (x === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
}

export function drawTravelingNodes(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  w: number,
  t: number,
  count = 8
) {
  for (let i = 0; i < count; i++) {
    const nodePhase = (t * 0.3 + i / count) % 1
    const nodeX = nodePhase * w
    const idx = Math.floor(nodeX / 2)
    if (idx < points.length) {
      const pt = points[idx]
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, 4, 0, TWO_PI)
      ctx.fill()
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, 8, 0, TWO_PI)
      ctx.stroke()
    }
  }
}

export const WAVE_DEFS: WaveDef[] = [
  { f: 1.0, a: 0.5, phase: 0, color: '139, 92, 246', lw: 2 },
  { f: 2.0, a: 0.3, phase: Math.PI / 3, color: '20, 184, 166', lw: 1.5 },
  { f: 3.0, a: 0.2, phase: Math.PI / 6, color: '99, 102, 241', lw: 1.2 },
  { f: 0.5, a: 0.4, phase: Math.PI / 2, color: '168, 85, 247', lw: 1.8 },
  { f: 4.0, a: 0.15, phase: 0, color: '45, 212, 191', lw: 1 },
]
