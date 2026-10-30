import Anthropic from '@anthropic-ai/sdk'
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod'
import { z } from 'zod'
import { catalog, catalogByKey, kindOrder } from './workspaceCatalog'
import type { CatalogItem, ItemKind } from './workspaceCatalog'

export type Pick = { key: string; reason: string }
export type Picks = { summary: string; picks: Pick[] }
type Language = 'zh' | 'en'

// ---------- Built-in matching: keywords plus a small bilingual synonym map ----------

const synonymGroups = [
  ['海', '海边', '海滩', '海岸', '海洋', '水', 'sea', 'beach', 'ocean', 'coast', 'water', 'swim'],
  ['慢', '缓慢', '安静', '平静', '沉静', '静', 'slow', 'calm', 'quiet', 'still'],
  ['快', '节奏', '轻快', '动感', 'fast', 'rhythm', 'energy', 'dynamic'],
  ['时尚', '服装', '造型', '穿搭', '裙', 'fashion', 'wardrobe', 'outfit', 'styling', 'dress'],
  ['梦', '梦幻', '诗意', '柔', 'dreamy', 'dream', 'poetic', 'soft'],
  ['城市', '街头', '街', 'city', 'street', 'urban'],
  ['自然', '森林', '树林', '草地', '花', '花园', 'nature', 'forest', 'field', 'garden', 'flower'],
  ['车', '公路', '开车', 'car', 'road', 'drive'],
  ['情绪', '亲密', '孤独', '情感', '内心', 'emotion', 'intimate', 'lonely', 'feeling'],
  ['走', '行走', '散步', 'walk', 'walking'],
  ['光', '逆光', '阳光', '日落', '黄昏', 'light', 'backlight', 'sunset', 'golden'],
  ['夜', '夜晚', 'night'],
  ['室内', '窗', '家', 'interior', 'window', 'home', 'room'],
  ['自由', '奔跑', '风', 'free', 'freedom', 'wind', 'run'],
  ['复古', '怀旧', '胶片', 'retro', 'vintage', 'nostalgic'],
  ['剪辑', '转场', '剪', 'edit', 'transition', 'cut'],
  ['声音', '音乐', '声', 'sound', 'music', 'audio'],
  ['故事', '叙事', 'story', 'narrative'],
  ['人像', '肖像', '脸', '特写', 'portrait', 'face', 'close-up'],
  ['航拍', '无人机', 'drone', 'aerial'],
  ['手机', 'phone'],
  ['日常', '生活', '早晨', 'everyday', 'daily', 'morning', 'routine'],
]
const perKind: Record<ItemKind, number> = { film: 4, sheet: 5, camera: 5, motion: 4 }

function expand(query: string) {
  const terms = query.toLowerCase().split(/[\s,，、;；。.!！?？/|]+/).filter(Boolean)
  const weighted = new Map<string, number>()
  const put = (term: string, weight: number) => weighted.set(term, Math.max(weighted.get(term) ?? 0, weight))
  for (const term of terms) {
    put(term, 3)
    // Chinese phrases rarely appear verbatim; their 2-character pieces often do.
    if (/[一-鿿]/.test(term) && term.length > 2) for (let i = 0; i < term.length - 1; i++) put(term.slice(i, i + 2), 1.5)
    for (const group of synonymGroups) if (group.some((word) => term.includes(word) || (word.length > 1 && word.includes(term)))) group.forEach((word) => put(word, 1))
  }
  return weighted
}

export function localPicks(query: string, language: Language): Picks {
  const weighted = expand(query)
  const scored = catalog.map((item) => {
    const hits = [...weighted].filter(([term]) => item.keywords.includes(term))
    return { item, hits, score: hits.reduce((sum, [, weight]) => sum + weight, 0) }
  }).filter((entry) => entry.score > 0)
  const picks = kindOrder.flatMap((kind) => scored.filter((entry) => entry.item.kind === kind).sort((a, b) => b.score - a.score).slice(0, perKind[kind]))
  return {
    summary: language === 'en' ? `Matched by keywords in your idea (${picks.length} picks).` : `根据你写下的关键词匹配到 ${picks.length} 项。`,
    picks: picks.map(({ item, hits }) => ({ key: item.key, reason: (language === 'en' ? 'Matches: ' : '匹配：') + hits.sort((a, b) => b[1] - a[1]).slice(0, 4).map(([term]) => term).join('、') })),
  }
}

// ---------- Claude: reads the whole catalog and explains each pick ----------

const PicksSchema = z.object({
  summary: z.string(),
  picks: z.array(z.object({ key: z.string(), reason: z.string() })),
})

const catalogLine = (item: CatalogItem) => `${item.key} | ${item.title.zh} / ${item.title.en} | ${item.section.zh} | ${item.summary.zh.slice(0, 90)}`
const SYSTEM = `You help a solo filmmaker plan a short art or fashion film using the reference library of their field-guide site.
Given their idea, choose the library items that would most help them make it:
- 2-4 film references worth studying (kind "film")
- 3-6 technique sheets, spread across the stages they will need (kind "sheet")
- 3-6 camera movements (kind "camera")
- 2-5 on-set motions to direct the subject (kind "motion")
Use only keys that appear exactly in the catalog below. For each pick, write one short sentence on how to use it for this specific idea, in the same language the idea is written in. In "summary", describe the overall visual approach in one or two sentences, also in that language.

Catalog (key | title | section | description):
${catalog.map(catalogLine).join('\n')}`

export async function claudePicks(apiKey: string, idea: string): Promise<Picks> {
  // The key is the user's own and stays in their browser, so a direct browser call is acceptable here.
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
  const response = await client.beta.messages.parse({
    model: 'claude-opus-5-5',
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'medium', format: betaZodOutputFormat(PicksSchema) },
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: idea }],
  })
  if (response.stop_reason === 'refusal') throw new Error('Claude declined this request. Try rewording your idea.')
  const output = response.parsed_output
  if (!output) throw new Error('Claude returned an unreadable answer. Please try again.')
  return { summary: output.summary, picks: output.picks.filter((pick, i, all) => catalogByKey.has(pick.key) && all.findIndex((p) => p.key === pick.key) === i) }
}

export function describeError(error: unknown, language: Language) {
  const en = language === 'en'
  if (error instanceof Anthropic.AuthenticationError) return en ? 'That API key was rejected. Check it in AI settings.' : 'API Key 无效，请在 AI 设置里检查。'
  if (error instanceof Anthropic.PermissionDeniedError) return en ? 'This API key cannot use this model.' : '这个 API Key 没有使用该模型的权限。'
  if (error instanceof Anthropic.RateLimitError) return en ? 'Rate limited. Wait a moment and try again.' : '请求太频繁，请稍后再试。'
  if (error instanceof Anthropic.APIConnectionError) return en ? 'Could not reach Claude. Check your connection.' : '无法连接到 Claude，请检查网络。'
  if (error instanceof Anthropic.APIError) return `${en ? 'Claude API error' : 'Claude API 错误'} ${error.status ?? ''}: ${error.message}`
  return error instanceof Error ? error.message : String(error)
}
