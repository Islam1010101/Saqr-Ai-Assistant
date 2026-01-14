import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 

// --- تحديث قاعدة المعرفة الشاملة لـ "صقر" ---
const DIGITAL_COLLECTION_SUMMARY = `
Arabic Digital Collection (41 Titles):
- Mystery: Agatha Christie, Ahmed Mourad (Blue Elephant).
- Series: Impossible Man (Nabil Farouk), Ma Waraa Al Tabiaa (Ahmed Khaled Tawfik).
- Heritage: Tafsir Ibn Kathir, Sahih Bukhari/Muslim, 1000 Inventions.
- Self-Dev: Ahmed Al Shugairi (40), Ibrahim Al-Feqi.

English Digital Collection (26 Titles):
- Classics/Drama: Me Before You, Great Gatsby, Kite Runner.
- Fantasy: FULL Harry Potter Series & Fantastic Beasts.
- Puzzles: Murdle, Sherlock Holmes Puzzles.

INSTRUCTIONS for Saqr: 
1. You are the official AI librarian of Emirates Falcon Int'l Private School (EFIPS).
2. Always emphasize that these books are available in the "Digital Library" section.
`;

const translations = {
  ar: {
    pageTitle: 'المساعد الذكي (صقر AI)',
    saqrWelcome: 'أهلاً بك في بوابة المعرفة! أنا صقر، مساعدك الذكي. كيف يمكنني إرشادك ؟',
    inputPlaceholder: 'اسأل عن هاري بوتر، روايات الرعب، أو تطوير الذات...',
    isTyping: 'صقر يحلل البيانات...',
    error: 'عذراً، واجهت مشكلة في الاتصال. حاول مرة أخرى.',
    librarianStatus: 'أمين مكتبة مدرسة صقر الإمارات الذكي',
    you: 'أنت'
  },
  en: {
    pageTitle: 'Smart Assistant (Saqr AI)',
    saqrWelcome: "Welcome to the portal! I'm Saqr, your AI guide. How can I help you ?",
    inputPlaceholder: 'Ask about Harry Potter, Horror novels, or Self-development...',
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
            { role: 'system', content: `You are Saqr, the elite AI for Emirates Falcon School. Be inspiring and efficient. ${DIGITAL_COLLECTION_SUMMARY}` },
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
    <div dir={dir} className="max-w-6xl mx-auto px-2 sm:px-4 pb-20 animate-in fade-in duration-1000 relative">
      
      {/* هيدر الصفحة الضخم */}
      <div className="text-center mb-10 pt-6">
          <h1 className="text-4xl sm:text-6xl font-black text-slate-950 dark:text-white tracking-tighter">{t('pageTitle')}</h1>
          <div className="h-2 w-24 bg-green-700 mx-auto mt-4 rounded-full shadow-lg"></div>
      </div>

      <div 
        onMouseMove={handleMouseMove}
        className="flex flex-col h-[70vh] sm:h-[75vh] glass-panel glass-card-interactive rounded-[3rem] sm:rounded-[4rem] shadow-2xl overflow-hidden border-white/40 dark:border-white/10 relative"
      >
        {/* بار الحالة (Top Bar) */}
        <div className="relative overflow-hidden p-6 sm:p-8 border-b border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl flex items-center justify-between z-20">
          <div className="flex items-center gap-4 relative z-10">
            <div className="relative">
                <img src={SCHOOL_LOGO} alt="EFIPS" className="w-12 h-12 object-contain logo-white-filter" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-600 border-2 border-white rounded-full animate-pulse shadow-lg"></span>
            </div>
            <div>
                <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-0.5">Status: Online</p>
                <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white leading-none">{t('librarianStatus')}</h2>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
              <span className="px-4 py-1.5 rounded-full bg-green-600/10 text-green-700 text-[10px] font-black border border-green-600/20">GPT-4 Powered</span>
          </div>
        </div>

        {/* منطقة الرسائل (تباين فائق) */}
        <div className="flex-1 p-5 sm:p-12 overflow-y-auto space-y-8 bg-slate-50/30 dark:bg-black/20 relative z-10 scroll-smooth">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-4 sm:gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-5`}>
              {/* الصورة الرمزية */}
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-[1.2rem] sm:rounded-[1.5rem] flex-shrink-0 flex items-center justify-center shadow-xl border-2 transition-all ${
                  msg.role === 'assistant' ? 'bg-white border-green-500/20' : 'bg-green-700 border-green-500 text-white font-black text-xs'
                }`}>
                {msg.role === 'assistant' ? <img src={SAQR_AVATAR} alt="Saqr" className="w-[85%] h-[85%] object-contain" /> : t('you')}
              </div>

              {/* فقاعة الرسالة */}
              <div className={`max-w-[85%] sm:max-w-[70%] p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl backdrop-blur-2xl border-2 ${
                  msg.role === 'user' 
                    ? 'bg-green-700 text-white rounded-tr-none border-green-600' 
                    : 'bg-white/95 dark:bg-slate-900/90 text-slate-950 dark:text-white rounded-tl-none border-white/50 dark:border-white/10'
                }`}>
                <div className="prose prose-sm sm:prose-lg dark:prose-invert font-black leading-relaxed">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-4 animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-white border-2 border-green-500/20 flex items-center justify-center shadow-lg">
                  <img src={SAQR_AVATAR} alt="..." className="w-8 h-8 opacity-40 animate-bounce" />
              </div>
              <div className="px-6 py-4 rounded-full bg-green-600/5 border-2 border-green-600/10 flex gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* حقل الإدخال الضخم (نفس لغة البحث) */}
        <div className="p-6 sm:p-10 bg-white/80 dark:bg-slate-950/80 border-t border-slate-200 dark:border-white/10 backdrop-blur-3xl relative z-20">
          <div className="max-w-4xl mx-auto relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('inputPlaceholder')}
              className="w-full bg-slate-100 dark:bg-black/50 border-2 border-transparent focus:border-green-600 rounded-[2.5rem] py-5 sm:py-8 ps-8 sm:ps-12 pe-20 sm:pe-32 text-gray-950 dark:text-white font-black text-lg sm:text-2xl outline-none transition-all shadow-inner placeholder-slate-400"
              disabled={isLoading}
            />
            <button
              onClick={(e) => handleInteraction(e, handleSendMessage)}
              disabled={isLoading || !input.trim()}
              className="absolute inset-y-2 sm:inset-y-3 end-2 sm:end-4 w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center bg-green-700 text-white rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl hover:scale-105 active:scale-90 transition-all disabled:opacity-20 overflow-hidden"
            >
              {ripples.map(r => <span key={r.id} className="ripple-effect bg-white/30" style={{ left: r.x, top: r.y }} />)}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 rotate-[-45deg] rtl:rotate-[135deg]" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
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
