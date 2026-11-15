import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../App';
import './aboutVisual.css';

// Preserve the school's existing, approved bilingual history, five wings,
// service descriptions, opening hours and contact information.
const translations = {
    ar: {
        schoolHistory: "عن مدرسة صقر الإمارات الدولية الخاصة",
        historyText: "تأسست مدرسة صقر الإمارات في عام 2007، حيث بدأنا كمدرسة صغيرة تضم عدداً قليلاً من الطلاب والمعلمين. واليوم، نفخر بنمو المدرسة لتضم أكثر من 1300 طالب وطالبة عبر أربعة مبانٍ متطورة، متمسكين بشعارنا: 'التميز ليس غاية، بل أسلوب حياة'.",
        visitWebsite: "الموقع الرسمي للمدرسة",
        librarySection: "عن مكتبة صقر الإمارات",
        libraryIntro: "تقع قاعة المكتبة المركزية في مبنى الأولاد، وتحتوي على أكثر من 15000 كتاب في كافة فروع المعرفة، مقسمة إلى 5 أجنحة تخصصية:",
        wing1: "الجناح الأول: قسم البالغين",
        wing1Desc: "مقسم حسب تصنيف ديوي العشري، ويحتوي على مراجع إنجليزية متخصصة للباحثين والمعلمين والاختصاصيين.",
        wing2: "الجناح الثاني: قسم الشباب",
        wing2Desc: "مناسب للطلاب من الصف 4 إلى 12. يضم دواليب خاصة لـ (ديزني، العلوم، الرياضيات، الرياضة، والموسيقى).",
        wing3: "الجناح الثالث: قسم اللغة العربية",
        wing3Desc: "يتبع تصنيف ديوي، ويضم قسماً خاصاً لدار نشر 'كلمة'، ومساحات قراءة مقسمة لطلاب الحلقات الثلاث.",
        wing4: "الجناح الرابع: قسم الصغار",
        wing4Desc: "مخصص لطلاب الـ KG والصفوف (1-3)، مع مجموعة مختارة من القصص والكتب التفاعلية.",
        wing5: "الجناح الخامس: الجناح الخاص (الهوية الوطنية)",
        wing5Desc: "يضم دولاب (40) للملخصات المسموعة عبر QR، ودولاب (41) المخصص للمحتوى الوطني وكتب الهوية الوطنية الإماراتية.",
        libServices: "خدماتنا المكتبية",
        servicesList: "جلسات قراءة • أوراق عمل • ورش عمل إبداعية • إعارة • مسابقات ثقافية • خدمات صقر الذكي AI",
        contactSection: "التواصل والعمل الرسمي",
        operatingHours: "مواعيد العمل",
        monThu: "الاثنين - الخميس (07:30 ص - 02:00 م)",
        fri: "الجمعة (07:30 ص - 10:30 ص)",
        satSun: "السبت - الأحد (مغلق)",
        contactLink: "تواصل مع أمين المكتبة",
        motto: "العلم نور.. والقراءة هي المفتاح لفتح آفاق المستقبل"
    },
    en: {
        schoolHistory: "About Emirates Falcon Int'l. School",
        historyText: "Founded in 2007, EFIPS has grown to serve over 1300 students across four advanced buildings. Driven by our motto 'Distinction is not a goal, but a way of life', we strive for excellence every day.",
        visitWebsite: "Official School Website",
        librarySection: "About EFIPS Library",
        libraryIntro: "Located in the Boys' Building, our central library houses over 15,000 books across all fields of knowledge, organized into 5 specialized wings:",
        wing1: "1st Wing: Adult Section",
        wing1Desc: "Organized by Dewey Decimal Classification, featuring English resources for researchers, teachers, and specialists.",
        wing2: "2nd Wing: Youth Section",
        wing2Desc: "For Grades 4-12. Includes special cabinets for Disney, Science, Math, Sports, and Music.",
        wing3: "3rd Wing: Arabic Section",
        wing3Desc: "Dewey-classified, including a special 'Kalima' publisher corner and reading areas for all cycles.",
        wing4: "4th Wing: Children's Section",
        wing4Desc: "Dedicated to KG and Grades 1-3, featuring age-appropriate stories and interactive books.",
        wing5: "5th Wing: UAE National Identity",
        wing5Desc: "Home to Shelf 40 (Audio Summaries via QR) and Shelf 41 (UAE National Identity & Heritage content).",
        libServices: "Our Library Services",
        servicesList: "Reading Sessions • Worksheets • Creative Workshops • Lending • Competitions • Saqr AI Services",
        contactSection: "Contact & Working Hours",
        operatingHours: "Operating Hours",
        monThu: "Mon - Thu (07:30 AM - 02:00 PM)",
        fri: "Friday (07:30 AM - 10:30 AM)",
        satSun: "Sat - Sun (Closed)",
        contactLink: "Contact the Librarian",
        motto: "Knowledge is Light.. and Reading is the Key to the Future"
    }
};


