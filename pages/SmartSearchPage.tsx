import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 

// --- قاعدة المعرفة الوطنية الشاملة ---
const DIGITAL_COLLECTION_SUMMARY = `
You are Saqr, the official AI librarian for Saqr Al Emarat International Private School (EFIPS).
Your Knowledge of our DIGITAL LIBRARY Titles:
- Arabic Digital Highlights: (روايات أجاثا كريستي، الفيل الأزرق، أرض الإله، يوتوبيا، سلسلة ما وراء الطبيعة، رجل المستحيل، تفسير ابن كثير، رياض الصالحين، ألف اختراع واختراع، مذكرات بكوك).
- English Digital Highlights: (Complete Harry Potter series, Me Before You, The Great Gatsby, The Kite Runner, Atomic Habits, Deep Work, Mindset, Sherlock Holmes Puzzles, Agatha Christie Mysteries).

Your Response Protocol:
1. IF FOUND PHYSICALLY: Direct to Cabinet (1-41) based on the map.
2. IF FOUND DIGITALLY: Guide them to the "Digital Library" section.
3. IF NOT FOUND LOCALLY: Provide summary and add: "علماً بأن هذا الكتاب غير متوفر حالياً ضمن مقتنيات مكتبة مدرسة صقر الإمارات."
Librarian: Islam Soliman.
`;

const translations = {
  ar: {
    saqrWelcome: 'أهلاً بك! أنا صقر. هل تبحث عن كتاب معين في مكتبتنا أم تود استكشاف معلومات من معارفي العالمية؟',
    inputPlaceholder: 'اسأل عن كتاب، مؤلف، أو موضوع بحثي...',
    isTyping: 'صقر يراجع الرفوف والبيانات...',
    error: 'عذراً، واجهت مشكلة في الاتصال. حاول مرة أخرى.',
    librarianStatus: 'اسأل صقر',
    you: 'أنت'
  },
  en: {
    saqrWelcome: "Welcome! I'm Saqr. Are you looking for a specific book or want to explore my global knowledge?",
    inputPlaceholder: 'Search for a book, author, or research topic...',
    isTyping: 'Saqr is checking shelves...',
    error: 'Sorry, connection error. Please try again.',
    librarianStatus: 'Ask Saqr',
    you: 'YOU'
  },
};

const trackActivity = (type: 'searched' | 'digital' | 'ai', label: string) => {
    const logs = JSON.parse(localStorage.getItem('efips_activity_logs') || '[]');
    logs.push({ type, label, date: new Date().toISOString() });
    localStorage.setItem('efips_activity_logs', JSON.stringify(logs));
};

