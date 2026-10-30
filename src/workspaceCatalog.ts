import { sheets, stages } from './data'
import { filmReferences } from './filmReferences'
import { cameraMovements, movementCategories } from './cameraMovementData'
import { motionCategories, motions } from './motionData'
import type { StageId } from './types'

// One flat list of everything a project can collect, across every section of the site.
export type ItemKind = 'film' | 'sheet' | 'camera' | 'motion'
type Text = { zh: string; en: string }
// The workspace mirrors the site's six sections: 00 film references plus the five workflow stages.
export type SectionId = 'samples' | StageId
export const workspaceSections: { id: SectionId; index: string; title: Text; accent: string }[] = [
  { id: 'samples', index: '00', title: { zh: '样片', en: 'Film References' }, accent: '#d8ff42' },
  ...stages.map((stage) => ({ id: stage.id, index: stage.index, title: { zh: stage.title, en: stage.titleEn }, accent: stage.accent })),
]

export type CatalogItem = {
  key: string
  kind: ItemKind
  sectionId: SectionId
  id: string
  title: Text
  section: Text
  summary: Text
  keywords: string
  thumb?: string
  url?: string
}

export const kindLabels: Record<ItemKind, Text> = {
  film: { zh: '参考样片', en: 'Film references' },
  sheet: { zh: '技巧卡片', en: 'Technique sheets' },
  camera: { zh: '运镜', en: 'Camera moves' },
  motion: { zh: '现场动作', en: 'On-set motions' },
}
export const kindOrder: ItemKind[] = ['film', 'sheet', 'camera', 'motion']

const collectionNames: Record<string, Text> = {
  everyday: { zh: '生活切片', en: 'Everyday Cinema' },
  womenNature: { zh: '女性与自然', en: 'Women & Nature' },
  fashion: { zh: '时尚影像', en: 'Fashion Films' },
  exploration: { zh: '探索与叙事', en: 'Exploration & Story' },
}

const words = (...parts: (string | string[] | undefined)[]) => parts.flat().filter(Boolean).join(' ').toLowerCase()

export const catalog: CatalogItem[] = [
  ...filmReferences.map((film): CatalogItem => ({
    key: `film:${film.id}`, kind: 'film', sectionId: 'samples', id: film.id,
    title: { zh: film.titleZh, en: film.title },
    section: { zh: `样片 · ${collectionNames[film.collection].zh}`, en: `Film · ${collectionNames[film.collection].en}` },
    summary: { zh: film.synopsis, en: `${film.source} · ${film.year} · ${film.category}` },
    keywords: words(film.title, film.titleZh, film.source, film.category, film.synopsis, film.watchFor, collectionNames[film.collection].zh, collectionNames[film.collection].en),
    thumb: film.thumbnailUrl, url: film.url,
  })),
  ...sheets.map((sheet): CatalogItem => {
    const stage = stages.find((item) => item.id === sheet.stage)!
    return {
      key: `sheet:${sheet.id}`, kind: 'sheet', sectionId: sheet.stage, id: sheet.id,
      title: { zh: sheet.title, en: sheet.titleEn },
      section: { zh: `${stage.index} ${stage.title} · ${sheet.category}`, en: `${stage.index} ${stage.titleEn}` },
      summary: { zh: sheet.summary, en: `A practical field guide to ${sheet.titleEn.toLowerCase()}.` },
      keywords: words(sheet.title, sheet.titleEn, sheet.category, sheet.tags, sheet.summary, sheet.purpose, sheet.usage, stage.title, stage.titleEn),
    }
  }),
  ...cameraMovements.map((move): CatalogItem => {
    const category = movementCategories.find((item) => item.id === move.category)!
    return {
      key: `camera:${move.id}`, kind: 'camera', sectionId: 'prepare', id: move.id,
      title: move.name,
      section: { zh: `运镜 · ${category.zh}`, en: `Camera · ${category.en}` },
      summary: move.purpose,
      keywords: words(move.name.zh, move.name.en, move.purpose.zh, move.purpose.en, move.fashion.zh, move.fashion.en, category.zh, category.en, move.lens),
    }
  }),
  ...motions.map((motion): CatalogItem => {
    const category = motionCategories.find((item) => item.id === motion.category)!
    return {
      key: `motion:${motion.id}`, kind: 'motion', sectionId: 'shoot', id: motion.id,
      title: { zh: motion.title, en: motion.sourceTitle },
      section: { zh: `动作 · ${category.name}`, en: `Motion · ${category.en}` },
      summary: { zh: motion.cue, en: motion.sourceTitle },
      keywords: words(motion.title, motion.sourceTitle, motion.mood, motion.environment, motion.cue, motion.watchFor, motion.framing, category.name, category.en),
      thumb: motion.poster, url: motion.sourceUrl,
    }
  }),
]

export const catalogByKey = new Map(catalog.map((item) => [item.key, item]))
