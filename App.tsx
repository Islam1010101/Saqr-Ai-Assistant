import React, { useState, useEffect, createContext, useContext, ReactNode, useRef } from 'react';
import { createPortal } from 'react-dom';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

// 🚀 تشغيل محرك فايربيز أول ما الموقع يفتح
import './src/utils/firebase';

// استيراد الصفحات
import HomePage from './pages/HomePage';
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

export type Locale = 'en' | 'ar';

interface NavLink {
  path: string;
  label: string;
  icon: React.ReactNode;
  hint: string;
  color: string;
}

// ==========================================
// أيقونات SVG جذابة (بديلة للإيموجيز)
// ==========================================
const SearchIcon = () => <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const BookIcon = () => <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
const PaletteIcon = () => <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.66 0 3-1.34 3-3 0-.35-.07-.69-.21-1-.28-.62-1.07-1.46-1.57-2.09-.34-.43-.72-1.09-.72-1.91 0-1.66 1.34-3 3-3h.64c2.81 0 5.1-2.07 5.73-4.83A9.98 9.98 0 0 0 22 12c0-5.52-4.48-10-10-10z" /></svg>;
const GameIcon = () => <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><rect x="2" y="6" width="20" height="12" rx="4" /><path d="M6 12h4m-2-2v4M15 11h.01M18 13h.01" /></svg>;
const MapIcon = () => <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></svg>;
const FeedbackIcon = () => <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" /></svg>;
const ReportsIcon = () => <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>;
const AboutIcon = () => <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>;
const CloseIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;

