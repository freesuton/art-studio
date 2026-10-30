import { lazy, Suspense, useMemo, useState } from 'react'
import { Box, ExternalLink, Video } from 'lucide-react'
import { cameraMovements, gearLabels, movementCategories, movementRecipe } from './cameraMovementData'
import type { CameraMovement, MovementCategory, MovementDiagram, MovementGear } from './cameraMovementData'
import { filmReferences } from './filmReferences'
import './cameraMovement.css'
import WorkspaceToggle from './WorkspaceToggle'

const PrevisStudio = lazy(() => import('./PrevisStudio'))
const CardPrevis = lazy(() => import('./CardPrevis'))

type Language = 'zh' | 'en'
const INK = '#191a17'
const SUBJECT = '#ff8d72'
const ACCENT = '#f5c84c'

function Glide({ path, dur = 4, animate, hold = true, children, keyPoints, keyTimes }: { path: string; dur?: number; animate: boolean; hold?: boolean; children: React.ReactNode; keyPoints?: string; keyTimes?: string }) {
  const [, x, y] = path.match(/M\s*([\d.-]+)[\s,]+([\d.-]+)/) || []
  return <g transform={animate ? undefined : `translate(${x} ${y})`}>
    {children}
    {animate && <animateMotion path={path} dur={`${dur}s`} repeatCount="indefinite" calcMode="linear" keyPoints={keyPoints ?? (hold ? '0;1;1' : '0;1')} keyTimes={keyTimes ?? (hold ? '0;.8;1' : '0;1')} />}
  </g>
}
const Cam = () => <g><circle r="7" fill={INK} /><circle r="3" fill={ACCENT} /></g>
const Person = () => <circle r="9" fill={SUBJECT} stroke={INK} strokeWidth="1.5" />
const Trail = ({ d }: { d: string }) => <path d={d} fill="none" stroke={INK} strokeWidth="1.2" strokeDasharray="3 4" opacity=".45" />
const Figure = ({ x, h = 70, base = 100 }: { x: number; h?: number; base?: number }) => <g stroke={INK} strokeWidth="1.5">
  <line x1={x} y1={base} x2={x} y2={base - h + 12} strokeWidth="5" stroke={SUBJECT} strokeLinecap="round" />
  <circle cx={x} cy={base - h + 4} r="7" fill={SUBJECT} />
</g>
const Ground = ({ y = 100 }: { y?: number }) => <line x1="10" y1={y} x2="190" y2={y} stroke={INK} opacity=".25" />

