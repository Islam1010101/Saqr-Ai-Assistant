import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useLanguage } from '../App';
import FlagDayChallenge from './FlagDayChallenge';

type L = { ar: string; en: string };
type Mode = 'home' | 'passport' | 'language' | 'archive';
type Activity = {
  id: string;
  name: L;
  story: L;
  prompt: L;
  question: L;
  choices: [L, L, L];
  correct: number;
  explanation: L;
  source: string;
};
type Progress = {
  stamps: string[];
  words: string[];
  cases: string[];
  notes: Record<string, string>;
};
const l = (ar: string, en: string): L => ({ ar, en });
const emptyProgress = (): Progress => ({ stamps: [], words: [], cases: [], notes: {} });
const SEVEN_EMIRATES = 'https://u.ae/en/about-the-uae/the-seven-emirates';
const UNESCO_AL_AIN = 'https://whc.unesco.org/en/list/1343';
const UNESCO_SADU = 'https://ich.unesco.org/en/RL/al-sadu-traditional-weaving-skills-in-the-united-arab-emirates-02223';
const UNESCO_AFLAJ = 'https://ich.unesco.org/en/RL/al-aflaj-traditional-irrigation-network-system-in-the-uae-oral-traditions-knowledge-and-skills-of-construction-maintenance-and-equitable-water-distribution-01577';
const UNESCO_MAJLIS = 'https://ich.unesco.org/en/RL/majlis-a-cultural-and-social-space-01076';
const UNESCO_AYYALA = 'https://ich.unesco.org/en/state/united-arab-emirates-AE?cp=AE&lang=en&topic=fr-etat';

