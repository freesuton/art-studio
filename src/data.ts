import type { CheatSheet, Stage, StageId } from './types'

export const stages: Stage[] = [
  { id: 'concept', index: '01', title: '创意与故事', titleEn: 'Concept & Story', subtitle: '决定拍什么、为什么拍、如何讲故事', output: '创作简报 + 故事大纲', outputEn: 'Creative Brief + Story Outline', tasks: ['确定形式与叙事方式', '找到核心问题与观众体验', '写出故事大纲'], accent: '#ff8d72' },
  { id: 'prepare', index: '02', title: '拍摄准备', titleEn: 'Plan & Prepare', subtitle: '设计场景、视觉、镜头与拍摄顺序', output: '分场镜头表 + 拍摄计划', outputEn: 'Scene & Shot List + Shoot Plan', tasks: ['建立视觉规则', '拆分场景与镜头', '确认声音与器材需求'], accent: '#f5c84c' },
  { id: 'shoot', index: '03', title: '正式拍摄', titleEn: 'Shoot', subtitle: '按镜头表执行，记录画面、动作和声音', output: '拍摄素材 + 现场记录', outputEn: 'Footage + Shoot Log', tasks: ['检查表演与构图', '拍摄可剪辑的镜头覆盖', '记录可用拍次与现场声音'], accent: '#82d8ff' },
  { id: 'edit', index: '04', title: '剪辑与后期', titleEn: 'Edit & Finish', subtitle: '完成故事剪辑、声音、调色、字幕与输出', output: '最终成片', outputEn: 'Final Film', tasks: ['先剪清楚故事', '统一声画与节奏', '检查字幕并输出母版'], accent: '#b9a5ff' },
  { id: 'publish', index: '05', title: '发布与复盘', titleEn: 'Publish & Review', subtitle: '发布作品，评估创作问题，归档项目', output: '发布清单 + 创作复盘', outputEn: 'Release Checklist + Review', tasks: ['检查发布版本与文案', '记录反馈与创作得失', '归档项目素材与文件'], accent: '#ff91bd' },
]

type LegacyStageId = 'story' | 'visual' | 'shots' | 'set' | 'edit' | 'finish'
const stageMap: Record<LegacyStageId, StageId> = {
  story: 'concept', visual: 'prepare', shots: 'prepare', set: 'shoot', edit: 'edit', finish: 'edit',
}

