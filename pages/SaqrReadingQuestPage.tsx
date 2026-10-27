import React,{useMemo,useState} from 'react';
import {Link,Navigate} from 'react-router-dom';
import {useLanguage} from '../App';
import {getRoleReadingBooks,shuffleReading,type ReadingBook,type ReadingQuestion,type ReadingRole} from '../src/utils/saqrReadingQuestBank';
const Icon=({name}:{name:'book'|'arrow'|'check'|'compass'})=><svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{name==='book'?<path d="M12 5C9 3 5 3 2 5v14c4-1 7 0 10 2 3-2 6-3 10-2V5c-3-2-7-2-10 0Zm0 0v16"/>:name==='check'?<path d="m4 12 5 5L20 6"/>:name==='arrow'?<path d="M4 12h16m-7-7 7 7-7 7"/>:<><circle cx="12" cy="12" r="9"/><path d="m10 10 6-2-2 6-6 2 2-6Z"/></>}</svg>;
const compactName=(value:string)=>{const p=String(value||'').trim().split(/\s+/).filter(Boolean);return p.length>1?p[0]+' '+p[p.length-1]:p[0]||'';};
const optionsFor=(q:ReadingQuestion)=>{const v=[0,1,2];let s=[...q.id].reduce((n,c)=>(Math.imul(n,31)+c.charCodeAt(0))>>>0,181);for(let i=2;i>0;i--){s=(Math.imul(s,1664525)+1013904223)>>>0;const j=s%(i+1);[v[i],v[j]]=[v[j],v[i]];}return v;};
type Round={book:ReadingBook;questions:ReadingQuestion[];answers:Record<string,number>};
export default function SaqrReadingQuestPage(){
 const {locale,dir}=useLanguage();const ar=locale==='ar';
 const session=useMemo(()=>{try{const u=JSON.parse(localStorage.getItem('current_user')||'{}');return {role:localStorage.getItem('user_type')||'',ar:u.name_ar||u.name||'',en:u.name_en||u.name||''};}catch{return {role:'',ar:'',en:''};}},[]);
 const role:ReadingRole=session.role==='teacher'?'teacher':'student';
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
 const greet=ar?(role==='teacher'?'أستاذ':'الطالب'):(role==='teacher'?'Teacher':'Student');
 return <div dir={dir} className="min-h-[100dvh] bg-white dark:bg-black text-slate-900 dark:text-slate-100 px-4 py-5 sm:px-7 sm:py-9"><main className="mx-auto max-w-4xl">
  <nav className="flex items-center justify-between"><Link className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300" to={session.role==='student'?'/saqr-challenges':'/home'}>{ar?'العودة':'Back'}</Link><span className="text-xs font-black tracking-widest text-slate-500">EFIPS LIBRARY</span></nav>
  <header className="relative mt-5 overflow-hidden rounded-[2rem] border border-emerald-200 dark:border-emerald-800 bg-[#f5f9f5] dark:bg-[#101b19] p-5 sm:p-8 shadow-sm">
   <div className="relative z-10 max-w-[75%]"><p className="text-sm sm:text-base font-black text-emerald-800 dark:text-emerald-300">{ar?'مرحبًا':'Welcome'}, {greet} {compactName(ar?session.ar||session.en:session.en||session.ar)}</p><h1 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight">{ar?'بين السطور مع صقر':'Between the Lines with Saqr'}</h1><p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-semibold">{ar?'رحلة جديدة تبدأ بكتاب.':'Every journey begins with a book.'}</p></div>
   <img src="/saqr-avatar.png" alt={ar?'شخصية صقر':'Saqr'} className="absolute bottom-0 end-0 h-28 w-28 sm:h-44 sm:w-44 object-contain object-bottom" />
  </header>
  {!rounds?<section className="mt-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111] p-6 sm:p-10 shadow-lg text-center">
    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#116c59] text-white"><Icon name="book"/></span>
    <h2 className="mt-5 text-xl sm:text-2xl font-black">{ar?'كم كتابًا تريد في رحلتك؟':'How many books would you like?'}</h2>
    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{ar?'صقر سيختارها لك من كتب مكتبتنا.':'Saqr will select them from our library.'}</p>
    <div className="mt-7 mx-auto flex max-w-xs items-center justify-between gap-6 rounded-2xl border border-slate-200 dark:border-slate-700 p-2">
      <button aria-label={ar?'تقليل عدد الكتب':'Fewer books'} type="button" onClick={()=>setAmount(v=>Math.max(1,v-1))} className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-2xl font-black">−</button>
      <output className="text-3xl font-black tabular-nums">{amount}</output>
      <button aria-label={ar?'زيادة عدد الكتب':'More books'} type="button" onClick={()=>setAmount(v=>Math.min(books.length,v+1))} className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-2xl font-black">+</button>
    </div>
    <button type="button" disabled={!books.length} onClick={start} className="mt-7 flex w-full sm:w-auto sm:mx-auto min-h-14 items-center justify-center gap-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 px-10 font-black text-white disabled:opacity-50">{ar?'انطلق مع صقر':'Begin with Saqr'}<Icon name="arrow"/></button>
    {!books.length&&<p role="status" className="mt-3 text-sm text-rose-600">{ar?'لا توجد كتب متاحة لهذه الفئة واللغة الآن.':'No books available for this role and language yet.'}</p>}
  </section>:completed?<section className="mt-6 rounded-[2rem] border border-emerald-200 dark:border-emerald-800 bg-[#f4faf6] dark:bg-[#10231d] p-8 text-center">
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-700 text-white"><Icon name="check"/></div><h2 className="mt-5 text-3xl font-black">{ar?'أحسنت! اكتملت الرحلة':'Journey complete!'}</h2><p className="mt-4 text-2xl font-black tabular-nums">{correct} / {total}</p>
    <button type="button" onClick={()=>setRounds(null)} className="mt-6 rounded-xl bg-emerald-700 px-7 py-3 font-black text-white">{ar?'رحلة جديدة':'New journey'}</button>
  </section>:active&&q?<div className="mt-5 space-y-4">
    <section className="rounded-[1.75rem] border border-emerald-200 dark:border-emerald-800 bg-[#f5f9f5] dark:bg-[#0c1c17] p-5 sm:p-7 shadow-sm">
      <div className="flex items-center justify-between text-sm font-black text-emerald-800 dark:text-emerald-300"><span>{ar?'الكتاب':'Book'} {bookIndex+1}/{rounds.length}</span><span>{ar?'السؤال':'Question'} {questionIndex+1}/{active.questions.length}</span></div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-950"><div className="h-full rounded-full bg-emerald-600 transition-all" style={{width:((questionIndex+1)/active.questions.length*100)+'%'}}/></div>
      <h2 className="mt-4 text-xl sm:text-2xl font-black">{active.book.book.title}</h2><p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-semibold">{active.book.book.author}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3"><span className="rounded-full bg-white dark:bg-slate-800 border border-emerald-100 dark:border-emerald-900 px-4 py-2 text-sm font-black">{ar?'الرف':'Shelf'} {active.book.book.shelf} · {ar?'الصف':'Row'} {active.book.book.row}</span>
        {active.book.sourceUrl.includes('efipslibrary.com')?<Link to="/search" className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 underline underline-offset-4">{ar?'دليل المكتبة':'Library catalog'}</Link>:<a href={active.book.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 underline underline-offset-4">{ar?'مصدر المحتوى':'Book source'}</a>}</div>
    </section>
    <section className="rounded-[1.75rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] p-5 sm:p-8 shadow-md">
      <p className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-300">{ar?'اختبر فهمك':'Reading challenge'}</p><h3 className="mt-3 text-lg sm:text-xl font-black leading-9">{q.prompt}</h3>
      <div className="mt-6 grid gap-3">{optionsFor(q).map((original,i)=>{const isChosen=selected===original;return <button key={i} type="button" disabled={selected!==undefined} onClick={()=>answer(original)} className={'min-h-16 rounded-2xl border-2 px-5 py-4 text-start font-bold focus-visible:outline focus-visible:outline-4 focus-visible:outline-emerald-400 '+(isChosen?(selected===q.correct?'border-emerald-600 bg-emerald-50 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100':'border-rose-500 bg-rose-50 text-rose-950 dark:bg-rose-950 dark:text-rose-100'):'border-slate-200 dark:border-slate-700 hover:border-emerald-400')}>{q.answers[original]}</button>})}</div>
      {selected!==undefined&&<div role="status" className="mt-5 border-t border-slate-200 dark:border-slate-800 pt-4"><p className="font-black text-emerald-700 dark:text-emerald-300">{selected===q.correct?(ar?'إجابة صحيحة':'Correct'):(ar?'الإجابة غير صحيحة':'Incorrect')}</p><p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{q.reference}</p><button type="button" onClick={next} className="mt-5 rounded-xl bg-emerald-700 px-7 py-3 font-black text-white">{ar?'التالي':'Next'}</button></div>}
    </section></div>:null}
 </main></div>;
}