const SmartSearchPage: React.FC = () => {
  const { locale, dir } = useLanguage();
  const t = (key: keyof typeof translations.ar) => translations[locale][key];

  const SCHOOL_LOGO = "/school-logo.png"; 
  const SAQR_AVATAR = "/saqr-avatar.png"; 

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: t('saqrWelcome') },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent, callback?: () => void) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const rippleId = Date.now();
    setRipples(prev => [...prev, { id: rippleId, x: clientX - rect.left, y: clientY - rect.top }]);
    setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== rippleId));
        if (callback) callback();
    }, 400);
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;
    trackActivity('ai', input.trim());
    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: `You are Saqr at EFIPS. ${DIGITAL_COLLECTION_SUMMARY}` },
            ...messages, 
            userMessage
          ],
          locale,
        }),
      });
      const data = (await response.json()) as { reply?: string };
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || t('error') }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: t('error') }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir={dir} className="max-w-7xl mx-auto px-2 sm:px-6 py-4 md:py-10 animate-fade-up relative text-start antialiased font-black h-[88vh] flex flex-col">
      
      {/* الحاوية الكبرى الملكية */}
      <div className="flex flex-col flex-1 glass-panel rounded-[3rem] md:rounded-[5.5rem] shadow-3xl dark:shadow-red-900/10 overflow-hidden border border-white/10 dark:border-white/5 relative bg-white/70 dark:bg-slate-950/70 backdrop-blur-3xl">
        
        {/* هيدر الشات النيوني */}
        <div className="relative p-6 sm:p-10 border-b border-slate-200 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md flex items-center justify-between z-20">
          <div className="flex items-center gap-5">
            <div className="relative group">
                <div className="absolute -inset-2 bg-red-600/20 rounded-full blur-xl group-hover:bg-red-600/40 transition-all"></div>
                <img src={SCHOOL_LOGO} alt="EFIPS" className="w-12 h-12 md:w-20 md:h-20 object-contain logo-white-filter rotate-6 relative z-10" />
                <span className="absolute bottom-0 right-0 w-4 h-4 md:w-6 md:h-6 bg-green-500 border-4 border-white dark:border-slate-900 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.8)]"></span>
            </div>
            <div>
                <h2 className="text-xl md:text-4xl font-black text-gray-950 dark:text-white tracking-tighter uppercase leading-none">{t('librarianStatus')}</h2>
                <div className="h-1 md:h-2 w-16 md:w-32 bg-gradient-to-r from-red-600 to-transparent rounded-full mt-3 shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
            </div>
          </div>
        </div>

        {/* منطقة الرسائل المحسنة */}
        <div className="flex-1 p-4 sm:p-12 overflow-y-auto space-y-10 bg-slate-50/5 dark:bg-black/5 relative z-10 no-scrollbar">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-4 sm:gap-8 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-up`}>
              
              {/* أيقونة المستخدم / صقر بحواف نيون */}
              <div className={`w-12 h-12 sm:w-24 sm:h-24 rounded-[1.8rem] sm:rounded-[3rem] flex-shrink-0 flex items-center justify-center shadow-2xl border-2 transition-all relative overflow-hidden ${
                  msg.role === 'assistant' 
                  ? 'bg-white border-green-500/30 dark:shadow-[0_0_30px_rgba(34,197,94,0.2)]' 
                  : 'bg-slate-950 border-red-600/30 text-white font-black text-xs md:text-xl dark:shadow-[0_0_30px_rgba(220,38,38,0.2)]'
                }`}>
                {msg.role === 'assistant' ? <img src={SAQR_AVATAR} alt="Saqr" className="w-[85%] h-[85%] object-contain animate-float" /> : t('you')}
              </div>

              {/* فقاعة الرسالة (Neon BookCard Style) */}
              <div className={`relative max-w-[85%] sm:max-w-[70%] p-5 sm:p-10 rounded-[2.2rem] sm:rounded-[4rem] shadow-xl border border-white/10 ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-tr-none' 
                    : 'bg-white/95 dark:bg-[#1e293b]/90 text-slate-950 dark:text-white rounded-tl-none'
                }`}>
                
                {/* حافة النيون الجانبية الذكية */}
                <div className={`absolute top-0 ${msg.role === 'user' ? 'end-0' : 'start-0'} w-1.5 h-full ${msg.role === 'user' ? 'bg-red-600 shadow-[-2px_0_15px_rgba(220,38,38,0.4)]' : 'bg-green-600 shadow-[2px_0_15px_rgba(34,197,94,0.4)]'}`}></div>

                <div className="prose prose-sm sm:prose-2xl dark:prose-invert font-bold leading-relaxed">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {/* أنيميشن تفكير صقر */}
          {isLoading && (
            <div className="flex items-center gap-6 animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-white border-2 border-green-500/20 flex items-center justify-center shadow-lg shadow-green-500/10">
                  <img src={SAQR_AVATAR} alt="..." className="w-8 h-8 opacity-40 animate-bounce" />
              </div>
              <div className="px-8 py-4 rounded-full bg-green-600/10 flex gap-2 shadow-inner border border-green-600/10">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* منطقة الإدخال التكتيكية */}
        <div className="p-5 sm:p-12 bg-white/60 dark:bg-slate-900/60 border-t border-slate-200 dark:border-white/5 backdrop-blur-3xl z-20">
          <div className="max-w-5xl mx-auto relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('inputPlaceholder')}
              className="w-full bg-slate-100 dark:bg-black/60 border-4 border-transparent focus:border-red-600 dark:focus:border-red-500 rounded-[2.5rem] sm:rounded-[4rem] py-5 sm:py-10 ps-8 sm:ps-14 pe-20 sm:pe-40 text-gray-950 dark:text-white font-black text-sm sm:text-3xl outline-none transition-all shadow-inner focus:shadow-[0_0_40px_rgba(220,38,38,0.2)]"
              disabled={isLoading}
            />
            
            <button
              onClick={(e) => handleInteraction(e, handleSendMessage)}
              disabled={isLoading || !input.trim()}
              className="absolute inset-y-3 sm:inset-y-4 end-3 sm:end-4 w-14 h-14 sm:w-28 sm:h-28 flex items-center justify-center bg-red-600 text-white rounded-[2rem] sm:rounded-[3.2rem] shadow-2xl hover:bg-red-700 active:scale-90 transition-all disabled:opacity-5 overflow-hidden group/btn"
            >
              {ripples.map(r => <span key={r.id} className="ripple-effect bg-white/30" style={{ left: r.x, top: r.y }} />)}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-14 sm:w-14 rotate-[-45deg] rtl:rotate-[135deg] group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor">
                <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartSearchPage;
