import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { createWorld, DEFAULT_RIG, HOLD, kindOf, lensOf, loadModel, pose, V } from './previsWorld'
import type { Kind, World } from './previsWorld'

// Browsers cap WebGL contexts (~16), so every card shares one offscreen renderer
// and one scene, and copies each rendered frame into its own 2D canvas.
type Entry = { canvas: HTMLCanvasElement; kind: Kind; focal: number; overview: THREE.PerspectiveCamera; path: THREE.BufferGeometry; start: number }

const DURATION = 6
const FRAME_MS = 1000 / 30
const INSET_ASPECT = 16 / 9
const entries = new Set<Entry>()
let shared: { renderer: THREE.WebGLRenderer; world: World } | null = null
let frame = 0
let last = 0
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function getShared() {
  if (!shared) {
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setScissorTest(false)
    shared = { renderer, world: createWorld() }
    // Still frames (reduced motion) need one redraw once the model arrives.
    if (reducedMotion) loadModel().then(() => entries.forEach((entry) => draw(entry, performance.now()))).catch(() => {})
  }
  return shared
}

// Frame the overview so the whole camera path and the model stay in view.
function makeOverview(kind: Kind, focal: number) {
  const box = new THREE.Box3()
  const points: THREE.Vector3[] = []
  for (let i = 0; i <= 40; i++) {
    const p = pose(kind, i / 40, i / 40 * DURATION, DEFAULT_RIG, focal)
    points.push(p.cam)
    box.expandByPoint(p.cam).expandByPoint(p.subject).expandByPoint(p.subject.clone().setY(1.8))
  }
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 300)
  camera.layers.enable(1)
  const center = box.getCenter(V())
  const radius = Math.max(box.getSize(V()).length() / 2, 2.6)
  const distance = radius / Math.sin(THREE.MathUtils.degToRad(19)) * .82
  camera.position.copy(center).add(V(.62, .72, 1).normalize().multiplyScalar(distance))
  camera.lookAt(center)
  const path = new THREE.BufferGeometry().setFromPoints(points)
  new THREE.Line(path).computeLineDistances()
  return { camera, path }
}

function draw(entry: Entry, now: number) {
  const { renderer, world } = getShared()
  const rect = entry.canvas.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio, 1.5)
  const width = Math.max(1, Math.round(rect.width * dpr)), height = Math.max(1, Math.round(rect.height * dpr))
  if (entry.canvas.width !== width || entry.canvas.height !== height) { entry.canvas.width = width; entry.canvas.height = height }
  const size = renderer.getSize(new THREE.Vector2())
  if (size.x !== width || size.y !== height) renderer.setSize(width, height, false)

  const cycle = reducedMotion ? .6 : ((now - entry.start) / 1000 / DURATION) % (1 + HOLD)
  const u = Math.min(1, cycle)
  world.update({ kind: entry.kind, u, sec: u * DURATION, rig: DEFAULT_RIG, focal: entry.focal, aspect: INSET_ASPECT, time: now / 1000, limbs: !reducedMotion })
  world.path.geometry = entry.path

  entry.overview.aspect = width / height
  entry.overview.updateProjectionMatrix()
  renderer.setViewport(0, 0, width, height)
  renderer.render(world.scene, entry.overview)

  // Camera view inset, bottom right.
  const insetW = Math.round(width * .38), insetH = Math.round(insetW / INSET_ASPECT), pad = Math.round(8 * dpr)
  renderer.setScissorTest(true)
  renderer.setScissor(width - insetW - pad, pad, insetW, insetH)
  renderer.setViewport(width - insetW - pad, pad, insetW, insetH)
  renderer.render(world.scene, world.shotCam)
  renderer.setScissorTest(false)

  const ctx = entry.canvas.getContext('2d')!
  ctx.drawImage(renderer.domElement, 0, 0)
  ctx.strokeStyle = '#191a17'
  ctx.lineWidth = 1.5 * dpr
  ctx.strokeRect(width - insetW - pad, height - insetH - pad, insetW, insetH)
}

function tick(now: number) {
  frame = entries.size && !reducedMotion ? requestAnimationFrame(tick) : 0
  if (now - last < FRAME_MS) return
  last = now
  entries.forEach((entry) => draw(entry, now))
}

export default function CardPrevis({ movementId, label }: { movementId: string; label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current!
    const kind = kindOf(movementId)
    const focal = lensOf(movementId) ?? 35
    const { camera, path } = makeOverview(kind, focal)
    const entry: Entry = { canvas, kind, focal, overview: camera, path, start: performance.now() - Math.random() * 2000 }
    const observer = new IntersectionObserver(([item]) => {
      if (item.isIntersecting) {
        entries.add(entry)
        if (reducedMotion) draw(entry, performance.now())
        else if (!frame) frame = requestAnimationFrame(tick)
      } else entries.delete(entry)
    }, { rootMargin: '100px' })
    observer.observe(canvas)
    return () => { observer.disconnect(); entries.delete(entry); path.dispose() }
  }, [movementId])
  return <canvas ref={canvasRef} className="camera-card-3d" role="img" aria-label={label} />
}
