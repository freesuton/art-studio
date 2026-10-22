import type { CheatSheet, Stage } from './types'

export const stages: Stage[] = [
  { id: 'story', index: '01', title: '故事', subtitle: '决定这一场为什么存在', accent: '#ff8d72' },
  { id: 'visual', index: '02', title: '视觉设计', subtitle: '建立全片统一的观看感受', accent: '#f5c84c' },
  { id: 'shots', index: '03', title: '镜头设计', subtitle: '把场景转译成镜头语言', accent: '#d8ff42' },
  { id: 'set', index: '04', title: '现场拍摄', subtitle: '稳定地拍到可剪辑的素材', accent: '#82d8ff' },
  { id: 'edit', index: '05', title: '剪辑与声音', subtitle: '用时间与声音重建场景', accent: '#b9a5ff' },
  { id: 'finish', index: '06', title: '成片', subtitle: '统一、检查并正确输出', accent: '#ff91bd' },
]

export const sheets: CheatSheet[] = [
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
