import { useId } from 'react'

export type DiagramKind =
  | 'thirds' | 'center' | 'negative' | 'lines' | 'framed' | 'foreground' | 'height' | 'crop' | 'background'
  | 'sizes' | 'track' | 'handles' | 'enterexit'
  | 'scurve' | 'triangle' | 'lookback' | 'wind'
  | 'sunarc' | 'backlight' | 'shade' | 'overcast' | 'reflector' | 'flare'
  | 'shutter' | 'nd' | 'zebra' | 'focus' | 'fov'

type Language = 'zh' | 'en'

const ink = '#191a17'
const paper = '#f6f4ed'
const muted = '#b9bab1'
const sun = '#ffc94a'
const good = '#2f9e5b'
const bad = '#e0483e'

// Figures in these diagrams: a stick figure seen from the front, the same figure from
// above (shoulders plus head, the nose tick shows where she faces), and a camera from above.
function Figure({ x, foot, h, faded, color = ink }: { x: number; foot: number; h: number; faded?: boolean; color?: string }) {
  const r = h * .085, head = foot - h + r, neck = head + r, shoulder = neck + h * .06, hip = foot - h * .47
  return <g stroke={color} strokeWidth={Math.max(1.4, h * .025)} fill="none" strokeLinecap="round" opacity={faded ? .35 : 1}>
    <circle cx={x} cy={head} r={r} fill={paper} />
    <path d={`M${x} ${neck}V${hip}M${x} ${shoulder}L${x - h * .16} ${shoulder + h * .25}M${x} ${shoulder}L${x + h * .16} ${shoulder + h * .25}M${x} ${hip}L${x - h * .1} ${foot}M${x} ${hip}L${x + h * .1} ${foot}`} />
  </g>
}

function TopModel({ x, y, rot = 0, accent }: { x: number; y: number; rot?: number; accent?: string }) {
  return <g transform={`translate(${x} ${y}) rotate(${rot})`} stroke={ink} strokeWidth="1.8">
    <ellipse rx="12" ry="5.5" fill={accent ?? paper} />
    <circle r="5.5" fill={paper} />
    <path d="M0 5.5V9.5" strokeLinecap="round" />
  </g>
}

