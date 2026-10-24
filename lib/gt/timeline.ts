import type { Track } from './content'

/**
 * Career timeline as multi-object tracking.
 *
 * Pure function of a progress value 0..1: the playhead, the lit bars and the
 * record card are all derived from it, so scrolling forward and back through the
 * same position gives the same picture. React mounts this into a host element
 * and takes back only what React should own (the heading, the legend, the
 * scroll listener); the SVG, the bar buttons and the card belong to this module
 * — the same division d3 charts use.
 *
 * Ported from design-lab/18-ground-truth `js/track.js` (M3), keeping the
 * behaviour, geometry and label-fitting heuristics that were measured there.
 */

export interface TimelineOptions {
  /** localized word for an open-ended track, e.g. "present" / "heute" */
  present: string
  cardAria: string
  reducedMotion: () => boolean
  /** override "now" for deterministic tests */
  now?: number
}

export interface TimelineHandle {
  setProgress(p: number): void
  select(id: string): void
  destroy(): void
}

const NS = 'http://www.w3.org/2000/svg'

const VB_W = 1000
const AXIS_Y = 28
const PANEL_TOP = 56
const ROW_H = 54
const BAR_OFF = 30
const BAR_H = 18
const PAD_BOTTOM = 8

const CSS = [
  '.gt-trk{overflow-x:auto;font-family:var(--mono,"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace)}',
  '.gt-trk-inner{position:relative;min-width:720px}',
  '.gt-trk *{box-sizing:border-box}',
  '.gt-trk-svg{display:block;width:100%;height:auto}',
  '.gt-trk-panel{fill:var(--card,#111827);stroke:rgba(255,255,255,.08);stroke-width:1}',
  '.gt-trk-axis{stroke:rgba(255,255,255,.08);stroke-width:1}',
  '.gt-trk-tick{stroke:rgba(255,255,255,.16);stroke-width:1}',
  '.gt-trk-ylab{fill:var(--faint,#6B7280);font-size:10px;letter-spacing:.04em}',
  '.gt-trk-ph{stroke:var(--ink,#F9FAFB);stroke-width:1;stroke-opacity:.7}',
  '.gt-trk-ro{fill:var(--dim,#9CA3AF);font-size:11.5px;letter-spacing:.02em}',
  '.gt-trk-fg{position:absolute;inset:0}',
  '.gt-trk .trk{position:absolute;margin:0;padding:0;border:0;font:inherit;color:#C3CAD6;background:transparent;border-radius:4px;cursor:pointer;display:flex;align-items:center;overflow:hidden;min-width:10px}',
  '.gt-trk .trk .gt-trk-lbl{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;text-align:left;font-size:11.5px;line-height:1.2;padding:0 6px;color:inherit}',
  '.gt-trk .trk.lane-exp{background:rgba(6,182,212,.14);border:1px solid #06B6D4}',
  '.gt-trk .trk.lane-edu{background:rgba(16,185,129,.14);border:1px solid #10B981}',
  '.gt-trk .trk:not(.gt-trk-mark).lane-exp:hover{background:rgba(6,182,212,.3);outline:1px solid rgba(6,182,212,.55);outline-offset:0}',
  '.gt-trk .trk:not(.gt-trk-mark).lane-edu:hover{background:rgba(16,185,129,.3);outline:1px solid rgba(16,185,129,.55);outline-offset:0}',
  '.gt-trk .trk.lane-exp.lit{background:#06B6D4;border-color:#06B6D4;color:#090D16}',
  '.gt-trk .trk.lane-edu.lit{background:#10B981;border-color:#10B981;color:#090D16}',
  '.gt-trk .trk.gt-trk-above{overflow:visible}',
  '.gt-trk .trk.gt-trk-above .gt-trk-lbl{position:absolute;bottom:calc(100% + 3px);left:0;display:block;padding:0;font-size:11px;line-height:1.2;white-space:nowrap;color:#C3CAD6}',
  '.gt-trk .trk.gt-trk-above.gt-trk-r2 .gt-trk-lbl{bottom:calc(100% + 18px)}',
  '.gt-trk .trk.gt-trk-above.gt-trk-ar .gt-trk-lbl{left:auto;right:0}',
  '.gt-trk .trk:hover .gt-trk-lbl{text-decoration:underline;color:var(--ink,#F9FAFB)}',
  '.gt-trk .trk.lit:not(.gt-trk-above):hover .gt-trk-lbl{color:#090D16}',
  '.gt-trk .trk.gt-trk-mark{background:none;border:0;min-width:0;width:13px;justify-content:center;border-radius:0}',
  '.gt-trk .trk.gt-trk-mark.lane-exp .gt-trk-dia{border:1px solid #06B6D4;background:rgba(6,182,212,.14)}',
  '.gt-trk .trk.gt-trk-mark.lane-edu .gt-trk-dia{border:1px solid #10B981;background:rgba(16,185,129,.14)}',
  '.gt-trk .trk.gt-trk-mark .gt-trk-dia{flex:0 0 9px;width:9px;height:9px;border-radius:2px;transform:rotate(45deg)}',
  '.gt-trk .trk.gt-trk-mark.lane-exp:hover .gt-trk-dia{background:rgba(6,182,212,.3);outline:1px solid rgba(6,182,212,.55)}',
  '.gt-trk .trk.gt-trk-mark.lane-edu:hover .gt-trk-dia{background:rgba(16,185,129,.3);outline:1px solid rgba(16,185,129,.55)}',
  '.gt-trk .trk.gt-trk-mark.lane-exp.lit .gt-trk-dia{background:#06B6D4}',
  '.gt-trk .trk.gt-trk-mark.lane-edu.lit .gt-trk-dia{background:#10B981}',
  '.gt-trk .trk:focus-visible,.gt-trk .trk.gt-trk-mark:focus-visible{outline:2px solid var(--ink,#F9FAFB);outline-offset:2px}',
  '.gt-trk-card{position:sticky;left:0;margin-top:14px;background:var(--card,#111827);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:14px 16px 12px;min-height:188px}',
  '@media (max-width:760px){.gt-trk-card{min-height:284px}}',
  '.gt-trk-card-h{margin:0;font-size:14px;line-height:1.3;font-weight:500;color:var(--ink,#F9FAFB)}',
  '.gt-trk-card-meta{margin:4px 0 0;font-size:11.5px;color:var(--dim,#9CA3AF)}',
  '.gt-trk-facts{margin:10px 0 0;padding:0 0 0 18px;font-size:12px;line-height:1.55;color:var(--ink,#F9FAFB)}',
  '.gt-trk-facts li{margin:0 0 2px}',
  '.gt-trk-card-src{margin:10px 0 0;font-size:10.5px;color:var(--faint,#6B7280)}',
].join('\n')

