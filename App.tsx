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

// -------- 1. مكون صقر العائم (Floating AI Assistant) --------
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
    <div className={`fixed bottom-6 sm:bottom-8 ${dir === 'rtl' ? 'left-6 sm:left-8' : 'right-6 sm:right-8'} z-50 animate-in fade-in slide-in-from-bottom-10 duration-700`}>
      <button
        onMouseDown={handleInteraction}
        onTouchStart={handleInteraction}
        className="group relative w-16 h-16 sm:w-20 sm:h-20 glass-panel rounded-[2rem] border-white/40 shadow-2xl flex items-center justify-center overflow-hidden hover:scale-110 active:scale-95 transition-all duration-300"
      >
        {ripples.map(r => (
          <span key={r.id} className="ripple-effect border-red-500/40" style={{ left: r.x, top: r.y }} />
        ))}
        <img src="/saqr-avatar.png" alt="Saqr AI" className="w-full h-full object-cover p-1.5 group-hover:rotate-6 transition-transform" />
        <span className="absolute top-0 right-0 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 border-2 border-white"></span>
        </span>
      </button>
    </div>
  );
};

// -------- 2. الهيدر المطور (Legible Header for Mobile/Tablets) --------
const Header: React.FC = () => {
  const { locale, setLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const links = [
    { path: '/', label: locale === 'ar' ? 'الرئيسية' : 'Home' },
    { path: '/search', label: locale === 'ar' ? 'بحث' : 'Search' },
    { path: '/smart-search', label: locale === 'ar' ? 'صقر AI' : 'Saqr AI' },
    { path: '/digital-library', label: locale === 'ar' ? 'المكتبة' : 'E-Library' },
    { path: '/reports', label: locale === 'ar' ? 'تقارير' : 'Reports' },
  ];

  return (
    <header className="glass-panel sticky top-3 sm:top-5 z-40 p-3 sm:p-4 flex justify-between items-center mx-3 sm:mx-6 rounded-2xl sm:rounded-[2.5rem] border-white/20 backdrop-blur-xl shadow-2xl">
      {/* منطقة الشعار والاسم */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <img src="/school-logo.png" alt="Logo" className="h-10 w-10 sm:h-12 sm:w-12 object-contain logo-white-filter" />
        <span className="font-black text-gray-950 dark:text-white hidden md:block text-base tracking-tighter">E.F.I.P.S Library</span>
      </div>
      
      {/* منطقة التنقل - روابط وخطوط أكبر */}
      <nav className="flex items-center gap-2 sm:gap-4 overflow-hidden">
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[55vw] sm:max-w-none no-scrollbar py-1">
          {links.map(l => (
            <Link 
              key={l.path} 
              to={l.path} 
              className={`px-4 py-2.5 rounded-xl text-[13px] sm:text-sm font-black transition-all whitespace-nowrap active:scale-95 ${
                location.pathname === l.path 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/30' 
                  : 'text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        
        <div className="h-6 w-px bg-gray-300 dark:bg-white/20 flex-shrink-0 mx-1"></div>
        
        {/* زر اللغة - خط أوضح */}
        <button 
          onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')} 
          className="px-2.5 py-2 text-red-600 font-black text-xs sm:text-sm uppercase hover:scale-110 transition-transform flex-shrink-0"
        >
          {locale === 'ar' ? 'EN' : 'AR'}
        </button>
        
        {/* زر الثيم - أكبر للضغط المريح */}
        <button 
          onClick={toggleTheme} 
          className="p-2.5 sm:p-3 bg-gray-100 dark:bg-white/10 rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-all active:scale-90 flex-shrink-0 shadow-sm"
        >
          <span className="text-base sm:text-lg">{theme === 'light' ? '🌙' : '☀️'}</span>
        </button>
      </nav>
    </header>
  );
};

// -------- المكونات الأساسية للنظام (Contexts & App) --------
const LanguageContext = createContext<any>(null);
export const useLanguage = () => useContext(LanguageContext);
const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('ar'); 
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
            
            <main className="flex-1 container mx-auto p-4 sm:p-8 lg:p-12">
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

            <footer className="py-8 text-center text-[10px] text-gray-400 dark:text-gray-500 font-black tracking-widest uppercase px-6">
              &copy; {new Date().getFullYear()} Emirates Falcon International Private School
            </footer>
          </div>
        </HashRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
