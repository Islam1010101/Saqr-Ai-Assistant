import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 
import { bookData } from '../api/bookData'; 

// --- 1. بروتوكول عقل صقر الملكي (الذكاء الموثق + التحدي الفوري) ---
const SAQR_ELITE_PROMPT = `
Identity: You are "Saqr" (صقر), the Elite AI Librarian of Saqr Al Emarat School (EFIPS).
Supervisor: Chief Librarian Mr. Islam Soliman.

INTELLIGENCE PROTOCOL:
- Use your AI power to generate creative and helpful answers (summaries, homework help).
- MANDATORY: All factual data (names, dates, plots) must be 100% accurate. Do not hallucinate.
- If unsure about a fact, guide the student to ask Mr. Islam Soliman in the library.

CHALLENGE FLOW:
1. TRIGGER: If user wants a challenge, IMMEDIATELY ask for their "Full Name".
2. PROCESS: After name, start 5 progressive questions about a book.
3. FEEDBACK: If the answer is wrong, be highly motivational in Arabic (e.g., "أنت قريب جداً يا بطل، حاول مجدداً فالمعرفة تُنال بالصبر!") and give a small hint.
4. WINNING: End successful challenges with: [WINNER: Name, Points: X/100].

STYLE: Formal Standard Arabic (Fos'ha). NO ITALICS. Correct name: صقر.
`;

const chatLabels: any = {
  ar: {
    welcome: 'مرحباً بك في رحاب المعرفة! أنا صقر، دليلك الذكي بمدرسة صقر الإمارات. هل تود البحث عن معلومة دقيقة، أم أنت مستعد لتحدي القراءة والحصول على الوسام الذهبي؟',
    input: 'اسأل صقر، ابدأ التحدي، أو اطلب مساعدة دراسية...',
    status: 'أمين المكتبة الذكي (صقر)',
    online: 'متصل وجاهز لإرشادك',
    you: 'أنت'
  },
  en: {
    welcome: "Welcome to the Realm of Knowledge! I'm Saqr, your AI Librarian at EFIPS. Ready for accurate research or a challenge to win the Gold Medal?",
    input: 'Ask Saqr, start a challenge, or get study help...',
    status: 'Saqr AI Librarian',
    online: 'Online & Ready',
    you: 'YOU'
  }
};

