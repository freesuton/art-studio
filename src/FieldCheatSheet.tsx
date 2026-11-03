import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, ExternalLink, Play, Search, X } from 'lucide-react'
import { fieldCheatSheet } from './fieldCheatSheetData'
import type { CheatItem, CheatPhotos, CheatRef } from './fieldCheatSheetData'
import { motions } from './motionData'
import { breakdowns } from './referenceBreakdowns'
import { filmReferences } from './filmReferences'
import MotionLibrary from './MotionLibrary'
import SetupDiagram from './SetupDiagram'
import ShotPlayer from './ShotPlayer'
import './fieldCheatSheet.css'

type Language = 'zh' | 'en'
export type GuideView = 'tips' | 'actions'

const astr = breakdowns.find((item) => item.id === 'astr-summer-2021')!
const astrFilm = filmReferences.find((film) => film.id === astr.filmId)!

function resolve(ref: CheatRef) {
  if ('clip' in ref) {
    const motion = motions.find((item) => item.id === `mixkit-${ref.clip}`)
    return motion && { kind: 'clip' as const, key: motion.id, motion }
  }
  const shot = astr.shots.find((item) => item.time === ref.shot)
  return shot && { kind: 'shot' as const, key: shot.time, shot }
}

// One cell of a section's photo sprite, as a background.
const photoStyle = (photos: CheatPhotos, cell: number): React.CSSProperties => ({
  backgroundImage: `url(${photos.src})`,
  backgroundSize: `${photos.cols * 100}% ${photos.rows * 100}%`,
  backgroundPosition: `${(cell % photos.cols) / (photos.cols - 1) * 100}% ${Math.floor(cell / photos.cols) / (photos.rows - 1) * 100}%`,
})

// A muted clip that plays only while it is on screen, so a tab of cards doesn't run every video at once.
function ClipPreview({ src, poster }: { src: string; poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const video = videoRef.current
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) video.play().catch(() => {}); else video.pause() }, { threshold: .6 })
    observer.observe(video)
    return () => observer.disconnect()
  }, [])
  return <video ref={videoRef} src={src} poster={poster} muted loop playsInline preload="none" />
}

// The top of a closed card: the tip's photo if it has one, else a live clip, else the ASTR shot,
// else the diagram. Clicking it opens the full panel.
function CardPreview({ item, accent, photos, language, onOpen }: { item: CheatItem; accent: string; photos?: CheatPhotos; language: Language; onOpen: () => void }) {
  const en = language === 'en'
  const refs = (item.refs ?? []).map(resolve).filter((ref) => ref !== undefined)
  if (item.photo !== undefined && photos) return <button className="field-card-preview photo" onClick={onOpen} aria-label={en ? `Open ${item.title.en}` : `打开${item.title.zh}`}>
    <span className="field-card-photo" style={photoStyle(photos, item.photo)} />
    {refs.length > 0 && <span className="field-card-badge">{en ? `+ ${refs.length} live clip` : `+ ${refs.length} 段实拍`}</span>}
  </button>
  const ref = refs.find((entry) => entry.kind === 'clip') ?? refs[0]
  if (!ref && !item.diagram) return null
  return <button className={`field-card-preview${ref ? '' : ' diagram'}`} onClick={onOpen} aria-label={en ? `Open ${item.title.en}` : `打开${item.title.zh}`}>
    {!ref ? <SetupDiagram kind={item.diagram!} accent={accent} lens={item.lens} language={language} />
      : ref.kind === 'clip' ? <ClipPreview src={ref.motion.videoUrl} poster={ref.motion.poster} />
      : <><img src={astrFilm.thumbnailUrl} alt="" loading="lazy" /><span className="field-card-play"><Play size={18} fill="currentColor" /></span></>}
    {ref && <span className="field-card-badge">{ref.kind === 'clip' ? (en ? 'Live action' : '实拍参考') : `ASTR ${ref.shot.time}`}{refs.length > 1 && ` · ${refs.length}`}</span>}
  </button>
}

