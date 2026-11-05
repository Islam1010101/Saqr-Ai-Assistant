import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { learningStories } from '../../../supabase/functions/saqr-learning-narration/stories';
import { learningQuestions, type StoryQuizQuestion } from '../../../supabase/functions/saqr-learning-narration/questions';
import LearningPictureArt, { type LearningPicture } from './LearningPictureArt';

type ReadTogetherProps = { isAr: boolean; large: boolean; quiet: boolean; isAdmin?: boolean };
const stories = learningStories;

// Recording timings mark the silent gaps between the spoken title and ten sentences.
// Every story is narrated from the approved MP3 in /public; no text-to-speech API
// or device voice is called by this activity. Review timings if media is replaced.
const recordedCuts: Record<string, { ar: number[]; en: number[] }> = {
  "saqr-library": {
    "ar": [
      2.154,
      8.089,
      14.674,
      20.066,
      26.031,
      31.723,
      37.459,
      42.606,
      48.09,
      52.941
    ],
    "en": [
      2.205,
      7.501,
      12.155,
      16.922,
      21.317,
      25.848,
      30.491,
      34.918,
      39.103,
      43.341
    ]
  },
  "little-tree": {
    "ar": [
      2.019,
      7.717,
      12.137,
      16.958,
      22.09,
      27.054,
      32.701,
      37.68,
      42.348,
      47.155
    ],
    "en": [
      1.717,
      6.066,
      9.51,
      14.287,
      18.242,
      22.62,
      26.596,
      30.094,
      34.799,
      38.352
    ]
  },
  "school-morning": {
    "ar": [
      2.637,
      7.313,
      11.843,
      15.782,
      19.799,
      24.06,
      28.094,
      33.52,
      38.137,
      42.503
    ],
    "en": [
      2.063,
      5.997,
      9.989,
      14.024,
      17.531,
      21.372,
      25.037,
      29.552,
      33.293,
      37.293
    ]
  },
  "friendly-ball": {
    "ar": [
      2.891,
      7.976,
      12.259,
      17.029,
      22.196,
      27.259,
      32.123,
      37.096,
      42.122,
      47.218
    ],
    "en": [
      2.573,
      6.978,
      10.587,
      14.336,
      18.123,
      22.119,
      26.241,
      29.811,
      33.883,
      37.9
    ]
  },
  "rainy-day": {
    "ar": [
      2.44,
      8.23,
      12.211,
      17.455,
      22.074,
      27.198,
      33.042,
      38.378,
      43.587,
      48.933
    ],
    "en": [
      2.77,
      8.015,
      11.982,
      16.505,
      21.736,
      26.511,
      31.215,
      35.948,
      40.594,
      45.806
    ]
  },
  "my-small-project": {
    "ar": [
      2.358,
      7.23,
      12.005,
      17.686,
      23.236,
      27.999,
      33.399,
      38.409,
      44.8,
      50.438
    ],
    "en": [
      2.731,
      7.886,
      11.985,
      17.567,
      22.935,
      27.699,
      31.614,
      37.018,
      43.865,
      48.009
    ]
  }
};
const recordedAudioUrl = (id: string, language: 'ar' | 'en') =>
  '/audio/saqr-reading/' + encodeURIComponent(id) + '/' + language + '.mp3';

