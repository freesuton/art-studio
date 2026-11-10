import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Camera, Check, ChevronLeft, ChevronRight, Crosshair, ExternalLink, ImagePlus, KeyRound, Lightbulb, RotateCcw, Sparkles, Sun, TriangleAlert, Wand2, Wrench } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { guessProvider, providerNames, useApiKey } from './aiKeys'
import type { Provider } from './aiKeys'
import { IMAGE_MODEL, OPENAI_MODEL, analyseScene, describeAiError, generateExample, pickBestClips, prepareImage, reviewShot } from './photoCoachAi'
import { describeClipError, searchClips } from './stockClips'
import type { StockClip } from './stockClips'
import type { CaptureMode, CoachBrief, CoachSubject, PreparedImage, SceneAnalysis, ShotIdea, ShotReview } from './photoCoachAi'
import { catalogByKey } from './workspaceCatalog'
import { motions } from './motionData'
import WorkspaceToggle from './WorkspaceToggle'
import './workspace.css'
import './photoCoach.css'

type Language = 'zh' | 'en'
type Attempt = { image: PreparedImage; tried: string; review: ShotReview }
// examples: AI-made example photos, by shot index. clips: real Pexels clips found for each shot,
// with the one the AI judged closest (-1 when it found none close).
type ShotClips = { items: StockClip[]; best: number }
type Session = { scene: PreparedImage; brief: CoachBrief; analysis: SceneAnalysis; language: Language; attempts: Attempt[]; examples?: Record<number, string>; clips?: Record<number, ShotClips> }

const BRIEF_STORAGE = 'art-studio-coach-brief'
const SESSION_STORAGE = 'art-studio-coach-session'
const PROVIDER_STORAGE = 'art-studio-coach-provider'
const readProvider = (): Provider => { try { return localStorage.getItem(PROVIDER_STORAGE) === 'openai' ? 'openai' : 'claude' } catch { return 'claude' } }
const defaultBrief: CoachBrief = { mode: 'photo', subject: 'person', goal: '', gear: '' }
const readBrief = (): CoachBrief => { try { return { ...defaultBrief, ...JSON.parse(localStorage.getItem(BRIEF_STORAGE) || '{}') } } catch { return defaultBrief } }
const readSession = (): Session | null => { try { return JSON.parse(sessionStorage.getItem(SESSION_STORAGE) || 'null') } catch { return null } }
// Photos are large, so if the browser runs out of room the takes and AI examples are dropped first.
function storeSession(session: Session | null) {
  try {
    if (!session) { sessionStorage.removeItem(SESSION_STORAGE); return }
    try { sessionStorage.setItem(SESSION_STORAGE, JSON.stringify(session)) }
    catch { sessionStorage.setItem(SESSION_STORAGE, JSON.stringify({ ...session, attempts: [], examples: {} })) }
  } catch { /* storage blocked: the session lasts until the page is left */ }
}

// Two ways in: open the camera (on a phone) or pick an existing photo. Dropping a file also works.
function PhotoPicker({ onPick, language, compact = false, cameraLabel }: { onPick: (file: File) => void; language: Language; compact?: boolean; cameraLabel?: string }) {
  const en = language === 'en'
  const camera = useRef<HTMLInputElement>(null)
  const library = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)
  const take = (files: FileList | null) => { const file = files?.[0]; if (file) onPick(file) }
  return <div className={`pc-picker ${compact ? 'compact' : ''} ${over ? 'over' : ''}`}
    onDragOver={(event) => { event.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)}
    onDrop={(event) => { event.preventDefault(); setOver(false); take(event.dataTransfer.files) }}>
    <input ref={camera} type="file" accept="image/*" capture="environment" hidden onChange={(event) => { take(event.target.files); event.target.value = '' }} />
    <input ref={library} type="file" accept="image/*" hidden onChange={(event) => { take(event.target.files); event.target.value = '' }} />
    <button className="primary" onClick={() => camera.current?.click()}><Camera size={16} /> {cameraLabel ?? (en ? 'Take a photo of the location' : '拍一张环境照')}</button>
    <button onClick={() => library.current?.click()}><ImagePlus size={16} /> {en ? 'Choose a photo' : '从相册选择'}</button>
    {!compact && <small>{en ? 'Or drop a photo here. It is scaled down in your browser before it is sent.' : '也可以把照片拖到这里。照片会先在浏览器里缩小再发送。'}</small>}
  </div>
}

