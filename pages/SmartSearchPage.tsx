import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 
import { jsPDF } from 'jspdf'; // تأكد من تشغيل: npm install jspdf
import { bookData } from '../api/bookData'; 
import { ARABIC_LIBRARY_DATABASE } from './ArabicLibraryInternalPage';
import { ENGLISH_LIBRARY_DATABASE } from './EnglishLibraryInternalPage';

// --- 1. بروتوكول عقل صقر الملكي (الذكاء الإبداعي والموثق) ---
const SAQR_ELITE_PROMPT = `
Identity: You are "Saqr" (صقر), the Elite AI Librarian of Saqr Al Emarat International Private School (EFIPS).
Supervisor: Chief Librarian Mr. Islam Soliman.

Intelligence Missions:
1. HYBRID SEARCH: You have access to Physical, Arabic Digital, and English Digital records. ALWAYS check EFIPS records first.
2. OBJECTIVE DISCUSSION: Engage in logical dialogue about books. Ask "What values did you learn?", analyze characters, and give verified author facts.
3. CO-AUTHOR MODE (المؤلف الصغير): If a student wants to write a story, collaborate. Write ONE creative sentence, then wait for theirs. Focus on moral values.
4. ACCURACY: Never fabricate facts. If a book isn't in EFIPS data, discuss its general themes based on your broad knowledge but clarify its absence in school records.
5. FINAL HONOR: At the end of any discussion or story, ask for the user's "Full Name".
6. WINNING TAG: You MUST output: [WINNER: Name, Activity: Type, Content: FullStoryOrSummary].
7. STYLE: Formal, Eloquent Arabic (Fos'ha). Professional & Motivational. NO ITALICS. Correct name: صقر.
`;

