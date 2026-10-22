import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage, useTheme } from '../App';

type DemoBook = {
  id: number;
  titleAr: string;
  titleEn: string;
  authorAr: string;
  authorEn: string;
  category: 'science' | 'story' | 'history' | 'technology';
  shelf: string;
  row: string;
  descriptionAr: string;
  descriptionEn: string;
};

type DemoMessage = { role: 'user' | 'assistant'; text: string };

const DEMO_BOOKS: DemoBook[] = [
  {
    id: 1,
    titleAr: 'رحلة إلى الفضاء',
    titleEn: 'Journey Through Space',
    authorAr: 'أحمد سالم',
    authorEn: 'Ahmed Salem',
    category: 'science',
    shelf: 'A-03',
    row: '2',
    descriptionAr: 'جولة مبسطة بين الكواكب والنجوم والمجرات، مناسبة للقراء الصغار ومحبي العلوم.',
    descriptionEn: 'A friendly tour of planets, stars, and galaxies for young readers and curious minds.'
  },
  {
    id: 2,
    titleAr: 'أسرار المحيط',
    titleEn: 'Secrets of the Ocean',
    authorAr: 'مريم خالد',
    authorEn: 'Mariam Khalid',
    category: 'science',
    shelf: 'A-05',
    row: '1',
    descriptionAr: 'اكتشف الشعاب المرجانية والكائنات البحرية وأهمية المحافظة على البيئة.',
    descriptionEn: 'Explore coral reefs, sea life, and why protecting our oceans matters.'
  },
  {
    id: 3,
    titleAr: 'مغامرات في الصحراء',
    titleEn: 'Desert Adventures',
    authorAr: 'ليلى منصور',
    authorEn: 'Layla Mansour',
    category: 'story',
    shelf: 'B-02',
    row: '4',
    descriptionAr: 'قصة مشوقة عن التعاون والشجاعة واكتشاف جمال الطبيعة في الصحراء.',
    descriptionEn: 'An exciting story about teamwork, courage, and discovering the beauty of the desert.'
  },
  {
    id: 4,
    titleAr: 'حكايات من الإمارات',
    titleEn: 'Tales from the UAE',
    authorAr: 'سارة النعيمي',
    authorEn: 'Sara Al Nuaimi',
    category: 'history',
    shelf: 'C-01',
    row: '3',
    descriptionAr: 'تعرف إلى ملامح من التراث الإماراتي والعادات والحكايات الشعبية.',
    descriptionEn: 'Discover UAE heritage, traditions, and traditional folk stories.'
  },
  {
    id: 5,
    titleAr: 'روبوتي الصغير',
    titleEn: 'My Little Robot',
    authorAr: 'خالد يوسف',
    authorEn: 'Khalid Yousuf',
    category: 'technology',
    shelf: 'D-04',
    row: '2',
    descriptionAr: 'مدخل ممتع إلى التفكير الحاسوبي والروبوتات من خلال أنشطة بسيطة.',
    descriptionEn: 'A playful introduction to computational thinking and robotics through simple activities.'
  },
  {
    id: 6,
    titleAr: 'مختبر التجارب الممتعة',
    titleEn: 'The Fun Science Lab',
    authorAr: 'نور إبراهيم',
    authorEn: 'Noor Ibrahim',
    category: 'science',
    shelf: 'A-02',
    row: '5',
    descriptionAr: 'تجارب علمية آمنة تشرح مفاهيم أساسية بطريقة عملية وممتعة.',
    descriptionEn: 'Safe, hands-on experiments that explain core science concepts in a fun way.'
  }
];

const categoryNames = {
  ar: { all: 'كل التصنيفات', science: 'العلوم', story: 'قصص وروايات', history: 'التراث والتاريخ', technology: 'التكنولوجيا' },
  en: { all: 'All categories', science: 'Science', story: 'Stories', history: 'Heritage & history', technology: 'Technology' }
};

