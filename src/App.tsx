import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import { ArrowRight, Bookmark, Camera, ChevronLeft, Clapperboard, ExternalLink, LayoutGrid, Play, Search, X } from 'lucide-react'
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import TechniqueVisual from './TechniqueVisual'
import MotionLibrary from './MotionLibrary'
import CameraMovementLibrary from './CameraMovementLibrary'
import WorkspaceToggle from './WorkspaceToggle'
import Workspace from './Workspace'
import { useWorkspace } from './workspaceStore'
import { motions } from './motionData'
import { sheets, stages } from './data'
import { filmReferences } from './filmReferences'
import sundayStoryboard from './assets/sunday-storyboard.jpg'
import type { FilmReference } from './filmReferences'
import type { CheatSheet, StageId } from './types'

const FAVORITES_KEY = 'short-film-guide-favorites'
const VIEW_STATE_KEY = 'short-film-guide-view-state-v2'
const SCROLL_POSITION_KEY = 'short-film-guide-scroll-position-v2'
const LANGUAGE_KEY = 'short-film-guide-language'
type Language = 'zh' | 'en'
type ViewId = StageId | 'samples' | 'all' | 'saved' | 'directing' | 'motions'
type ConceptArea = 'technique' | 'template'
const filmCollections: { id: FilmReference['collection']; title: string; subtitle: string }[] = [
  { id: 'everyday', title: '生活切片', subtitle: '从起居、家人和城市日常里找到电影感' },
  { id: 'womenNature', title: '女性与自然', subtitle: '海洋、旷野与人物的亲密关系' },
  { id: 'fashion', title: '时尚影像', subtitle: '用服装、身体与场景创造电影感' },
  { id: 'exploration', title: '探索与叙事', subtitle: '从环境与行动中寻找故事' },
]
const filmCollectionsEn: Record<FilmReference['collection'], { title: string; subtitle: string }> = {
  everyday: { title: 'Everyday Cinema', subtitle: 'Find cinematic moments in homes, families, and city life' },
  womenNature: { title: 'Women & Nature', subtitle: 'Intimate relationships between people, oceans, and open landscapes' },
  fashion: { title: 'Fashion Films', subtitle: 'Build cinematic images with wardrobe, movement, and place' },
  exploration: { title: 'Exploration & Story', subtitle: 'Discover stories through environment and action' },
}

const storyLevels = [
  { title: 'Film', label: '完整电影', description: '一部完整的视听作品', stage: '创意与故事', group: 'story' },
  { title: 'Act', label: '幕', description: '故事的主要发展阶段', stage: '创意与故事', group: 'story' },
  { title: 'Sequence', label: '段落', description: '围绕阶段性目标组织的一组场景', stage: '创意与故事', group: 'story' },
  { title: 'Scene', label: '场景', description: '特定时间、空间或戏剧行动的单位', stage: '拍摄准备', group: 'production' },
  { title: 'Shot', label: '镜头', description: '一次连续呈现的画面', stage: '拍摄准备 · 正式拍摄', group: 'production' },
  { title: 'Frame', label: '画格', description: '动态影像中的单幅画面', stage: '正式拍摄 · 剪辑与后期', group: 'image' },
]
const storyLevelsEn = [
  { title: 'Film', label: 'Complete film', description: 'A complete audiovisual work', stage: 'Concept & Story' },
  { title: 'Act', label: 'Act', description: 'A major stage in the story', stage: 'Concept & Story' },
  { title: 'Sequence', label: 'Sequence', description: 'Scenes organized around one intermediate goal', stage: 'Concept & Story' },
  { title: 'Scene', label: 'Scene', description: 'A unit of time, place, or dramatic action', stage: 'Plan & Prepare' },
  { title: 'Shot', label: 'Shot', description: 'One continuous image', stage: 'Prepare · Shoot' },
  { title: 'Frame', label: 'Frame', description: 'A single image within moving footage', stage: 'Shoot · Edit' },
]

