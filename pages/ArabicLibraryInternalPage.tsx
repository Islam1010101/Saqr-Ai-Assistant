import React, { useState, useMemo, useCallback } from 'react';
import { useLanguage } from '../App';
import { useNavigate } from 'react-router-dom';

// --- قاعدة بيانات المكتبة العربية ---
const ARABIC_LIBRARY_DATABASE = [
    { id: "AR_1", title: "مجموعة روايات أجاثا كريستي", author: "أجاثا كريستي", subject: "قصص بوليسية", driveLink: "https://drive.google.com/drive/folders/1PZk0vPQrKXIgE0WmUXlEMcSzt_d94Q6u", bio: "ملكة الجريمة عالمياً، صاحبة الشخصيات الخالدة مثل هيركيول بوارو وجين ماربل.", summary: "أضخم مجموعة لروايات التحقيق والغموض التي تتميز بحبكة عبقرية ونهايات صادمة." },
    { id: "AR_2", title: "أرض الإله", author: "أحمد مراد", subject: "أدب تاريخي", driveLink: "https://drive.google.com/file/d/1Q-dT9-g292nqv1N_PvlB2TnZMBdQGpio/view", bio: "كاتب ومصور مصري معاصر، تميز برواياته التي تمزج بين التاريخ والغموض بأسلوب سينمائي.", summary: "رحلة تاريخية مثيرة في زمن الفراعنة تكشف أسراراً مخفية حول خروج بني إسرائيل." },
    { id: "AR_3", title: "أرض النفاق", author: "يوسف السباعي", subject: "أدب خيالي", driveLink: "https://drive.google.com/file/d/14KCqI_ffiUg8if8uqs_vQ-oJIXBEsKD3/view", bio: "فارس الرومانسية المصرية، وزير ثقافة سابق، اشتهر بأسلوبه الذي يجمع بين السخرية والواقعية.", summary: "رواية رمزية ساخرة تنتقد الأخلاق الاجتماعية عبر فكرة بيع الأخلاق في 'دكاكين' متخصصة." },
    { id: "AR_4", title: "أكواريل", author: "أحمد خالد توفيق", subject: "أدب خيالي", driveLink: "https://drive.google.com/file/d/1NLK9-pE6uoHU8po8BC8731KIZ3oc0qU5/view", bio: "عراب أدب الرعب العربي، أول كاتب عربي برع في أدب الإثارة والغموض للشباب.", summary: "مجموعة قصصية مشوقة تأخذنا إلى عوالم من الغموض الطبي والنفسي بأسلوب العراب الفريد." },
    { id: "AR_5", title: "الفيل الأزرق", author: "أحمد مراد", subject: "أدب خيالي", driveLink: "https://drive.google.com/file/d/1Vr0BCdRxRC4k9e8t7g5sqtfnW1BHZbTD/view", bio: "أحد أبرز الروائيين العرب حالياً، تحولت معظم أعماله إلى أفلام سينمائية ناجحة جداً.", summary: "رحلة نفسية غامضة داخل مستشفى العباسية للأمراض العقلية، تمزج بين الواقع والهلوسة." },
    { id: "AR_6", title: "نائب عزارئيل", author: "يوسف السباعي", subject: "أدب خيالي", driveLink: "https://drive.google.com/file/d/1vC4PIAZ2ekJ-uU3wCE4zV70glD8VjDT0/view", bio: "أديب مصري راحل لقب بـ 'فارس الرومانسية' وساهم في إثراء المكتبة والسينما العربية.", summary: "رواية فانتازيا فلسفية تتخيل شخصاً يقوم بدور عزرائيل، بأسلوب ساخر وعميق." },
    { id: "AR_7", title: "المكتبة الخضراء للأطفال", author: "مؤلفين", subject: "قصص للأطفال", driveLink: "https://drive.google.com/drive/folders/1AHrYDDPkocCEAnJXAfhbnTYtfkpcuIn", bio: "نخبة من كبار كتاب أدب الطفل في الوطن العربي صاغوا حكايات تربوية عالمية ومحلية.", summary: "أشهر سلاسل القصص للأطفال، تهدف لغرس القيم النبيلة بأسلوب حكائي مشوق ورسوم جذابة." },
    { id: "AR_18", title: "سلسلة رجل المستحيل", author: "نبيل فاروق", subject: "قصص بوليسية", driveLink: "https://drive.google.com/drive/folders/1yjQ37_OKjp0N7VB6BrIVP7SNzQLAU2fS", bio: "رائد أدب الجاسوسية العربي، صنع بطلاً أسطورياً (أدهم صبري) أسر عقول أجيال.", summary: "مغامرات شيقة لرجل المخابرات المصري أدهم صبري، يواجه فيها أخطاراً تهدد الأمن القومي." },
    { id: "AR_19", title: "سلسلة ما وراء الطبيعة", author: "أحمد خالد توفيق", subject: "أدب خيالي", driveLink: "https://drive.google.com/drive/folders/1qJD1adnBDMgQFPWMSnMM3KJmbVlmBr6W", bio: "الأديب الذي جعل الشباب يقرأون، مبتكر شخصية رفعت إسماعيل طبيب أمراض الدم العجوز.", summary: "سلسلة خوارق ورعب تروي مغامرات رفعت إسماعيل مع الأساطير والظواهر غير المفسرة." },
    { id: "AR_20", title: "سلسلة الشياطين ال13", author: "محمود سالم", subject: "أدب خيالي", driveLink: "https://drive.google.com/drive/folders/1OoXAgtzyZ4QK0WIIJPCU5IICwlUPED0w", bio: "أشهر من كتب الألغاز والمغامرات للشباب في مصر والعالم العربي.", summary: "مغامرات ذكية لمجموعة من الفتيان العرب من بلدان مختلفة يحلون أصعب الجرائم والألغاز." },
    { id: "AR_21", title: "مختصر تفسير ابن كثير", author: "ابن كثير", subject: "تفسير القرآن", driveLink: "https://drive.google.com/drive/folders/1lLmRHktJSbAJjjX0Wdh4shjHyweQy_0h", bio: "الحافظ والمؤرخ اسماعيل بن كثير، من أعظم المفسرين في تاريخ الفكر الإسلامي.", summary: "تلخيص شامل لأهم تفاسير القرآن الكريم المعتمدة على المأثور والحديث الصحيح." },
    { id: "AR_27", title: "صحيح البخاري", author: "البخاري", subject: "كتب سنة", driveLink: "https://drive.google.com/file/d/1j7rtHR8fP3et3p1cQ8fB15Wb4Of8GBnG/view", bio: "الإمام محمد بن إسماعيل البخاري، صاحب أصح كتاب بعد القرآن الكريم.", summary: "الجامع المسند الصحيح لأقوال وأفعال وتقارير النبي صلى الله عليه وسلم." },
    { id: "AR_28", title: "صحيح مسلم", author: "مسلم", subject: "كتب سنة", driveLink: "https://drive.google.com/file/d/1k3nMYrD9V40GGP2BDJ18IinXBWXbL-04/view", bio: "الإمام مسلم بن الحجاج النيسابوري، أحد كبار علماء الحديث الذين نذروا حياتهم للسنّة.", summary: "ثاني أصح الكتب في الحديث النبوي، مرتباً ترتيباً فقهياً دقيقاً وشاملاً." },
    { id: "AR_29", title: "الأب الغني والأب الفقير", author: "روبرت كيوساكي", subject: "تنمية بشرية", driveLink: "https://drive.google.com/file/d/17S2yXqeKbybMCdpuxV_vZU3McSarrp-1/view", bio: "رجل أعمال ومستثمر أمريكي، أحدث ثورة في مفهوم الثقافة المالية للأفراد.", summary: "كتاب يعلمك الفرق بين الأصول والالتزامات، وكيف تبدأ رحلتك نحو الاستقلال المالي." },
    { id: "AR_30", title: "الرقص مع الحياة", author: "مهدي الموسوي", subject: "تنمية بشرية", driveLink: "https://drive.google.com/file/d/1GNcOcjbcGARMXTMh0A0wYnaOxDHQ2ivt/view", bio: "باحث وكاتب كويتي، يركز في كتاباته على السعادة الداخلية والسلام النفسي.", summary: "دعوة ملهمة لعيش الحياة ببهجة وسلام، متجاوزاً العقبات النفسية بروح إيجابية." },
    { id: "AR_33", title: "قوة الآن", author: "إيكهارت تول", subject: "تنمية بشرية", driveLink: "https://drive.google.com/file/d/1_jmXl_PDCqU1ElBcJZGYLoUIydM32mec/view", bio: "معلم روحي ألماني-كندي، صاحب أكثر الكتب مبيعاً في تطوير الوعي الإنساني.", summary: "دليل عملي للتنوير الروحي عبر العيش في اللحظة الحاضرة والتخلص من آلام الماضي." },
    { id: "AR_34", title: "أربعون", author: "أحمد الشقيري", subject: "تنمية بشرية", driveLink: "https://drive.google.com/file/d/1IFeA8ElveWPYWKuiWQIhR4zdmZPSwKa0/view", bio: "إعلامي سعودي متميز، اشتهر ببرنامج 'خواطر' وهدفه تحسين المجتمع فكرياً.", summary: "خواطر وتجارب شخصية كتبها الشقيري خلال خلوته لمدة 40 يوماً، تلخص دروس الحياة." },
    { id: "AR_36", title: "حكايات الغرفة 207", author: "أحمد خالد توفيق", subject: "أدب خيالي", driveLink: "https://drive.google.com/file/d/1Cy8w5xDHqtIc--F2ad77sePB1tcGkr3s/view", bio: "طبيب مصري رائد في الرعب والتشويق، له الفضل في تشكيل وعي جيل كامل من القراء.", summary: "سلسلة من القصص الغامضة والمخيفة التي تدور أحداثها داخل غرفة فندقية مسكونة بالأسرار." },
    { id: "AR_37", title: "يوتوبيا", author: "أحمد خالد توفيق", subject: "أدب خيالي", driveLink: "https://drive.google.com/file/d/1hH9elAOnS9pRccxnFad4-vym_px-DbX1/view", bio: "العراب الذي برع في التنبؤ بالمستقبل عبر روايات الديستوبيا بلمسة مصرية فريدة.", summary: "رواية سوداوية تتخيل مصر عام 2023 منقسمة بين طبقتين: طبقة غنية منعزلة وطبقة مسحوقة." },
    { id: "AR_38", title: "خلف أسوار العقل", author: "نبيل فاروق", subject: "أدب خيالي", driveLink: "https://drive.google.com/file/d/14p7eM2uBYrmYs3xuNRg1tNGXFBegW-ZM/view", bio: "رائد أدب الخيال العلمي والمخابرات، تميزت أعماله بالسرعة والتشويق الذهني العالي.", summary: "مجموعة مقالات وقصص تتناول أسرار العقل البشري والظواهر الغريبة بأسلوب علمي مشوق." },
    { id: "AR_39", title: "انهم يأتون ليلا", author: "خالد أمين", subject: "أدب خيالي", driveLink: "https://drive.google.com/file/d/1M4LYoDVUunT7utYTqJD-6rXkAxQlrH_Y/view", bio: "كاتب مصري متميز في أدب الرعب والجريمة، يجمع بين الغموض والتشويق النفسي.", summary: "رواية رعب نفسية تدور حول مخاوف الإنسان القديمة وما يختبئ في الظلام بانتظارنا." },
    { id: "AR_40", title: "الذين كانوا", author: "نبيل فاروق", subject: "أدب خيالي", driveLink: "https://drive.google.com/file/d/1dDnEc6sG2LKVQDKlIw6ZL0x4lNKJtNOs/view", bio: "أديب الملايين الذي أثرى المكتبة العربية بأكثر من 500 رواية جيب وقصة قصيرة.", summary: "قصص خيالية مثيرة حول حضارات بائدة وكائنات مجهولة تعود للظهور في عصرنا الحالي." },
    { id: "AR_41", title: "ألف اختراع واختراع", author: "رولاند جاكسون", subject: "التراث العربي", driveLink: "https://drive.google.com/file/d/1_4IKkimJy1MmApcRz_0HA9_wKWy6H-Mp", bio: "باحث ومؤرخ بريطاني اهتم بإبراز الإسهامات العلمية للحضارة الإسلامية في تطور العالم.", summary: "موسوعة مصورة مذهلة تستعرض الإنجازات العلمية للحضارة الإسلامية التي شكلت عالمنا الحديث." }
];

