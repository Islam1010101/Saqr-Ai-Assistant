import React, { useState } from 'react';
import IeltsListeningPractice from './IeltsListeningPractice';
import IeltsReadingWritingPractice from './IeltsReadingWritingPractice';
import { ieltsWrittenSpeakingRequest } from '../utils/ieltsExamPractice';
import { IELTS_SELF_TEST_CHOICES, ieltsSaqrOpening, type IeltsSelfTestLocale, type IeltsSelfTestSkill } from '../utils/ieltsSaqrPractice';

export default function IeltsSaqrEntry({
  locale, onChoose, disabled,
}: {
  locale:IeltsSelfTestLocale;
  onChoose:(skill:IeltsSelfTestSkill, listeningPrompt?:string)=>void;
  disabled?:boolean;
}) {
  const ar=locale==='ar';
  const [activePractice, setActivePractice] = useState<'listening'|'reading'|'writing'|null>(null);
  if (activePractice==='listening') return <IeltsListeningPractice locale={locale} disabled={disabled}
    onBack={() => setActivePractice(null)}
    onReview={prompt => onChoose('listening', prompt)} />;
  if (activePractice==='reading' || activePractice==='writing') return <IeltsReadingWritingPractice
    key={activePractice} locale={locale} skill={activePractice} disabled={disabled}
    onBack={() => setActivePractice(null)}
    onStart={prompt => onChoose(activePractice, prompt)} />;
  return (
    <section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 overflow-y-auto px-4 py-5 text-center" aria-label={ar?'اختبر نفسك مع صقر':'Test yourself with Saqr'}>
      <div className="relative flex size-28 items-center justify-center rounded-full border-2 border-emerald-200 bg-emerald-50 shadow-lg dark:border-emerald-800 dark:bg-emerald-950/40 sm:size-36">
        <img src="/saqr-avatar.png" alt={ar?'صقر المساعد الذكي':'Saqr AI Librarian'} className="h-full w-full object-contain"/>
      </div>
      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-black text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">IELTS • EFIPS</span>
      <div className="max-w-2xl rounded-[1.75rem] border border-emerald-200 bg-white px-5 py-5 text-start shadow-md dark:border-emerald-800 dark:bg-slate-900 sm:px-8">
        <p className="text-base font-black leading-9 text-slate-900 dark:text-white sm:text-xl" role="status">{ieltsSaqrOpening(locale)}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {IELTS_SELF_TEST_CHOICES.map(choice=>(
            <button type="button" key={choice.id} disabled={disabled}
              onClick={()=>choice.id==='listening' || choice.id==='reading' || choice.id==='writing'
                ? setActivePractice(choice.id)
                : choice.id==='speaking'
                  ? onChoose('speaking', ieltsWrittenSpeakingRequest(locale))
                  : onChoose(choice.id)}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-950 transition hover:border-emerald-700 hover:bg-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700 disabled:opacity-50 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-100 dark:hover:bg-emerald-900">
              {ar?choice.ar:choice.en}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
