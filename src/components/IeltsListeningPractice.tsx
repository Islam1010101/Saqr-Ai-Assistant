import React, { useState } from 'react';
import { IELTS_GRADED_LISTENING_LESSONS, type IeltsListeningStage } from '../data/ieltsListeningExpanded';
import { isListeningAnswerComplete, isListeningAnswerCorrect, isListeningCompletion, type IeltsListeningAnswer } from '../utils/ieltsListeningGrading';
import { ieltsListeningReviewRequest } from '../utils/ieltsListeningReview';
import type { IeltsSelfTestLocale } from '../utils/ieltsSaqrPractice';

/**
 * IELTS-entry-only practice UI. This does NOT alter Saqr's chat, providers,
 * message handler, system instructions, teacher lessons or other challenges.
 * Audio streams from VOA; Saqr receives a source-grounded review prompt only
 * after the user finishes answering the listening questions.
 */
export default function IeltsListeningPractice({
  locale, disabled, onBack, onReview,
}: {
  locale: IeltsSelfTestLocale;
  disabled?: boolean;
  onBack: () => void;
  onReview: (prompt: string) => void;
}) {
  const ar = locale === 'ar';
  const [stage, setStage] = useState<IeltsListeningStage>(1);
  const [lessonId, setLessonId] = useState(IELTS_GRADED_LISTENING_LESSONS[0].id);
  const [answers, setAnswers] = useState<IeltsListeningAnswer[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [revealTranscript, setRevealTranscript] = useState(false);
  const [audioFailed, setAudioFailed] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);

  const lesson = IELTS_GRADED_LISTENING_LESSONS.find(item => item.id === lessonId) || IELTS_GRADED_LISTENING_LESSONS[0];
  const stageLessons = IELTS_GRADED_LISTENING_LESSONS.filter(item => item.stage === stage);
  const current = lesson.questions[questionIndex];
  const chosen = answers[questionIndex];
  const score = lesson.questions.reduce((total, question, index) =>
    total + (isListeningAnswerCorrect(question, answers[index]) ? 1 : 0), 0);

  const selectLesson = (id: string) => {
    if (!IELTS_GRADED_LISTENING_LESSONS.some(item => item.id === id)) return;
    setLessonId(id);
    setAnswers([]);
    setQuestionIndex(0);
    setCompleted(false);
    setRevealTranscript(false);
    setAudioFailed(false);
    setAudioStarted(false);
  };
  const chooseAnswer = (selected: IeltsListeningAnswer) => {
    if (completed || disabled) return;
    setAnswers(previous => {
      const next = [...previous];
      next[questionIndex] = selected;
      return next;
    });
  };
  const advance = () => {
    if (!isListeningAnswerComplete(chosen)) return;
    if (questionIndex + 1 < lesson.questions.length) setQuestionIndex(index => index + 1);
    else setCompleted(true);
  };
  const reviewWithSaqr = () => {
    if (disabled || !completed) return;
    onReview(ieltsListeningReviewRequest(lesson, answers, locale));
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-4 sm:px-6" aria-label={ar ? 'تدريبات الاستماع الصوتية مع صقر' : 'Saqr recorded listening practice'}>
      <header className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-2">
        <button type="button" onClick={onBack} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-emerald-300 bg-white px-4 py-2 text-xs font-bold text-emerald-900 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-100">
          <span aria-hidden="true">‹</span>
          {ar ? 'رجوع للمهارات' : 'Back to skills'}
        </button>
        <span className="text-xs font-black tracking-wide text-emerald-700 dark:text-emerald-300">SAQR AI · LISTENING STUDIO</span>
      </header>

      <div className="mx-auto w-full max-w-3xl rounded-[1.75rem] border-2 border-emerald-200 bg-white p-4 shadow-md dark:border-emerald-900 dark:bg-slate-900 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 14v-3a8 8 0 0 1 16 0v3"/>
              <rect x="2.5" y="13" width="4" height="7" rx="2"/>
              <rect x="17.5" y="13" width="4" height="7" rx="2"/>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white sm:text-2xl">{ar ? 'استمع بصوت حقيقي… وخلّ صقر يراجع معك!' : 'Hear real voices. Review with Saqr!'}</h2>
            <p className="mt-1 text-xs font-semibold leading-6 text-slate-600 dark:text-slate-300">
              {ar ? 'تسجيلات ونصوص تعليمية أصلية من VOA Learning English، وليست اختبارات Cambridge أو IELTS رسمية.' : 'Original human-recorded VOA Learning English lessons, not official Cambridge or IELTS exam recordings.'}
            </p>
          </div>
        </div>

        <aside className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50/80 px-4 py-4 text-start dark:border-cyan-900 dark:bg-cyan-950/30" aria-label={ar ? 'النماذج الرسمية' : 'Official sample resources'}>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">{ar ? 'نماذج IELTS الرسمية — على الموقع الأصلي' : 'Official IELTS samples — on the original provider site'}</h3>
          <p className="mt-1 text-xs font-semibold leading-6 text-slate-600 dark:text-slate-300">
            {ar
              ? 'اتعرّف على شكل أسئلة الاختيار من متعدد، وإكمال الملاحظات والجداول، والخرائط. تدريبات صقر هنا أصلية باستخدام VOA وليست نسخًا من اختبارات IELTS الرسمية.'
              : 'Explore official multiple choice, note/table completion and map tasks. Saqr exercises below are newly authored from VOA recordings, not copied official IELTS tests.'}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs font-black">
            <a href="https://ielts.org/take-a-test/preparation-resources/sample-test-questions/academic-test"
               target="_blank" rel="noopener noreferrer" className="text-cyan-800 underline underline-offset-4 dark:text-cyan-200">
              {ar ? 'نماذج IELTS Listening المعتمدة' : 'IELTS.org official Listening task samples'}
            </a>
            <a href="https://takeielts.britishcouncil.org/prepare/ielts-free-practice-mock-tests/academic/listening"
               target="_blank" rel="noopener noreferrer" className="text-cyan-800 underline underline-offset-4 dark:text-cyan-200">
              {ar ? 'اختبارات تدريب British Council' : 'British Council official practice'}
            </a>
          </div>
        </aside>
        <div className="mt-5" aria-label={ar ? 'التدرّج في صعوبة الاستماع' : 'Listening progression'}>
          <h3 className="mb-2 text-sm font-black text-slate-800 dark:text-white">{ar ? 'تدرّج مع صقر من الأسهل للأصعب' : 'Progress from easier to more demanding lessons'}</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {([1,2,3,4] as const).map(level => (
              <button type="button" key={level}
                aria-pressed={stage===level}
                onClick={() => {
                  const next=IELTS_GRADED_LISTENING_LESSONS.find(item => item.stage===level);
                  if (next) {setStage(level);selectLesson(next.id);}
                }}
                className={'min-h-12 rounded-xl border px-3 py-2 text-start text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-emerald-600 ' +
                  (stage===level ? 'border-emerald-700 bg-emerald-700 text-white shadow-md' : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100')}>
                <span className="block text-sm font-black">{ar ? 'المرحلة ' : 'Stage '}{level}</span>
                <span className="mt-0.5 block font-semibold">{ar
                  ? (['تعارف ومعلومات','مواقف واتجاهات','نقاشات وتفاصيل','تقارير أطول'][level-1])
                  : (['Introductions','Everyday directions','Discussions','Extended reports'][level-1])}</span>
                <span className="mt-0.5 block opacity-80">{IELTS_GRADED_LISTENING_LESSONS.filter(item=>item.stage===level).length} {ar ? 'تسجيلات' : 'recordings'}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs font-semibold leading-6 text-slate-600 dark:text-slate-300">
            {ar ? 'المراحل من إعداد صقر للتعلّم بالتدرّج وليست أجزاء IELTS الأربعة أو تقديرًا للدرجة.' : 'These are Saqr learning stages, not official IELTS test parts or band predictions.'}
          </p>
        </div>

        <label className="mt-5 block text-sm font-black text-slate-700 dark:text-slate-100">
          {ar ? 'اختر التسجيل' : 'Choose your recording'}
          <select value={lessonId} onChange={event => selectLesson(event.target.value)}
            className="mt-2 block min-h-12 w-full rounded-2xl border-2 border-emerald-200 bg-slate-50 px-4 text-sm font-bold text-slate-900 outline-none focus:border-emerald-600 dark:border-emerald-800 dark:bg-slate-800 dark:text-white">
            {stageLessons.map(item =>
              <option key={item.id} value={item.id}>{item.title} · {locale==='ar'?item.contextAr:item.contextEn}</option>)}
          </select>
        </label>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <strong className="block text-base font-black text-slate-900 dark:text-white">{lesson.title}</strong>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-300">{lesson.level} · {ar?lesson.contextAr:lesson.contextEn}{lesson.durationSeconds>0?' · '+Math.ceil(lesson.durationSeconds/60)+' min':''}</span>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">VOA AUDIO</span>
          </div>
          <audio
            key={lesson.id}
            controls
            controlsList="nodownload noplaybackrate"
            preload="metadata"
            src={lesson.audioUrl}
            onPlay={() => setAudioStarted(true)}
            onError={() => setAudioFailed(true)}
            aria-label={(ar ? 'التسجيل الصوتي: ' : 'Audio recording: ') + lesson.title}
            className="w-full"
          >
            {ar ? 'المتصفح لا يدعم تشغيل الصوت.' : 'Your browser does not support audio playback.'}
          </audio>
          {audioFailed && <p className="mt-3 text-xs font-bold leading-6 text-amber-700 dark:text-amber-200" role="alert">
            {ar ? 'تعذّر تحميل الصوت من خادم VOA. افتح المصدر الرسمي واستمع هناك، ثم ارجع للتدريب.' : 'VOA audio could not load. Listen at the official source, then return to this practice.'}
          </p>}
          <p className="mt-2 text-xs font-semibold leading-6 text-slate-600 dark:text-slate-300">
            {ar ? 'اسمع التسجيل أولًا، وحاول تجاوب من غير ما تشوف النص.' : 'Listen first, then answer without reading the transcript.'}
          </p>
          <a href={lesson.sourceUrl} target="_blank" rel="noopener noreferrer"
            className="mt-1 inline-block text-xs font-black text-emerald-700 underline underline-offset-2 dark:text-emerald-300">
            {ar ? 'المصدر الأصلي والتسجيل البديل: VOA Learning English' : 'Original source and playback fallback: VOA Learning English'}
          </a>
        </div>

        {!completed ? (
          <div className="mt-5" aria-live="polite">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white">{ar ? 'أسئلة الفهم — بأسلوب IELTS' : 'IELTS-style listening questions'}</h3>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-300">{questionIndex + 1} / {lesson.questions.length}</span>
            </div>
            <fieldset dir="ltr" className="space-y-3 rounded-2xl border-2 border-slate-100 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
              <legend className="px-1 text-start text-sm font-black leading-7 text-slate-900 dark:text-white">{current.prompt}</legend>
              {isListeningCompletion(current) ? (
                <div className="space-y-2">
                  <label htmlFor="ielts-listening-completion" className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                    {ar ? 'اكتب الإجابة القصيرة من التسجيل (لا تظهر الإجابة الصحيحة إلا بعد المراجعة).' : 'Enter the short answer you heard. The correct answer stays hidden until review.'}
                  </label>
                  <input id="ielts-listening-completion" key={lesson.id + '-' + questionIndex}
                    type="text" autoComplete="off" maxLength={80}
                    value={typeof chosen==='string'?chosen:''}
                    onChange={event => chooseAnswer(event.target.value)}
                    disabled={disabled} placeholder={ar ? 'اكتب إجابتك بالإنجليزية' : 'Type your answer'}
                    className="min-h-12 w-full rounded-xl border-2 border-emerald-200 bg-white px-4 text-sm font-bold text-slate-900 focus:border-emerald-700 focus:outline-none dark:border-emerald-800 dark:bg-slate-900 dark:text-white" />
                  <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                    {current.kind==='table-completion' ? 'Table completion' : current.kind==='short-answer' ? 'Short answer' : 'Note completion'}
                  </p>
                </div>
              ) : current.options.map((option, index) =>
                <label key={option} className={'flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border p-3 text-start text-sm font-semibold transition ' +
                  (chosen === index ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100' : 'border-slate-200 bg-white text-slate-800 hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100')}>
                  <input type="radio" name={'listening-' + lesson.id + '-' + questionIndex}
                    checked={chosen === index} onChange={() => chooseAnswer(index)}
                    disabled={disabled} className="size-4 accent-emerald-700"/>
                  <span>{String.fromCharCode(65 + index)}. {option}</span>
                </label>
              ))}
            </fieldset>
            {!audioStarted && !audioFailed && <p className="mt-3 text-xs font-semibold text-amber-700 dark:text-amber-200">
              {ar ? 'ابدأ تشغيل التسجيل قبل الإجابة لتحصل على تدريب استماع حقيقي.' : 'Play the recording before answering for authentic listening practice.'}
            </p>}
            <button type="button" disabled={!isListeningAnswerComplete(chosen) || disabled || (!audioStarted && !audioFailed)}
              onClick={advance}
              className="mt-4 inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-700 px-6 py-3 text-sm font-black text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50">
              {questionIndex + 1 < lesson.questions.length
                ? (ar ? 'السؤال التالي' : 'Next question')
                : (ar ? 'اعرض نتيجتي' : 'See my result')}
            </button>
            {audioFailed && <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">
              {ar ? 'يمكنك الإجابة بعد الاستماع من الموقع الرسمي؛ لا يمكن للموقع التحقق من تشغيل الصوت خارجه.' : 'You may answer after listening on the official website; off-site playback cannot be verified.'}
            </p>}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/40" role="status">
            <h3 className="text-xl font-black text-emerald-950 dark:text-emerald-100">{ar ? 'خلصت التدريب! ممتاز إنك جرّبت.' : 'Listening practice completed!'}</h3>
            <p className="mt-2 text-sm font-bold text-emerald-900 dark:text-emerald-100">{ar ? 'نتيجة الفهم لهذا التسجيل' : 'Comprehension result for this recording'}: {score} / {lesson.questions.length}</p>
            <p className="mt-1 text-xs font-semibold leading-6 text-slate-600 dark:text-slate-300">
              {ar ? 'دي نتيجة أسئلة تدريبية بس، مش درجة IELTS رسمية.' : 'This is an exercise score, not an official IELTS band.'}
            </p>
            <button type="button" onClick={() => setRevealTranscript(value => !value)}
              className="mt-3 rounded-xl border border-emerald-300 bg-white px-4 py-2 text-xs font-black text-emerald-900 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-200">
              {revealTranscript ? (ar ? 'إخفاء النص' : 'Hide transcript') : (ar ? 'اعرض نص الاستماع' : 'Reveal transcript')}
            </button>
            {revealTranscript && <div className="mt-4 rounded-xl bg-white p-4 dark:bg-slate-900">
              <p className="mb-2 text-xs font-black text-slate-500 dark:text-slate-300">
                {lesson.transcriptKind === 'complete' ? (ar ? 'نص التسجيل الكامل' : 'Full conversation transcript') : (ar ? 'مقتطف موثق من بداية التسجيل فقط' : 'Verified opening excerpt only')}
              </p>
              <p dir="ltr" className="whitespace-pre-line text-start text-xs font-semibold leading-7 text-slate-800 dark:text-slate-200">{lesson.transcript}</p>
              {lesson.verifiedSummary && <p dir="ltr" className="mt-4 border-t border-slate-200 pt-3 text-start text-xs leading-7 text-slate-600 dark:border-slate-700 dark:text-slate-300">
                {lesson.verifiedSummary}
              </p>}
            </div>}
            <button type="button" onClick={reviewWithSaqr} disabled={disabled}
              className="mt-4 block min-h-12 w-full rounded-xl bg-emerald-700 px-5 py-3 text-sm font-black text-white shadow-md transition hover:bg-emerald-800 disabled:opacity-50">
              {ar ? 'خلّ صقر يراجع إجاباتي ويشرح أخطائي' : 'Review my listening answers with Saqr'}
            </button>
            <button type="button" onClick={() => selectLesson(lesson.id)} className="mt-3 text-xs font-bold text-emerald-800 underline underline-offset-2 dark:text-emerald-200">
              {ar ? 'أعد التدريب' : 'Try the recording again'}
            </button>
          </div>
        )}

        <p className="mt-5 text-[11px] font-semibold leading-6 text-slate-500 dark:text-slate-400">
          © {ar ? 'نسب المصدر: ' : 'Source credit: '}
          <a href="https://learningenglish.voanews.com/p/6861.html" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">VOA Learning English</a>
          {ar ? ' — تسجيلات ونصوص VOA الأصلية في الملكية العامة. بقية خدمات صقر لم تتغير.' : ' — Original VOA audio and texts are public domain. Other Saqr features remain unchanged.'}
        </p>
      </div>
    </section>
  );
}
