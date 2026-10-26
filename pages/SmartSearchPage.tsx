import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../App';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { STORY_IDEAS, storyIdeaAt, isStoryBeginning, detectLearningIntent, researchHasTopic, researchPdfPrompt, saqrLearningInstructions } from '../src/utils/saqrLearning';
import { borrowerIds, deviceReadingKey, filterActiveBorrowings, readingShelfFromDevice, catalogBookSynopsis } from '../src/utils/saqrReaderContext';
import { bookData } from '../api/bookData';
import { searchSaqrBookCatalog } from '../src/utils/saqrCatalogSearch';
import { ARABIC_LIBRARY_DATABASE } from './ArabicLibraryInternalPage';
import { ENGLISH_LIBRARY_DATABASE } from './EnglishLibraryInternalPage';
import { supabase } from '../src/utils/supabase';
import {nationalIdentityBooks, searchNationalIdentityBooks} from '../src/utils/nationalIdentityCatalog';
import { stripSaqrEmoji } from '../src/utils/saqrText';
import { isSaqrCatalogLookup, renderSaqrCatalogAnswer } from '../src/utils/saqrCatalogReply';
import { saqrExtraContext, isNewDiscussion, discussionOpening } from '../src/utils/saqrSafeEnhancements';

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

// Presentation-only formatting for lesson-plan replies. Preserve the original conversation text.
const isLessonPlanRequest = (text: string): boolean =>
  /(?:تحضير\s+(?:درس|حصة)|خطة\s+درس|lesson\s+plan|prepare\s+(?:a\s+)?lesson|lesson\s+preparation)/i.test(text);

const formatLessonPlanDisplay = (content: string): string => {
  // Presentation-only: split inline objectives where the model missed list line breaks.
  // Arabic words are Unicode, so use whitespace/punctuation lookaheads rather than JS \b.
  return content
    .replace(/([^-\n•*])[ \t]+(?=أن\s+(?:يصف|يحلل|يحدد|يشرح|يفسر|يقارن|يستنتج|يطبق|يذكر|يميز|يصنف|يقيم|يقيّم|يناقش|يوضح|يعدد|يستخرج|يستكشف|يصمم|يكتب|يقرأ|يستخدم|يتعرف)(?=\s|[،؛:.,]))/g, '$1\n- ')
    .replace(/([^-\n•*])[ \t]+(?=(?:[Ss]tudents?\s+will\s+be\s+able\s+to|To\s+(?:describe|analyze|identify|explain|compare|evaluate|apply|list|demonstrate|classify))\b)/g, '$1\n- ');
};

