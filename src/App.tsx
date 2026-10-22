import { useEffect, useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import { ArrowRight, Bookmark, Camera, ChevronLeft, Search, X } from 'lucide-react'
import { Route, Routes, useNavigate, useParams } from 'react-router-dom'
import TechniqueVisual from './TechniqueVisual'
import { sheets, stages } from './data'
import type { CheatSheet, StageId } from './types'

const FAVORITES_KEY = 'short-film-guide-favorites'

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
  const [stage, setStage] = useState<StageId | 'all' | 'saved'>('concept')
  const fuse = useMemo(() => new Fuse(sheets, { keys: ['title', 'titleEn', 'summary', 'category', 'tags'], threshold: .34, ignoreLocation: true }), [])
  const results = useMemo(() => {
    let list = query.trim() ? fuse.search(query.trim()).map((result) => result.item) : sheets
    if (!query.trim() && stage === 'saved') list = list.filter((item) => favorites.includes(item.id))
    if (!query.trim() && stage !== 'all' && stage !== 'saved') list = list.filter((item) => item.stage === stage)
    return list
  }, [query, stage, favorites, fuse])

  const selectStage = (id: StageId | 'all' | 'saved') => {
    setStage(id)
    setQuery('')
    window.requestAnimationFrame(() => document.getElementById(id === 'all' || id === 'saved' ? 'library' : 'workflow-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'))
    const current = tabs.findIndex((tab) => tab === document.activeElement)
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
    tabs[next]?.focus()
    selectStage(stages[next].id)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#/" aria-label="短片现场手册首页"><span className="brand-mark"><Camera size={20} /></span><span>短片现场手册<small>SHORT FILM FIELD GUIDE</small></span></a>
        <button className="header-action" onClick={() => selectStage('all')}>全部速查卡 <ArrowRight size={16} /></button>
      </header>

      <main>
        <section className="hero" id="workflow">
          <div className="hero-copy">
            <p className="hero-kicker">SOLO FILMMAKING WORKFLOW</p>
            <h1>一部短片，<br /><em>五步完成。</em></h1>
            <p>从创意到发布，每一步都围绕一份主要交付物展开。横向切换阶段，查看对应任务与视觉技术速查卡片。</p>
          </div>
          <div className="hero-aside" aria-hidden="true"><span>01—05</span><p>IDEA<br />TO<br />SCREEN</p><div className="hero-aside-line" /></div>
        </section>

        <section className="workflow-panel" aria-label="单人短片制作流程">
          <div className="workflow-intro"><div><p className="eyebrow">ONE-PERSON FILM PRODUCTION SYSTEM</p><h2>Solo Filmmaking Workflow</h2><p>每一阶段只产生一份主要交付物，完成后进入下一阶段。</p></div><span>05 STAGES</span></div>
          <p className="workflow-swipe-hint">左右滑动切换阶段 <ArrowRight size={14} /></p>
          <div className="workflow-tabs" id="workflow-tabs" role="tablist" aria-label="制作阶段" onKeyDown={handleTabKeyDown}>
            {stages.map((item) => <button className={`workflow-tab ${stage === item.id ? 'selected' : ''}`} key={item.id} id={`tab-${item.id}`} role="tab" aria-controls="workflow-stage-panel" aria-selected={stage === item.id} tabIndex={stage === item.id || ((stage === 'all' || stage === 'saved') && item.id === 'concept') ? 0 : -1} onClick={() => selectStage(item.id)} style={{ '--accent': item.accent } as React.CSSProperties}>
              <span className="workflow-tab-number">{item.index}</span><span className="workflow-tab-title">{item.title}</span><span className="workflow-tab-en">{item.titleEn}</span>
            </button>)}
          </div>
          {stage !== 'all' && stage !== 'saved' ? (() => { const item = stages.find((entry) => entry.id === stage)!; return <div className="workflow-stage-panel" id="workflow-stage-panel" role="tabpanel" aria-labelledby={`tab-${item.id}`} style={{ '--accent': item.accent } as React.CSSProperties}>
            <div className="workflow-stage-main"><span className="workflow-stage-number">{item.index} / 05</span><p className="eyebrow">{item.titleEn}</p><h3>{item.title}</h3><p className="workflow-stage-description">{item.subtitle}</p><div className="workflow-stage-output"><span>本阶段交付物</span><strong>{item.output}</strong><small>{item.outputEn}</small></div></div>
            <div className="workflow-stage-tasks"><p className="eyebrow">这一阶段要做</p><ol>{item.tasks.map((task) => <li key={task}>{task}</li>)}</ol><button onClick={() => document.getElementById('library')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>查看相关卡片 <ArrowRight size={16} /></button></div>
          </div> })() : <div className="workflow-stage-panel workflow-stage-all" id="workflow-stage-panel"><p>五个阶段，一份份完成主要交付物。</p><button onClick={() => selectStage('concept')}>从创意与故事开始 <ArrowRight size={16} /></button></div>}
          <p className="workflow-note">简单作品可以合并步骤；复杂作品则在每阶段深入细化。</p>
        </section>

        <section className="search-zone">
          <label className="search-box"><Search size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索阶段、景别、运镜、灯光、剪辑……" />{query && <button onClick={() => setQuery('')} aria-label="清空搜索"><X size={18} /></button>}</label>
          <button className={`saved-filter ${stage === 'saved' ? 'active' : ''}`} onClick={() => selectStage(stage === 'saved' ? 'all' : 'saved')}><Bookmark size={18} fill={stage === 'saved' ? 'currentColor' : 'none'} />收藏 {favorites.length > 0 && <span>{favorites.length}</span>}</button>
        </section>

        <section className="library" id="library">
          <div className="library-heading">
            <div><p className="eyebrow">WORKFLOW CHEAT SHEETS</p><h2>{query ? '搜索结果' : stage === 'all' ? '每一步的速查卡片' : stage === 'saved' ? '我的收藏' : stages.find((item) => item.id === stage)?.title}</h2></div>
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
        </section>
      </main>

      <footer><div><span className="brand-mark"><Camera size={18} /></span><strong>短片现场手册</strong></div><p>从创意到发布 · 五阶段单人短片流程</p></footer>
    </div>
  )
}

export default function App() {
  const { favorites, toggle } = useFavorites()
  return <><Routes><Route path="*" element={<Home favorites={favorites} toggle={toggle} />} /></Routes><Routes><Route path="/sheet/:id" element={<Detail favorites={favorites} toggle={toggle} />} /><Route path="*" element={null} /></Routes></>
}
