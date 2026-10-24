import pool from './arch-pool.html?raw'

/**
 * The three architecture diagrams are authored SVG documents, kept as plain
 * markup so they stay editable outside React and keep their exact geometry.
 * They are parsed once into a lookup keyed by `arch-<key>`; each case drawer
 * renders only its own figure, so no DOM is moved across React's back.
 */

const figures = new Map<string, string>()

const collect = () => {
  if (figures.size || typeof document === 'undefined') return
  const template = document.createElement('template')
  template.innerHTML = pool
  template.content.querySelectorAll('figure.arch[id]').forEach((figure) => {
    const id = figure.getAttribute('id') ?? ''
    figures.set(id.replace(/^arch-/, ''), figure.outerHTML)
  })
}

export const archFigure = (key: string): string => {
  collect()
  return figures.get(key) ?? ''
}
