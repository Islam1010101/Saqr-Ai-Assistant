import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// تأكد أنك قمت بنقل ملف bookData.ts إلى مجلد data في الجذر
import { bookData } from '../api/_bookData';
import { useLanguage, useTheme } from '../App';

// تعريف نوع بيانات السجلات لتجنب أخطاء البناء
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
    pageTitle: "تقارير استخدام المكتبة",
    noData: "لا توجد بيانات متاحة لعرضها. يرجى استخدام البحث أولاً.",
    mostSearched: "أكثر المصطلحات بحثاً",
    searches: "عمليات البحث",
    mostViewed: "أكثر الكتب مشاهدة",
    views: "المشاهدات",
    passwordPrompt: "يرجى إدخال كلمة المرور للوصول إلى هذه الصفحة (الرقم السري لمسؤول المكتبة).",
    passwordLabel: "كلمة المرور",
    enter: "دخول",
    wrongPassword: "كلمة المرور غير صحيحة"
  },
  en: {
    pageTitle: "Library Usage Reports",
    noData: "No data available to display. Please use the search feature first.",
    mostSearched: "Most Searched Terms",
    searches: "Searches",
    mostViewed: "Most Viewed Books",
    views: "Views",
    passwordPrompt: "Please enter the password to access this page (Admin only).",
    passwordLabel: "Password",
    enter: "Enter",
    wrongPassword: "Incorrect Password"
  }
};

const processLogs = (): { searchData: ChartData[], viewData: ChartData[] } => {
  try {
    const logs: LogEntry[] = JSON.parse(localStorage.getItem('saqr_activity_logs') || '[]');
    if (!logs.length) return { searchData: [], viewData: [] };

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
      .slice(0, 10);

    const viewData = Object.entries(viewCounts)
      .map(([id, count]) => {
        const book = bookData.find(b => b.id === id);
        return { name: book ? book.title : 'Unknown Book', count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
      
    return { searchData, viewData };
  } catch (error) {
    console.error("Failed to process logs:", error);
    return { searchData: [], viewData: [] };
  }
};

const ReportsPage: React.FC = () => {
  const { locale, dir } = useLanguage();
  const { theme } = useTheme();
  const t = (key: keyof typeof translations.ar) => translations[locale][key];
  const [data, setData] = useState<{ searchData: ChartData[], viewData: ChartData[] }>({ searchData: [], viewData: [] });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const auth = sessionStorage.getItem('reports_authenticated') === 'true';
    setIsAuthenticated(auth);
    if (auth) {
      setData(processLogs());
    }
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
  
  const tickColor = theme === 'dark' ? '#A0AEC0' : '#4A5568'; 

  if (!isAuthenticated) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md text-center max-w-md mx-auto mt-10 border border-gray-100 dark:border-gray-700">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{t('pageTitle')}</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">{t('passwordPrompt')}</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 text-center border-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-transparent focus:border-green-600 rounded-full outline-none transition-all"
            placeholder={t('passwordLabel')}
          />
          {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
          <button
            type="submit"
            className="w-full bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-800 transition-transform active:scale-95"
          >
            {t('enter')}
          </button>
        </form>
      </div>
    );
  }

  if (data.searchData.length === 0 && data.viewData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-12 rounded-3xl shadow-sm text-center mt-10 border border-dashed border-gray-300 dark:border-gray-700">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{t('pageTitle')}</h1>
        <p className="text-gray-500 dark:text-gray-400">{t('noData')}</p>
      </div>
    );
  }

  const yAxisRtl = dir === 'rtl' ? { orientation: 'right' } as const : { orientation: 'left' } as const;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">{t('pageTitle')}</h1>

      {/* مخطط الكلمات الأكثر بحثاً */}
      {data.searchData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white border-s-4 border-green-700 ps-3">{t('mostSearched')}</h2>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={data.searchData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} horizontal={false}/>
                <XAxis type="number" allowDecimals={false} stroke={tickColor} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={120} 
                  stroke={tickColor}
                  {...yAxisRtl} 
                />
                <Tooltip 
                  cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF', 
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="count" name={t('searches')} fill="#15803d" radius={[0, 10, 10, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* مخطط الكتب الأكثر مشاهدة */}
      {data.viewData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white border-s-4 border-green-700 ps-3">{t('mostViewed')}</h2>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data.viewData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }: any) => `${name.substring(0,15)}... (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  dataKey="count"
                >
                  {data.viewData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF', 
                    borderRadius: '12px',
                    border: 'none'
                  }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
