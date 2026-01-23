import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 
import { bookData } from '../api/bookData'; // قاعدة بيانات البحث اليدوي

// --- 1. بروتوكول عقل صقر المطور ---
const SAQR_ELITE_PROMPT = `
Identity: You are "Saqr" (صقر), the official Elite AI Librarian of Saqr Al Emarat International Private School (EFIPS).
Lead Librarian: Mr. Islam Ahmed.

Your Core Logic:
1. SEARCH PRIORITY: Always check the provided "Library Context" first. 
2. GUIDANCE: If a book is found in Physical Index, provide Shelf and Row. If in Digital Library, guide them to the digital section.
3. ACADEMIC PARTNER: Help students with homework, explain complex topics, and suggest books from EFIPS that match their research.
4. PERSONALIZATION: Recognize user interests, suggest related topics, and always be inspiring.
5. STRICT RULES: Use "صقر" NOT "سقر". NO ITALICS in Arabic. Professional, Bold, and helpful.
`;

const translations = {
  ar: {
    saqrWelcome: 'أهلاً بك! أنا صقر، المساعد الذكي لمكتبة مدرسة صقر الإمارات. أنا هنا لأوجهك نحو المعرفة، أساعدك في أبحاثك، وأقترح عليك أفضل الكتب من مكتبتنا. كيف أخدمك اليوم؟',
    inputPlaceholder: 'اسأل صقر عن كتاب، موضوع بحثي، أو مساعدة في واجباتك...',
    isTyping: 'صقر يراجع أرفف المكتبة والبيانات...',
    error: 'عذراً، واجهت مشكلة في الوصول للرفوف. حاول مجدداً.',
    status: 'أمين المكتبة الذكي (صقر)',
    online: 'نشط الآن لخدمة طلاب EFIPS',
    you: 'أنت'
  },
  en: {
    saqrWelcome: "Welcome! I'm Saqr, the AI librarian of EFIPS. I'm here to guide you to knowledge, help with your research, and suggest the best books from our collection. How can I assist you?",
    inputPlaceholder: 'Ask Saqr about a book, research topic, or homework help...',
    isTyping: 'Saqr is scanning shelves and data...',
    error: 'Sorry, I had trouble reaching the shelves. Try again.',
    status: 'Saqr AI Librarian',
    online: 'Online for EFIPS Students',
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

  // --- محرك البحث الداخلي الهجين ---
  const getInternalLibraryContext = (query: string) => {
    const q = query.toLowerCase();
    // البحث في المكتبة الورقية
    const physicalMatches = bookData.filter(b => 
        b.title.toLowerCase().includes(q) || b.subject.toLowerCase().includes(q)
    ).slice(0, 5);

    return physicalMatches.length > 0 
      ? `INTERNAL LIBRARY DATA FOUND: ${JSON.stringify(physicalMatches)}. Use this to guide the student to specific Shelves.`
      : "No direct physical match. Use your general knowledge but prioritize school academic support.";
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;
    const userQuery = input.trim();
    const userMessage: ChatMessage = { role: 'user', content: userQuery };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const context = getInternalLibraryContext(userQuery);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: `${SAQR_ELITE_PROMPT}\n\nContext: ${context}` }, 
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
      
      {/* 1. نيونات الخلفية الزجاجية */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-red-600/10 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[20%] right-[5%] w-80 h-80 bg-green-600/10 blur-[150px] rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="flex flex-col flex-1 glass-panel rounded-[2.5rem] md:rounded-[4.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] overflow-hidden border border-white/20 bg-white/10 dark:bg-slate-950/40 backdrop-blur-3xl relative">
        
        {/* 2. الهيدر الملكي */}
        <div className="p-4 md:p-8 border-b border-white/10 bg-white/30 dark:bg-black/40 backdrop-blur-2xl flex items-center justify-between z-20 shadow-xl">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative group">
                <img src={SCHOOL_LOGO} alt="EFIPS" className="w-12 h-12 md:w-20 md:h-20 object-contain logo-white-filter rotate-3 group-hover:rotate-0 transition-all duration-700" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 md:w-6 md:h-6 bg-green-500 border-[3px] md:border-[5px] border-white dark:border-slate-900 rounded-full animate-pulse"></div>
            </div>
            <div className="text-start">
                <h2 className="text-base md:text-4xl font-black text-slate-950 dark:text-white tracking-tighter uppercase leading-none">{t('status')}</h2>
                <p className="text-[9px] md:text-sm font-black text-green-600 dark:text-green-400 mt-2 uppercase tracking-[0.2em]">{t('online')}</p>
            </div>
          </div>
        </div>

        {/* 3. منطقة المحادثة - محسنة للجوال */}
        <div className="flex-1 p-3 md:p-14 overflow-y-auto space-y-8 md:space-y-12 no-scrollbar relative z-10 scroll-smooth">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-2 md:gap-8 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-up`}>
              
              {/* الآفاتار */}
              <div className={`w-10 h-10 md:w-16 md:h-16 rounded-2xl md:rounded-[2rem] flex-shrink-0 flex items-center justify-center border border-white/20 shadow-2xl transition-all hover:scale-110 ${
                  msg.role === 'assistant' ? 'bg-white/90 dark:bg-white' : 'bg-slate-950 text-white text-[10px] md:text-sm font-black uppercase'
                }`}>
                {msg.role === 'assistant' ? <img src={SAQR_AVATAR} alt="S" className="w-[85%] h-[85%] object-contain" /> : t('you')}
              </div>

              {/* فقاعة الرسالة - تصميم زجاجي صلب وواضح */}
              <div className={`relative max-w-[88%] md:max-w-[80%] p-4 md:p-9 rounded-[1.8rem] md:rounded-[3.5rem] shadow-2xl border border-white/10 ${
                  msg.role === 'user' 
                    ? 'bg-slate-950 text-white rounded-tr-none shadow-red-900/20' 
                    : 'bg-white/60 dark:bg-slate-900/60 text-slate-950 dark:text-white rounded-tl-none backdrop-blur-2xl'
                }`}>
                
                {/* خط الهوية النيوني */}
                <div className={`absolute top-0 ${msg.role === 'user' ? 'end-0' : 'start-0'} w-1.5 h-full rounded-full ${msg.role === 'user' ? 'bg-red-600' : 'bg-green-600 shadow-[0_0_20px_rgba(34,197,94,0.6)]'}`}></div>
                
                <div className="prose prose-sm md:prose-xl dark:prose-invert font-black leading-loose text-start" style={{ fontStyle: 'normal' }}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-4 animate-pulse">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-white border border-green-500/20 flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 md:w-4 md:h-4 bg-green-500 rounded-full animate-bounce"></div>
              </div>
              <div className="px-6 py-3 rounded-full bg-green-600/10 border border-white/10 backdrop-blur-xl">
                  <div className="flex gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                  </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 4. منطقة الإدخال الملكية - سهلة جداً للجوال */}
        <div className="p-3 md:p-12 bg-transparent relative z-20">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 via-green-600/20 to-red-600/20 rounded-[2.5rem] md:rounded-[4rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700"></div>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('inputPlaceholder')}
              className="w-full bg-white/95 dark:bg-black/70 border-2 border-white/20 focus:border-red-600 rounded-[2rem] md:rounded-[4.5rem] py-5 md:py-10 ps-6 md:ps-14 pe-16 md:pe-36 text-slate-950 dark:text-white font-black text-xs md:text-2xl outline-none transition-all shadow-3xl backdrop-blur-3xl placeholder:opacity-30"
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
        /* فرض استقامة الخطوط 100% ومنع التقطع */
        * { font-style: normal !important; }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .glass-panel { backdrop-filter: blur(60px) saturate(180%); }
        
        .logo-white-filter { transition: filter 0.5s ease; }
        .dark .logo-white-filter { filter: brightness(0) invert(1); }

        .prose { line-height: 1.9 !important; }

        @media (max-width: 768px) {
            .prose { line-height: 1.6 !important; font-size: 14px !important; }
            h2 { font-size: 14px !important; }
        }
      `}</style>
    </div>
  );
};

export default SmartSearchPage;