// The diagram and reference videos for one tip, opened under it.
function SetupPanel({ item, accent, photos, language }: { item: CheatItem; accent: string; photos?: CheatPhotos; language: Language }) {
  const en = language === 'en'
  const refs = (item.refs ?? []).map(resolve).filter((ref) => ref !== undefined)
  const [active, setActive] = useState(0)
  const ref = refs[active]
  return <div className="field-setup">
    {item.photo !== undefined && photos && <figure className="field-setup-photo">
      <div className="field-setup-photo-image" role="img" aria-label={item.title[language]} style={photoStyle(photos, item.photo)} />
      <figcaption>{en ? 'Illustration' : '图解'}</figcaption>
    </figure>}
    {item.diagram && <figure className="field-setup-diagram">
      <SetupDiagram kind={item.diagram} accent={accent} lens={item.lens} language={language} />
      <figcaption>{en ? 'Diagram' : '示意图'}</figcaption>
    </figure>}
    {ref && <figure className="field-setup-video">
      {ref.kind === 'clip'
        ? <video key={ref.key} className="field-setup-clip" src={ref.motion.videoUrl} poster={ref.motion.poster} controls muted loop playsInline autoPlay controlsList="nodownload" />
        : <ShotPlayer key={ref.key} embedUrl={astrFilm.embedUrl} start={ref.shot.start} end={ref.shot.end} title={`${astrFilm.title} ${ref.shot.time}`} />}
      <figcaption>
        {refs.length > 1 && <span className="field-setup-tabs">{refs.map((entry, index) => <button key={entry.key} aria-pressed={index === active} onClick={() => setActive(index)} aria-label={en ? `Reference ${index + 1}` : `参考 ${index + 1}`}>{index + 1}</button>)}</span>}
        {ref.kind === 'clip'
          ? <span>{en ? `Live action · ${ref.motion.sourceTitle}` : `实拍参考 · ${ref.motion.title}`} <a href={ref.motion.sourceUrl} target="_blank" rel="noopener noreferrer">Mixkit · {ref.motion.creator} <ExternalLink size={11} /></a></span>
          : <span>ASTR Summer 2021 · {ref.shot.time} · {ref.shot[language]}</span>}
      </figcaption>
    </figure>}
  </div>
}

