import React, { useState, useEffect, useMemo } from 'react';
import { bookData, type Book } from '../api/bookData'; 
import { useLanguage } from '../App';

// --- مساعدات التصميم (يمكن وضعها في ملف منفصل أو في نفس الملف) ---
const GlassReflection = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2rem]">
    <div className="absolute -top-[150%] -left-[50%] w-[200%] h-[300%] bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] animate-[shine_6s_infinite] transform rotate-12" />
  </div>
);

// --- Component: BookCard (المطور) ---
const BookCard = React.memo(({ book, onClick, t }: { book: Book; onClick: () => void; t: any }) => {
  const isAi = !book.subject || book.subject === "Unknown";
  
  return (
    <div 
      onClick={onClick} 
      className="group relative h-full cursor-pointer transition-all duration-500 active:scale-95"
    >
      {/* الكارت الأساسي بتأثير الزجاج */}
      <div className="relative h-full flex flex-col overflow-hidden
                    bg-white/40 dark:bg-slate-900/40 
                    backdrop-blur-2xl 
                    border border-white/20 dark:border-white/10 
                    rounded-[2rem] shadow-xl 
                    hover:shadow-red-600/20 hover:-translate-y-2 transition-all duration-500">
        
        {/* تأثير الانعكاس الضوئي */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 pointer-events-none" />
        <GlassReflection />

        {/* المؤشر الجانبي (الهوية) */}
        <div className={`absolute top-0 start-0 w-1.5 h-full ${isAi ? 'bg-red-600' : 'bg-green-600'} shadow-[4px_0_20px_rgba(0,0,0,0.1)]`} />

        <div className="p-6 md:p-8 flex-grow relative z-10">
           <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 
                          ${isAi ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-green-600 text-white shadow-lg shadow-green-600/30'}`}>
              {isAi ? t('aiSubject') : book.subject}
           </span>
          
          <h3 className="font-black text-xl md:text-2xl text-slate-950 dark:text-white leading-tight mb-3 tracking-tighter group-hover:text-red-600 transition-colors line-clamp-2">
              {book.title}
          </h3>
          
          <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
              <span className="text-lg">👤</span>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-bold uppercase truncate">{book.author}</p>
          </div>
        </div>

        {/* التذييل (Footer) شفاف أكثر */}
        <div className="bg-white/20 dark:bg-black/20 py-4 px-7 border-t border-white/10 backdrop-blur-md mt-auto flex items-center justify-between relative z-10">
            <div className="flex gap-4 items-center">
                <div className="flex flex-col">
                  <span className="text-[8px] text-red-600 font-black uppercase">{t('shelf')}</span>
                  <span className="text-sm dark:text-white font-black leading-none">{book.shelf}</span>
                </div>
                <div className="w-px h-6 bg-slate-400/20"></div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-green-600 font-black uppercase">{t('row')}</span>
                  <span className="text-sm dark:text-white font-black leading-none">{book.row}</span>
                </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-red-600/10 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
              <span className="text-sm leading-none">➔</span>
            </div>
        </div>
      </div>
    </div>
  );
});

// --- Component: BookModal (المطور) ---
const BookModal: React.FC<{ book: Book | null; onClose: () => void; t: any }> = ({ book, onClose, t }) => {
    // ... (نفس منطق الـ useEffect والـ AI في كودك الأصلي)
    if (!book) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-3xl animate-in fade-in duration-500" onClick={onClose}>
            <div className="relative w-full max-w-4xl bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl rounded-[3rem] border border-white/20 shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
                
                {/* زر الإغلاق المطور */}
                <button onClick={onClose} className="absolute top-6 end-6 z-50 p-2 bg-red-600 text-white rounded-full hover:rotate-90 transition-transform shadow-xl">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="flex-1 p-10 md:p-14 text-start relative">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl" />
                    <h2 className="text-3xl md:text-5xl text-slate-950 dark:text-white font-black leading-tight mb-2 tracking-tighter relative z-10">{book.title}</h2>
                    <p className="text-xl text-red-600 font-bold mb-8 relative z-10">By {book.author}</p>
                    
                    <div className="glass-panel bg-white/40 dark:bg-white/5 p-8 rounded-[2.5rem] border border-white/20 shadow-inner relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                           <span className="w-3 h-3 bg-green-500 rounded-full animate-ping"></span>
                           <p className="text-[11px] text-green-600 font-black uppercase tracking-widest">{t('officialAi')}</p>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 text-lg md:text-xl font-medium leading-relaxed italic">
                           "{book.summary || "تتم المعالجة عبر ذكاء صقر..."}"
                        </p>
                    </div>
                </div>

                <div className="w-full md:w-[300px] bg-slate-950/90 dark:bg-black/60 p-10 flex flex-col justify-center items-center text-white border-s border-white/10 backdrop-blur-md">
                    <div className="space-y-8 w-full text-center">
                        <div className="bg-red-600/20 p-6 rounded-[2rem] border border-red-600/30 backdrop-blur-sm">
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">{t('subjectLabel')}</p>
                            <p className="text-xl font-black">{book.subject}</p>
                        </div>
                        <div className="flex justify-center gap-10">
                            <div><p className="text-[10px] opacity-50 uppercase mb-1">{t('shelf')}</p><p className="text-5xl font-black">{book.shelf}</p></div>
                            <div className="w-px h-12 bg-white/20"></div>
                            <div><p className="text-[10px] opacity-50 uppercase mb-1">{t('row')}</p><p className="text-5xl font-black">{book.row}</p></div>
                        </div>
                        <button onClick={onClose} className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-2xl uppercase tracking-widest text-[10px]">{t('close')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Page (مع تحسين الـ Sticky Header) ---
const SearchPage: React.FC = () => {
    const { locale, dir } = useLanguage();
    // ... (باقي الـ Hooks والفلاتر من كودك الأصلي)

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 pb-32 relative z-10 font-black antialiased">
            <div className="sticky top-6 z-[100] mb-16 animate-fade-in transition-all">
                <div className="glass-panel p-4 md:p-6 rounded-[3rem] shadow-2xl border border-white/30 backdrop-blur-3xl bg-white/70 dark:bg-slate-900/70">
                    <div className="flex flex-col gap-4">
                        <div className="relative group">
                            <input 
                              type="text" 
                              placeholder={translations[locale].searchPlaceholder} 
                              className="w-full p-5 ps-16 bg-white/50 dark:bg-black/40 text-slate-950 dark:text-white border-2 border-transparent focus:border-red-600 rounded-[2rem] outline-none transition-all font-black text-lg shadow-inner" 
                              onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                            <svg className="absolute start-6 top-1/2 -translate-y-1/2 h-7 w-7 text-red-600 group-focus-within:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        {/* شبكة الفلاتر */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {/* ... (باقي الـ Selects مع إضافة ستايل Glassy) ... */}
                            {/* مثال لستايل الـ Select */}
                            <select className="p-3 px-5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/20 font-black text-[11px] cursor-pointer outline-none focus:border-red-600 appearance-none text-center backdrop-blur-md">
                               <option value="all">كل المواضيع</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
                {/* عرض الكروت */}
            </div>

            {/* باقي الأجزاء (Modal, Explore More) بنفس الروح */}
        </div>
    );
};
