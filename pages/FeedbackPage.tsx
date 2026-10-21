import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../App';

const translations = {
    ar: {
        pageTitle: "تقييم الخدمات",
        subTitle: "القراءة ذكاء، والتطوير شراكة.. بصمتك اليوم ترسم مستقبل خدماتنا",
        nameLabel: "الاسم الكامل",
        categoryLabel: "الصفة المدرسية",
        gradeLabel: "المرحلة الدراسية",
        ratingService: "تقييم خدمات المكتبة",
        ratingStaff: "تقييم أداء أمين المكتبة",
        ratingSaqr: "تقييم ذكاء صقر AI",
        devSuggestions: "مقترحات تطوير الخدمات",
        bookSuggestions: "كتب تود إضافتها رقمياً",
        submitBtn: "إرسال المقترح",
        successMsg: "تم الاستلام بنجاح! شكراً لمساهمتك في رسم المستقبل.",
        student: "طالب",
        teacher: "معلم",
        admin: "إداري",
        optExcellent: "ممتاز",
        optVeryGood: "جيد جداً",
        optAverage: "متوسط",
        optNeedsDev: "يحتاج تطوير",
        optSmart: "ذكي جداً",
        optUseful: "مفيد",
        formHeading: "صوتك يصنع الفرق",
        formDescription: "شاركنا رأيك وساعدنا على تطوير تجربتك في المكتبة.",
        ratingHeading: "كيف تقيّم تجربتك؟",
        ratingDescription: "اختر التقييم الذي يعكس تجربتك الفعلية.",
        suggestionsHeading: "أفكارك تصنع مستقبل المكتبة",
        suggestionsDescription: "نرحب بأفكارك ومقترحاتك لتطوير خدماتنا وإثراء المحتوى الرقمي.",
        ideasPlaceholder: "شاركنا أفكارك لتطوير المكتبة...",
        booksPlaceholder: "اكتب أسماء الكتب أو المجالات التي ترغب في إضافتها...",
        namePlaceholder: "جارٍ التعرف على الاسم...",
        sending: "جارٍ إرسال المقترح...",
        sendError: "تعذر إرسال المقترح. يرجى المحاولة مرة أخرى.",
        sendAnother: "إرسال مقترح آخر",
        identityHeading: "بيانات مقدم المقترح",
        identityDescription: "يتم التعرف على بياناتك تلقائياً من حسابك في الموقع.",
        successHeading: "وصل صوتك إلينا!",
        successDescription: "نقدّر وقتك وأفكارك. مساهمتك تساعدنا على تقديم تجربة مكتبية أفضل.",
        requiredNote: "رأيك مهم لنا، ونقدّر كل اقتراح يسهم في التطوير.",
        footerTitle: "مختبر الابتكار",
        footerSubtitle: "نقرأ اليوم لنبتكر الغد"
    },
    en: {
        pageTitle: "Library Feedback",
        subTitle: "Reading is Intelligence, Development is Partnership. Your feedback today shapes the future of our library.",
        nameLabel: "Full Name",
        categoryLabel: "School Affiliation",
        gradeLabel: "Grade Level",
        ratingService: "Library Services Rating",
        ratingStaff: "Librarian Performance",
        ratingSaqr: "Saqr AI Intelligence",
        devSuggestions: "Development Suggestions",
        bookSuggestions: "Titles to Add Digitally",
        submitBtn: "Submit Feedback",
        successMsg: "Received successfully! Thank you for helping shape the future.",
        student: "Student",
        teacher: "Teacher",
        admin: "Staff",
        optExcellent: "Excellent",
        optVeryGood: "Very Good",
        optAverage: "Average",
        optNeedsDev: "Needs Work",
        optSmart: "Very Smart",
        optUseful: "Useful",
        formHeading: "Your Voice Makes a Difference",
        formDescription: "Share your thoughts and help us improve your library experience.",
        ratingHeading: "How Would You Rate Your Experience?",
        ratingDescription: "Choose the rating that best reflects your experience.",
        suggestionsHeading: "Ideas That Shape Our Library",
        suggestionsDescription: "Share your ideas to improve our services and enrich our digital collection.",
        ideasPlaceholder: "Share your ideas for improving the library...",
        booksPlaceholder: "Enter book titles or subjects you would like us to add...",
        namePlaceholder: "Recognizing your name...",
        sending: "Submitting your feedback...",
        sendError: "Unable to submit your feedback. Please try again.",
        sendAnother: "Send Another Suggestion",
        identityHeading: "Your Information",
        identityDescription: "Your information is automatically retrieved from your website account.",
        successHeading: "Your Voice Has Been Heard!",
        successDescription: "We appreciate your time and ideas. Your feedback helps us build a better library experience.",
        requiredNote: "Your feedback matters. Every idea helps us improve.",
        footerTitle: "Innovation Lab",
        footerSubtitle: "Read Today. Innovate Tomorrow."
    }
};

