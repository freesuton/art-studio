import Anthropic from '@anthropic-ai/sdk'
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod'
import OpenAI from 'openai'
import { zodTextFormat } from 'openai/helpers/zod'
import { z } from 'zod'
import type { Provider } from './aiKeys'
import { catalog, catalogByKey } from './workspaceCatalog'

type Language = 'zh' | 'en'
export type CaptureMode = 'photo' | 'video'
export type CoachSubject = 'person' | 'detail' | 'scene'
export type CoachBrief = { mode: CaptureMode; subject: CoachSubject; goal: string; gear: string }
export type PreparedImage = { dataUrl: string; data: string; width: number; height: number }

// ---------- What Claude sends back ----------

const Point = z.object({ x: z.number(), y: z.number() })
const Box = z.object({ x: z.number(), y: z.number(), w: z.number(), h: z.number() })

const SceneSchema = z.object({
  headline: z.string(),
  scene: z.object({
    light: z.string(),
    mood: z.string(),
    strengths: z.array(z.string()),
    problems: z.array(z.string()),
  }),
  light_plan: z.object({ best_time: z.string(), tips: z.array(z.string()) }),
  shots: z.array(z.object({
    title: z.string(),
    framing: z.string(),
    lens_mm: z.number(),
    settings: z.object({ aperture: z.string(), shutter: z.string(), iso: z.string(), white_balance: z.string() }),
    camera_move: z.string().nullable(),
    camera_position: z.string(),
    subject_direction: z.string(),
    why: z.string(),
    place: Point.nullable(),
    frame: Box.nullable(),
    example: z.string(),
    search: z.string(),
  })),
  quick_fixes: z.array(z.string()),
  watch_out: z.array(z.string()),
  related: z.array(z.string()),
})
export type SceneAnalysis = z.infer<typeof SceneSchema>
export type ShotIdea = SceneAnalysis['shots'][number]

const ReviewSchema = z.object({
  score: z.number(),
  verdict: z.string(),
  working: z.array(z.string()),
  fixes: z.array(z.object({ issue: z.string(), fix: z.string() })),
  next: z.string(),
})
export type ShotReview = z.infer<typeof ReviewSchema>

// ---------- Prompt ----------

// Only on-set items are useful here: camera moves and subject motions.
const onSetCatalog = catalog.filter((item) => item.kind === 'camera' || item.kind === 'motion')
const SYSTEM = `You are an on-location photography and cinematography coach for a solo creator who makes fashion and art photos and short films, usually with one model, often outdoors.
The creator sends a photo of the location exactly as they see it right now, plus what they want to make. Read the scene like a director of photography, then give advice they can act on in the next few minutes without leaving the spot.

How to read the scene
- Ground every point in what is visible in the photo. Name concrete things ("the bright gap between the two trunks on the right", "the bench in the lower left"). Never invent things that are not in frame. If something important cannot be judged from the photo (for example where the sun is behind the camera), say how to check it on the spot.
- Start with light: direction, hardness, colour, contrast, and how it will change over the next hour.
- Note what already works and what spoils the frame (clutter, bright hot spots, mergers, tilted horizons, distracting colours).

Shots
- Aim for frames with a strong sense of atmosphere, like stills from a high-end fashion film: motivated light (backlight, side light, light through leaves or haze), depth built from foreground, subject and background layers, a clear colour palette, and negative space. Say what makes each shot cinematic and how to get it here, not just where to stand.
- Give 3 to 5 distinct shots for this location, strongest first, mixing sizes: at least one wide that uses the environment, one medium, and one close or detail.
- When the subject is a person, favour techniques that show beauty without depending on the face: backlight and rim light, shooting through foreground leaves or grass, silhouettes, hands, hair and fabric moving, walking away, profiles, small figure in a big landscape. Make the direction to the model specific and easy to say out loud.
- Give concrete numbers for the creator's gear. If no gear is given, assume a full-frame mirrorless camera with 35mm, 50mm and 85mm primes. For video, keep the shutter at about double the frame rate, give the frame rate, suggest ND when the aperture needs it, and give one camera move (camera_move). For photos, camera_move is null.
- place: where the subject should stand in this photo, as fractions of the photo's width and height measured from the top-left (0 to 1). Use null when the spot is outside the frame.
- frame: the rough part of this photo that the shot's composition covers if taken from about the same vantage point, as fractions from the top-left (x, y, w, h). Use null when the shot needs a clearly different vantage point, and say where to move in camera_position.

- example: the key of the one motion clip in the catalog below (a key starting with "motion:") that looks most like this shot, so the creator can see a real example of it. Prefer a clip with a similar framing, pose and kind of place. Use "" only when nothing is close.

- search: a 4 to 8 word English search query for stock footage that looks like this shot at its most cinematic. Name the subject, action and place, then the light and atmosphere that make it beautiful, in the words videographers tag their clips with (for example "cinematic woman walking poppy field golden hour backlight", "silhouette woman misty forest morning sun rays"). Always write it in English, even when replying in Chinese.

Everything else
- quick_fixes: small changes that improve the current view straight away (step left, lower the camera, wait for the cloud).
- watch_out: practical or safety issues that are actually visible. An empty list is fine.
- related: 2 to 4 keys from the catalog below that would help with these shots. Use only keys that appear exactly in it.
- Write every text field in the language the creator asks for. Be concise and specific; use working photographer vocabulary, not general praise.

Catalog (key | title | section | description):
${onSetCatalog.map((item) => `${item.key} | ${item.title.zh} / ${item.title.en} | ${item.section.en} | ${item.summary.en.slice(0, 90)}`).join('\n')}`

