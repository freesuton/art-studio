// "Autumn Afternoon" storyboard template: 20 shots in five parts. Frame images come from
// one sprite (assets/autumn-storyboard.jpg), 4 columns x 5 rows in shot order.
type Text = { zh: string; en: string }
const tx = (zh: string, en: string): Text => ({ zh, en })

export type CameraMove = 'static' | 'push' | 'truck' | 'arc' | 'follow' | 'slider'
export type AutumnShot = { number: number; seconds: number; size: Text; lens: string; move: CameraMove; moveNote: Text; action: Text }
export type AutumnPart = { title: Text; beats: Text[]; shots: AutumnShot[] }

export const moveLabels: Record<CameraMove, Text> = {
  static: tx('固定', 'Locked off'),
  push: tx('推 / 拉', 'Push / pull'),
  truck: tx('横移', 'Truck'),
  arc: tx('半环绕', 'Half arc'),
  follow: tx('跟拍（手持 / 稳定器）', 'Follow (handheld / gimbal)'),
  slider: tx('滑轨 / 推车', 'Slider / dolly'),
}

const shot = (number: number, seconds: number, size: Text, lens: string, move: CameraMove, moveNote: Text, action: Text): AutumnShot => ({ number, seconds, size, lens, move, moveNote, action })

export const autumnParts: AutumnPart[] = [
  { title: tx('来到', 'Arrive'), beats: [tx('抵达草地', 'Reach the lawn'), tx('进入环境', 'Take in the place')], shots: [
    shot(1, 5, tx('超远景', 'Extreme wide'), '24–35mm', 'static', tx('固定', 'Locked off'), tx('从远处走进草坪，边走边看环境。', 'She walks onto the lawn from far away, looking around.')),
    shot(2, 4, tx('全身侧面', 'Full body, side'), '35–50mm', 'truck', tx('横移跟拍', 'Truck alongside'), tx('正常走路，顺手调整包带。', 'Walks normally and adjusts her bag strap.')),
    shot(3, 3, tx('低机位特写', 'Low-angle close-up'), '50–70mm', 'follow', tx('轻跟拍', 'Light follow'), tx('鞋踩落叶，裙摆、风衣自然摆动。', 'Boots in the fallen leaves, skirt and coat swinging.')),
    shot(4, 4, tx('中远景背面', 'Medium-wide, from behind'), '35mm', 'push', tx('轻推', 'Slow push-in'), tx('沿森林入口慢慢走进去。', 'Walks slowly into the forest.')),
  ] },
  { title: tx('探索森林', 'Explore the forest'), beats: [tx('深入林间', 'Go deeper in'), tx('观察与拍摄', 'Look and take photos')], shots: [
    shot(5, 3, tx('中景侧后', 'Medium, from behind'), '50mm', 'follow', tx('跟拍', 'Follow'), tx('遇到树枝，自然侧身绕开。', 'Turns sideways to slip past a branch.')),
    shot(6, 2, tx('特写', 'Close-up'), '70–85mm', 'follow', tx('跟随', 'Follow'), tx('手拨开一根挡路的小树枝。', 'Her hand moves a small branch out of the way.')),
    shot(7, 3, tx('环境特写', 'Detail of the place'), '35–50mm', 'follow', tx('手持轻移', 'Handheld drift'), tx('看见落叶、蘑菇、树影。', 'Fallen leaves, mushrooms, tree shadows.')),
    shot(8, 4, tx('中景', 'Medium'), '50–70mm', 'static', tx('固定', 'Locked off'), tx('停下来，拿出相机拍一张。', 'Stops and takes out a camera for a photo.')),
    shot(9, 2, tx('特写', 'Close-up'), '85mm', 'push', tx('固定 / 微推', 'Locked off / slight push'), tx('手按快门、调整相机。', 'Fingers on the shutter, adjusting the camera.')),
    shot(10, 3, tx('侧脸中近景', 'Medium close-up, profile'), '70–85mm', 'arc', tx('半环绕 45°', 'Half arc, 45°'), tx('低头看刚拍的照片，自然轻笑。', 'Looks down at the photo she took and smiles.')),
  ] },
  { title: tx('来到草地', 'Out to the lawn'), beats: [tx('走出森林', 'Leave the trees'), tx('安顿休息', 'Settle in')], shots: [
    shot(11, 5, tx('超远景', 'Extreme wide'), '24–35mm', 'static', tx('固定', 'Locked off'), tx('从树林走到开阔草地。', 'Walks out of the trees onto the open lawn.')),
    shot(12, 3, tx('全身', 'Full body'), '50mm', 'static', tx('固定', 'Locked off'), tx('找到草地，弯腰把包放下。', 'Finds a spot and bends to set her bag down.')),
    shot(13, 3, tx('中景', 'Medium'), '50–70mm', 'push', tx('轻推', 'Slow push-in'), tx('坐下，调整到舒服的姿势。', 'Sits down and gets comfortable.')),
    shot(14, 5, tx('动作特写（组接）', 'Action details (a sequence)'), '70–85mm', 'static', tx('多角度', 'Several angles'), tx('从包里拿出书、苹果、咖啡，倒一杯热饮。', 'Takes out a book, an apple and coffee, then pours a hot drink.')),
  ] },
  { title: tx('停留放松', 'Linger'), beats: [tx('阅读与休憩', 'Read and rest'), tx('感受自然', 'Feel the season')], shots: [
    shot(15, 4, tx('中景侧面', 'Medium, side'), '70mm', 'static', tx('固定', 'Locked off'), tx('看书，偶尔抬头看远处。', 'Reads, and now and then looks up into the distance.')),
    shot(16, 3, tx('特写', 'Close-up'), '85mm', 'static', tx('50fps 慢放', '50fps slow motion'), tx('风把头发吹到脸上，顺手拨开。', 'Wind blows hair across her face and she brushes it away.')),
    shot(17, 4, tx('中景', 'Medium'), '50mm', 'static', tx('固定', 'Locked off'), tx('坐着喝咖啡，看树林或湖面。', 'Sips coffee, looking at the trees or the lake.')),
    shot(18, 4, tx('中近景', 'Medium close-up'), '50mm', 'arc', tx('半环绕 45–90°', 'Half arc, 45–90°'), tx('起身前看一眼远处，感受阳光。', 'Before getting up, she looks into the distance and feels the sun.')),
  ] },
  { title: tx('离开', 'Leave'), beats: [tx('收拾出发', 'Pack up'), tx('走向远处', 'Walk away')], shots: [
    shot(19, 3, tx('近景经过', 'Close pass-by'), '35–50mm', 'static', tx('固定', 'Locked off'), tx('收好东西后，从镜头前走过。', 'Packs up and walks right past the lens.')),
    shot(20, 6, tx('超远景', 'Extreme wide'), '24–35mm', 'static', tx('固定', 'Locked off'), tx('沿林间小路慢慢走远，直至融入树林。', 'Walks slowly away down the forest path until the trees take her in.')),
  ] },
]

