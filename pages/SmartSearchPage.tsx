import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 
import { bookData } from '../api/bookData'; 
import { ARABIC_LIBRARY_DATABASE } from './ArabicLibraryInternalPage';
import { ENGLISH_LIBRARY_DATABASE } from './EnglishLibraryInternalPage';

// --- 1. بروتوكول عقل صقر (النقاش الموضوعي والدقة المطلقة) ---
const SAQR_ELITE_PROMPT = `
Identity: You are "Saqr" (صقر), the Elite AI Librarian of EFIPS. Supervisor: Mr. Islam Soliman.

Core Intelligence:
1. HYBRID SEARCH: Check Physical, Arabic Digital, and English Digital collections. ALWAYS prioritize provided Context.
2. OBJECTIVE DISCUSSION: If a user wants to discuss a book, engage in a logical dialogue. Ask "What did you learn?", analyze characters, and provide verified facts about the author.
3. ACCURACY: You are a genius AI; ensure your generated information about authors and history is 100% correct.
4. FINAL STEP: At the end of the discussion, ask for the user's "Full Name" to register their success.
5. WINNING TAG: Output: [WINNER: Name, Score: Points/100, Discussion: BookTitle].
6. STYLE: Formal Standard Arabic (Fos'ha), Professional, Bold. NO ITALICS. Correct name: صقر.
`;

const chatLabels: any = {
  ar: {
    welcome: 'مرحباً بك في رحاب الفكر! أنا صقر، دليلك المعرفي. هل نتباحث في أعماق كتابٍ ما اليوم، أم تود استكشاف مصادرنا بدقة؟',
    input: 'ناقش صقر، ابحث عن كتاب، أو اطلب مساعدة بحثية...',
    status: 'أمين المكتبة الذكي (صقر)',
    online: 'متصل وجاهز للحوار',
    you: 'أنت'
  },
  en: {
    welcome: "Welcome to the Realm of Thought! I'm Saqr, your AI Librarian. Shall we discuss a book today or explore our accurate resources?",
    input: 'Discuss with Saqr, search, or get help...',
    status: 'Saqr AI Librarian',
    online: 'Online & Ready',
    you: 'YOU'
  }
};

// --- مكون الميدالية الذهبية الكريستالية ---
const VictoryMedal: React.FC<{ data: any; onClose: () => void }> = ({ data, onClose }) => (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-3xl animate-in fade-in duration-700 p-4 text-center">
    <div className="relative animate-in zoom-in spin-in duration-1000 w-full max-w-xl">
      <div className="text-[180px] md:text-[300px] drop-shadow-[0_0_80px_rgba(234,179,8,1)] leading-none mb-[-50px] animate-bounce relative z-20">🥇</div>
      <div className="glass-panel p-10 md:p-14 rounded-[4rem] border-0 bg-white/10 shadow-2xl relative z-10">
        <h1 className="text-5xl md:text-8xl font-black text-yellow-500 tracking-tighter mb-4 uppercase">EXCELLENT!</h1>
        <p className="text-xl md:text-2xl text-white font-bold mb-2 opacity-80 font-fosha">مدرسة صقر الإمارات الدولية</p>
        <p className="text-lg md:text-2xl text-yellow-400 font-black mb-8 uppercase tracking-widest">بطل النقاش الأدبي</p>
        <div className="h-px w-full bg-white/20 my-6"></div>
        <p className="text-3xl md:text-6xl text-white font-black mb-8 drop-shadow-xl">{data.name}</p>
        <div className="inline-block px-12 py-4 rounded-full bg-yellow-500 text-black font-black text-2xl shadow-2xl">السكور: {data.score}</div>
        <button onClick={onClose} className="mt-12 block w-full py-5 bg-white/10 hover:bg-white/20 text-white font-black text-xl rounded-3xl border border-white/20 transition-all uppercase">العودة للحوار</button>
      </div>
    </div>
  </div>
);

