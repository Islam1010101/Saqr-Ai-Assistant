import React, { useState, useEffect, createContext, useContext, ReactNode, useRef } from 'react';
import { createPortal } from 'react-dom';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

// ==========================================
// استيراد جميع صفحات المنظومة
// ==========================================
import Login from './pages/Login'; 
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard'; 

import SearchPage from './pages/SearchPage';
import SmartSearchPage from './pages/SmartSearchPage';
import ReportsPage from './pages/ReportsPage';
import AboutPage from './pages/AboutPage';
import DigitalLibraryPage from './pages/DigitalLibraryPage';
import ArabicLibraryInternalPage from './pages/ArabicLibraryInternalPage';
import EnglishLibraryInternalPage from './pages/EnglishLibraryInternalPage';
import FeedbackPage from './pages/FeedbackPage';
import CreatorsPortalPage from './pages/CreatorsPortalPage';
import LibraryMapPage from './pages/LibraryMapPage';
import SaqrStudioPage from './pages/SaqrStudioPage';
import PodcastPage from './pages/PodcastPage';
import NewArrivalsPage from './pages/NewArrivalsPage'; 
import DeweyGame from './pages/game'; 
import SchedulePage from './pages/SchedulePage'; 

export type Locale = 'en' | 'ar';

interface NavLink {
  path: string;
  label: string;
  hint: string;
  color: string;
  roles: ('student' | 'teacher' | 'admin')[];
}

const CloseIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;

// -------- 1. مساعد صقر العائم --------
const FloatingSaqr: React.FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => {
  const location = useLocation();
  const { dir } = useLanguage();
  const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

  if (location.pathname === '/' || location.pathname === '/admin-dashboard') return null;

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const rippleId = Date.now();
    setRipples(prev => [...prev, { id: rippleId, x: clientX - rect.left, y: clientY - rect.top }]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId));
      onOpenModal(); 
    }, 400);
  };

  return (
    <div className={`fixed bottom-6 ${dir === 'rtl' ? 'left-6' : 'right-6'} z-50 animate-fade-in-up`}>
      <button
        onMouseDown={handleInteraction}
        onTouchStart={handleInteraction}
        className="group relative w-14 h-14 md:w-16 md:h-16 rounded-[1.8rem] border-4 border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-center overflow-hidden hover:scale-110 active:scale-95 transition-transform duration-300 bg-white dark:bg-slate-800"
      >
        {ripples.map(r => (
          <span key={r.id} className="absolute rounded-full bg-emerald-400/40 animate-ripple pointer-events-none" style={{ left: r.x, top: r.y, width: 20, height: 20, transform: 'translate(-50%, -50%)' }} />
        ))}
        <img src="/saqr-avatar.png" alt="Saqr" className="w-[85%] h-[85%] object-contain animate-float" onError={(e) => e.currentTarget.style.display = 'none'} />
        <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-800"></span>
        </span>
      </button>
    </div>
  );
};

