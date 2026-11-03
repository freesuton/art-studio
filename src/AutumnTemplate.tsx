import { autumnCameraTips, autumnPalette, autumnParts, moveLabels } from './autumnTemplateData'
import type { CameraMove } from './autumnTemplateData'
import autumnStoryboard from './assets/autumn-storyboard.jpg'
import './autumnTemplate.css'

type Language = 'zh' | 'en'
const COLS = 4
const ROWS = 5

// Small line glyphs for the camera moves, drawn in currentColor.
function MoveIcon({ move }: { move: CameraMove }) {
  const paths: Record<CameraMove, React.ReactNode> = {
    static: <><rect x="9" y="2" width="10" height="6" rx="1" /><path d="M14 8v3M14 11l-5 6M14 11l5 6M14 11v6" /></>,
    push: <><path d="M3 9h20" /><path d="M18 5l5 4-5 4" /></>,
    truck: <><path d="M4 6h18M18 3l4 3-4 3" /><path d="M24 13H6M10 10l-4 3 4 3" /></>,
    arc: <><path d="M5 12a9 5 0 1 0 6-8" /><path d="M8 2l3 2-2 3" /></>,
    follow: <><path d="M2 11c4-6 7 4 11-1s6-5 9-2" /><path d="M19 4l4 4-5 2" /></>,
    slider: <><path d="M3 9h22" /><circle cx="8" cy="13" r="2" /><circle cx="20" cy="13" r="2" /></>,
  }
  return <svg className="autumn-move-icon" viewBox="0 0 28 18" aria-hidden="true">{paths[move]}</svg>
}

// Storyboard template: a 20-shot autumn outing on a lawn and in a forest.
export default function AutumnTemplate({ language }: { language: Language }) {
  const en = language === 'en'
  // Part times are worked out from the shot lengths, so they always add up.
  let clock = 0
  const parts = autumnParts.map((part) => {
    const start = clock
    clock += part.shots.reduce((sum, item) => sum + item.seconds, 0)
    return { ...part, start, end: clock }
  })
  const total = clock
  const shotCount = parts.reduce((sum, part) => sum + part.shots.length, 0)

  return <section className="starter-template autumn-template" aria-labelledby="autumn-template-title">
    <div className="starter-template-heading">
      <div><p className="eyebrow">STORYBOARD TEMPLATE / {en ? 'READY TO USE' : '可直接套用'}</p><h3 id="autumn-template-title">{en ? 'Autumn Afternoon · An outing' : '《Autumn Afternoon 秋日郊游》'}</h3></div>
      <span>02 / {shotCount} SHOTS</span>
    </div>
    <p className="starter-template-lead">{en ? 'One autumn afternoon, a young woman goes out to a lawn and a forest. She explores, lingers, reads and rests, then leaves at dusk.' : '一个女孩在秋日去草地与森林郊游的下午，探索、停留、阅读、放松，最后在黄昏中离开。'}</p>
    <div className="starter-template-fields" aria-label={en ? 'Brief' : '创作简报'}>
      <p><span>{en ? 'Subject' : '人物'}</span><strong>{en ? 'One young woman' : '一位女生'}</strong></p>
      <p><span>{en ? 'Time' : '时间'}</span><strong>{en ? 'Autumn afternoon to dusk' : '秋日下午到黄昏'}</strong></p>
      <p><span>{en ? 'Place' : '地点'}</span><strong>{en ? 'Lawn + forest' : '草地 + 森林'}</strong></p>
      <p><span>{en ? 'Length' : '时长'}</span><strong>{en ? `About ${total}s · ${shotCount} shots` : `约 ${total} 秒 · ${shotCount} 个镜头`}</strong></p>
      <p className="starter-template-change"><span>{en ? 'Props' : '道具'}</span><strong>{en ? 'Camera, book, apple, thermos and cup, leather bag, blanket' : '相机、书、苹果、保温杯、皮包、野餐垫'}</strong></p>
    </div>

    <div className="autumn-overview">
      <div>
        <p className="autumn-label">{en ? `Structure and timing (${total}s in all)` : `故事结构与时长（合计 ${total} 秒）`}</p>
        <ol className="autumn-timeline">{parts.map((part) => <li key={part.title.en} style={{ flexGrow: part.end - part.start }}><strong>{part.title[language]}</strong><span>{part.start}–{part.end}s</span></li>)}</ol>
      </div>
      <div>
        <p className="autumn-label">{en ? 'Colour and mood' : '色彩与氛围'}</p>
        <ul className="autumn-palette">{autumnPalette.map((swatch) => <li key={swatch.color}><i style={{ background: swatch.color }} />{swatch.name[language]}</li>)}</ul>
      </div>
    </div>

    <div className="autumn-parts">
      {parts.map((part, index) => <section key={part.title.en} className="autumn-part" aria-labelledby={`autumn-part-${index + 1}`}>
        <header>
          <h4 id={`autumn-part-${index + 1}`}><span>{index + 1}</span>{part.title[language]}</h4>
          <p className="autumn-part-time">{part.start}–{part.end}s</p>
          <ul>{part.beats.map((beat) => <li key={beat.en}>{beat[language]}</li>)}</ul>
        </header>
        <div className="autumn-shots">
          {part.shots.map((item) => { const cell = item.number - 1
            return <figure key={item.number} className="autumn-shot">
              <div className="autumn-shot-image" role="img" aria-label={`${en ? 'Shot' : '镜头'} ${item.number}: ${item.action[language]}`} style={{ backgroundImage: `url(${autumnStoryboard})`, backgroundPosition: `${(cell % COLS) / (COLS - 1) * 100}% ${Math.floor(cell / COLS) / (ROWS - 1) * 100}%` }} />
              <figcaption>
                <p className="autumn-shot-spec"><strong>{item.size[language]}</strong><span>{item.lens}</span><span>{item.moveNote[language]}</span><MoveIcon move={item.move} /></p>
                <p>{item.action[language]}</p>
              </figcaption>
            </figure> })}
        </div>
      </section>)}
    </div>

    <div className="autumn-reference">
      <section aria-labelledby="autumn-moves-title">
        <h4 id="autumn-moves-title">{en ? 'Camera moves' : '机位运动图例'}</h4>
        <ul className="autumn-moves">{(Object.keys(moveLabels) as CameraMove[]).map((move) => <li key={move}><MoveIcon move={move} />{moveLabels[move][language]}</li>)}</ul>
      </section>
      <section aria-labelledby="autumn-camera-title">
        <h4 id="autumn-camera-title">{en ? 'Camera settings (Nikon ZR)' : '拍摄建议（Nikon ZR）'}</h4>
        <dl className="autumn-camera">{autumnCameraTips.map((tip) => <div key={tip.label.en}><dt>{tip.label[language]}</dt><dd>{tip.value[language]}</dd></div>)}</dl>
      </section>
    </div>
  </section>
}