const REVIEW = `Now the creator has taken a shot in this location and wants feedback before trying again.
Compare it with the scene and the plan above. Judge it as a working photographer would on set.
- score: 1 to 10 for how close it is to a strong, finished image for this goal.
- verdict: one sentence.
- working: what to keep.
- fixes: the 1 to 4 changes that would most improve the next take, most important first, each a concrete action (where to move, what to tell the model, which setting to change).
- next: the single thing to do on the very next take.
Write in the same language as before.`

const subjectText: Record<CoachSubject, string> = {
  person: 'a model (a person, usually a woman) in this location',
  detail: 'outfit and product details (fabric, accessories, hands) in this location',
  scene: 'the location itself, with no one in it',
}
function briefText(brief: CoachBrief, language: Language) {
  return [
    `Making: ${brief.mode === 'video' ? 'video (a short film)' : 'photos'} of ${subjectText[brief.subject]}.`,
    `Gear: ${brief.gear.trim() || 'not given'}.`,
    `Goal: ${brief.goal.trim() || 'not given; suggest what suits the place'}.`,
    `Reply in ${language === 'en' ? 'English' : 'Simplified Chinese'}.`,
  ].join('\n')
}

// A conversation in a form either provider can take.
// An image is a data URL (the creator's photos) or a web address (stock thumbnails).
type Part = { type: 'text'; text: string } | { type: 'image'; src: string }
type Turn = { role: 'user'; parts: Part[] } | { role: 'assistant'; text: string }
const isData = (src: string) => src.startsWith('data:')
export type Engine = { provider: Provider; apiKey: string }
// OpenAI's cheapest current model ($0.10 / $0.50 per 1M tokens), with image input and structured outputs.
export const OPENAI_MODEL = 'gpt-6-luna'
const declined = 'The AI declined to analyse this photo. Try a different one.'
const unreadable = 'The AI returned an unreadable answer. Please try again.'

