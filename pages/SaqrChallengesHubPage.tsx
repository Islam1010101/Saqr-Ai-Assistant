import React from 'react';
import {Link,Navigate} from 'react-router-dom';
import {useLanguage} from '../App';
import './saqrQuestVisual.css';
import './saqrChallengesHub.css';

const SvgIcon=({name,className='h-10 w-10'}:{name:'book'|'shelves'|'mic'|'stars'|'arrow'|'spark'|'compass';className?:string})=><svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 {name==='book'?<><path d="M24 11C18 7 12 7 6 9v29c7-2 13-1 18 3 5-4 11-5 18-3V9c-6-2-12-2-18 2Zm0 0v30"/><path d="m31 18 2 4 5 1-4 3 1 5-4-2-4 2 1-5-4-3 5-1 2-4Z"/></>:
 name==='shelves'?<><path d="M5 9h38v32H5zM14 9v32M27 9v32M6 33h37"/><path d="m17 27 3 3 4-6M33 15l4 10M32 28h7"/></>:
 name==='mic'?<><rect x="18" y="5" width="12" height="26" rx="6"/><path d="M11 22a13 13 0 0 0 26 0M24 35v8m-8 0h16"/><path d="M33 9l3-3m-2 10h6"/></>:
 name==='stars'?<><path d="m25 4 5.4 12 13.2 1.2-10 8.7 3 13-11.6-6.9L13.4 39l3-13-10-8.7L19.6 16z"/><path d="m5 6 2 3m31 33 3 2"/></>:
 name==='compass'?<><circle cx="24" cy="24" r="19"/><path d="m19 19 17-7-7 17-17 7 7-17Z"/></>:
 name==='spark'?<><path d="M24 3v9m0 24v9M3 24h9m24 0h9M9 9l6 6m18 18 6 6M39 9l-6 6M9 39l6-6"/><circle cx="24" cy="24" r="6"/></>:
 name==='arrow'?<><path d="M9 24h30m-12-12 12 12-12 12"/></>:null}
 </svg>;

const shortName=(value:string)=>{
 const words=String(value||'').trim().split(/\s+/).filter(Boolean);
 return words.length>1?words[0]+' '+words[words.length-1]:words[0]||'';
};

const tiltCard=(e:React.PointerEvent<HTMLAnchorElement>)=>{
 if(e.pointerType!=='mouse')return;
 const el=e.currentTarget,rect=el.getBoundingClientRect();
 const x=(e.clientX-rect.left)/rect.width-.5,y=(e.clientY-rect.top)/rect.height-.5;
 el.style.setProperty('--sq-tilt-x',(y*-5).toFixed(2)+'deg');
 el.style.setProperty('--sq-tilt-y',(x*5).toFixed(2)+'deg');
 el.style.setProperty('--sq-pointer-x',((x+.5)*100).toFixed(1)+'%');
 el.style.setProperty('--sq-pointer-y',((y+.5)*100).toFixed(1)+'%');
};
const resetTilt=(e:React.PointerEvent<HTMLAnchorElement>)=>{
 e.currentTarget.style.setProperty('--sq-tilt-x','0deg');
 e.currentTarget.style.setProperty('--sq-tilt-y','0deg');
};
const moveGlow=(e:React.PointerEvent<HTMLElement>)=>{
 if(e.pointerType!=='mouse')return;
 const rect=e.currentTarget.getBoundingClientRect();
 const x=(e.clientX-rect.left)/rect.width, y=(e.clientY-rect.top)/rect.height;
 e.currentTarget.style.setProperty('--sx',(x*100).toFixed(1)+'%');
 e.currentTarget.style.setProperty('--sy',(y*100).toFixed(1)+'%');
 e.currentTarget.style.setProperty('--hub-shift-x',((x-.5)*16).toFixed(1)+'px');
 e.currentTarget.style.setProperty('--hub-shift-y',((y-.5)*12).toFixed(1)+'px');
};

