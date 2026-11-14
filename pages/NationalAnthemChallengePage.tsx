import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useLanguage } from '../App';
import { canAccessNationalIdentity } from '../src/utils/nationalIdentityAccess';
import { recordingToMp3 } from '../src/utils/podcastMp3';
import './nationalHeritageTheme.css';
import './nationalIdentityLanding.css';
import './nationalAnthemChallenge.css';

const COMMONS_AUDIO = 'https://upload.wikimedia.org/wikipedia/commons/transcoded/9/92/UAE_national_anthem.ogg/UAE_national_anthem.ogg.mp3';
const COMMONS_OGG_FALLBACK = 'https://upload.wikimedia.org/wikipedia/commons/9/92/UAE_national_anthem.ogg';
const COMMONS_SOURCE = 'https://commons.wikimedia.org/wiki/File:UAE_national_anthem.ogg';
const OFFICIAL_ANTHEM = 'https://www.protocol.dubai.ae/ar/protocols-listing/protocols/translation-of-uae-national-anthem/';
const MAX_SECONDS = 150;
const MAX_BYTES = 20 * 1024 * 1024;
type Status = 'loading' | 'ready' | 'recording' | 'encoding' | 'complete' | 'error';

const formatTime = (seconds: number) => {
  const n = Math.max(0, Math.floor(seconds));
  return Math.floor(n / 60) + ':' + String(n % 60).padStart(2, '0');
};

const getAudioContext = () => {
  const Context = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Context) throw new Error('WEB_AUDIO_UNSUPPORTED');
  return new Context();
};

const prepareBuffer = async (bytes: ArrayBuffer): Promise<AudioBuffer> => {
  if (!bytes.byteLength || bytes.byteLength > MAX_BYTES) throw new Error('AUDIO_SIZE');
  const ctx = getAudioContext();
  try {
    const buffer = await ctx.decodeAudioData(bytes.slice(0));
    if (!buffer.duration || buffer.duration > MAX_SECONDS) throw new Error('AUDIO_DURATION');
    return buffer;
  } finally {
    await ctx.close().catch(() => undefined);
  }
};

const MicrophoneIcon = ({ className = 'h-6 w-6' }: { className?: string }) =>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
    <rect x="9" y="2.5" width="6" height="12" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3.5m-4 0h8"/>
  </svg>;

