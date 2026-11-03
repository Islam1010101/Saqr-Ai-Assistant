import React, { useCallback, useEffect, useRef, useState } from 'react';

type ReadTogetherProps = { isAr: boolean; large: boolean; quiet: boolean };
const stories = [
  {
    titleAr: 'صقر والكتاب الجديد', titleEn: 'Saqr and the new book',
    ar: [
      'في صباح جميل، دخل صقر إلى المكتبة.',
      'اختار كتابًا ملوّنًا وجلس في مكان هادئ.',
      'فتح الصفحة الأولى وقرأ قصة عن الصداقة.',
      'ابتسم صقر وقال: كل كتاب يحمل مغامرة جديدة.'
    ],
    en: [
      'On a sunny morning, Saqr visited the library.',
      'He chose a colorful book and sat in a quiet place.',
      'He opened the first page and read a story about friendship.',
      'Saqr smiled. Every book has a new adventure.'
    ]
  },
  {
    titleAr: 'الشجرة الصغيرة', titleEn: 'The little tree',
    ar: [
      'زرعت ليلى بذرة صغيرة في حديقة المدرسة.',
      'سقتها بالماء كل صباح واعتنت بها.',
      'كبرت البذرة وأصبحت شجرة خضراء.',
      'فرحت ليلى عندما رأت طائرًا فوق أغصانها.'
    ],
    en: [
      'Layla planted a tiny seed in the school garden.',
      'She gave it water and cared for it every morning.',
      'The seed grew into a beautiful green tree.',
      'Layla smiled when a bird rested on its branches.'
    ]
  }
];

export default function ReadTogether({ isAr, large, quiet }: ReadTogetherProps) {
  const [story, setStory] = useState(0);
  const [rate, setRate] = useState(0.9);
  const [voiceURI, setVoiceURI] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [available, setAvailable] = useState(false);
  const [state, setState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [currentLine, setCurrentLine] = useState(-1);
  const [error, setError] = useState('');
  const sessionRef = useRef(0);
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

  const stop = useCallback(() => {
    sessionRef.current += 1;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setState('idle');
    setCurrentLine(-1);
  }, []);

  useEffect(() => {
    stop();
    setVoiceURI('');
  }, [isAr, stop]);

  const play = (startAt = 0) => {
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
        <button type="button" disabled={!available} onClick={() => play()}
          className="min-h-12 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-5 py-3 text-white font-black disabled:opacity-50 focus-visible:outline-4 focus-visible:outline-sky-400">
          {isAr ? 'استمع للقصة' : 'Read aloud'}
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
        <label className="flex-1 text-sm font-black text-slate-700 dark:text-slate-200">
          {isAr ? 'صوت القراءة' : 'Reading voice'}
          <select className="mt-1 w-full min-h-12 rounded-xl border border-emerald-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-slate-900 dark:text-white"
            value={matchedVoices.some(v => v.voiceURI === voiceURI) ? voiceURI : ''}
            onChange={e => { stop(); setVoiceURI(e.target.value); }}>
            <option value="">{isAr ? 'اختيار تلقائي' : 'Automatic selection'}</option>
            {matchedVoices.map(v => <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>)}
          </select>
        </label>
      </div>
      {!available && <p role="alert" className="font-bold text-amber-800 dark:text-amber-200">{isAr ? 'المتصفح لا يوفر القراءة الصوتية. يمكنك قراءة النص أو تجربة متصفح يدعم الأصوات.' : 'Speech is not available in this browser. The text remains readable.'}</p>}
      {error && <p role="alert" className="font-bold text-rose-700 dark:text-rose-300">{error}</p>}
      <p className="text-xs leading-6 text-slate-600 dark:text-slate-300">
        {isAr ? 'تستخدم القراءة أصوات المتصفح أو الجهاز. تختلف جودة الصوت، وقد يعتمد بعض الأصوات على خدمات النظام. تتظلل الجملة أثناء نطقها.' :
          'Uses the browser or device voices. Quality varies, and some voices may rely on the device's online services. Each spoken sentence is highlighted.'}
      </p>
    </div>
  </div>;
}
