import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 
import html2canvas from 'html2canvas'; 
import { bookData } from '../api/bookData'; 
import { ARABIC_LIBRARY_DATABASE } from './ArabicLibraryInternalPage';
import { ENGLISH_LIBRARY_DATABASE } from './EnglishLibraryInternalPage';

// 👇 1. استدعاء دالة التتبع (تأكد من تعديل المسار ليتطابق مع مشروعك)
import { trackActivity } from '../src/utils/tracker';

// --- 1. بروتوكول عقل صقر النهائي (تم تعديل التعليمات بصرامة) ---
const SAQR_ELITE_PROMPT = `
Identity: You are "Saqr" (صقر), the official Elite AI Librarian of Emirates Falcon International Private School (EFIPS).

Instructions for Books & Search:
1. If the user asks about a book, ALWAYS check the "EFIPS LIBRARY RECORDS FOUND" context provided at the end of this prompt.
2. If found, tell them EXACTLY where it is based on the data. For Physical Library (المكتبة العادية), mention the shelf or row number if available. For Digital Libraries, specify if it's the Arabic or English Digital Library.
3. If the user searches in Arabic for an English book (e.g., "هاري بوتر"), use your AI knowledge to recognize they mean "Harry Potter", and answer accordingly.

Instructions for "Little Author" Challenge (STRICT RULES):
1. UAE THEMES: Start stories inspired by UAE identity (Space, Pearl Diving, Desert Heritage, Falcons, Zayed's legacy).
2. INTERACTION: Write ONLY ONE short sentence to continue the plot naturally. 
   - DO NOT give hints. DO NOT suggest what happens next.
   - DO NOT ask "Are you finished?", "What happens next?", or ANY questions. Just write your sentence and wait.
   - Use plain, clear text. DO NOT use weird symbols, markdown asterisks, or formatting in the story.
3. SILENT CORRECTION: Check the student's text for spelling/grammar errors. ONLY IF there is an actual mistake, politely point it out and provide the correct word, then write your sentence to continue the story. If there are NO errors, JUST continue the story. NEVER ask if there are errors.
4. ENDING THE STORY: 
   - Wait patiently until the student explicitly types "انتهت" or "finished".
   - DO NOT output the WINNER tag yet. 
   - Praise their story, then EXPLICITLY ASK: "ما هو اسمك الكامل؟ وما هو مستواك الدراسي؟" (What is your full name and grade level?).
5. ISSUING THE CERTIFICATE: 
   - ONLY AFTER the student replies with their Name and Grade, output this EXACT format at the very end of your message:
   [WINNER: {Student Name} | Grade: {Student Grade} | Content: {Write a beautifully summarized, grammatically flawless, plain-text summary of the full story they wrote. No weird symbols.}]

Style: Professional, empathetic, uses flawless Fos'ha Arabic or English based on user input. NO emojis in the certificate content.
`;

const localization: any = {
  ar: {
    welcome: 'أهلاً بك! أنا "صقر"، المساعد الذكي لمكتبة المدرسة. هل نؤلف قصة معاً اليوم ، أم تبحث عن كتاب محدد؟',
    input: 'اكتب رسالتك، قصتك، أو ابحث عن كتاب...',
    status: 'صقر الذكي (EFIPS)',
    online: 'متصل',
    download: 'تحميل شهادة المؤلف الصغير',
    you: 'أنت',
    certSchool: 'مدرسة صقر الإمارات الدولية الخاصة',
    certChallenge: 'تحدي المؤلف الصغير',
    certTitle: 'شهادة إبداع أدبي',
    certSubtitle: 'يفخر "صقر" المساعد الذكي بتوثيق الإنجاز الأدبي للمبدع(ة):',
    certGrade: 'المستوى الدراسي:',
    certStory: 'القصة المبدعة',
    certDate: 'تاريخ الإصدار',
    certOfficial: 'وثيقة رسمية من المكتبة',
    certAI: 'الموثق المعتمد',
    certSaqr: 'صقر - المساعد الذكي'
  },
  en: {
    welcome: "Welcome! I'm 'Saqr', your AI Librarian. Shall we co-author story today, or are you looking for a specific book?",
    input: 'Start a story, discuss, or search...',
    status: 'Saqr AI Librarian',
    online: 'Online',
    download: 'Download Certificate',
    you: 'YOU',
    certSchool: 'Emirates Falcon International Private School',
    certChallenge: 'Little Author Challenge',
    certTitle: 'CERTIFICATE OF LITERARY CREATIVITY',
    certSubtitle: 'Saqr, the AI Librarian, proudly documents the achievement of:',
    certGrade: 'Grade Level:',
    certStory: 'The Creative Story',
    certDate: 'Date of Issue',
    certOfficial: 'Official Library Document',
    certAI: 'Certified By',
    certSaqr: 'Saqr - AI Librarian'
  }
};