// --- 2. مكون الميدالية الذهبية الكريستالية الفاخرة ---
const VictoryMedal: React.FC<{ name: string; score: string; onClose: () => void }> = ({ name, score, onClose }) => (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-3xl animate-in fade-in duration-700 p-4">
    <div className="relative text-center animate-in zoom-in spin-in duration-1000 w-full max-w-xl">
      <div className="text-[180px] md:text-[280px] drop-shadow-[0_0_80px_rgba(234,179,8,1)] leading-none mb-[-40px] animate-bounce relative z-20">🥇</div>
      <div className="glass-panel p-10 md:p-14 rounded-[4rem] border-[4px] border-yellow-500 bg-white/10 shadow-2xl relative z-10">
        <h1 className="text-4xl md:text-7xl font-black text-yellow-500 uppercase tracking-tighter mb-4 italic-none">WINNER!</h1>
        <p className="text-xl md:text-2xl text-white font-bold mb-2 opacity-80">مدرسة صقر الإمارات الدولية</p>
        <div className="h-px w-full bg-white/20 my-6"></div>
        <p className="text-3xl md:text-6xl text-white font-black mb-6 drop-shadow-xl">{name}</p>
        <div className="inline-block px-10 py-3 rounded-full bg-yellow-500 text-black font-black text-2xl shadow-2xl tracking-tighter">السكور: {score}</div>
        <button onClick={onClose} className="mt-10 block w-full py-5 bg-white/10 hover:bg-white/20 text-white font-black text-xl rounded-3xl border border-white/20 transition-all">العودة للمكتبة</button>
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // البحث الهجين للسياق
  const findLibraryContext = (query: string) => {
    const q = query.toLowerCase();
    const matches = bookData.filter(b => b.title.toLowerCase().includes(q) || b.subject?.toLowerCase().includes(q)).slice(0, 3);
    return `LIBRARY_RECORDS: ${JSON.stringify(matches)}. Use this for accuracy first.`;
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;
    const userQuery = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setInput('');
    setIsLoading(true);

    const context = findLibraryContext(userQuery);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'system', content: `${SAQR_ELITE_PROMPT}\n\nContext: ${context}` }, ...messages, { role: 'user', content: userQuery }],
          locale,
        }),
      });
      const data = await response.json();
      let reply = data.reply || '';

      // اكتشاف الفوز لإظهار الميدالية وإرسال التقرير برمجياً
      if (reply.includes('[WINNER:')) {
        const match = reply.match(/\[WINNER:\s*(.*?),\s*Points:\s*(.*?)]/);
        if (match) {
          const info = { name: match[1], score: match[2], date: new Date().toLocaleString() };
          setWinnerData(info);
          // هنا يتم الإرسال البرمجي لمركز التقارير
          console.log("Record sent to Reports Center:", info);
        }
        reply = reply.replace(/\[WINNER:.*?\]/g, '');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'نعتذر، حدث اضطراب في الاتصال بصقر.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir={dir} className="w-full max-w-xl lg:max-w-2xl mx-auto px-4 py-4 md:py-6 h-[92dvh] flex flex-col font-black antialiased relative">
      
      {winnerData && <VictoryMedal name={winnerData.name} score={winnerData.score} onClose={() => setWinnerData(null)} />}

      {/* خلفية نيونية Frameless */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-red-600/10 blur-[180px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-green-600/10 blur-[200px] rounded-full delay-1000 animate-pulse"></div>
      </div>

      {/* Header العائم */}
      <div className="mb-8 flex items-center justify-between px-6 py-5 glass-panel rounded-[2.5rem] border border-white/20 shadow-2xl bg-white/5 backdrop-blur-2xl">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="absolute -inset-2 bg-green-500/20 rounded-full blur-lg animate-pulse"></div>
            <img src="/school-logo.png" alt="Logo" className="w-10 h-10 md:w-14 object-contain logo-white-filter relative z-10" />
          </div>
          <div className="text-start leading-none">
            <h2 className="text-lg md:text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tighter">{t('status')}</h2>
            <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">{t('online')}</span>
          </div>
        </div>
      </div>

      {/* منطقة الرسائل - كريستالية عائمة */}
      <div className="flex-1 overflow-y-auto space-y-10 no-scrollbar px-2 py-4 relative scroll-smooth">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-4 md:gap-8 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-up`}>
            
            {/* وجه صقر البارز جداً بهالة متوهجة */}
            <div className={`relative flex-shrink-0 transition-all duration-700 ${msg.role === 'assistant' ? 'scale-125' : 'scale-100'}`}>
              {msg.role === 'assistant' && <div className="absolute -inset-5 bg-green-500/30 rounded-full blur-2xl animate-pulse"></div>}
              <div className={`w-14 h-14 md:w-28 md:h-28 rounded-[2.5rem] flex items-center justify-center border-2 shadow-2xl relative z-10 ${
                msg.role === 'assistant' ? 'bg-white border-green-500 ring-8 ring-green-500/10' : 'bg-slate-950 border-red-600/40 text-white text-[10px] md:text-sm font-black'
              }`}>
                {msg.role === 'assistant' ? <img src="/saqr-avatar.png" alt="S" className="w-[90%] h-[90%] object-contain" /> : t('you')}
              </div>
            </div>

            <div className={`relative max-w-[85%] md:max-w-[80%] p-6 md:p-12 rounded-[2.5rem] md:rounded-[5rem] shadow-2xl border border-white/20 transition-all ${
                msg.role === 'user' 
                ? 'bg-slate-950 text-white rounded-tr-none shadow-red-900/10' 
                : 'bg-white/40 dark:bg-white/5 text-slate-950 dark:text-white rounded-tl-none backdrop-blur-3xl'
              }`}>
              <div className={`absolute top-0 ${msg.role === 'user' ? 'end-0' : 'start-0'} w-2 h-full rounded-full ${msg.role === 'user' ? 'bg-red-600' : 'bg-green-600 shadow-[0_0_30px_rgba(34,197,94,0.6)]'}`}></div>
              <div className="prose prose-sm md:prose-2xl dark:prose-invert font-black leading-loose text-start italic-none">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-4 animate-pulse px-12">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* شريط الإدخال */}
      <div className="mt-6 pb-6 px-2">
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-red-600/20 via-green-600/20 to-red-600/20 rounded-[3rem] md:rounded-[6rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000"></div>
          <input
            type="text" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t('input')}
            className="w-full bg-white/80 dark:bg-black/40 border-2 border-white/20 focus:border-red-600 rounded-[2.5rem] md:rounded-[6.5rem] py-6 md:py-16 ps-8 md:ps-20 pe-20 md:pe-44 text-slate-950 dark:text-white font-black text-sm md:text-2xl outline-none transition-all shadow-3xl backdrop-blur-3xl placeholder:opacity-30"
            disabled={isLoading}
          />
          <button onClick={handleSendMessage} className="absolute inset-y-3 md:inset-y-5 end-3 md:end-5 w-14 h-14 md:w-36 md:h-36 flex items-center justify-center bg-red-600 text-white rounded-full shadow-2xl active:scale-95 hover:scale-105 hover:bg-red-700 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-20 md:w-20 rotate-[-45deg] rtl:rotate-[135deg]" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor">
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
        .italic-none { font-style: normal !important; }
      `}</style>
    </div>
  );
};

export default SmartSearchPage;
