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

// -------- 1. مساعد صقر العائم (UAE Floating Assistant) --------
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
        className="group relative w-16 h-16 md:w-24 md:h-24 glass-panel rounded-[2rem] border-red-600/20 shadow-[0_25px_60px_rgba(220,38,38,0.35)] flex items-center justify-center overflow-hidden hover:scale-110 active:scale-90 transition-all duration-500"
      >
        {ripples.map(r => (
          <span key={r.id} className="ripple-effect bg-red-600/20" style={{ left: r.x, top: r.y }} />
        ))}
        <img src="/saqr-avatar.png" alt="Saqr AI" className="w-[85%] h-[85%] object-contain group-hover:rotate-12 transition-transform duration-500" />
      </button>
    </div>
  );
};

// -------- 2. الهيدر الوطني المطور (Scrollable & Professional) --------
const Header: React.FC = () => {
  const { locale, setLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const links = [
    { path: '/', label: locale === 'ar' ? 'الرئيسية' : 'Home', icon: '🏠' },
    { path: '/search', label: locale === 'ar' ? 'البحث اليدوي' : 'Manual', icon: '🔍' },
    { path: '/digital-library', label: locale === 'ar' ? 'المكتبة' : 'E-Library', icon: '📚' },
    { path: '/smart-search', label: locale === 'ar' ? 'صقر AI' : 'Ask Saqr', icon: '🤖' },
    { path: '/reports', label: locale === 'ar' ? 'التقارير' : 'Stats', icon: '📊' },
    { path: '/about', label: locale === 'ar' ? 'عن المكتبة' : 'About', icon: 'ℹ️' },
  ];

  return (
    <header className="sticky top-4 z-[60] px-4 md:px-12">
      <div className="glass-panel mx-auto max-w-7xl p-2 md:p-3 rounded-[2rem] md:rounded-full border-white/20 dark:border-white/5 flex justify-between items-center shadow-2xl backdrop-blur-3xl overflow-hidden">
        
        {/* الشعار - مائل لليمين وثابت */}
        <Link to="/" className="flex items-center gap-3 ps-3 group shrink-0">
          <img 
            src="/school-logo.png" 
            alt="EFIIPS" 
            className="h-9 w-9 md:h-12 md:w-12 object-contain logo-white-filter rotate-6 transition-transform duration-700 group-hover:scale-110" 
          />
          <div className="hidden sm:block leading-none">
            <span className="font-black text-slate-950 dark:text-white text-[10px] md:text-xs tracking-tight block uppercase">
              {locale === 'ar' ? 'مكتبة صقر' : 'Saqr Library'}
            </span>
            <div className="h-0.5 w-6 bg-red-600 rounded-full mt-1"></div>
          </div>
        </Link>
        
        {/* القائمة المنزلقة - تدعم التمرير على الموبايل واللوحيات بشكل احترافي */}
        <nav className="flex items-center bg-black/5 dark:bg-white/5 rounded-full p-1 gap-1 overflow-x-auto no-scrollbar flex-nowrap scroll-smooth snap-x mx-2">
          {links.map(l => (
            <Link 
              key={l.path} 
              to={l.path} 
              className={`px-4 md:px-6 py-2 md:py-3 rounded-full text-[10px] md:text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap snap-center ${
                location.pathname === l.path 
                  ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-lg scale-105' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white/10 hover:text-red-600'
              }`}
            >
              <span>{l.icon}</span>
              {l.label}
            </Link>
          ))}
        </nav>
        
        {/* أدوات التحكم - ثابتة في الطرف */}
        <div className="flex items-center gap-1.5 pe-2 shrink-0">
          <button 
            onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')} 
            className="w-9 h-9 flex items-center justify-center text-slate-950 dark:text-white font-black text-[9px] border-2 border-slate-200 dark:border-white/10 rounded-full hover:border-red-600 active:scale-90 transition-all"
          >
            {locale === 'ar' ? 'EN' : 'AR'}
          </button>
          
          <button 
            onClick={toggleTheme} 
            className="w-9 h-9 flex items-center justify-center bg-white dark:bg-white/10 rounded-full text-base shadow-sm border border-slate-100 dark:border-white/5"
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

// -------- 4. المكون الرئيسي (App Component) --------
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <HashRouter>
          <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-700 flex flex-col selection:bg-red-600/30">
            
            {/* الهالات الضوئية الوطنية */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40 overflow-hidden">
              <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-red-600/10 blur-[140px] rounded-full"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-green-600/10 blur-[140px] rounded-full"></div>
            </div>

            <Header />
            <FloatingSaqr />
            
            <main className="flex-1 relative z-10 container mx-auto p-4 md:p-12">
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

            {/* ذيل الصفحة المطور - تم ضبط تباعد الحروف ومنع التقطع */}
            <footer className="relative z-10 py-10 text-center border-t border-slate-200 dark:border-white/5 mx-8 md:mx-20 mt-16">
                <p className="font-black text-[10px] md:text-xs tracking-[0.1em] md:tracking-[0.3em] uppercase text-slate-500 dark:text-slate-600 leading-relaxed px-4">
                    &copy; 2026 Emirates Falcon International Private School
                </p>
            </footer>
          </div>
        </HashRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
