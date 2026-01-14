import React, { useState, useEffect, createContext, useContext, ReactNode, useRef } from 'react';
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

// -------- 1. مكون صقر العائم (Floating AI Assistant) - متوافق مع الموبايل --------
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
    <div className={`fixed bottom-4 sm:bottom-8 ${dir === 'rtl' ? 'left-4 sm:left-8' : 'right-4 sm:right-8'} z-50 animate-in fade-in slide-in-from-bottom-10 duration-700`}>
      <button
        onMouseDown={handleInteraction}
        onTouchStart={handleInteraction}
        className="group relative w-14 h-14 sm:w-20 sm:h-20 glass-panel rounded-2xl sm:rounded-[2rem] border-white/40 shadow-2xl flex items-center justify-center overflow-hidden hover:scale-110 active:scale-90 transition-all duration-300"
      >
        {ripples.map(r => (
          <span key={r.id} className="ripple-effect border-red-500/40" style={{ left: r.x, top: r.y }} />
        ))}
        <img src="/saqr-avatar.png" alt="Saqr AI" className="w-full h-full object-cover p-1 group-hover:rotate-6 transition-transform" />
        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 sm:h-4 sm:w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 sm:h-4 sm:w-4 bg-red-600 border-2 border-white"></span>
        </span>
      </button>
    </div>
  );
};

// -------- 2. الهيدر الذكي (Responsive Header) --------
const Header: React.FC = () => {
  const { locale, setLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const links = [
    { path: '/', label: locale === 'ar' ? 'الرئيسية' : 'Home' },
    { path: '/search', label: locale === 'ar' ? 'بحث' : 'Search' },
    { path: '/smart-search', label: locale === 'ar' ? 'صقر AI' : 'Saqr AI' },
    { path: '/digital-library', label: locale === 'ar' ? 'E-Library' : 'E-Library' },
    { path: '/reports', label: locale === 'ar' ? 'تقارير' : 'Reports' },
  ];

  return (
    <header className="glass-panel sticky top-2 sm:top-4 z-40 p-2 sm:p-4 flex flex-wrap justify-between items-center mx-2 sm:mx-4 rounded-2xl sm:rounded-3xl border-white/20 backdrop-blur-xl">
      <div className="flex items-center gap-2 sm:gap-4 ml-1 sm:ml-0">
        <img src="/school-logo.png" alt="Logo" className="h-8 w-8 sm:h-12 sm:w-12 object-contain logo-white-filter" />
        <span className="font-black text-gray-950 dark:text-white hidden xs:block text-xs sm:text-base tracking-tighter">E.F.I.P.S Library</span>
      </div>
      
      <nav className="flex items-center gap-0.5 sm:gap-2">
        <div className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto max-w-[50vw] sm:max-w-none no-scrollbar">
          {links.map(l => (
            <Link 
              key={l.path} 
              to={l.path} 
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-black transition-all whitespace-nowrap ${
                location.pathname === l.path ? 'bg-red-600 text-white' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        
        <div className="h-4 w-px bg-gray-300 dark:bg-white/10 mx-1"></div>
        
        <button onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')} className="px-1.5 sm:px-2 py-1 text-red-600 font-black text-[10px] sm:text-xs">
          {locale === 'ar' ? 'EN' : 'AR'}
        </button>
        
        <button onClick={toggleTheme} className="p-1.5 sm:p-2 bg-gray-100 dark:bg-white/10 rounded-lg sm:rounded-xl active:scale-90">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </nav>
    </header>
  );
};

// -------- المكونات الأساسية للنظام (Contexts & App) --------
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

const MouseFollower: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    checkMobile();
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    };
    if (!isMobile) window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);
  if (isMobile) return null;
  return <div ref={cursorRef} className="custom-cursor" style={{ position: 'fixed', left: 0, top: 0, zIndex: 9999, pointerEvents: 'none' }} />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <HashRouter>
          <div className="min-h-screen relative bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-x-hidden flex flex-col">
            <MouseFollower />
            <Header />
            <FloatingSaqr />
            
            <main className="flex-1 container mx-auto p-3 sm:p-6 lg:p-10">
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

            <footer className="py-6 sm:py-10 text-center text-[8px] sm:text-[10px] text-gray-400 dark:text-gray-500 font-black tracking-widest uppercase px-4">
              &copy; {new Date().getFullYear()} Emirates Falcon International Private School
            </footer>
          </div>
        </HashRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