type AboutIcon =
  | 'school' | 'library' | 'spark' | 'clock' | 'mail' | 'external'
  | 'adult' | 'youth' | 'arabic' | 'children' | 'flag'
  | 'reading' | 'worksheet' | 'workshop' | 'borrowing' | 'award' | 'ai' | 'arrow';

const Icon = ({ kind, className = '' }: { kind: AboutIcon; className?: string }) => {
  const shapes: Record<AboutIcon, React.ReactNode> = {
    school: <><path d="M3 21h18M5 21V5l7-3 7 3v16M9 7h2m2 0h2M9 11h2m2 0h2M10 21v-5h4v5"/></>,
    library: <><path d="M3 6c3-2 6-2 9 0 3-2 6-2 9 0v13c-3-2-6-2-9 0-3-2-6-2-9 0V6Zm9 0v13"/></>,
    spark: <><path d="m12 2 2.5 6.4L21 11l-6.5 2.6L12 20l-2.5-6.4L3 11l6.5-2.6L12 2ZM20 18l.8 1.8L22.5 20l-1.7.6L20 22.5l-.6-1.9L17.5 20l1.9-.7L20 18Z"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></>,
    external: <><path d="M13 4h7v7m0-7-9 9"/><path d="M19 14v5H5V5h5"/></>,
    adult: <><path d="M4 21v-3a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v3"/><circle cx="12" cy="6" r="4"/></>,
    youth: <><path d="m2 9 10-5 10 5-10 5-10-5ZM6 12v5c4 3 8 3 12 0v-5"/></>,
    arabic: <><path d="M4 6h16M12 4v2M6 10h12M8 10c0 5 3 8 8 9M16 10c-1 5-3 7-8 9"/></>,
    children: <><path d="M4 5h16v14H4zM8 10h8M8 14h5"/><circle cx="17" cy="16" r="1"/></>,
    flag: <><path d="M4 22V3m0 2c5-3 10 3 16 0v12c-6 3-11-3-16 0"/></>,
    reading: <><path d="M3 5c3-2 6-2 9 0 3-2 6-2 9 0v14c-3-2-6-2-9 0-3-2-6-2-9 0V5Zm9 0v14"/></>,
    worksheet: <><path d="M6 3h9l4 4v14H6V3Zm9 0v4h4M9 11h7M9 15h6M9 19h4"/></>,
    workshop: <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z"/></>,
    borrowing: <><path d="M5 4h11v15H5zM9 8h4m-4 4h4M16 7h4v14H9v-2"/></>,
    award: <><path d="M8 3h8v7a4 4 0 0 1-8 0V3ZM8 5H5a3 3 0 0 0 3 4m8-4h3a3 3 0 0 1-3 4M12 14v5m-5 2h10"/></>,
    ai: <><rect x="4" y="6" width="16" height="14" rx="3"/><path d="M12 3v3m-5 7h1m8 0h1M9 17h6"/></>,
    arrow: <><path d="m7 17 10-10M8 7h9v9"/></>,
  };
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {shapes[kind]}
    </svg>
  );
};

