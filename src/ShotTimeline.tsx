import { useState } from 'react'
import { Check, Play, Plus, X } from 'lucide-react'
import { breakdowns } from './referenceBreakdowns'
import type { Capture } from './referenceBreakdowns'
import { filmReferences } from './filmReferences'
import { catalogByKey, workspaceSections } from './workspaceCatalog'
import { useWorkspace, workspace } from './workspaceStore'

type Language = 'zh' | 'en'
const captureRows: { key: keyof Capture; zh: string; en: string }[] = [
  { key: 'size', zh: '景别', en: 'Shot size' },
  { key: 'angle', zh: '机位', en: 'Angle' },
  { key: 'move', zh: '运动', en: 'Movement' },
  { key: 'lens', zh: '镜头', en: 'Lens' },
  { key: 'light', zh: '光线', en: 'Light' },
  { key: 'action', zh: '人物', en: 'Subject' },
  { key: 'post', zh: '后期', en: 'Post' },
]

// Shot-by-shot view: the reference film in chronological order, how each shot was
// captured, and the library techniques it uses.
export default function ShotTimeline({ language, breakdownId }: { language: Language; breakdownId?: string }) {
  const en = language === 'en'
  const t = (zh: string, enText: string) => en ? enText : zh
  const { has } = useWorkspace()
  const [selectedId, setSelectedId] = useState(breakdownId ?? breakdowns[0].id)
  const [playing, setPlaying] = useState<number | null>(null)
  const breakdown = breakdowns.find((item) => item.id === selectedId) ?? breakdowns[0]
  const film = filmReferences.find((item) => item.id === breakdown.filmId)!
  const sectionOf = (key: string) => workspaceSections.find((section) => section.id === catalogByKey.get(key)?.sectionId)

  return <div className="ws-timeline">
    <div className="ws-timeline-head">
      <div>
        <strong>{film.title}</strong>
        <span>{film.source} · {film.year} · {t(`${breakdown.shots.length} 个镜头`, `${breakdown.shots.length} shots`)}</span>
      </div>
      {breakdowns.length > 1 && <select value={breakdown.id} onChange={(event) => { setSelectedId(event.target.value); setPlaying(null) }} aria-label={t('选择影片', 'Choose a film')}>
        {breakdowns.map((item) => <option key={item.id} value={item.id}>{item.title[language]}</option>)}
      </select>}
    </div>
    <p className="ws-timeline-note">{t('按影片里的镜头顺序逐个分析拍法。镜头焦段与帧率是根据画面推测的，并非原片的拍摄参数。点技巧可加入或移出工作台。', 'Each shot in the order it appears, with how it was captured. Lens and frame-rate values are estimates from the footage, not the original settings. Click a technique to add it to or remove it from your workspace.')}</p>

    <ol className="ws-shots">
      {breakdown.shots.map((shot, index) => <li key={shot.time} className="ws-shot">
        <div className="ws-shot-index"><span>{String(index + 1).padStart(2, '0')}</span><time>{shot.time}</time></div>
        <div className="ws-shot-body">
          <div className="ws-shot-title">
            <p>{shot[language]}</p>
            {film.embedType !== 'video' && <button onClick={() => setPlaying(playing === index ? null : index)} aria-pressed={playing === index}>
              {playing === index ? <><X size={13} /> {t('关闭', 'Close')}</> : <><Play size={13} fill="currentColor" /> {t('播放这个镜头', 'Play this shot')}</>}
            </button>}
          </div>
          {playing === index && <div className="ws-shot-player">
            <iframe src={`${film.embedUrl}?start=${shot.start}&end=${shot.end}&autoplay=1&rel=0&playsinline=1`} title={`${film.title} ${shot.time}`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
          </div>}
          <dl className="ws-capture">
            {captureRows.filter((row) => shot.capture[row.key]).map((row) => <div key={row.key}><dt>{row[language]}</dt><dd>{shot.capture[row.key]![language]}</dd></div>)}
          </dl>
          <div className="ws-shot-techniques" aria-label={t('用到的技巧', 'Techniques used')}>
            {shot.keys.map((key) => { const item = catalogByKey.get(key); const section = sectionOf(key); if (!item || !section) return null; const added = has(key); return <button key={key} className={`ws-chip ${added ? 'added' : ''}`} aria-pressed={added} onClick={() => workspace.toggle(key)} title={`${section.index} ${section.title[language]} · ${item.section[language]}`}>
              <span className="ws-chip-dot" style={{ background: section.accent }} aria-hidden="true" />
              {item.title[language]}
              {added ? <Check size={12} /> : <Plus size={12} />}
            </button> })}
          </div>
        </div>
      </li>)}
    </ol>
  </div>
}