const translations = {
    ar: {
        pageTitle: "روائع المكتبة العربية",
        searchPlaceholder: "ابحث عن كتاب، كاتب، أو موضوع...",
        allSubjects: "جميع المواضيع",
        allAuthors: "جميع المؤلفين",
        results: "كتاب متاح",
        read: "قراءة الكتاب",
        bio: "نبذة عن المؤلف",
        summaryTitle: "تلخيص صقر AI",
        back: "العودة للمكتبة الرقمية"
    },
    en: {
        pageTitle: "Arabic Library Masterpieces",
        searchPlaceholder: "Search book, author, or topic...",
        allSubjects: "All Subjects",
        allAuthors: "All Authors",
        results: "Books Available",
        read: "Read Book",
        bio: "Author Bio",
        summaryTitle: "Saqr AI Summary",
        back: "Back to E-Library"
    }
};

const ArabicLibraryInternalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const navigate = useNavigate();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];

    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [authorFilter, setAuthorFilter] = useState('all');
    const [selectedBio, setSelectedBio] = useState<any>(null);
    const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);

    // استخراج القوائم الفريدة للفلاتر
    const subjects = useMemo(() => ["all", ...new Set(ARABIC_LIBRARY_DATABASE.map(b => b.subject))].sort(), []);
    const authors = useMemo(() => ["all", ...new Set(ARABIC_LIBRARY_DATABASE.map(b => b.author))].sort(), []);

    const filteredBooks = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        return ARABIC_LIBRARY_DATABASE.filter(b => {
            const matchesTerm = !term || b.title.includes(term) || b.author.includes(term);
            const matchesSub = subjectFilter === 'all' || b.subject === subjectFilter;
            const matchesAuth = authorFilter === 'all' || b.author === authorFilter;
            return matchesTerm && matchesSub && matchesAuth;
        });
    }, [searchTerm, subjectFilter, authorFilter]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    }, []);

    const handleInteraction = (e: React.MouseEvent | React.TouchEvent, action: () => void) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const rippleId = Date.now();
        setRipples(prev => [...prev, { id: rippleId, x: clientX - rect.left, y: clientY - rect.top }]);
        
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== rippleId));
            action();
        }, 400);
    };

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-1000 relative">
            {/* زر العودة */}
            <button onClick={() => navigate(-1)} className="mb-10 flex items-center gap-2 text-gray-500 hover:text-red-600 font-black transition-colors group">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transform group-hover:-translate-x-1 ${isAr ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                {t('back')}
            </button>

            {/* الهيرو (العنوان) */}
            <div className="text-center mb-16">
                <h1 className="text-5xl sm:text-7xl font-black text-slate-950 dark:text-white mb-6 tracking-tighter leading-none">
                    {t('pageTitle')}
                </h1>
                <div className="h-2.5 w-32 bg-green-700 mx-auto rounded-full shadow-[0_10px_30px_rgba(5,150,105,0.4)]"></div>
            </div>

            {/* شريط البحث المطور (نفس صفحة البحث) */}
            <div 
                onMouseMove={handleMouseMove}
                className="glass-panel glass-card-interactive p-8 md:p-14 rounded-[3.5rem] shadow-2xl mb-20 sticky top-24 z-40 border-red-600/20 dark:border-white/10 backdrop-blur-3xl"
            >
                <div className="relative mb-10 z-10">
                    <input 
                        type="text" 
                        placeholder={t('searchPlaceholder')}
                        className="w-full p-6 md:p-10 ps-16 md:ps-24 bg-slate-100/50 dark:bg-black/40 text-slate-950 dark:text-white border-2 border-transparent focus:border-red-600 rounded-[2.5rem] outline-none transition-all font-black text-xl md:text-4xl shadow-inner placeholder-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 start-6 md:start-10 flex items-center pointer-events-none text-red-600">
                        <svg className="w-8 h-8 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="w-full p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 font-black text-lg cursor-pointer focus:border-red-600 outline-none">
                        <option value="all">{t('allSubjects')}</option>
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="w-full p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 font-black text-lg cursor-pointer focus:border-red-600 outline-none">
                        <option value="all">{t('allAuthors')}</option>
                        {authors.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>
            </div>

            {/* عداد النتائج */}
            <div className="flex items-center justify-between mb-12 px-6 sm:px-10">
                <h2 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tighter">النتائج</h2>
                <div className="bg-red-600 text-white px-8 py-2 rounded-2xl text-xl sm:text-3xl font-black shadow-xl ring-4 ring-red-600/20">
                    {filteredBooks.length} {t('results')}
                </div>
            </div>

            {/* شبكة الكتب */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredBooks.map((book) => (
                    <div 
                        key={book.id} 
                        onMouseMove={handleMouseMove}
                        className="glass-panel glass-card-interactive group relative overflow-hidden p-8 rounded-[3rem] border-white/20 flex flex-col justify-between hover:scale-[1.03] transition-all duration-500 h-full shadow-lg"
                    >
                        {ripples.map(r => <span key={r.id} className="ripple-effect bg-red-600/10" style={{ left: r.x, top: r.y }} />)}
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <span className="bg-red-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md">
                                    {book.subject}
                                </span>
                                <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-500">🏛️</span>
                            </div>
                            
                            <h2 className="text-2xl font-black text-gray-950 dark:text-white mb-2 group-hover:text-red-600 transition-colors leading-tight line-clamp-2 h-16">
                                {book.title}
                            </h2>
                            <p className="text-green-700 dark:text-green-400 font-black text-sm mb-6">{book.author}</p>
                            
                            <div className="bg-black/5 dark:bg-white/5 p-6 rounded-[2rem] border border-white/10 mb-8">
                                <p className="text-[10px] text-red-600 font-black uppercase mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                                    {t('summaryTitle')}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300 font-medium italic text-base leading-relaxed line-clamp-3">
                                    "{book.summary}"
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 z-10">
                            <button 
                                onClick={(e) => handleInteraction(e as any, () => setSelectedBio(book))}
                                className="w-full bg-white/40 dark:bg-white/5 border border-red-500/30 text-gray-900 dark:text-white font-black py-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all text-sm active:scale-95"
                            >
                                {t('bio')}
                            </button>
                            <a 
                                href={book.driveLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onMouseDown={(e) => handleInteraction(e as any, () => {})}
                                className="relative overflow-hidden w-full bg-gray-950 text-white dark:bg-white dark:text-gray-950 font-black py-5 rounded-[2rem] flex items-center justify-center gap-4 shadow-xl active:scale-95 transition-all group/btn"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                <span>{t('read')}</span>
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* مودال نبذة المؤلف */}
            {selectedBio && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-2xl animate-in fade-in duration-300" onClick={() => setSelectedBio(null)}>
                    <div className="glass-panel w-full max-w-lg p-12 rounded-[3.5rem] border-white/20 shadow-2xl relative animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setSelectedBio(null)} className="absolute top-8 end-8 p-2 bg-red-600 text-white rounded-full hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <h3 className="text-3xl font-black text-gray-950 dark:text-white mb-2">{selectedBio.author}</h3>
                        <p className="text-red-600 font-black uppercase text-xs tracking-widest mb-8">عن الكاتب (AI Bio)</p>
                        <p className="text-gray-800 dark:text-gray-200 text-xl leading-relaxed font-medium italic">"{selectedBio.bio}"</p>
                        <div className="mt-10 pt-8 border-t border-black/5 dark:border-white/10 flex justify-center">
                            <img src="/school-logo.png" alt="EFIIPS" className="h-12 opacity-30 logo-white-filter" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArabicLibraryInternalPage;
