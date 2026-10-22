import { useEffect, useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import { ArrowRight, Bookmark, Camera, Check, ChevronLeft, Menu, Search, Sparkles, X } from 'lucide-react'
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
  const [stage, setStage] = useState<StageId | 'all' | 'saved'>('all')
  const [menuOpen, setMenuOpen] = useState(false)
  const fuse = useMemo(() => new Fuse(sheets, { keys: ['title', 'titleEn', 'summary', 'category', 'tags'], threshold: .34, ignoreLocation: true }), [])
  const results = useMemo(() => {
    let list = query.trim() ? fuse.search(query.trim()).map((result) => result.item) : sheets
    if (stage === 'saved') list = list.filter((item) => favorites.includes(item.id))
    if (stage !== 'all' && stage !== 'saved') list = list.filter((item) => item.stage === stage)
    return list
  }, [query, stage, favorites, fuse])

  const selectStage = (id: StageId | 'all' | 'saved') => {
    setStage(id)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#/" aria-label="短片现场手册首页"><span className="brand-mark"><Camera size={20} /></span><span>短片现场手册<small>SHORT FILM FIELD GUIDE</small></span></a>
        <nav className="desktop-nav" aria-label="主导航">
          <button className={stage === 'all' ? 'active' : ''} onClick={() => selectStage('all')}>全部</button>
          {stages.map((item) => <button key={item.id} className={stage === item.id ? 'active' : ''} onClick={() => selectStage(item.id)}>{item.title}</button>)}
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="菜单"><Menu size={22} /></button>
      </header>

      {menuOpen && <div className="mobile-menu"><button onClick={() => selectStage('all')}>全部</button>{stages.map((item) => <button key={item.id} onClick={() => selectStage(item.id)}>{item.index} {item.title}</button>)}</div>}

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="hero-kicker"><Sparkles size={14} /> FROM STORY TO SCREEN</p>
            <h1>从想法到画面，<br /><em>每一步都有据可查。</em></h1>
            <p>为短片创作者准备的视觉现场手册。按制作阶段浏览，快速找到镜头、构图、灯光、收音与剪辑方法。</p>
          </div>
          <div className="hero-board" aria-hidden="true">
            <div className="board-frame"><span>SHOT 01</span><PersonScene /></div>
            <div className="board-note"><span>ANGLE</span><ArrowSketch /></div>
            <div className="board-note dark"><span>MOVEMENT</span><MovementSketch /></div>
          </div>
        </section>

        <section className="search-zone">
          <label className="search-box"><Search size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索景别、运镜、灯光、剪辑……" />{query && <button onClick={() => setQuery('')} aria-label="清空搜索"><X size={18} /></button>}</label>
          <button className={`saved-filter ${stage === 'saved' ? 'active' : ''}`} onClick={() => selectStage(stage === 'saved' ? 'all' : 'saved')}><Bookmark size={18} fill={stage === 'saved' ? 'currentColor' : 'none'} />收藏 {favorites.length > 0 && <span>{favorites.length}</span>}</button>
        </section>

        {!query && stage === 'all' && <section className="stage-strip" aria-label="制作流程">
          {stages.map((item, index) => <button key={item.id} onClick={() => selectStage(item.id)} style={{ '--accent': item.accent } as React.CSSProperties}>
            <span className="stage-index">{item.index}</span><span><strong>{item.title}</strong><small>{item.subtitle}</small></span>{index < stages.length - 1 && <ArrowRight className="stage-arrow" size={17} />}
          </button>)}
        </section>}

        <section className="library">
          <div className="library-heading">
            <div><p className="eyebrow">CHEAT SHEET LIBRARY</p><h2>{stage === 'all' ? '按流程浏览' : stage === 'saved' ? '我的收藏' : stages.find((item) => item.id === stage)?.title}</h2></div>
            <p>{results.length} 张卡片</p>
          </div>

          {stage === 'all' && !query ? stages.map((item) => {
            const stageSheets = results.filter((sheet) => sheet.stage === item.id)
            return <div className="stage-section" key={item.id}>
              <div className="stage-heading"><span style={{ background: item.accent }}>{item.index}</span><div><h3>{item.title}</h3><p>{item.subtitle}</p></div><button onClick={() => selectStage(item.id)}>查看此阶段 <ArrowRight size={15} /></button></div>
              <div className="card-grid">{stageSheets.map((sheet) => <Card key={sheet.id} sheet={sheet} saved={favorites.includes(sheet.id)} onToggle={() => toggle(sheet.id)} onOpen={() => navigate(`/sheet/${sheet.id}`)} />)}</div>
            </div>
          }) : results.length > 0 ? <div className="card-grid standalone">{results.map((sheet) => <Card key={sheet.id} sheet={sheet} saved={favorites.includes(sheet.id)} onToggle={() => toggle(sheet.id)} onOpen={() => navigate(`/sheet/${sheet.id}`)} />)}</div> : <div className="empty-state"><Search size={34} /><h3>还没有找到对应卡片</h3><p>试试搜索“推近”“近景”“轴线”或切换到其他阶段。</p></div>}
        </section>
      </main>

      <footer><div><span className="brand-mark"><Camera size={18} /></span><strong>短片现场手册</strong></div><p>为拍摄现场而设计 · 支持离线访问</p></footer>
    </div>
  )
}

function PersonScene() { return <svg viewBox="0 0 250 140"><path d="M0 106L72 52l50 43 56-74 72 85" fill="none" stroke="#1a1b18" strokeWidth="2" opacity=".25" /><circle cx="132" cy="53" r="13" fill="#171815" /><path d="M132 66v43M132 78l-22 18M132 78l22 18" stroke="#171815" strokeWidth="4" strokeLinecap="round" /><path d="M15 111h220" stroke="#171815" strokeWidth="3" /></svg> }
function ArrowSketch() { return <svg viewBox="0 0 130 80"><circle cx="24" cy="53" r="5" fill="#171815" /><path d="M32 50c22-31 49-35 76-15" fill="none" stroke="#171815" strokeWidth="2.5" strokeDasharray="5 4" /><path d="M103 27l8 9-12 2" fill="none" stroke="#171815" strokeWidth="2.5" /></svg> }
function MovementSketch() { return <svg viewBox="0 0 130 80"><rect x="51" y="43" width="24" height="17" rx="2" fill="none" stroke="#f5f2e9" strokeWidth="2" /><path d="M57 60l-8 15M69 60l8 15M63 60v15M75 47l12-5v17l-12-5" fill="none" stroke="#f5f2e9" strokeWidth="2" /><path d="M20 34h92M27 27l-8 7 8 7M105 27l8 7-8 7" fill="none" stroke="#d8ff42" strokeWidth="3" /></svg> }

export default function App() {
  const { favorites, toggle } = useFavorites()
  return <><Routes><Route path="*" element={<Home favorites={favorites} toggle={toggle} />} /></Routes><Routes><Route path="/sheet/:id" element={<Detail favorites={favorites} toggle={toggle} />} /><Route path="*" element={null} /></Routes></>
}