function Diagram({ kind, animate }: { kind: MovementDiagram; animate: boolean }) {
  const loop = (attr: string, values: string, dur = 4) => animate ? <animate attributeName={attr} values={values} dur={`${dur}s`} repeatCount="indefinite" /> : null
  const content = (() => {
    switch (kind) {
      case 'push': return <><g transform="translate(100 45)"><Person /></g><Trail d="M100 108 L100 72" /><Glide path="M100 108 L100 72" dur={5} animate={animate}><Cam /></Glide></>
      case 'pull': return <><g transform="translate(100 45)"><Person /></g><Trail d="M100 66 L100 108" /><Glide path="M100 66 L100 108" dur={5} animate={animate}><Cam /></Glide></>
      case 'track': return <><Trail d="M35 40 L165 40" /><Trail d="M35 92 L165 92" /><Glide path="M35 40 L165 40" animate={animate}><Person /></Glide><Glide path="M35 92 L165 92" animate={animate}><Cam /></Glide></>
      case 'lead': return <><Trail d="M100 108 L100 20" /><Glide path="M100 108 L100 70" animate={animate}><Person /></Glide><Glide path="M100 58 L100 20" animate={animate}><Cam /></Glide></>
      case 'follow': return <><Trail d="M100 108 L100 20" /><Glide path="M100 64 L100 22" animate={animate}><Person /></Glide><Glide path="M100 108 L100 66" animate={animate}><Cam /></Glide></>
      case 'arc': return <><g transform="translate(100 55)"><Person /></g><Trail d="M58 55 A42 42 0 0 0 142 55" /><Glide path="M58 55 A42 42 0 0 0 142 55" dur={5} animate={animate}><Cam /></Glide></>
      case 'orbit': { const d = 'M58 60 A42 42 0 1 0 142 60 A42 42 0 1 0 58 60'; return <><g transform="translate(100 60)"><Person /></g><Trail d={d} /><Glide path={d} dur={6} hold={false} animate={animate}><Cam /></Glide></> }
      case 'tilt-up':
      case 'tilt-down': {
        const up = kind === 'tilt-up'
        return <><Ground /><Figure x={130} h={78} /><g transform="translate(40 62)"><Cam /></g>
          <rect x="106" width="48" height="26" rx="3" fill="none" stroke={INK} strokeWidth="1.6" y={up ? 74 : 20}>{loop('y', up ? '74;20;20' : '20;74;74')}</rect>
          <path d={`M47 62 L106 ${up ? 87 : 33}`} stroke={INK} opacity=".35">{animate && <animate attributeName="d" values={up ? 'M47 62 L106 87;M47 62 L106 33;M47 62 L106 33' : 'M47 62 L106 33;M47 62 L106 87;M47 62 L106 87'} dur="4s" repeatCount="indefinite" />}</path></>
      }
      case 'pan': return <><path d="M10 80 Q50 50 90 72 T190 66" fill="none" stroke={INK} opacity=".3" /><Figure x={160} h={52} base={92} /><rect y="30" width="60" height="62" rx="3" fill="none" stroke={INK} strokeWidth="1.6" x="15">{loop('x', '15;130;130', 5)}</rect></>
      case 'crane-up':
      case 'crane-down': {
        const d = kind === 'crane-up' ? 'M55 96 L55 18' : 'M55 18 L55 96'
        return <><Ground /><Figure x={135} h={56} /><Trail d="M55 96 L55 18" /><Glide path={d} dur={5} animate={animate}><Cam /></Glide></>
      }
      case 'handheld': { const d = 'M80 96 Q86 88 92 95 T104 93 T116 97 T110 88 T96 92 T84 90 T80 96'; return <><g transform="translate(100 42)"><Person /></g><Trail d={d} /><Glide path={d} dur={3} hold={false} animate={animate}><Cam /></Glide></> }
      case 'car': return <><line x1="10" y1="64" x2="190" y2="64" stroke={INK} strokeWidth="1.5" strokeDasharray="10 10" opacity=".4">{loop('stroke-dashoffset', '0;20', .6)}</line>
        <g transform="translate(100 40)"><rect x="-20" y="-9" width="40" height="18" rx="6" fill={SUBJECT} stroke={INK} strokeWidth="1.5" /></g>
        <g transform="translate(100 88)"><rect x="-18" y="-8" width="36" height="16" rx="6" fill={INK} /><circle cx="6" r="3" fill={ACCENT} /></g></>
      case 'drone-rise': return <><Ground /><Figure x={55} h={26} /><Trail d="M70 88 Q95 40 165 18" /><Glide path="M70 88 Q95 40 165 18" dur={5} animate={animate}><Cam /></Glide></>
      case 'top-down': return <><rect x="40" y="18" width="120" height="84" rx="6" fill="#9ed7e8" opacity=".5" /><g transform="translate(100 60)"><Person /></g>
        <g transform="translate(100 60)"><rect x="-38" y="-26" width="76" height="52" rx="3" fill="none" stroke={INK} strokeWidth="1.6">{animate && <animateTransform attributeName="transform" type="rotate" values="0;25;0" dur="7s" repeatCount="indefinite" />}</rect></g></>
      case 'focus': return <><defs><filter id="cm-blur"><feGaussianBlur stdDeviation="0">{animate && <animate attributeName="stdDeviation" values="0;3;3;0" dur="4s" repeatCount="indefinite" />}</feGaussianBlur></filter><filter id="cm-blur2"><feGaussianBlur stdDeviation="3">{animate && <animate attributeName="stdDeviation" values="3;0;0;3" dur="4s" repeatCount="indefinite" />}</feGaussianBlur></filter></defs>
        <circle cx="62" cy="72" r="18" fill={ACCENT} stroke={INK} filter="url(#cm-blur)" /><g filter="url(#cm-blur2)"><circle cx="142" cy="44" r="10" fill={SUBJECT} stroke={INK} strokeWidth="1.5" /></g><g transform="translate(30 104)"><Cam /></g></>
      case 'zoom': return <><g transform="translate(100 55)"><Person /><rect x="-70" y="-42" width="140" height="84" rx="3" fill="none" stroke={INK} strokeWidth="1.6">{animate && <animateTransform attributeName="transform" type="scale" values="1;.35;.35" keyTimes="0;.85;1" dur="6s" repeatCount="indefinite" />}</rect></g></>
      case 'dolly-zoom': return <><g transform="translate(100 50)" opacity=".4">{[-60, -30, 30, 60].map((x) => <line key={x} x1={x} y1="-30" x2={x} y2="30" stroke={INK} strokeWidth="2">{animate && <animate attributeName="x1" values={`${x};${x * .45};${x}`} dur="4s" repeatCount="indefinite" />}{animate && <animate attributeName="x2" values={`${x};${x * .45};${x}`} dur="4s" repeatCount="indefinite" />}</line>)}</g>
        <g transform="translate(100 50)"><Person /></g><Trail d="M100 74 L100 108" /><Glide path="M100 74 L100 108 L100 74" dur={4} hold={false} animate={animate}><Cam /></Glide></>
      case 'foreground': return <><g transform="translate(100 34)"><Person /></g>
        <g>{[30, 80, 130, 180].map((x) => <rect key={x} x={x} y="62" width="14" height="26" rx="7" fill="#9faf79" opacity=".75" />)}{animate && <animateTransform attributeName="transform" type="translate" values="0 0;-50 0" dur="3s" repeatCount="indefinite" />}</g>
        <g transform="translate(100 104)"><Cam /></g></>
      case 'whip': return <><g opacity=".5">{[40, 55, 70].map((y) => <line key={y} x1="20" y1={y} x2="180" y2={y} stroke={INK} strokeDasharray="40 12">{loop('stroke-dashoffset', '0;-104', .5)}</line>)}</g><g transform="translate(100 104)"><Cam /></g></>
      case 'roll': return <><g transform="translate(100 55)"><Person /><rect x="-46" y="-30" width="92" height="60" rx="3" fill="none" stroke={INK} strokeWidth="1.6">{animate && <animateTransform attributeName="transform" type="rotate" values="0;-30;0" dur="5s" repeatCount="indefinite" />}</rect></g></>
      case 'static': return <><path d="M100 104 L45 30 L155 30 Z" fill={ACCENT} opacity=".18" /><Trail d="M25 46 L175 46" /><Glide path="M25 46 L175 46" dur={5} animate={animate}><Person /></Glide><g transform="translate(100 104)"><Cam /></g></>
      case 'drift': return <><g transform="translate(100 48)"><Person /></g><Trail d="M94 100 L106 100" /><Glide path="M94 100 L106 100 L94 100" dur={8} hold={false} animate={animate}><Cam /></Glide></>
      case 'low': return <><Ground y={104} /><Figure x={120} h={64} base={104} /><Trail d="M30 98 L100 98" /><Glide path="M30 98 L100 98" dur={5} animate={animate}><Cam /></Glide></>
      case 'speed': return <><Trail d="M25 60 L175 60" /><Glide path="M25 60 L175 60" dur={5} animate={animate} keyPoints="0;.4;.6;1" keyTimes="0;.15;.85;1"><Person /></Glide><g transform="translate(100 104)"><Cam /></g></>
    }
  })()
  return <svg className="camera-diagram" viewBox="0 0 200 120" role="img" aria-hidden="true">{content}</svg>
}

