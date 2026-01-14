import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 

// --- تحديث قاعدة المعرفة لتشمل الـ 41 كتاباً عربياً والـ 26 إنجليزياً ---
const DIGITAL_COLLECTION_SUMMARY = `
Arabic Digital Collection (41 Titles):
- Literature/Mystery: أجاثا كريستي، أحمد مراد (أرض الإله، الفيل الأزرق)، يوسف السباعي (أرض النفاق، نائب عزرائيل)، أحمد خالد توفيق (أكواريل، حكايات الغرفة 207، يوتوبيا).
- Classics: تشارلز ديكنز (7 روايات)، ويليام شيكسبير (ترويض النمرة، هملت، جعجعة بدون طحن).
- Series: رجل المستحيل (نبيل فاروق)، ما وراء الطبيعة (أحمد خالد توفيق)، الشياطين الـ13، الذين كانوا، خلف أسوار العقل.
- Islamic/Heritage: تفسير ابن كثير، أنبياء الله (أحمد بهجت)، قصص الحيوان في القرآن، شرح الأربعين النووية، صحيح البخاري ومسلم، ألف اختراع واختراع (التراث الإسلامي).
- Self-Development: أحمد الشقيري (أربعون)، إبراهيم الفقي، علي الوردي، الأب الغني والأب الفقير، الرقص مع الحياة، قوة الآن، كيف تكسب الأصدقاء.
- Children: المكتبة الخضراء، قصص الأنبياء للأطفال.

English Digital Collection (26 Titles):
- Drama/Mystery: Me Before You, The Great Gatsby, The Kite Runner, And Then There Were NONE, Tales of the Unexpected, Sherlock Holmes (Hound of the Baskervilles), The Girl on the Train, The Silent Patient.
- Stories/Philosophy: Leo Tolstoy, Anton Chekhov, Shirley Jackson, Roald Dahl, Edgar Allan Poe.
- Puzzles: Great Lateral Thinking Puzzles, Murdle, Sherlock Holmes Puzzle Collection, What is the Name of This Book.
- Fantasy: Full Harry Potter Series (7 Books) & Fantastic Beasts by J.K. Rowling.

INSTRUCTIONS for Saqr: 
1. You are the AI librarian for Emirates Falcon International Private School (EFIPS).
2. If a student asks about these books, tell them they are available to read NOW in the "Digital Library" (المكتبة الرقمية) section of our portal.
`;

