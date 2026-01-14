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
        className="group relative w-16 h-16 md:w-20 md:h-20 glass-panel rounded-[2rem] border-red-600/20 shadow-[0_20px_50px_rgba(220,38,38,0.3)] flex items-center justify-center overflow-hidden hover:scale-110 active:scale-90 transition-all duration-500"
      >
        {ripples.map(r => (
          <span key={r.id} className="ripple-effect bg-red-600/20" style={{ left: r.x, top: r.y }} />
        ))}
        <img src="/saqr-avatar.png" alt="Saqr AI" className="w-[85%] h-[85%] object-contain group-hover:rotate-12 transition-transform duration-500" />
        <span className="absolute top-2 right-2 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600 border-2 border-white dark:border-slate-900"></span>
        </span>
      </button>
    </div>
  );
};

// -------- 2. الهيدر الوطني المطور (Smart Navigation) --------
const Header: React.FC = () => {
  const { locale, setLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const links = [
    { path: '/', label: locale === 'ar' ? 'الرئيسية' : 'Home', icon: '🏠' },
    { path: '/search', label: locale === 'ar' ? 'البحث اليدوي' : 'Search', icon: '🔍' },
    { path: '/digital-library', label: locale === 'ar' ? 'المكتبة' : 'E-Library', icon: '📚' },
    { path: '/smart-search', label: locale === 'ar' ? 'صقر AI' : 'Ask Saqr', icon: '🤖' },
    { path: '/reports', label: locale === 'ar' ? 'التقارير' : 'Stats', icon: '📊' },
    { path: '/about', label: locale === 'ar' ? 'عن المكتبة' : 'About', icon: 'ℹ️' },
  ];

  return (
    <header className="sticky top-4 z-[60] px-4 md:px-8">
      <div className="glass-panel mx-auto max-w-7xl p-2 rounded-[2rem] border-white/20 dark:border-white/5 flex justify-between items-center shadow-xl">
        
        {/* الشعار مائل لليمين مع الاسم الجديد */}
        <Link to="/" className="flex items-center gap-3 ps-3 group">
          <img 
            src="/school-logo.png" 
            alt="EFIIPS" 
            className="h-10 w-10 object-contain logo-white-filter rotate-6 transition-transform duration-700 group-hover:scale-110" 
          />
          <div className="hidden lg:block leading-none">
            <span className="font-black text-gray-950 dark:text-white text-[10px] md:text-[11px] tracking-tight block uppercase">
              {locale === 'ar' ? 'مكتبة مدرسة صقر الإمارات' : 'Saqr Al Emarat School Library'}
            </span>
            <div className="h-0.5 w-6 bg-red-600 rounded-full mt-1 transition-all group-hover:w-full"></div>
          </div>
        </Link>
        
        {/* القائمة - تم إضافة البحث اليدوي */}
        <nav className="flex items-center bg-black/5 dark:bg-white/5 rounded-full p-1 gap-0.5 overflow-x-auto no-scrollbar max-w-[50vw] sm:max-w-none">
          {links.map(l => (
            <Link 
              key={l.path} 
              to={l.path} 
              className={`px-4 py-2 rounded-full text-[9px] md:text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
                location.pathname === l.path 
                  ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-md' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-white/10'
              }`}
            >
              <span>{l.icon}</span>
              {l.label}
            </Link>
          ))}
        </nav>
        
        {/* أدوات التحكم */}
        <div className="flex items-center gap-1 pe-2">
          <button 
            onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')} 
            className="w-9 h-9 flex items-center justify-center text-slate-900 dark:text-white font-black text-[9px] border border-slate-200 dark:border-white/10 rounded-full hover:border-red-600 transition-all active:scale-90"
          >
            {locale === 'ar' ? 'EN' : 'AR'}
          </button>
          
          <button 
            onClick={toggleTheme} 
            className="w-9 h-9 flex items-center justify-center bg-white dark:bg-white/5 rounded-full text-sm shadow-sm border border-slate-100 dark:border-white/5"
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
            
            {/* الهالات الضوئية الخلفية */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40 overflow-hidden">
              <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-red-600/10 blur-[140px] rounded-full"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-green-600/10 blur-[140px] rounded-full"></div>
            </div>

            <Header />
            <FloatingSaqr />
            
            <main className="flex-1 relative z-10 container mx-auto p-3 md:p-8">
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

            <footer className="relative z-10 py-8 text-center border-t border-slate-200 dark:border-white/5 mx-8 mt-12">
                <p className="font-black text-[9px] tracking-[0.4em] uppercase text-slate-400 dark:text-slate-600">
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
