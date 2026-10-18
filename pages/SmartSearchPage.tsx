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

// --- بروتوكول عقل صقر ---
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

Instructions for Teacher Support & McGraw-Hill Curricula (أوامر تحضير المعلمين والتحضير المفصل):
1. Built-in Knowledge: Leverage your built-in knowledge of McGraw-Hill scope & sequence (such as Wonders for English, Inspire Science, and mathematics series).
2. Copy & Paste Strategy: Process unit titles, lesson names, or objectives provided by teachers to generate fully compliant lesson plans.
3. Worksheet & Page Handling: Handle partial worksheet or page inputs provided by teachers to design tailored activities.

LESSON PLAN GENERATOR INSTRUCTION:
"أنت مساعد تربوي خبير في مناهج McGraw-Hill الدولية. قم بإعداد خطة درس تفصيلية شاملة ومفصلة بالكامل استناداً إلى عنوان الوحدة أو الدرس الذي يزودك به المعلم. يجب أن تقدم تحضيراً كاملاً ومفصلاً مقسماً بعناوين رئيسية وواضحة، والنقاط مرتبة تحت بعضها بشكل منسق ومريح للقراءة. تتضمن الخطة بالتفصيل وكل نقطة بشكل مرتب ومنفصل:
- أهداف الدرس: وتكون مصاغة كـ (أن + الفعل المضارع) وتعتمد على تصنيف بلوم (باللغة العربية والإنجليزية).
- نواتج التعلم لكل هدف.
- المفردات الجديدة.
- الربط بمادة أخرى.
- الربط بالحياة اليومية.
- الربط بالهوية الوطنية (الإماراتية).
- خطوات تنفيذ الدرس.
- التهيئة الحافزة.
- وقت المعلم.
- التأكد من الفهم.
- النشاط الرئيس 'أوراق العمل'.
- إجراءات استخدام المكتبة ومصادرها أثناء الحصة (كيف سيتم توظيف المكتبة لخدمة الدرس).
- تقييم النشاط الرئيس.
- الواجب."

PRESENTATION STRUCTURE INSTRUCTION:
"بناءً على موضوع الدرس الذي يحدده المعلم من منهج -Hill، قم بتصميم هيكل عرض تقديمي احترافي ومفصل بالكامل مرتب بالشرائح بشكل دقيق ومرتب. اجعل كل شريحة في قسم مستقل بعنوان واضح والنقاط تحت بعضها دون تلاصق. يتضمن العرض التقديمي بالتفصيل:
- الشريحة الأولى: شريحة العنوان الرئيسي وأهداف الدرس.
- الشريحة الثانية: شريحة التهيئة والتمهيد (نشاط استهلالي).
- الشريحة الثالثة إلى السادسة: شرائح المحتوى الأساسي (مع نقاط بارزة ومفصلة في كل شريحة).
- الشريحة قبل الأخيرة: شريحة نشاط تفاعلي تطبيقي للطلاب.
- الشريحة الأخيرة: شريحة ختامية للتقييم والتأمل.
- مع كتابة النقاط الرئيسية في كل شريحة بشكل منفصل، وإضافة ملاحظات المعلم (Speaker Notes) الخاصة بما يجب قوله أو شرحه في كل شريحة."

