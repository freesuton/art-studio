import { useState } from 'react'
import { BookOpen, Check, Play, Plus, X } from 'lucide-react'
import { breakdowns } from './referenceBreakdowns'
import type { Capture } from './referenceBreakdowns'
import { cameraPrimer, directPrimer, shotGuides } from './shotGuides'
import type { CameraGuide, DirectGuide } from './shotGuides'
import { filmReferences } from './filmReferences'
import { catalogByKey, workspaceSections } from './workspaceCatalog'
import { useWorkspace, workspace } from './workspaceStore'

type Language = 'zh' | 'en'
type Text = { zh: string; en: string }
type Row<T> = { key: keyof T & string; zh: string; en: string }

const captureRows: Row<Capture>[] = [
  { key: 'size', zh: '景别', en: 'Shot size' },
  { key: 'angle', zh: '机位', en: 'Angle' },
  { key: 'move', zh: '运动', en: 'Movement' },
  { key: 'lens', zh: '镜头', en: 'Lens' },
  { key: 'light', zh: '光线', en: 'Light' },
  { key: 'action', zh: '人物', en: 'Subject' },
  { key: 'post', zh: '后期', en: 'Post' },
]
const cameraRows: Row<CameraGuide>[] = [
  { key: 'gear', zh: '器材', en: 'Gear' },
  { key: 'settings', zh: '参数', en: 'Settings' },
  { key: 'nd', zh: 'ND 滤镜', en: 'ND filter' },
  { key: 'exposure', zh: '曝光', en: 'Exposure' },
  { key: 'focus', zh: '对焦', en: 'Focus' },
  { key: 'tip', zh: '要点', en: 'Tip' },
]
const directRows: Row<DirectGuide>[] = [
  { key: 'brief', zh: '先告诉模特', en: 'Tell the model' },
  { key: 'cues', zh: '现场口令', en: 'What to say' },
  { key: 'pose', zh: '动作要点', en: 'What she does' },
  { key: 'watch', zh: '注意', en: 'Watch out' },
]

// Three ways to read the same shot list: what it looks like, how to run the camera, how to direct.
type Layer = 'look' | 'camera' | 'direct'
const LAYER_STORAGE = 'art-studio-shot-layer'
const readLayer = (): Layer => { try { const saved = localStorage.getItem(LAYER_STORAGE); return saved === 'camera' || saved === 'direct' ? saved : 'look' } catch { return 'look' } }
const layers: { id: Layer; zh: string; en: string }[] = [
  { id: 'look', zh: '画面拍法', en: 'The look' },
  { id: 'camera', zh: '相机操作', en: 'Camera' },
  { id: 'direct', zh: '导演与模特', en: 'Directing' },
]

function Facts<T extends Record<string, Text | undefined>>({ rows, data, language, wide }: { rows: Row<T>[]; data: T; language: Language; wide?: boolean }) {
  return <dl className={`ws-capture ${wide ? 'wide' : ''}`}>
    {rows.filter((row) => data[row.key]).map((row) => <div key={row.key}><dt>{row[language]}</dt><dd>{data[row.key]![language]}</dd></div>)}
  </dl>
}