function decYear(d: Date): number {
  const dim = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  return d.getFullYear() + (d.getMonth() + (d.getDate() - 1) / dim) / 12
}

function svgEl(name: string, attrs: Record<string, string | number>): SVGElement {
  const node = document.createElementNS(NS, name)
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v))
  return node
}

export function mountTimeline(
  root: HTMLElement,
  tracks: Track[],
  opts: TimelineOptions,
): TimelineHandle | null {
  if (!tracks.length) return null

  let explicitMax = -Infinity
  let minStart = Infinity
  for (const t of tracks) {
    if (t.end != null && t.end > explicitMax) explicitMax = t.end
    if (t.start < minStart) minStart = t.start
  }

  const nowY = opts.now ?? decYear(new Date())
  const t0 = Math.floor(minStart) - 2
  let t1 = Math.max(Math.floor(nowY), Math.ceil(explicitMax || 0)) + 2
  if (t1 <= t0) t1 = t0 + 1

  /* greedy first-fit row packing; intervals [start, end), end-exclusive */
  const rows: { s: number; e: number }[][] = []
  const rowOf: Record<string, number> = {}
  const sorted = tracks
    .slice()
    .sort((a, b) => a.start - b.start || (a.id < b.id ? -1 : 1))
  for (const t of sorted) {
    const s = t.start
    const e = t.end == null ? Infinity : t.end
    let idx = -1
    for (let r = 0; r < rows.length && idx === -1; r++) {
      let free = true
      for (const iv of rows[r]) {
        if (s < iv.e && iv.s < e) {
          free = false
          break
        }
      }
      if (free) idx = r
    }
    if (idx === -1) {
      rows.push([])
      idx = rows.length - 1
    }
    rows[idx].push({ s, e })
    rowOf[t.id] = idx
  }

  let rowCount = 0
  for (const k of Object.keys(rowOf)) rowCount = Math.max(rowCount, rowOf[k] + 1)

  const vbH = PANEL_TOP + rowCount * ROW_H + PAD_BOTTOM
  const panelBottom = PANEL_TOP + rowCount * ROW_H

  const xPct = (v: number) => ((v - t0) / (t1 - t0)) * 100
  const yPct1000 = (v: number) => xPct(v) * 10

  const fmtYM = (v: number, isEnd: boolean): string => {
    let y = Math.floor(v)
    const f = (v - y) * 12
    let m = isEnd ? Math.max(0, Math.floor(f) - 1) : Math.round(f)
    if (m > 11) {
      y += 1
      m -= 12
    }
    return `${m + 1 < 10 ? '0' : ''}${m + 1}/${y}`
  }

  const isWholeYearRange = (t: Track) =>
    Number.isInteger(t.start) && t.end != null && Number.isInteger(t.end)

  const periodOf = (t: Track): string => {
    if (isWholeYearRange(t)) return `${t.start} \u2013 ${t.end}`
    const a = fmtYM(t.start, false)
    const b = t.end == null ? opts.present : fmtYM(t.end, true)
    return `${a} \u2013 ${b}`
  }

  const labelOf = (t: Track) =>
    isWholeYearRange(t) ? `${t.role} \u2014 ${periodOf(t)}` : t.role

  /* ---------- chart ---------- */
  const wrap = document.createElement('div')
  wrap.className = 'gt-trk'
  const style = document.createElement('style')
  style.setAttribute('data-gt-trk', '1')
  style.textContent = CSS
  wrap.appendChild(style)

  const inner = document.createElement('div')
  inner.className = 'gt-trk-inner'

  const svg = svgEl('svg', {
    viewBox: `0 0 ${VB_W} ${vbH}`,
    width: '100%',
    'aria-hidden': 'true',
    focusable: 'false',
    class: 'gt-trk-svg',
  })
  svg.appendChild(
    svgEl('rect', { x: 0, y: PANEL_TOP, width: VB_W, height: rowCount * ROW_H, rx: 8, class: 'gt-trk-panel' }),
  )
  svg.appendChild(svgEl('line', { x1: 0, y1: AXIS_Y, x2: VB_W, y2: AXIS_Y, class: 'gt-trk-axis' }))

  for (let y = Math.floor(t0); y <= Math.floor(t1); y++) {
    const x = yPct1000(y)
    svg.appendChild(svgEl('line', { x1: x, y1: AXIS_Y - 9, x2: x, y2: AXIS_Y, class: 'gt-trk-tick' }))
    const anchor = x < 22 ? 'start' : x > VB_W - 22 ? 'end' : 'middle'
    const label = svgEl('text', { x, y: AXIS_Y - 13, 'text-anchor': anchor, class: 'gt-trk-ylab' })
    label.textContent = String(y)
    svg.appendChild(label)
  }

  const playhead = svgEl('line', {
    x1: 0,
    y1: AXIS_Y,
    x2: 0,
    y2: panelBottom,
    class: 'gt-trk-ph',
    'shape-rendering': 'crispEdges',
  })
  svg.appendChild(playhead)
  const readout = svgEl('text', { x: 0, y: 46, class: 'gt-trk-ro' })
  svg.appendChild(readout)

  inner.appendChild(svg)
  const fg = document.createElement('div')
  fg.className = 'gt-trk-fg'
  inner.appendChild(fg)
  wrap.appendChild(inner)

  const card = document.createElement('aside')
  card.className = 'gt-trk-card'
  card.setAttribute('role', 'region')
  card.setAttribute('aria-label', opts.cardAria)
  card.setAttribute('aria-live', 'polite')

  root.replaceChildren(wrap, card)

  /* ---------- bars ---------- */
  const buttons: Record<string, HTMLButtonElement> = {}
  const byId: Record<string, Track> = {}
  const barTopPct = ((PANEL_TOP + BAR_OFF) / vbH) * 100
  const heightPct = (BAR_H / vbH) * 100
  const innerWidth = inner.clientWidth || root.clientWidth || VB_W
  const above: { btn: HTMLButtonElement; row: number; leftPx: number; wPx: number; est: number }[] = []

  tracks.forEach((t) => {
    byId[t.id] = t
    const row = rowOf[t.id] ?? 0
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = `trk lane-${t.lane}`
    btn.dataset.trackId = t.id
    btn.style.top = `${(barTopPct + ((row * ROW_H) / vbH) * 100).toFixed(4)}%`
    btn.style.height = `${heightPct.toFixed(4)}%`
    btn.setAttribute('aria-label', `${t.role} — ${t.org} — ${periodOf(t)}`)

    const lbl = document.createElement('span')
    lbl.className = 'gt-trk-lbl'
    lbl.textContent = labelOf(t)

    const l = Math.max(0, xPct(t.start))
    const r = Math.min(100, xPct(t.end == null ? Math.min(nowY, t1) : t.end))
    const w = Math.max(0, r - l)
    btn.style.left = `${l.toFixed(3)}%`
    btn.style.width = `${w.toFixed(3)}%`
    btn.appendChild(lbl)

    const est = lbl.textContent.length * 7.1 + 12
    if (w / 100 * innerWidth < est) {
      btn.classList.add('gt-trk-above')
      above.push({
        btn,
        row,
        leftPx: (l / 100) * innerWidth,
        wPx: (w / 100) * innerWidth,
        est: lbl.textContent.length * 6.8 + 4,
      })
    }

    btn.addEventListener('click', () => select(t.id))
    buttons[t.id] = btn
    fg.appendChild(btn)
  })

  /* stack above-bar labels on two rails per row; right-align near the edge */
  const railEnd: Record<number, [number, number]> = {}
  above.sort((a, b) => a.leftPx - b.leftPx)
  for (const o of above) {
    if (o.leftPx + o.est > innerWidth) {
      o.btn.classList.add('gt-trk-ar')
      o.leftPx = Math.max(0, o.leftPx + o.wPx - o.est)
    }
    if (!railEnd[o.row]) railEnd[o.row] = [0, 0]
    const re = railEnd[o.row]
    const rail = o.leftPx >= re[0] + 6 ? 0 : 1
    if (rail === 1) o.btn.classList.add('gt-trk-r2')
    re[rail] = o.leftPx + o.est
  }

  /* ---------- record card ---------- */
  let cardId: string | null = null

  function nearestId(t: number): string {
    let cont: string | null = null
    let contStart = -Infinity
    let near: string | null = null
    let nearD = Infinity
    for (const id of Object.keys(buttons)) {
      const tr = byId[id]
      const e = tr.end == null ? Infinity : tr.end
      if (t >= tr.start && t < e) {
        if (tr.start > contStart) {
          contStart = tr.start
          cont = id
        }
      } else {
        const d = t < tr.start ? tr.start - t : t - e
        if (d < nearD) {
          nearD = d
          near = id
        }
      }
    }
    return cont ?? near ?? Object.keys(buttons)[0]
  }

  function renderCard(t: Track): void {
    card.setAttribute('data-src', t.src)
    card.replaceChildren()

    const h = document.createElement('h3')
    h.className = 'gt-trk-card-h'
    h.id = 'trk-card-h'
    h.textContent = t.role

    const meta = document.createElement('p')
    meta.className = 'gt-trk-card-meta'
    meta.textContent = `${t.org} — ${periodOf(t)}`

    const ul = document.createElement('ul')
    ul.className = 'gt-trk-facts'
    for (const f of t.facts) {
      const li = document.createElement('li')
      li.textContent = f
      ul.appendChild(li)
    }

    const src = document.createElement('p')
    src.className = 'gt-trk-card-src'
    src.textContent = t.src

    card.append(h, meta, ul, src)
  }

  function setProgress(p01: number): void {
    const p = Math.min(1, Math.max(0, Number(p01) || 0))
    const t = t0 + p * (t1 - t0)
    const x = p * VB_W
    playhead.setAttribute('x1', x.toFixed(2))
    playhead.setAttribute('x2', x.toFixed(2))
    const flip = x > VB_W - 62
    readout.setAttribute('x', (flip ? x - 6 : x + 6).toFixed(2))
    readout.setAttribute('text-anchor', flip ? 'end' : 'start')
    readout.textContent = t.toFixed(1)

    for (const id of Object.keys(buttons)) {
      const tr = byId[id]
      const end = tr.end == null ? Infinity : tr.end
      const active = t >= tr.start && t < end
      buttons[id].classList.toggle('lit', active)
      buttons[id].setAttribute('data-active', active ? '1' : '0')
    }

    const nextId = nearestId(t)
    if (nextId !== cardId) {
      cardId = nextId
      renderCard(byId[nextId])
    }
  }

  function select(id: string): void {
    const t = byId[id]
    if (!t) return
    const end = t.end == null ? Math.min(nowY, t1) : t.end
    const pMid = Math.min(1, Math.max(0, ((t.start + end) / 2 - t0) / (t1 - t0)))
    setProgress(pMid)

    /* same scroll mapping as the scroll scrubber, so the jump lands where a
       manual scroll would; reduced motion jumps without animation */
    const vh = window.innerHeight
    const rect = root.getBoundingClientRect()
    const hostH = rect.height
    const hostDocTop = window.scrollY + rect.top
    const scrollY = hostDocTop - (0.88 * vh - pMid * (0.5 * vh + hostH))
    window.scrollTo({ top: scrollY, behavior: opts.reducedMotion() ? 'instant' : 'smooth' })
  }

  setProgress(0)

  return {
    setProgress,
    select,
    destroy() {
      root.replaceChildren()
    },
  }
}

/** The scroll → progress curve used by both the scrubber and track jumps. */
export function progressFromRect(rect: DOMRect, viewportHeight: number): number {
  return (0.88 * viewportHeight - rect.top) / (0.5 * viewportHeight + rect.height)
}
