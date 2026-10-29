import type { Motion } from './motionData'

export const tagGroups = [
  { id: 'scene', label: '场景与元素', kind: 'reference' },
  { id: 'light', label: '光线', kind: 'reference' },
  { id: 'time', label: '时段与风', kind: 'reference' },
  { id: 'action', label: '人物动作', kind: 'reference' },
  { id: 'pose', label: '身体姿态', kind: 'reference' },
  { id: 'gaze', label: '视线与表情', kind: 'reference' },
  { id: 'wardrobe', label: '服装与发型', kind: 'reference' },
  { id: 'props', label: '道具', kind: 'reference' },
  { id: 'mood', label: '情绪氛围', kind: 'reference' },
  { id: 'style', label: '视觉风格', kind: 'reference' },
  { id: 'duration', label: '片段时长', kind: 'reference' },
  { id: 'shot', label: '复拍景别', kind: 'suggestion' },
  { id: 'angle', label: '复拍机位', kind: 'suggestion' },
  { id: 'composition', label: '复拍构图', kind: 'suggestion' },
  { id: 'movement', label: '复拍运镜', kind: 'suggestion' },
  { id: 'focus', label: '复拍对焦', kind: 'suggestion' },
  { id: 'lens', label: '复拍焦段', kind: 'suggestion' },
  { id: 'usage', label: '镜头用途', kind: 'suggestion' },
] as const
export type TagGroupId = typeof tagGroups[number]['id']
export type MotionTags = Record<TagGroupId, string[]>
export type TagSelection = Partial<MotionTags>
// Content annotations describe visible subjects and actions; camera settings stay recommendations.
type Facts = { scene: string; light?: string; time?: string; action: string; pose: string; gaze?: string; wardrobe?: string; props?: string; mood?: string; style: string; composition: string; usage: string }
const facts: Record<string, Facts> = {
  '1012': { scene: '户外/海边/沙滩/礁石/海浪', light: '自然光', time: '白天', action: '行走/走远/衣摆摆动', pose: '站姿/行进姿态', gaze: '背影/看向远处', wardrobe: '白色服装/长裙/长发/散发', mood: '自由/独处/宁静', style: '自然人像/旅行感/环境人像', composition: '环境留白/水平线/纵深构图/主体与环境', usage: '片头建立/旅程段落/结尾留白/服装展示' },
  '1114': { scene: '户外/海边/沙滩/海浪/水面', light: '自然光/逆光/轮廓光', time: '日落/黄昏/有风', action: '行走/走向水面/停留', pose: '站姿/行进姿态', gaze: '背影/看向远处', wardrobe: '长发/散发', mood: '自由/安静/独处', style: '自然人像/旅行感/氛围人像', composition: '水平线/逆光轮廓/纵深构图/环境留白', usage: '旅程段落/情绪过渡/结尾留白' },
  '4629': { scene: '户外/海边/滨海步道/树木/地平线', light: '自然光/逆光/剪影/高反差', time: '日落/黄昏', action: '行走/横向经过', pose: '站姿/行进姿态', gaze: '侧身/看向前方', mood: '沉静/独处/宁静', style: '剪影人像/环境人像/旅行感', composition: '水平线/负空间/逆光轮廓/前景层次', usage: '过渡镜头/环境建立/结尾留白' },
  '4840': { scene: '户外/屋顶/城市远景/天空', light: '自然光/逆光/剪影', time: '日落/黄昏', action: '抬起手臂/伸展/放下手臂/停留', pose: '站姿/手臂展开', gaze: '背影/看向远处', mood: '舒展/自由/释然', style: '剪影人像/城市人像/氛围人像', composition: '环境留白/逆光轮廓/天空留白/对称感', usage: '情绪高潮/结尾留白/环境建立' },
  '4897': { scene: '户外/树林/草地/公园/绿植', light: '自然光/树荫光', time: '白天', action: '阅读/翻书/低头/停留', pose: '坐姿/手持物品', gaze: '看向书本/低头注视', props: '书本', mood: '日常/专注/安静', style: '生活感/自然人像/慢生活', composition: '前景层次/主体与环境/脸与手同框', usage: '生活段落/阅读场景/日常 B-roll/情绪过渡' },
  '924': { scene: '室内/窗边/窗框/明暗空间', light: '窗光/逆光/剪影/高反差', time: '白天', action: '走近/开窗/停留/看向窗外', pose: '站姿/伸手', gaze: '背影/看向窗外', props: '窗户', mood: '安静/独处', style: '生活感/窗边人像/剪影人像', composition: '框架构图/明暗对比/纵深构图/环境留白', usage: '片头建立/室内段落/空间转场/日常 B-roll' },
  '4702': { scene: '户外/花田/草地/花朵', light: '自然光', time: '白天', action: '转身/轻舞/手臂摆动/身体舒展', pose: '站姿/动态姿态', gaze: '随动作转向', mood: '轻盈/开心/自由', style: '自然人像/花田人像/动感人像', composition: '主体与环境/前景层次/动作留白', usage: '情绪高潮/动作段落/自然主题/服装展示' },
  '42596': { scene: '花束近景/人像场景', action: '闻花/低头/持花/微小动作', pose: '手持物品/静态姿态', gaze: '看向花朵/低头注视', props: '花束', mood: '温柔/浪漫/细腻', style: '花卉人像/细节肖像', composition: '脸与道具同框/简化背景/视线引导', usage: '情绪特写/花卉主题/细节插入/人物介绍' },
  '4511': { scene: '室内/窗边/玻璃/窗框', light: '窗光/侧光', time: '白天', action: '停留/看向窗外/微小动作', pose: '静态姿态', gaze: '画外视线/看向窗外/若有所思', mood: '沉静/独处/若有所思', style: '窗边人像/情绪肖像/生活感', composition: '视线留白/框架构图/侧脸轮廓/玻璃层次', usage: '情绪特写/等待场景/人物介绍/情绪过渡' },
  '2931': { scene: '户外/自然环境/绿植', light: '自然光', time: '白天', action: '停留/观察环境/微小动作', pose: '站姿/放松重心', gaze: '画外视线/看向远处', mood: '放松/自由/宁静', style: '自然人像/旅行感', composition: '主体与环境/背景层次/视线留白', usage: '旅行段落/自然主题/人物介绍/情绪过渡' },
  '42729': { scene: '阳台/绿植景观/栏杆/住宅空间', light: '自然光', time: '白天', action: '停留/看向远处/观察环境', pose: '站姿/静态姿态', gaze: '画外视线/看向远处', props: '栏杆', mood: '安静/独处/宁静', style: '生活感/环境人像', composition: '引导线/主体与环境/视线留白/空间层次', usage: '空间建立/等待场景/生活段落/结尾留白' },
  '2758': { scene: '户外/自然环境/旅行场景', light: '自然光', time: '白天', action: '停留/观察环境/轻微转向', pose: '站姿/放松重心', gaze: '画外视线/看向远处', mood: '自由/放松/独处', style: '旅行感/自然人像', composition: '主体与环境/环境留白/视线引导', usage: '旅行段落/到达场景/人物介绍/自然主题' },
  '42728': { scene: '室内/窗边/窗框/绿植景观', light: '自然光/窗光', time: '白天', action: '停留/看向窗外/观察环境', pose: '站姿/静态姿态', gaze: '看向窗外/画外视线', props: '窗户', mood: '平静/独处/宁静', style: '窗边人像/生活感', composition: '框架构图/侧脸轮廓/视线留白/空间层次', usage: '室内段落/等待场景/空间转场/情绪过渡' },
  '42595': { scene: '花束近景/人像场景', action: '闻花/低头/持花/微小动作', pose: '手持物品/静态姿态', gaze: '看向花朵/低头注视', props: '花束', mood: '细腻/温柔/浪漫', style: '花卉人像/自然人像', composition: '脸与道具同框/色彩呼应/视线引导', usage: '花卉主题/人物介绍/细节插入/情绪过渡' },
  '25561': { scene: '户外/夕阳人像/花朵', light: '自然光/逆光/暖光', time: '日落/黄昏', action: '抬手/别花/手触耳旁/放下手臂', pose: '站姿/手持物品', gaze: '随手部动作注视', props: '单枝花', mood: '温柔/轻盈/细腻', style: '自然人像/花卉人像/细节肖像', composition: '脸与手同框/手部引导/简化背景/逆光轮廓', usage: '手部插入/人物介绍/花卉主题/情绪特写' },
  '1117': { scene: '户外/海边/沙滩/海浪', light: '自然光/逆光/侧逆光/轮廓光/暖光', time: '日落/黄昏/有风', action: '抬手/放下头发/整理头发/回望/转头', pose: '站姿/抬臂姿态', gaze: '回眸/侧脸/看向镜头', wardrobe: '深色服装/吊带上衣/长发/盘发/散发', mood: '自由/放松/含蓄', style: '自然人像/旅行感/时尚人像', composition: '侧脸轮廓/逆光轮廓/水平线/动作留白', usage: '人物介绍/发丝细节/服装展示/情绪过渡' },
  '41617': { scene: '室内/人像场景', action: '转头/发丝摆动/微小动作', pose: '动态姿态', gaze: '随动作转向', wardrobe: '长发/散发', mood: '舒展/轻盈', style: '慢动作质感/细节肖像/时尚人像', composition: '动作留白/简化背景/脸部重点', usage: '发丝细节/情绪特写/动作连接/人物介绍' },
  '2818': { scene: '户外/街头/游乐园', light: '环境光', time: '有风', action: '停留/转头/发丝摆动/微小动作', pose: '站姿/静态姿态', gaze: '画外视线/侧脸', wardrobe: '深色服装/吊带上衣/长发/散发', mood: '自然/含蓄/安静', style: '街头人像/细节肖像/生活感', composition: '视线留白/侧脸轮廓/背景层次', usage: '人物介绍/等待场景/发丝细节/情绪过渡' },
  '4950': { scene: '室内/居家/阅读场景', action: '阅读/翻书/持书', pose: '坐姿/手持物品', gaze: '看向书本/低头注视', wardrobe: '居家服/浅色头发', props: '书本', mood: '日常/安静/放松', style: '生活感/慢生活/居家人像', composition: '肩后观察/脸与手同框/道具层次', usage: '阅读场景/生活段落/手部插入/日常 B-roll' },
  '42734': { scene: '室内/窗边/玻璃', light: '自然光/窗光/侧光', time: '白天', action: '看向窗外/停留/微小动作', pose: '静态姿态', gaze: '侧脸/看向窗外/画外视线', props: '玻璃杯', mood: '含蓄/独处/若有所思', style: '情绪肖像/窗边人像/生活感', composition: '侧脸轮廓/明暗对比/视线留白', usage: '情绪特写/等待场景/情绪过渡/人物介绍' },
  '4948': { scene: '室内/居家/阅读场景', action: '阅读/低头/持书/微小动作', pose: '静态姿态/手持物品', gaze: '看向书本/低头注视', wardrobe: '浅色头发', props: '书本', mood: '专注/安静/日常', style: '生活感/细节肖像/慢生活', composition: '脸与手同框/道具层次/视线引导', usage: '阅读场景/细节插入/日常 B-roll/人物介绍' },
  '4823': { scene: '户外/公园/步道/绿植', light: '自然光', time: '白天', action: '行走/轻舞/手臂摆动/听音乐', pose: '行进姿态/动态姿态', gaze: '看向前方/随动作转向', wardrobe: '蓝色服装', props: '耳机', mood: '轻快/开心/自由', style: '生活感/自然人像/动感人像', composition: '动作留白/主体与环境/纵深构图', usage: '生活段落/动作段落/旅行段落/情绪高潮' },
  '4803': { scene: '户外/屋顶/城市远景/天空', light: '自然光/逆光/剪影', time: '日落/黄昏', action: '静坐/呼吸/微小舒展', pose: '坐姿/冥想姿态/静态姿态', gaze: '看向远处', mood: '平静/宁静/独处', style: '剪影人像/环境人像/慢生活', composition: '环境留白/天空留白/主体与环境/逆光轮廓', usage: '结尾留白/环境建立/情绪过渡/自然主题' },
  '42741': { scene: '室内/窗边/阅读场景', light: '自然光/窗光/侧光', time: '白天', action: '阅读/翻书/低头/停留', pose: '坐姿/手持物品', gaze: '看向书本/低头注视', props: '书本', mood: '温暖/安静/日常', style: '窗边人像/生活感/慢生活', composition: '框架构图/脸与手同框/空间层次', usage: '阅读场景/生活段落/室内段落/日常 B-roll' },
  '223': { scene: '室内/咖啡馆/桌边/阅读场景', action: '阅读/喝咖啡/拿杯/放杯', pose: '坐姿/手持物品', gaze: '看向书本/看向杯子', props: '咖啡杯/书本/桌子/餐点', mood: '日常/放松/从容', style: '生活感/咖啡馆人像/慢生活', composition: '脸与道具同框/桌面前景/动作连接/道具层次', usage: '生活段落/咖啡馆场景/动作连接/日常 B-roll' },
  '219': { scene: '室内/咖啡馆/桌边', action: '伸手/接杯/拿杯/抬起杯子', pose: '局部手部/手持物品', gaze: '手部为主', props: '咖啡杯/杯碟/桌子/托盘', mood: '细腻/日常/从容', style: '生活感/手部细节/日常细节', composition: '手部重点/桌面前景/动作连接/道具层次', usage: '手部插入/咖啡馆场景/动作连接/日常 B-roll' },
  '205': { scene: '室内/咖啡馆/桌边', action: '持杯/喝咖啡/放杯/倒咖啡', pose: '局部手部/手持物品', gaze: '手部为主', props: '咖啡杯/杯碟/咖啡壶/桌子', wardrobe: '深色服装/戒指', mood: '从容/日常/细腻', style: '生活感/手部细节/日常细节', composition: '手部重点/桌面前景/道具层次/动作连接', usage: '手部插入/咖啡馆场景/细节插入/日常 B-roll' },
  '1221': { scene: '户外/海边/沙滩/棕榈树', light: '自然光', time: '白天', action: '行走/衣摆摆动/停留', pose: '站姿/行进姿态', gaze: '看向前方/画外视线', wardrobe: '白色服装/裙装', mood: '轻盈/自由/自然', style: '旅行感/自然人像/环境人像', composition: '主体与环境/动作留白/背景层次', usage: '旅行段落/人物介绍/服装展示/环境建立' },
  '5179': { scene: '人像场景', action: '闭眼/呼吸/停留/微小动作', pose: '静态姿态/冥想姿态', gaze: '闭眼/面部放松', mood: '放松/宁静/平静', style: '情绪肖像/细节肖像/慢生活', composition: '脸部重点/简化背景/侧脸轮廓', usage: '情绪特写/情绪过渡/结尾留白/人物介绍' },
  '1526': { scene: '户外/街头/城市空间', action: '停留/轻微转向/微小动作', pose: '站姿/放松重心', wardrobe: '红色服装/裙装', mood: '自信/从容', style: '街头人像/时尚人像/城市人像', composition: '色彩呼应/简化背景/视线留白', usage: '人物介绍/服装展示/街头段落/情绪过渡' },
  '1300': { scene: '户外/街头/城市空间', action: '脱下外套/抬手/手臂伸展/整理衣服', pose: '站姿/抬臂姿态/动态姿态', wardrobe: '外套/叠穿', mood: '随意/自然/放松', style: '街头人像/时尚人像/生活感', composition: '动作留白/服装重点/脸与手同框', usage: '服装展示/动作连接/街头段落/人物介绍' },
  '1296': { scene: '阳台/城市空间/栏杆', light: '环境光', action: '停留/微小动作/调整重心', pose: '站姿/放松重心', gaze: '画外视线', props: '栏杆', mood: '从容/自然/放松', style: '城市人像/生活感/时尚人像', composition: '引导线/背景层次/视线留白', usage: '人物介绍/等待场景/街头段落/情绪过渡' },
  '1299': { scene: '户外/街头/城市空间', light: '环境光', action: '转头/停留/轻微转向', pose: '站姿/静态姿态', gaze: '画外视线/转回视线', mood: '亲近/自然/含蓄', style: '街头人像/生活感/时尚人像', composition: '视线留白/简化背景/脸部重点', usage: '人物介绍/等待场景/情绪过渡/街头段落' },
}
const split = (value?: string) => [...new Set((value || '').split('/').map(v => v.trim()).filter(Boolean))]
type TagSource = Pick<Motion, 'assetId' | 'category' | 'angle' | 'framing' | 'mood' | 'duration'>
export function buildMotionTags(motion: TagSource): MotionTags {
  const f = facts[motion.assetId]
  if (!f) throw new Error(`Missing content tags: ${motion.assetId}`)
  const angle = split([
    /侧后|背后偏侧/.test(motion.angle) ? '侧后方' : /背后/.test(motion.angle) ? '背后机位' : /侧面|侧拍|窗侧/.test(motion.angle) ? '侧面机位' : '侧前方',
    /平视|眼睛高度/.test(motion.angle) ? '平视' : '', /俯/.test(motion.angle) ? '轻俯拍' : '', /低一点|胸腰/.test(motion.angle) ? '低机位' : '', /肩后/.test(motion.angle) ? '肩后观察' : '',
  ].filter(Boolean).join('/'))
  const duration = motion.duration.split(':').map(Number).reduce((a, b) => a * 60 + b, 0)
  return {
    scene: split(f.scene), light: split(f.light), time: split(f.time), action: split(f.action), pose: split(f.pose), gaze: split(f.gaze), wardrobe: split(f.wardrobe), props: split(f.props),
    mood: split(`${motion.mood}/${f.mood || ''}`), style: split(f.style), duration: [duration <= 10 ? '10 秒以内' : duration <= 20 ? '11–20 秒' : '21 秒以上'],
    shot: split(`${motion.framing}/${motion.category === 'hands' ? '手部特写/细节插入' : motion.framing === '全身' ? '环境人像' : motion.framing === '近景' ? '脸部近景' : '人物半身'}`),
    angle, composition: split(f.composition),
    movement: motion.category === 'walk' ? ['固定机位', /背/.test(motion.angle) ? '背后跟拍' : '侧向跟拍'] : ['固定机位', '缓慢推进'],
    focus: motion.category === 'hands' ? ['手部合焦', '道具合焦', '保留景深余量'] : motion.framing === '全身' ? ['主体与环境兼顾', '人物跟焦'] : ['眼部合焦', '主体背景分离'],
    lens: motion.framing === '全身' ? ['28mm', '35mm', '50mm'] : motion.framing === '半身' ? ['50mm', '75mm'] : ['65mm', '75mm'],
    usage: split(f.usage),
  }
}
export function sanitizeTagSelection(value: unknown, valid: Motion[]): TagSelection {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(tagGroups.flatMap(g => {
    const values = (value as Record<string, unknown>)[g.id]
    if (!Array.isArray(values)) return []
    const allowed = new Set(valid.flatMap(m => m.tags[g.id]))
    const clean = [...new Set(values.filter((v): v is string => typeof v === 'string' && allowed.has(v)))]
    return clean.length ? [[g.id, clean]] : []
  }))
}
export function matchesMotionTags(motion: Motion, selected: TagSelection, except?: TagGroupId): boolean {
  return tagGroups.every(g => g.id === except || !selected[g.id]?.length || selected[g.id]!.some(value => motion.tags[g.id].includes(value)))
}
const aliases: Record<string, string> = { backlight: '逆光', silhouette: '剪影', sunset: '日落', beach: '海边', walking: '行走', window: '窗边', closeup: '近景', portrait: '人像', broll: 'b-roll', '黄金时刻': '日落', '黄金时间': '日落', '逆光人像': '逆光', '大海': '海边', '回头': '回', '特写': '近景', '长焦': '75mm' }
export function matchesMotionSearch(motion: Motion, query: string): boolean {
  const tokens = query.trim().toLowerCase().split(/[\s，,、]+/).filter(Boolean).map(t => aliases[t] || t)
  const text = `${motion.title} ${motion.cue} ${motion.mood} ${motion.angle} ${motion.lens} ${motion.sourceTitle} ${motion.creator} ${motion.environment.join(' ')} ${Object.values(motion.tags).flat().join(' ')}`.toLowerCase()
  return tokens.every(token => text.includes(token))
}
export function cardMotionTags(motion: Motion): { group: TagGroupId; value: string }[] {
  const scene = motion.tags.scene.find(v => !['户外', '室内', '人像场景'].includes(v)) || motion.tags.scene[0]
  const light = motion.tags.light.includes('逆光') ? '逆光' : motion.tags.light[0]
  const candidates: { group: TagGroupId; value?: string }[] = [
    { group: 'scene', value: scene }, { group: 'light', value: light },
    { group: 'action', value: motion.tags.action[0] },
    motion.tags.gaze.length ? { group: 'gaze', value: motion.tags.gaze[0] } : { group: 'props', value: motion.tags.props[0] },
    motion.tags.wardrobe.length ? { group: 'wardrobe', value: motion.tags.wardrobe[0] } : { group: 'props', value: motion.tags.props[0] },
  ]
  const seen = new Set<string>()
  return candidates.filter((tag): tag is { group: TagGroupId; value: string } => {
    if (!tag.value || seen.has(tag.value)) return false
    seen.add(tag.value)
    return true
  })
}