export default function ReadTogether({ isAr, large, quiet }: ReadTogetherProps) {
  const [story, setStory] = useState(0);
  const [difficulty, setDifficulty] = useState<'gentle' | 'explorer'>('gentle');
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [choice, setChoice] = useState<number | null>(null);
  const [nextIndex, setNextIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);
  const answeredRef = useRef(new Set<string>());
  const questionRef = useRef<HTMLElement | null>(null);
  const [fullStory, setFullStory] = useState(false);
  const [rate, setRate] = useState(0.9);
  const [state, setState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [currentLine, setCurrentLine] = useState(-1);
  const [error, setError] = useState('');
  const sessionRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lines = isAr ? stories[story].ar : stories[story].en;
  const language = isAr ? 'ar' : 'en';
  const storyQuestions = learningQuestions.filter(q => q.storyId === stories[story].id &&
    (difficulty === 'explorer' || q.level === 1));
  const question = storyQuestions.find(q => q.id === questionId);
  const choiceOrder = useMemo(() => {
    if (!question) return [] as number[];
    const other = question.options.map((_, i) => i).filter(i => i !== question.correctIndex);
    const allowed = difficulty === 'gentle' ? [question.correctIndex, other[0]] :
      question.options.map((_, i) => i);
    return allowed.sort(() => Math.random() - 0.5);
  }, [questionId, difficulty, question?.correctIndex]);
  const correct = !!question && choice === question.correctIndex;
  const coverPictures: LearningPicture[] = ['book', 'tree', 'desk', 'ball', 'sun', 'book'];
  const cover = coverPictures[story] || 'book';

  const stop = useCallback(() => {
    sessionRef.current += 1;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.ontimeupdate = null;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.onloadedmetadata = null;
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
      audioRef.current = null;
    }
    setState('idle');
    setCurrentLine(-1);
  }, []);

  useEffect(() => {
    stop();
    answeredRef.current.clear();
    setQuestionId(null);
    setChoice(null);
    setAnsweredCount(0);
    setNextIndex(0);
    setFinished(false);
  }, [isAr, stop]);

  useEffect(() => () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
      audioRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!questionId || typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches || quiet;
    const node = questionRef.current;
    if (!node) return;
    node.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    node.focus({ preventScroll: true });
  }, [questionId, quiet]);

  const resetProgress = () => {
    stop();
    answeredRef.current.clear();
    setAnsweredCount(0);
    setQuestionId(null);
    setChoice(null);
    setNextIndex(0);
    setFinished(false);
    setFullStory(false);
    setError('');
  };

  const afterLine = (index: number, id: number, continueReading: (next: number) => void) => {
    if (sessionRef.current !== id) return;
    setNextIndex(index + 1);
    const checkpoint = storyQuestions.find(q => q.afterLine === index && !answeredRef.current.has(q.id));
    if (checkpoint) {
      setQuestionId(checkpoint.id);
      setChoice(null);
      setError('');
      setCurrentLine(-1);
      setState('idle');
      return;
    }
    continueReading(index + 1);
  };

  const chooseAnswer = (index: number) => {
    if (!question || correct) return;
    setChoice(index);
    if (index === question.correctIndex) {
      if (!answeredRef.current.has(question.id)) {
        answeredRef.current.add(question.id);
        setAnsweredCount(answeredRef.current.size);
      }
      // The recording is paused at the checkpoint; retain its decoded buffer.
      setState('idle');
      setCurrentLine(-1);
      setError('');
    }
  };

  const play = (startAt = 0) => {
    if (startAt >= lines.length) {
      stop();
      setNextIndex(lines.length);
      setFinished(true);
      return;
    }
    const url = recordedAudioUrl(stories[story].id, language);
    // Reuse the same decoded recording as we advance through its ten sentences.
    // Recreating Audio for each sentence causes repeated loads and audible gaps.
    const canReuse = audioRef.current?.getAttribute('src') === url;
    if (!canReuse) stop();
    else {
      const current = audioRef.current!;
      sessionRef.current += 1;
      current.pause();
      current.ontimeupdate = null;
      current.onended = null;
      current.onerror = null;
      current.onloadedmetadata = null;
    }
    setError('');
    setFinished(false);
    const id = ++sessionRef.current;
    const audio = canReuse ? audioRef.current! : new Audio(url);
    audio.preload = 'auto';
    audio.playbackRate = rate;
    audioRef.current = audio;
    const cuts = recordedCuts[stories[story].id][language];
    const begin = cuts[startAt];
    const finish = cuts[startAt + 1];

    let handled = false;
    const finishSentence = () => {
      if (handled || sessionRef.current !== id) return;
      handled = true;
      audio.pause();
      audio.ontimeupdate = null;
      audio.onended = null;
      setState('idle');
      afterLine(startAt, id, next => {
        if (next >= lines.length) {
          stop();
          setNextIndex(lines.length);
          setFinished(true);
        } else {
          play(next);
        }
      });
    };

    const startSegment = () => {
      if (sessionRef.current !== id) return;
      audio.onloadedmetadata = null;
      audio.currentTime = Math.min(Math.max(0, begin), Math.max(0, audio.duration - 0.1));
      audio.ontimeupdate = () => {
        if (finish !== undefined && audio.currentTime >= finish - 0.07) finishSentence();
      };
      audio.onended = finishSentence;
      void audio.play()
        .then(() => {
          if (sessionRef.current === id) {
            setState('playing');
            setCurrentLine(startAt);
            setNextIndex(startAt);
          }
        })
        .catch(() => {
          if (sessionRef.current === id) {
            setState('paused');
            setError(isAr ?
              'اضغط متابعة للسماح بتشغيل التسجيل على هذا الجهاز.' :
              'Tap Resume to allow audio playback on this device.');
          }
        });
    };
    // Metadata is already in memory when continuing to another sentence.
    if (audio.readyState >= 1) startSegment();
    else audio.onloadedmetadata = startSegment;
    audio.onerror = () => {
      if (sessionRef.current === id) {
        setState('idle');
        setError(isAr ?
          'تعذر تحميل التسجيل الصوتي. يمكنك قراءة الجمل بنفسك.' :
          'The recording could not load. You can still read the sentences yourself.');
      }
    };
    if (!canReuse) audio.load();
  };

  const togglePause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (state === 'paused') {
      void audio.play().then(() => {
        setState('playing');
        setError('');
      }).catch(() => setError(isAr ?
        'تعذر تشغيل التسجيل. راجع إعدادات الصوت واضغط متابعة.' :
        'Audio could not start. Check the device settings and try again.'));
    } else if (state === 'playing') {
      audio.pause();
      setState('paused');
    }
  };

  const changeStory = (next: number) => { resetProgress(); setStory(next); };
  const changeRate = (next: number) => {
    stop();
    setRate(next);
  };
  const changeDifficulty = (next: 'gentle' | 'explorer') => {
    resetProgress();
    setDifficulty(next);
  };

  const advanceWithoutVoice = () => {
    stop();
    setError('');
    const index = nextIndex;
    if (index >= lines.length) { setFinished(true); return; }
    setCurrentLine(index);
    const id = ++sessionRef.current;
    afterLine(index, id, next => {
      if (next >= lines.length) setFinished(true);
      else setNextIndex(next);
    });
  };

  return <div className="space-y-6">
    <section className="rounded-[1.7rem] border border-emerald-200 dark:border-emerald-900 bg-emerald-50/80 dark:bg-emerald-950/20 p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{isAr ? 'اختار حكايتك يا بطل' : 'Choose your story'}</h3>
          <p className="mt-1 text-sm leading-7 font-semibold text-slate-600 dark:text-slate-300">
            {isAr ? 'اسمع مع صقر، وبعد كل جزء جاوب عن سؤال صغير.' : 'Listen with Saqr, then answer a little question at each stop.'}
          </p>
        </div>
        <span className="rounded-full bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 px-4 py-2 text-xs font-black text-emerald-800 dark:text-emerald-200">
          {isAr ? 'بدون مؤقت' : 'No timers'}
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {stories.map((item, index) => <button key={item.id} type="button" onClick={() => changeStory(index)}
          aria-pressed={index === story}
          className={'group min-h-[162px] rounded-[1.4rem] border-[3px] p-3 text-center font-black transition-[transform,border-color,box-shadow] duration-200 focus-visible:outline-4 focus-visible:outline-sky-400 ' +
            (index === story ? 'border-emerald-600 bg-white dark:bg-slate-900 shadow-lg' :
              'border-white dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 hover:border-sky-300 hover:-translate-y-1')}>
          <span className="block h-20 sm:h-24 max-w-36 mx-auto overflow-hidden rounded-2xl">
            <LearningPictureArt kind={coverPictures[index] || 'book'} label={isAr ? item.titleAr : item.titleEn} />
          </span>
          <span className="mt-2 block text-sm sm:text-base leading-relaxed text-slate-900 dark:text-white">{isAr ? item.titleAr : item.titleEn}</span>
        </button>)}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-emerald-200 dark:border-emerald-900">
        <p className="text-sm font-black text-emerald-900 dark:text-emerald-200">{isAr ? 'مستوى الأسئلة' : 'Question level'}</p>
        <div className="inline-flex flex-wrap gap-2">
          <button type="button" onClick={() => changeDifficulty('gentle')} aria-pressed={difficulty === 'gentle'}
            className={'min-h-12 rounded-xl px-4 py-3 border-2 font-black text-sm focus-visible:outline-4 focus-visible:outline-sky-400 ' +
              (difficulty === 'gentle' ? 'bg-emerald-700 text-white border-emerald-700' : 'border-emerald-300 bg-white dark:bg-slate-800 text-slate-800 dark:text-white')}>
            {isAr ? 'بسيط · اختيارين' : 'Gentle · 2 choices'}
          </button>
          <button type="button" onClick={() => changeDifficulty('explorer')} aria-pressed={difficulty === 'explorer'}
            className={'min-h-12 rounded-xl px-4 py-3 border-2 font-black text-sm focus-visible:outline-4 focus-visible:outline-sky-400 ' +
              (difficulty === 'explorer' ? 'bg-sky-700 text-white border-sky-700' : 'border-sky-300 bg-white dark:bg-slate-800 text-slate-800 dark:text-white')}>
            {isAr ? 'مستكشف · 3 اختيارات' : 'Explorer · 3 choices'}
          </button>
        </div>
      </div>
    </section>

    <section aria-label={isAr ? 'رحلة القراءة' : 'Reading journey'} className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <h3 className="text-xl sm:text-2xl font-black">{isAr ? stories[story].titleAr : stories[story].titleEn}</h3>
        <span className="rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 px-4 py-2 font-black text-sm">
          {isAr ? 'سؤال ' : 'Question '}{answeredCount} / {storyQuestions.length}
        </span>
      </div>
      <div role="progressbar" aria-valuenow={Math.min(nextIndex, lines.length)}
        aria-valuemin={0} aria-valuemax={lines.length} aria-label={isAr ? 'تقدم القصة' : 'Story progress'}
        className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-sky-500 transition-[width] duration-300"
          style={{ width: (Math.min(nextIndex, lines.length) / lines.length * 100) + '%' }} />
      </div>
      <article className="rounded-[1.9rem] border-2 border-sky-200 dark:border-sky-800 bg-white dark:bg-slate-950 p-5 sm:p-7 space-y-4">
        <div className="flex items-center gap-4">
          <span className="h-24 w-28 sm:h-28 sm:w-36 shrink-0 overflow-hidden rounded-2xl border border-sky-100 dark:border-sky-900">
            <LearningPictureArt kind={cover} label={isAr ? stories[story].titleAr : stories[story].titleEn} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-black tracking-wide text-emerald-700 dark:text-emerald-300">
              {isAr ? 'حكاية مع صقر' : 'STORY WITH SAQR'}
            </p>
            <p className="mt-2 text-base sm:text-lg font-black leading-relaxed">{isAr ? stories[story].titleAr : stories[story].titleEn}</p>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {isAr ? 'جملة واحدة في كل مرة' : 'One sentence at a time'}
            </p>
          </div>
        </div>
        {!finished && <div aria-live="polite" className="rounded-[1.4rem] border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20 p-5 sm:p-6 min-h-32 flex items-center">
          <p className={'font-black text-slate-900 dark:text-slate-100 ' +
            (large ? 'text-2xl sm:text-3xl leading-[2]' : 'text-xl sm:text-2xl leading-[1.9]')}>
            {lines[Math.max(0, Math.min(currentLine >= 0 ? currentLine : nextIndex, lines.length - 1))]}
          </p>
        </div>}
        <button type="button" onClick={() => setFullStory(value => !value)} aria-expanded={fullStory}
          className="min-h-11 rounded-xl border-2 border-slate-200 dark:border-slate-700 px-4 py-2.5 font-black text-sm text-emerald-800 dark:text-emerald-200 focus-visible:outline-4 focus-visible:outline-sky-400">
          {fullStory ? (isAr ? 'إخفاء النص الكامل' : 'Hide full story') : (isAr ? 'عرض القصة كاملة' : 'Read the whole story')}
        </button>
        {fullStory && <div className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-4" aria-label={isAr ? 'نص القصة الكامل' : 'Complete story'}>
          {lines.map((line, index) => <p key={index} className={'rounded-xl px-3 py-2 font-semibold ' +
            (large ? 'text-xl leading-[2]' : 'text-base sm:text-lg leading-[1.9]') +
            (currentLine === index ? ' bg-amber-200 text-slate-950 dark:bg-amber-300' : ' text-slate-700 dark:text-slate-200')}>
            {line}
          </p>)}
        </div>}
      </article>
    </section>

    {question && <section ref={questionRef} tabIndex={-1} aria-labelledby="saqr-reading-question" className="scroll-mt-24 rounded-[1.9rem] border-[3px] border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-slate-900 p-4 sm:p-7 space-y-5 shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="rounded-full bg-amber-200 dark:bg-amber-800/50 px-4 py-2 text-amber-950 dark:text-amber-100 font-black text-sm">
          {isAr ? 'صقر عنده سؤال ليك!' : 'Saqr has a question!'}
        </p>

      </div>
      <h3 id="saqr-reading-question" className={'font-black text-center leading-[1.8] text-slate-900 dark:text-white ' + (large ? 'text-3xl' : 'text-2xl')}>
        {isAr ? question.promptAr : question.promptEn}
      </h3>
      <div className={'grid grid-cols-1 gap-3 ' + (choiceOrder.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3')}>
        {choiceOrder.map(optionIndex => {
          const item = question.options[optionIndex];
          const selected = choice === optionIndex;
          return <button key={optionIndex} type="button" disabled={correct}
            aria-pressed={selected} onClick={() => chooseAnswer(optionIndex)}
            className={'min-h-[105px] rounded-[1.4rem] border-[3px] p-4 bg-white dark:bg-slate-950 flex items-center justify-center gap-3 sm:flex-col font-black leading-relaxed text-lg sm:text-xl transition-[transform,border-color] focus-visible:outline-4 focus-visible:outline-sky-400 ' +
              (selected ? (correct ? 'border-emerald-600 ring-2 ring-emerald-200' : 'border-amber-500') :
                'border-slate-200 dark:border-slate-700 hover:border-sky-400 hover:-translate-y-0.5')}>
            {item.picture && <span className="h-20 w-24 sm:h-24 sm:w-32 shrink-0">
              <LearningPictureArt kind={item.picture} label={isAr ? item.ar : item.en} />
            </span>}
            <span className="text-center text-slate-900 dark:text-white">{isAr ? item.ar : item.en}</span>
          </button>;
        })}
      </div>
      <div aria-live="polite" className="min-h-14">
        {choice !== null && <p className={'rounded-xl p-4 text-center font-black text-base sm:text-lg ' +
          (correct ? 'bg-emerald-100 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-200' :
            'bg-white dark:bg-slate-800 text-amber-900 dark:text-amber-200')}>
          {correct ? (isAr ? 'أحسنت! إجابة رائعة. صقر فخور بمحاولتك.' : 'Well done! Great thinking. Saqr is proud of your effort.') :
            (isAr ? 'محاولة جميلة! اقرأ السؤال واختار مرة تانية.' : 'Nice try! Read the question and choose again.')}
        </p>}
      </div>
      {correct && <button type="button" onClick={() => { setQuestionId(null); setChoice(null); play(nextIndex); }}
        className="w-full min-h-14 rounded-2xl bg-emerald-700 hover:bg-emerald-800 px-6 py-4 font-black text-white text-lg focus-visible:outline-4 focus-visible:outline-sky-400">
        {isAr ? (nextIndex >= lines.length ? 'شوف إنجازك' : 'كمّل الحكاية مع صقر') :
          (nextIndex >= lines.length ? 'See your achievement' : 'Continue the story with Saqr')}
      </button>}
    </section>}

    {finished && <section aria-live="polite" className="rounded-[1.9rem] border-2 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20 p-6 sm:p-9 text-center space-y-4">
      <div className="mx-auto h-32 w-40"><LearningPictureArt kind={cover} label={isAr ? 'انتهت القصة' : 'Story complete'} /></div>
      <h3 className="text-2xl sm:text-3xl font-black">{isAr ? 'برافو! خلصت مغامرتك مع صقر' : 'Hooray! You finished your Saqr adventure'}</h3>
      <p className="font-bold text-lg text-emerald-800 dark:text-emerald-200">
        {isAr ? 'جاوبت على ' : 'You answered '}{answeredCount}{isAr ? ' أسئلة من ' : ' of '}{storyQuestions.length}{isAr ? ' أسئلة.' : ' questions.'}
      </p>
      <button type="button" onClick={resetProgress} className="min-h-14 rounded-2xl bg-emerald-700 text-white px-7 py-4 font-black text-lg">
        {isAr ? 'أعيد المغامرة' : 'Play the story again'}
      </button>
    </section>}
    <div className="rounded-2xl bg-emerald-50 dark:bg-slate-900 p-4 sm:p-5 border border-emerald-100 dark:border-emerald-800 space-y-3">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {!question && !finished && <>
          <button type="button" onClick={() => play(nextIndex)}
            className="min-h-14 flex-1 sm:flex-none rounded-2xl bg-emerald-700 hover:bg-emerald-800 px-6 py-4 text-white text-base sm:text-lg font-black focus-visible:outline-4 focus-visible:outline-sky-400">
            {isAr ? 'استمع إلى التسجيل المعتمد' : 'Listen to the recorded story'}
          </button>
          <button type="button" onClick={advanceWithoutVoice}
            className="min-h-14 rounded-2xl border-2 border-sky-300 dark:border-sky-700 bg-white dark:bg-slate-800 px-5 py-3 text-base font-black text-sky-900 dark:text-sky-200 focus-visible:outline-4 focus-visible:outline-sky-400">
            {isAr ? 'اقرأ جملة بنفسي' : 'Read one sentence myself'}
          </button>
        </>}
        {state !== 'idle' && <>
          <button type="button" onClick={togglePause} className="min-h-12 rounded-xl border-2 border-emerald-400 px-4 py-3 font-black text-emerald-900 dark:text-emerald-100">
            {state === 'paused' ? (isAr ? 'متابعة' : 'Resume') : (isAr ? 'إيقاف مؤقت' : 'Pause')}
          </button>
          <button type="button" onClick={stop} className="min-h-12 rounded-xl border-2 border-rose-300 dark:border-rose-700 px-4 py-3 font-black text-rose-700 dark:text-rose-300">
            {isAr ? 'إيقاف' : 'Stop'}
          </button>
        </>}
      </div>
      <label className="block text-sm font-black text-slate-700 dark:text-slate-200">
        {isAr ? 'سرعة التسجيل' : 'Recording speed'}
        <select className="mt-1 w-full min-h-12 rounded-xl border border-emerald-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-slate-900 dark:text-white"
          value={rate} onChange={e => changeRate(Number(e.target.value))}>
          <option value={0.75}>{isAr ? 'بطيئة' : 'Slow'}</option>
          <option value={0.9}>{isAr ? 'هادئة' : 'Gentle'}</option>
          <option value={1}>{isAr ? 'طبيعية' : 'Normal'}</option>
          <option value={1.15}>{isAr ? 'أسرع' : 'Faster'}</option>
        </select>
      </label>
      {error && <p role="alert" className="font-bold text-rose-700 dark:text-rose-300">{error}</p>}
      <p className="text-xs leading-6 text-slate-600 dark:text-slate-300">
        {isAr ?
          'تُشغّل تسجيلات صقر المعتمدة من مكتبة المدرسة دون توليد صوتي. تتظلل الجملة أثناء الاستماع، وتتوقف القراءة عند أسئلة الفهم المكتوبة.' :
          'Plays approved school-library recordings without speech generation. The current sentence is highlighted and playback pauses at written comprehension questions.'}
      </p>
    </div>
  </div>;
}
