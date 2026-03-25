import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

const podcastHeaderImg = '/Saqr Podcast.png'; 

const translations = {
  ar: {
    pageTitle: "بودكاست صقر",
    subTitle: "منبرك الصوتي لمشاركة المعرفة والإبداع",
    arabicLibrary: "المكتبة الرقمية العربية",
    englishLibrary: "المكتبة الرقمية الإنجليزية",
    libraryDesc: "اختر كتابك من هنا قبل البدء بالتسجيل.",
    instructionsTitle: "دليل التسجيل والقبول",
    inst1: "يجب الالتزام بالكتب الموجودة حصرياً داخل المكتبة الرقمية (العربية أو الإنجليزية) الخاصة بالمدرسة، وغير مسموح بأي كتب من خارجها.",
    inst2: "ابدأ تسجيلك بذكر عنوان الكتاب واسم المؤلف بوضوح.",
    inst3: "يمكنك تسجيل ملخص للكتاب، أو عرض لأهم ما تعلمته منه.",
    inst4: "بإمكانك تسجيل الحوارات واللقاءات الثنائية حول الكتاب.",
    inst5: "استخدم مؤثرات الاستديو بعد التسجيل لمعاينة الصوت وتحسينه.",
    inst6: "تأكد من كتابة اسمك الرباعي وصفك الدراسي بشكل صحيح قبل الضغط على إرسال.",
    inst7: "سيخضع التسجيل للمراجعة من قبلنا قبل اعتماده ووضعه مع الكتاب المناسب.",
    studioTitle: "غرفة التسجيل الذكية",
    startRecord: "بدء التسجيل",
    stopRecord: "إنهاء وحفظ",
    recording: "جاري التسجيل الآن...",
    previewTitle: "معاينة هندسة الصوت",
    effectsTitle: "مؤثرات الاستديو (للمعاينة)",
    effEcho: "إضافة صدى",
    effNoise: "عزل الضوضاء",
    effPitch: "تغيير النبرة",
    speed: "السرعة:",
    studentName: "اسم الطالب الرباعي",
    studentGrade: "الصف الدراسي",
    submit: "إرسال إلى الاستديو",
    submitting: "جاري الرفع...",
    success: "تم إرسال تسجيلك بنجاح! شكراً لمشاركتك المتميزة.",
    error: "حدث خطأ غير متوقع، يرجى التحقق من الشبكة والمحاولة مرة أخرى.",
    fillRequired: "يرجى تسجيل الصوت أولاً، وتعبئة حقول الاسم والصف بدقة."
  },
  en: {
    pageTitle: "Saqr Podcast",
    subTitle: "Your Vocal Platform to Share Knowledge & Creativity",
    arabicLibrary: "Arabic Digital Library",
    englishLibrary: "English Digital Library",
    libraryDesc: "Select your book from here before starting the recording.",
    instructionsTitle: "Recording & Acceptance Guide",
    inst1: "Strict adherence to books exclusively within the school's Digital Library (Arabic or English) is required; outside books are not permitted.",
    inst2: "Start your recording by clearly stating the book title and author's name.",
    inst3: "You can record a book summary or a presentation of your key learnings.",
    inst4: "You can record dialogues and interviews about the book.",
    inst5: "Use studio effects after recording to preview and enhance the audio.",
    inst6: "Ensure you enter your full name and grade correctly before clicking submit.",
    inst7: "The recording will undergo review before being approved and placed with the appropriate book.",
    studioTitle: "Smart Recording Room",
    startRecord: "Start Recording",
    stopRecord: "Stop & Save",
    recording: "Recording in progress...",
    previewTitle: "Audio Engineering Preview",
    effectsTitle: "Studio Effects (Preview)",
    effEcho: "Add Echo",
    effNoise: "Noise Reduction",
    effPitch: "Voice Changer",
    speed: "Speed:",
    studentName: "Full Student Name",
    studentGrade: "Grade",
    submit: "Submit to Studio",
    submitting: "Uploading...",
    success: "Your recording was submitted successfully! Thank you for your contribution.",
    error: "An unexpected error occurred. Please check your network and try again.",
    fillRequired: "Please record audio first, and accurately fill in the name and grade fields."
  }
};

