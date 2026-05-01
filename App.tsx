import React, { useState, useEffect, createContext, useContext, ReactNode, useRef } from 'react';
import { createPortal } from 'react-dom';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

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
import CreatorsStudioPage from './pages/CreatorsStudioPage';
import SaqrStudioPage from './pages/SaqrStudioPage';
import PodcastPage from './pages/PodcastPage';

export type Locale = 'en' | 'ar';

// واجهة تعريف الروابط
interface NavLink {
  path: string;
  label: string;
  icon: string;
  hint: string;
  color: string;
}

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
        className="group relative w-14 h-14 md:w-16 md:h-16 rounded-[1.8rem] border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-center overflow-hidden hover:scale-110 hover:shadow-xl active:scale-95 transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl"
      >
        {ripples.map(r => (
          <span key={r.id} className="absolute rounded-full bg-red-600/30 animate-ripple pointer-events-none" style={{ left: r.x, top: r.y, width: 20, height: 20, transform: 'translate(-50%, -50%)' }} />
        ))}
        <img src="/saqr-avatar.png" alt="Saqr" className="w-[80%] h-[80%] object-contain animate-float" onError={(e) => e.currentTarget.src="https://www.efipslibrary.online/school-logo.png"} />
        <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 border-2 border-white dark:border-slate-800"></span>
        </span>
      </button>
    </div>
  );
};

// -------- 1.5. نافذة صقر المنبثقة القابلة للسحب (المعدلة) --------
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
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm pointer-events-auto animate-fade-in" onClick={onClose}></div>
            
            <div className="animate-zoom-in flex items-center justify-center pointer-events-none w-full h-full absolute inset-0 p-4">
                <div 
                    dir={dir}
                    className="relative w-full md:w-[450px] h-[85vh] md:h-[650px] bg-slate-50 dark:bg-slate-950 rounded-[2rem] shadow-2xl border border-white/40 dark:border-slate-700 flex flex-col pointer-events-auto overflow-hidden"
                    style={{ transform: `translate(${position.x}px, ${position.y}px)`, touchAction: 'none' }}
                >
                    <div 
                        className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between cursor-grab active:cursor-grabbing select-none touch-none z-50"
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                    >
                        <div className="flex items-center gap-3 pointer-events-none">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                                <img src="/saqr-avatar.png" alt="Saqr" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src="https://www.efipslibrary.online/school-logo.png"} />
                            </div>
                            <div>
                                <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-widest">{locale === 'en' ? 'Saqr AI' : 'صقر الذكي'}</h3>
                                <p className="text-[9px] text-green-600 font-bold flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> {locale === 'en' ? 'Online' : 'متصل'}
                                </p>
                            </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 rounded-full transition-all pointer-events-auto shadow-sm">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto no-scrollbar relative pointer-events-auto bg-slate-50 dark:bg-slate-950 cursor-auto">
                        <div className="w-full min-h-full">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

