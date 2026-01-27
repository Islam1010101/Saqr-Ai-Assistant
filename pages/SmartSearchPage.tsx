import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 
import { bookData } from '../api/bookData'; // الفهرس الورقي

// --- 1. بروتوكول عقل صقر الملكي (Identity & Logic) ---
const SAQR_ELITE_PROMPT = `
Identity: You are "Saqr" (صقر), the official Elite AI Librarian of Saqr Al Emarat International Private School (EFIPS).
Supervised by: Chief Librarian Mr. Islam Soliman.

Core Intelligence Protocol:
1. HYBRID SEARCH: You have access to Physical & Digital collections. Always check the provided "Context" first.
2. GUIDANCE: If a book is found in context, provide the Cabinet/Shelf number or direct them to the Digital Library.
3. ACADEMIC PARTNER: Help students with EFIPS homework, explain topics, and suggest books from our library first.
4. CHALLENGE MODE: If a user says they finished a book, ask 3 intelligent questions one by one.
5. WINNING: If they succeed, you MUST end your message with exactly: [WINNER: StudentName].
6. LANGUAGE: Use Formal, Professional Modern Standard Arabic (Fos'ha). NO ITALICS.
7. NAME: Your name is صقر (Saqr), not سقر.
`;

// --- 2. الترجمات المدققة (اللغة العربية الفصحى) ---
const chatLabels: any = {
  ar: {
    welcome: 'مرحباً بك في رحاب المعرفة! أنا صقر، أمين المكتبة الذكي بمدرسة صقر الإمارات الدولية. كيف يمكنني إرشادك في أبحاثك أو مساعدتك في العثور على كنوزنا الأدبية اليوم؟',
    input: 'ابحث عن كتاب، اطلب مساعدة دراسية، أو ابدأ تحدي القراءة...',
    status: 'أمين المكتبة الذكي (صقر)',
    online: 'متصل وجاهز لإرشادك',
    you: 'أنت',
    error: 'عذراً، حدث خطأ في مزامنة البيانات مع صقر. يرجى المحاولة ثانية.'
  },
  en: {
    welcome: "Welcome! I'm Saqr, the Elite AI Librarian of EFIPS. How can I guide your research or assist you in finding our literary treasures today?",
    input: 'Search for a book, get study help, or start a challenge...',
    status: 'Saqr AI Librarian',
    online: 'Online & Ready',
    you: 'YOU',
    error: 'Sorry, data synchronization failed. Please try again.'
  }
};