// -------- 1.5. نافذة صقر المنبثقة --------
const DraggableSaqrModal: React.FC<{ isOpen: boolean; onClose: () => void; children: ReactNode }> = ({ isOpen, onClose, children }) => {
    const { dir } = useLanguage();
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (isOpen) setPosition({ x: 0, y: 0 });
    }, [isOpen]);

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        setIsDragging(true);
        dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
        e.currentTarget.setPointerCapture(e.pointerId); 
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        setPosition({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        setIsDragging(false);
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[999999] pointer-events-none flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto animate-fade-in" onClick={onClose}></div>
            
            <div className="animate-zoom-in flex items-center justify-center pointer-events-none w-full h-full absolute inset-0 p-4">
                <div 
                    dir={dir}
                    className="relative w-full max-w-[400px] h-fit max-h-[85vh] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border-4 border-slate-200 dark:border-slate-700 flex flex-col pointer-events-auto transition-all duration-300 m-0 p-0"
                    style={{ transform: `translate(${position.x}px, ${position.y}px)`, touchAction: 'none' }}
                >
                    <div 
                        className="w-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none z-50 shrink-0 relative pt-6 pb-4 m-0 bg-slate-50 dark:bg-slate-800 rounded-t-[2.2rem] border-b-2 border-slate-200 dark:border-slate-700"
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                    >
                        <button 
                            onPointerDown={(e) => e.stopPropagation()} 
                            onClick={(e) => { e.stopPropagation(); onClose(); }} 
                            className="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 rounded-full transition-all pointer-events-auto shadow-sm active:scale-95 z-[60]"
                        >
                            <CloseIcon />
                        </button>

                        <div className="w-16 h-16 rounded-full overflow-hidden bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 shadow-inner flex items-center justify-center mb-2 pointer-events-none">
                            <img src="/saqr-avatar.png" alt="Saqr" className="w-[85%] h-[85%] object-contain" onError={(e) => e.currentTarget.style.display='none'} />
                        </div>
                        <h3 className="font-black text-lg text-slate-900 dark:text-white uppercase tracking-widest leading-none mb-1 pointer-events-none">صقر الذكي</h3>
                    </div>
                    
                    <div className="w-full overflow-hidden relative pointer-events-auto cursor-auto flex flex-col m-0 saqr-modal-override bg-white dark:bg-slate-900 rounded-b-[2.5rem]">
                        {children}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

// -------- 2. هيدر EFIPS --------
const Header: React.FC = () => {
  const { locale, setLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [userRole, setUserRole] = useState<'student' | 'teacher' | 'admin' | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('user_type') as 'student' | 'teacher' | 'admin' | null;
    setUserRole(role);
  }, [location.pathname]);

  if (location.pathname === '/' || location.pathname === '/admin-dashboard') return null;

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 60) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(currentScrollY);
      }
    };
    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  const allLinks: NavLink[] = [
    { path: '/home', label: locale === 'en' ? 'Home' : 'الرئيسية', hint: 'Home', color: 'bg-emerald-500', roles: ['student', 'teacher', 'admin'] },
    { path: '/search', label: locale === 'en' ? 'Search' : 'البحث بالمكتبة', hint: 'Search', color: 'bg-rose-500', roles: ['student', 'teacher', 'admin'] },
    { path: '/digital-library', label: locale === 'en' ? 'Digital' : 'المكتبة الرقمية', hint: 'Digital', color: 'bg-blue-500', roles: ['student', 'teacher', 'admin'] },
    { path: '/creators', label: locale === 'en' ? 'Creators' : 'بوابة المبدعين', hint: 'Creators', color: 'bg-purple-500', roles: ['student', 'admin'] },
    { path: '/game', label: locale === 'en' ? 'Games' : 'ألعاب', hint: 'Games', color: 'bg-amber-500', roles: ['student', 'admin'] },
    { path: '/schedule', label: locale === 'en' ? 'Schedule' : 'جدول المكتبة', hint: 'Schedule', color: 'bg-teal-500', roles: ['teacher', 'admin'] },
    { path: '/feedback', label: locale === 'en' ? 'Ideas' : 'مقترحات', hint: 'Feedback', color: 'bg-emerald-500', roles: ['student', 'teacher', 'admin'] }, 
    { path: '/admin-dashboard', label: locale === 'en' ? 'Admin' : 'الإدارة', hint: 'Admin', color: 'bg-rose-600', roles: ['admin'] }, 
  ];

  const allowedLinks = allLinks.filter(link => !userRole || link.roles.includes(userRole));

  return (
    <header className={`fixed top-4 left-0 right-0 z-[60] px-2 flex justify-center transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0 pointer-events-none'}`}>
      <div className="w-full max-w-[98%] md:w-fit px-3 py-2 rounded-[2rem] border-4 border-white dark:border-slate-700/50 flex items-center justify-between md:justify-center gap-4 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
        
        <Link to="/home" className="flex items-center gap-2 group flex-shrink-0">
          <img src="/school-logo.png" alt="EFIPS" className="h-8 w-8 md:h-10 md:w-10 object-contain dark:brightness-0 dark:invert shrink-0" onError={(e) => e.currentTarget.style.display='none'} />
        </Link>
        
        <nav className="flex-1 overflow-x-auto no-scrollbar flex items-center h-10 md:h-12 px-1">
          <div className="flex items-center gap-1.5 h-full mx-auto min-w-max">
            {allowedLinks.map((l) => {
              const isActive = location.pathname === l.path;
              return (
                <Link 
                  key={l.path}
                  to={l.path}
                  className={`px-3 py-1.5 md:px-5 md:py-2 text-[10px] md:text-sm font-black rounded-full transition-all duration-300 shrink-0 ${
                    isActive ? `${l.color} text-white shadow-md` : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </nav>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-slate-700 dark:text-slate-200 font-black text-[10px] border-2 border-slate-300 dark:border-slate-600 rounded-full bg-slate-50 dark:bg-slate-800">
            {locale === 'en' ? 'AR' : 'EN'}
          </button>
          <button onClick={toggleTheme} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full text-sm border-2 border-slate-200 dark:border-slate-600">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

      </div>
    </header>
  );
};

// -------- 3. سياق اللغة والثيم --------
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

// -------- 4. المكون الرئيسي --------
const MainLayout: React.FC = () => {
  const [isSaqrModalOpen, setIsSaqrModalOpen] = useState(false);
  const location = useLocation();
  const hideFooter = location.pathname === '/' || location.pathname === '/admin-dashboard' || location.pathname === '/game';

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 font-sans transition-colors duration-300 flex flex-col relative">
      <Header />
      <FloatingSaqr onOpenModal={() => setIsSaqrModalOpen(true)} />
      
      <main className={`flex-1 relative z-10 w-full ${location.pathname === '/' || location.pathname === '/admin-dashboard' ? 'pt-0' : 'pt-20 md:pt-24'}`}>
        <Routes>
          <Route path="/" element={<Login />} /> 
          <Route path="/home" element={<HomePage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/map" element={<LibraryMapPage />} />
          <Route path="/smart-search" element={<SmartSearchPage />} />
          <Route path="/digital-library" element={<DigitalLibraryPage />} />
          <Route path="/digital-library/arabic" element={<ArabicLibraryInternalPage />} />
          <Route path="/digital-library/english" element={<EnglishLibraryInternalPage />} />
          <Route path="/creators" element={<CreatorsPortalPage />} />
          <Route path="/saqr-studio" element={<SaqrStudioPage />} />
          <Route path="/podcast" element={<PodcastPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/feedback" element={<FeedbackPage />} /> 
          <Route path="/about" element={<AboutPage />} />
          <Route path="/new-arrivals" element={<NewArrivalsPage />} /> 
          <Route path="/game" element={<DeweyGame />} /> 
          <Route path="/schedule" element={<SchedulePage />} />
        </Routes>
      </main>

      {!hideFooter && (
        <footer className="relative z-10 py-8 text-center border-t-4 border-slate-200 dark:border-slate-800 mx-4 md:mx-20 mt-10">
          <p className="font-black text-xs text-slate-500">EFIPS • Library • 2026</p>
        </footer>
      )}

      <DraggableSaqrModal isOpen={isSaqrModalOpen} onClose={() => setIsSaqrModalOpen(false)}>
         <div className="w-full flex flex-col h-auto max-h-full">
             <SmartSearchPage />
         </div>
      </DraggableSaqrModal>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <HashRouter>
          <MainLayout />
        </HashRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
