import React from 'react';
import {Link,Navigate} from 'react-router-dom';
import {useLanguage} from '../App';
import './saqrQuestVisual.css';

const SvgIcon=({name,className='h-10 w-10'}:{name:'book'|'shelves'|'mic'|'stars'|'arrow'|'spark'|'compass';className?:string})=><svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 {name==='book'?<><path d="M24 11C18 7 12 7 6 9v29c7-2 13-1 18 3 5-4 11-5 18-3V9c-6-2-12-2-18 2Zm0 0v30"/><path d="m31 18 2 4 5 1-4 3 1 5-4-2-4 2 1-5-4-3 5-1 2-4Z"/></>:
 name==='shelves'?<><path d="M5 9h38v32H5zM14 9v32M27 9v32M6 33h37"/><path d="m17 27 3 3 4-6M33 15l4 10M32 28h7"/></>:
 name==='mic'?<><rect x="18" y="5" width="12" height="26" rx="6"/><path d="M11 22a13 13 0 0 0 26 0M24 35v8m-8 0h16"/><path d="M33 9l3-3m-2 10h6"/></>:
 name==='stars'?<><path d="m25 4 5.4 12 13.2 1.2-10 8.7 3 13-11.6-6.9L13.4 39l3-13-10-8.7L19.6 16z"/><path d="m5 6 2 3m31 33 3 2"/></>:
 name==='compass'?<><circle cx="24" cy="24" r="19"/><path d="m19 19 17-7-7 17-17 7 7-17Z"/></>:
 name==='spark'?<><path d="M24 3v9m0 24v9M3 24h9m24 0h9M9 9l6 6m18 18 6 6M39 9l-6 6M9 39l6-6"/><circle cx="24" cy="24" r="6"/></>:
 <><path d="M9 24h30m-12-12 12 12-12 12"/></>}
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
 e.currentTarget.style.setProperty('--sx',((e.clientX-rect.left)/rect.width*100).toFixed(1)+'%');
 e.currentTarget.style.setProperty('--sy',((e.clientY-rect.top)/rect.height*100).toFixed(1)+'%');
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
  {to:'/saqr-reading-quest',type:'teal',icon:'book' as const,kicker:ar?'مغامرة القراءة':'READING ADVENTURE',label:ar?'بين السطور مع صقر':'Between the Lines with Saqr',desc:ar?'كتاب جديد وأسئلة تحكي قصته.':'Discover a book through its characters and story.',number:'01'},
  {to:'/game',type:'amber',icon:'shelves' as const,kicker:ar?'مغامرة التصنيف':'LIBRARY QUEST',label:ar?'رتب المكتبة':'Organize the Library',desc:ar?'رتّب الكتب واكتشف أسرار الرفوف.':'Put books in their place and explore the shelves.',number:'02'},
  {to:'/saqr-studio',type:'indigo',icon:'mic' as const,kicker:ar?'مغامرة الإبداع':'CREATORS STUDIO',label:ar?'استديو صقر':'Saqr Studio',desc:ar?'صوتك يحكي، واستديو صقر يسمع.':'Record your story and let your voice shine.',number:'03'}
 ];
 return <div dir={dir} className="sq-page font-sans">
  <div aria-hidden="true" className="sq-ambient"/>
  <main className="sq-shell">
   <nav className="sq-topnav" aria-label={ar?'التنقل':'Navigation'}>
    <Link to="/home" className="sq-back"><SvgIcon name="arrow" className="h-4 w-4" />{ar?'العودة إلى الرئيسية':'Back to Home'}</Link>
    <span className="sq-brand"><span className="sq-brand-mark" aria-hidden="true"/> EFIPS LIBRARY</span>
   </nav>
   <header className="sq-hero" onPointerMove={moveGlow}>
    <span className="sq-streak" aria-hidden="true"/>
    <span className="sq-orbit-icon sq-orbit-one" aria-hidden="true"><SvgIcon name="stars" className="h-full w-full"/></span>
    <span className="sq-orbit-icon sq-orbit-two" aria-hidden="true"><SvgIcon name="compass" className="h-full w-full"/></span>
    <div className="sq-hero-text">
      <span className="sq-eyebrow"><SvgIcon name="spark" className="h-4 w-4"/>{ar?'مساحتك للمغامرة والإبداع':'DISCOVER · PLAY · CREATE'}</span>
      <h1 className="sq-hero-title">{ar?'تحديات صقر':'Saqr Challenges'}</h1>
      <p className="sq-hero-sub">{ar?'ثلاث مغامرات مختلفة. اختَر عالمك وابدأ اللعب.':'Three unique adventures. Pick your world and start exploring.'}</p>
      {name&&<div className="sq-name-tag"><span className="sq-name-label">{ar?'أهلًا بك يا':'Welcome,'}</span><strong className="sq-name">{name}</strong></div>}
    </div>
    <div className="sq-mascot-wrap"><img src="/saqr-full.png" alt={ar?'شخصية صقر':'Saqr mascot'} className="sq-mascot" /></div>
   </header>
   <section className="sq-content" aria-labelledby="sq-hub-heading">
    <div className="sq-section-head">
     <h2 id="sq-hub-heading">{ar?'اختر مغامرتك':'Choose your adventure'}</h2>
     <span className="sq-micro">{ar?'ثلاث تجارب · عالم واحد من الإبداع':'THREE EXPERIENCES · ONE WORLD'}</span>
    </div>
    <div className="sq-cards">
     {items.map(item=><Link
       key={item.to} to={item.to} onPointerMove={tiltCard} onPointerLeave={resetTilt} onPointerCancel={resetTilt}
       className={'sq-card sq-card--'+item.type} aria-label={item.label}>
       <div className="flex items-center justify-between gap-3"><span className="sq-card-icon"><SvgIcon name={item.icon}/></span><span className="text-lg font-black opacity-35 tabular-nums">{item.number}</span></div>
       <div><p className="mt-4 text-[11px] font-black tracking-wide opacity-65">{item.kicker}</p>
        <h3 className="sq-card-title">{item.label}</h3>
        <p className="sq-card-text">{item.desc}</p></div>
       <div className="sq-card-arrow"><span>{ar?'ابدأ التحدي':'ENTER CHALLENGE'}</span><SvgIcon name="arrow" className="h-5 w-5"/></div>
      </Link>)}
    </div>
    <p className="mt-6 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">{ar?'مكتبة صقر الإمارات الدولية الخاصة · اكتشف، تعلم، وأبدع':'EFIPS Library · Discover, learn, create'}</p>
   </section>
  </main>
 </div>;
}
