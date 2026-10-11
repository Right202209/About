import IconTile from './IconTile';

function Finder() {
  return <IconTile from="#51c9ff" to="#0781ed">{id => <>
    <path d="M68 8h52v112H67c-5-20-5-36-1-49H51c-1-20 5-44 17-63Z" fill="#e4f2fc" clipPath={`url(#${id}-clip)`} />
    <path d="M66 71H51c-1-20 5-44 17-63M66 71c-4 13-4 29 1 49" stroke="#1760a1" strokeWidth="1.7" />
    <path d="M38 42v10m51-10v10" stroke="#14374f" strokeWidth="4" strokeLinecap="round" />
    <path d="M31 76c18 19 46 19 65 0" stroke="#14374f" strokeWidth="3.8" strokeLinecap="round" />
  </>}</IconTile>;
}

function Safari() {
  return <IconTile from="#fff" to="#e4e6e8">{id => <>
    <defs><linearGradient id={`${id}-dial`} x2="0" y2="1"><stop stopColor="#29d7fb" /><stop offset="1" stopColor="#0760db" /></linearGradient></defs>
    <circle cx="64" cy="64" r="48" fill={`url(#${id}-dial)`} stroke="#bec4ca" strokeWidth="1" />
    <g stroke="white" strokeLinecap="round">{Array.from({ length: 60 }, (_, i) => <path key={i} d={`M64 20v${i % 5 === 0 ? 7 : 3.5}`} strokeWidth={i % 5 === 0 ? 1.8 : 1} transform={`rotate(${i * 6} 64 64)`} />)}</g>
    <path d="m89 35-17 38-8-9Z" fill="#ff4856" /><path d="m89 35-25 29-8-9Z" fill="#ef223c" />
    <path d="m39 93 17-38 8 9Z" fill="#fff" /><path d="m39 93 25-29 8 9Z" fill="#dce5ef" />
    <circle cx="64" cy="64" r="2" fill="white" />
  </>}</IconTile>;
}

function Mail() {
  return <IconTile from="#28c5fc" to="#0876e9">
    <rect x="24" y="35" width="80" height="59" rx="5" fill="#fff" />
    <path d="m25 91 28-26m50 26L75 65" stroke="#cedef3" strokeWidth="2" />
    <path d="m25 38 35 28a6 6 0 0 0 8 0l35-28" stroke="#0985ed" strokeWidth="2.5" />
  </IconTile>;
}

function Music() {
  return <IconTile from="#ff6476" to="#ee2448">
    <path d="M52 83V40c0-3 1-5 4-5l35-7c3-1 5 1 5 4v44c0 10-19 15-22 6-3-8 7-12 15-12V46l-30 6v36c0 10-19 15-22 6-3-8 7-12 15-11Z" fill="white" />
  </IconTile>;
}

function Terminal() {
  return <IconTile from="#56585e" to="#252629">
    <rect x="16" y="20" width="96" height="87" rx="6" fill="#17191b" stroke="#86888c" strokeWidth="1.5" />
    <path d="m30 39 18 15-18 15m29 3h25" stroke="#f0f1f1" strokeWidth="5" strokeLinejoin="round" />
  </IconTile>;
}

function Code() {
  return <IconTile from="#fff" to="#e4e8ee">
    <path d="m88 23 20 10v62l-20 10-48-40-19 15-9-5V53l9-5 19 15 48-40ZM24 59v10l9-5-9-5Zm64-12L56 64l32 19V47Z" fill="#087fc1" />
    <path d="m88 23 20 10v62l-20 10V23Z" fill="#28a9f2" />
    <path d="m88 23-48 40 16 1 32-17V23Z" fill="#149de6" />
  </IconTile>;
}

