import React from 'react'
import { motion, useInView } from 'framer-motion'

interface CompositeWaveUnderlineProps {
  width?: number
  height?: number
  className?: string
}

export const CompositeWaveUnderline: React.FC<CompositeWaveUnderlineProps> = ({
  width = 200,
  height = 8,
  className = '',
}) => {
  const ref = React.useRef(null)
  const inView = useInView(ref, { once: true })

  const points: string[] = []
  for (let x = 0; x <= width; x += 2) {
    const xNorm = x / width
    const y = height / 2 +
      Math.sin(xNorm * Math.PI * 2) * 2 +
      Math.sin(xNorm * Math.PI * 4 + Math.PI / 3) * 1 +
      Math.sin(xNorm * Math.PI * 1 + Math.PI / 2) * 1.5
    points.push(`${x},${y}`)
  }

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <motion.path
        d={`M ${points.join(' L ')}`}
        fill="none"
        stroke="url(#wave-gradient)"
        strokeWidth={1.5}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
      <defs>
        <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default CompositeWaveUnderline
