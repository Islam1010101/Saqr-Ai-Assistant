import React, { useState } from 'react';
import './tutorialPlatformDirectory.css';

/** Public, data-free preview of real application routes and the main tools they contain.
 * Keeping route paths here makes the tour easy to audit against App.tsx.
 * A preview never renders a protected module, fetches user records or grants access.
 */
type Group = 'library' | 'challenges' | 'heritage' | 'services';
type Audience = 'all' | 'students' | 'teachers' | 'admins' | 'entitled';
type Feature = {
  id: string;
  group: Group;
  path: string;
  ar: string;
  en: string;
  arDescription: string;
  enDescription: string;
  audience: Audience;
  art?: string;
};

export const TUTORIAL_PLATFORM_FEATURES: readonly Feature[] = [
  { id:'home',group:'services',path:'/home',ar:'الصفحة الرئيسية',en:'Home Dashboard',arDescription:'ترحيب حسب الحساب، جديدنا، صقر التفاعلي، تحدي القراءة والبطاقات والخدمات المتاحة.',enDescription:'Personal greeting, What’s New, interactive Saqr, reading progress and available services.',audience:'all',art:'/Saqr.png' },
  { id:'physical-catalog',group:'library',path:'/search',ar:'دليل المكتبة الورقية',en:'Physical Library Catalog',arDescription:'ابحث بعنوان الكتاب أو اسم المؤلف أو الموضوع، وحدد الرف والصف واطلب الاستعارة.',enDescription:'Search by title, author or topic, check shelf and row, and request a loan.',audience:'all' },
  { id:'saqr-ai',group:'library',path:'/smart-search',ar:'صقر الذكي',en:'Ask Saqr AI',arDescription:'ابحث عن كتاب، ناقش الأفكار، واسأل أسئلة تعليمية باللغة العربية أو الإنجليزية.',enDescription:'Look up books, discuss ideas, and ask learning questions in Arabic or English.',audience:'all',art:'/Saqr.png' },
  { id:'digital-hub',group:'library',path:'/digital-library',ar:'المكتبة الرقمية',en:'Digital Library',arDescription:'بوابة المكتبات العربية والإنجليزية والهوية الوطنية مع فلاتر القراءة.',enDescription:'Explore the Arabic, English and UAE National Identity digital collections.',audience:'all',art:'/Saqr Reading.png' },
  { id:'arabic-digital',group:'library',path:'/digital-library/arabic',ar:'الكتب الرقمية العربية',en:'Arabic Digital Books',arDescription:'كتب وقصص بالعربية مع بيانات المؤلف والملخص والقارئ المتاح داخل المنصة.',enDescription:'Arabic books and stories with author information, summaries and the available in-app reader.',audience:'all' },
  { id:'english-digital',group:'library',path:'/digital-library/english',ar:'الكتب الرقمية الإنجليزية',en:'English Digital Books',arDescription:'مكتبة إنجليزية مصنفة، مع الملخص وبيانات الكتاب وعرض الصفحات المتاحة.',enDescription:'Categorized English books, summaries, metadata and available page viewing.',audience:'all' },
  { id:'heritage-digital',group:'library',path:'/digital-library/national-identity',ar:'كتب الهوية الوطنية الرقمية',en:'UAE Heritage Digital Books',arDescription:'كتب رقمية تتناول الإمارات وتراثها وتاريخها، ضمن قسم مستقل.',enDescription:'Digital books exploring Emirati heritage, history and national identity.',audience:'all' },
  { id:'reading-picks',group:'library',path:'/home',ar:'مكتبتي واقتراحات القراءة',en:'My Books & Reading Suggestions',arDescription:'أربع بطاقات مبدئيًا، ومزيد من الترشيحات حسب لغة الواجهة والعمر والمرحلة والاهتمامات. نوع الكتاب: الكل أو ورقي أو رقمي.',enDescription:'Four initial picks plus more by interface language, age and interests. Choose All, Physical or Digital.',audience:'all' },
  { id:'reading-goal',group:'library',path:'/home',ar:'تحدي القراءة الشهري',en:'Monthly Reading Challenge',arDescription:'حدد هدفك، احفظ الكتب، وميّز ما قرأته لتتابع إنجازك الشهري.',enDescription:'Set a goal, save titles, mark books read and follow this month’s progress.',audience:'all' },
  { id:'borrowings',group:'library',path:'/home',ar:'استعاراتي وتنبيهاتي',en:'My Borrowings & Reminders',arDescription:'تظهر الكتب المستعارة ومواعيد الإرجاع للحساب المرتبط فقط، عند وجود سجلات.',enDescription:'Borrowed books and return dates appear for the signed-in reader when records exist.',audience:'all' },
  { id:'challenges-hub',group:'challenges',path:'/saqr-challenges',ar:'تحديات صقر',en:'Saqr Challenges',arDescription:'بوابة تجمع بين السطور مع صقر، لعبة ترتيب المكتبة واستديو صقر.',enDescription:'One hub for Between the Lines, Organize the Library and Saqr Studio.',audience:'students',art:'/Saqr Challenges.png' },
  { id:'between-lines',group:'challenges',path:'/saqr-reading-quest',ar:'بين السطور مع صقر',en:'Between the Lines with Saqr',arDescription:'اختر عدد الكتب ثم أجب عن أسئلة الشخصيات والأحداث والأفكار؛ وتوجد نسخة للمعلمين.',enDescription:'Pick how many books to read and answer character, story and idea questions; teacher mode also exists.',audience:'all',art:'/Saqr Reading.png' },
  { id:'shelving',group:'challenges',path:'/game',ar:'رتّب المكتبة',en:'Organize the Library',arDescription:'لعبة تصنيف وترتيب الكتب على الأرفف بالسحب والإفلات، مناسبة للمس والماوس.',enDescription:'Drag and drop book sorting and classification, supporting touch and mouse.',audience:'students',art:'/Game.png' },
  { id:'studio',group:'challenges',path:'/saqr-studio',ar:'استديو صقر',en:'Saqr Studio',arDescription:'مساحة للقصص والتسجيل والإبداع الصوتي؛ تظهر الأدوات المستقبلية باعتبارها قريبًا.',enDescription:'A space for storytelling and sound creation; unfinished tools are marked Coming Soon.',audience:'students',art:'/Saqr_Studio.png' },
  { id:'podcast',group:'challenges',path:'/podcast',ar:'بودكاست صقر',en:'Saqr Podcast',arDescription:'اختر فكرة أو كتابًا، سجّل حلقتك وتعرّف إلى خطوات إعداد بودكاست.',enDescription:'Choose a book or idea, record an episode and explore the podcast workflow.',audience:'all' },
  { id:'little-author',group:'challenges',path:'/smart-search',ar:'المؤلف الصغير',en:'Little Author Challenge',arDescription:'ابدأ قصة مع صقر، راجع كتابتك ثم أنشئ شهادة المؤلف الصغير.',enDescription:'Create a story with Saqr, review your writing and generate a Little Author certificate.',audience:'students' },
  { id:'national-hub',group:'heritage',path:'/saqr-national-identity',ar:'صقر وهوية وطن',en:'Saqr & National Identity',arDescription:'خمسة تحديات وطنية وبوابة كتب الهوية في تجربة واحدة بالألوان الإماراتية.',enDescription:'Five UAE-themed challenges plus a heritage book pavilion in one experience.',audience:'students',art:'/Saqr Flag.png' },
  { id:'passport',group:'heritage',path:'/saqr-national-identity',ar:'جواز صقر الثقافي',en:'Saqr Cultural Passport',arDescription:'جولة في الإمارات السبع تجمع خلالها الأختام بعد قراءة حكاياتها.',enDescription:'Explore the seven emirates, read their stories and collect passport stamps.',audience:'students' },
  { id:'language',group:'heritage',path:'/saqr-national-identity',ar:'كنوز لغتنا الإماراتية',en:'Treasures of Emirati Language',arDescription:'تحدٍ لفهم المفردات الإماراتية بالاستعانة بالمعجم.',enDescription:'Discover Emirati words and their meanings using dictionary evidence.',audience:'students' },
  { id:'detective',group:'heritage',path:'/saqr-national-identity',ar:'محقق ذاكرة الوطن',en:'National Memory Detective',arDescription:'تحقيق في مصادر تراثية من خلال عشر أسئلة عشوائية بكل جولة.',enDescription:'Investigate UAE history through ten randomized evidence-based questions.',audience:'students' },
  { id:'flag',group:'heritage',path:'/saqr-national-identity',ar:'تحدي راية المجد',en:'Flag of Glory',arDescription:'أسئلة متدرجة ومؤقت سريع للوصول إلى قمة تحدي العلم الإماراتي.',enDescription:'Timed rounds and progressive questions in the UAE flag challenge.',audience:'students' },
  { id:'anthem',group:'heritage',path:'/saqr-national-identity/anthem',ar:'تحدي صوت الاتحاد',en:'Voice of the Union',arDescription:'استمع إلى موسيقى النشيد الوطني، سجّل غناءك وحمّل تسجيلك بصيغة MP3.',enDescription:'Listen to the instrumental UAE anthem, record your singing and download an MP3.',audience:'students',art:'/SAQR Singer.png' },
  { id:'heritage-pavilion',group:'heritage',path:'/saqr-national-identity/books',ar:'جناح كتب الهوية الوطنية',en:'National Identity Book Pavilion',arDescription:'استعرض الكتب الوطنية ومعلوماتها من فهرس مخصص داخل جناح الهوية.',enDescription:'Browse the UAE heritage book catalogue and related bibliographic details.',audience:'students' },
  { id:'creators',group:'services',path:'/creators',ar:'بوابة المبدعين',en:'Creators Portal',arDescription:'تابع القصص والمشروعات الإبداعية ومشاركات الطلاب.',enDescription:'Discover student-created stories, projects and creative contributions.',audience:'all',art:'/Saqr Creative.png' },
  { id:'learning',group:'services',path:'/saqr-learning',ar:'صقر يساعدني',en:'Saqr Helps Me',arDescription:'تجارب تعلم شخصية متاحة فقط للحسابات المصرّح لها؛ الجولة لا تمنح صلاحية الوصول.',enDescription:'Personal learning tools only for approved accounts; this preview grants no access.',audience:'entitled' },
  { id:'teacher-prep',group:'services',path:'/smart-search',ar:'تحضير الدروس للمعلمين',en:'Teacher Lesson Preparation',arDescription:'يساعد صقر في إعداد خطة درس أصلية، مع متابعة حتى اكتمال التحضير وخيارات الطباعة.',enDescription:'Ask Saqr to plan lessons, continue across responses and prepare a printable result.',audience:'teachers',art:'/Saqr Teacher.png' },
  { id:'proofreading',group:'services',path:'/smart-search',ar:'التدقيق اللغوي',en:'Arabic & English Proofreading',arDescription:'راجع الأخطاء الإملائية واللغوية في الكتابة والأنشطة والتحضيرات.',enDescription:'Check spelling and language errors in stories, classwork and lesson plans.',audience:'all' },
  { id:'schedule',group:'services',path:'/schedule',ar:'جدول المكتبة وحجز الحصص',en:'Library Schedule & Booking',arDescription:'تصفح الجدول الأسبوعي واحجز حصص المكتبة حسب صلاحية الحساب.',enDescription:'View the weekly library timetable and book periods according to your role.',audience:'teachers',art:'/Saqr Schedule.png' },
  { id:'teacher-notifications',group:'services',path:'/home',ar:'تنبيهات جدول المعلم',en:'Teacher Booking Notifications',arDescription:'الحصص المحجوزة تظهر في الرئيسية فقط عند وجود جدول محفوظ للمعلم.',enDescription:'Saved teacher library periods appear on the homepage when available.',audience:'teachers' },
  { id:'ideas',group:'services',path:'/feedback',ar:'المقترحات والملاحظات',en:'Suggestions & Feedback',arDescription:'شارك فكرة أو ملاحظة لتحسين خدمات المكتبة.',enDescription:'Share ideas or feedback to help improve the school library.',audience:'all' },
  { id:'about',group:'services',path:'/about',ar:'عن المكتبة',en:'About the Library',arDescription:'تعرف إلى المكتبة وأهدافها وأجنحتها وخدماتها.',enDescription:'Learn about the library, its goals, wings and services.',audience:'all' },
  { id:'tutorial',group:'services',path:'/tutorial',ar:'الجولة التعريفية',en:'Interactive Platform Tour',arDescription:'معاينة آمنة للواجهة والتحديات والخدمات على الكمبيوتر والهاتف.',enDescription:'A privacy-safe preview of the platform, challenges and services on desktop and phone.',audience:'all' },
  { id:'admin',group:'services',path:'/admin-dashboard',ar:'لوحة الإدارة والإحصاءات',en:'Admin Dashboard & Analytics',arDescription:'إدارة المستخدمين والصلاحيات والاستعارات والحجوزات ومؤشرات القراءة؛ للإدارة فقط.',enDescription:'Manage users, roles, borrowing, bookings and reading insights; admins only.',audience:'admins' },
];

