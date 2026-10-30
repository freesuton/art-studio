// Shot-by-shot breakdowns of reference films. Each one can seed a workspace
// project whose items are already sorted into the six sections, with notes.
type Text = { zh: string; en: string }
export type Breakdown = {
  id: string
  filmId: string
  title: Text
  intro: Text
  shots: Shot[]
  items: { key: string; note: Text }[]
}

// How one shot was captured. Lens and frame-rate values are estimates read from the footage.
export type Capture = { size: Text; angle: Text; move: Text; lens: Text; light: Text; action: Text; post?: Text }
export type Shot = { time: string; start: number; end: number; zh: string; en: string; capture: Capture; keys: string[] }

const tx = (zh: string, en: string): Text => ({ zh, en })
const NO_TALENT = tx('无人物', 'No talent')

export const breakdowns: Breakdown[] = [
  {
    id: 'astr-summer-2021', filmId: 'astr-summer',
    title: { zh: '仿拍：ASTR the Label · Summer 2021', en: 'Remake: ASTR the Label · Summer 2021' },
    intro: {
      zh: '60 秒沙漠时尚短片：一个地点、一天的阳光、三到四套造型，没有剧情。大多是逆光下的固定或缓慢推近画面，用倒置仰拍、面料细节和复古胶片段落打破节奏，首尾用品牌字卡呼应。',
      en: 'A 60-second desert fashion film: one location, one day of sun, three or four looks, no story. Mostly backlit static or slow push-in frames, broken up by an upside-down sky shot, fabric details and vintage film moments, bookended by brand title cards.',
    },
    shots: [
      { time: '0:00–0:04', start: 0, end: 5, zh: '车窗流动空镜：沙漠地平线与约书亚树，叠品牌名。', en: 'Drive-by landscape of the desert horizon and Joshua trees, brand title over it.',
        capture: { size: tx('大远景空镜', 'Extreme wide plate'), angle: tx('平视，从车窗侧向拍出去', 'Eye level, sideways out of a car window'), move: tx('车载横移：前景草丛快速掠过，远景缓慢移动', 'Drive-by: foreground brush streaks past, horizon drifts slowly'), lens: tx('中长焦，约 50–85mm（推测）', 'Normal to short tele, about 50–85mm (est.)'), light: tx('低角度侧光，天空偏冷', 'Low side sun, cool sky'), action: NO_TALENT, post: tx('淡入，叠品牌名', 'Fade in, brand title over') },
        keys: ['camera:drive-by-landscape', 'sheet:title-cards'] },
      { time: '0:05–0:10', start: 5, end: 11, zh: '天空与月亮、逆光仙人掌，叠系列名，加胶片片框。', en: 'Sky with the moon and a backlit cactus, collection title, vintage film gate.',
        capture: { size: tx('天空空镜，接仙人掌前景特写', 'Sky plate, then a close foreground cactus'), angle: tx('低机位仰拍', 'Low, looking up'), move: tx('固定或极微小漂移', 'Locked or a barely visible drift'), lens: tx('长焦，浅景深压缩背景（推测）', 'Long lens with shallow depth (est.)'), light: tx('正逆光，太阳藏在仙人掌后产生眩光', 'Hard backlight, sun flaring from behind the cactus'), action: NO_TALENT, post: tx('系列名字卡，叠 Super 8 片框', 'Collection title card, Super 8 gate overlay') },
        keys: ['camera:micro-drift', 'sheet:sun-flare', 'sheet:depth-focus', 'sheet:vintage-film-texture', 'sheet:title-cards'] },
      { time: '0:12–0:17', start: 12, end: 18, zh: '固定远景：人物站在木栅栏上，前景约书亚树框住画面，太阳眩光。', en: 'Locked-off wide: subject on a wooden fence, Joshua tree framing the foreground, sun flare.',
        capture: { size: tx('大远景，人物只占画面很小一部分', 'Extreme wide, the subject is tiny'), angle: tx('平视', 'Eye level'), move: tx('三脚架固定', 'Locked off on a tripod'), lens: tx('广角至标准，约 24–35mm（推测）', 'Wide to normal, about 24–35mm (est.)'), light: tx('高位侧光，太阳在画面上沿形成眩光', 'High side sun flaring along the top edge'), action: tx('站在栅栏上，几乎不动', 'Standing on the fence, almost still') },
        keys: ['camera:locked-tableau', 'sheet:composition', 'sheet:shot-size', 'sheet:sun-flare'] },
      { time: '0:18–0:23', start: 18, end: 24, zh: '缓慢推近：粉色吊带裙，逆光加柔光滤镜的光晕，人物看镜头。', en: 'Slow push-in: pink slip dress, backlight glowing through diffusion, eye contact.',
        capture: { size: tx('全身推到中全景', 'Full shot pushing to medium full'), angle: tx('平视略低', 'Eye level, slightly low'), move: tx('稳定器或滑轨缓慢推近，约 5 秒', 'Slow push-in on a gimbal or slider, about 5 seconds'), lens: tx('约 50mm（推测）', 'About 50mm (est.)'), light: tx('逆光，柔光滤镜让发丝和高光晕开', 'Backlight; diffusion blooms the hair and highlights'), action: tx('站定，慢慢看向镜头', 'Standing still, slowly finding the lens') },
        keys: ['camera:slow-push-in', 'sheet:lighting-direction', 'sheet:diffusion-vintage-glass', 'motion:mixkit-2931'] },
      { time: '0:24–0:27', start: 24, end: 28, zh: '倒置仰拍：人物后仰、头发垂落，接一个倒置的胶片质感约书亚树。', en: 'Upside-down sky shot: subject leaning back with hair falling, then an inverted Joshua tree on film.',
        capture: { size: tx('中景到近景', 'Medium to close'), angle: tx('从人物下方仰拍，画面倒置', 'From below, frame flipped upside down'), move: tx('手持，轻微漂移', 'Handheld with a slight drift'), lens: tx('广角至标准（推测）', 'Wide to normal (est.)'), light: tx('天光加镜头眩光', 'Open sky with a lens flare'), action: tx('后仰，头发自然垂下，看向镜头', 'Leaning back, hair hanging, eyes to the lens'), post: tx('旋转 180°；下一镜叠胶片质感', 'Rotated 180°; the next shot gets film texture') },
        keys: ['camera:upside-down-sky', 'motion:mixkit-41617', 'sheet:vintage-film-texture'] },
      { time: '0:28', start: 28, end: 30, zh: '低角度英雄镜头：人物站在石墙上，只拍腰部以下，背景是天空。', en: 'Low-angle hero: subject on a stone wall, framed from the waist down against the sky.',
        capture: { size: tx('中景，只拍腰部以下', 'Medium, waist down'), angle: tx('贴地低机位仰拍', 'Ground level, looking up'), move: tx('固定', 'Locked'), lens: tx('广角，约 24–35mm（推测）', 'Wide, about 24–35mm (est.)'), light: tx('逆光加眩光', 'Backlight with flare'), action: tx('站在石墙上，手提网兜', 'Standing on a stone wall holding a net bag') },
        keys: ['camera:low-angle-hero', 'sheet:camera-angle', 'sheet:sun-flare'] },
      { time: '0:30–0:33', start: 30, end: 34, zh: '固定全身：米白长裙，太阳在画面上方形成眩光。', en: 'Locked full shot: cream dress with the sun flaring at the top of frame.',
        capture: { size: tx('全身', 'Full shot'), angle: tx('略低机位', 'Slightly low'), move: tx('固定，或极慢的推近', 'Locked, or a very slow push'), lens: tx('约 35–50mm（推测）', 'About 35–50mm (est.)'), light: tx('太阳在画面上沿形成眩光', 'Sun flaring at the top of frame'), action: tx('站立，轻微转移重心', 'Standing with small weight shifts') },
        keys: ['camera:locked-tableau', 'sheet:sun-flare', 'sheet:outfit-coverage', 'motion:mixkit-2931'] },
      { time: '0:34', start: 34, end: 36, zh: '面料在风中的特写，升格慢动作。', en: 'Close-up of fabric in the wind, in slow motion.',
        capture: { size: tx('细节特写', 'Detail close-up'), angle: tx('侧面', 'From the side'), move: tx('手持，跟着面料移动', 'Handheld, following the fabric'), lens: tx('中长焦（推测）', 'Normal to short tele (est.)'), light: tx('逆光透过薄纱', 'Backlight through sheer fabric'), action: tx('风吹起衣料', 'Wind lifting the fabric'), post: tx('升格慢动作，60fps 以上拍摄（推测）', 'Slow motion, shot at 60fps or higher (est.)') },
        keys: ['camera:slow-motion', 'sheet:outfit-coverage', 'motion:mixkit-2818'] },
      { time: '0:36', start: 36, end: 38, zh: '中景低角度：绿色上衣，人物看镜头。', en: 'Low-angle medium: green top, looking into the lens.',
        capture: { size: tx('中景', 'Medium'), angle: tx('低机位仰拍', 'Low, looking up'), move: tx('固定或微推', 'Static or a slight push'), lens: tx('约 35–50mm（推测）', 'About 35–50mm (est.)'), light: tx('侧逆光，按皮肤曝光', 'Rim light, exposed for skin'), action: tx('站立，直视镜头', 'Standing, looking straight into the lens') },
        keys: ['camera:low-angle-hero', 'sheet:exposure', 'sheet:shot-size'] },
      { time: '0:38–0:40', start: 38, end: 41, zh: '褐色与黑白的 Super 8 片框段落，人物抱膝坐在墙上。', en: 'Sepia and black-and-white Super 8 frames; subject sitting on a wall hugging her knees.',
        capture: { size: tx('中景到近景', 'Medium to close'), angle: tx('平视', 'Eye level'), move: tx('手持', 'Handheld'), lens: tx('标准焦段（推测）', 'Normal lens (est.)'), light: tx('自然光', 'Natural light'), action: tx('抱膝坐在墙上', 'Sitting on a wall hugging her knees'), post: tx('褐色与黑白，叠 Super 8 片框和画格边', 'Sepia and B&W with a Super 8 gate and frame lines') },
        keys: ['sheet:vintage-film-texture', 'camera:floating-handheld', 'sheet:color-match'] },
      { time: '0:42', start: 42, end: 44, zh: '彩色近景肖像，略低机位，眼神交流。', en: 'Color close-up portrait from slightly below, eye contact.',
        capture: { size: tx('近景', 'Close-up'), angle: tx('略低机位', 'Slightly low'), move: tx('固定或极微小漂移', 'Locked or a tiny drift'), lens: tx('约 50–85mm（推测）', 'About 50–85mm (est.)'), light: tx('柔和逆光，天空作背景', 'Soft backlight against the sky'), action: tx('手臂搭在膝上，看向镜头', 'Arms resting on her knees, eyes to the lens') },
        keys: ['camera:micro-drift', 'sheet:focal-length', 'sheet:depth-focus'] },
      { time: '0:44', start: 44, end: 46, zh: '印花面料纹理的大特写。', en: 'Extreme close-up of the floral print texture.',
        capture: { size: tx('大特写', 'Extreme close-up'), angle: tx('贴近面料', 'Right up against the fabric'), move: tx('极微小漂移', 'Micro drift'), lens: tx('微距或近对焦镜头（推测）', 'Macro or close-focus lens (est.)'), light: tx('天光', 'Skylight'), action: tx('只有面料', 'Fabric only') },
        keys: ['camera:micro-drift', 'sheet:outfit-coverage'] },
      { time: '0:46', start: 46, end: 48, zh: '远景：人物站在粉色平台上，太阳正好在头部后方形成光环，前景是虚化的干草。', en: 'Wide: subject on a pink platform with the sun as a halo behind her head, soft dry grass in front.',
        capture: { size: tx('远景', 'Wide'), angle: tx('低机位', 'Low'), move: tx('固定', 'Locked'), lens: tx('较长焦段，让太阳显得更大（推测）', 'Longer lens so the sun reads larger (est.)'), light: tx('太阳正好藏在头部后方，形成光环', 'Sun hidden exactly behind her head as a halo'), action: tx('站在粉色平台上，静止', 'Standing still on a pink platform') },
        keys: ['sheet:sun-flare', 'camera:locked-tableau', 'sheet:composition', 'sheet:depth-focus'] },
      { time: '0:48–0:50', start: 48, end: 51, zh: '横移：人物躺在木栈道上，旁边摆满水果道具。', en: 'Lateral slide past the subject lying on a boardwalk lined with fruit.',
        capture: { size: tx('中景到全身', 'Medium to full'), angle: tx('与人物同高的平视', 'Level with her'), move: tx('滑轨横移', 'Lateral slide on a slider'), lens: tx('约 35–50mm（推测）', 'About 35–50mm (est.)'), light: tx('偏高的阳光', 'High sun'), action: tx('躺着，闭眼放松', 'Lying down, eyes closed and relaxed') },
        keys: ['camera:parallax-truck', 'sheet:props-styling', 'motion:mixkit-5179'] },
      { time: '0:52–0:56', start: 52, end: 57, zh: '对称木栈道上人物迎面走来，镜头后退引领。', en: 'Subject walks toward camera down a symmetrical boardwalk while the camera retreats.',
        capture: { size: tx('全身逐渐变为远景', 'Full shot widening out'), angle: tx('平视，中轴对称', 'Eye level, centered symmetry'), move: tx('稳定器倒退引领，后退比人物走得快', 'Gimbal leading backtrack, retreating faster than she walks'), lens: tx('约 35mm（推测）', 'About 35mm (est.)'), light: tx('侧前方阳光', 'Sun from the front side'), action: tx('沿栈道迎面走来', 'Walking toward the lens along the boardwalk') },
        keys: ['camera:lead-backtrack', 'sheet:composition', 'sheet:blocking'] },
      { time: '0:58', start: 57, end: 60, zh: '黑场品牌字卡收尾。', en: 'Brand title card on black to close.',
        capture: { size: tx('字卡', 'Title card'), angle: tx('—', '—'), move: tx('—', '—'), lens: tx('—', '—'), light: tx('黑场', 'Black'), action: NO_TALENT, post: tx('品牌名回到画面中央，呼应开场', 'The brand name returns centered, echoing the opening') },
        keys: ['sheet:title-cards'] },
    ],
    items: [
      { key: 'film:astr-summer', note: { zh: '主参考：反复看 0:18 的推近和 0:46 的太阳光环。', en: 'Main reference: rewatch the 0:18 push-in and the 0:46 sun halo.' } },
      { key: 'sheet:creative-brief', note: { zh: '定位：无剧情的情绪 lookbook，一个地点、一天光线、三到四套造型。', en: 'Pitch: a story-free mood lookbook, one location, one day of light, three or four looks.' } },
      { key: 'sheet:story-outline', note: { zh: '结构：片名空镜 → 逐套造型亮相 → 细节与质感 → 迎面走来收尾 → 片名。', en: 'Structure: title landscape → each look → details and texture → walk toward camera → title.' } },
      { key: 'sheet:visual-motif', note: { zh: '母题：约书亚树、太阳与蓝天在每套造型中反复出现。', en: 'Motifs: Joshua trees, the sun and blue sky return in every look.' } },
      { key: 'sheet:color-palette', note: { zh: '粉彩、米白、浅绿的服装，对比蓝天和沙色。', en: 'Pastel, cream and pale green wardrobe against blue sky and sand.' } },
      { key: 'sheet:lighting-direction', note: { zh: '几乎全部逆光或侧逆光，选上午晚些或下午拍。', en: 'Almost everything is backlit or rim-lit; shoot late morning or afternoon.' } },
      { key: 'sheet:sun-flare', note: { zh: '0:12、0:30、0:46：把太阳放在人物头后或画面上方。', en: '0:12, 0:30, 0:46: put the sun behind the head or along the top of frame.' } },
      { key: 'sheet:diffusion-vintage-glass', note: { zh: '原片使用老镜头加 1/8 黑柔滤镜，高光和皮肤会微微晕开。', en: 'The original used vintage glass plus a 1/8 diffusion filter, so highlights and skin bloom slightly.' } },
      { key: 'sheet:composition', note: { zh: '0:12 用前景树框住人物；0:52 用对称木栈道做引导线。', en: '0:12 frames her with a foreground tree; 0:52 uses the symmetrical boardwalk as leading lines.' } },
      { key: 'sheet:camera-angle', note: { zh: '多处低机位仰拍，让人物与天空相连。', en: 'Many low angles connect the subject with the sky.' } },
      { key: 'sheet:props-styling', note: { zh: '0:48 栈道边摆一排与服装同色系的水果。', en: '0:48: a row of fruit along the boardwalk in the dress colors.' } },
      { key: 'sheet:scene-shot-list', note: { zh: '按上面的镜头时间线写成自己的镜头表。', en: 'Turn the timeline above into your own shot list.' } },
      { key: 'camera:drive-by-landscape', note: { zh: '0:00 开场空镜。', en: '0:00 opening landscape.' } },
      { key: 'camera:locked-tableau', note: { zh: '0:12、0:30、0:46 的固定远景和全身。', en: 'Static wides and full shots at 0:12, 0:30, 0:46.' } },
      { key: 'camera:slow-push-in', note: { zh: '0:18 粉裙推近。', en: '0:18 push-in on the pink dress.' } },
      { key: 'camera:upside-down-sky', note: { zh: '0:24 后仰、头发垂落的倒置镜头。', en: '0:24 inverted shot with hair falling.' } },
      { key: 'camera:low-angle-hero', note: { zh: '0:28 石墙上的低角度镜头，0:36 中景。', en: '0:28 low angle on the stone wall, 0:36 medium.' } },
      { key: 'camera:slow-motion', note: { zh: '0:34 面料在风中，用 60fps 以上拍。', en: '0:34 fabric in the wind; shoot 60fps or higher.' } },
      { key: 'camera:micro-drift', note: { zh: '0:44 面料纹理特写，镜头几乎不动。', en: '0:44 fabric texture close-up with barely any movement.' } },
      { key: 'camera:parallax-truck', note: { zh: '0:48 横移经过躺在栈道上的人物。', en: '0:48 slide past the subject lying on the boardwalk.' } },
      { key: 'camera:lead-backtrack', note: { zh: '0:52 人物迎面走来，镜头后退。', en: '0:52 subject walks in while the camera retreats.' } },
      { key: 'sheet:outfit-coverage', note: { zh: '每套造型都拍：环境远景、全身、近景、面料细节、一个运动镜头。', en: 'For every look: wide in the landscape, full body, close-up, fabric detail, one moving shot.' } },
      { key: 'sheet:exposure', note: { zh: '逆光按皮肤曝光，允许天空过曝一点。', en: 'In backlight, expose for skin and let the sky clip slightly.' } },
      { key: 'motion:mixkit-2931', note: { zh: '站在原地停留、感受环境，对应 0:30 的站姿。', en: 'Pausing in place to take in the setting, like the 0:30 stance.' } },
      { key: 'motion:mixkit-2818', note: { zh: '风吹头发和衣料时的侧向注视。', en: 'Looking off to the side while wind moves hair and fabric.' } },
      { key: 'motion:mixkit-41617', note: { zh: '倒置镜头里头发慢慢摆动的参考。', en: 'Reference for slow hair movement in the inverted shot.' } },
      { key: 'motion:mixkit-5179', note: { zh: '0:48 躺在栈道上闭眼放松。', en: '0:48 lying on the boardwalk, eyes closed and relaxed.' } },
      { key: 'sheet:shoot-log', note: { zh: '记录每套造型拍了哪些景别，避免遗漏。', en: 'Log which shot sizes each look has so nothing is missed.' } },
      { key: 'sheet:title-cards', note: { zh: '0:04 品牌名、0:08 系列名，0:58 黑场收尾。', en: 'Brand at 0:04, collection at 0:08, black card at 0:58.' } },
      { key: 'sheet:vintage-film-texture', note: { zh: '0:06、0:26、0:38 加片框、漏光或褐色黑白。', en: 'Film gate, light leaks or sepia/B&W at 0:06, 0:26, 0:38.' } },
      { key: 'sheet:color-match', note: { zh: '统一暖调、略微提亮暗部，让各套造型颜色一致。', en: 'Keep a warm grade with slightly lifted blacks so every look matches.' } },
      { key: 'sheet:sound-layers', note: { zh: '全片由一首音乐带节奏，剪辑点跟着节拍。', en: 'One music track drives the whole film; cut on the beat.' } },
      { key: 'sheet:release-checklist', note: { zh: '导出 60 秒横版，再做一个 9:16 竖版用于社交平台。', en: 'Export the 60s horizontal cut plus a 9:16 vertical version for social.' } },
      { key: 'sheet:creative-review', note: { zh: '和原片并排看：逆光光晕和节奏变化有没有做到。', en: 'Watch side by side with the original: did you get the backlit glow and the rhythm changes?' } },
    ],
  },
]
