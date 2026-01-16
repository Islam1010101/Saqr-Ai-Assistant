import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 

// --- قاعدة المعرفة الوطنية الشاملة (1-41) للمساعد صقر ---
const DIGITAL_COLLECTION_SUMMARY = `
You are Saqr, the official AI librarian for Saqr Al Emarat International Private School (EFIPS).
Your Goal: Guide students to the EXACT cabinet while using your global intelligence.

Complete EFIPS Cabinet Mapping:
- Cabinets 1 & 2: General Knowledge, Encyclopedias, Guinness Records, Programming.
- Cabinets 2 & 3: Psychology, Philosophy.
- Cabinets 3, 4 & 5: Social Sciences, Economics, Law, Politics.
- Cabinet 6: Translation, Dictionaries.
- Cabinets 6 & 7: Math, Chemistry, Physics, Biology, Geology, Animals.
- Cabinets 7-11: Engineering, Programming, Applications, Healthy Eating, Animal Husbandry, Home Economics.
- Cabinet 12: Arts, Drawing, Sports, Cinema, Music.
- Cabinets 13-19: English Literature & Novels (Adults & High School).
- Cabinets 20 & 21: Biographies, History, Geography.
- Cabinet 22: Disney Works.
- Cabinet 23: Animals.
- Cabinet 24: Physics, Anthropology, Earth/Space, Math.
- Cabinet 25: Social Sciences, Sports.
- Cabinet 26: Other Languages, Music, Tricks/Games, Magazines.
- Cabinets 27 & 28: Stories/Books for Grades 4-6.
- Cabinet 29: Youth Encyclopedias, Reading Class books.
- Cabinet 30: Stories/Books for Grades 7-9, Grammar books.
- Cabinet 31: Islamic Religion (Arabic).
- Cabinet 32: Literary Criticism, Arabic History/Biographies.
- Cabinet 33: Arts, Theater, Arabic Novels, Arabic Poetry.
- Cabinet 35: Stories for Grades 7-9, specific Islamic/Science books, Ajaj Magazine.
- Cabinet 36: Stories for Levels 4-6, Self-learning books.
- Cabinet 37: Books/Stories for Levels 1-3, Suitable Islamic stories.
- Cabinet 38: Kalima Publishing House, Science books.
- Cabinet 39: Arabic World Encyclopedia, Psychology, Education, Arabic Grammar.
- Cabinet 40: QR Code Audio Summaries.
- Cabinet 41: UAE National Identity, Rulers, and Heritage.

Search Protocol:
1. SCHOOL FIRST: Check local cabinets/Digital Library.
2. GLOBAL INTELLIGENCE: If not found, use your extensive AI knowledge to provide full summaries/answers from the Internet.
3. HYBRID: Always suggest a related cabinet even when answering from global knowledge.
Constraint: NO book counts. Librarian: Islam Soliman.
`;

const translations = {
  ar: {
    saqrWelcome: 'أهلاً بك! أنا صقر، دليلك الذكي في عالم المعرفة. اسألني عن أي كتاب أو موضوع وسأرشدك لمكانه في مكتبتنا أو ألخصه لك من معارفي ؟',
    inputPlaceholder: 'ابحث عن موضوع، مرحلة دراسية، أو رقم دولاب...',
    isTyping: 'صقر يحلل خريطة المعرفة...',
    error: 'عذراً، واجهت مشكلة في الاتصال. حاول مرة أخرى.',
    librarianStatus: 'مساعد مكتبة صقر الإمارات الذكي',
    you: 'أنت'
  },
  en: {
    saqrWelcome: "Welcome! I'm Saqr, your smart guide. Ask me about any book or topic, and I'll find it in our library or summarize it using my global knowledge!",
    inputPlaceholder: 'Search for a topic, grade level, or cabinet...',
    isTyping: 'Saqr is analyzing the knowledge map...',
    error: 'Sorry, connection error. Please try again.',
    librarianStatus: 'Saqr Smart School Librarian',
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
            { role: 'system', content: `You are Saqr at EFIPS. Professionally guide students to specific cabinets (1-41) and use your AI intelligence for external summaries. ${DIGITAL_COLLECTION_SUMMARY}` },
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
    <div dir={dir} className="max-w-6xl mx-auto px-2 sm:px-6 pt-4 md:pt-10 pb-20 animate-fade-up relative text-start antialiased font-black">
      
      <div 
        onMouseMove={handleMouseMove}
        className="flex flex-col h-[82vh] glass-panel rounded-[2.5rem] md:rounded-[4.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.12)] overflow-hidden border-none relative transition-all duration-500"
      >
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
                  <div className="h-1.5 w-1.5 bg-green-600 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

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
              {ripples.map(r => <span key={r.id} className="ripple-effect bg-white/30" style={{ left: r.x, top: r.y }} />)}
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
