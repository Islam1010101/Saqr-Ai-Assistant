import React, { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { learningStories } from '../../../supabase/functions/saqr-learning-narration/stories';

type ReadTogetherProps = { isAr: boolean; large: boolean; quiet: boolean; isAdmin?: boolean };
const stories = learningStories;

export default function ReadTogether({ isAr, large, quiet, isAdmin = false }: ReadTogetherProps) {
  const [story, setStory] = useState(0);
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
  }, [isAr, stop]);

  useEffect(() => () => {
    requestRef.current?.abort();
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.removeAttribute('src'); }
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
  }, []);

  const playAzure = async (startAt = 0) => {
    stop();
    setError('');
    const id = ++sessionRef.current;
    const audio = new Audio();
    audioRef.current = audio;
    const readLine = async (index: number): Promise<void> => {
      if (sessionRef.current !== id) return;
      if (index >= lines.length) {
        stop();
        return;
      }
      setCurrentLine(index);
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
        if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = URL.createObjectURL(response.data);
        audio.src = audioUrlRef.current;
        audio.onended = () => { if (sessionRef.current === id) void readLine(index + 1); };
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
        return;
      }
      setCurrentLine(index);
      const item = new SpeechSynthesisUtterance(lines[index]);
      item.lang = locale;
      item.rate = rate;
      item.pitch = 1;
      if (preferred) item.voice = preferred;
      item.onstart = () => { if (sessionRef.current === id) setState('playing'); };
      item.onend = () => speakLine(index + 1);
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

  const changeStory = (next: number) => { stop(); setStory(next); setError(''); };
  const changeVoiceSource = (next: 'azure' | 'device') => {
    stop();
    setVoiceSource(next);
    setError('');
  };
  const changeRate = (next: number) => {
    stop();
    setRate(next);
  };

  return <div className="space-y-5">
    <div className="flex flex-wrap gap-2">
      {stories.map((s, index) => <button key={index} type="button" onClick={() => changeStory(index)}
        aria-pressed={index === story}
        className={'min-h-12 rounded-xl border-2 px-4 py-2.5 font-black transition-colors focus-visible:outline-4 focus-visible:outline-sky-400 ' +
          (index === story ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white dark:bg-slate-800 border-emerald-200 dark:border-slate-600 text-slate-800 dark:text-white')}>
        {isAr ? s.titleAr : s.titleEn}
      </button>)}
    </div>
    <div className={'rounded-[1.7rem] border-2 border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-950 p-5 sm:p-8 shadow-inner ' +
      (quiet ? 'space-y-4' : 'space-y-5')}>
      <p className="text-xs font-black tracking-wide text-emerald-700 dark:text-emerald-300">{isAr ? 'حكاية اليوم' : "Today's story"}</p>
      <h3 className="text-xl sm:text-2xl font-black">{isAr ? stories[story].titleAr : stories[story].titleEn}</h3>
      <div className="space-y-3" aria-label={isAr ? 'نص القصة' : 'Story text'}>
        {lines.map((line, index) => <p key={index} className={'rounded-xl px-3 py-2 font-bold transition-colors ' +
          (large ? 'text-2xl sm:text-3xl leading-[2.15] ' : 'text-lg sm:text-xl leading-[2] ') +
          (currentLine === index ? 'bg-amber-200 text-slate-950 dark:bg-amber-300' : 'text-slate-800 dark:text-slate-100')}>
          {line}
        </p>)}
      </div>
    </div>
    <div className="rounded-2xl bg-emerald-50 dark:bg-slate-900 p-4 sm:p-5 border border-emerald-100 dark:border-emerald-800 space-y-3">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <button type="button" disabled={voiceSource === 'azure' ? azureReady !== 'ready' : !available} onClick={() => play()}
          className="min-h-12 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-5 py-3 text-white font-black disabled:opacity-50 focus-visible:outline-4 focus-visible:outline-sky-400">
          {voiceSource === 'azure' && azureReady === 'ready' ? (isAr ? 'استمع بصوت حمدان' : 'Listen with Azure voice') : (isAr ? 'استمع بصوت الجهاز' : 'Read aloud with device voice')}
        </button>
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
