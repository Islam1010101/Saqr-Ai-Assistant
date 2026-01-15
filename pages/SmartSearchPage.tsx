import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 

// --- قاعدة المعرفة الوطنية للمساعد "صقر" (محدثة للتوجيه) ---
const DIGITAL_COLLECTION_SUMMARY = `
You are Saqr, the official AI librarian for Saqr Al Emarat International Private School (EFIPS).
Your Primary Duty: When asked about any book or content, you MUST inform the user that it is available in our "Digital Library" section and guide them to go there to read it.
Collection Overview:
- 41 Arabic Digital Titles: (Classic stories, Islamic Heritage, Modern Novels).
- 33 English Digital Titles: (Harry Potter series, Agatha Christie, Puzzles, and H.D/Productivity books).
School Environment: American Curriculum.
Librarian: Islam Soliman.
`;

const translations = {
  ar: {
    saqrWelcome: 'أهلاً بك! أنا صقر، مساعدك الذكي. كيف يمكنني إرشادك اليوم للوصول إلى كتبنا المتاحة في المكتبة الرقمية ؟',
    inputPlaceholder: 'اسألني عن أي كتاب أو موضوع...',
    isTyping: 'صقر يحلل البيانات...',
    error: 'عذراً، واجهت مشكلة في الاتصال. حاول مرة أخرى.',
    librarianStatus: 'مساعد مكتبة صقر الإمارات الذكي',
    you: 'أنت'
  },
  en: {
    saqrWelcome: "Welcome! I'm Saqr, your smart guide. How can I direct you to our digital collection today ?",
    inputPlaceholder: 'Ask about any book or subject...',
    isTyping: 'Saqr is processing...',
    error: 'Sorry, connection error. Please try again.',
    librarianStatus: 'Saqr Smart School Librarian',
    you: 'YOU'
  },
};

const SmartSearchPage: React.FC = () => {
  const { locale, dir } = useLanguage();
  const isAr = locale === 'ar';
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

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  }, []);

  useEffect(() => {
    setMessages([{ role: 'assistant', content: t('saqrWelcome') }]);
  }, [locale]);

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
            { role: 'system', content: `You are Saqr at EFIPS. Professionally guide students to the Digital Library for any reading requests. ${DIGITAL_COLLECTION_SUMMARY}` },
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
    <div dir={dir} className="max-w-6xl mx-auto px-2 sm:px-6 pt-4 md:pt-10 pb-20 animate-fade-up relative">
      
      {/* الكارت الذكي الموحد - بدون عناوين خارجية أو ملصقات زائدة */}
      <div 
        onMouseMove={handleMouseMove}
        className="flex flex-col h-[82vh] glass-panel rounded-[2.5rem] md:rounded-[4.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.12)] overflow-hidden border-none relative transition-all duration-500"
      >
        {/* بار الهوية النخبوي */}
        <div className="relative p-5 sm:p-8 border-b border-slate-200 dark:border-white/5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
            <div className="relative">
                <img src={SCHOOL_LOGO} alt="EFIPS" className="w-10 h-10 md:w-14 md:h-14 object-contain logo-white-filter rotate-6" />
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-600 border-2 border-white rounded-full animate-pulse"></span>
            </div>
            <div>
                <h2 className="text-base sm:text-2xl font-black text-gray-950 dark:text-white tracking-tighter uppercase">{t('librarianStatus')}</h2>
                <div className="h-0.5 w-12 bg-red-600 rounded-full mt-1.5 transition-all"></div>
            </div>
          </div>
        </div>

        {/* منطقة الرسائل الاستجابية */}
        <div className="flex-1 p-4 sm:p-10 overflow-y-auto space-y-8 bg-slate-50/10 dark:bg-black/10 relative z-10 no-scrollbar">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 sm:gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-up`}>
              <div className={`w-10 h-10 sm:w-16 sm:h-16 rounded-[1.2rem] sm:rounded-[1.8rem] flex-shrink-0 flex items-center justify-center shadow-lg border transition-all ${
                  msg.role === 'assistant' ? 'bg-white border-green-600/10' : 'bg-slate-950 border-slate-900 text-white font-black text-[10px]'
                }`}>
                {msg.role === 'assistant' ? <img src={SAQR_AVATAR} alt="Saqr" className="w-[80%] h-[80%] object-contain" /> : t('you')}
              </div>

              <div className={`max-w-[88%] sm:max-w-[75%] p-4 sm:p-7 rounded-[1.8rem] sm:rounded-[2.5rem] shadow-md ${
                  msg.role === 'user' 
                    ? 'bg-slate-950 text-white rounded-tr-none' 
                    : 'bg-white/90 dark:bg-[#1e293b] text-slate-950 dark:text-white rounded-tl-none'
                }`}>
                <div className="prose prose-sm sm:prose-base dark:prose-invert font-bold leading-relaxed">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-white border border-green-500/10 flex items-center justify-center">
                  <img src={SAQR_AVATAR} alt="..." className="w-6 h-6 opacity-20 animate-bounce" />
              </div>
              <div className="px-5 py-3 rounded-full bg-green-600/5 flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* حقل الإدخال الذكي */}
        <div className="p-4 sm:p-8 bg-white/80 dark:bg-slate-900/80 border-t border-slate-200 dark:border-white/5 backdrop-blur-3xl z-20">
          <div className="max-w-4xl mx-auto relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('inputPlaceholder')}
              className="w-full bg-slate-100 dark:bg-black/40 border-2 border-transparent focus:border-red-600 rounded-[2rem] sm:rounded-[3rem] py-4 sm:py-7 ps-6 sm:ps-10 pe-16 sm:pe-28 text-gray-950 dark:text-white font-black text-sm sm:text-xl outline-none transition-all shadow-inner"
              disabled={isLoading}
            />
            <button
              onClick={(e) => handleInteraction(e, handleSendMessage)}
              disabled={isLoading || !input.trim()}
              className="absolute inset-y-2 sm:inset-y-3 end-2 sm:end-3 w-12 h-12 sm:w-20 sm:h-20 flex items-center justify-center bg-red-600 text-white rounded-[1.4rem] sm:rounded-[2.2rem] shadow-xl hover:bg-red-700 active:scale-90 transition-all disabled:opacity-10 overflow-hidden"
            >
              {ripples.map(r => <span key={r.id} className="ripple-effect bg-white/20" style={{ left: r.x, top: r.y }} />)}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-9 sm:w-9 rotate-[-45deg] rtl:rotate-[135deg]" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor">
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
