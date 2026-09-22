import React from 'react';
import { Link } from 'react-router-dom';

const DeweyGame: React.FC = () => {
  return (
    <div className="w-full min-h-[75vh] flex flex-col items-center justify-center p-4 text-center select-none">
      
      {/* بطاقة زجاجية فاخرة بتأثير بلور ناعم */}
      <div className="relative group max-w-lg w-full p-10 md:p-14 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-white/40 dark:border-slate-700/50 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-amber-500/10">
        
        {/* توهج خلفي ناعم */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* أيقونة اللعبة وصقر */}
        <div className="relative inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 mb-6 rounded-3xl bg-gradient-to-br from-amber-400/20 to-red-500/20 border border-white/60 dark:border-slate-700/60 shadow-inner">
          <span className="text-4xl md:text-5xl animate-bounce">🪐</span>
        </div>

        {/* كلمة SOON الضخمة بتدرج لوني زجاجي */}
        <h1 className="text-6xl md:text-8xl font-black tracking-widest uppercase bg-gradient-to-r from-amber-400 via-red-500 to-amber-500 bg-clip-text text-transparent drop-shadow-sm leading-none mb-4 animate-pulse">
          SOON
        </h1>

        <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          مغامرات ديوي: طبعة المشاعر 🦅
        </h2>

        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
          نعمل حالياً على تجهيز تجربة تفاعلية ثلاثية الأبعاد لتصنيف كرات المعرفة. ترقبوا الإطلاق قريباً!
        </p>

        {/* زر العودة للصفحة الرئيسية */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs md:text-sm shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <span>العودة للرئيسية</span>
          <span>←</span>
        </Link>

      </div>

    </div>
  );
};

export default DeweyGame;
