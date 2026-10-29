import * as THREE from 'three'
import { cameraMovements } from './cameraMovementData'
import type { MovementDiagram } from './cameraMovementData'

export type Language = 'zh' | 'en'
export type Kind = MovementDiagram | 'free' | 'walkin' | 'water' | 'pedestal' | 'bodyrig' | 'counter' | 'droneFollow' | 'pov' | 'spin'
export type Rig = { d: number; h: number; angle: number }
export type Pose = { cam: THREE.Vector3; target: THREE.Vector3; focal: number; roll: number; subject: THREE.Vector3; facing: number; walking: boolean; up?: THREE.Vector3 }

// Movements whose 2D diagram is shared with others but need their own 3D motion.
export const kindOverrides: Record<string, Kind> = {
  'walk-in-push': 'walkin', 'water-level': 'water', 'pedestal': 'pedestal', 'body-rig': 'bodyrig', 'counter-track': 'counter',
  'drone-follow': 'droneFollow', 'pov-walk': 'pov', 'counter-spin': 'spin', 'match-move': 'track', 'locked-tableau': 'free',
}
export const LENSES = [16, 24, 35, 50, 85, 135]
export const ASPECTS = [{ id: '16:9', value: 16 / 9 }, { id: '2.39:1', value: 2.39 }, { id: '4:5', value: 4 / 5 }, { id: '9:16', value: 9 / 16 }]
export const DEFAULT_RIG: Rig = { d: 4, h: 1.5, angle: 0 }
export const HOLD = 0.15

export const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z)
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const ease = (t: number) => t * t * (3 - 2 * t)

export function kindOf(id: string): Kind {
  if (id === 'free') return 'free'
  return kindOverrides[id] ?? cameraMovements.find((item) => item.id === id)?.diagram ?? 'free'
}

export function lensOf(id: string) {
  const lens = cameraMovements.find((item) => item.id === id)?.lens ?? ''
  const numbers = (lens.match(/\d+/g) ?? []).map(Number)
  if (!numbers.length) return null
  const value = numbers.length > 1 ? Math.sqrt(numbers[0] * numbers[1]) : numbers[0]
  return LENSES.reduce((best, item) => Math.abs(item - value) < Math.abs(best - value) ? item : best)
}