function Settings() {
  return <IconTile from="#e1e4e7" to="#a3a8ae">{id => <>
    <defs><linearGradient id={`${id}-metal`} x2=".8" y2="1"><stop stopColor="#fff" /><stop offset=".45" stopColor="#9a9fa5" /><stop offset="1" stopColor="#f3f5f7" /></linearGradient></defs>
    <circle cx="64" cy="65" r="46" fill="#484c51" stroke="#f5f5f5" strokeWidth="2" />
    <g stroke={`url(#${id}-metal)`} strokeWidth="6">{Array.from({ length: 16 }, (_, i) => <path key={i} d="M64 22v13" transform={`rotate(${i * 22.5} 64 65)`} />)}</g>
    <circle cx="64" cy="65" r="30" stroke={`url(#${id}-metal)`} strokeWidth="9" />
    <circle cx="64" cy="65" r="18" fill="#777d84" stroke="#292e33" strokeWidth="2" />
    <g stroke="#d8dce0" strokeWidth="7">{[0, 120, 240].map(angle => <path key={angle} d="M64 35v20" transform={`rotate(${angle} 64 65)`} />)}</g>
    <circle cx="64" cy="65" r="9" fill="#3b4148" stroke="#eef0f1" strokeWidth="3" />
  </>}</IconTile>;
}

function Trash() {
  return <IconTile from="#e9eef1" to="#b7c3cc" tile={false}>{id => <>
    <defs><linearGradient id={`${id}-bin`}><stop stopColor="#a4aeb7" /><stop offset=".3" stopColor="#f1f5f8" stopOpacity=".93" /><stop offset=".7" stopColor="#d4dce2" stopOpacity=".9" /><stop offset="1" stopColor="#8d9ba6" /></linearGradient><clipPath id={`${id}-mesh`}><path d="m30 35 6 70q28 18 56 0l6-70Z" /></clipPath></defs>
    <path d="m28 33 7 73q29 19 58 0l7-73" fill={`url(#${id}-bin)`} stroke="#9ca8b1" strokeWidth="2" />
    <g clipPath={`url(#${id}-mesh)`} stroke="#81909c" strokeOpacity=".65" strokeWidth="1.2">{Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${27 + i * 5.5} 35v80M29 ${40 + i * 5}h70`} />)}</g>
    <ellipse cx="64" cy="33" rx="36" ry="11" fill="#e4eaef" stroke="#a6b2bc" strokeWidth="2" />
    <ellipse cx="64" cy="33" rx="30" ry="7" fill="#84919c" /><path d="M35 106q29 15 58 0" stroke="#f4f7fa" strokeWidth="3" />
  </>}</IconTile>;
}


function Launchpad() {
  const colors = ['#ff5f57', '#febc2e', '#28c840', '#0a84ff', '#bf5af2', '#ff9f0a', '#64d2ff', '#ff375f', '#30d158'];
  return <IconTile from="#5b5f66" to="#2a2c31">
    {colors.map((color, index) => <rect key={color} x={27 + (index % 3) * 27} y={27 + Math.floor(index / 3) * 27} width="20" height="20" rx="6" fill={color} />)}
  </IconTile>;
}

function Notes() {
  return <IconTile from="#fff" to="#f2f2f2">{id => <>
    <path d="M8 40C8 18 18 8 40 8h48c22 0 32 10 32 32v4H8v-4Z" fill="#ffd52e" clipPath={`url(#${id}-clip)`} />
    <path d="M8 40h112v4H8z" fill="#e6b800" />
    <g stroke="#d7d7d7" strokeWidth="2">{[62, 78, 94, 110].map(y => <path key={y} d={`M14 ${y}h100`} />)}</g>
    <g fill="#b9b9b9">{[20, 32, 44, 56, 68, 80, 92, 104].map(x => <circle key={x} cx={x} cy="51" r="1.6" />)}</g>
  </>}</IconTile>;
}

function Calculator() {
  const keys = ['#a5a5a5', '#a5a5a5', '#ff9f0a', '#333', '#333', '#ff9f0a', '#333', '#333', '#ff9f0a'];
  return <IconTile from="#4a4a4c" to="#1c1c1e">
    <rect x="26" y="20" width="76" height="22" rx="5" fill="#0f0f10" />
    <path d="M76 31h18" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    {keys.map((color, index) => <circle key={index} cx={38 + (index % 3) * 26} cy={60 + Math.floor(index / 3) * 22} r="9" fill={color} />)}
  </IconTile>;
}

const GLYPHS = { finder: Finder, safari: Safari, mail: Mail, music: Music, terminal: Terminal, code: Code, settings: Settings, trash: Trash, launchpad: Launchpad, notes: Notes, calculator: Calculator };

export default function DockGlyph({ type }) {
  const Glyph = GLYPHS[type] || Finder;
  return <Glyph />;
}
