import { useSyncExternalStore } from 'react'
import { catalogByKey } from './workspaceCatalog'

// Projects live in this browser only. A tiny external store so every section's
// "add to workspace" button and the workspace page stay in sync.
export type WorkspaceItem = { key: string; note: string; addedAt: number }
export type Project = { id: string; name: string; brief: string; items: WorkspaceItem[]; createdAt: number }
type State = { projects: Project[]; activeId: string }

const STORAGE_KEY = 'art-studio-workspace-v1'
const newId = () => Math.random().toString(36).slice(2, 10)
const blankProject = (name: string): Project => ({ id: newId(), name, brief: '', items: [], createdAt: Date.now() })

function load(): State {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as State | null
    if (saved?.projects?.length) {
      const projects = saved.projects.map((project) => ({ ...project, items: project.items.filter((item) => catalogByKey.has(item.key)) }))
      return { projects, activeId: projects.some((p) => p.id === saved.activeId) ? saved.activeId : projects[0].id }
    }
  } catch { /* start fresh */ }
  const first = blankProject('我的作品')
  return { projects: [first], activeId: first.id }
}

let state = load()
const listeners = new Set<() => void>()
function set(next: State) {
  state = next
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* storage full or blocked */ }
  listeners.forEach((listener) => listener())
}
const updateActive = (change: (project: Project) => Project) =>
  set({ ...state, projects: state.projects.map((project) => project.id === state.activeId ? change(project) : project) })

export const workspace = {
  add: (keys: string[]) => updateActive((project) => {
    const fresh = keys.filter((key) => !project.items.some((item) => item.key === key))
    return { ...project, items: [...project.items, ...fresh.map((key) => ({ key, note: '', addedAt: Date.now() }))] }
  }),
  remove: (key: string) => updateActive((project) => ({ ...project, items: project.items.filter((item) => item.key !== key) })),
  toggle: (key: string) => activeProject().items.some((item) => item.key === key) ? workspace.remove(key) : workspace.add([key]),
  setNote: (key: string, note: string) => updateActive((project) => ({ ...project, items: project.items.map((item) => item.key === key ? { ...item, note } : item) })),
  setBrief: (brief: string) => updateActive((project) => ({ ...project, brief })),
  rename: (name: string) => updateActive((project) => ({ ...project, name })),
  create: (name: string) => { const project = blankProject(name); set({ projects: [...state.projects, project], activeId: project.id }) },
  createFrom: (name: string, brief: string, items: { key: string; note: string }[]) => {
    const project = { ...blankProject(name), brief, items: items.filter((item) => catalogByKey.has(item.key)).map((item) => ({ ...item, addedAt: Date.now() })) }
    set({ projects: [...state.projects, project], activeId: project.id })
  },
  select: (id: string) => set({ ...state, activeId: id }),
  delete: (id: string) => {
    const projects = state.projects.filter((project) => project.id !== id)
    if (!projects.length) projects.push(blankProject('我的作品'))
    set({ projects, activeId: projects.some((p) => p.id === state.activeId) ? state.activeId : projects[0].id })
  },
}

function activeProject() { return state.projects.find((project) => project.id === state.activeId)! }
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener) } }

export function useWorkspace() {
  const current = useSyncExternalStore(subscribe, () => state)
  const project = current.projects.find((item) => item.id === current.activeId)!
  return { projects: current.projects, project, has: (key: string) => project.items.some((item) => item.key === key) }
}
