/**
 * Narrow, deterministic responses to explicit self-introduction and portal-overview
 * questions only. The original Saqr prompt, AI model, conversation history,
 * educational tools and catalogue search are deliberately left untouched.
 */
export type SaqrIntroductionIntent='assistant'|'portal'|null;
const normalise=(value:string)=>value.normalize('NFKC').toLocaleLowerCase()
  .replace(/[\u064b-\u065f\u0670\u0640]/g,'')
  .replace(/[؟?!.,،؛:]+/g,' ').replace(/\s+/g,' ').trim();
export const detectSaqrIntroduction=(input:string):SaqrIntroductionIntent=>{
  const q=normalise(input);
  if(q.length>135 || q.length<3)return null;
  // Check the site first, so "tell me about the portal" never becomes a
  // personal Saqr biography. Only clear, standalone introduction requests.
  if(/^(?:(?:ما|ماذا) (?:هي|هو|عن|تقدم|تقدمها|وظيفة|خدمات|مميزات|اقسام) )?(?:ال)?(?:بوابه|بوابة|موقع|منصه|منصة)\s*(?:المكتبه|المكتبة|المدرسه|المدرسة|صقر|efips)?\s*(?:وما (?:خدماتها|تقدمه)|وماذا تقدم|وخدماتها)?$/.test(q)
    || /^(?:عرفني|حدثني|اخبرني|اشرح لي|تكلم) (?:عن|على) (?:موقع|ال?بوابة|ال?منصة|موقع المكتبة|بوابة المكتبة)(?: المدرسة)?$/.test(q)
    || /^(?:(?:what is|what does|tell me about|describe|introduce|explain|show me|what can)\s+)(?:the\s+)?(?:efips\s+)?(?:library\s+)?(?:website|portal|platform|school library portal|school library website)(?:\s+(?:do|offer|provide))?$/.test(q)
    || /^(?:what (?:features|services) (?:does|do) (?:the )?(?:library )?(?:portal|website|platform) (?:offer|have|provide))$/.test(q)
    || /^(?:ما (?:خدمات|مميزات|وظائف) (?:الموقع|البوابة|بوابة المكتبة|المنصة))$/.test(q))return 'portal';
  if(/^(?:من انت|انت مين|مين انت|من تكون|عرفني بنفسك|عرف نفسك|من هو صقر|مين صقر|ماذا تفعل|ما الذي تفعله|ماذا تستطيع ان تفعل|كيف تساعدني|ما وظيفتك|ما خدماتك|ايه شغلك|ايه خدماتك|صقر من انت|صقر ماذا تفعل)$/.test(q)
    || /^(?:who are you|what are you|introduce yourself|tell me about yourself|what do you do|what can you do|how can you help me|what are your capabilities|what services do you provide|who is saqr|saqr who are you|saqr what can you do)$/.test(q))return 'assistant';
  return null;
};

