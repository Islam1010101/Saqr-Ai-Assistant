import React from 'react';

/** Decorative illustration: Saqr examines the lines of an open library book.
 * SVG-only drawn motifs plus the original EFIPS Saqr character image.
 */
export default function SaqrBookQuestArt({compact=false}:{compact?:boolean}){
 return <div className={'sq-illustration '+(compact?'sq-illustration--compact':'')} aria-hidden="true">
  <span className="sq-illustration-orbit"/>
  <img src="/saqr-full.png" alt="" className="sq-illustration-mascot"/>
  <svg className="sq-illustration-book" viewBox="0 0 420 276" xmlns="http://www.w3.org/2000/svg" fill="none">
   <defs>
    <linearGradient id="sq-book-cover" x1="40" y1="235" x2="380" y2="235" gradientUnits="userSpaceOnUse">
     <stop stopColor="#176E83"/><stop offset="0.5" stopColor="#224B69"/><stop offset="1" stopColor="#293D70"/>
    </linearGradient>
    <linearGradient id="sq-book-paper" x1="80" y1="45" x2="320" y2="225" gradientUnits="userSpaceOnUse">
     <stop stopColor="#FFFAE8"/><stop offset="1" stopColor="#F4E5CA"/>
    </linearGradient>
    <filter id="sq-book-shadow" x="0" y="0" width="420" height="276" filterUnits="userSpaceOnUse">
     <feGaussianBlur in="SourceAlpha" stdDeviation="7"/><feOffset dy="8"/><feComponentTransfer><feFuncA type="linear" slope="0.22"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
   </defs>
   <g filter="url(#sq-book-shadow)">
    <path d="M19 211q90-19 191 23 103-42 191-23v24q-95-14-191 25Q114 221 19 235z" fill="url(#sq-book-cover)"/>
    <path d="M22 80q95-22 188 25v129Q114 193 22 210z" fill="url(#sq-book-paper)" stroke="#B89D72" strokeWidth="2.5"/>
    <path d="M398 80q-95-22-188 25v129q96-41 188-24z" fill="url(#sq-book-paper)" stroke="#B89D72" strokeWidth="2.5"/>
    <path d="M210 105v128" stroke="#D2B48B" strokeWidth="3"/>
    <path d="M32 91q94-12 173 28M32 102q91-12 173 28M389 91q-94-12-173 28M389 102q-94-12-173 28" stroke="#FFFFFF" strokeOpacity=".66" strokeWidth="2"/>
    <g strokeLinecap="round" strokeWidth="5.5">
     <path className="sq-ink-line sq-ink-line--one" d="M56 127q63-2 127 26" stroke="#68A59B"/>
     <path className="sq-ink-line sq-ink-line--two" d="M55 145q59 1 115 25" stroke="#7AA9B1"/>
     <path className="sq-ink-line sq-ink-line--three" d="M54 163q57 1 121 25" stroke="#D0AA6A"/>
     <path className="sq-ink-line sq-ink-line--four" d="M236 142q57-26 129-17" stroke="#497EA7"/>
     <path className="sq-ink-line sq-ink-line--five" d="M237 160q63-22 129-19" stroke="#AA91BC"/>
     <path className="sq-ink-line sq-ink-line--six" d="M240 178q58-20 113-18" stroke="#D0AA6A"/>
    </g>
    <path d="M37 212q83-10 170 23m6 0q90-33 174-23" stroke="#F9E9C5" strokeWidth="6" strokeLinecap="round"/>
   </g>
   <g className="sq-magnifier">
    <circle cx="307" cy="154" r="36" fill="#FFFFFF" fillOpacity=".20" stroke="#D5AC65" strokeWidth="8"/>
    <circle cx="307" cy="154" r="27" fill="#9CD0D5" fillOpacity=".16" stroke="#FFFFFF" strokeOpacity=".66" strokeWidth="1.5"/>
    <path d="m334 181 33 33" stroke="#B68043" strokeWidth="15" strokeLinecap="round"/>
    <path d="m334 181 33 33" stroke="#F0CD89" strokeWidth="9" strokeLinecap="round"/>
    <path d="m292 142 13-9" stroke="#FFF9EC" strokeWidth="4" strokeLinecap="round" strokeOpacity=".86"/>
   </g>
   <g className="sq-page-sparkle" stroke="#E6B96A" strokeWidth="2.5" strokeLinecap="round">
    <path d="M52 51v18m-9-9h18M371 46v16m-8-8h16M375 184v12m-6-6h12"/>
   </g>
  </svg>
 </div>;
}
