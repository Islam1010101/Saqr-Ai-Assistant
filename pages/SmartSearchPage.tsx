import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 

const DIGITAL_COLLECTION_SUMMARY = `
You are Saqr, the official AI librarian for Saqr Al Emarat International Private School (EFIPS).
Protocols: IF FOUND PHYSICALLY: Cabinet (1-41). IF DIGITALLY: Digital Library section.
Librarian: Islam Soliman.
`;

const translations = {
  ar: {
    saqrWelcome: 'أهلاً بك! أنا صقر. هل تود استكشاف مكتبتنا اليوم؟',
    inputPlaceholder: 'اسأل عن كتاب، مؤلف، أو موضوع بحثي...',
    isTyping: 'صقر يراجع الرفوف والبيانات...',
    error: 'عذراً، واجهت مشكلة في الاتصال. حاول مرة أخرى.',
    librarianStatus: 'اسأل صقر',
    you: 'أنت'
  },
  en: {
    saqrWelcome: "Welcome! I'm Saqr. How can I assist your research today?",
    inputPlaceholder: 'Search for a book, author, or research topic...',
    isTyping: 'Saqr is checking shelves...',
    error: 'Sorry, connection error. Please try again.',
    librarianStatus: 'Ask Saqr',
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
  const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent, callback?: () => void) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setRipples(prev => [...prev, { id: Date.now(), x: clientX - rect.left, y: clientY - rect.top }]);
    if (callback) setTimeout(callback, 400);
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
          messages: [{ role: 'system', content: `You are Saqr at EFIPS. ${DIGITAL_COLLECTION_SUMMARY}` }, ...messages, userMessage],
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
    <div dir={dir} className="max-w-5xl mx-auto px-3 md:px-6 py-4 md:py-8 animate-fade-up h-[88vh] flex flex-col font-black antialiased">
      
      <div className="flex flex-col flex-1 glass-panel rounded-[2.5rem] md:rounded-[4rem] shadow-3xl overflow-hidden border border-white/10 relative bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl">
        
        {/* هيدر الشات - تحجيم ذكي */}
        <div className="relative p-4 md:p-6 border-b border-slate-200 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
            <div className="relative group">
                <div className="absolute -inset-1.5 bg-red-600/20 rounded-full blur-lg"></div>
                <img src={SCHOOL_LOGO} alt="EFIPS" className="w-10 h-10 md:w-14 md:h-14 object-contain logo-white-filter rotate-3 relative z-10" />
            </div>
            <div>
                <h2 className="text-lg md:text-2xl font-black text-gray-950 dark:text-white tracking-tighter uppercase">{t('librarianStatus')}</h2>
                <div className="h-1 w-12 md:w-20 bg-gradient-to-r from-red-600 to-transparent rounded-full mt-1"></div>
            </div>
          </div>
        </div>

        {/* منطقة الرسائل - نصوص مريحة للديسكتوب */}
        <div className="flex-1 p-4 md:p-10 overflow-y-auto space-y-8 no-scrollbar relative z-10">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 md:gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-up`}>
              
              <div className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl md:rounded-[1.5rem] flex-shrink-0 flex items-center justify-center border-2 transition-all ${
                  msg.role === 'assistant' 
                  ? 'bg-white border-green-500/30' 
                  : 'bg-slate-900 border-red-600/30 text-white text-[10px] md:text-sm font-black'
                }`}>
                {msg.role === 'assistant' ? <img src={SAQR_AVATAR} alt="Saqr" className="w-[80%] h-[80%] object-contain" /> : t('you')}
              </div>

              <div className={`relative max-w-[85%] md:max-w-[75%] p-4 md:p-6 rounded-[1.8rem] md:rounded-[2.5rem] shadow-lg border border-white/10 ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-tr-none' 
                    : 'bg-white/95 dark:bg-slate-800/90 text-slate-950 dark:text-white rounded-tl-none'
                }`}>
                <div className={`absolute top-0 ${msg.role === 'user' ? 'end-0' : 'start-0'} w-1 h-full ${msg.role === 'user' ? 'bg-red-600' : 'bg-green-600'}`}></div>
                <div className="prose prose-sm md:prose-lg dark:prose-invert font-bold leading-relaxed">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-white border border-green-500/20 flex items-center justify-center shadow-md">
                  <img src={SAQR_AVATAR} alt="..." className="w-6 h-6 opacity-30 animate-bounce" />
              </div>
              <div className="px-4 py-2 rounded-full bg-green-600/10 flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* منطقة الإدخال - نحيفة واحترافية للديسكتوب */}
        <div className="p-4 md:p-8 bg-white/60 dark:bg-slate-900/60 border-t border-slate-200 dark:border-white/5 backdrop-blur-3xl">
          <div className="max-w-4xl mx-auto relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('inputPlaceholder')}
              className="w-full bg-slate-100 dark:bg-black/60 border-2 border-transparent focus:border-red-600 rounded-[1.8rem] md:rounded-[2.5rem] py-4 md:py-6 ps-6 md:ps-10 pe-16 md:pe-24 text-gray-950 dark:text-white font-black text-sm md:text-xl outline-none transition-all shadow-inner"
              disabled={isLoading}
            />
            
            <button
              onClick={(e) => handleInteraction(e, handleSendMessage)}
              disabled={isLoading || !input.trim()}
              className="absolute inset-y-2 end-2 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-red-600 text-white rounded-2xl md:rounded-[1.8rem] shadow-xl hover:bg-red-700 active:scale-90 transition-all disabled:opacity-5 group/btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 rotate-[-45deg] rtl:rotate-[135deg]" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
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