// -------- 2. هيدر EFIPS بتأثير Apple Dock السحري والأداء السلس --------
const Header: React.FC = () => {
  const { locale, setLocale, dir } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // تتبع إحداثيات الماوس أو اللمس بدقة للفلوت الطائر
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
    { path: '/search', label: locale === 'en' ? 'Search' : 'البحث بالمكتبة', icon: '🔍', hint: locale === 'en' ? 'Library Index' : 'فهرس الكتب', color: 'bg-red-600' },
    { path: '/digital-library', label: locale === 'en' ? 'Digital' : 'المكتبة الرقمية', icon: '📚', hint: locale === 'en' ? 'E-Books' : 'المكتبة الرقمية', color: 'bg-slate-800' },
    { path: '/creators', label: locale === 'en' ? 'Creators' : 'بوابة المبدعين', icon: '🎨', hint: locale === 'en' ? 'Talents' : 'إبداعات طلابنا', color: 'bg-red-500' },
    { path: '/feedback', label: locale === 'en' ? 'Ideas' : 'مقترحات', icon: '✍️', hint: locale === 'en' ? 'Contact' : 'رأيك يهمنا', color: 'bg-green-500' }, 
    { path: '/reports', label: locale === 'en' ? 'Reports' : 'تقارير', icon: '📊', hint: locale === 'en' ? 'Reports' : 'تقارير', color: 'bg-slate-700' },
    { path: '/map', label: locale === 'en' ? "Lib's Map" : 'خريطة المكتبة', icon: '🗺️', hint: locale === 'en' ? 'Shelf Cont' : 'محتويات الأرفف', color: 'bg-red-600' },
    { path: '/about', label: locale === 'en' ? 'About' : 'عنا', icon: 'ℹ️', hint: locale === 'en' ? 'About us' : 'من نحن؟', color: 'bg-green-600' },
  ];

  return (
    <header className={`fixed top-4 left-0 right-0 z-[60] px-2 flex justify-center transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0 pointer-events-none'}`}>
      
      <div className="w-full max-w-[95%] md:w-fit md:max-w-full px-3 py-2 md:px-5 md:py-3 rounded-full border border-white/40 dark:border-slate-700/50 flex items-center gap-3 md:gap-6 shadow-2xl backdrop-blur-2xl bg-white/75 dark:bg-slate-900/80 overflow-visible">
        
        <Link to="/" className="flex items-center gap-2 md:gap-3 group flex-shrink-0">
          <img src="https://www.efipslibrary.online/school-logo.png" alt="EFIPS" className="h-8 w-8 md:h-10 md:w-10 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 dark:brightness-0 dark:invert drop-shadow-md shrink-0" />
          <div className="hidden lg:flex flex-col text-start justify-center">
            <span className="font-bold text-slate-900 dark:text-white text-[10px] md:text-[11px] uppercase opacity-90 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors tracking-wide leading-tight line-clamp-2 max-w-[150px] xl:max-w-[190px]">
              {locale === 'en' ? "Emirates Falcon Int'l. Private School" : "مدرسة صقر الإمارات الدولية الخاصة"}
            </span>
          </div>
        </Link>
        
        <nav className="flex-1 md:flex-none overflow-x-auto no-scrollbar scroll-smooth flex items-end h-12 md:h-12 px-2 md:px-4 bg-slate-200/50 dark:bg-slate-800/50 rounded-full border border-white/60 dark:border-slate-600/50 shadow-inner">
          <div className="flex items-end gap-1 md:gap-2 h-full pb-1 mx-auto min-w-max">
            {links.map((l, index) => {
              const isHovered = hoveredIndex === index;
              const isNeighbor = hoveredIndex === index - 1 || hoveredIndex === index + 1;
              const isActive = location.pathname === l.path;

              // حساب حجم الحركة بنعومة
              let effectClasses = "scale-100 translate-y-0 z-10 mx-0 md:mx-0.5";
              if (isHovered) {
                  effectClasses = "scale-[1.5] md:scale-[1.7] -translate-y-3 md:-translate-y-4 z-30 mx-3 md:mx-5 shadow-2xl";
              } else if (isNeighbor) {
                  effectClasses = "scale-[1.15] md:scale-[1.25] -translate-y-1.5 md:-translate-y-2 z-20 mx-1.5 md:mx-2 shadow-lg";
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
                  
                  {/* الفلوت الحر الطائر (Fixed) لتخطي جميع حدود الشريط واتباع الماوس */}
                  {activeHint === l.path && (
                    <div 
                      className="fixed z-[99999] pointer-events-none"
                      style={{ 
                        left: mousePos.x, 
                        top: mousePos.y - 25, // يظهر فوق الماوس/اللمس بمسافة ممتازة
                        transform: 'translate(-50%, -100%)' 
                      }}
                    >
                      <div className={`px-2.5 py-1 ${l.color} text-white text-[9px] md:text-[10px] font-bold rounded-md shadow-2xl whitespace-nowrap animate-zoom-in border border-white/20 relative`}>
                        {/* المثلث الصغير يشير للأسفل (تجاه الماوس) */}
                        <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 ${l.color} rotate-45 rounded-sm`}></div>
                        <span className="relative z-10 tracking-wide">{l.hint}</span>
                      </div>
                    </div>
                  )}

                  <Link 
                    to={l.path} 
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center origin-bottom will-change-transform ${effectClasses} ${
                      isActive 
                        ? 'bg-red-600 text-white shadow-red-600/40 border-transparent' 
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600/50'
                    }`}
                    style={{ transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                  >
                    <span className="text-sm md:text-lg drop-shadow-sm pointer-events-none">{l.icon}</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </nav>
        
        {/* أزرار اللغة والوضع الليلي */}
        <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
          <button onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-[10px] md:text-xs border border-slate-300 dark:border-slate-600 rounded-full hover:border-red-600 hover:text-red-600 dark:hover:border-red-500 dark:hover:text-red-400 transition-all active:scale-90 shadow-sm bg-white dark:bg-slate-800 hover:scale-105">
            {locale === 'en' ? 'AR' : 'EN'}
          </button>
          <button onClick={toggleTheme} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] md:text-sm shadow-inner transition-all hover:scale-110 border border-slate-200 dark:border-slate-600 active:scale-90">
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300 flex flex-col selection:bg-red-500/30 relative">
      
      {/* الخلفية الديناميكية الموحدة للهوية الوطنية (الأحمر والأخضر) */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-40 dark:opacity-20">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/30 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-green-600/30 rounded-full blur-[100px]"></div>
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
          <Route path="/creators-studio" element={<CreatorsStudioPage />} />
          <Route path="/saqr-studio" element={<SaqrStudioPage />} />
          <Route path="/podcast" element={<PodcastPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/feedback" element={<FeedbackPage />} /> 
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>

      <footer className="relative z-10 py-10 text-center border-t border-slate-200 dark:border-slate-800 mx-4 md:mx-20 mt-10">
        <div className="h-1.5 w-16 bg-red-600 mx-auto mb-6 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
        <p className="font-semibold text-[10px] md:text-xs tracking-widest uppercase text-slate-500 dark:text-slate-400">EFIPS • Library • 2026</p>
        <p className="mt-2 font-medium text-slate-400 dark:text-slate-500 text-[9px] md:text-[10px] uppercase">&copy; Emirates Falcon Int'l. Private School</p>
      </footer>

      {/* 🚀 نافذة صقر المنبثقة الذكية 🚀 */}
      <DraggableSaqrModal isOpen={isSaqrModalOpen} onClose={() => setIsSaqrModalOpen(false)}>
         <SmartSearchPage />
      </DraggableSaqrModal>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;900&display=swap');
        * { font-family: 'Cairo', sans-serif !important; }
        
        @keyframes float { 
          0%, 100% { transform: translateY(0px) rotate(0deg); } 
          50% { transform: translateY(-10px) rotate(3deg); } 
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        
        @keyframes ripple {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }
        .animate-ripple { animation: ripple 0.6s linear forwards; }
        
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        
        @keyframes zoom-in { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
        .animate-zoom-in { animation: zoom-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        /* إخفاء شريط التمرير مع الاحتفاظ بالقدرة على التمرير */
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
