import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../src/utils/supabase';

// ================= أنواع البيانات =================
type Difficulty = 'easy' | 'medium' | 'hard';

interface FlagQuestion {
  id: number;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correct: number;
  fact: string;
}

interface LandmarkLevel {
  level: number;
  name: string;
  city: string;
  heightLabel: string;
  icon: string;
  color: string;
}

// ================= مراحل الصعود ومعالم الإمارات =================
const UAE_LANDMARKS: LandmarkLevel[] = [
  { level: 0, name: 'قلعة الجاهلي', city: 'العين', heightLabel: 'نقطة الانطلاق', icon: '🏰', color: 'from-amber-600 to-yellow-500' },
  { level: 1, name: 'جامع الشيخ زايد الكبير', city: 'أبوظبي', heightLabel: '107 أمتار', icon: '🕌', color: 'from-sky-500 to-blue-600' },
  { level: 2, name: 'متحف المستقبل', city: 'دبي', heightLabel: '77 متراً', icon: '🏛️', color: 'from-teal-500 to-emerald-600' },
  { level: 3, name: 'برواز دبي', city: 'دبي', heightLabel: '150 متراً', icon: '🖼️', color: 'from-yellow-500 to-amber-500' },
  { level: 4, name: 'برج العرب', city: 'دبي', heightLabel: '321 متراً', icon: '⛵', color: 'from-blue-500 to-indigo-600' },
  { level: 5, name: 'أبراج الاتحاد', city: 'أبوظبي', heightLabel: '305 أمتار', icon: '🏙️', color: 'from-indigo-500 to-purple-600' },
  { level: 6, name: 'أبراج الإمارات', city: 'دبي', heightLabel: '355 متراً', icon: '🏢', color: 'from-purple-500 to-rose-500' },
  { level: 7, name: 'قمة برج خليفة', city: 'دبي', heightLabel: '828 متراً - قمة المجد', icon: '✨', color: 'from-emerald-500 via-amber-400 to-rose-500' },
];

