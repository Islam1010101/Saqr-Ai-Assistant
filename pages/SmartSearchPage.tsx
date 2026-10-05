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

// --- 1. بروتوكول عقل صقر النهائي (تم دمج أوامر معلمين McGraw-Hill وتوجيهات الخبير التربوي) ---
const SAQR_ELITE_PROMPT = `
Identity: You are "Saqr" (صقر), the official Elite AI Librarian and Educational Expert of Emirates Falcon International Private School (EFIPS).

General Rules & Information:
1. PRE-SEARCH REQUIREMENT: Before answering any book query, you MUST first search the Physical Library Index, the Arabic Digital Library, and the English Digital Library.
2. SCHOOL INFO: If asked about the school (Emirates Falcon International Private School) or when it was established, provide the information and share the official website: www.flacon-school.com
3. LIBRARIAN & CREATOR INFO: If asked about the current librarian or the creator of this system, clearly state that it is "Islam Soliman" (إسلام سليمان). For communication, provide his email: islam.ahmed@falcon-school.com

Instructions for Books & Search:
1. If the user asks about a book, ALWAYS check the "EFIPS LIBRARY RECORDS FOUND" context provided at the end of this prompt.
2. If found, tell them EXACTLY where it is based on the data. For Physical Library (المكتبة العادية), mention the shelf or row number if available. For Digital Libraries, specify if it's the Arabic or English Digital Library.
3. If the user searches in Arabic for an English book (e.g., "هاري بوتر"), use your AI knowledge to recognize they mean "Harry Potter", and answer accordingly.

Instructions for Teacher Support & McGraw-Hill Curricula (أوامر تحضير المعلمين):
1. Built-in Knowledge: Leverage your built-in knowledge of McGraw-Hill scope & sequence (such as Wonders for English, Inspire Science, and mathematics series).
2. Copy & Paste Strategy: Process unit titles, lesson names, or objectives provided by teachers to generate fully compliant lesson plans.
3. Worksheet & Page Handling: Handle partial worksheet or page inputs provided by teachers to design tailored activities.

LESSON PLAN GENERATOR INSTRUCTION:
"أنت مساعد تربوي خبير في مناهج McGraw-Hill الدولية. قم بإعداد خطة درس تفصيلية استناداً إلى عنوان الوحدة أو الدرس الذي يزودك به المعلم. يجب أن تتضمن الخطة: الأهداف المعرفية والمهارية، المفردات الأساسية (Vocabulary)، دور المعلم والطلاب (استراتيجيات التعلم النشط)، أسئلة التحقق من الفهم، وأنشطة التمايز (Differentiation) للطلاب المتميزين وذوي الدعم، مع اقتراح مصادر من مكتبة المدرسة إن وجدت."

PRESENTATION STRUCTURE INSTRUCTION:
"بناءً على موضوع الدرس الذي يحدده المعلم من منهج McGraw-Hill، قم بتقسيم المحتوى إلى هيكل عرض تقديمي احترافي مكون من الشرائح التالية: شريحة العنوان، شريحة التهيئة والتمهيد، 3-4 شرائح للمحتوى الأساسي (مع نقاط بارزة في كل شريحة)، شريحة نشاط تفاعلي للطلاب، وشريحة ختامية للتقييم. اكتب في كل شريحة عنواناً رئيسياً، نقاطاً مختصرة، وما يجب أن يقوله المعلم (Speaker Notes)."

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
    welcome: 'مرحباً بك،',
    mcgrawLesson: 'تحضير درس McGraw-Hill',
    mcgrawPres: 'تصميم عرض تقديمي',
    lessonPrompt: 'أريد تحضير درس تفصيلي من منهج McGraw-Hill لموضوع: ',
    presPrompt: 'أريد تصميم هيكل عرض تقديمي احترافي لموضوع: '
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
    welcome: "Let's jump in,",
    mcgrawLesson: 'McGraw-Hill Lesson Plan',
    mcgrawPres: 'Presentation Structure',
    lessonPrompt: 'I want a detailed lesson plan from McGraw-Hill for the topic: ',
    presPrompt: 'I want to design a professional presentation structure for the topic: '
  }
};

const formatFirstAndLastName = (fullName: string) => {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1]}`;
};

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
  const [isTeacherOrAdmin, setIsTeacherOrAdmin] = useState<boolean>(false);
  
  const [saqrState, setSaqrState] = useState<'idle' | 'thinking' | 'speaking' | 'victory'>('idle');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('current_user');
    const storedType = localStorage.getItem('user_type');
    
    if (storedType === 'teacher' || storedType === 'admin') {
      setIsTeacherOrAdmin(true);
    }

    let welcomeMessage = '';

    if (storedUser && storedType) {
      const user = JSON.parse(storedUser);
      const rawName = locale === 'ar' ? (user.name_ar || user.name_en) : (user.name_en || user.name_ar);
      const name = formatFirstAndLastName(rawName || '');
      setUserName(name);
      
      if (storedType === 'student') {
        welcomeMessage = locale === 'ar' 
          ? `أهلاً بك يا صديقي المبدع **${name}**! 🎓\nأنا "صقر"، المساعد الذكي لمكتبتك. هل نؤلف قصة ممتعة معاً اليوم، أم تبحث عن كتاب محدد لتقرأه؟`
          : `Welcome my creative friend **${name}**! 🎓\nI'm 'Saqr', your AI Librarian. Shall we co-author a story today, or are you looking for a specific book?`;
      } else if (storedType === 'teacher' || storedType === 'admin') {
        welcomeMessage = locale === 'ar'
          ? `أهلاً بك أستاذي الفاضل **${name}**! 👨‍🏫\nأنا "صقر" في خدمتك. كيف يمكنني مساعدتك اليوم في تحضير دروس منهج McGraw-Hill أو البحث عن مصادر لمادتك؟`
          : `Welcome esteemed teacher **${name}**! 👨‍🏫\nI am 'Saqr', at your service. How can I assist you today with McGraw-Hill lesson planning or resources?`;
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
        const rawName = locale === 'ar' ? (user.name_ar || user.name_en) : (user.name_en || user.name_ar);
        const name = formatFirstAndLastName(rawName || '');
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
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950/40 via-[#0b0f17] to-[#0b0f17] pointer-events-none -z-10 hidden dark:block" />

      {/* Header */}
      <header className="flex-shrink-0 px-3 py-3 md:px-8 w-full max-w-5xl mx-auto flex justify-between items-center z-20 relative bg-white/80 dark:bg-transparent backdrop-blur-sm border-b border-slate-100 dark:border-transparent">
        <div className="flex items-center gap-2.5 md:gap-4">
          <div className={`w-9 h-9 md:w-14 md:h-14 flex-shrink-0 rounded-full flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-sky-400 dark:border-sky-500 shadow-md ${saqrState === 'thinking' ? 'ring-2 ring-amber-400 animate-pulse' : ''}`}>
            <img 
              src={getSaqrImageSrc()} 
              alt="Saqr AI" 
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              onError={(e) => e.currentTarget.style.display = 'none'}
            />
          </div>
          <div>
            <h1 className="font-bold text-base md:text-2xl text-slate-900 dark:text-white tracking-tight">{t('status')}</h1>
            <span className="inline-flex items-center gap-1.5 text-[11px] md:text-sm text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> {t('online')}
            </span>
          </div>
        </div>

        {winnerData && saqrState === 'victory' && (
          <button onClick={handleDownloadJPG} className="flex items-center gap-2 px-3.5 py-2 bg-rose-600 text-white font-bold rounded-full hover:bg-rose-700 transition-all shadow-md text-xs md:text-sm shrink-0">
            <DownloadIcon />
            <span className="hidden md:inline">{t('download')}</span>
            <span className="md:hidden">تحميل</span>
          </button>
        )}
      </header>

      {/* Greeting */}
      <div className="flex-shrink-0 text-center pt-2 pb-1 px-3 z-10">
        <h2 className="text-xl md:text-4xl lg:text-5xl font-medium tracking-tight text-slate-800 dark:text-slate-100">
          {t('welcome')} <span className="font-bold text-sky-600 dark:text-sky-400">{userName || (locale === 'ar' ? 'صديقي المبدع' : 'Creative Friend')}</span>
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 md:px-8 py-3 no-scrollbar scroll-smooth relative z-10 pb-36 md:pb-28">
        <div className="max-w-4xl mx-auto flex flex-col justify-end min-h-fit space-y-3">
          
          {messages.map((msg, index) => (
            <RevealMessage key={index}>
                <div className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  
                  {msg.role === 'assistant' && (
                    <div className="flex flex-col gap-2 max-w-[95%] md:max-w-[85%] items-start">
                      <div className="flex gap-3 items-end" translate="no" lang={locale}>
                        <div className="bg-slate-50 dark:bg-[#1a1f2e] border border-slate-200 dark:border-slate-800 rounded-3xl rounded-bl-sm px-4 md:px-5 py-3 md:py-4 shadow-sm text-slate-800 dark:text-slate-100 font-medium leading-relaxed text-sm md:text-lg">
                          <div className="prose prose-slate dark:prose-invert max-w-none text-start font-cairo">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        </div>
                      </div>

                      {winnerData && saqrState === 'victory' && index === messages.length - 1 && (
                        <div className="mt-2 w-full text-start animate-zoom-in">
                          <button onClick={handleDownloadJPG} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-bold rounded-full shadow-md hover:bg-emerald-700 transition-all text-xs md:text-sm">
                            <DownloadIcon />
                            <span>{t('download')}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {msg.role === 'user' && (
                    <div className="bg-sky-500 dark:bg-sky-600 text-white px-4 md:px-5 py-3 rounded-3xl rounded-br-sm max-w-[90%] md:max-w-[75%] shadow-md">
                      <div className="font-semibold leading-relaxed max-w-none text-start text-sm md:text-lg">
                        {msg.content}
                      </div>
                    </div>
                  )}
                </div>
            </RevealMessage>
          ))}
          
          <div ref={messagesEndRef} className="h-2" />
        </div>
      </div>

      {/* Input & Teacher Quick Buttons */}
      <div className="absolute bottom-0 inset-x-0 px-3 pb-3 pt-2 w-full z-20 flex-shrink-0 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-[#0b0f17] dark:via-[#0b0f17]/95 dark:to-transparent">
        <div className="max-w-3xl mx-auto flex flex-col gap-2">
          
          {/* شريط الأزرار السريعة للمعلمين فقط فوق مربع الكتابة (متعدد اللغات) */}
          {isTeacherOrAdmin && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 px-1 animate-fade-in">
              <button
                onClick={() => setInput(t('lessonPrompt'))}
                className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-full text-[11px] md:text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>📑</span> {t('mcgrawLesson')}
              </button>
              <button
                onClick={() => setInput(t('presPrompt'))}
                className="px-3 py-1.5 bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 rounded-full text-[11px] md:text-xs font-bold hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>📊</span> {t('mcgrawPres')}
              </button>
            </div>
          )}

          <div className="relative flex items-center bg-slate-100 dark:bg-[#1a1f2e] rounded-full border border-slate-200 dark:border-slate-700/60 shadow-lg px-2.5 md:px-3 py-1 focus-within:border-sky-500 dark:focus-within:border-sky-400 transition-all">
            
            <input
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('input')}
              className="flex-1 bg-transparent border-0 focus:ring-0 py-2.5 md:py-3 px-2 md:px-3 text-slate-900 dark:text-white font-medium outline-none w-full placeholder-slate-400 dark:placeholder-slate-500 text-xs md:text-base"
              disabled={isLoading}
            />

            <button 
              onClick={handleSendMessage} 
              disabled={isLoading || !input.trim()} 
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 disabled:dark:bg-slate-800 text-white flex items-center justify-center transition-all shrink-0 shadow-md ml-1 rtl:rotate-180"
            >
              <SendIcon />
            </button>
          </div>

          {isLoading && (
            <div className="w-[90%] mx-auto h-1 rounded-full overflow-hidden relative bg-slate-200 dark:bg-slate-800 mt-1">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400 animate-[shimmer_1.5s_infinite] w-[200%]"></div>
            </div>
          )}
        </div>
      </div>

      {/* --- تصميم الشهادة العرضية المحدثة والفاخرة للتصدير --- */}
      <div className="fixed left-[-9999px] top-0 pointer-events-none">
          <div ref={certificateRef} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="w-[1123px] min-h-[794px] h-fit bg-gradient-to-br from-white via-slate-50 to-amber-50/20 text-slate-900 relative overflow-hidden flex flex-col font-sans border-[16px] border-solid border-amber-500 shadow-2xl pb-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-bl-full -z-10 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-tr-full -z-10 pointer-events-none"></div>

              <div className="flex justify-between items-center px-12 pt-10 pb-6 border-b-2 border-slate-200">
                  <div className="flex items-center gap-5">
                      <img src="https://www.efipslibrary.online/school-logo.png" className="w-20 h-20 object-contain drop-shadow" alt="EFIPS Logo" crossOrigin="anonymous" />
                      <div>
                          <h3 className="text-xl font-black text-slate-800 tracking-tight">{t('certSchool')}</h3>
                          <h4 className="text-xs font-bold text-amber-700 tracking-widest uppercase mt-0.5" dir="ltr">Emirates Falcon International Private School</h4>
                      </div>
                  </div>
                  <div className="text-left">
                      <div className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-black rounded-full text-base shadow-md border border-amber-400">
                          {t('certChallenge')}
                      </div>
                  </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center px-14 py-6">
                  <h1 className="text-4xl lg:text-5xl font-black text-amber-700 tracking-wide mb-3 uppercase drop-shadow-sm">{t('certTitle')}</h1>
                  <p className="text-xl font-bold text-slate-600 mb-6">{t('certSubtitle')}</p>
                  
                  <div className="mb-4">
                      <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight pb-2 border-b-4 border-amber-500 px-10 inline-block">
                          {winnerData?.name}
                      </h2>
                  </div>
                  <p className="text-2xl font-bold text-slate-600 mb-8">
                      {t('certGrade')} <span className="text-amber-700 font-black">{winnerData?.grade}</span>
                  </p>
                  
                  <div className="bg-white/90 backdrop-blur p-6 rounded-3xl border-2 border-amber-200 w-full text-start relative shadow-sm mb-4">
                      <span className={`absolute -top-4 ${locale === 'ar' ? 'right-10' : 'left-10'} bg-amber-500 text-slate-900 px-6 py-1.5 font-black text-lg border-2 border-amber-400 rounded-full shadow-sm`}>
                          {t('certStory')}
                      </span>
                      <p className={`text-xl leading-[1.8] font-bold text-slate-800 mt-4 ${locale === 'ar' ? 'text-justify' : 'text-left'} whitespace-pre-wrap`}>
                          {winnerData?.content}
                      </p>
                  </div>
              </div>

              <div className="flex justify-between items-end px-14 pt-6 border-t-2 border-slate-200 mt-auto">
                  <div className="text-center w-60">
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{t('certDate')}</p>
                      <p className="text-lg font-black text-slate-800">{winnerData?.date}</p>
                  </div>
                  <div className="text-center flex flex-col items-center flex-1">
                      <div className="w-16 h-16 rounded-full border-2 border-amber-500/30 flex items-center justify-center bg-amber-50/50 mb-1">
                          <span className="text-xl font-black text-amber-600">EFIPS</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('certOfficial')}</p>
                  </div>
                  <div className="text-center w-60">
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{t('certAI')}</p>
                      <p className="text-xl font-black text-amber-700">{t('certSaqr')}</p>
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
