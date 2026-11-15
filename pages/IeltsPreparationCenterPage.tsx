import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../App';
import DigitalLibraryDialog from '../src/components/DigitalLibraryDialog';
import DigitalBookReader from '../src/components/DigitalBookReader';
import { findIeltsResource, IELTS_COACH_STARTERS, IELTS_RESOURCES, type IeltsCategory, type IeltsCoachSkill, type IeltsResource } from '../src/data/ieltsResources';

type Group = 'all' | 'cambridge' | 'study';
type TrackFilter = 'all' | 'general' | 'unspecified';
type PlanTrack = 'academic' | 'general';

const SKILLS: ReadonlyArray<{key:IeltsCoachSkill; name:string; ar:string; detail:string; detailAr:string; number:string}> = [
  {key:'reading',name:'Reading',ar:'القراءة',detail:'Understand passages and practise question types',detailAr:'فهم النصوص والتدرب على أنواع الأسئلة',number:'01'},
  {key:'writing',name:'Writing',ar:'الكتابة',detail:'Original writing tasks with detailed feedback',detailAr:'مهام كتابة أصلية مع تصحيح مفصل',number:'02'},
  {key:'listening',name:'Listening',ar:'الاستماع',detail:'Listening strategies and honest text-only alternatives',detailAr:'استراتيجيات استماع وتدريبات نصية عند غياب الصوت',number:'03'},
  {key:'speaking',name:'Speaking',ar:'المحادثة',detail:'Question-by-question interview practice',detailAr:'محاكاة مقابلة بأسئلة متدرجة',number:'04'}
];

const studyPhases = [
  {en:'Discover your level',ar:'تحديد المستوى',desc:'Choose your test type, identify strengths and set a target.',descAr:'اختر نوع الاختبار وحدد نقاط القوة والدرجة المستهدفة.'},
  {en:'Build core skills',ar:'تطوير المهارات',desc:'Rotate through reading, writing, listening and speaking.',descAr:'تدرّب بالتناوب على المهارات الأربع.'},
  {en:'Practise under time limits',ar:'تدريب إدارة الوقت',desc:'Use suitable practice tasks and review each error.',descAr:'استخدم تدريبات مناسبة بوقت محدد وراجع الأخطاء.'},
  {en:'Review and refine',ar:'المراجعة النهائية',desc:'Target weak areas and run an original simulated practice session.',descAr:'ركز على نقاط الضعف وأجرِ تدريبًا محاكيًا أصليًا.'},
];

function ResourceMark({resource}:{resource:IeltsResource}) {
  const number = resource.category==='cambridge' ? String(resource.sortOrder).padStart(2,'0') : 'IELTS';
  return (
    <div aria-hidden="true" className="relative flex aspect-[3/4] min-h-44 flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#123b43] via-[#155c60] to-[#248170] p-4 text-white shadow-inner">
      <span className="text-[10px] font-black tracking-[.2em] uppercase opacity-80">EFIPS • IELTS</span>
      <div className="relative z-10">
        <span className="block text-[11px] font-extrabold uppercase tracking-widest text-emerald-100">{resource.category==='cambridge'?'Cambridge practice':'Study reference'}</span>
        <span className="mt-1 block text-4xl font-black tracking-tight">{number}</span>
      </div>
      <span className="relative z-10 text-xs font-bold leading-5 line-clamp-2">{resource.title}</span>
      <span className="pointer-events-none absolute -right-14 top-10 size-44 rounded-full border-[25px] border-white/10" />
    </div>
  );
}

