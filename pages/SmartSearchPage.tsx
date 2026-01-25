import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 
import { bookData } from '../api/bookData'; // قاعدة بيانات البحث اليدوي

// --- 1. بروتوكول عقل صقر المطور ---
const SAQR_ELITE_PROMPT = `
Identity: You are "Saqr" (صقر), the official Elite AI Librarian of Saqr Al Emarat International Private School (EFIPS).
Supervised by: Chief Librarian Mr. Islam Soliman.

Your Intelligence Protocol:
1. INTERNAL FIRST: When a user asks about a book or topic, always scan the provided "Library Context" (Physical/Digital) first.
2. GUIDANCE: If a book is found, provide its specific location (Shelf/Row) or direct them to the Digital Library section.
3. ADAPTIVE HELP: Help students with homework and research. If you find a relevant book in EFIPS library, suggest it first.
4. INTEREST RECOGNITION: Deduce user interests from their questions and suggest future readings or "Topics".
5. IDENTITY: You are Saqr (صقر). You are helpful, professional, and proud of EFIPS.
6. STYLE: Clear, elegant Arabic. NO ITALICS. High-quality summaries only.
`;

const translations = {
  ar: {
    saqrWelcome: 'أهلاً بك! أنا صقر، مساعدك الذكي في مكتبة مدرسة صقر الإمارات. كيف يمكنني إثراء رحلتك المعرفية أو مساعدتك في أبحاثك اليوم؟',
    inputPlaceholder: 'ابحث عن كتاب، اطلب مساعدة في واجباتك، أو استكشف موضوعاً جديداً...',
    isTyping: 'صقر يراجع الرفوف والبيانات...',
    error: 'عذراً، واجهت مشكلة في الاتصال. حاول مرة أخرى.',
    librarianStatus: 'المساعد الذكي (صقر)',
    online: 'متصل وجاهز للمساعدة',
    you: 'أنت'
  },
  en: {
    saqrWelcome: "Welcome! I'm Saqr, your AI research assistant at EFIPS. How can I help you with your books or studies today?",
    inputPlaceholder: 'Search for a book, get help with homework, or explore a topic...',
    isTyping: 'Saqr is checking data...',
    error: 'Connection error. Please try again.',
    librarianStatus: 'Saqr AI Assistant',
    online: 'Online & Ready',
    you: 'YOU'
  },
};