function MovementCard({ movement, language, animate, highlighted, onPreview }: { movement: CameraMovement; language: Language; animate: boolean; highlighted: boolean; onPreview: () => void }) {
  const t = (text: { zh: string; en: string }) => text[language]
  const category = movementCategories.find((item) => item.id === movement.category)!
  const refs = (movement.refs ?? []).map((id) => filmReferences.find((film) => film.id === id)).filter(Boolean)
  return <article className={`camera-card ${highlighted ? 'highlighted' : ''}`} id={`camera-${movement.id}`}>
    <div className="camera-card-visual"><Suspense fallback={<Diagram kind={movement.diagram} animate={animate} />}><CardPrevis movementId={movement.id} label={t(movement.name)} /></Suspense><span>{category[language]}</span></div>
    <div className="camera-card-body">
      <p className="camera-card-meta"><span>{t(movement.speed)}</span><span>{movement.lens}</span></p>
      <h4>{t(movement.name)}<small>{language === 'en' ? movement.name.zh : movement.name.en}</small></h4>
      <p className="camera-card-purpose">{t(movement.purpose)}</p>
      <p className="camera-card-cue"><span>{language === 'en' ? 'Tell the model' : '对模特说'}</span>{t(movement.cue)}</p>
      <div className="camera-card-gear">{movement.gear.map((gear) => <span key={gear}>{gearLabels[gear][language]}</span>)}</div>
      <div className="camera-card-actions"><button className="camera-card-previs" onClick={onPreview}><Box size={14} /> {language === 'en' ? 'Rehearse in 3D' : '3D 预演'}</button><WorkspaceToggle itemKey={`camera:${movement.id}`} language={language} /></div>
      <details>
        <summary>{language === 'en' ? 'How to shoot it' : '怎么拍'}</summary>
        <dl>
          <div><dt>{language === 'en' ? 'Execution' : '拍法'}</dt><dd>{t(movement.how)}</dd></div>
          <div><dt>{language === 'en' ? 'Fashion use' : '时尚用法'}</dt><dd>{t(movement.fashion)}</dd></div>
          <div><dt>{language === 'en' ? 'Avoid' : '避免'}</dt><dd>{t(movement.mistake)}</dd></div>
          {refs.length > 0 && <div><dt>{language === 'en' ? 'Watch for a similar feel' : '可参考的样片感觉'}</dt><dd className="camera-card-refs">{refs.map((film) => <a key={film!.id} href={film!.url} target="_blank" rel="noopener noreferrer">{film!.title} <ExternalLink size={11} /></a>)}</dd></div>}
        </dl>
      </details>
    </div>
  </article>
}