const originalSheets: (Omit<CheatSheet, 'stage'> & { stage: LegacyStageId })[] = [
  {
    id: 'scene-objective', title: '场景目标', titleEn: 'Scene Objective', stage: 'story', category: '场景',
    tags: ['目标', '冲突', '人物'], summary: '用“谁想从谁那里得到什么”定义一场戏。',
    purpose: ['让表演有明确方向', '快速判断对白和动作是否必要'],
    usage: ['写完每场戏之后', '排练前向演员说明'],
    steps: ['写下主角的具体目标', '加入阻碍目标的人或事件', '确定场景结束时发生的变化'],
    mistakes: ['把情绪当作目标', '人物从头到尾没有改变策略'], related: ['story-beats', 'blocking'], visual: 'objective', accent: '#ff8d72'
  },
  {
    id: 'story-beats', title: '场景节拍', titleEn: 'Story Beats', stage: 'story', category: '结构',
    tags: ['节拍', '转折', '节奏'], summary: '把场景拆成一次次信息、行动或权力的变化。',
    purpose: ['找到场景真正的转折', '为镜头变化提供动机'], usage: ['设计分镜前', '场景显得平淡时'],
    steps: ['标出新信息出现的位置', '标出人物改变行动策略的位置', '把重要节拍分配给不同镜头'],
    mistakes: ['每句对白都切镜头', '节拍之间没有递进'], related: ['scene-objective', 'coverage'], visual: 'beats', accent: '#ff8d72'
  },
  {
    id: 'visual-motif', title: '视觉母题', titleEn: 'Visual Motif', stage: 'story', category: '视觉叙事',
    tags: ['母题', '重复', '象征'], summary: '让一个形状、颜色或动作在片中重复并积累意义。',
    purpose: ['用画面强化主题', '让短片形成统一记忆点'], usage: ['存在清楚主题时', '短片需要视觉线索时'],
    steps: ['选一个与主题有关的元素', '设计至少三次不同语境的出现', '最后一次让意义发生变化'],
    mistakes: ['符号过多', '只重复但不发展'], related: ['color-palette', 'composition'], visual: 'motif', accent: '#ff8d72'
  },
  {
    id: 'aspect-ratio', title: '画幅比例', titleEn: 'Aspect Ratio', stage: 'visual', category: '画面',
    tags: ['4:3', '16:9', '2.39:1'], summary: '画框的形状会改变人物、空间和负空间的组织方式。',
    purpose: ['先确定构图边界', '让分镜与最终成片一致'], usage: ['制作分镜之前', '想强调人物或环境时'],
    steps: ['4:3偏向人物与垂直空间', '16:9均衡通用', '2.39:1适合横向调度与多人关系'],
    mistakes: ['拍摄结束后才决定画幅', '宽画幅里只把人物放在正中'], related: ['composition', 'shot-size'], visual: 'aspect', accent: '#f5c84c'
  },
  {
    id: 'color-palette', title: '色彩规则', titleEn: 'Color Palette', stage: 'visual', category: '色彩',
    tags: ['主色', '强调色', '冷暖'], summary: '用少量主色、辅助色和强调色控制全片色彩。',
    purpose: ['统一场景、服装与灯光', '通过色彩变化表现故事变化'], usage: ['勘景和选服装前', '短片需要明显情绪时'],
    steps: ['选一组基础色', '给关键人物或物件一个强调色', '规定高潮前后的色彩变化'],
    mistakes: ['每场戏使用不同配色', '只在调色阶段处理色彩'], related: ['visual-motif', 'lighting-direction', 'color-match'], visual: 'palette', accent: '#f5c84c'
  },
  {
    id: 'composition', title: '构图', titleEn: 'Composition', stage: 'visual', category: '画面',
    tags: ['三分法', '负空间', '框中框'], summary: '安排画面重量与视线，让观众立刻知道该看哪里。',
    purpose: ['建立视觉重点', '表达人物关系与心理距离'], usage: ['每个镜头确定机位时'],
    steps: ['先确定视觉主体', '检查前中后景层次', '利用负空间和线条引导视线'],
    mistakes: ['背景线穿过人物头部', '所有镜头都使用同一种构图'], related: ['aspect-ratio', 'shot-size', 'blocking'], visual: 'composition', accent: '#f5c84c'
  },
  {
    id: 'lighting-direction', title: '光线方向', titleEn: 'Light Direction', stage: 'visual', category: '光影',
    tags: ['侧光', '逆光', '顺光'], summary: '光从哪里来，比用了多少灯更能决定画面的形态。',
    purpose: ['塑造人物脸部与空间', '建立画面情绪'], usage: ['选择人物站位和机位之前'],
    steps: ['确定场景中的动机光源', '选择顺光、侧光或逆光', '用负补光控制阴影深度'],
    mistakes: ['每个机位的光向都不同', '为了照亮而失去光源逻辑'], related: ['color-palette', 'exposure'], visual: 'lighting', accent: '#f5c84c'
  },
  {
    id: 'production-design', title: '空间层次', titleEn: 'Production Design', stage: 'visual', category: '美术',
    tags: ['场景', '前景', '道具'], summary: '用场景、道具和材质建立人物生活过的空间。',
    purpose: ['让背景提供故事信息', '为构图和调度创造层次'], usage: ['选择场景和布置道具时'],
    steps: ['明确空间属于谁', '安排前景和背景元素', '用少量关键道具代替无意义装饰'],
    mistakes: ['空间太空或太整齐', '道具颜色与人物争夺注意力'], related: ['composition', 'blocking', 'color-palette'], visual: 'production', accent: '#f5c84c'
  },
  {
    id: 'shot-size', title: '景别', titleEn: 'Shot Size', stage: 'shots', category: '镜头语言',
    tags: ['全景', '中景', '近景', '特写'], summary: '景别决定观众更关注环境、行动还是情绪。',
    purpose: ['控制信息量', '改变观众与人物的心理距离'], usage: ['拆分每个场景的镜头覆盖时'],
    steps: ['全景交代空间', '中景观察互动', '近景强调情绪', '特写指出关键细节'],
    mistakes: ['所有镜头都用近景', '景别变化没有叙事原因'], related: ['camera-angle', 'coverage', 'focal-length'], visual: 'shot-size', accent: '#d8ff42'
  },
  {
    id: 'camera-angle', title: '机位角度', titleEn: 'Camera Angle', stage: 'shots', category: '镜头语言',
    tags: ['平视', '俯拍', '仰拍'], summary: '机位高度和角度改变人物力量感与空间信息。',
    purpose: ['表达观察态度', '强化人物关系变化'], usage: ['权力关系或空间位置重要时'],
    steps: ['平视保持自然', '俯拍突出空间或弱势', '仰拍增强体量与压迫'],
    mistakes: ['机械地把仰拍等同强大', '正反打的高度没有逻辑'], related: ['shot-size', 'composition', 'axis-180'], visual: 'angle', accent: '#d8ff42'
  },
  {
    id: 'focal-length', title: '焦段', titleEn: 'Focal Length', stage: 'shots', category: '镜头',
    tags: ['广角', '标准', '长焦'], summary: '焦段改变空间透视，而不只是改变画面远近。',
    purpose: ['控制空间关系', '决定背景与人物的距离感'], usage: ['选择机位和人物距离时'],
    steps: ['广角强调空间和运动', '标准焦段自然平衡', '长焦压缩空间并分离背景'],
    mistakes: ['站在原地只靠变焦取景', '忽略广角近拍造成的面部变形'], related: ['shot-size', 'depth-focus', 'camera-movement'], visual: 'lens', accent: '#d8ff42'
  },
  {
    id: 'depth-focus', title: '景深与焦点', titleEn: 'Depth & Focus', stage: 'shots', category: '镜头',
    tags: ['浅景深', '深景深', '转焦'], summary: '决定画面中哪些空间清楚，以及观众何时注意它们。',
    purpose: ['分离人物', '在同一镜头中转移信息'], usage: ['前后景同时存在重要信息时'],
    steps: ['浅景深隔离主体', '深景深保留空间关系', '转焦把注意力从一层交给另一层'],
    mistakes: ['为电影感盲目使用极浅景深', '没有给跟焦留下排练'], related: ['focal-length', 'composition', 'blocking'], visual: 'focus', accent: '#d8ff42'
  },
  {
    id: 'camera-movement', title: '摄影机运动', titleEn: 'Camera Movement', stage: 'shots', category: '运镜',
    tags: ['推拉', '摇移', '跟拍', '手持'], summary: '摄影机运动应该由人物行动、信息揭示或情绪变化触发。',
    purpose: ['引导注意力', '改变观众与人物的距离'], usage: ['人物或场景状态发生变化时'],
    steps: ['先写明运动动机', '确定起点与终点构图', '决定速度并排练焦点'],
    mistakes: ['为了动态而移动', '只设计运动过程，没有结束画面'], related: ['blocking', 'focal-length', 'cut-on-action'], visual: 'movement', accent: '#d8ff42'
  },
  {
    id: 'blocking', title: '人物调度', titleEn: 'Blocking', stage: 'set', category: '表演',
    tags: ['走位', '距离', '权力'], summary: '通过人物的位置、距离和移动表现关系变化。',
    purpose: ['让空间承担叙事', '让摄影机运动获得动机'], usage: ['架机和布光之前的排练'],
    steps: ['先让演员按行动自然排练', '标出关系发生变化的位置', '再根据调度选择机位'],
    mistakes: ['先架机再强迫演员适应', '每句台词都安排动作'], related: ['scene-objective', 'camera-movement', 'coverage'], visual: 'blocking', accent: '#82d8ff'
  },
  {
    id: 'coverage', title: '镜头覆盖', titleEn: 'Coverage', stage: 'set', category: '拍摄',
    tags: ['主镜头', '正反打', '反应'], summary: '拍到足够表达空间、行动、对话和反应的镜头。',
    purpose: ['保证场景可以完整剪辑', '为表演节奏保留选择'], usage: ['对话场景和动作场景'],
    steps: ['先拍完整主镜头', '补拍人物中近景', '拍反应、插入和关键动作'],
    mistakes: ['只拍说话的人', '每个机位改变演员的动作节奏'], related: ['shot-size', 'axis-180', 'cut-on-action'], visual: 'coverage', accent: '#82d8ff'
  },
  {
    id: 'axis-180', title: '180°轴线', titleEn: '180° Rule', stage: 'set', category: '连续性',
    tags: ['轴线', '视线', '方向'], summary: '让摄影机保持在人物关系轴的一侧，维持稳定方向。',
    purpose: ['保持视线匹配', '让观众理解空间位置'], usage: ['双人对话、移动和动作场景'],
    steps: ['画出两人之间的轴线', '把主要机位放在同一侧', '跨轴时用移动镜头或中性机位过渡'],
    mistakes: ['无意跨轴导致人物看向同一方向', '只记规则却没有建立空间'], related: ['coverage', 'camera-angle', 'cut-on-action'], visual: 'axis', accent: '#82d8ff'
  },
  {
    id: 'exposure', title: '曝光控制', titleEn: 'Exposure', stage: 'set', category: '摄影',
    tags: ['光圈', 'ISO', '快门'], summary: '用光圈、快门和ISO控制亮度，同时理解各自副作用。',
    purpose: ['保护高光和肤色', '保持镜头之间一致'], usage: ['每次换场景、机位或光线时'],
    steps: ['先按运动选择快门', '按景深选择光圈', '最后调整ISO和ND'],
    mistakes: ['只看监视器亮度', '镜头之间白平衡或曝光漂移'], related: ['lighting-direction', 'depth-focus', 'color-match'], visual: 'exposure', accent: '#82d8ff'
  },
  {
    id: 'room-tone', title: '环境底噪', titleEn: 'Room Tone', stage: 'set', category: '声音',
    tags: ['收音', '环境声', '底噪'], summary: '在场景中录制一段没有对白的连续环境声音。',
    purpose: ['连接不同拍次的声音', '填补对白剪辑产生的空洞'], usage: ['每个声音环境拍摄结束前'],
    steps: ['让现场保持原状态', '所有人静止安静', '连续录制至少30秒'],
    mistakes: ['关掉原本存在的电器后再录', '有人移动或说话'], related: ['sound-layers', 'jl-cut'], visual: 'room-tone', accent: '#82d8ff'
  },
  {
    id: 'cut-on-action', title: '动作匹配剪辑', titleEn: 'Cut on Action', stage: 'edit', category: '剪辑',
    tags: ['动作', '匹配', '剪辑点'], summary: '在动作进行中切换景别，让剪辑点被运动隐藏。',
    purpose: ['保持动作流畅', '自然改变视角和景别'], usage: ['开门、坐下、转身、拿物等动作'],
    steps: ['找到两个镜头共有的动作', '在动作速度最快处尝试切换', '微调第二镜动作位置'],
    mistakes: ['两边动作方向不同', '动作重复或突然跳过太多'], related: ['coverage', 'axis-180', 'jl-cut'], visual: 'cut-action', accent: '#b9a5ff'
  },
  {
    id: 'jl-cut', title: 'J-Cut 与 L-Cut', titleEn: 'Split Edit', stage: 'edit', category: '剪辑',
    tags: ['声音桥', '对白', '转场'], summary: '让下一个声音提前进入，或让当前声音延续到下一画面。',
    purpose: ['柔化场景转换', '把注意力从说话者转向倾听者'], usage: ['对话、场景转场和回忆'],
    steps: ['J-Cut：声音先于画面进入', 'L-Cut：声音延续到下一画面', '用环境声隐藏边界'],
    mistakes: ['声音变化没有空间逻辑', '所有转场都使用相同长度'], related: ['room-tone', 'sound-layers', 'cut-on-action'], visual: 'jl-cut', accent: '#b9a5ff'
  },
  {
    id: 'sound-layers', title: '声音层次', titleEn: 'Sound Layers', stage: 'edit', category: '声音',
    tags: ['对白', '环境', '音效', '音乐'], summary: '用对白、环境、动作、设计音效和音乐共同建立空间。',
    purpose: ['让画外空间存在', '控制观众注意力和情绪'], usage: ['画面剪辑基本稳定之后'],
    steps: ['先保证对白清楚', '铺设连续环境层', '加入关键动作声', '最后决定音乐和沉默'],
    mistakes: ['每个空隙都塞满声音', '音乐掩盖对白和表演'], related: ['room-tone', 'jl-cut', 'export-settings'], visual: 'sound-layers', accent: '#b9a5ff'
  },
  {
    id: 'color-match', title: '镜头匹配', titleEn: 'Color Match', stage: 'finish', category: '调色',
    tags: ['曝光', '白平衡', '肤色'], summary: '先让相邻镜头在亮度、色温和肤色上连续，再建立风格。',
    purpose: ['消除切镜时的视觉跳变', '为整体风格提供稳定基础'], usage: ['画面锁定后的第一轮调色'],
    steps: ['匹配曝光', '匹配白平衡', '检查肤色', '最后统一对比度与饱和度'],
    mistakes: ['先套风格LUT再校正', '只看单个镜头是否漂亮'], related: ['color-palette', 'exposure', 'export-settings'], visual: 'color-match', accent: '#ff91bd'
  },
  {
    id: 'subtitles', title: '字幕安全区', titleEn: 'Subtitle Safe Area', stage: 'finish', category: '字幕',
    tags: ['字幕', '可读性', '安全区'], summary: '让字幕在不同屏幕上都清楚、稳定且不遮挡关键信息。',
    purpose: ['保证移动端和大屏可读', '维持画面视觉层级'], usage: ['对白字幕、片名和演职员表'],
    steps: ['保持底部安全距离', '控制每行字数', '按语义断句', '检查浅色和复杂背景'],
    mistakes: ['逐字显示过快', '字幕遮住人物嘴部或关键动作'], related: ['aspect-ratio', 'export-settings'], visual: 'subtitles', accent: '#ff91bd'
  },
  {
    id: 'export-settings', title: '导出检查', titleEn: 'Final Export', stage: 'finish', category: '交付',
    tags: ['分辨率', '码率', '音量'], summary: '按发布平台输出，并完整观看最终导出文件。',
    purpose: ['避免黑帧、错字和声画不同步', '保留一份高质量母版'], usage: ['所有画面、声音和字幕确认之后'],
    steps: ['先导出高质量母版', '再生成平台版本', '用手机、电脑和耳机完整检查'],
    mistakes: ['只检查剪辑时间线', '直接把唯一文件交给平台压缩'], related: ['subtitles', 'color-match', 'sound-layers'], visual: 'export', accent: '#ff91bd'
  },
]