interface BurstParticle {
  id: number;
  icon: string;
  tx: number;
  ty: number;
  rot: number;
  scale: number;
}

const AUDIO_ICONS = ["🎙️", "🎧", "🎵", "🎶", "📻", "🔊", "🎛️"];

const PodcastPage: React.FC = () => {
  const { locale, dir } = useLanguage();
  const isAr = locale === 'ar';
  const t = (key: keyof typeof translations.ar) => translations[locale][key];

  // Recording & Audio States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  // Effects States
  const [effects, setEffects] = useState({ echo: false, noise: false, pitch: false });
  const [playbackRate, setPlaybackRate] = useState(1);

  // Form States
  const [studentName, setStudentName] = useState('');
  const [studentGrade, setStudentGrade] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error' | '', text: string}>({type: '', text: ''});

  const [particles, setParticles] = useState<BurstParticle[]>([]);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Web Audio API Refs for real-time effects
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const echoNodeRef = useRef<{ delay: DelayNode, gain: GainNode } | null>(null);
  const noiseFilterRef = useRef<BiquadFilterNode | null>(null);

  const triggerExplosion = useCallback(() => {
    const id = Date.now();
    const newParticles: BurstParticle[] = Array.from({ length: 12 }).map((_, i) => ({
      id: id + i,
      icon: AUDIO_ICONS[Math.floor(Math.random() * AUDIO_ICONS.length)],
      tx: (Math.random() - 0.5) * 400, 
      ty: (Math.random() - 0.5) * 400, 
      rot: Math.random() * 360,
      scale: 0.8 + Math.random() * 1.5 
    }));
    setParticles(prev => [...prev, ...newParticles]);
    newParticles.forEach(p => {
      setTimeout(() => {
        setParticles(current => current.filter(item => item.id !== p.id));
      }, 2000);
    });
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setAudioBlob(null);
      setAudioUrl(null);
      setEffects({ echo: false, noise: false, pitch: false });
      setPlaybackRate(1);
      setStatusMessage({type: '', text: ''});

      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert(isAr ? 'يرجى السماح بالوصول إلى الميكروفون لبدء التسجيل.' : 'Please allow microphone access to record.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // --- إعداد Web Audio API لتطبيق التأثيرات عند التشغيل ---
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      // تجنب إنشاء السياق أكثر من مرة لنفس عنصر الصوت
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
        sourceNodeRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current);
      }

      const ctx = audioCtxRef.current;
      const source = sourceNodeRef.current;
      
      if (!ctx || !source) return;

      // فصل أي مسارات قديمة
      source.disconnect();

      let lastNode: AudioNode = source;

      // 1. فلتر إزالة الضوضاء (Noise Reduction - Bandpass)
      if (effects.noise) {
        if (!noiseFilterRef.current) {
          noiseFilterRef.current = ctx.createBiquadFilter();
          noiseFilterRef.current.type = 'bandpass';
          // التركيز على ترددات الصوت البشري وتجاهل الباقي
          noiseFilterRef.current.frequency.value = 1000; 
          noiseFilterRef.current.Q.value = 0.5;
        }
        lastNode.connect(noiseFilterRef.current);
        lastNode = noiseFilterRef.current;
      } else if (noiseFilterRef.current) {
         noiseFilterRef.current.disconnect();
      }

      // 2. فلتر الصدى (Echo)
      if (effects.echo) {
        if (!echoNodeRef.current) {
          const delay = ctx.createDelay();
          delay.delayTime.value = 0.3; // وقت التأخير بالثواني
          const gain = ctx.createGain();
          gain.gain.value = 0.4; // قوة الصدى
          
          delay.connect(gain);
          // الصدى يعود ليتكرر
          gain.connect(delay);
          
          echoNodeRef.current = { delay, gain };
        }
        
        // مسار مزدوج: الصوت الأصلي + مسار الصدى
        lastNode.connect(echoNodeRef.current.delay);
        echoNodeRef.current.delay.connect(ctx.destination);
      } else if (echoNodeRef.current) {
         echoNodeRef.current.delay.disconnect();
      }

      // ربط العقدة الأخيرة بالمخرج النهائي
      lastNode.connect(ctx.destination);

      // 3. تأثير الـ Pitch (تغيير النبرة يتم عبر تغيير الـ playbackRate في متصفحات الويب بطريقة بسيطة)
      // إذا كان Pitch مفعلاً، نزيد السرعة قليلاً ليصبح الصوت أرفع، مع الحفاظ على إمكانية تغيير السرعة يدوياً
      if (audioRef.current) {
          // preservePitch = false تجعل تغيير السرعة يغير النبرة (Pitch) كما في السناجب
          audioRef.current.preservesPitch = !effects.pitch; 
          audioRef.current.playbackRate = effects.pitch ? playbackRate * 1.3 : playbackRate;
      }

    }
  }, [audioUrl, effects, playbackRate]);

  const toggleEffect = (effect: keyof typeof effects) => {
    setEffects(prev => ({ ...prev, [effect]: !prev[effect] }));
  };

  const handleSubmit = async () => {
    if (!audioBlob || !studentName.trim() || !studentGrade.trim()) {
      setStatusMessage({ type: 'error', text: t('fillRequired') });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage({type: '', text: ''});

    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1]; 

        const payload = {
          name: studentName,
          grade: studentGrade,
          audioData: base64Audio,
          mimeType: audioBlob.type,
          // إرسال الإعدادات للمحرر ليعرف ماذا اختار الطالب
          effectsApplied: JSON.stringify({ ...effects, playbackRate })
        };

        const response = await fetch('https://script.google.com/macros/s/AKfycbzA8P-nF32I4Ponw18GynsgFCuf5LYH6kf16f4k7UjjPgod4mVGxSk12monYmYcCmFW/exec', {
          method: 'POST',
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          setStatusMessage({ type: 'success', text: t('success') });
          setStudentName('');
          setStudentGrade('');
          setAudioBlob(null);
          setAudioUrl(null);
          setRecordingTime(0);
          setEffects({ echo: false, noise: false, pitch: false });
        } else {
          throw new Error('Network response was not ok.');
        }
      };
    } catch (error) {
      console.error(error);
      setStatusMessage({ type: 'error', text: t('error') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 md:py-16 font-sans antialiased text-slate-800 dark:text-slate-200 relative overflow-x-hidden">
      
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none opacity-40 dark:opacity-20">
         <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-600/20 blur-[120px] rounded-full animate-pulse"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse [animation-delay:2s]"></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-12 animate-fade-in-up relative z-10">
        
        <div className="text-center flex flex-col items-center">
          <div className="relative mb-8 flex justify-center items-center">
            {particles.map((p) => (
              <div 
                key={p.id}
                className="absolute z-50 pointer-events-none animate-audio-burst select-none"
                style={{ 
                  '--tx': `${p.tx}px`, 
                  '--ty': `${p.ty}px`, 
                  '--rot': `${p.rot}deg`,
                  fontSize: `${p.scale * 2}rem`
                } as any}
              >
                {p.icon}
              </div>
            ))}

            <img 
              src={podcastHeaderImg} 
              alt="Saqr Podcast Logo" 
              onClick={triggerExplosion}
              className="relative w-48 h-48 md:w-64 md:h-64 object-contain animate-float cursor-pointer z-40 active:scale-95 transition-transform"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 drop-shadow-sm">{t('pageTitle')}</h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-bold leading-relaxed max-w-2xl mx-auto">{t('subTitle')}</p>
          <div className="h-1.5 w-24 bg-red-600 mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <Link to="/digital-library/arabic" className="group glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-red-500/50 hover:-translate-y-1 transition-all flex items-center gap-6 shadow-sm hover:shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-6 transition-transform">🇦🇪</div>
            <div>
              <h3 className="font-extrabold text-2xl text-slate-900 dark:text-white mb-1.5">{t('arabicLibrary')}</h3>
              <p className="text-base text-slate-600 dark:text-slate-400 font-medium">{t('libraryDesc')}</p>
            </div>
          </Link>
          <Link to="/digital-library/english" className="group glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 hover:-translate-y-1 transition-all flex items-center gap-6 shadow-sm hover:shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 group-hover:-rotate-6 transition-transform">🇬🇧</div>
            <div>
              <h3 className="font-extrabold text-2xl text-slate-900 dark:text-white mb-1.5">{t('englishLibrary')}</h3>
              <p className="text-base text-slate-600 dark:text-slate-400 font-medium">{t('libraryDesc')}</p>
            </div>
          </Link>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border-l-8 border-yellow-400 shadow-lg relative overflow-hidden">
          <div className="absolute -top-10 -right-10 text-9xl opacity-10">📋</div>
          <h2 className="text-3xl font-black mb-8 flex items-center gap-4 text-slate-950 dark:text-white relative z-10">
             {t('instructionsTitle')}
          </h2>
          <ul className="space-y-5 font-bold text-lg text-slate-700 dark:text-slate-300 relative z-10 leading-relaxed">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <li key={num} className="flex gap-4 items-start hover:translate-x-1 transition-transform">
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-black text-base border border-slate-200 dark:border-slate-700 shadow-inner">{num}</span>
                <span className="pt-1.5 flex-1">{t(`inst${num}` as keyof typeof translations.ar)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-950 dark:bg-black p-8 md:p-12 rounded-[3rem] shadow-2xl border-2 border-slate-800 dark:border-slate-900 relative overflow-hidden text-white animate-fade-in">
          
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTIwIDIwaDIwdjIwSDIwVjIwek0wIDIwaDIwdjIwSDBWMjB6bTIwIDBoMjB2MjBIMjBWMHoiIGZpbGw9IiM4ODgiIGZpbGwtb3BhY2l0eT0iMC4xIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4PC9zdmc+')]"></div>

          <h2 className="text-3xl font-black mb-12 text-center text-white tracking-widest relative z-10 uppercase flex items-center justify-center gap-3">
             {t('studioTitle')}
          </h2>

          <div className="flex flex-col items-center justify-center mb-12 relative z-10">
            <div className="relative mb-6 group">
              {isRecording && (
                <div className="absolute -inset-6 bg-red-600/30 rounded-full animate-ping opacity-70"></div>
              )}
              <button 
                onClick={isRecording ? stopRecording : startRecording}
                className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center text-4xl transition-all duration-300 transform active:scale-95 ${isRecording ? 'bg-slate-800 border-8 border-red-500 text-red-500 shadow-[0_0_40px_#ef4444]' : 'bg-red-600 hover:bg-red-500 text-white shadow-lg hover:scale-105'}`}
              >
                {isRecording ? '⏹' : '🎙️'}
              </button>
            </div>
            
            <div className="text-center h-16 flex items-center justify-center">
              {isRecording ? (
                <div className="flex flex-col items-center space-y-2">
                   <span className="text-red-400 font-extrabold text-xl animate-pulse tracking-wide">{t('recording')}</span>
                   <span className="text-4xl font-mono text-white bg-black/40 px-4 py-1 rounded-lg border border-slate-700">{formatTime(recordingTime)}</span>
                </div>
              ) : (
                <span className="text-slate-400 font-bold text-xl">{audioBlob ? `${t('previewTitle')} (${formatTime(recordingTime)})` : t('startRecord')}</span>
              )}
            </div>
          </div>

          {audioUrl && (
            <div className="bg-slate-800/40 backdrop-blur-md p-8 rounded-3xl border border-slate-700 mb-12 animate-fade-in-up relative z-10">
              <h3 className="text-xl font-extrabold mb-6 flex items-center gap-3">🎧 {t('previewTitle')}</h3>
              
              {/* مشغل الصوت المدمج الذي يمر عبر Web Audio API */}
              <audio ref={audioRef} src={audioUrl} controls className="w-full mb-8 outline-none dark:invert" crossOrigin="anonymous" />

              <h4 className="text-sm font-extrabold text-slate-400 mb-4 uppercase tracking-wider">{t('effectsTitle')}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <button onClick={() => toggleEffect('echo')} className={`py-3 px-4 rounded-2xl text-base font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2 ${effects.echo ? 'bg-blue-500 text-white shadow-md' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>🌊 {t('effEcho')}</button>
                <button onClick={() => toggleEffect('noise')} className={`py-3 px-4 rounded-2xl text-base font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2 ${effects.noise ? 'bg-green-600 text-white shadow-md' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>🔇 {t('effNoise')}</button>
                <button onClick={() => toggleEffect('pitch')} className={`py-3 px-4 rounded-2xl text-base font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2 ${effects.pitch ? 'bg-yellow-500 text-slate-950 shadow-md' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>👽 {t('effPitch')}</button>
              </div>

              <div className="flex items-center gap-5 bg-slate-900/60 p-5 rounded-2xl border border-slate-700">
                <span className="text-base font-bold text-slate-300">{t('speed')}</span>
                <input 
                  type="range" min="0.5" max="2" step="0.1" value={playbackRate} 
                  onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                  className="flex-1 accent-red-500 h-2 cursor-pointer"
                />
                <span className="text-lg font-mono font-bold bg-slate-800 text-red-400 px-3 py-1 rounded-lg border border-slate-700">{playbackRate.toFixed(1)}x</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 relative z-10">
            <input 
              type="text" 
              placeholder={t('studentName')}
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="bg-slate-800/80 border-2 border-slate-700 text-white font-bold rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-red-500 focus:bg-slate-800 transition-all"
            />
            <input 
              type="text" 
              placeholder={t('studentGrade')}
              value={studentGrade}
              onChange={(e) => setStudentGrade(e.target.value)}
              className="bg-slate-800/80 border-2 border-slate-700 text-white font-bold rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-red-500 focus:bg-slate-800 transition-all"
            />
          </div>

          {statusMessage.text && (
            <div className={`p-5 rounded-2xl mb-8 text-center font-bold text-base relative z-10 ${statusMessage.type === 'error' ? 'bg-red-500/20 text-red-300 border border-red-500/50' : 'bg-green-500/20 text-green-300 border border-green-500/50'}`}>
              {statusMessage.text}
            </div>
          )}

          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || !audioBlob}
            className={`w-full py-5 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-3 relative z-10 transform active:scale-[0.98] ${(!audioBlob || isSubmitting) ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' : 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:-translate-y-1'}`}
          >
            {isSubmitting ? <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : '🚀'}
            {isSubmitting ? t('submitting') : t('submit')}
          </button>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
        * { font-family: 'Cairo', sans-serif !important; }
        
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }

        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }

        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        
        /* 💥 أنيميشن الانفجار الصوتي 💥 */
        @keyframes audio-burst {
          0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 1; filter: blur(0px); }
          50% { opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(1.5) rotate(var(--rot)); opacity: 0; filter: blur(4px); }
        }
        .animate-audio-burst { animation: audio-burst 2s cubic-bezier(0.19, 1, 0.22, 1) forwards; }

        audio::-webkit-media-controls-panel { background-color: #1e293b; }
        audio::-webkit-media-controls-current-time-display,
        audio::-webkit-media-controls-time-remaining-display { color: #f1f5f9; }
      `}</style>
    </div>
  );
};

export default PodcastPage;
