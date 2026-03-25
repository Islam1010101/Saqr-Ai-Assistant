import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

const translations = {
  ar: {
    pageTitle: "بودكاست صقر",
    subTitle: "سجل ملخصاتك وشارك إبداعك الصوتي",
    arabicLibrary: "المكتبة الرقمية العربية",
    englishLibrary: "المكتبة الرقمية الإنجليزية",
    libraryDesc: "تصفح الكتب لاختيار كتابك قبل بدء التسجيل.",
    instructionsTitle: "تعليمات التسجيل",
    inst1: "يجب ذكر عنوان الكتاب واسم المؤلف في بداية التسجيل.",
    inst2: "يمكنك تسجيل ملخص للكتاب أو ماذا تعلمت منه.",
    inst3: "بإمكانك إجراء حوار بينك وبين أحد حول الكتاب.",
    inst4: "يمكنك التعديل على الصوت باختيار المؤثرات الموجودة في الاستديو بعد التسجيل.",
    inst5: "وبعد الانتهاء يرجى كتابة اسمك في خانة الاسم وصفك ثم إرسال.",
    inst6: "سيتم إرسال التسجيل إلينا ومن ثم وضع التسجيل المناسب مع الكتاب.",
    studioTitle: "استديو التسجيل",
    startRecord: "بدء التسجيل",
    stopRecord: "إيقاف",
    recording: "جاري التسجيل...",
    previewTitle: "معاينة وتعديل الصوت",
    effectsTitle: "مؤثرات الصوت (للمعاينة)",
    effEcho: "إضافة صدى",
    effNoise: "عزل الضوضاء",
    effEnhance: "تحسين الجودة",
    effPitch: "تغيير الصوت",
    speed: "السرعة:",
    studentName: "اسم الطالب الرباعي",
    studentGrade: "الصف الدراسي",
    submit: "إرسال التسجيل",
    submitting: "جاري الإرسال...",
    success: "تم الإرسال بنجاح! شكراً لمشاركتك.",
    error: "حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.",
    fillRequired: "يرجى تسجيل الصوت وكتابة الاسم والصف قبل الإرسال."
  },
  en: {
    pageTitle: "Saqr Podcast",
    subTitle: "Record your summaries and share your voice",
    arabicLibrary: "Arabic Digital Library",
    englishLibrary: "English Digital Library",
    libraryDesc: "Browse and select a book before you start recording.",
    instructionsTitle: "Recording Instructions",
    inst1: "State the book title and author's name at the beginning.",
    inst2: "You can record a summary or what you learned from the book.",
    inst3: "You can conduct a dialogue or interview about the book.",
    inst4: "You can edit the audio using the studio effects after recording.",
    inst5: "When finished, enter your name and grade, then submit.",
    inst6: "The recording will be reviewed and linked to the respective book.",
    studioTitle: "Recording Studio",
    startRecord: "Start Recording",
    stopRecord: "Stop",
    recording: "Recording in progress...",
    previewTitle: "Preview & Edit",
    effectsTitle: "Audio Effects (Preview)",
    effEcho: "Add Echo",
    effNoise: "Noise Reduction",
    effEnhance: "Enhance Quality",
    effPitch: "Voice Changer",
    speed: "Speed:",
    studentName: "Full Name",
    studentGrade: "Grade",
    submit: "Submit Recording",
    submitting: "Submitting...",
    success: "Submitted successfully! Thank you.",
    error: "An error occurred during submission. Please try again.",
    fillRequired: "Please record audio, enter your name and grade before submitting."
  }
};

