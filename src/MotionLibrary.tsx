import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Bookmark, Check, ChevronLeft, ExternalLink, Maximize2, Pause, Play, RotateCcw, Search, X } from 'lucide-react'
import { environments, motionCategories, motions } from './motionData'
import type { Motion, MotionCategory } from './motionData'
import './motionLibrary.css'
import MotionTagFilters from './MotionTagFilters'
import { cardMotionTags, matchesMotionSearch, matchesMotionTags, sanitizeTagSelection, tagGroups } from './motionTags'
import type { TagGroupId, TagSelection } from './motionTags'

const STORAGE = 'short-film-real-motion-library-v2'
const SAVE_KEY = 'short-film-real-motion-favorites-v2'
function readLocal(key: string) { try { return JSON.parse(localStorage.getItem(key) || 'null') } catch { return null } }

function MotionVideo({ motion, paused = false, large = false, onExpand, onPlaybackChange, language = 'zh' }: { motion: Motion; paused?: boolean; large?: boolean; onExpand?: () => void; onPlaybackChange?: (playing: boolean) => void; language?: 'zh' | 'en' }) {
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
    {!large && <div className="motion-video-actions"><span className="motion-real-badge">{language === 'en' ? 'Live action' : '实拍'} · {motion.duration}</span><div><button aria-label={language === 'en' ? (playing ? 'Pause video' : 'Play video') : `${playing ? '暂停视频' : '播放视频'}：${motion.title}`} onClick={() => { if (playing) { setUserPlayback('pause'); element.current?.pause() } else { setStarted(true); setUserPlayback('play'); void element.current?.play().catch(() => setPlaying(false)) } }}>{playing ? <Pause size={14}/> : <Play size={14}/>}</button>{onExpand && <button aria-label={language === 'en' ? 'View direction' : `查看动作：${motion.title}`} onClick={onExpand}><Maximize2 size={14}/><span>{language === 'en' ? 'View direction' : '查看引导'}</span></button>}</div></div>}
    {failed && <div className="motion-video-fallback"><p>{language === 'en' ? 'Video could not load' : '视频暂时无法载入'}</p><a href={motion.sourceUrl} target="_blank" rel="noopener noreferrer">{language === 'en' ? 'Open source video' : '到原片页面观看'} <ExternalLink size={13}/></a></div>}
  </div>
}

function MotionDetail({ motion, saved, onSave, onClose, paused, onTag }: { motion: Motion; saved: boolean; onSave: () => void; onClose: () => void; paused: boolean; onTag: (group: TagGroupId, value: string) => void }) {
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
        <section className="motion-detail-all-tags" aria-label="片段全部摄影标签"><h3>全部摄影标签 <span>{Object.values(motion.tags).flat().length}</span></h3>{tagGroups.filter(g => motion.tags[g.id].length).map(g => <div className="motion-detail-tag-row" key={g.id}><h4>{g.label}{g.kind === 'suggestion' && <small>建议</small>}</h4><div>{motion.tags[g.id].map(value => <button key={value} onClick={() => onTag(g.id, value)} aria-label={`按${g.label}查找：${value}`}>{value}</button>)}</div></div>)}</section>
        <p className="motion-detail-tip">以上指令、景别、焦段和机位是本网站的复拍建议，并非原作者的拍摄参数。焦段按全画幅参考，距离以实际构图为准。来源授权核对日期： {motion.checkedAt}。</p>
      </div>
    </div>
  </dialog>
}