export function pose(kind: Kind, t: number, sec: number, rig: Rig, focal: number): Pose {
  const th = THREE.MathUtils.degToRad(rig.angle)
  const dir = V(Math.sin(th), 0, Math.cos(th)) // subject → camera
  const side = V(Math.cos(th), 0, -Math.sin(th)) // screen right
  const u = Math.min(1, t)
  const e = ease(u)
  const moving = t > 0 && t < 1
  const at = (d: number, h: number, a = th, center = V()) => V(center.x + Math.sin(a) * d, h, center.z + Math.cos(a) * d)
  const out: Pose = { cam: at(rig.d, rig.h), target: V(), focal, roll: 0, subject: V(), facing: th, walking: false }
  let target: THREE.Vector3 | null = null
  const walk = (axis: THREE.Vector3, from: number, to: number, p: number) => {
    out.subject = axis.clone().multiplyScalar(lerp(from, to, p))
    const sign = to > from ? 1 : -1
    out.facing = Math.atan2(axis.x * sign, axis.z * sign)
    out.walking = moving
  }
  switch (kind) {
    case 'push': out.cam = at(lerp(rig.d, rig.d * .42, e), rig.h); break
    case 'pull': out.cam = at(lerp(rig.d * .42, rig.d, e), rig.h); break
    case 'walkin': walk(dir, -6, 0, e); out.facing = th; break
    case 'track': walk(side, -3, 3, u); out.cam = out.subject.clone().add(dir.clone().multiplyScalar(rig.d)).setY(rig.h); break
    case 'speed': {
      const p = u < .2 ? u / .2 * .4 : u < .8 ? .4 + (u - .2) / .6 * .2 : .6 + (u - .8) / .2 * .4
      walk(side, -3, 3, p); out.cam = out.subject.clone().add(dir.clone().multiplyScalar(rig.d)).setY(rig.h); break
    }
    case 'counter': walk(side, -3, 3, u); out.cam = dir.clone().multiplyScalar(rig.d).add(side.clone().multiplyScalar(lerp(2.5, -2.5, u))).setY(rig.h); break
    case 'car': walk(side, -9, 9, u); out.walking = false; out.cam = out.subject.clone().add(dir.clone().multiplyScalar(rig.d)).setY(rig.h); break
    case 'droneFollow': walk(side, -5, 5, u); out.cam = out.subject.clone().add(dir.clone().multiplyScalar(rig.d * 2)).setY(Math.max(rig.h, 7)); break
    case 'low': walk(side, -3, 3, u); out.cam = out.subject.clone().add(dir.clone().multiplyScalar(rig.d * .5)).setY(.15); target = out.subject.clone().setY(.35); break
    case 'lead': walk(dir, -4, 0, u); out.cam = out.subject.clone().add(dir.clone().multiplyScalar(rig.d)).setY(rig.h); break
    case 'follow': walk(dir, 0, -5, u); out.cam = out.subject.clone().add(dir.clone().multiplyScalar(rig.d)).setY(rig.h); break
    case 'pov': walk(dir, 0, -5, u); out.cam = out.subject.clone().add(dir.clone().multiplyScalar(1.4)).setY(1.6 + Math.sin(sec * 9) * .025); target = out.subject.clone().setY(1.45); break
    case 'bodyrig': walk(dir, -4, 0, u); out.cam = out.subject.clone().add(dir.clone().multiplyScalar(.85)).setY(1.5); target = out.subject.clone().setY(1.55); out.roll = Math.sin(sec * 6) * .03; break
    case 'arc': out.cam = at(rig.d, rig.h, th + THREE.MathUtils.degToRad(lerp(-75, 75, e))); break
    case 'orbit': out.cam = at(rig.d, rig.h, th + Math.PI * 2 * u); break
    case 'spin': out.cam = at(rig.d * .55, rig.h, th + Math.PI * 2 * u); out.facing = th + Math.PI * 4 * e; break
    case 'tilt-up': target = V(0, lerp(.1, 1.6, e), 0); break
    case 'tilt-down': target = V(0, lerp(5, 1.5, e), 0); break
    case 'pan': target = side.clone().multiplyScalar(lerp(-7, 0, e)).setY(1.35); out.cam = at(rig.d * 1.5, rig.h); break
    case 'crane-up': out.cam = at(lerp(rig.d, rig.d * 1.4, e), lerp(.4, 6, e)); break
    case 'crane-down': out.cam = at(lerp(rig.d * 1.4, rig.d, e), lerp(6, .4, e)); break
    case 'pedestal': { const h = lerp(.3, 1.8, e); out.cam = at(rig.d, h); target = V(0, h, 0); break }
    case 'handheld': out.cam.add(V(Math.sin(sec * 1.3) * .05 + Math.sin(sec * 3.1) * .015, Math.sin(sec * 1.7 + 1) * .035, Math.sin(sec * 1.1 + 2) * .04)); out.roll = Math.sin(sec * .9) * .02; break
    case 'drone-rise': out.cam = at(lerp(rig.d, rig.d * 3.5, e), lerp(rig.h, 12, e)); break
    case 'top-down': { out.cam = V(0, 9, 0); const r = th + THREE.MathUtils.degToRad(25) * Math.sin(u * Math.PI); out.up = V(-Math.sin(r), 0, -Math.cos(r)); break }
    case 'focus': {
      const fg = dir.clone().multiplyScalar(rig.d * .35).add(side.clone().multiplyScalar(.35)).setY(1.1)
      const k = ease(Math.min(1, Math.max(0, (u - .35) / .3)))
      target = fg.lerp(V(0, 1.35, 0), k); break
    }
    case 'zoom': out.focal = lerp(focal, Math.min(focal * 3, 200), e); break
    case 'dolly-zoom': { const d = lerp(rig.d, rig.d * 2.2, e); out.cam = at(d, rig.h); out.focal = focal * d / rig.d; break }
    case 'foreground': out.cam = at(rig.d, rig.h).add(side.clone().multiplyScalar(lerp(-1.3, 1.3, e))); break
    case 'whip': {
      const phi = u < .45 ? 0 : u < .55 ? ease((u - .45) / .1) * 1.75 : 1.75
      const look = dir.clone().negate().applyAxisAngle(V(0, 1, 0), -phi)
      target = out.cam.clone().add(look.multiplyScalar(rig.d)).setY(1.35); break
    }
    case 'roll': out.roll = lerp(0, -.5, e); break
    case 'static': walk(side, -4, 4, u); break
    case 'drift': out.cam = at(lerp(rig.d, rig.d * .96, u), rig.h).add(side.clone().multiplyScalar(lerp(-.08, .08, u))); break
    case 'water': out.cam = at(lerp(rig.d, rig.d * .5, e), .55); break
    case 'free': break
  }
  out.target = target ?? out.subject.clone().setY(1.35)
  return out
}