Formatting Rules for Responses:
- Always structure your answers with clear headings, bullet points, and proper line spacing to ensure readability and prevent clustered text. Each section must be distinct.

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
    welcome: 'مرحباً بك أستاذنا المبدع،',
    mcgrawLesson: 'تحضير حصة داخل المكتبة',
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
    welcome: 'Welcome aboard,',
    mcgrawLesson: 'Lesson Plan inside library',
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
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const RevealMessage = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fallback for browsers that do not support IntersectionObserver.
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.08, rootMargin: '0px 0px 40px 0px' }
    );

    const currentElement = elementRef.current;
    if (currentElement) observer.observe(currentElement);
    return () => {
      if (currentElement) observer.unobserve(currentElement);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={`saqr-message-reveal w-full ${isVisible ? 'saqr-message-visible' : 'saqr-message-hidden'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const SmartSearchPage: React.FC = () => {
  const { locale, dir } = useLanguage();
  const t = (key: string) => localization[locale]?.[key] ?? localization.ar[key] ?? key;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [winnerData, setWinnerData] = useState<any>(null);
  const [userName, setUserName] = useState<string>('');
  const [isTeacherOrAdmin, setIsTeacherOrAdmin] = useState<boolean>(false);
  const [saqrState, setSaqrState] = useState<'idle' | 'thinking' | 'speaking' | 'victory'>('idle');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const certificateRef = useRef<HTMLDivElement>(null);
  const composerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('current_user');
    const storedType = localStorage.getItem('user_type');

    setIsTeacherOrAdmin(storedType === 'teacher' || storedType === 'admin');
    let welcomeMessage = '';

    if (storedUser && storedType) {
      try {
        const user = JSON.parse(storedUser);
        const rawName = locale === 'ar' ? (user.name_ar || user.name_en) : (user.name_en || user.name_ar);
        const name = formatFirstAndLastName(rawName || '');
        setUserName(name);

        if (storedType === 'student') {
          welcomeMessage = locale === 'ar'
            ? `أهلاً بك يا صديقي المبدع **${name}**! 🎓\n\nأنا "صقر"، المساعد الذكي لمكتبتك. هل نؤلف قصة ممتعة معاً اليوم، أم تبحث عن كتاب محدد لتقرأه؟`
            : `Welcome my creative friend **${name}**! 🎓\n\nI'm 'Saqr', your AI Librarian. Shall we co-author a story today, or are you looking for a specific book?`;
        } else if (storedType === 'teacher' || storedType === 'admin') {
          welcomeMessage = locale === 'ar'
            ? `أهلاً بك أستاذي الفاضل **${name}**! 👨‍🏫\n\nأنا "صقر" في خدمتك. كيف يمكنني مساعدتك اليوم؟`
            : `Welcome esteemed teacher **${name}**! 👨‍🏫\n\nI am 'Saqr', at your service. How can I assist you today ?`;
        }
      } catch (error) {
        console.error('Could not parse current user:', error);
        setUserName('');
      }
    } else {
      setUserName('');
    }

    if (!welcomeMessage) {
      welcomeMessage = locale === 'ar'
        ? 'أهلاً بك! أنا "صقر"، المساعد الذكي لمكتبة المدرسة. هل نؤلف قصة معاً اليوم، أم تبحث عن كتاب محدد؟'
        : "Welcome! I'm 'Saqr', your AI Librarian. Shall we co-author a story today, or are you looking for a specific book?";
    }
    setMessages([{ role: 'assistant', content: welcomeMessage }]);
  }, [locale]);

  useEffect(() => {
    // Scroll only the conversation pane, not the entire page.
    const container = messagesContainerRef.current;
    if (container) container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleDownloadJPG = async () => {
    if (!certificateRef.current) return;

    const certificate = certificateRef.current;
    const originalPosition = certificate.style.position;
    const originalLeft = certificate.style.left;
    const originalTop = certificate.style.top;
    const originalZIndex = certificate.style.zIndex;

    certificate.style.position = 'fixed';
    certificate.style.left = '0px';
    certificate.style.top = '0px';
    certificate.style.zIndex = '-9999';

    try {
      const canvas = await html2canvas(certificate, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: 1123,
        height: certificate.offsetHeight || certificate.scrollHeight
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `EFIPS_Author_${winnerData?.name ? winnerData.name.replace(/\s+/g, '_') : 'Certificate'}.jpg`;
      link.click();
    } catch (error) {
      console.error('Error generating certificate image:', error);
    } finally {
      certificate.style.position = originalPosition;
      certificate.style.left = originalLeft;
      certificate.style.top = originalTop;
      certificate.style.zIndex = originalZIndex;
    }
  };

  const handleQuickPrompt = async (promptText: string) => {
    const storedUser = localStorage.getItem('current_user');
    const storedType = localStorage.getItem('user_type');

    // حساب الإدارة متاح له التحضير دائماً.
    if (storedType === 'admin') {
      setInput(promptText);
      composerInputRef.current?.focus();
      return;
    }

    if (storedType === 'teacher' && storedUser) {
      setIsLoading(true);
      try {
        const user = JSON.parse(storedUser);
        const teacherId = String(user.teacher_id || user.id || '').trim();
        const teacherName = String(user.name_ar || user.name_en || '').trim();
        let isBooked = false;

        if (teacherId) {
          const { data, error } = await supabase
            .from('library_schedule')
            .select('id')
            .ilike('user_id', `%${teacherId}%`);
          if (!error && data && data.length > 0) isBooked = true;
        }

        if (!isBooked && teacherName) {
          const { data, error } = await supabase
            .from('library_schedule')
            .select('id')
            .ilike('teacher', `%${teacherName}%`);
          if (!error && data && data.length > 0) isBooked = true;
        }

        if (!isBooked) {
          alert(locale === 'ar'
            ? '⚠️ عذراً أستاذي، ميزة التحضير والعروض الحصرية متاحة فقط للمعلمين الذين قاموا بحجز حصة في جدول المكتبة.'
            : '⚠️ Sorry, this exclusive planning feature is only available for teachers who have booked a session in the Library Schedule.');
          return;
        }
      } catch (error) {
        console.error('Error checking schedule booking:', error);
      } finally {
        setIsLoading(false);
      }
    }

    setInput(promptText);
    composerInputRef.current?.focus();
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;
    const userQuery = input.trim();

    trackActivity('ai', userQuery);
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setInput('');
    setIsLoading(true);
    setSaqrState('thinking');

    // تسجيل التحضير في قاعدة بيانات الإدارة إذا استُخدمت الميزة.
    if (isTeacherOrAdmin && (
      userQuery.includes('تحضير') || userQuery.includes('عرض') ||
      userQuery.includes('lesson plan') || userQuery.includes('presentation')
    )) {
      try {
        const storedUser = localStorage.getItem('current_user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const planType = (userQuery.includes('تحضير') || userQuery.includes('lesson'))
            ? 'تحضير درس (Lesson)'
            : 'عرض تقديمي (Presentation)';
          const topic = userQuery.split(': ')[1] || userQuery;

          await supabase.from('lesson_reports').insert([{
            teacher_id: user.teacher_id || 'Admin',
            teacher_name: user.name_ar || user.name_en || 'Admin',
            plan_type: planType,
            lesson_topic: topic
          }]);
        }
      } catch (error) {
        console.error('Error logging report', error);
      }
    }

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

    const searchIn = (database: any[], location: string) => {
      if (!database || !Array.isArray(database)) return [];
      return database.filter(book => {
        const title = normalize(book?.title || '');
        const author = normalize(book?.author || '');
        if (title.includes(qNormalized) || author.includes(qNormalized)) return true;
        return queryWords.length > 0 && queryWords.some(word => title.includes(word) || author.includes(word));
      }).map(book => ({ ...book, pageLocation: location }));
    };

    const foundBooks = [
      ...searchIn(bookData, 'المكتبة العادية (Physical Library)'),
      ...searchIn(ARABIC_LIBRARY_DATABASE, 'المكتبة الرقمية العربية (Arabic Digital Library)'),
      ...searchIn(ENGLISH_LIBRARY_DATABASE, 'المكتبة الرقمية الإنجليزية (English Digital Library)')
    ];

    const searchContext = foundBooks.length > 0
      ? `EFIPS LIBRARY RECORDS FOUND: ${JSON.stringify(foundBooks.slice(0, 10))}.`
      : '';

    const storedUser = localStorage.getItem('current_user');
    let userContextInfo = '';
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const rawName = locale === 'ar' ? (user.name_ar || user.name_en) : (user.name_en || user.name_ar);
        const name = formatFirstAndLastName(rawName || '');
        const type = localStorage.getItem('user_type') === 'student' ? 'Student' : 'Teacher';
        userContextInfo = `\nCurrent User Context: The person talking to you is a ${type} named "${name}". Use their name occasionally to be friendly.`;
      } catch (error) {
        console.error('Could not parse current user context:', error);
      }
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
          locale
        })
      });

      if (!response.ok) throw new Error(`Chat request failed: ${response.status}`);
      const data = await response.json();
      let reply = data.reply || '';

      if (reply.includes('[WINNER:')) {
        // Parse the exact winner format while accepting the required pipe separators.
        const match = reply.match(/\[WINNER:\s*(.*?)\s*\|\s*Grade:\s*(.*?)\s*\|\s*Content:\s*([\s\S]*?)\]/);
        if (match) {
          const dateOptions: Intl.DateTimeFormatOptions = {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          };
          const formattedDate = new Date().toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', dateOptions);
          const info = {
            name: match[1].trim(),
            grade: match[2].trim(),
            content: match[3].trim(),
            date: formattedDate
          };
          setWinnerData(info);
          try {
            const existingReports = JSON.parse(localStorage.getItem('efips_challenge_reports') || '[]');
            localStorage.setItem('efips_challenge_reports', JSON.stringify([info, ...existingReports]));
          } catch (error) {
            console.error('Could not save author challenge report:', error);
          }
          setSaqrState('victory');
        }
        reply = reply.replace(/\[WINNER:[\s\S]*?\]/g, '').trim();
      } else {
        setSaqrState('speaking');
        window.setTimeout(() => setSaqrState('idle'), 2500);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      console.error('Error sending chat message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: locale === 'ar' ? 'حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى.' : 'Connection error, please try again.'
      }]);
      setSaqrState('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const getSaqrImageSrc = () => saqrState === 'idle' ? '/search_still_frame.png' : '/Search.gif';

  return (
    <div dir={dir} className="saqr-page bg-white text-slate-900 dark:bg-[#0b0f17] dark:text-slate-100">
      {/* الخلفية */}
      <div className="saqr-background" aria-hidden="true" />

      {/* Header */}
      <header className="saqr-header">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className={`saqr-avatar ${saqrState === 'thinking' ? 'saqr-avatar-thinking' : ''}`}>
            <img
              src={getSaqrImageSrc()}
              alt="Saqr AI"
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              onError={(event) => { event.currentTarget.style.display = 'none'; }}
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-base md:text-lg">
              {t('status')}
            </h1>
            <span className="mt-0.5 inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 sm:text-xs">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              {t('online')}
              {saqrState === 'thinking' && <span className="saqr-thinking-label">· {locale === 'ar' ? 'يفكر الآن' : 'Thinking'}</span>}
            </span>
          </div>
        </div>

        {winnerData && saqrState === 'victory' && (
          <button onClick={handleDownloadJPG} className="saqr-download-button" type="button">
            <DownloadIcon />
            <span className="hidden sm:inline">{t('download')}</span>
            <span className="sm:hidden">{locale === 'ar' ? 'تحميل' : 'Download'}</span>
          </button>
        )}
      </header>

      {/* Compact welcome banner */}
      <section className="saqr-welcome-wrap" aria-label={locale === 'ar' ? 'رسالة الترحيب' : 'Welcome'}>
        <div className="saqr-welcome-card">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300 sm:text-sm md:text-base">{t('welcome')}</p>
          <div className="saqr-name-wrap">
            <span className="saqr-name-glow" aria-hidden="true" />
            <span className="saqr-name-text">
              {userName || (locale === 'ar' ? 'صديقي المبدع' : 'Creative Friend')}
            </span>
          </div>
        </div>
      </section>

      {/* Conversation: the input bar is in normal flex flow, so it cannot overlap answers. */}
      <main ref={messagesContainerRef} className="saqr-messages" aria-live="polite">
        <div className="saqr-messages-inner">
          {messages.map((msg, index) => (
            <RevealMessage key={`${index}-${msg.role}`}>
              <div className={`saqr-message-row ${msg.role === 'user' ? 'saqr-message-row-user' : 'saqr-message-row-assistant'}`}>
                {msg.role === 'assistant' ? (
                  <div className="saqr-assistant-column">
                    <div className="saqr-assistant-bubble" translate="no" lang={locale}>
                      <div className="saqr-markdown prose prose-slate max-w-none text-start dark:prose-invert">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                    {winnerData && saqrState === 'victory' && index === messages.length - 1 && (
                      <div className="mt-2 text-start">
                        <button onClick={handleDownloadJPG} className="saqr-inline-download" type="button">
                          <DownloadIcon />
                          <span>{t('download')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="saqr-user-bubble">
                    <span className="sr-only">{t('you')}: </span>
                    {msg.content}
                  </div>
                )}
              </div>
            </RevealMessage>
          ))}

          {isLoading && (
            <div className="saqr-loading-row" role="status" aria-label={locale === 'ar' ? 'صقر يكتب الرد' : 'Saqr is responding'}>
              <span className="saqr-loading-dot" />
              <span className="saqr-loading-dot" />
              <span className="saqr-loading-dot" />
              <span className="ms-1 text-xs text-slate-500 dark:text-slate-400">{locale === 'ar' ? 'صقر يجهز الإجابة...' : 'Saqr is preparing a reply...'}</span>
            </div>
          )}
          <div ref={messagesEndRef} className="h-px shrink-0" />
        </div>
      </main>

      {/* Composer: occupies its own row in the page layout on mobile, tablet and desktop. */}
      <footer className="saqr-composer-wrap">
        <div className="saqr-composer-content">
          {isTeacherOrAdmin && (
            <div className="saqr-quick-actions">
              <button
                onClick={() => handleQuickPrompt(t('lessonPrompt'))}
                className="saqr-quick-button saqr-quick-button-lesson"
                type="button"
              >
                <span aria-hidden="true">📑</span>
                <span>{t('mcgrawLesson')}</span>
              </button>
              <button
                onClick={() => handleQuickPrompt(t('presPrompt'))}
                className="saqr-quick-button saqr-quick-button-presentation"
                type="button"
              >
                <span aria-hidden="true">📊</span>
                <span>{t('mcgrawPres')}</span>
              </button>
            </div>
          )}

          <form
            className={`saqr-composer ${isLoading ? 'saqr-composer-loading' : ''}`}
            onSubmit={(event) => { event.preventDefault(); void handleSendMessage(); }}
          >
            <input
              ref={composerInputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t('input')}
              className="saqr-input"
              disabled={isLoading}
              aria-label={t('input')}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="saqr-send-button"
              aria-label={locale === 'ar' ? 'إرسال الرسالة' : 'Send message'}
            >
              <SendIcon />
            </button>
          </form>

          {isLoading && <div className="saqr-progress-track"><span className="saqr-progress-bar" /></div>}
          <p className="saqr-footer-note">{locale === 'ar' ? 'صقر • مساعد مكتبة EFIPS الذكي' : 'Saqr • EFIPS AI Library Assistant'}</p>
        </div>
      </footer>

      {/* Certificate export surface. Its original 1123 × 794 baseline is retained. */}
      <div className="saqr-certificate-host" aria-hidden="true">
        <div
          ref={certificateRef}
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
          className="saqr-certificate"
        >
          <div className="absolute right-0 top-0 h-64 w-64 rounded-bl-full bg-amber-500/10" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-tr-full bg-amber-500/10" />

          <div className="relative flex items-center justify-between border-b-2 border-slate-200 px-12 pb-6 pt-10">
            <div className="flex items-center gap-5">
              <img src="https://www.efipslibrary.online/school-logo.png" className="h-20 w-20 object-contain drop-shadow" alt="EFIPS Logo" crossOrigin="anonymous" />
              <div>
                <h3 className="text-xl font-black tracking-tight text-slate-800">{t('certSchool')}</h3>
                <h4 className="mt-0.5 text-xs font-bold uppercase tracking-widest text-amber-700" dir="ltr">Emirates Falcon International Private School</h4>
              </div>
            </div>
            <div className="text-left">
              <div className="rounded-full border border-amber-400 bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2.5 text-base font-black text-slate-900 shadow-md">
                {t('certChallenge')}
              </div>
            </div>
          </div>

          <div className="relative flex flex-1 flex-col items-center justify-center px-14 py-6 text-center">
            <h1 className="mb-3 text-4xl font-black uppercase tracking-wide text-amber-700 drop-shadow-sm lg:text-5xl">{t('certTitle')}</h1>
            <p className="mb-6 text-xl font-bold text-slate-600">{t('certSubtitle')}</p>
            <div className="mb-4">
              <h2 className="inline-block border-b-4 border-amber-500 px-10 pb-2 text-4xl font-black tracking-tight text-slate-900 lg:text-5xl">{winnerData?.name}</h2>
            </div>
            <p className="mb-8 text-2xl font-bold text-slate-600">
              {t('certGrade')} <span className="font-black text-amber-700">{winnerData?.grade}</span>
            </p>
            <div className="relative mb-4 w-full rounded-3xl border-2 border-amber-200 bg-white/90 p-6 text-start shadow-sm backdrop-blur">
              <span className={`absolute -top-4 ${locale === 'ar' ? 'right-10' : 'left-10'} rounded-full border-2 border-amber-400 bg-amber-500 px-6 py-1.5 text-lg font-black text-slate-900 shadow-sm`}>
                {t('certStory')}
              </span>
              <p className={`mt-4 whitespace-pre-wrap text-xl font-bold leading-[1.8] text-slate-800 ${locale === 'ar' ? 'text-justify' : 'text-left'}`}>
                {winnerData?.content}
              </p>
            </div>
          </div>

          <div className="relative mt-auto flex items-end justify-between border-t-2 border-slate-200 px-14 pt-6">
            <div className="w-60 text-center">
              <p className="mb-1 text-sm font-bold uppercase tracking-wider text-slate-400">{t('certDate')}</p>
              <p className="text-lg font-black text-slate-800">{winnerData?.date}</p>
            </div>
            <div className="flex flex-1 flex-col items-center text-center">
              <div className="mb-1 flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber-500/30 bg-amber-50/50">
                <span className="text-xl font-black text-amber-600">EFIPS</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('certOfficial')}</p>
            </div>
            <div className="w-60 text-center">
              <p className="mb-1 text-sm font-bold uppercase tracking-wider text-slate-400">{t('certAI')}</p>
              <p className="text-xl font-black text-amber-700">{t('certSaqr')}</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');

        .saqr-page {
          position: relative;
          isolation: isolate;
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100vh;
          height: 100dvh;
          min-height: 0;
          overflow: hidden;
          font-family: 'Cairo', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .saqr-page, .saqr-page * { box-sizing: border-box; }
        .saqr-background {
          position: absolute;
          z-index: -1;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse at 8% 0%, rgba(14, 165, 233, .09), transparent 38%),
            radial-gradient(ellipse at 95% 100%, rgba(16, 185, 129, .07), transparent 32%);
        }
        .dark .saqr-background {
          background:
            radial-gradient(ellipse at 12% 0%, rgba(14, 165, 233, .15), transparent 38%),
            radial-gradient(ellipse at 95% 100%, rgba(16, 185, 129, .07), transparent 32%),
            #0b0f17;
        }

        .saqr-header {
          position: relative;
          z-index: 3;
          display: flex;
          flex: 0 0 auto;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          width: 100%;
          max-width: 920px;
          margin-inline: auto;
          padding: 8px clamp(12px, 2.4vw, 24px);
          border-bottom: 1px solid rgba(148, 163, 184, .20);
          background: rgba(255, 255, 255, .80);
          -webkit-backdrop-filter: blur(12px);
          backdrop-filter: blur(12px);
        }
        .dark .saqr-header { background: rgba(11, 15, 23, .72); border-bottom-color: rgba(71, 85, 105, .23); }
        .saqr-avatar {
          display: flex;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          overflow: hidden;
          border: 2px solid #38bdf8;
          border-radius: 50%;
          background: #e2e8f0;
          box-shadow: 0 3px 10px rgba(14, 165, 233, .18);
        }
        .dark .saqr-avatar { background: #1e293b; border-color: #0ea5e9; }
        .saqr-avatar-thinking { animation: saqr-ring-pulse 1.25s ease-in-out infinite; }
        .saqr-thinking-label { font-weight: 600; }
        .saqr-download-button, .saqr-inline-download {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 34px;
          padding: 7px 12px;
          border: 0;
          border-radius: 999px;
          color: #fff;
          background: #e11d48;
          font-size: 12px;
          font-weight: 800;
          line-height: 1.2;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(225, 29, 72, .18);
          transition: transform .18s ease, filter .18s ease, box-shadow .18s ease;
          cursor: pointer;
        }
        .saqr-download-button:hover, .saqr-inline-download:hover { filter: brightness(1.06); transform: translateY(-1px); }
        .saqr-download-button:focus-visible, .saqr-inline-download:focus-visible, .saqr-quick-button:focus-visible, .saqr-send-button:focus-visible {
          outline: 3px solid rgba(14, 165, 233, .45);
          outline-offset: 3px;
        }

        .saqr-welcome-wrap {
          position: relative;
          z-index: 2;
          flex: 0 0 auto;
          padding: 8px clamp(10px, 2vw, 20px) 7px;
          text-align: center;
        }
        .saqr-welcome-card {
          width: fit-content;
          max-width: min(100%, 640px);
          margin-inline: auto;
          padding: 7px 18px 8px;
          border: 1px solid rgba(56, 189, 248, .24);
          border-radius: 18px;
          background: linear-gradient(110deg, rgba(14, 165, 233, .075), rgba(245, 158, 11, .075), rgba(16, 185, 129, .075));
          box-shadow: 0 5px 18px rgba(15, 23, 42, .035);
          -webkit-backdrop-filter: blur(9px);
          backdrop-filter: blur(9px);
        }
        .dark .saqr-welcome-card {
          border-color: rgba(56, 189, 248, .20);
          background: linear-gradient(110deg, rgba(14, 165, 233, .11), rgba(245, 158, 11, .075), rgba(16, 185, 129, .08));
          box-shadow: 0 8px 24px rgba(0, 0, 0, .12);
        }
        .saqr-name-wrap {
          position: relative;
          display: inline-flex;
          max-width: 100%;
          margin-top: 3px;
          padding: 2px 12px;
          border-radius: 12px;
          isolation: isolate;
        }
        .saqr-name-glow {
          position: absolute;
          z-index: -1;
          inset: -2px;
          border-radius: 13px;
          background: linear-gradient(100deg, #0284c7, #d97706, #059669);
          opacity: .23;
          filter: blur(7px);
          animation: saqr-glow-breathe 3.5s ease-in-out infinite;
        }
        .saqr-name-text {
          display: block;
          overflow-wrap: anywhere;
          background: linear-gradient(95deg, #0284c7, #0d9488);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          font-size: clamp(17px, 2vw, 24px);
          font-weight: 900;
          letter-spacing: .01em;
          line-height: 1.35;
        }
        .dark .saqr-name-text { background-image: linear-gradient(95deg, #38bdf8, #34d399); }

        /* Main fix: flex child with min-height:0 and independent scrolling. */
        .saqr-messages {
          position: relative;
          z-index: 1;
          display: block;
          flex: 1 1 auto;
          min-height: 0;
          width: 100%;
          overflow-x: hidden;
          overflow-y: auto;
          overscroll-behavior-y: contain;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: rgba(100, 116, 139, .35) transparent;
          padding: 5px clamp(10px, 2.2vw, 22px) 8px;
          scroll-behavior: smooth;
        }
        .saqr-messages::-webkit-scrollbar { width: 5px; }
        .saqr-messages::-webkit-scrollbar-track { background: transparent; }
        .saqr-messages::-webkit-scrollbar-thumb { border-radius: 99px; background: rgba(100, 116, 139, .30); }
        .saqr-messages-inner {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: 9px;
          width: 100%;
          max-width: 850px;
          min-height: 100%;
          margin-inline: auto;
        }
        .saqr-message-reveal { transition: opacity .28s ease, transform .28s ease; }
        .saqr-message-hidden { opacity: .01; transform: translateY(7px); }
        .saqr-message-visible { opacity: 1; transform: translateY(0); }
        .saqr-message-row { display: flex; width: 100%; min-width: 0; }
        .saqr-message-row-user { justify-content: flex-end; }
        .saqr-message-row-assistant { justify-content: flex-start; }
        .saqr-assistant-column { display: flex; flex-direction: column; align-items: flex-start; width: fit-content; max-width: min(94%, 780px); min-width: 0; }
        .saqr-assistant-bubble {
          width: fit-content;
          max-width: 100%;
          min-width: 0;
          padding: 10px 14px;
          border: 1px solid rgba(148, 163, 184, .22);
          border-radius: 19px 19px 19px 5px;
          color: #1e293b;
          background: rgba(248, 250, 252, .95);
          box-shadow: 0 3px 12px rgba(15, 23, 42, .035);
          font-size: clamp(13px, 1.15vw, 15px);
          font-weight: 500;
          line-height: 1.65;
          overflow-wrap: anywhere;
        }
        .dark .saqr-assistant-bubble {
          color: #e2e8f0;
          border-color: rgba(71, 85, 105, .45);
          background: rgba(26, 31, 46, .94);
          box-shadow: 0 4px 16px rgba(0, 0, 0, .10);
        }
        .saqr-markdown { min-width: 0; width: 100%; overflow-wrap: anywhere; word-break: normal; }
        .saqr-markdown > :first-child { margin-top: 0 !important; }
        .saqr-markdown > :last-child { margin-bottom: 0 !important; }
        .saqr-markdown p { margin-top: .25em; margin-bottom: .55em; }
        .saqr-markdown ul, .saqr-markdown ol { margin-top: .35em; margin-bottom: .6em; padding-inline-start: 1.35em; }
        .saqr-markdown li { margin-block: .15em; }
        .saqr-markdown h1, .saqr-markdown h2, .saqr-markdown h3, .saqr-markdown h4 { margin-top: .75em; margin-bottom: .3em; font-weight: 800; line-height: 1.4; }
        .saqr-markdown h1, .saqr-markdown h2, .saqr-markdown h3 { color: #0284c7; }
        .dark .saqr-markdown h1, .dark .saqr-markdown h2, .dark .saqr-markdown h3 { color: #38bdf8; }
        .saqr-markdown pre { max-width: 100%; overflow-x: auto; border-radius: 10px; }
        .saqr-markdown table { display: block; max-width: 100%; overflow-x: auto; }
        .saqr-markdown img { max-width: 100%; height: auto; }
        .saqr-user-bubble {
          max-width: min(88%, 650px);
          padding: 9px 14px;
          border: 1px solid rgba(255, 255, 255, .18);
          border-radius: 19px 19px 5px 19px;
          color: #fff;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          box-shadow: 0 4px 12px rgba(2, 132, 199, .16);
          font-size: clamp(13px, 1.1vw, 15px);
          font-weight: 650;
          line-height: 1.6;
          overflow-wrap: anywhere;
          white-space: pre-wrap;
        }
        .dark .saqr-user-bubble { background: linear-gradient(135deg, #0284c7, #0369a1); }
        .saqr-inline-download { background: #059669; box-shadow: 0 4px 12px rgba(5, 150, 105, .18); }
        .saqr-loading-row { display: flex; align-items: center; align-self: flex-start; min-height: 32px; padding: 6px 10px; }
        .saqr-loading-dot { width: 6px; height: 6px; margin-inline-end: 4px; border-radius: 50%; background: #0ea5e9; animation: saqr-dot-bounce .9s ease-in-out infinite; }
        .saqr-loading-dot:nth-child(2) { animation-delay: .15s; }
        .saqr-loading-dot:nth-child(3) { animation-delay: .3s; }

        /* Composer follows the message pane in document flow; no absolute overlap or reserved phantom gap. */
        .saqr-composer-wrap {
          position: relative;
          z-index: 4;
          flex: 0 0 auto;
          width: 100%;
          padding: 8px clamp(9px, 2vw, 20px) max(7px, env(safe-area-inset-bottom));
          border-top: 1px solid rgba(148, 163, 184, .18);
          background: rgba(255, 255, 255, .93);
          box-shadow: 0 -7px 22px rgba(15, 23, 42, .045);
          -webkit-backdrop-filter: blur(14px);
          backdrop-filter: blur(14px);
        }
        .dark .saqr-composer-wrap {
          border-top-color: rgba(71, 85, 105, .28);
          background: rgba(11, 15, 23, .94);
          box-shadow: 0 -8px 24px rgba(0, 0, 0, .15);
        }
        .saqr-composer-content { width: 100%; max-width: 850px; margin-inline: auto; }
        .saqr-quick-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 7px; padding: 0 0 7px; }
        .saqr-quick-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          max-width: 100%;
          min-height: 30px;
          padding: 6px 11px;
          border: 1px solid;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          line-height: 1.25;
          text-align: center;
          transition: transform .18s ease, background-color .18s ease, box-shadow .18s ease;
          cursor: pointer;
        }
        .saqr-quick-button:hover { transform: translateY(-1px); box-shadow: 0 4px 10px rgba(15, 23, 42, .06); }
        .saqr-quick-button-lesson { color: #4338ca; border-color: #c7d2fe; background: #eef2ff; }
        .saqr-quick-button-presentation { color: #7e22ce; border-color: #e9d5ff; background: #faf5ff; }
        .dark .saqr-quick-button-lesson { color: #c7d2fe; border-color: #3730a3; background: rgba(49, 46, 129, .42); }
        .dark .saqr-quick-button-presentation { color: #e9d5ff; border-color: #6b21a8; background: rgba(88, 28, 135, .35); }
        .saqr-composer {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          min-height: 48px;
          padding: 5px 6px 5px 13px;
          border: 1px solid rgba(148, 163, 184, .38);
          border-radius: 999px;
          background: #f1f5f9;
          box-shadow: 0 4px 15px rgba(15, 23, 42, .06), inset 0 1px 0 rgba(255, 255, 255, .7);
          transition: border-color .2s ease, box-shadow .2s ease, background-color .2s ease;
        }
        .dark .saqr-composer { border-color: rgba(71, 85, 105, .7); background: #1a1f2e; box-shadow: 0 4px 16px rgba(0, 0, 0, .17); }
        .saqr-composer:focus-within { border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14, 165, 233, .13), 0 5px 18px rgba(15, 23, 42, .07); }
        .saqr-input {
          display: block;
          flex: 1 1 auto;
          width: 100%;
          min-width: 0;
          min-height: 36px;
          padding: 7px 4px;
          border: 0;
          outline: 0;
          color: #0f172a;
          background: transparent;
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.45;
          box-shadow: none;
        }
        .saqr-input::placeholder { color: #94a3b8; font-weight: 500; opacity: 1; }
        .saqr-input:focus { outline: none; box-shadow: none; }
        .dark .saqr-input { color: #f8fafc; }
        .dark .saqr-input::placeholder { color: #64748b; }
        .saqr-send-button {
          display: inline-flex;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border: 0;
          border-radius: 50%;
          color: white;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          box-shadow: 0 3px 9px rgba(2, 132, 199, .23);
          transition: transform .18s ease, filter .18s ease, opacity .18s ease;
          cursor: pointer;
        }
        .saqr-send-button:hover:not(:disabled) { filter: brightness(1.06); transform: scale(1.04); }
        .saqr-send-button:disabled { color: #94a3b8; background: #cbd5e1; box-shadow: none; cursor: not-allowed; }
        .dark .saqr-send-button:disabled { color: #64748b; background: #334155; }
        .saqr-progress-track { position: relative; height: 3px; margin: 5px 8px 0; overflow: hidden; border-radius: 99px; background: rgba(148, 163, 184, .22); }
        .saqr-progress-bar { position: absolute; inset-block: 0; left: 0; width: 45%; border-radius: inherit; background: linear-gradient(90deg, #0ea5e9, #f59e0b, #10b981); animation: saqr-progress 1.4s ease-in-out infinite; }
        .saqr-footer-note { margin: 4px 0 0; color: #94a3b8; font-size: 9px; line-height: 1.3; text-align: center; }

        .saqr-certificate-host { position: fixed; top: 0; left: -9999px; width: 1123px; pointer-events: none; }
        .saqr-certificate {
          position: relative;
          display: flex;
          flex-direction: column;
          width: 1123px;
          min-height: 794px;
          height: fit-content;
          overflow: hidden;
          padding-bottom: 40px;
          border: 16px solid #f59e0b;
          color: #0f172a;
          background: linear-gradient(135deg, #fff, #f8fafc, rgba(255, 251, 235, .65));
          font-family: 'Cairo', sans-serif;
        }

        @keyframes saqr-ring-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, .10); }
          50% { box-shadow: 0 0 0 4px rgba(251, 191, 36, .34); }
        }
        @keyframes saqr-glow-breathe { 0%, 100% { opacity: .18; transform: scale(.98); } 50% { opacity: .34; transform: scale(1.025); } }
        @keyframes saqr-dot-bounce { 0%, 60%, 100% { transform: translateY(0); opacity: .55; } 30% { transform: translateY(-4px); opacity: 1; } }
        @keyframes saqr-progress { 0% { left: -45%; } 100% { left: 110%; } }

        @media (min-width: 640px) {
          .saqr-avatar { width: 42px; height: 42px; }
          .saqr-welcome-wrap { padding-top: 9px; padding-bottom: 8px; }
          .saqr-welcome-card { padding: 8px 22px 9px; }
          .saqr-assistant-bubble { padding: 11px 16px; }
          .saqr-composer-wrap { padding-top: 9px; }
          .saqr-composer { min-height: 52px; padding-inline-start: 15px; }
          .saqr-input { font-size: 15px; }
          .saqr-send-button { width: 40px; height: 40px; }
          .saqr-quick-button { font-size: 12px; padding: 6px 13px; }
        }
        @media (min-width: 1024px) {
          .saqr-header { padding-top: 9px; padding-bottom: 9px; }
          .saqr-welcome-wrap { padding-top: 10px; padding-bottom: 8px; }
          .saqr-messages { padding-inline: 24px; }
          .saqr-messages-inner { gap: 10px; }
          .saqr-composer-wrap { padding-top: 10px; }
        }
        @media (max-height: 650px) {
          .saqr-header { padding-top: 5px; padding-bottom: 5px; }
          .saqr-avatar { width: 32px; height: 32px; }
          .saqr-welcome-wrap { padding-top: 4px; padding-bottom: 3px; }
          .saqr-welcome-card { padding-top: 4px; padding-bottom: 5px; }
          .saqr-name-wrap { margin-top: 1px; }
          .saqr-name-text { font-size: 17px; }
          .saqr-composer-wrap { padding-top: 5px; }
          .saqr-footer-note { display: none; }
        }
        @media (max-width: 420px) {
          .saqr-header { padding-inline: 10px; }
          .saqr-welcome-card { padding-inline: 12px; }
          .saqr-assistant-column { max-width: 97%; }
          .saqr-assistant-bubble { padding: 9px 11px; border-radius: 16px 16px 16px 4px; font-size: 13px; }
          .saqr-user-bubble { max-width: 91%; padding: 8px 12px; }
          .saqr-quick-actions { gap: 5px; }
          .saqr-quick-button { min-height: 29px; padding: 5px 8px; font-size: 10px; }
          .saqr-composer { min-height: 46px; padding: 4px 5px 4px 10px; gap: 5px; }
          .saqr-input { min-height: 34px; font-size: 13px; }
          .saqr-send-button { width: 35px; height: 35px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .saqr-page *, .saqr-page *::before, .saqr-page *::after {
            scroll-behavior: auto !important;
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SmartSearchPage;