export default function CameraMovementLibrary({ language }: { language: Language }) {
  const [category, setCategory] = useState<MovementCategory | 'all'>('all')
  const [gear, setGear] = useState<MovementGear | 'all'>('all')
  const [highlight, setHighlight] = useState<string | null>(null)
  const [previewId, setPreviewId] = useState('slow-push-in')
  const preview = (id: string) => {
    setPreviewId(id)
    window.requestAnimationFrame(() => document.getElementById('previs-studio')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }
  const animate = useMemo(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const list = cameraMovements.filter((item) => (category === 'all' || item.category === category) && (gear === 'all' || item.gear.includes(gear)))
  const jumpTo = (id: string) => {
    setCategory('all')
    setGear('all')
    setHighlight(id)
    window.requestAnimationFrame(() => document.getElementById(`camera-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
    window.setTimeout(() => setHighlight((current) => current === id ? null : current), 2400)
  }
  const nameOf = (id: string) => cameraMovements.find((item) => item.id === id)!.name[language]

  return <section className="camera-library" aria-labelledby="camera-library-title">
    <div className="camera-library-heading">
      <div><p className="eyebrow">CAMERA MOVEMENT / FASHION FILM</p><h3 id="camera-library-title">{language === 'en' ? 'Camera Movement Library' : '时尚短片运镜参考库'}</h3><p>{language === 'en' ? 'Pick moves for your shot list. Each card shows the camera path, the gear, a line you can say to the model, and how to execute it on set.' : '为镜头表挑选运镜。每张卡片包含机位路径、所需器材、可以直接对模特说的话，以及现场执行方法。'}</p></div>
      <span><Video size={14} /> {cameraMovements.length} MOVES</span>
    </div>

    <Suspense fallback={<div className="previs previs-loading">{language === 'en' ? 'Loading 3D stage…' : '正在载入 3D 预演台…'}</div>}>
      <PrevisStudio movementId={previewId} onMovementChange={setPreviewId} language={language} />
    </Suspense>

    <div className="camera-recipe">
      <p className="eyebrow">{language === 'en' ? 'A 1–2 MINUTE FASHION FILM, IN SEVEN BEATS' : '1–2 分钟时尚短片 · 七段运镜配方'}</p>
      <ol>{movementRecipe.map((beat, index) => <li key={beat.step.en}><span>{String(index + 1).padStart(2, '0')}</span><strong>{beat.step[language]}</strong><div>{beat.ids.map((id) => <button key={id} onClick={() => jumpTo(id)}>{nameOf(id)}</button>)}</div></li>)}</ol>
    </div>

    <div className="camera-filters">
      <div role="group" aria-label={language === 'en' ? 'Movement type' : '运镜类型'}>
        <button aria-pressed={category === 'all'} onClick={() => setCategory('all')}>{language === 'en' ? 'All' : '全部'} <span>{cameraMovements.length}</span></button>
        {movementCategories.map((item) => <button key={item.id} aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item[language]} <span>{cameraMovements.filter((movement) => movement.category === item.id).length}</span></button>)}
      </div>
      <div role="group" aria-label={language === 'en' ? 'Available gear' : '手上的器材'} className="camera-gear-filter">
        <small>{language === 'en' ? 'Gear' : '器材'}</small>
        <button aria-pressed={gear === 'all'} onClick={() => setGear('all')}>{language === 'en' ? 'Any' : '不限'}</button>
        {(Object.keys(gearLabels) as MovementGear[]).map((id) => <button key={id} aria-pressed={gear === id} onClick={() => setGear(id)}>{gearLabels[id][language]}</button>)}
      </div>
    </div>

    {list.length > 0 ? <div className="camera-grid">{list.map((movement) => <MovementCard key={movement.id} movement={movement} language={language} animate={animate} highlighted={highlight === movement.id} onPreview={() => preview(movement.id)} />)}</div>
      : <p className="camera-empty">{language === 'en' ? 'No moves match this combination.' : '没有符合这个组合的运镜。'}</p>}
    <p className="camera-note">{language === 'en' ? 'Lens ranges assume full frame. Reference films are suggestions for a similar feel, not shot-by-shot breakdowns.' : '焦段按全画幅参考。样片链接仅提示类似的感觉，并非逐镜头拆解。'}</p>
  </section>
}
