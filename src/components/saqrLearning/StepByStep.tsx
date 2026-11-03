import React, { useEffect, useState } from 'react';
import LearningPictureArt, { type LearningPicture } from './LearningPictureArt';

type Step = {
  titleAr: string; titleEn: string;
  promptAr: string; promptEn: string;
  choices: LearningPicture[]; answer: LearningPicture;
};
const steps: Step[] = [
  { titleAr:'جهّز كتابك', titleEn:'Get your book ready', promptAr:'اختر ما نستخدمه لقراءة قصة ممتعة.', promptEn:'Choose what we use to read a story.', choices:['ball','book','apple'], answer:'book' },
  { titleAr:'اختر مكان القراءة', titleEn:'Find a reading spot', promptAr:'أين يمكنك الجلوس لقراءة كتاب بهدوء؟', promptEn:'Where can you sit and read quietly?', choices:['desk','ball','sun'], answer:'desk' },
  { titleAr:'جهّز أدواتك', titleEn:'Get your supplies', promptAr:'اختر الأداة التي يمكنك الكتابة بها.', promptEn:'Choose something you can write with.', choices:['pencil','apple','ball'], answer:'pencil' },
  { titleAr:'لاحظ الطبيعة', titleEn:'Notice nature', promptAr:'ما الشيء الذي يضيء السماء في النهار؟', promptEn:'What makes the sky bright during the day?', choices:['house','sun','book'], answer:'sun' },
  { titleAr:'انظر إلى الصورة', titleEn:'Look at the picture', promptAr:'اختر صورة الشجرة الخضراء.', promptEn:'Find the picture of the green tree.', choices:['tree','pencil','ball'], answer:'tree' },
  { titleAr:'اختر طعامًا صحيًا', titleEn:'Choose a healthy snack', promptAr:'أي صورة تُظهر فاكهة يمكن تناولها؟', promptEn:'Which picture shows a piece of fruit?', choices:['desk','apple','house'], answer:'apple' },
  { titleAr:'وقت اللعب', titleEn:'Time to play', promptAr:'ما الشيء الذي نستخدمه في لعبة كرة القدم؟', promptEn:'What do we use to play football?', choices:['tree','book','ball'], answer:'ball' },
  { titleAr:'أين نعيش؟', titleEn:'Where do we live?', promptAr:'اختر صورة المنزل.', promptEn:'Choose the picture of a home.', choices:['house','sun','apple'], answer:'house' },
  { titleAr:'نعود إلى القصة', titleEn:'Back to the story', promptAr:'نريد أن نقرأ عن صقر. ماذا نفتح؟', promptEn:'We want to read about Saqr. What do we open?', choices:['ball','pencil','book'], answer:'book' },
  { titleAr:'نرتب المكان', titleEn:'Keep things tidy', promptAr:'أين نضع كتابنا عندما نجلس للقراءة؟', promptEn:'Where can we place our book while reading?', choices:['sun','desk','tree'], answer:'desk' },
  { titleAr:'نكتب فكرة', titleEn:'Write down an idea', promptAr:'نريد كتابة جملة قصيرة. ماذا نحتاج؟', promptEn:'We want to write one sentence. What do we need?', choices:['pencil','ball','house'], answer:'pencil' },
  { titleAr:'نعتني بالحديقة', titleEn:'Care for the garden', promptAr:'أي شيء يحتاج إلى الماء كي ينمو؟', promptEn:'Which thing needs water to grow?', choices:['book','tree','ball'], answer:'tree' },
  { titleAr:'نتذكر التفاصيل', titleEn:'Remember the details', promptAr:'في القصة، زرعت ليلى بذرة فكبرت شجرة. ماذا كبر؟', promptEn:'Layla planted a seed, and something grew. What was it?', choices:['tree','house','sun'], answer:'tree' },
  { titleAr:'مهمتنا الأخيرة', titleEn:'Our final mission', promptAr:'أحسنت! اختر صورة الكتاب لننهي مهمة القراءة.', promptEn:'Well done! Choose the book to complete your reading mission.', choices:['apple','ball','book'], answer:'book' }
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
    <p className="font-semibold text-slate-600 dark:text-slate-300">{isAr ? 'خطوات صغيرة صنعت إنجازًا كبيرًا. يمكنك تكرار المهمة في أي وقت.' : 'Little steps make one big achievement. You can try the mission again.'}</p>
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
    <div aria-label={isAr ? 'تقدم المهمة' : 'Mission progress'} className="space-y-3">
      <div className="flex items-center justify-between text-sm font-black text-slate-700 dark:text-slate-200">
        <span>{isAr ? 'خطوة صغيرة في كل مرة' : 'One step at a time'}</span>
        <span className="rounded-full bg-amber-100 dark:bg-amber-950/40 px-4 py-2 text-amber-900 dark:text-amber-100">
          {step + 1} / {steps.length}
        </span>
      </div>
      <div role="progressbar" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={step + 1}
        className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div className="h-full bg-emerald-600 rounded-full transition-[width] duration-300"
          style={{ width: ((step + 1) / steps.length * 100) + '%' }} />
      </div>
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
