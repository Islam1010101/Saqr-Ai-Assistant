import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 
import { bookData } from '../api/bookData'; 
// ملاحظة: تأكد من استيراد مصفوفات المكتبة الرقمية إذا كانت في ملفات منفصلة

// --- 1. بروتوكول عقل صقر الملكي المطور (تحديات فورية + طلب الاسم) ---
const SAQR_ELITE_PROMPT = `
Identity: You are "Saqr" (صقر), the Elite AI Librarian of Saqr Al Emarat International Private School (EFIPS).
Lead Librarian: Mr. Islam Soliman.

Logic Protocols:
1. CHALLENGE START: If the user says "I read a book" or "I want to challenge you", IMMEDIATELY reply in Formal Arabic asking for their Full Name to register for the Victory Medal.
2. CHALLENGE TYPES: 
   - A (Knowledge): Ask 5 progressive questions (Easy to Hard) about a specific book.
   - B (Guessing): Give clues about a book from EFIPS library for them to guess.
3. HYBRID SEARCH: You have access to Physical & Digital data. Check internal library records first.
4. WINNING: If they pass, end with: [WINNER: Name, Points: X/100, Game: Type].
5. STYLE: Modern Standard Arabic (Fos'ha). NO ITALICS. High-end Professionalism.
`;

const chatLabels: any = {
  ar: {
    welcome: 'مرحباً بك في رحاب المعرفة! أنا صقر، دليلك الذكي. هل تود البحث عن كتاب، أم أنت مستعد لتحدي القراءة أو التخمين والحصول على الميدالية الذهبية؟',
    input: 'اسأل صقر، ابدأ التحدي، أو اطلب مساعدة دراسية...',
    status: 'أمين المكتبة الذكي (صقر)',
    online: 'متصل وجاهز لإرشادك',
    reportsTitle: 'سجل المبدعين (نتائج التحدي)',
    you: 'أنت'
  },
  en: {
    welcome: "Welcome! I'm Saqr, your AI Librarian. Ready to find a book or start a challenge to win the Gold Medal?",
    input: 'Search, start a challenge, or get study help...',
    status: 'Saqr AI Librarian',
    online: 'Online & Ready',
    reportsTitle: 'Creators Registry (Results)',
    you: 'YOU'
  }
};

// --- 2. مكون الميدالية الذهبية الكريستالية العملاقة ---
const VictoryMedal: React.FC<{ data: any; onClose: () => void }> = ({ data, onClose }) => (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-3xl animate-in fade-in duration-700 p-4">
    <div className="relative text-center animate-in zoom-in spin-in duration-1000 w-full max-w-2xl">
      <div className="text-[220px] md:text-[380px] drop-shadow-[0_0_100px_rgba(234,179,8,1)] leading-none mb-[-60px] animate-bounce relative z-20">🥇</div>
      <div className="glass-panel p-10 md:p-16 rounded-[5rem] border-[5px] border-yellow-500 bg-white/10 shadow-[0_0_150px_rgba(234,179,8,0.4)] relative z-10">
        <h1 className="text-5xl md:text-8xl font-black text-yellow-500 tracking-tighter mb-4 uppercase">Winner!</h1>
        <p className="text-xl md:text-3xl text-white font-bold mb-2">مدرسة صقر الإمارات الدولية</p>
        <p className="text-lg md:text-2xl text-yellow-400 font-black mb-8 uppercase tracking-widest">بطل تحدي القارئ المبدع</p>
        <div className="h-1 w-full bg-white/20 my-6"></div>
        <p className="text-4xl md:text-7xl text-white font-black mb-8 drop-shadow-xl">{data.name}</p>
        <div className="inline-block px-12 py-4 rounded-full bg-yellow-500 text-black font-black text-3xl shadow-2xl">النقاط: {data.points}</div>
        <button onClick={onClose} className="mt-12 block w-full py-5 bg-white/5 hover:bg-white/15 text-white font-black text-xl rounded-3xl border border-white/20 transition-all uppercase">إغلاق</button>
      </div>
    </div>
  </div>
);

