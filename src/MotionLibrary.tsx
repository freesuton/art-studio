import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Bookmark, Check, ChevronLeft, Maximize2, Pause, Play, RotateCcw, Search, X } from 'lucide-react'
import { environments, motionCategories, motions } from './motionData'
import type { Motion, MotionCategory, Pose } from './motionData'
import './motionLibrary.css'

const STORAGE = 'short-film-motion-library-v1'
const SAVE_KEY = 'short-film-motion-favorites-v1'
function readLocal(key: string) { try { return JSON.parse(localStorage.getItem(key) || 'null') } catch { return null } }
const defaultPose = { lean: 0, x: 0, y: 0, head: 0, ls: -8, le: -8, rs: 8, re: 8, ll: -4, lk: 0, rl: 4, rk: 0, turn: 1, lhx: 103, lhy: 156, rhx: 157, rhy: 156 }
type FullPose = typeof defaultPose
type Point = [number, number]
const point = (origin: Point, length: number, angle: number): Point => [origin[0] + Math.sin(angle * Math.PI / 180) * length, origin[1] + Math.cos(angle * Math.PI / 180) * length]
const path = (points: Point[]) => points.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ')
function elbowFor(origin: Point, target: Point, side: number): Point {
  const dx = target[0] - origin[0], dy = target[1] - origin[1]
  const distance = Math.max(.1, Math.min(56.9, Math.hypot(dx, dy)))
  const direction = Math.atan2(dx, dy)
  const offset = Math.acos(Math.max(-1, Math.min(1, (29 * 29 + distance * distance - 28 * 28) / (2 * 29 * distance))))
  return point(origin, 29, (direction + side * offset) * 180 / Math.PI)
}
function poseAt(motion: Motion, t: number): FullPose {
  const n = motion.poses.length
  const segment = t * n
  const a = { ...defaultPose, ...motion.poses[Math.floor(segment) % n] }
  const b = { ...defaultPose, ...motion.poses[(Math.floor(segment) + 1) % n] }
  const ratio = segment % 1
  const ease = (1 - Math.cos(ratio * Math.PI)) / 2
  const pose = { ...defaultPose }
  for (const key of Object.keys(pose) as (keyof FullPose)[]) pose[key] = a[key] + (b[key] - a[key]) * ease
  return pose
}

