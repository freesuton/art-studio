export type StageId = 'concept' | 'prepare' | 'shoot' | 'edit' | 'publish'

export type VisualKind =
  | 'beats'
  | 'objective'
  | 'motif'
  | 'aspect'
  | 'palette'
  | 'composition'
  | 'lighting'
  | 'production'
  | 'shot-size'
  | 'angle'
  | 'lens'
  | 'focus'
  | 'movement'
  | 'blocking'
  | 'coverage'
  | 'axis'
  | 'exposure'
  | 'room-tone'
  | 'cut-action'
  | 'jl-cut'
  | 'sound-layers'
  | 'color-match'
  | 'subtitles'
  | 'export'
  | 'brief'
  | 'outline'
  | 'shot-list'
  | 'shoot-plan'
  | 'shoot-log'
  | 'release'
  | 'review'

export type CheatSheet = {
  id: string
  title: string
  titleEn: string
  stage: StageId
  category: string
  tags: string[]
  summary: string
  purpose: string[]
  usage: string[]
  steps: string[]
  mistakes: string[]
  related: string[]
  visual: VisualKind
  accent: string
}

export type Stage = {
  id: StageId
  index: string
  title: string
  titleEn: string
  subtitle: string
  output: string
  outputEn: string
  tasks: string[]
  accent: string
}