export default function NationalAnthemChallengePage() {
  const { locale, dir } = useLanguage();
  const ar = locale === 'ar';
  const t = (arabic: string, english: string) => ar ? arabic : english;
  const [allowed] = useState(() => {
    try {
      return canAccessNationalIdentity(
        localStorage.getItem('user_type'),
        JSON.parse(localStorage.getItem('current_user') || 'null')
      );
    } catch { return false; }
  });

  const [status, setStatus] = useState<Status>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [trackLabel, setTrackLabel] = useState(t('الموسيقى الآلية للنشيد', 'Instrumental anthem'));
  const [previewUrl, setPreviewUrl] = useState(COMMONS_AUDIO);
  const [trackSeconds, setTrackSeconds] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [musicVolume, setMusicVolume] = useState(0.62);
  const [voiceVolume, setVoiceVolume] = useState(1);
  const [mp3Url, setMp3Url] = useState<string | null>(null);

  const audioBuffer = useRef<AudioBuffer | null>(null);
  const fileUrl = useRef<string | null>(null);
  const resultUrl = useRef<string | null>(null);
  const preview = useRef<HTMLAudioElement | null>(null);
  const microphone = useRef<MediaStream | null>(null);
  const context = useRef<AudioContext | null>(null);
  const player = useRef<AudioBufferSourceNode | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const progressTimer = useRef<number | null>(null);
  const loadVersion = useRef(0);
  const mounted = useRef(true);
  const discard = useRef(false);
  const busy = useRef(false);

  const message = (code: string) => {
    if (code === 'AUDIO_SIZE') return t('الملف الصوتي كبير أو فارغ. الحد الأقصى 20 ميجابايت.', 'Audio is empty or exceeds 20 MB.');
    if (code === 'AUDIO_DURATION') return t('اختَر مقطعًا موسيقيًا لا يزيد على دقيقتين ونصف.', 'Choose an instrumental track under 2.5 minutes.');
    if (code === 'WEB_AUDIO_UNSUPPORTED') return t('هذا المتصفح لا يدعم معالجة الصوت. جرّب Safari أو Chrome حديثًا.', 'Your browser cannot process audio. Try a recent Safari or Chrome.');
    if (code === 'NotAllowedError') return t('اسمح للمتصفح باستخدام الميكروفون ثم أعد المحاولة.', 'Allow microphone access in your browser and try again.');
    if (code === 'NotFoundError') return t('لم يتم العثور على ميكروفون. وصّل ميكروفونًا أو استخدم هاتفك.', 'No microphone found. Connect one or use a mobile device.');
    if (code === 'RECORDER_UNSUPPORTED') return t('تسجيل الصوت غير مدعوم على هذا المتصفح. حدّث المتصفح وجرّب مجددًا.', 'This browser does not support recording. Update it and try again.');
    if (code === 'EMPTY_RECORDING') return t('لم يتم حفظ صوت. جرّب التسجيل مجددًا.', 'No audio was captured. Please try recording again.');
    return t('تعذرت معالجة الصوت. جرّب ملف موسيقى آخر أو متصفحًا حديثًا.', 'Could not process audio. Try another music file or a recent browser.');
  };

  const releaseSession = () => {
    if (progressTimer.current !== null) window.clearInterval(progressTimer.current);
    progressTimer.current = null;
    microphone.current?.getTracks().forEach(track => track.stop());
    microphone.current = null;
    if (player.current) {
      player.current.onended = null;
      try { player.current.stop(); } catch { /* Already ended. */ }
      try { player.current.disconnect(); } catch { /* Already disconnected. */ }
      player.current = null;
    }
    const ctx = context.current;
    context.current = null;
    if (ctx) void ctx.close().catch(() => undefined);
  };

  const stopRecording = () => {
    if (!busy.current) return;
    busy.current = false;
    if (progressTimer.current !== null) window.clearInterval(progressTimer.current);
    progressTimer.current = null;
    const activeRecorder = recorder.current;
    if (activeRecorder && activeRecorder.state !== 'inactive') {
      setStatus('encoding');
      try { activeRecorder.stop(); } catch { releaseSession(); setStatus('error'); setErrorMessage(message('RECORDER_UNSUPPORTED')); }
    } else {
      releaseSession();
    }
  };

  useEffect(() => {
    mounted.current = true;
    const version = ++loadVersion.current;
    if (allowed) {
      // MP3 transcode works on Safari/iOS; OGG is a fallback for other browsers.
      const load = async () => {
        for (const url of [COMMONS_AUDIO, COMMONS_OGG_FALLBACK]) {
          try {
            const response = await fetch(url, { mode: 'cors', cache: 'force-cache' });
            if (!response.ok) continue;
            const decoded = await prepareBuffer(await response.arrayBuffer());
            if (!mounted.current || loadVersion.current !== version) return;
            audioBuffer.current = decoded;
            setPreviewUrl(url);
            setTrackSeconds(decoded.duration);
            setStatus('ready');
            return;
          } catch { /* Try the second Commons format. */ }
        }
        if (!mounted.current || loadVersion.current !== version) return;
        audioBuffer.current = null;
        setStatus('error');
        setErrorMessage(t(
          'تعذر تحميل المقطوعة تلقائيًا. يمكنك اختيار ملف موسيقى النشيد من جهازك.',
          'Could not load the instrumental track. Choose an anthem music file from your device.'
        ));
      };
      void load();
    }
    return () => {
      mounted.current = false;
      loadVersion.current++;
      discard.current = true;
      busy.current = false;
      if (recorder.current && recorder.current.state !== 'inactive') {
        try { recorder.current.stop(); } catch { /* Cleanup only. */ }
      }
      releaseSession();
      if (fileUrl.current) URL.revokeObjectURL(fileUrl.current);
      if (resultUrl.current) URL.revokeObjectURL(resultUrl.current);
    };
  }, [allowed]);

  const chooseMusic = async (file?: File) => {
    if (!file || busy.current || status === 'encoding') return;
    const version = ++loadVersion.current;
    setStatus('loading');
    setErrorMessage('');
    try {
      const decoded = await prepareBuffer(await file.arrayBuffer());
      if (!mounted.current || loadVersion.current !== version) return;
      if (fileUrl.current) URL.revokeObjectURL(fileUrl.current);
      const url = URL.createObjectURL(file);
      fileUrl.current = url;
      audioBuffer.current = decoded;
      setPreviewUrl(url);
      setTrackLabel(file.name.slice(0, 85));
      setTrackSeconds(decoded.duration);
      setElapsed(0);
      setStatus('ready');
    } catch (err) {
      if (!mounted.current || loadVersion.current !== version) return;
      setStatus('error');
      setErrorMessage(message(err instanceof Error ? err.message : 'AUDIO_UNREADABLE'));
    }
  };

  const startRecording = async () => {
    if (busy.current || !audioBuffer.current || status === 'loading' || status === 'encoding') return;
    discard.current = false;
    busy.current = true;
    setErrorMessage('');
    preview.current?.pause();
    setElapsed(0);
    if (resultUrl.current) {
      URL.revokeObjectURL(resultUrl.current);
      resultUrl.current = null;
      setMp3Url(null);
    }
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined')
        throw new Error('RECORDER_UNSUPPORTED');
      const ctx = getAudioContext();
      context.current = ctx;
      // Resume from the user click: mobile Safari otherwise leaves the audio graph suspended.
      await ctx.resume();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false }
      });
      microphone.current = stream;
      if (!mounted.current) { releaseSession(); return; }

      const mixed = ctx.createMediaStreamDestination();
      const voice = ctx.createMediaStreamSource(stream);
      const micGain = ctx.createGain();
      micGain.gain.value = voiceVolume;
      voice.connect(micGain);
      micGain.connect(mixed);

      const music = ctx.createBufferSource();
      music.buffer = audioBuffer.current;
      const backingGain = ctx.createGain();
      backingGain.gain.value = musicVolume;
      music.connect(backingGain);
      backingGain.connect(mixed);
      // Only the music goes to the speakers; the microphone never feeds back.
      backingGain.connect(ctx.destination);
      player.current = music;

      const supported = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg;codecs=opus']
        .find(type => MediaRecorder.isTypeSupported(type));
      const media = new MediaRecorder(mixed.stream, supported ? { mimeType: supported } : undefined);
      recorder.current = media;
      const chunks: BlobPart[] = [];
      media.ondataavailable = event => { if (event.data?.size) chunks.push(event.data); };
      media.onerror = () => {
        discard.current = true;
        stopRecording();
        if (mounted.current) { setStatus('error'); setErrorMessage(message('RECORDER_UNSUPPORTED')); }
      };
      media.onstop = async () => {
        const skipped = discard.current || !mounted.current;
        releaseSession();
        recorder.current = null;
        busy.current = false;
        if (skipped) return;
        const captured = new Blob(chunks, { type: media.mimeType || 'audio/webm' });
        if (!captured.size) {
          setStatus('error');
          setErrorMessage(message('EMPTY_RECORDING'));
          return;
        }
        setStatus('encoding');
        try {
          // Actual MP3 transcoding: voice + backing soundtrack were recorded as one mix.
          const mp3 = await recordingToMp3(captured);
          if (!mounted.current) return;
          const url = URL.createObjectURL(mp3);
          resultUrl.current = url;
          setMp3Url(url);
          setStatus('complete');
        } catch {
          if (!mounted.current) return;
          setStatus('error');
          setErrorMessage(t('فشل تحويل التسجيل إلى MP3. جرّب متصفحًا حديثًا أو جهازًا آخر.', 'MP3 conversion failed. Try an updated browser or another device.'));
        }
      };
      media.start(250);
      const startAt = ctx.currentTime + 0.12;
      music.start(startAt);
      music.onended = () => {
        if (busy.current) stopRecording();
      };
      setStatus('recording');
      progressTimer.current = window.setInterval(() => {
        if (!mounted.current) return;
        setElapsed(Math.min(audioBuffer.current?.duration || 0, Math.max(0, ctx.currentTime - startAt)));
      }, 300);
    } catch (err) {
      discard.current = true;
      if (recorder.current?.state === 'recording') {
        try { recorder.current.stop(); } catch { /* Cleanup only. */ }
      }
      busy.current = false;
      releaseSession();
      if (!mounted.current) return;
      setStatus('error');
      setErrorMessage(message(err instanceof Error ? (err.name === 'NotAllowedError' || err.name === 'NotFoundError' ? err.name : err.message) : 'RECORDER_UNSUPPORTED'));
    }
  };

  if (!allowed) return <Navigate to="/home" replace />;

  const canRecord = !!audioBuffer.current && ['ready', 'complete', 'error'].includes(status);
  const busyRecording = status === 'recording';
  const busyProcessing = status === 'loading' || status === 'encoding';
  const ratio = trackSeconds ? Math.min(100, Math.max(0, elapsed / trackSeconds * 100)) : 0;
  const userName = (() => {
    try {
      const user = JSON.parse(localStorage.getItem('current_user') || '{}');
      return String(user?.name_ar || user?.name_en || user?.student_name || '').trim().slice(0, 70);
    } catch { return ''; }
  })();

  return <main dir={dir} className="national-heritage nh-v2 nh-anthem-page relative min-h-[100dvh] overflow-hidden bg-[#f8fafc] dark:bg-[#061912] text-slate-900 dark:text-white">
    <div className="nh-v2-shell relative mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-6 sm:pt-8 lg:px-8">
      <nav className="nh-v2-nav relative z-10 mb-6 flex flex-wrap items-center justify-between gap-3" aria-label={t('التنقل','Navigation')}>
        <Link to="/saqr-national-identity" className="nh-v2-back inline-flex min-h-11 items-center gap-2 rounded-2xl border border-emerald-200 bg-white/95 px-4 py-2.5 text-sm font-black text-emerald-800 shadow-sm transition hover:border-emerald-400 hover:shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-emerald-200">
          <svg className={`h-4 w-4 ${ar ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5m7-7-7 7 7 7"/></svg>
          {t('العودة لتحديات الهوية الوطنية','Back to National Identity')}
        </Link>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-100">
          <img src="/school-logo.png" alt="EFIPS" className="h-9 w-9 object-contain"/>
          <span>{t('مكتبة مدرسة صقر الإمارات','EFIPS School Library')}</span>
        </div>
      </nav>

      <section className="nh-hero nh-v2-hero nh-anthem-hero relative overflow-hidden text-white" aria-labelledby="anthem-challenge-heading">
        <div className="absolute inset-x-0 top-0 z-10 flex h-2 overflow-hidden" aria-hidden="true">
          <span className="w-1/4 bg-[#e83142]"/><span className="w-1/4 bg-[#078b4c]"/><span className="w-1/4 bg-white"/><span className="w-1/4 bg-[#131b1d]"/>
        </div>
        <div className="nh-v2-hero-grid nh-anthem-hero-grid relative grid items-center">
          <div className="nh-v2-hero-copy relative z-10 min-w-0">
            <p className="nh-v2-hero-kicker">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true"><path d="M5 3v18M5 4h14l-3 5 3 5H5"/></svg>
              {t('صقر وهوية وطن · تحدي وطني','SAQR & NATIONAL IDENTITY · NATIONAL CHALLENGE')}
            </p>
            <h1 id="anthem-challenge-heading" className="nh-v2-hero-heading font-black">{t('تحدي صوت الاتحاد','Voice of the Union')}</h1>
            <p className="nh-v2-hero-description font-semibold">
              {t('خلّ صوتك يعبّر عن حب الإمارات! غنِّ النشيد الوطني مع موسيقاه، سجّل أداءك واحتفظ به بصيغة MP3.','Let your voice celebrate the UAE! Sing along with the national anthem, record your performance and save it as an MP3.')}
            </p>
            {userName && <p className="mt-4 text-sm font-black text-amber-100">{t('جاهز تغنّي يا ','Ready to sing, ')}{userName}{t('؟','?')}</p>}
            <div className="nh-anthem-steps mt-6 flex flex-wrap gap-2.5" aria-label={t('مراحل التحدي','Challenge stages')}>
              <span>{t('استمع','Listen')}</span><span>{t('غنِّ','Sing')}</span><span>{t('سجّل','Record')}</span><span>{t('حمّل MP3','Save MP3')}</span>
            </div>
          </div>
          <div className="nh-hero-art nh-v2-hero-art nh-anthem-hero-art relative flex justify-center" role="img" aria-label={t('صقر يغنّي النشيد الوطني بسماعات وميكروفون','Saqr singing the anthem with headphones and microphone')}>
            <span className="nh-v2-art-glow" aria-hidden="true"/>
            <span className="nh-v2-art-orbit" aria-hidden="true"/>
            <span className="nh-v2-art-orbit nh-v2-art-orbit--inner" aria-hidden="true"/>
            <span className="nh-v2-symbol nh-v2-symbol--flag" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 21V3m0 2c5-3 9 3 14 0v11c-5 3-9-3-14 0"/></svg>
            </span>
            <span className="nh-v2-symbol nh-v2-symbol--compass" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 18V6l11-2v12M9 9l11-2"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/></svg>
            </span>
            <span className="nh-v2-symbol nh-v2-symbol--star" aria-hidden="true">
              <MicrophoneIcon className="h-8 w-8"/>
            </span>
            <img src="/SAQR%20Singer.png" alt="" className="nh-saqr nh-v2-character nh-anthem-singer" decoding="async" fetchPriority="high"/>
          </div>
        </div>
      </section>

      <div className="nh-anthem-workspace mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(255px,.75fr)]">
        <section className="nh-anthem-panel min-w-0 rounded-[1.85rem] border-2 border-emerald-200 bg-white p-5 shadow-xl dark:border-emerald-900 dark:bg-[#0b2a22] sm:p-8" aria-labelledby="anthem-recorder-heading">
          <div className="mb-4 flex items-center gap-3">
            <span className="nh-anthem-title-icon"><MicrophoneIcon className="h-6 w-6"/></span>
            <div>
              <p className="text-xs font-black tracking-wide text-amber-700 dark:text-amber-300">{t('رحلتك تبدأ هنا','YOUR STUDIO')}</p>
              <h2 id="anthem-recorder-heading" className="text-xl font-black text-emerald-900 dark:text-emerald-100 sm:text-2xl">{t('استديو تسجيل النشيد','Anthem recording studio')}</h2>
            </div>
          </div>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {t('استمع إلى الموسيقى أولًا، ثم اضغط «ابدأ الغناء». يبدأ تسجيل صوتك مع الموسيقى في ملف واحد.','Preview the music, then select Start singing. Your voice and the backing track will be recorded together.')}
          </p>

          <div className="nh-anthem-audio-card mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-800 dark:bg-emerald-950/50">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <strong className="text-sm font-black text-emerald-900 dark:text-emerald-100">{trackLabel}</strong>
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">{formatTime(trackSeconds)}</span>
            </div>
            <audio ref={preview} src={previewUrl} controls preload="none" className="mt-4 w-full" aria-label={t('استمع إلى موسيقى النشيد','Preview instrumental anthem')}/>
            <div className="mt-3">
              <label htmlFor="anthem-backing-file" className="inline-flex cursor-pointer items-center rounded-xl border border-emerald-500/40 bg-white px-4 py-2.5 text-xs font-black text-emerald-800 dark:bg-slate-900 dark:text-emerald-100">
                {t('استخدام ملف موسيقى آخر من الجهاز','Use a different music file')}
              </label>
              <input id="anthem-backing-file" type="file" accept="audio/*,.mp3,.ogg,.wav,.m4a,.aac" className="sr-only"
                disabled={busyRecording || status === 'encoding'} onChange={event => {
                  void chooseMusic(event.target.files?.[0]);
                  event.currentTarget.value = '';
                }}/>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-black text-slate-700 dark:text-emerald-100">
              {t('مستوى صوت الموسيقى','Backing music volume')} <span className="tabular-nums">{Math.round(musicVolume * 100)}%</span>
              <input type="range" min="0.15" max="1" step="0.05" value={musicVolume} onChange={event => setMusicVolume(Number(event.target.value))} disabled={busyRecording || busyProcessing} className="mt-3 w-full accent-emerald-700"/>
            </label>
            <label className="block text-sm font-black text-slate-700 dark:text-emerald-100">
              {t('مستوى صوت الغناء','Singing volume')} <span className="tabular-nums">{Math.round(voiceVolume * 100)}%</span>
              <input type="range" min="0.5" max="1.6" step="0.1" value={voiceVolume} onChange={event => setVoiceVolume(Number(event.target.value))} disabled={busyRecording || busyProcessing} className="mt-3 w-full accent-emerald-700"/>
            </label>
          </div>

          <div className="nh-anthem-progress mt-7 rounded-2xl border border-emerald-200 bg-[#f8fbf9] p-4 dark:border-emerald-900 dark:bg-[#071e18]">
            <div className="flex min-w-0 items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2 text-sm font-black text-emerald-950 dark:text-emerald-100">
                <span className="nh-anthem-equalizer" data-active={busyRecording} aria-hidden="true"><i/><i/><i/><i/></span>
                {busyRecording ? t('يتم تسجيل غنائك الآن','Recording your singing') : t('جاهز للتسجيل','Ready to record')}
              </span>
              <span className="shrink-0 text-sm font-black tabular-nums text-emerald-800 dark:text-emerald-200">{formatTime(elapsed)} / {formatTime(trackSeconds)}</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-950" role="progressbar" aria-label={t('تقدم التسجيل','Recording progress')} aria-valuenow={Math.round(ratio)} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-600 via-amber-400 to-red-500 transition-transform duration-300" style={{ transform: 'scaleX(' + ratio / 100 + ')', transformOrigin: ar ? 'right center' : 'left center' }}/>
            </div>
          </div>

          <div className="nh-anthem-actionbar mt-6 flex flex-wrap gap-3">
            {busyRecording
              ? <button type="button" onClick={stopRecording} className="nh-anthem-action inline-flex min-h-12 items-center gap-2 rounded-xl bg-rose-700 px-6 py-3 text-sm font-black text-white hover:bg-rose-800">
                <span aria-hidden="true" className="h-3 w-3 rounded-sm bg-white"/>{t('إنهاء التسجيل','Finish recording')}
                </button>
              : <button type="button" onClick={() => void startRecording()} disabled={!canRecord || busyProcessing}
                  className="nh-anthem-action inline-flex min-h-12 items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-black text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50">
                  <MicrophoneIcon className="h-5 w-5"/>{status === 'loading' ? t('تحميل الموسيقى…','Loading music…') : t('ابدأ الغناء والتسجيل','Start singing and recording')}
                </button>
            }
            {status === 'encoding' && <span className="self-center text-sm font-black text-emerald-800 dark:text-emerald-200" role="status">{t('جاري تجهيز ملف MP3…','Preparing your MP3…')}</span>}
          </div>

          {status === 'recording' && <p role="status" aria-live="polite" className="mt-4 text-sm font-bold text-rose-700 dark:text-rose-300">{t('تسجيل جارٍ. سينتهي تلقائيًا عند انتهاء الموسيقى.','Recording in progress. It will finish automatically with the music.')}</p>}
          {errorMessage && <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold leading-7 text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">{errorMessage}</p>}

          {status === 'complete' && mp3Url && <div className="mt-7 rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-5 dark:bg-emerald-950/50" role="status">
            <h3 className="text-lg font-black text-emerald-950 dark:text-emerald-100">{t('أحسنت! تسجيلك جاهز','Well done! Your recording is ready')}</h3>
            <p className="mt-2 text-sm text-emerald-900 dark:text-emerald-100">{t('استمع لصوتك مع الموسيقى، أو احتفظ بملف MP3 على جهازك.','Listen to your voice with the music, or save the MP3 to your device.')}</p>
            <audio controls src={mp3Url} className="mt-4 w-full" aria-label={t('استمع إلى تسجيلك','Listen to your recording')}/>
            <a href={mp3Url} download="EFIPS-Voice-of-the-Union.mp3"
              className="nh-anthem-download mt-4 inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-700 px-6 py-3 text-sm font-black text-white hover:bg-emerald-800">
              {t('تحميل تسجيلك بصيغة MP3','Download your MP3')}
            </a>
          </div>}
        </section>

        <aside className="nh-anthem-aside space-y-5">
          <section className="nh-anthem-guide rounded-[1.7rem] border-2 border-amber-200 bg-amber-50 p-5 shadow-md dark:border-amber-900 dark:bg-amber-950/30">
            <h2 className="font-black text-amber-950 dark:text-amber-100">{t('خطوات التحدي','Challenge steps')}</h2>
            <ol className="mt-4 list-inside list-decimal space-y-3 text-sm font-semibold leading-7 text-amber-950 dark:text-amber-100">
              <li>{t('استخدم سماعات الرأس للحصول على تسجيل أوضح.','Use headphones for a cleaner recording.')}</li>
              <li>{t('استمع إلى الموسيقى وتدرّب على النشيد.','Preview the backing track and practise.')}</li>
              <li>{t('اسمح باستخدام الميكروفون عند بدء الغناء.','Allow microphone access when prompted.')}</li>
              <li>{t('استمع لنتيجتك وحمّل ملف MP3.','Listen to your result and download the MP3.')}</li>
            </ol>
          </section>
          <section className="nh-anthem-sources rounded-[1.7rem] border-2 border-emerald-200 bg-white p-5 shadow-md dark:border-emerald-900 dark:bg-[#0b2a22]">
            <h2 className="font-black text-emerald-950 dark:text-emerald-100">{t('مصادر النشيد','Anthem sources')}</h2>
            <p className="mt-3 text-xs font-semibold leading-6 text-slate-600 dark:text-slate-300">
              {t('الموسيقى الآلية: أداء فرقة البحرية الأمريكية، من Wikimedia Commons (ملف في النطاق العام).','Instrumental track: U.S. Navy Band performance via Wikimedia Commons (public-domain file).')}
            </p>
            <a href={COMMONS_SOURCE} target="_blank" rel="noopener noreferrer" className="mt-3 block text-xs font-black text-emerald-700 underline dark:text-emerald-300">
              {t('مصدر الموسيقى وترخيصها','Music source and licensing')}
            </a>
            <a href={OFFICIAL_ANTHEM} target="_blank" rel="noopener noreferrer" className="mt-3 block text-xs font-black text-emerald-700 underline dark:text-emerald-300">
              {t('كلمات النشيد من بروتوكول دبي','Official anthem text — Dubai Protocol')}
            </a>
          </section>
        </aside>
      </div>
    </div>
  </main>;
}
