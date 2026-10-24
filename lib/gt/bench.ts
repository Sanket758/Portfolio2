import { SCENES, type SceneLayers, type SceneStats, type ViewId } from './scenes'

/**
 * Inference-bench controller.
 *
 * The bench is a canvas surface with a split wipe (raw | annotated) and a
 * telemetry plot. React owns *what* the bench shows (scene, view, confidence,
 * layers, split); this module owns *how* it is painted, because canvas drawing
 * is imperative by nature and re-deriving it as effects would be worse code.
 *
 * Behaviour preserved from the design-lab build:
 *  - the rAF loop runs only while the canvas is on screen and reduced motion is off;
 *  - every scroll/state change is a pure function of state, so nothing accumulates;
 *  - telemetry is explicitly labelled illustrative in the UI (values are synthetic).
 */

export interface BenchModel {
  scene: string
  view: ViewId
  conf: number
  split: number
  layers: Required<SceneLayers>
}

export interface BenchMetrics {
  p: number
  r: number
  f1: number
}

export interface BenchHandle {
  update(next: Partial<BenchModel>): void
  setReducedMotion(rm: boolean): void
  stats(): SceneStats | null
  destroy(): void
}

interface BenchOptions {
  canvas: HTMLCanvasElement
  telemetry?: HTMLCanvasElement | null
  model: BenchModel
  reducedMotion: boolean
  onMetrics?: (m: BenchMetrics) => void
}

const TELE_W = 240
const TELE_H = 112

/** Synthetic P/R/F1 curves — illustrative only, drawn next to a SIM label. */
function sim(c: number): BenchMetrics {
  const x = (c - 0.1) / 0.85
  const p = Math.min(0.99, 0.55 + 0.7 * x)
  const r = Math.max(0.14, 0.99 - 0.78 * x)
  const f1 = p + r > 0 ? (2 * p * r) / (p + r) : 0
  return { p, r, f1 }
}

