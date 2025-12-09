import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { bookData } from '../api/bookData';
// تأكد أن LogEntry معرفة في types.ts، إذا لم تكن كذلك عرفها هنا مؤقتاً لتفادي الخطأ
import { LogEntry } from '../types'; 
import { useLanguage, useTheme } from '../App';

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
    passwordPrompt: "يرجى إدخال كلمة المرور للوصول إلى هذه الصفحة.",
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
    passwordPrompt: "Please enter the password to access this page.",
    passwordLabel: "Password",
    enter: "Enter",
    wrongPassword: "Incorrect Password"
  }
};

const processLogs = (): { searchData: ChartData[], viewData: ChartData[] } => {
  try {
    const logs = JSON.parse(localStorage.getItem('saqr_activity_logs') || '[]');
    if (!logs.length) return { searchData: [], viewData: [] };

    const searchCounts: { [key: string]: number } = {};
    const viewCounts: { [key: string]: number } = {};

    logs.forEach((log: any) => {
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
  const [isAuthenticated, setIsAuthenticated] = useState(false); // ابدأ بـ false للتأكد
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const auth = sessionStorage.getItem('reports_authenticated') === 'true';
    setIsAuthenticated(auth);
    if (auth) {
      setData(processLogs());
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setData(processLogs());
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '101110') {
      sessionStorage.setItem('reports_authenticated', 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError(t('wrongPassword'));
    }
  };
  
  const tickColor = theme === 'dark' ? '#A0AEC0' : '#4A5568'; 

  // --- شاشة تسجيل الدخول ---
  if (!isAuthenticated) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md text-center max-w-md mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{t('pageTitle')}</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">{t('passwordPrompt')}</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 text-center border-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-uae-green focus:border-transparent outline-none transition"
            placeholder={t('passwordLabel')}
            aria-label={t('passwordLabel')}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-uae-green text-white font-bold py-3 px-8 rounded-full shadow-md hover:bg-green-800 transition-transform transform hover:scale-105"
          >
            {t('enter')}
          </button>
        </form>
      </div>
    );
  }

  // --- شاشة لا توجد بيانات ---
  if (data.searchData.length === 0 && data.viewData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md text-center mt-10">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{t('pageTitle')}</h1>
        <p className="text-gray-500 dark:text-gray-400">{t('noData')}</p>
      </div>
    );
  }

  // تحديد اتجاه المحور Y بناءً على اللغة
  // استخدمنا as const لحل مشكلة الـ TypeScript
  const yAxisRtl = dir === 'rtl' ? { orientation: 'right' } as const : { orientation: 'left' } as const;

  return (
    <div className="space-y-8 pb-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">{t('pageTitle')}</h1>

      {/* مخطط البحث */}
      {data.searchData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">{t('mostSearched')}</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={data.searchData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#4A5568' : '#E2E8F0'}/>
                <XAxis type="number" allowDecimals={false} stroke={tickColor} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100} 
                  stroke={tickColor}
                  {...yAxisRtl} 
                />
                <Tooltip 
                  cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} 
                  contentStyle={{ backgroundColor: theme === 'dark' ? '#2D3748' : '#FFFFFF', border: `1px solid ${theme === 'dark' ? '#4A5568' : '#E2E8F0'}`, color: theme === 'dark' ? '#fff' : '#000' }}
                />
                <Legend wrapperStyle={{color: tickColor}} />
                <Bar dataKey="count" name={t('searches')} fill="#00732F" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* مخطط المشاهدات */}
      {data.viewData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">{t('mostViewed')}</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data.viewData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="name"
                >
                  {data.viewData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: theme === 'dark' ? '#2D3748' : '#FFFFFF', border: `1px solid ${theme === 'dark' ? '#4A5568' : '#E2E8F0'}`, color: theme === 'dark' ? '#fff' : '#000' }}
                />
                <Legend wrapperStyle={{color: tickColor}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
