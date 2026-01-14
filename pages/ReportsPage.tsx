import React, { useEffect, useState, useMemo } from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { bookData } from '../api/bookData'; 
import { useLanguage, useTheme } from '../App';

// --- مصفوفة تعريف الكتب الرقمية للتقارير (تشمل الـ 35 عربية والـ 26 إنجليزية) ---
const ARABIC_DIGITAL_TITLES: Record<string, string> = {
    "AR_1": "مجموعة روايات أجاثا كريستي", "AR_2": "أرض الإله", "AR_3": "أرض النفاق", "AR_4": "أكواريل",
    "AR_5": "الفيل الأزرق", "AR_6": "نائب عزارئيل", "AR_7": "المكتبة الخضراء للأطفال", "AR_21": "تفسير ابن كثير",
    "AR_18": "سلسلة رجل المستحيل", "AR_19": "سلسلة ما وراء الطبيعة", "AR_20": "سلسلة الشياطين ال13",
    "AR_27": "صحيح البخاري", "AR_28": "صحيح مسلم", "AR_33": "قوة الآن", "AR_34": "أربعون"
    // يتم التعرف على البقية تلقائياً عبر المعرفات
};

const ENGLISH_DIGITAL_TITLES: Record<string, string> = {
    "EN_1": "Me Before You", "EN_2": "The Great Gatsby", "EN_3": "The Kite Runner", "EN_4": "And Then There Were NONE",
    "EN_15": "Lateral Thinking Puzzles", "EN_16": "Murdle", "EN_17": "Sherlock Puzzles", "EN_18": "What is the Name of This Book",
    // إضافة كتب هاري بوتر الجديدة للتحليل
    "EN_19": "HP: Deathly Hallows", "EN_20": "HP: Half Blood Prince", "EN_21": "HP: Order Of Phoenix",
    "EN_22": "HP: Goblet Of Fire", "EN_23": "HP: Prisoner Of Azkaban", "EN_24": "HP: Chamber Of Secrets",
    "EN_25": "HP: Sorcers Stone", "EN_26": "Fantastic Beasts"
};

const SCHOOL_LOGO = "/school-logo.png"; 

