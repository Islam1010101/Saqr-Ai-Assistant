import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { learningStories } from '../../../supabase/functions/saqr-learning-narration/stories';
import { learningQuestions, type StoryQuizQuestion } from '../../../supabase/functions/saqr-learning-narration/questions';
import LearningPictureArt, { type LearningPicture } from './LearningPictureArt';

type ReadTogetherProps = { isAr: boolean; large: boolean; quiet: boolean; isAdmin?: boolean };
const stories = learningStories;

export default function ReadTogether({ isAr, large, quiet, isAdmin = false }: ReadTogetherProps) {
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
  const [voiceURI, setVoiceURI] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [available, setAvailable] = useState(false);
  const [state, setState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [currentLine, setCurrentLine] = useState(-1);
  const [error, setError] = useState('');
  const sessionRef = useRef(0);
  const [azureReady, setAzureReady] = useState<'checking' | 'ready' | 'not-configured' | 'error'>('checking');
  const [voiceSource, setVoiceSource] = useState<'azure' | 'device'>('device');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const locale = isAr ? 'ar-AE' : 'en-US';
  const lines = isAr ? stories[story].ar : stories[story].en;
  const matchedVoices = voices.filter(v => v.lang.toLowerCase().startsWith(isAr ? 'ar' : 'en'));
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
  const coverPictures: LearningPicture[] = ['book', 'tree', 'desk', 'ball', 'sun', 'pencil'];
  const cover = coverPictures[story] || 'book';

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setAvailable(false);
      return;
    }
    setAvailable(true);
    const synth = window.speechSynthesis;
    const refresh = () => setVoices(synth.getVoices());
    refresh();
    synth.addEventListener('voiceschanged', refresh);
    return () => {
      sessionRef.current += 1;
      synth.cancel();
      synth.removeEventListener('voiceschanged', refresh);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) throw new Error('No session');
        const result = await supabase.functions.invoke('saqr-learning-narration', {
          headers: { Authorization: 'Bearer ' + session.access_token },
          body: { action: 'status' }
        });
        if (result.error || typeof result.data?.configured !== 'boolean') throw new Error('Unavailable');
        if (!mounted) return;
        const ready = result.data.configured;
        setAzureReady(ready ? 'ready' : 'not-configured');
        setVoiceSource(ready ? 'azure' : 'device');
      } catch {
        if (mounted) {
          setAzureReady('error');
          setVoiceSource('device');
        }
      }
    })();
    return () => { mounted = false; };
  }, []);

  const stop = useCallback(() => {
    sessionRef.current += 1;
    requestRef.current?.abort();
    requestRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setState('idle');
    setCurrentLine(-1);
  }, []);

  useEffect(() => {
    stop();
    setVoiceURI('');
    answeredRef.current.clear();
    setQuestionId(null);
    setChoice(null);
    setAnsweredCount(0);
    setNextIndex(0);
    setFinished(false);
  }, [isAr, stop]);

  useEffect(() => () => {
    requestRef.current?.abort();
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.removeAttribute('src'); }
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
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

  const speakQuestion = async (item: StoryQuizQuestion, id: number) => {
    const prompt = isAr ? item.promptAr : item.promptEn;
    setState('playing');
    if (voiceSource === 'azure' && azureReady === 'ready') {
      const controller = new AbortController();
      requestRef.current = controller;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token || sessionRef.current !== id) return;
        const response = await supabase.functions.invoke('saqr-learning-narration', {
          headers: { Authorization: 'Bearer ' + session.access_token },
          body: { action: 'speak-question', storyId: stories[story].id, questionId: item.id,
            locale: isAr ? 'ar' : 'en', rate },
          signal: controller.signal
        });
        if (sessionRef.current !== id) return;
        if (response.error || !(response.data instanceof Blob) || !response.data.size) throw new Error('QUESTION_AUDIO');
        const mp3 = new Blob([response.data], { type: 'audio/mpeg' });
        const audio = audioRef.current || new Audio();
        audioRef.current = audio;
        if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = URL.createObjectURL(mp3);
        audio.src = audioUrlRef.current;
        audio.onended = () => { if (sessionRef.current === id) setState('idle'); };
        audio.onerror = () => { if (sessionRef.current === id) setState('idle'); };
        await audio.play();
      } catch {
        if (sessionRef.current === id) {
          setState('idle');
          setError(isAr ? 'يمكنك قراءة السؤال على الشاشة أو الضغط على «اسمع السؤال».' :
            'You can read the question or tap Listen to question.');
        }
      } finally {
        if (requestRef.current === controller) requestRef.current = null;
      }
      return;
    }
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setState('idle');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(prompt);
    utterance.lang = locale;
    utterance.rate = rate;
    const preferred = matchedVoices.find(v => v.voiceURI === voiceURI) || matchedVoices[0];
    if (preferred) utterance.voice = preferred;
    utterance.onend = () => { if (sessionRef.current === id) setState('idle'); };
    utterance.onerror = () => { if (sessionRef.current === id) setState('idle'); };
    window.speechSynthesis.speak(utterance);
  };

  const afterLine = (index: number, id: number, continueReading: (next: number) => void) => {
    if (sessionRef.current !== id) return;
    setNextIndex(index + 1);
    const checkpoint = storyQuestions.find(q => q.afterLine === index && !answeredRef.current.has(q.id));
    if (checkpoint) {
      setQuestionId(checkpoint.id);
      setChoice(null);
      setError('');
      void speakQuestion(checkpoint, id);
      return;
    }
    continueReading(index + 1);
  };

  const replayQuestion = () => {
    if (!question) return;
    stop();
    const id = ++sessionRef.current;
    setError('');
    void speakQuestion(question, id);
  };

  const chooseAnswer = (index: number) => {
    if (!question || correct) return;
    setChoice(index);
    if (index === question.correctIndex) {
      if (!answeredRef.current.has(question.id)) {
        answeredRef.current.add(question.id);
        setAnsweredCount(answeredRef.current.size);
      }
      stop();
      setError('');
    }
  };

  const changeDifficulty = (next: 'gentle' | 'explorer') => {
    resetProgress();
    setDifficulty(next);
  };

  const playAzure = async (startAt = 0) => {
    stop();
    setError('');
    setFinished(false);
    const id = ++sessionRef.current;
    const audio = new Audio();
    audioRef.current = audio;
    const readLine = async (index: number): Promise<void> => {
      if (sessionRef.current !== id) return;
      if (index >= lines.length) {
        stop();
        setFinished(true);
        setNextIndex(lines.length);
        return;
      }
      setCurrentLine(index);
      setNextIndex(index);
      setState('playing');
      const controller = new AbortController();
      requestRef.current = controller;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token || sessionRef.current !== id) throw new Error('NO_SESSION');
        const response = await supabase.functions.invoke('saqr-learning-narration', {
          headers: { Authorization: 'Bearer ' + session.access_token },
          body: {
            action: 'speak', storyId: stories[story].id, lineIndex: index,
            locale: isAr ? 'ar' : 'en', rate
          },
          signal: controller.signal
        });
        if (sessionRef.current !== id) return;
        if (response.error || !(response.data instanceof Blob) || !response.data.size) throw new Error('SPEECH_ERROR');
        // The Edge Function sends MP3 bytes as octet-stream so functions.invoke returns a Blob.
        // Set the actual MP3 MIME type explicitly for Safari and other browser decoders.
        const mp3 = new Blob([response.data], { type: 'audio/mpeg' });
        if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = URL.createObjectURL(mp3);
        audio.src = audioUrlRef.current;
        audio.onended = () => { if (sessionRef.current === id) afterLine(index, id, next => { void readLine(next); }); };
        audio.onerror = () => {
          if (sessionRef.current !== id) return;
          setState('idle');
          setError(isAr ? 'تعذّر تشغيل المقطع الصوتي. يمكنك اختيار صوت الجهاز.' :
            'Audio could not be played. Try the device voice.');
        };
        try {
          await audio.play();
        } catch {
          if (sessionRef.current !== id) return;
          // Safari can block playback after a network fetch; a second direct user tap unlocks it.
          setState('paused');
          setError(isAr ? 'اضغط متابعة لتشغيل المقطع الصوتي على هذا الجهاز.' :
            'Tap Resume to allow audio playback on this device.');
        }
      } catch {
        if (sessionRef.current !== id) return;
        setState('idle');
        setCurrentLine(-1);
        setError(isAr ? 'صوت حمدان غير متاح حاليًا. اختر صوت الجهاز لمتابعة القراءة.' :
          'Azure narration is unavailable. Select the device voice to keep reading.');
      } finally {
        if (requestRef.current === controller) requestRef.current = null;
      }
    };
    void readLine(startAt);
  };

  const play = (startAt = 0) => {
    if (voiceSource === 'azure' && azureReady === 'ready') { void playAzure(startAt); return; }
    if (!available) return;
    stop();
    setError('');
    setFinished(false);
    const synth = window.speechSynthesis;
    const id = ++sessionRef.current;
    const matching = matchedVoices;
    const preferred = matching.find(v => v.voiceURI === voiceURI)
      || matching.find(v => /premium|enhanced|natural/i.test(v.name))
      || matching.find(v => v.lang.toLowerCase() === locale.toLowerCase())
      || matching[0];
    const speakLine = (index: number) => {
      if (id !== sessionRef.current) return;
      if (index >= lines.length) {
        setState('idle');
        setCurrentLine(-1);
        setNextIndex(lines.length);
        setFinished(true);
        return;
      }
      setCurrentLine(index);
      setNextIndex(index);
      const item = new SpeechSynthesisUtterance(lines[index]);
      item.lang = locale;
      item.rate = rate;
      item.pitch = 1;
      if (preferred) item.voice = preferred;
      item.onstart = () => { if (sessionRef.current === id) setState('playing'); };
      item.onend = () => afterLine(index, id, speakLine);
      item.onerror = event => {
        if (sessionRef.current !== id || event.error === 'canceled' || event.error === 'interrupted') return;
        setError(isAr ? 'تعذّر تشغيل الصوت. تأكد من تفعيل أصوات اللغة في إعدادات جهازك.' : 'Speech is unavailable. Check the voices installed on your device.');
        setState('idle');
        setCurrentLine(-1);
      };
      synth.speak(item);
    };
    // Must be called directly from the button interaction for iOS Safari audio unlock.
    speakLine(startAt);
  };

  const togglePause = () => {
    if (voiceSource === 'azure' && audioRef.current) {
      const audio = audioRef.current;
      if (state === 'paused') {
        void audio.play().then(() => { setState('playing'); setError(''); })
          .catch(() => setError(isAr ? 'تحقق من إعدادات صوت الجهاز واضغط متابعة مجددًا.' : 'Check your device audio settings and retry.'));
      } else if (state === 'playing') {
        audio.pause();
        setState('paused');
      }
      return;
    }
    if (!available) return;
    const synth = window.speechSynthesis;
    if (state === 'paused') {
      synth.resume();
      setState('playing');
    } else if (state === 'playing') {
      synth.pause();
      setState('paused');
    }
  };

  const changeStory = (next: number) => { resetProgress(); setStory(next); };
  const changeVoiceSource = (next: 'azure' | 'device') => {
    stop();
    setVoiceSource(next);
    setError('');
  };
  const changeRate = (next: number) => {
    stop();
    setRate(next);
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
        <button type="button" onClick={replayQuestion} className="min-h-12 rounded-xl border-2 border-emerald-300 bg-white dark:bg-slate-800 px-4 py-3 font-black text-emerald-800 dark:text-emerald-200 focus-visible:outline-4 focus-visible:outline-sky-400">
          {isAr ? 'اسمع السؤال مرة تانية' : 'Listen to the question again'}
        </button>
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
          <button type="button" disabled={voiceSource === 'azure' ? azureReady !== 'ready' : !available} onClick={() => play(nextIndex)}
            className="min-h-14 flex-1 sm:flex-none rounded-2xl bg-emerald-700 hover:bg-emerald-800 px-6 py-4 text-white text-base sm:text-lg font-black disabled:opacity-50 focus-visible:outline-4 focus-visible:outline-sky-400">
            {voiceSource === 'azure' && azureReady === 'ready'
              ? (isAr ? 'اسمع حكاية صقر بصوت حمدان' : 'Listen with Azure voice')
              : (isAr ? 'استمع للحكاية بصوت الجهاز' : 'Listen with device voice')}
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
      <div className="rounded-xl bg-white/80 dark:bg-slate-800 p-3 border border-emerald-200 dark:border-slate-700 space-y-2">
        <p className="text-sm font-black text-emerald-800 dark:text-emerald-200">{isAr ? 'اختر طريقة القراءة الصوتية' : 'Select narration source'}</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={azureReady !== 'ready'} aria-pressed={voiceSource === 'azure'}
            onClick={() => changeVoiceSource('azure')}
            className={'min-h-11 rounded-xl border-2 px-4 py-2.5 text-sm font-black disabled:opacity-60 ' +
              (voiceSource === 'azure' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white dark:bg-slate-900 border-emerald-300')}>
            {isAr ? 'حمدان الإماراتي · Azure' : 'Azure neural narration'}
          </button>
          <button type="button" disabled={!available} aria-pressed={voiceSource === 'device'}
            onClick={() => changeVoiceSource('device')}
            className={'min-h-11 rounded-xl border-2 px-4 py-2.5 text-sm font-black disabled:opacity-60 ' +
              (voiceSource === 'device' ? 'bg-sky-700 text-white border-sky-700' : 'bg-white dark:bg-slate-900 border-sky-300')}>
            {isAr ? 'صوت الجهاز' : 'Device voice'}
          </button>
        </div>
        {azureReady !== 'ready' && <p role="status" className="text-xs leading-6 text-amber-900 dark:text-amber-200">
          {isAr ? 'صوت حمدان الإماراتي غير مفعّل حاليًا؛ ستظل القراءة بصوت الجهاز متاحة.' :
            'Azure neural narration is not configured yet. The device voice remains available.'}
          {isAdmin && <span className="block font-semibold">{isAr ?
            'للإدارة: أضف AZURE_SPEECH_KEY وAZURE_SPEECH_REGION إلى أسرار Supabase لتفعيل صوت حمدان.' :
            'Admin: configure AZURE_SPEECH_KEY and AZURE_SPEECH_REGION in Supabase secrets to enable neural narration.'}</span>}
        </p>}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <label className="flex-1 text-sm font-black text-slate-700 dark:text-slate-200">
          {isAr ? 'سرعة القراءة' : 'Reading speed'}
          <select className="mt-1 w-full min-h-12 rounded-xl border border-emerald-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-slate-900 dark:text-white"
            value={rate} onChange={e => changeRate(Number(e.target.value))}>
            <option value={0.75}>{isAr ? 'بطيئة' : 'Slow'}</option>
            <option value={0.9}>{isAr ? 'هادئة' : 'Gentle'}</option>
            <option value={1}>{isAr ? 'طبيعية' : 'Normal'}</option>
            <option value={1.15}>{isAr ? 'أسرع' : 'Faster'}</option>
          </select>
        </label>
        {voiceSource === 'device' && <label className="flex-1 text-sm font-black text-slate-700 dark:text-slate-200">
          {isAr ? 'صوت الجهاز' : 'Device voice'}
          <select className="mt-1 w-full min-h-12 rounded-xl border border-emerald-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-slate-900 dark:text-white"
            value={matchedVoices.some(v => v.voiceURI === voiceURI) ? voiceURI : ''}
            onChange={e => { stop(); setVoiceURI(e.target.value); }}>
            <option value="">{isAr ? 'اختيار تلقائي' : 'Automatic selection'}</option>
            {matchedVoices.map(v => <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>)}
          </select>
        </label>}
      </div>
      {!available && voiceSource === 'device' && <p role="alert" className="font-bold text-amber-800 dark:text-amber-200">{isAr ? 'المتصفح لا يوفر القراءة الصوتية. يمكنك قراءة النص أو تجربة متصفح يدعم الأصوات.' : 'Speech is not available in this browser. The text remains readable.'}</p>}
      {error && <p role="alert" className="font-bold text-rose-700 dark:text-rose-300">{error}</p>}
      <p className="text-xs leading-6 text-slate-600 dark:text-slate-300">
        {voiceSource === 'azure' && azureReady === 'ready'
          ? (isAr ? 'القراءة العربية بصوت حمدان الإماراتي (Microsoft Azure). تُرسل جمل القصص التعليمية فقط إلى Azure، ولا تُرسل بيانات الطالب أو تشخيصه.' :
            'English narration uses an Azure English voice. Only the public story sentence is sent to Azure, never a child profile.')
          : (isAr ? 'يستخدم صوت الجهاز المتاح. جودة الصوت تختلف حسب المتصفح. تتظلل الجملة أثناء نطقها.' :
            'Uses an available device voice. Quality varies by browser. The sentence is highlighted while it is spoken.')}
      </p>
    </div>
  </div>;
}