const assistantArabic=`## أنا صقر، أمين مكتبة EFIPS الذكي

أنا مساعد مكتبة **مدرسة صقر الإمارات الدولية الخاصة**. أساعد الطلاب والمعلمين في المعرفة والقراءة والأنشطة التعليمية.

- **البحث عن الكتب:** أبحث في فهرس المكتبة الورقية والمكتبتين الرقميتين بالعربية والإنجليزية، وأوضح بيانات الكتاب وموقعه إذا توفرت.
- **اقتراحات القراءة:** أساعدك في اختيار كتب ملائمة لاهتماماتك ومستوى القراءة وحسابك.
- **فهم الكتب ومناقشتها:** أجيب عن أسئلة الكتب، وأساعد في تحليلها ومناقشة شخصياتها وأفكارها بناءً على المعلومات المتاحة.
- **دعم المعلمين:** أساعد في تحضير الدروس والأهداف والأنشطة وأوراق العمل وبناء عروض تقديمية منظمة، وفق صلاحيات الخدمة.
- **دعم المبدعين:** أساعد الطلاب في ابتكار أفكار القصص، وتنمية الكتابة، ومغامرة المؤلف الصغير وما يرتبط بها من توثيق للعمل.
- **الهوية الوطنية:** أرشدك إلى كتب الإمارات ومصادر التراث والتحديات الثقافية الموجودة بالبوابة.
- **التعرف على الخدمات:** أشرح لك أين تجد الاستعارات والتنبيهات والحجوزات والمكتبة الرقمية وتحديات صقر.

**ماذا تحب أن نفعل الآن؟** اذكر كتابًا أو موضوعًا أو نشاطًا وسأساعدك.`;
const assistantEnglish=`## I'm Saqr, your EFIPS AI Librarian

I'm the library and learning assistant at **Emirates Falcon International Private School**. Here's how I can help:

- **Find books:** Search the physical catalogue and Arabic/English digital collections, and give verified shelf and row details when available.
- **Reading recommendations:** Suggest titles suited to your interests, reading level and account.
- **Discuss and understand books:** Explore characters, themes and questions using available source information.
- **Support teachers:** Help draft lesson plans, objectives, classroom activities, worksheets and structured presentation outlines, where permitted.
- **Support young authors:** Brainstorm stories, develop writing and guide the Little Author journey.
- **Explore UAE heritage:** Find Emirati culture books, national-identity resources and related challenges.
- **Navigate the portal:** Explain borrowing reminders, library bookings, digital collections and Saqr Challenges.

**What would you like to explore?** Tell me a book, subject or activity.`;
const portalArabic=`## بوابة مكتبة مدرسة صقر الإمارات الدولية الخاصة — EFIPS

هذه بوابة المكتبة المدرسية للمعرفة والقراءة والإبداع، وتختلف الخدمات المتاحة حسب حساب **الطالب أو المعلم أو الإدارة**.

- **الدخول بحساب EFIPS ID:** خدمات وترحيب مخصصان لكل مستفيد.
- **دليل المكتبة الورقية:** البحث عن الكتب بالعناوين والمؤلفين والموضوعات، مع الرف والصف المسجلين.
- **المكتبة الرقمية:** استكشاف مصادر وكتب إلكترونية بالعربية والإنجليزية.
- **اسأل صقر:** مساعد المكتبة الذكي للبحث، وتوصيات القراءة، ومناقشة الكتب، ودعم الكتابة والتحضير التعليمي.
- **الاستعارات والتنبيهات:** متابعة الكتب المستعارة ومواعيد الإرجاع، والتنبيه إلى البيانات المتاحة للحساب.
- **جدول استخدام المكتبة:** عرض الحصص وحجوزات المعلمين، مع وسائل المتابعة المرتبطة بها.
- **تحدي القراءة الشهري:** تحديد هدف القراءة ومتابعة الكتب المكتملة وقائمة القراءة.
- **بين السطور مع صقر:** يختار المستفيد عدد الكتب، ثم يجيب عن أسئلة من كتب مناسبة للغته وفئته؛ يظهر مستقلًا للمعلمين، وداخل تحديات صقر للطلاب.
- **تحديات صقر للطلاب:** «بين السطور»، «رتب المكتبة»، و«استديو صقر» لتسجيل الأعمال الصوتية.
- **صقر وهوية وطن:** أنشطة ومصادر عن الإمارات، ومنها جواز صقر الثقافي وكنوز لغتنا ومحقق ذاكرة وطن وراية المجد وجناح كتب الهوية.
- **ركن المبدعين:** مساحة الكتابة والمشروعات الأدبية ومشاركة إبداعات الطلاب.
- **التوتوريال وجديدنا:** جولة تشرح خدمات البوابة والأخبار والتحديثات.
- **إدارة النظام:** أدوات محمية للمستخدمين المخولين فقط.

يمكنك زيارة البوابة عبر **www.efipslibrary.com**. أخبرني عن الخدمة التي تهمك وسأشرح كيفية استخدامها.`;
const portalEnglish=`## EFIPS School Library Portal

The **Emirates Falcon International Private School** library portal brings reading, research and creativity together. Access depends on whether you're a **student, teacher or administrator**.

- **Personal EFIPS ID sign-in:** An account-specific welcome and services.
- **Physical library catalogue:** Search titles, authors and subjects, including catalogued shelf and row.
- **Arabic and English digital libraries:** Discover available electronic reading resources.
- **Ask Saqr:** Library search, reading recommendations, book discussion, writing help and educational planning assistance.
- **Borrowed books and notifications:** See available loans, due dates and account-specific reminders.
- **Teacher library schedule:** Check periods, bookings and related calendar features.
- **Monthly reading goals:** Set a target and review your completed reading list.
- **Between the Lines with Saqr:** Choose a book count, then answer content questions from age- and language-appropriate books. Teachers use a Home shortcut; students enter through Saqr Challenges.
- **Student Saqr Challenges:** Between the Lines, Organize the Library and Saqr Studio for audio/podcast creation.
- **Saqr & UAE National Identity:** Cultural Passport, Emirati Language Treasures, Heritage Detective, Flag of Glory and the heritage book pavilion.
- **Creators Corner:** Student stories, writing projects and creative contributions.
- **Tutorial and What's New:** Learn how to use the portal and see its latest updates.
- **Administration:** Protected management tools for authorized accounts.

Visit **www.efipslibrary.com**. Ask me about any feature for a step-by-step explanation.`;
export const saqrIntroductionReply=(intent:Exclude<SaqrIntroductionIntent,null>,locale:'ar'|'en')=>
 intent==='assistant'?(locale==='ar'?assistantArabic:assistantEnglish):(locale==='ar'?portalArabic:portalEnglish);
