import React, { useState } from 'react';
import {
  IELTS_OFFICIAL_SAMPLE_LINKS,
  ieltsReadingPracticeRequest, ieltsWritingPracticeRequest,
  type IeltsPracticeStage, type IeltsPracticeTrack, type IeltsWritingTask
} from '../utils/ieltsExamPractice';
import type { IeltsSelfTestLocale } from '../utils/ieltsSaqrPractice';

/** Completely isolated IELTS UI; submit exercises through the original Saqr chat handler. */
export default function IeltsReadingWritingPractice({
  locale, skill, disabled, onBack, onStart
}:{
  locale:IeltsSelfTestLocale;
  skill:'reading'|'writing';
  disabled?:boolean;
  onBack:()=>void;
  onStart:(prompt:string)=>void;
}) {
  const ar=locale==='ar';
  const reading=skill==='reading';
  const [track,setTrack]=useState<IeltsPracticeTrack>('academic');
  const [stage,setStage]=useState<IeltsPracticeStage>('foundation');
  const [task,setTask]=useState<IeltsWritingTask>(1);
  const links=IELTS_OFFICIAL_SAMPLE_LINKS.filter(item=>item.id==='writing-criteria'||
    item.id===track+'-'+skill);
  const launch=()=>{
    onStart(reading
      ? ieltsReadingPracticeRequest(locale,track,stage)
      : ieltsWritingPracticeRequest(locale,track,stage,task));
  };
  return <section className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-3 py-5 sm:px-6"
    aria-label={ar ? (reading?'محاكاة قراءة IELTS':'محاكاة كتابة IELTS') : ('IELTS '+skill+' practice')}>
    <div className="mx-auto w-full max-w-3xl">
      <button type="button" onClick={onBack} className="min-h-10 rounded-xl border border-emerald-300 bg-white px-4 py-2 text-xs font-black text-emerald-900 dark:border-emerald-700 dark:bg-slate-900 dark:text-emerald-100">
        {ar?'الرجوع للمهارات':'Back to skills'}
      </button>
      <div className="mt-3 rounded-[1.75rem] border-2 border-emerald-200 bg-white p-5 shadow-lg dark:border-emerald-800 dark:bg-slate-900 sm:p-7">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100">
            {reading ? <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 6c-3-2-7-2-9-1v14c3-1 7-1 9 1 3-2 7-2 9-1V5c-3-1-7-1-9 1Zm0 0v14"/></svg>
              : <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m4 17 11-11 3 3L7 20l-4 1 1-4Zm9-9 3 3M19 5l2 2"/></svg>}
          </span>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white sm:text-2xl">
              {reading ? (ar?'تدريبات القراءة مع صقر':'Reading with Saqr') : (ar?'تدريبات الكتابة مع صقر':'Writing with Saqr')}
            </h2>
            <p className="mt-1 text-xs font-semibold leading-6 text-slate-600 dark:text-slate-300">
              {ar?'اختار مسار الامتحان ومستوى التدريب، وصقر هيبني لك نموذجًا أصليًا على نفس شكل المهام الرسمية.'
                :'Select the test track and training level. Saqr builds an original task in an IELTS-style format.'}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-black text-slate-700 dark:text-slate-100">
            {ar?'نوع IELTS':'IELTS test type'}
            <select value={track} onChange={e=>setTrack(e.target.value as IeltsPracticeTrack)}
              className="mt-2 block min-h-12 w-full rounded-xl border-2 border-emerald-200 bg-white px-3 text-sm font-bold text-slate-900 dark:border-emerald-800 dark:bg-slate-800 dark:text-white">
              <option value="academic">Academic</option>
              <option value="general">General Training</option>
            </select>
          </label>
          <label className="text-sm font-black text-slate-700 dark:text-slate-100">
            {ar?'درجة صعوبة التدريب':'Practice difficulty'}
            <select value={stage} onChange={e=>setStage(e.target.value as IeltsPracticeStage)}
              className="mt-2 block min-h-12 w-full rounded-xl border-2 border-emerald-200 bg-white px-3 text-sm font-bold text-slate-900 dark:border-emerald-800 dark:bg-slate-800 dark:text-white">
              <option value="foundation">{ar?'تأسيسي':'Foundation'}</option>
              <option value="developing">{ar?'متوسط':'Developing'}</option>
              <option value="mock">{ar?'محاكاة متقدمة':'Extended mini-mock'}</option>
            </select>
          </label>
        </div>

        {!reading && <fieldset className="mt-5">
          <legend className="text-sm font-black text-slate-700 dark:text-slate-100">{ar?'اختر مهمة الكتابة':'Choose the writing task'}</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {([1,2] as const).map(n=><label key={n}
              className={'flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold '+
                (task===n?'border-emerald-600 bg-emerald-50 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100':'border-slate-200 dark:border-slate-700')}>
              <input type="radio" name="ielts-writing-task" checked={task===n} onChange={()=>setTask(n)} className="size-4 accent-emerald-700"/>
              <span>Task {n} · {n===1
                ? (track==='academic'?(ar?'وصف جدول بيانات':'Data table'):(ar?'رسالة':'Letter'))
                : (ar?'مقال':'Essay')}</span>
            </label>)}
          </div>
          <p className="mt-2 text-xs font-bold text-slate-500 dark:text-slate-300">
            {task===1?'150+ words · 20 minutes':'250+ words · 40 minutes'}
          </p>
        </fieldset>}

        <div className="mt-5 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-xs font-semibold leading-7 text-slate-700 dark:border-sky-900 dark:bg-slate-800 dark:text-slate-200">
          <strong className="block text-sm font-black text-sky-900 dark:text-sky-100">
            {ar?'نماذج ومقاييس IELTS الأصلية':'Official IELTS samples and criteria'}
          </strong>
          <p className="mt-1">{ar?'افتح المصدر الرسمي للمقارنة. التدريبات التي ينشئها صقر ليست أسئلة IELTS رسمية.'
            :'Open the official examples for comparison. Saqr-generated tasks are NOT official IELTS questions.'}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
            {links.map(link=><a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
              className="font-black text-emerald-700 underline underline-offset-2 dark:text-emerald-300">
              {ar?link.ar:link.en}
            </a>)}
          </div>
        </div>
        <button type="button" onClick={launch} disabled={disabled}
          className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-base font-black text-white shadow-lg transition hover:bg-emerald-800 disabled:opacity-50">
          {reading ? (ar?'خلّي صقر ينشئ نموذج قراءة':'Generate Reading practice with Saqr')
            : (ar?'خلّي صقر ينشئ مهمة كتابة':'Generate Writing task with Saqr')}
          <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
        </button>
        <p className="mt-3 text-center text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          {ar?'سيفتح التدريب في محادثة صقر المعتادة، من غير تغيير الذكاء أو القارئ.'
            :'Your practice opens in the original Saqr chat; the AI and book readers are unchanged.'}
        </p>
      </div>
    </div>
  </section>;
}
