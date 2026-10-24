import React, { useEffect, useRef } from 'react'
import { mountTimeline, progressFromRect, type TimelineHandle } from '../../lib/gt/timeline'
import { useGt } from './GtContext'

/**
 * 02 · TRACK — the career timeline.
 *
 * The engine owns the SVG, the bars and the record card; this component owns the
 * section chrome and the scroll → progress mapping. Remounting on language change
 * is deliberate: the labels and the card content are localized, and the chart is
 * cheap to rebuild, whereas patching every node in place would duplicate the
 * engine's logic here.
 */
const Timeline: React.FC = () => {
  const { c, reducedMotion } = useGt()
  const host = useRef<HTMLDivElement | null>(null)
  const handle = useRef<TimelineHandle | null>(null)

  useEffect(() => {
    const el = host.current
    if (!el) return

    const timeline = mountTimeline(el, c.timeline, {
      present: c.track.present,
      cardAria: c.track.cardAria,
      reducedMotion: () => reducedMotion,
    })
    handle.current = timeline

    let ticking = false
    const scrub = () => {
      ticking = false
      if (!host.current || !handle.current) return
      handle.current.setProgress(progressFromRect(host.current.getBoundingClientRect(), window.innerHeight || 1))
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(scrub)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    scrub()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      timeline?.destroy()
      handle.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [c.timeline, c.track.present, c.track.cardAria])

  return (
    <section id="track" className="sec" aria-labelledby="track-h">
      <p className="eyebrow">{c.track.eyebrow}</p>
      <h2 id="track-h">{c.track.title}</h2>
      <p className="lede">{c.track.lede}</p>
      <p className="track-key mono" id="track-key">
        <span className="tk tk-exp">{c.track.experience}</span>
        <span className="tk tk-edu">{c.track.education}</span>
        <span className="tk-hint">{c.track.hint}</span>
      </p>
      <div
        id="track-host"
        className="track-host"
        ref={host}
        role="region"
        aria-label={c.track.hostAria}
        tabIndex={0}
      />
    </section>
  )
}

export default Timeline
