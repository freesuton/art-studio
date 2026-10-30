import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronsDownUp, ChevronsUpDown, ClipboardCopy, ExternalLink, Film, KeyRound, Plus, Sparkles, Trash2, Wand2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { catalogByKey, workspaceSections } from './workspaceCatalog'
import type { CatalogItem, SectionId } from './workspaceCatalog'
import { useWorkspace, workspace } from './workspaceStore'
import { claudePicks, describeError, localPicks } from './workspaceAi'
import type { Picks } from './workspaceAi'
import { breakdowns } from './referenceBreakdowns'
import type { Breakdown } from './referenceBreakdowns'
import { filmReferences } from './filmReferences'
import './workspace.css'

type Language = 'zh' | 'en'
const KEY_STORAGE = 'art-studio-claude-key'
const readKey = () => { try { return localStorage.getItem(KEY_STORAGE) || '' } catch { return '' } }
// Sections start collapsed; only the ones the viewer opens are remembered.
const EXPANDED_STORAGE = 'art-studio-workspace-expanded'
const readExpanded = (): SectionId[] => { try { const saved = JSON.parse(localStorage.getItem(EXPANDED_STORAGE) || '[]'); return Array.isArray(saved) ? saved : [] } catch { return [] } }

function ItemThumb({ item }: { item: CatalogItem }) {
  return item.thumb ? <img className="ws-thumb" src={item.thumb} alt="" loading="lazy" /> : <span className={`ws-thumb ws-thumb-${item.kind}`} aria-hidden="true">{item.title.zh.slice(0, 2)}</span>
}

function SectionBadge({ index, accent }: { index: string; accent: string }) {
  return <span className="ws-badge" style={{ background: accent }}>{index}</span>
}

