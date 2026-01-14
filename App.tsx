import React, { useState, useEffect, createContext, useContext, ReactNode, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import SmartSearchPage from './pages/SmartSearchPage';
import ReportsPage from './pages/ReportsPage';
import AboutPage from './pages/AboutPage';

import type { Locale } from './types';

// -------- 1. مكون تتبع الماوس الأحمر (عالي الأداء) --------
const MouseFollower: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    checkMobile();

    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        // تحديث الموقع عبر تحويلات 3D لتفعيل تسريع كارت الشاشة (GPU)
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div 
      ref={cursorRef}
      className="custom-cursor" 
      style={{ 
        position: 'fixed',
        left: 0,
        top: 0,
        willChange: 'transform', // تحسين أداء المتصفح مسبقاً
        zIndex: 9999,
        pointerEvents: 'none'
      }} 
    />
  );
};

// -------- 2. إعدادات اللغة (i18n) --------
const LanguageContext = createContext<any>(null);
export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};

const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en'); 
  
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, dir: locale === 'ar' ? 'rtl' : 'ltr' }}>
      {children}
    </LanguageContext.Provider>
  );
};

// -------- 3. إعدادات المظهر (Theme) --------
const ThemeContext = createContext<any>(null);
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => 
    (localStorage.getItem('saqr_theme') as any) || 'light'
  );
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('saqr_theme', theme);
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(prev => prev === 'light' ? 'dark' : 'light') }}>
      {children}
    </ThemeContext.Provider>
  );
};

// -------- 4. الهيدر التفاعلي (Header) --------
const Header: React.FC = () => {
  const { locale, setLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const links = [
    { path: '/', label: locale === 'ar' ? 'الرئيسية' : 'Home' },
    { path: '/search', label: locale === 'ar' ? 'بحث' : 'Search' },
    { path: '/smart-search', label: locale === 'ar' ? 'صقر AI' : 'Saqr AI' },
    { path: '/reports', label: locale === 'ar' ? 'تقارير' : 'Reports' },
    { path: '/about', label: locale === 'ar' ? 'حول' : 'About' },
  ];

  return (
    <header className="glass-panel sticky top-0 z-40 p-4 flex justify-between items-center m-4 rounded-3xl border-white/20">
      <div className="flex items-center gap-4">
        <img 
          src="/school-logo.png" 
          alt="Logo" 
          className="h-12 w-12 object-contain rotate-[15deg] logo-smart-hover" 
        />
        <span className="font-black text-gray-950 dark:text-white hidden md:block tracking-tighter">Saqr Library</span>
      </div>
      
      <nav className="flex items-center gap-2">
        {links.map(l => (
          <Link 
            key={l.path} 
            to={l.path} 
            className={`px-4 py-2 rounded-xl text-[10px] sm:text-xs font-black transition-all active:scale-90 ${
              location.pathname === l.path 
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            {l.label}
          </Link>
        ))}
        
        <div className="h-6 w-px bg-gray-200 dark:bg-white/10 mx-1"></div>
        
        <button 
          onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')} 
          className="px-2 py-2 text-red-600 font-black text-[10px] uppercase hover:scale-110 transition-transform"
        >
          {locale === 'ar' ? 'EN' : 'AR'}
        </button>
        
        <button 
          onClick={toggleTheme} 
          className="p-2.5 bg-gray-100 dark:bg-white/10 rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-all active:scale-90"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </nav>
    </header>
  );
};

// -------- 5. المكون الرئيسي (App) --------
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <HashRouter>
          <div className="min-h-screen relative bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-x-hidden">
            {/* المؤشر الأحمر يتبعك في كل مكان بسلاسة */}
            <MouseFollower />
            
            <Header />
            
            <main className="container mx-auto p-4 sm:p-6 lg:p-10">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/smart-search" element={<SmartSearchPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </main>
            
            <footer className="py-10 text-center text-[10px] text-gray-400 dark:text-gray-500 font-black tracking-widest uppercase">
              &copy; {new Date().getFullYear()} Emirates Falcon International Private School
            </footer>
          </div>
        </HashRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
