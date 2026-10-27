import React,{useMemo,useState} from 'react';
import {Link,Navigate} from 'react-router-dom';
import {useLanguage} from '../App';
import {getRoleReadingBooks,shuffleReading,type ReadingBook,type ReadingQuestion,type ReadingRole} from '../src/utils/saqrReadingQuestBank';

const Icon=({kind}:{kind:'book'|'check'|'arrow'})=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6">{kind==='book'?<path d="M12 6c-3-2-7-2-10-1v14c4-1 7-1 10 2 3-3 6-3 10-2V5c-3-1-7-1-10 1Zm0 0v15"/>:kind==='check'?<path d="m4 12 5 5L20 6"/>:<path d="m5 12 14 0m-6-6 6 6-6 6"/>}</svg>;
const firstLast=(value:string)=>{const parts=String(value||'').trim().split(/\s+/).filter(Boolean);return parts.length>1?parts[0]+' '+parts[parts.length-1]:parts[0]||'';};
type Round={book:ReadingBook;questions:ReadingQuestion[];answers:Record<string,number>};
export default function SaqrReadingQuestPage(){
 const {locale,dir}=useLanguage();const ar=locale==='ar';
 const [session]=useState<{role:string;name:string}>(()=>{
  try {const user=JSON.parse(localStorage.getItem('current_user')||'{}');return {role:localStorage.getItem('user_type')||'',name:String((ar?user.name_ar:user.name_en)||user.name_ar||user.name_en||user.name||'')};}catch{return {role:'',name:''};}
 });
 const role:ReadingRole=session.role==='teacher'?'teacher':'student';
 const books=useMemo(()=>getRoleReadingBooks(role,ar?'ar':'en'),[role,ar]);
 const [count,setCount]=useState(1);
 const [rounds,setRounds]=useState<Round[]|null>(null);
 const [bookIndex,setBookIndex]=useState(0);const [questionIndex,setQuestionIndex]=useState(0);
 if(!['student','teacher'].includes(session.role))return <Navigate to="/home" replace/>;
 const start=()=>{const selected=shuffleReading(books).slice(0,count);if(!selected.length)return;setRounds(selected.map(book=>({book,questions:shuffleReading(book.questions).slice(0,Math.min(10,Math.max(5,book.questions.length))),answers:{}})));setBookIndex(0);setQuestionIndex(0);};
 const current=rounds?.[bookIndex],question=current?.questions[questionIndex];
 const answered=question?current?.answers[question.id]:undefined;
 const answer=(original:number)=>{if(!rounds||!current||!question||answered!==undefined)return;setRounds(prev=>prev?.map((r,i)=>i===bookIndex?{...r,answers:{...r.answers,[question.id]:original}}:r)||null);};
 const next=()=>{if(!current)return;if(questionIndex<current.questions.length-1){setQuestionIndex(i=>i+1);}else if(rounds&&bookIndex<rounds.length-1){setBookIndex(i=>i+1);setQuestionIndex(0);}else{setBookIndex(rounds?.length||0);}};
 const finished=Boolean(rounds&&bookIndex>=rounds.length);
 const score=rounds?.reduce((total,r)=>total+r.questions.filter(q=>r.answers[q.id]===q.correct).length,0)||0;
 const total=rounds?.reduce((total,r)=>total+r.questions.length,0)||0;
 return <div dir={dir} className="min-h-[100dvh] bg-white dark:bg-black text-slate-900 dark:text-white px-4 pb-20 pt-7 sm:px-8">
 <div className="mx-auto max-w-5xl">
  <div className="flex items-center justify-between gap-3"><Link to="/home" className="text-sm font-black text-emerald-700 dark:text-emerald-300">{ar?'الرئيسية':'Home'}</Link><span className="text-xs font-black tracking-wider text-emerald-700 dark:text-emerald-300">EFIPS LIBRARY</span></div>
  <header className="mt-6 flex flex-wrap items-center justify-between gap-5 rounded-[2rem] border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-5 sm:p-7">
   <div className="space-y-2"><p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{ar?(role==='teacher'?'الأستاذ':'الطالب'):(role==='teacher'?'Teacher':'Student')} {firstLast(session.name)}</p><h1 className="text-3xl font-black sm:text-4xl">{ar?'بين السطور مع صقر':'Between the Lines with Saqr'}</h1><p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{ar?'اختر كتبك، اقرأها ثم تحدَّ نفسك.':'Find your books, read, then challenge yourself.'}</p></div>
   <img src="/saqr-avatar.png" alt={ar?'شخصية صقر':'Saqr character'} className="h-28 w-28 object-contain sm:h-36 sm:w-36"/>
  </header>
  {!rounds?<section className="mt-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-sm">
   <div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-xl font-black">{ar?'رحلتك القرائية':'Your reading journey'}</h2><label className="text-sm font-bold">{ar?'عدد الكتب':'Books'} <select aria-label={ar?'عدد الكتب':'Number of books'} value={count} onChange={e=>setCount(Number(e.target.value))} className="ms-3 rounded-xl border border-emerald-400 bg-white dark:bg-slate-900 px-4 py-2">{books.map((_,i)=><option key={i} value={i+1}>{i+1}</option>)}</select></label></div>
   <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{books.map(({key,book,questions})=><article key={key} className="rounded-2xl border border-emerald-100 dark:border-emerald-900 bg-slate-50 dark:bg-slate-900 p-4"><div className="mb-3 text-emerald-700 dark:text-emerald-300"><Icon kind="book"/></div><h3 className="font-black leading-7">{book.title}</h3><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{book.author}</p><p className="mt-3 text-sm font-bold">{ar?'الرف':'Shelf'} {book.shelf} · {ar?'الصف':'Row'} {book.row}</p><p className="mt-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">{questions.length} {ar?'أسئلة موثّقة':'source-backed questions'}</p></article>)}</div>
   <p className="mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">{ar?'يختار صقر الكتب عشوائيًا من القائمة المناسبة لك.':'Saqr randomly selects suitable books from this list.'}</p>
   <button type="button" disabled={!books.length} onClick={start} className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-700 px-6 py-4 font-black text-white hover:bg-emerald-800 disabled:opacity-50 sm:w-auto">{ar?'ابدأ الرحلة':'Start journey'}<Icon kind="arrow"/></button>
  </section>:finished?<section className="mt-7 rounded-[2rem] border border-emerald-200 dark:border-emerald-800 p-8 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200"><Icon kind="check"/></span><h2 className="mt-4 text-2xl font-black">{ar?'أتممت الرحلة!':'Journey complete!'}</h2><p className="mt-3 text-xl font-black">{score} / {total}</p><button type="button" onClick={()=>setRounds(null)} className="mt-6 rounded-xl bg-emerald-700 px-6 py-3 font-black text-white">{ar?'رحلة جديدة':'New journey'}</button></section>:
  current&&question?<div className="mt-6 space-y-5">
   <section className="rounded-[1.75rem] border border-emerald-200 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/20 p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-black text-emerald-700 dark:text-emerald-300">{ar?'الكتاب':'Book'} {bookIndex+1}/{rounds.length}</p><p className="text-sm font-black">{ar?'السؤال':'Question'} {questionIndex+1}/{current.questions.length}</p></div><h2 className="mt-3 text-xl font-black">{current.book.book.title}</h2><p className="mt-1 text-sm">{current.book.book.author}</p><div className="mt-3 flex flex-wrap gap-3 text-sm font-bold"><span>{ar?'الرف':'Shelf'} {current.book.book.shelf}</span><span>{ar?'الصف':'Row'} {current.book.book.row}</span><a href={current.book.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-800 dark:text-emerald-300 underline underline-offset-4">{ar?'المصدر الموثق':'Verified source'}</a></div></section>
   <section className="rounded-[1.75rem] border border-slate-200 dark:border-slate-800 p-5 sm:p-8"><h3 className="text-xl font-black leading-9">{question.prompt}</h3><div className="mt-6 grid gap-3">{shuffleReading(question.answers,()=>0.43).map((choice,i)=>{const original=question.answers.indexOf(choice);const selected=answered===original;return <button type="button" key={i} disabled={answered!==undefined} onClick={()=>answer(original)} className={'min-h-16 rounded-xl border-2 p-4 text-start font-bold transition-colors focus-visible:outline focus-visible:outline-4 focus-visible:outline-emerald-400 '+(selected?(answered===question.correct?'border-emerald-500 bg-emerald-50 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100':'border-rose-400 bg-rose-50 text-rose-950 dark:bg-rose-950 dark:text-rose-100'):'border-slate-200 dark:border-slate-700 hover:border-emerald-400 disabled:opacity-80')}>{choice}</button>})}</div>
    {answered!==undefined&&<div role="status" className="mt-5 space-y-3"><p className="font-black text-emerald-700 dark:text-emerald-300">{answered===question.correct?(ar?'إجابة صحيحة':'Correct'):(ar?'إجابة غير صحيحة':'Incorrect')}</p><p className="text-xs text-slate-600 dark:text-slate-300">{ar?'موضع المعلومة':'Evidence'}: {question.reference}</p><button type="button" onClick={next} className="rounded-xl bg-emerald-700 px-6 py-3 font-black text-white">{ar?'التالي':'Next'}</button></div>}
   </section></div>:null}
 </div></div>;
}
