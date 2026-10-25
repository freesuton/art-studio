import { useEffect, useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import { ArrowRight, Bookmark, Camera, ChevronLeft, ExternalLink, Play, Search, X } from 'lucide-react'
import { Route, Routes, useNavigate, useParams } from 'react-router-dom'
import TechniqueVisual from './TechniqueVisual'
import { sheets, stages } from './data'
import { filmReferences } from './filmReferences'
import sundayStoryboard from './assets/sunday-storyboard.jpg'
import type { FilmReference } from './filmReferences'
import type { CheatSheet, StageId } from './types'

const FAVORITES_KEY = 'short-film-guide-favorites'
type ViewId = StageId | 'samples' | 'all' | 'saved'
type ConceptArea = 'technique' | 'template'
const filmCollections: { id: FilmReference['collection']; title: string; subtitle: string }[] = [
  { id: 'everyday', title: '生活切片', subtitle: '从起居、家人和城市日常里找到电影感' },
  { id: 'womenNature', title: '女性与自然', subtitle: '海洋、旷野与人物的亲密关系' },
  { id: 'fashion', title: '时尚影像', subtitle: '用服装、身体与场景创造电影感' },
  { id: 'exploration', title: '探索与叙事', subtitle: '从环境与行动中寻找故事' },
]

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

function Card({ sheet, saved, onToggle, onOpen }: { sheet: CheatSheet; saved: boolean; onToggle: () => void; onOpen: () => void }) {
  return (
    <article className="sheet-card group">
      <button className="visual-button" onClick={onOpen} aria-label={`查看 ${sheet.title}`}>
        <TechniqueVisual kind={sheet.visual} accent={sheet.accent} compact />
        <span className="card-index">{sheet.category}</span>
      </button>
      <div className="card-copy">
        <div>
          <p className="eyebrow">{sheet.titleEn}</p>
          <h3>{sheet.title}</h3>
        </div>
        <button className={`save-button ${saved ? 'saved' : ''}`} onClick={onToggle} aria-label={saved ? '取消收藏' : '收藏'}>
          <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <p className="summary">{sheet.summary}</p>
      <button className="read-more" onClick={onOpen}>打开卡片 <ArrowRight size={16} /></button>
    </article>
  )
}

function FilmCard({ film, playing, onPlay, onStop }: { film: FilmReference; playing: boolean; onPlay: () => void; onStop: () => void }) {
  const separator = film.embedUrl.includes('?') ? '&' : '?'
  const playerUrl = `${film.embedUrl}${separator}autoplay=1&playsinline=1${film.id === 'body' ? '' : '&rel=0'}`

  return <article className={`film-card ${playing ? 'playing' : ''}`}>
    {playing ? <div className="film-card-art film-card-player">{film.embedType === 'video' ? <video src={film.embedUrl} title={`播放 ${film.title}`} controls autoPlay playsInline /> : <iframe src={playerUrl} title={`播放 ${film.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />}</div> :
      <button className="film-card-play" onClick={onPlay} aria-label={`播放 ${film.title}`}>
        <span className="film-card-art"><img className="film-thumbnail" src={film.thumbnailUrl} alt={`${film.title} 的视频预览画面`} loading="lazy" /><span className="film-duration">{film.duration}</span><span className="film-play-icon"><Play size={25} fill="currentColor" /></span></span>
      </button>}
    <div className="film-card-body">
      <p className="eyebrow">{film.source} / {film.year} / {film.category}</p>
      <h4>{film.title}<small>{film.titleZh}</small></h4>
      <p className="film-synopsis">{film.synopsis}</p>
      <p className="film-watch-for"><strong>观看重点</strong>{film.watchFor}</p>
      <button className="film-link" onClick={playing ? onStop : onPlay}>{playing ? '停止播放' : '在此播放'} {playing ? <X size={15} /> : <Play size={15} fill="currentColor" />}</button>
      <a className="film-source-link" href={film.url} target="_blank" rel="noopener noreferrer">官方页面 <ExternalLink size={14} /></a>
    </div>
  </article>
}

function StarterTemplate() {
  return <section className="starter-template" id="concept-content" role="tabpanel" aria-labelledby="concept-area-template">
    <div className="starter-template-heading">
      <div><p className="eyebrow">STARTER TEMPLATE / 可直接套用</p><h3 id="starter-template-title">《某个星期天》· 2 分钟短片</h3></div>
      <span>01 / FIRST FILM</span>
    </div>
    <p className="starter-template-lead">一个女生独自去森林或海边度过一天。没有对白，也不需要宏大的情节，只观察她与周围世界的关系。</p>
    <div className="starter-template-fields" aria-label="创作简报模板">
      <p><span>人物</span><strong>一个独处的人</strong></p>
      <p><span>时间</span><strong>一天之内</strong></p>
      <p><span>地点</span><strong>森林 / 海边</strong></p>
      <p><span>对白</span><strong>无</strong></p>
      <p className="starter-template-change"><span>细微变化</span><strong>从 ________ 到 ________</strong></p>
    </div>
    <div className="starter-shot-grid">
      {sundayShots.map((shot) => <figure key={shot.number} className="starter-shot">
        <div className="starter-shot-image" role="img" aria-label={shot.title} style={{ backgroundImage: `url(${sundayStoryboard})`, backgroundPosition: shot.position }} />
        <figcaption><span>{shot.number}</span>{shot.title}</figcaption>
      </figure>)}
    </div>
    <div className="starter-template-note"><strong>练习重点</strong><p>先别追求六个漂亮镜头。决定她在这一天的开始与结束时，发生了什么细微变化——这就是导演和编剧思维的起点。</p></div>
  </section>
}

function Detail({ favorites, toggle }: { favorites: string[]; toggle: (id: string) => void }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const sheet = sheets.find((item) => item.id === id)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!sheet) return null
  const related = sheet.related.map((item) => sheets.find((candidate) => candidate.id === item)).filter(Boolean) as CheatSheet[]

  return (
    <div className="detail-backdrop" role="dialog" aria-modal="true" aria-label={sheet.title} onMouseDown={() => navigate('/')}>
      <article className="detail-panel" onMouseDown={(event) => event.stopPropagation()}>
        <div className="detail-topbar">
          <button className="icon-button" onClick={() => navigate('/')}><ChevronLeft size={20} /> 返回</button>
          <button className={`favorite-pill ${favorites.includes(sheet.id) ? 'active' : ''}`} onClick={() => toggle(sheet.id)}>
            <Bookmark size={17} fill={favorites.includes(sheet.id) ? 'currentColor' : 'none'} />
            {favorites.includes(sheet.id) ? '已收藏' : '收藏'}
          </button>
        </div>
        <div className="detail-hero">
          <TechniqueVisual kind={sheet.visual} accent={sheet.accent} />
          <div>
            <p className="eyebrow">{sheet.category} · {sheet.titleEn}</p>
            <h2>{sheet.title}</h2>
            <p className="detail-summary">{sheet.summary}</p>
            <div className="tag-row">{sheet.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </div>
        </div>
        <div className="detail-grid">
          <section><p className="section-number">01</p><h3>它解决什么</h3><ul>{sheet.purpose.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><p className="section-number">02</p><h3>什么时候使用</h3><ul>{sheet.usage.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><p className="section-number">03</p><h3>怎么做</h3><ol>{sheet.steps.map((item) => <li key={item}>{item}</li>)}</ol></section>
          <section className="mistakes"><p className="section-number">04</p><h3>常见错误</h3><ul>{sheet.mistakes.map((item) => <li key={item}>{item}</li>)}</ul></section>
        </div>
        {related.length > 0 && <section className="related"><p className="eyebrow">RELATED SHEETS</p><h3>接着查看</h3><div>{related.map((item) => <button key={item.id} onClick={() => navigate(`/sheet/${item.id}`)}>{item.title}<ArrowRight size={15} /></button>)}</div></section>}
      </article>
    </div>
  )
}

function Home({ favorites, toggle }: { favorites: string[]; toggle: (id: string) => void }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [stage, setStage] = useState<ViewId>('samples')
  const [conceptArea, setConceptArea] = useState<ConceptArea>('technique')
  const [activeFilmId, setActiveFilmId] = useState<FilmReference['id'] | null>(null)
  const fuse = useMemo(() => new Fuse(sheets, { keys: ['title', 'titleEn', 'summary', 'category', 'tags'], threshold: .34, ignoreLocation: true }), [])
  const results = useMemo(() => {
    let list = query.trim() ? fuse.search(query.trim()).map((result) => result.item) : sheets
    if (!query.trim() && stage === 'saved') list = list.filter((item) => favorites.includes(item.id))
    if (!query.trim() && stage !== 'all' && stage !== 'saved') list = list.filter((item) => item.stage === stage)
    return list
  }, [query, stage, favorites, fuse])

  const selectStage = (id: ViewId) => {
    if (id === 'concept' && stage !== 'concept') setConceptArea('technique')
    setStage(id)
    setActiveFilmId(null)
    setQuery('')
    window.requestAnimationFrame(() => document.getElementById(id === 'all' || id === 'saved' ? 'library' : 'workflow-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
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
      <header className="topbar">
        <a className="brand" href="#/" aria-label="短片现场手册首页"><span className="brand-mark"><Camera size={20} /></span><span>短片现场手册<small>SHORT FILM FIELD GUIDE</small></span></a>
        <button className="header-action" onClick={() => selectStage('all')}>全部速查卡 <ArrowRight size={16} /></button>
      </header>

      <main>
        <section className="workflow-panel" aria-label="单人短片制作流程">
          <div className="workflow-intro"><div><p className="eyebrow">ONE-PERSON FILM PRODUCTION SYSTEM</p><h2>Solo Filmmaking Workflow</h2><p>先看样片寻找方向，再按五个阶段完成自己的短片。</p></div><span>FILMS + 05 STAGES</span></div>
          <p className="workflow-swipe-hint">左右滑动切换阶段 <ArrowRight size={14} /></p>
          <div className="workflow-tabs" id="workflow-tabs" role="tablist" aria-label="制作阶段" onKeyDown={handleTabKeyDown}>
            <button className={`workflow-tab sample-tab ${stage === 'samples' ? 'selected' : ''}`} id="tab-samples" role="tab" aria-controls="workflow-stage-panel" aria-selected={stage === 'samples'} tabIndex={stage === 'samples' || stage === 'all' || stage === 'saved' ? 0 : -1} onClick={() => selectStage('samples')} style={{ '--accent': '#d8ff42' } as React.CSSProperties}>
              <span className="workflow-tab-number">00</span><span className="workflow-tab-title">样片</span><span className="workflow-tab-en">Film References</span>
            </button>
            {stages.map((item) => <button className={`workflow-tab ${stage === item.id ? 'selected' : ''}`} key={item.id} id={`tab-${item.id}`} role="tab" aria-controls="workflow-stage-panel" aria-selected={stage === item.id} tabIndex={stage === item.id ? 0 : -1} onClick={() => selectStage(item.id)} style={{ '--accent': item.accent } as React.CSSProperties}>
              <span className="workflow-tab-number">{item.index}</span><span className="workflow-tab-title">{item.title}</span><span className="workflow-tab-en">{item.titleEn}</span>
            </button>)}
          </div>
          {stage === 'samples' ? <div className="workflow-stage-panel samples-panel" id="workflow-stage-panel" role="tabpanel" aria-labelledby="tab-samples" style={{ '--accent': '#d8ff42' } as React.CSSProperties}>
            <div className="samples-heading"><div><p className="eyebrow">WATCH & STUDY / 日常 × 自然 × 时尚</p><h3>先看见，再开拍。</h3><p>预览真实影片画面，点击即可在卡片中播放。带着观察重点看人物、日常、环境与镜头如何一起讲故事。</p></div><span>{String(filmReferences.length).padStart(2, '0')} FILMS</span></div>
            {filmCollections.map((collection) => <section className="film-collection" key={collection.id} aria-labelledby={`film-collection-${collection.id}`}>
              <div className="film-collection-heading"><div><h4 id={`film-collection-${collection.id}`}>{collection.title}</h4><p>{collection.subtitle}</p></div><span>{String(filmReferences.filter((film) => film.collection === collection.id).length).padStart(2, '0')}</span></div>
              <div className="film-grid">{filmReferences.filter((film) => film.collection === collection.id).map((film) => <FilmCard key={film.id} film={film} playing={activeFilmId === film.id} onPlay={() => setActiveFilmId(film.id)} onStop={() => setActiveFilmId(null)} />)}</div>
            </section>)}
            <p className="samples-note">预览图与播放器来自影片发布平台。若播放受地区或浏览器设置限制，可使用卡片上的官方页面链接。</p>
          </div> : stage !== 'all' && stage !== 'saved' ? (() => { const item = stages.find((entry) => entry.id === stage)!; return <div className="workflow-stage-panel" id="workflow-stage-panel" role="tabpanel" aria-labelledby={`tab-${item.id}`} style={{ '--accent': item.accent } as React.CSSProperties}>
            <div className="workflow-stage-main"><span className="workflow-stage-number">{item.index} / 05</span><p className="eyebrow">{item.titleEn}</p><h3>{item.title}</h3><p className="workflow-stage-description">{item.subtitle}</p><div className="workflow-stage-output"><span>本阶段交付物</span><strong>{item.output}</strong><small>{item.outputEn}</small></div></div>
            <div className="workflow-stage-tasks"><p className="eyebrow">这一阶段要做</p><ol>{item.tasks.map((task) => <li key={task}>{task}</li>)}</ol><button onClick={() => item.id === 'concept' ? selectConceptArea('technique') : document.getElementById('library')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>查看相关卡片 <ArrowRight size={16} /></button></div>
          </div> })() : <div className="workflow-stage-panel workflow-stage-all" id="workflow-stage-panel"><p>五个阶段，一份份完成主要交付物。</p><button onClick={() => selectStage('concept')}>从创意与故事开始 <ArrowRight size={16} /></button></div>}
          {stage === 'concept' && <section className="concept-area-selector" aria-label="创意与故事内容分区">
            <div><p className="eyebrow">CONCEPT & STORY AREAS</p><h3>选择你的工作区</h3></div>
            <div className="concept-area-tabs" role="tablist" aria-label="创意与故事分区">
              <button id="concept-area-technique" role="tab" aria-controls="concept-content" aria-selected={conceptArea === 'technique'} className={conceptArea === 'technique' ? 'selected' : ''} onClick={() => selectConceptArea('technique')}>
                <span>01</span><strong>Technique<small>技术速查 · 5 张卡片</small></strong><ArrowRight size={18} />
              </button>
              <button id="concept-area-template" role="tab" aria-controls="concept-content" aria-selected={conceptArea === 'template'} className={conceptArea === 'template' ? 'selected' : ''} onClick={() => selectConceptArea('template')}>
                <span>02</span><strong>Template<small>可套用的短片练习</small></strong><ArrowRight size={18} />
              </button>
            </div>
          </section>}
          {stage === 'concept' && conceptArea === 'template' && <StarterTemplate />}
          <p className="workflow-note">简单作品可以合并步骤；复杂作品则在每阶段深入细化。</p>
        </section>

        {stage !== 'samples' && (stage !== 'concept' || conceptArea === 'technique') && <div id={stage === 'concept' ? 'concept-content' : undefined} role={stage === 'concept' ? 'tabpanel' : undefined} aria-labelledby={stage === 'concept' ? 'concept-area-technique' : undefined}><section className="search-zone">
          <label className="search-box"><Search size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索阶段、景别、运镜、灯光、剪辑……" />{query && <button onClick={() => setQuery('')} aria-label="清空搜索"><X size={18} /></button>}</label>
          <button className={`saved-filter ${stage === 'saved' ? 'active' : ''}`} onClick={() => selectStage(stage === 'saved' ? 'all' : 'saved')}><Bookmark size={18} fill={stage === 'saved' ? 'currentColor' : 'none'} />收藏 {favorites.length > 0 && <span>{favorites.length}</span>}</button>
        </section>

        <section className="library" id="library">
          <div className="library-heading">
            <div><p className="eyebrow">WORKFLOW CHEAT SHEETS</p><h2>{query ? '搜索结果' : stage === 'all' ? '每一步的速查卡片' : stage === 'saved' ? '我的收藏' : stage === 'concept' ? '创意与故事 · 技术' : stages.find((item) => item.id === stage)?.title}</h2></div>
            <p>{results.length} 张卡片</p>
          </div>

          {stage === 'all' && !query ? stages.map((item) => {
            const stageSheets = results.filter((sheet) => sheet.stage === item.id)
            return <div className="stage-section" key={item.id}>
              <div className="stage-heading"><span style={{ background: item.accent }}>{item.index}</span><div><p className="stage-heading-en">{item.titleEn}</p><h3>{item.title}</h3><p>{item.subtitle}</p></div><button onClick={() => selectStage(item.id)}>查看此阶段 <ArrowRight size={15} /></button></div>
              <div className="stage-deliverable"><span>本阶段交付物</span><strong>{item.output}</strong><small>{item.outputEn}</small></div>
              <div className="card-grid">{stageSheets.map((sheet) => <Card key={sheet.id} sheet={sheet} saved={favorites.includes(sheet.id)} onToggle={() => toggle(sheet.id)} onOpen={() => navigate(`/sheet/${sheet.id}`)} />)}</div>
            </div>
          }) : results.length > 0 ? <>
            <div className="card-grid standalone">{results.map((sheet) => <Card key={sheet.id} sheet={sheet} saved={favorites.includes(sheet.id)} onToggle={() => toggle(sheet.id)} onOpen={() => navigate(`/sheet/${sheet.id}`)} />)}</div>
          </> : <div className="empty-state"><Search size={34} /><h3>还没有找到对应卡片</h3><p>试试搜索“创作简报”“景别”“轴线”，或切换到其他阶段。</p></div>}
        </section></div>}
      </main>

      <footer><div><span className="brand-mark"><Camera size={18} /></span><strong>短片现场手册</strong></div><p>从创意到发布 · 五阶段单人短片流程</p></footer>
    </div>
  )
}

export default function App() {
  const { favorites, toggle } = useFavorites()
  return <><Routes><Route path="*" element={<Home favorites={favorites} toggle={toggle} />} /></Routes><Routes><Route path="/sheet/:id" element={<Detail favorites={favorites} toggle={toggle} />} /><Route path="*" element={null} /></Routes></>
}
