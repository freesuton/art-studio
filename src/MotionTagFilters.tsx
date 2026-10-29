import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import { matchesMotionTags, tagGroups } from './motionTags'
import type { TagGroupId, TagSelection } from './motionTags'
import type { Motion } from './motionData'

type Props = {
  all: Motion[]; base: Motion[]; selection: TagSelection; active: TagGroupId; open: boolean;
  onActive: (id: TagGroupId) => void; onOpen: () => void; onToggle: (group: TagGroupId, value: string) => void; onClear: () => void;
}
export default function MotionTagFilters({ all, base, selection, active, open, onActive, onOpen, onToggle, onClear }: Props) {
  const count = Object.values(selection).reduce((sum, values) => sum + (values?.length || 0), 0)
  const group = tagGroups.find(g => g.id === active) || tagGroups[0]
  const available = base.filter(m => matchesMotionTags(m, selection, group.id))
  const options = [...new Set(all.flatMap(m => m.tags[group.id]))].map(value => ({ value, count: available.filter(m => m.tags[group.id].includes(value)).length })).filter(option => option.count > 0 || selection[group.id]?.includes(option.value))
  const selected = tagGroups.flatMap(g => (selection[g.id] || []).map(value => ({ group: g, value })))
  return <section className="motion-tag-filter" id="motion-tag-filters" aria-label="摄影标签筛选">
    <button className="motion-tag-filter-toggle" aria-expanded={open} aria-controls="motion-tag-filter-panel" onClick={onOpen}>
      <span><SlidersHorizontal size={17}/><strong>摄影标签</strong><small>{tagGroups.length} 个维度{count > 0 ? ` · 已选 ${count}` : ' · 可组合筛选'}</small></span><ChevronDown size={16} className={open ? 'expanded' : ''}/>
    </button>
    {open && <div id="motion-tag-filter-panel" className="motion-tag-filter-panel">
      <div className="motion-facet-nav" role="group" aria-label="选择标签维度">{tagGroups.map(g => <button key={g.id} aria-pressed={g.id === active} onClick={() => onActive(g.id)}>{g.label}{!!selection[g.id]?.length && <span>{selection[g.id]!.length}</span>}</button>)}</div>
      <div className="motion-facet-heading"><span>{group.label}<small>{group.kind === 'suggestion' ? '复拍建议' : '画面内容与氛围'}</small></span><p>同一维度满足任一项，跨维度同时满足</p></div>
      {!options.length && <p className="motion-no-facets">当前条件下暂无可选标签，可先移除其它筛选。</p>}
      <div className="motion-facet-options" role="group" aria-label={`${group.label}标签`}>{options.map(option => <button key={option.value} aria-label={`${group.label}：${option.value}（${option.count}）`} aria-pressed={selection[group.id]?.includes(option.value) || false} disabled={!option.count && !selection[group.id]?.includes(option.value)} onClick={() => onToggle(group.id, option.value)}>{option.value}<span>{option.count}</span></button>)}</div>
      <p className="motion-tag-method">画面与氛围按内容整理；带“复拍”的标签是练习建议，不代表原片设备、焦段或曝光参数。未确认的信息不补填。</p>
    </div>}
    {!!selected.length && <div className="motion-active-tags" aria-label="已选摄影标签">{selected.map(({ group: g, value }) => <button key={`${g.id}:${value}`} aria-label={`移除${g.label}筛选：${value}`} onClick={() => onToggle(g.id, value)}><span>{g.label}：</span>{value}<X size={12}/></button>)}<button className="motion-clear-tags" onClick={onClear}>清空标签</button></div>}
  </section>
}