export default function MotionLibrary({ onBack, language }: { onBack: () => void; language: 'zh' | 'en' }) {
  const environmentEn: Record<string, string> = { '树林': 'Forest', '海边': 'Seaside', '街头': 'Street', '室内': 'Interior', '草地': 'Field', '窗边': 'Window' }
  const framingEn: Record<string, string> = { '全身': 'Full body', '半身': 'Medium', '近景': 'Close-up' }
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
  const [tagSelection, setTagSelection] = useState<TagSelection>(() => sanitizeTagSelection(initial.current?.tagSelection, motions))
  const [activeTagGroup, setActiveTagGroup] = useState<TagGroupId>(() => tagGroups.some(g => g.id === initial.current?.activeTagGroup) ? initial.current.activeTagGroup : 'light')
  const [tagsOpen, setTagsOpen] = useState(() => initial.current?.tagsOpen !== false)
  useEffect(() => { localStorage.setItem(STORAGE, JSON.stringify({ category, environment, framing, query, savedOnly, limit, tagSelection, activeTagGroup, tagsOpen })) }, [category, environment, framing, query, savedOnly, limit, tagSelection, activeTagGroup, tagsOpen])
  const filterKey = `${category}|${environment}|${framing}|${query}|${savedOnly}|${JSON.stringify(tagSelection)}`
  const previousFilter = useRef(filterKey)
  useEffect(() => { if (previousFilter.current !== filterKey) { setLimit(12); previousFilter.current = filterKey } }, [filterKey])
  const baseResults = useMemo(() => motions.filter(m =>
    (category === 'all' || m.category === category) && (!environment || m.environment.includes(environment)) && (!framing || m.framing === framing) && (!savedOnly || saved.includes(m.id)) && matchesMotionSearch(m, query)
  ), [category, environment, framing, query, savedOnly, saved])
  const results = useMemo(() => baseResults.filter(m => matchesMotionTags(m, tagSelection)), [baseResults, tagSelection])
  const toggleTag = (group: TagGroupId, value: string) => setTagSelection(current => {
    const values = current[group] || []
    const next = values.includes(value) ? values.filter(v => v !== value) : [...values, value]
    const updated = { ...current }
    if (next.length) updated[group] = next
    else delete updated[group]
    return updated
  })
  const exploreTag = (group: TagGroupId, value: string) => {
    setTagSelection(current => ({ ...current, [group]: [...new Set([...(current[group] || []), value])] }))
    setActiveTagGroup(group); setTagsOpen(true); setSelected(null)
    requestAnimationFrame(() => document.getElementById('motion-tag-filters')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }
  const hasFilters = category !== 'all' || !!environment || !!framing || !!query || savedOnly || Object.keys(tagSelection).length > 0
  const toggle = (id: string) => setSaved(current => { const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id]; localStorage.setItem(SAVE_KEY, JSON.stringify(next)); return next })
  const reset = () => { setCategory('all'); setEnvironment(''); setFraming(''); setQuery(''); setSavedOnly(false); setTagSelection({}) }
  return <section className="motion-library" id="motion-library" aria-labelledby="motion-library-title">
    <button className="motion-back" onClick={onBack}><ChevronLeft size={15}/> {language === 'en' ? 'Directing knowledge base' : '导演知识库'}</button>
    <div className="motion-library-heading"><div><p className="eyebrow">DIRECTING TOOLKIT / REAL MOTION REFERENCES</p><h2 id="motion-library-title">{language === 'en' ? 'Subject Direction & Camera Guide' : '人物动作与镜头引导库'}<span>{language === 'en' ? 'Create a natural moment from one small action.' : '从一个小动作，拍出自然的瞬间。'}</span></h2><p>{language === 'en' ? 'Observe real movement, eyeline, and rhythm in context, then bring a clear playable direction to the set.' : '观察真实人物在具体环境中的动作、视线与节奏，再把可执行的引导带到现场。'}</p></div><span className="motion-total">{motions.length}<small>{language === 'en' ? 'scene references' : '场景动作参考'}</small></span></div>
    <div role="tabpanel" id="motion-scenes-panel">
    <div className="motion-category-tabs" role="group" aria-label={language === 'en' ? 'Action categories' : '动作分类'}><button aria-pressed={category === 'all'} onClick={() => setCategory('all')}>{language === 'en' ? 'All actions' : '全部动作'} <span>{motions.length}</span></button>{motionCategories.map(c => <button key={c.id} aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>{language === 'en' ? c.en : c.name}<span>{String(motions.filter(m => m.category === c.id).length).padStart(2, '0')}</span></button>)}</div>
    <div className="motion-toolbar"><label className="motion-search"><Search size={17}/><input aria-label={language === 'en' ? 'Search actions' : '搜索动作'} value={query} onChange={e => setQuery(e.target.value)} placeholder={language === 'en' ? 'Search: seaside backlight silhouette / 75mm…' : '搜索多个词：海边 逆光 背影 / 75mm…'}/>{query && <button onClick={() => setQuery('')} aria-label={language === 'en' ? 'Clear action search' : '清空动作搜索'}><X size={15}/></button>}</label><label className="motion-select"><span>{language === 'en' ? 'Environment' : '适用环境'}</span><select aria-label={language === 'en' ? 'Filter environment' : '筛选环境'} value={environment} onChange={e => setEnvironment(e.target.value)}><option value="">{language === 'en' ? 'All environments' : '全部环境'}</option>{environments.map(e => <option key={e} value={e}>{language === 'en' ? environmentEn[e] : e}</option>)}</select></label><label className="motion-select"><span>{language === 'en' ? 'Framing' : '复拍景别'}</span><select aria-label={language === 'en' ? 'Filter framing' : '筛选景别'} value={framing} onChange={e => setFraming(e.target.value)}><option value="">{language === 'en' ? 'All framing' : '全部景别'}</option>{['全身', '半身', '近景'].map(e => <option key={e} value={e}>{language === 'en' ? framingEn[e] : e}</option>)}</select></label></div>
    {language === 'zh' && <MotionTagFilters all={motions} base={baseResults} selection={tagSelection} active={activeTagGroup} open={tagsOpen} onActive={setActiveTagGroup} onOpen={() => setTagsOpen(!tagsOpen)} onToggle={toggleTag} onClear={() => setTagSelection({})}/>}
    <div className="motion-results-bar"><p aria-live="polite">{results.length} {language === 'en' ? 'actions' : '个动作'} <span>· {language === 'en' ? (savedOnly ? 'My shot list' : 'Complete one real task naturally') : (savedOnly ? '我的现场清单' : '围绕一个真实的小任务，自然地完成它')}</span></p><div>{hasFilters && <button onClick={reset}><RotateCcw size={14}/>{language === 'en' ? 'Clear filters' : '清空全部筛选'}</button>}<button className={savedOnly ? 'is-saved' : ''} aria-pressed={savedOnly} onClick={() => setSavedOnly(!savedOnly)}><Bookmark size={15} fill={savedOnly ? 'currentColor' : 'none'}/>{language === 'en' ? 'Shot list' : '现场清单'} {saved.length}</button><button onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? <Play size={15}/> : <Pause size={15}/>} {language === 'en' ? (paused ? 'Play all' : 'Pause all') : (paused ? '播放全部' : '暂停全部')}</button></div></div>
    {results.length ? <><div className="motion-grid">{results.slice(0, limit).map(m => {
      const categoryEn = motionCategories.find(c => c.id === m.category)?.en || 'MOTION'
      const title = language === 'en' ? `${categoryEn} · ${environmentEn[m.environment[0]] || 'Scene'}` : m.title
      return <article key={m.id} className="motion-card"><div className="motion-card-visual"><div className="motion-card-top"><span>{m.id} / {categoryEn}</span><button className={saved.includes(m.id) ? 'is-saved' : ''} onClick={() => toggle(m.id)} aria-label={language === 'en' ? (saved.includes(m.id) ? 'Remove from shot list' : 'Add to shot list') : `${saved.includes(m.id) ? '移出清单' : '加入清单'}：${m.title}`} aria-pressed={saved.includes(m.id)}><Bookmark size={16} fill={saved.includes(m.id) ? 'currentColor' : 'none'}/></button></div><MotionVideo motion={m} paused={paused || selected !== null} onExpand={language === 'zh' ? () => setSelected(m) : undefined} language={language}/></div><div className="motion-card-copy"><div className="motion-card-meta"><span>{language === 'en' ? 'Recreate' : '复拍'}：{language === 'en' ? framingEn[m.framing] : m.framing} · {m.lens}</span><span>{language === 'en' ? categoryEn : m.mood}</span></div><h3><button onClick={() => language === 'zh' && setSelected(m)}>{title}{language === 'zh' && <ArrowRight size={15}/>}</button></h3><p>“{language === 'en' ? 'Give the subject one simple task and record the complete action with room before and after.' : m.cue}”</p>{language === 'zh' ? <div className="motion-card-tag-list" aria-label={`${m.title}常用摄影标签`}>{cardMotionTags(m).map(tag => <button key={`${tag.group}:${tag.value}`} onClick={() => exploreTag(tag.group, tag.value)}>{tag.value}</button>)}<button className="motion-all-tags" onClick={() => setSelected(m)}>全部 {Object.values(m.tags).flat().length} 标签 <ArrowRight size={11}/></button></div> : <div className="motion-card-tag-list"><button>{categoryEn}</button><button>{framingEn[m.framing]}</button><button>{environmentEn[m.environment[0]]}</button></div>}<div className="motion-card-bottom"><span>{language === 'en' ? m.environment.slice(0, 3).map(e => environmentEn[e] || e).join(' / ') : m.environment.slice(0, 3).join(' / ')}</span>{saved.includes(m.id) && <span className="motion-saved-label"><Check size={12}/>{language === 'en' ? 'Saved' : '已收藏'}</span>}</div><a className="motion-card-source" href={m.sourceUrl} target="_blank" rel="noopener noreferrer">Mixkit · @{m.creator}<ExternalLink size={11}/></a></div></article>
    })}</div>{limit < results.length && <div className="motion-load-more"><button onClick={() => setLimit(limit + 12)}>{language === 'en' ? 'Load more actions' : '展开更多动作'} <ArrowRight size={16}/></button><span>{language === 'en' ? 'Showing' : '已显示'} {Math.min(limit, results.length)} / {results.length}</span></div>}</> : <div className="motion-empty"><Search size={28}/><h3>{language === 'en' ? (savedOnly && !saved.length ? 'Add actions to your shot list' : 'No actions match these filters') : (savedOnly && !saved.length ? '把想拍的动作加入清单' : '这组条件暂时没有动作')}</h3><p>{language === 'en' ? 'Try another environment or framing, or remove one filter.' : (savedOnly && !saved.length ? '点卡片右上角的收藏，下次拍摄时可以直接找到。' : '试试切换环境、景别，或减少一个筛选条件；已选标签可以逐项移除。')}</p><button onClick={reset}><RotateCcw size={15}/>{language === 'en' ? 'View all actions' : '查看全部动作'}</button></div>}
    <p className="motion-library-note">{language === 'en' ? 'Use these real videos to study movement, expression, and rhythm. Videos come from Mixkit Free License listings; each card links to the source, creator, and license. Reproduction notes are prepared by this site, and bookmarks stay in this browser.' : '真实视频用于观察人物动作、表情与节奏。视频来自 Mixkit 的 Free License 条目；每条均附原片、作者和授权链接。复拍建议由本网站整理，收藏保存在当前浏览器。'}</p>
    </div>
    {selected && <MotionDetail motion={selected} saved={saved.includes(selected.id)} onSave={() => toggle(selected.id)} onClose={() => setSelected(null)} paused={paused} onTag={exploreTag}/>}
  </section>
}
