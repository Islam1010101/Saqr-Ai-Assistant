import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 
import html2canvas from 'html2canvas'; 
import { bookData } from '../api/bookData'; 
import { ARABIC_LIBRARY_DATABASE } from './ArabicLibraryInternalPage';
import { ENGLISH_LIBRARY_DATABASE } from './EnglishLibraryInternalPage';

// --- 1. بروتوكول عقل صقر المطور (يحافظ على البحث + الهوية + التصحيح + جمع البيانات) ---
const SAQR_ELITE_PROMPT = `
Identity: You are "Saqr" (صقر), the official Elite AI Librarian of Emirates Falcon International Private School (EFIPS).
Supervisor: Mr. Islam Soliman.

Linguistic & Little Author Rules:
1. LINGUISTIC PRECISION & CORRECTION (CRITICAL): Use flawless Modern Standard Arabic (Fos'ha) or English. If the student makes a spelling or grammatical error, you MUST politely correct them and explain the correct word/rule before continuing.
2. LITTLE AUTHOR CHALLENGE (UAE THEMES): 
   - Start stories inspired by UAE National Identity (e.g., Pearl Diving, Mars Mission/Space, Falcons, Desert Heritage, Sheikh Zayed's Legacy).
   - Write one sentence, give a creative hint, then wait for the student.
   - When the student says the story is finished, DO NOT issue the certificate yet.
   - First, ask the student explicitly: "ما هو اسمك الكامل؟ وما هو مستواك الدراسي؟" (What is your full name and grade level?).
   - Provide a perfectly punctuated, grammatically flawless BRIEF CREATIVE SUMMARY of the story.
3. HYBRID SEARCH: You MUST first verify if the book exists in the "EFIPS Library Records" provided in the context.
4. TAGGING (CRITICAL): ONLY after receiving the student's name and grade, output this exact format at the end of your response:
   [WINNER: StudentName | Grade: StudentGrade | Activity: Little Author | Content: PerfectSummary]
STYLE: Professional, Bold, NO ITALICS. Correct name: صقر.
`;

