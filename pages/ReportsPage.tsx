import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { bookData } from '../api/bookData'; 
import { useLanguage, useTheme } from '../App';

// --- مصفوفة تعريف الكتب الرقمية للتقارير ---
const ARABIC_DIGITAL_TITLES: Record<string, string> = {
    "AR_1": "مجموعة روايات أجاثا كريستي", "AR_2": "أرض الإله", "AR_3": "أرض النفاق", "AR_4": "أكواريل",
    "AR_5": "الفيل الأزرق", "AR_6": "نائب عزارئيل", "AR_7": "المكتبة الخضراء للأطفال", "AR_36": "حكايات الغرفة 207", 
    "AR_37": "يوتوبيا", "AR_38": "خلف أسوار العقل", "AR_39": "إنهم يأتون ليلاً", "AR_40": "الذين كانوا", "AR_41": "ألف اختراع واختراع"
};

const ENGLISH_DIGITAL_TITLES: Record<string, string> = {
    "EN_1": "Me Before You", "EN_2": "The Great Gatsby", "EN_3": "The Kite Runner", "EN_19": "HP: Deathly Hallows", 
    "EN_20": "HP: Half Blood Prince", "EN_25": "HP: Sorcerers Stone", "EN_26": "Fantastic Beasts"
};

const SCHOOL_LOGO = "/school-logo.png"; 

const translations = {
  ar: {
    pageTitle: "مركز تحليلات مكتبة صقر الإمارات",
    passwordPrompt: "منطقة محمية للمسؤولين. يرجى إدخال رمز الوصول.",
    passwordLabel: "الرقم السري",
    enter: "دخول آمن للمسؤول",
    wrongPassword: "رمز الوصول غير صحيح، حاول مرة أخرى.",
    liveStats: "إحصائيات التفاعل المباشر (2026)",
    mostViewed: "المصادر الأكثر تصفحاً",
    mostSearched: "الكلمات الأكثر بحثاً",
    shelfStats: "جرد المخزون الورقي",
    printBtn: "تصدير تقرير رسمي (PDF)",
    officialReport: "تقرير جرد ونشاط المكتبة الموحد",
    librarian: "إسلام سليمان",
    role: "أمين المكتبة / قيم المحتوى الرقمي"
  },
  en: {
    pageTitle: "Saqr Library Analytics Center",
    passwordPrompt: "Restricted Admin Area. Please enter access code.",
    passwordLabel: "Access Password",
    enter: "Secure Admin Login",
    wrongPassword: "Incorrect access code, try again.",
    liveStats: "Live Engagement Analytics (2026)",
    mostViewed: "Top Viewed Resources",
    mostSearched: "Trending Search Terms",
    shelfStats: "Physical Inventory Status",
    printBtn: "Export Official PDF",
    officialReport: "Unified Library Activity Report",
    librarian: "Islam Soliman",
    role: "School Librarian / Digital Curator"
  }
};

