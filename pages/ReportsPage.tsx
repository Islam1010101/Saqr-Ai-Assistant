import React, { useEffect, useState, useMemo } from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { bookData } from '../api/bookData'; 
import { useLanguage, useTheme } from '../App';

// --- قاعدة بيانات تعريفية للمكتبة الرقمية (لأغراض تحليل التقارير) ---
const ARABIC_DIGITAL_TITLES: Record<string, string> = {
    "AR_1": "مجموعة روايات أجاثا كريستي", "AR_2": "أرض الإله", "AR_3": "أرض النفاق", "AR_4": "أكواريل",
    "AR_5": "الفيل الأزرق", "AR_6": "نائب عزارئيل", "AR_7": "المكتبة الخضراء للأطفال", "AR_8": "أوقات عصيبة",
    "AR_9": "أوليفر تويست", "AR_10": "الآمال الكبيرة", "AR_11": "ترويض النمرة", "AR_12": "جعجعة بدون طحن",
    "AR_13": "دايفيد كوبرفيلد", "AR_14": "دمبي وولده", "AR_15": "قصة مدينتين", "AR_16": "هملت : أمير دانمركة",
    "AR_17": "مذكرات بكوك", "AR_18": "سلسلة رجل المستحيل", "AR_19": "سلسلة ما وراء الطبيعة", "AR_20": "سلسلة الشياطين ال13",
    "AR_21": "مختصر تفسير ابن كثير", "AR_22": "أنبياء الله", "AR_23": "قصص الأنبياء (الشعراوي)", "AR_24": "قصص الأنبياء للأطفال",
    "AR_25": "قصص الحيوان في القرآن", "AR_26": "شرح الأربعين النووية", "AR_27": "صحيح البخاري", "AR_28": "صحيح مسلم",
    "AR_29": "الأب الغني والأب الفقير", "AR_30": "الرقص مع الحياة", "AR_31": "المفاتيح العشرة للنجاح", "AR_32": "خوارق اللاشعور",
    "AR_33": "قوة الآن", "AR_34": "أربعون (الشقيري)", "AR_35": "كيف تكسب الأصدقاء"
};

const ENGLISH_DIGITAL_TITLES: Record<string, string> = {
    "EN_1": "Me Before You", "EN_2": "The Great Gatsby", "EN_3": "The Kite Runner", "EN_4": "And Then There Were NONE",
    "EN_5": "Tales of the Unexpected", "EN_6": "The Hound of the Baskervilles", "EN_7": "The Girl on the Train", "EN_8": "The Silent Patient",
    "EN_9": "How Much Land Does a Man Need?", "EN_10": "The Bet", "EN_11": "Death of Ivan Ilyich", "EN_12": "The Lottery",
    "EN_13": "The Landlady", "EN_14": "The Tell-Tale Heart", "EN_15": "Lateral Thinking Puzzles", "EN_16": "Murdle",
    "EN_17": "Sherlock Puzzle Collection", "EN_18": "What is the Name of This Book"
};

export interface LogEntry {
  timestamp: number;
  type: 'search' | 'view';
  value: string; 
}

interface ChartData {
  name: string;
  count: number;
}

const SCHOOL_LOGO = "/school-logo.png"; 

const translations = {
  ar: {
    pageTitle: "تقارير مكتبة صقر الإمارات الشاملة",
    mostSearched: "أكثر المصطلحات بحثاً",
    mostViewed: "أكثر المصادر قراءة (ورقي + رقمي)",
    shelfStats: "توزيع الكتب الورقية على الرفوف",
    printBtn: "تصدير التقرير الرسمي (PDF)",
    passwordPrompt: "يرجى إدخال كلمة المرور للوصول إلى مركز التحليلات.",
    passwordLabel: "كلمة المرور",
    enter: "دخول آمن",
    liveStats: "إحصائيات مباشرة وشاملة",
    officialReport: "تقرير جرد المكتبة والنشاط الرقمي الشامل",
    bookCount: "عدد الكتب",
    searches: "عمليات البحث",
    views: "المشاهدات",
    shelfName: "الرف"
  },
  en: {
    pageTitle: "E.F.I.P.S Integrated Reports",
    mostSearched: "Top Search Terms",
    mostViewed: "Top Viewed Resources (Physical + Digital)",
    shelfStats: "Physical Bookshelf Stats",
    printBtn: "Export Official Audit (PDF)",
    passwordPrompt: "Enter secure password to access Analytics.",
    passwordLabel: "Password",
    enter: "Secure Login",
    liveStats: "Comprehensive Live Analytics",
    officialReport: "Official Library & Digital Activity Report",
    bookCount: "Books",
    searches: "Searches",
    views: "Views",
    shelfName: "Shelf"
  }
};