export function shotSize(frameHeight: number, language: Language) {
  const sizes: [number, string, string][] = [[5, '远景', 'Extreme wide'], [2.2, '全景', 'Wide / full'], [1.3, '中全景', 'Medium full'], [.75, '中景', 'Medium'], [.4, '近景', 'Close-up'], [0, '特写', 'Extreme close-up']]
  const found = sizes.find(([min]) => frameHeight > min)!
  return language === 'en' ? found[2] : found[1]
}

export function buildMannequin() {
  const group = new THREE.Group()
  const dress = new THREE.MeshStandardMaterial({ color: '#ff8d72', roughness: .7 })
  const skin = new THREE.MeshStandardMaterial({ color: '#efc8a6', roughness: .8 })
  const hair = new THREE.MeshStandardMaterial({ color: '#2b2420', roughness: .9 })
  const add = (mesh: THREE.Mesh, parent: THREE.Object3D = group) => { mesh.castShadow = true; parent.add(mesh); return mesh }
  add(new THREE.Mesh(new THREE.CapsuleGeometry(.17, .42, 6, 12), dress)).position.y = 1.2
  add(new THREE.Mesh(new THREE.ConeGeometry(.36, .6, 20, 1, true), dress)).position.y = .78
  add(new THREE.Mesh(new THREE.SphereGeometry(.12, 20, 16), skin)).position.y = 1.62
  const hairMesh = add(new THREE.Mesh(new THREE.SphereGeometry(.13, 20, 16, 0, Math.PI * 2, 0, Math.PI * .6), hair)); hairMesh.position.set(0, 1.64, -.015)
  add(new THREE.Mesh(new THREE.BoxGeometry(.04, .03, .05), skin)).position.set(0, 1.61, .12)
  const legs: THREE.Group[] = []
  for (const x of [-.08, .08]) {
    const pivot = new THREE.Group(); pivot.position.set(x, .82, 0); group.add(pivot)
    add(new THREE.Mesh(new THREE.CylinderGeometry(.045, .04, .8, 10), skin), pivot).position.y = -.4
    legs.push(pivot)
  }
  const arms: THREE.Group[] = []
  for (const x of [-.22, .22]) {
    const pivot = new THREE.Group(); pivot.position.set(x, 1.42, 0); group.add(pivot)
    add(new THREE.Mesh(new THREE.CylinderGeometry(.035, .03, .6, 10), skin), pivot).position.y = -.3
    arms.push(pivot)
  }
  return { group, legs, arms }
}

