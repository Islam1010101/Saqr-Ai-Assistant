import React, { useState, useEffect, createContext, useContext, ReactNode, useRef } from 'react';
import { createPortal } from 'react-dom';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';

// ==========================================
// استيراد جميع صفحات المنظومة
// ==========================================
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';

import SearchPage from './pages/SearchPage';
import SmartSearchPage from './pages/SmartSearchPage';
import AboutPage from './pages/AboutPage';
import DigitalLibraryPage from './pages/DigitalLibraryPage';
import ArabicLibraryInternalPage from './pages/ArabicLibraryInternalPage';
import EnglishLibraryInternalPage from './pages/EnglishLibraryInternalPage';
import FeedbackPage from './pages/FeedbackPage';
import CreatorsPortalPage from './pages/CreatorsPortalPage';
import SaqrStudioPage from './pages/SaqrStudioPage';
import PodcastPage from './pages/PodcastPage';
import DeweyGame from './pages/game';
import SchedulePage from './pages/SchedulePage';
import TutorialPage from './pages/TutorialPage';
import FlagDayChallenge from './pages/FlagDayChallenge'; // Prepared for future activation; intentionally not routed.

export type Locale = 'en' | 'ar';

interface NavLink {
  path: string;
  label: string;
  hint: string;
  color: string;
  roles: ('student' | 'teacher' | 'admin')[];
}

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// -------- حماية المسارات (Route Guard) الآمنة لجميع المتصفحات --------
const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  let userType = null;
  let currentUser = null;

  try {
    userType = localStorage.getItem('user_type');
    currentUser = localStorage.getItem('current_user');
  } catch (err) {
    console.error("Storage access restricted:", err);
  }

  if (!userType || !currentUser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// -------- 1. مساعد صقر العائم --------
const FloatingSaqr: React.FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => {
  const location = useLocation();
  const { dir } = useLanguage();
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  if (location.pathname === '/' || location.pathname === '/admin-dashboard' || location.pathname === '/about' || location.pathname === '/tutorial') return null;

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
        className="group relative w-16 h-16 md:w-20 md:h-20 rounded-[2rem] border-4 border-slate-200 dark:border-slate-700 shadow-xl flex items-center justify-center overflow-hidden hover:scale-110 active:scale-95 transition-transform duration-300 bg-white dark:bg-slate-800"
      >
        {ripples.map(r => (
          <span
            key={r.id}
            className="absolute rounded-full bg-emerald-400/40 animate-ripple pointer-events-none"
            style={{ left: r.x, top: r.y, width: 20, height: 20, transform: 'translate(-50%, -50%)' }}
          />
        ))}
        <img
          src="/saqr-avatar.png"
          alt="Saqr"
          className="w-[85%] h-[85%] object-contain animate-float"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <span className="absolute top-1.5 right-1.5 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-slate-800"></span>
        </span>
      </button>
    </div>
  );
};