export const autumnPalette = [
  { color: '#d6c4a6', name: tx('燕麦米', 'Oat') },
  { color: '#a48763', name: tx('驼色', 'Camel') },
  { color: '#81512a', name: tx('栗棕', 'Chestnut') },
  { color: '#8d472a', name: tx('锈红', 'Rust') },
  { color: '#414431', name: tx('松林绿', 'Pine') },
]

export const autumnCameraTips: { label: Text; value: Text }[] = [
  { label: tx('格式', 'Format'), value: tx('4K 25fps（日常）/ 50fps（少量慢动作）', '4K 25fps for normal shots, 50fps for a few slow-motion moments') },
  { label: tx('快门', 'Shutter'), value: tx('1/50（25fps）/ 1/100（50fps）', '1/50 at 25fps, 1/100 at 50fps') },
  { label: tx('光圈', 'Aperture'), value: tx('f/2.8 – f/5.6，根据景深', 'f/2.8–f/5.6, depending on depth of field') },
  { label: tx('焦段主用', 'Main lenses'), value: tx('35mm / 50mm / 85mm', '35mm / 50mm / 85mm') },
  { label: tx('对焦', 'Focus'), value: tx('AF-C + 人眼识别', 'AF-C with eye detection') },
  { label: tx('时间', 'Time'), value: tx('下午至日落（黄金时刻）', 'Afternoon to sunset (golden hour)') },
]
