import React from 'react'
import { BRAND_BODIES, ICON_BODIES } from '../../lib/gt/icon-paths'

/**
 * Icons. Path data comes from `lib/gt/icon-paths.ts`, extracted verbatim from the
 * design-lab build (lucide ISC; xing + researchgate from simple-icons, CC0) so
 * nothing is re-typed from memory. The three UI glyphs below were not in that set.
 */

const EXTRA: Record<string, string> = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
}

export interface IconProps {
  name: string
  size?: number
  className?: string
}

const Icon: React.FC<IconProps> = ({ name, size = 18, className }) => {
  const brand = BRAND_BODIES[name]
  const body = brand ?? ICON_BODIES[name] ?? EXTRA[name]
  if (!body) return null

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={brand ? 'currentColor' : 'none'}
      stroke={brand ? undefined : 'currentColor'}
      strokeWidth={brand ? undefined : 1.7}
      strokeLinecap={brand ? undefined : 'round'}
      strokeLinejoin={brand ? undefined : 'round'}
      aria-hidden="true"
      focusable="false"
      className={className}
      dangerouslySetInnerHTML={{ __html: body }}
    />
  )
}

export default Icon