const PodcastPage: React.FC = () => {
  const { locale, dir } = useLanguage();
  const isAr = locale === 'ar';
  const t = (key: keyof typeof translations.ar) => translations[locale][key];

  // Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  // Effects States
  const [effects, setEffects] = useState({ echo: false, noise: false, enhance: false, pitch: false });
  const [playbackRate, setPlaybackRate] = useState(1);

  // Form States
  const [studentName, setStudentName] = useState('');
  const [studentGrade, setStudentGrade] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error' | '', text: string}>({type: '', text: ''});

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // --- Recording Logic ---
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

  // --- Audio Playback Effects ---
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate, audioUrl]);

  const toggleEffect = (effect: keyof typeof effects) => {
    setEffects(prev => ({ ...prev, [effect]: !prev[effect] }));
  };

  // --- Submission Logic ---
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

        // 🌟 الرابط الجديد الخاص بك تم وضعه هنا 🌟
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
          setEffects({ echo: false, noise: false, enhance: false, pitch: false });
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
    <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 font-sans antialiased text-slate-800 dark:text-slate-200">
      
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none opacity-40 dark:opacity-20">
         <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-600/20 blur-[120px] rounded-full"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-5xl mx-auto space-y-10 animate-fade-in-up">
        
        <div className="text-center space-y-4">
          <div className="inline-block bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-full mb-2">
            <span className="text-4xl">🎙️</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">{t('pageTitle')}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">{t('subTitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/arabic-library" className="group bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 border-slate-200 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-500 transition-all flex items-center gap-5 shadow-sm hover:shadow-lg">
            <div className="w-14 h-14 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🇦🇪</div>
            <div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1">{t('arabicLibrary')}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('libraryDesc')}</p>
            </div>
          </Link>
          <Link to="/english-library" className="group bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all flex items-center gap-5 shadow-sm hover:shadow-lg">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🇬🇧</div>
            <div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1">{t('englishLibrary')}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('libraryDesc')}</p>
            </div>
          </Link>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-yellow-400"></div>
          <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
            <span>📋</span> {t('instructionsTitle')}
          </h2>
          <ul className="space-y-4 font-semibold text-slate-700 dark:text-slate-300">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <li key={num} className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-sm border border-slate-200 dark:border-slate-700">{num}</span>
                <span className="pt-1">{t(`inst${num}` as keyof typeof translations.ar)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900 dark:bg-slate-950 p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-800 relative overflow-hidden text-white">
          <h2 className="text-2xl font-black mb-8 text-center text-white/90 uppercase tracking-widest">{t('studioTitle')}</h2>

          <div className="flex flex-col items-center justify-center mb-10">
            <div className="relative mb-6">
              {isRecording && (
                <div className="absolute -inset-4 bg-red-600/30 rounded-full animate-ping"></div>
              )}
              <button 
                onClick={isRecording ? stopRecording : startRecording}
                className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center text-3xl transition-all duration-300 ${isRecording ? 'bg-slate-800 border-4 border-red-500 text-red-500 shadow-[0_0_30px_#ef4444]' : 'bg-red-600 hover:bg-red-500 text-white shadow-lg hover:scale-105'}`}
              >
                {isRecording ? '⏹' : '🎙️'}
              </button>
            </div>
            
            <div className="text-center h-12">
              {isRecording ? (
                <div className="flex flex-col items-center">
                   <span className="text-red-400 font-bold animate-pulse">{t('recording')}</span>
                   <span className="text-3xl font-mono mt-1 text-white">{formatTime(recordingTime)}</span>
                </div>
              ) : (
                <span className="text-slate-400 font-medium">{audioBlob ? formatTime(recordingTime) : t('startRecord')}</span>
              )}
            </div>
          </div>

          {audioUrl && (
            <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 mb-10 animate-fade-in-up">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">🎧 {t('previewTitle')}</h3>
              
              <audio ref={audioRef} src={audioUrl} controls className="w-full mb-6 outline-none" />

              <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">{t('effectsTitle')}</h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <button onClick={() => toggleEffect('echo')} className={`py-2 px-3 rounded-xl text-sm font-bold transition-colors ${effects.echo ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>🌊 {t('effEcho')}</button>
                <button onClick={() => toggleEffect('noise')} className={`py-2 px-3 rounded-xl text-sm font-bold transition-colors ${effects.noise ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>🔇 {t('effNoise')}</button>
                <button onClick={() => toggleEffect('enhance')} className={`py-2 px-3 rounded-xl text-sm font-bold transition-colors ${effects.enhance ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>✨ {t('effEnhance')}</button>
                <button onClick={() => toggleEffect('pitch')} className={`py-2 px-3 rounded-xl text-sm font-bold transition-colors ${effects.pitch ? 'bg-yellow-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>👽 {t('effPitch')}</button>
              </div>

              <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl">
                <span className="text-sm font-bold text-slate-400">{t('speed')}</span>
                <input 
                  type="range" min="0.5" max="2" step="0.1" value={playbackRate} 
                  onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                  className="flex-1 accent-red-500"
                />
                <span className="text-sm font-mono bg-slate-800 px-2 py-1 rounded-md">{playbackRate}x</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input 
              type="text" 
              placeholder={t('studentName')}
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-red-500 transition-colors"
            />
            <input 
              type="text" 
              placeholder={t('studentGrade')}
              value={studentGrade}
              onChange={(e) => setStudentGrade(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {statusMessage.text && (
            <div className={`p-4 rounded-xl mb-6 text-center font-bold text-sm ${statusMessage.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
              {statusMessage.text}
            </div>
          )}

          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || !audioBlob}
            className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 ${(!audioBlob || isSubmitting) ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:-translate-y-1'}`}
          >
            {isSubmitting ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : '🚀'}
            {isSubmitting ? t('submitting') : t('submit')}
          </button>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        * { font-family: 'Cairo', sans-serif !important; }
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default PodcastPage;