// -------- 1.5. نافذة صقر المنبثقة --------
const DraggableSaqrModal: React.FC<{ isOpen: boolean; onClose: () => void; children: ReactNode }> = ({
  isOpen,
  onClose,
  children,
}) => {
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
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999999] pointer-events-none flex items-end md:items-center justify-center p-2 md:p-4 pb-0 md:pb-4">
      <div
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-md pointer-events-auto animate-fade-in"
        onClick={onClose}
      ></div>

      <div className="animate-zoom-in flex items-end md:items-center justify-center pointer-events-none w-full h-full absolute inset-0 md:p-4 pb-0">
        <div
          dir={dir}
          className="relative w-full max-w-[600px] h-[85vh] md:h-[90vh] bg-white dark:bg-slate-900 md:rounded-[3rem] rounded-t-[3rem] shadow-2xl border-x-4 border-t-4 md:border-b-4 border-slate-200 dark:border-slate-700 flex flex-col pointer-events-auto transition-all duration-300 m-0 p-0 overflow-hidden"
          style={{ transform: `translate(${position.x}px, ${position.y}px)`, touchAction: 'none' }}
        >
          {/* رأس النافذة */}
          <div
            className="w-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none z-50 shrink-0 relative pt-8 pb-6 m-0 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-b-2 border-slate-100 dark:border-slate-800"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-6 right-6 rtl:left-6 rtl:right-auto p-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 rounded-full transition-all pointer-events-auto shadow-sm active:scale-95 z-[60]"
            >
              <CloseIcon />
            </button>

            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-emerald-50 dark:bg-slate-800 border-4 border-emerald-100 dark:border-emerald-900/30 shadow-md flex items-center justify-center mb-3 pointer-events-none z-10 relative">
                <img
                  src="/saqr-avatar.png"
                  alt="Saqr"
                  className="w-[85%] h-[85%] object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <span className="absolute bottom-4 right-1 w-5 h-5 bg-emerald-400 border-4 border-white dark:border-slate-900 rounded-full z-20"></span>
            </div>
            
            <h3 className="font-black text-2xl text-slate-900 dark:text-white tracking-wide leading-none mb-1 pointer-events-none">
              صقر الذكي
            </h3>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 pointer-events-none">
              {dir === 'rtl' ? 'مساعدك الرقمي الشخصي' : 'Your Digital Assistant'}
            </p>
          </div>

          {/* مساحة المحتوى والشات - تم إلغاء التمرير الزائد من هنا والاعتماد على تمرير الشات نفسه */}
          <div className="w-full flex-1 relative pointer-events-auto cursor-auto flex flex-col m-0 saqr-modal-override bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden">
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

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/admin-dashboard' || location.pathname === '/about' || location.pathname === '/tutorial') {
      return;
    }

    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY, location.pathname]);

  if (location.pathname === '/' || location.pathname === '/admin-dashboard' || location.pathname === '/about' || location.pathname === '/tutorial') return null;

  const allLinks: NavLink[] = [
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
    <header
      className={`fixed top-4 left-0 right-0 z-[60] px-2 flex justify-center transition-all duration-500 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0 pointer-events-none'
      }`}
    >
      <div className="w-full max-w-[98%] md:w-fit px-4 py-2.5 rounded-[2rem] border-4 border-white/70 dark:border-slate-700/40 flex items-center justify-between md:justify-center gap-4 shadow-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-2xl">
        
        <Link to="/home" className="flex items-center gap-2 group flex-shrink-0 me-3 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
          <img
            src="/school-logo.png"
            alt="EFIPS"
            className="h-8 w-8 md:h-10 md:w-10 object-contain dark:brightness-0 dark:invert shrink-0 transition-transform group-hover:scale-110"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </Link>

        <nav className="flex-1 overflow-x-auto no-scrollbar flex items-center h-10 md:h-12 px-1">
          <div className="flex items-center gap-1.5 h-full mx-auto min-w-max">
            {allowedLinks.map((l, index) => {
              const isActive = location.pathname === l.path;

              return (
                <Link
                  key={l.path}
                  to={l.path}
                  className={`px-3 py-1.5 md:px-5 md:py-2 text-[10px] md:text-sm font-black rounded-full transition-all duration-300 shrink-0 animate-fade-in-up ${
                    isActive
                      ? `${l.color} text-white shadow-md`
                      : 'text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  style={{ animationDelay: `${(index + 1) * 50}ms` }}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
            aria-label={locale === 'ar' ? 'تغيير لغة الموقع إلى الإنجليزية' : 'Change website language to Arabic'}
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-slate-700 dark:text-slate-200 font-black text-[10px] border-2 border-slate-300/80 dark:border-slate-600 rounded-full bg-slate-50/80 dark:bg-slate-800/80 animate-fade-in-up"
            style={{ animationDelay: `${(allowedLinks.length + 1) * 50}ms` }}
          >
            {locale === 'en' ? 'AR' : 'EN'}
          </button>
          <button
            onClick={toggleTheme}
            aria-label={locale === 'ar' ? 'تبديل الوضع الفاتح والداكن' : 'Toggle light and dark mode'}
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-slate-100/80 dark:bg-slate-800/80 rounded-full text-sm border-2 border-slate-200/80 dark:border-slate-600 animate-fade-in-up"
            style={{ animationDelay: `${(allowedLinks.length + 2) * 50}ms` }}
          >
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

const ThemeContext = createContext<any>(null);

export const useTheme = () => useContext(ThemeContext);

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const storedTheme = localStorage.getItem('saqr_theme');
      return storedTheme === 'dark' ? 'dark' : 'light';
    } catch {
      // Storage can be blocked in private or restricted browser contexts.
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem('saqr_theme', theme);
    } catch {
      // The current page theme still works even when persistence is unavailable.
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme: () => setTheme(prev => (prev === 'light' ? 'dark' : 'light')),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Keep a failure inside the public tutorial route from turning into a blank page.
// The original error is also written to the browser console for diagnostics.
class ApplicationErrorBoundary extends React.Component<
  { children: ReactNode },
  { errorMessage: string | null }
> {
  state = { errorMessage: null as string | null };

  static getDerivedStateFromError(error: Error) {
    return {
      errorMessage: error instanceof Error ? error.message : String(error || 'Unknown runtime error')
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[Saqr App] Runtime render error:', error, info.componentStack);
  }

  render() {
    if (!this.state.errorMessage) return this.props.children;

    return (
      <section
        dir="rtl"
        role="alert"
        className="min-h-[75vh] w-full flex items-center justify-center px-4 py-12 bg-[#f8fafc] dark:bg-slate-950"
      >
        <div className="w-full max-w-2xl rounded-[2rem] border-2 border-emerald-200 dark:border-emerald-900 bg-white/95 dark:bg-slate-900/95 p-6 sm:p-9 shadow-2xl text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
            <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M10.3 3.9 1.8 18.6A1.6 1.6 0 0 0 3.2 21h17.6a1.6 1.6 0 0 0 1.4-2.4L13.7 3.9a2 2 0 0 0-3.4 0Z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">تعذر تحميل الصفحة</h1>
          <p className="mt-3 text-sm sm:text-base leading-7 text-slate-600 dark:text-slate-300">
            حدث خطأ أثناء تشغيل الصفحة. تم منع انهيار الواجهة بالكامل وإظهار رسالة التشخيص بدلًا من ترك الشاشة بيضاء.
          </p>
          <div className="mt-5 rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-4 text-start">
            <p className="text-xs font-black text-amber-800 dark:text-amber-300 mb-2">رسالة التشخيص</p>
            <code dir="ltr" className="block break-words text-xs sm:text-sm leading-6 text-slate-800 dark:text-slate-100">{this.state.errorMessage}</code>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 font-black transition-colors"
            >
              إعادة المحاولة
            </button>
            <a
              href="#/"
              className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 px-6 py-3 font-black transition-colors"
            >
              العودة لتسجيل الدخول
            </a>
          </div>
        </div>
      </section>
    );
  }
}

// -------- 4. المكون الرئيسي --------
const MainLayout: React.FC = () => {
  const [isSaqrModalOpen, setIsSaqrModalOpen] = useState(false);
  const location = useLocation();
  const { locale } = useLanguage();

  const hideFooter =
    location.pathname === '/' ||
    location.pathname === '/admin-dashboard' ||
    location.pathname === '/about' ||
    location.pathname === '/game' ||
    location.pathname === '/tutorial';

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 font-sans transition-colors duration-300 flex flex-col relative">
      <button
        type="button"
        onClick={() => document.getElementById('main-content')?.focus()}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[1000000] focus:rounded-xl focus:bg-emerald-700 focus:px-4 focus:py-3 focus:font-black focus:text-white focus:shadow-xl"
      >
        {locale === 'ar' ? 'تخطي إلى المحتوى الرئيسي' : 'Skip to main content'}
      </button>
      <Header />
      <FloatingSaqr onOpenModal={() => setIsSaqrModalOpen(true)} />

      <main
        id="main-content"
        tabIndex={-1}
        className={`flex-1 relative z-10 w-full focus:outline-none ${
          location.pathname === '/' || location.pathname === '/admin-dashboard' || location.pathname === '/about' || location.pathname === '/tutorial'
            ? 'pt-0'
            : 'pt-20 md:pt-24'
        }`}
      >
        <Routes>
          {/* صفحات عامة لا تتطلب تسجيل الدخول */}
          <Route path="/" element={<Login />} />
          <Route path="/tutorial" element={<TutorialPage />} />
          
          {/* باقي الصفحات محمية تتطلب تسجيل الدخول */}
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/smart-search" element={<ProtectedRoute><SmartSearchPage /></ProtectedRoute>} />
          <Route path="/digital-library" element={<ProtectedRoute><DigitalLibraryPage /></ProtectedRoute>} />
          <Route path="/digital-library/arabic" element={<ProtectedRoute><ArabicLibraryInternalPage /></ProtectedRoute>} />
          <Route path="/digital-library/english" element={<ProtectedRoute><EnglishLibraryInternalPage /></ProtectedRoute>} />
          <Route path="/creators" element={<ProtectedRoute><CreatorsPortalPage /></ProtectedRoute>} />
          <Route path="/saqr-studio" element={<ProtectedRoute><SaqrStudioPage /></ProtectedRoute>} />
          <Route path="/podcast" element={<ProtectedRoute><PodcastPage /></ProtectedRoute>} />
          <Route path="/feedback" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/game" element={<ProtectedRoute><DeweyGame /></ProtectedRoute>} />
          <Route path="/schedule" element={<ProtectedRoute><SchedulePage /></ProtectedRoute>} />
        </Routes>
      </main>

      {!hideFooter && (
        <footer className="relative z-10 py-8 text-center border-t-4 border-slate-200 dark:border-slate-800 mx-4 md:mx-20 mt-10">
          <p className="font-black text-xs text-slate-500">EFIPS • Library • 2026</p>
        </footer>
      )}

      <DraggableSaqrModal
        isOpen={isSaqrModalOpen}
        onClose={() => setIsSaqrModalOpen(false)}
      >
        <div className="w-full h-full flex flex-col saqr-chat-container overflow-hidden">
          <SmartSearchPage />
        </div>
      </DraggableSaqrModal>

      {/* الستايلات الخاصة بتنسيق الرسائل وتكبيرها داخل النافذة وتأثيرات التلاشي */}
      <style>{`
        /* تحسينات الشات بحيث تلغي أي أشرطة تمرير زائدة في الحاويات الخارجية */
        .saqr-modal-override {
           overflow: hidden !important;
        }

        /* تحسين حجم خطوط وأحجام ردود المستخدم وصقر */
        .saqr-chat-container .user-message {
          font-size: 1.15rem !important; 
          padding: 1rem 1.25rem !important;
          line-height: 1.5 !important;
        }
        
        .saqr-chat-container .markdown-body {
          font-size: 1.15rem !important;
          line-height: 1.6 !important;
        }

        .saqr-chat-container input {
          font-size: 1.1rem !important;
          padding: 1rem 1.5rem !important;
        }
        
        .saqr-chat-container .markdown-body p, 
        .saqr-chat-container .markdown-body li {
          margin-bottom: 0.75rem !important;
        }

        @keyframes fade-in-up { 
          0% { opacity: 0; transform: translateY(15px); } 
          100% { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; opacity: 0; }
        
        @keyframes zoom-in { 
          0% { opacity: 0; transform: scale(0.95); } 
          100% { opacity: 1; transform: scale(1); } 
        }
        .animate-zoom-in { animation: zoom-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        @keyframes fade-in { 
          0% { opacity: 0; } 
          100% { opacity: 1; } 
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }

      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ApplicationErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <HashRouter>
            <MainLayout />
          </HashRouter>
        </LanguageProvider>
      </ThemeProvider>
    </ApplicationErrorBoundary>
  );
};

export default App;