const SmartSearchPage: React.FC = () => {
  const { locale, dir } = useLanguage();
  const t = (key: string) => chatLabels[locale][key];

  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', content: chatLabels[locale].welcome }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [winnerData, setWinnerData] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;
    const userQuery = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setInput('');
    setIsLoading(true);

    // البحث الهجين للسياق
    const context = `Library Context: ${JSON.stringify(bookData.filter(b => b.title.includes(userQuery)).slice(0, 2))}`;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'system', content: `${SAQR_ELITE_PROMPT}\n\n${context}` }, ...messages, { role: 'user', content: userQuery }],
          locale,
        }),
      });
      const data = await response.json();
      let reply = data.reply || '';

      if (reply.includes('[WINNER:')) {
        const match = reply.match(/\[WINNER:\s*(.*?),\s*Points:\s*(.*?)]/);
        if (match) {
          const info = { name: match[1], points: match[2], date: new Date().toLocaleTimeString() };
          setWinnerData(info);
          setReports(prev => [info, ...prev]);
        }
        reply = reply.replace(/\[WINNER:.*?\]/g, '');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'حدث خطأ في مزامنة صقر.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir={dir} className="w-full max-w-3xl mx-auto px-4 py-4 md:py-6 h-[92dvh] flex flex-col font-black antialiased relative">
      
      {winnerData && <VictoryMedal data={winnerData} onClose={() => setWinnerData(null)} />}

      {/* خلفية فنية نيونية Frameless */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[15%] left-[-10%] w-[500px] h-[500px] bg-red-600/10 blur-[180px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-green-600/10 blur-[200px] rounded-full delay-1000 animate-pulse"></div>
      </div>

      {/* الهيدر العائم */}
      <div className="mb-6 flex items-center justify-between px-6 py-5 glass-panel rounded-[3rem] border border-white/20 shadow-2xl bg-white/5 backdrop-blur-2xl">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="absolute -inset-2 bg-green-500/20 rounded-full blur-lg animate-pulse"></div>
            <img src="/school-logo.png" alt="EFIPS" className="w-12 h-12 md:w-16 object-contain logo-white-filter relative z-10" />
          </div>
          <div className="text-start leading-none">
            <h2 className="text-lg md:text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tighter">{t('status')}</h2>
            <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">{t('online')}</span>
          </div>
        </div>
      </div>

      {/* منطقة الرسائل - قطع كريستالية مستقلة */}
      <div className="flex-1 overflow-y-auto space-y-10 no-scrollbar px-2 py-6 relative scroll-smooth">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-4 md:gap-8 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-up`}>
            
            {/* وجه صقر المتوهج */}
            <div className={`relative flex-shrink-0 transition-all duration-700 ${msg.role === 'assistant' ? 'scale-125' : 'scale-100'}`}>
              {msg.role === 'assistant' && <div className="absolute -inset-3 bg-green-500/30 rounded-full blur-xl animate-pulse"></div>}
              <div className={`w-14 h-14 md:w-22 md:h-22 rounded-[2.2rem] flex items-center justify-center border-2 shadow-2xl relative z-10 ${
                msg.role === 'assistant' ? 'bg-white border-green-500 ring-4 ring-green-500/10' : 'bg-slate-950 border-red-600/40 text-white text-[10px] md:text-sm font-black uppercase'
              }`}>
                {msg.role === 'assistant' ? <img src="/saqr-avatar.png" alt="S" className="w-[90%] h-[90%] object-contain" /> : t('you')}
              </div>
            </div>

            {/* الفقاعة الكريستالية */}
            <div className={`relative max-w-[85%] md:max-w-[78%] p-6 md:p-11 rounded-[2.5rem] md:rounded-[4.5rem] shadow-2xl border border-white/20 transition-all ${
                msg.role === 'user' ? 'bg-slate-950 text-white rounded-tr-none' : 'bg-white/40 dark:bg-white/5 text-slate-950 dark:text-white rounded-tl-none backdrop-blur-3xl'
              }`}>
              <div className={`absolute top-0 ${msg.role === 'user' ? 'end-0' : 'start-0'} w-2 h-full rounded-full ${msg.role === 'user' ? 'bg-red-600' : 'bg-green-600 shadow-[0_0_30px_rgba(34,197,94,0.6)]'}`}></div>
              <div className="prose prose-sm md:prose-xl dark:prose-invert font-black leading-loose text-start">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* شريط الإدخال العائم */}
      <div className="mt-4 pb-6 px-2">
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-red-600/20 via-green-600/20 to-red-600/20 rounded-[3rem] md:rounded-[6rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000"></div>
          <input
            type="text" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t('input')}
            className="w-full bg-white/85 dark:bg-black/40 border-2 border-white/20 focus:border-red-600 rounded-[2.5rem] md:rounded-[6rem] py-6 md:py-12 ps-8 md:ps-20 pe-20 md:pe-44 text-slate-950 dark:text-white font-black text-sm md:text-2xl outline-none transition-all shadow-3xl backdrop-blur-3xl"
            disabled={isLoading}
          />
          <button onClick={handleSendMessage} className="absolute inset-y-3 md:inset-y-5 end-3 md:end-5 w-14 h-14 md:w-28 md:h-28 flex items-center justify-center bg-red-600 text-white rounded-full shadow-2xl active:scale-95 hover:scale-105 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-16 md:w-16 rotate-[-45deg] rtl:rotate-[135deg]" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor">
              <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>

        {/* التقارير المصغرة */}
        {reports.length > 0 && (
          <div className="mt-8 glass-panel p-6 rounded-[2.5rem] border border-white/10 animate-fade-up max-h-40 overflow-y-auto no-scrollbar">
            <p className="text-green-500 text-[10px] font-black uppercase mb-3 tracking-widest">{t('reportsTitle')}</p>
            {reports.map((r, i) => (
              <div key={i} className="flex justify-between text-[11px] text-white/50 font-bold border-b border-white/5 py-2">
                <span>👤 {r.name}</span>
                <span className="text-yellow-500 font-black">🏆 {r.points}</span>
                <span className="text-[9px] opacity-40">{r.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        * { font-style: normal !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .glass-panel { backdrop-filter: blur(60px) saturate(180%); }
        .logo-white-filter { transition: filter 0.5s ease; }
        .dark .logo-white-filter { filter: brightness(0) invert(1); }
      `}</style>
    </div>
  );
};

export default SmartSearchPage;