const directingKnowledge = [
  { number: '01', title: '创作意图', subtitle: 'Concept', points: ['一句话说清作品想让观众感受什么', '明确人物开始与结束的细微变化', '为每个场景写下它必须完成的叙事任务'] },
  { number: '02', title: '场面与镜头', subtitle: 'Prepare', points: ['先决定人物在空间中的行动，再决定镜头位置', '让景别、机位和运动服务于观看关系', '每场至少准备一个环境镜头、动作镜头与情绪镜头'] },
  { number: '03', title: '现场判断', subtitle: 'Shoot', points: ['确认表演或真实动作是否自然且可用', '优先拍到故事所需动作，再寻找意外和细节', '每次调整前只给一个清楚、可执行的指令'] },
  { number: '04', title: '节奏与声音', subtitle: 'Edit', points: ['用镜头长度控制观众停留与呼吸', '让动作、视线或声音带领转场', '删掉好看但没有推动体验的画面'] },
  { number: '05', title: '完成与复盘', subtitle: 'Publish', points: ['检查第一眼是否传达出作品的基调', '确认字幕、声音与画面没有分散注意力', '记录下次要保留与要修正的一个决定'] },
]
const directingKnowledgeEn = [
  { title: 'Creative Intent', points: ['State in one sentence what the audience should feel', 'Define the subject’s subtle change from beginning to end', 'Give every scene one narrative job'] },
  { title: 'Staging & Camera', points: ['Decide the subject’s action before placing the camera', 'Make shot size, angle, and movement serve the viewing relationship', 'Prepare an environment, action, and emotion shot for each scene'] },
  { title: 'On-set Decisions', points: ['Check whether the performance or real action feels usable', 'Capture the required action before searching for details', 'Give one clear, playable direction at a time'] },
  { title: 'Rhythm & Sound', points: ['Use shot length to control attention and breathing', 'Let action, eyeline, or sound motivate transitions', 'Remove attractive images that do not move the experience forward'] },
  { title: 'Finish & Review', points: ['Check whether the opening communicates the tone', 'Make sure subtitles, sound, and image do not compete', 'Record one decision to keep and one to improve next time'] },
]
const stageEnglish: Record<StageId, { subtitle: string; tasks: string[] }> = {
  concept: { subtitle: 'Decide what to film, why it matters, and how the story will be told', tasks: ['Choose the form and narrative approach', 'Define the central question and audience experience', 'Write the story outline'] },
  prepare: { subtitle: 'Design scenes, visual rules, shots, and shooting order', tasks: ['Establish visual rules', 'Break scenes into shots', 'Confirm sound and equipment needs'] },
  shoot: { subtitle: 'Execute the shot list and record image, action, and sound', tasks: ['Check performance and composition', 'Capture editable coverage', 'Log usable takes and production sound'] },
  edit: { subtitle: 'Complete story edit, sound, color, subtitles, and export', tasks: ['Make the story clear first', 'Unify picture, sound, and rhythm', 'Check subtitles and export the master'] },
  publish: { subtitle: 'Release the work, review creative choices, and archive the project', tasks: ['Check release files and copy', 'Record feedback and creative lessons', 'Archive media and project files'] },
}

const sundayShots = [
  { number: '01', title: '清晨 / 起床', position: '0% 0%' },
  { number: '02', title: '森林 / 行走', position: '50% 0%' },
  { number: '03', title: '细节 / 触摸', position: '100% 0%' },
  { number: '04', title: '海边 / 停留', position: '0% 100%' },
  { number: '05', title: '情绪 / 近景', position: '50% 100%' },
  { number: '06', title: '黄昏 / 结束', position: '100% 100%' },
]

function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]') }
    catch { return [] }
  })

  const toggle = (id: string) => setFavorites((current) => {
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
    return next
  })

  return { favorites, toggle }
}

function Card({ sheet, saved, onToggle, onOpen, language }: { sheet: CheatSheet; saved: boolean; onToggle: () => void; onOpen: () => void; language: Language }) {
  return (
    <article className="sheet-card group">
      <button className="visual-button" onClick={onOpen} aria-label={language === 'en' ? `View ${sheet.titleEn}` : `查看 ${sheet.title}`}>
        <TechniqueVisual kind={sheet.visual} accent={sheet.accent} compact />
        <span className="card-index">{sheet.category}</span>
      </button>
      <div className="card-copy">
        <div>
          <p className="eyebrow">{sheet.titleEn}</p>
          <h3>{language === 'en' ? sheet.titleEn : sheet.title}</h3>
        </div>
        <button className={`save-button ${saved ? 'saved' : ''}`} onClick={onToggle} aria-label={language === 'en' ? (saved ? 'Remove bookmark' : 'Bookmark') : (saved ? '取消收藏' : '收藏')}>
          <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <p className="summary">{language === 'en' ? `A practical field guide to ${sheet.titleEn.toLowerCase()}.` : sheet.summary}</p>
      <button className="read-more" onClick={onOpen}>{language === 'en' ? 'Open sheet' : '打开卡片'} <ArrowRight size={16} /></button>
      <WorkspaceToggle itemKey={`sheet:${sheet.id}`} language={language} />
    </article>
  )
}