const workflowSheets: CheatSheet[] = [
  {
    id: 'creative-brief', title: '创作简报', titleEn: 'Creative Brief', stage: 'concept', category: '阶段交付物',
    tags: ['题材', '类型', '叙事方式', '观众'], summary: '用一页纸确定作品形式、主题、观众体验和叙事选择。',
    purpose: ['让后续创作有统一方向', '分清题材、类型和叙事方式'], usage: ['启动每一个新短片时'],
    steps: ['写下题材、片长和主类型', '写下希望观众经历的感受', '决定时间顺序、视角与表达方式', '浓缩成一句话故事'],
    mistakes: ['只写抽象主题，没有具体事件', '选择了类型，却没有兑现观众期待'], related: ['story-outline', 'scene-objective'], visual: 'brief', accent: '#ff8d72'
  },
  {
    id: 'story-outline', title: '故事大纲', titleEn: 'Story Outline', stage: 'concept', category: '阶段交付物',
    tags: ['大纲', '结构', '纪实', '节拍'], summary: '按顺序写出开场、触发、发展、关键变化与结尾。',
    purpose: ['检验完整的因果或体验路线', '在写分场前发现结构空白'], usage: ['创作简报明确之后'],
    steps: ['确定开场状态和核心问题', '列出关键事件或探索节点', '写出转折与结尾变化', '为每一步说明为什么会发生'],
    mistakes: ['只有事件清单，没有递进', '结尾只写情绪，没有可见结果'], related: ['creative-brief', 'story-beats', 'scene-shot-list'], visual: 'outline', accent: '#ff8d72'
  },
  {
    id: 'scene-shot-list', title: '分场镜头表', titleEn: 'Scene & Shot List', stage: 'prepare', category: '阶段交付物',
    tags: ['分场', '镜头表', '景别', '运镜'], summary: '把故事大纲转换成逐场、逐镜头可执行的拍摄清单。',
    purpose: ['避免重要信息漏拍', '让画面与声音都有明确功能'], usage: ['大纲完成、正式开拍前'],
    steps: ['为每场写下目标、变化与地点', '列出交代空间、行动、反应和细节的镜头', '标明景别、机位、运镜和所需声音'],
    mistakes: ['只列漂亮镜头，遗漏故事转折', '缺少反应镜头或转场素材'], related: ['shot-size', 'camera-movement', 'coverage', 'shoot-plan'], visual: 'shot-list', accent: '#f5c84c'
  },
  {
    id: 'shoot-plan', title: '拍摄计划', titleEn: 'Shoot Plan', stage: 'prepare', category: '阶段交付物',
    tags: ['顺序', '场景', '光线', '收音'], summary: '把镜头按场景和光线整理为可执行的拍摄顺序。',
    purpose: ['清楚知道每段拍摄要完成什么', '在光线变化前优先拍到关键镜头'], usage: ['分场镜头表完成之后'],
    steps: ['按场景集中镜头', '标出日光、夜景与声音条件', '先安排不可遗漏的主镜头', '为补拍、空镜和现场声音留位置'],
    mistakes: ['严格按剧情顺序拍，反复更换场景', '没有留出补镜头的时间'], related: ['scene-shot-list', 'lighting-direction', 'shoot-log'], visual: 'shoot-plan', accent: '#f5c84c'
  },
  {
    id: 'shoot-log', title: '现场记录', titleEn: 'Shoot Log', stage: 'shoot', category: '阶段交付物',
    tags: ['拍次', '素材', '补拍', '声音'], summary: '记录每个镜头的可用拍次、问题和仍需补拍的素材。',
    purpose: ['帮助剪辑快速找到好素材', '现场发现缺口并及时补拍'], usage: ['每拍完一个镜头之后'],
    steps: ['记录场次、镜号与拍次', '标记表演、画面和声音是否可用', '记下连续性与补拍需求', '收工前核对镜头表'],
    mistakes: ['只记拍过，没有记是否可用', '没有记录现场对白与动作变化'], related: ['coverage', 'room-tone', 'cut-on-action'], visual: 'shoot-log', accent: '#82d8ff'
  },
  {
    id: 'release-checklist', title: '发布清单', titleEn: 'Release Checklist', stage: 'publish', category: '阶段交付物',
    tags: ['发布', '封面', '简介', '检查'], summary: '确认成片、封面、简介、字幕和平台版本都可直接发布。',
    purpose: ['让观众看到完整且清楚的作品', '避免错版、漏字和声音问题'], usage: ['正式发布前'],
    steps: ['完整观看最终导出文件', '检查片名、字幕、封面和简介', '确认所用音乐与素材的使用权', '核对平台画幅与音量'],
    mistakes: ['上传未经复看的文件', '只准备成片，没有准备封面与简介'], related: ['export-settings', 'subtitles', 'creative-review'], visual: 'release', accent: '#ff91bd'
  },
  {
    id: 'creative-review', title: '创作复盘', titleEn: 'Creative Review', stage: 'publish', category: '阶段交付物',
    tags: ['复盘', '反馈', '归档', '下一部'], summary: '记录作品实际效果、拍摄问题和下一次可改进的做法。',
    purpose: ['把经验变成下一部短片的方法', '保存可复用的创作资料'], usage: ['发布后和收集反馈后'],
    steps: ['写下最有效的一个段落', '记录观众看不懂或失去兴趣的位置', '区分剧本、拍摄和后期问题', '归档剧本、镜头表、项目文件和母版'],
    mistakes: ['只看播放数据，不看具体观众反应', '没有保存可复用的模板与素材'], related: ['release-checklist', 'story-outline', 'shoot-log'], visual: 'review', accent: '#ff91bd'
  },
]

