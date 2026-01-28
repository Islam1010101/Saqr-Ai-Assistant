import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 
import { bookData } from '../api/bookData'; 
import { ARABIC_LIBRARY_DATABASE } from './ArabicLibraryInternalPage';
import { ENGLISH_LIBRARY_DATABASE } from './EnglishLibraryInternalPage';

// --- 1. بروتوكول عقل صقر الملكي (النقاش الموضوعي والدقة) ---
const SAQR_ELITE_PROMPT = `
Identity: You are "Saqr" (صقر), the official AI Librarian of Saqr Al Emarat School (EFIPS). 
Supervisor: Mr. Islam Soliman.

STRICT PROTOCOLS:
1. HYBRID SEARCH: Check Physical, Arabic Digital, and English Digital collections simultaneously. Use internal context first.
2. OBJECTIVE DISCUSSION: Engage in a logical dialogue. Ask "What are your takeaways?", analyze character motives, and provide verified facts about authors.
3. ACCURACY: Your responses about book history and authors must be 100% correct. No hallucinations.
4. RECOMMENDATIONS: Suggest 2 relevant books from EFIPS library records during discussion.
5. FINAL STEP: At the end of a successful discussion, ask for the user's "Full Name" for the victory medal.
6. WINNING TAG: Output: [WINNER: Name, Score: Points/100, Discussion: BookTitle].
7. STYLE: Formal Arabic (Fos'ha), Professional, Bold, NO ITALICS.
`;

const chatLabels: any = {
  ar: {
    welcome: 'مرحباً بك! أنا صقر، دليلك المعرفي. هل نناقش فكر أحد الكتب اليوم، أم تود استكشاف مصادرنا بدقة؟',
    input: 'ناقش صقر، ابحث عن كتاب، اطلب اقتراحات...',
    status: 'صقر الذكي',
    online: 'نشط الآن',
    you: 'أنت'
  },
  en: {
    welcome: "Welcome! I'm Saqr, your AI Librarian. Shall we discuss a book today or explore our resources?",
    input: 'Discuss with Saqr, search, or get suggestions...',
    status: 'Saqr Librarian',
    online: 'Online',
    you: 'YOU'
  }
};

