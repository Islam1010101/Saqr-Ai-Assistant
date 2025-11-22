// components/ChatAssistant.tsx
import React, { useState, useRef } from 'react';
import { findInCatalog } from '../data/bookData';

type Message = { role: 'user'|'assistant'; content: string };

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const add = (m: Message) => {
    setMessages(prev => [...prev, m]);
    queueMicrotask(() => listRef.current?.scrollTo({ top: 1e9, behavior: 'smooth' }));
  };

  const askAI = async (prompt: string, notFoundNote?: string) => {
    // ⚠️ غيّر مسار الـ API لو مختلف عندك
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({
        // بنزود تعليمات عشان يذكر إن الكتاب مش متاح في حالة الـ fallback
        system: notFoundNote
          ? `You are the EFIPS Library assistant. If the requested book is not in the local catalog, clearly say: "${notFoundNote}" before answering generally.`
          : `You are the EFIPS Library assistant.`,
        prompt
      })
    });
    if (!res.ok) throw new Error('AI request failed');
    const data = await res.json();
    return (data.reply ?? '').toString();
  };

  const handleSend = async () => {
    const q = input.trim();
    if (!q) return;
    add({ role:'user', content: q });
    setInput('');
    setLoading(true);

    try {
      // 1) دوري الأول: الكاتالوج
      const match = findInCatalog(q);

      if (match.found) {
        const b = match.book;
        const reply = [
          `📚 **From EFIPS Catalog**`,
          `**Title:** ${b.title}`,
          `**Author:** ${b.author}`,
          `**Location:** Shelf ${b.shelf} · Row ${b.row}`,
          b.subjects?.length ? `**Subjects:** ${b.subjects.join(', ')}` : '',
        ].filter(Boolean).join('\n');

        add({ role:'assistant', content: reply });
      } else {
        // 2) مش لاقي → نروح للذكاء وننبّه إنه مش متاح عندنا
        const note = 'This title is not available in our library catalog at the moment.';
        const ai = await askAI(q, note);
        add({ role:'assistant', content: ai || note });
      }
    } catch (e:any) {
      add({ role:'assistant', content: 'Something went wrong. Please try again.' });
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div ref={listRef} className="h-[480px] overflow-y-auto rounded border p-3 bg-white">
        {messages.map((m,i)=>(
          <div key={i} className={m.role==='user' ? 'text-right mb-3' : 'text-left mb-3'}>
            <div className={m.role==='user'
              ? 'inline-block bg-[#002D62] text-white px-3 py-2 rounded-lg'
              : 'inline-block bg-gray-100 text-gray-900 px-3 py-2 rounded-lg'}>
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          </div>
        ))}
        {loading && <div className="text-sm text-gray-500">…thinking</div>}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{ if(e.key==='Enter') handleSend(); }}
          placeholder="Ask Saqr…"
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-[#002D62] text-white rounded px-4 py-2 disabled:opacity-50">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatAssistant;