export default function Workspace({ language, setLanguage }: { language: Language; setLanguage: (language: Language) => void }) {
  const en = language === 'en'
  const t = (zh: string, enText: string) => en ? enText : zh
  const navigate = useNavigate()
  const { projects, project, has } = useWorkspace()
  const [query, setQuery] = useState('')
  const [apiKey, setApiKey] = useState(readKey)
  const [keyDraft, setKeyDraft] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [result, setResult] = useState<(Picks & { source: 'local' | 'claude' }) | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const idea = query.trim() || project.brief.trim()
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const sections = useMemo(() => workspaceSections.map((section) => ({
    ...section, entries: project.items.map((entry) => ({ entry, item: catalogByKey.get(entry.key)! })).filter(({ item }) => item?.sectionId === section.id),
  })), [project.items])

  const runLocal = () => { setError(''); setResult({ ...localPicks(idea, language), source: 'local' }) }
  const runClaude = async () => {
    if (!apiKey) { setSettingsOpen(true); return }
    setLoading(true); setError('')
    try { setResult({ ...(await claudePicks(apiKey, idea)), source: 'claude' }) }
    catch (err) { setError(describeError(err, language)) }
    finally { setLoading(false) }
  }
  const saveKey = () => {
    const key = keyDraft.trim()
    try { localStorage.setItem(KEY_STORAGE, key) } catch { /* blocked storage: keep for this session */ }
    setApiKey(key); setKeyDraft(''); setSettingsOpen(false)
  }
  const forgetKey = () => { try { localStorage.removeItem(KEY_STORAGE) } catch { /* ignore */ } setApiKey('') }

  const exportText = () => {
    const lines = [`# ${project.name}`, '']
    if (project.brief) lines.push(`${t('创作想法', 'Idea')}: ${project.brief}`, '')
    for (const section of sections) {
      if (!section.entries.length) continue
      lines.push(`## ${section.index} ${section.title[language]}`)
      for (const { entry, item } of section.entries) lines.push(`- ${item.title[language]} (${item.section[language]})${entry.note ? ` — ${entry.note}` : ''}`)
      lines.push('')
    }
    void navigator.clipboard.writeText(lines.join('\n')).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800) })
  }
  const newProject = () => {
    const name = window.prompt(t('新作品的名字', 'Name for the new project'), t('新作品', 'New project'))
    if (name?.trim()) workspace.create(name.trim())
  }
  const deleteProject = () => {
    if (window.confirm(t(`删除「${project.name}」？此操作无法撤销。`, `Delete "${project.name}"? This cannot be undone.`))) workspace.delete(project.id)
  }
  const browse = (id: SectionId) => navigate('/', { state: { stage: id } })
  const [expanded, setExpandedState] = useState<SectionId[]>(readExpanded)
  const setExpanded = (next: SectionId[]) => { setExpandedState(next); try { localStorage.setItem(EXPANDED_STORAGE, JSON.stringify(next)) } catch { /* remembered for this visit only */ } }
  const toggleSection = (id: SectionId) => setExpanded(expanded.includes(id) ? expanded.filter((item) => item !== id) : [...expanded, id])
  const allCollapsed = expanded.length === 0
  const startFrom = (breakdown: Breakdown) => {
    const timeline = breakdown.shots.map((shot) => `${shot.time}  ${shot[language]}`).join('\n')
    workspace.createFrom(breakdown.title[language], `${breakdown.intro[language]}\n\n${t('镜头时间线', 'Shot timeline')}:\n${timeline}`, breakdown.items.map((item) => ({ key: item.key, note: item.note[language] })))
    setResult(null)
    window.requestAnimationFrame(() => document.querySelector('.ws-board-head')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const pickSections = result ? workspaceSections.map((section) => ({ ...section, picks: result.picks.filter((pick) => catalogByKey.get(pick.key)?.sectionId === section.id) })).filter((section) => section.picks.length) : []
  const unadded = result ? result.picks.filter((pick) => !has(pick.key)).map((pick) => pick.key) : []

  return <div className="ws-page">
    <nav className="ws-topbar">
      <button className="ws-home" onClick={() => navigate('/')}><ArrowLeft size={16} /> {t('返回手册', 'Back to guide')}</button>
      <span className="ws-topbar-title">{t('短片现场手册 · 工作台', 'Short Film Field Guide · Workspace')}</span>
      <div className="ws-lang" role="group" aria-label="Language">
        <button aria-pressed={language === 'zh'} onClick={() => setLanguage('zh')}>中文</button>
        <button aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>English</button>
      </div>
    </nav>

    <main className="ws" aria-labelledby="ws-title">
      <header className="ws-header">
        <div>
          <p className="eyebrow">MY WORKSPACE / {t('我的工作台', 'PROJECT BOARD')}</p>
          <input id="ws-title" className="ws-name" value={project.name} onChange={(event) => workspace.rename(event.target.value)} aria-label={t('作品名称', 'Project name')} />
          <p>{t('按手册的六个板块整理这件作品要用的样片、技巧、运镜和动作。在各板块点「加入工作台」，或让 AI 根据你的想法帮你挑。', "Organize the films, techniques, camera moves and motions for this piece by the guide's six sections. Use \"Add to workspace\" in any section, or let AI pick from your idea.")}</p>
        </div>
        <div className="ws-projects">
          <select value={project.id} onChange={(event) => workspace.select(event.target.value)} aria-label={t('切换作品', 'Switch project')}>
            {projects.map((item) => <option key={item.id} value={item.id}>{item.name || t('未命名', 'Untitled')} · {item.items.length}</option>)}
          </select>
          <button onClick={newProject}><Plus size={14} /> {t('新建', 'New')}</button>
          <button onClick={deleteProject} aria-label={t('删除这个作品', 'Delete this project')}><Trash2 size={14} /></button>
        </div>
      </header>

      <div className="ws-top">
        <label className="ws-brief">
          <span>{t('创作想法', 'Your idea')}</span>
          <textarea value={project.brief} onChange={(event) => workspace.setBrief(event.target.value)} rows={5}
            placeholder={t('例如：夏日海边的时尚短片，慢节奏，自由、梦幻，白裙，黄昏逆光，一个人沿海岸散步。', 'e.g. A summer seaside fashion film, slow and dreamy, white dress, golden-hour backlight, one woman walking the coast.')} />
        </label>

        <div className="ws-ai">
          <div className="ws-ai-head"><span><Sparkles size={15} /> {t('AI 帮我挑选', 'Let AI choose')}</span><button className="ws-link" onClick={() => setSettingsOpen(!settingsOpen)}><KeyRound size={13} /> {t('AI 设置', 'AI settings')}</button></div>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('输入关键词，留空则使用创作想法', 'Type keywords, or leave empty to use your idea')} onKeyDown={(event) => { if (event.key === 'Enter' && idea) runLocal() }} />
          <div className="ws-ai-actions">
            <button onClick={runLocal} disabled={!idea}><Wand2 size={14} /> {t('快速匹配', 'Quick match')}</button>
            <button className="primary" onClick={runClaude} disabled={!idea || loading}><Sparkles size={14} /> {loading ? t('Claude 思考中…', 'Claude is thinking…') : t('问 Claude', 'Ask Claude')}</button>
          </div>
          <p className="ws-hint">{t('快速匹配：免费、即时，按关键词找。问 Claude：理解整段想法并说明理由，需要你自己的 Anthropic API Key（按次计费）。', 'Quick match is free and instant, by keyword. Ask Claude reads your whole idea and explains each pick; it uses your own Anthropic API key (billed per request).')}</p>
          {settingsOpen && <div className="ws-settings">
            {apiKey ? <p>{t('已保存 API Key（仅存在这个浏览器）。', 'API key saved (in this browser only).')} <button className="ws-link" onClick={forgetKey}>{t('移除', 'Remove')}</button></p> : <p>{t('粘贴你的 Anthropic API Key。它只保存在这个浏览器里，直接从浏览器发送给 Anthropic。', 'Paste your Anthropic API key. It is stored only in this browser and sent straight to Anthropic.')}</p>}
            <div><input type="password" value={keyDraft} onChange={(event) => setKeyDraft(event.target.value)} placeholder="sk-ant-..." autoComplete="off" /><button onClick={saveKey} disabled={!keyDraft.trim()}>{t('保存', 'Save')}</button></div>
          </div>}
          {error && <p className="ws-error" role="alert">{error}</p>}
        </div>
      </div>

      <section className="ws-refs" aria-labelledby="ws-refs-title">
        <h3 id="ws-refs-title"><Film size={16} /> {t('从范例开始', 'Start from a reference')}</h3>
        {breakdowns.map((breakdown) => { const film = filmReferences.find((item) => item.id === breakdown.filmId)!; return <article key={breakdown.id} className="ws-ref">
          <img src={film.thumbnailUrl} alt="" loading="lazy" />
          <div>
            <strong>{breakdown.title[language]}</strong>
            <p>{breakdown.intro[language]}</p>
            <details>
              <summary>{t(`镜头拆解 · ${breakdown.shots.length} 个镜头`, `Shot breakdown · ${breakdown.shots.length} shots`)}</summary>
              <ol>{breakdown.shots.map((shot) => <li key={shot.time}><time>{shot.time}</time>{shot[language]}</li>)}</ol>
            </details>
            <div className="ws-ref-actions">
              <button className="primary" onClick={() => startFrom(breakdown)}><Plus size={14} /> {t(`创建仿拍项目（${breakdown.items.length} 项）`, `Create remake project (${breakdown.items.length} items)`)}</button>
              <a href={film.url} target="_blank" rel="noopener noreferrer">{t('观看原片', 'Watch original')} <ExternalLink size={12} /></a>
            </div>
          </div>
        </article> })}
      </section>

      {result && <section className="ws-picks" aria-label={t('推荐结果', 'Suggestions')}>
        <div className="ws-picks-head">
          <div><p className="eyebrow">{result.source === 'claude' ? 'CLAUDE' : 'QUICK MATCH'} · {result.picks.length}</p><p>{result.summary}</p></div>
          <div>{unadded.length > 0 && <button onClick={() => workspace.add(unadded)}><Plus size={14} /> {t(`全部加入（${unadded.length}）`, `Add all (${unadded.length})`)}</button>}<button aria-label={t('关闭推荐', 'Close suggestions')} onClick={() => setResult(null)}><X size={14} /></button></div>
        </div>
        {pickSections.length ? pickSections.map((section) => <div key={section.id} className="ws-pick-group">
          <h4><SectionBadge index={section.index} accent={section.accent} /> {section.title[language]}</h4>
          <ul>{section.picks.map((pick) => { const item = catalogByKey.get(pick.key)!; const added = has(pick.key); return <li key={pick.key}>
            <ItemThumb item={item} />
            <div><strong>{item.title[language]}</strong><small>{item.section[language]}</small><p>{pick.reason}</p></div>
            <button className={added ? 'added' : ''} onClick={() => workspace.toggle(pick.key)} aria-pressed={added} aria-label={added ? t('移出工作台', 'Remove') : t('加入工作台', 'Add')}>{added ? <Check size={14} /> : <Plus size={14} />}</button>
          </li> })}</ul>
        </div>) : <p className="ws-empty-note">{t('没有找到匹配项。换几个词试试，比如：海边、慢、梦幻、城市、推近。', 'Nothing matched. Try other words, such as seaside, slow, dreamy, city, push-in.')}</p>}
      </section>}

      <div className="ws-board-head">
        <h3>{t('六个板块', 'Six sections')} <span>{project.items.length}</span></h3>
        <div className="ws-board-actions">
        <button onClick={() => setExpanded(allCollapsed ? workspaceSections.map((section) => section.id) : [])}>{allCollapsed ? <ChevronsUpDown size={14} /> : <ChevronsDownUp size={14} />} {allCollapsed ? t('全部展开', 'Expand all') : t('全部收起', 'Collapse all')}</button>
        {project.items.length > 0 && <button onClick={exportText}>{copied ? <Check size={14} /> : <ClipboardCopy size={14} />} {copied ? t('已复制', 'Copied') : t('复制为清单', 'Copy as list')}</button>}
        </div>
      </div>

      <div className="ws-sections">
        {sections.map((section) => { const isCollapsed = !expanded.includes(section.id); return <section key={section.id} className={`ws-section ${isCollapsed ? 'collapsed' : ''}`} style={{ '--accent': section.accent } as React.CSSProperties} aria-labelledby={`ws-section-${section.id}`}>
          <header>
            <h4 id={`ws-section-${section.id}`}>
              <button className="ws-section-toggle" aria-expanded={!isCollapsed} aria-controls={`ws-section-body-${section.id}`} onClick={() => toggleSection(section.id)}>
                <SectionBadge index={section.index} accent={section.accent} />
                <span>{section.title[language]}</span>
                <span className="ws-count">{section.entries.length}</span>
                <ChevronDown className="ws-chevron" size={16} aria-hidden="true" />
              </button>
            </h4>
            <button className="ws-browse" onClick={() => browse(section.id)}>{t('去挑选', 'Browse')} <ArrowRight size={13} /></button>
          </header>
          <div className="ws-section-body" id={`ws-section-body-${section.id}`} hidden={isCollapsed}>
          {section.entries.length ? section.entries.map(({ entry, item }) => <article key={entry.key} className="ws-item">
            <div className="ws-item-top">
              <ItemThumb item={item} />
              <div><strong>{item.title[language]}</strong><small>{item.section[language]}</small></div>
              <button aria-label={t('移出工作台', 'Remove from workspace')} onClick={() => workspace.remove(entry.key)}><X size={14} /></button>
            </div>
            <p>{item.summary[language]}</p>
            <textarea value={entry.note} onChange={(event) => workspace.setNote(entry.key, event.target.value)} rows={2} placeholder={t('我打算怎么用…', 'How I will use it…')} />
            {item.kind === 'sheet' ? <button className="ws-open" onClick={() => navigate(`/workspace/sheet/${item.id}`)}>{t('打开卡片', 'Open sheet')} <ArrowRight size={13} /></button>
              : item.url && <a className="ws-open" href={item.url} target="_blank" rel="noopener noreferrer">{t('查看原片', 'View source')} <ExternalLink size={12} /></a>}
          </article>) : <p className="ws-section-empty">{t('还没有内容。', 'Nothing here yet.')}</p>}
          </div>
        </section> })}
      </div>
    </main>
  </div>
}
