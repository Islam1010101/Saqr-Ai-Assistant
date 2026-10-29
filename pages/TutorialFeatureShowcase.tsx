import React from 'react';
import './tutorialFeatureShowcase.css';

type FeatureIconName = 'book' | 'shelves' | 'microphone' | 'passport' | 'words' | 'detective' | 'flag' | 'pavilion' | 'students' | 'calendar' | 'report' | 'borrowing';

function FeatureIcon({ name }: { name: FeatureIconName }) {
  const common = {fill:'none',stroke:'currentColor',strokeWidth:1.85,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
  return <svg viewBox="0 0 24 24" {...common} aria-hidden="true">
    {name==='book' && <><path d="M12 5c-3-2-7-2-9-1v14c3-1 7-1 9 1 3-2 7-2 9-1V4c-3-1-7-1-9 1Zm0 0v14"/></>}
    {name==='shelves' && <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 15h18M9 3v12m6-12v12M7 7v5m10-5v5M7 17h10"/></>}
    {name==='microphone' && <><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4m-4 0h8"/></>}
    {name==='passport' && <><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8M8 18h8"/><circle cx="12" cy="12" r="3"/><path d="M9 12h6m-3-3v6"/></>}
    {name==='words' && <><path d="M4 5h16M12 3v2m-6 4h12m-2-4c-.5 6-4 11-10 14m4-9c1 4 4 7 8 9"/><path d="m15 19 2-5 2 5m-3-2h2"/></>}
    {name==='detective' && <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5M8 11l2 2 4-5"/></>}
    {name==='flag' && <><path d="M5 22V3m0 2c5-4 9 4 15 0v12c-6 4-10-4-15 0"/></>}
    {name==='pavilion' && <><path d="M3 10 12 3l9 7v10H3V10ZM7 20v-8h10v8M3 20h18"/></>}
    {name==='students' && <><circle cx="9" cy="8" r="3"/><path d="M2 20v-2a7 7 0 0 1 14 0v2m1-15a3 3 0 0 1 0 6m1 4c3 0 4 2 4 5"/></>}
    {name==='calendar' && <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-13 5 2 2 5-5"/></>}
    {name==='report' && <><path d="M6 3h9l4 4v14H6V3Zm9 0v5h4M9 12h7M9 16h7"/></>}
    {name==='borrowing' && <><path d="M4 4h11v15H4V4zm11 3h4v14H8v-2M7 8h5m-5 4h5"/></>}
  </svg>;
}

type Entry = { id:string; title:string; description:string; detail:string; icon:FeatureIconName; tone:string; marker:string };
export default function TutorialFeatureShowcase({ isAr }: { isAr:boolean }) {
  const l=(ar:string,en:string)=>isAr?ar:en;
  const challengeItems:Entry[]=[
    {id:'reading',icon:'book',tone:'violet',marker:'01',title:l('بين السطور مع صقر','Between the Lines with Saqr'),description:l('يختار القارئ عدد الكتب، ثم يجيب عن أسئلة تتعلق بمحتواها وشخصياتها وأفكارها.','Choose how many books to explore, then answer questions about their characters, stories and ideas.'),detail:l('يعرض الكتاب ومكانه، وتناسب اختيارات القراءة نوع الحساب ولغة الواجهة.','Displays book details and shelf location. Book selection follows the account role and interface language.')},
    {id:'sorting',icon:'shelves',tone:'mint',marker:'02',title:l('رتّب المكتبة','Organize the Library'),description:l('تعلّم تصنيف الكتب وترتيبها على الأرفف من خلال لعبة تفاعلية.','Learn book classification and shelving through interactive challenges.'),detail:l('تدريبات بالسحب والإفلات، ومستويات وإنجازات. تعمل اللعبة باللمس والماوس.','Drag-and-drop activities, levels and achievements with touch and mouse controls.')},
    {id:'studio',icon:'microphone',tone:'coral',marker:'03',title:l('استديو صقر','Saqr Studio'),description:l('مساحة للإبداع الصوتي، وتسجيل القصص وحلقات البودكاست.','Creative audio experiences for recording stories and podcasts.'),detail:l('البودكاست متاح من الاستديو، بينما أدوات الأفلام المعروضة باسم «قريبًا» ليست مفعلة.','Podcast functionality is available; movie-making tools marked Coming Soon are not yet active.')}
  ];
  const heritageItems:Entry[]=[
    {id:'passport',icon:'passport',tone:'emerald',marker:'01',title:l('جواز صقر الثقافي','Saqr Cultural Passport'),description:l('اكتشف الإمارات السبع، واقرأ القصص واجمع أختام جواز صقر.','Explore all seven emirates, read their stories and collect passport stamps.'),detail:l('مهام قراءة وبحث بمصادر وكتب، تتقدم فيها عبر مستويات الجواز.','Reading and research activities using sources and books across passport levels.')},
    {id:'words',icon:'words',tone:'gold',marker:'02',title:l('كنوز لغتنا الإماراتية','Treasures of Emirati Language'),description:l('اكتشف معاني المفردات الإماراتية من المعجم من خلال عشرة أسئلة.','Explore Emirati vocabulary using the dictionary through ten questions.'),detail:l('تُعرض الكلمات والمراجع ضمن نشاط تعليمي متعدد المستويات.','Words and reference material are presented in a graded learning challenge.')},
    {id:'archive',icon:'detective',tone:'sky',marker:'03',title:l('محقق ذاكرة الوطن','Heritage Research Detective'),description:l('حقق في أدلة وأسئلة عشوائية من مصادر تراثية موثوقة.','Investigate randomized questions and evidence from reliable heritage sources.'),detail:l('عشر مسائل في كل جولة لتدريب مهارات التحقق والبحث.','Ten questions per round to practise source verification and research.')},
    {id:'flag',icon:'flag',tone:'flag',marker:'04',title:l('تحدي راية المجد','Flag of Glory Challenge'),description:l('أجب عن أسئلة يوم العلم، وساعد العلم الإماراتي على الارتفاع.','Answer UAE Flag Day questions to raise the national flag.'),detail:l('تحدٍّ متدرج بالمعلومات والمعالم الإماراتية ومؤثرات احتفالية.','Progressive UAE facts and landmarks with celebratory effects.')},
    {id:'pavilion',icon:'pavilion',tone:'forest',marker:'05',title:l('جناح كتب الهوية الوطنية','National Identity Book Pavilion'),description:l('تصفح كتب المكتبة المتعلقة بالتاريخ والتراث والهوية الوطنية.','Browse library books on UAE history, heritage and national identity.'),detail:l('دليل مستقل للكتب المرتبطة بالهوية الوطنية، خارج ألعاب التحديات.','A separate catalog for national identity books, distinct from the games.')}
  ];
  const adminItems:Entry[]=[
    {id:'members',icon:'students',tone:'sky',marker:'A',title:l('الطلاب والمعلمون','Students and Teachers'),description:l('متابعة حسابات الطلاب والمعلمين وسجلاتهم وبياناتهم.','Manage student and teacher accounts and records.'),detail:l('يتطلب تسجيل الدخول بصلاحية الإدارة. لا تعرض الجولة بيانات مستخدمين حقيقيين.','Administrator sign-in is required. This public tour never exposes private records.')},
    {id:'loans',icon:'borrowing',tone:'coral',marker:'B',title:l('الاستعارات وطلبات الكتب','Borrowing and Requests'),description:l('مراجعة الطلبات والموافقة أو الرفض وتسجيل الإرجاع.','Review requests, approve or reject loans, and record returns.'),detail:l('تعرض الصفحة الرئيسية تنبيهات الاستعارات النشطة عند وجودها.','The home page displays active borrowing reminders when applicable.')},
    {id:'attendance',icon:'calendar',tone:'emerald',marker:'C',title:l('الحجز والحضور','Schedule and Attendance'),description:l('متابعة حجوزات المعلمين وحضور حصص المكتبة.','Review teacher bookings and library class attendance.'),detail:l('عرض الحصص ومتابعتها من أدوات الإدارة وجدول المكتبة.','Schedule and attendance tools are available through the admin and timetable sections.')},
    {id:'reports',icon:'report',tone:'violet',marker:'D',title:l('الإحصائيات والتقارير','Analytics and Reports'),description:l('عرض مؤشرات المكتبة وكتب الفهرس الرقمي والورقي وتقارير الاستخدام.','View library indicators, physical/digital catalog statistics and usage reports.'),detail:l('يمكن عرض تقارير الاستعارات وحركة الدخول والتقارير التعليمية بحسب الأدوات المتاحة.','Review borrowing, login activity and educational reports using the existing admin tools.')}
  ];

  const card=(item:Entry,index:number)=><article key={item.id} className={'tutorial-showcase-card tutorial-showcase-card--'+item.tone} style={{animationDelay:index*85+'ms'}}>
    <div className="tutorial-showcase-card-top">
      <span className="tutorial-showcase-icon"><FeatureIcon name={item.icon}/></span>
      <span className="tutorial-showcase-number" dir="ltr">{item.marker}</span>
    </div>
    <h3>{item.title}</h3>
    <p>{item.description}</p>
    <details className="tutorial-showcase-more">
      <summary>{l('كيف تعمل هذه الخدمة؟','How does this work?')}</summary>
      <p>{item.detail}</p>
    </details>
  </article>;

  return <div className="tutorial-feature-showcase">
    <section className="tutorial-showcase-section tutorial-showcase-challenges" aria-labelledby="tutorial-challenges-title" id="tutorial-challenges-details">
      <header className="tutorial-showcase-head">
        <div className="tutorial-showcase-head-copy">
          <span className="tutorial-showcase-eyebrow">{l('داخل بطاقة تحديات صقر','INSIDE SAQR CHALLENGES')}</span>
          <h2 id="tutorial-challenges-title">{l('ثلاث مغامرات مع صقر','Three adventures with Saqr')}</h2>
          <p>{l('كل تجربة لها شكلها ووظيفتها الخاصة. هذه البطاقات تشرح المحتوى داخل تحديات صقر، وليست أزرارًا مكررة في البوابة الرئيسية.','Each experience has its own design and purpose. These explain the contents of Saqr Challenges without duplicating homepage shortcuts.')}</p>
        </div>
        <div className="tutorial-showcase-mascot" aria-hidden="true">
          <span className="tutorial-showcase-ring"/><span className="tutorial-showcase-ring tutorial-showcase-ring-two"/>
          <img src="/Saqr%20Challenges.png" alt=""/>
        </div>
      </header>
      <div className="tutorial-showcase-grid tutorial-showcase-three">{challengeItems.map(card)}</div>
    </section>

    <section className="tutorial-showcase-section tutorial-showcase-identity" aria-labelledby="tutorial-identity-title" id="tutorial-identity-details">
      <header className="tutorial-showcase-head tutorial-showcase-identity-head">
        <div className="tutorial-showcase-head-copy">
          <span className="tutorial-showcase-eyebrow">{l('داخل بطاقة صقر وهوية وطن','INSIDE SAQR & NATIONAL IDENTITY')}</span>
          <h2 id="tutorial-identity-title">{l('تحديات تراثنا وجناح كتب الهوية','Heritage challenges and the book pavilion')}</h2>
          <p>{l('أربع تجارب ثقافية وتاريخية، وجناح مستقل لكتب الهوية الوطنية، ضمن قسم واحد منظم وواضح.','Four cultural and historical challenges, plus a dedicated identity book collection, in one accessible section.')}</p>
        </div>
        <div className="tutorial-showcase-flag" aria-hidden="true"><span className="tutorial-showcase-flag-red"/><span className="tutorial-showcase-flag-stripes"><span/><span/><span/></span></div>
      </header>
      <div className="tutorial-showcase-grid tutorial-showcase-heritage-grid">{heritageItems.map(card)}</div>
    </section>

    <section className="tutorial-showcase-section tutorial-showcase-admin" aria-labelledby="tutorial-admin-title" id="tutorial-admin-details">
      <header className="tutorial-showcase-head tutorial-showcase-admin-head">
        <div className="tutorial-showcase-head-copy">
          <span className="tutorial-showcase-eyebrow">{l('من منظور مدير النظام','ADMINISTRATOR VIEW')}</span>
          <h2 id="tutorial-admin-title">{l('أدوات الإدارة وتشغيل المكتبة','Library administration and operations')}</h2>
          <p>{l('تظهر جميع الخدمات الإدارية الرئيسية هنا للشرح. تظل الوظائف والبيانات الفعلية داخل حساب المدير فقط.','The main administrative tools are explained here. Actual controls and records remain available only to signed-in administrators.')}</p>
        </div>
      </header>
      <div className="tutorial-showcase-grid tutorial-showcase-admin-grid">{adminItems.map(card)}</div>
    </section>
  </div>;
}
