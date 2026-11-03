import React, { useEffect, useState } from 'react';
import LearningPictureArt, { type LearningPicture } from './LearningPictureArt';

type Step = {
  titleAr: string; titleEn: string;
  promptAr: string; promptEn: string;
  choices: LearningPicture[]; answer: LearningPicture;
};
const steps: Step[] = [
  {
    titleAr: 'نستعد للقراءة', titleEn: 'Get ready to read',
    promptAr: 'اختر الشيء الذي نحتاجه لقراءة قصة.', promptEn: 'Choose what we need to read a story.',
    choices: ['ball', 'book', 'apple'], answer: 'book'
  },
  {
    titleAr: 'نختار المكان', titleEn: 'Find a reading spot',
    promptAr: 'اختر مكانًا هادئًا مناسبًا للقراءة.', promptEn: 'Choose a quiet place for reading.',
    choices: ['desk', 'ball', 'sun'], answer: 'desk'
  },
  {
    titleAr: 'نفهم ما قرأنا', titleEn: 'Understand the story',
    promptAr: 'صقر قرأ كتابًا. اختر الصورة التي وردت في الجملة.', promptEn: 'Saqr read a book. Which picture matches the sentence?',
    choices: ['house', 'tree', 'book'], answer: 'book'
  }
];
const names: Record<LearningPicture, [string,string]> = {
  book:['كتاب','Book'], sun:['شمس','Sun'], tree:['شجرة','Tree'], apple:['تفاحة','Apple'],
  house:['منزل','House'], desk:['مكان هادئ','Quiet reading desk'], ball:['كرة','Ball'], pencil:['قلم','Pencil']
};

export default function StepByStep({ isAr, large }: { isAr: boolean; large: boolean }) {
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<LearningPicture | null>(null);
  const [breakTime, setBreakTime] = useState(false);
  const [finished, setFinished] = useState(false);
  const active = steps[step];
  const correct = choice === active.answer;
  useEffect(() => { setStep(0); setChoice(null); setBreakTime(false); setFinished(false); }, [isAr]);
  const next = () => {
    if (!correct) return;
    if (step === steps.length - 1) setFinished(true);
    else { setStep(s => s + 1); setChoice(null); }
  };
  const restart = () => { setStep(0); setChoice(null); setBreakTime(false); setFinished(false); };

  if (finished) return <div className="text-center space-y-5 rounded-[1.7rem] border-2 border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/20 p-6">
    <div className="mx-auto w-36 h-32"><LearningPictureArt kind="book" /></div>
    <h3 className="font-black text-2xl">{isAr ? 'أحسنت! أنجزت مهمتك' : 'Great work! Mission complete'}</h3>
    <p className="font-semibold text-slate-600 dark:text-slate-300">{isAr ? 'ثلاث خطوات صغيرة صنعت إنجازًا كبيرًا.' : 'Three little steps make one big achievement.'}</p>
    <button type="button" onClick={restart} className="rounded-xl bg-emerald-700 text-white font-black px-6 py-3 min-h-12">{isAr ? 'ابدأ من جديد' : 'Start again'}</button>
  </div>;

  return <div className="space-y-5">
    <div className="flex flex-wrap gap-2 items-center justify-between">
      <p className="font-black text-emerald-700 dark:text-emerald-300">{isAr ? 'مهمة واحدة في كل مرة' : 'One small task at a time'}</p>
      <button type="button" onClick={() => setBreakTime(v => !v)}
        className="rounded-xl min-h-11 border-2 border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-slate-800 px-4 py-2.5 font-black text-sky-800 dark:text-sky-200">
        {breakTime ? (isAr ? 'أكمل المهمة' : 'Continue') : (isAr ? 'أحتاج استراحة' : 'Take a break')}
      </button>
    </div>
    <div className="grid grid-cols-3 gap-2" aria-label={isAr ? 'تقدم المهمة' : 'Mission progress'}>
      {steps.map((_, index) => <div key={index}
        className={'rounded-xl border-2 p-2.5 text-center font-black text-xs sm:text-sm ' +
          (index < step ? 'bg-emerald-700 border-emerald-700 text-white' :
            index === step ? 'bg-amber-100 border-amber-400 text-amber-950 dark:bg-amber-950/40 dark:text-amber-200' :
              'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700')}>
        {isAr ? 'خطوة ' : 'Step '}{index + 1}
        {index < step && <svg aria-hidden="true" className="inline h-4 w-4 ms-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="m5 12 5 5L20 7" /></svg>}
      </div>)}
    </div>
    {breakTime ? <section className="rounded-2xl border-2 border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-slate-900 p-6 text-center space-y-3">
      <div className="mx-auto h-28 w-32"><LearningPictureArt kind="sun" /></div>
      <h3 className="text-2xl font-black">{isAr ? 'وقت استراحة قصيرة' : 'A little rest'}</h3>
      <p className="font-semibold text-slate-600 dark:text-slate-300">{isAr ? 'خذ الوقت الذي تحتاجه. لا يوجد مؤقت.' : 'Take all the time you need. There is no timer.'}</p>
      <button type="button" onClick={() => setBreakTime(false)} className="min-h-12 rounded-xl bg-emerald-700 text-white font-black px-6 py-3">{isAr ? 'أنا مستعد' : "I'm ready"}</button>
    </section> : <>
      <section className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 px-5 py-6 sm:p-8 space-y-4">
        <p className="text-xs font-black text-emerald-700 dark:text-emerald-300">{isAr ? 'خطوتك الآن' : 'Your step now'}</p>
        <h3 className={'font-black ' + (large ? 'text-3xl' : 'text-2xl')}>{isAr ? active.titleAr : active.titleEn}</h3>
        <p className={'font-semibold leading-relaxed text-slate-700 dark:text-slate-200 ' + (large ? 'text-2xl' : 'text-lg')}>{isAr ? active.promptAr : active.promptEn}</p>
      </section>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {active.choices.map(kind => <button key={kind} type="button" disabled={correct} aria-pressed={choice === kind}
          onClick={() => setChoice(kind)}
          className={'flex flex-row sm:flex-col items-center gap-3 rounded-[1.4rem] border-[3px] bg-white dark:bg-slate-900 p-3 sm:p-4 font-black text-base sm:text-lg transition-[transform,border-color] focus-visible:outline-4 focus-visible:outline-sky-400 ' +
            (choice === kind ? correct ? 'border-emerald-500' : 'border-amber-500' : 'border-slate-200 dark:border-slate-700 hover:border-sky-400 hover:-translate-y-0.5')}>
          <span className="h-24 w-28 sm:h-auto sm:w-full sm:aspect-[4/3] shrink-0"><LearningPictureArt kind={kind} /></span>
          <span>{names[kind][isAr ? 0 : 1]}</span>
        </button>)}
      </div>
      <p aria-live="polite" className={'min-h-10 font-bold text-center ' + (correct ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300')}>
        {choice ? correct ? (isAr ? 'ممتاز! جاهز للخطوة التالية؟' : 'Excellent! Ready for the next step?') :
          (isAr ? 'محاولة جيدة. اختر مرة ثانية.' : 'Good try. Choose again.') : ''}
      </p>
      {correct && <button type="button" onClick={next} className="w-full sm:w-auto rounded-xl min-h-12 bg-emerald-700 px-8 py-3 text-white font-black focus-visible:outline-4 focus-visible:outline-sky-400">
        {step === steps.length - 1 ? (isAr ? 'إكمال المهمة' : 'Complete mission') : (isAr ? 'الخطوة التالية' : 'Next step')}
      </button>}
    </>}
  </div>;
}
