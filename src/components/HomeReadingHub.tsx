import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../App';
import { ARABIC_LIBRARY_DATABASE } from '../../pages/ArabicLibraryInternalPage';
import { ENGLISH_LIBRARY_DATABASE } from '../../pages/EnglishLibraryInternalPage';
import { digitalBookKey, physicalReadingCatalog, type ReadingBook, useReadingPassport } from '../utils/readingPassport';
import { getLocalizedSubject } from '../../api/bookData';

const digitalCatalog: ReadingBook[] = [
  ...ARABIC_LIBRARY_DATABASE.map(book => ({
    key: digitalBookKey('ar', book), title: book.title, author: book.author,
    subject: book.subject, format: 'ar' as const, href: book.driveLink
  })),
  ...ENGLISH_LIBRARY_DATABASE.map(book => ({
    key: digitalBookKey('en', book), title: book.title, author: book.author,
    subject: book.subject, format: 'en' as const, href: book.driveLink
  }))
];
const catalog = [...physicalReadingCatalog, ...digitalCatalog];
const catalogByKey = new Map(catalog.map(book => [book.key, book]));
const labelFor = (b: ReadingBook, ar: boolean) =>
  b.format === 'physical' ? (ar ? 'كتاب ورقي' : 'Physical') :
  b.format === 'ar' ? (ar ? 'رقمي عربي' : 'Arabic digital') : (ar ? 'رقمي إنجليزي' : 'English digital');

const BOOK_GRADIENTS = [
  'from-blue-500 to-sky-500 border-blue-200',
  'from-emerald-500 to-teal-400 border-emerald-200',
  'from-rose-500 to-pink-500 border-rose-200',
  'from-amber-500 to-orange-400 border-amber-200',
  'from-purple-500 to-indigo-500 border-purple-200'
];
const bookGradient = (book: ReadingBook) => BOOK_GRADIENTS[book.title.length % BOOK_GRADIENTS.length];
const categoryLabel = (book:ReadingBook, ar:boolean) =>
  book.format === 'physical' ? (ar?'كتاب ورقي':'Physical book') :
  book.format === 'ar' ? (ar?'كتاب رقمي عربي':'Arabic digital book') :
  (ar?'كتاب رقمي إنجليزي':'English digital book');
