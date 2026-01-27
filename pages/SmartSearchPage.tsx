import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 
import { bookData } from '../api/bookData'; // تأكد من صحة المسار لديك
import { ARABIC_LIBRARY_DATABASE } from './ArabicLibraryInternalPage'; // تأكد من تصدير هذه المصفوفة هناك

// --- 1. بروتوكول عقل صقر المطور (Identity & Logic) ---
const SAQR_ELITE_PROMPT = `
Identity: You are "Saqr" (صقر), the official Elite AI Librarian of Saqr Al Emarat International Private School (EFIPS).
Lead Librarian: Mr. Islam Soliman.

Core Intelligence Protocol:
1. HYBRID SEARCH: You have access to Physical, Arabic Digital, and English Digital collections.
2. PRIORITY: Check the "Library Context" provided first. If a book is found, provide Shelf/Row or direct them to Digital section.
3. CHALLENGE MODE: If a student says "I finished reading X", ask 3 deep, intelligent questions one by one.
4. WINNING: If they answer all correctly, conclude your final message with this EXACT tag: [WINNER: StudentName].
5. STYLE: Bold, professional, and inspiring. NO ITALICS in Arabic. Use "صقر" not "سقر".
`;

// --- 2. كائن الترجمات الموحد (تم إصلاح التكرار لضمان نجاح الـ Build) ---
const chatTranslations: any = {
  ar: {
    saqrWelcome: 'أهلاً بك! أنا صقر، المساعد الذكي في مكتبة مدرسة صقر الإمارات. كيف يمكنني إثراء رحلتك المعرفية أو مساعدتك في أبحاثك اليوم؟',
    inputPlaceholder: 'ابحث عن كتاب، اطلب مساعدة في واجباتك، أو ابدأ تحدي القراءة...',
    typing: 'صقر يراجع الرفوف والبيانات...',
    error: 'عذراً، واجهت مشكلة في الاتصال. حاول مرة أخرى.',
    status: 'المساعد الذكي (صقر)',
    online: 'متصل وجاهز للمساعدة',
    you: 'أنت'
  },
  en: {
    saqrWelcome: "Welcome! I'm Saqr, your AI research assistant at EFIPS. How can I help you with your books or studies today?",
    inputPlaceholder: 'Search for a book, get homework help, or start a challenge...',
    typing: 'Saqr is checking data...',
    error: 'Connection error. Please try again.',
    status: 'Saqr AI Assistant',
    online: 'Online & Ready',
    you: 'YOU'
  },
};

// --- 3. مكون الميدالية الذهبية الملكية ---
const VictoryMedal: React.FC<{ name: string; onClose: () => void }> = ({ name, onClose }) => (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-3xl animate-in fade-in duration-500">
    <div className="relative text-center animate-in zoom-in spin-in duration-700 p-6">
      <div className="text-[150px] md:text-[250px] drop-shadow-[0_0_50px_rgba(234,179,8,0.5)] mb-4">🥇</div>
      <div className="glass-panel p-10 md:p-16 rounded-[4rem] border-4 border-yellow-500 shadow-2xl bg-white/10 relative z-10 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-7xl font-black text-yellow-500 uppercase tracking-tighter mb-4">Winner!</h1>
        <p className="text-xl md:text-3xl text-white font-bold mb-4 opacity-90">مدرسة صقر الإمارات الدولية</p>
        <p className="text-3xl md:text-6xl text-white font-black py-6 border-y border-white/20 mb-6">{name}</p>
        <p className="text-lg md:text-2xl text-yellow-400 font-bold tracking-widest uppercase">بطل تحدي القراءة الذكي</p>
        <button onClick={onClose} className="mt-10 px-16 py-4 bg-yellow-500 text-black font-black text-xl rounded-full hover:scale-110 transition-transform">استمرار</button>
      </div>
    </div>
  </div>
);

