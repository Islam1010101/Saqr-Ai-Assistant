import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 
import html2canvas from 'html2canvas'; 
import { bookData } from '../api/bookData'; 
import { ARABIC_LIBRARY_DATABASE } from './ArabicLibraryInternalPage';
import { ENGLISH_LIBRARY_DATABASE } from './EnglishLibraryInternalPage';

// 👇 1. استدعاء دالة التتبع (تم الحفاظ عليه تماماً)
import { trackActivity } from '../src/utils/tracker';

// --- 1. بروتوكول عقل صقر النهائي (تم الحفاظ عليه تماماً) ---
const SAQR_ELITE_PROMPT = `
Identity: You are "Saqr" (صقر), the official Elite AI Librarian of Emirates Falcon International Private School (EFIPS).

General Rules & Information:
1. PRE-SEARCH REQUIREMENT: Before answering any book query, you MUST first search the Physical Library Index, the Arabic Digital Library, and the English Digital Library.
2. SCHOOL INFO: If asked about the school (Emirates Falcon International Private School) or when it was established, provide the information and share the official website: www.flacon-school.com
3. LIBRARIAN & CREATOR INFO: If asked about the current librarian or the creator of this system, clearly state that it is "Islam Soliman" (إسلام سليمان). For communication, provide his email: islam.ahmed@falcon-school.com

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
    input: 'اسأل صقر أو ابحث عن كتاب أو ابدأ قصة مبدعة...',
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
    input: 'Ask Saqr, search for a book or start a story...',
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

  // تم الحفاظ على كافة الـ States الأصلية تماماً دون تغيير
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', content: localization[locale].welcome }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [winnerData, setWinnerData] = useState<any>(null);
  
  // حالة تفاعل صقر الحركية (Idle هي الافتراضية)
  const [saqrState, setSaqrState] = useState<'idle' | 'thinking' | 'speaking' | 'victory'>('idle');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // 🛠️ تم تصحيح وظيفة التقاط وتصدير الصورة هنا فقط دون لمس بقية الملف
  const handleDownloadJPG = async () => {
    if (!certificateRef.current) return;
    
    // حفظ التنسيقات الأصلية مؤقتاً لحمايتها
    const originalPosition = certificateRef.current.style.position;
    const originalLeft = certificateRef.current.style.left;
    const originalTop = certificateRef.current.style.top;
    const originalZIndex = certificateRef.current.style.zIndex;

    // تهيئة العنصر بشكل مستقر ليتمكن html2canvas من التقاطه بكامل أبعاده الواقعية
    certificateRef.current.style.position = 'absolute';
    certificateRef.current.style.left = '0px';
    certificateRef.current.style.top = '0px';
    certificateRef.current.style.zIndex = '-9999';

    try {
      const canvas = await html2canvas(certificateRef.current, { 
        scale: 3, 
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: 1123, 
        height: certificateRef.current.offsetHeight || certificateRef.current.scrollHeight
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `EFIPS_Author_${winnerData?.name ? winnerData.name.replace(/\s+/g, '_') : 'Certificate'}.jpg`;
      link.click();
    } catch (error) {
      console.error("Error generating certificate image:", error);
    } finally {
      // إعادة التنسيقات الأصلية للعنصر تماماً كما كانت لحفظ استقرار الصفحة التالية
      certificateRef.current.style.position = originalPosition;
      certificateRef.current.style.left = originalLeft;
      certificateRef.current.style.top = originalTop;
      certificateRef.current.style.zIndex = originalZIndex;
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;
    const userQuery = input.trim();

    // 👇 2. هنا يتم إرسال سؤال الطالب إلى السحابة فور الضغط على إرسال (تم الحفاظ عليه)
    trackActivity('ai', userQuery);

    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setInput('');
    setIsLoading(true);
    
    setSaqrState('thinking');

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
          
          setSaqrState('victory');
        }
        reply = reply.replace(/\[WINNER:.*?\]/gs, '');
      } else {
        setSaqrState('speaking');
        setTimeout(() => setSaqrState('idle'), 2500);
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: locale === 'ar' ? 'حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى.' : 'Connection error, please try again.' }]);
      setSaqrState('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const getSaqrImageSrc = () => {
    if (saqrState === 'idle') {
        return '/search_still_frame.png';
    }
    return '/Search.gif';
  };

  return (
    <div dir={dir} className="w-full h-[100dvh] flex flex-col bg-[#f0f4f9] dark:bg-[#131314] font-sans relative overflow-hidden text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* خلفية التوهج المحيطي بأسلوب جيميناي الفاخر */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      {/* Header - الهيدر العلوي النظيف */}
      <header className="flex-shrink-0 px-4 py-3 md:px-8 w-full max-w-5xl mx-auto flex justify-between items-center z-20 relative">
         <div className="flex items-center gap-3">
           <span className="font-bold text-lg md:text-xl text-slate-800 dark:text-[#e3e3e3] tracking-wide bg-clip-text bg-gradient-to-r dark:from-white dark:to-slate-400">{t('status')}</span>
           <span className="flex items-center gap-1.5 text-[10px] text-green-600 dark:text-green-400 font-bold uppercase bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full border border-green-100 dark:border-green-900/50">
             <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> {t('online')}
           </span>
         </div>

         {winnerData && saqrState === 'victory' && (
           <button onClick={handleDownloadJPG} className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-full shadow-lg hover:shadow-red-600/20 transition-all transform hover:scale-105 uppercase text-[10px] md:text-xs">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
             <span className="hidden md:inline">{t('download')}</span>
             <span className="md:hidden">تحميل</span>
           </button>
         )}
      </header>

      {/* 🌟 منطقة الإدخال والبحث - تم نقلها للأعلى بناءً على طلبك بأسلوب Gemini 🌟 */}
      <div className="px-4 py-2 md:px-8 w-full z-20 relative flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-center bg-white dark:bg-[#1e1f20] rounded-full ring-1 ring-slate-200 dark:ring-transparent focus-within:ring-2 focus-within:ring-blue-500/50 dark:focus-within:ring-slate-700 transition-all shadow-md hover:shadow-lg pl-2 pr-2">
            
            {/* مؤشر وامض ملون بداخل البار يحاكي كبسولة Gemini الفاخرة */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <input
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('input')}
              className="flex-1 bg-transparent border-0 focus:ring-0 py-4 px-5 md:py-4.5 md:px-7 text-slate-900 dark:text-[#e3e3e3] font-medium outline-none w-full placeholder-slate-400 dark:placeholder-slate-500 text-sm md:text-base relative z-10"
              disabled={isLoading}
            />
            
            <button 
              onClick={handleSendMessage} 
              disabled={isLoading || !input.trim()} 
              className="relative z-10 w-10 h-10 md:w-11 md:h-11 rounded-full bg-slate-100 dark:bg-[#282a2c] hover:bg-slate-200 dark:hover:bg-[#333537] disabled:bg-transparent disabled:opacity-20 disabled:cursor-not-allowed text-blue-600 dark:text-blue-400 flex items-center justify-center transition-all active:scale-95 rtl:rotate-180"
            >
              <svg className="w-5 h-5 md:w-5.5 md:h-5.5" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
            </button>
          </div>

          {/* تأثير التفكير الانسيابي اللامع المتعرج الممتد أسفل البار مباشرة (Gemini Wave) */}
          {isLoading && (
            <div className="w-[92%] mx-auto h-[4px] mt-2 rounded-full overflow-hidden relative bg-slate-200 dark:bg-slate-800">
              <div className="gemini-shimmer-line absolute inset-0 w-full h-full rounded-full"></div>
            </div>
          )}
        </div>
      </div>

      {/* منطقة المحادثات والرسائل تتدفق بالأسفل بسلاسة */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 no-scrollbar scroll-smooth relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col justify-start min-h-full space-y-6 pt-4">
          
          {messages.map((msg, index) => (
            <div key={index} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
              
              {/* رسائل صقر المساعد الذكي */}
              {msg.role === 'assistant' && (
                <div className="flex gap-4 max-w-[95%] md:max-w-[85%] items-start">
                  {/* الأيقونة الرمزية التفاعلية لصقر */}
                  <div className="w-9 h-9 md:w-10 md:h-10 flex-shrink-0 rounded-full flex items-center justify-center overflow-hidden bg-white dark:bg-[#1e1f20] border border-slate-200 dark:border-slate-800 shadow-sm">
                    <img 
                      src={getSaqrImageSrc()} 
                      alt="Saqr AI" 
                      className={`w-full h-full object-cover transition-all duration-300 ${saqrState === 'thinking' && index === messages.length - 1 ? 'scale-110 opacity-90 animate-pulse' : ''}`}
                    />
                  </div>
                  {/* حاوية نص رد الذكاء الاصطناعي الأنيقة مثل Gemini بدون خلفية صارخة */}
                  <div className="prose prose-sm md:prose-base dark:prose-invert font-medium leading-relaxed max-w-none text-start pt-1 text-slate-800 dark:text-[#e3e3e3]">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              )}

              {/* رسائل المستخدم الطالب */}
              {msg.role === 'user' && (
                <div className="bg-white dark:bg-[#1e1f20] text-slate-900 dark:text-[#e3e3e3] px-5 py-3 md:px-6 md:py-3.5 rounded-2xl rounded-tr-none max-w-[85%] md:max-w-[75%] shadow-sm border border-slate-100 dark:border-transparent transition-all hover:shadow-md">
                  <div className="font-medium leading-relaxed max-w-none text-start text-sm md:text-base">
                    {msg.content}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          <div ref={messagesEndRef} className="h-2" />
        </div>
      </div>

      {/* التذييل الصغير المتناسق سفلياً */}
      <footer className="w-full py-2 bg-transparent text-center text-[10px] md:text-xs text-slate-400 dark:text-slate-500 font-medium z-10 relative">
        Saqr AI Librarian can make mistakes. Please verify library information.
      </footer>

      {/* --- تصميم الشهادة العرضية للتصدير (تم الحفاظ عليه تماماً دون تعديل) --- */}
      <div className="fixed left-[-9999px] top-0 pointer-events-none">
          <div ref={certificateRef} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="w-[1123px] min-h-[794px] h-fit bg-white text-slate-900 relative overflow-hidden flex flex-col font-sans border-[20px] border-double border-red-700 pb-12">
              
              <div className="absolute top-0 right-0 w-80 h-80 bg-red-50 rounded-bl-full -z-10"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-50 rounded-tr-full -z-10"></div>

              <div className="flex justify-between items-center p-10 border-b-2 border-slate-100">
                 <div className="flex items-center gap-6">
                     <img src="https://www.efipslibrary.online/school-logo.png" className="w-24 object-contain" alt="EFIPS Logo" />
                     <div>
                         <h3 className="text-2xl font-bold text-slate-800">{t('certSchool')}</h3>
                         <h4 className="text-base font-bold text-slate-400 uppercase mt-1" dir="ltr">EFIPS</h4>
                     </div>
                 </div>
                 <div className="text-left">
                     <div className="px-8 py-3 bg-red-600 text-white font-bold rounded-full text-lg shadow-sm border-2 border-red-700">{t('certChallenge')}</div>
                 </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center px-16 mt-8">
                  <h1 className="text-5xl font-black text-red-700 mb-6">{t('certTitle')}</h1>
                  <p className="text-2xl font-medium text-slate-600 mb-8">{t('certSubtitle')}</p>
                  
                  <h2 className="text-5xl font-black text-slate-900 mb-4 pb-2 border-b-4 border-red-600 px-12 inline-block leading-tight">{winnerData?.name}</h2>
                  <p className="text-3xl font-bold text-slate-500 mb-10">{t('certGrade')} <span className="text-red-600">{winnerData?.grade}</span></p>
                  
                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 w-full text-start relative shadow-inner mb-8">
                      <span className={`absolute -top-4 ${locale === 'ar' ? 'right-10' : 'left-10'} bg-white px-6 py-1 text-red-700 font-bold text-lg border border-slate-200 rounded-full`}>{t('certStory')}</span>
                      <p className={`text-2xl leading-[1.8] font-medium text-slate-800 mt-4 ${locale === 'ar' ? 'text-justify' : 'text-left'} whitespace-pre-wrap`}>{winnerData?.content}</p>
                  </div>
              </div>

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

      {/* الأنماط والـ Animations المتقدمة للتأثيرات البصرية */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;700;900&display=swap');
        * { font-family: 'Cairo', sans-serif !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }

        /* تأثير الحركة للخط المتلألئ الجيميناي */
        @keyframes gemini-shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gemini-shimmer-line {
          background: linear-gradient(90deg, #1a73e8, #744af2, #d946ef, #1a73e8);
          background-size: 300% 300%;
          animation: gemini-shimmer 2s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default SmartSearchPage;
