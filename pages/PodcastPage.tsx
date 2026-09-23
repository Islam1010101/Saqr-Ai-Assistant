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

// ==========================================
// أيقونات SVG جذابة (بديلة للإيموجيز)
// ==========================================
const UAEFlagIcon = () => (
    <svg viewBox="0 0 640 480" className="w-12 h-12 rounded-xl shadow-sm overflow-hidden" preserveAspectRatio="none">
        <path fill="#00732f" d="M0 0h640v160H0z"/>
        <path fill="#fff" d="M0 160h640v160H0z"/>
        <path fill="#000" d="M0 320h640v160H0z"/>
        <path fill="#ff0000" d="M0 0h220v480H0z"/>
    </svg>
);

const GlobeIcon = () => (
    <svg className="w-12 h-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const MicIcon = () => (
    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

const StopIcon = () => (
    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
        <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
);

const HeadphonesIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
    </svg>
);

const EchoIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const NoiseIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
    </svg>
);

const MagicIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

const RocketIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const ListIcon = () => (
    <svg className="absolute -top-6 -right-6 md:-top-10 md:-right-10 w-32 h-32 text-amber-500 opacity-20 rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
);

// جسيمات الانفجار الصوتي
interface BurstParticle {
  id: number;
  icon: React.ReactNode;
  tx: number;
  ty: number;
  rot: number;
  scale: number;
}