const SmartSearchPage: React.FC = () => {
  const { locale, dir } = useLanguage();
  const t = (key: keyof typeof translations.ar) => translations[locale][key];

  const SCHOOL_LOGO = "/school-logo.png"; 
  const SAQR_AVATAR = "/saqr-avatar.png"; 

  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', content: t('saqrWelcome') }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // --- محرك الفلترة الداخلي (قبل إرسال الطلب لـ AI) ---
  const findLocalContext = (query: string) => {
    const q = query.toLowerCase();
    const matches = bookData.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.author.toLowerCase().includes(q) || 
        b.subject.toLowerCase().includes(q)
    ).slice(0, 5);

    if (matches.length > 0) {
        return `IMPORTANT: We found these books in our EFIPS library: ${JSON.stringify(matches)}. Tell the user they are available and provide the shelf/row.`;
    }
    return "No direct physical match found in the index. Use your intelligence to assist the student.";
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;
    const userQuery = input.trim();
    const userMessage: ChatMessage = { role: 'user', content: userQuery };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const localContext = findLocalContext(userQuery);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: `${SAQR_ELITE_PROMPT}\n\nLibrary Context: ${localContext}` }, 
            ...messages, 
            userMessage
          ],
          locale,
        }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || t('error') }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: t('error') }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir={dir} className="max-w-4xl mx-auto px-4 py-6 md:py-10 h-[88vh] flex flex-col font-black antialiased relative">
      
      {/* خلفية نيون ناعمة للجمالية */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-red-600/5 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-green-600/5 blur-[150px] rounded-full"></div>
      </div>

      <div className="flex flex-col flex-1 glass-panel rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.2)] overflow-hidden border border-white/20 bg-white/10 dark:bg-slate-950/40 backdrop-blur-3xl relative">
        
        {/* 2. هيدر الشات - أنيق ومحجم */}
        <div className="relative p-4 md:p-6 border-b border-white/10 bg-white/20 dark:bg-black/20 backdrop-blur-xl flex items-center justify-between z-20 shadow-md">
          <div className="flex items-center gap-4">
            <div className="relative">
                <img src={SCHOOL_LOGO} alt="EFIPS" className="w-10 h-10 md:w-14 md:h-14 object-contain logo-white-filter rotate-3" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse"></div>
            </div>
            <div className="text-start">
                <h2 className="text-base md:text-xl font-black text-slate-950 dark:text-white tracking-tighter uppercase leading-none">{t('librarianStatus')}</h2>
                <p className="text-[9px] md:text-[10px] font-black text-green-600 mt-1 uppercase tracking-widest">{t('online')}</p>
            </div>
          </div>
        </div>

        {/* 3. منطقة الرسائل */}
        <div className="flex-1 p-4 md:p-10 overflow-y-auto space-y-8 no-scrollbar relative z-10 scroll-smooth">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 md:gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-up`}>
              
              <div className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl md:rounded-[1.3rem] flex-shrink-0 flex items-center justify-center border border-white/20 shadow-xl ${
                  msg.role === 'assistant' ? 'bg-white/90 dark:bg-white' : 'bg-slate-950 text-white text-[9px] md:text-xs font-black uppercase'
                }`}>
                {msg.role === 'assistant' ? <img src={SAQR_AVATAR} alt="S" className="w-[85%] h-[85%] object-contain" /> : t('you')}
              </div>

              <div className={`relative max-w-[88%] md:max-w-[80%] p-4 md:p-7 rounded-[1.8rem] md:rounded-[2.5rem] shadow-2xl border border-white/10 ${
                  msg.role === 'user' 
                    ? 'bg-slate-950 text-white rounded-tr-none' 
                    : 'bg-white/60 dark:bg-slate-900/60 text-slate-950 dark:text-white rounded-tl-none backdrop-blur-2xl shadow-green-500/5'
                }`}>
                <div className={`absolute top-0 ${msg.role === 'user' ? 'end-0' : 'start-0'} w-1.5 h-full rounded-full ${msg.role === 'user' ? 'bg-red-600' : 'bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.4)]'}`}></div>
                <div className="prose prose-sm md:prose-lg dark:prose-invert font-bold leading-relaxed text-start" style={{ fontStyle: 'normal' }}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-white border border-green-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
              </div>
              <div className="px-5 py-2 rounded-full bg-green-600/10 border border-white/10 backdrop-blur-md">
                  <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                  </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 4. منطقة الإدخال الفخمة (Command Bar) */}
        <div className="p-4 md:p-10 bg-transparent relative z-20">
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 via-green-600/20 to-red-600/20 rounded-[2.2rem] md:rounded-[3rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700"></div>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('inputPlaceholder')}
              className="w-full bg-white/95 dark:bg-black/60 border-2 border-white/20 focus:border-red-600 rounded-[2rem] md:rounded-[3rem] py-4 md:py-8 ps-6 md:ps-10 pe-16 md:pe-28 text-slate-950 dark:text-white font-black text-xs md:text-xl outline-none transition-all shadow-3xl backdrop-blur-3xl placeholder:opacity-30"
              disabled={isLoading}
            />
            
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="absolute inset-y-2 md:inset-y-3 end-2 md:end-3 w-12 h-12 md:w-20 md:h-20 flex items-center justify-center bg-red-600 text-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl active:scale-90 transition-all disabled:opacity-10 group/btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-10 md:w-10 rotate-[-45deg] rtl:rotate-[135deg]" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor">
                <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        /* فرض استقامة الخطوط عالمياً لهذا المكون بطلبك */
        * { font-style: normal !important; }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .glass-panel { backdrop-filter: blur(50px) saturate(160%); }
        
        .logo-white-filter { transition: filter 0.5s ease; }
        .dark .logo-white-filter { filter: brightness(0) invert(1); }

        .prose { line-height: 1.8 !important; }
        
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default SmartSearchPage;