const emirates: Activity[] = [
  { id:'abu-dhabi', name:l('أبوظبي','Abu Dhabi'),
    story:l('أبوظبي عاصمة دولة الإمارات. وتضم مدينة العين مواقع تاريخية وواحات وأفلاجًا تشهد على براعة أهل المنطقة في إدارة المياه منذ القدم.','Abu Dhabi is the capital of the UAE. In Al Ain, archaeological sites, oases and falaj irrigation systems tell the story of how communities managed water in the desert.'),
    prompt:l('اقرأ عن واحات العين، وابحث في دليل المكتبة عن كتاب يتناول التراث أو البيئة الصحراوية.','Read about the oases of Al Ain, then look for a library book about heritage or desert environments.'),
    question:l('بماذا ساعدت الأفلاج سكان واحات العين؟','How did aflaj help the people of Al Ain?'),
    choices:[l('توزيع المياه وريّ المزارع','Distributing water to farms'),l('بناء السفن الكبيرة','Building large ships'),l('صناعة الزجاج','Producing glass')],
    correct:0, explanation:l('الأفلاج قنوات تاريخية لتوصيل المياه وتوزيعها، وهي جزء مهم من التراث في العين.','Aflaj are traditional systems for supplying and distributing water and form part of Al Ain’s heritage.'),source:UNESCO_AL_AIN },
  { id:'dubai', name:l('دبي','Dubai'),
    story:l('تجمع دبي بين إرث التجارة البحرية ومعالم المدينة الحديثة. من معالمها المعروفة برج خليفة.','Dubai combines a maritime trading heritage with modern landmarks, including the Burj Khalifa.'),
    prompt:l('قارن بين وصف دبي القديمة ودبي الحديثة، وابحث عن كتاب عن التجارة أو العمارة.','Compare old and modern Dubai and look for a book about trade or architecture.'),
    question:l('أي معلم من المعالم التالية يقع في دبي؟','Which of these landmarks is in Dubai?'),
    choices:[l('جبل حفيت','Jebel Hafeet'),l('برج خليفة','Burj Khalifa'),l('قلب الشارقة','Heart of Sharjah')],
    correct:1, explanation:l('يقع برج خليفة في دبي؛ وهو من أشهر معالمها الحديثة.','The Burj Khalifa is in Dubai and is among its well-known modern landmarks.'),source:SEVEN_EMIRATES },
  { id:'sharjah', name:l('الشارقة','Sharjah'),
    story:l('يضم قلب الشارقة مباني تراثية وأسواقًا وشوارع تعكس جوانب من الحياة الاجتماعية والتجارية القديمة.','The Heart of Sharjah preserves traditional buildings, markets and streets reflecting earlier social and commercial life.'),
    prompt:l('اكتشف لماذا تُعد المباني والأسواق القديمة مصادر لفهم تاريخ المجتمعات.','Explore how historic markets and buildings help us understand communities.'),
    question:l('ما الاسم المرتبط بالمنطقة التراثية في الشارقة؟','What is the name of Sharjah’s heritage district?'),
    choices:[l('قلب الشارقة','Heart of Sharjah'),l('واحة ليوا','Liwa Oasis'),l('مصفوت','Masfout')],
    correct:0, explanation:l('قلب الشارقة منطقة تُعرّف الزوار بتراث المدينة وماضيها.','Heart of Sharjah is a district showcasing the city’s heritage.'),source:SEVEN_EMIRATES },
  { id:'ajman', name:l('عجمان','Ajman'),
    story:l('عجمان أصغر الإمارات السبع من حيث المساحة، وهي جزء من تنوع جغرافية الدولة وحياة أهلها.','Ajman is the smallest of the seven emirates by area, part of the country’s varied geography and communities.'),
    prompt:l('قارن مواقع الإمارات السبع على خريطة، ثم ابحث في الكتب عن جغرافية الدولة.','Compare the seven emirates on a map, then find a book about UAE geography.'),
    question:l('أي إمارة هي الأصغر من حيث المساحة؟','Which emirate is the smallest by area?'),
    choices:[l('الفجيرة','Fujairah'),l('أبوظبي','Abu Dhabi'),l('عجمان','Ajman')],
    correct:2, explanation:l('تذكر البوابة الرسمية لدولة الإمارات أن عجمان هي أصغر الإمارات من حيث المساحة.','The UAE’s official portal identifies Ajman as the smallest emirate by area.'),source:SEVEN_EMIRATES },
  { id:'umm-al-quwain', name:l('أم القيوين','Umm Al Quwain'),
    story:l('للبحر والصيد مكانة في تاريخ أم القيوين، كما في أجزاء أخرى من الساحل الإماراتي.','The sea and fishing have played an important role in Umm Al Quwain’s heritage, as in other coastal communities.'),
    prompt:l('ابحث عن قصة تتناول حياة البحر أو مهن أهل الساحل قديمًا.','Find a story about life at sea or traditional coastal occupations.'),
    question:l('أي نشاط ارتبط باقتصاد أم القيوين وحياتها الساحلية؟','Which activity has been important to Umm Al Quwain’s coastal life?'),
    choices:[l('التزلج على الجليد','Ice skating'),l('صيد الأسماك','Fishing'),l('زراعة الأرز في الثلوج','Growing rice in snow')],
    correct:1, explanation:l('يُعد صيد الأسماك من الأنشطة المرتبطة باقتصاد أم القيوين وتراثها الساحلي.','Fishing has been an important part of Umm Al Quwain’s economy and coastal heritage.'),source:SEVEN_EMIRATES },
  { id:'ras-al-khaimah', name:l('رأس الخيمة','Ras Al Khaimah'),
    story:l('تتنوع الطبيعة في رأس الخيمة بين الجبال والمناطق الساحلية، ما يجعلها مثالًا على تنوع البيئة في الإمارات.','Ras Al Khaimah has both mountains and coastal areas, reflecting the UAE’s varied landscapes.'),
    prompt:l('اقرأ عن تأثير الجبال والسواحل في أنماط الحياة، ثم اختر كتابًا جغرافيًا من الدليل.','Read how mountains and coasts influence people’s lives, then find a geography book.'),
    question:l('أي وصف يناسب طبيعة رأس الخيمة؟','Which description fits Ras Al Khaimah?'),
    choices:[l('جبال وسواحل','Mountains and coastline'),l('جليد طوال العام','Ice throughout the year'),l('لا يوجد بها ساحل','It has no coastline')],
    correct:0, explanation:l('رأس الخيمة من الإمارات التي تجمع تضاريس جبلية وسواحل بحرية.','Ras Al Khaimah features mountainous terrain and a coastline.'),source:SEVEN_EMIRATES },
  { id:'fujairah', name:l('الفجيرة','Fujairah'),
    story:l('تقع الفجيرة كاملة على الساحل الشرقي للدولة، وتُعد الجبال والبحر من ملامح بيئتها.','Fujairah lies entirely on the UAE’s eastern coast, with both mountains and sea shaping its landscape.'),
    prompt:l('ابحث عن موقع الفجيرة على الخريطة، واقرأ عن دور البحر في حياة المجتمع.','Find Fujairah on the map and read about the sea’s role in community life.'),
    question:l('أي إمارة تقع بالكامل على الساحل الشرقي للإمارات؟','Which emirate lies entirely on the UAE’s eastern coast?'),
    choices:[l('دبي','Dubai'),l('أم القيوين','Umm Al Quwain'),l('الفجيرة','Fujairah')],
    correct:2, explanation:l('الفجيرة هي الإمارة الوحيدة الواقعة بالكامل على الساحل الشرقي للدولة.','Fujairah is the only emirate located entirely on the UAE’s eastern coast.'),source:SEVEN_EMIRATES }
];
const words: Activity[] = [
  {id:'sadu',name:l('السدو','Al Sadu'),story:l('السدو حرفة نسج تقليدية تستخدم الخيوط والأشكال الهندسية المستوحاة من البيئة الصحراوية.','Al Sadu is a traditional weaving craft using threads and geometric designs inspired by the desert.'),
    prompt:l('تأمل شكل النسيج، ثم اكتب جملة تصف مهارة الحرفيين في صناعة السدو.','Think about the woven patterns, then write a sentence about the skill of Al Sadu weavers.'),
    question:l('ما معنى السدو في سياق التراث؟','What does Al Sadu refer to?'),
    choices:[l('نوع من الزراعة','A type of farming'),l('حرفة نسج تقليدية','A traditional weaving craft'),l('أداة لقياس الوقت','A timekeeping tool')],correct:1,
    explanation:l('السدو فن نسج تراثي، وترتبط أنماطه وألوانه بالبيئة المحلية.','Al Sadu is a traditional weaving craft whose patterns are linked to the local environment.'),source:UNESCO_SADU},
  {id:'aflaj',name:l('الأفلاج','Aflaj'),story:l('الأفلاج شبكة تقليدية لإيصال المياه وتوزيعها بعدل على الأراضي الزراعية.','Aflaj are traditional channels that deliver and distribute water to agricultural land.'),
    prompt:l('استخدم كلمة «فلج» في جملة توضح أهميته للزراعة.','Use “falaj” in a sentence about its importance to farming.'),
    question:l('ما الوظيفة الأساسية للفلج؟','What is the main purpose of a falaj?'),
    choices:[l('نقل المياه للري','Delivering irrigation water'),l('حفظ الطعام','Preserving food'),l('نسج الأقمشة','Weaving cloth')],correct:0,
    explanation:l('تساعد الأفلاج على نقل المياه للمزارع وفق معرفة متوارثة.','Aflaj carry water to farms through systems built on inherited knowledge.'),source:UNESCO_AFLAJ},
  {id:'majlis',name:l('المجلس','Majlis'),story:l('المجلس مساحة اجتماعية يلتقي فيها الناس لتبادل الأخبار والقصص والنقاشات واستقبال الضيوف.','The majlis is a social gathering place for conversation, stories, exchanging news and welcoming guests.'),
    prompt:l('اكتب جملة تبين أهمية الإنصات واحترام الآخرين في المجلس.','Write a sentence about listening and respecting others in the majlis.'),
    question:l('أي سلوك يتوافق مع آداب المجلس؟','Which behaviour reflects the etiquette of the majlis?'),
    choices:[l('مقاطعة المتحدث','Interrupting speakers'),l('إهمال الضيوف','Ignoring guests'),l('حسن الاستماع والحوار','Listening and respectful dialogue')],correct:2,
    explanation:l('يرتبط المجلس بالتواصل واحترام الآخر ونقل الخبرات بين الأجيال.','The majlis encourages dialogue, mutual respect and the sharing of knowledge across generations.'),source:UNESCO_MAJLIS},
  {id:'ayyala',name:l('العيّالة','Al Ayyala'),story:l('العيّالة فن أداء شعبي جماعي يرتبط بالاحتفالات والمناسبات، ويُعد من أشكال التراث الثقافي غير المادي.','Al Ayyala is a traditional group performing art associated with celebrations and part of the region’s intangible cultural heritage.'),
    prompt:l('اكتب جملة تربط بين الفن الشعبي وحفظ التراث للأجيال الجديدة.','Write a sentence connecting folk performances with passing heritage to new generations.'),
    question:l('إلى أي نوع من التراث تنتمي العيّالة؟','What type of heritage does Al Ayyala represent?'),
    choices:[l('فن أداء تقليدي','Traditional performing art'),l('نظام ري زراعي','Agricultural irrigation system'),l('أداة غوص','Diving equipment')],correct:0,
    explanation:l('العيّالة من فنون الأداء التراثية المدرجة لدى اليونسكو.','Al Ayyala is a traditional performing art recognized by UNESCO.'),source:UNESCO_AYYALA},
  {id:'oasis',name:l('الواحة','Oasis'),story:l('الواحة مساحة خضراء في بيئة جافة تتوافر فيها المياه وتُمارس فيها الزراعة، كما في واحات العين.','An oasis is a green area in an arid region where water supports agriculture, as seen in Al Ain.'),
    prompt:l('صف في جملة كيف ساعدت الواحات المجتمعات في البيئة الصحراوية.','Describe how oases have supported communities in arid landscapes.'),
    question:l('لماذا كانت الواحات مهمة تاريخيًا؟','Why were oases historically important?'),
    choices:[l('لأنها بلا ماء','Because they have no water'),l('لتوافر المياه والزراعة','Because they supported water and farming'),l('لأنها مغطاة بالثلج','Because they are covered in snow')],correct:1,
    explanation:l('ساعدت مصادر المياه والري على قيام الزراعة والاستقرار حول الواحات.','Water and irrigation helped communities farm and settle around oases.'),source:UNESCO_AL_AIN}
];
const cases: Activity[] = [
  {id:'water-evidence',name:l('سرّ مياه العين','The Water Trail'),story:l('ملف بحث تدريبي: تذكر مواقع العين التاريخية قنوات للريّ وآثارًا للاستقرار والزراعة في الصحراء. هذه بطاقة تعليمية مُلخّصة وليست وثيقة أرشيفية أصلية.','Practice research file: Al Ain’s heritage sites include irrigation channels and evidence of desert settlement and farming. This is an educational summary, not an original archival document.'),
    prompt:l('اقرأ ملخص اليونسكو، وحدد المعلومة التي تؤيد استنتاجك.','Read the UNESCO summary and identify the evidence behind your conclusion.'),
    question:l('ما الاستنتاج الذي تدعمه الأدلة المذكورة؟','Which conclusion is supported by this evidence?'),
    choices:[l('اعتمد السكان على تقنيات إدارة المياه','People developed water-management techniques'),l('لم تُعرف الزراعة في المنطقة','Agriculture was unknown in the region'),l('لم يكن هناك استقرار بشري','Nobody settled in the region')],correct:0,
    explanation:l('آثار الأفلاج والواحات تدعم وجود معرفة بإدارة المياه واستقرار زراعي.','The aflaj and oases provide evidence of water management and settled farming.'),source:UNESCO_AL_AIN},
  {id:'weaving-evidence',name:l('رسالة في خيوط السدو','Patterns of Memory'),story:l('ملف بحث تدريبي: تذكر اليونسكو دور الحرفيات والتعلّم بين الأجيال في استمرار نسج السدو. هذا وصف تعليمي مستند إلى مصدر، وليس صورة لوثيقة أصلية.','Practice research file: UNESCO describes the role of weavers and intergenerational learning in maintaining Al Sadu. This is a sourced teaching text, not a scan of an archival record.'),
    prompt:l('افتح المصدر وتتبّع كيف تُنقل مهارات السدو بين الأجيال.','Open the source and trace how weaving knowledge is passed between generations.'),
    question:l('ما الدليل الأقوى على أن السدو تراث حيّ؟','What best shows that Al Sadu is a living heritage?'),
    choices:[l('توقف الجميع عن ممارسته','Everyone stopped practising it'),l('تُعلَّم المهارة للأجيال الجديدة','The skill is taught to new generations'),l('لا توجد أنماط مميزة','It has no recognizable patterns')],correct:1,
    explanation:l('توارث الحرفة وممارستها ونقل المعرفة هو ما يدعم استمرار هذا التراث.','Practice and the transmission of knowledge to younger generations help keep the craft alive.'),source:UNESCO_SADU},
  {id:'source-evidence',name:l('من أين نعرف؟','Check the Source'),story:l('ملف بحث تدريبي: تريد التحقق من أسماء الإمارات السبع ومواقعها بدل الاعتماد على معلومة مجهولة المصدر.','Practice research file: You need to verify the names and geography of the seven emirates rather than trusting an unattributed post.'),
    prompt:l('افتح البوابة الرسمية واقرأ قائمة الإمارات السبع ثم قارنها بمصدر آخر عند الحاجة.','Open the official UAE portal, read the list of seven emirates and compare it with another source if needed.'),
    question:l('أي مصدر أنسب للتحقق من القائمة الرسمية للإمارات؟','Which is the best source for verifying the official list of emirates?'),
    choices:[l('رسالة بلا مؤلف','An unsigned message'),l('تعليق مجهول على صورة','An anonymous image comment'),l('البوابة الرسمية لحكومة الإمارات','The official UAE Government portal')],correct:2,
    explanation:l('اختيار مصدر رسمي محدد قابل للتحقق مهارة أساسية من مهارات البحث المكتبي.','Using an identifiable, verifiable official source is an important library research skill.'),source:SEVEN_EMIRATES}
];
const activities: Record<Exclude<Mode,'home'>, Activity[]> = {passport: emirates,language: words,archive:cases};
const progressField: Record<Exclude<Mode,'home'>, 'stamps'|'words'|'cases'> = {passport:'stamps',language:'words',archive:'cases'};
const readSaved = (key: string): Progress => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null');
    if (!value || typeof value !== 'object') return emptyProgress();
    const valid = (arr: unknown, items: Activity[]) => Array.isArray(arr) ?
      Array.from(new Set(arr.filter((item): item is string => typeof item === 'string' && items.some(entry=>entry.id === item)))) : [];
    const notes: Record<string,string> = {};
    if (value.notes && typeof value.notes === 'object') {
      for (const entry of words) if (typeof value.notes[entry.id] === 'string') notes[entry.id] = value.notes[entry.id].slice(0,180);
    }
    return {stamps:valid(value.stamps,emirates),words:valid(value.words,words),cases:valid(value.cases,cases),notes};
  } catch { return emptyProgress(); }
};
const Icon: React.FC<{kind:'book'|'stamp'|'weave'|'document'|'check'|'arrow'|'lock'; className?:string}> = ({kind,className='w-7 h-7'}) => {
  const shared = {className,viewBox:'0 0 48 48',fill:'none',stroke:'currentColor',strokeWidth:2.4,strokeLinecap:'round' as const,strokeLinejoin:'round' as const,'aria-hidden':true as const};
  if(kind==='book') return <svg {...shared}><path d="M24 11C18 7 11 7 5 9v29c7-2 14-1 19 3 5-4 12-5 19-3V9c-6-2-13-2-19 2Z"/><path d="M24 11v30M11 17c3-.5 6-.2 9 1M28 18c3-1 6-1.2 9-.8M11 24c3-.5 6 0 9 1M28 25c3-1 6-1.2 9-.8"/></svg>;
  if(kind==='stamp') return <svg {...shared}><path d="M16 25c2-4 2-8 1-11a7 7 0 0 1 14 0c-1 3-1 7 1 11l5 4v5H11v-5l5-4ZM8 38h32v5H8z"/><path d="m20 17 4 4 5-6"/></svg>;
  if(kind==='weave') return <svg {...shared}><path d="M6 8h36v32H6zM6 16h36M6 32h36M14 8v32M30 8v32M22 8v32M38 8v32"/><path d="m14 24 8-8 8 8-8 8-8-8Z"/></svg>;
  if(kind==='document') return <svg {...shared}><path d="M12 5h17l9 9v29H12zM29 5v10h9M18 23h14M18 29h14M18 35h9"/><circle cx="31" cy="36" r="7" fill="currentColor" fillOpacity=".17"/><path d="m36 41 7 6"/></svg>;
  if(kind==='check') return <svg {...shared}><circle cx="24" cy="24" r="19"/><path d="m14 24 7 7 13-15"/></svg>;
  if(kind==='lock') return <svg {...shared}><rect x="11" y="21" width="26" height="22" rx="4"/><path d="M17 21v-7a7 7 0 0 1 14 0v7M24 30v5"/></svg>;
  return <svg {...shared}><path d="M6 24h36m-12-12 12 12-12 12"/></svg>;
};
const HeritageArt = () => <svg viewBox="0 0 350 255" className="w-full max-w-[360px] drop-shadow-xl" fill="none" aria-hidden="true">
  <defs><linearGradient id="desert" x1="0" x2="1"><stop stopColor="#D5AD6F"/><stop offset="1" stopColor="#F2DBA4"/></linearGradient></defs>
  <circle cx="261" cy="67" r="44" fill="#E8B65C" opacity=".75"/>
  <path d="M5 195Q79 151 144 187T350 180v75H5Z" fill="#B98250" opacity=".45"/>
  <path d="M0 218Q78 183 149 220T350 211v44H0Z" fill="url(#desert)"/>
  <path d="M75 191V83m0 0c-40-16-49-38-45-55 23 2 40 14 45 55Zm0 0c8-48 27-58 46-59-1 25-13 41-46 59Zm0 0c-17-36-5-58 12-74 12 22 9 41-12 74Z" stroke="#125845" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M42 203h142V126l-70-48-72 48v77Z" fill="#F3E3C0" stroke="#86643D" strokeWidth="4"/>
  <path d="M42 128h142M65 147h18v26H65zm77 0h18v26h-18z" stroke="#86643D" strokeWidth="3"/>
  <path d="M101 203v-49a17 17 0 0 1 34 0v49" fill="#A36A40"/>
  <path d="M202 209h119V95l-60-28-59 28v114Z" fill="#0C624E" stroke="#E8C78D" strokeWidth="4"/>
  <path d="M202 96h119M221 118h24v28h-24zm53 0h24v28h-24z" fill="#F8F2D9"/>
  <path d="M250 209v-38a13 13 0 0 1 26 0v38" fill="#F8F2D9"/>
  <path d="M15 226h320" stroke="#9A583B" strokeWidth="4" strokeLinecap="round"/>
  <path d="M12 15h93m-79 0 10-9 10 9 10-9 10 9 10-9 10 9" stroke="#CF8F53" strokeWidth="4"/>
  <path d="M248 239h72" stroke="#0C624E" strokeWidth="5" strokeDasharray="9 6"/>