function StoryStructure({ language }: { language: Language }) {
  const levels = language === 'en' ? storyLevels.map((level, index) => ({ ...level, ...storyLevelsEn[index] })) : storyLevels
  return <section className="story-structure" aria-labelledby="story-structure-title">
    <div className="story-structure-heading">
      <div><p className="eyebrow">STORY ARCHITECTURE / 06 LEVELS</p><h1 id="story-structure-title">{language === 'en' ? 'The Narrative Layers of Film' : '电影的叙事层级'}</h1><p>{language === 'en' ? 'Move from the intention of the complete short film down to each individual frame. Every layer connects to the next step in this guide.' : '从完整短片的意图，逐步收束到每一个画面。每一层都对应网站中的下一步工作。'}</p></div>
      <div className="story-legend" aria-label={language === 'en' ? 'Layer categories' : '层级类别说明'}><span className="story">{language === 'en' ? 'Story' : '故事'}</span><span className="production">{language === 'en' ? 'Production' : '制作'}</span><span className="image">{language === 'en' ? 'Image' : '画面'}</span></div>
    </div>
    <div className="story-structure-flow">
      {levels.map((level, index) => <div className="story-level" key={level.title} style={{ '--level': index } as React.CSSProperties}>
        <article className={`story-node ${level.group}`}><div className="story-node-main"><span className="story-index">{String(index + 1).padStart(2, '0')}</span><div><span className="story-label">{level.label}</span><h2>{level.title}</h2></div></div><div className="story-node-detail"><p>{level.description}</p><span>{level.stage}</span></div></article>
        {index < storyLevels.length - 1 && <span className="story-connector" aria-hidden="true">↓</span>}
      </div>)}
    </div>
  </section>
}

function DirectingKnowledgeBase({ onOpenMotions, language }: { onOpenMotions: () => void; language: Language }) {
  return <section className="directing-knowledge" id="directing-knowledge" aria-labelledby="directing-knowledge-title">
    <div className="directing-knowledge-heading"><div><p className="eyebrow">DIRECTING KNOWLEDGE BASE</p><h3 id="directing-knowledge-title">{language === 'en' ? 'Five Directing Decisions' : '导演的五个判断点'}</h3><p>{language === 'en' ? 'At every writing, shooting, and editing step, ask whether the choice serves the same creative intent.' : '用这一页在写、拍、剪的每一步确认：这个选择有没有服务于同一个创作意图？'}</p></div><span>05 AREAS</span></div>
    <button className="motion-entry" style={{ width: '100%' }} onClick={onOpenMotions}><span><span className="motion-entry-label">DIRECTING TOOLKIT / REAL VIDEO REFERENCES</span><strong>{language === 'en' ? 'Subject Direction & Camera Guide' : '人物动作与镜头引导库'}</strong><small>{language === 'en' ? `${motions.length} scene-based action references · Filter by environment, framing, and camera tags` : `${motions.length} 段场景动作参考 · 按环境、景别与摄影标签筛选`}</small></span><ArrowRight size={22}/></button>
    <div className="directing-knowledge-grid">{directingKnowledge.map((area, index) => <section key={area.number}>
      <span>{area.number} / {area.subtitle}</span><h4>{language === 'en' ? directingKnowledgeEn[index].title : area.title}</h4><ul>{(language === 'en' ? directingKnowledgeEn[index].points : area.points).map((point) => <li key={point}>{point}</li>)}</ul>
    </section>)}</div>
  </section>
}

