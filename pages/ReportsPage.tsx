import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { bookData } from '../api/bookData';
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
    const logs: LogEntry[] = JSON.parse(localStorage.getItem('saqr_activity_logs') || '[]');
    if (!logs.length) return { searchData: [], viewData: [] };

    const searchCounts: { [key: string]: number } = {};
    const viewCounts: { [key: string]: number } = {};

    logs.forEach(log => {
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
  const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('reports_authenticated') === 'true');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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

  if (!isAuthenticated) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md text-center max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">{t('pageTitle')}</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">{t('passwordPrompt')}</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 text-center border-2 bg-white dark:bg-gray-700 border-gray-2
