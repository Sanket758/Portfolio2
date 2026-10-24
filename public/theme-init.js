/**
 * Theme bootstrap — loaded synchronously in <head> so the palette is right
 * before the first paint (no flash of the wrong theme).
 *
 * It lives in public/ rather than inline because the CSP served by Vercel
 * (see vercel.json) allows first-party scripts only: `script-src 'self'`.
 */
;(function () {
  try {
    var saved = localStorage.getItem('portfolio-theme')
    var systemLight = window.matchMedia('(prefers-color-scheme: light)').matches
    var light = saved === 'light' || (!saved && systemLight)
    document.documentElement.classList.toggle('light', light)
  } catch (_) {}
})()