// Both keys are the viewer's own and stay in their browser, so direct browser calls are acceptable here.
async function askClaude<T extends z.ZodType>(apiKey: string, schema: T, turns: Turn[], system: string): Promise<z.infer<T>> {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
  const response = await client.beta.messages.parse({
    model: 'claude-opus-5-5',
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    thinking: { type: 'adaptive' },
    output_config: { effort: 'medium', format: betaZodOutputFormat(schema) },
    system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
    messages: turns.map((turn): Anthropic.Beta.Messages.BetaMessageParam => turn.role === 'user'
      ? { role: 'user', content: turn.parts.map((part): Anthropic.Beta.Messages.BetaContentBlockParam => part.type === 'text' ? { type: 'text', text: part.text }
        : { type: 'image', source: isData(part.src) ? { type: 'base64', media_type: 'image/jpeg', data: part.src.slice(part.src.indexOf(',') + 1) } : { type: 'url', url: part.src } }) }
      : { role: 'assistant', content: turn.text }),
  })
  if (response.stop_reason === 'refusal') throw new Error(declined)
  if (!response.parsed_output) throw new Error(unreadable)
  return response.parsed_output as z.infer<T>
}

async function askOpenAI<T extends z.ZodType>(apiKey: string, schema: T, turns: Turn[], system: string): Promise<z.infer<T>> {
  const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
  const response = await client.responses.parse({
    model: OPENAI_MODEL,
    instructions: system,
    input: turns.map((turn): OpenAI.Responses.ResponseInputItem => turn.role === 'user'
      // Stock thumbnails only need a glance, so they go at low detail.
      ? { role: 'user', content: turn.parts.map((part): OpenAI.Responses.ResponseInputContent => part.type === 'text' ? { type: 'input_text', text: part.text } : { type: 'input_image', image_url: part.src, detail: isData(part.src) ? 'high' : 'low' }) }
      : { role: 'assistant', content: turn.text }),
    text: { format: zodTextFormat(schema, 'coach_answer') },
  })
  const refused = response.output.some((item) => item.type === 'message' && item.content.some((part) => part.type === 'refusal'))
  if (refused) throw new Error(declined)
  if (!response.output_parsed) throw new Error(unreadable)
  return response.output_parsed as z.infer<T>
}

const ask = <T extends z.ZodType>(engine: Engine, schema: T, turns: Turn[], system = SYSTEM) => engine.provider === 'openai' ? askOpenAI(engine.apiKey, schema, turns, system) : askClaude(engine.apiKey, schema, turns, system)

const clamp = (value: number) => Math.min(1, Math.max(0, value))
function tidyScene(scene: SceneAnalysis): SceneAnalysis {
  return {
    ...scene,
    related: scene.related.filter((key, i, all) => catalogByKey.has(key) && all.indexOf(key) === i),
    shots: scene.shots.map((shot) => {
      const example = catalogByKey.get(shot.example)?.kind === 'motion' ? shot.example : ''
      const frame = shot.frame && { x: clamp(shot.frame.x), y: clamp(shot.frame.y), w: clamp(shot.frame.w), h: clamp(shot.frame.h) }
      return {
        ...shot,
        example,
        place: shot.place && { x: clamp(shot.place.x), y: clamp(shot.place.y) },
        // A frame too small or spilling off the photo would draw nonsense, so it is dropped.
        frame: frame && frame.w > 0.05 && frame.h > 0.05 && frame.x + frame.w <= 1.02 && frame.y + frame.h <= 1.02 ? { ...frame, w: Math.min(frame.w, 1 - frame.x), h: Math.min(frame.h, 1 - frame.y) } : null,
      }
    }),
  }
}

export async function analyseScene(engine: Engine, image: PreparedImage, brief: CoachBrief, language: Language) {
  const scene = await ask(engine, SceneSchema, [{ role: 'user', parts: [{ type: 'image', src: image.dataUrl }, { type: 'text', text: briefText(brief, language) }] }])
  return tidyScene(scene)
}

export async function reviewShot(engine: Engine, setup: { image: PreparedImage; brief: CoachBrief; analysis: SceneAnalysis; language: Language }, shot: PreparedImage, tried: string) {
  const review = await ask(engine, ReviewSchema, [
    { role: 'user', parts: [{ type: 'image', src: setup.image.dataUrl }, { type: 'text', text: briefText(setup.brief, setup.language) }] },
    { role: 'assistant', text: JSON.stringify(setup.analysis) },
    { role: 'user', parts: [{ type: 'image', src: shot.dataUrl }, { type: 'text', text: `${REVIEW}\nThe creator was going for: ${tried}.` }] },
  ])
  return { ...review, score: Math.round(Math.min(10, Math.max(1, review.score))) }
}

