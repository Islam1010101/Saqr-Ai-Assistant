import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 
import { bookData } from '../api/bookData'; 

// --- 1. بروتوكول عقل صقر الملكي المطور (تحدي 5 مراحل + نقاط) ---
const SAQR_ELITE_PROMPT = `
Identity: You are "Saqr" (صقر), the official Elite AI Librarian of Saqr Al Emarat International Private School (EFIPS).
Supervised by: Chief Librarian Mr. Islam Soliman.

Core Protocol:
1. CHALLENGE MODE: If a student says they finished a book, start the "Reader Challenge":
   - Ask exactly 5 questions.
   - Sequence: Q1 (Easy - Plot), Q2 (Medium - Characters), Q3 (Medium - Key Moment), Q4 (Hard - Theme), Q5 (Advanced - Critical Thinking).
   - Ask them one by one. Do not move to the next until they answer.
2. SCORING: Evaluate each answer. If they pass all 5, calculate a score out of 100.
3. WINNING: If score >= 80, end with: [WINNER: StudentName, Score: Points/100].
4. HYBRID SEARCH: Access Physical/Digital data. Always check internal context first.
5. STYLE: Formal Arabic (Fos'ha), Professional, Bold. Use "صقر" not "سقر". No Italics.
`;

const chatLabels: any = {
  ar: {
    welcome: 'مرحباً بك في مركز المعرفة! أنا صقر، أمين المكتبة الذكي. هل تود البحث عن كتاب، أم أنت جاهز لتحدي القراءة والحصول على الميدالية الذهبية؟',
    input: 'ابحث، اطلب مساعدة، أو ابدأ التحدي الآن...',
    status: 'أمين المكتبة الذكي (صقر)',
    online: 'متصل وجاهز لإرشادك',
    reportsTitle: 'سجل المبدعين (نتائج التحدي)',
    you: 'أنت'
  },
  en: {
    welcome: "Welcome to the Knowledge Center! I'm Saqr, your AI Librarian. Want to find a book or start the Reading Challenge to win the Gold Medal?",
    input: 'Search, get help, or start a challenge...',
    status: 'Saqr AI Librarian',
    online: 'Online & Ready',
    reportsTitle: 'Creators Registry (Results)',
    you: 'YOU'
  }
};