function FilmCard({ film, playing, onPlay, onStop, language }: { film: FilmReference; playing: boolean; onPlay: () => void; onStop: () => void; language: Language }) {
  const separator = film.embedUrl.includes('?') ? '&' : '?'
  const playerUrl = `${film.embedUrl}${separator}autoplay=1&playsinline=1${film.id === 'body' ? '' : '&rel=0'}`

  return <article className={`film-card ${playing ? 'playing' : ''}`}>
    {playing ? <div className="film-card-art film-card-player">{film.embedType === 'video' ? <video src={film.embedUrl} title={`播放 ${film.title}`} controls autoPlay playsInline /> : <iframe src={playerUrl} title={`播放 ${film.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />}</div> :
      <button className="film-card-play" onClick={onPlay} aria-label={`播放 ${film.title}`}>
        <span className="film-card-art"><img className="film-thumbnail" src={film.thumbnailUrl} alt={`${film.title} 的视频预览画面`} loading="lazy" /><span className="film-duration">{film.duration}</span><span className="film-play-icon"><Play size={25} fill="currentColor" /></span></span>
      </button>}
    <div className="film-card-body">
      <p className="eyebrow">{film.source} / {film.year} / {film.category}</p>
      <h4>{film.title}{language === 'zh' && <small>{film.titleZh}</small>}</h4>
      <p className="film-synopsis">{language === 'en' ? 'Study how the film turns everyday action, wardrobe, environment, light, and sound into a coherent cinematic experience.' : film.synopsis}</p>
      <p className="film-watch-for"><strong>{language === 'en' ? 'Watch for' : '观看重点'}</strong>{language === 'en' ? 'Notice shot size changes, natural movement, transitions, and the relationship between the subject and the location.' : film.watchFor}</p>
      <button className="film-link" onClick={playing ? onStop : onPlay}>{language === 'en' ? (playing ? 'Stop' : 'Play here') : (playing ? '停止播放' : '在此播放')} {playing ? <X size={15} /> : <Play size={15} fill="currentColor" />}</button>
      <a className="film-source-link" href={film.url} target="_blank" rel="noopener noreferrer">{language === 'en' ? 'Official page' : '官方页面'} <ExternalLink size={14} /></a>
      <WorkspaceToggle itemKey={`film:${film.id}`} language={language} />
    </div>
  </article>
}

function StarterTemplate({ language }: { language: Language }) {
  return <section className="starter-template" id="concept-content" role="tabpanel" aria-labelledby="concept-area-template">
    <div className="starter-template-heading">
      <div><p className="eyebrow">STARTER TEMPLATE / {language === 'en' ? 'READY TO USE' : '可直接套用'}</p><h3 id="starter-template-title">{language === 'en' ? 'One Sunday · A 2-minute short' : '《某个星期天》· 2 分钟短片'}</h3></div>
      <span>01 / FIRST FILM</span>
    </div>
    <p className="starter-template-lead">{language === 'en' ? 'A woman spends a day alone in a forest or by the sea. There is no dialogue or major plot; simply observe her relationship with the world around her.' : '一个女生独自去森林或海边度过一天。没有对白，也不需要宏大的情节，只观察她与周围世界的关系。'}</p>
    <div className="starter-template-fields" aria-label="创作简报模板">
      <p><span>{language === 'en' ? 'Subject' : '人物'}</span><strong>{language === 'en' ? 'One person alone' : '一个独处的人'}</strong></p>
      <p><span>{language === 'en' ? 'Time' : '时间'}</span><strong>{language === 'en' ? 'Within one day' : '一天之内'}</strong></p>
      <p><span>{language === 'en' ? 'Place' : '地点'}</span><strong>{language === 'en' ? 'Forest / Seaside' : '森林 / 海边'}</strong></p>
      <p><span>{language === 'en' ? 'Dialogue' : '对白'}</span><strong>{language === 'en' ? 'None' : '无'}</strong></p>
      <p className="starter-template-change"><span>{language === 'en' ? 'Subtle change' : '细微变化'}</span><strong>{language === 'en' ? 'From ________ to ________' : '从 ________ 到 ________'}</strong></p>
    </div>
    <div className="starter-shot-grid">
      {sundayShots.map((shot) => <figure key={shot.number} className="starter-shot">
        <div className="starter-shot-image" role="img" aria-label={shot.title} style={{ backgroundImage: `url(${sundayStoryboard})`, backgroundPosition: shot.position }} />
        <figcaption><span>{shot.number}</span>{shot.title}</figcaption>
      </figure>)}
    </div>
    <div className="starter-template-note"><strong>{language === 'en' ? 'Exercise' : '练习重点'}</strong><p>{language === 'en' ? 'Do not chase six beautiful shots first. Decide what subtle change happens between the beginning and end of her day. That decision is the start of directing and screenwriting.' : '先别追求六个漂亮镜头。决定她在这一天的开始与结束时，发生了什么细微变化——这就是导演和编剧思维的起点。'}</p></div>
  </section>
}

function Detail({ favorites, toggle, language }: { favorites: string[]; toggle: (id: string) => void; language: Language }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const base = useLocation().pathname.startsWith('/workspace') ? '/workspace' : ''
  const close = () => navigate(base || '/')
  const sheet = sheets.find((item) => item.id === id)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!sheet) return null
  const related = sheet.related.map((item) => sheets.find((candidate) => candidate.id === item)).filter(Boolean) as CheatSheet[]

  return (
    <div className="detail-backdrop" role="dialog" aria-modal="true" aria-label={sheet.title} onMouseDown={close}>
      <article className="detail-panel" onMouseDown={(event) => event.stopPropagation()}>
        <div className="detail-topbar">
          <button className="icon-button" onClick={close}><ChevronLeft size={20} /> {language === 'en' ? 'Back' : '返回'}</button>
          <button className={`favorite-pill ${favorites.includes(sheet.id) ? 'active' : ''}`} onClick={() => toggle(sheet.id)}>
            <Bookmark size={17} fill={favorites.includes(sheet.id) ? 'currentColor' : 'none'} />
            {language === 'en' ? (favorites.includes(sheet.id) ? 'Saved' : 'Save') : (favorites.includes(sheet.id) ? '已收藏' : '收藏')}
          </button>
        </div>
        <div className="detail-hero">
          <TechniqueVisual kind={sheet.visual} accent={sheet.accent} />
          <div>
            <p className="eyebrow">{sheet.category} · {sheet.titleEn}</p>
            <h2>{language === 'en' ? sheet.titleEn : sheet.title}</h2>
            <p className="detail-summary">{language === 'en' ? `A practical field guide to ${sheet.titleEn.toLowerCase()}.` : sheet.summary}</p>
            <div className="tag-row">{sheet.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </div>
        </div>
        <div className="detail-grid">
          <section><p className="section-number">01</p><h3>{language === 'en' ? 'What it solves' : '它解决什么'}</h3><ul>{(language === 'en' ? ['Clarifies the visual or storytelling decision', 'Gives the crew a shared reference'] : sheet.purpose).map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><p className="section-number">02</p><h3>{language === 'en' ? 'When to use it' : '什么时候使用'}</h3><ul>{(language === 'en' ? ['Use while planning the shot', 'Review before the relevant production stage'] : sheet.usage).map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><p className="section-number">03</p><h3>{language === 'en' ? 'How to do it' : '怎么做'}</h3><ol>{(language === 'en' ? ['Identify the intended audience effect', 'Choose one clear visual rule', 'Test it in a simple shot before expanding'] : sheet.steps).map((item) => <li key={item}>{item}</li>)}</ol></section>
          <section className="mistakes"><p className="section-number">04</p><h3>{language === 'en' ? 'Common mistakes' : '常见错误'}</h3><ul>{(language === 'en' ? ['Applying the technique without a story reason', 'Changing several variables at once'] : sheet.mistakes).map((item) => <li key={item}>{item}</li>)}</ul></section>
        </div>
        {related.length > 0 && <section className="related"><p className="eyebrow">RELATED SHEETS</p><h3>接着查看</h3><div>{related.map((item) => <button key={item.id} onClick={() => navigate(`${base}/sheet/${item.id}`)}>{item.title}<ArrowRight size={15} /></button>)}</div></section>}
      </article>
    </div>
  )
}

function Home({ favorites, toggle, language, setLanguage }: { favorites: string[]; toggle: (id: string) => void; language: Language; setLanguage: (language: Language) => void }) {
  const navigate = useNavigate()
  const requestedStage = (useLocation().state as { stage?: ViewId } | null)?.stage
  const [query, setQuery] = useState('')
  const [stage, setStage] = useState<ViewId>(() => {
    if (requestedStage) return requestedStage
    try {
      const saved = JSON.parse(sessionStorage.getItem(VIEW_STATE_KEY) || '{}')
      return saved.stage === 'samples' || saved.stage === 'all' || saved.stage === 'saved' || saved.stage === 'directing' || saved.stage === 'motions' || stages.some((item) => item.id === saved.stage) ? saved.stage : 'samples'
    } catch { return 'samples' }
  })
  const [conceptArea, setConceptArea] = useState<ConceptArea>(() => {
    try { return JSON.parse(sessionStorage.getItem(VIEW_STATE_KEY) || '{}').conceptArea === 'template' ? 'template' : 'technique' }
    catch { return 'technique' }
  })
  const [activeFilmId, setActiveFilmId] = useState<FilmReference['id'] | null>(null)
  const workspaceCount = useWorkspace().project.items.length

  useEffect(() => {
    sessionStorage.setItem(VIEW_STATE_KEY, JSON.stringify({ stage, conceptArea }))
  }, [stage, conceptArea])

  useLayoutEffect(() => {
    if (requestedStage) {
      const frame = window.requestAnimationFrame(() => document.getElementById('workflow-tabs')?.scrollIntoView({ block: 'start' }))
      return () => window.cancelAnimationFrame(frame)
    }
    const position = Number(sessionStorage.getItem(SCROLL_POSITION_KEY))
    if (!Number.isFinite(position) || position <= 0) return
    const restore = () => window.scrollTo({ top: position, left: 0, behavior: 'auto' })
    const frame = window.requestAnimationFrame(() => window.requestAnimationFrame(restore))
    const timer = window.setTimeout(restore, 250)
    window.addEventListener('load', restore, { once: true })
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      window.removeEventListener('load', restore)
    }
  }, [])

  useEffect(() => {
    const save = () => sessionStorage.setItem(SCROLL_POSITION_KEY, String(Math.round(window.scrollY)))
    window.addEventListener('scroll', save, { passive: true })
    window.addEventListener('pagehide', save)
    return () => {
      window.removeEventListener('scroll', save)
      window.removeEventListener('pagehide', save)
    }
  }, [])
  const fuse = useMemo(() => new Fuse(sheets, { keys: ['title', 'titleEn', 'summary', 'category', 'tags'], threshold: .34, ignoreLocation: true }), [])
  const results = useMemo(() => {
    let list = query.trim() ? fuse.search(query.trim()).map((result) => result.item) : sheets
    if (!query.trim() && stage === 'saved') list = list.filter((item) => favorites.includes(item.id))
    if (!query.trim() && stage !== 'all' && stage !== 'saved' && stage !== 'directing' && stage !== 'motions') list = list.filter((item) => item.stage === stage)
    return list
  }, [query, stage, favorites, fuse])

  const selectStage = (id: ViewId) => {
    if (id === 'concept' && stage !== 'concept') setConceptArea('technique')
    setStage(id)
    setActiveFilmId(null)
    setQuery('')
    window.requestAnimationFrame(() => document.getElementById(id === 'motions' ? 'motion-library' : id === 'all' || id === 'saved' ? 'library' : 'workflow-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const selectConceptArea = (area: ConceptArea) => {
    setConceptArea(area)
    setQuery('')
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => document.getElementById('concept-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' })))
  }

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'))
    const current = tabs.findIndex((tab) => tab === document.activeElement)
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
    tabs[next]?.focus()
    selectStage(next === 0 ? 'samples' : stages[next - 1].id)
  }

  return (
    <div className="app-shell">
      <div className="language-bar" role="group" aria-label="Language">
        <button aria-pressed={language === 'zh'} onClick={() => setLanguage('zh')}>中文</button>
        <button aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>English</button>
      </div>
      <main>
        <StoryStructure language={language} />
        <section className="workflow-panel" aria-label={language === 'en' ? 'Solo filmmaking workflow' : '单人短片制作流程'}>
          <button className={`directing-trigger ${stage === 'directing' || stage === 'motions' ? 'selected' : ''}`} onClick={() => selectStage('directing')} aria-current={stage === 'directing' || stage === 'motions' ? 'page' : undefined}>
            <span className="directing-trigger-icon"><Clapperboard size={21} strokeWidth={2.15} /></span><span><small>DIRECTING / 05 TOUCHPOINTS</small><strong>{language === 'en' ? 'Directing runs through the whole workflow' : '导演贯穿整个制作流程'}</strong><em>{language === 'en' ? 'Open the directing knowledge base' : '点击查看导演知识库'}</em></span><ArrowRight size={19} aria-hidden="true" />
          </button>
          <div className="workflow-tabs" id="workflow-tabs" role="tablist" aria-label="制作阶段" onKeyDown={handleTabKeyDown}>
            <button className={`workflow-tab sample-tab ${stage === 'samples' ? 'selected' : ''}`} id="tab-samples" role="tab" aria-controls="workflow-stage-panel" aria-selected={stage === 'samples'} tabIndex={stage === 'samples' || stage === 'all' || stage === 'saved' || stage === 'directing' || stage === 'motions' ? 0 : -1} onClick={() => selectStage('samples')} style={{ '--accent': '#d8ff42' } as React.CSSProperties}>
              <span className="workflow-tab-number">00</span><span className="workflow-tab-title">{language === 'en' ? 'Film References' : '样片'}</span><span className="workflow-tab-en">{language === 'en' ? 'Watch & Study' : 'Film References'}</span>
            </button>
            {stages.map((item) => <button className={`workflow-tab ${stage === item.id ? 'selected' : ''}`} key={item.id} id={`tab-${item.id}`} role="tab" aria-controls="workflow-stage-panel" aria-selected={stage === item.id} tabIndex={stage === item.id ? 0 : -1} onClick={() => selectStage(item.id)} style={{ '--accent': item.accent } as React.CSSProperties}>
              <span className="workflow-tab-number">{item.index}</span><span className="workflow-tab-title">{language === 'en' ? item.titleEn : item.title}</span><span className="workflow-tab-en">{language === 'en' ? 'Workflow stage' : item.titleEn}</span>
            </button>)}
          </div>
          {stage === 'motions' ? <MotionLibrary onBack={() => selectStage('directing')} language={language} /> : stage === 'directing' ? <DirectingKnowledgeBase onOpenMotions={() => selectStage('motions')} language={language} /> : stage === 'samples' ? <div className="workflow-stage-panel samples-panel" id="workflow-stage-panel" role="tabpanel" aria-labelledby="tab-samples" style={{ '--accent': '#d8ff42' } as React.CSSProperties}>
            <div className="samples-heading"><div><p className="eyebrow">WATCH & STUDY / {language === 'en' ? 'EVERYDAY × NATURE × FASHION' : '日常 × 自然 × 时尚'}</p><h3>{language === 'en' ? 'See first. Then shoot.' : '先看见，再开拍。'}</h3><p>{language === 'en' ? 'Preview real films directly in each card. Study how subject, everyday action, environment, and camera work together to tell a story.' : '预览真实影片画面，点击即可在卡片中播放。带着观察重点看人物、日常、环境与镜头如何一起讲故事。'}</p></div><span>{String(filmReferences.length).padStart(2, '0')} FILMS</span></div>
            {filmCollections.map((collection) => <section className="film-collection" key={collection.id} aria-labelledby={`film-collection-${collection.id}`}>
              <div className="film-collection-heading"><div><h4 id={`film-collection-${collection.id}`}>{language === 'en' ? filmCollectionsEn[collection.id].title : collection.title}</h4><p>{language === 'en' ? filmCollectionsEn[collection.id].subtitle : collection.subtitle}</p></div><span>{String(filmReferences.filter((film) => film.collection === collection.id).length).padStart(2, '0')}</span></div>
              <div className="film-grid">{filmReferences.filter((film) => film.collection === collection.id).map((film) => <FilmCard key={film.id} film={film} playing={activeFilmId === film.id} onPlay={() => setActiveFilmId(film.id)} onStop={() => setActiveFilmId(null)} language={language} />)}</div>
            </section>)}
            <p className="samples-note">{language === 'en' ? 'Thumbnails and players come from the publishing platforms. If playback is limited by region or browser settings, use the official page link on the card.' : '预览图与播放器来自影片发布平台。若播放受地区或浏览器设置限制，可使用卡片上的官方页面链接。'}</p>
          </div> : stage !== 'all' && stage !== 'saved' ? (() => { const item = stages.find((entry) => entry.id === stage)!; return <div className="workflow-stage-panel" id="workflow-stage-panel" role="tabpanel" aria-labelledby={`tab-${item.id}`} style={{ '--accent': item.accent } as React.CSSProperties}>
            <div className="workflow-stage-main"><span className="workflow-stage-number">{item.index} / 05</span><p className="eyebrow">{item.titleEn}</p><h3>{language === 'en' ? item.titleEn : item.title}</h3><p className="workflow-stage-description">{language === 'en' ? stageEnglish[item.id].subtitle : item.subtitle}</p><div className="workflow-stage-output"><span>{language === 'en' ? 'Main deliverable' : '本阶段交付物'}</span><strong>{language === 'en' ? item.outputEn : item.output}</strong><small>{language === 'en' ? item.output : item.outputEn}</small></div></div>
            <div className="workflow-stage-tasks"><p className="eyebrow">{language === 'en' ? 'TO DO IN THIS STAGE' : '这一阶段要做'}</p><ol>{(language === 'en' ? stageEnglish[item.id].tasks : item.tasks).map((task) => <li key={task}>{task}</li>)}</ol><button onClick={() => item.id === 'concept' ? selectConceptArea('technique') : document.getElementById('library')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>{language === 'en' ? 'View related sheets' : '查看相关卡片'} <ArrowRight size={16} /></button></div>
          </div> })() : <div className="workflow-stage-panel workflow-stage-all" id="workflow-stage-panel"><p>{language === 'en' ? 'Five stages, one clear deliverable at a time.' : '五个阶段，一份份完成主要交付物。'}</p><button onClick={() => selectStage('concept')}>{language === 'en' ? 'Start with Concept & Story' : '从创意与故事开始'} <ArrowRight size={16} /></button></div>}
          {stage === 'shoot' && <button className="motion-entry" onClick={() => selectStage('motions')}><span><span className="motion-entry-label">ON-SET QUICK ACCESS</span><strong>现场速查：人物动作与镜头引导</strong><small>{motions.length} 段场景参考 · 慢放观察，直接照着指令引导人物</small></span><ArrowRight size={22}/></button>}
          {stage === 'prepare' && <CameraMovementLibrary language={language} />}
          {stage === 'concept' && <section className="concept-area-selector" aria-label="创意与故事内容分区">
            <div><p className="eyebrow">CONCEPT & STORY AREAS</p><h3>{language === 'en' ? 'Choose your workspace' : '选择你的工作区'}</h3></div>
            <div className="concept-area-tabs" role="tablist" aria-label="创意与故事分区">
              <button id="concept-area-technique" role="tab" aria-controls="concept-content" aria-selected={conceptArea === 'technique'} className={conceptArea === 'technique' ? 'selected' : ''} onClick={() => selectConceptArea('technique')}>
                <span>01</span><strong>Technique<small>{language === 'en' ? 'Technical reference · 5 sheets' : '技术速查 · 5 张卡片'}</small></strong><ArrowRight size={18} />
              </button>
              <button id="concept-area-template" role="tab" aria-controls="concept-content" aria-selected={conceptArea === 'template'} className={conceptArea === 'template' ? 'selected' : ''} onClick={() => selectConceptArea('template')}>
                <span>02</span><strong>Template<small>{language === 'en' ? 'Ready-to-use short film exercise' : '可套用的短片练习'}</small></strong><ArrowRight size={18} />
              </button>
            </div>
          </section>}
          {stage === 'concept' && conceptArea === 'template' && <StarterTemplate language={language} />}
          <p className="workflow-note">{language === 'en' ? 'Combine steps for simple work; expand each stage for more complex projects.' : '简单作品可以合并步骤；复杂作品则在每阶段深入细化。'}</p>
        </section>

        {stage !== 'samples' && stage !== 'directing' && stage !== 'motions' && (stage !== 'concept' || conceptArea === 'technique') && <div id={stage === 'concept' ? 'concept-content' : undefined} role={stage === 'concept' ? 'tabpanel' : undefined} aria-labelledby={stage === 'concept' ? 'concept-area-technique' : undefined}><section className="search-zone">
          <label className="search-box"><Search size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={language === 'en' ? 'Search stages, shot size, camera movement, lighting, editing…' : '搜索阶段、景别、运镜、灯光、剪辑……'} />{query && <button onClick={() => setQuery('')} aria-label={language === 'en' ? 'Clear search' : '清空搜索'}><X size={18} /></button>}</label>
          <button className={`saved-filter ${stage === 'saved' ? 'active' : ''}`} onClick={() => selectStage(stage === 'saved' ? 'all' : 'saved')}><Bookmark size={18} fill={stage === 'saved' ? 'currentColor' : 'none'} />{language === 'en' ? 'Saved' : '收藏'} {favorites.length > 0 && <span>{favorites.length}</span>}</button>
        </section>

        <section className="library" id="library">
          <div className="library-heading">
            <div><p className="eyebrow">WORKFLOW CHEAT SHEETS</p><h2>{language === 'en' ? (query ? 'Search Results' : stage === 'all' ? 'Cheat Sheets for Every Step' : stage === 'saved' ? 'My Saved Sheets' : stage === 'concept' ? 'Concept & Story · Technique' : stages.find((item) => item.id === stage)?.titleEn) : (query ? '搜索结果' : stage === 'all' ? '每一步的速查卡片' : stage === 'saved' ? '我的收藏' : stage === 'concept' ? '创意与故事 · 技术' : stages.find((item) => item.id === stage)?.title)}</h2></div>
            <p>{results.length} {language === 'en' ? 'sheets' : '张卡片'}</p>
          </div>

          {stage === 'all' && !query ? stages.map((item) => {
            const stageSheets = results.filter((sheet) => sheet.stage === item.id)
            return <div className="stage-section" key={item.id}>
              <div className="stage-heading"><span style={{ background: item.accent }}>{item.index}</span><div><p className="stage-heading-en">{item.titleEn}</p><h3>{language === 'en' ? item.titleEn : item.title}</h3><p>{language === 'en' ? stageEnglish[item.id].subtitle : item.subtitle}</p></div><button onClick={() => selectStage(item.id)}>{language === 'en' ? 'View stage' : '查看此阶段'} <ArrowRight size={15} /></button></div>
              <div className="stage-deliverable"><span>{language === 'en' ? 'Main deliverable' : '本阶段交付物'}</span><strong>{language === 'en' ? item.outputEn : item.output}</strong><small>{language === 'en' ? item.output : item.outputEn}</small></div>
              <div className="card-grid">{stageSheets.map((sheet) => <Card key={sheet.id} sheet={sheet} saved={favorites.includes(sheet.id)} onToggle={() => toggle(sheet.id)} onOpen={() => navigate(`/sheet/${sheet.id}`)} language={language} />)}</div>
            </div>
          }) : results.length > 0 ? <>
            <div className="card-grid standalone">{results.map((sheet) => <Card key={sheet.id} sheet={sheet} saved={favorites.includes(sheet.id)} onToggle={() => toggle(sheet.id)} onOpen={() => navigate(`/sheet/${sheet.id}`)} language={language} />)}</div>
          </> : <div className="empty-state"><Search size={34} /><h3>{language === 'en' ? 'No matching sheets yet' : '还没有找到对应卡片'}</h3><p>{language === 'en' ? 'Try searching for “creative brief,” “shot size,” or “axis,” or switch to another stage.' : '试试搜索“创作简报”“景别”“轴线”，或切换到其他阶段。'}</p></div>}
        </section></div>}
      </main>

      <button className="ws-fab" onClick={() => navigate('/workspace')}><LayoutGrid size={16} /> {language === 'en' ? 'Workspace' : '工作台'} <span>{workspaceCount}</span></button>
      <footer><div><span className="brand-mark"><Camera size={18} /></span><strong>{language === 'en' ? 'Short Film Field Guide' : '短片现场手册'}</strong></div><p>{language === 'en' ? 'From concept to release · A five-stage solo filmmaking workflow' : '从创意到发布 · 五阶段单人短片流程'}</p></footer>
    </div>
  )
}

export default function App() {
  const { favorites, toggle } = useFavorites()
  const [language, setLanguageState] = useState<Language>(() => localStorage.getItem(LANGUAGE_KEY) === 'en' ? 'en' : 'zh')
  const setLanguage = (next: Language) => { localStorage.setItem(LANGUAGE_KEY, next); setLanguageState(next) }
  useEffect(() => { document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN' }, [language])
  return <>
    <Routes>
      <Route path="/workspace/*" element={<Workspace language={language} setLanguage={setLanguage} />} />
      <Route path="*" element={<Home favorites={favorites} toggle={toggle} language={language} setLanguage={setLanguage} />} />
    </Routes>
    <Routes>
      <Route path="/sheet/:id" element={<Detail favorites={favorites} toggle={toggle} language={language} />} />
      <Route path="/workspace/sheet/:id" element={<Detail favorites={favorites} toggle={toggle} language={language} />} />
      <Route path="*" element={null} />
    </Routes>
  </>
}
