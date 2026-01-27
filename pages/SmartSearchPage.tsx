import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 
import { bookData } from '../api/bookData'; // المكتبة الورقية
import { ARABIC_LIBRARY_DATABASE } from './ArabicLibraryInternalPage'; // المكتبة الرقمية العربية

// --- 1. بروتوكول عقل صقر المطور ---
const SAQR_ELITE_PROMPT = `
Identity: You are "Saqr" (صقر), the official Elite AI Librarian of Saqr Al Emarat International Private School (EFIPS).
Lead Librarian: Mr. Islam Soliman.

Core Intelligence:
1. HYBRID SEARCH: You have access to Physical, Arabic Digital, and English Digital collections.
2. PRIORITY: Check the "Context" section first for local results.
3. CHALLENGE MODE: If a student claims they read a book, start the "Reader Challenge" (3 questions).
4. WINNING CONDITION: If the student answers excellently, end your response with exactly this tag: [WINNER: StudentName].
5. STYLE: Bold, inspiring, professional Arabic. NO ITALICS. Correct name: صقر.
`;

// --- مكون الميدالية الذهبية الملكية ---
const VictoryMedal: React.FC<{ name: string; onClose: () => void }> = ({ name, onClose }) => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-2xl animate-in fade-in duration-500">
      <div className="relative text-center animate-in zoom-in spin-in duration-700">
        <div className="text-[150px] md:text-[250px] drop-shadow-[0_0_50px_rgba(234,179,8,0.5)]">🥇</div>
        <div className="glass-panel p-8 md:p-12 rounded-[3rem] border-4 border-yellow-500 shadow-2xl mt-[-50px] bg-white/10 relative z-10">
          <h1 className="text-4xl md:text-7xl font-black text-yellow-500 uppercase tracking-tighter mb-4">Winner!</h1>
          <p className="text-xl md:text-3xl text-white font-bold mb-2">مدرسة صقر الإمارات الدولية</p>
          <p className="text-3xl md:text-6xl text-white font-black py-4 border-y border-white/20 mb-4">{name}</p>
          <p className="text-lg md:text-2xl text-yellow-400 font-bold tracking-widest uppercase">تحدي القارئ المبدع</p>
          <button onClick={onClose} className="mt-8 px-10 py-3 bg-yellow-500 text-black font-black rounded-full hover:scale-110 transition-transform">إغلاق</button>
        </div>
      </div>
    </div>
  );
};