const SmartSearchPage: React.FC = () => {
  const { locale, dir } = useLanguage();
  const t = (key: string) => localization[locale][key];

  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', content: localization[locale].welcome }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [winnerData, setWinnerData] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleDownloadJPG = async () => {
    if (!certificateRef.current) return;
    
    // إظهار الشهادة في الخلفية للالتقاط
    certificateRef.current.style.left = '0';
    certificateRef.current.style.top = '0';
    certificateRef.current.style.position = 'fixed';
    certificateRef.current.style.zIndex = '-9999';

    // استخدام الارتفاع التلقائي للشهادة (scrollHeight) لضمان عدم قص القصة الطويلة
    const canvas = await html2canvas(certificateRef.current, { 
      scale: 3, 
      backgroundColor: '#ffffff',
      useCORS: true,
      windowWidth: 1123, 
      height: certificateRef.current.scrollHeight
    });

    certificateRef.current.style.left = '-9999px';

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `EFIPS_Author_${winnerData.name.replace(/\s+/g, '_')}.jpg`;
    link.click();
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;
    const userQuery = input.trim();

    // 👇 2. هنا يتم إرسال سؤال الطالب إلى السحابة فور الضغط على إرسال
    trackActivity('ai', userQuery);

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
    const stopWords = ['the', 'book', 'about', 'summary', 'عن', 'كتاب', 'تلخيص', 'ملخص', 'اريد', 'ابحث'];
    const queryWords = qNormalized.split(/\s+/).filter(word => word.length > 2 && !stopWords.includes(word));

    // بحث دقيق وشامل
    const searchIn = (db: any[], location: string) => {
      if (!db || !Array.isArray(db)) return [];
      return db.filter(b => {
        const title = normalize(b?.title || '');
        const author = normalize(b?.author || '');
        
        if (title.includes(qNormalized) || author.includes(qNormalized)) return true;
        return queryWords.length > 0 && queryWords.some(word => title.includes(word) || author.includes(word));
      }).map(b => ({ ...b, pageLocation: location }));
    };

    const foundBooks = [
      ...searchIn(bookData, "المكتبة العادية (Physical Library)"),
      ...searchIn(ARABIC_LIBRARY_DATABASE, "المكتبة الرقمية العربية (Arabic Digital Library)"),
      ...searchIn(ENGLISH_LIBRARY_DATABASE, "المكتبة الرقمية الإنجليزية (English Digital Library)")
    ];

    let searchContext = "";
    if (foundBooks.length > 0) {
      searchContext = `EFIPS LIBRARY RECORDS FOUND: ${JSON.stringify(foundBooks.slice(0, 10))}.`;
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

      // التقاط بيانات الشهادة
      if (reply.includes('[WINNER:')) {
        const match = reply.match(/\[WINNER:\s*(.*?)\s*\|\s*Grade:\s*(.*?)\s*\|\s*Content:\s*(.*?)\]/s);
        if (match) {
          const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
          const formattedDate = new Date().toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', dateOptions);

          const info = { 
            name: match[1].trim(), 
            grade: match[2].trim(), 
            content: match[3].trim(), 
            date: formattedDate 
          };
          setWinnerData(info);
          localStorage.setItem('efips_challenge_reports', JSON.stringify([info, ...JSON.parse(localStorage.getItem('efips_challenge_reports') || '[]')]));
        }
        reply = reply.replace(/\[WINNER:.*?\]/gs, '');
      }
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: locale === 'ar' ? 'حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى.' : 'Connection error, please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir={dir} className="w-full h-[100dvh] flex flex-col bg-slate-50 dark:bg-slate-900 font-sans relative overflow-hidden text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* خلفية ديناميكية */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-40 dark:opacity-20">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-500/20 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* الهيدر */}
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
              <h2 className="text-base md:text-xl font-bold uppercase text-slate-800 dark:text-white leading-none mb-1">{t('status')}</h2>
              <span className="text-[10px] md:text-xs text-green-600 dark:text-green-400 font-bold uppercase flex items-center gap-1">
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
              
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-sm overflow-hidden z-10">
                   <img src="/saqr-avatar.png" alt="S" className="w-7 h-7 md:w-8 md:h-8 object-contain" onError={(e) => e.currentTarget.src="https://www.efipslibrary.online/school-logo.png"} />
                </div>
              )}

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
          {winnerData && (
            <div className="mt-8 mb-4 flex justify-center w-full animate-bounce">
              <button onClick={handleDownloadJPG} className="flex items-center gap-3 w-full md:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full shadow-xl transition-transform transform hover:scale-105 uppercase text-sm md:text-base">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                <span>{t('download')}</span>
              </button>
            </div>
          )}

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

      {/* منطقة الإدخال */}
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

      {/* --- تصميم الشهادة العرضية للتصدير --- */}
      <div className="fixed left-[-9999px] top-0 pointer-events-none">
          {/* إزالة الارتفاع الثابت وجعله min-h ليتمكن من التمدد إذا كانت القصة طويلة */}
          <div ref={certificateRef} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="w-[1123px] min-h-[794px] h-fit bg-white text-slate-900 relative overflow-hidden flex flex-col font-sans border-[20px] border-double border-red-700 pb-12">
              
              <div className="absolute top-0 right-0 w-80 h-80 bg-red-50 rounded-bl-full -z-10"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-50 rounded-tr-full -z-10"></div>

              {/* رأس الشهادة */}
              <div className="flex justify-between items-center p-10 border-b-2 border-slate-100">
                 <div className="flex items-center gap-6">
                     <img src="https://www.efipslibrary.online/school-logo.png" className="w-24 object-contain" alt="EFIPS Logo" />
                     <div>
                         {/* تم إزالة tracking-widest من العربي لمنع تقطع الحروف */}
                         <h3 className="text-2xl font-bold text-slate-800">{t('certSchool')}</h3>
                         <h4 className="text-base font-bold text-slate-400 uppercase mt-1" dir="ltr">EFIPS</h4>
                     </div>
                 </div>
                 <div className="text-left">
                     <div className="px-8 py-3 bg-red-600 text-white font-bold rounded-full text-lg shadow-sm border-2 border-red-700">{t('certChallenge')}</div>
                 </div>
              </div>

              {/* محتوى الشهادة */}
              <div className="flex-1 flex flex-col items-center justify-center text-center px-16 mt-8">
                  {/* تصغير أحجام الخطوط لتكون أكثر تناسقاً */}
                  <h1 className="text-5xl font-black text-red-700 mb-6">{t('certTitle')}</h1>
                  <p className="text-2xl font-medium text-slate-600 mb-8">{t('certSubtitle')}</p>
                  
                  <h2 className="text-5xl font-black text-slate-900 mb-4 pb-2 border-b-4 border-red-600 px-12 inline-block leading-tight">{winnerData?.name}</h2>
                  <p className="text-3xl font-bold text-slate-500 mb-10">{t('certGrade')} <span className="text-red-600">{winnerData?.grade}</span></p>
                  
                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 w-full text-start relative shadow-inner mb-8">
                      <span className={`absolute -top-4 ${locale === 'ar' ? 'right-10' : 'left-10'} bg-white px-6 py-1 text-red-700 font-bold text-lg border border-slate-200 rounded-full`}>{t('certStory')}</span>
                      <p className={`text-2xl leading-[1.8] font-medium text-slate-800 mt-4 ${locale === 'ar' ? 'text-justify' : 'text-left'} whitespace-pre-wrap`}>{winnerData?.content}</p>
                  </div>
              </div>

              {/* تذييل الشهادة */}
              <div className="flex justify-between items-end px-16 pt-8 border-t-2 border-slate-100 mt-auto">
                  <div className="text-center w-64">
                     <p className="text-lg font-bold text-slate-500 mb-2">{t('certDate')}</p>
                     <p className="text-xl font-black text-slate-900">{winnerData?.date}</p>
                  </div>
                  <div className="text-center flex flex-col items-center flex-1">
                     <img src="https://www.efipslibrary.online/school-logo.png" className="w-16 opacity-20 mb-2 grayscale" alt="Stamp" />
                     <p className="text-xs font-bold text-slate-400 uppercase">{t('certOfficial')}</p>
                  </div>
                  <div className="text-center w-64">
                     <p className="text-lg font-bold text-slate-500 mb-2">{t('certAI')}</p>
                     <p className="text-2xl font-black text-red-700">{t('certSaqr')}</p>
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