type BubbleKey = 'school' | 'library' | 'services' | 'hours' | 'contact';
const schoolWebsite = 'https://www.falcon-school.com';
const librarianEmail = 'islam.ahmed@falcon-school.com';

const AboutPage: React.FC = () => {
  // Both login and About read the same persisted saqr_lang via LanguageProvider.
  // No local About language switch or theme switch: this public page is always light.
  const { locale: lang, dir } = useLanguage();
  const isAr = lang === 'ar';
  const t = (key: keyof typeof translations.ar) => translations[lang][key];
  const l = (ar: string, en: string) => isAr ? ar : en;
  const navigate = useNavigate();
  const [openWing, setOpenWing] = useState<number | null>(null);
  const [hoverWing, setHoverWing] = useState<number | null>(null);
  const selectedWing = hoverWing ?? openWing;

  useEffect(() => {
    // Non-blocking, page-scoped Cairo request with font-display:swap.
    // Never override font styling on any other part of the platform.
    if (document.getElementById('efips-about-cairo')) return;
    const font = document.createElement('link');
    font.id = 'efips-about-cairo';
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap';
    document.head.appendChild(font);
  }, []);

  const navBubbles: { id: BubbleKey; target: string; ar: string; en: string; icon: AboutIcon }[] = [
    { id: 'school', target: 'about-school', ar: 'مدرستنا', en: 'Our School', icon: 'school' },
    { id: 'library', target: 'about-wings', ar: 'أجنحة المكتبة', en: 'Library Wings', icon: 'library' },
    { id: 'services', target: 'about-services', ar: 'خدمات صقر', en: 'Saqr Services', icon: 'spark' },
    { id: 'hours', target: 'about-hours', ar: 'المواعيد', en: 'Hours', icon: 'clock' },
    { id: 'contact', target: 'about-contact', ar: 'التواصل', en: 'Contact', icon: 'mail' },
  ];
  const wings: { icon: AboutIcon; title: string; desc: string; tone: string }[] = [
    { icon: 'adult', title: t('wing1'), desc: t('wing1Desc'), tone: 'slate' },
    { icon: 'youth', title: t('wing2'), desc: t('wing2Desc'), tone: 'teal' },
    { icon: 'arabic', title: t('wing3'), desc: t('wing3Desc'), tone: 'rose' },
    { icon: 'children', title: t('wing4'), desc: t('wing4Desc'), tone: 'sky' },
    { icon: 'flag', title: t('wing5'), desc: t('wing5Desc'), tone: 'gold' },
  ];
  const serviceIcons: AboutIcon[] = ['reading','worksheet','workshop','borrowing','award','ai'];
  const services = t('servicesList').split(' • ');
  const jumpTo = (id: string) => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };
  const hours = [
    { key: 'monThu' as const, icon: 'clock' as const, status: 'weekday' },
    { key: 'fri' as const, icon: 'clock' as const, status: 'friday' },
    { key: 'satSun' as const, icon: 'clock' as const, status: 'closed' },
  ];

  return (
    <div dir={dir} className="efips-about-v3" data-about-theme="light">
      <div className="about3-shell">
        <header className="about3-topbar">
          <button type="button" onClick={() => navigate('/')} className="about3-back">
            <span aria-hidden="true">{isAr ? '←' : '←'}</span>
            {l('العودة لصفحة تسجيل الدخول', 'Back to Login')}
          </button>
          <span className="about3-brand">
            <img src="/school-logo.png" alt="" width="38" height="38" decoding="async" />
            <span>{l('مدرسة صقر الإمارات', 'EFIPS School')}</span>
          </span>
        </header>

        <main>
          <section id="about-school" className="about3-hero" aria-labelledby="about-school-title">
            <div className="about3-hero-visual">
              <span className="about3-guide-ring about3-guide-ring--outer" aria-hidden="true"/>
              <span className="about3-guide-ring about3-guide-ring--inner" aria-hidden="true"/>
              <a href={schoolWebsite} target="_blank" rel="noopener noreferrer"
                className="about3-crest-link"
                aria-label={l('شعار مدرسة صقر الإمارات، فتح الموقع الرسمي للمدرسة', 'Emirates Falcon school logo, open official school website')}
                title={t('visitWebsite')}>
                <img src="/school-logo.png" width="280" height="280"
                  alt={l('شعار مدرسة صقر الإمارات الدولية الخاصة', 'Emirates Falcon International Private School logo')}
                  loading="eager" decoding="async" />
              </a>
              <nav className="about3-hero-bubbles"
                aria-label={l('انتقل إلى أقسام الصفحة', 'Jump to About sections')}>
                {navBubbles.map((bubble) => (
                  <button type="button" key={bubble.id} className={'about3-hero-bubble about3-hero-bubble--'+bubble.id}
                    onClick={() => jumpTo(bubble.target)} title={l(bubble.ar,bubble.en)}>
                    <Icon kind={bubble.icon} />
                    <span>{l(bubble.ar,bubble.en)}</span>
                  </button>
                ))}
              </nav>
            </div>
            <div className="about3-hero-copy">
              <span className="about3-eyebrow"><Icon kind="school" /> {l('من مدرستنا… إلى عالم من المعرفة', 'OUR SCHOOL. OUR STORY.')}</span>
              <h1 id="about-school-title">{t('schoolHistory')}</h1>
              <p>{t('historyText')}</p>
              <a href={schoolWebsite} target="_blank" rel="noopener noreferrer" className="about3-website">
                {t('visitWebsite')} <Icon kind="external"/>
              </a>
            </div>
          </section>

          <section id="about-wings" className="about3-section about3-library-section"
            aria-labelledby="about-library-title">
            <header className="about3-section-heading">
              <span className="about3-eyebrow"><Icon kind="library" /> {l('رحلة بين أجنحة المكتبة','DISCOVER OUR LIBRARY')}</span>
              <h2 id="about-library-title">{t('librarySection')}</h2>
              <p>{t('libraryIntro')}</p>
              <p className="about3-help-text">{l('مرر الماوس على أي جناح لمعرفة التفاصيل، أو اضغط عليه من الهاتف.',
                'Hover over a wing for details, or tap a bubble on your phone.')}</p>
            </header>

            <div className="about3-wings-stage">
              <div className="about3-wings-center">
                <img src="/Saqr.png" alt={l('شخصية صقر مساعد المكتبة','Saqr library assistant mascot')}
                  width="218" height="230" loading="lazy" decoding="async"/>
                <span>{l('صقر يعرّفك بمكتبتنا', 'Explore with Saqr')}</span>
              </div>
              <div className="about3-wings-orbit" aria-label={l('أجنحة المكتبة الخمسة','Five library wings')}>
                {wings.map((wing,index) => (
                  <div key={index} className={'about3-wing-slot about3-wing-slot--'+(index+1)}
                    data-active={selectedWing===index}>
                    <button type="button" className={'about3-wing-bubble about3-wing-bubble--'+wing.tone}
                      aria-expanded={openWing === index} aria-describedby={'about-wing-tip-'+index}
                      onMouseEnter={() => setHoverWing(index)}
                      onMouseLeave={() => setHoverWing(null)}
                      onFocus={() => setHoverWing(index)}
                      onBlur={() => setHoverWing(null)}
                      onClick={() => setOpenWing(current => current===index ? null : index)}>
                      <Icon kind={wing.icon}/>
                      <span>{wing.title}</span>
                    </button>
                    <div role="tooltip" id={'about-wing-tip-'+index} className="about3-wing-tooltip">
                      <strong>{wing.title}</strong>
                      <p>{wing.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="about3-wing-info" role="status" aria-live="polite">
              {selectedWing === null ? (
                <p>{l('اختر أحد الأجنحة الخمسة لتتعرف إلى الكتب والخدمات الموجودة فيه.',
                  'Choose one of the five wings to discover its books and resources.')}</p>
              ) : (
                <>
                  <strong>{wings[selectedWing].title}</strong>
                  <p>{wings[selectedWing].desc}</p>
                </>
              )}
            </div>
          </section>

          <section id="about-services" className="about3-section about3-services" aria-labelledby="about-services-title">
            <header className="about3-section-heading">
              <span className="about3-eyebrow"><Icon kind="spark"/> {l('مع صقر كل يوم جديد','DISCOVER WITH SAQR')}</span>
              <h2 id="about-services-title">{t('libServices')}</h2>
              <p>{l('نقرأ، نتعلم، نبدع… ونشارك المعرفة معًا.','Read, learn, create and share what you discover.')}</p>
            </header>
            <div className="about3-services-layout">
              <img className="about3-services-mascot" src="/Saqr.png" width="145" height="175" loading="lazy" decoding="async"
                alt={l('شخصية صقر','Saqr mascot')}/>
              <div className="about3-services-bubbles">
                {services.map((service,index) => (
                  <div key={service} className={'about3-service-bubble about3-service-bubble--'+(index%3)}>
                    <Icon kind={serviceIcons[index] ?? 'spark'} />
                    <span>{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="about3-contact-grid" aria-label={t('contactSection')}>
            <article id="about-hours" className="about3-hours-panel" aria-labelledby="about-hours-title">
              <header className="about3-panel-heading">
                <span className="about3-panel-icon about3-panel-icon--green"><Icon kind="clock"/></span>
                <div><span className="about3-panel-kicker">{l('نرحب بكم','VISIT OUR LIBRARY')}</span>
                  <h2 id="about-hours-title">{t('operatingHours')}</h2></div>
              </header>
              <div className="about3-hours-list">
                {hours.map((row) => {
                  const parts=t(row.key).split(' (');
                  return (
                    <div key={row.key} className={'about3-hour-row about3-hour-row--'+row.status}>
                      <Icon kind={row.icon}/>
                      <span className="about3-hour-day">{parts[0]}</span>
                      <span className="about3-hour-time" dir="auto">{parts[1]?.replace(')','') ?? ''}</span>
                    </div>
                  );
                })}
              </div>
              <p className="about3-panel-note">{l('يسعدنا استقبال استفساراتكم خلال أوقات العمل.',
                'We are happy to help with library questions during operating hours.')}</p>
            </article>

            <article id="about-contact" className="about3-contact-panel" aria-labelledby="about-contact-title">
              <header className="about3-panel-heading">
                <span className="about3-panel-icon about3-panel-icon--rose"><Icon kind="mail"/></span>
                <div><span className="about3-panel-kicker">{l('خلّنا على تواصل','GET IN TOUCH')}</span>
                  <h2 id="about-contact-title">{t('contactLink')}</h2></div>
              </header>
              <p>{l('عندك سؤال عن كتاب أو خدمة مكتبية؟ تواصل مع أمين المكتبة مباشرة.',
                'Need help finding a book or using a library service? Reach out to the librarian.')}</p>
              <div className="about3-contact-icon" aria-hidden="true"><Icon kind="mail"/></div>
              <a href={'mailto:'+librarianEmail} className="about3-contact-link">
                <Icon kind="mail"/> <span dir="ltr">{librarianEmail}</span>
              </a>
              <p className="about3-panel-note">{l('اضغط على البريد الإلكتروني لفتح تطبيق المراسلة.',
                'Tap the email address to open your email app.')}</p>
            </article>
          </section>

          <footer className="about3-footer">
            <p>{t('motto')}</p>
            <span className="about3-flag-bar" aria-hidden="true">
              <i/><i/><i/><i/>
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AboutPage;