export function MotionScene({ motion, paused = false, large = false }: { motion: Motion; paused?: boolean; large?: boolean }) {
  const svg = useRef<SVGSVGElement>(null)
  const time = useRef(0)
  useEffect(() => {
    const el = svg.current
    if (!el) return
    let frame = 0, last = 0, previousDraw = 0, visible = false
    const node = (selector: string) => el.querySelector<SVGElement>(selector)!
    const body = node('[data-body]'), head = node('[data-head]'), gaze = node('[data-gaze]'), progress = node('[data-progress]')
    const leftArm = node('[data-left-arm]'), rightArm = node('[data-right-arm]'), leftLeg = node('[data-left-leg]'), rightLeg = node('[data-right-leg]')
    const leftHand = node('[data-left-hand]'), rightHand = node('[data-right-hand]'), skirt = node('[data-skirt]')
    const draw = (elapsed: number) => {
      const t = (elapsed / (motion.duration * 1000)) % 1
      const p = poseAt(motion, t)
      let travel = 0, scale = 1
      if (motion.category === 'walk') {
        if (motion.id === 'M009') scale = .76 + t * .24
        if (motion.id === 'M010') travel = -50 + 100 * t
        if (motion.id === 'M011') scale = 1 - t * .3
        if (motion.id === 'M012' && t > .55) Object.assign(p, { ll: -5, lk: 0, rl: 5, rk: 0, ls: -8, le: -8, rs: 8, re: 8, y: 0, x: 8, head: 12 })
        if (motion.id === 'M013') { travel = -30 + 60 * t; p.turn = .55 + Math.sin(t * Math.PI) * .4 }
        if (motion.id === 'M014') { travel = -20 + 40 * t; p.head = t > .35 && t < .7 ? -20 : 0 }
        if (motion.id === 'M015') travel = -75 + 240 * t
        if (motion.id === 'M016') { scale = .8 + Math.min(.2, t * .4); travel = t > .5 ? (t - .5) * 100 : 0 }
      }
      const ls: Point = [115, 101], rs: Point = [145, 101]
      let le = point(ls, 29, p.ls), lh = point(le, 28, p.ls + p.le)
      if (motion.poses.some(pose => pose.lhx !== undefined)) { lh = [p.lhx, p.lhy]; le = elbowFor(ls, lh, 1) }
      let re = point(rs, 29, p.rs), rh = point(re, 28, p.rs + p.re)
      if (motion.poses.some(pose => pose.rhx !== undefined)) { rh = [p.rhx, p.rhy]; re = elbowFor(rs, rh, -1) }
      const lHip: Point = [122, 158], rHip: Point = [138, 158]
      const lk = point(lHip, 42, p.ll), la = point(lk, 39, p.ll + p.lk)
      const rk = point(rHip, 42, p.rl), ra = point(rk, 39, p.rl + p.rk)
      body.setAttribute('transform', `translate(${p.x + travel} ${p.y}) translate(130 240) scale(${scale}) translate(-130 -240) translate(130 159) rotate(${p.lean}) scale(${p.turn} 1) translate(-130 -159)`)
      body.setAttribute('opacity', motion.category === 'walk' ? String(Math.min(1, (1-t)*14, t*14+.1)) : '1')
      leftArm.setAttribute('d', path([ls, le, lh])); rightArm.setAttribute('d', path([rs, re, rh]))
      leftLeg.setAttribute('d', path([lHip, lk, la])); rightLeg.setAttribute('d', path([rHip, rk, ra]))
      leftHand.setAttribute('transform', `translate(${lh[0]} ${lh[1]}) rotate(${-p.ls-p.le})`)
      rightHand.setAttribute('transform', `translate(${rh[0]} ${rh[1]}) rotate(${-p.rs-p.re})`)
      head.setAttribute('transform', `rotate(${p.head} 130 87)`)
      gaze.setAttribute('transform', `translate(${p.head * .08} 0)`)
      const backView = motion.id === 'M007' || motion.id === 'M011' || motion.id === 'M026' && (t < .15 || t > .85)
      gaze.setAttribute('opacity', backView ? '0' : '1')
      node('[data-eye-lines]').setAttribute('d', motion.id === 'M034' && t > .18 && t < .76 ? 'M122 72 q2 2 5 0 M134 72 q2 2 5 0' : 'M123 71 h3 M135 71 h3')
      node('[data-mouth]').setAttribute('d', motion.id === 'M039' && t > .2 && t < .8 ? 'M125 81 q5 7 11 -1' : 'M127 82 q4 2 7 -1')
      node('[data-hair-sway]').setAttribute('d', `M115 67 Q${105 - (motion.id === 'M054' ? Math.sin(t * Math.PI * 4) * 8 : 0)} 95 116 101 L120 82 Z`)
      node('[data-back-head]').setAttribute('opacity', backView ? '1' : '0')
      el.querySelector('[data-book-page]')?.setAttribute('d', `M130 151 Q${138 + Math.sin(t*Math.PI*2)*9} 135 151 149 L151 158 Q139 146 130 158 Z`)
      skirt.setAttribute('d', `M115 148 Q130 154 145 148 L${151+Math.sin(t*Math.PI*2)*2} 177 Q130 184 ${109+Math.sin(t*Math.PI*2)*2} 177 Z`)
      progress.setAttribute('width', String(t * 224))
      el.querySelectorAll('[data-beat]').forEach((beat, i) => beat.setAttribute('opacity', i === Math.min(3, Math.floor(t*4)) ? '1' : '.25'))
    }
    draw(time.current)
    const tick = (now: number) => {
      if (last && visible && !document.hidden) time.current += Math.min(now - last, 100)
      last = now
      if (now - previousDraw > 40 && visible && !document.hidden) { draw(time.current); previousDraw = now }
      frame = requestAnimationFrame(tick)
    }
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; last = 0 }, { threshold: .1 })
    observer.observe(el)
    if (!paused) frame = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(frame); observer.disconnect() }
  }, [motion, paused])

  return <div className={`motion-stage ${large ? 'motion-stage-large' : ''}`}>
    <svg ref={svg} viewBox="0 0 260 284" role="img" aria-label={`${motion.title}动作循环示意：${motion.cue}`}>
      <defs><pattern id={`dots-${motion.id}-${large}`} width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="currentColor" opacity=".09" /></pattern></defs>
      <rect width="260" height="252" fill={`url(#dots-${motion.id}-${large})`} />
      <path d="M22 243 H238" className="motion-floor" />
      <ellipse cx="130" cy="244" rx="36" ry="4" className="motion-shadow" />
      {motion.prop === 'chair' && <g className="motion-prop"><path d="M81 133 V194 H178 M86 194 V243 M171 194 V243" /><path d="M81 137 H90 V187 H178" /></g>}
      {motion.prop === 'wall' && <g className="motion-prop"><path d="M55 27 V243 M49 27 V243 M23 243 L55 227" /><path d="M28 67 H49 M28 107 H49 M28 147 H49" /></g>}
      {motion.prop === 'rail' && <g className="motion-prop"><path d="M42 128 H219 M47 132 V243 M213 132 V243" /></g>}
      {motion.prop === 'window' && <g className="motion-prop"><path d="M180 28 H236 V192 H180 Z M208 28 V192 M180 107 H236" /><path d="M180 28 L153 49 V213 L180 192" className="motion-light" /></g>}
      {motion.prop === 'leaf' && <g className="motion-prop"><path d="M208 243 Q195 148 219 61 M202 149 Q169 134 179 116 Q206 115 202 149 M205 120 Q231 111 237 86 Q208 89 205 120 M211 94 Q187 77 195 60 Q216 68 211 94" /></g>}
      <g data-body>
        <path data-left-leg className="motion-limb motion-leg" /><path data-right-leg className="motion-limb motion-leg" />
        <path d="M117 96 Q130 88 143 96 L147 154 Q130 163 113 154 Z" className="motion-torso" />
        <path data-skirt className="motion-cloth" />
        <path d="M130 100 V151 M116 116 Q130 121 144 116" className="motion-seam" />
        {motion.id === 'M053' && <path d="M147 95 L164 104 L164 160 L153 157 L150 123 L141 143 L133 139 Z" className="motion-coat"/>}
        <path data-left-arm className="motion-limb" /><path data-right-arm className="motion-limb" />
        <g data-left-hand><ellipse cx="0" cy="2" rx="3.8" ry="6" className="motion-skin" /></g>
        <g data-right-hand><ellipse cx="0" cy="2" rx="3.8" ry="6" className="motion-skin" />
          {motion.prop === 'cup' && <path d="M-13 -2 H4 V13 Q-5 19 -13 13 Z M4 0 Q17 -1 13 10 H4" className="motion-held" />}
          {motion.prop === 'flower' && <g className="motion-held"><path d="M0 4 V-25 M0 -8 Q-13 -18 -8 -20 Q1 -16 0 -8"/><circle cx="0" cy="-30" r="7" /></g>}
        </g>
        {motion.id === 'M064' && <g className="motion-held"><path d="M106 147 Q119 144 130 151 Q142 145 154 148 L154 159 Q141 154 130 161 Q117 155 106 159 Z"/><path data-book-page fill="#f8f6ef"/></g>}
        {motion.prop === 'bag' && <g><path d="M145 105 Q168 129 154 164" className="motion-prop" /><path d="M148 151 H172 L169 177 H147 Z" className="motion-held" /></g>}
        <g data-head><path d="M122 87 V97 H138 V87" className="motion-skin" /><path d="M113 79 Q107 47 130 46 Q151 44 149 77 L144 102 L117 99 Z" className="motion-hair" /><ellipse cx="130" cy="70" rx="13" ry="18" className="motion-skin" /><path d="M115 65 Q119 45 139 53 L146 65 Q133 62 128 55 Q124 63 115 65" className="motion-hair" /><path data-hair-sway className="motion-hair"/><g data-gaze><path data-eye-lines d="M123 71 h3 M135 71 h3" className="motion-face" /><path d="M129 75 l-1 3 h3" className="motion-face"/><path data-mouth d="M127 82 q4 2 7 -1" className="motion-face" /></g><ellipse data-back-head cx="130" cy="70" rx="13" ry="18" className="motion-hair" opacity="0"/>{motion.id === 'M055' && <path d="M110 56 L115 45 Q131 38 145 45 L151 56 Z M102 58 Q131 50 158 58" className="motion-held"/>}</g>
      </g>
      <rect x="18" y="259" width="224" height="2" rx="1" className="motion-track" /><rect data-progress x="18" y="259" height="2" rx="1" className="motion-progress" />
      {motion.beats.map((beat, i) => <g key={i} data-beat opacity={i ? .25 : 1}><circle cx={29+i*60} cy="276" r="2" className="motion-progress"/><text x={36+i*60} y="279" className="motion-beat">{beat}</text></g>)}
    </svg>
    <span className="motion-stage-note">动作路径示意 · 非实拍</span>
  </div>
}

