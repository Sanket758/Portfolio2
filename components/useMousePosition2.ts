import { useEffect, useRef } from 'react'

interface MousePos { x: number; y: number }

export function useMousePosition2(): React.MutableRefObject<MousePos> {
  const ref = useRef<MousePos>({ x: 0, y: 0 })
  const targetRef = useRef<MousePos>({ x: 0, y: 0 })

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    let raf = 0
    let mounted = true

    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2.0 - 1.0
      const y = ((e.clientY / window.innerHeight) * 2.0 - 1.0) * -1.0
      targetRef.current = { x, y }
    }

    const onLeave = () => { targetRef.current = { x: 0, y: 0 } }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      if (!mounted) return
      ref.current = {
        x: lerp(ref.current.x, targetRef.current.x, 0.05),
        y: lerp(ref.current.y, targetRef.current.y, 0.05),
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      mounted = false
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return ref
}
