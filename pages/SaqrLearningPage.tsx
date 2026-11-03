import React,{useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {useLanguage} from '../App';
import {supabase} from '../src/utils/supabase';
import {getSaqrLearningAccess,type LearningFeatures} from '../src/utils/saqrLearningAccess';
const ReadingIcon=()=> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7" aria-hidden="true"><path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1zm0 0v14"/></svg>;
const features:({key:keyof LearningFeatures;ar:string;en:string;hintAr:string;hintEn:string})[]=[
{key:'read_together',ar:'اقرأ معي',en:'Read with me',hintAr:'قراءة قصيرة بخط واضح وأزرار كبيرة',hintEn:'Short reading in a clear layout'},
{key:'picture_guidance',ar:'تعلم بالصور',en:'Learn with pictures',hintAr:'تعليمات مصورة وخطوات سهلة',hintEn:'Visual instructions and simple steps'},
{key:'focus_steps',ar:'مهمة خطوة بخطوة',en:'Step by step',hintAr:'نشاط قصير في كل مرة',hintEn:'One short activity at a time'},
{key:'calm_display',ar:'عرض هادئ',en:'Calm view',hintAr:'واجهة بسيطة بدون مؤثرات مزعجة',hintEn:'A quiet distraction-free view'}];
export default function SaqrLearningPage(){
 const {locale,dir}=useLanguage();const ar=locale==='ar';
 const [status,setStatus]=useState<'loading'|'allowed'|'denied'|'error'>('loading');
 const [settings,setSettings]=useState<LearningFeatures|null>(null);
 const [viewer,setViewer]=useState<'admin'|'student'|null>(null);
 const [active,setActive]=useState<keyof LearningFeatures|null>(null);
 const [large,setLarge]=useState(false);
 useEffect(()=>{let mounted=true;getSaqrLearningAccess().then(v=>{if(!mounted)return;setSettings(v.features);setViewer(v.viewer);setStatus(v.allowed?'allowed':'denied')}).catch(()=>{if(mounted)setStatus('error')});return()=>{mounted=false}},[]);
 const current=features.find(x=>x.key===active);
 return <div dir={dir} className="min-h-[80dvh] bg-white dark:bg-black text-slate-900 dark:text-slate-100 px-4 py-8 md:py-12">
 <main className="mx-auto max-w-4xl space-y-6">
 <header className="saqr-learning-hero relative isolate overflow-hidden rounded-[2.3rem] border border-emerald-200 dark:border-emerald-900 bg-gradient-to-br from-emerald-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-950 dark:to-emerald-950/50 p-5 sm:p-9 shadow-[0_18px_45px_rgba(15,118,110,0.12)]">
 <div aria-hidden="true" className="saqr-learning-orb absolute top-4 end-6 h-28 w-28 sm:h-40 sm:w-40 rounded-full bg-emerald-300/25 blur-3xl pointer-events-none" />
 <div aria-hidden="true" className="saqr-learning-orb saqr-learning-orb-delayed absolute bottom-0 start-[30%] h-28 w-28 rounded-full bg-sky-300/25 blur-3xl pointer-events-none" />
 <div className="relative z-10 flex flex-col-reverse sm:flex-row items-center gap-3 sm:gap-8">
 <div className="flex-1 min-w-0 text-center sm:text-start space-y-2">
 <p className="text-xs sm:text-sm font-black tracking-wide text-emerald-700 dark:text-emerald-300">EFIPS Library</p>
 <h1 className="text-3xl sm:text-4xl md:text-5xl leading-[1.5] font-black text-emerald-900 dark:text-emerald-100">{ar?'صقر يساعدني':'Saqr Helps Me'}</h1>
 <p className="font-bold leading-8 text-slate-600 dark:text-slate-300 text-base sm:text-lg">{ar?'مساحة مريحة للتعلم والاكتشاف بطريقتك':'Your welcoming space to learn and explore'}</p>
 {status==='allowed'&&viewer==='admin'&&<p className="inline-flex items-center rounded-full border border-emerald-200 dark:border-emerald-800 bg-white/85 dark:bg-slate-800/85 px-4 py-2 text-xs font-black text-emerald-800 dark:text-emerald-200">{ar?'وضع معاينة الأدمن':'Admin preview mode'}</p>}
 </div>
 <div className="relative w-full max-w-[220px] sm:w-[38%] sm:max-w-[290px] shrink-0">
 <div aria-hidden="true" className="saqr-learning-aura absolute inset-[14%] rounded-full bg-gradient-to-br from-emerald-300/30 via-sky-300/20 to-amber-300/20 blur-2xl" />
 <span aria-hidden="true" className="saqr-learning-sparkle absolute start-[12%] top-[17%] h-3 w-3 rounded-full bg-amber-400/70" />
 <span aria-hidden="true" className="saqr-learning-sparkle saqr-learning-sparkle-late absolute end-[8%] top-[37%] h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
 <img src="/Saqr%20Hellping.png" alt={ar?'شخصية صقر ترحب بالطلاب وتساعدهم':'Saqr welcomes and helps students'} className="saqr-learning-mascot relative z-10 mx-auto w-full h-auto max-h-[245px] sm:max-h-[310px] object-contain drop-shadow-[0_14px_16px_rgba(13,96,70,0.18)]" decoding="async" />
 </div>
 </div>
 </header>
 {status==='loading'&&<p role="status" className="text-center font-bold py-12">{ar?'جارٍ التحقق من صلاحية حسابك...':'Checking your school access...'}</p>}
 {status==='error'&&<p role="alert" className="text-center font-bold py-12">{ar?'تعذر التحقق الآن. جرّب لاحقًا.':'Verification unavailable. Please try again later.'}</p>}
 {status==='denied'&&<div className="text-center font-bold py-12"><p>{ar?'هذه المساحة غير متاحة لهذا الحساب.':'This space is not available for this account.'}</p><Link className="inline-block mt-5 text-emerald-700 dark:text-emerald-300 underline" to="/home">{ar?'العودة للرئيسية':'Back to home'}</Link></div>}
 {status==='allowed'&&settings&&<>
 <div className="flex flex-wrap gap-3 items-center justify-between">
 <p className="font-black">{ar?'اختر نشاطك':'Choose an activity'}</p>
 <button type="button" aria-pressed={large} onClick={()=>setLarge(v=>!v)} className="rounded-xl px-4 py-3 border-2 border-emerald-400 font-black focus-visible:outline-4 focus-visible:outline-sky-400">{ar?'تكبير النص':'Larger text'}</button>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 saqr-learning-activity-grid">
 {features.filter(x=>settings[x.key]).map(x=><button key={x.key} type="button" onClick={()=>setActive(x.key)} aria-pressed={active===x.key}
 className={`flex items-center gap-4 text-start border-2 rounded-[1.5rem] bg-emerald-50 dark:bg-slate-900 p-5 min-h-28 focus-visible:outline-4 focus-visible:outline-sky-400 ${active===x.key?'border-emerald-600 shadow-lg':'border-emerald-200 dark:border-slate-700'}`}><span className="p-3 rounded-xl bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300"><ReadingIcon/></span><span><strong className="block text-lg sm:text-xl">{ar?x.ar:x.en}</strong><small className="block mt-1 text-slate-600 dark:text-slate-300">{ar?x.hintAr:x.hintEn}</small></span></button>)}
 </div>
 {current&&<section aria-live="polite" className="rounded-[1.5rem] border-2 border-emerald-200 dark:border-emerald-800 bg-slate-50 dark:bg-slate-900 p-5 sm:p-8 space-y-5">
 <h2 className="text-xl font-black">{ar?current.ar:current.en}</h2>
 {active==='read_together'?<><p className={`${large?'text-3xl':'text-xl'} leading-[2.2] font-bold`}>{ar?'في صباح جميل، فتح صقر كتابًا جديدًا. قرأ الصفحة الأولى، ثم اكتشف قصة رائعة.':'On a beautiful morning, Saqr opened a new book and discovered a wonderful story.'}</p><p className="text-sm text-slate-600 dark:text-slate-300">{ar?'القراءة الصوتية الطبيعية ستُضاف بعد اختبار الصوت والموافقة على الخدمة.':'Natural voice narration will be added after voice testing and approval.'}</p></>:
 active==='picture_guidance'?<div className="flex gap-3 flex-wrap">{[ar?'أنظر':'Look',ar?'أقرأ':'Read',ar?'أفهم':'Understand'].map((step,i)=><div key={i} className="border rounded-2xl p-5 bg-white dark:bg-slate-800 font-black text-lg">{i+1}. {step}</div>)}</div>:
 active==='focus_steps'?<div className="space-y-4"><p className={large?'text-2xl':'text-lg'}>{ar?'اختر كتابًا يعجبك، ثم اقرأ جملة واحدة.':'Choose a book you like, then read one sentence.'}</p><button type="button" className="rounded-xl bg-emerald-700 text-white px-6 py-3 font-black" onClick={e=>e.currentTarget.textContent=ar?'أحسنت!':'Well done!'}>{ar?'انتهيت':'Done'}</button></div>:
 <div className="rounded-xl border bg-white dark:bg-black p-6 text-center font-black">{ar?'يمكنك التعلم على راحتك دون مؤقت.':'Learn at your own pace, with no timer.'}</div>}
 </section>}
 </>}
 </main>
 <style>{`
 @keyframes saqr-learning-float {0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
 @keyframes saqr-learning-glow {0%,100%{opacity:.55;transform:scale(.97)}50%{opacity:.95;transform:scale(1.04)}}
 @keyframes saqr-learning-twinkle {0%,100%{opacity:.35;transform:scale(.8)}50%{opacity:1;transform:scale(1.25)}}
 .saqr-learning-mascot{animation:saqr-learning-float 5.5s ease-in-out infinite}
 .saqr-learning-aura,.saqr-learning-orb{animation:saqr-learning-glow 7s ease-in-out infinite}
 .saqr-learning-orb-delayed{animation-delay:-3s}
 .saqr-learning-sparkle{animation:saqr-learning-twinkle 3.5s ease-in-out infinite}
 .saqr-learning-sparkle-late{animation-delay:-1.7s}
 @media (prefers-reduced-motion:reduce){.saqr-learning-hero *{animation:none!important;transition:none!important}}
 @media (hover:none) and (pointer:coarse){.saqr-learning-orb{animation:none!important}}
 `}</style>
 </div>
}