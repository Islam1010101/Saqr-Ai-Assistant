import React from 'react';

export type HeritageQuestKind = 'passport' | 'language' | 'archive' | 'flag';

/**
 * Pure SVG artwork for the four Emirati heritage adventures.
 * No emojis, icon fonts, network requests or changes to reward logic.
 */
export const HeritageQuestArt: React.FC<{kind:HeritageQuestKind; className?:string}> = ({kind,className=''}) => {
  const shared = {viewBox:'0 0 360 205',className:'nh-quest-illustration '+className,fill:'none',role:'presentation' as const,'aria-hidden':true as const};
  if(kind==='passport') return <svg {...shared}>
    <ellipse cx="181" cy="184" rx="151" ry="13" fill="#002E26" opacity=".17"/>
    <g className="nh-art-wing">
      <path d="M30 54 82 27l58 18-4 133-65-16-41 12Z" fill="#0B5D49" stroke="#E8C78B" strokeWidth="4"/>
      <path d="M80 28v134M39 70l33-16M40 99l33-10M39 126l34-4" stroke="#BBD3A8" strokeWidth="3" opacity=".7"/>
      <circle cx="80" cy="101" r="17" stroke="#E8C78B" strokeWidth="3"/>
      <path d="m71 101 7 7 13-15" stroke="#E8C78B" strokeWidth="3" strokeLinecap="round"/>
    </g>
    <g className="nh-art-book">
      <path d="M111 29c53-15 104-15 148 0v146c-46-14-100-11-148 6Z" fill="#FFF2D8" stroke="#E2BC77" strokeWidth="5"/>
      <path d="M111 29V181M132 46c35-8 70-8 103-2" stroke="#0B7357" strokeWidth="4"/>
      <path d="M128 62h102M128 75h88" stroke="#CAA775" strokeWidth="3" strokeLinecap="round" opacity=".65"/>
      <g transform="translate(181 117)" className="nh-art-stamp">
        <circle r="38" stroke="#C24F43" strokeWidth="5" strokeDasharray="4 4"/>
        <circle r="28" stroke="#C24F43" strokeWidth="2.5"/>
        <path d="M-17 12V-8L0-21 17-8v20M-19 12H19M-6 12V0Q0-8 6 0v12" stroke="#C24F43" strokeWidth="3.4" strokeLinecap="round"/>
        <path d="M-18-23 0-29 18-23" stroke="#C24F43" strokeWidth="2"/>
      </g>
    </g>
    <g className="nh-art-stamps">
      <circle cx="287" cy="45" r="29" fill="#E4B565" stroke="#F9E9C6" strokeWidth="4"/>
      <path d="M274 52h26M287 32v25M274 43l13-10 13 10" stroke="#13513E" strokeWidth="3.5" strokeLinecap="round"/>
      <circle cx="302" cy="135" r="32" fill="#FDF1D9" stroke="#0E7B5B" strokeWidth="4" strokeDasharray="3 5"/>
      <path d="m287 137 10 10 18-23" stroke="#0E7B5B" strokeWidth="5" strokeLinecap="round"/>
    </g>
  </svg>;
  if(kind==='language') return <svg {...shared}>
    <ellipse cx="179" cy="184" rx="151" ry="15" fill="#5A351D" opacity=".20"/>
    <g className="nh-art-word word-1"><rect x="52" y="22" width="75" height="66" rx="11" fill="#F9ECD0" stroke="#C79A52" strokeWidth="4" transform="rotate(-12 52 22)"/><path d="m79 44 12-9 15 9-15 9Z" fill="#AD5645" opacity=".85"/></g>
    <g className="nh-art-word word-2"><rect x="149" y="7" width="74" height="70" rx="12" fill="#F9ECD0" stroke="#C79A52" strokeWidth="4" transform="rotate(7 149 7)"/><path d="M171 31h32M174 42h25M179 52h18" stroke="#AA7A45" strokeWidth="4" strokeLinecap="round"/></g>
    <g className="nh-art-word word-3"><rect x="242" y="27" width="76" height="62" rx="11" fill="#F9ECD0" stroke="#C79A52" strokeWidth="4" transform="rotate(13 242 27)"/><path d="M267 45l13-8 12 8-12 9Z" fill="#0D7454"/></g>
    <g className="nh-art-treasure">
      <path d="M58 109q0-40 42-46h157q43 6 45 46v19H58Z" fill="#BB743D" stroke="#F6D18C" strokeWidth="6"/>
      <path d="M75 112q0-25 30-30h146q29 5 31 30" stroke="#F7D698" strokeWidth="6"/>
      <path d="M58 119h244v56q-123 21-244 0Z" fill="#87542D" stroke="#E8BA72" strokeWidth="6"/>
      <path d="M58 135h244M111 86v82M246 86v82" stroke="#F3CC82" strokeWidth="9"/>
      <rect x="156" y="120" width="49" height="36" rx="7" fill="#F8D98C" stroke="#87542D" strokeWidth="4"/>
      <path d="M173 137h16M181 129v17" stroke="#87542D" strokeWidth="4"/>
      <path d="m78 164 14-9 14 9-14 8-14-8Zm187 0 14-9 14 9-14 8-14-8Z" fill="#C65C47"/>
      <path d="M58 181q122 18 244 0" stroke="#A16937" strokeWidth="5"/>
    </g>
    <g className="nh-art-sparkles" fill="#FFF1BC"><path d="m37 69 4 12 12 4-12 4-4 12-4-12-12-4 12-4Zm285-19 3 9 9 3-9 3-3 9-3-9-9-3 9-3Z"/></g>
  </svg>;
  if(kind==='archive') return <svg {...shared}>
    <ellipse cx="182" cy="185" rx="152" ry="14" fill="#0C3346" opacity=".18"/>
    <g className="nh-art-skyline" stroke="#6D9BB1" strokeWidth="3" fill="#3D7893" opacity=".64">
      <path d="M16 150V96h35v54M53 150V76h18v74M79 150V113h32v37M120 150V58h8V42h9V21h7V5l5 16v21h7v16h8v92"/>
      <path d="M173 150V104h45v46M178 104Q196 71 214 104M185 100V72h6v28m14 0V72h6v28"/>
      <path d="M228 150V67h74v83M237 150V76h56v74M313 150V85h32v65"/>
      <path d="M253 124q-35-31 0-60t36 0q16 34-20 52" fill="none" strokeWidth="7"/>
    </g>
    <g className="nh-art-paper" transform="rotate(-5 152 105)">
      <path d="M49 48h179l17 20v115H49Z" fill="#F9EACE" stroke="#D4AE74" strokeWidth="5"/>
      <path d="M228 48v20h17" stroke="#D4AE74" strokeWidth="3"/>
      <path d="M77 79h112M77 95h109M77 111h85M77 128h113M77 145h80" stroke="#9E917B" strokeWidth="5" strokeLinecap="round" opacity=".62"/>
      <rect x="157" y="139" width="63" height="24" rx="3" stroke="#B65743" strokeWidth="3" strokeDasharray="5 3"/>
    </g>
    <g className="nh-art-magnifier">
      <circle cx="207" cy="79" r="43" fill="#A3E3E8" fillOpacity=".3" stroke="#E6BD71" strokeWidth="11"/>
      <circle cx="207" cy="79" r="35" stroke="#215C70" strokeWidth="4"/>
      <path d="m239 111 50 55" stroke="#754C35" strokeWidth="19" strokeLinecap="round"/>
      <path d="m240 112 12 14" stroke="#F2D090" strokeWidth="10" strokeLinecap="round"/>
      <path d="m188 68 14-12" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity=".75"/>
    </g>
  </svg>;
  return <svg {...shared}>
    <ellipse cx="180" cy="184" rx="145" ry="14" fill="#043F36" opacity=".17"/>
    <g fill="#BBA98D" opacity=".54"><path d="M44 170V116h17v54M65 170V91h12v79M84 170V107h22v63M256 170V111h19v59M282 170V89h19v81M307 170V126h17v44"/></g>
    <path d="M181 170V50h8v120" fill="#E5D7B8" stroke="#8B795C" strokeWidth="3"/>
    <path className="nh-art-flag" d="M188 57q38-12 83 2v71q-44-13-83-2Z" fill="#fff" stroke="#EFE6D6" strokeWidth="3"/>
    <path className="nh-art-flag" d="M188 57q11-3 21-3v73q-11-2-21 1Z" fill="#D92742"/>
    <path className="nh-art-flag" d="M209 54q31-5 62 5v23q-31-7-62-5Z" fill="#009854"/>
    <path className="nh-art-flag" d="M209 103q31-2 62 5v22q-31-8-62-7Z" fill="#151A19"/>
    <path d="M176 172h18" stroke="#F3D79A" strokeWidth="9" strokeLinecap="round"/>
    <g className="nh-art-sparkles" fill="#E8C779"><path d="m86 35 7 17 17 7-17 7-7 17-7-17-17-7 17-7Zm201-15 5 12 12 5-12 5-5 12-5-12-12-5 12-5Z"/></g>
    <path d="M16 170q165-49 328 0v18H16Z" fill="#0D6A52"/>
  </svg>;
};

export default HeritageQuestArt;
