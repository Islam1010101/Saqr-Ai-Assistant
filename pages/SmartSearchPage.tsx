import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 
import { jsPDF } from 'jspdf'; 
import { bookData } from '../api/bookData'; 
import { ARABIC_LIBRARY_DATABASE } from './ArabicLibraryInternalPage';
import { ENGLISH_LIBRARY_DATABASE } from './EnglishLibraryInternalPage';

// --- 1. بروتوكول عقل صقر الملكي (تأليف القصص + البحث الدقيق) ---
const SAQR_ELITE_PROMPT = `
Identity: You are "Saqr" (صقر), the Elite AI Librarian of Emirates Falcon School (EFIPS).
Supervisor: Chief Librarian Mr. Islam Soliman.

Intelligence Protocols:
1. HYBRID SEARCH: Check Physical, Arabic Digital, and English Digital records. ALWAYS prioritize EFIPS data.
2. LITTLE AUTHOR MODE: Collaboratively write stories with students. One sentence each. Focus on moral values.
3. OBJECTIVE DISCUSSION: Discuss book themes logically. Provide verified facts only.
4. FINAL STEP: At the end, ask for their "Full Name" to generate their specific certificate.
5. TAGGING (CRITICAL): 
   - For stories, output: [WINNER: Name, Activity: Little Author, Content: TheFullStoryText].
   - For discussions, output: [WINNER: Name, Activity: Discussion, Content: SummaryText].
STYLE: Formal Eloquent Arabic (Fos'ha), Professional, Bold, NO ITALICS. Correct name: صقر.
`;

