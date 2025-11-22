import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';

const translations = {
  ar: {
    pageTitle: 'اسأل صقر',
    saqrWelcome:
      'أهلاً بك! أنا صقر، مساعدك الذكي في المكتبة. كيف يمكنني خدمتك اليوم؟ يمكنك أن تطلب مني ترشيح كتاب، أو تسأل عن المكتبة.',
    inputPlaceholder: 'اكتب رسالتك هنا...',
    isTyping: 'صقر يكتب...',
    error: 'عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى.',
  },
  en: {
    pageTitle: 'Ask Saqr',
    saqrWelcome:
      "Hello! I'm Saqr, your smart library assistant. How can I help you today? You can ask me for book recommendations or ask about the library.",
    inputPlaceholder: 'Type your message here...',
    isTyping: 'Saqr is typing...',
    error: 'Sorry, something went wrong. Please try again.',
  },
};

const SmartSearchPage: React.FC = () => {
  const { locale, dir } = useLanguage();
  const t = (key: keyof typeof translations.ar) => translations[locale][key];

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

      if (!response.ok) throw new Error('Bad response from server');

      const data = (await response.json()) as { reply?: string; error?: string };
      const reply = data.reply || t('error');

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      console.error('API call failed:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: t('error') }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
      <div className="p-4 border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-t-2xl">
        <h1 className="text-xl font-bold text-center text-gray-800 dark:text-gray-100">
          {t('pageTitle')}
        </h1>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-100 dark:bg-gray-800">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-uae-green flex-shrink-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                    <path d="M12.727,12.727c0,0-1.212-0.04-1.212-1.333c0-1.293,1.455-3.172,1.455-3.172s-0.081-0.971-1.01-0.971c-0.93,0-1.9,0.971-1.9,0.971s-1.212-0.93-2.141-0.93c-0.93,0-1.455,0.728-1.455,0.728S4.4,7.4,3.673,7.4c-0.728,0-1.212,0.526-1.212,0.526S1.613,7.48,1.048,7.48c-0.566,0-0.93,0.364-0.93,0.364s-0.525-0.283-0.848-0.283C-0.054,7.56,0,7.762,0,7.762S0,10.264,0,12.183c0,1.919,1.172,4.001,1.172,4.001s0.323,0.485,0.889,0.485c0.565,0,0.97-0.606,0.97-0.606s0.565,0.646,1.414,0.646c0.848,0,1.455-0.768,1.455-0.768s0.606,0.727,1.333,0.727c0.728,0,2.101-1.333,2.101-1.333s0.202,0.202,0.444,0.202c0.243,0,1.091-0.687,1.091-0.687s0.445,0.404,0.808,0.404c0.364,0,0.768-0.242,0.768-0.242s1.455,0.728,2.303,0.728c0.849,0,1.616-0.687,1.616-0.687s0.687,0.606,1.414,0.606c0.727,0,1.131-0.485,1.131-0.485s2.465-2.061,2.465-3.819S12.727,12.727,12.727,12.727z" />
                  </svg>
                </div>
              )}
              <div
                className={`max-w-[85%] p-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-br-none'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
              <div className="w-8 h-8 rounded-full bg-uae-green flex-shrink-0 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
              </div>
              <div className="max-w-[80%] p-3 rounded-2xl bg-white dark:bg-gray-800 rounded-bl-none">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 border-t bg-white dark:bg-gray-900 dark:border-gray-700 rounded-b-2xl">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t('inputPlaceholder')}
            className={`w-full border-2 border-gray-200 dark:border-gray-700 rounded-full py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-uae-green focus:border-transparent focus:outline-none transition ${
              dir === 'rtl' ? 'pl-12 pr-4' : 'pr-12 pl-4'
            }`}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading}
            className={`absolute inset-y-0 flex items-center justify-center h-full w-12 text-gray-500 hover:text-uae-green transition-colors disabled:text-gray-300 dark:disabled:text-gray-600 disabled:cursor-not-allowed ${
              dir === 'rtl' ? 'left-0' : 'right-0'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartSearchPage;
