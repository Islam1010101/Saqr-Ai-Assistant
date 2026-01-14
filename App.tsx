import React, { useState, useEffect, createContext, useContext, ReactNode, useRef, useCallback } from 'react';
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

// -------- 1. مكون صقر العائم المطور (Floating AI Assistant) --------
const FloatingSaqr: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dir } = useLanguage();
  const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

  // إخفاء الزر في الصفحة الرئيسية فقط لأن صقر موجود هناك بالفعل بشكل كبير
  if (location.pathname === '/') return null;

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

    const rippleId = Date.now();
    setRipples(prev => [...prev, { id: rippleId, x: clientX - rect.left, y: clientY - rect.top }]);
    
    // انتقال سلس لصفحة البحث الذكي
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId));
      navigate('/smart-search');
    }, 400);
  };

  return (
    <div className={`fixed bottom-8 ${dir === 'rtl' ? 'left-8' : 'right-8'} z-50 animate-in fade-in slide-in-from-bottom-12 duration-700`}>
      <button
        onMouseDown={handleInteraction}
        onTouchStart={handleInteraction}
        className="group relative w-20 h-20 glass-panel rounded-[2rem] border-red-500/20 shadow-[0_20px_50px_rgba(239,68,68,0.3)] flex items-center justify-center overflow-hidden hover:scale-110 active:scale-90 transition-all duration-300"
      >
        {ripples.map(r => (
          <span key={r.id} className="ripple-effect border-red-500/40" style={{ left: r.x, top: r.y }} />
        ))}
        <img src="/saqr-avatar.png" alt="Saqr AI" className="w-[85%] h-[85%] object-contain group-hover:rotate-12 transition-transform" />
        
        {/* مؤشر الحالة النشطة */}
        <span className="absolute top-2 right-2 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 border-2 border-white dark:border-slate-900"></span>
        </span>
      </button>
    </div>
  );
};

// -------- 2. الهيدر المطور عالي التباين (Smart Header) --------
const Header: React.FC = () => {
  const { locale, setLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const links = [
    { path: '/', label: locale === 'ar' ? 'الرئيسية' : 'Home', icon: '🏠' },
    { path: '/search', label: locale === 'ar' ? 'البحث اليدوي' : 'Manual', icon: '🔍' },
    { path: '/smart-search', label: locale === 'ar' ? 'اسأل صقر' : 'Ask AI', icon: '🤖' },
    { path: '/digital-library', label: locale === 'ar' ? 'المكتبة' : 'E-Library', icon: '📚' },
  ];

  return (
    <header className="sticky top-4 z-[60] mx-4 sm:mx-8">
      <div className="glass-panel p-2 sm:p-3 rounded-[2rem] border-white/30 dark:border-white/10 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] flex justify-between items-center">
        
        {/* الهوية البصرية */}
        <Link to="/" className="flex items-center gap-3 ps-4 group">
          <img src="/school-logo.png" alt="Logo" className="h-10 w-10 sm:h-12 sm:w-12 object-contain logo-white-filter transition-transform group-hover:scale-110" />
          <div className="hidden lg:block leading-none">
            <span className="font-black text-gray-950 dark:text-white text-sm tracking-tight block">EFIIPS</span>
            <span className="text-[10px] font-bold text-red-600 uppercase">Digital Library</span>
          </div>
        </Link>
        
        {/* التنقل الذكي */}
        <nav className="flex items-center bg-black/5 dark:bg-white/5 rounded-[1.5rem] p-1.5 gap-1 overflow-x-auto no-scrollbar max-w-[50vw] sm:max-w-none">
          {links.map(l => (
            <Link 
              key={l.path} 
              to={l.path} 
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${
                location.pathname === l.path 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-black/5'
              }`}
            >
              <span className="hidden sm:inline">{l.icon}</span>
              {l.label}
            </Link>
          ))}
        </nav>
        
        {/* أدوات التحكم */}
        <div className="flex items-center gap-2 pe-2">
          <button 
            onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')} 
            className="w-10 h-10 flex items-center justify-center text-red-600 font-black text-xs border-2 border-red-600/20 rounded-xl hover:bg-red-600 hover:text-white transition-all active:scale-90"
          >
            {locale === 'ar' ? 'EN' : 'AR'}
          </button>
          
          <button 
            onClick={toggleTheme} 
            className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-white/10 rounded-xl hover:scale-110 transition-all text-xl"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </header>
  );
};

// -------- 3. إدارة الحالة (Contexts) --------
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
            
            {/* الخلفية التفاعلية */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-600/10 blur-[120px] rounded-full"></div>
            </div>

            <Header />
            <FloatingSaqr />
            
            <main className="flex-1 relative z-10 container mx-auto p-4 sm:p-8 lg:p-12">
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

            {/* الفوتر المنظم */}
            <footer className="relative z-10 py-12 text-center">
              <div className="flex flex-col items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
                <img src="/school-logo.png" alt="EFIIPS" className="h-12 w-auto grayscale logo-white-filter" />
                <div className="space-y-1">
                  <p className="font-black text-[10px] tracking-[0.4em] uppercase text-gray-500 dark:text-gray-400">
                    Emirates Falcon International Private School
                  </p>
                  <p className="text-[9px] font-bold text-gray-400">
                    Digital Excellence &copy; {new Date().getFullYear()}
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </HashRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
