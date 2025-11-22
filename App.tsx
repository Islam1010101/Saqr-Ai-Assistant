// /App.tsx
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import SmartSearchPage from './pages/SmartSearchPage';
import ReportsPage from './pages/ReportsPage';
import AboutPage from './pages/AboutPage';

import ChatAssistant from './components/ChatAssistant';
import type { Locale } from './types';

// -------- i18n --------
const translations = {
  ar: {
    schoolName: 'مدرسة صقر الإمارات الدولية الخاصة',
    library: 'المكتبة',
    navHome: 'الرئيسية',
    navManualSearch: 'بحث يدوي',
    navSmartSearch: 'اسأل صقر',
    navReports: 'تقارير',
    navAbout: 'حول',
    toggleLang: 'English',
  },
  en: {
    schoolName: 'Emirates Falcon International Private School',
    library: 'Library',
    navHome: 'Home',
    navManualSearch: 'Manual Search',
    navSmartSearch: 'Ask Saqr',
    navReports: 'Reports',
    navAbout: 'About',
    toggleLang: 'العربية',
  },
};

type TransKeys = keyof typeof translations.ar;

interface LanguageContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (k: TransKeys) => string;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | null>(null);
export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};

const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('ar');
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const t = (k: TransKeys) => translations[locale][k];
  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir: locale === 'en' ? 'rtl' : 'ltr' }}>
      {children}
    </LanguageContext.Provider>
  );
};

// -------- theme --------
type Theme = 'light' | 'dark';
interface ThemeContextType { theme: Theme; toggleTheme: () => void; }
const ThemeContext = createContext<ThemeContextType | null>(null);
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('saqr_theme') as Theme) || 'light');
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('saqr_theme', theme);
  }, [theme]);
  return <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(p => (p === 'light' ? 'dark' : 'light')) }}>{children}</ThemeContext.Provider>;
};

// -------- header --------
const Header: React.FC = () => {
  const { t, locale, setLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { path: '/', label: t('navHome') },
    { path: '/search', label: t('navManualSearch') },
    { path: '/smart-search', label: t('navSmartSearch') },
    { path: '/reports', label: t('navReports') },
    { path: '/about', label: t('navAbout') },
  ];

  const NavItem: React.FC<{ path: string; label: string; onClick?: () => void }> = ({ path, label, onClick }) => {
    const active = location.pathname === path;
    return (
      <Link
        to={path}
        onClick={onClick}
        className={`block md:inline-block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          active ? 'bg-uae-green text-white' : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-40 dark:bg-gray-800/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <div className="flex items-center">
            <img
              src="https://media.licdn.com/dms/image/v2/D4D0BAQH2J4sVBWyU9Q/company-logo_200_200/B4DZferhU8GgAI-/0/1751787640644/emirates_falcon_international_private_school_efips_logo?e=2147483647&v=beta&t=z8d76C6g0mI5SLMwFQS7TJ65jX8mN02QtIrFdJbxk8I"
              alt="School Logo"
              className="h-20 w-20 object-contain"
            />
            <div className="ms-3">
              <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">{t('schoolName')}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('library')}</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {links.map(l => (
              <NavItem key={l.path} path={l.path} label={l.label} />
            ))}
            <button onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')} className="px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
              {translations[locale].toggleLang}
            </button>
            <button onClick={toggleTheme} className="h-10 w-10 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')} className="me-2 h-10 w-10 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              {translations[locale].toggleLang}
            </button>
            <button onClick={toggleTheme} className="me-2 h-10 w-10 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button onClick={() => setOpen(v => !v)} className="p-2 rounded-md">☰</button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-2 pt-2 pb-3">
          {links.map(l => (
            <NavItem key={l.path} path={l.path} label={l.label} onClick={() => setOpen(false)} />
          ))}
        </div>
      )}
    </header>
  );
};

// -------- App --------
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <HashRouter>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/smart-search" element={<SmartSearchPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/about" element={<AboutPage />} />
                {/* اختياري: صفحة مستقلة للشات */}
                <Route path="/assistant" element={<ChatAssistant />} />
              </Routes>
            </main>
          </div>
        </HashRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