// The location photo with every shot's subject spot, and the selected shot's framing.
function SceneOverlay({ image, shots, selected, onSelect, language }: { image: PreparedImage; shots: ShotIdea[]; selected: number; onSelect: (index: number) => void; language: Language }) {
  const frame = shots[selected]?.frame
  return <div className="pc-scene">
    <img src={image.dataUrl} alt={language === 'en' ? 'Your location photo' : '你的环境照片'} />
    {frame && <span className="pc-frame" style={{ left: `${frame.x * 100}%`, top: `${frame.y * 100}%`, width: `${frame.w * 100}%`, height: `${frame.h * 100}%` }} aria-hidden="true" />}
    {shots.map((shot, index) => shot.place && <button key={index} className={`pc-marker ${index === selected ? 'selected' : ''}`} style={{ left: `${shot.place.x * 100}%`, top: `${shot.place.y * 100}%` }} onClick={() => onSelect(index)} aria-label={`${language === 'en' ? 'Shot' : '镜头'} ${index + 1}: ${shot.title}`}>{index + 1}</button>)}
  </div>
}

// A preview of the shot: the part of the location photo it frames, with the subject spot.
function ShotCrop({ image, shot }: { image: PreparedImage; shot: ShotIdea }) {
  const box = shot.frame ?? { x: 0, y: 0, w: 1, h: 1 }
  const dot = shot.place && { x: (shot.place.x - box.x) / box.w, y: (shot.place.y - box.y) / box.h }
  const inside = dot && dot.x >= 0 && dot.x <= 1 && dot.y >= 0 && dot.y <= 1
  // The crop sits inside a 3:2 box: wide crops fill its width, tall ones its height.
  const ratio = (box.w * image.width) / (box.h * image.height)
  return <div className="pc-crop" aria-hidden="true" style={{
    aspectRatio: `${ratio}`,
    ...(ratio >= 1.5 ? { width: '100%' } : { height: '100%' }),
    backgroundImage: `url(${image.dataUrl})`,
    backgroundSize: `${100 / box.w}% ${100 / box.h}%`,
    backgroundPosition: `${box.w < 1 ? box.x / (1 - box.w) * 100 : 0}% ${box.h < 1 ? box.y / (1 - box.h) * 100 : 0}%`,
  }}>{inside && <i style={{ left: `${dot.x * 100}%`, top: `${dot.y * 100}%` }} />}</div>
}

// A muted clip that plays only while it is on screen.
function Clip({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const video = ref.current
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) video.play().catch(() => {}); else video.pause() }, { threshold: .6 })
    observer.observe(video)
    return () => observer.disconnect()
  }, [])
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" />
}

