import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bilingual, HeritageInvestigation, heritageInvestigations } from '../src/data/heritageInvestigations';
import { getGuidedHeritageBook } from '../src/utils/heritageBookGuides';

type Props = {
  language: 'ar' | 'en';
  completedIds: string[];
  onComplete: (caseId: string) => void;
  onBack: () => void;
};
type Verdict = HeritageInvestigation['verdict'];
const verdicts: Array<{ id: Verdict; text: Bilingual }> = [
  {id:'supported',text:{ar:'الادعاء مدعوم بالأدلة',en:'Claim supported by evidence'}},
  {id:'misleading',text:{ar:'الادعاء مضلل أو ناقص',en:'Claim misleading or incomplete'}},
  {id:'false',text:{ar:'الادعاء خاطئ',en:'Claim false'}}
];
const move = <T,>(items:T[], from:number, to:number) => {
  if(to<0||to>=items.length)return items;
  const result=[...items];
  result.splice(to,0,...result.splice(from,1));
  return result;
};

/** A self-contained evidence board: no AI grading, automatic answer reveals, or invented archival scans. */
const HeritageDetectiveGame: React.FC<Props> = ({language,completedIds,onComplete,onBack}) => {
  const [index,setIndex] = useState(0);
  const [expanded,setExpanded] = useState<string | null>(null);
  const [inspected,setInspected] = useState<string[]>([]);
  const [proof,setProof] = useState<string[]>([]);
  const [rejected,setRejected] = useState<string | null>(null);
  const [verdict,setVerdict] = useState<Verdict | null>(null);
  const [reason,setReason] = useState('');
  const [solved,setSolved] = useState(false);
  const [issues,setIssues] = useState<string[]>([]);
  const caseFile=heritageInvestigations[index];
  const libraryBook=useMemo(()=>getGuidedHeritageBook(caseFile.id,caseFile.level),[caseFile.id,caseFile.level]);
  const t=(value:Bilingual)=>value[language];
  const chronological=useMemo(
    ()=>caseFile.timeline ? [...caseFile.timeline].reverse() : [],
    [caseFile.id]
  );
  const [ordered,setOrdered]=useState<string[]>(()=>chronological.map(entry=>entry.id));

  const selectCase=(next:number)=>{
    if(next<0||next>=heritageInvestigations.length)return;
    const target=heritageInvestigations[next];
    setIndex(next);
    setExpanded(null);
    setInspected([]);
    setProof([]);
    setRejected(null);
    setVerdict(null);
    setReason('');
    setSolved(false);
    setIssues([]);
    setOrdered(target.timeline ? [...target.timeline].reverse().map(entry=>entry.id) : []);
  };
  const inspect=(id:string)=>{
    setExpanded(current=>current===id?null:id);
    setInspected(current=>current.includes(id)?current:[...current,id]);
    setIssues([]);
  };
  const toggleProof=(id:string)=>{
    setProof(current=>current.includes(id)?current.filter(value=>value!==id):current.length<2?[...current,id]:current);
    setRejected(current=>current===id?null:current);
    setIssues([]);
  };
  const markUnreliable=(id:string)=>{
    setRejected(current=>current===id?null:id);
    setProof(current=>current.filter(value=>value!==id));
    setIssues([]);
  };
  const verify=()=>{
    const errors:string[]=[];
    if(inspected.length<caseFile.evidence.length)errors.push(t({ar:'افحص بطاقات الأدلة الثلاث أولًا، حتى لا تعتمد على أول معلومة. ',en:'Inspect all three evidence cards before deciding.'}));
    if(proof.length!==2||caseFile.evidence.filter(item=>proof.includes(item.id)&&item.official).length!==2)
      errors.push(t({ar:'اختر وثيقتين موثوقتين تؤيدان استنتاجك.',en:'Select two dependable documents supporting your finding.'}));
    if(!rejected||caseFile.evidence.find(item=>item.id===rejected)?.official!==false)
      errors.push(t({ar:'حدد الادعاء التدريبي غير الموثق واستبعده.',en:'Identify and reject the unattributed practice claim.'}));
    if(verdict!==caseFile.verdict)
      errors.push(t({ar:'حكمك لا يطابق الأدلة. قارن العبارات بالتواريخ والتفاصيل ثم أعد التقييم.',en:'Your finding conflicts with the evidence. Compare dates and details, then reassess.'}));
    if(caseFile.timeline && ordered.some((id,position)=>caseFile.timeline?.find(item=>item.id===id)?.order!==position))
      errors.push(t({ar:'التسلسل الزمني غير صحيح؛ راجع تاريخ كل حدث في الوثائق.',en:'The chronology is incorrect. Recheck every event date in the sources.'}));
    if(reason.trim().length<25)
      errors.push(t({ar:'اكتب استنتاجك بنفسك في 25 حرفًا على الأقل، مستندًا إلى الأدلة.',en:'Write at least 25 characters explaining the finding using evidence.'}));
    setIssues(errors);
    if(errors.length)return;
    setSolved(true);
    onComplete(caseFile.id);
  };
  const officialCount=caseFile.evidence.filter(item=>proof.includes(item.id)&&item.official).length;
  return <section className="mx-auto max-w-5xl space-y-5" aria-label={t({ar:'مكتب تحقيق ذاكرة وطن',en:'National Memory Investigation Bureau'})}>
    <div className="relative overflow-hidden rounded-[1.8rem] border border-sky-800/40 bg-gradient-to-br from-[#112b3b] via-[#174657] to-[#166049] p-5 sm:p-8 text-white shadow-xl">
      <div className="absolute inset-x-0 top-0 flex h-1.5" aria-hidden="true"><span className="w-1/4 bg-red-500"/><span className="w-1/4 bg-green-500"/><span className="w-1/4 bg-white"/><span className="w-1/4 bg-slate-950"/></div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button type="button" onClick={onBack} className="rounded-xl bg-white/15 px-4 py-2 text-sm font-black hover:bg-white/25">{t({ar:'العودة للتحديات',en:'Back to challenges'})}</button>
        <span className="text-xs font-black tracking-wide text-sky-100">{t({ar:'مكتب التحقيق التاريخي · EFIPS',en:'HISTORICAL INVESTIGATION BUREAU · EFIPS'})}</span>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
          <svg className="h-9 w-9" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="20" cy="20" r="12"/><path d="m29 29 12 12M15 20h10M20 15v10"/></svg>
        </div>
        <div><h2 className="text-2xl sm:text-3xl font-black">{t({ar:'محقق ذاكرة وطن',en:'National Memory Detective'})}</h2>
          <p className="mt-2 text-sm leading-7 text-sky-50">{t({ar:'تحقيقات تاريخية حقيقية في وقائع موثقة: افحص، قارن، استبعد، واستنتج. لا توجد إجابة تنجح بمجرد التخمين.',en:'Real historical investigations: inspect sources, compare accounts, discard weak claims and build a supported finding.'})}</p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3 text-xs font-black">
        <span className="rounded-full bg-white/15 px-4 py-2">{t({ar:'ملفات محلولة',en:'Cases resolved'})}: {heritageInvestigations.filter(item=>completedIds.includes(item.id)).length} / {heritageInvestigations.length}</span>
        <span className="rounded-full bg-white/15 px-4 py-2">{t({ar:'وثائق رسمية وروابط أصلية',en:'Official source records & links'})}</span>
        <span className="rounded-full bg-white/15 px-4 py-2">{t({ar:'بدون توقيت قسري',en:'No forced timer'})}</span>
      </div>
    </div>

    <nav aria-label={t({ar:'ملفات القضايا',en:'Case files'})} className="flex gap-2 overflow-x-auto pb-2">
      {heritageInvestigations.map((file,position)=><button type="button" key={file.id} onClick={()=>selectCase(position)}
        aria-current={index===position?'step':undefined}
        aria-label={t(file.title)}
        className={'min-w-11 shrink-0 rounded-xl border-2 px-4 py-3 text-sm font-black transition-colors '+(index===position?'border-sky-600 bg-sky-700 text-white':completedIds.includes(file.id)?'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100':'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100')}>
        {String(position+1).padStart(2,'0')}{completedIds.includes(file.id)?' ✓':''}
      </button>)}
    </nav>

    <article className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-950 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-black uppercase tracking-widest text-sky-700 dark:text-sky-300">{t({ar:'ملف تحقيق',en:'CASE FILE'})} {index+1}/{heritageInvestigations.length}</span><span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-black text-amber-900 dark:bg-amber-950 dark:text-amber-200">{t({ar:'مستوى',en:'Level'})} {caseFile.level}</span></div>
      <h3 className="mt-3 text-xl sm:text-2xl font-black">{t(caseFile.title)}</h3>
      <p className="mt-3 text-sm leading-8 text-slate-700 dark:text-slate-300">{t(caseFile.briefing)}</p>
      <div className="mt-5 rounded-xl border-s-4 border-rose-500 bg-rose-50 p-4 dark:bg-rose-950/25">
        <p className="text-xs font-black uppercase text-rose-800 dark:text-rose-300">{t({ar:'البلاغ المطلوب التحقق منه — ليس حقيقة مثبتة',en:'CLAIM TO INVESTIGATE — NOT VERIFIED FACT'})}</p>
        <p className="mt-2 text-base font-black leading-8 text-rose-950 dark:text-rose-100">{t(caseFile.allegation)}</p>
      </div>
    </article>

    <section className="space-y-3" aria-label={t({ar:'مستندات الأدلة',en:'Evidence documents'})}>
      <div className="flex flex-wrap items-baseline justify-between gap-3"><h3 className="text-xl font-black">{t({ar:'1. افتح ملف الأدلة وافحص مصدر كل وثيقة',en:'1. Inspect the evidence and its provenance'})}</h3><span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t({ar:'تم فحص',en:'Inspected'})} {inspected.length}/3</span></div>
      <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{t({ar:'البطاقات ملخصات تعليمية مستندة إلى روابط محددة، وليست صورًا لوثائق أرشيفية. إحدى البطاقات ادعاء تدريبي مختلق وغير موثق؛ دورك اكتشافه.',en:'Cards are educational summaries with traceable sources, not scans of archival documents. One card is a clearly fictional, unattributed practice claim; identify it.'})}</p>
      <div className="grid gap-3 md:grid-cols-3">
        {caseFile.evidence.map((item,position)=><div key={item.id} className={'min-w-0 rounded-2xl border-2 p-4 shadow-sm transition-colors '+(expanded===item.id?'border-sky-500 bg-sky-50 dark:border-sky-700 dark:bg-sky-950/40':'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950')}>
          <button type="button" onClick={()=>inspect(item.id)} aria-expanded={expanded===item.id} className="w-full text-start focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-400">
            <span className="text-xs font-black tracking-wider text-sky-700 dark:text-sky-300">{t({ar:'مستند',en:'DOCUMENT'})} {String(position+1).padStart(2,'0')}</span>
            <strong className="mt-2 block min-h-12 text-base font-black">{t(item.title)}</strong>
            <span className="mt-2 block text-xs leading-6 text-slate-600 dark:text-slate-300">{t({ar:'الجهة المذكورة',en:'Attributed to'})}: {t(item.publisher)}</span>
            <span className="mt-3 block font-black text-sky-700 dark:text-sky-300">{expanded===item.id?t({ar:'طيّ المستند',en:'Close file'}):t({ar:'فحص المستند',en:'Inspect file'})}</span>
          </button>
          {expanded===item.id && <div className="mt-4 space-y-3 border-t border-slate-200 pt-4 dark:border-slate-700">
            <p className="text-sm leading-8">{t(item.summary)}</p>
            {item.url?<a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-xl border border-sky-300 bg-white px-3 py-2 text-xs font-black text-sky-800 underline underline-offset-4 dark:bg-slate-900 dark:text-sky-200">{t({ar:'مراجعة السجل الرسمي الأصلي',en:'Check original official record'})}</a>:
              <p className="text-xs font-black text-rose-700 dark:text-rose-300">{t({ar:'لا توجد جهة نشر أو وثيقة أصلية لهذا الادعاء التدريبي.',en:'No publisher or original record exists for this practice claim.'})}</p>}
            <div className="grid gap-2">
              <button type="button" disabled={solved} onClick={()=>toggleProof(item.id)} aria-pressed={proof.includes(item.id)} className={'rounded-xl px-3 py-2.5 text-xs font-black '+(proof.includes(item.id)?'bg-emerald-700 text-white':'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200')}>{proof.includes(item.id)?t({ar:'أُضيف إلى ملف الإثبات',en:'Added to proof file'}):t({ar:'اعتماد ضمن دليل الإثبات',en:'Use as supporting evidence'})}</button>
              <button type="button" disabled={solved} onClick={()=>markUnreliable(item.id)} aria-pressed={rejected===item.id} className={'rounded-xl border px-3 py-2.5 text-xs font-black '+(rejected===item.id?'border-rose-700 bg-rose-700 text-white':'border-rose-200 text-rose-800 dark:border-rose-900 dark:text-rose-200')}>{rejected===item.id?t({ar:'استُبعد لغياب المصدر',en:'Rejected: no source'}):t({ar:'استبعاد باعتباره غير موثق',en:'Reject as unverified'})}</button>
            </div>
          </div>}
        </div>)}
      </div>
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{t({ar:'لوحة الإثبات',en:'Proof board'})}: {proof.length}/2 · {t({ar:'مستندات موثوقة مختارة',en:'selected documents'})} ({officialCount}/2) · {rejected?t({ar:'تم تحديد ادعاء للاستبعاد',en:'one claim flagged'}):t({ar:'لم يُستبعد ادعاء بعد',en:'no claim rejected yet'})}</p>
    </section>

    {libraryBook && <aside className="rounded-2xl border border-emerald-300 bg-emerald-50/70 p-5 dark:border-emerald-900 dark:bg-emerald-950/20">
      <h3 className="text-lg font-black">{t({ar:'مستند إثرائي من رف مكتبة صقر',en:'Supporting reading from the EFIPS shelves'})}</h3>
      <p className="mt-2 text-sm font-black leading-7">{libraryBook.title} — {libraryBook.author}</p>
      <p className="mt-1 text-sm font-semibold">{t({ar:'الرف',en:'Shelf'})} {libraryBook.shelf} · {t({ar:'الصف',en:'Row'})} {libraryBook.row}</p>
      <p className="mt-2 text-sm leading-7">{t(libraryBook.task)}</p>
      <p className="mt-2 text-xs leading-6 text-emerald-900 dark:text-emerald-200">{t({ar:'هذا كتاب موجود بالفهرس للبحث الإضافي، وليس اقتباسًا من صفحات لم نطّلع عليها. لا يُحتسب الكتاب دليلًا رسميًا إلا بعد قراءة الصفحة وتوثيقها.',en:'This is a real catalogued book for optional research, not an excerpt from uninspected pages. Read and cite actual pages before using it as supporting evidence.'})}</p>
    </aside>}
    {caseFile.timeline && <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 dark:border-amber-900 dark:bg-amber-950/20">
      <h3 className="text-xl font-black">{t({ar:'2. أعد بناء خط الأحداث',en:'2. Reconstruct the timeline'})}</h3>
      <p className="mt-2 text-sm leading-7">{t({ar:'الأحداث مبعثرة. استخدم الأسهم لترتيبها من الأقدم إلى الأحدث، مستعينًا بالتواريخ الموجودة في المصادر.',en:'Events are out of order. Use the arrows to arrange them from earliest to latest, using the source dates.'})}</p>
      <ol className="mt-4 space-y-2">
        {ordered.map((id,position)=><li key={id} className="flex items-center gap-3 rounded-xl border border-amber-200 bg-white p-3 dark:border-amber-900 dark:bg-slate-900">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-black text-amber-900">{position+1}</span>
          <span className="min-w-0 flex-1 text-sm font-bold leading-6">{t(caseFile.timeline!.find(entry=>entry.id===id)!.label)}</span>
          <div className="flex shrink-0 gap-1">
            <button type="button" disabled={position===0||solved} onClick={()=>setOrdered(items=>move(items,position,position-1))} className="rounded-lg border px-3 py-2 font-black disabled:opacity-30" aria-label={t({ar:'نقل الحدث إلى الأعلى',en:'Move event up'})}>↑</button>
            <button type="button" disabled={position===ordered.length-1||solved} onClick={()=>setOrdered(items=>move(items,position,position+1))} className="rounded-lg border px-3 py-2 font-black disabled:opacity-30" aria-label={t({ar:'نقل الحدث إلى الأسفل',en:'Move event down'})}>↓</button>
          </div>
        </li>)}
      </ol>
    </section>}

    <section className="rounded-[1.5rem] border-2 border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-950 sm:p-7">
      <h3 className="text-xl font-black">{t({ar:caseFile.timeline?'3. قرار المحقق وتقرير الاستنتاج':'2. قرار المحقق وتقرير الاستنتاج',en:caseFile.timeline?'3. Issue your finding and report':'2. Issue your finding and report'})}</h3>
      <p className="mt-2 text-sm leading-7">{t({ar:'اختر الحكم الذي تؤيده الوثائق، ثم دوّن سببك بكلماتك. تصحيح الحكم والأدلة آلي، أما جودة الكتابة فيمكن للمعلم مراجعتها.',en:'Choose a finding supported by documents and explain it in your own words. Evidence choices are checked automatically; teachers can review written reasoning.'})}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-3" role="group" aria-label={t({ar:'تصنيف الادعاء',en:'Claim assessment'})}>
        {verdicts.map(entry=><button type="button" key={entry.id} disabled={solved} onClick={()=>{setVerdict(entry.id);setIssues([]);}} aria-pressed={verdict===entry.id} className={'min-h-16 rounded-xl border-2 px-4 py-3 text-start text-sm font-black '+(verdict===entry.id?'border-sky-600 bg-sky-700 text-white':'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900')}>{t(entry.text)}</button>)}
      </div>
      <label htmlFor="nh-investigation-reason" className="mt-5 block text-sm font-black">{t(caseFile.reasoningPrompt)}</label>
      <textarea id="nh-investigation-reason" value={reason} disabled={solved} onChange={event=>setReason(event.target.value.slice(0,1200))} rows={4} maxLength={1200}
        placeholder={t({ar:'بناءً على الوثيقة الأولى والوثيقة الثانية... أستنتج أن... لأن...',en:'Based on the first and second sources, I conclude that... because...'})}
        className="mt-2 w-full resize-y rounded-xl border-2 border-slate-300 bg-white p-4 text-sm leading-7 text-slate-900 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"/>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{reason.trim().length}/1200 · {t({ar:'25 حرفًا على الأقل',en:'At least 25 characters'})}</p>
      {issues.length>0 && <div role="alert" className="mt-4 rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-950 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-100">
        <strong className="font-black">{t({ar:'الملف يحتاج إلى مراجعة:',en:'Review these parts of your case file:'})}</strong>
        <ul className="mt-2 list-inside list-disc space-y-2">{issues.map((issue,i)=><li key={i}>{issue}</li>)}</ul>
      </div>}
      {!solved?<button type="button" onClick={verify} className="mt-5 w-full rounded-xl bg-gradient-to-r from-sky-800 to-emerald-700 px-5 py-4 text-base font-black text-white shadow-md hover:brightness-110 focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-400">
        {t({ar:'اعتماد تقرير التحقيق ومطابقة الأدلة',en:'Verify the investigation report'})}
      </button>:<div role="status" aria-live="polite" className="mt-5 rounded-2xl border-2 border-emerald-400 bg-emerald-50 p-5 text-emerald-950 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-100">
        <h4 className="text-lg font-black">{t({ar:'تم إغلاق القضية بالأدلة!',en:'Case resolved with evidence!'})}</h4>
        <p className="mt-2 text-sm leading-8">{t(caseFile.conclusion)}</p>
        <p className="mt-3 text-xs font-bold">{t({ar:'احتُفظ باستنتاجك في جلسة اللعب فقط، وسُجّل إنجاز القضية في حساب المتصفح.',en:'Your written reasoning remains in this play session; case completion is saved in browser progress.'})}</p>
      </div>}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={()=>selectCase(index-1)} disabled={index===0} className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-900 disabled:opacity-30 dark:bg-slate-800 dark:text-white">{t({ar:'القضية السابقة',en:'Previous case'})}</button>
        <Link to="/saqr-national-identity/books" className="rounded-xl border border-emerald-600 px-4 py-3 text-sm font-black text-emerald-800 dark:text-emerald-300">{t({ar:'ابحث في كتب الهوية بالمكتبة',en:'Search the school heritage collection'})}</Link>
        {index<heritageInvestigations.length-1?<button type="button" onClick={()=>selectCase(index+1)} className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-black text-white">{t({ar:'القضية التالية',en:'Next case'})}</button>:<button type="button" onClick={onBack} className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-black text-white">{t({ar:'إلى التحديات',en:'Challenges'})}</button>}
      </div>
    </section>
  </section>;
};
export default HeritageDetectiveGame;