// --- مكون الميدالية الذهبية الكريستالية الفاخرة ---
const VictoryMedal: React.FC<{ data: any; onClose: () => void }> = ({ data, onClose }) => (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-3xl animate-in fade-in duration-700 p-4 text-center">
    <div className="relative animate-in zoom-in spin-in duration-1000 w-full max-w-lg">
      <div className="text-[150px] md:text-[250px] drop-shadow-[0_0_60px_rgba(234,179,8,1)] leading-none mb-[-30px] animate-bounce relative z-20">🥇</div>
      <div className="glass-panel p-8 md:p-12 rounded-[3.5rem] border-0 bg-white/10 shadow-2xl relative z-10">
        <h2 className="text-4xl md:text-6xl font-black text-yellow-500 tracking-tighter mb-2 uppercase">Excellent!</h2>
        <p className="text-lg md:text-xl text-white font-bold mb-4 opacity-80">مدرسة صقر الإمارات الدولية</p>
        <div className="h-px w-full bg-white/20 my-4"></div>
        <p className="text-2xl md:text-4xl text-white font-black mb-6 drop-shadow-lg">{data.name}</p>
        <div className="inline-block px-8 py-3 rounded-full bg-yellow-500 text-black font-black text-xl shadow-xl">النقاط: {data.score}</div>
        <button onClick={onClose} className="mt-10 block w-full py-4 bg-white/10 hover:bg-white/20 text-white font-black rounded-2xl transition-all uppercase">متابعة</button>
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

  const findHybridLibraryContext = (query: string) => {
    const normalize = (text: string) => text.replace(/[أإآا]/g, 'ا').replace(/[ةه]/g, 'ه').toLowerCase().trim();
    const q = normalize(query);
    const physical = bookData.filter(b => normalize(b.title).includes(q)).slice(0, 2);
    const digitalAr = ARABIC_LIBRARY_DATABASE.filter(b => normalize(b.title).includes(q)).slice(0, 2);
    const digitalEn = ENGLISH_LIBRARY_DATABASE.filter(b => normalize(b.title).includes(q)).slice(0, 2);
    return `Context: Physical: ${JSON.stringify(physical)} | DigitalAr: ${JSON.stringify(digitalAr)} | DigitalEn: ${JSON.stringify(digitalEn)}`;
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;
    const userQuery = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setInput('');
    setIsLoading(true);

    const context = findHybridLibraryContext(userQuery);

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
        const match = reply.match(/\[WINNER:\s*(.*?),\s*Score:\s*(.*?),\s*Discussion:\s*(.*?)]/);
        if (match) {
          const info = { name: match[1], score: match[2], book: match[3], date: new Date().toLocaleString() };
          setWinnerData(info);
          const currentReports = JSON.parse(localStorage.getItem('efips_challenge_reports') || '[]');
          localStorage.setItem('efips_challenge_reports', JSON.stringify([info, ...currentReports]));
        }
        reply = reply.replace(/\[WINNER:.*?\]/g, '');
      }
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'حدث خطأ في الاتصال بصقر.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir={dir} className="w-full max-w-4xl mx-auto px-4 py-4 md:py-8 h-[92dvh] flex flex-col font-black antialiased relative">
      
      {winnerData && <VictoryMedal data={winnerData} onClose={() => setWinnerData(null)} />}

      {/* خلفية نيونية رشيقة */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden opacity-50">
          <div className="absolute top-[10%] left-[-10%] w-[300px] h-[300px] bg-red-600/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-green-600/10 blur-[150px] rounded-full"></div>
      </div>

      {/* هيدر مصغر وأنيق */}
      <div className="mb-6 flex items-center justify-between px-6 py-4 glass-panel rounded-3xl border-0 shadow-xl bg-white/5 backdrop-blur-2xl">
        <div className="flex items-center gap-4 text-start">
          <div className="relative">
            <div className="absolute -inset-1 bg-green-500/20 rounded-full blur animate-pulse"></div>
            <img src="/school-logo.png" alt="L" className="w-10 h-10 object-contain logo-white-filter relative z-10" />
          </div>
          <div className="leading-tight">
            <h2 className="text-sm md:text-lg font-black text-slate-950 dark:text-white uppercase tracking-tighter">{t('status')}</h2>
            <span className="text-[8px] text-green-500 font-bold uppercase tracking-widest">{t('online')}</span>
          </div>
        </div>
      </div>

      {/* منطقة الرسائل - أبعاد واضحة وخطوط متوازنة */}
      <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar px-1 py-4 relative scroll-smooth">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 md:gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-up`}>
            <div className={`relative flex-shrink-0 transition-all duration-700 ${msg.role === 'assistant' ? 'scale-110' : 'scale-100'}`}>
              <div className={`w-10 h-10 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border-0 shadow-lg relative z-10 ${
                msg.role === 'assistant' ? 'bg-white' : 'bg-slate-950 text-white text-[9px] font-black'
              }`}>
                {msg.role === 'assistant' ? <img src="/saqr-avatar.png" alt="S" className="w-[85%] h-[85%] object-contain" /> : t('you')}
              </div>
            </div>
            <div className={`relative max-w-[85%] md:max-w-[70%] p-4 md:p-8 rounded-3xl shadow-xl border-0 transition-all ${
                msg.role === 'user' ? 'bg-slate-950 text-white rounded-tr-none' : 'bg-white/60 dark:bg-white/10 text-slate-950 dark:text-white rounded-tl-none backdrop-blur-3xl'
              }`}>
              <div className="prose prose-sm md:prose-lg dark:prose-invert font-black leading-relaxed text-start font-fosha">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* شريط إدخال مصغر وأنيق جداً */}
      <div className="mt-4 pb-4">
        <div className="max-w-2xl mx-auto relative group px-2">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600/10 via-green-600/10 to-red-600/10 rounded-full blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000"></div>
          <input
            type="text" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t('input')}
            className="w-full bg-white/80 dark:bg-black/50 border-0 focus:ring-0 rounded-full py-4 md:py-6 ps-6 md:ps-12 pe-20 md:pe-32 text-slate-950 dark:text-white font-black text-xs md:text-lg outline-none transition-all shadow-2xl backdrop-blur-3xl"
            disabled={isLoading}
          />
          <button onClick={handleSendMessage} className="absolute inset-y-2 end-4 md:end-6 w-10 h-10 md:w-16 md:h-16 flex items-center justify-center bg-red-600 text-white rounded-full shadow-lg active:scale-95 hover:bg-red-700 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-8 md:w-8 rotate-[-45deg] rtl:rotate-[135deg]" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>

      <style>{`
        * { font-style: normal !important; }
        .font-fosha { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .glass-panel { backdrop-filter: blur(40px) saturate(160%); }
        .logo-white-filter { transition: filter 0.5s ease; }
        .dark .logo-white-filter { filter: brightness(0) invert(1); }
      `}</style>
    </div>
  );
};

export default SmartSearchPage;