export function buildSet(scene: THREE.Scene) {
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: '#e7e1cf', roughness: 1 }))
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground)
  const grid = new THREE.GridHelper(40, 40, '#c9c1a6', '#d8d1ba'); grid.position.y = .002; scene.add(grid)
  const stone = new THREE.MeshStandardMaterial({ color: '#f6f2e8', roughness: .9 })
  for (let x = -14; x <= 14; x += 4) {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, 4, 16), stone)
    pillar.position.set(x, 2, -6); pillar.castShadow = true; pillar.receiveShadow = true; scene.add(pillar)
  }
  const beam = new THREE.Mesh(new THREE.BoxGeometry(30, .4, .8), stone); beam.position.set(0, 4.2, -6); beam.castShadow = true; scene.add(beam)
  const leaf = new THREE.MeshStandardMaterial({ color: '#9faf79', roughness: .9 })
  const trunk = new THREE.MeshStandardMaterial({ color: '#8a7158' })
  const trees: [number, number, number][] = [[-10, 8, 1.2], [12, 7, 1], [-12, -12, 1.4], [7, -11, 1.1], [13, 9, 1.3], [-6, 11, 1], [3, 13, 1.2], [-15, 0, 1.1]]
  for (const [x, z, s] of trees) {
    const tr = new THREE.Mesh(new THREE.CylinderGeometry(.12 * s, .16 * s, 1.4 * s, 8), trunk); tr.position.set(x, .7 * s, z); tr.castShadow = true; scene.add(tr)
    const top = new THREE.Mesh(new THREE.ConeGeometry(1.1 * s, 2.6 * s, 12), leaf); top.position.set(x, 2.6 * s, z); top.castShadow = true; scene.add(top)
  }
  const bench = new THREE.Mesh(new THREE.BoxGeometry(2, .45, .5), new THREE.MeshStandardMaterial({ color: '#c08a5b' })); bench.position.set(4, .225, 2.5); bench.castShadow = true; scene.add(bench)
}

export function onLayer(object: THREE.Object3D, layer: number) { object.traverse((child) => child.layers.set(layer)) }

export type WorldFrame = { kind: Kind; u: number; sec: number; rig: Rig; focal: number; aspect: number; time: number; limbs: boolean }

