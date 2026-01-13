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

  const SCHOOL_LOGO = "/school-logo.png"; 

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
    <div dir={dir} className="flex flex-col h-[calc(100vh-12rem)] max-w-5xl mx-auto bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 dark:border-gray-800/50">
      
      {/* رأس الصفحة - إضافة الإمالة للشعار */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <img src={SCHOOL_LOGO} alt="Logo" className="w-10 h-10 object-contain rotate-6 transition-transform" />
            <div>
                <h1 className="text-xl font-black text-gray-900 dark:text-white leading-none">
                    {t('pageTitle')}
                </h1>
                <p className="text-xs text-green-700 font-bold mt-1">AI Assistant</p>
            </div>
        </div>
      </div>

      {/* منطقة الرسائل */}
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-6 scrollbar-hide">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-4 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            } animate-in fade-in slide-in-from-bottom-2`}
          >
            {/* أيقونة المساعد - إضافة الإمالة للشعار */}
            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center shadow-md border ${
                msg.role === 'assistant' ? 'bg-white border-green-50' : 'bg-green-700 border-green-800 text-white font-bold text-xs'
            }`}>
              {msg.role === 'assistant' ? (
                <img src={SCHOOL_LOGO} alt="Saqr" className="w-7 h-7 object-contain rotate-6" />
              ) : (
                'YOU'
              )}
            </div>

            <div
              className={`max-w-[80%] p-4 rounded-3xl shadow-sm ${
                msg.role === 'user'
                  ? 'bg-green-700 text-white rounded-tr-none'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-none'
              }`}
            >
              <div className="prose prose-sm dark:prose-invert break-words font-medium">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {/* مؤشر التحميل - إضافة الإمالة للشعار */}
        {isLoading && (
          <div className="flex items-center gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-white border border-green-100 flex items-center justify-center">
                <img src={SCHOOL_LOGO} alt="Thinking" className="w-6 h-6 object-contain opacity-40 rotate-6" />
            </div>
            <div className="p-4 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-green-700 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-700 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                    <div className="w-2 h-2 bg-green-700 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
                </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* منطقة الإدخال */}
      <div className="p-6 bg-white/80 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 backdrop-blur-md">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t('inputPlaceholder')}
            className="w-full bg-gray-50/50 dark:bg-gray-900/50 border-2 border-transparent focus:border-green-600 rounded-2xl py-4 ps-6 pe-16 text-gray-800 dark:text-white font-bold text-lg outline-none transition-all shadow-inner"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
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
