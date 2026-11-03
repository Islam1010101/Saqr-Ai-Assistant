import React from 'react';

export type LearningPicture = 'book' | 'sun' | 'tree' | 'apple' | 'house' | 'desk' | 'ball' | 'pencil';

type Props = { kind: LearningPicture; className?: string };

export default function LearningPictureArt({ kind, className = 'w-full h-full' }: Props) {
  const sky = <><rect width="160" height="130" rx="20" fill="#E6F5FF" /><path d="M0 101 Q40 90 79 104 T160 100 V130 H0Z" fill="#D3F2DB" /></>;

  return <svg viewBox="0 0 160 130" className={className} role="img"
    aria-label={kind} xmlns="http://www.w3.org/2000/svg">
    {sky}
    {kind === 'sun' && <>
      <circle cx="80" cy="60" r="25" fill="#F7BF37" stroke="#D9910B" strokeWidth="3" />
      {Array.from({ length: 8 }, (_, i) => {
        const angle = i * Math.PI / 4;
        return <line key={i} x1={80 + Math.cos(angle) * 36} y1={60 + Math.sin(angle) * 36}
          x2={80 + Math.cos(angle) * 45} y2={60 + Math.sin(angle) * 45}
          stroke="#D9910B" strokeWidth="5" strokeLinecap="round" />;
      })}
      <circle cx="72" cy="55" r="2.5" fill="#71420F" /><circle cx="88" cy="55" r="2.5" fill="#71420F" />
      <path d="M73 66 Q80 73 87 66" fill="none" stroke="#71420F" strokeWidth="3" strokeLinecap="round" />
    </>}
    {kind === 'tree' && <>
      <rect x="72" y="66" width="17" height="48" rx="4" fill="#986237" />
      <circle cx="61" cy="60" r="26" fill="#23A464" /><circle cx="93" cy="57" r="29" fill="#31B778" />
      <circle cx="76" cy="39" r="28" fill="#50C988" /><circle cx="95" cy="68" r="23" fill="#26A96A" />
      <circle cx="58" cy="108" r="4" fill="#E99A31" /><circle cx="103" cy="115" r="4" fill="#E99A31" />
    </>}
    {kind === 'book' && <>
      <path d="M22 42 Q53 31 80 45 Q108 31 138 42 V104 Q110 94 80 109 Q50 94 22 104Z"
        fill="#F8FCFF" stroke="#266F95" strokeWidth="5" strokeLinejoin="round" />
      <path d="M80 46 V107" stroke="#266F95" strokeWidth="4" />
      <path d="M36 56 Q52 52 67 58 M36 68 Q52 64 67 70 M36 81 Q52 77 67 83 M92 58 Q108 52 125 56 M92 70 Q108 64 125 68 M92 83 Q108 77 125 81"
        stroke="#7A9CB1" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M20 108 Q50 99 80 112 Q110 99 140 108" stroke="#F4A93B" strokeWidth="6" fill="none" strokeLinecap="round" />
    </>}
    {kind === 'apple' && <>
      <path d="M78 50 C50 34 35 55 40 83 C47 111 65 119 80 110 C95 119 114 110 121 83 C127 55 108 37 82 50Z"
        fill="#F04D48" stroke="#B92731" strokeWidth="4" />
      <path d="M80 48 Q82 30 96 25" stroke="#66502B" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M83 36 Q102 12 117 30 Q103 45 83 36" fill="#43B46A" stroke="#238146" strokeWidth="3" />
      <ellipse cx="58" cy="72" rx="8" ry="15" fill="#FF9792" opacity=".65" transform="rotate(20 58 72)" />
    </>}
    {kind === 'house' && <>
      <path d="M35 66 L80 27 125 66" fill="#EBA54D" stroke="#B85E2B" strokeWidth="6" strokeLinejoin="round" />
      <rect x="43" y="63" width="74" height="53" rx="4" fill="#FFE3A7" stroke="#CE934B" strokeWidth="4" />
      <rect x="71" y="81" width="22" height="35" rx="3" fill="#C67845" />
      <circle cx="88" cy="99" r="2" fill="#FFE8B7" />
      <rect x="51" y="75" width="14" height="17" rx="2" fill="#78CBE6" stroke="#C67845" strokeWidth="3" />
      <rect x="97" y="75" width="14" height="17" rx="2" fill="#78CBE6" stroke="#C67845" strokeWidth="3" />
    </>}
    {kind === 'desk' && <>
      <path d="M36 82 H128 V91 H36Z" fill="#BD7B4A" stroke="#93552C" strokeWidth="3" />
      <path d="M45 91 V119 M119 91 V119" stroke="#93552C" strokeWidth="7" strokeLinecap="round" />
      <path d="M54 64 Q72 56 82 67 Q100 56 112 64 V79 Q96 72 82 81 Q68 72 54 79Z"
        fill="#FEFEFC" stroke="#157A73" strokeWidth="3" /><path d="M82 67 V81" stroke="#157A73" strokeWidth="2.5" />
      <path d="M17 89 H43 V98 H25 V119" fill="none" stroke="#6281B0" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="123" cy="27" r="15" fill="#F9C657" />
    </>}
    {kind === 'ball' && <>
      <circle cx="80" cy="76" r="37" fill="#FFE8A9" stroke="#C98B2C" strokeWidth="4" />
      <path d="M53 49 Q76 73 68 109 M105 48 Q87 77 109 100 M44 81 Q80 60 115 78" fill="none"
        stroke="#E37057" strokeWidth="6" strokeLinecap="round" />
      <circle cx="68" cy="59" r="7" fill="#FFFFFF" opacity=".8" />
    </>}
    {kind === 'pencil' && <>
      <g transform="translate(80 75) rotate(37)">
        <rect x="-12" y="-53" width="24" height="80" rx="3" fill="#F7C04B" stroke="#BE852D" strokeWidth="3" />
        <rect x="-12" y="-53" width="24" height="13" rx="2" fill="#E48C99" />
        <path d="M-12 27 L0 51 12 27Z" fill="#F2D3A4" stroke="#BE852D" strokeWidth="3" />
        <path d="M-5 41 L0 51 5 41Z" fill="#464B50" />
        <path d="M-4 -37 V21" stroke="#FCE3A8" strokeWidth="4" />
      </g>
    </>}
  </svg>;
}
