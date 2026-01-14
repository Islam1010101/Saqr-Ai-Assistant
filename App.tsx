import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import SmartSearchPage from './pages/SmartSearchPage';
import ReportsPage from './pages/ReportsPage';
import AboutPage from './pages/AboutPage';

import type { Locale } from './types';

// -------- 1. مكون تتبع الماوس الأحمر --------
const MouseFollower: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    checkMobile();
    const handleMouseMove = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY });
    if (!isMobile) window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  if (isMobile) return null;
  return <div className="custom-cursor" style={{ left: `${position.x}px`, top: `${position.y}px` }} />;
};

// -------- 2. إعدادات اللغة --------
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

// -------- 3. إعدادات المظهر (Theme) --------
const ThemeContext = createContext<any>(null);
export const useTheme = () => useContext(ThemeContext);

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light') }}>
      {children}
    </ThemeContext.Provider>
  );
};

// -------- 4. الهيدر (Header) --------
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
    <header className="glass-panel sticky top-0 z-40 p-4 flex justify-between items-center m-4 rounded-3xl">
      <div className="flex items-center gap-4">
        <img src="/school-logo.png" alt="Logo" className="h-12 w-12 object-contain rotate-[15deg]" />
        <span className="font-black dark:text-white hidden md:block">Saqr Library</span>
      </div>
      <nav className="flex items-center gap-2">
        {links.map(l => (
          <Link key={l.path} to={l.path} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${location.pathname === l.path ? 'bg-red-600 text-white shadow-lg' : 'text-gray-600 dark:text-gray-300'}`}>
            {l.label}
          </Link>
        ))}
        <button onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')} className="px-3 py-2 text-red-600 font-black text-xs uppercase">{locale === 'ar' ? 'EN' : 'AR'}</button>
        <button onClick={toggleTheme} className="p-2 bg-gray-100 dark:bg-white/10 rounded-xl">{theme === 'light' ? '🌙' : '☀️'}</button>
      </nav>
    </header>
  );
};

// -------- 5. المكون الرئيسي --------
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <HashRouter>
          <div className="min-h-screen relative bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-x-hidden">
            <MouseFollower />
            <Header />
            <main className="container mx-auto p-4">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/smart-search" element={<SmartSearchPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </main>
          </div>
        </HashRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
