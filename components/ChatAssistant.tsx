import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../App'; // استيراد اللغة للتحكم في اتجاه الشات

type Message = { role: 'user' | 'assistant'; content: string };

const ChatAssistant: React.FC = () => {
  const { locale, dir } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const SCHOOL_LOGO = "https://media.licdn.com/dms/image/v2/D4D0BAQH2J4sVBWyU9Q/company-logo_200_200/B4DZferhU8GgAI-/0/1751787640644/emirates_falcon_international_private_school_efips_logo?e=2147483647&v=beta&t=z8d76C6g0mI5SLMwFQS7TJ65jX8mN02QtIrFdJbxk8I";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    const q = input.trim();
    if (!q) return;

    const newMessages = [...messages, { role: 'user' as const, content: q }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          locale: locale // إرسال اللغة الحالية للسيرفر
        })
      });

      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: locale === 'ar' ? "عذراً، أواجه مشكلة في الاتصال الآن. حاول مرة أخرى." : "Sorry, I'm having trouble connecting right now." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir={dir} className="w-full max-w-4xl mx-auto flex flex-col h-[650px] bg-gray-50/50 dark:bg-gray-900/50 rounded-[2.5rem] p-2 sm:p-4 border border-gray-100 dark:border-gray-800 shadow-2xl backdrop-blur-sm">
      
      {/* منطقة عرض الرسائل */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-6 space-y-6 scrollbar-hide">
        {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in fade-in duration-700">
                <img src={SCHOOL_LOGO} alt="Logo" className="h-20 w-20 opacity-20 grayscale" />
                <p className="text-gray-400 font-bold text-sm">
                    {locale === 'ar' ? 'ابدأ المحادثة مع صقر المساعد الذكي' : 'Start chatting with Saqr AI'}
                </p>
            </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            
            {/* أيقونة صقر (شعار المدرسة) أو أيقونة المستخدم */}
            <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm border ${
                m.role === 'assistant' ? 'bg-white border-green-100' : 'bg-green-700 border-green-800'
            }`}>
                {m.role === 'assistant' ? (
                    <img src={SCHOOL_LOGO} alt="Saqr" className="w-7 h-7 object-contain" />
                ) : (
                    <span className="text-white text-xs font-bold">You</span>
                )}
            </div>

            {/* فقاعة الرسالة */}
            <div className={`max-w-[80%] px-5 py-3.5 rounded-3xl shadow-sm text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-green-700 text-white rounded-tr-none'
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-700'
            }`}>
              <div className="prose prose-sm dark:prose-invert break-words font-medium">
                 <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-9 h-9 rounded-full bg-white border border-green-100 flex items-center justify-center">
                <img src={SCHOOL_LOGO} alt="Thinking" className="w-6 h-6 object-contain opacity-50" />
            </div>
            <div className="bg-white dark:bg-gray-800 px-5 py-3 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-green-700 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-green-700 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-green-700 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* منطقة الإدخال المطورة */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-700 flex gap-2 items-center mx-2 mb-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          placeholder={locale === 'ar' ? "اسأل صقر عن الكتب..." : "Ask Saqr about books..."}
          className="flex-1 bg-transparent border-none px-4 py-2 focus:outline-none focus:ring-0 dark:text-white font-medium"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-green-700 hover:bg-green-800 text-white p-3 rounded-2xl disabled:opacity-30 transition-all active:scale-90 shadow-lg shadow-green-700/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rotate-[-45deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatAssistant;