// ================= بنك الأسئلة المتدرج حسب الصعوبة =================
const QUESTION_BANK: FlagQuestion[] = [
  // --- المستوى السهل (Easy: Levels 0 - 2) ---
  {
    id: 1,
    difficulty: 'easy',
    question: 'في أي تاريخ تحتفل دولة الإمارات العربية المتحدة بـ «يوم العلم» من كل عام؟',
    options: ['3 نوفمبر', '2 ديسمبر', '1 يناير', '30 نوفمبر'],
    correct: 0,
    fact: 'تحتفل الإمارات في 3 نوفمبر من كل عام بيوم العلم تجديداً للولاء والانتماء للوطن والقيادة الرشيدة.'
  },
  {
    id: 2,
    difficulty: 'easy',
    question: 'كم يبلغ عدد ألوان علم دولة الإمارات العربية المتحدة؟',
    options: ['3 ألوان', '4 ألوان', '5 ألوان', 'لونان'],
    correct: 1,
    fact: 'يتكون علم الإمارات من 4 ألوان رئيسية هي: الأحمر، الأخضر، الأبيض، والأسود.'
  },
  {
    id: 3,
    difficulty: 'easy',
    question: 'ما هو اللون العمودي الموجود في جانب العلم القريب من السارية؟',
    options: ['الأخضر', 'الأسود', 'الأحمر', 'الأبيض'],
    correct: 2,
    fact: 'القسم العمودي المحاذي للسارية لونه أحمر، ويمثل تضحيات الأجداد وحماة الوطن.'
  },
  {
    id: 4,
    difficulty: 'easy',
    question: 'في أي ساعة توحّد جميع مدارس ومؤسسات الدولة رفع العلم في يوم العلم؟',
    options: ['8:00 صباحاً', '10:00 صباحاً', '11:00 صباحاً', '12:00 ظهراً'],
    correct: 2,
    fact: 'يُرفع العلم في تمام الساعة 11:00 صباحاً في وقت واحد بجميع أنحاء الدولة.'
  },
  {
    id: 5,
    difficulty: 'easy',
    question: 'ما هو اللون الذي يتوسط الأشرطة الأفقية الثلاثة في علم الإمارات؟',
    options: ['الأبيض', 'الأخضر', 'الأسود', 'الأحمر'],
    correct: 0,
    fact: 'اللون الأبيض يقع في الوسط بين الأخضر في الأعلى والأسود في الأسفل، ويرمز للسلام والعطاء.'
  },
  {
    id: 6,
    difficulty: 'easy',
    question: 'في أي عام تم اعتماد علم دولة الإمارات العربية المتحدة رسمياً؟',
    options: ['1968', '1971', '1975', '1980'],
    correct: 1,
    fact: 'اعتُمد العلم رسمياً في 2 ديسمبر عام 1971 تزامناً مع إعلان قيام اتحاد دولة الإمارات.'
  },
  {
    id: 7,
    difficulty: 'easy',
    question: 'ما هو الشعار الوطني الدائم المرتبط بفعالية رفع العلم؟',
    options: ['ارفعه عالياً ليبقى شامخاً', 'علمنا في قلوبنا', 'راية السلام', 'فوق السحاب'],
    correct: 0,
    fact: 'شعار «ارفعه عالياً ليبقى شامخاً» يعكس اعتزاز أبناء الإمارات والمقيمين براية الاتحاد.'
  },
  {
    id: 8,
    difficulty: 'easy',
    question: 'ما هو اللون الموجود في الجزء العلوي الأفقي من علم الإمارات؟',
    options: ['الأحمر', 'الأخضر', 'الأبيض', 'الأسود'],
    correct: 1,
    fact: 'الشريط العلوي لونه أخضر ويرمز للنماء والازدهار والبيئة الخضراء في ربوع الوطن.'
  },

  // --- المستوى المتوسط (Medium: Levels 3 - 4) ---
  {
    id: 9,
    difficulty: 'medium',
    question: 'من هو المواطن الإماراتي الذي صمم علم دولة الإمارات العربية المتحدة؟',
    options: ['عبدالله محمد المعينة', 'أحمد بن سليم', 'راشد المخاوي', 'سعيد بن غباش'],
    correct: 0,
    fact: 'صممه سعادة عبدالله محمد المعينة حين كان طالباً، وفاز تصميمه بالمركز الأول عام 1971.'
  },
  {
    id: 10,
    difficulty: 'medium',
    question: 'من هو القائد المؤسس الذي رفع علم دولة الإمارات لأول مرة في التاريخ؟',
    options: ['الشيخ زايد بن سلطان آل نهيان (طيب الله ثراه)', 'الشيخ راشد بن سعيد آل مكتوم', 'الشيخ خليفة بن زايد', 'الشيخ خالد بن محمد'],
    correct: 0,
    fact: 'رفع المغفور له الشيخ زايد بن سلطان آل نهيان العلم بيده الكريمة لأول مرة في دار الاتحاد بدبي.'
  },
  {
    id: 11,
    difficulty: 'medium',
    question: 'أين رُفع علم دولة الإمارات لأول مرة يوم إعلان الاتحاد عام 1971؟',
    options: ['قصر الحصن في أبوظبي', 'دار الاتحاد (قصر الضيافة) في دبي', 'قلعة الجاهلي في العين', 'ساحة الوصل'],
    correct: 1,
    fact: 'شهدت سارية دار الاتحاد في منطقة الجميرا بدبي أول رفع رسمي لعلم دولة الإمارات.'
  },
  {
    id: 12,
    difficulty: 'medium',
    question: 'ألوان علم الإمارات الأربعة مستلهمة من بيت شعر شهير لأي شاعر؟',
    options: ['أبو الطيب المتنبي', 'صفي الدين الحلي', 'أحمد شوقي', 'حسان بن ثابت'],
    correct: 1,
    fact: 'استُلهمت الألوان من قول الشاعر صفي الدين الحلي: «بيضٌ صنائعنا، سودٌ وقائعنا، خضرٌ مرابعنا، حمرٌ مواضينا».'
  },
  {
    id: 13,
    difficulty: 'medium',
    question: 'إلى ماذا يرمز اللون الأسود في علم دولة الإمارات؟',
    options: ['النفط والثروة', 'القوة والمنعة وشدة البأس والحكمة', 'الليل والهدوء', 'الجبال الشاهقة'],
    correct: 1,
    fact: 'يرمز اللون الأسود إلى قوة أبناء الوطن ومنعتهم وشدة بأسهم، وليس إلى النفط كما يظن البعض.'
  },
  {
    id: 14,
    difficulty: 'medium',
    question: 'من الذي أطلق مبادرة الاحتفال بـ «يوم العلم» لأول مرة عام 2013؟',
    options: ['الشيخ محمد بن راشد آل مكتوم', 'الشيخ خليفة بن زايد آل نهيان', 'الشيخ سلطان القاسمي', 'الشيخ حمدان بن محمد'],
    correct: 0,
    fact: 'أطلق صاحب السمو الشيخ محمد بن راشد آل مكتوم مبادرة يوم العلم في عام 2013.'
  },
  {
    id: 15,
    difficulty: 'medium',
    question: 'ماذا تعني كلمة «بيضٌ صنائعنا» التي يرمز لها اللون الأبيض في العلم؟',
    options: ['أفعال الخير والسلام والعطاء الإنساني', 'الرمال البيضاء', 'الملابس الرسمية', 'اللؤلؤ الطبيعي'],
    correct: 0,
    fact: 'صنائعنا أي أعمالنا ومبادراتنا الخيرية والإنسانية المشهودة بالسلام والنقاء في العالم.'
  },
  {
    id: 16,
    difficulty: 'medium',
    question: 'ما هو النشيد الرسمي الذي يُعزف ويُردَّد أثناء مراسم رفع العلم؟',
    options: ['عيشي بلادي', 'موطني', 'حماة الحمى', 'دار زايد'],
    correct: 0,
    fact: 'نشيد «عيشي بلادي عاش اتحاد إماراتنا» هو السلام الوطني الرسمي لدولة الإمارات.'
  },

  // --- المستوى المتقدم (Hard: Levels 5 - 6) ---
  {
    id: 17,
    difficulty: 'hard',
    question: 'من هو الشاعر الإماراتي الذي كتب كلمات النشيد الوطني «عيشي بلادي»؟',
    options: ['الشيخ الدكتور مانع سعيد العتيبة', 'عارف الشيخ عبدالله الحسن', 'سعد جمعة', 'سلطان بن علي العويس'],
    correct: 1,
    fact: 'كتب كلمات النشيد الوطني الشاعر الدكتور عارف الشيخ عام 1986، ولحّنه الموسيقار سعد عبدالوهاب.'
  },
  {
    id: 18,
    difficulty: 'hard',
    question: 'ما هي النسبة القياسية الرسمية لطول علم الإمارات مقارنة بعرضه؟',
    options: ['الطول ضعف العرض (2 : 1)', 'الطول يساوي العرض (1 : 1)', 'ثلاثة أضعاف العرض (3 : 1)', 'مرة ونصف (1.5 : 1)'],
    correct: 0,
    fact: 'وفق القانون الاتحادي، يكون علم الدولة مستطيل الشكل طوله ضعف عرضه تماماً (نسبة 2 إلى 1).'
  },
  {
    id: 19,
    difficulty: 'hard',
    question: 'كم يبلغ عرض الجزء الأحمر العمودي بالنسبة لطول العلم الكلي؟',
    options: ['نصف طول العلم', 'ربع طول العلم (1/4)', 'ثلث طول العلم (1/3)', 'خُمس طول العلم'],
    correct: 1,
    fact: 'القسم الأحمر العمودي يبلغ عرضه ربع طول العلم بالضبط، بينما تمتد الألوان الأفقية للثلاثة أرباع المتبقية.'
  },
  {
    id: 20,
    difficulty: 'hard',
    question: 'كم كان عدد التصاميم التي تنافست في مسابقة تصميم علم الإمارات عام 1971؟',
    options: ['حوالي 100 تصميم', 'حوالي 500 تصميم', '1030 تصميماً', '3000 تصميم'],
    correct: 2,
    fact: 'تقدّم للمسابقة التي أعلن عنها الديوان الأميري في جريدة الاتحاد 1030 تصميماً، وتم اختيار 6 منها للنهائيات.'
  },
  {
    id: 21,
    difficulty: 'hard',
    question: 'لماذا تم اختيار يوم 3 نوفمبر تحديداً للاحتفال بيوم العلم؟',
    options: ['ذكرى تولي الشيخ خليفة بن زايد (رحمه الله) رئاسة الدولة', 'تاريخ الإعلان عن مسابقة تصميم العلم', 'ذكرى افتتاح برج خليفة', 'اليوم الوطني الأول'],
    correct: 0,
    fact: 'يتزامن 3 نوفمبر مع ذكرى تولي المغفور له الشيخ خليفة بن زايد آل نهيان مقاليد الحكم في الدولة عام 2004.'
  },
  {
    id: 22,
    difficulty: 'hard',
    question: 'حسب دليل الاستخدام الرسمي لعلم الإمارات، كيف يجب أن يكون وضع الألوان عند تعليق العلم عمودياً؟',
    options: ['اللون الأحمر للأعلى، والأخضر على اليمين (بالنسبة للمشاهد)', 'اللون الأحمر للأسفل', 'اللون الأسود على اليمين', 'لا يجوز تعليقه عمودياً'],
    correct: 0,
    fact: 'عند التعليق الرأسي يكون اللون الأحمر في الأعلى دائماً، ويكون الشريط الأخضر على جهة يمين الناظر للعلم.'
  },
  {
    id: 23,
    difficulty: 'hard',
    question: 'في أي جريدة نُشر إعلان مسابقة تصميم علم الإمارات قبل قيام الاتحاد بشهرين؟',
    options: ['جريدة الاتحاد', 'جريدة الخليج', 'جريدة البيان', 'جريدة الوحدة'],
    correct: 0,
    fact: 'قرأ عبدالله محمد المعينة إعلان مسابقة تصميم العلم في جريدة الاتحاد الصادرة من أبوظبي عام 1971.'
  },
  {
    id: 24,
    difficulty: 'hard',
    question: 'في أي إمارة تقع «جزيرة العلم» التي تضم واحدة من أعلى سواري العلم في الدولة؟',
    options: ['إمارة الشارقة', 'إمارة عجمان', 'إمارة الفجيرة', 'إمارة أم القيوين'],
    correct: 0,
    fact: 'تقع جزيرة العلم في إمارة الشارقة على ارتفاع 123 متراً وتعد معلماً وطنياً وثقافياً بارزاً.'
  }
];

