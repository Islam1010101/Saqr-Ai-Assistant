import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// تأكد من صحة المسار حسب آخر تعديل قمت به في بنية المجلدات
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

const COLORS = ['#00732F', '#55A630', '#AACC00', '#BFD200', '#E6E2A3'];

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
    
    // 1. معالجة سجلات النشاط (البحث والمشاهدة)
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

    // 2. معالجة إحصائيات الرفوف (من قاعدة بيانات الكتب مباشرة)
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
    if (password === '101110') { // نفس الرقم السري الخاص بك
      sessionStorage.setItem('reports_authenticated', 'true');
      setIsAuthenticated(true);
      setData(processLogs());
      setError('');
    } else {
      setError(t('wrongPassword'));
    }
  };

  const handlePrint = () => window.print();
  
  const tickColor = theme === 'dark' ? '#A0AEC0' : '#4A5568';
  const yAxisRtl = dir === 'rtl' ? { orientation: 'right' } as const : { orientation: 'left' } as const;

  if (!isAuthenticated) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl text-center max-w-md mx-auto mt-10 border border-gray-100 dark:border-gray-700">
        <h1 className="text-2xl font-black mb-4 text-gray-800 dark:text-white">{t('pageTitle')}</h1>
        <p className="mb-6 text-gray-500 dark:text-gray-400 font-bold">{t('passwordPrompt')}</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 text-center border-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-transparent focus:border-green-600 rounded-2xl outline-none transition-all"
            placeholder={t('passwordLabel')}
          />
          {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
          <button type="submit" className="w-full bg-green-700 text-white font-black py-4 px-8 rounded-2xl shadow-lg hover:bg-green-800 transition-all active:scale-95">
            {t('enter')}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 px-4">
      {/* رأس الصفحة مع زر الطباعة */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-gray-100 dark:border-gray-700 pb-8">
        <div className="text-center md:text-start">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">{t('pageTitle')}</h1>
          <p className="text-green-700 font-bold">{isAr ? 'إحصائيات مباشرة من قاعدة البيانات' : 'Live Database Analytics'}</p>
        </div>
        <button 
          onClick={handlePrint}
          className="print:hidden flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-2xl font-black shadow-xl hover:opacity-90 active:scale-95 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          {t('printBtn')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* مخطط الرفوف الجديد */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-black mb-8 text-gray-800 dark:text-white flex items-center gap-2">
            <span className="w-2 h-8 bg-green-700 rounded-full"></span>
            {t('shelfStats')}
          </h2>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={data.shelfData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#374151' : '#F3F4F6'}/>
                <XAxis dataKey="name" stroke={tickColor} fontStyle="bold" label={{ value: t('shelfName'), position: 'insideBottom', offset: -5 }} />
                <YAxis stroke={tickColor} />
                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" name={t('bookCount')} fill="#00732F" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* مخطط الكلمات الأكثر بحثاً */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-black mb-8 text-gray-800 dark:text-white flex items-center gap-2">
            <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
            {t('mostSearched')}
          </h2>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={data.searchData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme === 'dark' ? '#374151' : '#F3F4F6'}/>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke={tickColor} width={100} {...yAxisRtl} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '15px', border: 'none' }} />
                <Bar dataKey="count" name={t('searches')} fill="#2563EB" radius={[0, 10, 10, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* مخطط الكتب الأكثر مشاهدة (دائري) */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-black mb-8 text-gray-800 dark:text-white flex items-center gap-2">
            <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
            {t('mostViewed')}
        </h2>
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data.viewData}
                cx="50%" cy="50%"
                innerRadius={80} outerRadius={120}
                paddingAngle={5}
                dataKey="count"
                label={({ name, percent }: any) => `${name.substring(0,12)}... (${(percent * 100).toFixed(0)}%)`}
              >
                {data.viewData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* جدول تفصيلي يظهر فقط في الطباعة */}
      <div className="hidden print:block mt-20">
        <h2 className="text-2xl font-black mb-6 border-b-4 border-green-700 pb-2">{isAr ? 'بيانات جرد الرفوف التفصيلية' : 'Detailed Inventory Report'}</h2>
        <table className="w-full text-start border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 border text-start">{t('shelfName')}</th>
              <th className="p-4 border text-start">{t('bookCount')}</th>
            </tr>
          </thead>
          <tbody>
            {data.shelfData.map(s => (
              <tr key={s.name}>
                <td className="p-4 border font-bold">{t('shelf')} {s.name}</td>
                <td className="p-4 border">{s.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsPage;