function TopCamera({ x, y, rot = 0, fov = 0 }: { x: number; y: number; rot?: number; fov?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${rot})`} stroke={ink} strokeWidth="1.8" strokeLinejoin="round">
    {fov > 0 && <path d={`M-3 -10L${-fov * .45} ${-fov}M3 -10L${fov * .45} ${-fov}`} stroke={muted} strokeDasharray="3 3" />}
    <rect x="-8" y="-4" width="16" height="10" rx="2" fill={paper} />
    <rect x="-4" y="-10" width="8" height="6" fill={ink} />
  </g>
}

function Sun({ x, y, r = 9 }: { x: number; y: number; r?: number }) {
  const rays = Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return `M${x + Math.cos(a) * (r + 3)} ${y + Math.sin(a) * (r + 3)}L${x + Math.cos(a) * (r + 7)} ${y + Math.sin(a) * (r + 7)}` }).join('')
  return <g><circle cx={x} cy={y} r={r} fill={sun} stroke={ink} strokeWidth="1.6" /><path d={rays} stroke={ink} strokeWidth="1.6" strokeLinecap="round" /></g>
}

function Arrow({ x1, y1, x2, y2, color = ink, dashed }: { x1: number; y1: number; x2: number; y2: number; color?: string; dashed?: boolean }) {
  const a = Math.atan2(y2 - y1, x2 - x1), s = 6
  return <g stroke={color} fill="none" strokeWidth="1.8" strokeLinecap="round" strokeDasharray={dashed ? '4 4' : undefined}>
    <path d={`M${x1} ${y1}L${x2} ${y2}`} />
    <path d={`M${x2} ${y2}L${x2 - s * Math.cos(a - .5)} ${y2 - s * Math.sin(a - .5)}M${x2} ${y2}L${x2 - s * Math.cos(a + .5)} ${y2 - s * Math.sin(a + .5)}`} strokeDasharray="none" />
  </g>
}

function Label({ x, y, children, anchor = 'middle', color = '#4b4d45', size = 8.5 }: { x: number; y: number; children: React.ReactNode; anchor?: 'start' | 'middle' | 'end'; color?: string; size?: number }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight="700" fill={color}>{children}</text>
}

// A 16:9 frame, optionally with the rule-of-thirds grid.
const F = { x: 20, y: 10, w: 200, h: 112.5 }
function Frame({ grid, children }: { grid?: boolean; children?: React.ReactNode }) {
  return <g>
    <rect x={F.x} y={F.y} width={F.w} height={F.h} rx="3" fill={paper} stroke={ink} strokeWidth="2" />
    {grid && <path d={`M${F.x + F.w / 3} ${F.y}V${F.y + F.h}M${F.x + F.w * 2 / 3} ${F.y}V${F.y + F.h}M${F.x} ${F.y + F.h / 3}H${F.x + F.w}M${F.x} ${F.y + F.h * 2 / 3}H${F.x + F.w}`} stroke={muted} strokeWidth="1.2" strokeDasharray="4 4" />}
    {children}
  </g>
}

function Bust({ x, y, r }: { x: number; y: number; r: number }) {
  return <g stroke={ink} strokeWidth="2" fill={paper}>
    <path d={`M${x - r * 2.9} ${F.y + F.h}Q${x - r * 2.5} ${y + r * 1.6} ${x} ${y + r * 1.45}Q${x + r * 2.5} ${y + r * 1.6} ${x + r * 2.9} ${F.y + F.h}`} />
    <circle cx={x} cy={y} r={r} />
  </g>
}

function Content({ kind, accent, lens, l, blur }: { kind: DiagramKind; accent: string; lens?: number; l: (zh: string, en: string) => string; blur: string }) {
  const bottom = 142
  switch (kind) {
    case 'thirds': {
      const ex = F.x + F.w * 2 / 3, ey = F.y + F.h / 3
      return <><Frame grid><Bust x={ex} y={ey + 6} r={14} /><circle cx={ex - 5} cy={ey + 4} r="1.6" fill={ink} /><circle cx={ex} cy={ey} r="4.5" fill="none" stroke={accent} strokeWidth="2.5" />
        <Arrow x1={ex - 22} y1={ey + 4} x2={F.x + 30} y2={ey + 4} color={good} dashed /></Frame>
        <Label x={70} y={ey - 6}>{l('视线空间', 'Look room')}</Label>
        <Label x={120} y={bottom}>{l('眼睛放在上三分线，看向的一侧留空', 'Eyes on the top third, space on the side she faces')}</Label></>
    }
    case 'center':
      return <><Frame><path d="M95 122.5V48a25 25 0 0 1 50 0v74.5" fill="#e9e6db" stroke={ink} strokeWidth="1.8" /><path d="M60 122.5l35-30M180 122.5l-35-30" stroke={muted} strokeWidth="1.5" />
        <Figure x={120} foot={118} h={60} /><path d="M120 10v112.5" stroke={accent} strokeWidth="1.5" strokeDasharray="3 4" /></Frame>
        <Label x={120} y={bottom}>{l('人在正中，背景左右对称，直视镜头', 'Dead center, symmetrical background, eyes to lens')}</Label></>
    case 'negative':
      return <><Frame><rect x={F.x + 1} y={F.y + 1} width={F.w - 2} height="88" fill="#e6eef0" /><path d={`M${F.x} 99H${F.x + F.w}`} stroke={ink} strokeWidth="1.5" /><Figure x={168} foot={103} h={20} /></Frame>
        <Label x={85} y={52} color="#7c8a8e">{l('大面积天空 / 沙 / 墙', 'Big empty sky, sand or wall')}</Label>
        <Label x={120} y={bottom}>{l('人很小，画面大部分留白', 'She is small; most of the frame is empty')}</Label></>
    case 'lines':
      return <><Frame><path d="M20 122.5L150 66M60 122.5L150 66M220 104L150 66M20 84L150 66" stroke={accent} strokeWidth="2.5" /><Figure x={150} foot={72} h={26} /></Frame>
        <Label x={120} y={bottom}>{l('海岸线、栏杆、小路都通向她', 'Shoreline, rails and paths all lead to her')}</Label></>
    case 'framed':
      return <><Frame><path d="M21 11h198v110.5H21zM88 121.5V60a32 32 0 0 1 64 0v61.5z" fill="#cfd3c4" fillRule="evenodd" /><path d="M88 121.5V60a32 32 0 0 1 64 0v61.5" fill="none" stroke={ink} strokeWidth="1.8" /><Figure x={120} foot={114} h={52} /></Frame>
        <Label x={120} y={bottom}>{l('用门洞、窗、树枝把人框住', 'A doorway, window or branches frame her')}</Label></>
    case 'foreground':
      return <><Frame><Figure x={140} foot={115} h={70} /><g filter={`url(#${blur})`} fill="#8fb47a" opacity=".85"><ellipse cx="38" cy="100" rx="30" ry="28" /><ellipse cx="62" cy="122" rx="30" ry="18" /><ellipse cx="205" cy="30" rx="22" ry="26" /></g></Frame>
        <Label x={120} y={bottom}>{l('镜头贴近草叶拍过去，前景虚成一层', 'Lens right against leaves: soft blur in front')}</Label></>
    case 'height':
      return <><path d="M14 124H226" stroke={ink} strokeWidth="2" /><Figure x={182} foot={124} h={100} />
        <g transform="translate(48 82)"><rect x="-10" y="-7" width="20" height="14" rx="2" fill={accent} stroke={ink} strokeWidth="1.8" /><path d="M0 7V42M-10 42L0 7L10 42" stroke={ink} strokeWidth="1.6" fill="none" /></g>
        <path d="M58 80L178 26M58 84L178 124" stroke={accent} strokeWidth="1.6" strokeDasharray="4 3" />
        <g transform="translate(48 34)" opacity=".45"><rect x="-10" y="-7" width="20" height="14" rx="2" fill={paper} stroke={ink} strokeWidth="1.8" /></g><path d="M58 34H170" stroke={muted} strokeWidth="1.4" strokeDasharray="4 3" />
        <Label x={48} y={20}>{l('近景：平视', 'Close-up: eye level')}</Label><Label x={100} y={140}>{l('全身：腰高略往上', 'Full body: waist height, tilt up')}</Label></>
    case 'crop': {
      const x = 70, foot = 134, h = 124, r = h * .085, neck = foot - h + 2 * r, shoulder = neck + h * .06, hip = foot - h * .47
      const bads = [neck, shoulder + h * .125, shoulder + h * .25, hip, hip + (foot - hip) / 2, foot - 3]
      const goods = [shoulder + h * .06, hip + (foot - hip) * .25, hip + (foot - hip) * .75]
      return <><Figure x={x} foot={foot} h={h} />
        {bads.map((y) => <g key={y}><path d={`M${x - 28} ${y}H${x + 28}`} stroke={bad} strokeWidth="1.6" /><Label x={x - 34} y={y + 3} anchor="end" color={bad}>✕</Label></g>)}
        {goods.map((y) => <g key={y}><path d={`M${x - 28} ${y}H${x + 40}`} stroke={good} strokeWidth="1.8" strokeDasharray="4 3" /><Label x={x + 44} y={y + 3} anchor="start" color={good}>✓</Label></g>)}
        <Label x={146} y={52} anchor="start" color={bad}>{l('✕ 切在关节', '✕ On a joint')}</Label><Label x={146} y={66} anchor="start" color={good}>{l('✓ 切在关节之间', '✓ Between joints')}</Label>
        <Label x={146} y={86} anchor="start" size={7.5}>{l('脖子 手肘 手腕', 'neck elbow wrist')}</Label><Label x={146} y={97} anchor="start" size={7.5}>{l('腰 膝盖 脚踝', 'waist knee ankle')}</Label></>
    }
    case 'background':
      return <><g transform="translate(14 22) scale(.48)"><Frame><path d="M120 10v112.5" stroke="#6b6d64" strokeWidth="7" /><Bust x={120} y={60} r={18} /></Frame></g>
        <g transform="translate(122 22) scale(.48)"><Frame><path d="M60 10v112.5" stroke="#6b6d64" strokeWidth="7" /><Bust x={140} y={60} r={18} /></Frame></g>
        <Label x={66} y={95} color={bad}>{l('✕ 电线杆从头顶长出', '✕ Pole out of her head')}</Label><Label x={174} y={95} color={good}>{l('✓ 挪一步，背景干净', '✓ One step over, clean')}</Label>
        <Label x={120} y={bottom}>{l('开拍前看一眼头后面', 'Check behind her head before rolling')}</Label></>
    case 'sizes': {
      const cells = [
        { x: 10, label: l('远景', 'Wide'), body: <><path d="M0 22H50" stroke={muted} /><Figure x={33} foot={24} h={13} /></> },
        { x: 67, label: l('中景', 'Medium'), body: <><circle cx="25" cy="9" r="5" fill={paper} stroke={ink} strokeWidth="1.6" /><path d="M13 29V20Q14 15 25 15Q36 15 37 20V29M25 15V29" stroke={ink} strokeWidth="1.6" fill="none" /></> },
        { x: 124, label: l('近景', 'Close'), body: <><circle cx="25" cy="16" r="10" fill={paper} stroke={ink} strokeWidth="1.8" /><path d="M8 29Q25 22 42 29" stroke={ink} strokeWidth="1.8" fill="none" /></> },
        { x: 181, label: l('特写', 'Detail'), body: <><circle cx="25" cy="14" r="5" fill={accent} stroke={ink} strokeWidth="1.6" /><path d="M15 29q4-12 10-10t10 10" stroke={ink} strokeWidth="1.8" fill="none" /></> },
      ]
      return <>{cells.map((c) => <g key={c.x}><svg x={c.x} y={40} width="50" height="29" viewBox="0 0 50 29"><rect x="0.5" y="0.5" width="49" height="28" rx="2" fill={paper} stroke={ink} />{c.body}</svg><Label x={c.x + 25} y={84}>{c.label}</Label></g>)}
        <Label x={120} y={118}>{l('每套造型四种都拍：人加环境、衣服、脸、细节', 'Every look: place, outfit, face, detail')}</Label></>
    }
    case 'track':
      return <><Arrow x1={40} y1={48} x2={200} y2={48} color={accent} /><TopModel x={120} y={48} rot={-90} /><Arrow x1={40} y1={104} x2={200} y2={104} dashed /><TopCamera x={120} y={104} fov={40} />
        <Label x={40} y={34} anchor="start">{l('模特慢走', 'Model walks slowly')}</Label><Label x={40} y={124} anchor="start">{l('相机平行跟着走，保持距离', 'Camera walks alongside, same distance')}</Label>
        <Label x={120} y={bottom}>{l('俯视图 · 或缓慢推近 / 后退引领', 'Top view · or a slow push-in / lead backward')}</Label></>
    case 'handles':
      return <><rect x="20" y="52" width="40" height="26" fill="#e3e1d8" stroke={ink} strokeWidth="1.6" /><rect x="60" y="52" width="120" height="26" fill={accent} stroke={ink} strokeWidth="1.6" /><rect x="180" y="52" width="40" height="26" fill="#e3e1d8" stroke={ink} strokeWidth="1.6" />
        <Label x={40} y={69}>3s</Label><Label x={120} y={69}>{l('动作', 'Action')}</Label><Label x={200} y={69}>3s</Label>
        <Label x={20} y={44} anchor="start">{l('开机', 'Roll')}</Label><Label x={60} y={96}>{l('喊开始', '"Action"')}</Label><Label x={180} y={96}>{l('动作结束', 'Move ends')}</Label><Label x={220} y={44} anchor="end">{l('停机', 'Cut')}</Label>
        <Label x={120} y={bottom}>{l('每条至少 10 秒，前后留剪辑余量', 'At least 10s a take, handles both sides')}</Label></>
    case 'enterexit':
      return <><Frame><path d={`M${F.x} 100H${F.x + F.w}`} stroke={muted} /></Frame><Figure x={8} foot={104} h={40} faded /><Arrow x1={18} y1={70} x2={70} y2={70} color={good} /><Figure x={232} foot={104} h={40} faded /><Arrow x1={170} y1={70} x2={222} y2={70} color={good} />
        <Label x={120} y={50}>{l('空画面 → 走进来 → 走出去', 'Empty frame → walk in → walk out')}</Label>
        <Label x={120} y={bottom}>{l('最好用的转场素材', 'The easiest transitions you will get')}</Label></>
    case 'scurve':
      return <><g stroke={ink} strokeWidth="2.4" fill="none" strokeLinecap="round"><circle cx="116" cy="22" r="9" fill={paper} /><path d="M118 31Q114 46 120 58Q128 70 122 82" /><path d="M104 40L134 34" /><path d="M104 40L96 66M134 34L142 60" /><path d="M110 84L136 80" /><path d="M136 80L132 132M110 84L100 106L108 130" /></g>
        <path d="M128 26Q100 52 122 70Q142 88 120 120" stroke={accent} strokeWidth="3" fill="none" opacity=".9" />
        <Arrow x1={170} y1={120} x2={140} y2={124} color={good} /><Label x={198} y={116}>{l('重心在', 'Weight on')}</Label><Label x={198} y={127}>{l('后腿', 'back leg')}</Label>
        <Label x={46} y={38}>{l('肩一边高', 'Shoulders tilt')}</Label><Label x={46} y={86}>{l('胯反方向', 'Hips opposite')}</Label>
        <Label x={120} y={bottom + 4}>{l('前腿膝盖微弯，身体形成 S 形', 'Front knee soft, body makes an S')}</Label></>
    case 'triangle':
      return <><path d="M120 44L100 66L118 82Z" fill={accent} opacity=".55" /><path d="M120 44L140 30L130 18" fill="none" stroke={accent} strokeWidth="6" opacity=".45" strokeLinejoin="round" />
        <g stroke={ink} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="122" cy="20" r="9" fill={paper} /><path d="M121 29V86" /><path d="M121 42L100 66L118 82" /><path d="M121 42L140 30L130 17" /><path d="M121 86L112 132M121 86L134 132" /></g>
        <Label x={66} y={66}>{l('手叉腰', 'Hand on hip')}</Label><Label x={176} y={24}>{l('手撩头发', 'Hand in hair')}</Label>
        <Label x={120} y={bottom + 4}>{l('四肢和身体之间留出空隙', 'Leave gaps between limbs and body')}</Label></>
    case 'lookback':
      return <>{[{ x: 46, rot: 180, n: l('① 先转肩', '① Shoulders') }, { x: 120, rot: 135, n: l('② 再转头', '② Head') }, { x: 194, rot: 30, n: l('③ 最后眼睛', '③ Eyes last') }].map((p, i) => <g key={p.x}>
          <g transform={`translate(${p.x} 56) rotate(${i === 0 ? 180 : i === 1 ? 150 : 110})`}><ellipse rx="14" ry="6.5" fill={paper} stroke={ink} strokeWidth="1.8" /></g>
          <g transform={`translate(${p.x} 56) rotate(${p.rot})`}><circle r="6.5" fill={i === 2 ? accent : paper} stroke={ink} strokeWidth="1.8" /><path d="M0 6.5V11" stroke={ink} strokeWidth="1.8" /></g>
          <Label x={p.x} y={88}>{p.n}</Label></g>)}
        <TopCamera x={120} y={124} /><Label x={120} y={bottom + 4}>{l('俯视图 · 分三拍转过来，不要一下转完', 'Top view · three beats, not one snap')}</Label></>
    case 'wind':
      return <>{[34, 54, 74].map((y) => <Arrow key={y} x1={20} y1={y} x2={70} y2={y} color="#6aa8c4" />)}<Label x={44} y={22}>{l('风', 'Wind')}</Label>
        <TopModel x={120} y={56} rot={110} /><path d="M132 52q10 4 18-2t18 2M132 60q10 4 18-2t18 2" stroke={accent} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <Label x={176} y={44} anchor="start">{l('发丝 / 裙摆', 'Hair / hem')}</Label><TopCamera x={164} y={118} rot={-35} />
        <Label x={120} y={bottom + 4}>{l('俯视图 · 面向风或侧对风', 'Top view · face her into or across the wind')}</Label></>
    case 'sunarc':
      return <><path d="M16 118H224" stroke={ink} strokeWidth="2" /><path d="M30 118Q120 -20 210 118" stroke={muted} strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
        <Sun x={44} y={98} r={7} /><Sun x={196} y={98} r={7} /><g opacity=".5"><Sun x={120} y={30} r={7} /></g>
        <Label x={44} y={133}>{l('日出后 1h', '1h after sunrise')}</Label><Label x={196} y={133}>{l('日落前 1h', '1h before sunset')}</Label>
        <Label x={120} y={60} color={bad}>{l('正午顶光 ✕', 'Noon overhead ✕')}</Label><Label x={120} y={96} color={good}>{l('黄金时段：光低、暖、软', 'Golden hour: low, warm, soft')}</Label></>
    case 'backlight':
      return <><Sun x={120} y={20} /><Arrow x1={120} y1={34} x2={120} y2={56} color={sun} /><circle cx="120" cy="72" r="16" fill="none" stroke={sun} strokeWidth="4" opacity=".8" /><TopModel x={120} y={72} />
        <TopCamera x={120} y={124} fov={30} /><Label x={150} y={76} anchor="start">{l('头发一圈金边', 'Gold rim on hair')}</Label>
        <Label x={150} y={124} anchor="start">{l('按脸曝光', 'Expose for face')}</Label><Label x={90} y={20} anchor="end">{l('太阳在她身后', 'Sun behind her')}</Label>
        <Label x={120} y={bottom + 4}>{l('俯视图', 'Top view')}</Label></>
    case 'shade':
      return <><Sun x={210} y={18} /><rect x="120" y="30" width="56" height="30" fill="#9c9d94" stroke={ink} strokeWidth="1.8" /><path d="M120 60L176 60L120 124L64 124Z" fill="#cfd0c8" opacity=".9" /><Label x={148} y={49} color={paper}>{l('建筑', 'Building')}</Label>
        <TopModel x={104} y={92} /><TopCamera x={52} y={118} rot={-40} /><Label x={190} y={100} anchor="middle">{l('开阔阴影：', 'Open shade:')}</Label><Label x={190} y={112}>{l('光柔、不眯眼', 'soft, no squint')}</Label>
        <Label x={120} y={bottom + 4}>{l('俯视图 · 站进阴影边缘，脸朝亮处', 'Top view · stand at the shade edge, face the open sky')}</Label></>
    case 'overcast':
      return <><path d="M28 34q0-14 16-14q4-12 20-8q10-10 26 0q14-8 26 2q16-6 24 6q18-4 22 10q16 0 16 14z" fill="#e1e5e8" stroke={ink} strokeWidth="1.8" />
        {[50, 80, 110, 140, 170].map((x) => <Arrow key={x} x1={x} y1={46} x2={x + (120 - x) * .35} y2={82} color="#8aa4b0" />)}<path d="M16 128H224" stroke={ink} strokeWidth="2" /><Figure x={120} foot={128} h={44} />
        <Label x={120} y={bottom + 4}>{l('整片云是一块大柔光箱，适合近景', 'The cloud is one giant softbox: great for close-ups')}</Label></>
    case 'reflector':
      return <><Sun x={120} y={18} /><TopModel x={120} y={62} /><path d="M84 104a26 10 0 0 0 40 8" fill="none" stroke="#c0c4c8" strokeWidth="6" strokeLinecap="round" /><path d="M84 104a26 10 0 0 0 40 8" fill="none" stroke={ink} strokeWidth="1.4" />
        <Arrow x1={110} y1={32} x2={100} y2={98} color={sun} dashed /><Arrow x1={100} y1={100} x2={116} y2={70} color={sun} />
        <TopCamera x={170} y={124} rot={-30} /><Label x={60} y={124}>{l('反光板放前下方', 'Reflector low, in front')}</Label>
        <Label x={140} y={66} anchor="start">{l('光打回脸上', 'Bounces into face')}</Label><Label x={120} y={bottom + 4}>{l('俯视图 · 白柔 / 银亮 / 金暖', 'Top view · white soft / silver bright / gold warm')}</Label></>
    case 'flare':
      return <><Frame><Figure x={110} foot={122} h={90} /><Sun x={128} y={34} r={7} /><circle cx="162" cy="64" r="7" fill={sun} opacity=".35" /><circle cx="184" cy="84" r="11" fill={sun} opacity=".22" /><circle cx="150" cy="52" r="3" fill={sun} opacity=".5" /></Frame>
        <Label x={120} y={bottom}>{l('太阳从肩膀或发边露出一点', 'Let the sun peek past her shoulder or hair')}</Label></>
    case 'shutter':
      return <>{[['24fps', '1/50', l('正常速度', 'Normal')], ['60fps', '1/125', l('慢 2.5 倍', '2.5× slow')], ['120fps', '1/250', l('慢 5 倍', '5× slow')]].map(([fps, sh, note], i) => <g key={fps}>
          <rect x="24" y={20 + i * 34} width="62" height="24" rx="5" fill={i ? accent : paper} stroke={ink} strokeWidth="1.6" /><Label x={55} y={36 + i * 34} size={10}>{fps}</Label>
          <Arrow x1={92} y1={32 + i * 34} x2={124} y2={32 + i * 34} /><rect x="130" y={20 + i * 34} width="50" height="24" rx="5" fill={paper} stroke={ink} strokeWidth="1.6" /><Label x={155} y={36 + i * 34} size={10}>{sh}</Label>
          <Label x={188} y={36 + i * 34} anchor="start" size={7.5}>{note}</Label></g>)}
        <Label x={120} y={bottom}>{l('快门 ≈ 帧率 × 2', 'Shutter ≈ 2 × frame rate')}</Label></>
    case 'nd':
      return <><path d="M64 72H214" stroke={ink} strokeWidth="2" />{Array.from({ length: 11 }, (_, i) => <g key={i}><path d={`M${64 + i * 15} 67V77`} stroke={ink} strokeWidth="1.5" /><Label x={64 + i * 15} y={90} size={7.5}>{i}</Label></g>)}
        {([[3, 'ND8'], [6, 'ND64'], [10, 'ND1000']] as const).map(([stops, name], i) => <g key={name}><path d={`M64 ${20 + i * 15}H${64 + stops * 15}`} stroke={accent} strokeWidth="6" strokeLinecap="round" /><Label x={56} y={23 + i * 15} anchor="end">{name}</Label></g>)}
        <Label x={120} y={104}>{l('减光档数', 'Stops of light cut')}</Label>
        <Label x={120} y={126} color={good}>{l('晴天 f/2 + 1/50 + ISO100 ≈ 需要 6 档 → ND64', 'Sun at f/2, 1/50, ISO 100 ≈ 6 stops → ND64')}</Label>
        <Label x={120} y={bottom}>{l('f/8 以上拍远景可以不用', 'Wides at f/8 or smaller can skip it')}</Label></>
    case 'zebra': {
      const id = `${blur}-z`
      return <><defs><pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3" height="6" fill={ink} opacity=".55" /></pattern></defs>
        <rect x="20" y="10" width="200" height="40" fill="#dbe9ef" /><rect x="150" y="10" width="70" height="40" fill={`url(#${id})`} /><Label x={185} y={60} color={bad}>{l('100%：过曝', '100%: clipped')}</Label>
        <ellipse cx="96" cy="94" rx="26" ry="33" fill="#f1d6c4" stroke={ink} strokeWidth="1.8" /><path d="M100 64a26 33 0 0 1 0 63a20 30 0 0 0 0-63z" fill={`url(#${id})`} />
        <Label x={164} y={96} anchor="start" color={good}>{l('70%：脸亮的一侧', '70% on the bright')}</Label><Label x={164} y={108} anchor="start" color={good}>{l('刚出现就对了', 'side of the face')}</Label>
        <Label x={120} y={bottom + 4}>{l('斑马纹设两个值分别检查', 'Check skin and clipping separately')}</Label></>
    }
    case 'focus':
      return <><ellipse cx="120" cy="72" rx="34" ry="44" fill="#f1d6c4" stroke={ink} strokeWidth="1.8" transform="rotate(-12 120 72)" /><circle cx="104" cy="64" r="3" fill={ink} /><circle cx="132" cy="60" r="2.4" fill={ink} opacity=".7" />
        <path d="M94 54h-5v5M94 74h-5v-5M114 54h5v5M114 74h5v-5" stroke={good} strokeWidth="2" fill="none" />
        <Label x={60} y={42}>{l('近镜头的眼睛', 'Eye nearest lens')}</Label><Label x={120} y={bottom}>{l('人眼识别 AF-C，大光圈先试拍一条', 'Eye-detect AF-C, test a take at wide apertures')}</Label></>
    case 'fov': {
      const lenses: [number, number, number][] = [[24, 74, 60], [35, 54, 76], [50, 40, 92], [85, 24, 106], [135, 15, 118]]
      const cx = 120, cy = 132
      return <>{lenses.map(([mm, deg, len]) => { const a = deg / 2 * Math.PI / 180, on = mm === lens, dx = Math.sin(a) * len, dy = Math.cos(a) * len
          return <g key={mm}><path d={`M${cx} ${cy}L${cx - dx} ${cy - dy}A${len} ${len} 0 0 1 ${cx + dx} ${cy - dy}Z`} fill={on ? accent : 'none'} opacity={on ? .7 : 1} stroke={on ? ink : muted} strokeWidth={on ? 1.8 : 1} /><Label x={cx + dx + 4} y={cy - dy + 3} anchor="start" size={7.5} color={on ? ink : '#9a9b92'}>{mm}</Label></g> })}
        <TopCamera x={cx} y={cy + 4} /><Label x={14} y={bottom} anchor="start">{l(`${lens}mm 视角约 ${lenses.find(([mm]) => mm === lens)?.[1]}°`, `${lens}mm sees about ${lenses.find(([mm]) => mm === lens)?.[1]}°`)}</Label></>
    }
  }
}

// Schematic for one cheat-sheet tip: a frame layout, a side view, or a top-down setup.
export default function SetupDiagram({ kind, accent, lens, language }: { kind: DiagramKind; accent: string; lens?: number; language: Language }) {
  const blur = `blur${useId().replace(/:/g, '')}`
  const l = (zh: string, en: string) => language === 'en' ? en : zh
  return <svg className="setup-diagram" viewBox="0 0 240 150" role="img" aria-label={l('示意图', 'Diagram')}>
    <defs><filter id={blur}><feGaussianBlur stdDeviation="5" /></filter></defs>
    <Content kind={kind} accent={accent} lens={lens} l={l} blur={blur} />
  </svg>
}