// مؤثرات صوتية خفيفة مدمجة برمجياً (Web Audio API) لا تحتاج لملفات خارجية
const playTone = (type: 'up' | 'down' | 'victory') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;

    if (type === 'up') {
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
        gain.gain.setValueAtTime(0.12, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.25);
      });
    } else if (type === 'down') {
      [350, 260].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        gain.gain.setValueAtTime(0.08, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.25);
      });
    } else if (type === 'victory') {
      [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.14);
        gain.gain.setValueAtTime(0.15, now + i * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.14 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.14);
        osc.stop(now + i * 0.14 + 0.4);
      });
    }
  } catch {
    // تجاهل في حال منع المتصفح الصوت
  }
};

interface FlagDayChallengeProps {
  onClose?: () => void;
}

export default function FlagDayChallenge({ onClose }: FlagDayChallengeProps) {
  const MAX_LEVEL = 7; // القمة عند المستوى 7 (برج خليفة)

  const [flagLevel, setFlagLevel] = useState<number>(0);
  const [usedQuestionIds, setUsedQuestionIds] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [pointsAwarded, setPointsAwarded] = useState<boolean>(false);

  // تحديد صعوبة السؤال بناءً على ارتفاع العلم الحالي
  const currentDifficulty: Difficulty = useMemo(() => {
    if (flagLevel <= 2) return 'easy';
    if (flagLevel <= 4) return 'medium';
    return 'hard';
  }, [flagLevel]);

  // اختيار سؤال عشوائي يناسب المرحلة الحالية ولم يظهر مؤخراً
  const currentQuestion = useMemo(() => {
    let pool = QUESTION_BANK.filter(
      q => q.difficulty === currentDifficulty && !usedQuestionIds.includes(q.id)
    );
    if (pool.length === 0) {
      pool = QUESTION_BANK.filter(q => q.difficulty === currentDifficulty);
    }
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex] || QUESTION_BANK[0];
  }, [currentDifficulty, usedQuestionIds]);

  const currentLandmark = UAE_LANDMARKS[flagLevel] || UAE_LANDMARKS[0];

  // منح النقاط في Supabase عند وصول العلم للقمة
  useEffect(() => {
    if (isVictory && !pointsAwarded) {
      setPointsAwarded(true);
      playTone('victory');

      const awardPointsToStudent = async () => {
        try {
          const storedUser = localStorage.getItem('current_user');
          const userType = localStorage.getItem('user_type');
          if (userType === 'student' && storedUser) {
            const parsed = JSON.parse(storedUser);
            if (parsed?.student_id) {
              const { data: st } = await supabase
                .from('students')
                .select('points')
                .eq('student_id', parsed.student_id)
                .single();
              if (st) {
                const newPoints = (Number(st.points) || 0) + 100;
                await supabase
                  .from('students')
                  .update({ points: newPoints })
                  .eq('student_id', parsed.student_id);
              }
            }
          }
        } catch (err) {
          console.error('Error awarding Flag Day points:', err);
        }
      };

      void awardPointsToStudent();
    }
  }, [isVictory, pointsAwarded]);

  const handleOptionSelect = (index: number) => {
    if (isAnswered || isVictory) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.correct;
    if (isCorrect) {
      setLastResult('correct');
      setCorrectAnswersCount(prev => prev + 1);
      playTone('up');
      const nextLvl = Math.min(MAX_LEVEL, flagLevel + 1);
      setFlagLevel(nextLvl);

      if (nextLvl === MAX_LEVEL) {
        setTimeout(() => {
          setIsVictory(true);
        }, 1200);
        return;
      }
    } else {
      setLastResult('wrong');
      playTone('down');
      setFlagLevel(prev => Math.max(0, prev - 1));
    }
  };

  const handleNextQuestion = () => {
    setUsedQuestionIds(prev => [...prev, currentQuestion.id]);
    setSelectedOption(null);
    setIsAnswered(false);
    setLastResult(null);
  };

  const handleRestart = () => {
    setFlagLevel(0);
    setUsedQuestionIds([]);
    setSelectedOption(null);
    setIsAnswered(false);
    setLastResult(null);
    setIsVictory(false);
    setCorrectAnswersCount(0);
    setPointsAwarded(false);
  };

  // حساب النسبة المئوية لارتفاع العلم على الساري
  const flagHeightPercent = Math.round((flagLevel / MAX_LEVEL) * 84) + 6;

  return (
    <div
      dir="rtl"
      className="min-h-[100dvh] w-full bg-[#f0f4f8] dark:bg-[#0f172a] text-slate-800 dark:text-slate-100 font-sans p-3 sm:p-6 md:p-8 flex items-center justify-center relative overflow-hidden select-none"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
        * { font-family: 'Cairo', sans-serif !important; }

        @keyframes waveFlag {
          0%, 100% { transform: perspective(400px) rotateY(0deg) skewY(0deg); }
          25% { transform: perspective(400px) rotateY(-8deg) skewY(2deg); }
          50% { transform: perspective(400px) rotateY(4deg) skewY(-2deg); }
          75% { transform: perspective(400px) rotateY(-5deg) skewY(1deg); }
        }
        @keyframes fireworkBurst {
          0% { transform: scale(0.1); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes floatCloud {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(-18px); }
        }
        .animate-wave-flag {
          animation: waveFlag 2.6s ease-in-out infinite;
          transform-origin: right center;
        }
        .animate-firework {
          animation: fireworkBurst 1.8s ease-out infinite;
        }
        .animate-cloud {
          animation: floatCloud 6s ease-in-out infinite;
        }
      `}</style>

      {/* شريط ألوان علم الإمارات العلوي */}
      <div className="fixed top-0 left-0 right-0 h-2.5 flex z-50 shadow-md">
        <div className="bg-[#ff0000] w-1/4"></div>
        <div className="bg-[#00732f] w-1/4"></div>
        <div className="bg-white w-1/4"></div>
        <div className="bg-black w-1/4"></div>
      </div>

      {/* الحاوية الرئيسية بنفس الهوية البصرية للمنصة */}
      <div className="max-w-6xl w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700/70 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row relative z-10">

        {/* ================= القسم الأيمن: ساري العلم ومعالم الإمارات وخلفية الأبراج ================= */}
        <div className="lg:w-1/2 min-h-[460px] sm:min-h-[540px] lg:min-h-[650px] relative overflow-hidden flex flex-col justify-between p-6 bg-gradient-to-b from-[#0b1528] via-[#1a2c54] to-[#f59e0b]/25 text-white border-b lg:border-b-0 lg:border-l border-slate-200 dark:border-slate-800">
          
          {/* نجوم وسحب خفيفة في سماء الإمارات */}
          <div className="absolute inset-0 pointer-events-none opacity-60">
            <div className="absolute top-8 left-12 w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
            <div className="absolute top-20 right-16 w-2 h-2 bg-amber-300 rounded-full animate-pulse"></div>
            <div className="absolute top-32 left-1/3 w-1.5 h-1.5 bg-sky-200 rounded-full animate-ping"></div>
            <div className="absolute top-14 right-1/3 text-2xl opacity-30 animate-cloud">☁️</div>
            <div className="absolute top-28 left-10 text-3xl opacity-20 animate-cloud">☁️</div>
          </div>

          {/*🎆 الألعاب النارية الاحتفالية عند الوصول للقمة 🎆 */}
          {isVictory && (
            <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
              <div className="absolute top-12 left-1/4 w-24 h-24 rounded-full border-4 border-dashed border-red-500 animate-firework"></div>
              <div className="absolute top-20 right-1/4 w-28 h-28 rounded-full border-4 border-dotted border-emerald-400 animate-firework" style={{ animationDelay: '0.4s' }}></div>
              <div className="absolute top-36 left-1/3 w-20 h-20 rounded-full border-4 border-dashed border-amber-300 animate-firework" style={{ animationDelay: '0.8s' }}></div>
              <div className="absolute top-16 right-1/3 w-24 h-24 rounded-full border-4 border-dotted border-white animate-firework" style={{ animationDelay: '1.1s' }}></div>
            </div>
          )}

          {/* الهيدر المصغر فوق الساري */}
          <div className="relative z-20 flex items-center justify-between bg-slate-900/60 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
            <div className="flex items-center gap-2.5">
              <img src="/school-logo.png" alt="EFIPS" className="w-9 h-9 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <div>
                <div className="text-[11px] text-amber-300 font-bold">مدرسة صقر الإمارات الدولية الخاصة</div>
                <div className="text-xs sm:text-sm font-black text-white">رحلة رفع العلم إلى قمة برج خليفة</div>
              </div>
            </div>
            <div className="text-left">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-black text-xs">
                المستوى {flagLevel} / {MAX_LEVEL}
              </span>
            </div>
          </div>

          {/* منطقة الساري والمعالم المتدرجة */}
          <div className="relative flex-1 my-4 flex items-end justify-center">
            
            {/* قائمة المعالم المتدرجة في الخلفية من الأسفل (0) إلى الأعلى (7 - برج خليفة) */}
            <div className="absolute inset-y-4 left-2 right-2 flex flex-col justify-between pointer-events-none z-10">
              {[...UAE_LANDMARKS].reverse().map((lm) => {
                const isReached = flagLevel >= lm.level;
                const isCurrent = flagLevel === lm.level;
                return (
                  <div
                    key={lm.level}
                    className={`flex items-center justify-between px-3 py-1 rounded-xl transition-all duration-500 ${
                      isCurrent
                        ? 'bg-amber-400/25 border border-amber-300 scale-[1.02] shadow-lg'
                        : isReached
                        ? 'bg-emerald-500/15 border border-emerald-400/30 opacity-90'
                        : 'bg-slate-900/30 border border-white/5 opacity-45'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg">{lm.icon}</span>
                      <div>
                        <span className={`text-xs sm:text-sm font-black ${isCurrent ? 'text-amber-300' : 'text-white'}`}>
                          {lm.name}
                        </span>
                        <span className="text-[10px] text-slate-300 mr-1.5">({lm.city})</span>
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-xs font-mono font-bold text-sky-200 bg-slate-900/50 px-2 py-0.5 rounded-lg">
                      {lm.heightLabel}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* مجسم برج خليفة الشامخ في قلب الخلفية */}
            <svg
              viewBox="0 0 200 500"
              className="w-44 sm:w-52 h-full max-h-[430px] opacity-25 pointer-events-none select-none z-0"
              fill="currentColor"
            >
              {/* قمة وإبرة برج خليفة */}
              <rect x="98" y="5" width="4" height="55" className="text-amber-300" />
              <polygon points="100,45 90,120 110,120" />
              <rect x="86" y="120" width="28" height="60" />
              <rect x="78" y="180" width="44" height="70" />
              <rect x="68" y="250" width="64" height="80" />
              <rect x="56" y="330" width="88" height="85" />
              <rect x="40" y="415" width="120" height="85" />
            </svg>

            {/* ================= ساري العلم والعلم المتحرك ================= */}
            <div className="relative h-full min-h-[360px] sm:min-h-[420px] flex items-end justify-center z-20 mr-16 sm:mr-24">
              {/* عمود الساري المعدني الفضي/الذهبي */}
              <div className="w-2.5 sm:w-3 h-[92%] bg-gradient-to-r from-slate-300 via-white to-slate-400 rounded-t-full shadow-[0_0_20px_rgba(255,255,255,0.6)] relative">
                {/* الكرة الذهبية في قمة الساري */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-200 shadow-[0_0_15px_#fbbf24] border border-white"></div>

                {/* العلم الإماراتي المرفرف (يرتفع وينخفض بسلاسة حسب الإجابات) */}
                <div
                  style={{ bottom: `${flagHeightPercent}%` }}
                  className="absolute left-2.5 sm:left-3 transition-all duration-700 ease-out flex items-center"
                >
                  {/* حبل الربط بالساري */}
                  <div className="w-1.5 h-10 flex flex-col justify-between py-0.5">
                    <div className="w-2 h-1 bg-amber-300 rounded-full"></div>
                    <div className="w-2 h-1 bg-amber-300 rounded-full"></div>
                  </div>

                  {/* تصميم علم الإمارات بأبعاده الرسمية (الأحمر بجهة الساري + الأخضر والأبيض والأسود) */}
                  <div className="w-28 h-14 sm:w-36 sm:h-18 rounded-l-md overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.45)] border border-white/30 flex animate-wave-flag">
                    {/* القسم الأحمر المحاذي للساري */}
                    <div className="w-1/4 h-full bg-[#FF0000]"></div>
                    {/* الأقسام الأفقية الثلاثة */}
                    <div className="w-3/4 h-full flex flex-col">
                      <div className="w-full h-1/3 bg-[#00732F]"></div>
                      <div className="w-full h-1/3 bg-[#FFFFFF]"></div>
                      <div className="w-full h-1/3 bg-[#000000]"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* قاعدة الساري الرخامية */}
              <div className="absolute bottom-0 w-16 h-4 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 rounded-t-lg shadow-lg"></div>
            </div>
          </div>

          {/* شريط المعلم الحالي أسفل الساري */}
          <div className="relative z-20 bg-slate-900/75 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{currentLandmark.icon}</span>
              <div>
                <div className="text-[11px] text-slate-300 font-bold">موقع العلم الآن:</div>
                <div className="text-sm sm:text-base font-black text-amber-300">
                  {currentLandmark.name} - {currentLandmark.city}
                </div>
              </div>
            </div>
            <div className="text-left">
              <div className="text-[11px] text-slate-400 font-bold">المرحلة</div>
              <div className="text-xs font-black text-white">
                {currentDifficulty === 'easy' ? '🟢 المبتدئة' : currentDifficulty === 'medium' ? '🟡 المتوسطة' : '🔴 المتقدمة (القمة)'}
              </div>
            </div>
          </div>
        </div>

        {/* ================= القسم الأيسر: الأسئلة والتفاعل أو شاشة الفوز الاحتفالية ================= */}
        <div className="lg:w-1/2 p-6 sm:p-10 flex flex-col justify-between bg-white dark:bg-slate-900 relative">
          
          {/* شريط العنوان العلوي وأزرار التحكم */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-emerald-600 via-slate-800 to-rose-600 dark:from-emerald-400 dark:via-white dark:to-rose-400 bg-clip-text text-transparent">
                تحدي راية المجد 🇦🇪
              </h1>
              <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                أجب بشكل صحيح ليرتفع العلم خطوة حتى يعانق قمة برج خليفة!
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 font-black text-xs transition-all"
              >
                ✕ إغلاق
              </button>
            )}
          </div>

          {!isVictory ? (
            /* ================= واجهة الأسئلة التفاعلية ================= */
            <div className="flex-1 flex flex-col justify-between space-y-5">
              
              {/* شريط التقدم ومستوى الصعوبة */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-600 dark:text-slate-300">درجة الصعوبة:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black ${
                      currentDifficulty === 'easy'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : currentDifficulty === 'medium'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                    }`}
                  >
                    {currentDifficulty === 'easy'
                      ? 'سهلة (بداية الصعود)'
                      : currentDifficulty === 'medium'
                      ? 'متوسطة (معانقة الأبراج)'
                      : 'متقدمة (قمة برج خليفة)'}
                  </span>
                </div>

                <div className="text-xs font-black text-blue-600 dark:text-blue-400">
                  باقي {MAX_LEVEL - flagLevel} خطوات للقمة 🚀
                </div>
              </div>

              {/* صندوق السؤال مع شخصية صقر */}
              <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/50 dark:from-slate-800 dark:to-slate-800/60 border-2 border-blue-200/80 dark:border-slate-700 p-5 sm:p-6 rounded-[2rem] shadow-sm relative">
                <div className="flex items-start gap-3.5">
                  <img
                    src="/saqr-full.png"
                    alt="صقر"
                    className="w-12 h-12 sm:w-14 sm:h-14 object-contain shrink-0 drop-shadow-md"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-900 dark:text-white leading-relaxed">
                    {currentQuestion.question}
                  </h2>
                </div>
              </div>

              {/* الخيارات الأربعة */}
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option, idx) => {
                  let btnClass =
                    'bg-slate-50 dark:bg-slate-800/90 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-blue-500 hover:bg-blue-50/40';

                  if (isAnswered) {
                    if (idx === currentQuestion.correct) {
                      btnClass =
                        'bg-emerald-500 border-2 border-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-[1.01]';
                    } else if (selectedOption === idx) {
                      btnClass =
                        'bg-rose-500 border-2 border-rose-600 text-white shadow-lg shadow-rose-500/20';
                    } else {
                      btnClass =
                        'bg-slate-100 dark:bg-slate-800/40 border-2 border-slate-200 dark:border-slate-800 text-slate-400 opacity-55';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleOptionSelect(idx)}
                      className={`w-full p-4 rounded-2xl font-black text-sm sm:text-base text-right transition-all duration-200 flex items-center justify-between active:scale-[0.99] ${btnClass}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-black/10 dark:bg-white/10 flex items-center justify-center text-xs font-mono">
                          {idx + 1}
                        </span>
                        <span>{option}</span>
                      </span>

                      {isAnswered && idx === currentQuestion.correct && (
                        <span className="text-xs sm:text-sm font-black bg-white/20 px-2.5 py-1 rounded-lg">
                          ⬆️ ارتفع العلم!
                        </span>
                      )}
                      {isAnswered && selectedOption === idx && idx !== currentQuestion.correct && (
                        <span className="text-xs sm:text-sm font-black bg-white/20 px-2.5 py-1 rounded-lg">
                          ⬇️ نزل خطوة
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* صندوق المعلومة الإثرائية وزر السؤال التالي */}
              {isAnswered && (
                <div
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    lastResult === 'correct'
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200'
                  }`}
                >
                  <div className="font-black text-xs sm:text-sm mb-1">
                    {lastResult === 'correct'
                      ? '🎉 إجابة صحيحة! ارتفع العلم درجة نحو قمة برج خليفة.'
                      : '⚠️ إجابة غير صحيحة! نزل العلم درجة، حاول في السؤال القادم.'}
                  </div>
                  <p className="text-xs font-bold opacity-90 leading-relaxed mb-3">
                    💡 {currentQuestion.fact}
                  </p>
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-xl text-xs sm:text-sm shadow-md transition-all"
                  >
                    السؤال التالي ⬅️
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ================= شاشة النصر والاحتفال: دام عزك يا علم ================= */
            <div className="flex-1 flex flex-col items-center justify-center text-center py-6 space-y-5 animate-fade-in">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-500 via-amber-400 to-rose-500 p-1 shadow-2xl animate-bounce">
                  <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-5xl">
                    🇦🇪
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-black text-xs">
                  🏆 وصلت إلى قمة برج خليفة (828 متراً)
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-emerald-600 to-slate-900 dark:from-red-400 dark:via-emerald-400 dark:to-white py-2">
                  دام عزك يا علم!
                </h2>
                <p className="text-sm sm:text-base font-bold text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                  أحسنت يا بطل! بفضل معرفتك الوطنية، ارتفعت راية الاتحاد عالياً لتعانق السحاب فوق قمة برج خليفة.
                </p>
              </div>

              {/* بطاقة الجوائز والنقاط */}
              <div className="w-full max-w-md bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-800 dark:to-slate-800/70 border-2 border-emerald-500/50 p-5 rounded-3xl shadow-lg space-y-2">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">مكافأة التحدي الوطني</div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  +100 نقطة مكتبية 🌟
                </div>
                <div className="text-xs font-black text-slate-700 dark:text-slate-200">
                  🎖️ وسام «فارس الراية الإماراتية» ({correctAnswersCount} إجابات صحيحة)
                </div>
              </div>

              <div className="flex gap-3 w-full max-w-md pt-2">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-2xl shadow-lg transition-all text-sm"
                >
                  🔄 العب مرة أخرى بأسئلة جديدة
                </button>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="px-6 py-4 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-black rounded-2xl text-sm transition-all"
                  >
                    العودة
                  </button>
                )}
              </div>
            </div>
          )}

          {/* تذييل الصفحة */}
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span>ارفعه عالياً ليبقى شامخاً 🇦🇪</span>
            <span>المكتبة الذكية - مدرسة صقر الإمارات الدولية الخاصة</span>
          </div>
        </div>

      </div>
    </div>
  );
}
