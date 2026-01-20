import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

// استيراد الصفحات
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import SmartSearchPage from './pages/SmartSearchPage';
import ReportsPage from './pages/ReportsPage';
import AboutPage from './pages/AboutPage';
import DigitalLibraryPage from './pages/DigitalLibraryPage';
import ArabicLibraryInternalPage from './pages/ArabicLibraryInternalPage';
import EnglishLibraryInternalPage from './pages/EnglishLibraryInternalPage';
import FeedbackPage from './pages/FeedbackPage';
import CreatorsPortalPage from './pages/CreatorsPortalPage';
import LibraryMapPage from './pages/LibraryMapPage';

import type { Locale } from './types';

// -------- 1. مساعد صقر العائم --------
const FloatingSaqr: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dir } = useLanguage();
  const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

  if (location.pathname === '/') return null;

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const rippleId = Date.now();
    setRipples(prev => [...prev, { id: rippleId, x: clientX - rect.left, y: clientY - rect.top }]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId));
      navigate('/smart-search');
    }, 400);
  };

  return (
    <div className={`fixed bottom-6 ${dir === 'rtl' ? 'left-6' : 'right-6'} z-50 animate-fade-up`}>
      <button
        onMouseDown={handleInteraction}
        onTouchStart={handleInteraction}
        className="group relative w-14 h-14 md:w-16 md:h-16 glass-panel rounded-[1.8rem] border-2 border-red-600/30 dark:border-red-500/40 shadow-xl flex items-center justify-center overflow-hidden hover:scale-110 active:scale-95 transition-all duration-500 bg-white/60 dark:bg-slate-900/60"
      >
        {ripples.map(r => (
          <span key={r.id} className="ripple-effect bg-red-600/40" style={{ left: r.x, top: r.y }} />
        ))}
        <img src="/saqr-avatar.png" alt="Saqr" className="w-[80%] h-[80%] object-contain animate-float" />
        <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-600 border-2 border-white dark:border-slate-900"></span>
        </span>
      </button>
    </div>
  );
};