const processLogs = (): { searchData: ChartData[], viewData: ChartData[], shelfData: ChartData[] } => {
  try {
    const logs: LogEntry[] = JSON.parse(localStorage.getItem('saqr_activity_logs') || '[]');
    const searchCounts: Record<string, number> = {};
    const viewCounts: Record<string, number> = {};

    logs.forEach((log) => {
      if (log.type === 'search' && log.value) {
        searchCounts[log.value] = (searchCounts[log.value] || 0) + 1;
      } else if (log.type === 'view' && log.value) {
        viewCounts[log.value] = (viewCounts[log.value] || 0) + 1;
      }
    });

    const searchData = Object.entries(searchCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count).slice(0, 8);

    const viewData = Object.entries(viewCounts)
      .map(([id, count]) => {
        // البحث عن العنوان في كل المصادر الممكنة
        const physicalBook = bookData.find(b => b.id === id);
        const title = physicalBook?.title || ARABIC_DIGITAL_TITLES[id] || ENGLISH_DIGITAL_TITLES[id] || id;
        return { name: title, count };
      })
      .sort((a, b) => b.count - a.count).slice(0, 8);

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
  const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

  useEffect(() => {
    const auth = sessionStorage.getItem('reports_authenticated') === 'true';
    setIsAuthenticated(auth);
    if (auth) setData(processLogs());
  }, []);

  const handleLogin = () => {
    if (password === '101110') { 
      sessionStorage.setItem('reports_authenticated', 'true');
      setIsAuthenticated(true);
      setData(processLogs());
    }
  };

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent, callback: () => void) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setRipples(prev => [...prev, { id: Date.now(), x: clientX - rect.left, y: clientY - rect.top }]);
    setTimeout(callback, 400);
  };

  const tickColor = theme === 'dark' ? '#94A3B8' : '#475569';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="glass-panel p-10 rounded-[3.5rem] shadow-2xl text-center max-w-lg w-full border-white/20">
          <img src={SCHOOL_LOGO} alt="Logo" className="h-24 mx-auto mb-6 logo-white-filter rotate-12" />
          <h1 className="text-3xl font-black text-gray-950 dark:text-white mb-6 tracking-tight">{t('pageTitle')}</h1>
          <input
              type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full p-5 text-center bg-white/40 dark:bg-gray-900/60 text-gray-950 dark:text-white border-2 border-transparent focus:border-green-600 rounded-2xl outline-none font-black text-xl mb-6 shadow-inner"
              placeholder={t('passwordLabel')}
          />
          <button onMouseDown={(e) => handleInteraction(e, handleLogin)} className="relative overflow-hidden w-full glass-button-red py-5 rounded-2xl font-black text-lg">
            {ripples.map(r => <span key={r.id} className="ripple-effect border-red-500/30" style={{ left: r.x, top: r.y }} />)}
            {t('enter')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir={dir} className="max-w-7xl mx-auto space-y-12 pb-20 px-4 animate-in fade-in duration-1000">
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/10 pb-12 print:hidden">
        <div className="text-center md:text-start">
          <h1 className="text-4xl md:text-5xl font-black text-gray-950 dark:text-white mb-4 tracking-tighter">{t('pageTitle')}</h1>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <span className="w-3 h-3 bg-green-600 rounded-full animate-pulse shadow-[0_0_10px_green]"></span>
            <p className="text-green-600 font-black text-lg">{t('liveStats')}</p>
          </div>
        </div>
        <button onClick={() => window.print()} className="glass-button-green px-10 py-5 rounded-[2rem] font-black shadow-2xl flex items-center gap-3 active:scale-95 transition-transform">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
          {t('printBtn')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 print:hidden">
        <div className="glass-panel p-10 rounded-[3.5rem] shadow-2xl border-white/20">
          <h2 className="text-2xl font-black mb-10 text-gray-900 dark:text-white flex items-center gap-3">
            <span className="w-2 h-8 bg-green-700 rounded-full"></span>
            {t('mostViewed')}
          </h2>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <BarChart data={data.viewData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor}/>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke={tickColor} width={150} fontSize={12} tick={{fontWeight: '900'}} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', fontWeight: '900' }} />
                <Bar dataKey="count" name={t('views')} fill="#059669" radius={[0, 10, 10, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-10 rounded-[3.5rem] shadow-2xl border-white/20">
          <h2 className="text-2xl font-black mb-10 text-gray-900 dark:text-white flex items-center gap-3">
            <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
            {t('mostSearched')}
          </h2>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <BarChart data={data.searchData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor}/>
                <XAxis dataKey="name" stroke={tickColor} fontSize={12} tick={{fontWeight: '900'}} />
                <YAxis stroke={tickColor} />
                <Tooltip contentStyle={{ borderRadius: '20px', fontWeight: '900' }} />
                <Bar dataKey="count" name={t('searches')} fill="#2563eb" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-panel p-10 rounded-[3.5rem] shadow-2xl border-white/20 print:hidden">
         <h2 className="text-2xl font-black mb-10 text-gray-900 dark:text-white flex items-center gap-3">
            <span className="w-2 h-8 bg-green-700 rounded-full"></span>
            {t('shelfStats')}
          </h2>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={data.shelfData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor}/>
                <XAxis dataKey="name" stroke={tickColor} tick={{fontWeight: '900'}} />
                <YAxis stroke={tickColor} />
                <Bar dataKey="count" name={t('bookCount')} fill="#00732f" radius={[10, 10, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
      </div>

      {/* --- قسم التقرير الرسمي للطباعة فقط --- */}
      <div className="hidden print:block p-12 bg-white text-black border-[10px] border-green-700 min-h-[1100px]">
        <div className="flex justify-between items-center mb-16 pb-8 border-b-4 border-gray-100">
            <div className="flex items-center gap-6">
                <img src={SCHOOL_LOGO} alt="Logo" className="h-32 w-32 object-contain" />
                <div>
                    <h2 className="text-3xl font-black uppercase text-green-700 leading-none">Emirates Falcon</h2>
                    <p className="text-lg font-bold text-gray-500">Official Library Activity Report</p>
                </div>
            </div>
            <div className="text-end">
                <h3 className="text-xl font-black mb-1">{t('officialReport')}</h3>
                <p className="text-sm font-bold text-gray-400 italic">Report Date: {new Date().toLocaleDateString(locale)}</p>
            </div>
        </div>

        <table className="w-full text-start border-collapse">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="p-5 border-2 border-green-800 text-start font-black">Book / Resource Title</th>
              <th className="p-5 border-2 border-green-800 text-center font-black">Medium</th>
              <th className="p-5 border-2 border-green-800 text-center font-black">Engagement</th>
            </tr>
          </thead>
          <tbody>
            {data.viewData.map((item, i) => (
              <tr key={i} className="even:bg-gray-50 border-b">
                <td className="p-5 border-x font-bold text-lg">{item.name}</td>
                <td className="p-5 border-x text-center font-black text-gray-400">Integrated Resource</td>
                <td className="p-5 border-x text-center font-black text-green-700 text-2xl">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-20 flex justify-between items-end grayscale opacity-50">
            <div className="text-center">
                <div className="w-48 h-0.5 bg-black mb-4"></div>
                <p className="font-black text-sm uppercase tracking-widest">Islam Soliman</p>
                <p className="text-xs italic text-gray-400">Authorized Librarian</p>
            </div>
            <img src={SCHOOL_LOGO} alt="Seal" className="h-20" />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
