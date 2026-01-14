import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useLanguage } from '../App';
import { useNavigate } from 'react-router-dom';

// --- قاعدة البيانات الكاملة للمكتبة العربية (23 مصدراً رقمياً مفعلاً) ---
const ARABIC_LIBRARY_DATABASE = [
    { id: "AR_1", title: "مجموعة روايات أجاثا كريستي", author: "أجاثا كريستي", subject: "قصص بوليسية", driveLink: "https://drive.google.com/drive/folders/1PZk0vPQrKXIgE0WmUXlEMcSzt_d94Q6u", bio: "ملكة الجريمة عالمياً، صاحبة الشخصيات الخالدة مثل هيركيول بوارو وجين ماربل.", summary: "أضخم مجموعة لروايات التحقيق والغموض التي تتميز بحبكة عبقرية ونهايات صادمة." },
    { id: "AR_2", title: "أرض الإله", author: "أحمد مراد", subject: "أدب تاريخي", driveLink: "https://drive.google.com/file/d/1Q-dT9-g292nqv1N_PvlB2TnZMBdQGpio/view", bio: "كاتب ومصور مصري معاصر، تميز برواياته التي تمزج بين التاريخ والغموض بأسلوب سينمائي.", summary: "رحلة تاريخية مثيرة في زمن الفراعنة تكشف أسراراً مخفية حول خروج بني إسرائيل." },
    { id: "AR_3", title: "أرض النفاق", author: "يوسف السباعي", subject: "أدب خيالي", driveLink: "https://drive.google.com/file/d/14KCqI_ffiUg8if8uqs_vQ-oJIXBEsKD3/view", bio: "فارس الرومانسية المصرية، وزير ثقافة سابق، اشتهر بأسلوبه الذي يجمع بين السخرية والواقعية.", summary: "رواية رمزية ساخرة تنتقد الأخلاق الاجتماعية عبر فكرة بيع الأخلاق في 'دكاكين' متخصصة." },
    { id: "AR_4", title: "أكواريل", author: "أحمد خالد توفيق", subject: "أدب خيالي", driveLink: "https://drive.google.com/file/d/1NLK9-pE6uoHU8po8BC8731KIZ3oc0qU5/view", bio: "عراب أدب الرعب العربي، أول كاتب عربي برع في أدب الإثارة والغموض للشباب.", summary: "مجموعة قصصية مشوقة تأخذنا إلى عوالم من الغموض الطبي والنفسي بأسلوب العراب الفريد." },
    { id: "AR_5", title: "الفيل الأزرق", author: "أحمد مراد", subject: "أدب خيالي", driveLink: "https://drive.google.com/file/d/1Vr0BCdRxRC4k9e8t7g5sqtfnW1BHZbTD/view", bio: "أحد أبرز الروائيين العرب حالياً، تحولت معظم أعماله إلى أفلام سينمائية ناجحة جداً.", summary: "رحلة نفسية غامضة داخل مستشفى العباسية للأمراض العقلية، تمزج بين الواقع والهلوسة." },
    { id: "AR_6", title: "نائب عزارئيل", author: "يوسف السباعي", subject: "أدب خيالي", driveLink: "https://drive.google.com/file/d/1vC4PIAZ2ekJ-uU3wCE4zV70glD8VjDT0/view", bio: "أديب مصري راحل لقب بـ 'فارس الرومانسية' وساهم في إثراء المكتبة والسينما العربية.", summary: "رواية فانتازيا فلسفية تتخيل شخصاً يقوم بدور عزرائيل، بأسلوب ساخر وعميق." },
    { id: "AR_7", title: "المكتبة الخضراء للأطفال", author: "نخبة من المؤلفين", subject: "قصص للأطفال", driveLink: "https://drive.google.com/drive/folders/1AHrYDDPkocCEAnJXAfhbnTYtfkpcuIn", bio: "نخبة من كبار كتاب أدب الطفل صاغوا حكايات تربوية عالمية ومحلية بأسلوب مشوق.", summary: "أشهر سلاسل القصص للأطفال، تهدف لغرس القيم النبيلة بأسلوب حكائي ورسوم جذابة." },
    { id: "AR_18", title: "سلسلة رجل المستحيل", author: "نبيل فاروق", subject: "قصص بوليسية", driveLink: "https://drive.google.com/drive/folders/1yjQ37_OKjp0N7VB6BrIVP7SNzQLAU2fS", bio: "رائد أدب الجاسوسية العربي، صنع بطلاً أسطورياً (أدهم صبري) أسر عقول أجيال.", summary: "مغامرات شيقة لرجل المخابرات أدهم صبري، يواجه فيها أخطاراً تهدد الأمن القومي." },
    { id: "AR_19", title: "سلسلة ما وراء الطبيعة", author: "أحمد خالد توفيق", subject: "أدب خيالي", driveLink: "https://drive.google.com/drive/folders/1qJD1adnBDMgQFPWMSnMM3KJmbVlmBr6W", bio: "الأديب الذي جعل الشباب يقرأون، مبتكر شخصية رفعت إسماعيل طبيب أمراض الدم العجوز.", summary: "سلسلة خوارق ورعب تروي مغامرات رفعت إسماعيل مع الأساطير والظواهر غير المفسرة." },
    { id: "AR_20", title: "سلسلة الشياطين الـ 13", author: "محمود سالم", subject: "أدب خيالي", driveLink: "https://drive.google.com/drive/folders/1OoXAgtzyZ4QK0WIIJPCU5IICwlUPED0w", bio: "أشهر من كتب الألغاز والمغامرات للشباب في مصر والعالم العربي.", summary: "مغامرات ذكية لمجموعة من الفتيان العرب من بلدان مختلفة يحلون أصعب الجرائم والألغاز." },
    { id: "AR_21", title: "مختصر تفسير ابن كثير", author: "ابن كثير", subject: "تفسير القرآن", driveLink: "https://drive.google.com/drive/folders/1lLmRHktJSbAJjjX0Wdh4shjHyweQy_0h", bio: "الحافظ والمؤرخ اسماعيل بن كثير، من أعظم المفسرين في تاريخ الفكر الإسلامي.", summary: "تلخيص شامل لأهم تفاسير القرآن الكريم المعتمدة على المأثور والحديث الصحيح." },
    { id: "AR_27", title: "صحيح البخاري", author: "البخاري", subject: "كتب السنة", driveLink: "https://drive.google.com/file/d/1j7rtHR8fP3et3p1cQ8fB15Wb4Of8GBnG/view", bio: "الإمام محمد بن إسماعيل البخاري، صاحب أصح كتاب بعد القرآن الكريم.", summary: "الجامع المسند الصحيح لأقوال وأفعال وتقارير النبي صلى الله عليه وسلم." },
    { id: "AR_28", title: "صحيح مسلم", author: "مسلم", subject: "كتب السنة", driveLink: "https://drive.google.com/file/d/1k3nMYrD9V40GGP2BDJ18IinXBWXbL-04/view", bio: "الإمام مسلم بن الحجاج، أحد كبار علماء الحديث الذين نذروا حياتهم للسنّة النبوية.", summary: "ثاني أصح الكتب في الحديث النبوي، مرتباً ترتيباً فقهياً دقيقاً وشاملاً." },
    { id: "AR_29", title: "الأب الغني والأب الفقير", author: "روبرت كيوساكي", subject: "تنمية بشرية", driveLink: "https://drive.google.com/file/d/17S2yXqeKbybMCdpuxV_vZU3McSarrp-1/view", bio: "رجل أعمال ومستثمر أمريكي، أحدث ثورة في مفهوم الثقافة المالية للأفراد.", summary: "كتاب يعلمك الفرق بين الأصول والالتزامات، وكيف تبدأ رحلتك نحو الاستقلال المالي." },
    { id: "AR_30", title: "الرقص مع الحياة", author: "مهدي الموسوي", subject: "تنمية بشرية", driveLink: "https://drive.google.com/file/d/1GNcOcjbcGARMXTMh0A0wYnaOxDHQ2ivt/view", bio: "باحث وكاتب كويتي، يركز في كتاباته على السعادة الداخلية والسلام النفسي.", summary: "دعوة ملهمة لعيش الحياة ببهجة وسلام، متجاوزاً العقبات النفسية بروح إيجابية." },
    { id: "AR_33", title: "قوة الآن", author: "إيكهارت تول", subject: "تنمية بشرية", driveLink: "https://drive.google.com/file/d/1_jmXl_PDCqU1ElBcJZGYLoUIydM32mec/view", bio: "معلم روحي صاحب أكثر الكتب مبيعاً في تطوير الوعي الإنساني والعيش في الحاضر.", summary: "دليل عملي للتنوير الروحي عبر العيش في اللحظة الحاضرة والتخلص من آلام الماضي." },
    { id: "AR_34", title: "أربعون", author: "أحمد الشقيري", subject: "تنمية بشرية", driveLink: "https://drive.google.com/file/d/1IFeA8ElveWPYWKuiWQIhR4zdmZPSwKa0/view", bio: "إعلامي سعودي متميز، اشتهر ببرامج تحسين المجتمع فكرياً وروحياً.", summary: "خواطر وتجارب شخصية كتبها الشقيري خلال خلوته، تلخص أهم دروس الحياة." },
    { id: "AR_36", title: "حكايات الغرفة 207", author: "أحمد خالد توفيق", subject: "أدب خيالي", driveLink: "https://drive.google.com/file/d/1Cy8w5xDHqtIc--F2ad77sePB1tcGkr3s/view", bio: "طبيب ومؤلف مصري رائد في الرعب، له الفضل في تشكيل وعي جيل كامل من القراء.", summary: "سلسلة قصص غامضة ومخيفة تدور أحداثها داخل غرفة فندقية مسكونة بالأسرار." },
    { id: "AR_37", title: "يوتوبيا", author: "أحمد خالد توفيق", subject: "أدب خيالي", driveLink: "https://drive.google.com/file/d/1hH9elAOnS9pRccxnFad4-vym_px-DbX1/view", bio: "العراب الذي برع في التنبؤ بالمستقبل عبر روايات الديستوبيا بلمسة مصرية.", summary: "رواية سوداوية تتخيل مصر منقسمة بين طبقة غنية منعزلة وطبقة مسحوقة." },
    { id: "AR_38", title: "خلف أسوار العقل", author: "نبيل فاروق", subject: "أدب خيالي", driveLink: "https://drive.google.com/file/d/14p7eM2uBYrmYs3xuNRg1tNGXFBegW-ZM/view", bio: "رائد أدب الخيال العلمي، تميزت أعماله بالسرعة والتشويق الذهني العالي.", summary: "مجموعة مقالات وقصص تتناول أسرار العقل البشري والظواهر الغريبة بأسلوب علمي." },
    { id: "AR_39", title: "إنهم يأتون ليلاً", author: "خالد أمين", subject: "أدب خيالي", driveLink: "https://drive.google.com/file/d/1M4LYoDVUunT7utYTqJD-6rXkAxQlrH_Y/view", bio: "كاتب مصري متميز في أدب الرعب والجريمة، يجمع بين الغموض والتشويق النفسي.", summary: "رواية رعب نفسية تدور حول مخاوف الإنسان وما يختبئ في الظلام بانتظارنا." },
    { id: "AR_40", title: "الذين كانوا", author: "نبيل فاروق", subject: "أدب خيالي", driveLink: "https://drive.google.com/file/d/1dDnEc6sG2LKVQDKlIw6ZL0x4lNKJtNOs/view", bio: "أديب الملايين الذي أثرى المكتبة العربية بمئات روايات الجيب والقصص القصيرة.", summary: "قصص خيالية مثيرة حول حضارات بائدة وكائنات مجهولة تعود للظهور." },
    { id: "AR_41", title: "ألف اختراع واختراع", author: "رولاند جاكسون", subject: "التراث العربي", driveLink: "https://drive.google.com/file/d/1_4IKkimJy1MmApcRz_0HA9_wKWy6H-Mp", bio: "باحث ومؤرخ اهتم بإبراز الإسهامات العلمية للحضارة الإسلامية في تطور العالم.", summary: "موسوعة مصورة مذهلة تستعرض الإنجازات العلمية الإسلامية التي شكلت عالمنا الحديث." }
];

