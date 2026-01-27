import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 
import { bookData } from '../api/bookData'; 

// --- 1. بروتوكول عقل صقر الملكي المطور (تحديات مزدوجة + لغة فصحى) ---
const SAQR_ELITE_PROMPT = `
Identity: You are "Saqr" (صقر), the official Elite AI Librarian of Saqr Al Emarat International Private School (EFIPS).
Chief Supervisor: Mr. Islam Soliman.

Intelligence Logic:
1. CHALLENGE TYPE A (Knowledge): If a student picked a book, ask 5 progressive questions (Plot -> Critical Thinking).
2. CHALLENGE TYPE B (Guessing): If a student wants a game, give clues about a book from EFIPS library, they must guess the title.
3. HYBRID SEARCH: Access Physical/Digital data context first before using AI knowledge.
4. WINNING: If they succeed, end with: [WINNER: Name, Score: Points/100].
5. STYLE: Formal Standard Arabic (Fos'ha), No Italics, Professional & Inspiring.
6. IDENTITY: Your name is صقر. Always use this spelling.
`;

const chatLabels: any = {
  ar: {
    welcome: 'مرحباً بك في رحاب المعرفة! أنا صقر، دليلك الذكي. هل تود البحث عن كتاب، أم أنت مستعد لتحدي القراءة أو لعبة تخمين الكتب والحصول على الوسام الذهبي؟',
    input: 'اسأل، ابدأ تحدي المعرفة، أو اطلب لعبة التخمين...',
    status: 'أمين المكتبة الذكي (صقر)',
    online: 'متصل وجاهز لإرشادك',
    you: 'أنت',
    score: 'النقاط'
  },
  en: {
    welcome: "Welcome! I'm Saqr, your Elite AI Librarian. Would you like to search for a book, start a reading challenge, or play the guessing game to win the Gold Medal?",
    input: 'Search, start a challenge, or ask for the guessing game...',
    status: 'Saqr AI Librarian',
    online: 'Online & Ready',
    you: 'YOU',
    score: 'Score'
  }
};