// --- 3. مكون الميدالية الذهبية الملكية (فوز التحدي) ---
const VictoryMedal: React.FC<{ name: string; onClose: () => void }> = ({ name, onClose }) => (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-3xl animate-in fade-in duration-500 p-4">
    <div className="relative text-center animate-in zoom-in spin-in duration-1000">
      <div className="text-[180px] md:text-[320px] drop-shadow-[0_0_60px_rgba(234,179,8,0.7)] leading-none mb-4 animate-bounce">🥇</div>
      <div className="glass-panel p-8 md:p-16 rounded-[4rem] border-4 border-yellow-500 shadow-[0_0_100px_rgba(234,179,8,0.3)] bg-white/10 relative z-10 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-9xl font-black text-yellow-500 uppercase tracking-tighter mb-4 italic-none">WINNER!</h1>
        <p className="text-xl md:text-4xl text-white font-bold mb-6 opacity-90">مدرسة صقر الإمارات الدولية</p>
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-yellow-500 to-transparent my-8"></div>
        <p className="text-4xl md:text-8xl text-white font-black mb-8 drop-shadow-lg break-words">{name}</p>
        <p className="text-lg md:text-3xl text-yellow-400 font-black tracking-[0.3em] uppercase">بطل تحدي القارئ المبدع</p>
        <button onClick={onClose} className="mt-12 px-20 py-5 bg-yellow-500 text-black font-black text-2xl rounded-full hover:scale-110 transition-all shadow-2xl active:scale-95">متابعة الرحلة</button>
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
  const [winnerName, setWinnerName] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // --- محرك البحث الهجين الفائق ---
  const findFullLibraryContext = (query: string) => {
    const q = query.toLowerCase();
    // البحث في الفهرس الورقي والرقمي معاً
    const matches = bookData.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.author.toLowerCase().includes(q) || 
        b.subject.toLowerCase().includes(q)
    ).slice(0, 5);

    return matches.length > 0 
      ? `CONTEXT_FOUND: ${JSON.stringify(matches)}. If digital, guide to Digital section. If physical, give Shelf/Row.`
      : "CONTEXT_EMPTY: No direct matches found. Use your core knowledge to assist.";
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;
    const userQuery = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setInput('');
    setIsLoading(true);

    const context = findFullLibraryContext(userQuery);

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

      // نظام اكتشاف الفوز والميدالية
      if (reply.includes('[WINNER:')) {
        const match = reply.match(/\[WINNER:\s*(.*?)\]/);
        if (match) setWinnerName(match[1]);
        reply = reply.replace(/\[WINNER:.*?\]/g, '');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: chatLabels[locale].error }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir={dir} className="max-w-4xl mx-auto px-4 py-4 md:py-10 h-[92dvh] flex flex-col font-black antialiased relative">
      
      {winnerName && <VictoryMedal name={winnerName} onClose={() => setWinnerName(null)} />}

      {/* خلفية جمالية تفاعلية */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-red-600/10 blur-[150px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-green-600/10 blur-[180px] rounded-full delay-700 animate-pulse"></div>
      </div>

      <div className="flex flex-col flex-1 glass-panel rounded-[2.5rem] md:rounded-[4.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] overflow-hidden border border-white/20 bg-white/10 dark:bg-slate-950/60 backdrop-blur-3xl relative">
        
        {/* هيدر الصفحة (فخم ومحجم) */}
        <div className="p-5 md:p-8 border-b border-white/10 bg-white/30 dark:bg-black/40 backdrop-blur-2xl flex items-center justify-between z-20 shadow-md">
          <div className="flex items-center gap-5">
            <div className="relative group cursor-pointer">
                <img src="/school-logo.png" alt="EFIPS" className="w-12 h-12 md:w-20 object-contain logo-white-filter rotate-3 transition-transform group-hover:rotate-0 duration-700" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 md:w-6 md:h-6 bg-green-500 border-4 border-white dark:border-slate-900 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]"></div>
            </div>
            <div className="text-start">
                <h2 className="text-lg md:text-3xl font-black text-slate-950 dark:text-white tracking-tighter uppercase leading-none">{t('status')}</h2>
                <p className="text-[10px] md:text-xs font-black text-green-600 mt-2 uppercase tracking-widest">{t('online')}</p>
            </div>
          </div>
        </div>

        {/* منطقة المحادثة */}
        <div className="flex-1 p-4 md:p-12 overflow-y-auto space-y-10 no-scrollbar relative z-10 scroll-smooth">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-4 md:gap-8 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-up`}>
              {/* Avatar */}
              <div className={`w-12 h-12 md:w-16 rounded-2xl md:rounded-[2rem] flex-shrink-0 flex items-center justify-center border border-white/20 shadow-2xl transition-all hover:scale-110 ${
                  msg.role === 'assistant' ? 'bg-white' : 'bg-slate-950 text-white text-[10px] md:text-sm font-black uppercase'
                }`}>
                {msg.role === 'assistant' ? <img src="/saqr-avatar.png" alt="S" className="w-[85%] h-[85%]" /> : t('you')}
              </div>
              {/* Bubble */}
              <div className={`relative max-w-[90%] md:max-w-[80%] p-5 md:p-10 rounded-[2rem] md:rounded-[4rem] shadow-2xl border border-white/10 ${
                  msg.role === 'user' ? 'bg-slate-950 text-white rounded-tr-none' : 'bg-white/60 dark:bg-slate-900/60 text-slate-950 dark:text-white rounded-tl-none backdrop-blur-2xl'
                }`}>
                <div className={`absolute top-0 ${msg.role === 'user' ? 'end-0' : 'start-0'} w-2 h-full rounded-full ${msg.role === 'user' ? 'bg-red-600' : 'bg-green-600 shadow-[0_0_20px_rgba(34,197,94,0.5)]'}`}></div>
                <div className="prose prose-sm md:prose-xl dark:prose-invert font-black leading-loose text-start" style={{ fontStyle: 'normal' }}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-5 animate-pulse">
                <div className="w-12 h-12 md:w-16 rounded-2xl bg-white border border-green-500/20 flex items-center justify-center shadow-lg">
                    <div className="w-2 h-2 md:w-4 bg-green-500 rounded-full animate-bounce"></div>
                </div>
                <div className="px-6 py-3 rounded-full bg-green-600/10 border border-white/10 backdrop-blur-xl flex gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* منطقة الإدخال (Command Bar) */}
        <div className="p-4 md:p-12 bg-transparent relative z-20">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-red-600/20 via-green-600/20 to-red-600/20 rounded-[3rem] md:rounded-[5rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000"></div>
            <input
              type="text" value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('input')}
              className="w-full bg-white/95 dark:bg-black/60 border-2 border-white/20 focus:border-red-600 rounded-[2.5rem] md:rounded-[5rem] py-5 md:py-10 ps-8 md:ps-16 pe-20 md:pe-40 text-slate-950 dark:text-white font-black text-sm md:text-2xl outline-none transition-all shadow-3xl backdrop-blur-3xl placeholder:opacity-30"
              disabled={isLoading}
            />
            <button onClick={handleSendMessage} className="absolute inset-y-2 md:inset-y-4 end-2 md:end-4 w-14 h-14 md:w-24 md:h-24 flex items-center justify-center bg-red-600 text-white rounded-[1.8rem] md:rounded-[3.5rem] shadow-2xl active:scale-90 transition-all hover:bg-red-700 disabled:opacity-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-14 md:w-14 rotate-[-45deg] rtl:rotate-[135deg]" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor">
                <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        /* استقامة تامة ومنع تقطع الحروف */
        * { font-style: normal !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .glass-panel { backdrop-filter: blur(60px) saturate(180%); }
        .logo-white-filter { transition: filter 0.5s ease; }
        .dark .logo-white-filter { filter: brightness(0) invert(1); }
        .italic-none { font-style: normal !important; }
      `}</style>
    </div>
  );
};

export default SmartSearchPage;
