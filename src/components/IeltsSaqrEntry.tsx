import React from 'react';
import { IELTS_SELF_TEST_CHOICES, ieltsSaqrOpening, type IeltsSelfTestLocale, type IeltsSelfTestSkill } from '../utils/ieltsSaqrPractice';

export default function IeltsSaqrEntry({
  locale, onChoose, disabled,
}: {
  locale:IeltsSelfTestLocale;
  onChoose:(skill:IeltsSelfTestSkill)=>void;
  disabled?:boolean;
}) {
  const ar=locale==='ar';
  return (
    <section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 overflow-y-auto px-4 py-5 text-center" aria-label={ar?'اختبر نفسك مع صقر':'Test yourself with Saqr'}>
      <div className="relative flex size-28 items-center justify-center rounded-full border-2 border-emerald-200 bg-emerald-50 shadow-lg dark:border-emerald-800 dark:bg-emerald-950/40 sm:size-36">
        <img src="/saqr-avatar.png" alt={ar?'صقر المساعد الذكي':'Saqr AI Librarian'} className="h-full w-full object-contain"/>
      </div>
      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-black text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">IELTS • EFIPS</span>
      <div className="max-w-2xl rounded-[1.75rem] border border-emerald-200 bg-white px-5 py-5 text-start shadow-md dark:border-emerald-800 dark:bg-slate-900 sm:px-8">
        <p className="text-base font-black leading-9 text-slate-900 dark:text-white sm:text-xl" role="status">{ieltsSaqrOpening(locale)}</p>
        <p className="mt-2 text-xs font-semibold leading-6 text-slate-600 dark:text-slate-300">
          {ar
            ? 'اختر المهارة عشان يبدأ صقر يسألك ويصحح لك إجاباتك. التدريب مسترشد بفهرس مراجع IELTS الموجودة في المركز، وليس نقلًا حرفيًا من صفحات الكتب.'
            : 'Choose a skill to start a question-by-question practice chat with feedback. Practice is guided by the IELTS resource inventory, not copied from textbook pages.'}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {IELTS_SELF_TEST_CHOICES.map(choice=>(
            <button type="button" key={choice.id} disabled={disabled}
              onClick={()=>onChoose(choice.id)}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-950 transition hover:border-emerald-700 hover:bg-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700 disabled:opacity-50 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-100 dark:hover:bg-emerald-900">
              {ar?choice.ar:choice.en}
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
        {ar?'صقر هيكمل معك في محادثته المعتادة، ومن غير أي تعديل في تحدياته أو تحضير المعلمين.':'Saqr continues in the existing chat, with its original challenges and teacher workflows unchanged.'}
      </p>
    </section>
  );
}