// The on-set guide for outdoor fashion video: tips by category, and the real action clips.
// Tip search matches both languages across every category, so "ND", "逆光" or "85mm" all work.
export default function FieldCheatSheet({ language, view, onViewChange }: { language: Language; view: GuideView; onViewChange: (view: GuideView) => void }) {
  const en = language === 'en'
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState(fieldCheatSheet[0].id)
  const [open, setOpen] = useState<string | null>(null)
  const needle = query.trim().toLowerCase()
  const sections = useMemo(() => {
    if (!needle) return fieldCheatSheet.filter((section) => section.id === tab)
    const matches = (...texts: string[]) => texts.some((text) => text.toLowerCase().includes(needle))
    return fieldCheatSheet
      .map((section) => matches(section.title.zh, section.title.en) ? section : { ...section, items: section.items.filter((item) => matches(item.title.zh, item.title.en, item.body.zh, item.body.en, item.why?.zh ?? '', item.why?.en ?? '')) })
      .filter((section) => section.items.length > 0)
  }, [needle, tab])
  const total = fieldCheatSheet.reduce((sum, section) => sum + section.items.length, 0)
  const count = sections.reduce((sum, section) => sum + section.items.length, 0)
  const selectTab = (id: string) => { setTab(id); setOpen(null) }

  return <section className="field-sheet" id="field-sheet" aria-labelledby="field-sheet-title">
    <div className="field-sheet-heading">
      <div>
        <p className="eyebrow">ON-SET GUIDE / OUTDOOR FASHION</p>
        <h3 id="field-sheet-title">{en ? 'Outdoor fashion shoot, on set' : '户外女性时尚拍摄现场指南'}</h3>
        <p>{en ? 'Tips for composition, posing, light, settings and styling, plus real action clips with a line to say to the model. Search for what you need on set.' : '构图、姿势、光线、参数和造型的技巧，加上可以照着引导模特的真实动作视频。现场需要什么，直接搜。'}</p>
      </div>
    </div>

    <div className="field-guide-switch" role="tablist" aria-label={en ? 'Guide sections' : '指南内容'}>
      <button id="guide-tab-tips" role="tab" aria-controls="guide-panel" aria-selected={view === 'tips'} onClick={() => onViewChange('tips')}>
        <strong>{en ? 'Tips' : '技巧速查'}</strong><small>{total} {en ? 'tips · diagrams' : '条 · 示意图'}</small>
      </button>
      <button id="guide-tab-actions" role="tab" aria-controls="guide-panel" aria-selected={view === 'actions'} onClick={() => onViewChange('actions')}>
        <strong>{en ? 'Actions' : '动作参考'}</strong><small>{motions.length} {en ? 'real clips · direction lines' : '段实拍 · 引导指令'}</small>
      </button>
    </div>

    <div id="guide-panel" role="tabpanel" aria-labelledby={`guide-tab-${view}`}>
    {view === 'actions' ? <MotionLibrary language={language} /> : <>
    <label className="field-sheet-search">
      <Search size={18} />
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={en ? 'Search all tips: backlight, ND, 85mm, hands, crop…' : '搜索全部：逆光、ND、85mm、手、构图……'} />
      {query && <button onClick={() => setQuery('')} aria-label={en ? 'Clear search' : '清空搜索'}><X size={16} /></button>}
    </label>

    {needle ? <p className="field-sheet-results">{count > 0 ? (en ? `${count} tips match "${query.trim()}"` : `找到 ${count} 条"${query.trim()}"`) : (en ? `Nothing matches "${query.trim()}". Try another word.` : `没有找到"${query.trim()}"，换个词试试。`)}</p>
      : <div className="field-sheet-tabs" role="tablist" aria-label={en ? 'Categories' : '分类'}>
        {fieldCheatSheet.map((section) => <button key={section.id} role="tab" aria-selected={tab === section.id} onClick={() => selectTab(section.id)} style={{ '--accent': section.accent } as React.CSSProperties}>
          <span aria-hidden="true" />{section.title[language]}<small>{section.items.length}</small>
        </button>)}
      </div>}

    {sections.map((section) => <section key={section.id} className="field-sheet-section" role={needle ? undefined : 'tabpanel'} style={{ '--accent': section.accent } as React.CSSProperties}>
      <header><h4>{section.title[language]}</h4><small>{section.hint[language]}</small></header>
      <div className="field-sheet-grid">
        {section.items.map((item) => { const key = `${section.id}:${item.title.en}`; const hasSetup = item.photo !== undefined || !!item.diagram || !!item.refs?.length; const isOpen = open === key
          return <article key={item.title.en} className={isOpen ? 'open' : undefined}>
            {!isOpen && <CardPreview item={item} accent={section.accent} photos={section.photos} language={language} onOpen={() => setOpen(key)} />}
            <h5>{item.title[language]}</h5><p>{item.body[language]}</p>{item.why && <p className="field-why"><b>{en ? 'Why it works' : '为什么有感觉'}</b>{item.why[language]}</p>}
            {hasSetup && <button className="field-setup-toggle" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : key)}>
              {[item.photo !== undefined && (en ? 'Illustration' : '图解'), item.diagram && (en ? 'Diagram' : '示意图'), item.refs?.length && (en ? `Reference video${item.refs.length > 1 ? ` ×${item.refs.length}` : ''}` : `参考视频${item.refs.length > 1 ? ` ×${item.refs.length}` : ''}`)].filter(Boolean).join(' · ')}
              <ChevronDown size={13} />
            </button>}
            {isOpen && <SetupPanel item={item} accent={section.accent} photos={section.photos} language={language} />}
          </article> })}
      </div>
      {section.footer && <aside className="field-sheet-footer">
        <h5>{section.footer.title[language]}</h5>
        <ul>{section.footer.points.map((point) => <li key={point.en}>{point[language]}</li>)}</ul>
        <p className="field-sheet-footer-label">{en ? 'Lenses' : '推荐焦段'}</p>
        <div className="field-sheet-lenses">{section.footer.lenses.map((lens) => <span key={lens.mm}><b>{lens.mm}</b>{lens.use[language]}</span>)}</div>
        <p className="field-sheet-footer-tip"><b>{en ? 'On set' : '拍摄提示'}</b>{section.footer.tip[language]}</p>
      </aside>}
    </section>)}
    </>}
    </div>
  </section>
}