export default function SaqrChallengesHubPage(){
 const {locale,dir}=useLanguage();
 const ar=locale==='ar';
 let role='',name='';
 try{
  role=localStorage.getItem('user_type')||'';
  const account=JSON.parse(localStorage.getItem('current_user')||'{}');
  name=shortName(String((ar?account.name_ar:account.name_en)||account.name_ar||account.name_en||account.name||''));
 }catch{/* Existing site session guard handles restricted storage. */}
 if(role!=='student'&&role!=='admin')return <Navigate to="/home" replace/>;
 const items=[
  {to:'/saqr-reading-quest',type:'purple',icon:'book' as const,kicker:ar?'مغامرة القراءة':'READING ADVENTURE',label:ar?'بين السطور مع صقر':'Between the Lines with Saqr',desc:ar?'كتاب جديد وأسئلة تحكي قصته.':'Discover a book through its characters and story.',number:'01'},
  {to:'/game',type:'green',icon:'shelves' as const,kicker:ar?'مغامرة التصنيف':'LIBRARY QUEST',label:ar?'رتب المكتبة':'Organize the Library',desc:ar?'رتّب الكتب واكتشف أسرار الرفوف.':'Put books in their place and explore the shelves.',number:'02'},
  {to:'/saqr-studio',type:'red',icon:'mic' as const,kicker:ar?'مغامرة الإبداع':'CREATORS STUDIO',label:ar?'استديو صقر':'Saqr Studio',desc:ar?'صوتك يحكي، واستديو صقر يسمع.':'Record your story and let your voice shine.',number:'03'}
 ];
 return <div dir={dir} className="sq-page sq-challenges sq-joyful sq-hub-v2 font-sans">
  <div className="sq-ambient" aria-hidden="true"/>
  <main className="sq-shell sq-hub-shell">
   <nav className="sq-topnav sq-hub-nav" aria-label={ar?'التنقل':'Navigation'}>
    <Link to="/home" className="sq-back sq-hub-back">
     <span className="sq-hub-back-symbol"><SvgIcon name="arrow" className="h-4 w-4"/></span>
     <span>{ar?'العودة للرئيسية':'Back to home'}</span>
    </Link>
    <div className="sq-hub-brand" dir="ltr"><span className="sq-hub-brand-shape" aria-hidden="true"><SvgIcon name="stars" className="h-4 w-4"/></span><span>EFIPS <strong>LIBRARY</strong></span></div>
   </nav>
   <header className="sq-hero sq-hub-hero" onPointerMove={moveGlow}>
    <div className="sq-hub-hero-grain" aria-hidden="true"/>
    <span className="sq-hub-hero-glint sq-hub-glint-a" aria-hidden="true"/>
    <span className="sq-hub-hero-glint sq-hub-glint-b" aria-hidden="true"/>
    <div className="sq-hero-text sq-hub-hero-copy">
     <span className="sq-eyebrow sq-hub-eyebrow"><SvgIcon name="spark" className="w-4 h-4"/>{ar?'رحلتك مع صقر تبدأ هنا':'YOUR SAQR ADVENTURE STARTS HERE'}</span>
     <h1 className="sq-hero-title sq-hub-heading">{ar?'تحديات':'Saqr'} <span>{ar?'صقر':'Challenges'}</span></h1>
     <p className="sq-hero-sub sq-hub-lead">{ar?'ثلاث مغامرات، عوالم من المعرفة والإبداع. اختر التحدي الذي يعجبك وابدأ رحلتك!':'Three adventures filled with knowledge and creativity. Choose your path and let the fun begin.'}</p>
     {name&&<div className="sq-hub-greeting"><span className="sq-hub-greeting-spark" aria-hidden="true"><SvgIcon name="stars" className="w-5 h-5"/></span><span>{ar?'أهلًا بك يا':'Welcome,'}</span><strong dir="auto">{name}</strong></div>}
     <div className="sq-hub-hero-facts" aria-label={ar?'عدد التحديات':'Number of challenges'}>
      <span className="sq-hub-fact-count">03</span>
      <span>{ar?'تحديات ممتعة':'CREATIVE CHALLENGES'}</span>
      <span className="sq-hub-fact-mark" aria-hidden="true"/>
      <span>{ar?'ابدأ • استكشف • أبدع':'PLAY • EXPLORE • CREATE'}</span>
     </div>
    </div>
    <div className="sq-hub-art" aria-hidden="true">
     <span className="sq-hub-art-halo"/>
     <span className="sq-hub-art-ring sq-hub-art-ring-one"/>
     <span className="sq-hub-art-ring sq-hub-art-ring-two"/>
     <span className="sq-hub-floating-icon sq-hub-float-book"><SvgIcon name="book" className="w-7 h-7"/></span>
     <span className="sq-hub-floating-icon sq-hub-float-compass"><SvgIcon name="compass" className="w-7 h-7"/></span>
     <span className="sq-hub-floating-icon sq-hub-float-spark"><SvgIcon name="spark" className="w-6 h-6"/></span>
     <img className="sq-hub-character" src="/Saqr%20Challenges.png" alt=""/>
     <span className="sq-hub-character-platform"/>
    </div>
   </header>
   <section className="sq-content sq-hub-content" aria-labelledby="sq-hub-heading">
    <div className="sq-section-head sq-hub-section-title">
     <div className="sq-hub-heading-wrap">
      <div className="sq-hub-small-label"><span className="sq-hub-small-dot"/>{ar?'اختر ما تحب':'PICK YOUR PATH'}</div>
      <h2 id="sq-hub-heading">{ar?'اختر مغامرتك':'Choose your adventure'}</h2>
      <p>{ar?'كل تحدٍّ له تجربة مختلفة… والمغامرة تبدأ بضغطة واحدة.':'Every challenge opens a different world. Pick one to begin.'}</p>
     </div>
     <span className="sq-hub-counter" dir="ltr"><b>03</b><span>{ar?'مغامرات':'ADVENTURES'}</span></span>
    </div>
    <div className="sq-cards sq-hub-cards">
     {items.map((item,index)=><Link
       key={item.to}
       to={item.to}
       onPointerMove={tiltCard}
       onPointerLeave={resetTilt}
       onPointerCancel={resetTilt}
       className={'sq-card sq-hub-card sq-card--'+item.type}
       aria-label={(ar?'ابدأ تحدي ':'Start challenge: ')+item.label}
       style={{animationDelay:(index*110)+'ms'}}>
       <div className="sq-hub-card-decoration" aria-hidden="true"/>
       <div className="sq-hub-card-head">
        <span className="sq-card-icon sq-hub-card-icon"><SvgIcon name={item.icon} className="w-10 h-10"/></span>
        <span className="sq-hub-card-number" dir="ltr">{item.number}</span>
       </div>
       <div className="sq-hub-card-body">
        <span className="sq-hub-card-kicker">{item.kicker}</span>
        <h3 className="sq-card-title sq-hub-card-title">{item.label}</h3>
        <p className="sq-card-text sq-hub-card-description">{item.desc}</p>
       </div>
       <span className="sq-hub-card-cta">
        <span>{ar?'ابدأ التحدي':'START CHALLENGE'}</span>
        <span className="sq-hub-card-arrow"><SvgIcon name="arrow" className="w-5 h-5"/></span>
       </span>
      </Link>)}
    </div>
    <div className="sq-hub-bottom" aria-hidden="true"><span className="sq-hub-bottom-line"/><SvgIcon name="stars" className="w-5 h-5"/><span>{ar?'اكتشف · تعلّم · أبدع':'DISCOVER · LEARN · CREATE'}</span><span className="sq-hub-bottom-line"/></div>
   </section>
  </main>
 </div>;
}
