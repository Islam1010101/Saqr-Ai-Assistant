import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 

const translations = {
  ar: {
    pageTitle: 'اسأل صقر (البحث الذكي)',
    saqrWelcome: 'أهلاً بك! أنا صقر، مساعدك الذكي في المكتبة. كيف يمكنني خدمتك اليوم؟ يمكنك أن تطلب مني ترشيح كتاب، أو تسأل عن المكتبة.',
    inputPlaceholder: 'اكتب رسالتك هنا...',
    isTyping: 'صقر يفكر الآن...',
    error: 'عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى.',
  },
  en: {
    pageTitle: 'Ask Saqr (Smart Search)',
    saqrWelcome: "Hello! I'm Saqr, your smart library assistant. How can I help you today? You can ask me for book recommendations or ask about the library.",
    inputPlaceholder: 'Type your message here...',
    isTyping: 'Saqr is thinking...',
    error: 'Sorry, something went wrong. Please try again.',
  },
};

const SmartSearchPage: React.FC = () => {
  const { locale, dir } = useLanguage();
  const t = (key: keyof typeof translations.ar) => translations[locale][key];

  // الشعارات والهوية البصرية
  const SCHOOL_LOGO = "/school-logo.png"; 
  const SAQR_AVATAR = "/saqr-avatar.png"; 

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: t('saqrWelcome') },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ role: 'assistant', content: t('saqrWelcome') }]);
  }, [locale]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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
          messages: [...messages, userMessage],
          locale,
        }),
      });

      if (!response.ok) throw new Error('Bad response');

      const data = (await response.json()) as { reply?: string };
      const reply = data.reply || t('error');

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: t('error') }]);
    } finally {
      setIsLoading(true); 
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  return (
    /* الحاوية الرئيسية بنظام الزجاج المطور */
    <div dir={dir} className="flex flex-col h-[calc(100vh-12rem)] max-w-5xl mx-auto glass-panel rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/50 transition-all duration-500">
      
      {/* رأس الصفحة - إضافة الحركة الذكية للشعار */}
      <div className="p-6 border-b border-gray-100/20 dark:border-gray-800 bg-white/20 dark:bg-gray-800/30 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
            <img 
                src={SCHOOL_LOGO} 
                alt="School Logo" 
                className="w-10 h-10 object-contain rotate-6 logo-smart-hover transition-transform cursor-pointer" 
            />
            <div>
                <h1 className="text-xl font-black text-gray-900 dark:text-white leading-none tracking-tight">
                    {t('pageTitle')}
                </h1>
                <p className="text-xs text-green-700 dark:text-green-400 font-bold mt-1">AI Librarian</p>
            </div>
        </div>
      </div>

      {/* منطقة الرسائل - زجاجية وناعمة */}
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-6 scrollbar-hide bg-white/5 dark:bg-transparent">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-4 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            } animate-in fade-in slide-in-from-bottom-2 duration-500`}
          >
            {/* أفاتار المساعد أو المستخدم */}
            <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center shadow-lg border-2 overflow-hidden transition-transform hover:scale-110 ${
                msg.role === 'assistant' ? 'bg-white border-green-100/50' : 'bg-green-700 border-green-800 text-white font-bold text-[10px]'
            }`}>
              {msg.role === 'assistant' ? (
                <img src={SAQR_AVATAR} alt="Saqr" className="w-full h-full object-cover scale-110" />
              ) : (
                'YOU'
              )}
            </div>

            {/* فقاعات المحادثة الزجاجية */}
            <div
              className={`max-w-[80%] p-4 rounded-3xl shadow-md backdrop-blur-md border ${
                msg.role === 'user'
                  ? 'bg-green-700/90 text-white rounded-tr-none border-green-600'
                  : 'glass-panel text-gray-800 dark:text-gray-100 border-white/20 dark:border-gray-700 rounded-tl-none'
              }`}
            >
              <div className="prose prose-sm dark:prose-invert break-words font-medium leading-relaxed">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {/* مؤشر التحميل الزجاجي */}
        {isLoading && (
          <div className="flex items-center gap-4 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-white/80 border border-green-100 overflow-hidden flex items-center justify-center shadow-sm">
                <img src={SAQR_AVATAR} alt="Thinking" className="w-full h-full object-cover opacity-50 scale-110" />
            </div>
            <div className="p-4 rounded-3xl glass-panel border border-white/20 dark:border-gray-700">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 bg-green-700 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-green-700 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                    <div className="w-2.5 h-2.5 bg-green-700 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
                </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* منطقة الإدخال الزجاجية الملونة */}
      <div className="p-6 bg-white/20 dark:bg-gray-800/20 border-t border-white/10 dark:border-gray-700/50 backdrop-blur-xl">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t('inputPlaceholder')}
            className="w-full bg-white/40 dark:bg-gray-900/40 border-2 border-white/20 dark:border-gray-700 focus:border-green-600 dark:focus:border-green-500 rounded-2xl py-4 ps-6 pe-16 text-gray-800 dark:text-white font-bold text-lg outline-none transition-all shadow-inner placeholder-gray-500 dark:placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            /* استخدام اللون الأخضر للهوية مع تأثير زجاجي تفاعلي */
            className="absolute inset-y-2 end-2 w-12 flex items-center justify-center bg-green-700 text-white rounded-xl shadow-lg shadow-green-700/20 hover:bg-green-800 active:scale-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rotate-[-45deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartSearchPage;