// Shot-by-shot view: the reference film in chronological order, how each shot was
// captured, how to shoot and direct it, and the library techniques it uses.
export default function ShotTimeline({ language, breakdownId }: { language: Language; breakdownId?: string }) {
  const en = language === 'en'
  const t = (zh: string, enText: string) => en ? enText : zh
  const { has } = useWorkspace()
  const [selectedId, setSelectedId] = useState(breakdownId ?? breakdowns[0].id)
  const [playing, setPlaying] = useState<number | null>(null)
  const [layer, setLayerState] = useState(readLayer)
  const breakdown = breakdowns.find((item) => item.id === selectedId) ?? breakdowns[0]
  const film = filmReferences.find((item) => item.id === breakdown.filmId)!
  const guides = shotGuides[breakdown.id] ?? {}
  const sectionOf = (key: string) => workspaceSections.find((section) => section.id === catalogByKey.get(key)?.sectionId)
  const setLayer = (next: Layer) => { setLayerState(next); try { localStorage.setItem(LAYER_STORAGE, next) } catch { /* ignore */ } }
  const primer = layer === 'camera' ? cameraPrimer : layer === 'direct' ? directPrimer : null

  const note = {
    look: t('按影片里的镜头顺序逐个分析拍法。镜头焦段与帧率是根据画面推测的，并非原片的拍摄参数。点技巧可加入或移出工作台。', 'Each shot in the order it appears, with how it was captured. Lens and frame-rate values are estimates from the footage, not the original settings. Click a technique to add it to or remove it from your workspace.'),
    camera: t('每个镜头怎么操作相机。参数是用无反相机在晴天户外拍这种画面的起点，不是原片的设置；现场以屏幕和斑马纹为准。', 'How to run the camera for each shot. Settings are starting points for a mirrorless camera outdoors in sun, not the original settings; trust your screen and zebras on the day.'),
    direct: t('每个镜头怎么跟模特沟通：开拍前告诉她什么、现场说什么、她要做什么、要注意什么。', 'How to work with the model on each shot: what to tell her first, what to say on set, what she does, and what to watch out for.'),
  }[layer]

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
    <div className="ws-mode ws-layer" role="group" aria-label={t('查看内容', 'What to show')}>
      {layers.map((item) => <button key={item.id} aria-pressed={layer === item.id} onClick={() => setLayer(item.id)}>{item[language]}</button>)}
    </div>
    <p className="ws-timeline-note">{note}</p>

    {primer && <details className="ws-primer">
      <summary><BookOpen size={15} /> {layer === 'camera' ? t(`新手必读：相机基础（${primer.length} 条）`, `Beginner basics: the camera (${primer.length})`) : t(`新手必读：导演和模特（${primer.length} 条）`, `Beginner basics: directing (${primer.length})`)}</summary>
      <ol>
        {primer.map((item) => <li key={item.title.en}><strong>{item.title[language]}</strong><p>{item.body[language]}</p></li>)}
      </ol>
    </details>}

    <ol className="ws-shots">
      {breakdown.shots.map((shot, index) => {
        const guide = guides[shot.time]
        return <li key={shot.time} className="ws-shot">
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
            {layer === 'look' && <Facts rows={captureRows} data={shot.capture} language={language} />}
            {layer === 'camera' && (guide?.camera
              ? <Facts rows={cameraRows} data={guide.camera} language={language} wide />
              : <p className="ws-shot-empty">{t('剪辑时制作，不需要拍摄。', 'Made in the edit, nothing to shoot.')}</p>)}
            {layer === 'direct' && (guide?.direct
              ? <Facts rows={directRows} data={guide.direct} language={language} wide />
              : <p className="ws-shot-empty">{guide?.camera ? t('没有人物，不需要导演模特。可以在模特休息或换装时拍。', 'No talent in this shot. Shoot it while the model rests or changes.') : t('剪辑时制作，不需要拍摄。', 'Made in the edit, nothing to shoot.')}</p>)}
            <div className="ws-shot-techniques" aria-label={t('用到的技巧', 'Techniques used')}>
              {shot.keys.map((key) => { const item = catalogByKey.get(key); const section = sectionOf(key); if (!item || !section) return null; const added = has(key); return <button key={key} className={`ws-chip ${added ? 'added' : ''}`} aria-pressed={added} onClick={() => workspace.toggle(key)} title={`${section.index} ${section.title[language]} · ${item.section[language]}`}>
                <span className="ws-chip-dot" style={{ background: section.accent }} aria-hidden="true" />
                {item.title[language]}
                {added ? <Check size={12} /> : <Plus size={12} />}
              </button> })}
            </div>
          </div>
        </li>
      })}
    </ol>
  </div>
}
