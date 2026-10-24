import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createBench, type BenchMetrics, type BenchModel } from '../../lib/gt/bench'
import type { ViewId } from '../../lib/gt/scenes'
import { useGt } from './GtContext'

/**
 * 01 · LAB — the hero and the inference bench.
 *
 * The hero now answers a recruiter's four screening questions in one block
 * (role type, availability, work permit, languages) before the KPI strip. The
 * bench beneath it is the page's demonstration that a detection pipeline is
 * something this person actually operates, not just describes.
 */

const Hero: React.FC = () => {
  const { c, copyEmail } = useGt()

  return (
    <header id="ingest" className="hero">
      <p className="eyebrow">{c.hero.eyebrow}</p>
      <h1 id="lab-h">{c.hero.name}</h1>
      <p className="sub">{c.hero.sub}</p>

      <dl className="gt-hire mono" aria-label={c.hero.hireTitle}>
        {c.hero.hire.map((fact) => (
          <div className="gt-hire-row" key={fact.k}>
            <dt>{fact.k}</dt>
            <dd>{fact.v}</dd>
          </div>
        ))}
      </dl>

      <ul className="pill mono" aria-label={c.hero.stackLabel}>
        {['Python', 'PyTorch', 'OpenCV', 'YOLO', 'Docker', 'ROS 2'].map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>

      <div className="cta">
        <a className="btn btn-solid" href="#work">
          {c.hero.ctaWork} <span aria-hidden="true">↓</span>
        </a>
        <a className="btn btn-solid is-cv" href={c.contact.cv} download>
          {c.hero.ctaCv}
        </a>
        <button className="btn btn-ghost mono" type="button" onClick={copyEmail}>
          {c.hero.copyEmail}
        </button>
      </div>
      <p className="cue mono">
        <span aria-hidden="true">↓</span> {c.hero.cue.replace(/^↓\s*/, '')}
      </p>

      <ul className="kpis" aria-label={c.hero.kpisLabel}>
        {c.hero.kpis.map((k) => (
          <li className="kpi" data-src={k.src} key={k.label}>
            <span className="v mono">{k.value}</span>
            <span className="k">{k.label}</span>
            <span className="src mono">src: {k.src}</span>
          </li>
        ))}
      </ul>
    </header>
  )
}

const Bench: React.FC = () => {
  const { c, reducedMotion } = useGt()
  const [scene, setScene] = useState(c.bench.scenes[0].id)
  const [view, setView] = useState<ViewId>('seg')
  const [conf, setConf] = useState(0.5)
  const [split, setSplit] = useState(55)
  const [layers, setLayers] = useState({ boxes: true, seg: true, nms: false })
  const [metrics, setMetrics] = useState<BenchMetrics>({ p: 0, r: 0, f1: 0 })

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const teleRef = useRef<HTMLCanvasElement | null>(null)
  const handle = useRef<ReturnType<typeof createBench> | null>(null)

  const model = useMemo<BenchModel>(
    () => ({ scene, view, conf, split, layers }),
    [scene, view, conf, split, layers],
  )

  /* the bench is created once; state flows into it, the canvas is never recreated */
  useEffect(() => {
    if (!canvasRef.current) return
    const bench = createBench({
      canvas: canvasRef.current,
      telemetry: teleRef.current,
      model,
      reducedMotion,
      onMetrics: setMetrics,
    })
    handle.current = bench
    return () => {
      bench.destroy()
      handle.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    handle.current?.update(model)
  }, [model])

  useEffect(() => {
    handle.current?.setReducedMotion(reducedMotion)
  }, [reducedMotion])

  const sceneMeta = c.bench.scenes.find((s) => s.id === scene) ?? c.bench.scenes[0]

  return (
    <div id="perceive" className="bench" aria-labelledby="bench-h">
      <div className="bench-head">
        <p className="eyebrow">{c.bench.eyebrow}</p>
        <h2 id="bench-h">{c.bench.title}</h2>
        <p className="lede">{c.bench.lede}</p>
      </div>

      <div className="bench-grid">
        <div className="bench-main">
          <div className="seg mono" role="group" aria-label={c.bench.sceneAria} id="scene-tabs">
            {c.bench.scenes.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={scene === s.id}
                onClick={() => setScene(s.id)}
              >
                {String.fromCharCode(65 + i)} · {s.short}
              </button>
            ))}
          </div>

          <div className="frame" id="bench-frame">
            <canvas
              id="bench-cv"
              ref={canvasRef}
              width={960}
              height={540}
              role="img"
              aria-label={c.bench.canvasAria}
            />
          </div>

          <div className="bench-ctl">
            <div className="ctl">
              <label className="ctl-lab mono" htmlFor="conf">
                {c.bench.confidence} <output id="conf-val">{conf.toFixed(2)}</output>
              </label>
              <input
                id="conf"
                type="range"
                min={0.1}
                max={0.95}
                step={0.01}
                value={conf}
                onChange={(e) => setConf(Number(e.target.value))}
              />
            </div>

            <div className="ctl">
              <p className="ctl-lab mono" id="vm-lab">
                {c.bench.viewLabel}
              </p>
              <div className="seg mono" role="group" aria-labelledby="vm-lab" id="viewmode">
                {c.bench.views.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    aria-pressed={view === v.id}
                    onClick={() => setView(v.id)}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="ctl">
              <p className="ctl-lab mono" id="lyr-lab">
                {c.bench.layersLabel}
              </p>
              <div className="checks mono" role="group" aria-labelledby="lyr-lab">
                {c.bench.layers.map((l) => (
                  <label key={l.id}>
                    <input
                      type="checkbox"
                      checked={layers[l.id]}
                      onChange={(e) => setLayers((prev) => ({ ...prev, [l.id]: e.target.checked }))}
                    />
                    {l.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="ctl">
              <label className="ctl-lab mono" htmlFor="split">
                {c.bench.split} <output id="split-val">{split}</output>
              </label>
              <input
                id="split"
                type="range"
                min={0}
                max={100}
                step={1}
                value={split}
                onChange={(e) => setSplit(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <aside className="tele" aria-label="Telemetry">
          <p className="ctl-lab mono">
            {c.bench.telemetry} <span className="sim mono">{c.bench.sim}</span>
          </p>
          <canvas id="tele-cv" ref={teleRef} width={240} height={112} aria-hidden="true" />
          <dl className="tele-rows mono">
            <div>
              <dt>P</dt>
              <dd id="tele-p">{metrics.p.toFixed(2)}</dd>
            </div>
            <div>
              <dt>R</dt>
              <dd id="tele-r">{metrics.r.toFixed(2)}</dd>
            </div>
            <div>
              <dt>F1</dt>
              <dd id="tele-f1">{metrics.f1.toFixed(2)}</dd>
            </div>
          </dl>
          <p className="src mono" id="bench-src">
            {c.bench.sceneSrc}
            {sceneMeta.src}
            {sceneMeta.note ? ` · ${sceneMeta.note}` : ''}
          </p>
        </aside>
      </div>
    </div>
  )
}

const Lab: React.FC = () => (
  <section id="lab" className="sec" aria-labelledby="lab-h">
    <Hero />
    <Bench />
  </section>
)

export default Lab