// --- 2. مكون الميدالية الذهبية الكريستالية ---
const VictoryMedal: React.FC<{ name: string; score: string; onClose: () => void }> = ({ name, score, onClose }) => (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-3xl animate-in fade-in duration-700 p-4">
    <div className="relative text-center animate-in zoom-in spin-in duration-1000 max-w-lg w-full">
      <div className="text-[200px] md:text-[300px] drop-shadow-[0_0_80px_rgba(234,179,8,0.9)] leading-none mb-[-40px] animate-bounce relative z-20">🥇</div>
      <div className="glass-panel p-8 md:p-12 rounded-[4rem] border-[6px] border-yellow-500 bg-white/10 shadow-[0_0_150px_rgba(234,179,8,0.4)] relative z-10">
        <h1 className="text-5xl md:text-7xl font-black text-yellow-500 uppercase tracking-tighter mb-4">Winner!</h1>
        <p className="text-xl md:text-2xl text-white font-bold mb-2">مدرسة صقر الإمارات الدولية</p>
        <p className="text-lg text-yellow-400 font-black tracking-widest mb-6">بطل تحديات صقر</p>
        <div className="h-px w-full bg-white/20 mb-6"></div>
        <p className="text-3xl md:text-5xl text-white font-black mb-4">{name}</p>
        <div className="inline-block px-10 py-3 rounded-full bg-yellow-500 text-black font-black text-2xl shadow-xl">{score}</div>
        <button onClick={onClose} className="mt-10 block w-full py-4 bg-white/5 hover:bg-white/20 text-white font-black rounded-2xl border border-white/20 transition-all uppercase">متابعة</button>
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

    // سياق البحث الهجين
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
        const match = reply.match(/\[WINNER:\s*(.*?),\s*Score:\s*(.*?)\]/);
        if (match) setWinnerData({ name: match[1], score: match[2] });
        reply = reply.replace(/\[WINNER:.*?\]/g, '');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'حدث خطأ في النظام.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir={dir} className="w-full max-w-3xl mx-auto px-4 py-4 md:py-6 h-[92dvh] flex flex-col font-black antialiased relative">
      
      {winnerData && <VictoryMedal name={winnerData.name} score={winnerData.score} onClose={() => setWinnerData(null)} />}

      {/* خلفية فنية نيونية مكثفة */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-red-600/10 blur-[180px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-green-600/10 blur-[200px] rounded-full delay-1000 animate-pulse"></div>
      </div>

      {/* Header العائم بدون إطار */}
      <div className="mb-6 flex items-center justify-between px-6 py-4 glass-panel rounded-[2.5rem] border border-white/20 shadow-2xl bg-white/5 backdrop-blur-2xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-2 bg-green-500/20 rounded-full blur-lg animate-pulse"></div>
            <img src="/school-logo.png" alt="EFIPS" className="w-10 h-10 md:w-14 object-contain logo-white-filter relative z-10" />
          </div>
          <div className="text-start leading-none">
            <h2 className="text-base md:text-xl font-black text-slate-950 dark:text-white uppercase tracking-tighter">{t('status')}</h2>
            <span className="text-[9px] text-green-500 font-bold uppercase tracking-widest">{t('online')}</span>
          </div>
        </div>
      </div>

      {/* منطقة الرسائل - كريستالية مستقلة */}
      <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar px-2 py-4 relative scroll-smooth">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-4 md:gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-up`}>
            
            {/* وجه صقر - كبير وبارز */}
            <div className={`relative flex-shrink-0 transition-transform duration-500 ${msg.role === 'assistant' ? 'scale-125' : 'scale-100'}`}>
              {msg.role === 'assistant' && <div className="absolute -inset-2 bg-green-500/40 rounded-full blur-xl animate-pulse"></div>}
              <div className={`w-12 h-12 md:w-18 md:h-18 rounded-2xl md:rounded-[2rem] flex items-center justify-center border-2 shadow-2xl relative z-10 ${
                msg.role === 'assistant' ? 'bg-white border-green-500' : 'bg-slate-950 border-red-600/40 text-white text-[10px] md:text-xs font-black'
              }`}>
                {msg.role === 'assistant' ? <img src="/saqr-avatar.png" alt="S" className="w-[90%] h-[90%] object-contain" /> : t('you')}
              </div>
            </div>

            {/* فقاعة كريستالية */}
            <div className={`relative max-w-[85%] md:max-w-[80%] p-5 md:p-9 rounded-[2rem] md:rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20 transition-all ${
                msg.role === 'user' 
                ? 'bg-slate-950 text-white rounded-tr-none' 
                : 'bg-white/40 dark:bg-white/5 text-slate-950 dark:text-white rounded-tl-none backdrop-blur-3xl'
              }`}>
              <div className={`absolute top-0 ${msg.role === 'user' ? 'end-0' : 'start-0'} w-2 h-full rounded-full ${msg.role === 'user' ? 'bg-red-600' : 'bg-green-600 shadow-[0_0_30px_rgba(34,197,94,0.6)]'}`}></div>
              <div className="prose prose-sm md:prose-xl dark:prose-invert font-black leading-loose text-start">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-4 animate-pulse px-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* شريط الإدخال - عائم وكريستالي */}
      <div className="mt-4 pb-4 px-2">
        <div className="max-w-3xl mx-auto relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-red-600/20 via-green-600/20 to-red-600/20 rounded-[3rem] md:rounded-[6rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000"></div>
          <input
            type="text" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t('input')}
            className="w-full bg-white/80 dark:bg-black/40 border-2 border-white/20 focus:border-red-600 rounded-[2.5rem] md:rounded-[5rem] py-5 md:py-10 ps-8 md:ps-16 pe-20 md:pe-40 text-slate-950 dark:text-white font-black text-sm md:text-2xl outline-none transition-all shadow-[0_30px_60px_rgba(0,0,0,0.2)] backdrop-blur-3xl"
            disabled={isLoading}
          />
          <button onClick={handleSendMessage} className="absolute inset-y-2.5 md:inset-y-4 end-2.5 md:end-4 w-14 h-14 md:w-24 md:h-24 flex items-center justify-center bg-red-600 text-white rounded-full shadow-2xl active:scale-95 transition-all hover:bg-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-14 md:w-14 rotate-[-45deg] rtl:rotate-[135deg]" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor">
              <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        * { font-style: normal !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .glass-panel { backdrop-filter: blur(50px) saturate(180%); }
        .logo-white-filter { transition: filter 0.5s ease; }
        .dark .logo-white-filter { filter: brightness(0) invert(1); }
      `}</style>
    </div>
  );
};

export default SmartSearchPage;
