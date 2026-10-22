import type { VisualKind } from './types'

type Props = { kind: VisualKind; accent: string; compact?: boolean }

const ink = '#191a17'
const paper = '#f6f4ed'
const muted = '#c9c9c1'

function Camera({ x = 44, y = 62, scale = 1 }: { x?: number; y?: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} stroke={ink} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="0" y="0" width="28" height="19" rx="3" fill={paper} />
      <path d="M28 5l10-5v18l-10-5" fill={paper} />
      <path d="M8 19l-6 16M20 19l7 16M14 19v16" />
      <circle cx="10" cy="9" r="3" fill={ink} />
    </g>
  )
}

function Person({ x = 150, y = 47, scale = 1, faded = false }: { x?: number; y?: number; scale?: number; faded?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} stroke={ink} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity={faded ? .3 : 1}>
      <circle cx="0" cy="0" r="9" fill={paper} />
      <path d="M0 9v32M0 21l-15 13M0 21l15 13M0 41l-12 24M0 41l12 24" />
    </g>
  )
}

function Arrow({ x1, y1, x2, y2, color = ink, dashed = false }: { x1: number; y1: number; x2: number; y2: number; color?: string; dashed?: boolean }) {
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const s = 7
  return (
    <g stroke={color} fill="none" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={dashed ? '5 6' : undefined}>
      <path d={`M${x1} ${y1}L${x2} ${y2}`} />
      <path d={`M${x2} ${y2}L${x2 - s * Math.cos(angle - .55)} ${y2 - s * Math.sin(angle - .55)}M${x2} ${y2}L${x2 - s * Math.cos(angle + .55)} ${y2 - s * Math.sin(angle + .55)}`} />
    </g>
  )
}