const chatLabels: any = {
  ar: {
    welcome: 'أهلاً بك! أنا "صقر"، المساعد الذكي لمكتبة المدرسة. 🦅\nهل نؤلف قصة معاً اليوم من وحي هويتنا الإماراتية في تحدي "المؤلف الصغير"، أم تبحث عن كتاب محدد؟',
    input: 'ناقش صقر، شارك في تأليف قصة، أو ابحث عن كتاب...',
    status: 'صقر الذكي (EFIPS)',
    online: 'متصل وجاهز للإبداع',
    download: 'تحميل شهادة المؤلف الصغير (JPG)',
    you: 'أنت'
  },
  en: {
    welcome: "Welcome! I'm 'Saqr', your AI Librarian. 🦅\nShall we co-author a UAE-inspired story in the 'Little Author' challenge, or discuss a book?",
    input: 'Start a story, discuss, or search...',
    status: 'Saqr AI Librarian',
    online: 'Online & Ready',
    download: 'Download Certificate (JPG)',
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
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // دالة تحميل الشهادة بصيغة JPG عالية الدقة
  const handleDownloadJPG = async () => {
    if (!certificateRef.current) return;
    
    // إظهار الشهادة مؤقتاً لضمان التقاطها بخطوط عربية سليمة 100%
    certificateRef.current.style.left = '0';
    certificateRef.current.style.position = 'fixed';
    certificateRef.current.style.zIndex = '-9999';

    const canvas = await html2canvas(certificateRef.current, { 
      scale: 3, // دقة عالية جداً
      backgroundColor: '#ffffff', // خلفية بيضاء
      useCORS: true,
      windowWidth: 1123, // مقاس A4 بالعرض
      windowHeight: 794
    });

    // إخفاء الشهادة مرة أخرى
    certificateRef.current.style.left = '-9999px';

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `EFIPS_LittleAuthor_${winnerData.name.replace(/\s+/g, '_')}.jpg`;
    link.click();
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;
    const userQuery = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setInput('');
    setIsLoading(true);

    const normalize = (text: string) => 
      text?.toString()
          .replace(/[أإآا]/g, 'ا')
          .replace(/[ةه]/g, 'ه')
          .replace(/[ىي]/g, 'ي')
          .toLowerCase()
          .trim() || '';

    const qNormalized = normalize(userQuery);
    const stopWords = ['the', 'book', 'about', 'summary', 'tell', 'me', 'عن', 'كتاب', 'تلخيص', 'ملخص', 'انتهت', 'القصة'];
    const queryWords = qNormalized.split(/\s+/).filter(word => word.length > 2 && !stopWords.includes(word));

    const searchIn = (db: any[], location: string) => {
      return db.filter(b => {
        const title = normalize(b.title);
        const author = normalize(b.author || '');
        const subject = normalize(b.subject || b.category || '');
        return title.includes(qNormalized) || 
               author.includes(qNormalized) || 
               queryWords.some(word => title.includes(word) || author.includes(word) || subject.includes(word));
      }).map(b => ({ ...b, pageLocation: location }));
    };

    const foundBooks = [
      ...searchIn(bookData, "سجلات الكتب المطبوعة بالمكتبة (Physical Books)"),
      ...searchIn(ARABIC_LIBRARY_DATABASE, "المكتبة الإلكترونية العربية (Arabic Digital Library)"),
      ...searchIn(ENGLISH_LIBRARY_DATABASE, "المكتبة الإلكترونية الإنجليزية (English Digital Library)")
    ];

    let searchContext = "";
    if (foundBooks.length > 0) {
      searchContext = `EFIPS LIBRARY RECORDS FOUND: The following books exist in our records: ${JSON.stringify(foundBooks.slice(0, 15))}. 
      Your task: The student is asking about one of these books. Confirm that the book IS AVAILABLE, specify its location clearly (Physical Library or Digital), and THEN provide the information or summary the student requested based on your general knowledge of this existing book.`;
    } else {
      searchContext = `EFIPS LIBRARY RECORDS NOT FOUND: No books matching "${userQuery}" were found in our official physical or digital databases. 
      Your task: Inform the student politely that this specific title is not currently in our school records. You may then provide the summary/info they asked for from your general knowledge, but clearly state it is a general recommendation and not in the school library database.`;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: `${SAQR_ELITE_PROMPT}\n\n${searchContext}` }, 
            ...messages, 
            { role: 'user', content: userQuery }
          ],
          locale,
        }),
      });
      const data = await response.json();
      let reply = data.reply || '';

      // استخدام الفاصل | لضمان دقة التقاط البيانات حتى لو احتوى الملخص على فواصل
      if (reply.includes('[WINNER:')) {
        const match = reply.match(/\[WINNER:\s*(.*?)\s*\|\s*Grade:\s*(.*?)\s*\|\s*Activity:\s*(.*?)\s*\|\s*Content:\s*(.*?)\]/s);
        if (match) {
          // جلب التاريخ واليوم بناءً على لغة النظام
          const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
          const formattedDate = new Date().toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', dateOptions);

          const info = { name: match[1].trim(), grade: match[2].trim(), activity: match[3].trim(), content: match[4].trim(), date: formattedDate };
          setWinnerData(info);
          localStorage.setItem('efips_challenge_reports', JSON.stringify([info, ...JSON.parse(localStorage.getItem('efips_challenge_reports') || '[]')]));
        }
        reply = reply.replace(/\[WINNER:.*?\]/gs, '');
      }
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'نعتذر، حدث اضطراب في الاتصال بصقر. حاول مرة أخرى.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir={dir} className="w-full h-[100dvh] flex flex-col bg-slate-50 dark:bg-slate-900 font-sans relative overflow-hidden text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* خلفية ديناميكية هادئة وعصرية */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-40 dark:opacity-20">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-500/20 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* الهيدر العلوي */}
      <div className="w-full max-w-5xl mx-auto px-4 py-4 md:py-6 z-10 shrink-0">
        <div className="flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm">
          <div className="flex items-center gap-4 text-start">
            <div className="relative group">
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full z-20"></span>
              <img 
                src="https://www.efipslibrary.online/school-logo.png" 
                alt="EFIPS" 
                className="w-12 h-12 md:w-14 md:h-14 object-contain bg-white rounded-full p-1 shadow-sm transition-transform duration-500 hover:rotate-12" 
              />
            </div>
            <div className="leading-tight text-start">
              <h2 className="text-base md:text-xl font-bold uppercase tracking-wide text-slate-800 dark:text-white leading-none mb-1">{t('status')}</h2>
              <span className="text-[10px] md:text-xs text-green-600 dark:text-green-400 font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> {t('online')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* منطقة المحادثة */}
      <div className="flex-1 w-full max-w-5xl mx-auto overflow-y-auto px-4 pb-32 no-scrollbar scroll-smooth z-10">
        <div className="space-y-6 md:space-y-8 flex flex-col justify-end min-h-full">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-3 md:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in-up`}>
              
              {/* أيقونة المتحدث */}
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-sm overflow-hidden z-10">
                   <img src="/saqr-avatar.png" alt="S" className="w-7 h-7 md:w-8 md:h-8 object-contain" onError={(e) => e.currentTarget.src="https://www.efipslibrary.online/school-logo.png"} />
                </div>
              )}

              {/* فقاعة المحادثة */}
              <div className={`relative max-w-[85%] md:max-w-[75%] px-5 py-4 rounded-3xl text-sm md:text-base shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-red-600 text-white rounded-br-none' 
                  : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-bl-none'
                }`}>
                <div className="prose prose-sm md:prose-base dark:prose-invert font-medium leading-relaxed max-w-none text-start">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          
          {/* زر تحميل الشهادة */}
          {winnerData && winnerData.activity?.includes('Author') && (
            <div className="mt-8 mb-4 flex justify-center w-full animate-bounce">
              <button onClick={handleDownloadJPG} className="flex items-center gap-3 w-full md:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full shadow-xl transition-transform transform hover:scale-105 uppercase tracking-widest text-sm md:text-base">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                <span>{t('download')}</span>
              </button>
            </div>
          )}

          {/* مؤشر التحميل */}
          {isLoading && (
            <div className="flex items-end gap-3">
              <div className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-sm">
                  <img src="https://www.efipslibrary.online/school-logo.png" className="w-6 h-6 opacity-40 animate-pulse" alt="..." />
              </div>
              <div className="bg-white dark:bg-slate-800 px-5 py-4 rounded-3xl rounded-bl-none shadow-sm flex gap-1.5 items-center h-[52px]">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* منطقة الإدخال السفلية */}
      <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent dark:from-slate-900 dark:via-slate-900 z-20">
        <div className="max-w-4xl mx-auto relative flex items-center shadow-2xl rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus-within:border-red-500 dark:focus-within:border-red-500 transition-colors">
          <input
            type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t('input')}
            className="flex-1 bg-transparent border-0 focus:ring-0 py-4 md:py-5 px-6 md:px-8 text-slate-900 dark:text-white font-medium text-sm md:text-lg outline-none w-full placeholder-slate-400"
            disabled={isLoading}
          />
          <button onClick={handleSendMessage} disabled={isLoading || !input.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-md transition-all rtl:left-2 rtl:right-auto rtl:rotate-180">
            <svg className="w-5 h-5 md:w-6 md:h-6 rotate-[-45deg] rtl:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>

      {/* --- تصميم الشهادة العرضية (Landscape) المخفية للتصدير --- */}
      <div className="fixed left-[-9999px] top-0 pointer-events-none">
          <div ref={certificateRef} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="w-[1123px] h-[794px] bg-white text-slate-900 relative overflow-hidden flex flex-col font-sans border-[20px] border-double border-red-700">
              
              {/* خلفيات جمالية داخل الشهادة */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-red-50 rounded-bl-full -z-10"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-50 rounded-tr-full -z-10"></div>

              {/* رأس الشهادة */}
              <div className="flex justify-between items-center p-10 border-b-2 border-slate-100">
                 <div className="flex items-center gap-6">
                     <img src="https://www.efipslibrary.online/school-logo.png" className="w-32 object-contain" alt="EFIPS Logo" />
                     <div>
                         <h3 className="text-3xl font-bold text-slate-800">مدرسة الإمارات فالكون الدولية الخاصة</h3>
                         <h4 className="text-lg font-bold text-slate-400 uppercase tracking-widest mt-1" dir="ltr">Emirates Falcon International School</h4>
                     </div>
                 </div>
                 <div className="text-left">
                     <div className="px-8 py-3 bg-red-600 text-white font-bold rounded-full text-xl shadow-sm border-2 border-red-700">تحدي المؤلف الصغير</div>
                 </div>
              </div>

              {/* محتوى الشهادة */}
              <div className="flex-1 flex flex-col items-center justify-center text-center px-24">
                  <h1 className="text-6xl font-black text-red-700 mb-6 tracking-wide">شـهـادة إبـداع أدبـي</h1>
                  <p className="text-3xl font-medium text-slate-600 mb-10">يفخر "صقر" المساعد الذكي للمكتبة بتوثيق الإنجاز الأدبي للمبدع(ة):</p>
                  
                  <h2 className="text-7xl font-black text-slate-900 mb-4 pb-2 border-b-4 border-red-600 px-12 inline-block leading-tight">{winnerData?.name}</h2>
                  <p className="text-4xl font-bold text-slate-500 mb-12">المستوى الدراسي: <span className="text-red-600">{winnerData?.grade}</span></p>
                  
                  <div className="bg-slate-50 p-10 rounded-3xl border border-slate-200 w-full text-start relative shadow-inner">
                      <span className="absolute -top-5 right-12 bg-white px-6 py-1 text-red-700 font-bold text-xl border border-slate-200 rounded-full">القصة المبدعة</span>
                      <p className="text-3xl leading-[1.8] font-medium text-slate-800 mt-4 text-justify">{winnerData?.content}</p>
                  </div>
              </div>

              {/* تذييل الشهادة */}
              <div className="flex justify-between items-end p-10 border-t-2 border-slate-100">
                  <div className="text-center w-72">
                     <p className="text-xl font-bold text-slate-500 mb-2">تاريخ الإصدار</p>
                     <p className="text-2xl font-black text-slate-900">{winnerData?.date}</p>
                  </div>
                  <div className="text-center flex flex-col items-center flex-1">
                     <img src="https://www.efipslibrary.online/school-logo.png" className="w-20 opacity-20 mb-2 grayscale" alt="Stamp" />
                     <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Official Library Document</p>
                  </div>
                  <div className="text-center w-72">
                     <p className="text-xl font-bold text-slate-500 mb-2">الموثق المعتمد</p>
                     <p className="text-3xl font-black text-red-700">صقر - المساعد الذكي</p>
                  </div>
              </div>
          </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;700;900&display=swap');
        * { font-family: 'Cairo', sans-serif !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default SmartSearchPage;