// ---------- Choosing the closest stock clip for each shot ----------

const PICK_SYSTEM = `You are a film director choosing reference footage for a photographer and filmmaker on location.
For each planned shot you get its description and numbered stock video thumbnails found by a web search.
Rank the thumbnails worth showing as examples of the shot, best first. A clip earns a place only when it is both:
- close to the planned shot: similar framing, pose or action, subject and kind of place;
- genuinely beautiful and cinematic: motivated, directional light (backlight, golden hour, haze, soft window light), depth and layering, a deliberate colour grade, clean composition and a strong mood.
Leave out clips that look like generic stock: flat or midday light, blown highlights, cluttered backgrounds, posed grins at the camera, obvious phone footage, text or logos.
Judge the pictures themselves, not how relevant the search words sound. Rank at most 4 per shot. Return an empty list for a shot when none of its thumbnails is both close and beautiful.`
const PickSchema = z.object({ picks: z.array(z.object({ shot: z.number(), ranked: z.array(z.number()) })) })

// candidates[i] holds the thumbnails for shot i; returns, per shot, the indices worth showing, best first
// (an empty list when nothing is both close and good-looking).
export async function pickBestClips(engine: Engine, shots: ShotIdea[], candidates: string[][]) {
  const parts: Part[] = [{ type: 'text', text: 'Rank the thumbnails for each shot below.' }]
  shots.forEach((shot, index) => {
    if (!candidates[index]?.length) return
    parts.push({ type: 'text', text: `Shot ${index + 1}: ${shot.title}. ${shot.framing}, ${shot.lens_mm}mm. Camera: ${shot.camera_position} Subject: ${shot.subject_direction} Why: ${shot.why}` })
    candidates[index].forEach((src, n) => { parts.push({ type: 'text', text: `Shot ${index + 1}, thumbnail ${n}:` }, { type: 'image', src }) })
  })
  const { picks } = await ask(engine, PickSchema, [{ role: 'user', parts }], PICK_SYSTEM)
  return shots.map((_, index) => {
    const count = candidates[index]?.length ?? 0
    const ranked = picks.find((pick) => pick.shot === index + 1)?.ranked ?? []
    return [...new Set(ranked)].filter((n) => Number.isInteger(n) && n >= 0 && n < count).slice(0, 4)
  })
}

// ---------- An example photo of a shot, made in the creator's own location ----------

// OpenAI's fast image model. Medium quality gives the detail a cinematic frame needs.
export const IMAGE_MODEL = 'gpt-image-2.6-flare'
const subjectLook: Record<CoachSubject, string> = {
  person: 'one model (a young woman unless the goal says otherwise)',
  detail: 'a close view of the outfit and accessories on a model',
  scene: 'the location with no people in it',
}
export async function generateExample(apiKey: string, scene: PreparedImage, shot: ShotIdea, brief: CoachBrief) {
  const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
  const blob = await (await fetch(scene.dataUrl)).blob()
  const prompt = [
    'Using the attached photo as the location, make a still frame from a high-end fashion film of the shot described below, as if shot in this exact place.',
    "Keep the place's real features and layout. Light it at its most beautiful for this place: soft directional or back light, gentle atmospheric haze, depth from foreground to background, and a restrained, filmic colour grade.",
    `Shot: ${shot.title}. Framing: ${shot.framing}, the look of a ${shot.lens_mm}mm lens at ${shot.settings.aperture}.`,
    `Camera: ${shot.camera_position}`,
    `Subject: ${subjectLook[brief.subject]}. ${shot.subject_direction}`,
    brief.goal.trim() && `The look the creator wants: ${brief.goal.trim()}`,
    'Cinematic and atmospheric, like a frame from a luxury brand film shot on a cinema camera: shallow depth of field, natural skin and fabric texture, subtle film grain. Believable, not over-processed. No text, borders, letterboxing or watermarks.',
  ].filter(Boolean).join('\n')
  const response = await client.images.edit({
    model: IMAGE_MODEL,
    image: new File([blob], 'location.jpg', { type: 'image/jpeg' }),
    prompt,
    quality: 'medium',
    size: scene.width >= scene.height ? '1536x1024' : '1024x1536',
    output_format: 'jpeg',
  })
  const data = response.data?.[0]?.b64_json
  if (!data) throw new Error('OpenAI returned no image. Please try again.')
  return `data:image/jpeg;base64,${data}`
}