const translations = {
  ar: {
    pageTitle: 'اسأل صقر (البحث الذكي)',
    saqrWelcome: 'أهلاً بك! أنا صقر، مساعدك الذكي. كيف يمكنني مساعدتك في استكشاف الـ 41 عنواناً عربياً والـ 26 عنواناً إنجليزياً في مكتبتنا الرقمية اليوم؟',
    inputPlaceholder: 'اسأل عن هاري بوتر، روايات أحمد خالد توفيق، أو الألغاز...',
    isTyping: 'صقر يستحضر الإجابة...',
    error: 'عذراً، حدث خطأ تقني. يرجى المحاولة مرة أخرى.',
    librarianStatus: 'أمين مكتبة مدرسة صقر الإمارات (AI)',
    you: 'أنت'
  },
  en: {
    pageTitle: 'Ask Saqr (Smart Search)',
    saqrWelcome: "Hello! I'm Saqr. I can help you find any of our 41 Arabic or 26 English digital titles. How can I assist you today?",
    inputPlaceholder: 'Ask about Harry Potter, Utopia, or Puzzles...',
    isTyping: 'Saqr is thinking...',
    error: 'Sorry, a technical error occurred. Please try again.',
    librarianStatus: 'Saqr School Librarian (AI)',
    you: 'YOU'
  },
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

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    (e.currentTarget as HTMLElement).style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    (e.currentTarget as HTMLElement).style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

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
    }, 350);
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
            { role: 'system', content: `You are Saqr, the AI for Emirates Falcon School. Be helpful and professional. Knowledge Base: ${DIGITAL_COLLECTION_SUMMARY}` },
            ...messages, 
            userMessage
          ],
          locale,
        }),
      });

      if (!response.ok) throw new Error('Bad response');

      const data = (await response.json()) as { reply?: string };
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || t('error') }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: t('error') }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir={dir} className="max-w-5xl mx-auto px-2 sm:px-4 animate-in fade-in duration-1000 pb-10 relative">
      
      <div 
        onMouseMove={handleMouseMove}
        className="flex flex-col h-[75vh] sm:h-[80vh] glass-panel glass-card-interactive rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl overflow-hidden border-green-600/20 relative"
      >
        {/* هيدر الدردشة الأخضر الملكي */}
        <div 
          onMouseDown={(e) => handleInteraction(e)}
          className="relative overflow-hidden p-6 sm:p-8 border-b border-green-600/10 bg-green-600/5 backdrop-blur-2xl flex items-center justify-between z-10"
        >
          {ripples.map(r => <span key={r.id} className="ripple-effect !border-green-600/30" style={{ left: r.x, top: r.y }} />)}
          <div className="flex items-center gap-4 sm:gap-5 relative z-10">
            <div className="relative">
                <img src={SCHOOL_LOGO} alt="Logo" className="w-12 h-12 sm:w-14 sm:h-14 object-contain rotate-12 logo-white-filter" />
                <span className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-green-600 border-2 border-white rounded-full animate-pulse"></span>
            </div>
            <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white tracking-tighter leading-none">{t('pageTitle')}</h1>
                <p className="text-[10px] sm:text-xs text-green-700 font-black mt-1 uppercase tracking-widest">{t('librarianStatus')}</p>
            </div>
          </div>
        </div>

        {/* منطقة الرسائل */}
        <div className="flex-1 p-4 sm:p-10 overflow-y-auto space-y-6 sm:space-y-8 scrollbar-hide bg-white/5 relative z-0">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 sm:gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-4 duration-700`}
            >
              <div 
                onMouseDown={(e) => handleInteraction(e)}
                className={`relative overflow-hidden w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex-shrink-0 flex items-center justify-center shadow-xl border-2 transition-transform active:scale-90 z-10 ${
                  msg.role === 'assistant' ? 'bg-white border-green-500/20' : 'bg-green-700 border-green-800 text-white font-black text-[10px]'
                }`}
              >
                {ripples.map(r => <span key={r.id} className="ripple-effect !border-white/30" style={{ left: r.x, top: r.y }} />)}
                {msg.role === 'assistant' ? (
                  <img src={SAQR_AVATAR} alt="Saqr" className="w-full h-full object-cover scale-110" />
                ) : (
                  t('you')
                )}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-lg backdrop-blur-xl border-2 z-10 ${
                  msg.role === 'user'
                    ? 'bg-green-700 text-white rounded-tr-none border-green-500'
                    : 'bg-white/90 dark:bg-gray-900/90 text-gray-950 dark:text-gray-100 rounded-tl-none border-white/40 dark:border-white/10'
                }`}
              >
                <div className="prose prose-sm sm:prose-lg dark:prose-invert break-words font-black leading-relaxed">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 sm:gap-5 animate-pulse">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/90 border-2 border-green-500/20 flex items-center justify-center shadow-lg">
                  <img src={SAQR_AVATAR} alt="Thinking" className="w-full h-full object-cover opacity-40 animate-pulse" />
              </div>
              <div className="p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] bg-green-600/5 border-2 border-green-600/10 flex gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* منطقة الإدخال الخضراء */}
        <div className="p-4 sm:p-8 bg-white/60 dark:bg-gray-950/60 border-t border-green-600/10 backdrop-blur-3xl relative z-10 text-start">
          <div 
            onMouseMove={handleMouseMove}
            className="relative group max-w-4xl mx-auto glass-card-interactive rounded-2xl sm:rounded-[2rem]"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('inputPlaceholder')}
              className="w-full bg-white/90 dark:bg-gray-900/80 border-2 border-transparent focus:border-green-600 rounded-2xl sm:rounded-[2rem] py-4 sm:py-6 ps-6 sm:ps-8 pe-16 sm:pe-24 text-gray-950 dark:text-white font-black text-base sm:text-xl outline-none transition-all shadow-xl placeholder-gray-400 relative z-10 shadow-inner"
              disabled={isLoading}
            />
            <button
              onClick={(e) => handleInteraction(e, handleSendMessage)}
              disabled={isLoading || !input.trim()}
              className="absolute inset-y-2 sm:inset-y-3 end-2 sm:end-3 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-green-700 text-white rounded-xl sm:rounded-2xl shadow-xl hover:bg-green-800 active:scale-90 transition-all disabled:opacity-30 overflow-hidden z-20"
            >
              {ripples.map(r => <span key={r.id} className="ripple-effect border-white/40" style={{ left: r.x, top: r.y }} />)}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 rotate-[-45deg] rtl:rotate-[135deg] relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartSearchPage;