const AUDIO_ICONS = [
  <svg className="w-full h-full text-rose-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>,
  <svg className="w-full h-full text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  <svg className="w-full h-full text-sky-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>,
  <svg className="w-full h-full text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3a9 9 0 0 0-9 9v7c0 1.1.9 2 2 2h4v-8H5v-1c0-3.87 3.13-7 7-7s7 3.13 7 7v1h-4v8h4c1.1 0 2-.9 2-2v-7a9 9 0 0 0-9-9z"/></svg>
];

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
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
        sourceNodeRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current);
      }

      const ctx = audioCtxRef.current;
      const source = sourceNodeRef.current;
      
      if (!ctx || !source) return;

      source.disconnect();
      let lastNode: AudioNode = source;

      // 1. فلتر إزالة الضوضاء (Noise Reduction - Bandpass)
      if (effects.noise) {
        if (!noiseFilterRef.current) {
          noiseFilterRef.current = ctx.createBiquadFilter();
          noiseFilterRef.current.type = 'bandpass';
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
          delay.delayTime.value = 0.3; 
          const gain = ctx.createGain();
          gain.gain.value = 0.4; 
          
          delay.connect(gain);
          gain.connect(delay);
          
          echoNodeRef.current = { delay, gain };
        }
        
        lastNode.connect(echoNodeRef.current.delay);
        echoNodeRef.current.delay.connect(ctx.destination);
      } else if (echoNodeRef.current) {
         echoNodeRef.current.delay.disconnect();
      }

      // ربط العقدة الأخيرة بالمخرج النهائي
      lastNode.connect(ctx.destination);

      // 3. تأثير الـ Pitch 
      if (audioRef.current) {
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

  // ستايل الحقول
  const inputClass = "w-full p-4 md:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-4 border-slate-200 dark:border-slate-700 outline-none font-black text-slate-900 dark:text-white text-sm md:text-lg focus:border-rose-400 dark:focus:border-rose-500 transition-colors shadow-inner";

  return (
    <div dir={dir} className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 py-10 px-4 md:py-16 font-sans antialiased text-slate-800 dark:text-slate-200 relative overflow-x-hidden">
      
      {/* 🌟 تصميم طفولي للخلفية 🌟 */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none opacity-50 dark:opacity-20">
         <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-400/20 blur-[100px] rounded-full animate-blob"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-400/20 blur-[100px] rounded-full animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-12 animate-fade-in-up relative z-10 pb-20">
        
        {/* الهيدر العلوي */}
        <div className="text-center flex flex-col items-center">
          <div className="relative mb-8 flex justify-center items-center">
            {particles.map((p) => (
              <div 
                key={p.id}
                className="absolute z-50 pointer-events-none animate-audio-burst select-none w-8 h-8"
                style={{ 
                  '--tx': `${p.tx}px`, 
                  '--ty': `${p.ty}px`, 
                  '--rot': `${p.rot}deg`,
                  width: `${p.scale * 2.5}rem`,
                  height: `${p.scale * 2.5}rem`
                } as any}
              >
                {p.icon}
              </div>
            ))}

            <img 
              src={podcastHeaderImg} 
              alt="Saqr Podcast Logo" 
              onClick={triggerExplosion}
              className="relative w-48 h-48 md:w-64 md:h-64 object-contain animate-float cursor-pointer z-40 active:scale-95 transition-transform drop-shadow-2xl"
              onError={(e) => e.currentTarget.style.display = 'none'}
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4 uppercase">{t('pageTitle')}</h1>
          <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 font-bold leading-relaxed max-w-2xl mx-auto">{t('subTitle')}</p>
          <div className="flex justify-center gap-3 mt-6">
             <div className="h-2 w-16 bg-rose-500 rounded-full"></div>
             <div className="h-2 w-8 bg-sky-400 rounded-full"></div>
          </div>
        </div>

        {/* أزرار المكتبات */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <Link to="/digital-library/arabic" className="group bg-white dark:bg-slate-800 p-8 rounded-[3rem] border-4 border-slate-200 dark:border-slate-700 border-b-8 hover:border-emerald-400 dark:hover:border-emerald-500 hover:-translate-y-2 active:border-b-4 active:translate-y-2 transition-all flex items-center gap-6 shadow-sm">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center border-4 border-emerald-200 dark:border-emerald-800 group-hover:scale-110 group-hover:rotate-6 transition-transform shrink-0">
               <UAEFlagIcon />
            </div>
            <div>
              <h3 className="font-black text-2xl text-slate-900 dark:text-white mb-1.5 tracking-tight">{t('arabicLibrary')}</h3>
              <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-bold">{t('libraryDesc')}</p>
            </div>
          </Link>
          <Link to="/digital-library/english" className="group bg-white dark:bg-slate-800 p-8 rounded-[3rem] border-4 border-slate-200 dark:border-slate-700 border-b-8 hover:border-sky-400 dark:hover:border-sky-500 hover:-translate-y-2 active:border-b-4 active:translate-y-2 transition-all flex items-center gap-6 shadow-sm">
            <div className="w-16 h-16 bg-sky-50 dark:bg-sky-900/30 text-sky-500 rounded-2xl flex items-center justify-center border-4 border-sky-200 dark:border-sky-800 group-hover:scale-110 group-hover:-rotate-6 transition-transform shrink-0">
               <GlobeIcon />
            </div>
            <div>
              <h3 className="font-black text-2xl text-slate-900 dark:text-white mb-1.5 tracking-tight">{t('englishLibrary')}</h3>
              <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-bold">{t('libraryDesc')}</p>
            </div>
          </Link>
        </div>

        {/* دليل التسجيل */}
        <div className="bg-amber-50 dark:bg-slate-800 p-8 md:p-12 rounded-[3rem] border-4 border-amber-300 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <ListIcon />
          <h2 className="text-3xl font-black mb-8 text-slate-900 dark:text-white relative z-10 tracking-tight">
             {t('instructionsTitle')}
          </h2>
          <ul className="space-y-6 font-bold text-base md:text-lg text-slate-700 dark:text-slate-300 relative z-10 leading-relaxed">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <li key={num} className="flex gap-4 items-start hover:translate-x-2 transition-transform">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-lg border-4 border-amber-200 dark:border-slate-600 shadow-sm">{num}</span>
                <span className="pt-1.5 flex-1">{t(`inst${num}` as keyof typeof translations.ar)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* غرفة التسجيل الذكية */}
        <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[4rem] shadow-xl border-4 border-slate-200 dark:border-slate-700 relative overflow-hidden animate-fade-in">
          
          <h2 className="text-3xl md:text-4xl font-black mb-12 text-center text-slate-900 dark:text-white tracking-tight relative z-10 uppercase">
             {t('studioTitle')}
          </h2>

          {/* زر التسجيل */}
          <div className="flex flex-col items-center justify-center mb-12 relative z-10">
            <div className="relative mb-8 group">
              {isRecording && (
                <div className="absolute -inset-6 bg-red-500/30 rounded-full animate-ping opacity-70"></div>
              )}
              <button 
                onClick={isRecording ? stopRecording : startRecording}
                className={`relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 border-b-8 active:border-b-0 active:translate-y-2
                  ${isRecording ? 'bg-white border-8 border-red-500 text-red-500 shadow-[0_0_40px_#ef4444]' : 'bg-red-500 border-red-700 text-white shadow-lg hover:scale-105'}`}
              >
                {isRecording ? <StopIcon /> : <MicIcon />}
              </button>
            </div>
            
            <div className="text-center h-16 flex items-center justify-center">
              {isRecording ? (
                <div className="flex flex-col items-center space-y-2">
                   <span className="text-red-500 font-black text-xl animate-pulse tracking-wide uppercase">{t('recording')}</span>
                   <span className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 px-6 py-2 rounded-2xl border-4 border-slate-200 dark:border-slate-700">{formatTime(recordingTime)}</span>
                </div>
              ) : (
                <span className="text-slate-500 dark:text-slate-400 font-black text-xl md:text-2xl uppercase tracking-widest">{audioBlob ? `${t('previewTitle')} (${formatTime(recordingTime)})` : t('startRecord')}</span>
              )}
            </div>
          </div>

          {/* منطقة المعاينة والمؤثرات */}
          {audioUrl && (
            <div className="bg-slate-50 dark:bg-slate-800 p-8 md:p-10 rounded-[3rem] border-4 border-slate-200 dark:border-slate-700 mb-12 animate-fade-in-up relative z-10 shadow-inner">
              <h3 className="text-xl md:text-2xl font-black mb-8 flex items-center gap-3 text-slate-800 dark:text-white uppercase tracking-tight">
                <HeadphonesIcon /> {t('previewTitle')}
              </h3>
              
              <audio ref={audioRef} src={audioUrl} controls className="w-full mb-10 outline-none dark:invert" crossOrigin="anonymous" />

              <h4 className="text-sm font-black text-slate-400 mb-6 uppercase tracking-widest">{t('effectsTitle')}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <button onClick={() => toggleEffect('echo')} className={`py-4 px-6 rounded-2xl text-base md:text-lg font-black transition-all transform active:scale-95 flex items-center justify-center gap-3 border-b-8 active:border-b-0 active:translate-y-2 ${effects.echo ? 'bg-sky-500 border-sky-700 text-white shadow-md' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border-4'}`}>
                  <EchoIcon /> {t('effEcho')}
                </button>
                <button onClick={() => toggleEffect('noise')} className={`py-4 px-6 rounded-2xl text-base md:text-lg font-black transition-all transform active:scale-95 flex items-center justify-center gap-3 border-b-8 active:border-b-0 active:translate-y-2 ${effects.noise ? 'bg-emerald-500 border-emerald-700 text-white shadow-md' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border-4'}`}>
                  <NoiseIcon /> {t('effNoise')}
                </button>
                <button onClick={() => toggleEffect('pitch')} className={`py-4 px-6 rounded-2xl text-base md:text-lg font-black transition-all transform active:scale-95 flex items-center justify-center gap-3 border-b-8 active:border-b-0 active:translate-y-2 ${effects.pitch ? 'bg-amber-400 border-amber-600 text-slate-900 shadow-md' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border-4'}`}>
                  <MagicIcon /> {t('effPitch')}
                </button>
              </div>

              <div className="flex items-center gap-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border-4 border-slate-200 dark:border-slate-700 shadow-sm">
                <span className="text-base font-black text-slate-700 dark:text-slate-300 uppercase">{t('speed')}</span>
                <input 
                  type="range" min="0.5" max="2" step="0.1" value={playbackRate} 
                  onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                  className="flex-1 accent-rose-500 h-3 bg-slate-200 dark:bg-slate-700 rounded-full cursor-pointer appearance-none"
                />
                <span className="text-lg font-black bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-4 py-2 rounded-xl border-2 border-rose-200 dark:border-rose-800">{playbackRate.toFixed(1)}x</span>
              </div>
            </div>
          )}

          {/* بيانات الطالب */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 relative z-10">
            <input 
              type="text" 
              placeholder={t('studentName')}
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className={inputClass}
            />
            <input 
              type="text" 
              placeholder={t('studentGrade')}
              value={studentGrade}
              onChange={(e) => setStudentGrade(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* رسائل الخطأ والنجاح */}
          {statusMessage.text && (
            <div className={`p-6 rounded-[2rem] mb-10 text-center font-black text-base md:text-lg relative z-10 border-4 ${statusMessage.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'}`}>
              {statusMessage.text}
            </div>
          )}

          {/* زر الإرسال النهائي */}
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || !audioBlob}
            className={`w-full py-5 md:py-6 rounded-[2rem] font-black text-xl md:text-2xl transition-all flex items-center justify-center gap-4 relative z-10 transform active:scale-95 border-b-8 active:border-b-0 active:translate-y-2 uppercase tracking-widest ${(!audioBlob || isSubmitting) ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-slate-300 dark:border-slate-900 cursor-not-allowed' : 'bg-gradient-to-r from-rose-500 to-rose-600 border-rose-700 text-white shadow-lg'}`}
          >
            {isSubmitting ? <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : <RocketIcon />}
            {isSubmitting ? t('submitting') : t('submit')}
          </button>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
        * { font-family: 'Cairo', sans-serif !important; }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite alternate ease-in-out; }
        .animation-delay-2000 { animation-delay: 2s; }
        
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

        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #f43f5e;
            cursor: pointer;
        }

        audio::-webkit-media-controls-panel { background-color: #f1f5f9; }
        .dark audio::-webkit-media-controls-panel { background-color: #1e293b; }
      `}</style>
    </div>
  );
};

export default PodcastPage;
