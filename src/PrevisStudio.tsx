import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Grid3x3, Pause, Play, RotateCcw } from 'lucide-react'
import { cameraMovements, movementCategories } from './cameraMovementData'
import { ASPECTS, createWorld, DEFAULT_RIG, HOLD, kindOf, LENSES, lensOf, pose, shotSize } from './previsWorld'
import type { Language, Rig } from './previsWorld'

export default function PrevisStudio({ movementId, onMovementChange, language }: { movementId: string; onMovementChange: (id: string) => void; language: Language }) {
  const overviewRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<HTMLDivElement>(null)
  const scrubRef = useRef<HTMLInputElement>(null)
  const readoutRef = useRef<HTMLParagraphElement>(null)
  const reducedMotion = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [playing, setPlaying] = useState(!reducedMotion.current)
  const [focal, setFocal] = useState(() => lensOf(movementId) ?? 35)
  const [aspect, setAspect] = useState(ASPECTS[0])
  const [rig, setRig] = useState<Rig>(DEFAULT_RIG)
  const [speed, setSpeed] = useState(1)
  const [thirds, setThirds] = useState(true)
  const kind = kindOf(movementId)
  const duration = 6 / speed
  const state = useRef({ kind, rig, focal, aspect: aspect.value, duration, playing, t: 0, language })
  state.current = { ...state.current, kind, rig, focal, aspect: aspect.value, duration, playing, language }
  const pathRef = useRef<THREE.Line | null>(null)

  useEffect(() => {
    const lens = lensOf(movementId)
    if (lens) setFocal(lens)
    state.current.t = 0
  }, [movementId])

  useEffect(() => {
    const overviewEl = overviewRef.current!, viewEl = viewRef.current!
    const world = createWorld()
    const { scene, shotCam } = world
    pathRef.current = world.path

    const overviewCam = new THREE.PerspectiveCamera(45, 4 / 3, .1, 300)
    overviewCam.position.set(7, 6.5, 10); overviewCam.layers.enable(1)
    const makeRenderer = (el: HTMLElement) => {
      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap
      el.prepend(renderer.domElement)
      return renderer
    }
    const overviewRenderer = makeRenderer(overviewEl), viewRenderer = makeRenderer(viewEl)
    const controls = new OrbitControls(overviewCam, overviewRenderer.domElement)
    controls.target.set(0, 1, 0); controls.enableDamping = true; controls.maxPolarAngle = Math.PI * .49; controls.minDistance = 3; controls.maxDistance = 40

    const resize = () => {
      overviewRenderer.setSize(overviewEl.clientWidth, overviewEl.clientHeight, false)
      overviewCam.aspect = overviewEl.clientWidth / Math.max(1, overviewEl.clientHeight); overviewCam.updateProjectionMatrix()
      viewRenderer.setSize(viewEl.clientWidth, viewEl.clientHeight, false)
    }
    const observer = new ResizeObserver(resize); observer.observe(overviewEl); observer.observe(viewEl); resize()

    const clock = new THREE.Clock()
    let frame = 0
    const loop = () => {
      frame = requestAnimationFrame(loop)
      const s = state.current
      const dt = Math.min(clock.getDelta(), .1)
      if (s.playing) { s.t += dt / s.duration; if (s.t > 1 + HOLD) s.t = 0 }
      const u = Math.min(1, s.t)
      const { p, distance } = world.update({ kind: s.kind, u, sec: u * s.duration, rig: s.rig, focal: s.focal, aspect: s.aspect, time: clock.elapsedTime, limbs: s.playing })

      controls.update()
      overviewRenderer.render(scene, overviewCam)
      viewRenderer.render(scene, shotCam)

      if (scrubRef.current && s.playing) scrubRef.current.value = String(Math.round(u * 1000))
      if (readoutRef.current) {
        const frameHeight = 2 * distance * Math.tan(THREE.MathUtils.degToRad(shotCam.fov) / 2)
        const en = s.language === 'en'
        const height = p.cam.y
        const angle = s.kind === 'top-down' ? (en ? 'Top-down' : '顶视') : height < .7 ? (en ? 'Low angle' : '低角度') : height > 2.6 ? (en ? 'High angle' : '高角度') : (en ? 'Eye level' : '平视')
        readoutRef.current.textContent = `${Math.round(p.focal)}mm · ${shotSize(frameHeight, s.language)} · ${angle} · ${en ? 'distance' : '距离'} ${distance.toFixed(1)}m · ${en ? 'height' : '高度'} ${height.toFixed(1)}m`
      }
    }
    loop()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      controls.dispose()
      world.dispose()
      for (const renderer of [overviewRenderer, viewRenderer]) { renderer.dispose(); renderer.domElement.remove() }
      pathRef.current = null
    }
  }, [])

  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    const points = Array.from({ length: 81 }, (_, i) => pose(kind, i / 80, i / 80 * duration, rig, focal).cam)
    path.geometry.dispose()
    path.geometry = new THREE.BufferGeometry().setFromPoints(points)
    path.computeLineDistances()
  }, [kind, rig, focal, duration])

  const t = (zh: string, en: string) => language === 'en' ? en : zh
  const movement = cameraMovements.find((item) => item.id === movementId)
  const scrub = (value: number) => { state.current.t = value / 1000; setPlaying(false) }
  const restart = () => { state.current.t = 0; if (scrubRef.current) scrubRef.current.value = '0'; setPlaying(true) }
  const slider = (key: keyof Rig, label: string, min: number, max: number, step: number, unit: string) => <label className="previs-slider">
    <span>{label}<b>{rig[key]}{unit}</b></span>
    <input type="range" min={min} max={max} step={step} value={rig[key]} onChange={(event) => setRig({ ...rig, [key]: Number(event.target.value) })} />
  </label>

  return <section className="previs" id="previs-studio" aria-labelledby="previs-title">
    <div className="previs-heading">
      <div><p className="eyebrow">3D PREVIS / {t('运镜预演', 'MOVE REHEARSAL')}</p><h4 id="previs-title">{t('3D 运镜预演台', '3D Previs Stage')}</h4><p>{t('左边是俯瞰场景（拖动旋转、滚轮缩放），右边是摄影机实时看到的画面。选择运镜、焦段与画幅，先在这里排练一遍。', 'Left: the set from above (drag to orbit, scroll to zoom). Right: what the camera sees, live. Pick a move, lens, and aspect ratio, then rehearse it here first.')}</p></div>
      <select value={movementId} onChange={(event) => onMovementChange(event.target.value)} aria-label={t('选择运镜', 'Choose a movement')}>
        <option value="free">{t('自由机位（不运动）', 'Free camera (no move)')}</option>
        {movementCategories.map((category) => <optgroup key={category.id} label={category[language]}>{cameraMovements.filter((item) => item.category === category.id).map((item) => <option key={item.id} value={item.id}>{item.name[language]}</option>)}</optgroup>)}
      </select>
    </div>

    <div className="previs-views">
      <figure className="previs-overview" ref={overviewRef}><figcaption>{t('场景俯瞰', 'Set overview')}</figcaption></figure>
      <div className="previs-camera-column">
        <figure className="previs-camera" ref={viewRef} style={{ '--ar': aspect.value } as React.CSSProperties}>
          <figcaption>{t('摄影机画面', 'Camera view')} · {aspect.id}</figcaption>
          {thirds && <div className="previs-thirds" aria-hidden="true" />}
        </figure>
        <p className="previs-readout" ref={readoutRef} aria-live="off" />
      </div>
    </div>

    <div className="previs-transport">
      <button className="previs-play" onClick={() => setPlaying(!playing)} aria-label={playing ? t('暂停', 'Pause') : t('播放', 'Play')}>{playing ? <Pause size={16} /> : <Play size={16} />}</button>
      <button onClick={restart} aria-label={t('从头播放', 'Restart')}><RotateCcw size={15} /></button>
      <input ref={scrubRef} type="range" min={0} max={1000} defaultValue={0} onChange={(event) => scrub(Number(event.target.value))} aria-label={t('运镜进度', 'Move progress')} />
      <div className="previs-chips" role="group" aria-label={t('速度', 'Speed')}>{[.5, 1, 2].map((value) => <button key={value} aria-pressed={speed === value} onClick={() => setSpeed(value)}>{value}×</button>)}</div>
    </div>

    <div className="previs-controls">
      <div><small>{t('焦段（全画幅）', 'Lens (full frame)')}</small><div className="previs-chips">{LENSES.map((value) => <button key={value} aria-pressed={focal === value} onClick={() => setFocal(value)}>{value}mm</button>)}</div></div>
      <div><small>{t('画幅', 'Aspect ratio')}</small><div className="previs-chips">{ASPECTS.map((item) => <button key={item.id} aria-pressed={aspect.id === item.id} onClick={() => setAspect(item)}>{item.id}</button>)}<button aria-pressed={thirds} onClick={() => setThirds(!thirds)} aria-label={t('三分线', 'Rule of thirds')}><Grid3x3 size={13} /></button></div></div>
      <div className="previs-rig">
        {slider('d', t('起始距离', 'Start distance'), 1, 10, .1, 'm')}
        {slider('h', t('机位高度', 'Camera height'), .1, 4, .05, 'm')}
        {slider('angle', t('机位角度', 'Camera angle'), -180, 180, 5, '°')}
        <button onClick={() => setRig(DEFAULT_RIG)}>{t('重置机位', 'Reset rig')}</button>
      </div>
    </div>
    {movement && <p className="previs-brief"><strong>{movement.name[language]}</strong> · {movement.how[language]}</p>}
  </section>
}
