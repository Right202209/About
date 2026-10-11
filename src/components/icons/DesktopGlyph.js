import { useId } from 'react';

function Folder({ id }) {
  return <>
    <defs>
      <linearGradient id={`${id}-back`} x2="0" y2="1"><stop stopColor="#38b9ed" /><stop offset="1" stopColor="#0984cf" /></linearGradient>
      <linearGradient id={`${id}-front`} x2="0" y2="1"><stop stopColor="#83dcfa" /><stop offset=".2" stopColor="#69cdf3" /><stop offset="1" stopColor="#37a8e8" /></linearGradient>
    </defs>
    <path d="M8 31a7 7 0 0 1 7-7h31l11 11h56a7 7 0 0 1 7 7v60H8V31Z" fill={`url(#${id}-back)`} stroke="#168ac9" />
    <path d="M13 39h100v59H13Z" fill="#e4f7fd" />
    <path d="M8 48a6 6 0 0 1 6-6h100a6 6 0 0 1 6 6v54a7 7 0 0 1-7 7H15a7 7 0 0 1-7-7V48Z" fill={`url(#${id}-front)`} stroke="#219bd8" strokeWidth=".8" />
    <path d="M14 43h100" stroke="#b6eeff" strokeWidth="1.5" />
  </>;
}

function Document({ id, type }) {
  return <>
    <defs><linearGradient id={`${id}-paper`} x2="0" y2="1"><stop stopColor="#fff" /><stop offset="1" stopColor="#e4e9ed" /></linearGradient></defs>
    <path d="M29 9h48l23 24v80a5 5 0 0 1-5 5H29a5 5 0 0 1-5-5V14a5 5 0 0 1 5-5Z" fill={`url(#${id}-paper)`} stroke="#a4aab0" />
    <path d="M77 9v21a4 4 0 0 0 4 4h19" fill="#d3dce3" stroke="#b5bec5" />
    <path d="M37 53h47M37 61h47M37 69h47M37 77h47M37 85h32" stroke="#9aa8b4" strokeWidth="2.3" />
    <rect x="31" y="91" width="62" height="20" rx="3" fill={type === 'code' ? '#3278b9' : '#8c98a5'} />
    <text x="62" y="105" textAnchor="middle" fontFamily="-apple-system, sans-serif" fontWeight="600" fontSize="12" fill="white">{type === 'code' ? 'JS' : type === 'pdf' ? 'PDF' : 'TXT'}</text>
  </>;
}

function Drive({ id }) {
  return <>
    <defs><linearGradient id={`${id}-drive`} x2="0" y2="1"><stop stopColor="#f6f6f7" /><stop offset=".5" stopColor="#d1d5d9" /><stop offset="1" stopColor="#a1a8b1" /></linearGradient></defs>
    <path d="M31 12h66a7 7 0 0 1 7 6l7 82a8 8 0 0 1-8 9H25a8 8 0 0 1-8-9l7-82a7 7 0 0 1 7-6Z" fill={`url(#${id}-drive)`} stroke="#858e96" strokeWidth="1.2" />
    <path d="M19 94h90v14a6 6 0 0 1-6 6H25a6 6 0 0 1-6-6V94Z" fill="#bbc0c6" stroke="#868e96" />
    <path d="M30 22h68M28 91h74" stroke="#fff" strokeOpacity=".7" />
    <circle cx="94" cy="103" r="2.4" fill="#72a159" /><path d="M29 103h23" stroke="#747d86" strokeWidth="2" strokeLinecap="round" />
  </>;
}

export default function DesktopGlyph({ type = 'folder' }) {
  const id = useId().replace(/:/g, '');
  const Shape = type === 'drive' ? Drive : ['document', 'pdf', 'code'].includes(type) ? Document : Folder;
  return <svg className="file-icon" viewBox="0 0 128 128" fill="none" aria-hidden="true"><Shape id={id} type={type} /></svg>;
}