const SmartSearchPage: React.FC = () => {
  const { locale, dir } = useLanguage();
  const t = (key: string) => chatTranslations[locale][key] || key;

  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', content: chatTranslations[locale].saqrWelcome }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [winnerName, setWinnerName] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // محرك البحث الهجين
  const findLibraryContext = (query: string) => {
    const q = query.toLowerCase();
    const physical = bookData.filter(b => b.title.toLowerCase().includes(q) || b.subject.toLowerCase().includes(q)).slice(0, 3);
    const digital = ARABIC_LIBRARY_DATABASE.filter(b => b.title.toLowerCase().includes(q)).slice(0, 3);
    return `Library Context: Physical: ${JSON.stringify(physical)} | Digital: ${JSON.stringify(digital)}`;
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;
    const userQuery = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setInput('');
    setIsLoading(true);

    const context = findLibraryContext(userQuery);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'system', content: `${SAQR_ELITE_PROMPT}\n\n${context}` }, ...messages, { role: 'user', content: userQuery }],
          locale,
        }),
      });
      const data = await response.json();
      let reply = data.reply || '';

      // اكتشاف الفوز والميدالية
      if (reply.includes('[WINNER:')) {
        const match = reply.match(/\[WINNER:\s*(.*?)\]/);
        if (match) setWinnerName(match[1]);
        reply = reply.replace(/\[WINNER:.*?\]/g, '');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: chatTranslations[locale].error }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir={dir} className="max-w-4xl mx-auto px-4 py-4 md:py-10 h-[88vh] flex flex-col font-black antialiased relative">
      
      {winnerName && <VictoryMedal name={winnerName} onClose={() => setWinnerName(null)} />}

      {/* خلفية نيون ناعمة */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-red-600/5 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-green-600/5 blur-[150px] rounded-full delay-700 animate-pulse"></div>
      </div>

      <div className="flex flex-col flex-1 glass-panel rounded-[2.5rem] md:rounded-[4rem] shadow-[0_30px_80px_rgba(0,0,0,0.2)] overflow-hidden border border-white/20 bg-white/10 dark:bg-slate-950/40 backdrop-blur-3xl relative">
        
        {/* Header */}
        <div className="p-4 md:p-8 border-b border-white/10 bg-white/30 dark:bg-black/40 backdrop-blur-xl flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
            <div className="relative">
                <img src="/school-logo.png" alt="EFIPS" className="w-10 h-10 md:w-14 object-contain logo-white-filter rotate-3" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse"></div>
            </div>
            <div className="text-start">
                <h2 className="text-base md:text-xl font-black text-slate-950 dark:text-white tracking-tighter uppercase leading-none">{t('status')}</h2>
                <p className="text-[9px] font-black text-green-600 mt-1 uppercase tracking-widest">{t('online')}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 md:p-10 overflow-y-auto space-y-8 no-scrollbar relative z-10 scroll-smooth">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 md:gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-up`}>
              <div className={`w-10 h-10 md:w-14 rounded-2xl flex-shrink-0 flex items-center justify-center border border-white/20 shadow-xl ${
                  msg.role === 'assistant' ? 'bg-white' : 'bg-slate-950 text-white text-[9px] md:text-xs font-black uppercase'
                }`}>
                {msg.role === 'assistant' ? <img src="/saqr-avatar.png" alt="S" className="w-[85%] h-[85%]" /> : t('you')}
              </div>
              <div className={`relative max-w-[88%] md:max-w-[80%] p-4 md:p-8 rounded-[1.8rem] md:rounded-[2.5rem] shadow-2xl border border-white/10 ${
                  msg.role === 'user' ? 'bg-slate-950 text-white rounded-tr-none' : 'bg-white/60 dark:bg-slate-900/60 text-slate-950 dark:text-white rounded-tl-none backdrop-blur-2xl'
                }`}>
                <div className={`absolute top-0 ${msg.role === 'user' ? 'end-0' : 'start-0'} w-1.5 h-full rounded-full ${msg.role === 'user' ? 'bg-red-600' : 'bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.4)]'}`}></div>
                <div className="prose prose-sm md:prose-xl dark:prose-invert font-black leading-loose text-start" style={{ fontStyle: 'normal' }}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 md:p-10 bg-transparent relative z-20">
          <div className="max-w-3xl mx-auto relative group">
            <input
              type="text" value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('inputPlaceholder')}
              className="w-full bg-white/95 dark:bg-black/60 border-2 border-white/20 focus:border-red-600 rounded-[2rem] md:rounded-[3rem] py-4 md:py-8 ps-6 md:ps-10 pe-16 md:pe-28 text-slate-950 dark:text-white font-black text-xs md:text-xl outline-none transition-all shadow-3xl backdrop-blur-3xl placeholder:opacity-30"
              disabled={isLoading}
            />
            <button onClick={handleSendMessage} className="absolute inset-y-2 md:inset-y-3 end-2 md:end-3 w-12 h-12 md:w-20 md:h-20 flex items-center justify-center bg-red-600 text-white rounded-[1.5rem] md:rounded-[2.8rem] shadow-2xl active:scale-90 transition-all disabled:opacity-10 group/btn">
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

export default SmartSearchPage;