function MotionDetail({ motion, saved, onSave, onClose, paused }: { motion: Motion; saved: boolean; onSave: () => void; onClose: () => void; paused: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [playing, setPlaying] = useState(!paused)
  useEffect(() => {
    dialog.current?.showModal()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [])
  return <dialog ref={dialog} className="motion-dialog" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose() }} aria-labelledby="motion-detail-title">
    <header><span>{motion.id} / {motionCategories.find(c => c.id === motion.category)?.name}</span><button onClick={onClose} aria-label="关闭动作详情"><X size={21}/></button></header>
    <div className="motion-detail-layout"><div><MotionScene motion={motion} paused={!playing} large/><div className="motion-detail-controls"><button onClick={() => setPlaying(!playing)}>{playing ? <Pause size={15}/> : <Play size={15}/>} {playing ? '暂停动作' : '播放动作'}</button><button className={saved ? 'is-saved' : ''} onClick={onSave}><Bookmark size={15} fill={saved ? 'currentColor' : 'none'}/>{saved ? '已加入现场清单' : '加入现场清单'}</button></div></div>
      <div className="motion-detail-copy"><p className="eyebrow">POSING & CAMERA DIRECTION</p><h2 id="motion-detail-title">{motion.title}</h2><p className="motion-cue"><span>直接对人物说</span>“{motion.cue}”</p>
        <dl><div><dt>景别 / 焦段</dt><dd>{motion.framing} · {motion.lens}</dd></div><div><dt>机位 / 构图</dt><dd>{motion.angle}</dd></div><div><dt>摄影师怎么拍</dt><dd>{motion.camera}</dd></div><div><dt>避免的小问题</dt><dd>{motion.mistake}</dd></div></dl>
        <div className="motion-tags">{motion.environment.map(e => <span key={e}>{e}</span>)}<span>{motion.mood}</span></div>
        <p className="motion-detail-tip">先排练一遍，再录 2–3 条。每次只给一个指令；动作结束后继续录两秒。焦段按全画幅参考，实际距离以构图与合焦为准。</p>
      </div>
    </div>
  </dialog>
}