const UAEFlagIcon = () => (
    <svg
        viewBox="0 0 640 480"
        className="w-20 h-16 sm:w-24 sm:h-20 rounded-2xl shadow-lg mx-auto"
        role="img"
        aria-label="United Arab Emirates flag"
    >
        <path fill="#00732f" d="M0 0h640v160H0z" />
        <path fill="#fff" d="M0 160h640v160H0z" />
        <path fill="#000" d="M0 320h640v160H0z" />
        <path fill="#ff0000" d="M0 0h220v480H0z" />
    </svg>
);

const Icon = ({
    name,
    className = "w-5 h-5"
}: {
    name: 'sparkles' | 'book' | 'user' | 'star' | 'send' | 'check' | 'lightbulb' | 'library' | 'arrow';
    className?: string;
}) => {
    const common = {
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const
    };

    const paths: Record<typeof name, React.ReactNode> = {
        sparkles: (
            <>
                <path {...common} d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" />
                <path {...common} d="m19 14 1.1 2.5L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.5L19 14Z" />
                <path {...common} d="m5 2 .8 2.2L8 5l-2.2.8L5 8l-.8-2.2L2 5l2.2-.8L5 2Z" />
            </>
        ),
        book: (
            <>
                <path {...common} d="M12 7v14" />
                <path {...common} d="M3 5.5A2.5 2.5 0 0 1 5.5 3H12v18H5.5A2.5 2.5 0 0 0 3 23V5.5Z" />
                <path {...common} d="M21 5.5A2.5 2.5 0 0 0 18.5 3H12v18h6.5a2.5 2.5 0 0 1 2.5 2V5.5Z" />
            </>
        ),
        user: (
            <>
                <circle {...common} cx="12" cy="8" r="4" />
                <path {...common} d="M4 21a8 8 0 0 1 16 0" />
            </>
        ),
        star: (
            <path
                {...common}
                d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"
            />
        ),
        send: (
            <>
                <path {...common} d="m22 2-7 20-4-9-9-4Z" />
                <path {...common} d="M22 2 11 13" />
            </>
        ),
        check: <path {...common} d="m5 12 4 4L19 6" />,
        lightbulb: (
            <>
                <path {...common} d="M9 18h6" />
                <path {...common} d="M10 22h4" />
                <path {...common} d="M8.5 14.5a7 7 0 1 1 7 0c-.8.6-1.5 1.5-1.5 2.5h-4c0-1-.7-1.9-1.5-2.5Z" />
            </>
        ),
        library: (
            <>
                <path {...common} d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path {...common} d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                <path {...common} d="M9 7h6M9 11h6" />
            </>
        ),
        arrow: <path {...common} d="m9 18 6-6-6-6" />
    };

    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
        >
            {paths[name]}
        </svg>
    );
};

const DropdownArrow = () => (
    <div className="absolute end-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
        <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="m7 10 5 5 5-5" />
        </svg>
    </div>
);

const RevealOnScroll = ({
    children,
    delay = 0
}: {
    children: React.ReactNode;
    delay?: number;
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = elementRef.current;

        if (!element) return;

        if (typeof IntersectionObserver === 'undefined') {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.05,
                rootMargin: '0px 0px -25px 0px'
            }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={elementRef}
            className={`w-full transition-[opacity,transform] duration-700 ease-out ${
                isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6'
            }`}
            style={{
                transitionDelay: `${delay}ms`,
                willChange: isVisible ? 'auto' : 'opacity, transform'
            }}
        >
            {children}
        </div>
    );
};

const FeedbackPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const isAr = locale === 'ar';

    const t = (key: keyof typeof translations.ar) => translations[locale][key];

    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('student');
    const [userGrade, setUserGrade] = useState('');

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('current_user');
            const storedType = localStorage.getItem('user_type');

            if (storedUser) {
                const user = JSON.parse(storedUser);

                const name = isAr
                    ? (user.name_ar || user.name_en || '')
                    : (user.name_en || user.name_ar || '');

                setUserName(name);

                if (user.grade) {
                    setUserGrade(user.grade);
                }
            }

            if (storedType) {
                setUserRole(storedType);
            }
        } catch (error) {
            console.error('Unable to load current user information:', error);
        }
    }, [isAr]);

    // الإبقاء على رابط الإرسال الأصلي.
    const FORMSPREE_URL = 'https://formspree.io/f/xlggjwql';

    const playSuccessSound = () => {
        try {
            const audio = new Audio(
                'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'
            );

            audio.volume = 0.35;
            audio.play().catch(() => {});
        } catch {
            // عدم تعطيل إرسال النموذج في حالة تعذر تشغيل الصوت.
        }
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (isSubmitting) return;

        const form = e.currentTarget;
        const data = new FormData(form);

        setIsSubmitting(true);
        setSubmitError('');

        try {
            const response = await fetch(FORMSPREE_URL, {
                method: 'POST',
                body: data,
                headers: {
                    Accept: 'application/json'
                }
            });

            if (!response.ok) {
                setSubmitError(t('sendError'));
                return;
            }

            playSuccessSound();
            form.reset();
            setSubmitted(true);
        } catch (error) {
            console.error('Feedback submission failed:', error);
            setSubmitError(t('sendError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = [
        'w-full min-w-0 rounded-2xl',
        'border border-slate-200 dark:border-neutral-800',
        'bg-white dark:bg-neutral-900',
        'px-4 py-4 md:px-5 md:py-[1.125rem]',
        'text-sm md:text-base font-bold',
        'text-slate-800 dark:text-slate-100',
        'placeholder:text-slate-400 dark:placeholder:text-slate-500',
        'outline-none transition-all duration-300',
        'focus:border-emerald-500 dark:focus:border-emerald-400',
        'focus:ring-4 focus:ring-emerald-500/10',
        'shadow-sm'
    ].join(' ');

    const readonlyInputClass = [
        inputClass,
        '!bg-slate-50 dark:!bg-neutral-900/70',
        'cursor-default'
    ].join(' ');

    const sectionHeadingClass = [
        'text-xl md:text-2xl font-black',
        'text-slate-900 dark:text-white'
    ].join(' ');

    return (
        <div
            dir={dir}
            className="feedback-page relative isolate min-h-[100dvh] w-full overflow-x-clip bg-white dark:bg-black text-slate-900 dark:text-white transition-colors duration-300"
        >
            {/* خلفية زخرفية: شفافة في اللايت مود وأكثر هدوءاً في الدارك مود */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
            >
                <div className="feedback-orb feedback-orb-one absolute -top-40 -start-40 h-[25rem] w-[25rem] rounded-full bg-emerald-300/20 dark:bg-emerald-500/[0.09] blur-[100px]" />

                <div className="feedback-orb feedback-orb-two absolute top-[28rem] -end-40 h-[24rem] w-[24rem] rounded-full bg-amber-300/20 dark:bg-amber-500/[0.07] blur-[110px]" />

                <div className="feedback-orb feedback-orb-three absolute bottom-0 start-[28%] h-[20rem] w-[20rem] rounded-full bg-sky-300/15 dark:bg-sky-500/[0.06] blur-[100px]" />

                <div className="feedback-grid absolute inset-0 opacity-[0.32] dark:opacity-[0.12]" />
            </div>

            <main className="relative mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-4 pb-12 pt-10 sm:px-6 sm:pt-14 md:gap-14 md:px-8 md:pt-20">

                {/* رأس الصفحة */}
                <RevealOnScroll>
                    <header className="relative mx-auto w-full max-w-4xl text-center">

                        <div className="feedback-fade-in mb-7 inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/90 px-4 py-2.5 text-xs font-black text-emerald-800 shadow-sm shadow-emerald-900/5 dark:border-emerald-500/20 dark:bg-emerald-500/[0.08] dark:text-emerald-300 sm:text-sm">
                            <Icon name="sparkles" className="h-4 w-4 shrink-0" />
                            <span>
                                {isAr
                                    ? 'مساحة صوتك وإبداعك'
                                    : 'YOUR VOICE & INNOVATION'}
                            </span>
                        </div>

                        <h1 className={`feedback-title-gradient text-4xl font-black leading-[1.3] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl ${
                            !isAr ? 'leading-tight' : ''
                        }`}>
                            {t('pageTitle')}
                        </h1>

                        <div className="mx-auto mt-6 flex items-center justify-center gap-2.5">
                            <span className="h-1.5 w-10 rounded-full bg-emerald-500 sm:w-14" />
                            <span className="h-1.5 w-5 rounded-full bg-amber-400 sm:w-7" />
                            <span className="h-1.5 w-2 rounded-full bg-sky-400" />
                        </div>

                        <p className="mx-auto mt-7 max-w-3xl text-base font-semibold leading-8 text-slate-600 dark:text-slate-400 sm:text-lg md:text-xl md:leading-9">
                            {t('subTitle')}
                        </p>

                        <div className="mx-auto mt-8 flex max-w-max items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
                            <Icon
                                name="library"
                                className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400"
                            />
                            <span className="text-xs font-extrabold tracking-wide text-slate-600 dark:text-slate-300 sm:text-sm">
                                EFIPS INNOVATION LAB
                            </span>
                            <span className="h-1 w-1 rounded-full bg-amber-500" />
                            <span className="text-xs font-bold tabular-nums text-slate-500 dark:text-slate-400">
                                2026
                            </span>
                        </div>
                    </header>
                </RevealOnScroll>

                {/* شاشة النجاح */}
                {submitted ? (
                    <RevealOnScroll>
                        <section
                            aria-live="polite"
                            className="feedback-success-card relative mx-auto w-full max-w-3xl overflow-hidden rounded-[2rem] border border-emerald-200 bg-white p-6 text-center shadow-[0_24px_80px_-30px_rgba(16,185,129,0.25)] dark:border-emerald-500/25 dark:bg-neutral-950 dark:shadow-[0_24px_80px_-30px_rgba(16,185,129,0.12)] sm:rounded-[2.5rem] sm:p-10 md:p-14"
                        >
                            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400" />

                            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-emerald-200 bg-emerald-50 text-emerald-600 shadow-lg shadow-emerald-500/10 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400 sm:h-24 sm:w-24">
                                <Icon name="check" className="h-10 w-10 sm:h-12 sm:w-12" />
                            </div>

                            <div className="mb-8">
                                <UAEFlagIcon />
                            </div>

                            <h2 className="text-2xl font-black leading-relaxed text-slate-900 dark:text-white sm:text-3xl md:text-4xl">
                                {t('successHeading')}
                            </h2>

                            <p className="mx-auto mt-5 max-w-xl text-sm font-semibold leading-8 text-slate-600 dark:text-slate-400 sm:text-base">
                                {t('successDescription')}
                            </p>

                            <p className="mx-auto mt-5 max-w-2xl text-sm font-bold leading-8 text-emerald-700 dark:text-emerald-300">
                                {t('successMsg')}
                            </p>

                            <button
                                type="button"
                                onClick={() => {
                                    setSubmitError('');
                                    setSubmitted(false);
                                }}
                                className="feedback-button mt-9 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-7 py-4 text-base font-black text-white shadow-lg shadow-emerald-700/20 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-700/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30 active:translate-y-0 sm:w-auto sm:px-10 sm:py-4"
                            >
                                <Icon name="send" className="h-5 w-5" />
                                <span>{t('sendAnother')}</span>
                            </button>
                        </section>
                    </RevealOnScroll>
                ) : (
                    <RevealOnScroll delay={100}>
                        <form
                            onSubmit={handleSubmit}
                            aria-busy={isSubmitting}
                            className="feedback-form relative w-full overflow-hidden rounded-[2rem] border border-slate-200/90 bg-white shadow-[0_25px_100px_-45px_rgba(15,23,42,0.25)] dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-[0_25px_100px_-45px_rgba(0,0,0,0.8)] sm:rounded-[2.5rem] lg:rounded-[3rem]"
                        >
                            {/* الشريط العلوي */}
                            <div className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-l from-emerald-50/80 via-white to-amber-50/50 px-5 py-8 dark:border-neutral-800 dark:from-emerald-500/[0.07] dark:via-neutral-950 dark:to-amber-500/[0.04] sm:px-8 sm:py-10 md:px-12 md:py-12">
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -end-8 -top-16 h-44 w-44 rounded-full border border-emerald-500/10 dark:border-emerald-400/10"
                                />

                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -end-1 -top-9 h-32 w-32 rounded-full border border-amber-500/15 dark:border-amber-400/10"
                                />

                                <div className="relative flex items-start gap-4 sm:gap-5">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-700/15 sm:h-14 sm:w-14">
                                        <Icon name="sparkles" className="h-6 w-6 sm:h-7 sm:w-7" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h2 className="text-xl font-black leading-relaxed text-slate-900 dark:text-white sm:text-2xl md:text-3xl">
                                            {t('formHeading')}
                                        </h2>

                                        <p className="mt-2 max-w-2xl text-sm font-semibold leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
                                            {t('formDescription')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-10 p-5 sm:space-y-12 sm:p-8 md:space-y-14 md:p-12 lg:p-14">

                                {/* بيانات المستخدم */}
                                <section aria-labelledby="feedback-identity-heading">
                                    <div className="mb-6 flex items-start gap-3 sm:mb-8">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-400">
                                            <Icon name="user" className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0">
                                            <h3
                                                id="feedback-identity-heading"
                                                className={sectionHeadingClass}
                                            >
                                                {t('identityHeading')}
                                            </h3>

                                            <p className="mt-1 text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                                                {t('identityDescription')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                                        <div className="min-w-0 space-y-2.5">
                                            <label
                                                htmlFor="feedback-category"
                                                className="block text-sm font-extrabold text-slate-700 dark:text-slate-300"
                                            >
                                                {t('categoryLabel')}
                                            </label>

                                            <input
                                                id="feedback-category"
                                                type="text"
                                                readOnly
                                                value={
                                                    userRole === 'teacher'
                                                        ? t('teacher')
                                                        : userRole === 'admin'
                                                            ? t('admin')
                                                            : t('student')
                                                }
                                                className={readonlyInputClass}
                                            />

                                            <input
                                                type="hidden"
                                                name="User_Category"
                                                value={userRole}
                                            />
                                        </div>

                                        <div className="min-w-0 space-y-2.5">
                                            <label
                                                htmlFor="feedback-name"
                                                className="block text-sm font-extrabold text-slate-700 dark:text-slate-300"
                                            >
                                                {t('nameLabel')}
                                            </label>

                                            <input
                                                id="feedback-name"
                                                name="Full_Name"
                                                readOnly
                                                value={userName}
                                                type="text"
                                                className={readonlyInputClass}
                                                placeholder={t('namePlaceholder')}
                                            />
                                        </div>
                                    </div>

                                    {userRole === 'student' && userGrade && (
                                        <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50/60 p-4 dark:border-sky-500/15 dark:bg-sky-500/[0.04] sm:mt-6 sm:p-5">
                                            <label
                                                htmlFor="feedback-grade"
                                                className="mb-2.5 block text-sm font-extrabold text-sky-700 dark:text-sky-300"
                                            >
                                                {t('gradeLabel')}
                                            </label>

                                            <input
                                                id="feedback-grade"
                                                name="Grade"
                                                readOnly
                                                value={userGrade}
                                                type="text"
                                                className={readonlyInputClass}
                                            />
                                        </div>
                                    )}
                                </section>

                                <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-neutral-800" />

                                {/* التقييمات */}
                                <section aria-labelledby="feedback-ratings-heading">
                                    <div className="mb-6 flex items-start gap-3 sm:mb-8">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400">
                                            <Icon name="star" className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0">
                                            <h3
                                                id="feedback-ratings-heading"
                                                className={sectionHeadingClass}
                                            >
                                                {t('ratingHeading')}
                                            </h3>

                                            <p className="mt-1 text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                                                {t('ratingDescription')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">

                                        {/* تقييم المكتبة */}
                                        <div className="feedback-rating-card group min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-500/5 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-rose-500/30 sm:p-6">
                                            <div className="mb-5 flex items-center gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500 transition-transform duration-300 group-hover:scale-105 dark:bg-rose-500/10 dark:text-rose-400">
                                                    <Icon name="book" className="h-5 w-5" />
                                                </div>

                                                <div className="min-w-0">
                                                    <label
                                                        htmlFor="rating-service"
                                                        className="block text-sm font-black leading-6 text-slate-800 dark:text-slate-100"
                                                    >
                                                        {t('ratingService')}
                                                    </label>
                                                    <span className="mt-0.5 block text-xs font-semibold text-slate-400 dark:text-slate-500">
                                                        {isAr ? 'خدمات المكتبة' : 'Library experience'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <select
                                                    id="rating-service"
                                                    name="Service_Rating"
                                                    defaultValue="5"
                                                    className={`${inputClass} cursor-pointer appearance-none pe-11`}
                                                >
                                                    <option value="5">{t('optExcellent')}</option>
                                                    <option value="4">{t('optVeryGood')}</option>
                                                    <option value="3">{t('optAverage')}</option>
                                                </select>
                                                <DropdownArrow />
                                            </div>
                                        </div>

                                        {/* تقييم أمين المكتبة */}
                                        <div className="feedback-rating-card group min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-500/5 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-amber-500/30 sm:p-6">
                                            <div className="mb-5 flex items-center gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-transform duration-300 group-hover:scale-105 dark:bg-amber-500/10 dark:text-amber-400">
                                                    <Icon name="user" className="h-5 w-5" />
                                                </div>

                                                <div className="min-w-0">
                                                    <label
                                                        htmlFor="rating-staff"
                                                        className="block text-sm font-black leading-6 text-slate-800 dark:text-slate-100"
                                                    >
                                                        {t('ratingStaff')}
                                                    </label>
                                                    <span className="mt-0.5 block text-xs font-semibold text-slate-400 dark:text-slate-500">
                                                        {isAr ? 'جودة الخدمة' : 'Service quality'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <select
                                                    id="rating-staff"
                                                    name="Staff_Rating"
                                                    defaultValue="5"
                                                    className={`${inputClass} cursor-pointer appearance-none pe-11`}
                                                >
                                                    <option value="5">{t('optExcellent')}</option>
                                                    <option value="4">{t('optVeryGood')}</option>
                                                    <option value="3">{t('optAverage')}</option>
                                                </select>
                                                <DropdownArrow />
                                            </div>
                                        </div>

                                        {/* تقييم صقر */}
                                        <div className="feedback-rating-card group min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-emerald-500/30 sm:p-6">
                                            <div className="mb-5 flex items-center gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-transform duration-300 group-hover:scale-105 dark:bg-emerald-500/10 dark:text-emerald-400">
                                                    <Icon name="sparkles" className="h-5 w-5" />
                                                </div>

                                                <div className="min-w-0">
                                                    <label
                                                        htmlFor="rating-saqr"
                                                        className="block text-sm font-black leading-6 text-slate-800 dark:text-slate-100"
                                                    >
                                                        {t('ratingSaqr')}
                                                    </label>
                                                    <span className="mt-0.5 block text-xs font-semibold text-slate-400 dark:text-slate-500">
                                                        {isAr ? 'التجربة الذكية' : 'AI experience'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <select
                                                    id="rating-saqr"
                                                    name="Saqr_Rating"
                                                    defaultValue="5"
                                                    className={`${inputClass} cursor-pointer appearance-none pe-11`}
                                                >
                                                    <option value="5">{t('optSmart')}</option>
                                                    <option value="4">{t('optUseful')}</option>
                                                    <option value="3">{t('optAverage')}</option>
                                                </select>
                                                <DropdownArrow />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-neutral-800" />

                                {/* المقترحات */}
                                <section aria-labelledby="feedback-suggestions-heading">
                                    <div className="mb-6 flex items-start gap-3 sm:mb-8">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-400">
                                            <Icon name="lightbulb" className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0">
                                            <h3
                                                id="feedback-suggestions-heading"
                                                className={sectionHeadingClass}
                                            >
                                                {t('suggestionsHeading')}
                                            </h3>

                                            <p className="mt-1 text-sm font-medium leading-7 text-slate-500 dark:text-slate-400">
                                                {t('suggestionsDescription')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                                        <div className="feedback-textarea-card min-w-0 rounded-2xl border border-slate-200 bg-white p-4 transition-colors duration-300 focus-within:border-sky-300 dark:border-neutral-800 dark:bg-neutral-950 dark:focus-within:border-sky-500/40 sm:p-5">
                                            <label
                                                htmlFor="feedback-ideas"
                                                className="mb-3 flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-100"
                                            >
                                                <Icon
                                                    name="lightbulb"
                                                    className="h-4 w-4 shrink-0 text-sky-500"
                                                />
                                                <span>{t('devSuggestions')}</span>
                                            </label>

                                            <textarea
                                                id="feedback-ideas"
                                                name="Dev_Ideas"
                                                rows={5}
                                                className={`${inputClass} min-h-[140px] resize-y leading-7`}
                                                placeholder={t('ideasPlaceholder')}
                                            />
                                        </div>

                                        <div className="feedback-textarea-card min-w-0 rounded-2xl border border-slate-200 bg-white p-4 transition-colors duration-300 focus-within:border-emerald-300 dark:border-neutral-800 dark:bg-neutral-950 dark:focus-within:border-emerald-500/40 sm:p-5">
                                            <label
                                                htmlFor="feedback-books"
                                                className="mb-3 flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-100"
                                            >
                                                <Icon
                                                    name="book"
                                                    className="h-4 w-4 shrink-0 text-emerald-500"
                                                />
                                                <span>{t('bookSuggestions')}</span>
                                            </label>

                                            <textarea
                                                id="feedback-books"
                                                name="Book_Requests"
                                                rows={5}
                                                className={`${inputClass} min-h-[140px] resize-y leading-7`}
                                                placeholder={t('booksPlaceholder')}
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* رسائل الخطأ */}
                                {submitError && (
                                    <div
                                        role="alert"
                                        className="feedback-error flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold leading-7 text-rose-700 dark:border-rose-500/25 dark:bg-rose-500/[0.07] dark:text-rose-300 sm:p-5"
                                    >
                                        <svg
                                            className="mt-1 h-5 w-5 shrink-0"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            aria-hidden="true"
                                        >
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
                                        </svg>

                                        <p>{submitError}</p>
                                    </div>
                                )}

                                {/* زر الإرسال */}
                                <div className="border-t border-slate-100 pt-7 dark:border-neutral-800 sm:pt-9">
                                    <p className="mb-5 text-center text-xs font-semibold leading-6 text-slate-500 dark:text-slate-400 sm:text-sm">
                                        {t('requiredNote')}
                                    </p>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`feedback-button group relative mx-auto flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl px-6 py-4 text-base font-black text-white shadow-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30 sm:w-auto sm:min-w-[260px] sm:px-10 sm:py-5 sm:text-lg ${
                                            isSubmitting
                                                ? 'cursor-wait bg-emerald-700 opacity-80'
                                                : 'bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 shadow-emerald-700/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-700/25 active:translate-y-0'
                                        }`}
                                    >
                                        {!isSubmitting && (
                                            <span
                                                aria-hidden="true"
                                                className="feedback-button-shine pointer-events-none absolute inset-0"
                                            />
                                        )}

                                        {isSubmitting ? (
                                            <>
                                                <svg
                                                    className="h-5 w-5 animate-spin"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    aria-hidden="true"
                                                >
                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="9"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        opacity="0.25"
                                                    />
                                                    <path
                                                        d="M21 12a9 9 0 0 0-9-9"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        strokeLinecap="round"
                                                    />
                                                </svg>

                                                <span>{t('sending')}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>{t('submitBtn')}</span>
                                                <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                                                    <Icon name="send" className="h-5 w-5" />
                                                </span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </RevealOnScroll>
                )}

                {/* تذييل الصفحة */}
                <RevealOnScroll delay={150}>
                    <footer className="mx-auto w-full max-w-3xl pb-4 pt-1 text-center">
                        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-emerald-600 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:text-emerald-400">
                            <Icon name="book" className="h-5 w-5" />
                        </div>

                        <p className="text-xs font-black tracking-[0.18em] text-slate-500 dark:text-slate-400 sm:text-sm">
                            EFIPS INNOVATION LAB <span className="text-emerald-600 dark:text-emerald-400">•</span> 2026
                        </p>

                        <div className="mx-auto my-4 h-1 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-amber-400" />

                        <p className="text-sm font-black text-slate-800 dark:text-slate-200 sm:text-base">
                            {t('footerSubtitle')}
                        </p>

                        <p className="mt-3 text-xs font-semibold text-slate-400 dark:text-slate-500">
                            Librarian: Islam Ahmed
                        </p>
                    </footer>
                </RevealOnScroll>
            </main>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap');

                .feedback-page,
                .feedback-page * {
                    font-family: 'Cairo', sans-serif;
                }

                .feedback-page {
                    isolation: isolate;
                }

                .feedback-grid {
                    background-image:
                        linear-gradient(to right, rgba(148,163,184,0.08) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(148,163,184,0.08) 1px, transparent 1px);
                    background-size: 48px 48px;
                    mask-image: linear-gradient(to bottom, black, transparent 85%);
                    -webkit-mask-image: linear-gradient(to bottom, black, transparent 85%);
                }

                .dark .feedback-grid {
                    background-image:
                        linear-gradient(to right, rgba(148,163,184,0.10) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(148,163,184,0.10) 1px, transparent 1px);
                }

                .feedback-orb {
                    animation: feedback-float 15s ease-in-out infinite alternate;
                    transform: translateZ(0);
                    will-change: transform;
                }

                .feedback-orb-two {
                    animation-duration: 19s;
                    animation-delay: -4s;
                }

                .feedback-orb-three {
                    animation-duration: 22s;
                    animation-delay: -7s;
                }

                .feedback-title-gradient {
                    color: #0f172a;
                    background-image: linear-gradient(
                        115deg,
                        #0f172a 0%,
                        #047857 48%,
                        #0f766e 75%,
                        #b7791f 100%
                    );
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .dark .feedback-title-gradient {
                    background-image: linear-gradient(
                        115deg,
                        #ffffff 0%,
                        #6ee7b7 44%,
                        #5eead4 75%,
                        #fcd34d 100%
                    );
                }

                .feedback-rating-card,
                .feedback-textarea-card {
                    transform: translateZ(0);
                }

                .feedback-button-shine {
                    background: linear-gradient(
                        110deg,
                        transparent 20%,
                        rgba(255,255,255,0.20) 45%,
                        transparent 70%
                    );
                    transform: translateX(-120%);
                    transition: transform 0.75s ease;
                }

                .feedback-button:hover .feedback-button-shine {
                    transform: translateX(120%);
                }

                .feedback-success-card {
                    animation: feedback-success-in 0.65s cubic-bezier(0.16, 1, 0.3, 1) both;
                }

                .feedback-fade-in {
                    animation: feedback-fade-up 0.8s ease-out both;
                }

                @keyframes feedback-float {
                    0% {
                        transform: translate3d(0, 0, 0) scale(1);
                    }
                    50% {
                        transform: translate3d(18px, -22px, 0) scale(1.04);
                    }
                    100% {
                        transform: translate3d(-12px, 15px, 0) scale(0.97);
                    }
                }

                @keyframes feedback-fade-up {
                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes feedback-success-in {
                    from {
                        opacity: 0;
                        transform: translateY(14px) scale(0.985);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .feedback-page *,
                    .feedback-page *::before,
                    .feedback-page *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        scroll-behavior: auto !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default FeedbackPage;
