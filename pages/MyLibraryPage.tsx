import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';
import { bookData, getLocalizedSubject, type Book } from '../api/bookData';

// Device-only reading hub: no unauthenticated write to students.points or private DB rows.
// Library loans and due dates remain on the existing homepage until ownership is verified server-side.
type ReadingState = { saved: string[]; completed: string[]; completedOn: Record<string, string>; goal: number };
const initial: ReadingState = { saved: [], completed: [], completedOn: {}, goal: 3 };
const safeText = (v: unknown) => String(v ?? '').trim().toLowerCase();
const bookKey = (b: Book) => [b.title, b.author, b.shelf, b.row].map(safeText).join('|');
const MyLibraryPage: React.FC = () => {
  const { locale, dir } = useLanguage();
  const ar = locale === 'ar';
  const user = useMemo(() => { try { return JSON.parse(localStorage.getItem('current_user') || '{}'); } catch { return {}; } }, []);
  const role = typeof window === 'undefined' ? '' : (localStorage.getItem('user_type') || '');
  const uid = String(user.student_id || user.teacher_id || user.user_id || user.id || '').trim();
  const storageKey = 'efips-reading-passport-v1:' + role + ':' + uid;
  const [state, setState] = useState<ReadingState>(initial);
  const [ready, setReady] = useState(false);
  const [topic, setTopic] = useState('');
  const [view, setView] = useState<'saved' | 'recommendations'>('saved');
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (raw && Array.isArray(raw.saved) && Array.isArray(raw.completed)) {
        setState({saved:raw.saved.filter((x:unknown)=>typeof x==='string').slice(0,500),
          completed:raw.completed.filter((x:unknown)=>typeof x==='string').slice(0,500),
          completedOn:raw.completedOn && typeof raw.completedOn === 'object' ? raw.completedOn : {},
          goal:Math.max(1,Math.min(20,Number(raw.goal)||3))});
      } else setState(initial);
    } catch { setState(initial); }
    setReady(true);
  }, [storageKey]);
  useEffect(() => { if (ready) { try {localStorage.setItem(storageKey,JSON.stringify(state));} catch {} } }, [storageKey,ready,state]);
  const knownBooks = useMemo(() => new Map(bookData.map(b=>[bookKey(b),b])),[]);
  const savedBooks = state.saved.map(k=>knownBooks.get(k)).filter((x):x is Book=>Boolean(x));
  const completedBooks = state.completed.map(k=>knownBooks.get(k)).filter((x):x is Book=>Boolean(x));
  const subjects = useMemo(()=>Array.from(new Set(bookData.map(b=>b.subject))).sort((a,b)=>getLocalizedSubject(a,locale).localeCompare(getLocalizedSubject(b,locale))),[locale]);
  const recentlyReadSubjects = completedBooks.slice(-5).map(b=>b.subject);
  const suggestions = useMemo(()=>{
    const wanted = topic || (recentlyReadSubjects.length ? recentlyReadSubjects[recentlyReadSubjects.length - 1] : '');
    return bookData.filter(b=>(!wanted||b.subject===wanted)&&!state.completed.includes(bookKey(b)))
      .sort((a,b)=>(a.title.localeCompare(b.title,locale))).slice(0,12);
  },[topic,locale,state.completed, recentlyReadSubjects.join('|')]);
  const now = new Date();
  const monthKey = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0');
  const monthCount = state.completed.filter(k=>(state.completedOn[k]||'').startsWith(monthKey)).length;
  const progress = Math.min(100,Math.round(monthCount/state.goal*100));
  const toggleSave = (b:Book) => {const key=bookKey(b);setState(prev=>({...prev,saved:prev.saved.includes(key)?prev.saved.filter(k=>k!==key):[...prev.saved,key]}));};
  const toggleComplete = (b:Book) => {const key=bookKey(b);setState(prev=>{
    const done=prev.completed.includes(key);
    const completedOn={...prev.completedOn};
    if(done) delete completedOn[key]; else completedOn[key]=new Date().toISOString().slice(0,10);
    return {...prev,completed:done?prev.completed.filter(k=>k!==key):[...prev.completed,key],completedOn};
  });};
  const card = (b:Book) => {
    const key=bookKey(b), saved=state.saved.includes(key),done=state.completed.includes(key);
    return <article key={key} className="rounded-3xl border border-emerald-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-lg transition-shadow flex flex-col gap-3">
      <span className="self-start rounded-full px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 text-xs font-bold">{getLocalizedSubject(b.subject,locale)}</span>
      <h3 dir="auto" className="font-black text-slate-900 dark:text-white text-lg leading-relaxed">{b.title}</h3>
      <p dir="auto" className="text-sm font-medium text-slate-500 dark:text-slate-300">{b.author}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{ar?'الرف':'Shelf'} {b.shelf} · {ar?'الصف':'Row'} {b.row}</p>
      <div className="flex gap-2 flex-wrap mt-auto">
        <button onClick={()=>toggleSave(b)} className="rounded-xl px-3 py-2 text-xs font-bold border border-emerald-500 text-emerald-700 dark:text-emerald-300">{saved?(ar?'إزالة من قائمتي':'Remove saved'):(ar?'حفظ للقراءة':'Save to read')}</button>
        <button onClick={()=>toggleComplete(b)} className="rounded-xl px-3 py-2 text-xs font-bold bg-emerald-600 text-white">{done?(ar?'إلغاء علامة قرأته':'Undo completed'):(ar?'قرأت الكتاب':'Mark as read')}</button>
      </div>
    </article>;
  };
  return <main dir={dir} className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white pt-24 pb-16 px-4">
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="rounded-3xl bg-emerald-50 dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 px-6 py-7">
        <Link to="/home" className="text-emerald-700 dark:text-emerald-300 font-bold text-sm">← {ar?'العودة للرئيسية':'Back to home'}</Link>
        <h1 className="text-3xl font-black mt-3">{ar?'مكتبتي الشخصية':'My Personal Library'}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{ar?'احفظ الكتب المفضلة، تابع تحدي القراءة الشهري، واكتشف كتبًا من فهرس المكتبة.':'Save books, follow a monthly reading challenge, and discover titles from the library catalog.'}</p>
        <p className="mt-2 text-xs text-amber-700 dark:text-amber-300 font-semibold">{ar?'هذه بيانات قراءة شخصية على هذا الجهاز فقط؛ ليست نقاطًا رسمية ولا إثباتًا للاستعارة.':'Your reading notes are stored only on this device; they are not official points or borrowing records.'}</p>
      </header>
      <section className="grid md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"><div className="text-sm text-slate-500">{ar?'كتب محفوظة':'Saved titles'}</div><strong className="text-3xl">{savedBooks.length}</strong></div>
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"><div className="text-sm text-slate-500">{ar?'قرأت هذا الشهر':'Read this month'}</div><strong className="text-3xl">{monthCount}</strong></div>
        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-slate-900 border border-emerald-200 dark:border-slate-700"><div className="text-sm font-bold">{ar?'جواز القارئ – التحدي الشهري':'Reading Passport – Monthly Challenge'}</div><div className="flex items-center gap-2 mt-2"><strong className="text-2xl">{monthCount}/{state.goal}</strong><select aria-label={ar?'هدف القراءة الشهري':'Monthly goal'} value={state.goal} onChange={e=>setState(prev=>({...prev,goal:Number(e.target.value)}))} className="text-sm text-slate-900 rounded-lg border bg-white p-1">{[1,2,3,4,5,6,8,10,12,15,20].map(n=><option key={n} value={n}>{n}</option>)}</select></div><div role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} className="h-3 bg-emerald-100 dark:bg-slate-700 rounded-full overflow-hidden mt-3"><div className="bg-emerald-500 h-full transition-all" style={{width:progress+'%'}}/></div><p className="mt-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">{progress===100?(ar?'أكملت هدف القراءة لهذا الشهر!':'Monthly reading goal complete!'):(ar?'شجّع نفسك على القراءة':'Keep reading!')}</p></div>
      </section>
      <section className="rounded-3xl border border-amber-200 dark:border-slate-700 bg-amber-50/60 dark:bg-slate-900 px-5 py-4 flex flex-wrap justify-between gap-3 items-center"><div><h2 className="font-black">{ar?'استعاراتي وتواريخ الإرجاع':'My loans and return dates'}</h2><p className="text-sm text-slate-600 dark:text-slate-300">{ar?'تظهر الاستعارات الفعلية وتنبيهات موعد الإرجاع في الصفحة الرئيسية.':'Actual loans and due-date reminders are shown on the homepage.'}</p></div><Link to="/home" className="font-bold text-emerald-700 dark:text-emerald-300 underline">{ar?'عرض الاستعارات':'View loans'}</Link></section>
      <section>
        <div className="flex flex-wrap gap-3 mb-5">
          <button onClick={()=>setView('saved')} className={'rounded-full px-5 py-3 text-sm font-black '+(view==='saved'?'bg-emerald-600 text-white':'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-white')}>{ar?'قائمة قراءتي':'My reading list'}</button>
          <button onClick={()=>setView('recommendations')} className={'rounded-full px-5 py-3 text-sm font-black '+(view==='recommendations'?'bg-emerald-600 text-white':'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-white')}>{ar?'كتب مقترحة لك':'Suggested books'}</button>
        </div>
        {view==='recommendations'&& <div className="mb-6"><label className="text-sm font-bold" htmlFor="topicChoice">{ar?'اختر الموضوع الذي تفضله':'Choose a favorite subject'}</label><select id="topicChoice" className="block mt-2 max-w-md w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-4 py-3" value={topic} onChange={e=>setTopic(e.target.value)}><option value="">{ar?'اقتراحات عامة':'General suggestions'}</option>{subjects.map(s=><option value={s} key={s}>{getLocalizedSubject(s,locale)}</option>)}</select><p className="text-xs text-slate-500 mt-2">{ar?'اقتراحات من عناوين فهرس المكتبة وليست نتائج صقر الذكي أو تقييمًا لملاءمة العمر.':'Catalog-based suggestions, not Saqr AI outputs or an age-suitability rating.'}</p></div>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{(view==='saved'?savedBooks:suggestions).map(card)}</div>
        {view==='saved'&&!savedBooks.length&&<p className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300">{ar?'لم تحفظ أي كتاب بعد. افتح الاقتراحات واختر كتابًا.':'No saved books yet. Explore suggestions and save a title.'}</p>}
      </section>
    </div>
  </main>;
};
export default MyLibraryPage;
