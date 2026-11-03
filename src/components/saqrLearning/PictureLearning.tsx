import React, { useEffect, useState } from 'react';
import LearningPictureArt, { type LearningPicture } from './LearningPictureArt';

type Round = {
  questionAr: string; questionEn: string;
  choices: LearningPicture[];
  answer: LearningPicture;
};
const rounds: Round[] = [
  { questionAr: 'أين الشجرة؟', questionEn: 'Which picture shows a tree?', choices: ['sun', 'tree', 'book'], answer: 'tree' },
  { questionAr: 'ما الذي نقرأ منه قصة؟', questionEn: 'What do we use to read a story?', choices: ['ball', 'book', 'apple'], answer: 'book' },
  { questionAr: 'أين التفاحة؟', questionEn: 'Which picture shows an apple?', choices: ['house', 'apple', 'pencil'], answer: 'apple' },
  { questionAr: 'أين نجلس بهدوء لنقرأ؟', questionEn: 'Where can we sit quietly and read?', choices: ['ball', 'house', 'desk'], answer: 'desk' },
  { questionAr: 'أين القلم؟', questionEn: 'Which picture shows a pencil?', choices: ['pencil', 'sun', 'tree'], answer: 'pencil' },
  { questionAr: 'ماذا نستخدم لنلعب كرة القدم؟', questionEn: 'What do we use to play football?', choices: ['house', 'ball', 'book'], answer: 'ball' },
  { questionAr: 'أين المنزل؟', questionEn: 'Which picture shows a home?', choices: ['apple', 'sun', 'house'], answer: 'house' },
  { questionAr: 'أي صورة تُظهر الشمس؟', questionEn: 'Which picture shows the sun?', choices: ['sun', 'book', 'pencil'], answer: 'sun' }
];
const names: Record<LearningPicture, [string, string]> = {
  book: ['كتاب', 'Book'],
  sun: ['شمس', 'Sun'],
  tree: ['شجرة', 'Tree'],
  apple: ['تفاحة', 'Apple'],
  house: ['منزل', 'House'],
  desk: ['مكان قراءة', 'Reading desk'],
  ball: ['كرة', 'Ball'],
  pencil: ['قلم', 'Pencil']
};

export default function PictureLearning({ isAr, large }: { isAr: boolean; large: boolean }) {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<LearningPicture | null>(null);
  const [completed, setCompleted] = useState(false);
  const active = rounds[round];
  const correct = picked === active.answer;

  useEffect(() => { setRound(0); setPicked(null); setCompleted(false); }, [isAr]);

  const next = () => {
    if (!correct) return;
    if (round === rounds.length - 1) { setCompleted(true); return; }
    setRound(v => v + 1);
    setPicked(null);
  };
  const restart = () => { setRound(0); setPicked(null); setCompleted(false); };

  if (completed) return <div className="rounded-[1.7rem] border-2 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-700 p-6 text-center space-y-5">
    <div className="mx-auto h-32 w-32"><LearningPictureArt kind="book" /></div>
    <h3 className="text-2xl font-black text-emerald-900 dark:text-emerald-200">{isAr ? 'أحسنت! اكتملت جولة الصور' : 'Great job! Picture round complete'}</h3>
    <p className="font-bold text-slate-600 dark:text-slate-300">{isAr ? 'يمكنك اللعب مرة أخرى أو اختيار نشاط جديد.' : 'Play again or choose another activity.'}</p>
    <button type="button" onClick={restart} className="min-h-12 rounded-xl bg-emerald-700 text-white px-7 py-3 font-black">{isAr ? 'العب مرة أخرى' : 'Play again'}</button>
  </div>;

  return <div className="space-y-5">
    <div className="flex items-center justify-between gap-3 font-black">
      <span className="text-emerald-700 dark:text-emerald-300">{isAr ? 'نشاط الصور' : 'Picture activity'}</span>
      <span className="rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 px-4 py-2 text-sm" aria-label={isAr ? 'عدد الأسئلة' : 'Question count'}>
        {round + 1} / {rounds.length}
      </span>
    </div>
    <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden" role="progressbar"
      aria-valuenow={round + 1} aria-valuemin={0} aria-valuemax={rounds.length}>
      <div className="h-full rounded-full bg-emerald-600 transition-[width] duration-300" style={{ width: ((round + 1) / rounds.length * 100) + '%' }} />
    </div>
    <h3 className={'text-center font-black leading-relaxed ' + (large ? 'text-3xl' : 'text-xl sm:text-2xl')}>
      {isAr ? active.questionAr : active.questionEn}
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {active.choices.map(kind => {
        const selected = picked === kind;
        const good = selected && correct;
        const bad = selected && !correct;
        return <button key={kind} type="button" aria-pressed={selected} disabled={correct}
          onClick={() => setPicked(kind)}
          className={'flex flex-row sm:flex-col items-center gap-4 rounded-[1.5rem] border-[3px] bg-white dark:bg-slate-900 p-3 sm:p-4 shadow-sm transition-[border-color,transform,box-shadow] duration-200 focus-visible:outline-4 focus-visible:outline-sky-400 disabled:cursor-default ' +
            (good ? 'border-emerald-500 shadow-lg' : bad ? 'border-amber-500' : 'border-slate-200 dark:border-slate-700 hover:border-sky-400 hover:-translate-y-1')}>
          <span className="block h-24 w-28 sm:h-auto sm:w-full sm:aspect-[4/3] shrink-0 overflow-hidden rounded-2xl">
            <LearningPictureArt kind={kind} />
          </span>
          <span className={'text-center font-black ' + (large ? 'text-2xl' : 'text-lg')}>{names[kind][isAr ? 0 : 1]}</span>
        </button>;
      })}
    </div>
    <div aria-live="polite" className="min-h-12">
      {picked && <p className={'rounded-xl px-5 py-3 text-center font-black ' + (correct
        ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200'
        : 'bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200')}>
        {correct ? (isAr ? 'إجابة رائعة! أحسنت.' : 'Well done! That is correct.')
          : (isAr ? 'محاولة جميلة، اختر صورة أخرى.' : 'Good try! Choose another picture.')}
      </p>}
    </div>
    {correct && <button type="button" onClick={next}
      className="w-full sm:w-auto min-h-12 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-8 py-3 font-black text-white focus-visible:outline-4 focus-visible:outline-sky-400">
      {round === rounds.length - 1 ? (isAr ? 'أنهِ النشاط' : 'Finish activity') : (isAr ? 'الصورة التالية' : 'Next picture')}
    </button>}
  </div>;
}
