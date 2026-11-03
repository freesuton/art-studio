import { useMemo, useState } from 'react'
import { ChevronDown, ExternalLink, Search, X } from 'lucide-react'
import { fieldCheatSheet } from './fieldCheatSheetData'
import type { CheatItem, CheatRef } from './fieldCheatSheetData'
import { motions } from './motionData'
import { breakdowns } from './referenceBreakdowns'
import { filmReferences } from './filmReferences'
import SetupDiagram from './SetupDiagram'
import ShotPlayer from './ShotPlayer'
import './fieldCheatSheet.css'

type Language = 'zh' | 'en'

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

// The diagram and reference videos for one tip, opened under it.
function SetupPanel({ item, accent, language }: { item: CheatItem; accent: string; language: Language }) {
  const en = language === 'en'
  const refs = (item.refs ?? []).map(resolve).filter((ref) => ref !== undefined)
  const [active, setActive] = useState(0)
  const ref = refs[active]
  return <div className="field-setup">
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

// Searchable on-set cheat sheet for outdoor fashion video. One category shows at a time;
// search matches both languages across every category, so "ND", "逆光" or "85mm" all work.
export default function FieldCheatSheet({ language }: { language: Language }) {
  const en = language === 'en'
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState(fieldCheatSheet[0].id)
  const [open, setOpen] = useState<string | null>(null)
  const needle = query.trim().toLowerCase()
  const sections = useMemo(() => {
    if (!needle) return fieldCheatSheet.filter((section) => section.id === tab)
    const matches = (...texts: string[]) => texts.some((text) => text.toLowerCase().includes(needle))
    return fieldCheatSheet
      .map((section) => matches(section.title.zh, section.title.en) ? section : { ...section, items: section.items.filter((item) => matches(item.title.zh, item.title.en, item.body.zh, item.body.en)) })
      .filter((section) => section.items.length > 0)
  }, [needle, tab])
  const total = fieldCheatSheet.reduce((sum, section) => sum + section.items.length, 0)
  const count = sections.reduce((sum, section) => sum + section.items.length, 0)
  const selectTab = (id: string) => { setTab(id); setOpen(null) }

  return <section className="field-sheet" id="field-sheet" aria-labelledby="field-sheet-title">
    <div className="field-sheet-heading">
      <div>
        <p className="eyebrow">FIELD CHEAT SHEET / OUTDOOR FASHION</p>
        <h3 id="field-sheet-title">{en ? 'Outdoor fashion shoot, at a glance' : '户外女性时尚拍摄速查'}</h3>
        <p>{en ? 'Composition, posing, light, settings and styling for shooting a female model outdoors. Pick a category, or search for what you need on set.' : '户外拍女性模特时的构图、姿势、光线、参数和造型。选一个分类看，或者现场直接搜。'}</p>
      </div>
      <span>{total} {en ? 'tips' : '条'}</span>
    </div>

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
        {section.items.map((item) => { const key = `${section.id}:${item.title.en}`; const hasSetup = !!item.diagram || !!item.refs?.length; const isOpen = open === key
          return <article key={item.title.en} className={isOpen ? 'open' : undefined}>
            <h5>{item.title[language]}</h5><p>{item.body[language]}</p>
            {hasSetup && <button className="field-setup-toggle" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : key)}>
              {[item.diagram && (en ? 'Diagram' : '示意图'), item.refs?.length && (en ? `Reference video${item.refs.length > 1 ? ` ×${item.refs.length}` : ''}` : `参考视频${item.refs.length > 1 ? ` ×${item.refs.length}` : ''}`)].filter(Boolean).join(' · ')}
              <ChevronDown size={13} />
            </button>}
            {isOpen && <SetupPanel item={item} accent={section.accent} language={language} />}
          </article> })}
      </div>
    </section>)}
  </section>
}