export default function TutorialPage() {
  const { locale, setLocale, dir } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isAr = locale === 'ar';
  const [activeTab, setActiveTab] = useState<'search' | 'assistant' | 'features'>('search');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [selectedBook, setSelectedBook] = useState<DemoBook | null>(null);
  const [notice, setNotice] = useState('');
  const [assistantInput, setAssistantInput] = useState('');
  const [messages, setMessages] = useState<DemoMessage[]>([
    { role: 'assistant', text: isAr ? 'أهلاً بك! أنا صقر في وضع التجربة. اسألني عن كتاب أو موضوع تحب اكتشافه.' : 'Welcome! I am Saqr in demo mode. Ask me about a book or a topic you would like to explore.' }
  ]);

  const filteredBooks = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return DEMO_BOOKS.filter((book) => {
      const matchesCategory = category === 'all' || book.category === category;
      const searchable = [book.titleAr, book.titleEn, book.authorAr, book.authorEn, book.descriptionAr, book.descriptionEn].join(' ').toLocaleLowerCase();
      return matchesCategory && (!normalized || searchable.includes(normalized));
    });
  }, [query, category]);

  const sendDemoMessage = (suggestion?: string) => {
    const text = (suggestion ?? assistantInput).trim();
    if (!text) return;
    const lower = text.toLocaleLowerCase();
    let answer = isAr
      ? 'يمكنك البدء من البحث التجريبي واختيار كتاب لعرض وصفه ومكانه الافتراضي. تذكّر أن جميع النتائج هنا للتوضيح فقط.'
      : 'Start with the demo search and choose a book to see its description and sample shelf location. Remember, all results here are examples only.';
    if (/space|فضاء|كوكب|planet|star|نجوم/.test(lower)) {
      answer = isAr
        ? 'أقترح عليك «رحلة إلى الفضاء». ستجد في بطاقة الكتاب وصفاً مبسطاً للكواكب والنجوم، ومكانه التجريبي هو الرف A-03.'
        : 'Try “Journey Through Space”. Its sample card introduces planets and stars. The demo shelf location is A-03.';
    } else if (/story|stories|قصة|قصص|مغامر|adventure/.test(lower)) {
      answer = isAr
        ? 'جرّب كتاب «مغامرات في الصحراء»؛ فهو يتناول التعاون والشجاعة. افتح بطاقة الكتاب لتشاهد تفاصيله التجريبية.'
        : 'Try “Desert Adventures”, a sample story about teamwork and courage. Open its card to see the demo details.';
    } else if (/robot|تقنية|تكنولوجيا|روبوت|technology/.test(lower)) {
      answer = isAr
        ? 'كتاب «روبوتي الصغير» اختيار مناسب للتعرّف إلى الروبوتات والتفكير الحاسوبي. يمكنك العثور عليه ضمن تصنيف التكنولوجيا.'
        : '“My Little Robot” is a good starting point for robotics and computational thinking. Find it under Technology.';
    } else if (/borrow|استعار|إعارة|استعارة/.test(lower)) {
      answer = isAr
        ? 'في الموقع الفعلي قد تختلف إجراءات الإعارة حسب صلاحيات حسابك. في صفحة التجربة لن يتم تسجيل أي استعارة أو تعديل أي بيانات.'
        : 'In the real site, borrowing depends on your account permissions. This tutorial will not record a loan or change any real data.';
    }
    setMessages((prev) => [...prev, { role: 'user', text }, { role: 'assistant', text: answer }]);
    setAssistantInput('');
    setNotice('');
  };

  const tabLabel = (tab: 'search' | 'assistant' | 'features') => {
    if (tab === 'search') return isAr ? 'البحث عن الكتب' : 'Find a book';
    if (tab === 'assistant') return isAr ? 'جرّب صقر الذكي' : 'Try Saqr AI';
    return isAr ? 'استكشف المزايا' : 'Explore features';
  };

  return (
    <div dir={dir} className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src="/school-logo.png" alt="EFIPS" className="h-10 w-10 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <span className="leading-tight">
              <span className="block text-sm font-black sm:text-base">{isAr ? 'مكتبة صقر الإمارات' : 'EFIPS Library'}</span>
              <span className="block text-[10px] font-semibold text-slate-500 sm:text-xs">{isAr ? 'جولة تفاعلية للزائرين' : 'Interactive visitor tour'}</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-black text-amber-800 sm:inline-flex dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300">
              {isAr ? 'وضع تجريبي' : 'DEMO MODE'}
            </span>
            <button type="button" onClick={() => setLocale(isAr ? 'en' : 'ar')} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {isAr ? 'English' : 'العربية'}
            </button>
            <button type="button" onClick={toggleTheme} aria-label={isAr ? 'تبديل المظهر' : 'Toggle theme'} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20.8 13A8.5 8.5 0 0 1 11 3.2 8.5 8.5 0 1 0 20.8 13Z" /></svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-12 pt-7 sm:px-6 sm:pt-10 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 p-6 text-white shadow-xl sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.35fr_.65fr]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-emerald-100">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                {isAr ? 'اكتشف المكتبة خطوة بخطوة' : 'Discover the library, step by step'}
              </div>
              <h1 className="max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                {isAr ? 'رحلتك إلى المعرفة تبدأ من هنا' : 'Your journey to knowledge starts here'}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/90 sm:text-base">
                {isAr ? 'استكشف طريقة البحث عن الكتب، وتعرّف على صقر الذكي، وشاهد كيف تساعدك أدوات المكتبة — وكل ذلك ببيانات تجريبية لا تتصل بسجلات المدرسة.' : 'Explore book search, meet Saqr AI, and see how the library tools work — all with sample data that never connects to school records.'}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={() => { setActiveTab('search'); document.getElementById('tutorial-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-emerald-950 shadow-lg shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-emerald-300">
                  {isAr ? 'ابدأ التجربة' : 'Start exploring'}
                </button>
                <button type="button" onClick={() => { setActiveTab('features'); document.getElementById('tutorial-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20">
                  {isAr ? 'تعرّف على المزايا' : 'See what you can do'}
                </button>
              </div>
            </div>
            <div className="mx-auto w-full max-w-sm">
              <div className="rounded-[1.75rem] border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-300/15 text-emerald-200">
                    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" /><path strokeLinecap="round" d="M4 6v15m4-13h8m-8 4h8" /></svg>
                  </div>
                  <span className="rounded-full border border-emerald-200/30 bg-emerald-300/10 px-3 py-1 text-[11px] font-bold text-emerald-100">{isAr ? 'بيانات افتراضية' : 'Sample records'}</span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/20 p-4">
                    <p className="text-2xl font-black">06</p>
                    <p className="mt-1 text-xs text-slate-200">{isAr ? 'كتب للتجربة' : 'Demo books'}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/20 p-4">
                    <p className="text-2xl font-black">03</p>
                    <p className="mt-1 text-xs text-slate-200">{isAr ? 'طرق للاستكشاف' : 'Ways to explore'}</p>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-6 text-emerald-50/80">{isAr ? 'يمكنك البحث وفتح بطاقات الكتب وتجربة أسئلة المساعد. لا توجد إعارات أو سجلات حقيقية في هذه الصفحة.' : 'Search, open book cards, and try assistant prompts. This page does not create real loans or records.'}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-950 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-100">
          <div className="flex items-start gap-3">
            <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 11v5m0-8h.01" /></svg>
            <p className="text-xs font-semibold leading-6 sm:text-sm">
              {isAr ? 'تنبيه: هذه نسخة تعريفية فقط. الكتب والمؤلفون ومواقع الأرفف وردود صقر بيانات تجريبية، وكل إجراء داخل الصفحة محلي ولا يُرسل إلى قاعدة البيانات.' : 'Notice: this is a guided demo. Books, authors, shelf locations, and Saqr replies are sample content. Actions stay inside this page and are never sent to the database.'}
            </p>
          </div>
        </section>

        <section id="tutorial-workspace" className="scroll-mt-24 mt-8">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">{isAr ? 'منطقة التفاعل' : 'Try it yourself'}</p>
              <h2 className="mt-1 text-2xl font-black sm:text-3xl">{isAr ? 'جرّب أدوات المكتبة' : 'Explore the library tools'}</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">{isAr ? 'اختر إحدى التجارب بالأسفل. يمكنك العودة والتبديل بينها في أي وقت.' : 'Choose a demo below. You can switch between experiences whenever you like.'}</p>
          </div>

          <div className="mb-5 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {(['search', 'assistant', 'features'] as const).map((tab) => (
              <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={'flex-1 rounded-xl px-4 py-3 text-sm font-black transition ' + (activeTab === tab ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800')}>
                {tabLabel(tab)}
              </button>
            ))}
          </div>

          {activeTab === 'search' && (
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                <div className="flex-1">
                  <label htmlFor="demo-search" className="mb-2 block text-sm font-black">{isAr ? 'ابحث بعنوان كتاب أو مؤلف أو موضوع' : 'Search by title, author, or topic'}</label>
                  <div className="relative">
                    <svg viewBox="0 0 24 24" className={'absolute top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 ' + (isAr ? 'right-4' : 'left-4')} fill="none" stroke="currentColor" strokeWidth="2"><circle cx="10.8" cy="10.8" r="6.8" /><path strokeLinecap="round" d="m16 16 5 5" /></svg>
                    <input id="demo-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={isAr ? 'مثال: الفضاء، العلوم، روبوت...' : 'Try: space, science, robot...'} className={'w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-900 ' + (isAr ? 'pr-12 pl-4' : 'pl-12 pr-4')} />
                  </div>
                </div>
                <div className="w-full lg:w-64">
                  <label htmlFor="demo-category" className="mb-2 block text-sm font-black">{isAr ? 'التصنيف' : 'Category'}</label>
                  <select id="demo-category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800">
                    <option value="all">{isAr ? categoryNames.ar.all : categoryNames.en.all}</option>
                    <option value="science">{isAr ? categoryNames.ar.science : categoryNames.en.science}</option>
                    <option value="story">{isAr ? categoryNames.ar.story : categoryNames.en.story}</option>
                    <option value="history">{isAr ? categoryNames.ar.history : categoryNames.en.history}</option>
                    <option value="technology">{isAr ? categoryNames.ar.technology : categoryNames.en.technology}</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{isAr ? 'النتائج التجريبية' : 'Demo results'} <span className="ms-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">{filteredBooks.length}</span></p>
                <button type="button" onClick={() => { setQuery(''); setCategory('all'); setNotice(''); }} className="text-xs font-black text-emerald-700 hover:underline dark:text-emerald-400">{isAr ? 'إعادة ضبط البحث' : 'Reset search'}</button>
              </div>

              {filteredBooks.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="font-black">{isAr ? 'لا توجد نتائج مطابقة' : 'No matching books'}</p>
                  <p className="mt-2 text-sm text-slate-500">{isAr ? 'جرّب كلمة أخرى أو اختر كل التصنيفات.' : 'Try another keyword or select all categories.'}</p>
                </div>
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredBooks.map((book, index) => (
                    <article key={book.id} className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-4 transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-800">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-cyan-100 text-emerald-800 dark:from-emerald-950 dark:to-cyan-950 dark:text-emerald-300">
                          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" /><path strokeLinecap="round" d="M4 6v15m4-13h8m-8 4h8" /></svg>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">{isAr ? categoryNames.ar[book.category] : categoryNames.en[book.category]}</span>
                      </div>
                      <h3 className="mt-4 text-lg font-black leading-snug">{isAr ? book.titleAr : book.titleEn}</h3>
                      <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{isAr ? 'تأليف: ' + book.authorAr : 'By ' + book.authorEn}</p>
                      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{isAr ? book.descriptionAr : book.descriptionEn}</p>
                      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                        <span className="text-[11px] font-bold text-slate-500">{isAr ? 'رف تجريبي' : 'Sample shelf'}: {book.shelf}</span>
                        <button type="button" onClick={() => { setSelectedBook(book); setNotice(''); }} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white transition hover:bg-emerald-700">{isAr ? 'التفاصيل' : 'Details'}</button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'assistant' && (
            <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
              <aside className="rounded-[1.75rem] bg-gradient-to-br from-emerald-950 to-slate-900 p-6 text-white shadow-lg">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-emerald-200">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3a7 7 0 0 0-7 7v3a3 3 0 0 0 3 3h1v-5H7m10 0h-2v5h1a3 3 0 0 0 3-3v-3a7 7 0 0 0-7-7Z" /><path strokeLinecap="round" d="M9 20h6m-6-3v3m6-3v3" /></svg>
                </div>
                <h3 className="mt-5 text-xl font-black">{isAr ? 'صقر الذكي' : 'Saqr AI Assistant'}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-200">{isAr ? 'اكتب سؤالك أو اختر مثالاً جاهزاً. الردود هنا معدّة مسبقاً للتوضيح، وليست اتصالاً بخدمة ذكاء اصطناعي.' : 'Type a question or choose a suggested prompt. Replies are prepared examples, not a live AI service.'}</p>
                <div className="mt-6 space-y-2">
                  <p className="text-xs font-black uppercase tracking-wider text-emerald-200">{isAr ? 'جرّب سؤالاً' : 'Try a prompt'}</p>
                  {[
                    isAr ? 'أريد كتاباً عن الفضاء' : 'Recommend a space book',
                    isAr ? 'اقترح قصة ممتعة' : 'Suggest an adventure story',
                    isAr ? 'هل يمكنني استعارة كتاب؟' : 'Can I borrow a book?'
                  ].map((prompt) => (
                    <button type="button" key={prompt} onClick={() => sendDemoMessage(prompt)} className="block w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-start text-xs font-bold text-white transition hover:bg-white/15">{prompt}</button>
                  ))}
                </div>
              </aside>
              <div className="flex min-h-[480px] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
                  <div>
                    <p className="font-black">{isAr ? 'محادثة توضيحية' : 'Demo conversation'}</p>
                    <p className="mt-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">{isAr ? 'لا يتم إرسال رسائل إلى الخارج' : 'Messages stay in this page'}</p>
                  </div>
                  <button type="button" onClick={() => setMessages([{ role: 'assistant', text: isAr ? 'أهلاً بك! أنا صقر في وضع التجربة. اسألني عن كتاب أو موضوع تحب اكتشافه.' : 'Welcome! I am Saqr in demo mode. Ask me about a book or a topic you would like to explore.' }])} className="rounded-lg px-3 py-2 text-xs font-black text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">{isAr ? 'محادثة جديدة' : 'Reset chat'}</button>
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
                  {messages.map((message, index) => (
                    <div key={index} className={'flex ' + (message.role === 'user' ? (isAr ? 'justify-start' : 'justify-end') : (isAr ? 'justify-end' : 'justify-start'))}>
                      <div className={'max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ' + (message.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100')}>
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); sendDemoMessage(); }} className="flex gap-2 border-t border-slate-100 p-3 dark:border-slate-800 sm:p-4">
                  <input value={assistantInput} onChange={(e) => setAssistantInput(e.target.value)} placeholder={isAr ? 'اكتب سؤالك هنا...' : 'Ask a sample question...'} className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800" />
                  <button type="submit" className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white hover:bg-emerald-700">{isAr ? 'إرسال' : 'Send'}</button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[
                { number: '01', title: isAr ? 'البحث الذكي عن الكتب' : 'Book discovery', description: isAr ? 'ابحث بالعنوان أو المؤلف أو الموضوع، وفلتر النتائج حسب التصنيف.' : 'Search by title, author, or topic, then filter results by category.', action: () => setActiveTab('search'), actionLabel: isAr ? 'جرّب البحث' : 'Try search' },
                { number: '02', title: isAr ? 'تفاصيل ومكان الكتاب' : 'Book details & location', description: isAr ? 'افتح بطاقة أي كتاب للاطلاع على الوصف وموقع الرف التجريبي.' : 'Open any book card to view a description and sample shelf location.', action: () => setActiveTab('search'), actionLabel: isAr ? 'عرض الكتب' : 'Browse books' },
                { number: '03', title: isAr ? 'صقر المساعد الذكي' : 'Saqr assistant', description: isAr ? 'شاهد كيف يمكن للمساعد اقتراح كتب والإجابة عن أسئلة شائعة.' : 'See how the assistant can recommend books and answer common questions.', action: () => setActiveTab('assistant'), actionLabel: isAr ? 'جرّب صقر' : 'Try Saqr' },
                { number: '04', title: isAr ? 'مكتبة رقمية' : 'Digital library', description: isAr ? 'تعرّف على فكرة الوصول إلى مصادر القراءة الرقمية ضمن مساحة المكتبة.' : 'Learn how digital reading resources fit into the library experience.', action: () => setNotice(isAr ? 'في الموقع الفعلي قد تتوفر مصادر رقمية حسب الصلاحيات. هذه الصفحة لا تفتح محتوى محمياً.' : 'Digital resources in the live site may depend on your permissions. This demo does not open protected content.'), actionLabel: isAr ? 'معلومة' : 'Learn more' },
                { number: '05', title: isAr ? 'الأنشطة والفعاليات' : 'Activities & events', description: isAr ? 'استكشف كيف يمكن للصفحات التعليمية والأنشطة أن تدعم تجربة القراءة.' : 'Explore how learning pages and activities can complement reading.', action: () => setNotice(isAr ? 'هذه معاينة تعريفية؛ لن يتم حفظ أي مشاركة أو نتيجة.' : 'This is a preview only; no participation or result is saved.'), actionLabel: isAr ? 'معلومة' : 'Learn more' },
                { number: '06', title: isAr ? 'واجهة ثنائية اللغة' : 'Bilingual interface', description: isAr ? 'بدّل بين العربية والإنجليزية، وجرب اتجاه الكتابة وتوافق الشاشة.' : 'Switch between Arabic and English and see the layout adapt to text direction.', action: () => setLocale(isAr ? 'en' : 'ar'), actionLabel: isAr ? 'Switch to English' : 'التبديل للعربية' }
              ].map((feature) => (
                <article key={feature.number} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <span className="inline-flex rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">{feature.number}</span>
                  <h3 className="mt-4 text-lg font-black">{feature.title}</h3>
                  <p className="mt-2 min-h-16 text-sm leading-6 text-slate-500 dark:text-slate-400">{feature.description}</p>
                  <button type="button" onClick={feature.action} className="mt-4 rounded-xl border border-emerald-200 px-4 py-2.5 text-xs font-black text-emerald-800 transition hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-950/40">{feature.actionLabel}</button>
                </article>
              ))}
            </div>
          )}
          {notice && <div role="status" className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold leading-6 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">{notice}</div>}
        </section>

        <section className="mt-12">
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">{isAr ? 'خطوات بسيطة' : 'A simple journey'}</p>
            <h2 className="mt-1 text-2xl font-black">{isAr ? 'كيف تستخدم المكتبة؟' : 'How to get started'}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { step: '1', title: isAr ? 'اكتشف' : 'Discover', body: isAr ? 'ابدأ بالبحث عن كتاب أو تصفح التصنيفات المختلفة.' : 'Search for a title or explore the available categories.' },
              { step: '2', title: isAr ? 'تعرّف' : 'Learn', body: isAr ? 'افتح التفاصيل لمعرفة وصف الكتاب وموقعه الافتراضي.' : 'Open a book card to learn about its description and sample location.' },
              { step: '3', title: isAr ? 'اسأل صقر' : 'Ask Saqr', body: isAr ? 'جرّب سؤالاً مقترحاً لترى مثالاً على طريقة استخدام المساعد.' : 'Try a suggested prompt to see an example assistant interaction.' }
            ].map((item) => (
              <div key={item.step} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-lg font-black text-white">{item.step}</span>
                <div><h3 className="font-black">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{item.body}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-black sm:text-2xl">{isAr ? 'هل أنت مستعد للدخول إلى المكتبة الفعلية؟' : 'Ready to visit the real library?'}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">{isAr ? 'انتهيت من الجولة؟ انتقل إلى بوابة الدخول لاستخدام الخدمات التي تتطلب حساباً مدرسياً.' : 'Finished the tour? Continue to the sign-in page for services that require a school account.'}</p>
            </div>
            <Link to="/" className="shrink-0 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500">{isAr ? 'العودة لتسجيل الدخول' : 'Go to sign in'}</Link>
          </div>
        </section>
      </main>

      {selectedBook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" onClick={() => setSelectedBook(null)}>
          <div role="dialog" aria-modal="true" aria-labelledby="demo-book-title" className="w-full max-w-lg rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" /><path strokeLinecap="round" d="M4 6v15m4-13h8m-8 4h8" /></svg>
              </div>
              <button type="button" onClick={() => setSelectedBook(null)} aria-label={isAr ? 'إغلاق' : 'Close'} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-black text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">×</button>
            </div>
            <h2 id="demo-book-title" className="mt-5 text-2xl font-black">{isAr ? selectedBook.titleAr : selectedBook.titleEn}</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">{isAr ? 'تأليف: ' + selectedBook.authorAr : 'By ' + selectedBook.authorEn}</p>
            <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-200">{isAr ? selectedBook.descriptionAr : selectedBook.descriptionEn}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800"><p className="text-xs text-slate-500">{isAr ? 'الرف التجريبي' : 'Sample shelf'}</p><p className="mt-1 font-black">{selectedBook.shelf}</p></div>
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800"><p className="text-xs text-slate-500">{isAr ? 'الصف التجريبي' : 'Sample row'}</p><p className="mt-1 font-black">{selectedBook.row}</p></div>
            </div>
            <button type="button" onClick={() => setNotice(isAr ? 'هذه تجربة فقط: لم يتم تسجيل استعارة ولم تُرسل أي بيانات.' : 'Demo only: no loan has been recorded and no data was sent.')} className="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-3 font-black text-white transition hover:bg-emerald-700">{isAr ? 'جرّب زر الاستعارة' : 'Try the borrow action'}</button>
            <p className="mt-3 text-center text-xs leading-5 text-slate-500">{isAr ? 'الزر يعرض رسالة توضيحية فقط ولا ينشئ طلباً حقيقياً.' : 'This button only displays a demo notice. It does not create a real request.'}</p>
          </div>
        </div>
      )}

      <footer className="border-t border-slate-200 px-4 py-6 text-center text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
        EFIPS Library · {isAr ? 'صفحة تعريفية تجريبية' : 'Interactive demo page'}
      </footer>
    </div>
  );
}
