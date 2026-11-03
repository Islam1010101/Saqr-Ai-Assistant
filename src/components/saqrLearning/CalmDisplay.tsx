import React from 'react';

type Props = {
  isAr: boolean;
  quiet: boolean;
  onQuietChange: (enabled: boolean) => void;
  large: boolean;
  onLargeChange: (enabled: boolean) => void;
};

export default function CalmDisplay({ isAr, quiet, onQuietChange, large, onLargeChange }: Props) {
  return <div className="space-y-5">
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="rounded-[1.5rem] border-2 border-emerald-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 space-y-4">
        <div className="flex items-center gap-3">
          <svg className="h-10 w-10 text-emerald-700 dark:text-emerald-300" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M37 29a15 15 0 1 1-18-19 14 14 0 0 0 18 19Z" />
            <path d="m35 10 1.5 4.5L41 16l-4.5 1.5L35 22l-1.5-4.5L29 16l4.5-1.5Z" />
          </svg>
          <h3 className="font-black text-xl">{isAr ? 'وضع التعلم الهادئ' : 'Calm learning mode'}</h3>
        </div>
        <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
          {isAr ? 'يوقف الحركات والزينة المتحركة ويجعل بطاقات الأنشطة أبسط، دون تعطيل أي وظيفة.' :
            'Stops animated decorations and simplifies the activity cards, without disabling functionality.'}
        </p>
        <button type="button" aria-pressed={quiet} onClick={() => onQuietChange(!quiet)}
          className={'w-full min-h-12 rounded-xl border-2 px-5 py-3 font-black focus-visible:outline-4 focus-visible:outline-sky-400 ' +
            (quiet ? 'bg-emerald-700 border-emerald-700 text-white' : 'bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-slate-800 dark:text-emerald-200')}>
          {quiet ? (isAr ? 'الوضع الهادئ مفعّل — اضغط لإيقافه' : 'Calm mode on — tap to turn off') :
            (isAr ? 'تشغيل الوضع الهادئ' : 'Turn on calm mode')}
        </button>
      </div>
      <div className="rounded-[1.5rem] border-2 border-sky-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 space-y-4">
        <div className="flex items-center gap-3">
          <svg className="h-10 w-10 text-sky-700 dark:text-sky-300" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <rect x="5" y="9" width="38" height="30" rx="5" /><path d="M12 29l8-17 8 17M15 23h10M31 18h10M36 13v22"/>
          </svg>
          <h3 className="font-black text-xl">{isAr ? 'حجم الكتابة' : 'Text size'}</h3>
        </div>
        <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
          {isAr ? 'اختر حجمًا أكبر لنصوص القصص والأسئلة والتعليمات.' :
            'Make stories, questions, and activity instructions easier to read.'}
        </p>
        <button type="button" aria-pressed={large} onClick={() => onLargeChange(!large)}
          className={'w-full min-h-12 rounded-xl border-2 px-5 py-3 font-black focus-visible:outline-4 focus-visible:outline-sky-400 ' +
            (large ? 'bg-sky-700 border-sky-700 text-white' : 'bg-sky-50 border-sky-300 text-sky-900 dark:bg-slate-800 dark:text-sky-200')}>
          {large ? (isAr ? 'نص كبير — اضغط للعودة للطبيعي' : 'Large text on — return to normal') :
            (isAr ? 'تكبير النصوص' : 'Enlarge text')}
        </button>
      </div>
    </div>
    <div role="status" className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/60 dark:bg-emerald-950/20 p-4 text-sm font-semibold text-slate-700 dark:text-slate-200 leading-7">
      {quiet
        ? (isAr ? 'أنت الآن في عرض هادئ بدون مؤثرات متحركة. يمكنك اختيار أي نشاط آخر.' :
          'Calm display is now active with animated effects removed. You can choose another activity.')
        : (isAr ? 'العرض المعتاد مفعّل. يمكنك تشغيل الوضع الهادئ في أي وقت.' :
          'Regular display is active. You can switch to calm mode at any time.')}
    </div>
  </div>;
}