// --- 2. مكون الميدالية الذهبية الفاخرة بالنقاط ---
const VictoryMedal: React.FC<{ name: string; score: string; onClose: () => void }> = ({ name, score, onClose }) => (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-3xl animate-in fade-in duration-500 p-4">
    <div className="relative text-center animate-in zoom-in spin-in duration-1000">
      <div className="text-[200px] md:text-[350px] drop-shadow-[0_0_80px_rgba(234,179,8,0.9)] leading-none mb-4 animate-bounce">🥇</div>
      <div className="glass-panel p-8 md:p-16 rounded-[4rem] border-4 border-yellow-500 shadow-[0_0_150px_rgba(234,179,8,0.4)] bg-white/10 relative z-10 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-8xl font-black text-yellow-500 uppercase tracking-tighter mb-4">EXCELLENT!</h1>
        <p className="text-lg md:text-3xl text-white font-bold mb-2">مدرسة صقر الإمارات الدولية</p>
        <p className="text-2xl md:text-4xl text-yellow-400 font-black mb-6 uppercase tracking-widest italic-none">تحدي القارئ المبدع</p>
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-6"></div>
        <p className="text-3xl md:text-7xl text-white font-black mb-4">{name}</p>
        <div className="inline-block px-8 py-3 rounded-full bg-yellow-500 text-black font-black text-2xl md:text-4xl shadow-xl animate-pulse">
          {score}
        </div>
        <button onClick={onClose} className="mt-12 block w-full py-5 bg-white/10 hover:bg-white/20 text-white font-black text-xl rounded-2xl border border-white/20 transition-all uppercase">إغلاق</button>
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
  const [winnerData, setWinnerData] = useState<{ name: string; score: string } | null>(null);
  const [reports, setReports] = useState<{ name: string; score: string; date: string }[]>([]);
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

    // البحث الهجين (مبسط للسياق)
    const matches = bookData.filter(b => b.title.includes(userQuery)).slice(0, 2);
    const context = matches.length > 0 ? `Context: ${JSON.stringify(matches)}` : "No direct library match.";

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

      // اكتشاف الفوز (Tag Detection)
      if (reply.includes('[WINNER:')) {
        const match = reply.match(/\[WINNER:\s*(.*?),\s*Score:\s*(.*?)\]/);
        if (match) {
          const newWinner = { name: match[1], score: match[2] };
          setWinnerData(newWinner);
          setReports(prev => [{ ...newWinner, date: new Date().toLocaleTimeString() }, ...prev]);
        }
        reply = reply.replace(/\[WINNER:.*?\]/g, '');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'عذراً، حدث خطأ فني.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir={dir} className="max-w-3xl mx-auto px-4 py-4 md:py-8 h-[92dvh] flex flex-col font-black antialiased relative">
      
      {winnerData && <VictoryMedal name={winnerData.name} score={winnerData.score} onClose={() => setWinnerData(null)} />}

      {/* خلفية تفاعلية */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-red-600/10 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[10%] right-[10%] w-80 h-80 bg-green-600/10 blur-[150px] rounded-full delay-700 animate-pulse"></div>
      </div>

      <div className="flex flex-col flex-1 glass-panel rounded-[3rem] md:rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.4)] overflow-hidden border border-white/20 bg-white/10 dark:bg-slate-950/70 backdrop-blur-3xl relative">
        
        {/* Header - تم ضبط الحجم وإضافة هالة لصقر */}
        <div className="p-5 md:p-8 border-b border-white/10 bg-white/20 dark:bg-black/40 backdrop-blur-2xl flex items-center justify-between z-20">
          <div className="flex items-center gap-5">
            <div className="relative group">
                <div className="absolute -inset-2 bg-green-500/30 rounded-full blur-xl animate-pulse"></div>
                <img src="/school-logo.png" alt="EFIPS" className="w-12 h-12 md:w-20 object-contain logo-white-filter rotate-3 transition-transform group-hover:rotate-0 duration-700 relative z-10" />
            </div>
            <div className="text-start">
                <h2 className="text-lg md:text-3xl font-black text-slate-950 dark:text-white tracking-tighter uppercase leading-none">{t('status')}</h2>
                <p className="text-[10px] md:text-xs font-black text-green-600 mt-2 uppercase tracking-widest">{t('online')}</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 md:p-12 overflow-y-auto space-y-10 no-scrollbar relative z-10 scroll-smooth">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-4 md:gap-8 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-up`}>
              {/* Avatar صقر البارز */}
              <div className={`relative w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-[2.5rem] flex-shrink-0 flex items-center justify-center border-2 transition-all shadow-2xl ${
                  msg.role === 'assistant' 
                  ? 'bg-white border-green-500 ring-4 ring-green-500/20 scale-110' 
                  : 'bg-slate-950 border-red-600/40 text-white text-[10px] md:text-sm font-black uppercase'
                }`}>
                {msg.role === 'assistant' ? <img src="/saqr-avatar.png" alt="S" className="w-[90%] h-[90%] object-contain" /> : t('you')}
              </div>
              
              <div className={`relative max-w-[85%] md:max-w-[75%] p-5 md:p-10 rounded-[2rem] md:rounded-[4rem] shadow-2xl border border-white/10 ${
                  msg.role === 'user' ? 'bg-slate-950 text-white rounded-tr-none' : 'bg-white/60 dark:bg-slate-900/60 text-slate-950 dark:text-white rounded-tl-none backdrop-blur-2xl'
                }`}>
                <div className={`absolute top-0 ${msg.role === 'user' ? 'end-0' : 'start-0'} w-2 h-full rounded-full ${msg.role === 'user' ? 'bg-red-600' : 'bg-green-600 shadow-[0_0_25px_rgba(34,197,94,0.6)]'}`}></div>
                <div className="prose prose-sm md:prose-xl dark:prose-invert font-black leading-loose text-start italic-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 md:p-12 bg-transparent relative z-20">
          <div className="max-w-4xl mx-auto relative group">
            <input
              type="text" value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('input')}
              className="w-full bg-white/95 dark:bg-black/60 border-2 border-white/20 focus:border-red-600 rounded-[2.5rem] md:rounded-[5rem] py-5 md:py-10 ps-8 md:ps-16 pe-20 md:pe-40 text-slate-950 dark:text-white font-black text-sm md:text-2xl outline-none transition-all shadow-3xl backdrop-blur-3xl placeholder:opacity-30"
              disabled={isLoading}
            />
            <button onClick={handleSendMessage} className="absolute inset-y-2 md:inset-y-4 end-2 md:end-4 w-14 h-14 md:w-24 md:h-24 flex items-center justify-center bg-red-600 text-white rounded-[1.8rem] md:rounded-[3.5rem] shadow-2xl active:scale-95 hover:bg-red-700 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-14 md:w-14 rotate-[-45deg] rtl:rotate-[135deg]" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor">
                <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>

        {/* نظام التقارير المصغر (يظهر للمسؤول) */}
        {reports.length > 0 && (
          <div className="p-4 bg-black/20 border-t border-white/10 max-h-40 overflow-y-auto">
            <p className="text-green-500 text-[10px] font-black uppercase mb-2 tracking-widest">{t('reportsTitle')}</p>
            {reports.map((r, i) => (
              <div key={i} className="flex justify-between text-[10px] text-white/60 font-bold border-b border-white/5 py-1">
                <span>👤 {r.name}</span>
                <span className="text-yellow-500">🏆 {r.score}</span>
                <span>🕒 {r.date}</span>
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
        .italic-none { font-style: normal !important; }
      `}</style>
    </div>
  );
};

export default SmartSearchPage;
