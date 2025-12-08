import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'; // ⚠️ تأكد من تثبيت هذه المكتبة: npm install react-markdown

type Message = { role: 'user' | 'assistant'; content: string };

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // مرجع لنهاية الشات للتمرير التلقائي
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // دالة التمرير للأسفل تلقائياً عند وصول رسالة جديدة
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    const q = input.trim();
    if (!q) return;

    // 1. إضافة رسالة المستخدم للشاشة فوراً
    const newMessages = [...messages, { role: 'user' as const, content: q }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // 2. إرسال المحادثة بالكامل للـ Backend (وهو سيتولى البحث والرد)
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages, // نرسل تاريخ المحادثة
          locale: 'en' // أو 'ar' لو عايز الرد بالعربي
        })
      });

      if (!res.ok) throw new Error('Network error');
      
      const data = await res.json();
      
      // 3. عرض رد الذكاء الاصطناعي
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-[600px]">
      {/* منطقة عرض الرسائل */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200 p-4 bg-white shadow-sm space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
              m.role === 'user'
                ? 'bg-[#002D62] text-white rounded-br-none'
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
            }`}>
              {/* استخدام ReactMarkdown لعرض النصوص العريضة والقوائم بشكل صحيح */}
              <div className="prose prose-sm prose-invert break-words">
                 <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-gray-50 text-gray-400 px-4 py-2 rounded-lg text-xs italic">
              Saqr is thinking...
            </div>
          </div>
        )}
        
        {/* عنصر مخفي للتمرير إليه */}
        <div ref={messagesEndRef} />
      </div>

      {/* منطقة الإدخال */}
      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          placeholder="Ask Saqr about books..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#002D62] transition-all shadow-sm"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-[#002D62] hover:bg-[#001f4d] text-white font-semibold rounded-lg px-6 py-2 disabled:opacity-50 transition-colors shadow-md">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatAssistant;
