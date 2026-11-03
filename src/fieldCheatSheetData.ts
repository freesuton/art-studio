import type { DiagramKind } from './SetupDiagram'
import beautyShots from './assets/beauty-shots.jpg'

type Text = { zh: string; en: string }
// A reference is either a Mixkit clip from the motion library (by asset id) or a shot of
// the ASTR Summer 2021 breakdown (by its time label), so every video here is already verified.
export type CheatRef = { clip: string } | { shot: string }
// `photo` is a cell (left to right, top to bottom) of the section's photo sprite.
export type CheatItem = { title: Text; body: Text; why?: Text; diagram?: DiagramKind; lens?: number; photo?: number; refs?: CheatRef[] }
export type CheatPhotos = { src: string; cols: number; rows: number }
export type CheatFooter = { title: Text; points: Text[]; lenses: { mm: string; use: Text }[]; tip: Text }
export type CheatSection = { id: string; accent: string; title: Text; hint: Text; items: CheatItem[]; photos?: CheatPhotos; footer?: CheatFooter }

// On-set quick reference for shooting outdoor fashion video with a female model.
// Short enough to read on a phone between takes.
export const fieldCheatSheet: CheatSection[] = [
  {
    id: 'composition', accent: '#d8ff42',
    title: { zh: '构图', en: 'Composition' },
    hint: { zh: '人放在哪、画面怎么切', en: 'Where she sits in the frame and where to crop' },
    items: [
      { title: { zh: '三分法', en: 'Rule of thirds' }, body: { zh: '眼睛放在上三分线上，脸放在左或右三分线。她看向哪边，哪边就多留空间（视线空间）。', en: 'Eyes on the top third line, face on the left or right third. Leave more space on the side she looks toward (look room).' }, diagram: 'thirds', refs: [{ clip: '2818' }] },
      { title: { zh: '居中对称', en: 'Centered and symmetrical' }, body: { zh: '直视镜头、放在画面正中，背景用门洞、小路、地平线做对称。气场强，适合主视觉镜头。', en: 'Straight to camera, dead center, with a symmetrical doorway, path or horizon behind. Confident and editorial, good for hero shots.' }, diagram: 'center', refs: [{ shot: '0:52–0:56' }] },
      { title: { zh: '大留白', en: 'Negative space' }, body: { zh: '人在大面积天空、沙滩、墙面里显得很小。时尚片最常用，显得安静、高级，还能放字。', en: 'She is small inside a big field of sky, sand or wall. The classic fashion-film look: calm, luxurious, with room for text.' }, diagram: 'negative', refs: [{ clip: '4629' }, { shot: '0:46' }] },
      { title: { zh: '引导线', en: 'Leading lines' }, body: { zh: '海岸线、栏杆、小路、田垄，让线条通向她。', en: 'Shorelines, railings, paths and crop rows that run toward her.' }, diagram: 'lines', refs: [{ clip: '1012' }, { shot: '0:52–0:56' }] },
      { title: { zh: '框中框', en: 'Frame within a frame' }, body: { zh: '用窗户、拱门、树枝、两块石头之间的缝隙把她框起来。', en: 'Frame her with a window, an arch, branches, or the gap between two rocks.' }, diagram: 'framed', refs: [{ shot: '0:12–0:17' }] },
      { title: { zh: '前景虚化', en: 'Shoot through foreground' }, body: { zh: '镜头贴近草、树叶、纱帘或布料拍过去，前景虚成一层雾。有层次、有偷看感，夏日时尚片必备。', en: 'Hold grass, leaves, sheer curtain or fabric right in front of the lens so it blurs into haze. Adds depth and a voyeuristic, summery feel.' }, diagram: 'foreground', refs: [{ shot: '0:46' }, { clip: '4897' }] },
      { title: { zh: '机位高度', en: 'Camera height' }, body: { zh: '全身：腰高略往上拍，显腿长、有气场。近景：平视，亲密自然。高机位往下拍显得柔弱，少用。', en: 'Full body: waist height tilted slightly up, for longer legs and presence. Close-ups: eye level. High angles look vulnerable, so use them sparingly.' }, diagram: 'height', refs: [{ shot: '0:28' }, { shot: '0:42' }] },
      { title: { zh: '不要切在关节上', en: 'Never crop at a joint' }, body: { zh: '脖子、手肘、手腕、腰、膝盖、脚踝都不能是画面边缘。切在关节之间：大腿中段、上臂中段、小腿中段。近景可以切掉头顶。', en: 'Neck, elbows, wrists, waist, knees and ankles should never sit on the frame edge. Crop between joints: mid-thigh, mid-upper-arm, mid-shin. Close-ups can cut off the top of the head.' }, diagram: 'crop' },
      { title: { zh: '检查背景', en: 'Check the background' }, body: { zh: '头后面不能"长出"电线杆、树干、地平线。地平线要水平，并且不要穿过脖子。', en: 'No pole, trunk or horizon growing out of her head. Keep the horizon level and away from her neck.' }, diagram: 'background' },
    ],
  },
  {
    id: 'coverage', accent: '#f5c84c',
    title: { zh: '每套造型拍什么', en: 'Coverage per look' },
    hint: { zh: '保证剪得出来', en: 'So the edit cuts together' },
    items: [
      { title: { zh: '四种景别', en: 'Four shot sizes' }, body: { zh: '远景（人加环境）、中景（腰以上，看清衣服）、近景（脸）、特写（手、面料、首饰、鞋踩在沙里）。', en: 'Wide (body plus place), medium (waist up, shows the outfit), close-up (face), detail (hands, fabric, jewelry, a shoe in the sand).' }, diagram: 'sizes', refs: [{ shot: '0:30–0:33' }, { shot: '0:36' }, { shot: '0:42' }, { shot: '0:44' }] },
      { title: { zh: '至少两个细节', en: 'At least two details' }, body: { zh: '面料被风吹、手指划过领口、耳环晃动、脚步。细节镜头最容易被忘，也最救剪辑。', en: 'Fabric in the wind, fingers along a neckline, a swinging earring, footsteps. The easiest shots to forget and the ones that save the edit.' }, refs: [{ shot: '0:34' }, { shot: '0:44' }] },
      { title: { zh: '一个运动镜头', en: 'One moving shot' }, body: { zh: '跟拍行走、慢慢推近、绕人半圈，选一个就够。', en: 'A walking track, a slow push-in, or a half orbit. One is enough.' }, diagram: 'track', refs: [{ shot: '0:18–0:23' }, { shot: '0:52–0:56' }] },
      { title: { zh: '空镜', en: 'Cutaways' }, body: { zh: '天空、海浪、树影、光斑。模特换装或休息时拍。', en: 'Sky, waves, leaf shadows, flares. Shoot them while the model changes or rests.' }, refs: [{ shot: '0:00–0:04' }, { shot: '0:05–0:10' }] },
      { title: { zh: '前后多留 3 秒', en: 'Hold 3 seconds each side' }, body: { zh: '开机后等 3 秒再喊"开始"，动作结束后再多录 3 秒，剪辑才有余量。', en: 'Roll 3 seconds before "action" and keep rolling 3 seconds after the move ends, so the editor has handles.' }, diagram: 'handles' },
      { title: { zh: '入画和出画', en: 'Enter and exit frame' }, body: { zh: '让她从画外走进来、再走出去，各拍一次。最好用的转场素材。', en: 'Have her walk into an empty frame and out of it, once each. The easiest transitions you will ever get.' }, diagram: 'enterexit' },
    ],
  },
  {
    id: 'pose', accent: '#ff8d72',
    title: { zh: '姿势与动作', en: 'Posing and movement' },
    hint: { zh: '给动作，不要给姿势', en: 'Give actions, not poses' },
    items: [
      { title: { zh: '给动作而不是姿势', en: 'Actions over poses' }, body: { zh: '不要说"摆个姿势"，说"慢慢走向那块石头，摸一下它再回头"。有事可做，人就自然。', en: 'Not "strike a pose" but "walk slowly to that rock, touch it, then look back". Something to do makes her natural.' }, refs: [{ clip: '25561' }, { clip: '4897' }] },
      { title: { zh: '重心放一条腿', en: 'Weight on one leg' }, body: { zh: '重心在后腿，前腿膝盖微弯，胯和肩反方向扭一点，形成 S 形曲线。', en: 'Weight on the back leg, front knee softly bent, hips and shoulders turned opposite ways for an S-curve.' }, diagram: 'scurve', refs: [{ clip: '1526' }] },
      { title: { zh: '做出三角形', en: 'Make triangles' }, body: { zh: '手叉腰、手撩头发、手肘弯曲，身体和四肢之间的空隙让画面更有活力。', en: 'Hand on hip, hand in hair, bent elbows. Gaps between limbs and body make the frame dynamic.' }, diagram: 'triangle' },
      { title: { zh: '手要软', en: 'Soft hands' }, body: { zh: '手不要握拳或平贴身体。轻轻碰衣服、头发、脸侧，像拿着一片羽毛。', en: 'No fists, no flat palms on the body. Lightly touch fabric, hair or the side of the face, as if holding a feather.' }, refs: [{ clip: '25561' }] },
      { title: { zh: '下巴往前一点', en: 'Chin forward, slightly down' }, body: { zh: '下巴往镜头方向伸一点再微微下压，下颌线更清晰。', en: 'Push the chin a little toward the lens, then tip it down slightly for a sharper jawline.' } },
      { title: { zh: '走路要慢', en: 'Walk slowly' }, body: { zh: '比平时慢一半，脚尖先落地，步子交叉一点点。用 60fps 拍，后期再放慢。', en: 'Half her normal speed, toes landing first, steps crossing slightly. Shoot 60fps and slow it in post.' }, refs: [{ clip: '1114' }, { clip: '4629' }] },
      { title: { zh: '回头', en: 'The look back' }, body: { zh: '背对镜头走两步，先转肩、再转头，最后眼睛才看过来。分三拍，不要一下转完。', en: 'Two steps away from camera, then shoulders, then head, then eyes last. Three beats, not one snap.' }, diagram: 'lookback', refs: [{ clip: '1299' }] },
      { title: { zh: '借风', en: 'Use the wind' }, body: { zh: '让她面向风或侧对风，裙摆和头发自然飘。没风就让助手在画外抖布或用扇子。', en: 'Face her into or across the wind so hair and hem move. No wind? Have someone flap fabric or fan from off-frame.' }, diagram: 'wind', refs: [{ clip: '1117' }, { clip: '2818' }] },
      { title: { zh: '眼神', en: 'Eyes' }, body: { zh: '看镜头旁边一点、看远处、先低头再抬眼看镜头。眯眼时让她闭眼，数 3 再睁开。', en: 'Just past the lens, far away, or look down then lift the eyes to camera. If she squints, close the eyes and open on a count of 3.' }, refs: [{ clip: '5179' }] },
    ],
  },
  {
    id: 'beauty', accent: '#e8b36a',
    title: { zh: '不拍脸的美感', en: 'Beauty without the face' },
    hint: { zh: '不用一直拍脸，也能拍出很有感觉的女性画面', en: 'Twelve shots that show her grace without always filming her face' },
    photos: { src: beautyShots, cols: 3, rows: 4 },
    items: [
      { title: { zh: '触觉特写（手划过树皮）', en: 'Touch close-up: hand on bark' }, body: { zh: '特写拍手指缓缓划过树皮的纹理。', en: 'Close on her fingers slowly tracing the bark.' }, why: { zh: '通过触觉细节传递细腻情绪，含蓄又有代入感。', en: 'A tactile detail carries a delicate feeling. It is understated, and the viewer can almost feel it.' }, photo: 0 },
      { title: { zh: '手先入画', en: 'The hand enters first' }, body: { zh: '先让手伸入画面，拨开草穗或触碰落叶，随后再带出人物。', en: 'Her hand reaches into frame first, brushing the grass or touching the leaves, then she follows.' }, why: { zh: '用"手的引导"建立期待，画面更自然、更有故事感。', en: 'The hand builds anticipation, so the shot feels natural and tells a story.' }, photo: 1 },
      { title: { zh: '前景窥视（隔着树叶拍）', en: 'Peek through leaves' }, body: { zh: '隔着树叶或枝条拍摄人物，让前景轻微虚化。', en: 'Shoot her through leaves or branches and let the foreground blur softly.' }, why: { zh: '营造"被发现"的视角，增加层次与氛围，画面更有电影感。', en: 'It feels as if we found her. The layers add depth and mood, and it looks more cinematic.' }, photo: 2 },
      { title: { zh: '逆光轮廓（发丝与肩线）', en: 'Backlit outline: hair and shoulders' }, body: { zh: '逆光拍摄人物的侧脸或半身，突出发丝与肩线的光边。', en: 'Shoot her profile or half body against the sun so light rims her hair and shoulders.' }, why: { zh: '柔和的光晕勾勒轮廓，让画面温暖、浪漫且富有质感。', en: 'A soft glow traces her outline, so the image feels warm, romantic and rich.' }, photo: 3 },
      { title: { zh: '侧后跟拍（肩线与步伐）', en: 'Follow from behind: shoulders and stride' }, body: { zh: '从斜后方跟随人物行走，拍肩线与自然的步伐。', en: 'Follow her from behind at an angle, framing her shoulders and natural stride.' }, why: { zh: '既保留神秘感，又能展现轻盈的动态，富有生活气息。', en: 'It keeps some mystery while showing light, easy movement that feels like real life.' }, photo: 4 },
      { title: { zh: '低机位步伐（靴子与落叶）', en: 'Low-angle steps: boots in the leaves' }, body: { zh: '低机位近距离拍摄她的靴子踩过落叶的步伐。', en: 'Low and close on her boots stepping through fallen leaves.' }, why: { zh: '用脚步和落叶的声音感受季节，让画面更生动、有节奏。', en: 'Her steps and the crunch of leaves bring the season in and give the edit rhythm.' }, photo: 5 },
      { title: { zh: '半环绕（从背后到侧面 45°）', en: 'Half arc: from behind to a 45° side view' }, body: { zh: '从人物背后开始，缓慢绕到侧前 45°，展现她的侧脸与表情。', en: 'Start behind her and slowly arc round to 45° in front, revealing her profile and expression.' }, why: { zh: '运动的视角带来更强的代入感与立体感，画面层次更丰富。', en: 'The moving viewpoint draws the viewer in and gives the shot depth.' }, photo: 6 },
      { title: { zh: '动作跟随（手拿杯子 / 书）', en: 'Follow the action: cup or book' }, body: { zh: '跟随她的手拿起杯子喝水，或翻开书页的动作。', en: 'Follow her hand as she lifts a cup to drink or opens a book.' }, why: { zh: '通过日常动作展现她的状态，自然放松，又充满生活的诗意。', en: 'Everyday actions show how she feels. It is relaxed, with a quiet poetry.' }, photo: 7, refs: [{ clip: '4897' }] },
      { title: { zh: '背影停留（看树林或草地）', en: 'Back view: looking at the woods' }, body: { zh: '拍摄人物的背影，静止或微微前移，看向树林或草地。', en: 'Film her from behind, still or drifting slightly forward, looking at the trees or the field.' }, why: { zh: '背影留出想象空间，带来安静、沉浸的情绪，画面更有余韵。', en: 'A back view leaves room to imagine. It is quiet and absorbing, and it lingers.' }, photo: 8 },
      { title: { zh: '环境先于人物', en: 'The place before the person' }, body: { zh: '先拍一段环境（树叶、草地、光影），再让人物从画面一侧走入。', en: 'Hold on the place first (leaves, grass, light), then let her walk in from one side.' }, why: { zh: '先建立氛围，再引入人物，画面更有铺垫与故事感。', en: 'Setting the mood before she arrives builds up to her and tells a story.' }, photo: 9 },
      { title: { zh: '遮挡转场（经过树干）', en: 'Wipe past a tree trunk' }, body: { zh: '让镜头随着人物走动，经过一棵树干被完全遮挡，再露出新的画面。', en: 'Move with her until a tree trunk fills the frame, then come out on the next shot.' }, why: { zh: '利用遮挡实现自然转场，节奏流畅且更具电影叙事感。', en: 'The trunk gives a natural cut point, so the rhythm stays smooth and cinematic.' }, photo: 10 },
      { title: { zh: '走出焦点（人物离开远去）', en: 'Walk away into the distance' }, body: { zh: '拍摄人物从近到远走出画面，直至成为环境中的一小点。', en: 'Film her walking from near to far until she is a small figure in the landscape.' }, why: { zh: '用"离开"收尾，留下回味空间，画面更完整、有情绪落点。', en: 'Ending on her leaving lets the feeling linger and closes the film.' }, photo: 11 },
    ],
    footer: {
      title: { zh: '为什么有效', en: 'Why it works' },
      points: [
        { zh: '留白更多：不把情绪说满，给观众想象与共鸣的空间。', en: 'More is left unsaid, so viewers fill in the feeling themselves.' },
        { zh: '材质感更强：树皮、落叶、毛衣、发丝等细节让画面更有质感。', en: 'Bark, leaves, knitwear and hair give the image texture.' },
        { zh: '人与环境更有关系：把女性放在自然里，画面更和谐、有故事性。', en: 'She belongs to the place, so the frame feels harmonious and tells a story.' },
        { zh: '比直接拍脸更高级：从动作、轮廓与氛围表达她的气质，含蓄而耐看。', en: 'Her character comes through action, outline and mood, which is subtler than filming her face.' },
      ],
      lenses: [
        { mm: '35mm', use: { zh: '环境与人物关系，画面更有氛围', en: 'Her in her surroundings, more atmosphere' } },
        { mm: '50mm', use: { zh: '自然、真实、日常感强', en: 'Natural and true to life' } },
        { mm: '85mm', use: { zh: '突出气质与细节，画面更柔美', en: 'Her presence and details, softer look' } },
      ],
      tip: { zh: '少拍正脸，多拍动作、侧面、背影、手与环境。', en: 'Film her face head-on less. Film actions, profiles, back views, hands and the place more.' },
    },
  },
  {
    id: 'direct', accent: '#c7a7ff',
    title: { zh: '和模特沟通', en: 'Talking to the model' },
    hint: { zh: '让她放松、知道要做什么', en: 'Keep her relaxed and clear on the task' },
    items: [
      { title: { zh: '开拍前讲清楚', en: 'Brief before you roll' }, body: { zh: '告诉她这条片的情绪（例如"夏天午后一个人的自在"）、这个镜头的景别、她从哪走到哪。', en: 'Tell her the mood (e.g. "alone and at ease on a summer afternoon"), the shot size, and where she starts and ends.' } },
      { title: { zh: '一次只给一个指令', en: 'One note at a time' }, body: { zh: '"这次走慢一点"就够了，不要同时改走路、手、眼神。', en: '"Slower this time" is enough. Do not change walk, hands and eyes in the same note.' } },
      { title: { zh: '用情绪代替动作描述', en: 'Feelings over mechanics' }, body: { zh: '"想象你刚听到一个好消息"比"嘴角上扬 20 度"有用。', en: '"Imagine you just heard good news" works better than "lift the corners of your mouth".' } },
      { title: { zh: '一直说话', en: 'Keep talking' }, body: { zh: '拍摄中不停给正面反馈："很好""就这样""再来一次一样的"。沉默会让模特紧张。', en: 'Constant positive feedback while rolling: "great", "just like that", "same again". Silence makes models tense.' } },
      { title: { zh: '给她看回放', en: 'Show her the playback' }, body: { zh: '拍了好的一条就给她看，她会知道你要什么，后面快很多。', en: 'Show her a good take on the screen. She will see what you want and the rest goes faster.' } },
      { title: { zh: '安排休息', en: 'Plan breaks' }, body: { zh: '每 30–40 分钟让她喝水、补妆、躲阴凉。准备外套、拖鞋、伞。', en: 'Every 30–40 minutes: water, touch-ups, shade. Bring a jacket, slides and an umbrella.' } },
    ],
  },
  {
    id: 'light', accent: '#ffcf7a',
    title: { zh: '户外光线', en: 'Outdoor light' },
    hint: { zh: '什么时候拍、站哪里', en: 'When to shoot and where to stand' },
    items: [
      { title: { zh: '黄金时段', en: 'Golden hour' }, body: { zh: '日出后和日落前约 1 小时，光又暖又软。最重要的镜头放这时候拍。', en: 'About an hour after sunrise and before sunset, light is warm and soft. Save the key shots for it.' }, diagram: 'sunarc', refs: [{ clip: '25561' }, { clip: '4803' }] },
      { title: { zh: '逆光', en: 'Backlight' }, body: { zh: '太阳在她身后，头发有一圈金边，脸不会眯眼。按脸曝光，背景过曝一点没关系。', en: 'Sun behind her gives a gold rim on the hair and no squinting. Expose for the face and let the background run a little hot.' }, diagram: 'backlight', refs: [{ clip: '4629' }, { shot: '0:18–0:23' }] },
      { title: { zh: '中午怎么办', en: 'Harsh midday sun' }, body: { zh: '找建筑或树的阴影（开阔阴影），或让她背对太阳，用反光板补脸。避免脸上有斑驳树影。', en: 'Find open shade from a building or tree, or turn her back to the sun and bounce light into the face. Avoid dappled leaf shadows on the face.' }, diagram: 'shade' },
      { title: { zh: '阴天', en: 'Overcast' }, body: { zh: '整片天空是一块大柔光箱，肤色干净，适合近景和细节。画面偏冷就把色温调暖一点。', en: 'The whole sky is a giant softbox. Clean skin, great for close-ups and details. Warm the white balance if it looks cold.' }, diagram: 'overcast' },
      { title: { zh: '反光板', en: 'Reflector' }, body: { zh: '白面柔和自然，银面亮而硬，金面暖。逆光时放在她前下方，把光打回脸上。', en: 'White is soft and natural, silver is bright and hard, gold is warm. In backlight, hold it low in front to bounce light back into her face.' }, diagram: 'reflector' },
      { title: { zh: '光斑和眩光', en: 'Flares' }, body: { zh: '让太阳刚好从她肩膀或头发边缘露出一点，就有光斑。镜头不要正对太阳太久。', en: 'Let the sun peek past her shoulder or hair for a flare. Do not point the lens straight at the sun for long.' }, diagram: 'flare', refs: [{ shot: '0:30–0:33' }, { shot: '0:12–0:17' }] },
    ],
  },
  {
    id: 'camera', accent: '#77d8ff',
    title: { zh: '相机参数速查', en: 'Camera settings' },
    hint: { zh: '晴天户外的起点', en: 'Starting points outdoors in sun' },
    items: [
      { title: { zh: '帧率和快门', en: 'Frame rate and shutter' }, body: { zh: '正常速度 24fps 配 1/50。慢动作 60fps 配 1/125，或 120fps 配 1/250。快门约等于帧率的 2 倍。', en: 'Normal speed: 24fps at 1/50. Slow motion: 60fps at 1/125 or 120fps at 1/250. Shutter is about double the frame rate.' }, diagram: 'shutter', refs: [{ clip: '41617' }, { shot: '0:34' }] },
      { title: { zh: 'ND 滤镜', en: 'ND filter' }, body: { zh: '大光圈（f/1.8–2.8）在晴天会过曝，需要 ND。ND8 减 3 档，ND64 减 6 档。用 f/8 以上拍远景时可以不用。', en: 'Wide apertures (f/1.8–2.8) overexpose in sun, so you need ND. ND8 cuts 3 stops, ND64 cuts 6. Shooting wides at f/8 or smaller can skip it.' }, diagram: 'nd' },
      { title: { zh: 'ISO', en: 'ISO' }, body: { zh: '用相机的原生 ISO（通常 100，Log 模式常是 400 或 800），不要用 ISO 来压亮度，用 ND。', en: 'Use the base ISO (usually 100, or 400–800 in Log). Control brightness with ND, not ISO.' } },
      { title: { zh: '白平衡锁定', en: 'Lock white balance' }, body: { zh: '晴天锁 5600K，阴影 6500K 左右。不要用自动，否则镜头之间颜色会跳。', en: 'Lock 5600K in sun, around 6500K in shade. Never auto, or color jumps between shots.' } },
      { title: { zh: '斑马纹', en: 'Zebras' }, body: { zh: '设 70% 看脸部亮度，设 95–100% 看高光是否过曝。脸亮的一侧刚出 70% 斑马纹就对了。', en: 'Set 70% to check skin and 95–100% to check clipping. Skin is right when the bright side just shows 70% zebras.' }, diagram: 'zebra' },
      { title: { zh: '对焦', en: 'Focus' }, body: { zh: '人眼识别 AF-C，对焦在靠近镜头的那只眼睛。大光圈走动镜头先试拍一遍看是否跑焦。', en: 'Eye-detect AF-C on the eye nearest the lens. With wide apertures and movement, do a test take to check focus holds.' }, diagram: 'focus' },
      { title: { zh: '自动曝光时', en: 'If you use auto exposure' }, body: { zh: '逆光时曝光补偿 +1 到 +2，否则脸会黑。', en: 'In backlight dial in +1 to +2 EV exposure compensation, or the face goes dark.' }, diagram: 'backlight' },
    ],
  },
  {
    id: 'lens', accent: '#9fe0b0',
    title: { zh: '焦段选择', en: 'Lens choice' },
    hint: { zh: '什么镜头拍什么', en: 'Which lens for which shot' },
    items: [
      { title: { zh: '24mm', en: '24mm' }, body: { zh: '大环境、低机位显腿长。离脸要远，否则鼻子和额头会变形。', en: 'Big environments, low angles for long legs. Keep it away from faces or noses and foreheads stretch.' }, diagram: 'fov', lens: 24, refs: [{ shot: '0:28' }] },
      { title: { zh: '35mm', en: '35mm' }, body: { zh: '人和环境一起交代，跟拍行走最好用。', en: 'Person and place together. The best walking-track lens.' }, diagram: 'fov', lens: 35, refs: [{ shot: '0:52–0:56' }] },
      { title: { zh: '50mm', en: '50mm' }, body: { zh: '接近人眼视角，中景和半身都自然。', en: 'Close to how the eye sees. Natural for mediums and waist-up.' }, diagram: 'fov', lens: 50, refs: [{ shot: '0:18–0:23' }] },
      { title: { zh: '85mm', en: '85mm' }, body: { zh: '脸型最好看，背景虚化奶油感。近景和情绪镜头首选。', en: 'Most flattering for faces, creamy background blur. First choice for close-ups and emotional beats.' }, diagram: 'fov', lens: 85, refs: [{ shot: '0:42' }] },
      { title: { zh: '135mm 及以上', en: '135mm and longer' }, body: { zh: '压缩空间，背景被拉近、变成色块。站远一点偷拍感强，适合草地和海边。', en: 'Compresses space: background pulls close and becomes blocks of color. Shooting from far away feels candid, great in fields and by the sea.' }, diagram: 'fov', lens: 135, refs: [{ shot: '0:46' }] },
    ],
  },
  {
    id: 'styling', accent: '#ffb0d0',
    title: { zh: '服装、发型、妆容', en: 'Wardrobe, hair and makeup' },
    hint: { zh: '现场小东西', en: 'Small things on the day' },
    items: [
      { title: { zh: '选会动的面料', en: 'Fabrics that move' }, body: { zh: '雪纺、丝、亚麻、长裙摆，在风里有生命。避免太紧、会反光或有细条纹的面料（会出摩尔纹）。', en: 'Chiffon, silk, linen, long hems come alive in wind. Avoid very tight, shiny or fine-striped fabric (moiré).' }, refs: [{ shot: '0:34' }, { clip: '1221' }] },
      { title: { zh: '颜色和背景', en: 'Color against the background' }, body: { zh: '海边和草地配白、米、奶油、亮色单色。和背景撞色或同色系二选一，不要花。', en: 'By the sea or in grass: white, cream, beige or one bold solid. Either contrast the background or match its palette, not busy prints.' } },
      { title: { zh: '随身包', en: 'Styling kit' }, body: { zh: '挂烫机、粘毛器、夹子（夹在背后收腰）、双面胶、吸油纸、梳子、发胶、防晒、湿巾。', en: 'Steamer, lint roller, clips (pin at the back for fit), fashion tape, blotting papers, comb, hairspray, sunscreen, wipes.' } },
      { title: { zh: '补妆检查', en: 'Touch-up checks' }, body: { zh: '每换一个机位检查：脸上出油反光、碎发、口红、衣服褶皱、标签有没有露出来。', en: 'At every new setup check: shine on the face, flyaway hair, lipstick, wrinkles, visible tags.' } },
      { title: { zh: '鞋', en: 'Shoes' }, body: { zh: '走过去的路上穿拖鞋，到位再换。沙地和草地光脚往往更好看。', en: 'Slides between setups, change on the mark. Barefoot often looks better on sand and grass.' } },
    ],
  },
  {
    id: 'mistakes', accent: '#ff6b6b',
    title: { zh: '新手常见错误', en: 'Common mistakes' },
    hint: { zh: '拍之前扫一眼', en: 'Scan before you roll' },
    items: [
      { title: { zh: '正午顶光直接拍脸', en: 'Shooting faces in noon sun' }, body: { zh: '眼窝黑、眯眼、鼻影重。找阴影或改到黄金时段。', en: 'Dark eye sockets, squinting, hard nose shadows. Move to shade or golden hour.' } },
      { title: { zh: '头顶留太多空', en: 'Too much headroom' }, body: { zh: '眼睛应在上三分线附近，不是画面中间。', en: 'Eyes belong near the top third, not the middle of the frame.' } },
      { title: { zh: '只拍好看的全身', en: 'Only pretty wide shots' }, body: { zh: '没有近景和细节，剪辑时没法切换节奏。', en: 'Without close-ups and details the edit has no rhythm to cut with.' } },
      { title: { zh: '镜头太短', en: 'Takes too short' }, body: { zh: '每个镜头至少录 10 秒，动作前后留余量。', en: 'Roll at least 10 seconds per take, with handles before and after the move.' } },
      { title: { zh: '自动白平衡', en: 'Auto white balance' }, body: { zh: '每个镜头颜色不同，调色时很痛苦。', en: 'Every shot comes out a different color, which is painful to grade.' } },
      { title: { zh: '模特没事可做', en: 'Model has nothing to do' }, body: { zh: '站着等就会僵。永远给一个动作：走、摸、转、看。', en: 'Standing and waiting makes her stiff. Always give an action: walk, touch, turn, look.' } },
    ],
  },
]
