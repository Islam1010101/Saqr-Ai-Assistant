import React, { useState } from 'react';
import { IELTS_LISTENING_LESSONS } from '../data/ieltsListeningLessons';
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
  const [lessonId, setLessonId] = useState(IELTS_LISTENING_LESSONS[0].id);
  const [answers, setAnswers] = useState<number[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [revealTranscript, setRevealTranscript] = useState(false);
  const [audioFailed, setAudioFailed] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);

  const lesson = IELTS_LISTENING_LESSONS.find(item => item.id === lessonId) || IELTS_LISTENING_LESSONS[0];
  const current = lesson.questions[questionIndex];
  const chosen = answers[questionIndex];
  const score = lesson.questions.reduce((total, question, index) =>
    total + (answers[index] === question.correctIndex ? 1 : 0), 0);

  const selectLesson = (id: string) => {
    if (!IELTS_LISTENING_LESSONS.some(item => item.id === id)) return;
    setLessonId(id);
    setAnswers([]);
    setQuestionIndex(0);
    setCompleted(false);
    setRevealTranscript(false);
    setAudioFailed(false);
    setAudioStarted(false);
  };
  const chooseAnswer = (selected: number) => {
    if (completed || disabled) return;
    setAnswers(previous => {
      const next = [...previous];
      next[questionIndex] = selected;
      return next;
    });
  };
  const advance = () => {
    if (chosen === undefined) return;
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

        <label className="mt-5 block text-sm font-black text-slate-700 dark:text-slate-100">
          {ar ? 'اختر التسجيل' : 'Choose your recording'}
          <select value={lessonId} onChange={event => selectLesson(event.target.value)}
            className="mt-2 block min-h-12 w-full rounded-2xl border-2 border-emerald-200 bg-slate-50 px-4 text-sm font-bold text-slate-900 outline-none focus:border-emerald-600 dark:border-emerald-800 dark:bg-slate-800 dark:text-white">
            {IELTS_LISTENING_LESSONS.map(item =>
              <option key={item.id} value={item.id}>{item.level} · {item.title}</option>)}
          </select>
        </label>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <strong className="block text-base font-black text-slate-900 dark:text-white">{lesson.title}</strong>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-300">{lesson.level} · {Math.ceil(lesson.durationSeconds / 60)} min</span>
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
              <h3 className="text-base font-black text-slate-900 dark:text-white">{ar ? 'أسئلة الفهم' : 'Listening questions'}</h3>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-300">{questionIndex + 1} / {lesson.questions.length}</span>
            </div>
            <fieldset dir="ltr" className="space-y-3 rounded-2xl border-2 border-slate-100 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
              <legend className="px-1 text-start text-sm font-black leading-7 text-slate-900 dark:text-white">{current.prompt}</legend>
              {current.options.map((option, index) =>
                <label key={option} className={'flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border p-3 text-start text-sm font-semibold transition ' +
                  (chosen === index ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100' : 'border-slate-200 bg-white text-slate-800 hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100')}>
                  <input type="radio" name={'listening-' + lesson.id + '-' + questionIndex}
                    checked={chosen === index} onChange={() => chooseAnswer(index)}
                    disabled={disabled} className="size-4 accent-emerald-700"/>
                  <span>{String.fromCharCode(65 + index)}. {option}</span>
                </label>
              )}
            </fieldset>
            {!audioStarted && !audioFailed && <p className="mt-3 text-xs font-semibold text-amber-700 dark:text-amber-200">
              {ar ? 'ابدأ تشغيل التسجيل قبل الإجابة لتحصل على تدريب استماع حقيقي.' : 'Play the recording before answering for authentic listening practice.'}
            </p>}
            <button type="button" disabled={chosen === undefined || disabled || (!audioStarted && !audioFailed)}
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
