import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { bookData } from '../api/bookData'; 
import { useLanguage, useTheme } from '../App';

export interface LogEntry {
  timestamp: number;
  type: 'search' | 'view';
  value: string;
}

interface ChartData {
  name: string;
  count: number;
}

const COLORS = ['#00732F', '#059669', '#10B981', '#34D399', '#064E3B'];
const BLUE_GRADIENT = '#2563EB';
const SCHOOL_LOGO = "/school-logo.png"; 

const translations = {
  ar: {
    pageTitle: "تقارير مكتبة صقر الإمارات",
    noData: "لا توجد بيانات متاحة لعرضها.",
    mostSearched: "أكثر المصطلحات بحثاً",
    searches: "عمليات البحث",
    mostViewed: "أكثر الكتب مشاهدة",
    views: "المشاهدات",
    shelfStats: "إحصائيات توزيع الرفوف",
    shelfName: "الرف",
    bookCount: "عدد الكتب",
    printBtn: "تصدير التقرير النهائي (PDF)",
    passwordPrompt: "يرجى إدخال كلمة المرور للوصول إلى التقارير.",
    passwordLabel: "كلمة المرور",
    enter: "دخول آمن",
    wrongPassword: "كلمة المرور غير صحيحة",
    liveStats: "إحصائيات مباشرة من قاعدة البيانات",
    officialReport: "تقرير جرد المكتبة الرسمي"
  },
  en: {
    pageTitle: "Saqr Library Reports",
    noData: "No data available.",
    mostSearched: "Most Searched Terms",
    searches: "Searches",
    mostViewed: "Most Viewed Books",
    views: "Views",
    shelfStats: "Bookshelf Distribution",
    shelfName: "Shelf",
    bookCount: "Books",
    printBtn: "Export Official Report (PDF)",
    passwordPrompt: "Enter the secure password to access Analytics.",
    passwordLabel: "Password",
    enter: "Secure Login",
    wrongPassword: "Incorrect Password",
    liveStats: "Live Database Analytics",
    officialReport: "Official Library Audit Report"
  }
};

