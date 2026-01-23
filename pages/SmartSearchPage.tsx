import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 
import { bookData } from '../api/bookData'; // قاعدة بيانات البحث اليدوي

// --- 1. بروتوكولات صقر الذكية ---
const SAQR_CORE_SYSTEM = `
Identity: You are Saqr, the Elite AI Librarian of Saqr Al Emarat International Private School (EFIPS).
Lead Librarian: Mr. Islam Soliman (Semsem).

Your Mission Logic:
1. INTERNAL FIRST: Always prioritize EFIPS library contents (Physical Index & Digital Library).
2. PHYSICAL GUIDANCE: If a book is found in the physical index, specify Cabinet (1-41) and Row.
3. DIGITAL GUIDANCE: If a book is in the Digital Library, guide the user to the "Digital Section".
4. SUGGESTION: If a book is NOT found, suggest the closest match in the school OR use your intelligence to provide a deep summary/answer.
5. ACADEMIC SUPPORT: Actively help students with homework, research topics, and summarize complex ideas.
6. STYLE: Clear, Bold, Professional. NO ITALICS. Response language must match user language.
`;

const translations = {
  ar: {
    saqrWelcome: 'أهلاً بك! أنا صقر، العقل المدبر لمكتبة مدرسة صقر الإمارات. كيف يمكنني إثراء بحثك أو مساعدتك في دراستك اليوم؟',
    inputPlaceholder: 'اسأل عن كتاب، موضوع بحثي، أو اطلب مساعدة في واجباتك...',
    isTyping: 'صقر يراجع قواعد بيانات المكتبة...',
    error: 'عذراً، حدث خطأ في الاتصال بصقر. حاول مجدداً.',
    status: 'المساعد الذكي (صقر)',
    online: 'نشط الآن لخدمتك',
    you: 'أنت'
  },
  en: {
    saqrWelcome: "Welcome! I'm Saqr, the official AI librarian of EFIPS. How can I assist your research or help with your studies today?",
    inputPlaceholder: 'Ask about a book, research topic, or get help with homework...',
    isTyping: 'Saqr is analyzing library data...',
    error: 'Connection error. Please try again.',
    status: 'Saqr AI Assistant',
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

  // --- محرك البحث الداخلي الذكي ---
  const findLibraryContext = (query: string) => {
    const q = query.toLowerCase();
    const matches = bookData.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.author.toLowerCase().includes(q) || 
        b.subject.toLowerCase().includes(q)
    ).slice(0, 5); // نأخذ أفضل 5 نتائج لتعزيز السياق

    if (matches.length > 0) {
        return `Current School Library context for this query: ${JSON.stringify(matches)}. If user asks about these, guide them to the exact Shelf and Row mentioned.`;
    }
    return "No direct matches in the local physical index. Use your intelligence to suggest or answer.";
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;
    
    const userQuery = input.trim();
    const userMessage: ChatMessage = { role: 'user', content: userQuery };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // البحث في سياق المكتبة قبل الإرسال
    const libraryContext = findLibraryContext(userQuery);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: `${SAQR_CORE_SYSTEM}\n\nContext: ${libraryContext}` }, 
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
    <div dir={dir} className="max-w-6xl mx-auto px-2 md:px-6 py-2 md:py-8 h-[92dvh] flex flex-col font-black antialiased relative overflow-hidden">
      
      {/* 1. نيونات زجاجية مبهجة في الخلفية */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-red-600/10 blur-[100px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-green-600/10 blur-[120px] rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="flex flex-col flex-1 glass-panel rounded-[2rem] md:rounded-[4.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] overflow-hidden border border-white/20 bg-white/10 dark:bg-slate-950/50 backdrop-blur-3xl">
        
        {/* 2. الهيدر الفخم */}
        <div className="p-4 md:p-8 border-b border-white/10 bg-white/30 dark:bg-black/40 backdrop-blur-2xl flex items-center justify-between z-20">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative group">
                <img src={SCHOOL_LOGO} alt="EFIPS" className="w-12 h-12 md:w-20 md:h-20 object-contain logo-white-filter rotate-3 group-hover:rotate-0 transition-transform duration-500" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 md:w-6 md:h-6 bg-green-500 border-[3px] md:border-[5px] border-white dark:border-slate-900 rounded-full animate-pulse"></div>
            </div>
            <div>
                <h2 className="text-base md:text-4xl font-black text-slate-950 dark:text-white tracking-tighter uppercase leading-none">{t('status')}</h2>
                <p className="text-[9px] md:text-sm font-black text-green-600 mt-2 uppercase tracking-[0.2em]">{t('online')}</p>
            </div>
          </div>
        </div>

        {/* 3. منطقة المحادثة */}
        <div className="flex-1 p-4 md:p-14 overflow-y-auto space-y-10 md:space-y-14 no-scrollbar relative z-10 scroll-smooth">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 md:gap-8 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-up`}>
              
              <div className={`w-10 h-10 md:w-16 md:h-16 rounded-2xl md:rounded-[2rem] flex-shrink-0 flex items-center justify-center border border-white/20 shadow-2xl transition-all ${
                  msg.role === 'assistant' ? 'bg-white/90 dark:bg-white' : 'bg-slate-950 text-white text-[10px] md:text-sm font-black uppercase'
                }`}>
                {msg.role === 'assistant' ? <img src={SAQR_AVATAR} alt="S" className="w-[85%] h-[85%] object-contain" /> : t('you')}
              </div>

              <div className={`relative max-w-[90%] md:max-w-[80%] p-4 md:p-8 rounded-[1.8rem] md:rounded-[3.5rem] shadow-2xl border border-white/10 ${
                  msg.role === 'user' 
                    ? 'bg-slate-950 text-white rounded-tr-none' 
                    : 'bg-white/60 dark:bg-slate-900/60 text-slate-950 dark:text-white rounded-tl-none backdrop-blur-2xl'
                }`}>
                {/* الحافة النيون لرسائل صقر */}
                <div className={`absolute top-0 ${msg.role === 'user' ? 'end-0' : 'start-0'} w-1.5 h-full rounded-full ${msg.role === 'user' ? 'bg-red-600' : 'bg-green-600 shadow-[0_0_20px_rgba(34,197,94,0.6)]'}`}></div>
                
                <div className="prose prose-sm md:prose-xl dark:prose-invert font-bold leading-loose text-start" style={{ fontStyle: 'normal' }}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-4 animate-pulse">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-white border border-green-500/20 flex items-center justify-center shadow-lg">
                  <img src={SAQR_AVATAR} alt="Thinking" className="w-8 h-8 opacity-40 animate-bounce" />
              </div>
              <div className="px-6 py-3 rounded-full bg-green-600/10 border border-white/10 backdrop-blur-xl">
                  <div className="flex gap-2">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
                  </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 4. منطقة الإدخال الملكية (Mobile Optimized) */}
        <div className="p-4 md:p-12 bg-transparent relative z-20">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 via-green-600/20 to-red-600/20 rounded-[2.5rem] md:rounded-[4rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700"></div>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('inputPlaceholder')}
              className="w-full bg-white/95 dark:bg-black/70 border-2 border-white/20 focus:border-red-600 rounded-[2rem] md:rounded-[4rem] py-5 md:py-10 ps-6 md:ps-14 pe-16 md:pe-36 text-slate-950 dark:text-white font-black text-xs md:text-2xl outline-none transition-all shadow-3xl backdrop-blur-3xl"
              disabled={isLoading}
            />
            
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="absolute inset-y-2 md:inset-y-3 end-2 md:end-3 w-12 h-12 md:w-24 md:h-24 flex items-center justify-center bg-red-600 text-white rounded-[1.5rem] md:rounded-[3rem] shadow-2xl hover:bg-red-700 active:scale-90 transition-all disabled:opacity-5 group/btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-12 md:w-12 rotate-[-45deg] rtl:rotate-[135deg]" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor">
                <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        /* استقامة الخطوط وضمان فخامة العرض العربي */
        * { font-style: normal !important; }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .glass-panel { backdrop-filter: blur(60px) saturate(180%); }
        
        .logo-white-filter { transition: filter 0.5s ease; }
        .dark .logo-white-filter { filter: brightness(0) invert(1); }

        .prose { line-height: 1.8 !important; }

        @media (max-width: 768px) {
            .h-[92dvh] { h: 90dvh; }
            .prose { line-height: 1.6 !important; font-size: 14px !important; }
        }
      `}</style>
    </div>
  );
};

export default SmartSearchPage;