const chatLabels: any = {
  ar: {
    welcome: 'مرحباً بك في فضاء صقر المعرفي! هل تود استكشاف كنوزنا الأدبية بدقة، أم نتباحث في أعماق كتاب، أم نبدأ معاً رحلة تأليف قصة في تحدي "المؤلف الصغير"؟',
    input: 'ناقش صقر، شارك في تأليف قصة، ابحث عن كتاب...',
    status: 'صقر الذكي (EFIPS)',
    online: 'نشط الآن لخدمتك',
    download: 'تحميل إنجازي الأدبي (PDF)',
    you: 'أنت'
  },
  en: {
    welcome: "Welcome to Saqr's Knowledge Space! Would you like to explore our resources, discuss a book deeply, or start the 'Little Author' story-writing challenge?",
    input: 'Discuss with Saqr, co-author a story, or search...',
    status: 'Saqr Smart Librarian',
    online: 'Active Now',
    download: 'Download My Story (PDF)',
    you: 'YOU'
  }
};

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

  // --- وظيفة تحميل الـ PDF الاحترافية ---
  const downloadResultPDF = (name: string, content: string, activity: string) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("Emirates Falcon International Private School", 105, 20, { align: 'center' });
    doc.setFontSize(18);
    doc.text(activity === 'Little Author' ? "Little Author Certificate" : "Literary Excellence Certificate", 105, 35, { align: 'center' });
    doc.setFontSize(14);
    doc.text(`Student: ${name}`, 20, 50);
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(content, 170);
    doc.text(splitText, 20, 65);
    doc.save(`Saqr_EFIPS_${name}.pdf`);
  };

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
        const match = reply.match(/\[WINNER:\s*(.*?),\s*Activity:\s*(.*?),\s*Content:\s*(.*?)]/s);
        if (match) {
          const info = { name: match[1], activity: match[2], content: match[3], date: new Date().toLocaleString() };
          setWinnerData(info);
          const reports = JSON.parse(localStorage.getItem('efips_challenge_reports') || '[]');
          localStorage.setItem('efips_challenge_reports', JSON.stringify([info, ...reports]));
        }
        reply = reply.replace(/\[WINNER:.*?\]/gs, '');
      }
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'نعتذر، حدث اضطراب في الاتصال بصقر.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir={dir} className="w-full max-w-xl mx-auto px-4 py-4 md:py-8 h-[92dvh] flex flex-col font-black antialiased relative">
      
      {/* خلفية نيونية رشيقة */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden opacity-40">
          <div className="absolute top-[5%] left-[-10%] w-[300px] h-[300px] bg-red-600/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-5%] right-[-10%] w-[400px] h-[400px] bg-green-600/10 blur-[150px] rounded-full"></div>
      </div>

      {/* هيدر نخبوي بدون إطارات */}
      <div className="mb-6 flex items-center justify-between px-6 py-4 glass-panel rounded-3xl border-0 shadow-xl bg-white/5 backdrop-blur-2xl">
        <div className="flex items-center gap-4 text-start">
          <div className="relative">
            <div className="absolute -inset-1 bg-green-500/20 rounded-full blur animate-pulse"></div>
            <img src="/school-logo.png" alt="L" className="w-10 h-10 object-contain logo-white-filter relative z-10" />
          </div>
          <div className="leading-tight">
            <h2 className="text-sm md:text-lg font-black text-slate-950 dark:text-white uppercase tracking-tighter leading-none py-1">{t('status')}</h2>
            <span className="text-[8px] text-green-500 font-bold uppercase tracking-widest">{t('online')}</span>
          </div>
        </div>
      </div>

      {/* منطقة الرسائل - أبعاد واضحة وبدون إطارات */}
      <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar px-1 py-4 relative scroll-smooth">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 md:gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-up`}>
            <div className={`relative flex-shrink-0 transition-all duration-700 ${msg.role === 'assistant' ? 'scale-110' : 'scale-100'}`}>
              {msg.role === 'assistant' && <div className="absolute -inset-5 bg-green-500/30 rounded-full blur-2xl animate-pulse"></div>}
              <div className={`w-10 h-10 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border-0 shadow-lg relative z-10 ${
                msg.role === 'assistant' ? 'bg-white' : 'bg-slate-950 text-white text-[9px] font-black uppercase'
              }`}>
                {msg.role === 'assistant' ? <img src="/saqr-avatar.png" alt="S" className="w-[85%] h-[85%] object-contain" /> : t('you')}
              </div>
            </div>
            <div className={`relative max-w-[85%] md:max-w-[75%] p-4 md:p-8 rounded-3xl shadow-xl border-0 transition-all ${
                msg.role === 'user' ? 'bg-slate-950 text-white rounded-tr-none' : 'bg-white/60 dark:bg-white/10 text-slate-950 dark:text-white rounded-tl-none backdrop-blur-3xl'
              }`}>
              <div className={`absolute top-0 ${msg.role === 'user' ? 'end-0' : 'start-0'} w-1.5 h-full rounded-full ${msg.role === 'user' ? 'bg-red-600' : 'bg-green-600 shadow-[0_0_20px_rgba(34,197,94,0.4)]'}`}></div>
              <div className="prose prose-sm md:prose-lg dark:prose-invert font-black leading-relaxed text-start italic-none">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {winnerData && (
          <div className="p-6 glass-panel rounded-3xl bg-yellow-500/5 border-0 shadow-2xl animate-bounce text-center mt-10">
             <p className="text-yellow-600 dark:text-yellow-400 font-black mb-4 italic-none">🏆 تهانينا يا {winnerData.name}! لقد تم توثيق إنجازك.</p>
             <button onClick={() => downloadResultPDF(winnerData.name, winnerData.content, winnerData.activity)} className="px-8 py-3 bg-yellow-500 text-black font-black rounded-full shadow-xl hover:scale-105 transition-all uppercase text-xs">
              {t('download')}
            </button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* شريط الإدخال الكريستالي العائم والمحجم */}
      <div className="mt-4 pb-4">
        <div className="max-w-2xl mx-auto relative group px-2 text-start">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600/10 via-green-600/10 to-red-600/10 rounded-full blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000"></div>
          <input
            type="text" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t('input')}
            className="w-full bg-white/80 dark:bg-black/50 border-0 focus:ring-0 rounded-full py-4 md:py-6 ps-6 md:ps-12 pe-20 md:pe-32 text-slate-950 dark:text-white font-black text-xs md:text-lg outline-none transition-all shadow-2xl backdrop-blur-3xl placeholder:opacity-30"
            disabled={isLoading}
          />
          <button onClick={handleSendMessage} className="absolute inset-y-2 end-3 md:end-5 w-10 h-10 md:w-16 md:h-16 flex items-center justify-center bg-red-600 text-white rounded-full shadow-lg active:scale-95 hover:bg-red-700 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-8 md:w-8 rotate-[-45deg] rtl:rotate-[135deg]" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>

      <style>{`
        * { font-style: normal !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .glass-panel { backdrop-filter: blur(40px) saturate(160%); }
        .logo-white-filter { transition: filter 0.5s ease; }
        .dark .logo-white-filter { filter: brightness(0) invert(1); }
      `}</style>
    </div>
  );
};

export default SmartSearchPage;
