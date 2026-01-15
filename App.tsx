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

import type { Locale } from './types';

// -------- 1. مساعد صقر العائم (Floating Assistant) --------
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
        className="group relative w-16 h-16 md:w-20 md:h-20 glass-panel rounded-[1.8rem] border-red-600/20 shadow-2xl flex items-center justify-center overflow-hidden hover:scale-110 active:scale-90 transition-all duration-500"
      >
        {ripples.map(r => (
          <span key={r.id} className="ripple-effect bg-red-600/20" style={{ left: r.x, top: r.y }} />
        ))}
        <img src="/saqr-avatar.png" alt="Saqr" className="w-[80%] h-[80%] object-contain transition-transform group-hover:rotate-12" />
        <span className="absolute top-2 right-2 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600 border-2 border-white dark:border-slate-900"></span>
        </span>
      </button>
    </div>
  );
};

// -------- 2. هيدر EFIPS المتطور (Responsive Header) --------
const Header: React.FC = () => {
  const { locale, setLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const links = [
    { path: '/', label: locale === 'en' ? 'Home' : 'الرئيسية', icon: '🏠' },
    { path: '/search', label: locale === 'en' ? 'Search' : 'البحث', icon: '🔍' },
    { path: '/digital-library', label: locale === 'en' ? 'E-Lib' : 'المكتبة', icon: '📚' },
    { path: '/smart-search', label: locale === 'en' ? 'Saqr AI' : 'صقر AI', icon: '🤖' },
  ];

  return (
    <header className="sticky top-4 z-[60] px-3 md:px-8">
      <div className="glass-panel mx-auto max-w-7xl p-1.5 md:p-3 rounded-full border-white/20 dark:border-white/5 flex justify-between items-center shadow-xl backdrop-blur-2xl">
        
        {/* Identity & School Name */}
        <Link to="/" className="flex items-center gap-2 md:gap-3 ps-2 md:ps-4 group flex-shrink-0">
          <img 
            src="/school-logo.png" 
            alt="EFIPS" 
            className="h-8 w-8 md:h-11 md:w-11 object-contain logo-white-filter rotate-6 transition-transform group-hover:scale-110" 
          />
          <div className="hidden lg:block leading-none text-start max-w-[180px] xl:max-w-none">
            <span className="font-black text-slate-950 dark:text-white text-[9px] md:text-[11px] tracking-tight block uppercase break-words">
              {locale === 'en' ? "Emirates Falcon Int'l. Private School" : "مدرسة صقر الإمارات الدولية الخاصة"}
            </span>
            <div className="h-0.5 w-6 bg-red-600 rounded-full mt-1 group-hover:w-full transition-all"></div>
          </div>
        </Link>
        
        {/* Compact Navigation */}
        <nav className="flex items-center bg-black/5 dark:bg-white/5 rounded-full p-1 gap-0.5 md:gap-1 overflow-x-auto no-scrollbar">
          {links.map(l => (
            <Link 
              key={l.path} 
              to={l.path} 
              className={`px-3 md:px-5 py-2 md:py-2.5 rounded-full text-[9px] md:text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
                location.pathname === l.path 
                  ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-lg' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-red-600'
              }`}
            >
              <span className="text-xs md:text-sm">{l.icon}</span>
              <span className={l.path === '/' ? 'inline' : 'hidden sm:inline'}>{l.label}</span>
            </Link>
          ))}
        </nav>
        
        {/* Quick Tools */}
        <div className="flex items-center gap-1.5 pe-2 md:pe-4">
          <button 
            onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')} 
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-slate-950 dark:text-white font-black text-[9px] md:text-xs border border-slate-200 dark:border-white/10 rounded-full hover:border-red-600 transition-all"
          >
            {locale === 'en' ? 'AR' : 'EN'}
          </button>
          
          <button 
            onClick={toggleTheme} 
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white dark:bg-white/10 rounded-full text-xs md:text-sm shadow-sm border border-slate-100 dark:border-white/5"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </header>
  );
};

// -------- 3. سياق اللغة والثيم (Default: English) --------
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
          <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-700 flex flex-col selection:bg-red-600/30">
            
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40 overflow-hidden">
              <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-red-600/10 blur-[140px] rounded-full"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-green-600/10 blur-[140px] rounded-full"></div>
            </div>

            <Header />
            <FloatingSaqr />
            
            <main className="flex-1 relative z-10 container mx-auto p-3 md:p-10">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/smart-search" element={<SmartSearchPage />} />
                <Route path="/digital-library" element={<DigitalLibraryPage />} />
                <Route path="/digital-library/arabic" element={<ArabicLibraryInternalPage />} />
                <Route path="/digital-library/english" element={<EnglishLibraryInternalPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </main>

            <footer className="relative z-10 py-8 text-center border-t border-slate-200 dark:border-white/5 mx-6 md:mx-12 mt-10">
                <p className="font-black text-[8px] md:text-[10px] tracking-[0.3em] uppercase text-slate-400 dark:text-slate-600">
                    &copy; 2026 Emirates Falcon Int'l. Private School
                </p>
            </footer>
          </div>
        </HashRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