type ExampleState = { src?: string; busy: boolean; error?: string }
type View = 'reference' | 'scene' | 'ai'
// The top of a shot card: a real reference clip from the guide, the shot's part of the
// creator's own photo, and an AI example made in their location on request.
function ShotVisual({ shot, index, scene, example, onGenerate, stock, searching, language }: { shot: ShotIdea; index: number; scene: PreparedImage; example: ExampleState; onGenerate: () => void; stock?: ShotClips; searching: boolean; language: Language }) {
  const en = language === 'en'
  const t = (zh: string, enText: string) => en ? enText : zh
  const motion = shot.example ? motions.find((item) => `motion:${item.id}` === shot.example) : undefined
  const clips = stock?.items ?? []
  const hasReference = clips.length > 0 || searching || !!motion
  const [view, setView] = useState<View>(example.src ? 'ai' : hasReference ? 'reference' : 'scene')
  useEffect(() => { if (example.src) setView('ai') }, [example.src])
  // Browsing the other search results starts from the AI's pick.
  const [n, setN] = useState(Math.max(0, stock?.best ?? 0))
  useEffect(() => { setN(Math.max(0, stock?.best ?? 0)) }, [stock])
  const clip = clips[n]
  const stop = (event: React.MouseEvent) => event.stopPropagation()
  const views: { id: View; label: string }[] = [
    ...(hasReference ? [{ id: 'reference' as View, label: clips.length || searching ? t('网上实拍', 'Real footage') : t('参考示例', 'Example') }] : []),
    { id: 'scene', label: t('你的现场', 'Your spot') },
    { id: 'ai', label: t('AI 生成', 'AI in your spot') },
  ]
  return <div className="pc-visual">
    <div className="pc-visual-tabs" role="tablist" aria-label={t(`镜头 ${index + 1} 的画面`, `Pictures for shot ${index + 1}`)}>
      {views.map((item) => <button key={item.id} role="tab" aria-selected={view === item.id} onClick={(event) => { event.stopPropagation(); setView(item.id) }}>{item.label}</button>)}
    </div>
    <div className="pc-visual-frame">
      {view === 'reference' && clip ? <>
        <Clip key={clip.id} src={clip.video} poster={clip.poster} />
        <span className="pc-visual-count" onClick={stop}>
          <button onClick={() => setN((n + clips.length - 1) % clips.length)} aria-label={t('上一个片段', 'Previous clip')}><ChevronLeft size={14} /></button>
          {n === stock!.best ? t('最匹配', 'Best match') : `${n + 1}/${clips.length}`}
          <button onClick={() => setN((n + 1) % clips.length)} aria-label={t('下一个片段', 'Next clip')}><ChevronRight size={14} /></button>
        </span>
        <a className="pc-visual-note" href={clip.page} target="_blank" rel="noopener noreferrer" onClick={stop}>{stock!.best < 0 ? t('最接近的结果 · ', 'Closest result · ') : ''}{t(`${clip.author} 拍摄 · Pexels`, `Video by ${clip.author} on Pexels`)} <ExternalLink size={11} /></a>
      </> : view === 'reference' && searching ? <div className="pc-visual-make"><p><Sparkles size={16} /> {t('正在网上找最匹配的实拍片段…', 'Finding the closest real footage…')}</p></div>
      : view === 'reference' && motion ? <>
        <Clip src={motion.videoUrl} poster={motion.poster} />
        <a className="pc-visual-note" href={motion.sourceUrl} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()}>{en ? motion.sourceTitle : motion.title} · Mixkit <ExternalLink size={11} /></a>
      </> : view === 'scene' ? <>
        <ShotCrop image={scene} shot={shot} />
        <span className="pc-visual-note">{shot.frame ? t('这个镜头在你照片里的大致取景', "Roughly this shot's part of your photo") : t('需要换个机位，见下方「机位」', 'Needs a different spot; see Camera below')}</span>
      </> : example.src ? <>
        <img src={example.src} alt={t(`AI 生成的镜头 ${index + 1} 示例`, `AI example of shot ${index + 1}`)} />
        <span className="pc-visual-note">{t('AI 生成，仅供参考', 'AI-made, for reference only')} · <button onClick={(event) => { event.stopPropagation(); onGenerate() }} disabled={example.busy}>{t('重新生成', 'Redo')}</button></span>
      </> : <div className="pc-visual-make">
        {example.busy ? <p><Sparkles size={16} /> {t('正在你的现场里生成…', 'Making it in your spot…')} <Elapsed /></p> : <>
          <button onClick={(event) => { event.stopPropagation(); onGenerate() }}><Wand2 size={15} /> {t('在我的现场生成示例', 'Generate in my location')}</button>
          <small>{t(`用 OpenAI ${IMAGE_MODEL} 按这个镜头画一张电影感示例，约 5 美分一张，需要 OpenAI Key，约 20–60 秒。`, `Draws a cinematic frame of this shot in your photo's location with OpenAI ${IMAGE_MODEL}. About 5 US cents per image, needs an OpenAI key, takes about 20–60 seconds.`)}</small>
        </>}
        {example.error && <p className="ws-error" role="alert">{example.error}</p>}
      </div>}
    </div>
  </div>
}

function Elapsed() {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => { const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000); return () => window.clearInterval(timer) }, [])
  return <span className="pc-elapsed">{seconds}s</span>
}