const translations = {
    ar: {
        pageTitle: "المكتبة العربية",
        searchPlaceholder: "ابحث عن عنوان أو كاتب...",
        allSubjects: "المواضيع",
        allAuthors: "المؤلفين",
        read: "قراءة المصدر",
        bio: "نبذة الكاتب",
        summaryTitle: "ملخص صقر الذكي",
        back: "العودة للبوابة",
        close: "إغلاق",
        locationLabel: "الموقع الرقمي"
    },
    en: {
        pageTitle: "Arabic Library",
        searchPlaceholder: "Search title or author...",
        allSubjects: "Subjects",
        allAuthors: "Authors",
        read: "Read Source",
        bio: "Author Bio",
        summaryTitle: "Saqr AI Summary",
        back: "Back to Portal",
        close: "Close",
        locationLabel: "Digital Location"
    }
};

const BookModal: React.FC<{ book: any | null; onClose: () => void; t: any }> = ({ book, onClose, t }) => {
    if (!book) return null;
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-3xl animate-in fade-in duration-300" onClick={onClose}>
            <div className="glass-panel w-full max-w-4xl rounded-[3rem] border-2 border-white/50 dark:border-white/10 shadow-2xl overflow-hidden relative animate-in zoom-in-95 flex flex-col md:flex-row bg-white/95 dark:bg-slate-950/95" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-6 end-6 z-50 p-2.5 bg-red-600 text-white rounded-full hover:scale-110 active:scale-90 transition-all shadow-lg">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="flex-1 p-10 md:p-14 flex flex-col justify-center border-b md:border-b-0 md:border-e border-slate-200 dark:border-white/10">
                    <div className="mb-6">
                        <span className="inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest mb-4 bg-green-600 text-white shadow-md">{book.subject}</span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-950 dark:text-white leading-tight mb-2 tracking-tighter">{book.title}</h2>
                        <p className="text-lg text-slate-500 font-bold italic">By {book.author}</p>
                    </div>
                    <div className="bg-slate-100/50 dark:bg-white/5 p-6 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/10">
                        <p className="text-[10px] text-red-600 font-black uppercase mb-3 tracking-widest flex items-center gap-2"><span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span> {t('summaryTitle')}</p>
                        <p className="text-slate-800 dark:text-slate-200 text-lg font-medium leading-relaxed italic">"{book.summary}"</p>
                    </div>
                </div>
                <div className="w-full md:w-[300px] bg-slate-950 dark:bg-black p-10 flex flex-col justify-center items-center text-center text-white relative">
                    <div className="space-y-10 relative z-10 w-full">
                        <div>
                            <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.3em] mb-6">{t('locationLabel')}</p>
                            <p className="text-lg font-black text-white bg-white/5 p-4 rounded-2xl border border-white/10 mb-8 tracking-tighter italic">Verified Resource</p>
                            <a href={book.driveLink} target="_blank" rel="noopener noreferrer" className="w-full bg-red-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-red-700 active:scale-95 shadow-xl transition-all"><span className="text-sm uppercase tracking-widest">{t('read')}</span></a>
                        </div>
                        <button onClick={onClose} className="w-full bg-white text-slate-950 font-black py-3 rounded-xl active:scale-95 text-[10px] uppercase tracking-widest transition-all">{t('close')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BookCard = React.memo(({ book, onClick, t }: { book: any; onClick: () => void; t: any }) => (
    <div onClick={onClick} className="group relative glass-panel bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-white/30 dark:border-white/5 rounded-[2rem] transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden shadow-md active:scale-95 hover:border-green-600/50 hover:shadow-[0_0_25px_rgba(5,150,105,0.3)]">
        <div className="p-6 flex-grow text-start">
             <span className="inline-block px-2.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest mb-3 bg-green-600 text-white shadow-sm">{book.subject}</span>
            <h3 className="font-black text-lg text-slate-950 dark:text-white leading-tight mb-2 tracking-tighter group-hover:text-green-700 transition-colors line-clamp-2">{book.title}</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold italic opacity-70">{book.author}</p>
        </div>
        <div className="bg-white/40 dark:bg-black/20 py-3 px-6 border-t border-white/5 mt-auto">
            <p className="font-black text-slate-900 dark:text-white text-[9px] uppercase tracking-[0.2em] opacity-40">National Collection</p>
        </div>
    </div>
));

const ArabicLibraryInternalPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    const navigate = useNavigate();
    const isAr = locale === 'ar';
    const t = (key: keyof typeof translations.ar) => translations[locale][key];

    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [authorFilter, setAuthorFilter] = useState('all');
    const [selectedBook, setSelectedBook] = useState<any>(null);

    const filters = useMemo(() => ({
        subjects: ["all", ...new Set(ARABIC_LIBRARY_DATABASE.map(b => b.subject))].sort(),
        authors: ["all", ...new Set(ARABIC_LIBRARY_DATABASE.map(b => b.author))].sort()
    }), []);

    const filteredBooks = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        return ARABIC_LIBRARY_DATABASE.filter(b => {
            const matchesTerm = !term || b.title.includes(term) || b.author.includes(term);
            const matchesSub = subjectFilter === 'all' || b.subject === subjectFilter;
            const matchesAuth = authorFilter === 'all' || b.author === authorFilter;
            return matchesTerm && matchesSub && matchesAuth;
        });
    }, [searchTerm, subjectFilter, authorFilter]);

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 pb-24 relative z-10">
            <div className="text-center mt-8 mb-12 relative animate-fade-up">
                <button onClick={() => navigate(-1)} className="absolute start-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400 hover:text-red-600 transition-colors group">
                    <svg className={`h-5 w-5 transform group-hover:-translate-x-1 ${isAr ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    <span className="text-[10px] font-black uppercase tracking-widest">{t('back')}</span>
                </button>
                <h1 className="text-4xl sm:text-6xl font-black text-slate-950 dark:text-white tracking-tighter leading-none">{t('pageTitle')}</h1>
                <div className="h-1 w-20 bg-green-700 mx-auto mt-4 rounded-full opacity-60"></div>
            </div>

            <div className="sticky top-24 z-50 mb-10 animate-fade-up">
                <div className="glass-panel p-3 rounded-[1.5rem] shadow-lg border-white/40 dark:border-white/5 backdrop-blur-2xl max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-2">
                        <div className="flex-[2] relative">
                            <input type="text" placeholder={t('searchPlaceholder')} className="w-full p-3 ps-10 bg-slate-100/50 dark:bg-black/40 text-slate-950 dark:text-white border-2 border-transparent focus:border-green-600 rounded-xl outline-none transition-all font-black text-sm shadow-inner" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <svg className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <div className="flex-[3] grid grid-cols-2 gap-2">
                            {[{ val: subjectFilter, set: setSubjectFilter, opts: filters.subjects, lbl: t('allSubjects') }, { val: authorFilter, set: setAuthorFilter, opts: filters.authors, lbl: t('allAuthors') }].map((f, i) => (
                                <select key={i} value={f.val} onChange={(e) => f.set(e.target.value)} className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 font-black text-[8px] md:text-[10px] cursor-pointer outline-none focus:border-green-600 appearance-none text-center">
                                    <option value="all">{f.lbl}</option>
                                    {f.opts.map(o => o !== "all" && <option key={o} value={o}>{o}</option>)}
                                </select>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-up">
                {filteredBooks.map((book) => (
                    <BookCard key={book.id} book={book} t={t} onClick={() => setSelectedBook(book)} />
                ))}
            </div>

            <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} t={t} />
        </div>
    );
};

export default ArabicLibraryInternalPage;