function VisualContent({ kind, accent }: Omit<Props, 'compact'>) {
  switch (kind) {
    case 'objective':
      return <><Person x={48} y={52} scale={.72} /><circle cx="177" cy="66" r="28" fill={accent} /><circle cx="177" cy="66" r="13" fill="none" stroke={ink} strokeWidth="2" /><circle cx="177" cy="66" r="3" fill={ink} /><Arrow x1={84} y1={66} x2={140} y2={66} color={ink} /></>
    case 'beats':
      return <><path d="M24 84h212" stroke={muted} strokeWidth="2" /><path d="M26 84C55 84 55 45 84 45s29 56 58 56 29-73 58-73 26 56 36 56" fill="none" stroke={ink} strokeWidth="3" /><circle cx="84" cy="45" r="7" fill={accent} stroke={ink} strokeWidth="2" /><circle cx="142" cy="101" r="7" fill={accent} stroke={ink} strokeWidth="2" /><circle cx="200" cy="28" r="7" fill={accent} stroke={ink} strokeWidth="2" /></>
    case 'motif':
      return <><circle cx="58" cy="66" r="23" fill="none" stroke={ink} strokeWidth="3" /><circle cx="130" cy="66" r="23" fill={accent} stroke={ink} strokeWidth="3" /><circle cx="202" cy="66" r="23" fill={ink} /><path d="M58 43v46M35 66h46M130 43v46M107 66h46M202 43v46M179 66h46" stroke={paper} strokeWidth="2" opacity=".75" /></>
    case 'aspect':
      return <><rect x="23" y="35" width="58" height="72" rx="3" fill="none" stroke={ink} strokeWidth="3" /><rect x="100" y="42" width="74" height="58" rx="3" fill={accent} stroke={ink} strokeWidth="3" /><rect x="193" y="52" width="58" height="38" rx="3" fill="none" stroke={ink} strokeWidth="3" /><text x="52" y="124" textAnchor="middle" fontSize="11" fill={ink}>4:3</text><text x="137" y="124" textAnchor="middle" fontSize="11" fill={ink}>16:9</text><text x="222" y="124" textAnchor="middle" fontSize="11" fill={ink}>2.39:1</text></>
    case 'palette':
      return <><circle cx="53" cy="66" r="31" fill={accent} stroke={ink} strokeWidth="3" /><circle cx="105" cy="66" r="31" fill="#db755d" stroke={ink} strokeWidth="3" /><circle cx="157" cy="66" r="31" fill="#6388a8" stroke={ink} strokeWidth="3" /><circle cx="209" cy="66" r="31" fill="#1f292a" stroke={ink} strokeWidth="3" /></>
    case 'composition':
      return <><rect x="30" y="20" width="200" height="112" rx="3" fill="none" stroke={ink} strokeWidth="3" /><path d="M96 20v112M164 20v112M30 57h200M30 95h200" stroke={muted} strokeWidth="1.5" /><circle cx="164" cy="57" r="15" fill={accent} stroke={ink} strokeWidth="2" /><path d="M164 72v38" stroke={ink} strokeWidth="3" /></>
    case 'lighting':
      return <><circle cx="49" cy="41" r="17" fill={accent} stroke={ink} strokeWidth="2" /><path d="M72 48l45 17M68 61l45 22M63 73l44 28" stroke={accent} strokeWidth="4" opacity=".8" /><Person x={151} y={50} scale={.75} /><path d="M151 43a9 9 0 010 18Z" fill={ink} /><ellipse cx="192" cy="118" rx="45" ry="7" fill={ink} opacity=".13" /></>
    case 'production':
      return <><path d="M25 118V31h210v87" fill="none" stroke={ink} strokeWidth="3" /><rect x="43" y="56" width="48" height="62" fill={accent} stroke={ink} strokeWidth="2" /><path d="M171 69h46v49h-46zM109 91h49v27h-49z" fill="none" stroke={ink} strokeWidth="2" /><circle cx="199" cy="92" r="10" fill={muted} /><path d="M0 119h260" stroke={ink} strokeWidth="3" /><path d="M17 119l34-38h21l22 38" fill={ink} opacity=".12" /></>
    case 'shot-size':
      return <><g transform="translate(15 12)"><rect width="52" height="112" rx="2" fill="none" stroke={ink} strokeWidth="2" /><Person x={26} y={25} scale={.65} /></g><g transform="translate(77 12)"><rect width="52" height="112" rx="2" fill={accent} stroke={ink} strokeWidth="2" /><Person x={26} y={35} scale={.82} /></g><g transform="translate(139 12)"><rect width="52" height="112" rx="2" fill="none" stroke={ink} strokeWidth="2" /><Person x={26} y={53} scale={1.05} /></g><g transform="translate(201 12)"><rect width="44" height="112" rx="2" fill="none" stroke={ink} strokeWidth="2" /><circle cx="22" cy="58" r="21" fill={paper} stroke={ink} strokeWidth="2" /></g></>
    case 'angle':
      return <><Person x={132} y={48} scale={.7} /><Camera x={27} y={22} scale={.65} /><Camera x={27} y={65} scale={.65} /><Camera x={27} y={108} scale={.65} /><path d="M55 33l60 30M55 76h55M55 119l60-37" stroke={accent} strokeWidth="3" strokeDasharray="6 5" /><path d="M173 19v106" stroke={muted} strokeWidth="2" /><text x="190" y="36" fontSize="11" fill={ink}>俯拍</text><text x="190" y="79" fontSize="11" fill={ink}>平视</text><text x="190" y="122" fontSize="11" fill={ink}>仰拍</text></>
    case 'lens':
      return <><Camera x={14} y={62} scale={.7} /><path d="M48 69L119 24v90Z" fill={accent} opacity=".55" stroke={ink} strokeWidth="2" /><Person x={150} y={53} scale={.66} /><Camera x={177} y={63} scale={.7} /><path d="M211 70l23-28v56Z" fill="none" stroke={ink} strokeWidth="2" /><Person x={242} y={57} scale={.55} /><text x="84" y="132" textAnchor="middle" fontSize="11" fill={ink}>广角</text><text x="221" y="132" textAnchor="middle" fontSize="11" fill={ink}>长焦</text></>
    case 'focus':
      return <><Person x={70} y={53} scale={.73} /><Person x={190} y={57} scale={.65} faded /><circle cx="70" cy="67" r="42" fill="none" stroke={accent} strokeWidth="3" /><Arrow x1={111} y1={112} x2={160} y2={112} color={ink} /><circle cx="190" cy="67" r="35" fill="none" stroke={muted} strokeWidth="2" strokeDasharray="5 4" /></>
    case 'movement':
      return <><Camera x={28} y={63} scale={.82} /><Person x={201} y={48} scale={.72} /><path d="M81 65C119 34 161 34 190 54" fill="none" stroke={accent} strokeWidth="4" strokeDasharray="7 6" /><path d="M182 45l10 9-13 3" fill="none" stroke={accent} strokeWidth="4" /><path d="M64 118h143" stroke={ink} strokeWidth="2" /><circle cx="78" cy="118" r="5" fill={ink} /><circle cx="192" cy="118" r="5" fill={ink} /></>
    case 'blocking':
      return <><rect x="20" y="22" width="220" height="106" rx="5" fill="none" stroke={ink} strokeWidth="3" /><circle cx="61" cy="52" r="13" fill={accent} stroke={ink} strokeWidth="2" /><circle cx="199" cy="96" r="13" fill={paper} stroke={ink} strokeWidth="2" /><path d="M74 57c37 6 44 39 80 39" fill="none" stroke={ink} strokeWidth="2" strokeDasharray="5 5" /><Arrow x1={151} y1={96} x2={180} y2={96} color={ink} /><path d="M130 22v31M20 76h43M211 22v28" stroke={muted} strokeWidth="6" /></>
    case 'coverage':
      return <><rect x="17" y="19" width="98" height="55" rx="3" fill={accent} stroke={ink} strokeWidth="2" /><rect x="125" y="19" width="55" height="55" rx="3" fill="none" stroke={ink} strokeWidth="2" /><rect x="190" y="19" width="55" height="55" rx="3" fill="none" stroke={ink} strokeWidth="2" /><rect x="17" y="84" width="55" height="46" rx="3" fill="none" stroke={ink} strokeWidth="2" /><rect x="82" y="84" width="98" height="46" rx="3" fill="none" stroke={ink} strokeWidth="2" /><rect x="190" y="84" width="55" height="46" rx="3" fill={ink} /><circle cx="48" cy="106" r="12" fill={paper} stroke={ink} strokeWidth="2" /><circle cx="152" cy="47" r="13" fill={paper} stroke={ink} strokeWidth="2" /><circle cx="217" cy="47" r="13" fill={paper} stroke={ink} strokeWidth="2" /></>
    case 'axis':
      return <><circle cx="76" cy="70" r="14" fill={accent} stroke={ink} strokeWidth="2" /><circle cx="187" cy="70" r="14" fill={paper} stroke={ink} strokeWidth="2" /><path d="M11 70h238" stroke={ink} strokeWidth="2" strokeDasharray="7 6" /><path d="M76 70C105 18 158 18 187 70" fill="none" stroke={accent} strokeWidth="18" opacity=".32" /><Camera x={91} y={17} scale={.52} /><Camera x={139} y={17} scale={.52} /><path d="M76 70l28-23M187 70l-24-23" stroke={ink} strokeWidth="1.5" /></>
    case 'exposure':
      return <><circle cx="59" cy="70" r="34" fill="none" stroke={ink} strokeWidth="3" /><circle cx="59" cy="70" r="19" fill={accent} stroke={ink} strokeWidth="2" /><path d="M59 36v68M25 70h68" stroke={ink} strokeWidth="2" /><path d="M123 36h111M123 70h111M123 104h111" stroke={muted} strokeWidth="5" strokeLinecap="round" /><circle cx="178" cy="36" r="8" fill={ink} /><circle cx="210" cy="70" r="8" fill={accent} stroke={ink} strokeWidth="2" /><circle cx="151" cy="104" r="8" fill={ink} /><text x="123" y="31" fontSize="10" fill={ink}>光圈</text><text x="123" y="65" fontSize="10" fill={ink}>快门</text><text x="123" y="99" fontSize="10" fill={ink}>ISO</text></>
    case 'room-tone':
      return <><path d="M24 73h18l7-22 12 51 14-67 13 75 13-52 11 29 10-14h19l9-31 12 64 12-48 10 32 10-17h38" fill="none" stroke={ink} strokeWidth="3" strokeLinejoin="round" /><rect x="20" y="28" width="220" height="90" rx="6" fill="none" stroke={muted} strokeWidth="2" /><path d="M89 126h82" stroke={accent} strokeWidth="7" strokeLinecap="round" /></>
    case 'cut-action':
      return <><rect x="16" y="22" width="104" height="94" rx="3" fill="none" stroke={ink} strokeWidth="2" /><rect x="140" y="22" width="104" height="94" rx="3" fill={accent} stroke={ink} strokeWidth="2" /><Person x={73} y={51} scale={.55} /><Person x={186} y={55} scale={.67} /><path d="M73 69l24-14M186 74l29 9" stroke={ink} strokeWidth="3" /><path d="M129 17v104" stroke={ink} strokeWidth="4" /><path d="M119 69h20" stroke={paper} strokeWidth="4" /></>
    case 'jl-cut':
      return <><path d="M25 43h80v38h35v-19h95" fill="none" stroke={ink} strokeWidth="8" strokeLinejoin="round" /><path d="M25 103h56V84h45v38h109" fill="none" stroke={accent} strokeWidth="8" strokeLinejoin="round" /><text x="18" y="47" fontSize="13" fontWeight="700" fill={ink}>V</text><text x="18" y="108" fontSize="13" fontWeight="700" fill={ink}>A</text><path d="M130 24v106" stroke={muted} strokeWidth="2" strokeDasharray="4 4" /></>
    case 'sound-layers':
      return <>{[0,1,2,3].map((row) => <g key={row} transform={`translate(20 ${24 + row * 28})`}><rect width="220" height="18" rx="9" fill={row === 0 ? accent : muted} opacity={row === 0 ? 1 : .65} /><path d={`M8 9h18l6-${4 + row} 12 ${8 + row} 15-${10 + row} 14 5 17-${7 + row} 21 4h82`} fill="none" stroke={ink} strokeWidth="1.8" /></g>)}</>
    case 'color-match':
      return <><rect x="20" y="23" width="98" height="104" rx="4" fill="#88a8b1" stroke={ink} strokeWidth="3" /><rect x="142" y="23" width="98" height="104" rx="4" fill="#d5a870" stroke={ink} strokeWidth="3" /><Person x={70} y={57} scale={.58} /><Person x={190} y={57} scale={.58} /><Arrow x1={115} y1={76} x2={145} y2={76} color={ink} /><path d="M18 137h224" stroke={accent} strokeWidth="6" strokeLinecap="round" /></>
    case 'subtitles':
      return <><rect x="24" y="17" width="212" height="119" rx="5" fill="none" stroke={ink} strokeWidth="3" /><rect x="43" y="32" width="174" height="87" fill="none" stroke={muted} strokeWidth="2" strokeDasharray="5 4" /><Person x={130} y={48} scale={.54} /><rect x="72" y="100" width="116" height="15" rx="3" fill={ink} /><path d="M86 107h88" stroke={paper} strokeWidth="2" /></>
    case 'export':
      return <><rect x="54" y="27" width="152" height="96" rx="6" fill={paper} stroke={ink} strokeWidth="3" /><rect x="69" y="42" width="122" height="61" rx="2" fill={accent} stroke={ink} strokeWidth="2" /><path d="M130 35V9M119 20l11-11 11 11" stroke={ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><path d="M90 132h80" stroke={ink} strokeWidth="4" strokeLinecap="round" /><path d="M118 56l34 17-34 17Z" fill={ink} /></>
  }
}

export default function TechniqueVisual({ kind, accent, compact = false }: Props) {
  return (
    <svg viewBox="0 0 260 150" role="img" aria-label="技术示意图" className={compact ? 'visual compact' : 'visual'}>
      <rect x="0" y="0" width="260" height="150" rx="14" fill={paper} />
      <VisualContent kind={kind} accent={accent} />
    </svg>
  )
}
