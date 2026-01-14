import React, { useState, useEffect, createContext, useContext, ReactNode, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

// استيراد الصفحات
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import SmartSearchPage from './pages/SmartSearchPage';
import ReportsPage from './pages/ReportsPage';
import AboutPage from './pages/AboutPage';
import DigitalLibraryPage from './pages/DigitalLibraryPage';

// استيراد الصفحات الداخلية للمكتبات
import ArabicLibraryInternalPage from './pages/ArabicLibraryInternalPage';
import EnglishLibraryInternalPage from './pages/EnglishLibraryInternalPage';

import type { Locale } from './types';

// -------- 1. مكون صقر العائم (Floating AI Assistant) --------
const FloatingSaqr: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dir } = useLanguage();
  const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

  // إخفاء المكون تماماً إذا كان المستخدم في الصفحة الرئيسية
  if (location.pathname === '/') return null;

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const rippleId = Date.now();
    setRipples(prev => [...prev, { id: rippleId, x, y }]);
    
    // الانتقال لصفحة البحث الذكي بعد تأثير التفاعل
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId));
      navigate('/smart-search');
    }, 400);
  };

  return (
    <div 
      className={`fixed bottom-8 ${dir === 'rtl' ? 'left-8' : 'right-8'} z-50 animate-in fade-in slide-in-from-bottom-10 duration-700`}
    >
      <button
        onMouseDown={handleInteraction}
        onTouchStart={handleInteraction}
        className="group relative w-16 h-16 sm:w-20 sm:h-20 glass-panel rounded-2xl sm:rounded-3xl border-white/40 shadow-2xl flex items-center justify-center overflow-hidden hover:scale-110 active:scale-95 transition-all duration-300"
      >
        {/* تأثير التموج الأحمر الكريستالي */}
        {ripples.map(r => (
          <span key={r.id} className="ripple-effect border-red-500/40" style={{ left: r.x, top: r.y }} />
        ))}
        
        {/* صورة أفاتار صقر */}
        <img 
          src="/saqr-avatar.png" 
          alt="Saqr AI" 
          className="w-full h-full object-cover p-1 group-hover:rotate-6 transition-transform" 
        />

        {/* نقطة التنبيه النابضة (Status Indicator) */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 border-2 border-white"></span>
        </span>
      </button>
      
      {/* نص توضيحي عند الحوم بالماوس (Tooltip) */}
      <div className={`absolute bottom-full mb-4 ${dir === 'rtl' ? 'left-0' : 'right-0'} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap`}>
        <div className="glass-panel px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-600 border-red-500/20 shadow-xl">
           {dir === 'rtl' ? 'اسأل صقر AI' : 'Ask Saqr AI'}
        </div>
      </div>
    </div>
  );
};

// -------- 2. مكون تتبع الماوس الكريستالي (عالي الأداء) --------
const MouseFollower: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    checkMobile();

    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
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
        zIndex: 9999, 
        pointerEvents: 'none' 
      }} 
    />
  );
};

// -------- 3. سياق اللغة (AR/EN) --------
const LanguageContext = createContext<any>(null);
export const useLanguage = () => useContext(LanguageContext);

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

// -------- 4. سياق المظهر (Light/Dark) --------
const ThemeContext = createContext<any>(null);
export const useTheme = () => useContext(ThemeContext);

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

// -------- 5. الهيدر الذكي (Header) --------
const Header: React.FC = () => {
  const { locale, setLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const links = [
    { path: '/', label: locale === 'ar' ? 'الرئيسية' : 'Home' },
    { path: '/search', label: locale === 'ar' ? 'بحث' : 'Search' },
    { path: '/smart-search', label: locale === 'ar' ? 'صقر AI' : 'Saqr AI' },
    { path: '/digital-library', label: locale === 'ar' ? 'المكتبة الإلكترونية' : 'E-Library' },
    { path: '/reports', label: locale === 'ar' ? 'تقارير' : 'Reports' },
    { path: '/about', label: locale === 'ar' ? 'حول' : 'About' },
  ];

  return (
    <header className="glass-panel sticky top-0 z-40 p-4 flex justify-between items-center m-4 rounded-3xl border-white/20">
      <div className="flex items-center gap-4">
        <img 
          src="/school-logo.png" 
          alt="Logo" 
          className="h-12 w-12 object-contain logo-smart-hover logo-white-filter" 
        />
        <span className="font-black text-gray-950 dark:text-white hidden lg:block tracking-tighter">Saqr Library</span>
      </div>
      
      <nav className="flex items-center gap-1 sm:gap-2">
        {links.map(l => (
          <Link 
            key={l.path} 
            to={l.path} 
            className={`px-3 sm:px-4 py-2 rounded-xl text-[9px] sm:text-xs font-black transition-all active:scale-90 ${
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
          className="p-2 bg-gray-100 dark:bg-white/10 rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-all active:scale-90"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </nav>
    </header>
  );
};

// -------- 6. المكون الرئيسي للتطبيق (App) --------
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <HashRouter>
          <div className="min-h-screen relative bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-x-hidden">
            {/* المؤشر الكريستالي */}
            <MouseFollower />
            
            {/* الهيدر الزجاجي */}
            <Header />
            
            {/* استدعاء صقر العائم ليكون متاحاً في كل الصفحات (عدا الرئيسية) */}
            <FloatingSaqr />
            
            <main className="container mx-auto p-4 sm:p-6 lg:p-10">
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