export function createBench({ canvas, telemetry, model, reducedMotion, onMetrics }: BenchOptions): BenchHandle {
  const ctx = canvas.getContext('2d')
  const tctx = telemetry ? telemetry.getContext('2d') : null
  if (!ctx) {
    return { update() {}, setReducedMotion() {}, stats: () => null, destroy() {} }
  }

  let state: BenchModel = { ...model, layers: { ...model.layers } }
  let vw = 960
  let vh = 540
  let dpr = 1
  let rm = reducedMotion
  let visible = true
  let rafId = 0
  let t = 0
  let progress = 0.6
  let destroyed = false

  function paint(): void {
    ctx!.clearRect(0, 0, vw, vh)
    const base = {
      conf: state.conf,
      view: state.view,
      layers: state.layers,
      t,
      progress,
      rm,
    }
    const p = Math.round((state.split / 100) * vw)

    if (state.split >= 99) {
      SCENES.paint(state.scene, ctx!, vw, vh, base)
    } else if (state.split <= 1) {
      SCENES.paint(state.scene, ctx!, vw, vh, { ...base, view: 'raw' })
    } else {
      ctx!.save()
      ctx!.beginPath()
      ctx!.rect(0, 0, p, vh)
      ctx!.clip()
      SCENES.paint(state.scene, ctx!, vw, vh, { ...base, view: 'raw' })
      ctx!.restore()

      ctx!.save()
      ctx!.beginPath()
      ctx!.rect(p, 0, vw - p, vh)
      ctx!.clip()
      SCENES.paint(state.scene, ctx!, vw, vh, base)
      ctx!.restore()

      ctx!.fillStyle = 'rgba(249,250,251,.45)'
      ctx!.fillRect(p - 0.5, 0, 1, vh)
      ctx!.fillStyle = 'rgba(6,182,212,.85)'
      ctx!.fillRect(p - 1.5, 0, 3, 14)
      ctx!.fillRect(p - 1.5, vh - 14, 3, 14)
    }
  }

  function drawTelemetry(): void {
    if (!tctx) return
    const X = (c: number) => 12 + ((c - 0.1) / 0.85) * (TELE_W - 24)
    const Y = (v: number) => TELE_H - 10 - v * (TELE_H - 20)

    tctx.clearRect(0, 0, TELE_W, TELE_H)
    tctx.strokeStyle = 'rgba(249,250,251,.08)'
    tctx.lineWidth = 1
    ;[0, 0.5, 1].forEach((v) => {
      tctx.beginPath()
      tctx.moveTo(12, Y(v))
      tctx.lineTo(TELE_W - 12, Y(v))
      tctx.stroke()
    })

    const curve = (color: string, fn: (c: number) => number) => {
      tctx.strokeStyle = color
      tctx.lineWidth = 1.5
      tctx.beginPath()
      for (let c = 0.1; c <= 0.951; c += 0.05) {
        const x = X(c)
        const y = Y(fn(c))
        if (c === 0.1) tctx.moveTo(x, y)
        else tctx.lineTo(x, y)
      }
      tctx.stroke()
    }

    curve('#10B981', (c) => sim(c).p)
    curve('#F59E0B', (c) => sim(c).r)
    curve('#06B6D4', (c) => sim(c).f1)

    const s = sim(state.conf)
    tctx.strokeStyle = 'rgba(249,250,251,.28)'
    tctx.beginPath()
    tctx.moveTo(X(state.conf), 8)
    tctx.lineTo(X(state.conf), TELE_H - 8)
    tctx.stroke()
    ;[
      ['#10B981', s.p],
      ['#F59E0B', s.r],
      ['#06B6D4', s.f1],
    ].forEach(([color, v]) => {
      tctx.fillStyle = color as string
      tctx.beginPath()
      tctx.arc(X(state.conf), Y(v as number), 2.6, 0, Math.PI * 2)
      tctx.fill()
    })

    onMetrics?.(s)
  }

  function size(): void {
    if (destroyed) return
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = canvas.getBoundingClientRect()
    vw = Math.max(2, rect.width)
    vh = Math.max(2, rect.height || (vw * 9) / 16)
    canvas.width = Math.round(vw * dpr)
    canvas.height = Math.round(vh * dpr)
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    paint()
  }

  function initTelemetry(): void {
    if (!tctx || !telemetry) return
    const d = Math.min(window.devicePixelRatio || 1, 2)
    telemetry.width = TELE_W * d
    telemetry.height = TELE_H * d
    tctx.setTransform(d, 0, 0, d, 0, 0)
  }

  function loop(ts: number): void {
    rafId = requestAnimationFrame(loop)
    t = ts
    const c = (ts % 14000) / 14000
    progress = 0.15 + (c < 0.5 ? c * 1.7 : (1 - c) * 1.7)
    paint()
  }

  function startLoop(): void {
    if (destroyed || rm || !visible || rafId) return
    rafId = requestAnimationFrame(loop)
  }

  function stopLoop(): void {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = 0
    }
  }

  const observer =
    typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => size())
      : null
  observer?.observe(canvas)
  if (!observer) window.addEventListener('resize', size)

  const intersection =
    typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(
          (entries) => {
            visible = entries[0]?.isIntersecting ?? true
            if (visible) {
              paint()
              startLoop()
            } else {
              stopLoop()
            }
          },
          { rootMargin: '80px' },
        )
      : null
  intersection?.observe(canvas)

  initTelemetry()
  size()
  drawTelemetry()
  startLoop()

  return {
    update(next) {
      if (destroyed) return
      state = { ...state, ...next, layers: { ...state.layers, ...(next.layers ?? {}) } }
      if (next.conf !== undefined) drawTelemetry()
      paint()
    },
    setReducedMotion(next) {
      rm = next
      if (rm) {
        stopLoop()
        progress = 0.6
        paint()
      } else {
        startLoop()
      }
    },
    stats() {
      return SCENES.stats(state.scene, {
        conf: state.conf,
        view: state.view,
        layers: state.layers,
      })
    },
    destroy() {
      destroyed = true
      stopLoop()
      observer?.disconnect()
      if (!observer) window.removeEventListener('resize', size)
      intersection?.disconnect()
    },
  }
}