const localization: any = {
  ar: {
    input: 'اسأل صقر أو ابحث عن كتاب أو ابدأ قصة مبدعة...',
    status: 'صقر الذكي (EFIPS)',
    online: 'متصل',
    download: 'تحميل شهادة المؤلف الصغير PDF',
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
    lessonPrompt: 'أريد تحضير درس تفصيلي من منهج McGraw-Hill باللغة العربية، مع كتابة كل هدف تعلم وكل نقطة في سطر مستقل ومنفصل عن النقطة التالية، لموضوع: ',
    presPrompt: 'أريد تصميم هيكل عرض تقديمي احترافي لموضوع: '
  },
  en: {
    input: 'Ask Saqr, search for a book or start a story...',
    status: 'Saqr AI Librarian',
    online: 'Online',
    download: 'Download A4 PDF Certificate',
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
    lessonPrompt: 'I want a detailed McGraw-Hill lesson plan entirely in English, with each learning objective and each point on its own separate line, for the topic: ',
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
  const [researchAnswer,setResearchAnswer]=useState<string>('');
  const [researchReady,setResearchReady]=useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [winnerData, setWinnerData] = useState<any>(null);
  const [userName, setUserName] = useState<string>('');
  const [userType, setUserType] = useState<string>('guest');
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
    setUserType(storedType || 'guest');
    let welcomeMessage = '';

    if (storedUser && storedType) {
      try {
        const user = JSON.parse(storedUser);
        const rawName = locale === 'ar' ? (user.name_ar || user.name_en) : (user.name_en || user.name_ar);
        const name = formatFirstAndLastName(rawName || '');
        setUserName(name);

        if (storedType === 'student') {
          welcomeMessage = locale === 'ar'
            ? `أهلاً بك يا صديقي المبدع **${name}**! \n\nأنا "صقر"، المساعد الذكي لمكتبتك. هل نؤلف قصة ممتعة معاً اليوم، أم تبحث عن كتاب محدد لتقرأه؟`
            : `Welcome my creative friend **${name}**! 🎓\n\nI'm 'Saqr', your AI Librarian. Shall we co-author a story today, or are you looking for a specific book?`;
        } else if (storedType === 'teacher' || storedType === 'admin') {
          welcomeMessage = locale === 'ar'
            ? `أهلاً بك أستاذي الفاضل **${name}**! \n\nأنا "صقر" في خدمتك. كيف يمكنني مساعدتك اليوم؟`
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
    // Scroll only the conversation history. The composer stays immediately after the latest turn.
    const container = messagesContainerRef.current;
    if (container) container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleDownloadCertificatePDF = async () => {
    if (!certificateRef.current) return;

    const certificate = certificateRef.current;
    const original = { position:certificate.style.position,left:certificate.style.left,top:certificate.style.top,zIndex:certificate.style.zIndex };
    certificate.style.position='fixed';certificate.style.left='0px';certificate.style.top='0px';certificate.style.zIndex='-9999';
    try {
      if(document.fonts?.ready) await document.fonts.ready;
      await Promise.all(Array.from(certificate.querySelectorAll('img')).map(img => img.complete ? Promise.resolve() : new Promise<void>(resolve => { img.addEventListener('load',()=>resolve(),{once:true});img.addEventListener('error',()=>resolve(),{once:true});setTimeout(resolve,2200); })));
      const canvas=await html2canvas(certificate,{scale:2,backgroundColor:'#ffffff',useCORS:true,allowTaint:false,logging:false,width:794,height:Math.max(1123,certificate.scrollHeight)});
      const pdf=new jsPDF({orientation:'portrait',unit:'mm',format:'a4',compress:true});
      const perPage=Math.floor(canvas.width*(297/210));
      const pages=Math.ceil(canvas.height/perPage);
      for(let i=0;i<pages;i++){
        if(i>0)pdf.addPage();
        const start=i*perPage;
        const h=Math.min(perPage,canvas.height-start);
        const slice=document.createElement('canvas');slice.width=canvas.width;slice.height=perPage;
        const context=slice.getContext('2d');if(!context)throw new Error('Canvas unavailable');
        context.fillStyle='#ffffff';context.fillRect(0,0,slice.width,slice.height);
        context.drawImage(canvas,0,start,canvas.width,h,0,0,canvas.width,h);
        pdf.addImage(slice.toDataURL('image/jpeg',0.93),'JPEG',0,0,210,297,undefined,'FAST');
      }
      const filename=String(winnerData?.name||'Certificate').replace(/[\\/:*?"<>|]/g,'_').slice(0,50);
      pdf.save('EFIPS_Little_Author_'+filename+'.pdf');
    } catch(error) {
      console.error('Certificate PDF export failed:',error);
      alert(locale==='ar'?'تعذر تحميل شهادة PDF. يرجى المحاولة مجددًا.':'Unable to export PDF certificate. Please retry.');
    } finally {
      certificate.style.position=original.position;certificate.style.left=original.left;certificate.style.top=original.top;certificate.style.zIndex=original.zIndex;
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
    setResearchReady(false);

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

    // Exact national-identity collection request: show only recorded physical books.
    if(/ركن\\s+الهوي[ةه]\\s+الوطني[ةه]|national\\s+identity\\s+(?:book\\s+)?corner|(?:كتب|books)\\s+(?:الرف\\s+|on\\s+shelf\\s+)41/i.test(userQuery)){
      const clean=userQuery.replace(/ركن\\s+الهوي[ةه]\\s+الوطني[ةه]|national\\s+identity\\s+(?:book\\s+)?corner|(?:كتب|books)\\s+(?:الرف\\s+|on\\s+shelf\\s+)41/ig,'').replace(/^(?:كتب|ابحث|عن|في|ابحث عن|show|books|find)\\s*/i,'').trim();
      const books=clean?searchNationalIdentityBooks(clean):nationalIdentityBooks;
      const ar=locale==='ar';
      const info=books.length?books.slice(0,12).map((book,i)=>String(i+1)+'. **'+book.title+'** — '+(ar?'المؤلف':'Author')+': '+book.author+' — '+(ar?'الرف':'Shelf')+' '+book.shelf+' / '+(ar?'الصف':'Row')+' '+book.row).join('\\n\\n'):(ar?'لا توجد نتائج مطابقة في ركن الهوية الوطنية.':'No matching national-identity catalog titles.');
      setMessages(prev=>[...prev,{role:'assistant',content:(ar?'## كتب ركن الهوية الوطنية\\n\\n':'## National Identity Book Corner\\n\\n')+info+'\\n\\n'+(ar?'[تصفح كل الكتب في صفحة صقر وهوية وطن](/#/saqr-national-identity)':'[Browse all titles in Saqr & National Identity](/#/saqr-national-identity)')}]);
      setSaqrState('idle');setIsLoading(false);return;
    }
    // Retrieve verified catalog records across Arabic/English subjects and titles.
    // This changes only the book context; Saqr's system prompt and chat flow stay intact.
    const foundBooks = searchSaqrBookCatalog(userQuery, {
      physical: bookData,
      arabic: ARABIC_LIBRARY_DATABASE,
      english: ENGLISH_LIBRARY_DATABASE
    });

    // Offer varied national-identity plots without touching the strict author story flow.
    if(isStoryBeginning(userQuery) && /(?:أفكار|افكار|اقترح|اختار|مواضيع|variety|ideas|topics)/i.test(userQuery)){
      const ideas=STORY_IDEAS.map((idea,i)=>String(i+1)+'. '+idea[locale==='ar'?'ar':'en']).join('\n');
      setMessages(prev=>[...prev,{role:'assistant',content:(locale==='ar'?'اختر فكرة من أفكار قصص الهوية الوطنية، ثم اكتب «تحدي المؤلف الصغير» مع الفكرة التي اخترتها:\n\n':'Choose a UAE story idea, then start Little Author with your choice:\n\n')+ideas}]);
      setIsLoading(false);setSaqrState('idle');return;
    }
    // A factual catalog lookup needs no generative model; keep summaries and all
    // educational/story functions on their existing chat path.
    const initialRole=localStorage.getItem('user_type')||'guest';
    const preIntent=detectLearningIntent(userQuery,initialRole as 'student'|'teacher'|'admin'|'guest',messages);
    if(preIntent==='none' && isSaqrCatalogLookup(userQuery)){
      const answer=renderSaqrCatalogAnswer(userQuery,foundBooks,locale==='ar'?'ar':'en');
      setMessages(prev=>[...prev,{role:'assistant',content:answer}]);
      setSaqrState('idle');
      setIsLoading(false);
      return;
    }

    const safeReader = (() => {
      const roleValue = localStorage.getItem('user_type');
      const role: 'student'|'teacher'|'admin'|'guest' =
        roleValue==='student'||roleValue==='teacher'||roleValue==='admin'?roleValue:'guest';
      let grade: number|null = null;
      try {
        const user = JSON.parse(localStorage.getItem('current_user')||'null');
        const candidate = String(user?.grade ?? user?.grade_level ?? user?.class_grade ?? '');
        const match = candidate.match(/(?:^|\D)(1[0-2]|[1-9])(?:\D|$)/);
        if(match) grade=Number(match[1]);
      } catch { /* No optional reader grade */ }
      return {role,grade};
    })();
    const safeEnhancement = saqrExtraContext({
      question:userQuery,history:messages,role:safeReader.role,
      grade:safeReader.grade,locale:locale==='ar'?'ar':'en',matches:foundBooks
    });

    if (isNewDiscussion(userQuery,messages)) {
      setMessages(prev => [...prev,{role:'assistant',content:discussionOpening(locale==='ar'?'ar':'en')}]);
      setIsLoading(false);
      setSaqrState('idle');
      return;
    }

    const learningIntent=detectLearningIntent(userQuery,safeReader.role,messages);
    if(learningIntent==='schedule'){
      const selectedDay=/(?:الاثنين|الإثنين|الثلاثاء|الأربعاء|الاربعاء|الخميس|الجمعة|monday|tuesday|wednesday|thursday|friday)/i.exec(userQuery)?.[0];
      const period=/(?:الحصة|حصه|period)\\s*([1-8])/i.exec(userQuery)?.[1];
      let status='';
      try {
        const {data,error}=await supabase.from('library_schedule').select('id,teacher,subject,grade').limit(60);
        if(error)throw error;
        const reservations=(data||[]).filter((slot:any)=>slot.teacher);
        const target=selectedDay&&period ? reservations.find((slot:any)=>String(slot.id).endsWith('_'+period) && (String(slot.id).startsWith(selectedDay)||String(slot.id).toLowerCase().startsWith(selectedDay.toLowerCase()))) : null;
        status=selectedDay&&period ? (target
           ? (locale==='ar'?'الحصة المطلوبة تظهر محجوزة بالفعل؛ اختر حصة أخرى.':'That period appears booked; choose another.')
           : (locale==='ar'?'لا يظهر حجز لهذه الحصة في البيانات المقروءة، لكن تأكد من توفرها داخل الجدول قبل الحفظ.':'No matching booking was visible in readable records; confirm availability in the timetable before saving.'))
           : (locale==='ar'?'تحب تحجز يوم إيه ورقم الحصة كام؟':'Which day and period would you like to book?');
      } catch {status=locale==='ar'?'لم أتمكن من تأكيد حالة الحصص حاليًا.':'I could not verify the timetable right now.';}
      setMessages(prev=>[...prev,{role:'assistant',content:locale==='ar'
        ? 'أقدر أساعدك تختار حصة مناسبة. '+status+' افتح [جدول حجز المكتبة](https://www.efipslibrary.com/#/schedule) لإتمام الحجز بنفسك؛ لا يتم حفظ حجز من المحادثة.'
        : 'I can help you choose a library period. '+status+' Use the [library schedule](https://www.efipslibrary.com/#/schedule) to submit it; chat cannot save a booking.'}]);
      setIsLoading(false);setSaqrState('idle');return;
    }
    if(learningIntent==='personal-library'){
      const stored=localStorage.getItem('current_user');
      const user=stored?JSON.parse(stored):{};
      const identifier=String(user.student_id||user.teacher_id||user.id||user.user_id||'').trim();
      let shelf=readingShelfFromDevice(deviceReadingKey(user,safeReader.role),localStorage);
      // Only verified Supabase-authenticated readers may use cloud reading lists.
      const {data:{user:cloudUser}}=await supabase.auth.getUser();
      if(cloudUser){
        const [{data:saved},{data:completed}]=await Promise.all([
          supabase.from('efips_read_later').select('book_key').eq('user_id',cloudUser.id).limit(40),
          supabase.from('efips_reading_completions').select('book_key').eq('user_id',cloudUser.id).limit(40)
        ]);
        const reading=(keys:string[])=>readingShelfFromDevice('efips-saqr-temporary',{getItem:()=>JSON.stringify({saved:keys,completed:keys,goal:shelf.goal})});
        if(saved){shelf={...shelf,saved:reading(saved.map((r:any)=>String(r.book_key))).saved};}
        if(completed){shelf={...shelf,completed:reading(completed.map((r:any)=>String(r.book_key))).completed};}
      }
      let borrowed:{title:string;due:string}[]=[];
      if(identifier && safeReader.role!=='guest'){
        const ids=borrowerIds(user,safeReader.role);
        const sets=await Promise.all(ids.map(id=>supabase.from('borrowings').select('*').eq('user_id',id).limit(25)));
        borrowed=filterActiveBorrowings(sets.flatMap(result=>result.error?[]:result.data||[]));
      }
      const full={...shelf,borrowed};
      const entries=[...borrowed.map(b=>b.title),...shelf.saved.map(b=>b.title)];
      const intro=locale==='ar'?'هذه كتبك المسجلة لديّ حاليًا:\n':'Your recorded library books:\n';
      const response=entries.length?intro+entries.slice(0,12).map((title,i)=>String(i+1)+'. '+title).join('\n')+
       (locale==='ar'?'\n\nيلا نقرأ! قل لي اسم كتاب من القائمة لألخص لك موضوعه من وصف الفهرس، أو أساعدك تناقشه.':'\n\nLet’s read! Name one of these books and I can summarize its catalog description or discuss it with you.')
        :(locale==='ar'?'لم أجد كتبًا محفوظة أو استعارات نشطة يمكن لهذا الحساب قراءتها. أضف كتابًا لقائمة القراءة أو راجع الاستعارات في الصفحة الرئيسية.':'No saved books or active loans were visible to this account. Add a book to the reading list or check Home.');
      setMessages(prev=>[...prev,{role:'assistant',content:response}]);
      setIsLoading(false);setSaqrState('idle');return;
    }
    const learningContext=saqrLearningInstructions(learningIntent,safeReader.role,safeReader.grade,locale==='ar'?'ar':'en');

    const searchContext = foundBooks.length > 0
      ? `EFIPS LIBRARY RECORDS FOUND (relevance-ranked, bilingual topic matching): ${JSON.stringify(foundBooks)}.
When the user asks for books, identify the matching titles exactly as recorded, grouped clearly by physical, Arabic digital and English digital library. For physical books provide the actual shelf (shelf) and row (row); for digital books provide their existing driveLink. Answer in the user's requested language. Do not invent titles, shelves, rows, summaries or links. Some physical-book subject tags are inferred from titles and may be approximate.`
      : 'EFIPS LIBRARY RECORDS FOUND: No verified matching records supplied. Do not invent a library title, shelf, row or digital link.';

    const storedUser = localStorage.getItem('current_user');
    let userContextInfo = '';
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const rawName = locale === 'ar' ? (user.name_ar || user.name_en) : (user.name_en || user.name_ar);
        const name = formatFirstAndLastName(rawName || '');
        const type = localStorage.getItem('user_type') === 'student' ? 'Student' : (localStorage.getItem('user_type') === 'teacher' ? 'Teacher' : 'Administrator');
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
            { role: 'system', content: `${SAQR_ELITE_PROMPT}\n\n${userContextInfo}\n\n${searchContext}${safeEnhancement.context ? '\n\n'+safeEnhancement.context : ''}${learningContext ? '\n\n'+learningContext : ''}${isStoryBeginning(userQuery) ? '\n\nIf the user requests a NEW Little Author story without a specific theme, begin with exactly one short story sentence inspired by this rotating Emirati idea: '+storyIdeaAt(messages.filter(m=>m.role==='user').length,locale==='ar'?'ar':'en')+'. Preserve all established Little Author spelling correction, one-sentence response, ending and certificate instructions.' : ''}` },
            ...messages,
            { role: 'user', content: userQuery }
          ],
          locale
        })
      });

      if (!response.ok) throw new Error(`Chat request failed: ${response.status}`);
      const data = await response.json();
      let reply = data.reply || '';
      // Filter assistant prose only: preserve Markdown, links, author certificates
      // and all of Saqr's existing UI illustrations.
      reply = stripSaqrEmoji(reply);

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

      if(learningIntent==='research'&&researchHasTopic(userQuery)&&reply.trim()){
        setResearchAnswer(reply);
        setResearchReady(true);
        // PDF is offered as a separate download button, leaving the learning question at the end.
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

  const downloadResearchPdf=async()=>{
    if(!researchAnswer)return;
    try{
      const container=document.createElement('div');
      container.setAttribute('dir',locale==='ar'?'rtl':'ltr');
      container.style.cssText='position:fixed;left:-10000px;top:0;width:790px;padding:45px;background:white;color:#172334;font-size:19px;line-height:1.85;white-space:pre-wrap;font-family:Tajawal,Cairo,sans-serif;overflow-wrap:break-word';
      container.textContent=(locale==='ar'?'بحث دراسي - مكتبة مدرسة صقر الإمارات\n\n':'School Research - EFIPS Library\n\n')+researchAnswer;
      document.body.appendChild(container);
      try{
        if(document.fonts?.ready)await document.fonts.ready;
        const canvas=await html2canvas(container,{backgroundColor:'#fff',scale:1.5,useCORS:false});
        const pdf=new jsPDF({unit:'mm',format:'a4'});
        const pageWidth=210,pageHeight=297;
        const totalHeight=canvas.height*pageWidth/canvas.width;
        for(let y=0;y<totalHeight;y+=pageHeight){
          if(y>0)pdf.addPage();
          pdf.addImage(canvas.toDataURL('image/png'),'PNG',0,-y,pageWidth,totalHeight);
        }
        pdf.save('EFIPS_Student_Research.pdf');
      }finally{container.remove();}
    }catch(err){console.error('Research PDF export error',err);alert(locale==='ar'?'تعذر إعداد ملف البحث.':'Research PDF could not be generated.');}
  };

  // The welcome response remains in the conversation context sent to the API,
  // but is shown in the welcome banner instead of being duplicated in the chat.
  const hasConversation = messages.some((message) => message.role === 'user');
  const visibleMessages = hasConversation
    ? messages.filter((message, index) => !(index === 0 && message.role === 'assistant'))
    : [];

  const welcomeTitle = locale === 'ar'
    ? (userType === 'teacher' || userType === 'admin'
        ? 'مرحباً بك أستاذنا الفاضل'
        : userType === 'student'
          ? 'مرحباً يا صديقي'
          : 'مرحباً بك في مكتبة صقر')
    : (userType === 'teacher' || userType === 'admin'
        ? 'Welcome, esteemed teacher'
        : userType === 'student'
          ? 'Hello, my friend'
          : 'Welcome to Saqr Library');

  const composer = (
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
  );

  return (
    <div dir={dir} className="saqr-page bg-white text-slate-900 dark:bg-[#0b0f17] dark:text-slate-100">
      {/* الخلفية */}
      <div className="saqr-background" aria-hidden="true" />

      {/* Compact welcome banner */}
      <section className="saqr-welcome-wrap" aria-label={locale === 'ar' ? 'رسالة الترحيب' : 'Welcome'}>
        <div className="saqr-welcome-card">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300 sm:text-sm md:text-base">{welcomeTitle}</p>
          <div className="saqr-name-wrap">
            <span className="saqr-name-glow" aria-hidden="true" />
            <span className="saqr-name-text">
              {userName || (locale === 'ar' ? 'صديقي المبدع' : 'Creative Friend')}
            </span>
          </div>
        </div>
      </section>

      {/*
        Empty state: a compact visual hero occupies the flexible space, while the composer stays at the bottom.
        Active state: the transcript scrolls independently and the same composer remains available.
      */}
      {!hasConversation ? (
        <main className="saqr-empty-chat">
          <div className="saqr-empty-guidance">
            <div className="saqr-hero-kicker">
              <span className="saqr-hero-kicker-dot" aria-hidden="true" />
              <span>{locale === 'ar' ? 'مساحة للمعرفة والإبداع' : 'A SPACE FOR KNOWLEDGE & CREATIVITY'}</span>
            </div>
            <div className="saqr-empty-orbit">
              <span className="saqr-orbit-ring saqr-orbit-ring-one" aria-hidden="true" />
              <span className="saqr-orbit-ring saqr-orbit-ring-two" aria-hidden="true" />
              <span className="saqr-orbit-spark saqr-orbit-spark-one" aria-hidden="true">✦</span>
              <span className="saqr-orbit-spark saqr-orbit-spark-two" aria-hidden="true">✧</span>
              <img
                src="/search_still_frame.png"
                alt=""
                onError={(event) => { event.currentTarget.style.display = 'none'; }}
              />
            </div>
            <p className="saqr-empty-heading">
              {locale === 'ar' ? 'كيف يمكن لصقر مساعدتك اليوم؟' : 'How can Saqr help you today?'}
            </p>
            <p className="saqr-empty-subheading">
              {locale === 'ar'
                ? 'ابحث عن كتاب، اسأل سؤالاً، أو ابدأ قصة إبداعية.'
                : 'Find a book, ask a question, or start a creative story.'}
            </p>
            <div className="saqr-feature-chips" aria-hidden="true">
              <span>{locale === 'ar' ? 'اكتشف كتاباً' : 'Discover a book'}</span>
              <span>{locale === 'ar' ? 'اسأل صقر' : 'Ask Saqr'}</span>
              <span>{locale === 'ar' ? 'ابتكر قصة' : 'Create a story'}</span>
            </div>
          </div>
          {composer}
        </main>
      ) : (
        <main className="saqr-active-chat">
          <div ref={messagesContainerRef} className="saqr-messages" aria-live="polite">
            <div className="saqr-messages-inner">
              {visibleMessages.map((msg, index) => (
                <RevealMessage key={`${index}-${msg.role}`}>
                  <div className={`saqr-message-row ${msg.role === 'user' ? 'saqr-message-row-user' : 'saqr-message-row-assistant'}`}>
                    {msg.role === 'assistant' ? (
                      <div className="saqr-assistant-column">
                        <div className="saqr-assistant-bubble" lang={locale}>
                          <div className={`saqr-markdown prose prose-slate max-w-none text-start dark:prose-invert ${index > 0 && isLessonPlanRequest(visibleMessages[index - 1]?.content || '') ? 'saqr-lesson-markdown' : ''}`}>
                            <ReactMarkdown>{msg.role === 'assistant' && index > 0 && isLessonPlanRequest(visibleMessages[index - 1]?.content || '') ? formatLessonPlanDisplay(msg.content) : msg.content}</ReactMarkdown>
                          </div>
                        </div>
                        {researchReady && researchAnswer && index === visibleMessages.length - 1 && msg.role==='assistant' && (
                          <button type="button" className="saqr-inline-download mt-3" onClick={()=>void downloadResearchPdf()}>
                            <DownloadIcon /><span>{locale==='ar'?'تحميل البحث PDF':'Download research PDF'}</span>
                          </button>
                        )}
                        {winnerData && saqrState === 'victory' && index === visibleMessages.length - 1 && (
                          <div className="mt-2 text-start">
                            <button onClick={handleDownloadCertificatePDF} className="saqr-inline-download" type="button">
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
                  <span className="ms-1 text-xs text-slate-500 dark:text-slate-400">
                    {locale === 'ar' ? 'صقر يجهز الإجابة...' : 'Saqr is preparing a reply...'}
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} className="h-px shrink-0" />
            </div>
          </div>
          {composer}
        </main>
      )}

      {/* A4 certificate export only; no alteration to Saqr AI or challenge logic. */}
      <div className="saqr-certificate-host" aria-hidden="true">
        <div ref={certificateRef} className="saqr-certificate" dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale}>
          <div className="cert-top-stripe" />
          <header className="cert-header">
            <img src="https://www.efipslibrary.online/school-logo.png" crossOrigin="anonymous" className="cert-logo" alt="EFIPS" />
            <div className="cert-school"><h3>مدرسة صقر الإمارات الدولية الخاصة</h3><p dir="ltr">Emirates Falcon International Private School</p><span>{t('certChallenge')}</span></div>
            <div className="cert-seal" dir="ltr">EFIPS</div>
          </header>
          <main className="cert-body">
            <span className="cert-ornament" aria-hidden="true">✦ ✧ ✦</span>
            <h1>{t('certTitle')}</h1>
            <p className="cert-subtitle">{t('certSubtitle')}</p>
            <h2 className="cert-winner" dir="auto">{winnerData?.name || '—'}</h2>
            <p className="cert-grade">{t('certGrade')} <strong>{winnerData?.grade || '—'}</strong></p>
            <section className="cert-summary"><h3>{locale === 'ar' ? 'ملخص القصة المؤلَّفة' : 'Summary of the Creative Story'}</h3><p dir="auto">{winnerData?.content || '—'}</p></section>
            <p className="cert-commendation">{locale === 'ar' ? 'إبداع يستحق التقدير، وقصة تستحق أن تُروى' : 'An imagination worth celebrating, a story worth sharing'}</p>
          </main>
          <footer className="cert-footer">
            <div><span>{t('certDate')}</span><strong>{winnerData?.date}</strong></div>
            <div className="cert-library" dir="ltr">EFIPS ✦ LIBRARY</div>
            <div><span>{locale === 'ar' ? 'توقيع صقر' : 'Saqr Signature'}</span><strong className="cert-signature">{locale === 'ar' ? 'صقر' : 'Saqr'}</strong><small>{t('certSaqr')}</small></div>
          </footer>
          <div className="cert-bottom-stripe" />
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
          color: #0f172a;
          background: linear-gradient(135deg, #fbfdff 0%, #f3faff 52%, #fffdf5 100%);
          font-family: 'Cairo', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }
        .dark .saqr-page { color: #f1f5f9; background: #0b0f17; }
        .saqr-page, .saqr-page * { box-sizing: border-box; }
        .saqr-background {
          position: absolute;
          z-index: -1;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          background:
            radial-gradient(ellipse at 8% 0%, rgba(14, 165, 233, .12), transparent 38%),
            radial-gradient(ellipse at 95% 100%, rgba(16, 185, 129, .10), transparent 32%),
            radial-gradient(ellipse at 72% 18%, rgba(245, 158, 11, .055), transparent 30%);
        }
        .saqr-background::before,
        .saqr-background::after {
          position: absolute;
          display: block;
          content: '';
          width: clamp(180px, 32vw, 460px);
          aspect-ratio: 1;
          border-radius: 50%;
          filter: blur(58px);
          opacity: .24;
          will-change: transform;
          animation: saqr-ambient-drift 18s ease-in-out infinite alternate;
        }
        .saqr-background::before {
          top: 13%;
          inset-inline-start: -12%;
          background: radial-gradient(circle, rgba(56, 189, 248, .46), rgba(56, 189, 248, 0) 68%);
        }
        .saqr-background::after {
          right: -12%;
          bottom: 3%;
          background: radial-gradient(circle, rgba(16, 185, 129, .30), rgba(16, 185, 129, 0) 68%);
          animation-delay: -8s;
        }
        .dark .saqr-background {
          background:
            radial-gradient(ellipse at 12% 0%, rgba(14, 165, 233, .17), transparent 38%),
            radial-gradient(ellipse at 95% 100%, rgba(16, 185, 129, .09), transparent 32%),
            radial-gradient(ellipse at 72% 18%, rgba(245, 158, 11, .045), transparent 30%),
            #0b0f17;
        }
        .dark .saqr-background::before { opacity: .20; }
        .dark .saqr-background::after { opacity: .16; }

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
          padding: 10px clamp(10px, 2vw, 22px) 8px;
          text-align: center;
        }
        .saqr-welcome-card {
          position: relative;
          width: fit-content;
          max-width: min(100%, 680px);
          margin-inline: auto;
          padding: 9px clamp(16px, 2.2vw, 26px) 10px;
          border: 1px solid rgba(56, 189, 248, .30);
          border-radius: 20px;
          background: linear-gradient(110deg, rgba(255, 255, 255, .76), rgba(240, 249, 255, .84) 43%, rgba(255, 251, 235, .76));
          box-shadow: 0 8px 26px rgba(15, 23, 42, .045), inset 0 1px 0 rgba(255, 255, 255, .82);
          -webkit-backdrop-filter: blur(14px);
          backdrop-filter: blur(14px);
          animation: saqr-card-in .55s cubic-bezier(.2,.75,.25,1) both;
        }
        .dark .saqr-welcome-card {
          border-color: rgba(56, 189, 248, .22);
          background: linear-gradient(110deg, rgba(15, 23, 42, .84), rgba(12, 39, 55, .78) 43%, rgba(69, 49, 15, .22));
          box-shadow: 0 8px 28px rgba(0, 0, 0, .18), inset 0 1px 0 rgba(148, 163, 184, .07);
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

        /* Initial state puts the composer immediately below the greeting. Once chat starts,
           the transcript gets the available height and scrolls independently above the composer. */
        .saqr-empty-chat,
        .saqr-active-chat {
          display: flex;
          flex: 1 1 auto;
          flex-direction: column;
          min-height: 0;
          width: 100%;
          overflow: hidden;
        }
        .saqr-empty-chat { justify-content: space-between; }
        .saqr-active-chat { justify-content: flex-end; }
        .saqr-empty-chat .saqr-composer-wrap { flex: 0 0 auto; }
        .saqr-empty-guidance {
          position: relative;
          isolation: isolate;
          display: flex;
          flex: 1 1 auto;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 120px;
          padding: clamp(8px, 2vh, 20px) 18px clamp(12px, 2.8vh, 28px);
          text-align: center;
          background: radial-gradient(ellipse at center, rgba(14, 165, 233, .075), transparent 67%);
        }
        .saqr-empty-guidance::before {
          position: absolute;
          z-index: -1;
          top: 15%;
          left: 50%;
          width: min(76vw, 480px);
          aspect-ratio: 1;
          border: 1px solid rgba(56, 189, 248, .075);
          border-radius: 50%;
          content: '';
          transform: translateX(-50%);
          pointer-events: none;
        }
        .dark .saqr-empty-guidance { background: radial-gradient(ellipse at center, rgba(14, 165, 233, .10), transparent 68%); }
        .saqr-hero-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          max-width: 100%;
          margin-bottom: clamp(8px, 1.7vh, 16px);
          padding: 6px 12px;
          border: 1px solid rgba(14, 165, 233, .18);
          border-radius: 999px;
          color: #0369a1;
          background: rgba(255, 255, 255, .64);
          box-shadow: 0 4px 14px rgba(15, 23, 42, .035);
          font-size: clamp(9px, 1.05vw, 11px);
          font-weight: 900;
          letter-spacing: .035em;
          animation: saqr-card-in .65s .05s both;
        }
        .dark .saqr-hero-kicker { color: #7dd3fc; border-color: rgba(56, 189, 248, .22); background: rgba(15, 23, 42, .70); }
        .saqr-hero-kicker-dot { width: 6px; height: 6px; flex: 0 0 auto; border-radius: 50%; background: #10b981; box-shadow: 0 0 0 4px rgba(16, 185, 129, .10); }
        .saqr-empty-orbit {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: clamp(76px, 11vh, 116px);
          height: clamp(76px, 11vh, 116px);
          margin-bottom: clamp(10px, 1.8vh, 17px);
          overflow: visible;
          border: 1px solid rgba(56, 189, 248, .42);
          border-radius: 50%;
          background: linear-gradient(145deg, rgba(255, 255, 255, .87), rgba(224, 242, 254, .58));
          box-shadow: 0 0 0 8px rgba(14, 165, 233, .035), 0 0 0 18px rgba(14, 165, 233, .022), 0 12px 34px rgba(15, 23, 42, .075), inset 0 1px 0 rgba(255, 255, 255, .8);
          animation: saqr-orbit-float 5s ease-in-out infinite;
        }
        .dark .saqr-empty-orbit { border-color: rgba(56, 189, 248, .32); background: linear-gradient(145deg, rgba(30, 41, 59, .9), rgba(14, 116, 144, .20)); box-shadow: 0 0 0 8px rgba(14, 165, 233, .045), 0 0 0 18px rgba(14, 165, 233, .025), 0 14px 38px rgba(0, 0, 0, .20); }
        .saqr-empty-orbit img { position: relative; z-index: 2; width: 100%; height: 100%; overflow: hidden; border-radius: 50%; object-fit: cover; }
        .saqr-orbit-ring { position: absolute; z-index: 1; inset: -10px; border: 1px solid rgba(14, 165, 233, .19); border-radius: 50%; pointer-events: none; }
        .saqr-orbit-ring-one { animation: saqr-ring-rotate 16s linear infinite; border-top-color: rgba(14, 165, 233, .56); border-bottom-color: rgba(245, 158, 11, .32); }
        .saqr-orbit-ring-two { inset: -17px; border-style: dashed; border-color: rgba(16, 185, 129, .15); animation: saqr-ring-rotate 24s linear infinite reverse; }
        .saqr-orbit-spark { position: absolute; z-index: 3; color: #d97706; text-shadow: 0 2px 12px rgba(245, 158, 11, .32); line-height: 1; }
        .saqr-orbit-spark-one { top: 5%; inset-inline-end: -15%; font-size: 20px; animation: saqr-sparkle 2.8s ease-in-out infinite; }
        .saqr-orbit-spark-two { bottom: 8%; inset-inline-start: -15%; color: #0ea5e9; font-size: 17px; animation: saqr-sparkle 3.4s .6s ease-in-out infinite; }
        .saqr-empty-heading { margin: 0; color: #1e3a5f; font-size: clamp(16px, 2vw, 23px); font-weight: 900; letter-spacing: -.025em; line-height: 1.45; animation: saqr-card-in .7s .1s both; }
        .dark .saqr-empty-heading { color: #e2e8f0; }
        .saqr-empty-subheading { max-width: 460px; margin: 5px 0 0; color: #64748b; font-size: clamp(11px, 1.2vw, 14px); line-height: 1.75; animation: saqr-card-in .7s .16s both; }
        .dark .saqr-empty-subheading { color: #94a3b8; }
        .saqr-feature-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 7px; margin-top: clamp(10px, 2vh, 18px); animation: saqr-card-in .7s .22s both; }
        .saqr-feature-chips span { padding: 5px 11px; border: 1px solid rgba(148, 163, 184, .22); border-radius: 999px; color: #475569; background: rgba(255, 255, 255, .56); box-shadow: 0 3px 10px rgba(15, 23, 42, .025); font-size: 10px; font-weight: 800; }
        .dark .saqr-feature-chips span { color: #cbd5e1; border-color: rgba(71, 85, 105, .42); background: rgba(15, 23, 42, .62); }
        .saqr-active-chat .saqr-messages { flex: 1 1 auto; }

        /* Scroll only the conversation pane; the composer is directly beneath the latest turn. */
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
          border-radius: 20px 20px 20px 6px;
          color: #1e293b;
          background: linear-gradient(145deg, rgba(255, 255, 255, .98), rgba(248, 250, 252, .94));
          box-shadow: 0 6px 20px rgba(15, 23, 42, .045), inset 0 1px 0 rgba(255, 255, 255, .9);
          font-size: clamp(15px, 1.25vw, 17px);
          font-weight: 500;
          line-height: 1.9;
          overflow-wrap: anywhere;
        }
        .dark .saqr-assistant-bubble {
          color: #e2e8f0;
          border-color: rgba(71, 85, 105, .45);
          background: rgba(26, 31, 46, .94);
          box-shadow: 0 4px 16px rgba(0, 0, 0, .10);
        }
        .saqr-markdown { min-width: 0; width: 100%; overflow-wrap: break-word; word-break: normal; white-space: normal; font-family: 'Tajawal','Cairo',system-ui,sans-serif; font-size: 1rem; letter-spacing: normal; }
        .saqr-markdown > :first-child { margin-top: 0 !important; }
        .saqr-markdown > :last-child { margin-bottom: 0 !important; }
        .saqr-markdown p { margin-top: .5em; margin-bottom: .85em; line-height: 1.95; }
        .saqr-markdown ul, .saqr-markdown ol { margin-top: .35em; margin-bottom: .6em; padding-inline-start: 1.35em; }
        .saqr-markdown li { margin-block: .45em; line-height: 1.9; }
        .saqr-lesson-markdown li { display: list-item; line-height: 1.85; }
        .saqr-lesson-markdown li + li { margin-block-start: .55em; }
        .saqr-lesson-markdown li > p { margin: 0; }
        .saqr-lesson-markdown ul, .saqr-lesson-markdown ol { list-style-position: outside; }

        .saqr-markdown h1, .saqr-markdown h2, .saqr-markdown h3, .saqr-markdown h4 { margin-top: 1.1em; margin-bottom: .6em; font-weight: 800; line-height: 1.55; }
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
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 72%, #0369a1 100%);
          box-shadow: 0 7px 18px rgba(2, 132, 199, .20), inset 0 1px 0 rgba(255, 255, 255, .18);
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
          padding: 9px clamp(9px, 2vw, 24px) max(8px, env(safe-area-inset-bottom));
          border-top: 1px solid rgba(148, 163, 184, .19);
          background: rgba(255, 255, 255, .82);
          box-shadow: 0 -10px 30px rgba(15, 23, 42, .055);
          -webkit-backdrop-filter: blur(20px);
          backdrop-filter: blur(20px);
        }
        .dark .saqr-composer-wrap {
          border-top-color: rgba(71, 85, 105, .28);
          background: rgba(11, 15, 23, .94);
          box-shadow: 0 -8px 24px rgba(0, 0, 0, .15);
        }
        .saqr-composer-content { width: 100%; max-width: 850px; margin-inline: auto; }
        .saqr-empty-chat .saqr-composer-wrap { border-bottom: 1px solid rgba(148, 163, 184, .12); }
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
          padding: 6px 7px 6px 15px;
          border: 1px solid rgba(148, 163, 184, .34);
          border-radius: 22px;
          background: rgba(248, 250, 252, .94);
          box-shadow: 0 6px 22px rgba(15, 23, 42, .07), inset 0 1px 0 rgba(255, 255, 255, .9);
          transition: border-color .22s ease, box-shadow .22s ease, background-color .22s ease, transform .22s ease;
        }
        .dark .saqr-composer { border-color: rgba(71, 85, 105, .7); background: rgba(26, 31, 46, .94); box-shadow: 0 5px 20px rgba(0, 0, 0, .20); }
        .saqr-composer:focus-within { border-color: #0ea5e9; background: #fff; box-shadow: 0 0 0 4px rgba(14, 165, 233, .12), 0 8px 24px rgba(15, 23, 42, .09); transform: translateY(-1px); }
        .dark .saqr-composer:focus-within { background: #111827; }
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

        .saqr-certificate-host { position:fixed;top:0;left:-9999px;width:794px;pointer-events:none; }
        .saqr-certificate { box-sizing:border-box;display:flex;flex-direction:column;position:relative;width:794px;min-height:1123px;height:auto;overflow:visible;padding:55px 56px 48px;border:11px solid #087e72;background:#fff;color:#203549;font-family:'Cairo',Tahoma,Arial,sans-serif;line-height:1.55;letter-spacing:normal;text-rendering:optimizeLegibility; }
        .saqr-certificate[dir='rtl'],.saqr-certificate[dir='rtl'] * { letter-spacing:normal!important;word-spacing:normal!important;font-kerning:normal!important; }
        .saqr-certificate [dir='ltr'] { direction:ltr;unicode-bidi:isolate; }
        .cert-top-stripe,.cert-bottom-stripe { position:absolute;left:0;right:0;height:8px;background:linear-gradient(90deg,#d92332 0 25%,#009c6b 25% 50%,#edbe63 50% 75%,#162c40 75%); }
        .cert-top-stripe {top:0}.cert-bottom-stripe {bottom:0}
        .cert-header {display:flex;gap:17px;align-items:center;border-bottom:2px solid #cde6df;padding-bottom:23px}
        .cert-logo {width:92px;height:92px;object-fit:contain;flex-shrink:0}
        .cert-school {flex:1;text-align:start}.cert-school h3 {font-size:18px;font-weight:900;color:#0b695c;margin:0}
        .cert-school p {font:700 11px Arial,sans-serif;color:#475569;margin:6px 0}
        .cert-school span {display:inline-block;padding:5px 13px;border-radius:18px;background:#e9f7f3;color:#087e72;font-size:13px;font-weight:900}
        .cert-seal {width:70px;height:70px;border-radius:50%;border:3px solid #cba151;display:flex;align-items:center;justify-content:center;color:#a98432;font:900 16px Arial,sans-serif;flex-shrink:0}
        .cert-body {flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;min-height:645px;padding-top:28px}
        .cert-ornament {color:#c89b45;font-size:25px}
        .cert-body h1 {font-size:35px;line-height:1.4;color:#087e72;font-weight:900;margin:12px 0}
        .cert-subtitle {font-size:17px;font-weight:700;color:#475569;margin:3px 0 18px}
        .cert-winner {width:100%;font-size:30px;font-weight:900;border-bottom:3px solid #d5a64c;padding:0 8px 10px;margin:0;overflow-wrap:anywhere}
        .cert-grade {font-size:17px;color:#475569;font-weight:700;margin:16px 0 25px}.cert-grade strong{color:#087e72}
        .cert-summary {box-sizing:border-box;width:100%;min-height:245px;border:2px solid #c5e2da;border-radius:20px;background:#f4faf8;padding:18px 23px 22px;text-align:start}
        .cert-summary h3 {font-size:19px;font-weight:900;color:#087e72;margin:0 0 12px;padding-bottom:8px;border-bottom:1px solid #cde8df}
        .cert-summary p {font-size:16px;font-weight:700;color:#203549;margin:0;line-height:1.9;white-space:pre-wrap;overflow-wrap:anywhere;unicode-bidi:plaintext;text-align:start}
        .cert-commendation {font-size:15px;font-weight:800;color:#ac8738;margin:25px 0 15px}
        .cert-footer {display:flex;align-items:flex-end;justify-content:space-between;gap:14px;border-top:2px solid #cce8df;margin-top:25px;padding-top:22px}
        .cert-footer>div:not(.cert-library) {display:flex;flex-direction:column;align-items:center;text-align:center;gap:5px;width:180px;color:#64748b;font-size:13px;font-weight:700}
        .cert-footer strong {font-size:17px;color:#193447;font-weight:900}.cert-footer small{font-size:11px}
        .cert-library {height:94px;width:94px;border:2px solid #b9dad2;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#087e72;font:900 12px Arial,sans-serif;text-align:center}
        .cert-footer strong.cert-signature {font-family:'Cairo',Tahoma,sans-serif;font-size:36px;color:#087e72;font-style:italic;transform:rotate(-5deg);}
        @keyframes saqr-ring-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, .10); }
          50% { box-shadow: 0 0 0 4px rgba(251, 191, 36, .34); }
        }
        @keyframes saqr-ambient-drift { 0% { transform: translate3d(0, 0, 0) scale(1); } 100% { transform: translate3d(7%, -5%, 0) scale(1.12); } }
        @keyframes saqr-orbit-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes saqr-ring-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes saqr-sparkle { 0%, 100% { opacity: .55; transform: scale(.85) rotate(-8deg); } 50% { opacity: 1; transform: scale(1.12) rotate(10deg); } }
        @keyframes saqr-card-in { from { opacity: 0; transform: translateY(9px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes saqr-glow-breathe { 0%, 100% { opacity: .18; transform: scale(.98); } 50% { opacity: .34; transform: scale(1.025); } }
        @keyframes saqr-dot-bounce { 0%, 60%, 100% { transform: translateY(0); opacity: .55; } 30% { transform: translateY(-4px); opacity: 1; } }
        @keyframes saqr-progress { 0% { left: -45%; } 100% { left: 110%; } }

        @media (min-width: 640px) {

          .saqr-welcome-wrap { padding-top: 10px; padding-bottom: 9px; }
          .saqr-welcome-card { padding: 9px 24px 10px; }
          .saqr-assistant-bubble { padding: 12px 17px; }
          .saqr-composer-wrap { padding-top: 10px; }
          .saqr-composer { min-height: 54px; padding-inline-start: 16px; }
          .saqr-input { font-size: 15px; }
          .saqr-send-button { width: 42px; height: 42px; }
          .saqr-quick-button { font-size: 12px; padding: 7px 14px; }
          .saqr-feature-chips span { font-size: 11px; padding: 6px 13px; }
        }
        @media (min-width: 1024px) {
          /* Keep the desktop welcome, suggestions and composer as one compact group. */
          .saqr-empty-chat { justify-content: center; gap: clamp(12px, 2.5vh, 28px); }
          .saqr-empty-guidance { flex: 0 1 auto; min-height: 0; padding-block: clamp(10px, 2vh, 22px); }
          .saqr-messages-inner { max-width: 1160px; }
          .saqr-assistant-column { max-width: min(96%, 1040px); }
          .saqr-user-bubble { max-width: min(92%, 880px); }
          .saqr-welcome-wrap { padding-top: 10px; padding-bottom: 8px; }
          .saqr-messages { padding-inline: 24px; }
          .saqr-messages-inner { gap: 10px; }
          .saqr-composer-wrap { padding-top: 10px; }
        }
        @media (max-height: 650px) {
          .saqr-welcome-wrap { padding-top: 4px; padding-bottom: 3px; }
          .saqr-welcome-card { padding-top: 4px; padding-bottom: 5px; }
          .saqr-name-wrap { margin-top: 1px; }
          .saqr-name-text { font-size: 17px; }
          .saqr-composer-wrap { padding-top: 5px; }
          .saqr-footer-note { display: none; }
          .saqr-hero-kicker { margin-bottom: 5px; padding-block: 4px; }
          .saqr-empty-orbit { width: 58px; height: 58px; margin-bottom: 7px; }
          .saqr-orbit-ring { inset: -6px; }
          .saqr-orbit-ring-two { inset: -11px; }
          .saqr-feature-chips { margin-top: 6px; }
          .saqr-feature-chips span { padding-block: 3px; }
          .saqr-empty-guidance { padding-top: 4px; padding-bottom: 8px; }
        }
        @media (max-width: 420px) {
          .saqr-welcome-wrap { padding-inline: 8px; }
          .saqr-welcome-card { padding-inline: 12px; border-radius: 16px; }
          .saqr-assistant-column { max-width: 97%; }
          .saqr-assistant-bubble { padding: 9px 11px; border-radius: 16px 16px 16px 4px; font-size: 13px; }
          .saqr-user-bubble { max-width: 91%; padding: 8px 12px; }
          .saqr-quick-actions { gap: 5px; }
          .saqr-quick-button { min-height: 29px; padding: 5px 8px; font-size: 10px; }
          .saqr-composer-wrap { padding-inline: 9px; }
          .saqr-composer { min-height: 46px; padding: 4px 5px 4px 10px; gap: 5px; border-radius: 19px; }
          .saqr-input { min-height: 34px; font-size: 13px; }
          .saqr-send-button { width: 35px; height: 35px; }
          .saqr-empty-guidance { padding-inline: 14px; }
          .saqr-empty-orbit { width: 68px; height: 68px; }
          .saqr-feature-chips { gap: 5px; }
          .saqr-feature-chips span { padding: 4px 8px; font-size: 9px; }
          .saqr-hero-kicker { font-size: 9px; }
        }
        @media (max-width: 340px) {
          .saqr-feature-chips { display: none; }
          .saqr-empty-subheading { max-width: 280px; }
          .saqr-hero-kicker { max-width: calc(100vw - 36px); letter-spacing: 0; }
        }
        @media (max-width: 420px) and (max-height: 650px) {
          .saqr-empty-orbit { width: 52px; height: 52px; margin-bottom: 5px; }
          .saqr-orbit-ring { inset: -5px; }
          .saqr-orbit-ring-two { inset: -9px; }
          .saqr-feature-chips { display: none; }
          .saqr-empty-subheading { margin-top: 2px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .saqr-page *, .saqr-page *::before, .saqr-page *::after {
            scroll-behavior: auto !important;
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }

        /* Clean monochrome canvas: light mode is white; dark mode is pure black. */
        .saqr-page {
          background: #ffffff !important;
          background-image: none !important;
          color: #111827;
        }
        .dark .saqr-page {
          background: #000000 !important;
          background-image: none !important;
          color: #f9fafb !important;
        }
        .saqr-background,
        .saqr-background::before,
        .saqr-background::after {
          display: none !important;
          background: none !important;
          background-image: none !important;
          animation: none !important;
        }

        /* Keep the welcome content, but remove the tinted/glass gradient card. */
        .saqr-welcome-card,
        .dark .saqr-welcome-card {
          background: transparent !important;
          background-image: none !important;
          box-shadow: none !important;
          -webkit-backdrop-filter: none !important;
          backdrop-filter: none !important;
        }
        .saqr-name-glow { display: none !important; animation: none !important; }
        .saqr-name-text {
          background: none !important;
          background-image: none !important;
          color: #0284c7 !important;
          -webkit-text-fill-color: #0284c7 !important;
        }
        .dark .saqr-name-text {
          background: none !important;
          background-image: none !important;
          color: #38bdf8 !important;
          -webkit-text-fill-color: #38bdf8 !important;
        }
        .saqr-empty-guidance,
        .dark .saqr-empty-guidance {
          background: transparent !important;
          background-image: none !important;
        }
        .saqr-empty-guidance::before { display: none !important; content: none !important; }
        .saqr-hero-kicker,
        .dark .saqr-hero-kicker {
          background: transparent !important;
          background-image: none !important;
          box-shadow: none !important;
        }
        .saqr-empty-orbit,
        .dark .saqr-empty-orbit {
          background: transparent !important;
          background-image: none !important;
          box-shadow: none !important;
        }
        /* The concentric rings and sparkles continue orbiting the icon. */
        .saqr-orbit-ring-one { animation-duration: 13s !important; }
        .saqr-orbit-ring-two { animation-duration: 19s !important; }
        .saqr-feature-chips span,
        .dark .saqr-feature-chips span {
          background: transparent !important;
          background-image: none !important;
          box-shadow: none !important;
        }

        /* Message and input surfaces use solid colors, not gradients. */
        .saqr-assistant-bubble {
          background: #f8fafc !important;
          background-image: none !important;
        }
        .dark .saqr-assistant-bubble {
          background: #0b0b0b !important;
          background-image: none !important;
        }
        .saqr-user-bubble,
        .dark .saqr-user-bubble {
          background: #0284c7 !important;
          background-image: none !important;
        }
        .saqr-composer-wrap {
          background: #ffffff !important;
          background-image: none !important;
          box-shadow: none !important;
          -webkit-backdrop-filter: none !important;
          backdrop-filter: none !important;
        }
        .dark .saqr-composer-wrap {
          background: #000000 !important;
          background-image: none !important;
          box-shadow: none !important;
        }
        .saqr-composer {
          background: #ffffff !important;
          background-image: none !important;
          box-shadow: none !important;
        }
        .dark .saqr-composer {
          background: #080808 !important;
          background-image: none !important;
          box-shadow: none !important;
        }
        .saqr-send-button,
        .dark .saqr-send-button {
          background: #0284c7 !important;
          background-image: none !important;
        }
        .saqr-progress-bar {
          background: #0ea5e9 !important;
          background-image: none !important;
        }

      `}</style>
    </div>
  );
};

export default SmartSearchPage;
