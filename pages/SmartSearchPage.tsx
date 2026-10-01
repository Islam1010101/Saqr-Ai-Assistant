import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown'; 
import html2canvas from 'html2canvas'; 
import { bookData } from '../api/bookData'; 
import { ARABIC_LIBRARY_DATABASE } from './ArabicLibraryInternalPage';
import { ENGLISH_LIBRARY_DATABASE } from './EnglishLibraryInternalPage';
import { trackActivity } from '../src/utils/tracker';
import { supabase } from '../src/utils/supabase';

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
    certSaqr: 'صقر - المساعد الذكي',
    welcome: 'مرحباً بك،'
  },
  en: {
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
    certSaqr: 'Saqr - AI Librarian',
    welcome: "Let's jump in,"
  }
};

// ==========================================
// أيقونات SVG جذابة ومطابقة للمواصفات
// ==========================================
const SendIcon = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
  </svg>
);

const MicIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

// --- مكون التلاشي المخصص للرسائل (Message Reveal Component) ---
const RevealMessage = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.15,
        rootMargin: "-5% 0px -5% 0px"
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-500 ease-out transform w-full ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-[0.98]'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const SmartSearchPage: React.FC = () => {
  const { locale, dir } = useLanguage();
  const t = (key: string) => localization[locale][key];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [winnerData, setWinnerData] = useState<any>(null);
  const [userName, setUserName] = useState<string>('');
  
  const [saqrState, setSaqrState] = useState<'idle' | 'thinking' | 'speaking' | 'victory'>('idle');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('current_user');
    const storedType = localStorage.getItem('user_type');
    
    let welcomeMessage = '';

    if (storedUser && storedType) {
      const user = JSON.parse(storedUser);
      const name = locale === 'ar' ? (user.name_ar || user.name_en) : (user.name_en || user.name_ar);
      const firstName = name ? name.split(' ')[0] : '';
      setUserName(name || firstName);
      
      if (storedType === 'student') {
        welcomeMessage = locale === 'ar' 
          ? `أهلاً بك يا صديقي المبدع **${firstName}**! 🎓\nأنا "صقر"، المساعد الذكي لمكتبتك. هل نؤلف قصة ممتعة معاً اليوم، أم تبحث عن كتاب محدد لتقرأه؟`
          : `Welcome my creative friend **${firstName}**! 🎓\nI'm 'Saqr', your AI Librarian. Shall we co-author a story today, or are you looking for a specific book?`;
      } else if (storedType === 'teacher' || storedType === 'admin') {
        welcomeMessage = locale === 'ar'
          ? `أهلاً بك أستاذي الفاضل **${firstName}**! 👨‍🏫\nأنا "صقر" في خدمتك. كيف يمكنني مساعدتك اليوم في البحث عن مصادر أو معلومات لمادتك؟`
          : `Welcome esteemed teacher **${firstName}**! 👨‍🏫\nI am 'Saqr', at your service. How can I assist you today with resources or information?`;
      }
    } else {
      setUserName('');
      welcomeMessage = locale === 'ar'
        ? 'أهلاً بك! أنا "صقر"، المساعد الذكي لمكتبة المدرسة. هل نؤلف قصة معاً اليوم، أم تبحث عن كتاب محدد؟'
        : "Welcome! I'm 'Saqr', your AI Librarian. Shall we co-author a story today, or are you looking for a specific book?";
    }

    setMessages([{ role: 'assistant', content: welcomeMessage }]);
  }, [locale]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleDownloadJPG = async () => {
    if (!certificateRef.current) return;
    
    const originalPosition = certificateRef.current.style.position;
    const originalLeft = certificateRef.current.style.left;
    const originalTop = certificateRef.current.style.top;
    const originalZIndex = certificateRef.current.style.zIndex;

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
      certificateRef.current.style.position = originalPosition;
      certificateRef.current.style.left = originalLeft;
      certificateRef.current.style.top = originalTop;
      certificateRef.current.style.zIndex = originalZIndex;
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;
    const userQuery = input.trim();

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

    const storedUser = localStorage.getItem('current_user');
    let userContextInfo = "";
    if (storedUser) {
        const user = JSON.parse(storedUser);
        const name = locale === 'ar' ? (user.name_ar || user.name_en) : (user.name_en || user.name_ar);
        const type = localStorage.getItem('user_type') === 'student' ? 'Student' : 'Teacher';
        userContextInfo = `\nCurrent User Context: The person talking to you is a ${type} named "${name}". Use their name occasionally to be friendly.`;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: `${SAQR_ELITE_PROMPT}\n\n${userContextInfo}\n\n${searchContext}` }, 
            ...messages, 
            { role: 'user', content: userQuery }
          ],
          locale,
        }),
      });
      const data = await response.json();
      let reply = data.reply || '';

      if (reply.includes('[WINNER:')) {
        const match = reply.match(/\[WINNER:\s*(.*?)\s*\Vert{}?\s*Grade:\s*(.*?)\s*\Vert{}?\s*Content:\s*(.*?)\]/s);
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
    <div dir={dir} className="w-full h-[100dvh] flex flex-col bg-white dark:bg-[#0b0f17] font-sans relative overflow-hidden text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* 🌟 الخلفية الديناميكية: مطابقة للصورة في الدارك مود (إضاءة زرقاء خافتة بالمنتصف) وبيضاء في اللايت مود */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950/40 via-[#0b0f17] to-[#0b0f17] pointer-events-none -z-10 hidden dark:block" />

      {/* Header - الهيدر العلوي */}
      <header className="flex-shrink-0 px-4 py-4 md:px-8 w-full max-w-5xl mx-auto flex justify-between items-center z-20 relative bg-white/80 dark:bg-transparent backdrop-blur-sm border-b border-slate-100 dark:border-transparent">
        <div className="flex items-center gap-3 md:gap-4">
          <div className={`w-10 h-10 md:w-14 md:h-14 flex-shrink-0 rounded-full flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-sky-400 dark:border-sky-500 shadow-md ${saqrState === 'thinking' ? 'ring-2 ring-amber-400 animate-pulse' : ''}`}>
            <img 
              src={getSaqrImageSrc()} 
              alt="Saqr AI" 
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              onError={(e) => e.currentTarget.style.display = 'none'}
            />
          </div>
          <div>
            <h1 className="font-bold text-lg md:text-2xl text-slate-900 dark:text-white tracking-tight">{t('status')}</h1>
            <span className="inline-flex items-center gap-1.5 text-xs md:text-sm text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> {t('online')}
            </span>
          </div>
        </div>

        {winnerData && saqrState === 'victory' && (
          <button onClick={handleDownloadJPG} className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white font-bold rounded-full hover:bg-rose-700 transition-all shadow-md text-xs md:text-sm">
            <DownloadIcon />
            <span className="hidden md:inline">{t('download')}</span>
            <span className="md:hidden">تحميل</span>
          </button>
        )}
      </header>

      {/* 🌟 عنوان الترحب باسم المستخدم (مثل تصميم Gemini في الصورة تماماً) */}
      <div className="flex-shrink-0 text-center pt-4 pb-2 px-4 z-10">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-medium tracking-tight text-slate-800 dark:text-slate-100">
          {t('welcome')} <span className="font-bold text-sky-600 dark:text-sky-400">{userName || 'صديقي المبدع'}</span>
        </h2>
      </div>

      {/* 🛠️ منطقة المحادثات والتلاشي التفاعلي للرسائل */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 no-scrollbar scroll-smooth relative z-10 pb-36">
        <div className="max-w-4xl mx-auto flex flex-col justify-end min-h-fit space-y-6">
          
          {messages.map((msg, index) => (
            <RevealMessage key={index}>
                <div className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  
                  {/* رسائل صقر */}
                  {msg.role === 'assistant' && (
                    <div className="flex flex-col gap-2 max-w-[92%] md:max-w-[85%] items-start">
                      <div className="flex gap-3 items-end" translate="no" lang={locale}>
                        <div className="bg-slate-50 dark:bg-[#1a1f2e] border border-slate-200 dark:border-slate-800 rounded-3xl rounded-bl-sm px-5 py-4 shadow-sm text-slate-800 dark:text-slate-100 font-medium leading-relaxed text-base md:text-lg">
                          <div className="prose prose-slate dark:prose-invert max-w-none text-start font-cairo">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        </div>
                      </div>

                      {/* زر التحميل المباشر أسفل رد الفوز */}
                      {winnerData && saqrState === 'victory' && index === messages.length - 1 && (
                        <div className="mt-2 w-full text-start animate-zoom-in">
                          <button onClick={handleDownloadJPG} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-full shadow-md hover:bg-emerald-700 transition-all text-xs md:text-sm">
                            <DownloadIcon />
                            <span>{t('download')}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* رسائل المستخدم */}
                  {msg.role === 'user' && (
                    <div className="bg-sky-500 dark:bg-sky-600 text-white px-5 py-3.5 rounded-3xl rounded-br-sm max-w-[85%] md:max-w-[75%] shadow-md">
                      <div className="font-semibold leading-relaxed max-w-none text-start text-base md:text-lg">
                        {msg.content}
                      </div>
                    </div>
                  )}
                </div>
            </RevealMessage>
          ))}
          
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* 🌟 منطقة الإدخال - مطابقة للشريط البيضاوي في الصورة تماماً */}
      <div className="absolute bottom-0 inset-x-0 px-4 pb-6 pt-2 w-full z-20 flex-shrink-0 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-[#0b0f17] dark:via-[#0b0f17]/90 dark:to-transparent">
        <div className="max-w-3xl mx-auto flex flex-col gap-2">
          
          <div className="relative flex items-center bg-slate-100 dark:bg-[#1a1f2e] rounded-full border border-slate-200 dark:border-slate-700/60 shadow-lg px-3 py-1.5 focus-within:border-sky-500 dark:focus-within:border-sky-400 transition-all">
            
            {/* أيقونة الإضافة (+) */}
            <button type="button" className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-full transition-colors shrink-0">
              <PlusIcon />
            </button>

            <input
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('input')}
              className="flex-1 bg-transparent border-0 focus:ring-0 py-3 px-3 text-slate-900 dark:text-white font-medium outline-none w-full placeholder-slate-400 dark:placeholder-slate-500 text-sm md:text-base"
              disabled={isLoading}
            />
            
            {/* شارة النموذج (Pro / EFIPS) */}
            <div className="hidden sm:flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full shrink-0 mr-1">
              <span>Pro</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>

            {/* أيقونة المايكروفون */}
            <button type="button" className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-full transition-colors shrink-0">
              <MicIcon />
            </button>

            {/* زر الإرسال */}
            <button 
              onClick={handleSendMessage} 
              disabled={isLoading || !input.trim()} 
              className="w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 disabled:dark:bg-slate-800 text-white flex items-center justify-center transition-all shrink-0 shadow-md ml-1 rtl:rotate-180"
            >
              <SendIcon />
            </button>
          </div>

          {/* مؤشر التحميل */}
          {isLoading && (
            <div className="w-[90%] mx-auto h-1 rounded-full overflow-hidden relative bg-slate-200 dark:bg-slate-800 mt-1">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400 animate-[shimmer_1.5s_infinite] w-[200%]"></div>
            </div>
          )}
        </div>
      </div>

      {/* --- تصميم الشهادة العرضية للتصدير (مخفية ومحمية تماماً) --- */}
      <div className="fixed left-[-9999px] top-0 pointer-events-none">
          <div ref={certificateRef} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="w-[1123px] min-h-[794px] h-fit bg-white text-slate-900 relative overflow-hidden flex flex-col font-sans border-[20px] border-double border-red-700 pb-12">
              <div className="absolute top-0 right-0 w-80 h-80 bg-red-50 rounded-bl-full -z-10"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-50 rounded-tr-full -z-10"></div>

              <div className="flex justify-between items-center p-10 border-b-4 border-slate-100">
                 <div className="flex items-center gap-6">
                     <img src="https://www.efipslibrary.online/school-logo.png" className="w-24 object-contain" alt="EFIPS Logo" crossOrigin="anonymous" />
                     <div>
                         <h3 className="text-2xl font-black text-slate-800">{t('certSchool')}</h3>
                         <h4 className="text-base font-black text-slate-400 uppercase mt-1" dir="ltr">EFIPS</h4>
                     </div>
                 </div>
                 <div className="text-left">
                     <div className="px-8 py-3 bg-red-600 text-white font-black rounded-full text-lg shadow-sm border-b-4 border-red-800">{t('certChallenge')}</div>
                 </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center px-16 mt-8">
                  <h1 className="text-5xl font-black text-red-700 mb-6">{t('certTitle')}</h1>
                  <p className="text-2xl font-bold text-slate-600 mb-8">{t('certSubtitle')}</p>
                  
                  <h2 className="text-5xl font-black text-slate-900 mb-4 pb-2 border-b-8 border-red-600 px-12 inline-block leading-tight">{winnerData?.name}</h2>
                  <p className="text-3xl font-black text-slate-500 mb-10">{t('certGrade')} <span className="text-red-600">{winnerData?.grade}</span></p>
                  
                  <div className="bg-slate-50 p-8 rounded-[2rem] border-4 border-slate-200 w-full text-start relative shadow-inner mb-8">
                      <span className={`absolute -top-5 ${locale === 'ar' ? 'right-10' : 'left-10'} bg-white px-6 py-2 text-red-700 font-black text-xl border-4 border-slate-200 rounded-full`}>{t('certStory')}</span>
                      <p className={`text-2xl leading-[1.8] font-bold text-slate-800 mt-6 ${locale === 'ar' ? 'text-justify' : 'text-left'} whitespace-pre-wrap`}>{winnerData?.content}</p>
                  </div>
              </div>

              <div className="flex justify-between items-end px-16 pt-8 border-t-4 border-slate-100 mt-auto">
                  <div className="text-center w-64">
                     <p className="text-lg font-black text-slate-500 mb-2">{t('certDate')}</p>
                     <p className="text-2xl font-black text-slate-900">{winnerData?.date}</p>
                  </div>
                  <div className="text-center flex flex-col items-center flex-1">
                     <img src="https://www.efipslibrary.online/school-logo.png" className="w-16 opacity-20 mb-2 grayscale" alt="Stamp" crossOrigin="anonymous" />
                     <p className="text-xs font-black text-slate-400 uppercase">{t('certOfficial')}</p>
                  </div>
                  <div className="text-center w-64">
                     <p className="text-lg font-black text-slate-500 mb-2">{t('certAI')}</p>
                     <p className="text-2xl font-black text-red-700">{t('certSaqr')}</p>
                  </div>
              </div>
          </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        * { font-family: 'Cairo', sans-serif !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }

        @keyframes shimmer { 
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); } 
        }

        @keyframes zoom-in { 
          0% { opacity: 0; transform: scale(0.95); } 
          100% { opacity: 1; transform: scale(1); } 
        }
        .animate-zoom-in { animation: zoom-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default SmartSearchPage;