const SmartSearchPage: React.FC = () => {
  const { locale, dir } = useLanguage();
  const t = (key: string) => (translations as any)[locale][key] || key;

  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', content: translations[locale].saqrWelcome }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [winnerName, setWinnerName] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // --- محرك البحث الهجين الذكي (ورقي + عربي + إنجليزي) ---
  const findLibraryContext = (query: string) => {
    const q = query.toLowerCase();
    const physical = bookData.filter(b => b.title.toLowerCase().includes(q) || b.subject.toLowerCase().includes(q)).slice(0, 3);
    const arabicDigital = ARABIC_LIBRARY_DATABASE.filter(b => b.title.toLowerCase().includes(q)).slice(0, 3);
    
    return `LIBRARY DATA: 
      Physical: ${JSON.stringify(physical)}
      Arabic Digital: ${JSON.stringify(arabicDigital)}
      If found, guide them strictly. If not, use AI knowledge.`;
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;
    const userQuery = input.trim();
    const userMessage: ChatMessage = { role: 'user', content: userQuery };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const context = findLibraryContext(userQuery);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'system', content: `${SAQR_ELITE_PROMPT}\n\nContext: ${context}` }, ...messages, userMessage],
          locale,
        }),
      });
      const data = await response.json();
      let reply = data.reply || '';

      // فحص وسام الفوز من خلال الرد
      if (reply.includes('[WINNER:')) {
        const match = reply.match(/\[WINNER:\s*(.*?)\]/);
        if (match) setWinnerName(match[1]);
        reply = reply.replace(/\[WINNER:.*?\]/g, ''); // إخفاء التاج من الشات
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'عذراً، حدث خطأ في الاتصال بصقر.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir={dir} className="max-w-4xl mx-auto px-4 py-4 md:py-10 h-[88vh] flex flex-col font-black antialiased relative">
      
      {winnerName && <VictoryMedal name={winnerName} onClose={() => setWinnerName(null)} />}

      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-red-600/5 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-green-600/5 blur-[150px] rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="flex flex-col flex-1 glass-panel rounded-[2.5rem] md:rounded-[4rem] shadow-[0_30px_80px_rgba(0,0,0,0.3)] overflow-hidden border border-white/20 bg-white/10 dark:bg-slate-950/40 backdrop-blur-3xl relative">
        
        <div className="p-4 md:p-8 border-b border-white/10 bg-white/20 dark:bg-black/20 backdrop-blur-xl flex items-center justify-between z-20 shadow-md">
          <div className="flex items-center gap-4">
            <div className="relative group">
                <img src="/school-logo.png" alt="EFIPS" className="w-10 h-10 md:w-16 object-contain logo-white-filter rotate-3 group-hover:rotate-0 transition-transform duration-500" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse"></div>
            </div>
            <div className="text-start">
                <h2 className="text-base md:text-2xl font-black text-slate-950 dark:text-white tracking-tighter uppercase leading-none">{translations[locale].librarianStatus}</h2>
                <p className="text-[9px] md:text-[10px] font-black text-green-600 mt-1 uppercase tracking-widest">{translations[locale].online}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 md:p-10 overflow-y-auto space-y-8 no-scrollbar relative z-10 scroll-smooth">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 md:gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-up`}>
              <div className={`w-10 h-10 md:w-14 rounded-2xl flex-shrink-0 flex items-center justify-center border border-white/20 shadow-xl ${
                  msg.role === 'assistant' ? 'bg-white/90 dark:bg-white' : 'bg-slate-950 text-white text-[9px] md:text-xs font-black uppercase'
                }`}>
                {msg.role === 'assistant' ? <img src="/saqr-avatar.png" alt="S" className="w-[85%] h-[85%]" /> : translations[locale].you}
              </div>
              <div className={`relative max-w-[88%] md:max-w-[80%] p-4 md:p-7 rounded-[1.8rem] md:rounded-[2.5rem] shadow-2xl border border-white/10 ${
                  msg.role === 'user' ? 'bg-slate-950 text-white rounded-tr-none' : 'bg-white/60 dark:bg-slate-900/60 text-slate-950 dark:text-white rounded-tl-none backdrop-blur-2xl shadow-green-500/5'
                }`}>
                <div className={`absolute top-0 ${msg.role === 'user' ? 'end-0' : 'start-0'} w-1.5 h-full rounded-full ${msg.role === 'user' ? 'bg-red-600' : 'bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.4)]'}`}></div>
                <div className="prose prose-sm md:prose-lg dark:prose-invert font-bold leading-relaxed text-start" style={{ fontStyle: 'normal' }}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 md:p-10 bg-transparent relative z-20">
          <div className="max-w-3xl mx-auto relative group">
            <input
              type="text" value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={translations[locale].inputPlaceholder}
              className="w-full bg-white/95 dark:bg-black/60 border-2 border-white/20 focus:border-red-600 rounded-[2rem] md:rounded-[3rem] py-4 md:py-8 ps-6 md:ps-10 pe-16 md:pe-28 text-slate-950 dark:text-white font-black text-xs md:text-xl outline-none transition-all shadow-3xl backdrop-blur-3xl placeholder:opacity-30"
              disabled={isLoading}
            />
            <button onClick={handleSendMessage} className="absolute inset-y-2 md:inset-y-3 end-2 md:end-3 w-12 h-12 md:w-20 md:h-20 flex items-center justify-center bg-red-600 text-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl active:scale-90 transition-all disabled:opacity-10 group/btn">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-10 md:w-10 rotate-[-45deg] rtl:rotate-[135deg]" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor">
                <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        * { font-style: normal !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .glass-panel { backdrop-filter: blur(50px) saturate(160%); }
        .logo-white-filter { transition: filter 0.5s ease; }
        .dark .logo-white-filter { filter: brightness(0) invert(1); }
      `}</style>
    </div>
  );
};

const translations: any = {
  ar: {
    saqrWelcome: 'أهلاً بك! أنا صقر، مساعدك الذكي في مكتبة مدرسة صقر الإمارات. كيف يمكنني إثراء رحلتك المعرفية أو مساعدتك في أبحاثك اليوم؟',
    inputPlaceholder: 'ابحث عن كتاب، اطلب مساعدة في واجباتك، أو ابدأ تحدي القراءة...',
    librarianStatus: 'المساعد الذكي (صقر)',
    online: 'متصل وجاهز للمساعدة',
    you: 'أنت'
  },
  en: {
    saqrWelcome: "Welcome! I'm Saqr, your AI research assistant at EFIPS. How can I help you with your books or studies today?",
    inputPlaceholder: 'Search for a book, get help with homework, or start a challenge...',
    librarianStatus: 'Saqr AI Assistant',
    online: 'Online & Ready',
    you: 'YOU'
  },
};

export default SmartSearchPage;
