import React,{useMemo,useState} from 'react';
import {Link,Navigate} from 'react-router-dom';
import {useLanguage} from '../App';
import './saqrQuestVisual.css';
import './saqrReadingIntro.css';
import SaqrBookQuestArt from './SaqrBookQuestArt';
import {getRoleReadingBooks,shuffleReading,type ReadingBook,type ReadingQuestion,type ReadingRole} from '../src/utils/saqrReadingQuestBank';
const Icon=({name}:{name:'book'|'arrow'|'check'|'compass'})=><svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{name==='book'?<path d="M12 5C9 3 5 3 2 5v14c4-1 7 0 10 2 3-2 6-3 10-2V5c-3-2-7-2-10 0Zm0 0v16"/>:name==='check'?<path d="m4 12 5 5L20 6"/>:name==='arrow'?<path d="M4 12h16m-7-7 7 7-7 7"/>:<><circle cx="12" cy="12" r="9"/><path d="m10 10 6-2-2 6-6 2 2-6Z"/></>}</svg>;
const compactName=(value:string)=>{const p=String(value||'').trim().split(/\s+/).filter(Boolean);return p.length>1?p[0]+' '+p[p.length-1]:p[0]||'';};
const optionsFor=(q:ReadingQuestion)=>{const v=[0,1,2];let s=[...q.id].reduce((n,c)=>(Math.imul(n,31)+c.charCodeAt(0))>>>0,181);for(let i=2;i>0;i--){s=(Math.imul(s,1664525)+1013904223)>>>0;const j=s%(i+1);[v[i],v[j]]=[v[j],v[i]];}return v;};
type Round={book:ReadingBook;questions:ReadingQuestion[];answers:Record<string,number>};
export default function SaqrReadingQuestPage(){
 const {locale,dir}=useLanguage();const ar=locale==='ar';
 const session=useMemo(()=>{try{const u=JSON.parse(localStorage.getItem('current_user')||'{}');return {role:localStorage.getItem('user_type')||'',ar:u.name_ar||u.name||'',en:u.name_en||u.name||''};}catch{return {role:'',ar:'',en:''};}},[]);
 const role:ReadingRole=session.role==='student'?'student':'teacher';
 const books=useMemo(()=>getRoleReadingBooks(role,ar?'ar':'en'),[role,ar]);
 const [amount,setAmount]=useState(1);
 const [rounds,setRounds]=useState<Round[]|null>(null),[bookIndex,setBookIndex]=useState(0),[questionIndex,setQuestionIndex]=useState(0);
 if(!['student','teacher','admin'].includes(session.role))return <Navigate to="/home" replace/>;
 const start=()=>{const chosen=shuffleReading(books).slice(0,amount);if(!chosen.length)return;setRounds(chosen.map(book=>({book,questions:shuffleReading(book.questions).slice(0,Math.min(10,book.questions.length)),answers:{}})));setBookIndex(0);setQuestionIndex(0);};
 const active=rounds?.[bookIndex],q=active?.questions[questionIndex],selected=q?active?.answers[q.id]:undefined;
 const answer=(i:number)=>{if(!active||!q||selected!==undefined)return;setRounds(prev=>prev?.map((r,k)=>k===bookIndex?{...r,answers:{...r.answers,[q.id]:i}}:r)||null);};
 const next=()=>{if(!active)return;if(questionIndex+1<active.questions.length)setQuestionIndex(x=>x+1);else{setBookIndex(x=>x+1);setQuestionIndex(0);}};
 const completed=!!rounds&&bookIndex>=rounds.length;
 const correct=rounds?.reduce((n,r)=>n+r.questions.filter(q=>r.answers[q.id]===q.correct).length,0)||0;
 const total=rounds?.reduce((n,r)=>n+r.questions.length,0)||0;
 const greet=ar?(session.role==='admin'?'مدير النظام':role==='teacher'?'الأستاذ':'الطالب'):(session.role==='admin'?'Administrator':role==='teacher'?'Teacher':'Student');
 const handleIntroPointerMove=(event:React.PointerEvent<HTMLElement>)=>{
  if(event.pointerType!=='mouse')return;
  const rect=event.currentTarget.getBoundingClientRect();
  const x=Math.max(-1,Math.min(1,(event.clientX-rect.left-rect.width/2)/(rect.width/2)));
  const y=Math.max(-1,Math.min(1,(event.clientY-rect.top-rect.height/2)/(rect.height/2)));
  event.currentTarget.style.setProperty('--sq-parallax-x',(x*12).toFixed(1)+'px');
  event.currentTarget.style.setProperty('--sq-parallax-y',(y*9).toFixed(1)+'px');
 };
 const handleIntroPointerLeave=(event:React.PointerEvent<HTMLElement>)=>{
  event.currentTarget.style.setProperty('--sq-parallax-x','0px');
  event.currentTarget.style.setProperty('--sq-parallax-y','0px');
 };

 return <div dir={dir} className={"sq-page sq-reading sq-joyful"+(!rounds?" sq-reading-entry-mode":"")}><div className="sq-ambient" aria-hidden="true"/><main className="sq-shell" style={{maxWidth:1020}}>
  <nav className="sq-topnav"><Link className="sq-back" to={session.role==='student'?'/saqr-challenges':'/home'}>{ar?'العودة':'Back'}</Link><span className="sq-brand"><span className="sq-brand-mark" aria-hidden="true"/>EFIPS LIBRARY</span></nav>
  {!rounds ? (
   <header className="sq-hero sq-reading-entry-hero" onPointerMove={handleIntroPointerMove} onPointerLeave={handleIntroPointerLeave}>
    <span className="sq-streak" aria-hidden="true"/>
    <div className="sq-hero-text sq-reading-entry-copy">
     <span className="sq-eyebrow sq-reading-entry-eyebrow"><Icon name="book"/>{ar?'أسرار الكتب تنتظرك':'A BOOK OF ADVENTURES'}</span>
     <h1 className="sq-hero-title sq-reading-entry-title">{ar?'بين السطور مع صقر':'Between the Lines with Saqr'}</h1>
     <p className="sq-hero-sub sq-reading-entry-sub">{ar?'كل صفحة مغامرة، وكل سؤال اكتشاف!':'Every page is an adventure and every question a discovery!'}</p>
     <div className="sq-reading-entry-greeting">
      <span className="sq-reading-entry-greeting-icon" aria-hidden="true"><Icon name="check"/></span>
      <span className="sq-name-label">{ar?'مرحبًا':'Welcome'}, {greet}</span>
      <strong className="sq-name">{compactName(ar?session.ar||session.en:session.en||session.ar)|| (ar?'قارئنا المميز':'Reader')}</strong>
     </div>
    </div>
    <div className="sq-reading-entry-art">
     <span className="sq-reading-entry-glow" aria-hidden="true"/>
     <span className="sq-reading-entry-orbit" aria-hidden="true"/>
     <span className="sq-reading-entry-orbit sq-reading-entry-orbit--second" aria-hidden="true"/>
     <span className="sq-reading-entry-symbol sq-reading-entry-symbol--book" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5c-3-2-7-2-9-1v14c3-1 7-1 9 1 3-2 7-2 9-1V4c-3-1-7-1-9 1Zm0 0v14"/></svg>
     </span>
     <span className="sq-reading-entry-symbol sq-reading-entry-symbol--idea" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6m-5 3h4M8 15a7 7 0 1 1 8 0c-1 .7-1.5 1.4-1.5 3h-5C9.5 16.4 9 15.7 8 15zM12 2v2"/></svg>
     </span>
     <span className="sq-reading-entry-symbol sq-reading-entry-symbol--spark" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m12 2 2.7 7.3L22 12l-7.3 2.7L12 22l-2.7-7.3L2 12l7.3-2.7L12 2Z"/></svg>
     </span>
     <span className="sq-reading-entry-spark sq-reading-entry-spark--one" aria-hidden="true"/>
     <span className="sq-reading-entry-spark sq-reading-entry-spark--two" aria-hidden="true"/>
     <img className="sq-reading-entry-character" src="/Saqr%20Reading.png" alt={ar?'شخصية صقر في مغامرة القراءة':'Saqr reading challenge character'}/>
    </div>
   </header>
  ) : (
   <header className="sq-hero sq-reading-hero sq-reading-centered"><span className="sq-streak" aria-hidden="true"/><span className="sq-orbit-icon sq-orbit-one" aria-hidden="true"><Icon name="compass"/></span>
    <div className="sq-hero-text"><span className="sq-eyebrow"><Icon name="book"/>{ar?'أسرار الكتب تنتظرك':'A BOOK OF ADVENTURES'}</span><h1 className="sq-hero-title sq-reading-title">{ar?'بين السطور مع صقر':'Between the Lines with Saqr'}</h1><p className="sq-hero-sub">{ar?'كل صفحة مغامرة، وكل سؤال اكتشاف!':'Every page is an adventure and every question a discovery!'}</p><div className="sq-name-tag"><span className="sq-name-label">{ar?'مرحبًا':'Welcome'}, {greet}</span><strong className="sq-name">{compactName(ar?session.ar||session.en:session.en||session.ar)|| (ar?'قارئنا المميز':'Reader')}</strong></div></div>
    <SaqrBookQuestArt/>
   </header>
  )}
  {!rounds?<section className="sq-content sq-panel sq-stage sq-reading-entry-panel text-center"><div className="sq-panel-content">
   <div className="sq-reading-entry-panel-inner">
    <span className="sq-reading-entry-panel-icon"><Icon name="book"/></span>
    <h2 className="mt-5 text-xl sm:text-2xl font-black">{ar?'كم كتابًا تريد في رحلتك؟':'How many books would you like?'}</h2>
    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sq-reading-entry-panel-description">{ar?'صقر سيختارها لك من كتب مكتبتنا.':'Saqr will select them from our library.'}</p>
    <div className="sq-count">
     <button aria-label={ar?'تقليل عدد الكتب':'Fewer books'} type="button" onClick={()=>setAmount(v=>Math.max(1,v-1))} disabled={amount<=1} className="sq-count-btn">−</button>
     <output aria-live="polite">{amount}</output>
     <button aria-label={ar?'زيادة عدد الكتب':'More books'} type="button" onClick={()=>setAmount(v=>Math.min(books.length,v+1))} disabled={amount>=books.length} className="sq-count-btn">+</button>
    </div>
    <button type="button" disabled={!books.length} onClick={start} className="sq-primary mt-8 w-full sm:w-auto sq-reading-entry-cta">{ar?'انطلق مع صقر':'Begin with Saqr'}<Icon name="arrow"/></button>
    {!books.length&&<p role="status" className="mt-3 text-sm text-rose-600">{ar?'لا توجد كتب متاحة لهذه الفئة واللغة الآن.':'No books available for this role and language yet.'}</p>}
   </div>
  </div>
  </section>:completed?<section className="sq-content sq-panel sq-stage text-center"><div className="sq-panel-content">
    <div className="sq-finish-art"><Icon name="check"/></div><h2 className="mt-5 text-3xl font-black">{ar?'أحسنت! اكتملت الرحلة':'Journey complete!'}</h2><p className="mt-4 text-2xl font-black tabular-nums">{correct} / {total}</p>
    <button type="button" onClick={()=>setRounds(null)} className="sq-primary mt-6">{ar?'رحلة جديدة':'New journey'}</button></div>
  </section>:active&&q?<div className="sq-content space-y-5 sq-stage">
    <section className="sq-quiz-source" key={'book-'+bookIndex}>
      <div className="sq-quiz-progress"><span>{ar?'الكتاب':'Book'} {bookIndex+1}/{rounds.length}</span><span>{ar?'السؤال':'Question'} {questionIndex+1}/{active.questions.length}</span></div>
      <div className="sq-progress-rail"><div className="sq-progress-fill" style={{width:((questionIndex+1)/active.questions.length*100)+'%'}}/></div>
      <div className="sq-quiz-book-meta"><Icon name="book"/><div><strong>{active.book.book.title}</strong><p>{active.book.book.author}</p></div><span className="sq-quiz-location">{ar?'الرف':'Shelf'} {active.book.book.shelf} · {ar?'الصف':'Row'} {active.book.book.row}</span></div>
    </section>
    <section className="sq-panel sq-question-panel" key={q.id}><div className="sq-panel-content">
      <p className="sq-kicker">{ar?'اختبر فهمك':'Reading challenge'}</p><h3 className="sq-question-text">{q.prompt}</h3>
      <div className="mt-6 grid gap-3">{optionsFor(q).map((original,i)=>{const isChosen=selected===original;return <button key={i} type="button" disabled={selected!==undefined} onClick={()=>answer(original)} className={'sq-answer '+(isChosen?(selected===q.correct?'sq-answer--correct':'sq-answer--wrong'):'')}><span className="sq-choice-number">{i+1}</span><span>{q.answers[original]}</span></button>})}</div>
      {selected!==undefined&&<div role="status" className="mt-5 border-t border-slate-200 dark:border-slate-800 pt-4"><p className="font-black text-emerald-700 dark:text-emerald-300">{selected===q.correct?(ar?'إجابة صحيحة':'Correct'):(ar?'الإجابة غير صحيحة':'Incorrect')}</p><p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{q.reference}</p><button type="button" onClick={next} className="sq-primary mt-5">{ar?'التالي':'Next'}</button></div>}</div>
    </section></div>:null}
 </main></div>;
}