export default function MotionLibrary({ onBack }: { onBack: () => void }) {
  const initial = useRef(readLocal(STORAGE))
  const [category, setCategory] = useState<MotionCategory | 'all'>(() => motionCategories.some(c => c.id === initial.current?.category) ? initial.current.category : 'all')
  const [environment, setEnvironment] = useState<string>(() => environments.includes(initial.current?.environment) ? initial.current.environment : '')
  const [framing, setFraming] = useState<string>(() => ['全身', '半身', '近景'].includes(initial.current?.framing) ? initial.current.framing : '')
  const [query, setQuery] = useState<string>(() => typeof initial.current?.query === 'string' ? initial.current.query : '')
  const [saved, setSaved] = useState<string[]>(() => { const ids = readLocal(SAVE_KEY); return Array.isArray(ids) ? ids.filter(id => typeof id === 'string' && motions.some(m => m.id === id)) : [] })
  const [savedOnly, setSavedOnly] = useState(() => initial.current?.savedOnly === true)
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [limit, setLimit] = useState(() => [16, 32, 48, 64].includes(initial.current?.limit) ? initial.current.limit : 16)
  const [selected, setSelected] = useState<Motion | null>(null)
  useEffect(() => { localStorage.setItem(STORAGE, JSON.stringify({ category, environment, framing, query, savedOnly, limit })) }, [category, environment, framing, query, savedOnly, limit])
  const filterKey = `${category}|${environment}|${framing}|${query}|${savedOnly}`
  const previousFilter = useRef(filterKey)
  useEffect(() => { if (previousFilter.current !== filterKey) { setLimit(16); previousFilter.current = filterKey } }, [filterKey])
  const results = useMemo(() => motions.filter(m => (category === 'all' || m.category === category) && (!environment || m.environment.includes(environment)) && (!framing || m.framing === framing) && (!savedOnly || saved.includes(m.id)) && (!query.trim() || `${m.id} ${m.title} ${m.cue} ${m.mood} ${m.angle} ${m.lens} ${m.environment.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase()))), [category, environment, framing, query, savedOnly, saved])
  const toggle = (id: string) => setSaved(current => { const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id]; localStorage.setItem(SAVE_KEY, JSON.stringify(next)); return next })
  const reset = () => { setCategory('all'); setEnvironment(''); setFraming(''); setQuery(''); setSavedOnly(false) }
  return <section className="motion-library" id="motion-library" aria-labelledby="motion-library-title">
    <button className="motion-back" onClick={onBack}><ChevronLeft size={15}/> 导演知识库</button>
    <div className="motion-library-heading"><div><p className="eyebrow">DIRECTING TOOLKIT / MOTION ATLAS</p><h2 id="motion-library-title">人物动作与镜头引导库<span>从一个小动作，拍出自然的瞬间。</span></h2><p>选环境，找动作，把指令直接说给人物听。64 个原创循环示意，附上机位、焦段与现场提醒。</p></div><span className="motion-total">64<small>动作示意 / 8 类</small></span></div>
    <div className="motion-category-tabs" role="group" aria-label="动作分类"><button aria-pressed={category === 'all'} onClick={() => setCategory('all')}>全部动作 <span>64</span></button>{motionCategories.map(c => <button key={c.id} aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>{c.name}<span>08</span></button>)}</div>
    <div className="motion-toolbar"><label className="motion-search"><Search size={17}/><input aria-label="搜索动作" value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索：回头、裙摆、窗边、75mm…"/>{query && <button onClick={() => setQuery('')} aria-label="清空动作搜索"><X size={15}/></button>}</label><label className="motion-select"><span>环境</span><select aria-label="筛选环境" value={environment} onChange={e => setEnvironment(e.target.value)}><option value="">全部环境</option>{environments.map(e => <option key={e}>{e}</option>)}</select></label><label className="motion-select"><span>景别</span><select aria-label="筛选景别" value={framing} onChange={e => setFraming(e.target.value)}><option value="">全部景别</option>{['全身', '半身', '近景'].map(e => <option key={e}>{e}</option>)}</select></label></div>
    <div className="motion-results-bar"><p aria-live="polite">{results.length} 个动作 <span>· {savedOnly ? '我的现场清单' : '围绕一个真实的小任务，自然地完成它'}</span></p><div><button className={savedOnly ? 'is-saved' : ''} aria-pressed={savedOnly} onClick={() => setSavedOnly(!savedOnly)}><Bookmark size={15} fill={savedOnly ? 'currentColor' : 'none'}/>现场清单 {saved.length}</button><button onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? <Play size={15}/> : <Pause size={15}/>} {paused ? '播放全部' : '暂停全部'}</button></div></div>
    {results.length ? <><div className="motion-grid">{results.slice(0, limit).map(m => <article key={m.id} className="motion-card"><div className="motion-card-visual"><div className="motion-card-top"><span>{m.id} / {motionCategories.find(c => c.id === m.category)?.en}</span><button className={saved.includes(m.id) ? 'is-saved' : ''} onClick={() => toggle(m.id)} aria-label={`${saved.includes(m.id) ? '移出清单' : '加入清单'}：${m.title}`} aria-pressed={saved.includes(m.id)}><Bookmark size={16} fill={saved.includes(m.id) ? 'currentColor' : 'none'}/></button></div><button className="motion-visual-button" aria-label={`查看动作：${m.title}`} onClick={() => setSelected(m)}><MotionScene motion={m} paused={paused || selected !== null}/><span className="motion-expand"><Maximize2 size={14}/> 查看引导</span></button></div><div className="motion-card-copy"><div className="motion-card-meta"><span>{m.framing} · {m.lens}</span><span>{m.mood}</span></div><h3><button onClick={() => setSelected(m)}>{m.title}<ArrowRight size={15}/></button></h3><p>“{m.cue}”</p><div className="motion-card-bottom"><span>{m.environment.slice(0, 3).join(' / ')}</span>{saved.includes(m.id) && <span className="motion-saved-label"><Check size={12}/>已收藏</span>}</div></div></article>)}</div>{limit < results.length && <div className="motion-load-more"><button onClick={() => setLimit(limit + 16)}>展开更多动作 <ArrowRight size={16}/></button><span>已显示 {Math.min(limit, results.length)} / {results.length}</span></div>}</> : <div className="motion-empty"><Search size={28}/><h3>{savedOnly && !saved.length ? '把想拍的动作加入清单' : '这组条件暂时没有动作'}</h3><p>{savedOnly && !saved.length ? '点卡片右上角的收藏，下次拍摄时可以直接找到。' : '试试切换环境、景别，或减少一个筛选条件。'}</p><button onClick={reset}><RotateCcw size={15}/>查看全部动作</button></div>}
    <p className="motion-library-note">动态图用于理解身体动作与节奏，表情、手指与三维转身需结合现场排练。全部示意由本网站原创绘制；收藏保存在当前浏览器。</p>
    {selected && <MotionDetail motion={selected} saved={saved.includes(selected.id)} onSave={() => toggle(selected.id)} onClose={() => setSelected(null)} paused={paused}/>}
  </section>
}
