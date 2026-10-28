/**
 * Exact, opt-in public introduction answers for the EFIPS chat interface.
 * They never enter the Saqr model instructions or change any other intent.
 * A question that adds a specific task/topic falls back to the existing AI.
 */
export type SaqrIntroductionKind = 'self' | 'portal' | null;
const normalize = (value:string) => value
  .normalize('NFKC').toLocaleLowerCase()
  .replace(/[\u064b-\u065f\u0670\u0640]/g,'')
  .replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه')
  .replace(/[?!؟.،,:؛"'()[\]{}]/g,' ').replace(/\s+/g,' ').trim();

const portalQueries = [
  /^(?:عرفني (?:عن|علي)|احكي لي عن|اشرح لي|ما هي|ما هو|ايه|ايش|ماذا تقدم|ما(?:ذا)? يقدم|ما هي خدمات|ما خدمات|خدمات|مميزات|وظائف)\s+(?:هذا\s+|هذه\s+|موقع\s+|ال)?(?:الموقع|موقع المكتبه|البوابه|بوابه المعرفه|بوابه المكتبه|موقع efips|موقع المدرسه|موقع صقر|المكتبه الرقميه)(?:\s+(?:وما خدماته|ومميزاته|بالكامل|بالتفصيل))?$/,
  /^(?:ما هي|ما هو|ايه)\s+(?:بوابه المعرفه|موقع المكتبه|البوابه)$/,
  /^(?:what (?:is|does|can)|tell me about|introduce|explain|describe|show me)\s+(?:the\s+|this\s+|our\s+)?(?:efips\s+)?(?:website|site|portal|knowledge portal|library portal|school library website)(?:\s+(?:do|offer|provide|features|services))?$/,
  /^(?:what (?:features|services) (?:does|can) (?:this|the|our) (?:website|portal|site) (?:offer|provide|have)|how does (?:the|this|our) (?:website|portal|site) work)$/,
  /^(?:about|site|portal|website)\s+(?:efips\s+)?(?:library)?$/
];
const selfQueries = [
  /^(?:من انت|انت مين|مين انت|عرف(?:ني)?\s+(?:عن\s+)?نفسك|عرفني بيك|قدم نفسك|ما اسمك|اسمك ايه|ماذا تفعل|ايه اللي بتعمله|بتعمل ايه|ايه خدماتك|ما(?:ذا)?\s+(?:تقدم|تقدر تعمل|يمكنك ان تفعل)|كيف تساعدني|كيف تقدر تساعدني|ايه اللي تقدر تعمله)(?:\s+(?:يا صقر|صقر|بالتفصيل|بالضبط|في المكتبه|لي))?$/,
  /^(?:who are you|what are you|introduce yourself|tell me about yourself|what do you do|what can you do|what are your (?:services|capabilities|features)|how can you help(?: me)?|what is your name)(?:\s+(?:saqr|in the library|exactly|please))?$/,
  /^(?:about saqr|who is saqr|what is saqr|tell me about saqr|عرفني عن صقر|ما هو صقر)$/
];
export const detectSaqrIntroduction=(question:string):SaqrIntroductionKind=>{
  const q=normalize(question);
  if(!q || q.length>150) return null;
  if(portalQueries.some(pattern=>pattern.test(q)))return 'portal';
  if(selfQueries.some(pattern=>pattern.test(q)))return 'self';
  return null;
};
export const renderSaqrIntroduction=(kind:Exclude<SaqrIntroductionKind,null>,language:'ar'|'en'):string=>{
  const ar=language==='ar';
  if(kind==='self')return ar?[
    '## أنا صقر، أمين مكتبة EFIPS الذكي',
    'مساعدك داخل مكتبة **مدرسة صقر الإمارات الدولية الخاصة**. أساعد الطلاب والمعلمين والإدارة في استكشاف المعرفة والقراءة.',
    '**كيف أساعدك؟**',
    '- **البحث في المكتبة الورقية:** أبحث عن الكتب بالعنوان أو المؤلف أو الموضوع، وأوضح الرف والصف من بيانات الفهرس المتاحة.',
    '- **اكتشاف المكتبة الرقمية:** أساعدك في العثور على مصادر الكتب العربية والإنجليزية ومناقشة ما يتوفر منها.',
    '- **اقتراح القراءة:** أرشح كتبًا بحسب عمر القارئ واهتماماته ولغة الواجهة، مع مراعاة بيانات الكتب المتاحة.',
    '- **الحوار حول الكتب:** أناقشك في قصة أو شخصية أو فكرة، وأطرح عليك أسئلة متابعة.',
    '- **دعم المعلمين:** أساعد في التحضير للدروس، وصياغة الأهداف والأنشطة وأوراق العمل، وتنظيم محتوى العروض التقديمية.',
    '- **مساعدة الطلاب على الإبداع:** أشاركهم الأفكار والكتابة الإبداعية وتطوير قصصهم الأولى.',
    '- **الهوية الوطنية:** أرشدك إلى تحديات صقر ومصادر تاريخ الإمارات وتراثها وكتب الهوية الوطنية.',
    '- **خدمات المكتبة:** أشرح كيفية استخدام التحديات، واستديو صقر، وجدول المكتبة، ومتابعة الاستعارات وأهداف القراءة.',
    '',
    'يمكنني المساعدة والشرح، لكن **الحجز وتسجيل الاستعارات ومنح نقاط التحديات** تتم من صفحاتها المخصصة، وليس تلقائيًا من الدردشة.',
    '',
    '**بماذا تحب أن أساعدك اليوم؟**'
  ].join('\n'): [
    '## I’m Saqr, your EFIPS AI Librarian',
    'I’m the library assistant at **Emirates Falcon International Private School (EFIPS)**, helping students, teachers, and administrators discover knowledge.',
    '**What can I help with?**',
    '- **Physical books:** Search by title, author, or topic and find catalogued shelf and row locations.',
    '- **Digital reading:** Discover Arabic and English digital-library resources.',
    '- **Book recommendations:** Explore reading suggestions based on age, interests and available catalog records.',
    '- **Book discussions:** Talk through characters, plots, ideas and follow-up questions.',
    '- **Teacher support:** Draft lesson plans, learning goals, activities, worksheets and presentation outlines.',
    '- **Young writers:** Explore story ideas and develop creative writing.',
    '- **UAE heritage:** Discover national-identity challenges, cultural research and related library books.',
    '- **Library guidance:** Learn about reading challenges, Saqr Studio, bookings, borrowing and monthly reading goals.',
    '',
    'I can guide you, but **submitting bookings, borrowing transactions or awarding challenge points** happens within the relevant website features, not automatically through chat.',
    '',
    '**What would you like to explore today?**'
  ].join('\n');
  return ar?[
    '## بوابة مكتبة مدرسة صقر الإمارات الدولية الخاصة',
    'الموقع: **[www.efipslibrary.com](https://www.efipslibrary.com)**. بوابة مدرسية تجمع الكتب والخدمات والقراءة والإبداع في مكان واحد، مع خدمات تختلف حسب حساب الطالب أو المعلم أو الإدارة.',
    '**ماذا تقدم البوابة؟**',
    '- **[دليل المكتبة الورقية](/#/search):** البحث عن الكتب بالعنوان أو المؤلف أو الموضوع ومعرفة مواقعها على الرفوف والصفوف، بما فيها بيانات الرف 30 المدرجة.',
    '- **[اسأل صقر](/#/smart-search):** البحث والمناقشة واقتراح الكتب، مع مساعدة الطلاب على الكتابة والمعلمين على التخطيط للدروس والعروض.',
    '- **[المكتبة الرقمية](/#/digital-library):** مكتبات وموارد قراءة عربية وإنجليزية.',
    '- **[ركن المبدعين](/#/creators):** أعمال الطلاب والكتابة الإبداعية والمشاركة بالمشاريع الأدبية.',
    '- **تحديات صقر للطلاب:** «بين السطور مع صقر»، و«رتب المكتبة»، و«استديو صقر» ضمن [تحديات صقر](/#/saqr-challenges).',
    '- **[بين السطور مع صقر](/#/saqr-reading-quest):** مسار قراءة واختيار عدد الكتب والإجابة عن أسئلتها، بكتب تتوافق مع لغة الواجهة وفئة المستفيد؛ يظهر للمعلمين بصورة مستقلة.',
    '- **[صقر وهوية وطن](/#/saqr-national-identity):** جواز صقر الثقافي، كنوز لغتنا الإماراتية، محقق ذاكرة وطن وتحدي راية المجد، إلى جانب [كتب الهوية الوطنية](/#/saqr-national-identity/books).',
    '- **[استديو صقر](/#/saqr-studio):** أنشطة التسجيل الصوتي والبودكاست.',
    '- **[جدول المكتبة](/#/schedule):** الاطلاع على أوقات المكتبة وحجز الحصص للمعلمين وفق الصلاحيات.',
    '- **إدارة الاستعارات:** متابعة الكتب المستعارة ومواعيد إرجاعها والتنبيهات الشخصية عند وجودها.',
    '- **أهداف القراءة الشهرية:** متابعة الإنجاز وقائمة الكتب المكتملة.',
    '- **[الاقتراحات](/#/feedback):** مشاركة الآراء والمقترحات لتحسين خدمات المكتبة.',
    '- **لوحة الإدارة:** أدوات الإدارة ومتابعة البيانات للمصرح لهم فقط.',
    '- **[الدليل التفاعلي](/#/tutorial):** شرح مرئي للخدمات بالعربية والإنجليزية دون عرض بيانات المستخدمين.',
    '',
    'تعمل البوابة بالعربية والإنجليزية، وتدعم الهاتف والكمبيوتر والوضع الفاتح والداكن. **تختلف الخدمات المتاحة حسب نوع الحساب والصلاحيات.**'
  ].join('\n'): [
    '## EFIPS School Library Portal',
    '**[www.efipslibrary.com](https://www.efipslibrary.com)** brings together school books, reading, creativity and library services for students, teachers and administrators.',
    '**What does the portal offer?**',
    '- **[Physical book guide](/#/search):** Find books by title, author or subject and check their recorded shelf and row, including catalogued shelf 30 holdings.',
    '- **[Ask Saqr](/#/smart-search):** Library searches, book discussions, recommendations, writing ideas and teacher lesson or presentation support.',
    '- **[Digital library](/#/digital-library):** Arabic and English digital reading resources.',
    '- **[Creators Corner](/#/creators):** Student writing, creative projects and literary contributions.',
    '- **Student [Saqr Challenges](/#/saqr-challenges):** Between the Lines, Organize the Library and Saqr Studio in one activity hub.',
    '- **[Between the Lines with Saqr](/#/saqr-reading-quest):** Choose a number of books, then answer questions. Titles match the interface language and account role; teachers also have a direct home shortcut.',
    '- **[Saqr & National Identity](/#/saqr-national-identity):** Cultural Passport, Emirati Language Treasures, Heritage Detective and Flag Challenge, plus a [national-identity book pavilion](/#/saqr-national-identity/books).',
    '- **[Saqr Studio](/#/saqr-studio):** Podcast and audio-recording activities.',
    '- **[Library schedule](/#/schedule):** Teachers can check periods and submit library bookings.',
    '- **Borrowed books and alerts:** Return dates and relevant personal reminders when records are available.',
    '- **Monthly reading goals:** Track books completed and reading progress.',
    '- **[Feedback](/#/feedback):** Share ideas to improve library services.',
    '- **Administration tools:** Available only to authorized staff.',
    '- **[Interactive tutorial](/#/tutorial):** A bilingual tour using safe sample content.',
    '',
    'The portal supports Arabic and English, responsive screens, and light/dark themes. **Available features depend on account type and permissions.**'
  ].join('\n');
};
