import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../App';
import DigitalLibraryDialog from '../src/components/DigitalLibraryDialog';
import IeltsDriveViewOnlyReader from '../src/components/IeltsDriveViewOnlyReader';
import { findIeltsResource, IELTS_RESOURCES, type IeltsResource } from '../src/data/ieltsResources';

type PlanTrack = 'academic' | 'general';
type ResourceLevel = 'foundation' | 'advanced' | 'practice';

const resourceLevel=(resource:IeltsResource):ResourceLevel=>
  resource.category==='cambridge'?'practice':
  resource.category==='grammar'||resource.category==='vocabulary'?'advanced':'foundation';

// These are editorial study pathways based on the published book scope, NOT
// publisher-certified CEFR levels for the individual practice-test volumes.
const resourceGroups:ReadonlyArray<{
  key:ResourceLevel; titleAr:string; titleEn:string;
  detailAr:string; detailEn:string; tag:string;
}>= [
  {
    key:'foundation',titleAr:'ابدأ من الأساسيات',titleEn:'Start with the foundations',
    detailAr:'مراجع بناء المهارات وفهم الاختبار؛ دليل كامبريدج الرسمي يغطي B1–C1.',
    detailEn:'Skill-building and exam orientation; the Official Cambridge Guide covers B1–C1.',
    tag:'B1–C1',
  },
  {
    key:'advanced',titleAr:'طوّر مستواك للدرجات الأعلى',titleEn:'Build toward higher bands',
    detailAr:'مراجع القواعد والمفردات المصممة للدرجة 6.5 فما فوق.',
    detailEn:'Grammar and vocabulary books explicitly labelled for Band 6.5 and above.',
    tag:'BAND 6.5+',
  },
  {
    key:'practice',titleAr:'طبّق مع اختبارات Cambridge',titleEn:'Practise with Cambridge tests',
    detailAr:'سلسلة اختبارات تدريبية مرتبة حسب رقم الإصدار، وليس بحسب صعوبة مفترضة.',
    detailEn:'Practice-test volumes in publication order, not an invented difficulty ranking.',
    tag:'PRACTICE TESTS',
  },
];

const studyPhases:ReadonlyArray<{
  titleAr:string;titleEn:string;descriptionAr:string;descriptionEn:string;
  source:string;icon:'compass'|'book'|'clock'|'check';
}>= [
  {
    titleAr:'اعرف الاختبار وحدد نقطة البداية',titleEn:'Understand the test & set a baseline',
    descriptionAr:'ابدأ بمقدمة The Official Cambridge Guide، وحدد Academic أو General Training، وجرّب أسئلة تمهيدية وسجّل الأخطاء المتكررة.',
    descriptionEn:'Read the introduction to The Official Cambridge Guide, choose Academic or General Training, try a diagnostic sample and keep an error log.',
    source:'The Official Cambridge Guide to IELTS',icon:'compass',
  },
  {
    titleAr:'نمِ المهارات الأربع بالطريقة المنهجية',titleEn:'Build the four skills systematically',
    descriptionAr:'تدرّب عبر وحدات الدليل الرسمية: الاستماع والقراءة والكتابة والمحادثة؛ راجع الاستراتيجيات ونماذج الإجابات وأسباب الأخطاء.',
    descriptionEn:'Work through Cambridge’s Listening, Reading, Writing and Speaking units; review strategies, model responses and common mistakes.',
    source:'Cambridge skills & exam strategies',icon:'book',
  },
  {
    titleAr:'تدرّب على مهام اختبارك مع ضبط الوقت',titleEn:'Practise your test tasks under time limits',
    descriptionAr:'اختر نماذج مناسبة لنوع اختبارك، وركّز على القراءة والكتابة لأن مهامهما تختلف بين المسارين. استخدم صوتًا حقيقيًا عند تدريب الاستماع.',
    descriptionEn:'Choose appropriate sample tasks for your track. Academic and General Training differ in Reading and Writing. Use actual recordings for listening practice.',
    source:'Cambridge practice tests · IELTS format',icon:'clock',
  },
  {
    titleAr:'حاكِ الاختبار وراجع نقاط التحسين',titleEn:'Simulate and review your performance',
    descriptionAr:'نفّذ محاكاة واقعية عند توافر المواد، ثم راجع الإجابات وأخطاء الوقت والكتابة بمعايير IELTS المنشورة، وحدد آخر أولوياتك.',
    descriptionEn:'Run realistic practice when materials are available; review answer keys, timing errors and writing against published IELTS criteria.',
    source:'IELTS band descriptors · Cambridge mock tests',icon:'check',
  },
];

