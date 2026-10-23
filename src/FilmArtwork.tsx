import type { FilmReference } from './filmReferences'

export default function FilmArtwork({ film }: { film: FilmReference }) {
  const ink = '#18211e'

  return <svg className="film-artwork" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id={`film-${film.id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={film.color} />
        <stop offset="1" stopColor="#f4f0e6" />
      </linearGradient>
      <pattern id={`grain-${film.id}`} width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="4" cy="8" r="1" fill={ink} opacity=".09" />
        <circle cx="19" cy="20" r=".8" fill={ink} opacity=".08" />
      </pattern>
    </defs>
    <rect width="640" height="360" fill={`url(#film-${film.id})`} />
    {film.id === 'closer' && <>
      <circle cx="488" cy="82" r="34" fill="#f4e9c8" />
      <path d="M0 242 88 190l67 28 101-106 79 91 85-70 112 88 108-43v182H0Z" fill="#607f7a" />
      <path d="M0 289 113 253l92 25 99-48 104 31 92-17 140 38v78H0Z" fill="#314d49" />
      <path d="M0 308h640M0 327h640" stroke="#e1dbcb" strokeWidth="3" opacity=".65" />
      <path d="M70 289h124l23 19H48Z" fill="#d7d8c8" stroke={ink} strokeWidth="3" />
      <rect x="85" y="293" width="22" height="8" fill="#486b68" /><rect x="116" y="293" width="22" height="8" fill="#486b68" /><rect x="147" y="293" width="22" height="8" fill="#486b68" />
      <circle cx="500" cy="253" r="7" fill={ink} /><path d="m500 261-4 24m4-19 11 13m-11-10-9 11m5 5-10 18m10-18 11 18" stroke={ink} strokeWidth="5" strokeLinecap="round" />
    </>}
    {film.id === 'spring' && <>
      <circle cx="485" cy="79" r="38" fill="#f1e9d8" />
      <path d="M0 258 144 107l78 88 111-137 137 161 95-104 75 96v149H0Z" fill="#65869a" />
      <path d="m144 107 40 45-31-10-33 15Zm189-49 69 81-57-28-35 37-31-33Zm232 57 34 42-38-15-25 18Z" fill="#ecf0e9" />
      <path d="M0 283c147-42 284-6 413-43 82-23 152-8 227 7v113H0Z" fill="#e9e9df" />
      <path d="M0 319c155-51 320-9 440-35 72-16 128-15 200-3" fill="none" stroke="#8aa9b5" strokeWidth="3" />
      <path d="m309 266 8 11-5 16m27-36 8 10-3 18" stroke={ink} strokeWidth="5" strokeLinecap="round" /><circle cx="307" cy="259" r="5" fill={ink} /><circle cx="337" cy="250" r="5" fill={ink} />
      <path d="m294 298 37-4m-5-5 42-3" stroke={ink} strokeWidth="3" strokeLinecap="round" />
    </>}
    {film.id === 'mile' && <>
      <circle cx="110" cy="95" r="44" fill="#f0d59d" />
      <path d="M0 207 93 175l88 28 78-60 103 50 87-75 75 49 116-31v224H0Z" fill="#8b8e73" />
      <path d="M0 260c145-52 211-15 328-47 125-34 218-22 312-12v159H0Z" fill="#5b715f" />
      <path d="M0 344c141-28 175-89 290-92 102-3 151 29 350-18" fill="none" stroke="#e7c99b" strokeWidth="24" />
      {[217,274,335].map((x,i) => <g key={x} transform={`translate(${x} ${i===1?269:276})`} fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round"><circle cy="-12" r="5" fill={ink} stroke="none" /><path d="m0-5-5 17m5-13 14 8m-14 2-12 13m7-10 14 15m-10-15-17 8" /></g>)}
    </>}
    {film.id === 'jalpi' && <>
      <rect y="85" width="640" height="275" fill="#376d70" opacity=".7" />
      <path d="M0 92c76-16 144 17 218 4 85-16 156-18 236-3 66 12 127 8 186-7" fill="none" stroke="#e4f2e5" strokeWidth="6" />
      <circle cx="490" cy="63" r="31" fill="#efe1ba" />
      {[55,100,150,202,455,512,568].map((x,i) => <g key={x} fill="none" stroke={i%2?'#c5d6ae':'#a1c7aa'} strokeWidth="5" strokeLinecap="round"><path d={`M${x} 360c${i%2?23:-19}-81 ${i%2?-17:29}-133 ${i%2?12:-6}-231`} /><path d={`M${x+4} 287q-32-20-43-43M${x-4} 251q35-13 47-34M${x+1} 331q26-22 39-48`} /></g>)}
      <path d="m295 172 37 10 28-5" fill="none" stroke={ink} strokeWidth="12" strokeLinecap="round" /><circle cx="287" cy="169" r="12" fill={ink} /><path d="m355 178 29 23m-44-15-13 30" stroke={ink} strokeWidth="9" strokeLinecap="round" />
      <circle cx="260" cy="141" r="4" fill="#d9efea" /><circle cx="245" cy="123" r="3" fill="#d9efea" />
    </>}
    {film.id === 'body' && <>
      <circle cx="314" cy="174" r="132" fill="#d6c7d9" stroke="#7c6783" strokeWidth="3" />
      <circle cx="314" cy="174" r="101" fill="#8e8caa" opacity=".56" />
      <circle cx="286" cy="157" r="55" fill="#e5d7cb" opacity=".9" />
      <circle cx="385" cy="214" r="31" fill="#c5afc9" stroke="#76667d" strokeWidth="3" />
      <circle cx="166" cy="276" r="35" fill="#d9c6d0" stroke="#76667d" strokeWidth="3" />
      <circle cx="511" cy="97" r="24" fill="#dfd5dc" stroke="#76667d" strokeWidth="3" />
      <path d="M252 186q42-56 87-17t76 0M260 211q50 30 91-8" fill="none" stroke="#726a86" strokeWidth="5" opacity=".7" />
      {[67,105,156,492,560,589].map((x,i) => <circle key={x} cx={x} cy={i%2?195:82} r={i%2?6:4} fill="#726a86" opacity=".7" />)}
    </>}
    <rect width="640" height="360" fill={`url(#grain-${film.id})`} />
    <rect x="15" y="15" width="610" height="330" fill="none" stroke="#f8f6ef" strokeWidth="2" opacity=".6" />
  </svg>
}