// -------- 2. هيدر EFIPS الفخم (Reordered & Layered Hints) --------
const Header: React.FC = () => {
  const { locale, setLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [activeHint, setActiveHint] = useState<string | null>(null);

  // الترتيب المطلوب (بدون الرئيسية) مع الهوية البصرية الرسمية
  const links = [
    { path: '/search', label: locale === 'en' ? 'Books' : 'البحث بالمكتبة', icon: '🔍', hint: locale === 'en' ? 'Shelf Index' : 'فهرس الكتب', color: 'bg-red-600' },
    { path: '/smart-search', label: locale === 'en' ? 'Ask Saqr' : 'اسأل صقر', icon: '🤖', hint: locale === 'en' ? 'AI Guide' : 'المساعد الذكي', color: 'bg-green-600' },
    { path: '/digital-library', label: locale === 'en' ? 'Digital' : 'المكتبة الرقمية', icon: '📚', hint: locale === 'en' ? 'E-Books' : 'كنوز رقمية', color: 'bg-slate-900' },
    { path: '/creators', label: locale === 'en' ? 'Creators' : 'بوابة المبدعين', icon: '🎨', hint: locale === 'en' ? 'Talents' : 'إبداعات طلابنا', color: 'bg-red-600' },
    { path: '/feedback', label: locale === 'en' ? 'Ideas' : 'مقترحات', icon: '✍️', hint: locale === 'en' ? 'Contact' : 'رأيك يهمنا', color: 'bg-green-600' }, 
    { path: '/reports', label: locale === 'en' ? 'Stats' : 'تقارير', icon: '📊', hint: locale === 'en' ? 'Statistics' : 'أرقام المكتبة', color: 'bg-slate-800' },
    { path: '/map', label: locale === 'en' ? 'Map' : 'خريطة المكتبة', icon: '🗺️', hint: locale === 'en' ? 'Shelf Map' : 'موقع الرفوف', color: 'bg-red-600' },
    { path: '/about', label: locale === 'en' ? 'About' : 'عنا', icon: 'ℹ️', hint: locale === 'en' ? 'Story' : 'من نحن؟', color: 'bg-green-700' },
  ];

  return (
    <header className="sticky top-4 z-[60] px-4 md:px-10">
      <div className="glass-panel mx-auto max-w-[98rem] p-1.5 md:p-2.5 rounded-full border border-white/20 dark:border-white/5 flex items-center justify-between shadow-2xl backdrop-blur-3xl bg-white/95 dark:bg-slate-950/90 font-black transition-all">
        
        {/* اللوجو الذكي (رئيسية الموقع) */}
        <Link to="/" className="flex items-center gap-2 md:gap-3 ps-4 md:ps-6 group flex-shrink-0">
          <img src="/school-logo.png" alt="EFIPS" className="h-8 w-8 md:h-11 md:w-11 object-contain logo-smart-filter rotate-3 transition-all group-hover:scale-110" />
          <div className="hidden xl:block leading-none text-start">
            <span className="font-black text-slate-950 dark:text-white text-[7px] md:text-[9.5px] tracking-tighter block uppercase opacity-80 group-hover:text-red-600 transition-colors">
              {locale === 'en' ? "Emirates Falcon Int'l Private School" : "مدرسة صقر الإمارات الدولية الخاصة"}
            </span>
          </div>
        </Link>
        
        {/* قائمة التنقل - تدعم ظهور الهنت فوق الشريط في الجوال */}
        <nav className="flex items-center bg-black/5 dark:bg-white/5 rounded-full p-1 mx-2 overflow-x-auto no-scrollbar lg:overflow-visible overflow-y-visible">
          <div className="flex items-center gap-1">
            {links.map(l => (
              <div key={l.path} className="relative group/nav" 
                   onMouseEnter={() => setActiveHint(l.path)} 
                   onMouseLeave={() => setActiveHint(null)}
                   onTouchStart={(e) => { e.stopPropagation(); setActiveHint(activeHint === l.path ? null : l.path); }}>
                
                {/* الهنت الذكي: تم حل مشكلة الطبقات في الجوال (z-[150]) */}
                <div className={`absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 px-4 py-2 ${l.color} text-white text-[10px] rounded-2xl transition-all duration-300 pointer-events-none whitespace-nowrap shadow-2xl z-[150] 
                                ${activeHint === l.path ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-90'}`}>
                  <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 ${l.color} rotate-45`}></div>
                  {l.hint}
                </div>

                <Link 
                  to={l.path} 
                  className={`px-4 lg:px-6 py-2 md:py-3 rounded-full text-[9px] ${locale === 'ar' ? 'md:text-[8px]' : 'md:text-[10px]'} font-black transition-all flex items-center gap-2 whitespace-nowrap ${
                    location.pathname === l.path 
                      ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-lg scale-105' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-white'
                  }`}
                >
                  <span className="text-sm md:text-lg">{l.icon}</span>
                  <span className="hidden md:inline">{l.label}</span>
                </Link>
              </div>
            ))}
          </div>
        </nav>
        
        {/* أزرار الإعدادات */}
        <div className="flex items-center gap-1.5 pe-4 md:pe-6 flex-shrink-0">
          <button onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')} className="w-8 h-8 md:w-11 md:h-11 flex items-center justify-center text-slate-950 dark:text-white font-black text-[9px] md:text-[10px] border border-slate-200 dark:border-white/10 rounded-full hover:border-red-600 transition-all active:scale-90">
            {locale === 'en' ? 'AR' : 'EN'}
          </button>
          <button onClick={toggleTheme} className="w-8 h-8 md:w-11 md:h-11 flex items-center justify-center bg-slate-100 dark:bg-white/10 rounded-full text-[10px] md:text-sm shadow-inner transition-all hover:scale-110">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </header>
  );
};

// -------- 3. سياق اللغة والثيم --------
const LanguageContext = createContext<any>(null);
export const useLanguage = () => useContext(LanguageContext);
const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en'); 
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);
  return <LanguageContext.Provider value={{ locale, setLocale, dir: locale === 'ar' ? 'rtl' : 'ltr' }}>{children}</LanguageContext.Provider>;
};

const ThemeContext = createContext<any>(null);
export const useTheme = () => useContext(ThemeContext);
const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('saqr_theme') as any) || 'light');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('saqr_theme', theme);
  }, [theme]);
  return <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(prev => prev === 'light' ? 'dark' : 'light') }}>{children}</ThemeContext.Provider>;
};

// -------- 4. المكون الرئيسي --------
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <HashRouter>
          <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-700 flex flex-col selection:bg-red-600/30 relative" onClick={() => {}}>
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-50">
              <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-red-600/10 dark:bg-red-500/20 blur-[150px] rounded-full animate-pulse"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-green-600/10 dark:bg-green-500/20 blur-[150px] rounded-full animate-pulse [animation-delay:2s]"></div>
            </div>

            <Header />
            <FloatingSaqr />
            
            <main className="flex-1 relative z-10 container mx-auto p-3 md:p-8 lg:p-12">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/map" element={<LibraryMapPage />} />
                <Route path="/smart-search" element={<SmartSearchPage />} />
                <Route path="/digital-library" element={<DigitalLibraryPage />} />
                <Route path="/digital-library/arabic" element={<ArabicLibraryInternalPage />} />
                <Route path="/digital-library/english" element={<EnglishLibraryInternalPage />} />
                <Route path="/creators" element={<CreatorsPortalPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/feedback" element={<FeedbackPage />} /> 
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </main>

            <footer className="relative z-10 py-12 text-center border-t border-slate-200 dark:border-white/5 mx-6 md:mx-20 mt-10 group">
                <div className="h-1 w-16 bg-red-600 mx-auto mb-6 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.4)] group-hover:w-32 transition-all duration-700"></div>
                <p className="font-black text-[9px] md:text-xs tracking-[0.4em] uppercase text-slate-500 dark:text-slate-400">EFIPS • Library • 2026</p>
                <p className="mt-2 font-black text-slate-900 dark:text-white text-[8px] md:text-[10px] opacity-40 uppercase">&copy; Emirates Falcon Int'l. Private School</p>
            </footer>

            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-12px) rotate(3deg); } }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .glass-panel { border: 1px solid rgba(255, 255, 255, 0.1); }
                .dark .logo-smart-filter { filter: brightness(0) invert(1); }
            `}</style>
          </div>
        </HashRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
