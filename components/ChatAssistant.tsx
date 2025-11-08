// /components/ChatAssistant.tsx
import React, { useState, useRef } from 'react';
import { useLanguage } from '../App'; // لو الـ useLanguage جوه App نفس الملف، سيبه كده
import type { ChatMessage } from '../types'; // { role: 'user' | 'assistant' | 'system'; content: string }

const ChatAssistant: React.FC = () => {
  const { locale, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        locale === 'ar'
          ? 'أهلاً! أنا صقر، مساعد مكتبة EFIPS. اسألني عن الكتب، مواقعها على الرفوف، أو رشّح لي كتاب يناسبك 📚'
          : 'Hi! I’m Saqr, EFIPS Library Assistant. Ask me about books, shelves/locations, or personalized recommendations 📚',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: 'user', content: text } as ChatMessage];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const system =
        'You are "Saqr", a bilingual (Arabic-first) library assistant for Emirates Falcon International Private School (EFIPS). ' +
        'Tasks: (1) answer about school/library, (2) help students pick suitable books by topic/level/interest, ' +
        '(3) summarize books briefly, (4) be formal and clear for parents/teachers when asked, ' +
        '(5) keep answers concise; Arabic by default unless user asks English. ' +
        'If user asks about shelves/rows, format like: "الموقع: خزانة X — رف Y — صف Z". ' +
        'If unsure, ask a short clarifying question.';

      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system,
          messages: next.map(m => ({ role: m.role, content: m.content })),
          model: 'llama-3.1-70b-versatile',
          temperature: 0.3,
          max_tokens: 500,
        }),
      });

      const data = await resp.json();
      const answer = data?.content || 'حصل خطأ في الطلب.';
      setMessages(m => [...m, { role: 'assistant', content: answer } as ChatMessage]);
    } catch (e: any) {
      setMessages(m => [
        ...m,
        { role: 'assistant', content: 'فيه مشكلة بالشبكة أو السيرفر. جرّب تاني بعد شوية.' } as ChatMessage,
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }), 0);
    }
  };

  const onEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="mx-auto max-w-3xl w-full">
      {/* هيدر بسيط داخل الكومبوننت */}
      <div className="flex items-center gap-3 mb-4">
        <img
          className="h-12 w-12 object-contain"
          src="https://media.licdn.com/dms/image/v2/D4D0BAQH2J4sVBWyU9Q/company-logo_200_200/B4DZferhU8GgAI-/0/1751787640644/emirates_falcon_international_private_school_efips_logo?e=2147483647&v=beta&t=z8d76C6g0mI5SLMwFQS7TJ65jX8mN02QtIrFdJbxk8I"
          alt="EFIPS"
        />
        <div>
          <div className="text-lg font-bold">Saqr — EFIPS Library Assistant</div>
          <div className="text-sm text-gray-500">{locale === 'ar' ? 'اسألني عن أي كتاب' : 'Ask me about any book'}</div>
        </div>
      </div>

      {/* منطقة الرسائل */}
      <div
        ref={listRef}
        className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 p-4 h-[56vh] overflow-y-auto mb-3"
      >
        {messages.map((m, i) => (
          <div key={i} className={`mb-3 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${
                m.role === 'user'
                  ? 'bg-uae-green text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-xs text-gray-500 animate-pulse">
            {locale === 'ar' ? 'صقر بيكتب…' : 'Saqr is typing…'}
          </div>
        )}
      </div>

      {/* الإدخال */}
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onEnter}
          placeholder={locale === 'ar' ? 'اكتب سؤالك…' : 'Type your question…'}
          className="flex-1 resize-none rounded-xl border border-gray-300 dark:border-gray-600 p-3 h-14 focus:outline-none focus:ring-2 focus:ring-uae-green/60 bg-white dark:bg-gray-900"
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="h-14 px-5 rounded-xl bg-uae-green text-white font-semibold disabled:opacity-60"
        >
          {locale === 'ar' ? 'إرسال' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatAssistant;
