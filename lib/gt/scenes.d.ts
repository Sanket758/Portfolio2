/**
 * Type façade for lib/gt/scenes.js.
 *
 * The painter itself is kept as JavaScript on purpose: it is ~860 lines of
 * verified drawing geometry (every coordinate precomputed, no Math.random) that
 * was authored and reviewed in the design lab. Re-typing it would add risk
 * without adding safety, so only its public contract is declared here.
 */

export type SceneName = 'shelf' | 'quadruped' | 'apriltag'
export type ViewId = 'raw' | 'seg' | 'embed'

export interface SceneLayers {
  boxes?: boolean
  seg?: boolean
  nms?: boolean
}

export interface SceneState {
  conf?: number
  view?: ViewId
  layers?: SceneLayers
  t?: number
  progress?: number
  rm?: boolean
}

export interface SceneStats {
  drawn: number
  suppressed: number
}

export interface SceneMetaEntry {
  name?: string
  short?: string
  note?: string
  src?: string
}

export declare const SCENES: {
  names: SceneName[]
  meta: Record<string, SceneMetaEntry>
  paint(name: SceneName | string, ctx: CanvasRenderingContext2D, w: number, h: number, state: SceneState): void
  stats(name: SceneName | string, state: SceneState): SceneStats
}
