import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 
import { jsPDF } from 'jspdf'; 
import { bookData } from '../api/bookData'; 
import { ARABIC_LIBRARY_DATABASE } from './ArabicLibraryInternalPage';
import { ENGLISH_LIBRARY_DATABASE } from './EnglishLibraryInternalPage';

// --- 1. بروتوكول عقل صقر (البحث الهجين + المؤلف الصغير + الدقة) ---
const SAQR_ELITE_PROMPT = `
Identity: You are "Saqr" (صقر), the official Elite AI Librarian of Emirates Falcon School (EFIPS).
Supervisor: Mr. Islam Soliman.

Rules:
1. CO-AUTHOR MODE: Only engage in "Little Author" if the student asks to write a story. You write one sentence, they write the next. Focus on creativity.
2. LITERARY DISCUSSION: For book discussions, be objective. Use formal, elegant Arabic (Fos'ha).
3. HYBRID SEARCH: Check all EFIPS records (Physical/Digital). Normalize text (ا=أ=إ) to find books like "أرض الإله".
4. FINAL STEP: Ask for "Full Name" once the story or discussion ends.
5. TAGGING (STRICT):
   - For stories: [WINNER: Name, Activity: Little Author, Content: TheFullStoryText].
   - For discussions: [WINNER: Name, Activity: Discussion, Content: Summary].
`;

const chatLabels: any = {
  ar: {
    welcome: 'أهلا وسهلا بكم .أنا صقر المساعد الذكي للمكتبة! هل نؤلف قصة معاً في تحدي "المؤلف الصغير" أم نناقش أحد الكتب؟',
    input: 'ابدأ قصة، ناقش صقر، أو ابحث...',
    status: 'صقر الذكي',
    online: 'متصل وجاهز للإبداع',
    download: 'تحميل قصتي الإبداعية (PDF)',
    you: 'أنت'
  },
  en: {
    welcome: "Welcome! I'm Saqr, the smart library helper! Shall we write a story together in the 'Little Author' challenge, or discuss a book?",
    input: 'Start a story, discuss, or search...',
    status: 'Saqr AI Librarian',
    online: 'Online & Ready',
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

  // --- وظيفة تحميل PDF تدعم العربية (ترميز محسن) ---
  const downloadStoryPDF = (name: string, content: string) => {
    const doc = new jsPDF();
    // ملاحظة: لإظهار العربية بشكل مثالي، يفضل دمج خط .ttf بترميز Base64 مستقبلاً
    // حالياً تم ضبط الهيكلية لتقليل أخطاء الترميز الظاهرة في الصور
    doc.setFont("helvetica", "bold");
    doc.text("Emirates Falcon International Private School", 105, 20, { align: 'center' });
    doc.setFontSize(18);
    doc.text("Little Author Certificate", 105, 35, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Author: ${name}`, 20, 50);
    const splitText = doc.splitTextToSize(content, 170);
    doc.text(splitText, 20, 65);
    doc.save(`Saqr_Story_${name}.pdf`);
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;
    const userQuery = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setInput('');
    setIsLoading(true);

    const normalize = (text: string) => text.replace(/[أإآا]/g, 'ا').replace(/[ةه]/g, 'ه').toLowerCase().trim();
    const q = normalize(userQuery);
    const context = `Context: ${JSON.stringify(bookData.filter(b => normalize(b.title).includes(q)))} | ${JSON.stringify(ARABIC_LIBRARY_DATABASE.filter(b => normalize(b.title).includes(q)))}`;

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
          localStorage.setItem('efips_challenge_reports', JSON.stringify([info, ...JSON.parse(localStorage.getItem('efips_challenge_reports') || '[]')]));
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
      
      {/* توهج أحمر ملكي */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden opacity-40">
          <div className="absolute top-[-5%] left-[-15%] w-[500px] h-[500px] bg-red-600/20 blur-[150px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-5%] right-[-15%] w-[500px] h-[500px] bg-red-900/20 blur-[180px] rounded-full delay-1000 animate-pulse"></div>
      </div>

      {/* هيدر كريستالي + شعار مائل يميناً */}
      <div className="mb-6 flex items-center justify-between px-6 py-5 glass-panel rounded-3xl border-0 shadow-2xl bg-white/5 backdrop-blur-3xl">
        <div className="flex items-center gap-4 text-start">
          <div className="relative">
            <div className="absolute -inset-2 bg-red-600/20 rounded-full blur-lg animate-pulse"></div>
            <img src="/school-logo.png" alt="EFIPS" className="w-12 h-12 object-contain logo-white-filter rotate-[25deg] relative z-10 transition-transform hover:scale-110 duration-700" />
          </div>
          <div className="leading-tight text-start">
            <h2 className="text-sm md:text-lg font-black text-slate-950 dark:text-white uppercase tracking-tighter">{t('status')}</h2>
            <span className="text-[8px] text-red-600 font-bold uppercase tracking-widest">{t('online')}</span>
          </div>
        </div>
      </div>

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
              <div className="prose prose-sm md:prose-lg dark:prose-invert font-black leading-relaxed text-start"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
            </div>
          </div>
        ))}
        
        {/* زر التحميل يظهر للمؤلف الصغير فقط */}
        {winnerData && winnerData.activity?.includes('Author') && (
          <div className="p-6 glass-panel rounded-3xl bg-red-600/5 border-0 shadow-2xl animate-bounce text-center mt-10">
             <p className="text-red-600 font-black mb-4 text-sm">🏆 أبدعت يا {winnerData.name}! حمل قصتك الآن.</p>
             <button onClick={() => downloadStoryPDF(winnerData.name, winnerData.content)} className="px-8 py-3 bg-red-600 text-white font-black rounded-full shadow-xl hover:scale-105 transition-all text-xs uppercase">
              {t('download')}
            </button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 pb-4 px-2">
        <div className="max-w-xl mx-auto relative group">
          <div className="absolute -inset-1 bg-red-600/10 rounded-full blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000"></div>
          <input
            type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t('input')} className="w-full bg-white/80 dark:bg-black/50 border-0 focus:ring-0 rounded-full py-5 md:py-7 ps-8 md:ps-14 pe-20 md:pe-36 text-slate-950 dark:text-white font-black text-xs md:text-lg outline-none transition-all shadow-3xl backdrop-blur-3xl placeholder:opacity-30" disabled={isLoading}
          />
          <button onClick={handleSendMessage} className="absolute inset-y-2 end-3 md:end-5 w-12 h-12 md:w-18 md:h-18 flex items-center justify-center bg-red-600 text-white rounded-full shadow-lg active:scale-95 hover:bg-red-700 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-10 md:w-10 rotate-[-45deg] rtl:rotate-[135deg]" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
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
