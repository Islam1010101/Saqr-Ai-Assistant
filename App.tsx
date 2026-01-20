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

import type { Locale } from './types';

// -------- 1. مساعد صقر العائم (Neon Floating Assistant) --------
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
    <div className={`fixed bottom-8 ${dir === 'rtl' ? 'left-8' : 'right-8'} z-50 animate-fade-up`}>
      <button
        onMouseDown={handleInteraction}
        onTouchStart={handleInteraction}
        className="group relative w-20 h-20 md:w-24 md:h-24 glass-panel rounded-[2.5rem] border-2 border-red-600/30 dark:border-red-500/40 shadow-[0_0_30px_rgba(220,38,38,0.2)] dark:shadow-[0_0_50px_rgba(220,38,38,0.4)] flex items-center justify-center overflow-hidden hover:scale-110 active:scale-95 transition-all duration-500 bg-white/40 dark:bg-slate-900/60"
      >
        {ripples.map(r => (
          <span key={r.id} className="ripple-effect bg-red-600/40" style={{ left: r.x, top: r.y }} />
        ))}
        <img src="/saqr-avatar.png" alt="Saqr" className="w-[85%] h-[85%] object-contain transition-transform group-hover:rotate-12 animate-float" />
        <span className="absolute top-3 right-3 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-600 border-2 border-white dark:border-slate-900"></span>
        </span>
      </button>
    </div>
  );
};

// -------- 2. هيدر EFIPS الملكي (Responsive Neon Edition) --------
const Header: React.FC = () => {
  const { locale, setLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const links = [
    { path: '/', label: locale === 'en' ? 'Home' : 'الرئيسية', icon: '🏠' },
    { path: '/search', label: locale === 'en' ? 'Search' : 'البحث', icon: '🔍' },
    { path: '/digital-library', label: locale === 'en' ? 'E-Lib' : 'المكتبة', icon: '📚' },
    { path: '/smart-search', label: locale === 'en' ? 'Saqr AI' : 'صقر AI', icon: '🤖' },
    { path: '/creators', label: locale === 'en' ? 'Creators' : 'المبدعين', icon: '🎨' },
    { path: '/reports', label: locale === 'en' ? 'Reports' : 'التقارير', icon: '📊' },
    { path: '/feedback', label: locale === 'en' ? 'Feedback' : 'المقترحات', icon: '✍️' }, 
    { path: '/about', label: locale === 'en' ? 'About' : 'عن المكتبة', icon: 'ℹ️' },
  ];

  return (
    <header className="sticky top-4 z-[60] px-4 md:px-10">
      <div className="glass-panel mx-auto max-w-7xl p-2 md:p-4 rounded-full border border-white/20 dark:border-white/10 flex items-center justify-between shadow-2xl backdrop-blur-3xl bg-white/80 dark:bg-slate-950/80 font-black">
        
        <Link to="/" className="flex items-center gap-2 md:gap-4 ps-3 md:ps-6 group flex-shrink-0">
          <img 
            src="/school-logo.png" 
            alt="EFIPS" 
            className="h-9 w-9 md:h-14 md:w-14 object-contain logo-white-filter rotate-6 transition-transform group-hover:scale-110 drop-shadow-[0_0_15px_rgba(220,38,38,0.2)]" 
          />
          <div className="hidden lg:block leading-none text-start">
            <span className="font-black text-slate-950 dark:text-white text-[10px] md:text-xs tracking-tight block uppercase">
              {locale === 'en' ? "Emirates Falcon Int'l. Private School" : "مدرسة صقر الإمارات الدولية الخاصة"}
            </span>
          </div>
        </Link>
        
        <nav className="flex items-center bg-black/5 dark:bg-white/5 rounded-full p-1.5 mx-3 overflow-x-auto no-scrollbar flex-nowrap flex-1 lg:flex-none">
          <div className="flex items-center gap-1 md:gap-2 flex-nowrap">
            {links.map(l => (
              <Link 
                key={l.path} 
                to={l.path} 
                className={`px-4 md:px-6 py-2.5 md:py-3 rounded-full text-[10px] md:text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${
                  location.pathname === l.path 
                    ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-red-600'
                }`}
              >
                <span className="text-sm md:text-lg">{l.icon}</span>
                <span>{l.label}</span>
              </Link>
            ))}
          </div>
        </nav>
        
        <div className="flex items-center gap-2 pe-3 md:pe-6 flex-shrink-0">
          <button 
            onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')} 
            className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-slate-950 dark:text-white font-black text-xs md:text-base border-2 border-slate-200 dark:border-white/10 rounded-full hover:border-red-600 transition-all shadow-sm active:scale-90"
          >
            {locale === 'en' ? 'AR' : 'EN'}
          </button>
          
          <button 
            onClick={toggleTheme} 
            className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-white dark:bg-white/10 rounded-full text-sm md:text-xl shadow-inner border border-slate-100 dark:border-white/5 hover:scale-110 transition-transform"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </header>
  );
};

// -------- 3. سياق اللغة والثيم (Core) --------
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

// -------- 4. المكون الرئيسي (App Root) --------
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <HashRouter>
          <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-700 flex flex-col selection:bg-red-600/30 relative">
            
            {/* نظام التوهج الخلفي الفائق (Ultra Glow System) */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-50 dark:opacity-70">
              <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-red-600/10 dark:bg-red-500/25 blur-[160px] rounded-full animate-pulse"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-green-600/10 dark:bg-green-500/25 blur-[160px] rounded-full animate-pulse [animation-delay:2s]"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-yellow-400/5 dark:bg-yellow-400/10 blur-[130px] rounded-full animate-pulse [animation-delay:4s]"></div>
            </div>

            <Header />
            <FloatingSaqr />
            
            <main className="flex-1 relative z-10 container mx-auto p-4 md:p-12 lg:p-16">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
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

            <footer className="relative z-10 py-12 text-center border-t border-slate-200 dark:border-white/5 mx-6 md:mx-20 mt-16 group">
                <div className="h-1.5 w-24 bg-red-600 mx-auto mb-8 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] group-hover:w-48 transition-all duration-700"></div>
                <p className="font-black text-[10px] md:text-sm tracking-[0.5em] uppercase text-slate-500 dark:text-slate-400">
                    EFIPS Digital Sovereignty • Innovation Hub • 2026
                </p>
                <p className="mt-4 font-black text-slate-900 dark:text-white text-[9px] md:text-xs opacity-50 uppercase">
                    &copy; Emirates Falcon Int'l. Private School
                </p>
            </footer>

            {/* نظام الأنميشن العالمي */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(5deg); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
          </div>
        </HashRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
