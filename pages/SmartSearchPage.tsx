import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 
import { jsPDF } from 'jspdf'; 
import html2canvas from 'html2canvas'; 
import { bookData } from '../api/bookData'; 
import { ARABIC_LIBRARY_DATABASE } from './ArabicLibraryInternalPage';
import { ENGLISH_LIBRARY_DATABASE } from './EnglishLibraryInternalPage';

// --- 1. بروتوكول عقل صقر (البلاغة، التنوع، والدقة اللغوية) ---
const SAQR_ELITE_PROMPT = `
Identity: You are "Saqr" (صقر), the official Elite AI Librarian of Emirates Falcon International Private School (EFIPS).
Supervisor: Mr. Islam Soliman.

Linguistic & Creative Rules:
1. LINGUISTIC PRECISION: You must use flawless Formal Arabic (Fos'ha). Ensure perfect grammar (Nahw) and correct voweling (Tashkeel) where necessary. Avoid any informal or weak phrasing.
2. STORY DIVERSITY: In "Little Author" mode, provide diverse story themes (Space exploration, Ancient Arab History, Moral Lessons, Future Innovation).
3. CO-AUTHOR MODE: Write ONE inspiring, grammatically perfect sentence, then wait for the student.
4. HYBRID SEARCH: Check all EFIPS records. Use normalization (ا=أ=إ) to find books.
5. TAGGING: For stories: [WINNER: Name, Activity: Little Author, Content: TheFullStoryText].
STYLE: Royal, Professional, Eloquent, NO ITALICS.
`;