// ---------- Getting a photo ready to send ----------

// Claude sees up to about 1568px on the long edge, so larger photos are scaled down
// in the browser first. That keeps uploads small and fast on a phone connection.
const MAX_EDGE = 1568
export async function prepareImage(file: File): Promise<PreparedImage> {
  let source: ImageBitmap | HTMLImageElement
  try { source = await createImageBitmap(file, { imageOrientation: 'from-image' }) }
  catch {
    const url = URL.createObjectURL(file)
    try {
      source = await new Promise<HTMLImageElement>((resolve, reject) => { const img = new Image(); img.onload = () => resolve(img); img.onerror = () => reject(new Error('unreadable')); img.src = url })
    } finally { URL.revokeObjectURL(url) }
  }
  const scale = Math.min(1, MAX_EDGE / Math.max(source.width, source.height))
  const width = Math.round(source.width * scale)
  const height = Math.round(source.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = width; canvas.height = height
  canvas.getContext('2d')!.drawImage(source, 0, 0, width, height)
  if ('close' in source) source.close()
  const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
  return { dataUrl, data: dataUrl.slice(dataUrl.indexOf(',') + 1), width, height }
}

// Readable messages for the errors either SDK raises.
export function describeAiError(error: unknown, provider: Provider, language: Language) {
  const en = language === 'en'
  const name = provider === 'openai' ? 'OpenAI' : 'Claude'
  if (error instanceof OpenAI.AuthenticationError || error instanceof Anthropic.AuthenticationError) return en ? `That ${name} API key was rejected. Check it in AI settings.` : `${name} API Key 无效，请在 AI 设置里检查。`
  if (error instanceof OpenAI.PermissionDeniedError && /verif/i.test(error.message)) return en ? 'OpenAI needs your organization to be verified before it can use image models. Verify it in your OpenAI settings, then try again.' : 'OpenAI 要求先完成组织验证才能使用图像模型。请在 OpenAI 账户设置中完成验证后再试。'
  if (error instanceof OpenAI.PermissionDeniedError || error instanceof Anthropic.PermissionDeniedError) return en ? 'This API key cannot use this model.' : '这个 API Key 没有使用该模型的权限。'
  if (error instanceof OpenAI.RateLimitError || error instanceof Anthropic.RateLimitError) return en ? 'Rate limited or out of credit. Wait a moment, or check your billing.' : '请求太频繁或余额不足，请稍后再试或检查账户额度。'
  // OpenAI's reply to a bad key has no CORS header, so in a browser it looks like a network failure.
  if (error instanceof OpenAI.APIConnectionError && provider === 'openai') return en ? 'Could not reach OpenAI. Check your connection, and check the API key in AI settings: OpenAI reports a wrong key to browsers as a connection error.' : '无法连接到 OpenAI。请检查网络，并在 AI 设置里核对 API Key：Key 错误时，浏览器也会显示为连接失败。'
  if (error instanceof OpenAI.APIConnectionError || error instanceof Anthropic.APIConnectionError) return en ? `Could not reach ${name}. Check your connection.` : `无法连接到 ${name}，请检查网络。`
  if (error instanceof OpenAI.APIError || error instanceof Anthropic.APIError) return `${name} API ${en ? 'error' : '错误'} ${error.status ?? ''}: ${error.message}`
  return error instanceof Error ? error.message : String(error)
}