// -------- 1. مساعد صقر العائم --------
const FloatingSaqr: React.FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => {
  const location = useLocation();
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

// -------- 1.5. نافذة صقر المنبثقة القابلة للسحب (مصغرة ومركزة) --------
const DraggableSaqrModal: React.FC<{ isOpen: boolean; onClose: () => void; children: ReactNode }> = ({ isOpen, onClose, children }) => {
    const { locale, dir } = useLanguage();
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
                        <h3 className="font-black text-lg text-slate-900 dark:text-white uppercase tracking-widest leading-none mb-1 pointer-events-none">{locale === 'en' ? 'Saqr AI' : 'صقر الذكي'}</h3>
                        <div className="flex items-center gap-1.5 pointer-events-none">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-black uppercase">{locale === 'en' ? 'Online' : 'متصل'}</span>
                        </div>
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
  const { locale, setLocale, dir } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const updateMousePos = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) {
      if (e.touches.length > 0) {
        setMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    } else {
      setMousePos({ x: (e as React.MouseEvent).clientX, y: (e as React.MouseEvent).clientY });
    }
  };

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

  const links: NavLink[] = [
    { path: '/search', label: locale === 'en' ? 'Search' : 'البحث بالمكتبة', icon: <SearchIcon />, hint: locale === 'en' ? 'Library Index' : 'فهرس الكتب', color: 'bg-rose-500' },
    { path: '/digital-library', label: locale === 'en' ? 'Digital' : 'المكتبة الرقمية', icon: <BookIcon />, hint: locale === 'en' ? 'E-Books' : 'المكتبة الرقمية', color: 'bg-blue-500' },
    { path: '/creators', label: locale === 'en' ? 'Creators' : 'بوابة المبدعين', icon: <PaletteIcon />, hint: locale === 'en' ? 'Talents' : 'إبداعات طلابنا', color: 'bg-purple-500' },
    { path: '/game', label: locale === 'en' ? 'Games' : 'ألعاب', icon: <GameIcon />, hint: locale === 'en' ? 'Games' : 'ألعاب', color: 'bg-amber-500' },
    { path: '/feedback', label: locale === 'en' ? 'Ideas' : 'مقترحات', icon: <FeedbackIcon />, hint: locale === 'en' ? 'Contact' : 'رأيك يهمنا', color: 'bg-emerald-500' }, 
    { path: '/reports', label: locale === 'en' ? 'Reports' : 'تقارير', icon: <ReportsIcon />, hint: locale === 'en' ? 'Reports' : 'تقارير', color: 'bg-slate-700' },
    { path: '/map', label: locale === 'en' ? "Lib's Map" : 'خريطة المكتبة', icon: <MapIcon />, hint: locale === 'en' ? 'Shelf Cont' : 'محتويات الأرفف', color: 'bg-sky-500' },
    { path: '/about', label: locale === 'en' ? 'About' : 'عنا', icon: <AboutIcon />, hint: locale === 'en' ? 'About us' : 'من نحن؟', color: 'bg-teal-500' },
  ];

  return (
    <header className={`fixed top-4 left-0 right-0 z-[60] px-2 flex justify-center transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0 pointer-events-none'}`}>
      
      <div className="w-full max-w-[95%] md:w-fit md:max-w-full px-3 py-2 md:px-5 md:py-3 rounded-[2rem] border-4 border-white dark:border-slate-700/50 flex items-center gap-3 md:gap-6 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md overflow-visible transition-colors duration-300">
        
        <Link to="/" className="flex items-center gap-2 md:gap-3 group flex-shrink-0">
          <img src="https://www.efipslibrary.online/school-logo.png" alt="EFIPS" className="h-8 w-8 md:h-10 md:w-10 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 dark:brightness-0 dark:invert drop-shadow-md shrink-0" onError={(e) => e.currentTarget.style.display='none'} />
          <div className="hidden lg:flex flex-col text-start justify-center">
            <span className="font-black text-slate-900 dark:text-white text-[10px] md:text-[11px] uppercase opacity-90 group-hover:text-rose-500 transition-colors tracking-wide leading-tight line-clamp-2 max-w-[150px] xl:max-w-[190px]">
              {locale === 'en' ? "Emirates Falcon Int'l. Private School" : "مدرسة صقر الإمارات الدولية الخاصة"}
            </span>
          </div>
        </Link>
        
        {/* استخدام التمرير الأفقي للأجهزة الصغيرة مع السماح بظهور الأيقونات رأسياً */}
        <nav className="flex-1 md:flex-none overflow-x-auto overflow-y-visible no-scrollbar scroll-smooth flex items-end h-12 md:h-12 px-2 md:px-4 bg-slate-100 dark:bg-slate-800 rounded-full shadow-inner border-2 border-slate-200 dark:border-slate-700">
          <div className="flex items-end gap-1.5 md:gap-2 h-full pb-1 mx-auto min-w-max px-2">
            {links.map((l, index) => {
              const isHovered = hoveredIndex === index;
              const isNeighbor = hoveredIndex === index - 1 || hoveredIndex === index + 1;
              const isActive = location.pathname === l.path;

              let effectClasses = "scale-100 translate-y-0 z-10 mx-0 md:mx-0.5";
              if (isHovered) {
                  effectClasses = "scale-[1.8] md:scale-[2] -translate-y-8 md:-translate-y-10 z-[100] mx-4 md:mx-6 shadow-2xl border-2 border-white/50";
              } else if (isNeighbor) {
                  effectClasses = "scale-[1.3] md:scale-[1.4] -translate-y-3 md:-translate-y-4 z-50 mx-2 shadow-lg";
              }

              return (
                <div 
                   key={l.path} 
                   className="relative flex flex-col items-center justify-end h-full group"
                   onMouseEnter={(e) => { setActiveHint(l.path); setHoveredIndex(index); updateMousePos(e); }} 
                   onMouseLeave={() => { setActiveHint(null); setHoveredIndex(null); }}
                   onMouseMove={updateMousePos}
                   onTouchStart={(e) => { e.stopPropagation(); setActiveHint(activeHint === l.path ? null : l.path); setHoveredIndex(index); updateMousePos(e); }}
                   onTouchEnd={() => { setTimeout(() => { setHoveredIndex(null); setActiveHint(null); }, 1500); }}
                >
                  {activeHint === l.path && (
                    <div 
                      className="fixed z-[99999] pointer-events-none"
                      style={{ 
                        left: mousePos.x, 
                        top: mousePos.y + 20,
                        transform: 'translate(-50%, 0)' 
                      }}
                    >
                      <div className={`px-3 py-1.5 ${l.color} text-white text-[10px] md:text-[11px] font-black rounded-lg shadow-xl whitespace-nowrap animate-zoom-in border-2 border-white/20 relative uppercase tracking-wider`}>
                        <div className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 ${l.color} rotate-45 rounded-sm`}></div>
                        <span className="relative z-10">{l.hint}</span>
                      </div>
                    </div>
                  )}

                  <Link 
                    to={l.path} 
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center origin-bottom will-change-transform ${effectClasses} ${
                      isActive 
                        ? `${l.color} text-white shadow-md border-transparent` 
                        : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 border-2 border-slate-200 dark:border-slate-600'
                    }`}
                    style={{ transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                  >
                    <span className="drop-shadow-sm pointer-events-none">{l.icon}</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </nav>
        
        <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
          <button onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-slate-700 dark:text-slate-200 font-black text-[10px] md:text-xs border-2 border-slate-300 dark:border-slate-600 rounded-full hover:border-amber-400 dark:hover:border-amber-500 transition-all active:scale-90 shadow-sm bg-slate-50 dark:bg-slate-800">
            {locale === 'en' ? 'AR' : 'EN'}
          </button>
          <button onClick={toggleTheme} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] md:text-sm shadow-inner transition-all border-2 border-slate-200 dark:border-slate-600 active:scale-90 hover:border-sky-400 dark:hover:border-sky-500">
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

// -------- 4. المكون الرئيسي والتوزيع الداخلي --------
const MainLayout: React.FC = () => {
  const [isSaqrModalOpen, setIsSaqrModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 font-sans transition-colors duration-300 flex flex-col selection:bg-rose-500/30 relative">
      
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-50 dark:opacity-20">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-400/20 rounded-full blur-[100px] animate-blob"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-emerald-400/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
      </div>

      <Header />
      <FloatingSaqr onOpenModal={() => setIsSaqrModalOpen(true)} />
      
      <main className="flex-1 relative z-10 w-full pt-20 md:pt-24">
        <Routes>
          <Route path="/" element={<HomePage />} />
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
        </Routes>
      </main>

      <footer className="relative z-10 py-10 text-center border-t-4 border-slate-200 dark:border-slate-800 mx-4 md:mx-20 mt-10">
        <div className="h-2 w-16 bg-rose-500 mx-auto mb-6 rounded-full"></div>
        <p className="font-black text-[10px] md:text-xs tracking-widest uppercase text-slate-500 dark:text-slate-400">EFIPS • Library • 2026</p>
        <p className="mt-2 font-bold text-slate-400 dark:text-slate-500 text-[9px] md:text-[10px] uppercase">&copy; Emirates Falcon Int'l. Private School</p>
      </footer>

      <DraggableSaqrModal isOpen={isSaqrModalOpen} onClose={() => setIsSaqrModalOpen(false)}>
         <div className="w-full flex flex-col h-auto max-h-full">
             <SmartSearchPage />
         </div>
      </DraggableSaqrModal>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        * { font-family: 'Cairo', sans-serif !important; }
        
        .saqr-modal-override > div {
            min-height: 0 !important;
            height: auto !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            display: flex;
            flex-direction: column;
        }
        
        .saqr-modal-override header {
            display: none !important;
        }
        
        .saqr-modal-override .absolute.bottom-0 {
            position: relative !important;
            order: 1 !important; 
            background: transparent !important;
            padding: 10px 0 !important;
            margin: 0 !important;
            width: 100% !important;
        }

        .saqr-modal-override .flex-1.overflow-y-auto {
            order: 2 !important; 
            height: auto !important;
            max-height: 50vh !important; 
            padding: 0 !important;
            margin: 0 !important;
            overflow-y: auto !important;
        }
        
        .saqr-modal-override input {
            font-size: 0.9rem !important;
            padding: 12px 18px !important;
            border-radius: 2rem !important;
            border-width: 2px !important;
        }
        .saqr-modal-override button {
            width: 40px !important;
            height: 40px !important;
            margin: 4px !important;
        }
        .saqr-modal-override .prose {
            font-size: 0.85rem !important;
            line-height: 1.6 !important;
        }
        .saqr-modal-override .bg-white.dark\\:bg-slate-800 {
            padding: 12px 16px !important;
            border-radius: 1.5rem !important;
        }
        .saqr-modal-override .w-12.h-12 {
            display: none !important;
        }
        .saqr-modal-override footer {
            display: none !important; 
        }
        .saqr-modal-override .max-w-4xl {
             width: 100% !important;
             max-width: 100% !important;
             margin: 0 !important;
             padding: 0 !important;
        }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 8s infinite alternate ease-in-out; }
        .animation-delay-2000 { animation-delay: 2s; }

        @keyframes float { 
          0%, 100% { transform: translateY(0px); } 
          50% { transform: translateY(-10px); } 
        }
        .animate-float { animation: float 5s ease-in-out infinite; }
        
        @keyframes ripple {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
        }
        .animate-ripple { animation: ripple 0.6s linear forwards; }
        
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }

        @keyframes zoom-in { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
        .animate-zoom-in { animation: zoom-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
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