const getSchoolProfile = () => {
  try {
    const person = JSON.parse(localStorage.getItem('current_user') || '{}');
    const role = localStorage.getItem('user_type') || 'student';
    const grade = String(person.grade || person.user_grade || '');
    const number = Number((grade.match(/\d{1,2}/) || [])[0]);
    return { role, grade: Number.isFinite(number) ? number : 0 };
  } catch { return { role: 'student', grade: 0 }; }
};
const relevanceScore = (book:ReadingBook, role:string, grade:number, subjects:string[]) => {
  const text = (book.subject + ' ' + book.title).toLowerCase();
  const teacherTopics = /education|teaching|teacher|leadership|curriculum|lesson|education|تربية|تعليم|تدريس|معلم|مناهج|قيادة|تطوير/;
  const youngerTopics = /child|kids|children|fairy|picture|story|قصص الأطفال|أطفال|حكايات|ناشئة|صغار/;
  const olderTopics = /science|physics|math|history|technology|novel|literature|biolog|chemistry|علوم|فيزياء|رياضيات|تاريخ|تكنولوجيا|روايات|أدب/;
  let score = subjects.includes(book.subject) ? 45 : 0;
  if (role === 'teacher' || role === 'admin') {
    if (teacherTopics.test(text)) score += 30;
    if (olderTopics.test(text)) score += 8;
  } else if (grade > 0 && grade <= 6) {
    if (youngerTopics.test(text)) score += 30;
    if (olderTopics.test(text)) score -= 12;
  } else if (grade >= 7) {
    if (olderTopics.test(text)) score += 25;
    if (youngerTopics.test(text)) score -= 16;
  } else if (youngerTopics.test(text)) score += 8;
  // Prefer usable digital records for discovery; never assert verified age suitability.
  if (book.format !== 'physical' && book.href) score += 8;
  return score;
};
const HomeReadingHub: React.FC<{ variant?: 'challenge' | 'books' }> = ({ variant = 'books' }) => {
  const { locale, dir } = useLanguage();
  const ar = locale === 'ar';
  const { data, toggleSaved, toggleCompleted, setGoal } = useReadingPassport();
  const [category, setCategory] = useState<'all'|'physical'|'ar'|'en'>('all');
  const [tab, setTab] = useState<'saved'|'suggested'>('suggested');
  const [modalOpen, setModalOpen] = useState(false);
  const profile = useMemo(getSchoolProfile, []);
  const savedBooks = useMemo(()=>data.saved.map(key=>catalogByKey.get(key)).filter((b):b is ReadingBook=>!!b),[data.saved]);
  const completedBooks = useMemo(()=>data.completed.map(key=>catalogByKey.get(key)).filter((b):b is ReadingBook=>!!b),[data.completed]);
  const preferredSubjects = useMemo(()=>{
    const count = new Map<string,number>();
    [...savedBooks,...completedBooks].forEach(book=>count.set(book.subject,(count.get(book.subject)||0)+1));
    return [...count.entries()].sort((a,b)=>b[1]-a[1]).slice(0,3).map(([subject])=>subject);
  },[savedBooks,completedBooks]);
  const suggestions = useMemo(()=>{
    const candidates = catalog.filter(b=>(category==='all'||b.format===category)&&
      !data.completed.includes(b.key)&&!data.saved.includes(b.key));
    const ranked = candidates.map(b=>({book:b,score:relevanceScore(b,profile.role,profile.grade,preferredSubjects)}))
      .sort((a,b)=>b.score-a.score||a.book.title.localeCompare(b.book.title,locale));
    if(category!=='all') return ranked.slice(0,36).map(item=>item.book);
    // Rotate across print, Arabic digital and English digital catalogs.
    const groups = {
      physical:ranked.filter(item=>item.book.format==='physical'),
      ar:ranked.filter(item=>item.book.format==='ar'),
      en:ranked.filter(item=>item.book.format==='en')
    };
    const mixed:ReadingBook[] = [];
    let index=0;
    while(mixed.length<36 && (groups.physical.length || groups.ar.length || groups.en.length)) {
      for(const group of [groups.physical,groups.ar,groups.en]) {
        const entry=group.shift();
        if(entry && mixed.length<36) mixed.push(entry.book);
      }
      if(++index>36) break;
    }
    return mixed;
  },[category,data.completed,data.saved,preferredSubjects,profile.grade,profile.role,locale]);
  const today = new Date();
  const monthKey = today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0');
  const count = data.completed.filter(key=>(data.completedOn[key]||'').startsWith(monthKey)).length;
  const progress = Math.min(100,Math.round(count/data.goal*100));
  const visible = tab==='saved' ? savedBooks.filter(book=>category==='all'||book.format===category) : suggestions;
  const card=(book:ReadingBook,inModal:boolean)=>{
    const saved=data.saved.includes(book.key), finished=data.completed.includes(book.key);
    return <article key={book.key} className={'group relative min-w-0 rounded-[1.75rem] border-4 bg-gradient-to-br '+bookGradient(book)+' p-4 sm:p-5 text-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl active:scale-[.99] flex flex-col gap-3 min-h-[220px]'}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-black/10 rounded-[1.5rem]"/>
      <span className="relative self-start text-[11px] font-black rounded-full bg-white/20 border border-white/30 backdrop-blur-md px-3 py-1">{categoryLabel(book,ar)}</span>
      <div className="relative flex gap-2 items-start justify-between min-w-0">
        <h3 dir="auto" className="text-base sm:text-lg leading-snug font-black text-start break-words flex-1 min-w-0 line-clamp-3">{book.title}</h3>
        <button type="button" aria-pressed={saved} title={saved?(ar?'إزالة من القراءة لاحقًا':'Remove saved'):(ar?'القراءة لاحقًا':'Save for later')}
          aria-label={saved?(ar?'إزالة من القراءة لاحقًا':'Remove saved'):(ar?'القراءة لاحقًا':'Save for later')}
          onClick={()=>toggleSaved(book.key)}
          className={'shrink-0 w-10 h-10 rounded-xl border-2 border-white/70 bg-transparent backdrop-blur-md transition-transform hover:scale-110 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white flex items-center justify-center '+(saved?'bg-white/25':'')}>
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill={saved?'currentColor':'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinejoin="round" d="M6 4h12v17l-6-4-6 4V4z"/></svg>
        </button>
      </div>
      <p dir="auto" className="relative text-sm font-semibold text-white/90 break-words">{book.author}</p>
      <p dir="auto" className="relative text-xs font-semibold text-white/90 mt-auto break-words">{book.format==='physical'?getLocalizedSubject(book.subject,locale):book.subject}
        {book.shelf!==undefined?' · '+(ar?'رف':'Shelf')+' '+book.shelf:''}</p>
      <div className="relative mt-1 flex items-center flex-wrap gap-2">
        {book.format==='physical'
          ? <Link to="/search" className="rounded-xl bg-white/90 hover:bg-white text-slate-900 px-3 py-2 text-xs font-black transition-colors">{ar?'عرض في الدليل':'Open catalog'}</Link>
          : <a href={book.href} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-white/90 hover:bg-white text-slate-900 px-3 py-2 text-xs font-black transition-colors">{ar?'قراءة الكتاب':'Read book'}</a>}
        {inModal && tab==='saved' && <button type="button" onClick={()=>toggleCompleted(book.key)} className="rounded-xl border border-white/60 bg-white/10 px-3 py-2 text-xs font-bold transition-colors hover:bg-white/25">
          {finished?(ar?'إلغاء الإنجاز':'Undo finished'):(ar?'أنهيت قراءته':'Finished reading')}
        </button>}
      </div>
    </article>;
  };

  return <section id={variant==='challenge'?'monthly-reading-challenge':'reading-passport'} dir={dir}
    className={variant==='challenge'
      ? 'homepage-alerts relative w-full bg-transparent border-0 shadow-none p-0'
      : 'homepage-alerts relative w-full rounded-[2rem] md:rounded-[2.5rem] bg-transparent border border-slate-200/60 dark:border-slate-800/60 p-4 sm:p-6 md:p-8'}>
    {variant==='challenge' ? <div className="relative rounded-[1.75rem] border-2 border-amber-300/80 dark:border-amber-500/50 bg-gradient-to-br from-blue-600/90 via-emerald-600/90 to-teal-600/95 dark:from-blue-800/80 dark:via-emerald-800/80 dark:to-teal-900/90 text-white p-4 sm:p-5 shadow-xl shadow-emerald-900/15 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="rounded-xl bg-white/20 p-2 backdrop-blur-md transition-transform group-hover:rotate-12" aria-hidden="true">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 21V5h8v16l-4-3-4 3ZM5 5V2h14v3"/></svg>
          </span>
          <h3 className="text-base sm:text-lg font-black">{ar?'تحدي القراءة الشهري':'Monthly Reading Challenge'}</h3>
        </div>
        <strong className="text-xl sm:text-2xl font-black tabular-nums shrink-0">{count}<span className="opacity-80">/{data.goal}</span></strong>
      </div>
      <div className="flex items-center gap-3 mt-3">
        <label htmlFor="reading-goal" className="text-xs font-bold shrink-0">{ar?'الهدف':'Goal'}</label>
        <select id="reading-goal" value={data.goal} onChange={e=>setGoal(Number(e.target.value))} className="rounded-lg border border-white/40 bg-white/20 px-3 py-1.5 text-white text-xs font-black backdrop-blur-md focus-visible:outline focus-visible:outline-amber-300">
          {[1,2,3,4,5,6,8,10,12,15,20].map(n=><option key={n} className="text-slate-900" value={n}>{n}</option>)}
        </select>
        <span className="text-[11px] font-bold opacity-90">{progress===100?(ar?'اكتمل الهدف!':'Goal complete!'):(ar?'تابع الإنجاز':'Keep reading')}</span>
      </div>
      <div role="progressbar" aria-label={ar?'تقدم القراءة':'Reading progress'} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} className="mt-3 h-2.5 rounded-full bg-white/25 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-amber-200 via-white to-amber-300 transition-all duration-700" style={{width:progress+'%'}} />
      </div>
      <a href="#reading-passport" className="inline-block mt-3 text-xs font-black underline underline-offset-4 hover:text-amber-200 transition-colors">{ar?'قائمة القراءة':'Reading list'}</a>
    </div> : <>
      <header className="text-center mx-auto mb-6 max-w-3xl">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{ar?'مكتبتي واقتراحات القراءة':'My Books & Reading Suggestions'}</h2>
        <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">{ar?'كتب ملونة من الفهرس والمكتبتين الرقميتين، واقتراحات حسب نوع الحساب واهتماماتك':'Colorful titles from the catalog and digital libraries, suggested using account type and reading interests'}</p>
      </header>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={()=>setTab('suggested')} className={'rounded-xl px-4 py-2.5 text-xs sm:text-sm font-black transition-all '+(tab==='suggested'?'bg-emerald-600 text-white shadow-md':'bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700')}>{ar?'اقتراحات القراءة':'Suggestions'}</button>
          <button type="button" onClick={()=>setTab('saved')} className={'rounded-xl px-4 py-2.5 text-xs sm:text-sm font-black transition-all '+(tab==='saved'?'bg-emerald-600 text-white shadow-md':'bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700')}>{ar?'القراءة لاحقًا':'Read later'}</button>
        </div>
        <label className="text-xs font-bold text-slate-700 dark:text-slate-200">{ar?'نوع الكتاب':'Book type'}
          <select value={category} onChange={e=>setCategory(e.target.value as typeof category)}
            className="rounded-xl ms-2 px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
            <option value="all">{ar?'الكل':'All'}</option>
            <option value="physical">{ar?'ورقي':'Physical'}</option>
            <option value="ar">{ar?'رقمي عربي':'Arabic digital'}</option>
            <option value="en">{ar?'رقمي إنجليزي':'English digital'}</option>
          </select>
        </label>
      </div>
      {visible.length ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {visible.slice(0,4).map(book=>card(book,false))}
      </div> : <p className="py-8 rounded-2xl text-center font-semibold text-slate-500 dark:text-slate-300">{tab==='saved'?(ar?'قائمة القراءة لاحقًا فارغة':'Your read-later list is empty'):(ar?'لا توجد اقتراحات لهذا الاختيار':'No suggestions in this category')}</p>}
      {visible.length>4 && <button type="button" onClick={()=>setModalOpen(true)}
        className="block mx-auto mt-6 px-6 py-3 rounded-xl border-2 border-emerald-400 text-emerald-700 dark:text-emerald-300 bg-transparent hover:bg-emerald-50 dark:hover:bg-slate-900 font-black text-sm shadow-sm transition-all hover:-translate-y-0.5 active:scale-95">
        {ar?'عرض المزيد':'View more'}
      </button>}
      {modalOpen && <div role="presentation" className="fixed inset-0 z-[5000] bg-slate-950/75 backdrop-blur-md p-2 sm:p-5 flex justify-center items-center" onClick={()=>setModalOpen(false)}>
        <div role="dialog" aria-modal="true" aria-label={tab==='saved'?(ar?'قائمة القراءة لاحقًا':'Saved reading list'):(ar?'اقتراحات القراءة':'Reading suggestions')}
          className="w-full max-w-6xl max-h-[94dvh] overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] bg-white dark:bg-black border-2 border-emerald-200 dark:border-slate-700 shadow-2xl flex flex-col"
          onClick={event=>event.stopPropagation()}>
          <div className="shrink-0 flex justify-between items-center px-4 py-4 sm:px-6 border-b border-slate-200 dark:border-slate-700 gap-3">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">{tab==='saved'?(ar?'قائمة القراءة لاحقًا':'Read later'):(ar?'اقتراحات قراءة إضافية':'More reading suggestions')}</h3>
            <button type="button" onClick={()=>setModalOpen(false)} aria-label={ar?'إغلاق':'Close'} className="shrink-0 rounded-xl bg-rose-500 hover:bg-rose-600 text-white p-2.5 font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400">
              <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" fill="none" strokeWidth="2" aria-hidden="true"><path d="M5 5 19 19M19 5 5 19"/></svg>
            </button>
          </div>
          <div className="p-3 sm:p-6 overflow-y-auto overscroll-contain">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {visible.map(book=>card(book,true))}
            </div>
          </div>
        </div>
      </div>}
    </>}
  </section>;
};
export default HomeReadingHub;