function StudyIcon({icon}:{icon:'compass'|'book'|'clock'|'check'}) {
  return <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {icon==='compass'&&<><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.5 4.5-4.5 2.5 2.5-4.5z"/></>}
    {icon==='book'&&<><path d="M12 6c-3-2-7-2-9-1v14c3-1 7-1 9 1 3-2 7-2 9-1V5c-3-1-7-1-9 1Zm0 0v14"/></>}
    {icon==='clock'&&<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></>}
    {icon==='check'&&<><circle cx="12" cy="12" r="9"/><path d="m7 12 3.5 3.5L17 9"/></>}
  </svg>;
}

function SkillIcon({skill}:{skill:'listen'|'read'|'write'|'speak'}) {
  return <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {skill==='listen'&&<><path d="M4 14v-3a8 8 0 0 1 16 0v3"/><rect x="2.5" y="13" width="4" height="7" rx="2"/><rect x="17.5" y="13" width="4" height="7" rx="2"/></>}
    {skill==='read'&&<><path d="M12 6C9.5 4.5 5.5 4 3 5v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-7-.5-9 1Zm0 0v14"/></>}
    {skill==='write'&&<><path d="m3 21 5.5-1.5L20 8a2.1 2.1 0 0 0-3-3L5.5 16.5zM15 7l3 3"/></>}
    {skill==='speak'&&<><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4m-4 0h8"/></>}
  </svg>;
}

function ResourceMark({resource}:{resource:IeltsResource}) {
  const number=resource.category==='cambridge'?String(resource.sortOrder).padStart(2,'0'):'IELTS';
  const focus=resourceLevel(resource);
  const color=focus==='practice'?'from-sky-900 via-teal-800 to-emerald-700':
    focus==='advanced'?'from-indigo-900 via-slate-800 to-emerald-800':
    'from-emerald-900 via-teal-800 to-teal-600';
  return <div aria-hidden="true" className={'relative flex aspect-[3/4] min-h-44 flex-col justify-between overflow-hidden rounded-[1.4rem] bg-gradient-to-br p-4 text-white shadow-inner '+color}>
    <span className="relative z-10 text-[10px] font-black tracking-widest text-emerald-50">EFIPS • IELTS</span>
    <div className="relative z-10">
      <span className="block text-[11px] font-bold uppercase tracking-widest text-emerald-100">{resource.category==='cambridge'?'CAMBRIDGE IELTS':'STUDY GUIDE'}</span>
      <span className="mt-2 block text-4xl font-black">{number}</span>
    </div>
    <strong className="relative z-10 line-clamp-2 text-xs font-black leading-6">{resource.title}</strong>
    <span className="pointer-events-none absolute -right-9 top-7 size-36 rounded-full border-[20px] border-white/10"/>
  </div>;
}

const IeltsPreparationCenterPage:React.FC=()=>{
  const {locale,dir}=useLanguage();
  const ar=locale==='ar';
  const l=(arabic:string,english:string)=>ar?arabic:english;
  const location=useLocation();
  const navigate=useNavigate();
  const [search,setSearch]=useState('');
  const [selected,setSelected]=useState<IeltsResource|null>(null);
  const [readerOpen,setReaderOpen]=useState(false);
  const [target,setTarget]=useState('6.5');
  const [weeks,setWeeks]=useState(8);
  const [planTrack,setPlanTrack]=useState<PlanTrack>('academic');
  const highBand=Number(target)>=6.5;

  useEffect(()=>{
    const id=new URLSearchParams(location.search).get('open');
    if(!id)return;
    const resource=findIeltsResource(id);
    if(resource){setSelected(resource);setReaderOpen(true);}
    navigate('/digital-library/english/ielts',{replace:true});
  },[location.search,navigate]);

  const listed=useMemo(()=>IELTS_RESOURCES.filter(resource=>{
    const q=search.trim().toLocaleLowerCase();
    return !q||[resource.title,resource.originalName,resource.description,resource.category].some(text=>text.toLocaleLowerCase().includes(q));
  }),[search]);
  const sections=resourceGroups.map(group=>({
    ...group,
    books:listed.filter(resource=>resourceLevel(resource)===group.key)
      .sort((a,b)=>a.sortOrder-b.sortOrder)
  })).filter(group=>group.books.length>0);
  const close=()=>{setReaderOpen(false);setSelected(null);};
  const mb=(value:number)=>Math.round(value/1024/1024);

  return (
    <main dir={dir} className="relative min-h-screen overflow-x-hidden bg-[#f8fafc] text-slate-900 transition-colors dark:bg-slate-950 dark:text-white" style={{fontFamily:'Cairo, sans-serif'}}>
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-gradient-to-b from-emerald-100/60 via-sky-50/20 to-transparent dark:from-emerald-900/20 dark:via-slate-900/10"/>
    <div className="relative mx-auto max-w-[1380px] px-4 pb-20 pt-7 sm:px-7">
      <nav className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm font-bold" aria-label={l('التنقل','Navigation')}>
        <Link to="/digital-library/english" className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-slate-200 bg-white px-5 text-slate-800 shadow-sm hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
          <svg viewBox="0 0 24 24" className={'size-5 '+(ar?'rotate-180':'')} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6"/></svg>
          {l('المكتبة الإنجليزية','English Library')}
        </Link>
        <span className="text-slate-500 dark:text-slate-300">{l('مكتبة صقر الرقمية / مركز IELTS','Saqr Digital Library / IELTS Center')}</span>
      </nav>

      <header className="relative isolate overflow-hidden rounded-[2.75rem] border-4 border-emerald-100 bg-white px-6 pb-6 pt-8 shadow-xl dark:border-emerald-900 dark:bg-slate-800 sm:px-10 md:px-12">
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -end-24 size-[420px] rounded-full bg-emerald-100/60 blur-3xl dark:bg-emerald-800/20"/>
        <div aria-hidden="true" className="pointer-events-none absolute -start-12 -top-20 size-48 rounded-full bg-sky-100/50 blur-2xl dark:bg-sky-800/10"/>
        <div className="relative z-10 flex flex-col-reverse items-center gap-5 md:flex-row md:justify-between md:gap-9">
          <div className="max-w-2xl flex-1 text-center md:text-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[11px] font-black tracking-wider text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100">
              <img src="/school-logo.png" alt="" className="size-7 object-contain" />
              EFIPS DIGITAL LIBRARY
            </span>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">{l('مركز IELTS','IELTS Center')}</h1>
            <p className="mt-4 max-w-2xl text-base font-bold leading-8 text-slate-600 dark:text-slate-200 sm:text-lg">
              {l('رحلتك للاستعداد لاختبار IELTS: مراجع كامبريدج، خطة مذاكرة واضحة، وتدريب ذكي مع شخصية صقر.','Your IELTS learning space: Cambridge study resources, a clear preparation pathway and interactive practice with Saqr.')}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <span className="rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-black text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100">Cambridge Resources</span>
              <span className="rounded-full bg-sky-100 px-4 py-1.5 text-xs font-black text-sky-900 dark:bg-sky-900 dark:text-sky-100">Academic & General Training</span>
              <span className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-black text-slate-700 dark:bg-slate-700 dark:text-slate-100">Saqr AI</span>
            </div>
          </div>
          <div className="relative flex w-full max-w-[330px] shrink-0 items-center justify-center md:w-[34%]">
            <div className="absolute inset-10 rounded-full border-4 border-dashed border-emerald-200/80 dark:border-emerald-800/40"/>
            <img src="/SAQR%20IELTS.png" alt={l('شخصية صقر للتحضير لاختبار IELTS','Saqr IELTS character')} className="relative z-10 h-56 w-full object-contain drop-shadow-xl sm:h-72 md:h-80"/>
          </div>
        </div>
      </header>

      <section className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4" aria-label={l('معلومات المركز','Center overview')}>
        {[
          ['24',l('مرجعًا دراسيًا','Study resources')],
          ['19',l('جزء Cambridge','Cambridge volumes')],
          ['05',l('كتب للتحضير','Study guides')],
          ['04',l('مهارات لغوية','Language skills')]
        ].map(([value,label])=><div key={label} className="rounded-[1.5rem] border-2 border-slate-200 bg-white px-3 py-4 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <strong className="block text-3xl font-black text-emerald-700 dark:text-emerald-300">{value}</strong>
          <span className="block text-xs font-bold leading-6 text-slate-600 dark:text-slate-300 sm:text-sm">{label}</span>
        </div>)}
      </section>

      <section className="relative mt-11 overflow-hidden rounded-[2.5rem] border-4 border-emerald-200 bg-white px-5 py-9 text-center shadow-lg dark:border-emerald-900 dark:bg-slate-800 sm:px-10" aria-labelledby="ielts-self-test-title">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-sky-400"/>
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-black tracking-widest text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 3v3m0 12v3M3 12h3m12 0h3"/><circle cx="12" cy="12" r="5"/></svg>
            SAQR AI • IELTS SELF-TEST
          </span>
          <h2 id="ielts-self-test-title" className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">{l('اختبر نفسك مع صقر','Test Yourself with Saqr')}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-bold leading-8 text-slate-600 dark:text-slate-200 sm:text-base">
            {l('ابدأ من هنا، واختر المهارة داخل محادثة صقر. هيقدم لك سؤالًا واحدًا في كل مرة، ويراجع إجاباتك ويشرح لك التحسينات.','Start here and choose your skill inside Saqr. He will ask one question at a time, review your answers and explain how to improve.')}
          </p>
          <div className="mx-auto mt-6 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {([
              ['listen',l('الاستماع','Listening')],
              ['read',l('القراءة','Reading')],
              ['write',l('الكتابة','Writing')],
              ['speak',l('المحادثة','Speaking')]
            ] as const).map(([skill,label])=><div key={skill} className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-emerald-100 bg-[#f8fafc] px-3 py-4 text-emerald-800 dark:border-emerald-900 dark:bg-slate-900 dark:text-emerald-200">
              <SkillIcon skill={skill}/>
              <span className="text-xs font-black text-slate-700 dark:text-slate-200">{label}</span>
            </div>)}
          </div>
          <Link to="/smart-search" state={{ieltsSelfTest:true}} className="mx-auto mt-7 inline-flex min-h-14 w-full max-w-sm items-center justify-center gap-3 rounded-2xl bg-emerald-700 px-7 py-4 text-base font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700 sm:text-lg">
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/></svg>
            {l('ابدأ الاختبار مع صقر','Start Self-Test with Saqr')}
          </Link>
        </div>
      </section>

      <section className="mt-12 rounded-[2.5rem] border-2 border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-800 sm:p-9" aria-labelledby="ielts-plan-title">
        <div className="max-w-4xl">
          <span className="text-xs font-black tracking-wider text-emerald-700 dark:text-emerald-300">CAMBRIDGE-ALIGNED STUDY PATH</span>
          <h2 id="ielts-plan-title" className="mt-2 text-2xl font-black sm:text-3xl">{l('خطتك للتحضير لاختبار IELTS','Your IELTS preparation pathway')}</h2>
          <p className="mt-3 text-sm font-bold leading-8 text-slate-600 dark:text-slate-200">
            {l('تنظيم عملي مستند إلى وحدات The Official Cambridge Guide ومكوّنات اختبار IELTS ومعايير تقييمه. المدة المقترحة مرنة حسب وقتك ومستواك.', 'A practical schedule aligned with The Official Cambridge Guide, the IELTS test format and published assessment criteria. Adjust the pacing to your level and available time.')}
          </p>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="text-sm font-black text-slate-700 dark:text-slate-100">{l('نوع الاختبار','Test type')}
            <select value={planTrack} onChange={e=>setPlanTrack(e.target.value as PlanTrack)} className="mt-2 block min-h-12 w-full rounded-xl border-2 border-slate-200 bg-white p-3 font-bold text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white">
              <option value="academic">Academic</option>
              <option value="general">General Training</option>
            </select>
          </label>
          <label className="text-sm font-black text-slate-700 dark:text-slate-100">{l('الدرجة المستهدفة','Target band')}
            <select value={target} onChange={e=>setTarget(e.target.value)} className="mt-2 block min-h-12 w-full rounded-xl border-2 border-slate-200 bg-white p-3 font-bold text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white">
              {['5.5','6.0','6.5','7.0','7.5','8.0'].map(v=><option key={v} value={v}>{v}</option>)}
            </select>
          </label>
          <label className="text-sm font-black text-slate-700 dark:text-slate-100">{l('مدة التحضير','Preparation duration')}
            <select value={weeks} onChange={e=>setWeeks(Number(e.target.value))} className="mt-2 block min-h-12 w-full rounded-xl border-2 border-slate-200 bg-white p-3 font-bold text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white">
              {[4,8,12].map(n=><option key={n} value={n}>{n} {l('أسابيع','weeks')}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold leading-7 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100">
          <strong>{planTrack==='academic'?'Academic':'General Training'} · Band {target} · {weeks} {l('أسابيع','weeks')}</strong>
          <p className="mt-1">
            {planTrack==='academic'
              ? l('القراءة والكتابة بنمط Academic؛ الاستماع والمحادثة مشتركان بين نوعي الاختبار.','Use Academic Reading and Writing tasks; Listening and Speaking are shared between tracks.')
              : l('القراءة والكتابة بنمط General Training؛ الاستماع والمحادثة مشتركان بين نوعي الاختبار.','Use General Training Reading and Writing tasks; Listening and Speaking are shared between tracks.')}
          </p>
          <p className="mt-1">{highBand
            ? l('للدرجة المستهدفة 6.5+: أضف مراجعة مركزة لمراجع Cambridge Grammar وVocabulary for Bands 6.5+.', 'For Band 6.5+: add targeted review using the Cambridge Grammar and Vocabulary for Bands 6.5+ guides.')
            : l('ابدأ بالدليل الرسمي وIELTS Trainer قبل الانتقال للمحاكاة الكاملة.', 'Start with the Official Cambridge Guide and IELTS Trainer before timed mock tests.')}
          </p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {studyPhases.map((phase,index)=>{
            const start=Math.floor(index*weeks/4)+1;
            const end=Math.floor((index+1)*weeks/4);
            return <article key={phase.titleEn} className="relative overflow-hidden rounded-[1.6rem] border-2 border-slate-100 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"><StudyIcon icon={phase.icon}/></span>
                <span className="text-xs font-black tracking-widest text-slate-400">0{index+1}</span>
              </div>
              <p className="mt-4 text-xs font-black text-emerald-800 dark:text-emerald-300">{l('الأسبوع','Week')} {start}{end>start?'–'+end:''}</p>
              <h3 className="mt-2 text-base font-black leading-7">{ar?phase.titleAr:phase.titleEn}</h3>
              <p className="mt-3 text-xs font-semibold leading-7 text-slate-600 dark:text-slate-300">{ar?phase.descriptionAr:phase.descriptionEn}</p>
              <p className="mt-4 border-t border-slate-200 pt-3 text-[11px] font-bold leading-6 text-emerald-700 dark:border-slate-700 dark:text-emerald-300">{phase.source}</p>
            </article>;
          })}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-black text-emerald-700 dark:text-emerald-300">
          <a href="https://www.cambridgeenglish.org/exams-and-tests/ielts/preparation/" target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">{l('إرشادات Cambridge للتحضير','Cambridge preparation guidance')}</a>
          <a href="https://ielts.org/take-a-test/test-types" target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">{l('أنواع اختبار IELTS','IELTS test types')}</a>
          <a href="https://ielts.org/take-a-test/your-results/ielts-scoring-in-detail" target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">{l('معايير تقييم IELTS','IELTS scoring criteria')}</a>
        </div>
      </section>

      <section id="ielts-resources" className="mt-12 scroll-mt-24" aria-labelledby="ielts-resource-title">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-black tracking-wider text-emerald-700 dark:text-emerald-300">IELTS STUDY LIBRARY</span>
            <h2 id="ielts-resource-title" className="mt-1 text-2xl font-black sm:text-3xl">{l('مراجع مركز IELTS','IELTS Center resources')}</h2>
            <p className="mt-2 text-sm font-bold leading-7 text-slate-600 dark:text-slate-300">{l('ابدأ بكتب بناء المهارات، ثم انتقل لمراجع الدرجة المتقدمة ولتدريبات Cambridge التطبيقية.','Begin with skill-building guides, then use higher-band resources and Cambridge practice tests.')}</p>
          </div>
          <label className="w-full max-w-sm text-sm font-black text-slate-700 dark:text-slate-200">{l('ابحث عن مرجع','Search resources')}
            <input type="search" value={search} onChange={event=>setSearch(event.target.value)} placeholder={l('عنوان أو رقم المرجع...','Title or volume number...')} className="mt-2 block min-h-12 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
          </label>
        </div>
        <p className="mb-5 text-sm font-bold text-slate-600 dark:text-slate-300" role="status">{l('المراجع المعروضة','Resources shown')}: {listed.length} / {IELTS_RESOURCES.length}</p>
        {sections.map((section,index)=><div key={section.key} className="mb-9 rounded-[2rem] border-2 border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-700">
            <div className="flex min-w-0 items-start gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-base font-black text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100">{index+1}</span>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white sm:text-xl">{ar?section.titleAr:section.titleEn}</h3>
                <p className="mt-1 text-xs font-semibold leading-6 text-slate-500 dark:text-slate-300">{ar?section.detailAr:section.detailEn}</p>
              </div>
            </div>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-black text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">{section.tag}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {section.books.map(resource=><button key={resource.id} type="button" onClick={()=>{setSelected(resource);setReaderOpen(false);}} className="group min-w-0 rounded-2xl border-2 border-slate-100 bg-white p-3 text-start shadow-sm transition hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600 dark:border-slate-700 dark:bg-slate-900">
              <ResourceMark resource={resource}/>
              <strong className="mt-3 block min-h-12 text-sm font-black leading-6">{resource.title}</strong>
              <span className="mt-1 block text-xs font-bold text-slate-500 dark:text-slate-300">{resource.track==='general'?'General Training':'PDF'} · {mb(resource.fileSizeBytes)} MB</span>
              <span className="mt-2 block text-xs font-black text-emerald-700 dark:text-emerald-300">{l('اقرأ المرجع','Read resource')}</span>
            </button>)}
          </div>
        </div>)}
        {listed.length===0&&<p className="rounded-2xl border border-slate-200 bg-white p-8 text-center font-bold dark:border-slate-700 dark:bg-slate-800">{l('لا توجد نتائج مطابقة.','No matching resources found.')}</p>}
      </section>
    </div>

      {selected && !readerOpen && <DigitalLibraryDialog title={selected.title} onClose={close}>
        <div className="max-h-[80vh] w-full overflow-y-auto bg-white p-6 text-slate-900 dark:bg-slate-900 dark:text-white sm:p-8" dir={dir}>
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700 dark:text-emerald-300">IELTS • EFIPS DIGITAL LIBRARY</p>
          <h2 className="mt-3 text-2xl font-black">{selected.title}</h2>
          <p className="mt-3 text-sm font-bold leading-7">{selected.description}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs font-bold text-slate-600 dark:text-slate-200">
            <span className="rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-800">PDF • {mb(selected.fileSizeBytes)} MB</span>
            {selected.track==='general'&&<span className="rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-800">General Training</span>}
          </div>
          <p className="mt-5 text-xs font-bold leading-6 text-emerald-700 dark:text-emerald-300">{l('للقراءة داخل منصة صقر فقط بحساب المدرسة المخوّل. لا تتوفر خيارات تحميل أو طباعة في القارئ.','Read within Saqr using your authorised school account. The reader provides no download or print controls.')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={()=>setReaderOpen(true)} className="min-h-12 rounded-xl bg-emerald-700 px-6 text-sm font-black text-white hover:bg-emerald-800">{l('افتح بقارئ صقر الزجاجي','Open in Saqr glass reader')}</button>
            <button type="button" onClick={close} className="min-h-12 rounded-xl border border-slate-300 px-5 text-sm font-bold dark:border-slate-600">{l('إغلاق','Close')}</button>
          </div>
        </div>
      </DigitalLibraryDialog>}

      {selected && readerOpen && <IeltsDriveViewOnlyReader
        title={selected.title}
        source={selected.driveLink}
        locale={locale}
        onBack={()=>setReaderOpen(false)}
        onClose={close}
      />}
    </main>
  );
};

export default IeltsPreparationCenterPage;