</svg>;

const NationalIdentityPage: React.FC = () => {
  const {locale,dir} = useLanguage();
  const lang: 'ar'|'en' = locale === 'ar' ? 'ar' : 'en';
  const tr = (x:L) => x[lang];
  const [identity] = useState(() => {
    try {
      if (localStorage.getItem('user_type') !== 'student') return '';
      const user = JSON.parse(localStorage.getItem('current_user') || 'null');
      return typeof user?.student_id === 'string' || typeof user?.student_id === 'number'
        ? String(user.student_id).trim() : '';
    } catch { return ''; }
  });
  const storageKey = useMemo(() => 'efips-national-identity-v1:student:' + identity, [identity]);
  const [progress,setProgress] = useState<Progress>(() => identity ? readSaved(storageKey) : emptyProgress());
  const [mode,setMode] = useState<Mode>('home');
  const [flagChallengeOpen, setFlagChallengeOpen] = useState(false);
  const [index,setIndex] = useState(0);
  const [chosen,setChosen] = useState<number|null>(null);
  useEffect(() => {
    if (!identity) return;
    try { localStorage.setItem(storageKey,JSON.stringify(progress)); } catch { /* Reading tasks still work without storage. */ }
  },[storageKey,identity,progress]);
  if (!identity) return <Navigate to="/home" replace />;
  // Render the existing game unchanged, with its built-in close callback and student rewards.
  if (flagChallengeOpen) return <FlagDayChallenge onClose={() => setFlagChallengeOpen(false)} />;

  const currentMode: Exclude<Mode,'home'> = mode === 'home' ? 'passport' : mode;
  const entries = activities[currentMode];
  const item = entries[index] || entries[0];
  const completedIds = progress[progressField[currentMode]];
  const done = completedIds.includes(item.id);
  const selectedCorrect = chosen === item.correct;
  const totalCompleted = progress.stamps.length + progress.words.length + progress.cases.length;
  const go = (next: Mode) => { setMode(next);setIndex(0);setChosen(null); };
  const selectEntry = (nextIndex: number) => {setIndex(nextIndex);setChosen(null);};
  const submitAnswer = (answer: number) => {
    setChosen(answer);
    if (answer !== item.correct) return;
    const field = progressField[currentMode];
    setProgress(prev => prev[field].includes(item.id) ? prev :
      {...prev,[field]:[...prev[field],item.id]});
  };
  const modules = [
    {id:'passport' as const,icon:'stamp' as const,title:l('جواز صقر الثقافي','Saqr Cultural Passport'),desc:l('اكتشف الإمارات السبع، واقرأ حكاية كل إمارة واجمع ختمها.','Explore all seven emirates, read their stories and collect their stamps.'),total:emirates.length,count:progress.stamps.length,color:'from-emerald-700 to-teal-600'},
    {id:'language' as const,icon:'weave' as const,title:l('كنوز لغتنا الإماراتية','Treasures of Emirati Language'),desc:l('تعرّف على مفردات التراث واستعملها في جمل من تأليفك.','Discover heritage terms and use them in your own sentences.'),total:words.length,count:progress.words.length,color:'from-amber-600 to-orange-600'},
    {id:'archive' as const,icon:'document' as const,title:l('محقق ذاكرة الوطن','Heritage Research Detective'),desc:l('حلّل الأدلة واقرأ المصادر وتعلّم كيف تتحقق من المعلومات.','Study evidence, read sources and learn how to verify information.'),total:cases.length,count:progress.cases.length,color:'from-sky-700 to-indigo-700'}
  ];
  const selectedModule = modules.find(x=>x.id===currentMode) || modules[0];
  return <div dir={dir} className="relative min-h-[100dvh] overflow-hidden bg-white dark:bg-black text-slate-900 dark:text-slate-100">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-48 -right-48 h-[500px] w-[500px] rounded-full bg-emerald-300/15 dark:bg-emerald-600/10 blur-3xl"/>
      <div className="absolute top-[40%] -left-48 h-[420px] w-[420px] rounded-full bg-amber-300/15 dark:bg-amber-500/5 blur-3xl"/>
    </div>
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 pt-5 sm:pt-8">
      <nav aria-label={tr(l('التنقل','Navigation'))} className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link to="/home" className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-white/90 dark:bg-slate-950 px-4 py-2.5 text-xs sm:text-sm font-black text-emerald-800 dark:text-emerald-200 shadow-sm hover:shadow-md transition-all">
          <Icon kind="arrow" className={'h-4 w-4 '+(lang==='ar'?'rotate-180':'')}/>
          {tr(l('العودة إلى المكتبة','Back to library'))}
        </Link>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200">
          <img src="/school-logo.png" alt="EFIPS" className="h-8 w-8 object-contain"/>
          <span>{tr(l('مكتبة مدرسة صقر الإمارات','EFIPS School Library'))}</span>
        </div>
      </nav>
      <section className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.7rem] border-2 border-emerald-700/20 dark:border-emerald-700/40 bg-[#074B3C] px-5 py-7 sm:px-9 sm:py-10 shadow-[0_25px_65px_rgba(6,78,59,.18)] text-white">
        <div className="absolute inset-x-0 top-0 flex h-2 overflow-hidden" aria-hidden="true"><span className="w-1/4 bg-[#E03137]"/><span className="w-1/4 bg-[#078147]"/><span className="w-1/4 bg-white"/><span className="w-1/4 bg-[#10191A]"/></div>
        <svg viewBox="0 0 460 180" aria-hidden="true" className="pointer-events-none absolute -top-12 -right-14 w-[420px] opacity-[.12]"><path d="M0 15h460M0 60h460M0 105h460M0 150h460" stroke="#F2D29B" strokeWidth="6"/>{Array.from({length:11},(_,i)=><path key={i} d="m0 15 20 18 20-18 20 18 20-18 20 18 20-18 20 18 20-18" transform={'translate('+(i*40)+',25)'} stroke="#F2D29B" strokeWidth="4"/>)}</svg>
        <div className="relative grid items-center gap-5 md:grid-cols-[1.4fr_.6fr]">
          <div className="min-w-0">
            <p className="mb-3 inline-flex rounded-full border border-amber-200/50 bg-white/10 px-4 py-2 text-[11px] sm:text-xs font-black tracking-wide text-amber-100">{tr(l('اقرأ · اكتشف · احفظ تراثك','READ · EXPLORE · PRESERVE'))}</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">{tr(l('صقر وهوية وطن','Saqr & National Identity'))}</h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base leading-8 font-semibold text-emerald-50/95">{tr(l('من حكايات الإمارات إلى مفردات التراث وملفات التاريخ، مغامرتك الثقافية تبدأ من مكتبتك.','From the stories of the emirates to heritage vocabulary and historical evidence, your cultural adventure starts in the library.'))}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="rounded-xl border border-white/25 bg-white/10 px-4 py-3"><span className="block text-[11px] text-emerald-100">{tr(l('الأختام','Stamps'))}</span><strong className="text-xl font-black tabular-nums">{progress.stamps.length}/7</strong></div>
              <div className="rounded-xl border border-white/25 bg-white/10 px-4 py-3"><span className="block text-[11px] text-emerald-100">{tr(l('كنوز اللغة','Word treasures'))}</span><strong className="text-xl font-black tabular-nums">{progress.words.length}/5</strong></div>
              <div className="rounded-xl border border-white/25 bg-white/10 px-4 py-3"><span className="block text-[11px] text-emerald-100">{tr(l('ملفات البحث','Research files'))}</span><strong className="text-xl font-black tabular-nums">{progress.cases.length}/3</strong></div>
            </div>
          </div>
          <div className="flex justify-center"><HeritageArt/></div>
        </div>
      </section>
      {mode === 'home' ? <>
        <div className="mt-9 mb-5 flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-xs font-black text-emerald-700 dark:text-emerald-400">{tr(l('أربع مغامرات ثقافية','FOUR CULTURAL ADVENTURES'))}</p><h2 className="text-xl sm:text-2xl font-black mt-1">{tr(l('اختر رحلتك','Choose your journey'))}</h2></div>
          <div className="rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-4 py-2 text-xs font-black text-amber-800 dark:text-amber-200">{totalCompleted}/15 {tr(l('مهمة مكتملة','missions completed'))}</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {modules.map(m=><button type="button" key={m.id} onClick={()=>go(m.id)} className="group overflow-hidden text-start rounded-[1.8rem] bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:border-emerald-400 dark:hover:border-emerald-700 transition-all focus-visible:outline focus-visible:outline-4 focus-visible:outline-emerald-500">
            <div className={'relative bg-gradient-to-br '+m.color+' p-6 text-white overflow-hidden'}>
              <div className="absolute -end-5 -top-6 h-36 w-36 border-[17px] rounded-full border-white/10"/>
              <Icon kind={m.icon} className="relative h-14 w-14"/>
              <div className="mt-5 text-xs text-white/80 font-black">{m.count}/{m.total} {tr(l('مهمات','tasks'))}</div>
              <h3 className="relative mt-1 font-black text-xl leading-snug">{tr(m.title)}</h3>
            </div>
            <div className="p-5 sm:p-6">
              <p className="text-sm leading-7 font-semibold text-slate-600 dark:text-slate-300 min-h-[84px]">{tr(m.desc)}</p>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-4" role="progressbar" aria-label={tr(m.title)} aria-valuenow={m.count} aria-valuemin={0} aria-valuemax={m.total}>
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{width:(m.count/m.total*100)+'%'}}/>
              </div>
              <span className="inline-flex mt-5 gap-2 items-center text-emerald-700 dark:text-emerald-300 text-sm font-black">{tr(l('ابدأ الاستكشاف','Start exploring'))}<Icon kind="arrow" className={'w-5 h-5 '+(lang==='ar'?'rotate-180':'')}/></span>
            </div>
          </button>)}
          <button type="button" onClick={() => setFlagChallengeOpen(true)}
            className="group overflow-hidden text-start rounded-[1.8rem] bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:border-emerald-400 dark:hover:border-emerald-700 transition-all focus-visible:outline focus-visible:outline-4 focus-visible:outline-emerald-500"
            aria-label={tr(l('ابدأ تحدي راية المجد في يوم العلم','Play the UAE Flag Day Challenge'))}>
            <div className="relative overflow-hidden bg-gradient-to-br from-[#127C58] via-[#075B49] to-[#0D403D] p-6 text-white">
              <div aria-hidden="true" className="absolute top-0 inset-x-0 flex h-1.5"><span className="w-1/4 bg-red-500"/><span className="w-1/4 bg-emerald-400"/><span className="w-1/4 bg-white"/><span className="w-1/4 bg-slate-950"/></div>
              <div aria-hidden="true" className="absolute -end-5 -top-6 h-36 w-36 rounded-full border-[17px] border-white/10"/>
              <svg viewBox="0 0 64 64" className="relative h-14 w-14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 7v51M8 58h8"/>
                <path d="M14 11h39v28H14z" stroke="none" fill="#FFFFFF"/>
                <path d="M14 11h11v28H14z" stroke="none" fill="#E31D3A"/>
                <path d="M25 11h28v9H25z" stroke="none" fill="#07924D"/>
                <path d="M25 30h28v9H25z" stroke="none" fill="#161616"/>
                <path d="M12 7v51M8 58h8" />
                <path d="m45 49 3 5 6-10" stroke="#FFE0A3" strokeWidth="3"/>
              </svg>
              <div className="mt-5 text-xs font-black text-white/80">{tr(l('تحدي تفاعلي · يوم العلم','INTERACTIVE · FLAG DAY'))}</div>
              <h3 className="relative mt-1 text-xl font-black leading-snug">{tr(l('تحدي راية المجد','Flag Day Challenge'))}</h3>
            </div>
            <div className="p-5 sm:p-6">
              <p className="min-h-[84px] text-sm leading-7 font-semibold text-slate-600 dark:text-slate-300">{tr(l('ارفع علم الإمارات بالإجابات الصحيحة، واصعد عبر المعالم حتى قمة برج خليفة.','Answer UAE Flag Day questions, raise the flag and climb past landmarks toward the Burj Khalifa.'))}</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full w-full rounded-full bg-gradient-to-r from-red-500 via-emerald-500 to-amber-400 opacity-80"/>
              </div>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-emerald-700 dark:text-emerald-300">
                {tr(l('ابدأ التحدي','Start the challenge'))}<Icon kind="arrow" className={'h-5 w-5 '+(lang==='ar'?'rotate-180':'')}/>
              </span>
            </div>
          </button>
        </div>
        {progress.stamps.length===7 && <div role="status" className="mt-6 rounded-[1.5rem] border-2 border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/25 px-6 py-5 text-amber-900 dark:text-amber-200 font-black">
          {tr(l('أحسنت! جمعت أختام الإمارات السبع وأكملت جواز صقر الثقافي.','Well done! You have collected all seven emirate stamps and completed your cultural passport.'))}
        </div>}
      </> : <section className="mt-7">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <button type="button" onClick={()=>go('home')} className="inline-flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-2.5 text-xs sm:text-sm font-black hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors">
            <Icon kind="arrow" className={'w-4 h-4 '+(lang==='ar'?'rotate-180':'')}/>{tr(l('كل المغامرات','All adventures'))}
          </button>
          <div className="text-sm font-black text-emerald-700 dark:text-emerald-300">{tr(selectedModule.title)} · {selectedModule.count}/{selectedModule.total}</div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[285px_minmax(0,1fr)] gap-5">
          <aside className="h-fit rounded-[1.7rem] p-4 bg-[#F8F5EC] dark:bg-[#11150F] border border-amber-200 dark:border-amber-900/60">
            <h2 className="font-black text-lg mb-3 px-2">{mode==='passport'?tr(l('صفحات الجواز','Passport pages')):mode==='language'?tr(l('مفردات التراث','Heritage vocabulary')):tr(l('ملفات المحقق','Detective files'))}</h2>
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {entries.map((entry,i)=><button type="button" key={entry.id} aria-current={index===i?'step':undefined}
                onClick={()=>selectEntry(i)} className={'shrink-0 min-w-[150px] lg:min-w-0 w-full text-start flex items-center gap-3 rounded-2xl border px-3 py-3 text-xs sm:text-sm font-black transition-all '+(index===i?'bg-emerald-700 text-white border-emerald-700 shadow-md':'bg-white dark:bg-slate-950 dark:text-slate-200 border-amber-200 dark:border-slate-800 hover:border-emerald-400')}>
                <span className={'h-9 w-9 shrink-0 flex items-center justify-center rounded-xl '+(progress[progressField[currentMode]].includes(entry.id)?'bg-amber-300 text-emerald-950':index===i?'bg-white/20 text-white':'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200')}>
                  {progress[progressField[currentMode]].includes(entry.id)?<Icon kind="check" className="w-5 h-5"/>:<span className="tabular-nums">{i+1}</span>}
                </span>
                <span className="min-w-0 break-words">{tr(entry.name)}</span>
              </button>)}
            </div>
          </aside>
          <div className="min-w-0 space-y-5">
            <article className="rounded-[1.7rem] border border-emerald-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-lg overflow-hidden">
              <div className="border-b border-emerald-100 dark:border-slate-800 bg-gradient-to-r from-emerald-50 via-[#FFF8E9] to-white dark:from-emerald-950/35 dark:via-amber-950/15 dark:to-slate-950 p-5 sm:p-7">
                <div className="flex justify-between gap-3 items-start">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-300 font-black">{mode==='passport'?tr(l('ختم الإمارة','Emirate stamp')):mode==='language'?tr(l('كنز لغوي','Word treasure')):tr(l('بطاقة بحث تعليمية','Educational research file'))} · {index+1}/{entries.length}</p>
                    <h2 className="mt-2 text-2xl sm:text-3xl font-black text-emerald-950 dark:text-white">{tr(item.name)}</h2>
                  </div>
                  <div aria-label={done?tr(l('مكتمل','Completed')):tr(l('غير مكتمل','Not completed'))}
                    className={'shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl border-2 '+(done?'bg-amber-100 text-amber-800 border-amber-400 dark:bg-amber-950/50 dark:text-amber-200':'bg-white text-emerald-700 border-emerald-200 dark:bg-slate-900 dark:text-emerald-300 dark:border-emerald-900')}>
                    <Icon kind={done?'stamp':selectedModule.icon} className="h-8 w-8"/>
                  </div>
                </div>
              </div>
              <div className="p-5 sm:p-7">
                <div className="flex items-start gap-3">
                  <span className="shrink-0 rounded-xl bg-emerald-100 dark:bg-emerald-950 p-2 text-emerald-700 dark:text-emerald-300"><Icon kind="book" className="w-6 h-6"/></span>
                  <div className="min-w-0">
                    <h3 className="font-black text-base sm:text-lg">{tr(l('اقرأ واكتشف','Read and discover'))}</h3>
                    <p className="mt-2 text-sm sm:text-base leading-8 text-slate-700 dark:text-slate-300">{tr(item.story)}</p>
                    <p className="mt-3 rounded-xl border-s-4 border-amber-400 bg-amber-50 dark:bg-amber-950/20 p-3 text-xs sm:text-sm font-bold leading-7 text-amber-950 dark:text-amber-100">{tr(item.prompt)}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a href={item.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-800 px-4 py-2.5 text-xs font-black text-emerald-800 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors">
                        {tr(l('اقرأ المصدر الموثوق','Read the trusted source'))}<Icon kind="arrow" className="w-4 h-4 -rotate-45"/>
                      </a>
                      <Link to="/search" className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-4 py-2.5 text-xs font-black text-white transition-colors">
                        <Icon kind="book" className="w-4 h-4"/>{tr(l('ابحث في دليل الكتب','Search the book catalog'))}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </article>
            <article className="rounded-[1.7rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 sm:p-7 shadow-lg">
              <div className="flex gap-3 items-center mb-4">
                <div className="flex items-center justify-center bg-[#F4E9D5] text-amber-900 dark:bg-amber-950 dark:text-amber-300 w-11 h-11 rounded-xl"><Icon kind="document" className="w-6 h-6"/></div>
                <h3 className="font-black text-lg">{tr(l('اختبر فهمك','Test your understanding'))}</h3>
              </div>
              <p className="font-bold text-base sm:text-lg leading-8 mb-4">{tr(item.question)}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {item.choices.map((choice,i)=><button key={i} type="button" onClick={()=>submitAnswer(i)}
                  aria-pressed={chosen===i} className={'min-h-[76px] text-start flex items-center gap-3 rounded-2xl border-2 px-4 py-3 font-bold text-sm leading-6 transition-all hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-emerald-400 '+(chosen===i?(selectedCorrect?'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-100':'border-rose-400 bg-rose-50 dark:bg-rose-950/35 text-rose-900 dark:text-rose-100'):'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:border-emerald-400') }>
                  <span className="flex shrink-0 w-8 h-8 rounded-full items-center justify-center border border-current/20 text-xs font-black">{i+1}</span>{tr(choice)}
                </button>)}
              </div>
              {chosen !== null && <div role="status" aria-live="polite" className={'mt-5 rounded-xl border p-4 '+(selectedCorrect?'border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100':'border-amber-300 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100')}>
                <strong className="font-black">{selectedCorrect?tr(l('إجابة صحيحة! أحسنت.','Correct! Well done.')):tr(l('حاول مرة أخرى بعد مراجعة النص.','Try again after reviewing the text.'))}</strong>
                {selectedCorrect && <p className="mt-1 text-sm leading-7">{tr(item.explanation)}</p>}
              </div>}
              {done && chosen === null && <div className="mt-4 text-sm font-black text-emerald-700 dark:text-emerald-300 flex gap-2 items-center"><Icon kind="check" className="w-5 h-5"/>{tr(l('أكملت هذه المهمة سابقًا؛ يمكنك إعادتها.','You have already completed this mission. You can replay it.'))}</div>}
              {mode==='language' && <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
                <label htmlFor={'heritage-note-'+item.id} className="block font-black text-sm mb-2">{tr(l('اكتب جملة من تأليفك (اختياري)','Write your own sentence (optional)'))}</label>
                <textarea id={'heritage-note-'+item.id} maxLength={180} rows={3} value={progress.notes[item.id] || ''}
                  placeholder={tr(l('استخدم الكلمة في جملة تحكي عن التراث...','Use this word in a sentence about heritage...'))}
                  onChange={e=>setProgress(prev=>({...prev,notes:{...prev.notes,[item.id]:e.target.value}}))}
                  className="block w-full resize-y rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm leading-7 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"/>
                <p className="text-xs mt-2 text-slate-500 dark:text-slate-400">{tr(l('تُحفظ الجملة على جهازك فقط، ولا يتم تقييمها آليًا أو إرسالها للنشر.','Your sentence stays on this device. It is not automatically graded or submitted for publishing.'))}</p>
              </div>}
              <div className="mt-6 flex flex-wrap gap-3 justify-between">
                <button type="button" disabled={index===0} onClick={()=>selectEntry(index-1)}
                  className="rounded-xl px-4 py-2.5 text-xs font-black bg-slate-100 dark:bg-slate-900 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">{tr(l('السابق','Previous'))}</button>
                {index<entries.length-1?<button type="button" onClick={()=>selectEntry(index+1)}
                  className="rounded-xl px-5 py-2.5 text-xs font-black bg-emerald-700 text-white hover:bg-emerald-800 transition-colors">{tr(l('المهمة التالية','Next mission'))}</button>
                  : <button type="button" onClick={()=>go('home')} className="rounded-xl px-5 py-2.5 text-xs font-black bg-emerald-700 text-white hover:bg-emerald-800 transition-colors">{tr(l('عودة للمغامرات','Back to adventures'))}</button>}
              </div>
            </article>
          </div>
        </div>
      </section>}
      <footer className="mt-10 pt-6 border-t border-emerald-100 dark:border-slate-800 text-xs leading-7 text-slate-500 dark:text-slate-400 text-center">
        {tr(l('المحتوى تعليمي مستند إلى مصادر رسمية وتراثية. التقدم الشخصي يُحفظ على هذا الجهاز فقط، ولا يؤثر في نقاط الألعاب أو بيانات المكتبة.','Educational content based on official and heritage sources. Progress is stored on this device only and does not change game points or library records.'))}
      </footer>
    </div>
  </div>;
};
export default NationalIdentityPage;