const processLogs = (): { searchData: ChartData[], viewData: ChartData[], shelfData: ChartData[] } => {
  try {
    const logs: LogEntry[] = JSON.parse(localStorage.getItem('saqr_activity_logs') || '[]');
    const searchCounts: { [key: string]: number } = {};
    const viewCounts: { [key: string]: number } = {};

    logs.forEach((log) => {
      if (log.type === 'search' && log.value) {
        searchCounts[log.value] = (searchCounts[log.value] || 0) + 1;
      } else if (log.type === 'view' && log.value) {
        viewCounts[log.value] = (viewCounts[log.value] || 0) + 1;
      }
    });

    const searchData = Object.entries(searchCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const viewData = Object.entries(viewCounts)
      .map(([id, count]) => {
        const book = bookData.find(b => b.id === id);
        return { name: book ? book.title : 'Unknown Book', count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const shelfCounts = bookData.reduce((acc: any, book) => {
        const s = book.shelf.toString();
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {});
    
    const shelfData = Object.keys(shelfCounts)
        .map(key => ({ name: key, count: shelfCounts[key] }))
        .sort((a, b) => parseInt(a.name) - parseInt(b.name));

    return { searchData, viewData, shelfData };
  } catch (error) {
    return { searchData: [], viewData: [], shelfData: [] };
  }
};

const ReportsPage: React.FC = () => {
  const { locale, dir } = useLanguage();
  const { theme } = useTheme();
  const isAr = locale === 'ar';
  const t = (key: keyof typeof translations.ar) => translations[locale][key];
  
  const [data, setData] = useState(processLogs());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

  useEffect(() => {
    const auth = sessionStorage.getItem('reports_authenticated') === 'true';
    setIsAuthenticated(auth);
    if (auth) setData(processLogs());
  }, []);

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent, callback: () => void) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const rippleId = Date.now();
    setRipples(prev => [...prev, { id: rippleId, x, y }]);
    setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== rippleId));
        callback();
    }, 400);
  };

  const handleLogin = () => {
    if (password === '101110') { 
      sessionStorage.setItem('reports_authenticated', 'true');
      setIsAuthenticated(true);
      setData(processLogs());
      setError('');
    } else {
      setError(t('wrongPassword'));
    }
  };

  const handlePrint = () => window.print();
  
  const tickColor = theme === 'dark' ? '#94A3B8' : '#475569';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const yAxisRtl = dir === 'rtl' ? { orientation: 'right' } as const : { orientation: 'left' } as const;

  // واجهة الدخول
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="glass-panel p-10 md:p-14 rounded-[3.5rem] shadow-2xl text-center max-w-lg w-full border-white/30 dark:border-white/10">
          <div className="mb-8 flex flex-col items-center">
             <img src={SCHOOL_LOGO} alt="Logo" className="h-28 w-28 object-contain mb-6 drop-shadow-xl rotate-12" />
             <h1 className="text-4xl font-black text-gray-950 dark:text-white tracking-tighter">{t('pageTitle')}</h1>
             <div className="h-1.5 w-16 bg-green-700 rounded-full mt-4 shadow-lg"></div>
          </div>
          
          <p className="mb-10 text-gray-600 dark:text-gray-400 font-bold text-lg leading-relaxed">{t('passwordPrompt')}</p>
          
          <div className="space-y-6">
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full p-6 text-center bg-white/60 dark:bg-gray-900/60 text-gray-950 dark:text-white border-2 border-transparent focus:border-green-600 rounded-[2rem] outline-none transition-all shadow-inner font-black text-2xl tracking-widest placeholder:tracking-normal placeholder:text-gray-400"
                placeholder={t('passwordLabel')}
            />
            {error && <p className="text-red-500 font-black animate-shake">{error}</p>}
            
            <button 
                onMouseDown={(e) => handleInteraction(e, handleLogin)}
                onTouchStart={(e) => handleInteraction(e, handleLogin)}
                className="relative overflow-hidden glass-button-red w-full py-6 rounded-[2rem] font-black text-xl shadow-2xl transition-all"
            >
              {ripples.map(r => <span key={r.id} className="ripple-effect border-red-500/30" style={{ left: r.x, top: r.y }} />)}
              <span className="relative z-10">{t('enter')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4 animate-in fade-in duration-1000">
      
      {/* هيدر الصفحة المطور (يختفي عند الطباعة) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/10 pb-12 print:hidden">
        <div className="text-center md:text-start">
          <h1 className="text-4xl md:text-6xl font-black text-gray-950 dark:text-white mb-4 tracking-tighter">{t('pageTitle')}</h1>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-600"></span>
            </span>
            <p className="text-green-800 dark:text-green-400 font-black text-lg">{t('liveStats')}</p>
          </div>
        </div>
        
        <button 
          onMouseDown={(e) => handleInteraction(e, handlePrint)}
          onTouchStart={(e) => handleInteraction(e, handlePrint)}
          className="relative overflow-hidden glass-button-red flex items-center gap-4 px-12 py-6 rounded-[2rem] font-black shadow-2xl text-lg transition-all"
        >
          {ripples.map(r => <span key={r.id} className="ripple-effect border-red-500/40" style={{ left: r.x, top: r.y }} />)}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          <span className="relative z-10">{t('printBtn')}</span>
        </button>
      </div>

      {/* الرسوم البيانية (تختفي عند الطباعة) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 print:hidden">
        <div className="glass-panel p-10 rounded-[3.5rem] shadow-2xl border-white/20">
          <h2 className="text-3xl font-black mb-12 text-gray-900 dark:text-white flex items-center gap-4"><span className="w-2.5 h-10 bg-green-700 rounded-full shadow-[0_0_15px_rgba(0,115,47,0.4)]"></span>{t('shelfStats')}</h2>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <BarChart data={data.shelfData}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={gridColor}/>
                <XAxis dataKey="name" stroke={tickColor} fontSize={14} tick={{fontWeight: '900'}} />
                <YAxis stroke={tickColor} fontSize={14} tick={{fontWeight: '900'}} />
                <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', fontWeight: '900' }} />
                <Bar dataKey="count" name={t('bookCount')} fill="#00732F" radius={[15, 15, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-10 rounded-[3.5rem] shadow-2xl border-white/20">
          <h2 className="text-3xl font-black mb-12 text-gray-900 dark:text-white flex items-center gap-4"><span className="w-2.5 h-10 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"></span>{t('mostSearched')}</h2>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <BarChart data={data.searchData} layout="vertical">
                <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke={gridColor}/>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke={tickColor} width={120} fontSize={14} tick={{fontWeight: '900'}} {...yAxisRtl} />
                <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', fontWeight: '900' }} />
                <Bar dataKey="count" name={t('searches')} fill={BLUE_GRADIENT} radius={[0, 15, 15, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- قسم التقرير الرسمي للطباعة فقط --- */}
      <div className="hidden print:block mt-10 p-12 bg-white text-black rounded-none border-[12px] border-green-700 min-h-[1000px]">
        
        {/* هيدر التقرير مع الشعار المائل */}
        <div className="flex justify-between items-center mb-12 pb-8 border-b-4 border-gray-100">
            <div className="flex items-center gap-6">
                <img src={SCHOOL_LOGO} alt="Saqr Logo" className="h-40 w-40 object-contain rotate-6" />
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-green-700 leading-none">Emirates Falcon</h2>
                    <p className="text-xl font-bold text-gray-500 mt-2">International Private School</p>
                </div>
            </div>
            <div className="text-end">
                <h3 className="text-2xl font-black text-gray-900 mb-1">{t('officialReport')}</h3>
                <p className="text-lg font-bold text-gray-400 italic">Report Date: {new Date().toLocaleDateString(locale)}</p>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-16">
            <div className="p-8 bg-gray-50 rounded-[2rem] border-2 border-gray-100">
                <h4 className="text-xl font-black mb-4 text-green-700 uppercase">Library Capacity Summary</h4>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="font-bold">Total Active Shelves:</span>
                    <span className="font-black text-2xl">{data.shelfData.length}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                    <span className="font-bold">Total Cataloged Items:</span>
                    <span className="font-black text-2xl text-green-700">{bookData.length}</span>
                </div>
            </div>
            <div className="p-8 bg-gray-50 rounded-[2rem] border-2 border-gray-100 flex flex-col justify-center text-center">
                 <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Authenticated By</p>
                 <p className="text-2xl font-black">Saqr AI Analytics System</p>
                 <p className="text-xs text-gray-400 mt-2">Generated by Islam Soliman</p>
            </div>
        </div>

        {/* جدول الجرد */}
        <table className="w-full text-start border-collapse text-xl">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="p-8 border-2 border-green-800 text-start font-black">{t('shelfName')}</th>
              <th className="p-8 border-2 border-green-800 text-start font-black">{t('bookCount')}</th>
              <th className="p-8 border-2 border-green-800 text-start font-black">Audit Status</th>
            </tr>
          </thead>
          <tbody>
            {data.shelfData.map(s => (
              <tr key={s.name} className="even:bg-gray-50 border-b border-gray-100">
                <td className="p-8 border-x border-gray-200 font-bold">{isAr ? 'الرف رقم' : 'Shelf Number'} {s.name}</td>
                <td className="p-8 border-x border-gray-200 font-black text-green-700 text-3xl">{s.count}</td>
                <td className="p-8 border-x border-gray-200 font-bold text-gray-400 italic">Verified</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* فوتر التقرير مع الختم الرسمي */}
        <div className="mt-32 flex justify-between items-end">
            <div className="text-center">
                <div className="w-64 h-0.5 bg-black mb-4"></div>
                <p className="font-black text-xl uppercase tracking-widest">Librarian Signature</p>
                <p className="text-gray-400 font-bold text-sm italic">{isAr ? 'إسلام سليمان' : 'Islam Soliman'}</p>
            </div>
            <div className="flex flex-col items-center opacity-40">
                <img src={SCHOOL_LOGO} alt="Stamp" className="h-28 w-28 object-contain grayscale mb-2" />
                <p className="font-black text-xl italic tracking-tighter">E.F.I.P.S SEAL</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