const SmartSearchPage: React.FC = () => {
  const { locale, dir } = useLanguage();
  const t = (key: string) => chatLabels[locale][key];

  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', content: chatLabels[locale].welcome }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [winnerData, setWinnerData] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // --- محرك البحث الهجين المطور (مع توحيد الهمزات لضمان العثور على "أرض الإله") ---
  const findHybridLibraryContext = (query: string) => {
    const normalize = (text: string) => text.replace(/[أإآا]/g, 'ا').replace(/[ةه]/g, 'ه').toLowerCase().trim();
    const q = normalize(query);
    
    const physical = bookData.filter(b => normalize(b.title).includes(q)).slice(0, 2);
    const digitalAr = ARABIC_LIBRARY_DATABASE.filter(b => normalize(b.title).includes(q)).slice(0, 2);
    const digitalEn = ENGLISH_LIBRARY_DATABASE.filter(b => normalize(b.title).includes(q)).slice(0, 2);
    
    return `EFIPS_CONTEXT: 
    - Physical: ${JSON.stringify(physical)} 
    - Digital Arabic: ${JSON.stringify(digitalAr)} 
    - Digital English: ${JSON.stringify(digitalEn)}`;
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;
    const userQuery = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setInput('');
    setIsLoading(true);

    const context = findHybridLibraryContext(userQuery);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'system', content: `${SAQR_ELITE_PROMPT}\n\nContext: ${context}` }, ...messages, { role: 'user', content: userQuery }],
          locale,
        }),
      });
      const data = await response.json();
      let reply = data.reply || '';

      if (reply.includes('[WINNER:')) {
        const match = reply.match(/\[WINNER:\s*(.*?),\s*Score:\s*(.*?),\s*Discussion:\s*(.*?)]/);
        if (match) {
          const info = { name: match[1], score: match[2], book: match[3], date: new Date().toLocaleString() };
          setWinnerData(info);
          // حفظ في localStorage لصفحة التقارير
          const currentReports = JSON.parse(localStorage.getItem('efips_challenge_reports') || '[]');
          localStorage.setItem('efips_challenge_reports', JSON.stringify([info, ...currentReports]));
        }
        reply = reply.replace(/\[WINNER:.*?\]/g, '');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'نعتذر، حدث اضطراب في الاتصال بصقر.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir={dir} className="w-full max-w-lg lg:max-w-xl mx-auto px-4 py-4 md:py-6 h-[92dvh] flex flex-col font-black antialiased relative">
      
      {winnerData && <VictoryMedal data={winnerData} onClose={() => setWinnerData(null)} />}

      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[-5%] left-[-10%] w-[400px] h-[400px] bg-red-600/10 blur-[150px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-5%] right-[-10%] w-[500px] h-[500px] bg-green-600/10 blur-[180px] rounded-full delay-1000 animate-pulse"></div>
      </div>

      {/* الهيدر العائم بدون إطارات */}
      <div className="mb-6 flex items-center justify-between px-6 py-5 glass-panel rounded-[2.5rem] border-0 shadow-2xl bg-white/5 backdrop-blur-2xl">
        <div className="flex items-center gap-4 text-start">
          <div className="relative group">
            <div className="absolute -inset-2 bg-green-500/20 rounded-full blur-lg animate-pulse"></div>
            <img src="/school-logo.png" alt="Logo" className="w-10 h-10 md:w-14 object-contain logo-white-filter relative z-10" />
          </div>
          <div className="leading-none">
            <h2 className="text-lg md:text-xl font-black text-slate-950 dark:text-white uppercase tracking-tighter">{t('status')}</h2>
            <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">{t('online')}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-10 no-scrollbar px-2 py-4 relative scroll-smooth">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-4 md:gap-8 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-up`}>
            <div className={`relative flex-shrink-0 transition-all duration-700 ${msg.role === 'assistant' ? 'scale-125' : 'scale-100'}`}>
              {msg.role === 'assistant' && <div className="absolute -inset-5 bg-green-500/30 rounded-full blur-2xl animate-pulse"></div>}
              <div className={`w-14 h-14 md:w-24 md:h-24 rounded-[2.5rem] flex items-center justify-center border-0 shadow-2xl relative z-10 ${
                msg.role === 'assistant' ? 'bg-white border-green-500 ring-8 ring-green-500/10' : 'bg-slate-950 border-red-600/40 text-white text-[10px] md:text-sm font-black'
              }`}>
                {msg.role === 'assistant' ? <img src="/saqr-avatar.png" alt="S" className="w-[90%] h-[90%] object-contain" /> : t('you')}
              </div>
            </div>
            <div className={`relative max-w-[85%] md:max-w-[80%] p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl border-0 transition-all ${
                msg.role === 'user' ? 'bg-slate-950 text-white rounded-tr-none shadow-red-900/10' : 'bg-white/40 dark:bg-white/5 text-slate-950 dark:text-white rounded-tl-none backdrop-blur-3xl'
              }`}>
              <div className={`absolute top-0 ${msg.role === 'user' ? 'end-0' : 'start-0'} w-2 h-full rounded-full ${msg.role === 'user' ? 'bg-red-600' : 'bg-green-600 shadow-[0_0_30px_rgba(34,197,94,0.6)]'}`}></div>
              <div className="prose prose-sm md:prose-2xl dark:prose-invert font-black leading-loose text-start font-fosha"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-6 pb-6 px-2">
        <div className="max-w-xl mx-auto relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-red-600/20 via-green-600/20 to-red-600/20 rounded-[3rem] md:rounded-[6rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000"></div>
          <input
            type="text" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t('input')}
            className="w-full bg-white/80 dark:bg-black/40 border-0 focus:ring-0 rounded-[2.5rem] md:rounded-[6rem] py-6 md:py-14 ps-8 md:ps-20 pe-20 md:pe-44 text-slate-950 dark:text-white font-black text-sm md:text-2xl outline-none transition-all shadow-3xl backdrop-blur-3xl"
            disabled={isLoading}
          />
          <button onClick={handleSendMessage} className="absolute inset-y-3 md:inset-y-5 end-3 md:end-5 w-14 h-14 md:w-32 md:h-32 flex items-center justify-center bg-red-600 text-white rounded-full shadow-2xl active:scale-95 hover:scale-105 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-16 md:w-16 rotate-[-45deg] rtl:rotate-[135deg]" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>

      <style>{`
        * { font-style: normal !important; }
        .font-fosha { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .glass-panel { backdrop-filter: blur(50px) saturate(180%); }
        .logo-white-filter { transition: filter 0.5s ease; }
        .dark .logo-white-filter { filter: brightness(0) invert(1); }
      `}</style>
    </div>
  );
};

export default SmartSearchPage;