export default function PhotoCoach({ language, setLanguage }: { language: Language; setLanguage: (language: Language) => void }) {
  const en = language === 'en'
  const t = (zh: string, enText: string) => en ? enText : zh
  const navigate = useNavigate()
  const keys = { claude: useApiKey('claude'), openai: useApiKey('openai') }
  const pexels = useApiKey('pexels')
  const [pexelsDraft, setPexelsDraft] = useState('')
  const [provider, setProviderState] = useState(readProvider)
  const setProvider = (next: Provider) => { setProviderState(next); try { localStorage.setItem(PROVIDER_STORAGE, next) } catch { /* remembered for this visit only */ } }
  const { apiKey, forgetKey, fromEnv } = keys[provider]
  const engine = { provider, apiKey }
  const ai = providerNames[provider]
  const [keyDraft, setKeyDraft] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [brief, setBriefState] = useState(readBrief)
  const setBrief = (patch: Partial<CoachBrief>) => { const next = { ...brief, ...patch }; setBriefState(next); try { localStorage.setItem(BRIEF_STORAGE, JSON.stringify(next)) } catch { /* remembered for this visit only */ } }
  const saved = useRef(readSession()).current
  const [scene, setScene] = useState<PreparedImage | null>(saved?.scene ?? null)
  const [session, setSessionState] = useState<Session | null>(saved)
  const setSession = (next: Session | null) => { setSessionState(next); storeSession(next) }
  // AI examples finish one by one, so they are written into the latest session, not a stale copy.
  const [making, setMaking] = useState<Record<number, { busy: boolean; error?: string }>>({})
  const makeExample = async (index: number) => {
    if (!session) return
    const openai = keys.openai.apiKey
    if (!openai) {
      setSettingsOpen(true)
      setMaking((prev) => ({ ...prev, [index]: { busy: false, error: t('生成示例图需要 OpenAI API Key：在上方 AI 设置里粘贴即可，分析仍可继续用 Claude。', 'Example images need an OpenAI API key. Paste one in AI settings above; analysis can stay on Claude.') } }))
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setMaking((prev) => ({ ...prev, [index]: { busy: true } }))
    try {
      const src = await generateExample(openai, session.scene, session.analysis.shots[index], session.brief)
      setSessionState((prev) => { if (!prev || prev.scene.data !== session.scene.data) return prev; const next = { ...prev, examples: { ...prev.examples, [index]: src } }; storeSession(next); return next })
      setMaking((prev) => ({ ...prev, [index]: { busy: false } }))
    } catch (err) { setMaking((prev) => ({ ...prev, [index]: { busy: false, error: describeAiError(err, 'openai', language) } })) }
  }
  // Real footage: search Pexels with each shot's query, then let the AI look at the thumbnails
  // and choose the closest one. If that choice fails, Pexels' own order is kept.
  const [clipSearch, setClipSearch] = useState<{ busy: boolean; error?: string }>({ busy: false })
  const findClips = async (target: Session) => {
    if (!pexels.apiKey) return
    setClipSearch({ busy: true })
    try {
      const orientation = target.scene.width >= target.scene.height ? 'landscape' : 'portrait'
      const results = await Promise.all(target.analysis.shots.map((shot) => searchClips(pexels.apiKey, shot.search || shot.title, orientation)
        .catch((err: unknown) => { if (err instanceof Error && err.message.startsWith('pexels-')) throw err; return [] as StockClip[] })))
      // The AI keeps only the clips that are both close to the shot and beautiful, best first.
      // When it rejects them all, the search results stay, labelled as the closest found.
      let ranked: number[][] | null = null
      if (apiKey && results.some((items) => items.length > 0)) {
        try { ranked = await pickBestClips(engine, target.analysis.shots, results.map((items) => items.map((item) => item.thumb))) } catch { /* keep the search order */ }
      }
      const clips = Object.fromEntries(results.map((items, index): [number, ShotClips] => {
        const order = ranked?.[index]
        if (!order) return [index, { items: items.slice(0, 6), best: 0 }]
        return order.length ? [index, { items: order.map((n) => items[n]), best: 0 }] : [index, { items: items.slice(0, 6), best: -1 }]
      }))
      setSessionState((prev) => { if (!prev || prev.scene.data !== target.scene.data) return prev; const next = { ...prev, clips }; storeSession(next); return next })
      setClipSearch({ busy: false })
    } catch (err) { setClipSearch({ busy: false, error: describeClipError(err, language) }) }
  }
  const [selected, setSelected] = useState(0)
  const [tried, setTried] = useState('0')
  const [busy, setBusy] = useState<'scene' | 'review' | null>(null)
  const [error, setError] = useState('')
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const pickScene = async (file: File) => {
    setError('')
    try { setScene(await prepareImage(file)); setSession(null); setMaking({}); setSelected(0) }
    catch { setError(t('无法读取这张照片。请换一张 JPG 或 PNG。', 'Could not read that photo. Try a JPG or PNG.')) }
  }
  const run = async () => {
    if (!scene) return
    if (!apiKey) { setSettingsOpen(true); return }
    setBusy('scene'); setError('')
    try {
      const analysis = await analyseScene(engine, scene, brief, language)
      const next: Session = { scene, brief, analysis, language, attempts: [] }
      setSession(next); setMaking({}); setClipSearch({ busy: false }); setSelected(0); setTried('0')
      void findClips(next)
      window.requestAnimationFrame(() => document.getElementById('pc-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    } catch (err) { setError(describeAiError(err, provider, language)) }
    finally { setBusy(null) }
  }
  const check = async (file: File) => {
    if (!session) return
    if (!apiKey) { setSettingsOpen(true); return }
    setBusy('review'); setError('')
    try {
      const image = await prepareImage(file)
      const idea = session.analysis.shots[Number(tried)]
      const goal = idea ? `shot ${Number(tried) + 1}, "${idea.title}" (${idea.framing}, ${idea.lens_mm}mm)` : 'their own idea for this location'
      const review = await reviewShot(engine, { ...session, image: session.scene }, image, goal)
      const attempt = { image, tried: idea ? `${Number(tried) + 1}. ${idea.title}` : t('我自己的想法', 'My own idea'), review }
      setSessionState((prev) => { if (!prev) return prev; const next = { ...prev, attempts: [attempt, ...prev.attempts] }; storeSession(next); return next })
    } catch (err) { setError(describeAiError(err, provider, language)) }
    finally { setBusy(null) }
  }
  const restart = () => { setScene(null); setSession(null); setMaking({}); setError(''); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  // A pasted key goes to the provider it belongs to, judged by its prefix.
  const submitKey = () => {
    const key = keyDraft.trim()
    const target = guessProvider(key) ?? provider
    keys[target].saveKey(key); setKeyDraft(''); setSettingsOpen(false)
    // Switch only when the current provider has no key, so adding an OpenAI key for images keeps Claude for analysis.
    if (target === provider || !keys[provider].apiKey) setProvider(target)
  }

  const analysis = session?.analysis
  // A restored session may name guide items that have since been renamed; those are skipped.
  const related = (analysis?.related ?? []).flatMap((key) => catalogByKey.get(key) ?? [])
  const choice = <T extends string>(value: T, options: { id: T; label: string }[], onChange: (value: T) => void, label: string) =>
    <div className="pc-choice" role="radiogroup" aria-label={label}>{options.map((option) => <button key={option.id} role="radio" aria-checked={value === option.id} onClick={() => onChange(option.id)}>{option.label}</button>)}</div>

  return <div className="ws-page">
    <nav className="ws-topbar">
      <button className="ws-home" onClick={() => navigate('/')}><ArrowLeft size={16} /> {t('返回手册', 'Back to guide')}</button>
      <span className="ws-topbar-title">{t('短片现场手册 · AI 拍摄教练', 'Short Film Field Guide · AI Photo Coach')}</span>
      <div className="ws-lang" role="group" aria-label="Language">
        <button aria-pressed={language === 'zh'} onClick={() => setLanguage('zh')}>中文</button>
        <button aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>English</button>
      </div>
    </nav>

    <main className="pc" aria-labelledby="pc-title">
      <header className="pc-header">
        <div>
          <p className="eyebrow">AI PHOTO COACH / {t('现场拍摄建议', 'ON-LOCATION ADVICE')}</p>
          <h1 id="pc-title">{t('拍下现场，告诉你怎么拍好', 'Show the location. Get the shot.')}</h1>
          <p>{t('到了拍摄地，先拍一张环境照。AI 会读光线和构图，给你 3–5 个能马上拍的镜头：站位、焦段、参数和给模特的指令。拍完再上传成片，它会告诉你下一条怎么改。', 'When you arrive, take one photo of the location. The AI reads the light and composition and gives you 3–5 shots to take right now: where to stand, lens, settings and what to tell the model. Upload your shot afterwards and it tells you what to change on the next take.')}</p>
        </div>
        <button className="ws-link" onClick={() => setSettingsOpen(!settingsOpen)}><KeyRound size={13} /> {t('AI 设置', 'AI settings')}</button>
      </header>
      {settingsOpen && <div className="ws-settings pc-settings">
        <div className="pc-provider" role="radiogroup" aria-label={t('AI 服务', 'AI provider')}>{(['claude', 'openai'] as Provider[]).map((id) => <button key={id} role="radio" aria-checked={provider === id} onClick={() => setProvider(id)}>{providerNames[id]}{keys[id].apiKey && <Check size={13} aria-label={t('已有 Key', 'key set')} />}</button>)}</div>
        {fromEnv ? <p>{t('正在使用 .env.local 里的 API Key（仅开发环境）。', 'Using the API key from .env.local (dev only).')}</p> : apiKey ? <p>{t('已保存 API Key（仅存在这个浏览器）。', 'API key saved (in this browser only).')} <button className="ws-link" onClick={forgetKey}>{t('移除', 'Remove')}</button></p> : <p>{t(`粘贴你的 ${provider === 'openai' ? 'OpenAI' : 'Anthropic'} API Key。它只保存在这个浏览器里，直接从浏览器发送给 ${provider === 'openai' ? 'OpenAI' : 'Anthropic'}。`, `Paste your ${provider === 'openai' ? 'OpenAI' : 'Anthropic'} API key. It is stored only in this browser and sent straight to ${provider === 'openai' ? 'OpenAI' : 'Anthropic'}.`)}</p>}
        <div><input type="password" value={keyDraft} onChange={(event) => setKeyDraft(event.target.value)} placeholder={provider === 'openai' ? 'sk-proj-...' : 'sk-ant-...'} autoComplete="off" /><button onClick={submitKey} disabled={!keyDraft.trim()}>{t('保存', 'Save')}</button></div>
        <div className="pc-key-extra">
          <p><b>{t('Pexels（网上实拍参考片段）', 'Pexels (real reference footage)')}</b> {pexels.fromEnv ? t('正在使用 .env.local 里的 Key。', 'Using the key from .env.local.') : pexels.apiKey ? <>{t('已保存。', 'Saved.')} <button className="ws-link" onClick={pexels.forgetKey}>{t('移除', 'Remove')}</button></> : <>{t('免费申请：', 'Free key: ')}<a href="https://www.pexels.com/api/" target="_blank" rel="noopener noreferrer">pexels.com/api</a></>}</p>
          <div><input type="password" value={pexelsDraft} onChange={(event) => setPexelsDraft(event.target.value)} placeholder="Pexels API key" autoComplete="off" /><button onClick={() => { pexels.saveKey(pexelsDraft.trim()); setPexelsDraft(''); setSettingsOpen(false) }} disabled={!pexelsDraft.trim()}>{t('保存', 'Save')}</button></div>
        </div>
      </div>}

      <section className="pc-setup" aria-label={t('拍摄设置', 'Set up')}>
        <div className="pc-step">
          <h2><span>1</span>{t('拍下现场', 'Capture the location')}</h2>
          {scene ? <div className="pc-preview">
            <img src={scene.dataUrl} alt={t('你的环境照片', 'Your location photo')} />
            <PhotoPicker onPick={pickScene} language={language} compact cameraLabel={t('重拍环境照', 'Retake')} />
          </div> : <PhotoPicker onPick={pickScene} language={language} />}
        </div>
        <div className="pc-step">
          <h2><span>2</span>{t('你想拍什么', 'What you are making')}</h2>
          <div className="pc-field"><span>{t('形式', 'Format')}</span>{choice<CaptureMode>(brief.mode, [{ id: 'photo', label: t('照片', 'Photos') }, { id: 'video', label: t('视频', 'Video') }], (mode) => setBrief({ mode }), t('形式', 'Format'))}</div>
          <div className="pc-field"><span>{t('主体', 'Subject')}</span>{choice<CoachSubject>(brief.subject, [{ id: 'person', label: t('模特 / 人物', 'Model') }, { id: 'detail', label: t('服装与细节', 'Outfit & details') }, { id: 'scene', label: t('只拍环境', 'Location only') }], (subject) => setBrief({ subject }), t('主体', 'Subject'))}</div>
          <label className="pc-field"><span>{t('想要的感觉（可选）', 'The feeling you want (optional)')}</span><textarea rows={2} value={brief.goal} onChange={(event) => setBrief({ goal: event.target.value })} placeholder={t('例如：秋日午后，安静、温柔，米色针织裙，不想拍正脸。', 'e.g. Quiet autumn afternoon, soft and gentle, beige knit dress, avoid straight-on face shots.')} /></label>
          <label className="pc-field"><span>{t('器材（可选，会记住）', 'Gear (optional, remembered)')}</span><input value={brief.gear} onChange={(event) => setBrief({ gear: event.target.value })} placeholder={t('例如：Nikon ZR，35mm / 50mm / 85mm，柔光板', 'e.g. Nikon ZR, 35mm / 50mm / 85mm, reflector')} /></label>
          <button className="pc-run" onClick={run} disabled={!scene || busy !== null}>
            <Sparkles size={16} /> {busy === 'scene' ? <>{t(`${ai} 正在看这张照片…`, `${ai} is reading the photo…`)} <Elapsed /></> : session ? t('重新分析', 'Analyse again') : t('分析现场', 'Analyse the location')}
          </button>
          <p className="ws-hint">{t(`使用 ${ai}（${provider === 'openai' ? OPENAI_MODEL : 'claude-opus-5-5'}）和你自己的 API Key，按次计费。每次分析约需 20–60 秒。`, `Uses ${ai} (${provider === 'openai' ? OPENAI_MODEL : 'claude-opus-5-5'}) with your own API key, billed per request. Each analysis takes about 20–60 seconds.`)} <button className="ws-link" onClick={() => setSettingsOpen(true)}>{t('切换', 'Switch')}</button></p>
          {error && <p className="ws-error" role="alert">{error}</p>}
        </div>
      </section>

      {session && analysis && <section className="pc-results" id="pc-results" aria-labelledby="pc-results-title">
        <div className="pc-read">
          <div className="pc-read-photo">
            <SceneOverlay image={session.scene} shots={analysis.shots} selected={selected} onSelect={setSelected} language={language} />
            <p className="pc-caption"><Crosshair size={13} /> {t('数字 = 人物站位，虚线框 = 选中镜头的大致取景。位置是估计值。', 'Numbers mark where the subject stands; the dashed box is the selected shot\'s rough framing. Positions are estimates.')}</p>
          </div>
          <div className="pc-read-text">
            <p className="eyebrow">{t('现场判断', 'SCENE READ')}</p>
            <h2 id="pc-results-title">{analysis.headline}</h2>
            <dl className="pc-facts">
              <div><dt><Sun size={14} /> {t('光线', 'Light')}</dt><dd>{analysis.scene.light}</dd></div>
              <div><dt><Lightbulb size={14} /> {t('氛围', 'Mood')}</dt><dd>{analysis.scene.mood}</dd></div>
            </dl>
            <div className="pc-lists">
              <section><h3 className="good"><Check size={14} /> {t('已经很好', 'Working')}</h3><ul>{analysis.scene.strengths.map((item) => <li key={item}>{item}</li>)}</ul></section>
              <section><h3 className="bad"><TriangleAlert size={14} /> {t('需要避开', 'Fix or avoid')}</h3><ul>{analysis.scene.problems.map((item) => <li key={item}>{item}</li>)}</ul></section>
            </div>
            {analysis.quick_fixes.length > 0 && <section className="pc-quick"><h3><Wrench size={14} /> {t('马上能改的', 'Quick fixes')}</h3><ol>{analysis.quick_fixes.map((item) => <li key={item}>{item}</li>)}</ol></section>}
          </div>
        </div>

        <h3 className="pc-section-title">{t(`推荐镜头 · ${analysis.shots.length}`, `Shots to take · ${analysis.shots.length}`)}</h3>
        <div className="pc-clip-bar">
          {clipSearch.busy ? <p><Sparkles size={14} /> {t('正在 Pexels 上为每个镜头找实拍片段，并让 AI 挑最匹配的…', 'Searching Pexels for each shot and letting the AI pick the closest…')} <Elapsed /></p>
            : clipSearch.error ? <><p className="ws-error" role="alert">{clipSearch.error}</p><button onClick={() => findClips(session)}>{t('重试', 'Try again')}</button></>
            : !pexels.apiKey ? <><p>{t('添加免费的 Pexels Key，就能从网上为每个镜头找最匹配的实拍片段。', 'Add a free Pexels key to find the closest real footage for each shot.')}</p><button onClick={() => { setSettingsOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }}><KeyRound size={13} /> {t('添加 Key', 'Add key')}</button></>
            : !session.clips ? <><p>{t('还没有为这些镜头找实拍片段。', 'No real footage found for these shots yet.')}</p><button onClick={() => findClips(session)}>{t('在网上找实拍片段', 'Find real footage')}</button></>
            : <><p>{t('实拍片段来自', 'Real footage from')} <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer">Pexels</a>{t('，「最匹配」由 AI 看过缩略图后挑选。', '. "Best match" is picked by the AI after looking at the thumbnails.')}</p><button onClick={() => findClips(session)}>{t('重新搜索', 'Search again')}</button></>}
        </div>
        <div className="pc-shots">
          {analysis.shots.map((shot, index) => <article key={index} className={`pc-shot ${index === selected ? 'selected' : ''}`} onClick={() => setSelected(index)}>
            <ShotVisual key={`${session.scene.data.length}-${index}`} shot={shot} index={index} scene={session.scene} language={language} example={{ src: session.examples?.[index], busy: making[index]?.busy ?? false, error: making[index]?.error }} onGenerate={() => makeExample(index)} stock={session.clips?.[index]} searching={clipSearch.busy} />
            <div className="pc-shot-body">
              <h4><span>{index + 1}</span>{shot.title}</h4>
              <p className="pc-spec"><strong>{shot.framing}</strong><span>{shot.lens_mm}mm</span>{shot.camera_move && <span>{shot.camera_move}</span>}</p>
              <ul className="pc-settings-row" aria-label={t('参数', 'Settings')}>
                <li><small>{t('光圈', 'Aperture')}</small>{shot.settings.aperture}</li>
                <li><small>{t('快门', 'Shutter')}</small>{shot.settings.shutter}</li>
                <li><small>ISO</small>{shot.settings.iso}</li>
                <li><small>{t('白平衡', 'WB')}</small>{shot.settings.white_balance}</li>
              </ul>
              <dl>
                <div><dt>{t('机位', 'Camera')}</dt><dd>{shot.camera_position}</dd></div>
                <div><dt>{t('给模特', 'Direction')}</dt><dd>{shot.subject_direction}</dd></div>
              </dl>
              <p className="pc-why"><b>{t('为什么好看', 'Why it works')}</b>{shot.why}</p>
            </div>
          </article>)}
        </div>

        <div className="pc-extra">
          <section><h3><Sun size={14} /> {t('光线计划', 'Light plan')}</h3><p className="pc-best">{analysis.light_plan.best_time}</p><ul>{analysis.light_plan.tips.map((item) => <li key={item}>{item}</li>)}</ul></section>
          {analysis.watch_out.length > 0 && <section><h3><TriangleAlert size={14} /> {t('注意', 'Watch out')}</h3><ul>{analysis.watch_out.map((item) => <li key={item}>{item}</li>)}</ul></section>}
          {related.length > 0 && <section><h3>{t('手册里的相关参考', 'Related in the guide')}</h3><ul className="pc-related">{related.map((item) => { const key = item.key; return <li key={key}>
            {item.thumb ? <img src={item.thumb} alt="" loading="lazy" /> : <span aria-hidden="true">{item.title.zh.slice(0, 2)}</span>}
            <div><strong>{item.title[language]}</strong><small>{item.section[language]}</small></div>
            <WorkspaceToggle itemKey={key} language={language} />
          </li> })}</ul></section>}
        </div>

        <section className="pc-check" aria-labelledby="pc-check-title">
          <div className="pc-check-head">
            <div><p className="eyebrow">{t('拍完之后', 'AFTER THE TAKE')}</p><h3 id="pc-check-title">{t('检查我的成片', 'Check my shot')}</h3><p>{t('上传你刚拍的照片（视频可截一帧），AI 会对照现场和方案，告诉你下一条怎么改。', 'Upload the shot you just took (for video, a frame grab). The AI compares it with the location and the plan and tells you what to change on the next take.')}</p></div>
            <label><span>{t('我拍的是', 'I was going for')}</span><select value={tried} onChange={(event) => setTried(event.target.value)}>
              {analysis.shots.map((shot, index) => <option key={index} value={index}>{index + 1}. {shot.title}</option>)}
              <option value="other">{t('我自己的想法', 'My own idea')}</option>
            </select></label>
          </div>
          {busy === 'review' ? <p className="pc-wait"><Sparkles size={15} /> {t(`${ai} 正在看你的成片…`, `${ai} is looking at your shot…`)} <Elapsed /></p> : <PhotoPicker onPick={check} language={language} compact cameraLabel={t('拍我的成片', 'Take my shot')} />}
          {session.attempts.map((attempt, index) => <article key={session.attempts.length - index} className="pc-attempt">
            <img src={attempt.image.dataUrl} alt={t('你的成片', 'Your shot')} />
            <div>
              <p className="pc-attempt-head"><span className="pc-score" style={{ '--score': attempt.review.score } as React.CSSProperties}>{attempt.review.score}<small>/10</small></span><span><small>{t(`第 ${session.attempts.length - index} 次`, `Take ${session.attempts.length - index}`)} · {attempt.tried}</small><strong>{attempt.review.verdict}</strong></span></p>
              {attempt.review.working.length > 0 && <p className="pc-keep"><b>{t('保留', 'Keep')}</b>{attempt.review.working.join(t('；', '; '))}</p>}
              <ol className="pc-fixes">{attempt.review.fixes.map((fix) => <li key={fix.issue}><strong>{fix.issue}</strong>{fix.fix}</li>)}</ol>
              <p className="pc-next"><b>{t('下一条', 'Next take')}</b>{attempt.review.next}</p>
            </div>
          </article>)}
        </section>

        <button className="pc-restart" onClick={restart}><RotateCcw size={15} /> {t('换一个地点', 'New location')}</button>
      </section>}
    </main>
  </div>
}
