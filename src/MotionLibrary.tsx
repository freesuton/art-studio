import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Bookmark, Check, ChevronLeft, ExternalLink, Maximize2, Pause, Play, RotateCcw, Search, X } from 'lucide-react'
import { environments, motionCategories, motions } from './motionData'
import type { Motion, MotionCategory } from './motionData'
import './motionLibrary.css'

const STORAGE = 'short-film-real-motion-library-v2'
const SAVE_KEY = 'short-film-real-motion-favorites-v2'
function readLocal(key: string) { try { return JSON.parse(localStorage.getItem(key) || 'null') } catch { return null } }

function MotionVideo({ motion, paused = false, large = false, onExpand, onPlaybackChange }: { motion: Motion; paused?: boolean; large?: boolean; onExpand?: () => void; onPlaybackChange?: (playing: boolean) => void }) {
  const element = useRef<HTMLVideoElement>(null)
  const [inView, setInView] = useState(false)
  const [started, setStarted] = useState(false)
  const [userPlayback, setUserPlayback] = useState<'auto' | 'play' | 'pause'>('auto')
  useEffect(() => setUserPlayback('auto'), [paused])
  const [failed, setFailed] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [visible, setVisible] = useState(!document.hidden)
  useEffect(() => {
    const video = element.current
    if (!video) return
    const observer = new IntersectionObserver(entries => { const visible = entries[0].isIntersecting; setInView(visible); if (visible) setStarted(true) }, { threshold: .2 })
    observer.observe(video)
    const update = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', update)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update) }
  }, [])
  useEffect(() => {
    const video = element.current
    if (!video || !started || failed) return
    if (inView && visible && (userPlayback === 'play' || userPlayback === 'auto' && !paused)) { void video.play().catch(() => setPlaying(false)) }
    else video.pause()
  }, [inView, visible, paused, userPlayback, started, failed])
  return <div className={`motion-stage motion-real-video ${large ? 'motion-stage-large' : ''}`}>
    <video ref={element} src={started ? motion.videoUrl : undefined} poster={motion.poster} muted loop playsInline preload="none" controls={large && !failed} controlsList="nodownload" aria-label={`${motion.title}，Mixkit 真人视频参考`} onPlay={() => { setPlaying(true); onPlaybackChange?.(true) }} onPause={() => { setPlaying(false); onPlaybackChange?.(false) }} onError={() => setFailed(true)}/>
    {!large && <div className="motion-video-actions"><span className="motion-real-badge">实拍 · {motion.duration}</span><div><button aria-label={`${playing ? '暂停视频' : '播放视频'}：${motion.title}`} onClick={() => { if (playing) { setUserPlayback('pause'); element.current?.pause() } else { setStarted(true); setUserPlayback('play'); void element.current?.play().catch(() => setPlaying(false)) } }}>{playing ? <Pause size={14}/> : <Play size={14}/>}</button>{onExpand && <button aria-label={`查看动作：${motion.title}`} onClick={onExpand}><Maximize2 size={14}/><span>查看引导</span></button>}</div></div>}
    {failed && <div className="motion-video-fallback"><p>视频暂时无法载入</p><a href={motion.sourceUrl} target="_blank" rel="noopener noreferrer">到原片页面观看 <ExternalLink size={13}/></a></div>}
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
    <div className="motion-detail-layout"><div><MotionVideo motion={motion} paused={!playing} onPlaybackChange={setPlaying} large/><div className="motion-detail-controls"><button onClick={() => setPlaying(!playing)}>{playing ? <Pause size={15}/> : <Play size={15}/>} {playing ? '暂停动作' : '播放动作'}</button><button className={saved ? 'is-saved' : ''} onClick={onSave}><Bookmark size={15} fill={saved ? 'currentColor' : 'none'}/>{saved ? '已加入现场清单' : '加入现场清单'}</button></div></div>
      <div className="motion-detail-copy"><p className="eyebrow">REAL FOOTAGE / CAMERA DIRECTION</p><h2 id="motion-detail-title">{motion.title}</h2><p className="motion-cue"><span>直接对人物说</span>“{motion.cue}”</p>
        <div className="motion-source-credit"><a href={motion.sourceUrl} target="_blank" rel="noopener noreferrer">Mixkit · 原片页面 <ExternalLink size={13}/></a><a href={motion.creatorUrl} target="_blank" rel="noopener noreferrer">@{motion.creator}</a><a href={motion.licenseUrl} target="_blank" rel="noopener noreferrer">Free License</a></div><p className="motion-source-title">{motion.sourceTitle} · {motion.duration}</p><p className="motion-watch"><strong>先观察</strong>{motion.watchFor}</p><dl><div><dt>复拍景别 / 焦段</dt><dd>{motion.framing} · {motion.lens}</dd></div><div><dt>机位 / 构图</dt><dd>{motion.angle}</dd></div><div><dt>摄影师怎么拍</dt><dd>{motion.camera}</dd></div><div><dt>避免的小问题</dt><dd>{motion.mistake}</dd></div></dl>
        <div className="motion-tags">{motion.environment.map(e => <span key={e}>{e}</span>)}<span>{motion.mood}</span></div>
        <p className="motion-detail-tip">以上指令、景别、焦段和机位是本网站的复拍建议，并非原作者的拍摄参数。焦段按全画幅参考，距离以实际构图为准。来源授权核对日期： {motion.checkedAt}。</p>
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
  const [limit, setLimit] = useState(() => [12, 24, 36, 48].includes(initial.current?.limit) ? initial.current.limit : 12)
  const [selected, setSelected] = useState<Motion | null>(null)
  useEffect(() => { localStorage.setItem(STORAGE, JSON.stringify({ category, environment, framing, query, savedOnly, limit })) }, [category, environment, framing, query, savedOnly, limit])
  const filterKey = `${category}|${environment}|${framing}|${query}|${savedOnly}`
  const previousFilter = useRef(filterKey)
  useEffect(() => { if (previousFilter.current !== filterKey) { setLimit(12); previousFilter.current = filterKey } }, [filterKey])
  const results = useMemo(() => motions.filter(m => (category === 'all' || m.category === category) && (!environment || m.environment.includes(environment)) && (!framing || m.framing === framing) && (!savedOnly || saved.includes(m.id)) && (!query.trim() || `${m.id} ${m.title} ${m.cue} ${m.mood} ${m.angle} ${m.lens} ${m.sourceTitle} ${m.creator} ${m.environment.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase()))), [category, environment, framing, query, savedOnly, saved])
  const toggle = (id: string) => setSaved(current => { const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id]; localStorage.setItem(SAVE_KEY, JSON.stringify(next)); return next })
  const reset = () => { setCategory('all'); setEnvironment(''); setFraming(''); setQuery(''); setSavedOnly(false) }
  return <section className="motion-library" id="motion-library" aria-labelledby="motion-library-title">
    <button className="motion-back" onClick={onBack}><ChevronLeft size={15}/> 导演知识库</button>
    <div className="motion-library-heading"><div><p className="eyebrow">DIRECTING TOOLKIT / REAL MOTION REFERENCES</p><h2 id="motion-library-title">人物动作与镜头引导库<span>从一个小动作，拍出自然的瞬间。</span></h2><p>选环境，找动作，把指令直接说给人物听。{motions.length} 段真人实拍视频，直接循环预览，再按复拍建议练习。</p></div><span className="motion-total">{motions.length}<small>真人视频 / 8 类</small></span></div>
    <div className="motion-category-tabs" role="group" aria-label="动作分类"><button aria-pressed={category === 'all'} onClick={() => setCategory('all')}>全部动作 <span>{motions.length}</span></button>{motionCategories.map(c => <button key={c.id} aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>{c.name}<span>{String(motions.filter(m => m.category === c.id).length).padStart(2, '0')}</span></button>)}</div>
    <div className="motion-toolbar"><label className="motion-search"><Search size={17}/><input aria-label="搜索动作" value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索：回头、裙摆、窗边、75mm…"/>{query && <button onClick={() => setQuery('')} aria-label="清空动作搜索"><X size={15}/></button>}</label><label className="motion-select"><span>环境</span><select aria-label="筛选环境" value={environment} onChange={e => setEnvironment(e.target.value)}><option value="">全部环境</option>{environments.map(e => <option key={e}>{e}</option>)}</select></label><label className="motion-select"><span>景别</span><select aria-label="筛选景别" value={framing} onChange={e => setFraming(e.target.value)}><option value="">全部景别</option>{['全身', '半身', '近景'].map(e => <option key={e}>{e}</option>)}</select></label></div>
    <div className="motion-results-bar"><p aria-live="polite">{results.length} 个动作 <span>· {savedOnly ? '我的现场清单' : '围绕一个真实的小任务，自然地完成它'}</span></p><div><button className={savedOnly ? 'is-saved' : ''} aria-pressed={savedOnly} onClick={() => setSavedOnly(!savedOnly)}><Bookmark size={15} fill={savedOnly ? 'currentColor' : 'none'}/>现场清单 {saved.length}</button><button onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? <Play size={15}/> : <Pause size={15}/>} {paused ? '播放全部' : '暂停全部'}</button></div></div>
    {results.length ? <><div className="motion-grid">{results.slice(0, limit).map(m => <article key={m.id} className="motion-card"><div className="motion-card-visual"><div className="motion-card-top"><span>{m.id} / {motionCategories.find(c => c.id === m.category)?.en}</span><button className={saved.includes(m.id) ? 'is-saved' : ''} onClick={() => toggle(m.id)} aria-label={`${saved.includes(m.id) ? '移出清单' : '加入清单'}：${m.title}`} aria-pressed={saved.includes(m.id)}><Bookmark size={16} fill={saved.includes(m.id) ? 'currentColor' : 'none'}/></button></div><MotionVideo motion={m} paused={paused || selected !== null} onExpand={() => setSelected(m)}/></div><div className="motion-card-copy"><div className="motion-card-meta"><span>复拍：{m.framing} · {m.lens}</span><span>{m.mood}</span></div><h3><button onClick={() => setSelected(m)}>{m.title}<ArrowRight size={15}/></button></h3><p>“{m.cue}”</p><div className="motion-card-bottom"><span>{m.environment.slice(0, 3).join(' / ')}</span>{saved.includes(m.id) && <span className="motion-saved-label"><Check size={12}/>已收藏</span>}</div><a className="motion-card-source" href={m.sourceUrl} target="_blank" rel="noopener noreferrer">Mixkit · @{m.creator}<ExternalLink size={11}/></a></div></article>)}</div>{limit < results.length && <div className="motion-load-more"><button onClick={() => setLimit(limit + 12)}>展开更多动作 <ArrowRight size={16}/></button><span>已显示 {Math.min(limit, results.length)} / {results.length}</span></div>}</> : <div className="motion-empty"><Search size={28}/><h3>{savedOnly && !saved.length ? '把想拍的动作加入清单' : '这组条件暂时没有动作'}</h3><p>{savedOnly && !saved.length ? '点卡片右上角的收藏，下次拍摄时可以直接找到。' : '试试切换环境、景别，或减少一个筛选条件。'}</p><button onClick={reset}><RotateCcw size={15}/>查看全部动作</button></div>}
    <p className="motion-library-note">真实视频用于观察人物动作、表情与节奏。视频来自 Mixkit 的 Free License 条目；每条均附原片、作者和授权链接。复拍建议由本网站整理，收藏保存在当前浏览器。</p>
    {selected && <MotionDetail motion={selected} saved={saved.includes(selected.id)} onSave={() => toggle(selected.id)} onClose={() => setSelected(null)} paused={paused}/>}
  </section>
}
