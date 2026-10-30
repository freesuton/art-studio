import { Check, Plus } from 'lucide-react'
import { useWorkspace, workspace } from './workspaceStore'
import './workspace.css'

// "Add to workspace" pill shown on cards in every section.
export default function WorkspaceToggle({ itemKey, language, className = '' }: { itemKey: string; language: 'zh' | 'en'; className?: string }) {
  const { has } = useWorkspace()
  const added = has(itemKey)
  return <button
    type="button"
    className={`ws-toggle ${added ? 'added' : ''} ${className}`}
    aria-pressed={added}
    onClick={(event) => { event.stopPropagation(); workspace.toggle(itemKey) }}
  >
    {added ? <Check size={13} /> : <Plus size={13} />}
    {language === 'en' ? (added ? 'In workspace' : 'Add to workspace') : (added ? '已加入工作台' : '加入工作台')}
  </button>
}