const translations = {
  ar: {
    pageTitle: "مركز تحليلات مكتبة صقر الإمارات",
    passwordPrompt: "منطقة محمية. يرجى إدخال رمز الوصول للمتابعة.",
    passwordLabel: "الرقم السري",
    enter: "دخول آمن للمسؤول",
    wrongPassword: "رمز الوصول غير صحيح، حاول مرة أخرى.",
    liveStats: "إحصائيات القراءة والبحث (مباشر)",
    mostViewed: "أكثر المصادر تصفحاً (ورقي + رقمي)",
    mostSearched: "الكلمات الأكثر بحثاً",
    shelfStats: "جرد الرفوف الورقية",
    printBtn: "تصدير كتقرير رسمي (PDF)",
    officialReport: "تقرير نشاط المكتبة الموحد"
  },
  en: {
    pageTitle: "Saqr Library Analytics Center",
    passwordPrompt: "Restricted Area. Please enter access code to proceed.",
    passwordLabel: "Access Password",
    enter: "Secure Admin Login",
    wrongPassword: "Incorrect access code, try again.",
    liveStats: "Live Engagement Analytics",
    mostViewed: "Most Viewed Resources",
    mostSearched: "Top Search Terms",
    shelfStats: "Physical Inventory Status",
    printBtn: "Export Official PDF",
    officialReport: "Unified Library Activity Report"
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
  const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

  // تأكيد الدخول بالرقم السري 101110
  const handleLogin = () => {
    if (password === '101110') { 
      sessionStorage.setItem('saqr_admin_auth', 'true');
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  useEffect(() => {
    const auth = sessionStorage.getItem('saqr_admin_auth') === 'true';
    if (auth) setIsAuthenticated(true);
  }, []);

  // دالة معالجة البيانات (تشمل الكتب الجديدة)
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
      return { name: pBook?.title || ARABIC_DIGITAL_TITLES[id] || ENGLISH_DIGITAL_TITLES[id] || id, count };
    }).sort((a, b) => b.count - a.count).slice(0, 10);

    const shelfData = bookData.reduce((acc: any[], b) => {
      const s = acc.find(x => x.name === b.shelf.toString());
      if (s) s.count++; else acc.push({ name: b.shelf.toString(), count: 1 });
      return acc;
    }, []).sort((a, b) => parseInt(a.name) - parseInt(b.name));

    return { 
      viewData, 
      searchData: Object.entries(searchCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 8),
      shelfData
    };
  }, [isAuthenticated]);

  const handleInteraction = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setRipples(prev => [...prev, { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top }]);
  };

  // واجهة قفل الأمان (كلمة المرور 101110)
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[75vh] px-4">
        <div className="glass-panel p-10 md:p-14 rounded-[3.5rem] shadow-2xl text-center max-w-lg w-full border-green-600/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-3xl animate-in zoom-in-95">
          <img src={SCHOOL_LOGO} alt="Logo" className="h-28 mx-auto mb-8 logo-white-filter rotate-12 drop-shadow-2xl" />
          <h1 className="text-3xl font-black text-gray-950 dark:text-white mb-4 tracking-tighter">{t('pageTitle')}</h1>
          <p className="text-gray-500 dark:text-gray-400 font-bold mb-10 leading-relaxed">{t('passwordPrompt')}</p>
          
          <input
              type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className={`w-full p-6 text-center bg-green-600/5 dark:bg-black/40 border-2 ${error ? 'border-red-500 animate-shake' : 'border-transparent focus:border-green-600'} rounded-3xl outline-none font-black text-3xl tracking-[0.5em] mb-6 shadow-inner transition-all`}
              placeholder="••••••"
          />
          {error && <p className="text-red-500 font-black text-xs mb-6 uppercase tracking-widest">{t('wrongPassword')}</p>}

          <button 
            onMouseDown={handleInteraction} onClick={handleLogin}
            className="relative overflow-hidden w-full glass-button-green py-6 rounded-3xl font-black text-xl shadow-xl active:scale-95 transition-all"
          >
            {ripples.map(r => <span key={r.id} className="ripple-effect !border-green-600/40" style={{ left: r.x, top: r.y }} />)}
            {t('enter')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir={dir} className="max-w-7xl mx-auto space-y-12 pb-20 px-4 animate-in fade-in duration-1000">
      
      {/* الهيدر الأخضر */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-green-600/10 pb-12 print:hidden">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-950 dark:text-white mb-4 tracking-tighter">{t('pageTitle')}</h1>
          <div className="flex items-center gap-3 justify-center md:justify-start text-green-600 font-black">
            <span className="w-3 h-3 bg-green-600 rounded-full animate-pulse shadow-[0_0_10px_green]"></span>
            <p className="text-lg">{t('liveStats')}</p>
          </div>
        </div>
        <button onClick={() => window.print()} className="glass-button-green px-12 py-5 rounded-[2rem] font-black shadow-2xl flex items-center gap-4 hover:scale-105 active:scale-95 transition-all">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
          <span className="text-xl">{t('printBtn')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 print:hidden">
        {/* إحصائيات المشاهدات - تشمل هاري بوتر */}
        <div className="glass-panel p-10 rounded-[3.5rem] shadow-2xl border-white/40 bg-white/70 dark:bg-gray-900/40">
          <h2 className="text-2xl font-black mb-10 text-gray-900 dark:text-white flex items-center gap-4"><span className="w-2.5 h-10 bg-green-600 rounded-full shadow-[0_0_15px_green]"></span>{t('mostViewed')}</h2>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <BarChart data={data.viewData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.05)"/>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke={theme === 'dark' ? '#94A3B8' : '#475569'} width={160} fontSize={11} tick={{fontWeight: '900'}} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', fontWeight: '900' }} />
                <Bar dataKey="count" name={t('views')} fill="#059669" radius={[0, 15, 15, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* إحصائيات البحث */}
        <div className="glass-panel p-10 rounded-[3.5rem] shadow-2xl border-white/40 bg-white/70 dark:bg-gray-900/40">
          <h2 className="text-2xl font-black mb-10 text-gray-900 dark:text-white flex items-center gap-4"><span className="w-2.5 h-10 bg-blue-600 rounded-full shadow-[0_0_15px_blue]"></span>{t('mostSearched')}</h2>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <BarChart data={data.searchData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)"/>
                <XAxis dataKey="name" stroke={theme === 'dark' ? '#94A3B8' : '#475569'} fontSize={12} tick={{fontWeight: '900'}} />
                <YAxis stroke={theme === 'dark' ? '#94A3B8' : '#475569'} />
                <Tooltip contentStyle={{ borderRadius: '20px', fontWeight: '900' }} />
                <Bar dataKey="count" name={t('searches')} fill="#2563eb" radius={[15, 15, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* تقرير جرد الرفوف */}
      <div className="glass-panel p-10 rounded-[3.5rem] shadow-2xl border-white/40 bg-white/70 dark:bg-gray-900/40 print:hidden">
         <h2 className="text-2xl font-black mb-10 text-gray-900 dark:text-white flex items-center gap-4"><span className="w-2.5 h-10 bg-green-700 rounded-full"></span>{t('shelfStats')}</h2>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={data.shelfData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)"/>
                <XAxis dataKey="name" stroke={theme === 'dark' ? '#94A3B8' : '#475569'} tick={{fontWeight: '900'}} />
                <YAxis stroke={theme === 'dark' ? '#94A3B8' : '#475569'} />
                <Bar dataKey="count" name={t('bookCount')} fill="#15803d" radius={[10, 10, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
      </div>

      {/* --- قسم التقرير الرسمي المطبوع (أخضر فخم) --- */}
      <div className="hidden print:block p-16 bg-white text-black border-[15px] border-green-700 min-h-[1100px]">
        <div className="flex justify-between items-center mb-20 pb-10 border-b-4 border-gray-100">
            <div className="flex items-center gap-8">
                <img src={SCHOOL_LOGO} alt="Logo" className="h-40 w-40 object-contain" />
                <div>
                    <h2 className="text-4xl font-black uppercase text-green-700 leading-none tracking-tighter">Emirates Falcon</h2>
                    <p className="text-xl font-bold text-gray-400 mt-2">Integrated Library Audit System</p>
                </div>
            </div>
            <div className="text-end">
                <h3 className="text-2xl font-black mb-2">{t('officialReport')}</h3>
                <p className="text-lg font-bold text-gray-400 italic">Audit Date: {new Date().toLocaleDateString(locale)}</p>
            </div>
        </div>

        <table className="w-full text-start border-collapse">
          <thead>
            <tr className="bg-green-700 text-white text-2xl">
              <th className="p-6 border-2 border-green-800 text-start font-black">Resource Title (Digital/Physical)</th>
              <th className="p-6 border-2 border-green-800 text-center font-black">Medium</th>
              <th className="p-6 border-2 border-green-800 text-center font-black">Total Engagements</th>
            </tr>
          </thead>
          <tbody>
            {data.viewData.map((item, i) => (
              <tr key={i} className="even:bg-green-50 border-b text-xl">
                <td className="p-6 border-x font-bold">{item.name}</td>
                <td className="p-6 border-x text-center font-black text-gray-400 uppercase text-sm tracking-widest">School Resource</td>
                <td className="p-6 border-x text-center font-black text-green-700 text-3xl">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-32 flex justify-between items-end grayscale opacity-60">
            <div className="text-center">
                <div className="w-64 h-1 bg-black mb-4"></div>
                <p className="font-black text-xl uppercase tracking-[0.2em]">Islam Soliman</p>
                <p className="text-sm italic font-bold text-gray-500">School Librarian / Digital Curator</p>
            </div>
            <div className="flex flex-col items-center">
                <img src={SCHOOL_LOGO} alt="Seal" className="h-24 mb-2" />
                <p className="font-black text-xs">E.F.I.P.S SEAL</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