const GROUPS:{id:Group;ar:string;en:string;arDesc:string;enDesc:string;art:string}[] = [
  {id:'library',ar:'كتب ومعرفة وقراءة',en:'Books, Knowledge & Reading',arDesc:'الفهرس الورقي والمكتبات الرقمية والترشيحات والاستعارة',enDesc:'Physical catalog, digital books, reading picks and borrowing',art:'/Saqr Reading.png'},
  {id:'challenges',ar:'ألعاب وتحديات صقر',en:'Saqr Games & Challenges',arDesc:'قراءة ولعب وتأليف واستديو وصوت',enDesc:'Reading games, storytelling, studio and audio',art:'/Saqr Challenges.png'},
  {id:'heritage',ar:'صقر وهوية وطن',en:'Saqr & National Identity',arDesc:'خمسة تحديات وجناح مستقل لكتب الإمارات',enDesc:'Five heritage challenges and a dedicated UAE book pavilion',art:'/Saqr Flag.png'},
  {id:'services',ar:'صفحات وخدمات المنصة',en:'Platform Pages & Services',arDesc:'المعلمون والطلاب والإدارة وباقي الخدمات',enDesc:'Students, teachers, admins and every other service',art:'/Saqr Teacher.png'}
];

export default function TutorialPlatformDirectory({isAr}:{isAr:boolean}) {
  const [selectedGroup,setSelectedGroup] = useState<Group|'all'>('all');
  const [audience,setAudience] = useState<Audience|'all'>('all');
  const l=(ar:string,en:string)=>isAr?ar:en;
  const visible=TUTORIAL_PLATFORM_FEATURES.filter(item =>
    (selectedGroup==='all'||item.group===selectedGroup) &&
    (audience==='all'||item.audience==='all'||item.audience===audience)
  );
  const roleLabel=(a:Audience)=>({
    all:l('جميع المستخدمين','All users'),
    students:l('الطلاب وصلاحيات محددة','Students / authorized roles'),
    teachers:l('المعلمون / المصرّح لهم','Teachers / authorized roles'),
    admins:l('الإدارة فقط','Admins only'),
    entitled:l('حسابات معتمدة','Approved accounts')
  }[a]);
  return <section className="tutorial-directory" id="tutorial-directory" aria-labelledby="tutorial-directory-title">
    <header className="tutorial-directory-head">
      <div>
        <p className="tutorial-directory-kicker">{l('استكشف منصة صقر','EXPLORE THE EFIPS PLATFORM')}</p>
        <h2 id="tutorial-directory-title">{l('دليلك لكل صفحة وخدمة','Every Page. Every Service.')}</h2>
        <p>{l('كل بطاقة تمثل صفحة حقيقية أو وظيفة متاحة داخلها. اختر القسم أو نوع المستخدم لاستعراض المميزات، واضغط «تفاصيل الخدمة» للمزيد.', 'Each card represents a real page or an existing feature within one. Filter by area or audience and open Service details to learn more.')}</p>
      </div>
      <img src="/Saqr.png" alt="" loading="lazy" width="110" height="110"/>
    </header>
    <div className="tutorial-directory-filters" aria-label={l('تصفية دليل الصفحات','Filter platform directory')}>
      <div className="tutorial-directory-tabs" role="group" aria-label={l('الأقسام','Sections')}>
        {[{id:'all',ar:'كل المنصة',en:'Everything'},...GROUPS].map(item=><button key={item.id} type="button" aria-pressed={selectedGroup===item.id}
          className={selectedGroup===item.id?'is-selected':''}
          onClick={()=>setSelectedGroup(item.id as Group|'all')}>{isAr?item.ar:item.en}</button>)}
      </div>
      <label className="tutorial-directory-role">{l('استعراض حسب الحساب','View by role')}
        <select value={audience} onChange={e=>setAudience(e.target.value as Audience|'all')}>
          <option value="all">{l('جميع الأدوار','All roles')}</option>
          <option value="students">{l('الطلاب','Students')}</option>
          <option value="teachers">{l('المعلمون','Teachers')}</option>
          <option value="admins">{l('الإدارة','Admins')}</option>
          <option value="entitled">{l('حسابات معتمدة','Approved accounts')}</option>
        </select>
      </label>
    </div>
    <p className="tutorial-directory-count" role="status">{l('المميزات المعروضة: ','Features shown: ')}{visible.length} / {TUTORIAL_PLATFORM_FEATURES.length}</p>
    {GROUPS.filter(g=>selectedGroup==='all'||selectedGroup===g.id).map(group=>{
      const items=visible.filter(x=>x.group===group.id);
      if(!items.length)return null;
      return <div key={group.id} className={'tutorial-directory-group tutorial-directory-group--'+group.id}>
        <header className="tutorial-directory-group-head">
          <img src={group.art} alt="" loading="lazy" width="64" height="64"/>
          <div><h3>{l(group.ar,group.en)}</h3><p>{l(group.arDesc,group.enDesc)}</p></div>
        </header>
        <div className="tutorial-directory-grid">
          {items.map((item,index)=><article className="tutorial-directory-card" key={item.id} data-feature-id={item.id}>
            <div className="tutorial-directory-card-head">
              <span className="tutorial-directory-ordinal" dir="ltr">{String(index+1).padStart(2,'0')}</span>
              {item.art ? <img src={item.art} alt="" loading="lazy" width="62" height="62"/> : <span className="tutorial-directory-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16v16H4zM8 8h8m-8 4h8m-8 4h5"/></svg></span>}
            </div>
            <h4>{l(item.ar,item.en)}</h4>
            <p>{l(item.arDescription,item.enDescription)}</p>
            <div className="tutorial-directory-card-footer">
              <span>{roleLabel(item.audience)}</span>
              <details>
                <summary>{l('تفاصيل الصفحة','Page details')}</summary>
                <p>{l('مكانها في المنصة:', 'Find it in the portal:')} <code dir="ltr">{item.path}</code></p>
                <p>{l('تتاح الوظائف وفق حسابك وصلاحيات المدرسة. هذه معاينة لا تتصل بحسابات أو بيانات حقيقية.', 'Actual access depends on your school account and permissions. This demo does not access real accounts or private data.')}</p>
              </details>
            </div>
          </article>)}
        </div>
      </div>;
    })}
  </section>;
}
