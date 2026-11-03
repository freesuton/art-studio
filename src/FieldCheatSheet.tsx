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

// Searchable on-set cheat sheet for outdoor fashion video. Search matches both languages,
// so "ND", "逆光" or "85mm" all work whichever language is showing.
export default function FieldCheatSheet({ language }: { language: Language }) {
  const en = language === 'en'
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<string | null>(null)
  const sections = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return fieldCheatSheet
    const matches = (...texts: string[]) => texts.some((text) => text.toLowerCase().includes(needle))
    return fieldCheatSheet
      .map((section) => matches(section.title.zh, section.title.en) ? section : { ...section, items: section.items.filter((item) => matches(item.title.zh, item.title.en, item.body.zh, item.body.en)) })
      .filter((section) => section.items.length > 0)
  }, [query])
  const count = sections.reduce((total, section) => total + section.items.length, 0)

  return <section className="field-sheet" id="field-sheet" aria-labelledby="field-sheet-title">
    <div className="field-sheet-heading">
      <div>
        <p className="eyebrow">FIELD CHEAT SHEET / OUTDOOR FASHION</p>
        <h3 id="field-sheet-title">{en ? 'Outdoor fashion shoot, at a glance' : '户外女性时尚拍摄速查'}</h3>
        <p>{en ? 'Composition, posing, light, settings and styling for shooting a female model outdoors. Search for what you need on set.' : '户外拍女性模特时的构图、姿势、光线、参数和造型。现场需要什么，直接搜。'}</p>
      </div>
      <span>{count} {en ? 'tips' : '条'}</span>
    </div>

    <label className="field-sheet-search">
      <Search size={18} />
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={en ? 'Search: backlight, ND, 85mm, hands, crop…' : '搜索：逆光、ND、85mm、手、构图……'} />
      {query && <button onClick={() => setQuery('')} aria-label={en ? 'Clear search' : '清空搜索'}><X size={16} /></button>}
    </label>

    {!query && <nav className="field-sheet-jump" aria-label={en ? 'Jump to a section' : '跳到分类'}>
      {fieldCheatSheet.map((section) => <button key={section.id} onClick={() => document.getElementById(`field-${section.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
        <span style={{ background: section.accent }} aria-hidden="true" />{section.title[language]}
      </button>)}
    </nav>}

    {sections.length > 0 ? <div className="field-sheet-sections">
      {sections.map((section) => <section key={section.id} id={`field-${section.id}`} className="field-sheet-section" style={{ '--accent': section.accent } as React.CSSProperties}>
        <header><h4>{section.title[language]}</h4><small>{section.hint[language]}</small></header>
        <dl>
          {section.items.map((item) => { const key = `${section.id}:${item.title.en}`; const hasSetup = !!item.diagram || !!item.refs?.length; const isOpen = open === key
            return <div key={item.title.en}>
              <dt>{item.title[language]}</dt><dd>{item.body[language]}</dd>
              {hasSetup && <button className="field-setup-toggle" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : key)}>
                {[item.diagram && (en ? 'Diagram' : '示意图'), item.refs?.length && (en ? `Reference video${item.refs.length > 1 ? ` ×${item.refs.length}` : ''}` : `参考视频${item.refs.length > 1 ? ` ×${item.refs.length}` : ''}`)].filter(Boolean).join(' · ')}
                <ChevronDown size={13} />
              </button>}
              {isOpen && <SetupPanel item={item} accent={section.accent} language={language} />}
            </div> })}
        </dl>
      </section>)}
    </div> : <p className="field-sheet-empty">{en ? `Nothing matches "${query}". Try another word.` : `没有找到"${query}"，换个词试试。`}</p>}
  </section>
}