// Techniques added from reference breakdowns (e.g. ASTR the Label: Summer 2021).
const referenceSheets: Omit<CheatSheet, 'accent'>[] = [
  {
    id: 'diffusion-vintage-glass', title: '柔光滤镜与复古镜头', titleEn: 'Diffusion Filter & Vintage Glass', stage: 'prepare', category: '镜头',
    tags: ['黑柔', 'Pro-Mist', '柔光镜', '老镜头', 'Leica R', '光晕', '胶片感'], summary: '用柔光滤镜和老镜头让高光微微晕开，画面更柔和、更像胶片。',
    purpose: ['压低数字画面的锐利感', '让逆光、皮肤和白色服装产生柔和光晕'], usage: ['时尚、人像和夏日自然光题材', '想要复古、梦幻质感时'],
    steps: ['先选 1/8 或 1/4 强度的黑柔滤镜，避免过度发灰', '搭配转接的老镜头或复古镀膜镜头', '对着逆光试拍，检查高光晕开的程度', '整片使用同一组镜头与滤镜，保持统一质感'],
    mistakes: ['滤镜强度太大，画面整体发灰', '同一支片子里混用风格差异很大的镜头'], related: ['focal-length', 'sun-flare', 'vintage-film-texture'], visual: 'lens',
  },
  {
    id: 'sun-flare', title: '逆光眩光与太阳光晕', titleEn: 'Sun Flare & Halo', stage: 'prepare', category: '光影',
    tags: ['逆光', '眩光', '光晕', '太阳', '黄昏', '剪影', 'flare'], summary: '让太阳在人物身后或画面边缘入镜，制造温暖的光晕和夏日感。',
    purpose: ['用自然光建立品牌的夏日情绪', '把人物从背景中勾勒出来'], usage: ['上午晚些或下午的户外场景', '人物站在高处、天空作背景时'],
    steps: ['把太阳放在人物头部后方或画面一角', '轻微移动机位，让光斑落在想要的位置', '按皮肤曝光，允许天空稍微过曝', '同一场景多拍几条不同强度的眩光'],
    mistakes: ['眩光盖住人脸', '为了眩光让人物完全变成剪影却没有意图'], related: ['lighting-direction', 'exposure', 'diffusion-vintage-glass'], visual: 'lighting',
  },
  {
    id: 'props-styling', title: '道具与场景点缀', titleEn: 'Props & Set Dressing', stage: 'prepare', category: '美术',
    tags: ['道具', '水果', '布置', '色彩', '场景', 'styling'], summary: '在场景里放少量与服装同色系的道具，让画面有细节和记忆点。',
    purpose: ['给静态造型镜头增加画面兴趣', '用颜色呼应服装与品牌'], usage: ['人物躺、坐或停留的镜头', '需要细节插入镜头时'],
    steps: ['从服装里挑一个主色', '选 1–2 种同色系的小道具', '沿引导线或画面边缘排列，留出人物空间', '再拍一条只有道具的细节镜头'],
    mistakes: ['道具太多抢走服装的注意力', '道具颜色和服装冲突'], related: ['production-design', 'color-palette', 'composition'], visual: 'production',
  },
  {
    id: 'outfit-coverage', title: '每套造型的镜头组', titleEn: 'Outfit Coverage', stage: 'shoot', category: '拍摄',
    tags: ['造型', 'lookbook', '覆盖', '全身', '细节', '面料', '时尚'], summary: '每换一套服装，都拍齐环境全景、全身、半身、近景和面料细节。',
    purpose: ['保证剪辑时每套造型都能完整展示', '让节奏在大景和细节之间自然切换'], usage: ['时尚短片与 lookbook', '一个地点拍多套造型时'],
    steps: ['环境全景：人物小，地点大', '全身：看清剪裁和比例', '半身或近景：表情与配饰', '面料细节：风吹、纹理、印花', '一个运动镜头：推近、横移或引领'],
    mistakes: ['只拍全身，剪辑时缺少节奏', '忘记拍面料细节和空镜'], related: ['coverage', 'shot-size', 'scene-shot-list'], visual: 'coverage',
  },
  {
    id: 'vintage-film-texture', title: '胶片质感与片框', titleEn: 'Vintage Film Texture', stage: 'edit', category: '调色',
    tags: ['胶片', 'Super 8', '片框', '颗粒', '漏光', '黑白', '复古', '怀旧'], summary: '在少数镜头加入胶片片框、颗粒、漏光或黑白，制造回忆般的复古段落。',
    purpose: ['在一支短片里制造质感变化', '给片头或转场一个怀旧的节奏点'], usage: ['片头、转场和情绪段落', '想要复古、手作感时'],
    steps: ['先完成整体调色', '只在 2–4 个镜头上叠加片框或漏光', '黑白或褐色段落保持在几秒内', '颗粒强度在手机上检查'],
    mistakes: ['整片都套滤镜，失去对比', '片框和画面比例不匹配'], related: ['color-match', 'title-cards', 'diffusion-vintage-glass'], visual: 'color-match',
  },
  {
    id: 'title-cards', title: '片名字卡', titleEn: 'Title Cards', stage: 'edit', category: '字幕',
    tags: ['片名', '字卡', '品牌', '开场', '结尾', '字体'], summary: '用简洁的品牌名和系列名做开场与结尾，首尾呼应。',
    purpose: ['让观众第一眼知道品牌与系列', '用同一字卡收尾，形成完整感'], usage: ['品牌时尚片与作品集', '片头空镜和结尾黑场'],
    steps: ['选一种细字重的无衬线或衬线字体', '片名叠在留白充足的空镜上', '系列名或年份放在第二个镜头', '结尾回到同样的片名，放在黑场或最后一帧上'],
    mistakes: ['字体太多、太粗，抢走画面', '字卡停留太短，观众来不及读'], related: ['subtitles', 'vintage-film-texture', 'export-settings'], visual: 'subtitles',
  },
]

export const sheets: CheatSheet[] = [
  ...workflowSheets,
  ...referenceSheets.map((sheet) => ({ ...sheet, accent: stages.find((stage) => stage.id === sheet.stage)!.accent })),
  ...originalSheets.map((sheet) => ({ ...sheet, stage: stageMap[sheet.stage], accent: stages.find((stage) => stage.id === stageMap[sheet.stage])!.accent })),
]