const ReportsPage: React.FC = () => {
  const { locale, dir } = useLanguage();
  const { theme } = useTheme();
  const isAr = locale === 'ar';
  const t = (key: keyof typeof translations.ar) => translations[locale][key];
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = useCallback(() => {
    if (password === '101110') { 
      sessionStorage.setItem('saqr_admin_auth', 'true');
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  }, [password]);

  useEffect(() => {
    const auth = sessionStorage.getItem('saqr_admin_auth') === 'true';
    if (auth) setIsAuthenticated(true);
  }, []);

  const data = useMemo(() => {
    const logs = JSON.parse(localStorage.getItem('saqr_activity_logs') || '[]');
    const searchCounts: Record<string, number> = {};
    const viewCounts: Record<string, number> = {};

    logs.forEach((log: any) => {
      if (log.type === 'search') searchCounts[log.value] = (searchCounts[log.value] || 0) + 1;
      if (log.type === 'view') viewCounts[log.value] = (viewCounts[log.value] || 0) + 1;
    });

    const viewData = Object.entries(viewCounts).map(([id, count]) => {
      const pBook = bookData.find(b => b.id === id);
      const title = pBook?.title || ARABIC_DIGITAL_TITLES[id] || ENGLISH_DIGITAL_TITLES[id] || id;
      return { name: title, count };
    }).sort((a, b) => b.count - a.count).slice(0, 10);

    const shelfData = bookData.reduce((acc: any[], b) => {
      const shelfName = b.shelf.toString();
      const s = acc.find(x => x.name === shelfName);
      if (s) s.count++; else acc.push({ name: shelfName, count: 1 });
      return acc;
    }, []).sort((a, b) => parseInt(a.name) - parseInt(b.name));

    return { 
      viewData, 
      searchData: Object.entries(searchCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 8),
      shelfData
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="glass-panel p-10 md:p-16 rounded-[4rem] shadow-2xl text-center max-w-xl w-full border-white/40 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl animate-in zoom-in-95">
          <div className="relative inline-block mb-10">
             <div className="absolute inset-0 bg-red-600 blur-2xl opacity-20 animate-pulse"></div>
             <img src={SCHOOL_LOGO} alt="Logo" className="h-28 relative z-10 logo-white-filter rotate-12 drop-shadow-2xl" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white mb-4 tracking-tighter">{t('pageTitle')}</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold mb-10 leading-relaxed">{t('passwordPrompt')}</p>
          
          <input
              type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className={`w-full p-6 text-center bg-slate-100 dark:bg-black/40 border-2 ${error ? 'border-red-500 animate-shake' : 'border-transparent focus:border-green-600'} rounded-3xl outline-none font-black text-3xl tracking-[0.6em] mb-6 shadow-inner transition-all`}
              placeholder="••••••"
          />

          <button 
            onClick={handleLogin}
            className="w-full glass-button-base bg-green-700 text-white py-6 rounded-3xl font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            {t('enter')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir={dir} className="max-w-7xl mx-auto space-y-12 pb-32 px-4 animate-in fade-in duration-1000 relative">
      {/* الهيرو (العنوان العلوي) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-slate-200 dark:border-white/10 pb-12 print:hidden">
        <div className="text-center md:text-start">
          <h1 className="text-4xl md:text-6xl font-black text-slate-950 dark:text-white mb-4 tracking-tighter leading-none">{t('pageTitle')}</h1>
          <div className="flex items-center gap-3 justify-center md:justify-start text-green-600 font-black">
            <span className="relative flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
            </span>
            <p className="text-lg uppercase tracking-widest">{t('liveStats')}</p>
          </div>
        </div>
        <button onClick={() => window.print()} className="glass-button-base bg-gray-950 text-white dark:bg-white dark:text-gray-950 px-12 py-5 rounded-[2rem] font-black shadow-2xl flex items-center gap-4 hover:scale-105 transition-all">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
          <span className="text-xl">{t('printBtn')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 print:hidden">
        {/* شارت الأكثر تصفحاً */}
        <div className="glass-panel p-10 rounded-[3.5rem] shadow-2xl border-white/40 dark:border-white/10 relative overflow-hidden">
          <h2 className="text-2xl font-black mb-10 text-slate-900 dark:text-white flex items-center gap-4">
            <span className="w-2.5 h-10 bg-green-600 rounded-full shadow-lg"></span>
            {t('mostViewed')}
          </h2>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <BarChart data={data.viewData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.05)"/>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke={theme === 'dark' ? '#94A3B8' : '#475569'} width={150} fontSize={11} tick={{fontWeight: '900'}} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ borderRadius: '20px', border: 'none', fontWeight: '900', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" radius={[0, 15, 15, 0]}>
                  {data.viewData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#059669' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* شارت الكلمات الأكثر بحثاً */}
        <div className="glass-panel p-10 rounded-[3.5rem] shadow-2xl border-white/40 dark:border-white/10">
          <h2 className="text-2xl font-black mb-10 text-slate-900 dark:text-white flex items-center gap-4">
            <span className="w-2.5 h-10 bg-blue-600 rounded-full shadow-lg"></span>
            {t('mostSearched')}
          </h2>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <BarChart data={data.searchData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)"/>
                <XAxis dataKey="name" stroke={theme === 'dark' ? '#94A3B8' : '#475569'} fontSize={12} tick={{fontWeight: '900'}} />
                <YAxis stroke={theme === 'dark' ? '#94A3B8' : '#475569'} />
                <Tooltip contentStyle={{ borderRadius: '20px', fontWeight: '900', border: 'none' }} />
                <Bar dataKey="count" fill="#2563eb" radius={[15, 15, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* شارت جرد الرفوف */}
      <div className="glass-panel p-10 md:p-14 rounded-[4rem] shadow-2xl border-white/40 dark:border-white/10 print:hidden">
          <h2 className="text-2xl font-black mb-10 text-slate-900 dark:text-white flex items-center gap-4">
            <span className="w-2.5 h-10 bg-green-800 rounded-full"></span>
            {t('shelfStats')}
          </h2>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={data.shelfData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)"/>
                <XAxis dataKey="name" stroke={theme === 'dark' ? '#94A3B8' : '#475569'} tick={{fontWeight: '900'}} />
                <YAxis stroke={theme === 'dark' ? '#94A3B8' : '#475569'} />
                <Bar dataKey="count" fill="#15803d" radius={[12, 12, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
      </div>

      {/* --- قسم التقرير الرسمي الفخم (يظهر عند الطباعة فقط) --- */}
      <div className="hidden print:block p-16 bg-white text-black border-[20px] border-double border-green-800 min-h-[1200px] relative">
        <div className="flex justify-between items-center mb-20 pb-12 border-b-4 border-slate-100">
            <div className="flex items-center gap-8">
                <img src={SCHOOL_LOGO} alt="EFIIPS Logo" className="h-44 w-44 object-contain" />
                <div>
                    <h2 className="text-5xl font-black uppercase text-green-800 tracking-tighter leading-none">Emirates Falcon</h2>
                    <p className="text-xl font-bold text-slate-400 mt-2 tracking-[0.2em]">INTEGRATED ANALYTICS SYSTEM</p>
                </div>
            </div>
            <div className="text-end">
                <h3 className="text-3xl font-black mb-2 text-green-800">{t('officialReport')}</h3>
                <p className="text-xl font-bold text-slate-500 italic">Audit Reference: EF-LIB-{new Date().getFullYear()}</p>
                <p className="text-lg font-bold text-slate-400 mt-2">Date: {new Date().toLocaleDateString(locale)}</p>
            </div>
        </div>

        <table className="w-full text-start border-collapse rounded-xl overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-green-800 text-white text-2xl">
              <th className="p-8 border-2 border-green-900 text-start font-black">Resource Title</th>
              <th className="p-8 border-2 border-green-900 text-center font-black">Category</th>
              <th className="p-8 border-2 border-green-900 text-center font-black">Total Activity</th>
            </tr>
          </thead>
          <tbody>
            {data.viewData.map((item, i) => (
              <tr key={i} className="even:bg-green-50/50 border-b-2 border-slate-100 text-2xl">
                <td className="p-8 border-x-2 font-bold">{item.name}</td>
                <td className="p-8 border-x-2 text-center font-black text-slate-400 uppercase text-sm tracking-widest italic">Certified Resource</td>
                <td className="p-8 border-x-2 text-center font-black text-green-800 text-4xl">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* التوقيعات والختم */}
        <div className="mt-40 flex justify-between items-end relative">
            <div className="text-center relative">
                <div className="w-72 h-1.5 bg-slate-900 mb-6"></div>
                <p className="font-black text-2xl uppercase tracking-tighter text-slate-900">{t('librarian')}</p>
                <p className="text-lg italic font-bold text-slate-500 mt-1">{t('role')}</p>
                {/* توقيع وهمي فخم */}
                <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 opacity-20 rotate-[-5deg] font-serif text-5xl pointer-events-none select-none">
                   {t('librarian')}
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="relative h-32 w-32 mb-4">
                   <div className="absolute inset-0 border-4 border-green-800/30 rounded-full animate-spin-slow"></div>
                   <img src={SCHOOL_LOGO} alt="Official Seal" className="h-full w-full object-contain p-2 grayscale opacity-40" />
                </div>
                <p className="font-black text-sm tracking-widest text-slate-400">OFFICIAL E.F.I.P.S SEAL</p>
            </div>
        </div>
        
        {/* فوتر الورقة */}
        <div className="absolute bottom-10 left-16 right-16 flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest">
            <span>© 2026 Saqr AI Analytics Module</span>
            <span>Document generated by Islam Soliman</span>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
