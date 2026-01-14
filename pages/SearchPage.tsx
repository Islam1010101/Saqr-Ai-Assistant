// --- نافذة تفاصيل الكتاب (الربط الحي بالذكاء الاصطناعي صقر) ---
const BookModal: React.FC<{ book: Book | null; onClose: () => void; t: any }> = ({ book, onClose, t }) => {
    const { locale } = useLanguage();
    const [aiSummary, setAiSummary] = useState<string>('');
    const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

    // منطق جلب الملخص من صقر AI عند اختيار الكتاب
    useEffect(() => {
        if (!book) {
            setAiSummary('');
            return;
        }

        const getSaqrSummary = async () => {
            setIsAiLoading(true);
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [
                            { 
                                role: 'system', 
                                content: `You are Saqr AI, the librarian at Saqr Al Emarat School. Provide a professional, inspiring 2rd-person summary (2-3 sentences) for the book "${book.title}" by "${book.author}". Target audience: students.` 
                            }
                        ],
                        locale
                    }),
                });
                const data = await response.json();
                setAiSummary(data.reply || '');
            } catch (error) {
                // في حال تعذر الاتصال، نعرض الملخص الافتراضي من قاعدة البيانات
                setAiSummary(book.summary || 'Strategic insights for this resource are being processed.');
            } finally {
                setIsAiLoading(false);
            }
        };

        getSaqrSummary();
    }, [book, locale]);

    if (!book) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 backdrop-blur-3xl animate-in fade-in duration-300" onClick={onClose}>
            <div 
                className="glass-panel w-full max-w-4xl rounded-[3.5rem] border-2 border-white/50 dark:border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden relative animate-in zoom-in-95 duration-300 flex flex-col md:flex-row bg-white/90 dark:bg-slate-950/90"
                onClick={(e) => e.stopPropagation()}
            >
                {/* زر الإغلاق */}
                <button onClick={onClose} className="absolute top-6 end-6 z-50 p-3 bg-red-600 text-white rounded-full hover:scale-110 active:scale-90 transition-all shadow-xl">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {/* الجانب الأيمن: المحتوى والملخص الذكي */}
                <div className="flex-1 p-10 md:p-14 flex flex-col justify-center border-b md:border-b-0 md:border-e border-white/20">
                    <div className="mb-6">
                         <span className="inline-block px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] mb-4 bg-red-600 text-white shadow-lg">
                            {t('aiSubject')} ACTIVE
                         </span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white leading-[1.1] tracking-tighter mb-4">{book.title}</h2>
                        <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-bold italic">By {book.author}</p>
                    </div>

                    {/* منطقة ملخص صقر AI مع حالة التحميل */}
                    <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-white/10 relative overflow-hidden">
                        <p className="text-[10px] text-red-600 font-black uppercase mb-4 flex items-center gap-2 tracking-widest">
                            <span className={`w-2.5 h-2.5 bg-red-600 rounded-full shadow-lg ${isAiLoading ? 'animate-ping' : 'animate-pulse'}`}></span>
                            {isAiLoading ? 'Saqr AI is analyzing...' : 'Saqr AI Official Summary'}
                        </p>
                        
                        {isAiLoading ? (
                            <div className="space-y-3">
                                <div className="h-5 bg-slate-200 dark:bg-white/10 rounded-full w-full animate-pulse"></div>
                                <div className="h-5 bg-slate-200 dark:bg-white/10 rounded-full w-5/6 animate-pulse"></div>
                                <div className="h-5 bg-slate-200 dark:bg-white/10 rounded-full w-4/6 animate-pulse"></div>
                            </div>
                        ) : (
                            <p className="text-slate-800 dark:text-slate-200 text-xl md:text-2xl font-medium leading-relaxed italic animate-in fade-in duration-700">
                                "{aiSummary || book.summary}"
                            </p>
                        )}
                    </div>
                </div>

                {/* الجانب الأيسر: بيانات الموقع */}
                <div className="w-full md:w-[350px] bg-slate-950 dark:bg-black p-10 md:p-14 flex flex-col justify-center items-center text-center text-white relative overflow-hidden">
                    <img src="/school-logo.png" className="absolute opacity-5 scale-150 rotate-12 pointer-events-none" alt="" />
                    <div className="relative z-10 space-y-12">
                        <div>
                            <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.3em] mb-4">Inventory Data</p>
                            <div className="space-y-4">
                                <div><p className="text-xs opacity-50 uppercase tracking-widest mb-1">{t('shelf')}</p><p className="text-6xl font-black tracking-tighter">{book.shelf}</p></div>
                                <div className="h-px w-12 bg-white/20 mx-auto"></div>
                                <div><p className="text-xs opacity-50 uppercase tracking-widest mb-1">{t('row')}</p><p className="text-6xl font-black tracking-tighter">{book.row}</p></div>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-full bg-white text-slate-950 font-black py-4 px-8 rounded-2xl hover:bg-green-500 hover:text-white transition-all active:scale-95 text-sm uppercase tracking-widest shadow-2xl">{t('close')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
