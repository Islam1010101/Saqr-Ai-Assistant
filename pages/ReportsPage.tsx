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

// ألوان الهوية البصرية (تدرجات الأخضر والألوان المساندة)
const COLORS = ['#00732F', '#059669', '#10B981', '#34D399', '#6EE7B7'];

const translations = {
  ar: {
    pageTitle: "تقارير مكتبة صقر الإمارات",
    noData: "لا توجد بيانات متاحة لعرضها. يرجى استخدام البحث أولاً.",
    mostSearched: "أكثر المصطلحات بحثاً",
    searches: "عمليات البحث",
    mostViewed: "أكثر الكتب مشاهدة",
    views: "المشاهدات",
    shelfStats: "إحصائيات توزيع الرفوف",
    shelfName: "الرف",
    bookCount: "عدد الكتب",
    printBtn: "طباعة التقرير / تصدير PDF",
    passwordPrompt: "يرجى إدخال كلمة المرور للوصول إلى تقارير المسؤول.",
    passwordLabel: "كلمة المرور",
    enter: "دخول",
    wrongPassword: "كلمة المرور غير صحيحة"
  },
  en: {
    pageTitle: "Saqr Library Reports",
    noData: "No data available. Please use the search feature first.",
    mostSearched: "Most Searched Terms",
    searches: "Searches",
    mostViewed: "Most Viewed Books",
    views: "Views",
    shelfStats: "Bookshelf Distribution",
    shelfName: "Shelf",
    bookCount: "Books",
    printBtn: "Print / Export PDF",
    passwordPrompt: "Please enter the password to access Admin reports.",
    passwordLabel: "Password",
    enter: "Enter",
    wrongPassword: "Incorrect Password"
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

  useEffect(() => {
    const auth = sessionStorage.getItem('reports_authenticated') === 'true';
    setIsAuthenticated(auth);
    if (auth) setData(processLogs());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
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

  // واجهة الدخول الزجاجية
  if (!isAuthenticated) {
    return (
      <div className="glass-panel p-10 rounded-[3rem] shadow-2xl text-center max-w-md mx-auto mt-20 animate-in zoom-in duration-500 border-white/20">
        <h1 className="text-3xl font-black mb-4 text-gray-900 dark:text-white tracking-tighter">{t('pageTitle')}</h1>
        <p className="mb-8 text-gray-500 dark:text-gray-400 font-bold">{t('passwordPrompt')}</p>
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-5 text-center bg-white/40 dark:bg-gray-900/40 text-gray-900 dark:text-white border-2 border-transparent focus:border-green-600 rounded-2xl outline-none transition-all shadow-inner font-bold"
            placeholder={t('passwordLabel')}
          />
          {error && <p className="text-red-500 text-sm font-black animate-bounce">{error}</p>}
          <button type="submit" className="glass-button-green w-full py-5 rounded-2xl font-black shadow-lg">
            {t('enter')}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4">
      {/* رأس الصفحة الزجاجي */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/10 pb-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="text-center md:text-start">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">{t('pageTitle')}</h1>
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></span>
            <p className="text-green-700 dark:text-green-400 font-black">{isAr ? 'إحصائيات مباشرة من قاعدة البيانات' : 'Live Database Analytics'}</p>
          </div>
        </div>
        <button 
          onClick={handlePrint}
          className="print:hidden glass-button-green flex items-center gap-3 px-10 py-5 rounded-2xl font-black shadow-xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          {t('printBtn')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* مخطط الرفوف الزجاجي */}
        <div className="glass-panel p-8 rounded-[3rem] shadow-xl border-white/10 overflow-hidden">
          <h2 className="text-2xl font-black mb-10 text-gray-800 dark:text-white flex items-center gap-3">
            <span className="w-2 h-8 bg-green-700 rounded-full shadow-[0_0_10px_rgba(0,115,47,0.4)]"></span>
            {t('shelfStats')}
          </h2>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={data.shelfData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor}/>
                <XAxis dataKey="name" stroke={tickColor} fontSize={12} tick={{fontWeight: 'bold'}} label={{ value: t('shelfName'), position: 'insideBottom', offset: -5, fill: tickColor, fontWeight: 'bold' }} />
                <YAxis stroke={tickColor} fontSize={12} tick={{fontWeight: 'bold'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 'bold' }} 
                />
                <Bar dataKey="count" name={t('bookCount')} fill="#00732F" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* مخطط الكلمات الأكثر بحثاً - أزرق هوية صقر المساعد */}
        <div className="glass-panel p-8 rounded-[3rem] shadow-xl border-white/10 overflow-hidden">
          <h2 className="text-2xl font-black mb-10 text-gray-800 dark:text-white flex items-center gap-3">
            <span className="w-2 h-8 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)]"></span>
            {t('mostSearched')}
          </h2>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={data.searchData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor}/>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke={tickColor} width={100} fontSize={12} tick={{fontWeight: 'bold'}} {...yAxisRtl} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '20px', border: 'none', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }} />
                <Bar dataKey="count" name={t('searches')} fill="#2563EB" radius={[0, 12, 12, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* مخطط الكتب الأكثر مشاهدة الزجاجي (دائري) */}
      <div className="glass-panel p-10 rounded-[3rem] shadow-xl border-white/10 overflow-hidden">
        <h2 className="text-2xl font-black mb-10 text-gray-800 dark:text-white flex items-center gap-3 text-center justify-center">
            <span className="w-2 h-8 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.4)]"></span>
            {t('mostViewed')}
        </h2>
        <div style={{ width: '100%', height: 450 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data.viewData}
                cx="50%" cy="50%"
                innerRadius={90} outerRadius={140}
                paddingAngle={8}
                dataKey="count"
                stroke="none"
                label={({ name, percent }: any) => `${name.substring(0,15)}... (${(percent * 100).toFixed(0)}%)`}
              >
                {data.viewData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', fontWeight: 'bold' }} />
              <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontWeight: 'bold', paddingTop: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* تقرير الطباعة الرسمي */}
      <div className="hidden print:block mt-20 p-10 bg-white text-black rounded-none">
        <h2 className="text-3xl font-black mb-8 border-b-8 border-green-700 pb-4 flex justify-between items-center">
          <span>{isAr ? 'بيانات جرد الرفوف التفصيلية' : 'Detailed Inventory Report'}</span>
          <span className="text-lg opacity-50">E.F.I.P.S Library</span>
        </h2>
        <table className="w-full text-start border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-5 border-2 border-gray-200 text-start font-black">{t('shelfName')}</th>
              <th className="p-5 border-2 border-gray-200 text-start font-black">{t('bookCount')}</th>
            </tr>
          </thead>
          <tbody>
            {data.shelfData.map(s => (
              <tr key={s.name} className="hover:bg-gray-50">
                <td className="p-5 border-2 border-gray-200 font-bold">{t('shelf')} {s.name}</td>
                <td className="p-5 border-2 border-gray-200 font-black text-green-700">{s.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsPage;