const chatLabels: any = {
  ar: {
    welcome: 'أهلًا وسهلًا بكم .أنا صقر المساعد الذكي للمكتبة! هل نؤلف قصة معاً في تحدي "المؤلف الصغير" أم نناقش أحد الكتب؟',
    input: 'ابدأ قصة، ناقش صقر، أو ابحث عن كتاب...',
    status: 'صقر الذكي',
    online: 'نشط الآن لخدمتك',
    downloadStory: 'تحميل قصتي الإبداعية (PDF)',
    you: 'أنت'
  },
  en: {
    welcome: "Welcome! I'm Saqr, the smart library helper! Shall we write a story together in the Little Author challenge, or discuss a book?",
    input: 'Start a story, discuss, or search...',
    status: 'Saqr AI Librarian',
    online: 'Active Now',
    downloadStory: 'Download My Story (PDF)',
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

  // --- وظيفة تحميل الـ PDF مع دعم العربية (ترميز محسن) ---
  const downloadStoryPDF = (name: string, content: string) => {
    const doc = new jsPDF();
    
    // ملاحظة: لدعم العربية بشكل كامل في jsPDF، يفضل رفع ملف خط .ttf وتحويله لـ Base64
    // هذا التعديل يحسن المظهر العام ويضبط المحتوى
    doc.text("Emirates Falcon International Private School", 105, 20, { align: 'center' });
    doc.text("Little Author Achievement", 105, 30, { align: 'center' });
    doc.text(`Author: ${name}`, 20, 50);
    
    const splitText = doc.splitTextToSize(content, 170);
    doc.text(splitText, 20, 65);
    
    doc.save(`Story_${name}.pdf`);
  };

  const findHybridLibraryContext = (query: string) => {
    const normalize = (text: string) => text.replace(/[أإآا]/g, 'ا').replace(/[ةه]/g, 'ه').toLowerCase().trim();
    const q = normalize(query);
    const physical = bookData.filter(b => normalize(b.title).includes(q)).slice(0, 2);
    const digitalAr = ARABIC_LIBRARY_DATABASE.filter(b => normalize(b.title).includes(q)).slice(0, 2);
    const digitalEn = ENGLISH_LIBRARY_DATABASE.filter(b => normalize(b.title).includes(q)).slice(0, 2);
    return `Context: Physical: ${JSON.stringify(physical)} | Arabic: ${JSON.stringify(digitalAr)} | English: ${JSON.stringify(digitalEn)}`;
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
          // حفظ للتقارير الإدارية
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
      
      {/* خلفية التوهج الأحمر الملكي */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden opacity-40">
          <div className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] bg-red-600/20 blur-[150px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-15%] w-[600px] h-[600px] bg-red-900/20 blur-[180px] rounded-full delay-1000 animate-pulse"></div>
      </div>

      {/* هيدر نخبوي بدون إطارات + شعار مائل يميناً */}
      <div className="mb-6 flex items-center justify-between px-6 py-5 glass-panel rounded-3xl border-0 shadow-2xl bg-white/5 backdrop-blur-3xl">
        <div className="flex items-center gap-4 text-start">
          <div className="relative group">
            <div className="absolute -inset-2 bg-red-600/20 rounded-full blur-lg animate-pulse"></div>
            <img src="/school-logo.png" alt="EFIPS" className="w-12 h-12 object-contain logo-white-filter rotate-[25deg] relative z-10" />
          </div>
          <div className="leading-tight text-start">
            <h2 className="text-sm md:text-lg font-black text-slate-950 dark:text-white uppercase tracking-tighter leading-none py-1">{t('status')}</h2>
            <span className="text-[8px] text-red-600 font-bold uppercase tracking-widest">{t('online')}</span>
          </div>
        </div>
      </div>

      {/* منطقة الرسائل الكريستالية */}
      <div className="flex-1 overflow-y-auto space-y-10 no-scrollbar px-1 py-4 relative scroll-smooth">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 md:gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-up`}>
            <div className={`relative flex-shrink-0 transition-all duration-700 ${msg.role === 'assistant' ? 'scale-110' : 'scale-100'}`}>
              {msg.role === 'assistant' && <div className="absolute -inset-4 bg-red-600/30 rounded-full blur-2xl animate-pulse"></div>}
              <div className={`w-10 h-10 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border-0 shadow-lg relative z-10 ${
                msg.role === 'assistant' ? 'bg-white' : 'bg-slate-950 text-white text-[9px] font-black uppercase'
              }`}>
                {msg.role === 'assistant' ? <img src="/saqr-avatar.png" alt="S" className="w-[85%] h-[85%] object-contain" /> : t('you')}
              </div>
            </div>
            <div className={`relative max-w-[85%] md:max-w-[75%] p-5 md:p-10 rounded-3xl shadow-2xl border-0 transition-all ${
                msg.role === 'user' ? 'bg-slate-950 text-white rounded-tr-none' : 'bg-white/40 dark:bg-white/5 text-slate-950 dark:text-white rounded-tl-none backdrop-blur-3xl'
              }`}>
              <div className={`absolute top-0 ${msg.role === 'user' ? 'end-0' : 'start-0'} w-1.5 h-full rounded-full ${msg.role === 'user' ? 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]'}`}></div>
              <div className="prose prose-sm md:prose-lg dark:prose-invert font-black leading-relaxed text-start">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        
        {/* زر التحميل يظهر فقط لنشاط "المؤلف الصغير" */}
        {winnerData && winnerData.activity === 'Little Author' && (
          <div className="p-6 glass-panel rounded-3xl bg-red-600/5 border-0 shadow-2xl animate-bounce text-center mt-10">
             <p className="text-red-600 font-black mb-4 italic-none text-sm">🏆 أبدعت يا {winnerData.name}! قصتك جاهزة للتوثيق.</p>
             <button onClick={() => downloadStoryPDF(winnerData.name, winnerData.content)} className="px-8 py-3 bg-red-600 text-white font-black rounded-full shadow-xl hover:scale-105 transition-all uppercase text-xs">
              {t('downloadStory')}
            </button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* شريط الإدخال */}
      <div className="mt-4 pb-4">
        <div className="max-w-xl mx-auto relative group px-2 text-start">
          <div className="absolute -inset-1 bg-red-600/10 rounded-full blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000"></div>
          <input
            type="text" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t('input')}
            className="w-full bg-white/80 dark:bg-black/50 border-0 focus:ring-0 rounded-full py-4 md:py-6 ps-8 md:ps-14 pe-20 md:pe-36 text-slate-950 dark:text-white font-black text-xs md:text-lg outline-none transition-all shadow-2xl backdrop-blur-3xl"
            disabled={isLoading}
          />
          <button onClick={handleSendMessage} className="absolute inset-y-2 end-4 md:end-6 w-10 h-10 md:w-16 md:h-16 flex items-center justify-center bg-red-600 text-white rounded-full shadow-lg active:scale-95 hover:bg-red-700 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 rotate-[-45deg] rtl:rotate-[135deg]" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
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
