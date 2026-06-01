import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 
import html2canvas from 'html2canvas'; 
import { bookData } from '../api/bookData'; 
import { ARABIC_LIBRARY_DATABASE } from './ArabicLibraryInternalPage';
import { ENGLISH_LIBRARY_DATABASE } from './EnglishLibraryInternalPage';
import { trackActivity } from '../src/utils/tracker';

const SAQR_ELITE_PROMPT = `Identity: You are "Saqr" (صقر), the official Elite AI Librarian of Emirates Falcon International Private School (EFIPS)...`; 

const localization: any = {
  ar: {
    heroTitle: 'هل لديك أفكار جديدة لاستكشافها؟',
    welcome: 'أهلاً بك! أنا "صقر"، المساعد الذكي لمكتبة المدرسة. هل نؤلف قصة معاً اليوم، أم تبحث عن كتاب محدد؟',
    input: 'اسأل صقر عن الكتب أو ابدأ قصة...',
    status: 'صقر الذكي (EFIPS)',
    online: 'متصل',
    download: 'تحميل شهادة المؤلف الصغير',
    you: 'أنت',
    thinking: 'جاري التفكير...',
  },
  en: {
    heroTitle: 'Any new ideas to explore?',
    welcome: "Welcome! I'm 'Saqr', your AI Librarian. Shall we co-author a story, or find a book?",
    input: 'Ask Saqr about books or start a story...',
    status: 'Saqr AI Librarian',
    online: 'Online',
    download: 'Download Certificate',
    you: 'YOU',
    thinking: 'Thinking...',
  }
};

const SmartSearchPage: React.FC = () => {
  const { locale, dir } = useLanguage();
  const t = (key: string) => localization[locale][key] || key;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [winnerData, setWinnerData] = useState<any>(null);
  const [saqrState, setSaqrState] = useState<'idle' | 'thinking' | 'speaking' | 'victory'>('idle');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;
    const userQuery = input.trim();
    trackActivity('ai', userQuery);
    
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setInput('');
    setIsLoading(true);
    setSaqrState('thinking');

    try {
        // هنا يوضع منطق الـ Fetch الخاص بك كما هو في الكود الأصلي
        // سأقوم بمحاكاة استجابة بسيطة للتجربة
        setTimeout(() => {
            setSaqrState('speaking');
            setMessages(prev => [...prev, { role: 'assistant', content: "أنا جاهز لمساعدتك في مكتبة مدرسة صقر الإمارات!" }]);
            setTimeout(() => setSaqrState('idle'), 2500);
            setIsLoading(false);
        }, 1500);
    } catch {
        setSaqrState('idle');
        setIsLoading(false);
    }
  };

  const getSaqrImageSrc = () => {
    return saqrState === 'idle' ? '/search_still_frame.png' : '/Search.gif';
  };

  return (
    <div dir={dir} className="w-full h-screen flex flex-col bg-[#f8faff] dark:bg-[#0e1117] font-sans relative overflow-hidden transition-colors duration-500">
      
      {/* طبقة الخلفية - جعلناها خلف كل شيء لضمان عدم حجب المدخلات */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-100/20 dark:bg-red-900/10 rounded-full blur-[120px]"></div>
      </div>

      {/* منطقة المحتوى الرئيسية - مع إضافة padding bottom كبير لمنع التداخل مع الشريط */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 pt-12 pb-44">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-20 animate-fade-in px-6">
              <img 
                src={getSaqrImageSrc()} 
                className="w-32 h-32 md:w-44 md:h-44 object-contain mb-8 drop-shadow-xl" 
                alt="Saqr" 
              />
              <h1 className="text-3xl md:text-5xl font-medium text-slate-700 dark:text-slate-200 tracking-tight text-center">
                {t('heroTitle')}
              </h1>
            </div>
          ) : (
            <div className="w-full px-6 space-y-10">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                  <div className={`max-w-[90%] md:max-w-[80%] px-6 py-4 ${
                    msg.role === 'user' 
                    ? 'bg-slate-100 dark:bg-slate-800 rounded-[2rem]' 
                    : 'bg-transparent'
                  }`}>
                    <div className="prose prose-slate dark:prose-invert max-w-none text-lg leading-relaxed text-start">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* منطقة الإدخال - رفع الـ z-index وضمان أنها ثابتة فوق كل شيء */}
      <div className="fixed bottom-0 left-0 w-full p-4 md:p-10 flex flex-col items-center z-50 bg-gradient-to-t from-[#f8faff] dark:from-[#0e1117] via-[#f8faff]/90 to-transparent">
        
        <div className="w-full max-w-3xl relative">
          
          {/* حاوية الإدخال (Pill) */}
          <div className="relative flex items-center bg-white dark:bg-[#1e1f20] rounded-full shadow-[0_4px_30px_rgba(0,0,0,0.06)] border border-slate-200/50 dark:border-slate-700/50 px-6 py-2 min-h-[64px]">
            
            <input
              autoFocus
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('input')}
              className="flex-1 bg-transparent border-none focus:ring-0 text-lg py-2 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none"
            />

            {/* حالة التفكير */}
            {isLoading && (
              <div className="flex items-center gap-2 px-3 text-blue-500 animate-pulse">
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2v4m0 12v4M4.22 4.22l2.83 2.83m8.49 8.49l2.83 2.83M2 12h4m12 0h4M4.22 19.78l2.83-2.83m8.49-8.49l2.83-2.83" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
            )}

            {/* زر الإرسال */}
            <button 
              disabled={!input.trim() || isLoading}
              onClick={handleSendMessage}
              className={`p-3 rounded-full transition-all ${
                input.trim() ? 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20' : 'text-slate-300'
              }`}
            >
              <svg className="w-7 h-7 rotate-90 rtl:-rotate-90" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>

          {/* تنويه بسيط تحت الشريط (اختياري لزيادة الجمالية) */}
          <p className="text-[10px] text-center mt-3 text-slate-400 font-medium uppercase tracking-wider">
            Powered by Saqr Elite AI - EFIPS Library
          </p>

          {/* زر تحميل الشهادة العائم */}
          {winnerData && (
             <button onClick={() => {/* دالة التحميل */}} className="absolute -top-16 left-1/2 -translate-x-1/2 bg-red-600 text-white px-8 py-3 rounded-full text-sm font-bold shadow-2xl hover:bg-red-700 transition-all flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                {t('download')}
             </button>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;700&display=swap');
        * { font-family: 'Cairo', sans-serif !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.8s ease-in; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default SmartSearchPage;