const IeltsPreparationCenterPage: React.FC = () => {
  const {locale, dir}=useLanguage();
  const ar=locale==='ar';
  const l=(arabic:string,english:string)=>ar?arabic:english;
  const location=useLocation();
  const navigate=useNavigate();
  const [group,setGroup]=useState<Group>('all');
  const [trackFilter,setTrackFilter]=useState<TrackFilter>('all');
  const [search,setSearch]=useState('');
  const [selected,setSelected]=useState<IeltsResource|null>(null);
  const [readerOpen,setReaderOpen]=useState(false);
  const [target,setTarget]=useState('6.5');
  const [weeks,setWeeks]=useState(8);
  const [planTrack,setPlanTrack]=useState<PlanTrack>('academic');

  // OAuth can bring a school reader back to a specific allow-listed resource.
  // Never use arbitrary links or IDs from the URL as PDF sources.
  useEffect(()=>{
    const id=new URLSearchParams(location.search).get('open');
    if(!id)return;
    const resource=findIeltsResource(id);
    if(resource){setSelected(resource);setReaderOpen(true);}
    navigate('/digital-library/english/ielts',{replace:true});
  },[location.search,navigate]);

  const listed=useMemo(()=>IELTS_RESOURCES.filter(resource=>{
    if(group==='cambridge'&&resource.category!=='cambridge')return false;
    if(group==='study'&&resource.category==='cambridge')return false;
    if(trackFilter!=='all'&&resource.category==='cambridge'&&resource.track!==trackFilter)return false;
    const q=search.trim().toLocaleLowerCase();
    return !q||[resource.title,resource.originalName,resource.description,resource.category].some(v=>v.toLocaleLowerCase().includes(q));
  }),[group,trackFilter,search]);

  const chooseGroup=(next:Group)=>{setGroup(next);setTrackFilter('all');};
  const close=()=>{setReaderOpen(false);setSelected(null);};
  const mb=(value:number)=>Math.round(value/1024/1024);

  return (
    <main dir={dir} className="min-h-screen overflow-x-hidden bg-[#f7faf9] text-slate-900 dark:bg-slate-950 dark:text-slate-50" style={{fontFamily:"Cairo, sans-serif"}}>
      <div className="mx-auto max-w-[1380px] px-4 pb-20 pt-6 sm:px-7">
        <nav className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm font-bold" aria-label={l('التنقل','Navigation')}>
          <Link className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-5 text-emerald-900 hover:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-emerald-200" to="/digital-library/english">
            {l('العودة للمكتبة الإنجليزية','Back to English Library')}
          </Link>
          <span className="text-slate-500 dark:text-slate-300">{l('مكتبة صقر الرقمية / مركز IELTS','Saqr Digital Library / IELTS Center')}</span>
        </nav>

        <header className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0b3436] via-[#11575a] to-[#16836d] px-6 py-8 text-white shadow-xl sm:px-10 md:py-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-32 size-96 rounded-full border-[52px] border-white/10"/>
          <div className="relative z-10 flex flex-col items-center gap-5 md:flex-row md:justify-between">
            <div className="max-w-2xl flex-1 text-center md:text-start">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black tracking-wide">
                <img src="/school-logo.png" alt="" className="size-7 object-contain"/>
                EFIPS DIGITAL LEARNING
              </div>
              <h1 className="text-3xl font-black leading-tight sm:text-5xl">IELTS Preparation Center</h1>
              <p className="mt-4 text-base font-bold leading-8 text-emerald-50 sm:text-lg">{l('مركز صقر للتحضير لاختبار IELTS: مراجع Cambridge وتدريبات تفاعلية ومساعد ذكي لتطوير مهاراتك الأربع.','Study resources from Cambridge, a personalised preparation outline and Saqr-powered practice for all four IELTS skills.')}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
                <a href="#ielts-resources" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-5 text-sm font-black text-emerald-950 transition hover:bg-emerald-50">{l('استكشف المراجع','Explore resources')}</a>
                <Link to="/smart-search?ielts=writing" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/60 bg-white/10 px-5 text-sm font-black text-white transition hover:bg-white/20">{l('تدرّب مع صقر','Practise with Saqr')}</Link>
              </div>
            </div>
            <img src="/saqr-full.png" alt={l('شخصية صقر','Saqr mascot')} className="h-36 w-auto object-contain drop-shadow-2xl sm:h-48 md:h-56"/>
          </div>
        </header>

        <section className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4" aria-label={l('محتويات المركز','Resource overview')}>
          {[
            ['24',l('مرجعًا دراسيًا','Study resources')],
            ['19',l('جزء Cambridge','Cambridge volumes')],
            ['05',l('مراجع متخصصة','Study guides')],
            ['04',l('مهارات IELTS','IELTS skills')]
          ].map(([number,label])=><div key={label} className="rounded-2xl border border-emerald-100 bg-white p-4 text-center shadow-sm dark:border-emerald-900 dark:bg-slate-900">
            <strong className="block text-3xl font-black text-emerald-800 dark:text-emerald-300">{number}</strong>
            <span className="block text-xs font-bold text-slate-600 dark:text-slate-300 sm:text-sm">{label}</span>
          </div>)}
        </section>

        <section className="mt-12" aria-labelledby="ielts-skills-title">
          <div className="mb-5">
            <h2 id="ielts-skills-title" className="text-2xl font-black sm:text-3xl">{l('تدرب على المهارات الأربع مع صقر','Practise all four skills with Saqr')}</h2>
            <p className="mt-2 text-sm font-bold text-slate-600 dark:text-slate-300">{l('اضغط على المهارة للانتقال إلى صقر؛ ستظهر رسالة تدريب جاهزة يمكنك تعديلها قبل الإرسال.','Choose a skill to open Saqr with an editable practice prompt. No published exam text is copied.')}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SKILLS.map(skill=><Link key={skill.key} to={'/smart-search?ielts='+skill.key} className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 dark:border-slate-700 dark:bg-slate-900">
              <span aria-hidden="true" className="inline-flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-black text-emerald-900 dark:bg-emerald-900 dark:text-white">{skill.number}</span>
              <h3 className="mt-3 text-xl font-black">{ar?skill.ar:skill.name}</h3>
              <p className="mt-2 min-h-12 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{ar?skill.detailAr:skill.detail}</p>
              <span className="mt-3 block text-sm font-black text-emerald-800 dark:text-emerald-300">{l('ابدأ التدريب','Start practice')}</span>
            </Link>)}
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-slate-900 sm:p-8" aria-labelledby="ielts-plan-title">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 id="ielts-plan-title" className="text-2xl font-black sm:text-3xl">{l('خطة مذاكرة مرنة','Your flexible study outline')}</h2>
              <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">{l('خطة استرشادية وليست تقييم مستوى أو ضمانًا لدرجة معينة.','A suggested outline, not a level assessment or a guaranteed exam band.')}</p>
            </div>
            <Link to="/smart-search?ielts=reading" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-700 px-5 text-sm font-black text-white hover:bg-emerald-800">{l('ابدأ مع صقر','Start with Saqr')}</Link>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="text-sm font-black">{l('نوع الاختبار','Test type')}
              <select value={planTrack} onChange={e=>setPlanTrack(e.target.value as PlanTrack)} className="mt-2 block w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white">
                <option value="academic">Academic</option><option value="general">General Training</option>
              </select>
            </label>
            <label className="text-sm font-black">{l('الدرجة المستهدفة','Target band')}
              <select value={target} onChange={e=>setTarget(e.target.value)} className="mt-2 block w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white">
                {['5.5','6.0','6.5','7.0','7.5','8.0'].map(v=><option key={v}>{v}</option>)}
              </select>
            </label>
            <label className="text-sm font-black">{l('مدة التحضير','Preparation duration')}
              <select value={weeks} onChange={e=>setWeeks(Number(e.target.value))} className="mt-2 block w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white">
                {[4,8,12].map(n=><option key={n} value={n}>{n} {l('أسابيع','weeks')}</option>)}
              </select>
            </label>
          </div>
          <p className="mt-4 text-xs font-bold text-emerald-800 dark:text-emerald-300">{l('خطة','Plan')}: {planTrack==='academic'?'Academic':'General Training'} · Band {target} · {weeks} {l('أسابيع','weeks')}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {studyPhases.map((phase,index)=>{
              const start=Math.floor(index*weeks/4)+1;
              const end=Math.floor((index+1)*weeks/4);
              return <div key={phase.en} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">{l('الأسبوع','Week')} {start}{end>start?'–'+end:''}</span>
                <h3 className="mt-2 font-black">{ar?phase.ar:phase.en}</h3>
                <p className="mt-2 text-xs font-semibold leading-6 text-slate-600 dark:text-slate-300">{ar?phase.descAr:phase.desc}</p>
              </div>
            })}
          </div>
        </section>

        <section id="ielts-resources" className="mt-12 scroll-mt-24" aria-labelledby="ielts-resource-title">
          <div className="mb-4">
            <h2 id="ielts-resource-title" className="text-2xl font-black sm:text-3xl">{l('مكتبة مراجع IELTS','IELTS resource library')}</h2>
            <p className="mt-2 max-w-4xl text-sm font-semibold leading-7 text-slate-600 dark:text-slate-300">{l('جميع المراجع من فولدر IELTS المدرسي. الأجزاء 11–19 مسجلة باسم General Training، أما نوع الأجزاء 1–10 فلم يُتحقق منه بعد.','All 24 records come from the school IELTS folder. Volumes 11–19 are named General Training; the test type for volumes 1–10 has not been independently verified.')}</p>
          </div>
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-wrap gap-2">
              {([['all',l('كل المراجع','All resources')],['cambridge',l('سلسلة Cambridge','Cambridge series')],['study',l('مراجع المهارات','Study references')]] as const).map(([key,label])=>
                <button key={key} type="button" onClick={()=>chooseGroup(key)} aria-pressed={group===key} className={'min-h-11 rounded-xl px-4 text-sm font-black '+(group===key?'bg-emerald-700 text-white':'bg-slate-100 text-slate-800 hover:bg-emerald-100 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700')}>{label}</button>
              )}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-black">{l('البحث عن مرجع','Search resources')}
                <input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder={l('عنوان أو رقم أو مهارة...','Title, number or skill...')} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"/>
              </label>
              {group!=='study'&&<label className="text-sm font-black">{l('تصنيف سلسلة Cambridge','Cambridge track label')}
                <select value={trackFilter} onChange={e=>setTrackFilter(e.target.value as TrackFilter)} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white">
                  <option value="all">{l('الكل','All track labels')}</option>
                  <option value="general">General Training (11–19)</option>
                  <option value="unspecified">{l('نوع الاختبار قيد المراجعة (1–10)','Track pending review (1–10)')}</option>
                </select>
              </label>}
            </div>
          </div>
          <p className="mb-4 text-sm font-bold text-slate-600 dark:text-slate-300" role="status">{l('النتائج','Results')}: {listed.length} / {IELTS_RESOURCES.length}</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {listed.map(resource=><button key={resource.id} type="button" onClick={()=>{setSelected(resource);setReaderOpen(false);}} className="group min-w-0 rounded-2xl border border-slate-200 bg-white p-3 text-start shadow-sm transition hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-emerald-700 dark:border-slate-700 dark:bg-slate-900">
              <ResourceMark resource={resource}/>
              <strong className="mt-3 block min-h-12 text-sm font-black leading-6">{resource.title}</strong>
              <span className="mt-1 block text-xs font-bold text-slate-500 dark:text-slate-300">{resource.track==='general'?'General Training':l('ملف PDF مدرسي','School PDF')} · {mb(resource.fileSizeBytes)} MB</span>
              <span className="mt-2 block text-xs font-black text-emerald-700 dark:text-emerald-300">{l('تفاصيل وقراءة','Details & read')}</span>
            </button>)}
          </div>
          {listed.length===0&&<p className="rounded-2xl border border-slate-200 p-8 text-center font-bold dark:border-slate-700">{l('لا توجد نتائج مطابقة.','No matching resources found.')}</p>}
        </section>

        <aside className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-xs font-bold leading-7 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
          {l('تُفتح ملفات PDF من Google Drive باستخدام صلاحيات حساب المدرسة. قد يتطلب فتح كتاب كبير منح إذن قراءة Drive مرة واحدة. الملفات الصوتية المستقلة وكتاب Cambridge 20 غير موجودين في الجرد الحالي؛ ولا تمثل تدريبات صقر اختبارات IELTS رسمية أو درجات معتمدة.','PDF access remains governed by your school Google Drive permissions. Larger files may request a one-time Drive read permission. Cambridge 20 and separate listening audio files were not in the current inventory. Saqr exercises are not official IELTS tests or certified band assessments.')}
        </aside>
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
          <p className="mt-5 text-xs font-bold leading-6 text-slate-600 dark:text-slate-300">{l('يحتاج فتح الملف إلى حساب Google مخوّل بالوصول إليه. قد تختلف طريقة عرض الملفات الكبيرة حسب صلاحية Drive والمتصفح.','Opening this file requires a Google account authorised by the file owner. Large file rendering also depends on Drive API permissions and browser support.')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={()=>setReaderOpen(true)} className="min-h-12 rounded-xl bg-emerald-700 px-6 text-sm font-black text-white hover:bg-emerald-800">{l('افتح بقارئ صقر الزجاجي','Open in Saqr glass reader')}</button>
            <button type="button" onClick={close} className="min-h-12 rounded-xl border border-slate-300 px-5 text-sm font-bold dark:border-slate-600">{l('إغلاق','Close')}</button>
          </div>
        </div>
      </DigitalLibraryDialog>}

      {selected && readerOpen && <DigitalBookReader
        title={selected.title}
        source={selected.driveLink}
        bookKey={'digital:en:'+selected.id}
        locale={locale}
        schoolOnly={true}
        sourceSizeBytes={selected.fileSizeBytes}
        onBack={()=>setReaderOpen(false)}
        onClose={close}
      />}
    </main>
  );
};

export default IeltsPreparationCenterPage;