const SmartSearchPage: React.FC = () => {
  const { locale, dir } = useLanguage();
  const t = (key: string) => chatLabels[locale][key];

  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', content: chatLabels[locale].welcome }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [winnerData, setWinnerData] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    const canvas = await html2canvas(certificateRef.current, { 
      scale: 3, 
      backgroundColor: '#000000',
      useCORS: true 
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.save(`EFIPS_Author_${winnerData.name}.pdf`);
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
          const info = { name: match[1], activity: match[2], content: match[3], date: new Date().toLocaleDateString('ar-EG') };
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
    <div dir={dir} className="w-full max-w-xl md:max-w-3xl lg:max-w-xl mx-auto px-4 py-4 md:py-8 h-[92dvh] flex flex-col font-black antialiased relative">
      
      {/* توهج ملكي بدون أطر */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute top-[-5%] left-[-20%] w-[500px] h-[500px] bg-red-600/30 blur-[150px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-5%] right-[-20%] w-[600px] h-[600px] bg-red-900/30 blur-[200px] rounded-full delay-1000 animate-pulse"></div>
      </div>

      {/* الهيدر: ذكاء الشعار (ملون في الفاتح، أبيض في الداكن) */}
      <div className="mb-6 flex items-center justify-between px-6 py-5 glass-panel rounded-3xl border-0 shadow-2xl bg-white/5 backdrop-blur-3xl">
        <div className="flex items-center gap-4 text-start">
          <div className="relative group">
            <div className="absolute -inset-2 bg-red-600/20 rounded-full blur-lg animate-pulse"></div>
            <img 
              src="/school-logo.png" 
              alt="EFIPS" 
              className="w-12 h-12 md:w-16 md:h-16 object-contain rotate-[30deg] relative z-10 transition-all duration-700 dark:brightness-0 dark:invert" 
            />
          </div>
          <div className="leading-tight text-start">
            <h2 className="text-sm md:text-xl font-black text-slate-950 dark:text-white uppercase tracking-tighter leading-none py-1">{t('status')}</h2>
            <span className="text-[8px] md:text-[10px] text-red-600 font-bold uppercase tracking-widest">{t('online')}</span>
          </div>
        </div>
      </div>

      {/* منطقة الرسائل: معالجة ذكية للأبعاد (الجوال والأيباد) */}
      <div className="flex-1 overflow-y-auto space-y-8 md:space-y-12 no-scrollbar px-1 py-4 relative scroll-smooth">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 md:gap-8 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-up`}>
            <div className={`relative flex-shrink-0 transition-all duration-700 ${msg.role === 'assistant' ? 'scale-110' : 'scale-100'}`}>
              <div className={`w-10 h-10 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border-0 shadow-lg relative z-10 ${
                msg.role === 'assistant' ? 'bg-white' : 'bg-slate-950 text-white text-[9px] md:text-xs font-black uppercase'
              }`}>
                {msg.role === 'assistant' ? <img src="/saqr-avatar.png" alt="S" className="w-[85%] h-[85%] object-contain" /> : t('you')}
              </div>
            </div>
            <div className={`relative max-w-[85%] md:max-w-[80%] p-5 md:p-10 rounded-[2.5rem] shadow-2xl border-0 transition-all ${
                msg.role === 'user' ? 'bg-slate-950 text-white rounded-tr-none' : 'bg-white/50 dark:bg-white/10 text-slate-950 dark:text-white rounded-tl-none backdrop-blur-3xl'
              }`}>
              <div className={`absolute top-0 ${msg.role === 'user' ? 'end-0' : 'start-0'} w-1.5 h-full rounded-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]`}></div>
              <div className="prose prose-sm md:prose-xl dark:prose-invert font-black leading-relaxed text-start italic-none">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        
        {/* منطقة التوثيق PDF (المؤلف الصغير) */}
        {winnerData && winnerData.activity?.includes('Author') && (
          <div className="mt-10 animate-bounce text-center px-4">
            <button onClick={handleDownloadPDF} className="w-full md:w-auto px-10 py-5 bg-red-600 text-white font-black rounded-full shadow-3xl hover:scale-105 transition-all text-sm md:text-lg uppercase tracking-widest">
              {t('download')}
            </button>
            <div className="fixed left-[-9999px] top-0">
                <div ref={certificateRef} className="w-[800px] p-20 bg-black text-white text-center font-black border-[15px] border-red-600 rounded-[5rem] relative overflow-hidden">
                    <img src="/school-logo.png" className="w-44 mx-auto mb-10 rotate-[15deg] brightness-0 invert" alt="Logo" />
                    <h1 className="text-7xl mb-4 text-red-600 uppercase tracking-tighter">Little Author</h1>
                    <p className="text-2xl opacity-60 mb-12 uppercase tracking-[0.3em]">Emirates Falcon International School</p>
                    <div className="h-1.5 w-full bg-red-600/40 mb-12"></div>
                    <p className="text-4xl mb-12 text-start leading-tight">يوثق "صقر" الإنجاز الأدبي للمبدع:</p>
                    <h2 className="text-6xl text-yellow-500 mb-16 underline decoration-red-600 underline-offset-8 italic-none">{winnerData.name}</h2>
                    <div className="bg-white/5 p-12 rounded-[4rem] text-3xl leading-loose text-start border-0 shadow-inner italic-none">
                        {winnerData.content}
                    </div>
                    <p className="mt-20 text-xl opacity-30 tracking-widest uppercase">Certified by Saqr AI Librarian - {winnerData.date}</p>
                </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* شريط الإدخال الكريستالي: بدون أطر */}
      <div className="mt-4 pb-6 px-2">
        <div className="max-w-xl md:max-w-2xl mx-auto relative group">
          <div className="absolute -inset-1 bg-red-600/20 rounded-full blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000"></div>
          <input
            type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t('input')}
            className="w-full bg-white/10 border-0 focus:ring-0 rounded-full py-6 md:py-10 ps-10 md:ps-16 pe-24 md:pe-40 text-slate-950 dark:text-white font-black text-sm md:text-2xl outline-none shadow-3xl backdrop-blur-3xl placeholder:opacity-30 transition-all"
            disabled={isLoading}
          />
          <button onClick={handleSendMessage} className="absolute inset-y-2 end-3 md:end-6 w-14 h-14 md:w-20 md:h-20 flex items-center justify-center bg-red-600 text-white rounded-full shadow-lg active:scale-95 hover:bg-red-700 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-12 md:w-12 rotate-[-45deg] rtl:rotate-[135deg]" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>

      <style>{`
        * { font-style: normal !important; border-width: 0 !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .glass-panel { backdrop-filter: blur(60px) saturate(200%); }
      `}</style>
    </div>
  );
};

export default SmartSearchPage;