// One shared set: model, props and the shot camera on layer 0; camera body, frustum and path on layer 1 (overview only).
export function createWorld() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#dfe7e6')
  scene.fog = new THREE.Fog('#dfe7e6', 25, 60)
  scene.add(new THREE.HemisphereLight('#ffffff', '#b9ae8f', 1.4))
  const sun = new THREE.DirectionalLight('#fff4de', 2.2)
  sun.position.set(6, 10, 5); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024)
  Object.assign(sun.shadow.camera, { left: -15, right: 15, top: 15, bottom: -15 })
  scene.add(sun)
  buildSet(scene)

  const mannequin = buildMannequin(); scene.add(mannequin.group)
  const car = new THREE.Mesh(new THREE.BoxGeometry(1.7, .8, 3.8), new THREE.MeshStandardMaterial({ color: '#f5c84c', roughness: .5 }))
  car.castShadow = true; scene.add(car)
  const water = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: '#5fa9c2', transparent: true, opacity: .65, roughness: .2 }))
  water.rotation.x = -Math.PI / 2; water.position.y = .5; scene.add(water)
  const foreground = new THREE.Group()
  const bushMat = new THREE.MeshStandardMaterial({ color: '#e59bb0', roughness: .8 })
  for (let i = -3; i <= 3; i++) { const bush = new THREE.Mesh(new THREE.SphereGeometry(.28, 14, 10), bushMat); bush.position.set(i * .75, 1.05 + (i % 2) * .15, 0); foreground.add(bush) }
  scene.add(foreground)
  const prop = new THREE.Mesh(new THREE.CylinderGeometry(.06, .09, .35, 16), new THREE.MeshStandardMaterial({ color: '#f5c84c', metalness: .3, roughness: .3 }))
  const propStand = new THREE.Mesh(new THREE.CylinderGeometry(.25, .25, .9, 16), new THREE.MeshStandardMaterial({ color: '#f6f2e8' }))
  const focusProp = new THREE.Group(); prop.position.y = 1.1; propStand.position.y = .45; focusProp.add(prop, propStand); scene.add(focusProp)

  const shotCam = new THREE.PerspectiveCamera(40, 16 / 9, .05, 200)
  const proxy = new THREE.PerspectiveCamera(40, 16 / 9, .2, 4)
  const helper = new THREE.CameraHelper(proxy)
  helper.setColors(new THREE.Color('#191a17'), new THREE.Color('#e0a400'), new THREE.Color('#191a17'), new THREE.Color('#e0a400'), new THREE.Color('#191a17'))
  onLayer(helper, 1); scene.add(helper)
  const body = new THREE.Group()
  const bodyBox = new THREE.Mesh(new THREE.BoxGeometry(.26, .18, .3), new THREE.MeshStandardMaterial({ color: '#191a17' }))
  const lensMesh = new THREE.Mesh(new THREE.CylinderGeometry(.06, .07, .18, 16), new THREE.MeshStandardMaterial({ color: '#2d2f29' }))
  lensMesh.rotation.x = Math.PI / 2; lensMesh.position.z = -.22
  const top = new THREE.Mesh(new THREE.BoxGeometry(.1, .05, .1), new THREE.MeshStandardMaterial({ color: '#f5c84c' })); top.position.y = .115
  body.add(bodyBox, lensMesh, top); onLayer(body, 1); scene.add(body)
  const path = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineDashedMaterial({ color: '#191a17', dashSize: .15, gapSize: .1 }))
  onLayer(path, 1); scene.add(path);

  const update = (s: WorldFrame) => {
    const p = pose(s.kind, s.u, s.sec, s.rig, s.focal)
    const walkTime = s.time
    mannequin.group.position.copy(p.subject)
    mannequin.group.position.y = s.kind === 'car' ? .35 : 0
    mannequin.group.rotation.y = p.facing
    const swing = p.walking && s.limbs ? Math.sin(walkTime * 7) * .45 : 0
    mannequin.legs[0].rotation.x = swing; mannequin.legs[1].rotation.x = -swing
    mannequin.arms[0].rotation.x = -swing * .6; mannequin.arms[1].rotation.x = swing * .6
    car.visible = s.kind === 'car'
    if (car.visible) { car.position.copy(p.subject).setY(.45); car.rotation.y = p.facing }
    water.visible = s.kind === 'water'
    const th = THREE.MathUtils.degToRad(s.rig.angle)
    const dir = V(Math.sin(th), 0, Math.cos(th)), side = V(Math.cos(th), 0, -Math.sin(th))
    foreground.visible = s.kind === 'foreground'
    if (foreground.visible) { foreground.position.copy(dir.clone().multiplyScalar(s.rig.d * .55)); foreground.rotation.y = th }
    focusProp.visible = s.kind === 'focus'
    if (focusProp.visible) focusProp.position.copy(dir.clone().multiplyScalar(s.rig.d * .35).add(side.clone().multiplyScalar(.35)))

    const halfLong = Math.atan(18 / p.focal)
    shotCam.aspect = s.aspect
    shotCam.fov = THREE.MathUtils.radToDeg(s.aspect >= 1 ? 2 * Math.atan(Math.tan(halfLong) / s.aspect) : 2 * halfLong)
    shotCam.position.copy(p.cam)
    shotCam.up.copy(p.up ?? V(0, 1, 0))
    shotCam.lookAt(p.target)
    shotCam.rotateZ(p.roll)
    shotCam.updateProjectionMatrix()
    const subjectCenter = p.subject.clone().setY(1.35)
    const distance = p.cam.distanceTo(subjectCenter)
    proxy.position.copy(shotCam.position); proxy.quaternion.copy(shotCam.quaternion)
    proxy.fov = shotCam.fov; proxy.aspect = shotCam.aspect; proxy.far = Math.max(.5, distance); proxy.updateProjectionMatrix(); proxy.updateMatrixWorld(); helper.update()
    body.position.copy(shotCam.position); body.quaternion.copy(shotCam.quaternion)
    return { p, distance }
  }

  const dispose = () => scene.traverse((object) => {
    const mesh = object as THREE.Mesh
    mesh.geometry?.dispose()
    const material = mesh.material as THREE.Material | THREE.Material[] | undefined
    if (Array.isArray(material)) material.forEach((item) => item.dispose()); else material?.dispose()
  })

  return { scene, shotCam, path, update, dispose }
}

export type World = ReturnType<typeof createWorld>
