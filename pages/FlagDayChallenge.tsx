import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { supabase } from '../src/utils/supabase';

type Difficulty = 'easy' | 'medium' | 'hard';

type FlagQuestion = {
  id: number;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correct: number;
  fact: string;
};

type LandmarkLevel = {
  level: number;
  name: string;
  city: string;
  heightLabel: string;
  icon: string;
};

type StoredStudent = Record<string, unknown> & {
  student_id?: string | number;
  points?: number | string | null;
};

const MAX_LEVEL = 7;

const UAE_LANDMARKS: LandmarkLevel[] = [
  { level: 0, name: 'قلعة الجاهلي', city: 'العين', heightLabel: 'نقطة الانطلاق', icon: '🏰' },
  { level: 1, name: 'جامع الشيخ زايد الكبير', city: 'أبوظبي', heightLabel: 'المحطة الأولى', icon: '🕌' },
  { level: 2, name: 'متحف المستقبل', city: 'دبي', heightLabel: 'المحطة الثانية', icon: '🏛️' },
  { level: 3, name: 'برواز دبي', city: 'دبي', heightLabel: 'المحطة الثالثة', icon: '🖼️' },
  { level: 4, name: 'برج العرب', city: 'دبي', heightLabel: 'المحطة الرابعة', icon: '⛵' },
  { level: 5, name: 'أبراج الاتحاد', city: 'أبوظبي', heightLabel: 'المحطة الخامسة', icon: '🏙️' },
  { level: 6, name: 'أبراج الإمارات', city: 'دبي', heightLabel: 'قبل القمة', icon: '🏢' },
  { level: 7, name: 'قمة برج خليفة', city: 'دبي', heightLabel: '828 متراً – قمة المجد', icon: '✨' },
];

const QUESTION_BANK: FlagQuestion[] = [
  { id: 1, difficulty: 'easy', question: 'في أي تاريخ تحتفل دولة الإمارات العربية المتحدة بـ «يوم العلم» من كل عام؟', options: ['3 نوفمبر', '2 ديسمبر', '1 يناير', '30 نوفمبر'], correct: 0, fact: 'يوافق يوم العلم 3 نوفمبر من كل عام، وهو مناسبة للتعبير عن الولاء والانتماء للوطن.' },
  { id: 2, difficulty: 'easy', question: 'كم يبلغ عدد ألوان علم دولة الإمارات العربية المتحدة؟', options: ['3 ألوان', '4 ألوان', '5 ألوان', 'لونان'], correct: 1, fact: 'يتكون العلم من أربعة ألوان: الأحمر والأخضر والأبيض والأسود.' },
  { id: 3, difficulty: 'easy', question: 'ما لون الجزء العمودي المجاور لسارية العلم؟', options: ['الأخضر', 'الأسود', 'الأحمر', 'الأبيض'], correct: 2, fact: 'الجزء العمودي الملاصق للسارية أحمر، وتمتد إلى جانبه الأشرطة الأفقية الخضراء والبيضاء والسوداء.' },
  { id: 4, difficulty: 'easy', question: 'في أي ساعة تُرفع الأعلام في المؤسسات المشاركة في فعالية يوم العلم؟', options: ['8:00 صباحاً', '10:00 صباحاً', '11:00 صباحاً', '12:00 ظهراً'], correct: 2, fact: 'ترتبط فعالية يوم العلم برفع العلم في تمام الساعة 11 صباحاً.' },
  { id: 5, difficulty: 'easy', question: 'ما اللون الذي يتوسط الأشرطة الأفقية الثلاثة في علم الإمارات؟', options: ['الأبيض', 'الأخضر', 'الأسود', 'الأحمر'], correct: 0, fact: 'يأتي الشريط الأبيض بين الأخضر في الأعلى والأسود في الأسفل.' },
  { id: 6, difficulty: 'easy', question: 'في أي عام رُفع علم دولة الإمارات مع إعلان قيام الاتحاد؟', options: ['1968', '1971', '1975', '1980'], correct: 1, fact: 'أُعلن قيام دولة الإمارات العربية المتحدة في 2 ديسمبر 1971.' },
  { id: 7, difficulty: 'easy', question: 'أي عبارة تعبّر عن الاعتزاز براية الإمارات؟', options: ['ارفعه عالياً ليبقى شامخاً', 'علمنا في قلوبنا فقط', 'راية البحر', 'فوق السحاب دائماً'], correct: 0, fact: 'تعكس العبارة الاعتزاز بالعلم والحرص على بقائه شامخاً.' },
  { id: 8, difficulty: 'easy', question: 'ما اللون الموجود في الجزء العلوي الأفقي من علم الإمارات؟', options: ['الأحمر', 'الأخضر', 'الأبيض', 'الأسود'], correct: 1, fact: 'الشريط العلوي من العلم أخضر.' },
  { id: 9, difficulty: 'medium', question: 'من هو مصمم علم دولة الإمارات العربية المتحدة؟', options: ['عبدالله محمد المعينة', 'أحمد بن سليم', 'راشد المخاوي', 'سعيد بن غباش'], correct: 0, fact: 'صمّم العلم عبدالله محمد المعينة، وفاز تصميمه في المسابقة التي أُعلنت عام 1971.' },
  { id: 10, difficulty: 'medium', question: 'من هو القائد المؤسس الذي رفع علم دولة الإمارات لأول مرة؟', options: ['الشيخ زايد بن سلطان آل نهيان', 'الشيخ راشد بن سعيد آل مكتوم', 'الشيخ خليفة بن زايد آل نهيان', 'الشيخ خالد بن محمد'], correct: 0, fact: 'رفع المغفور له الشيخ زايد بن سلطان آل نهيان علم الاتحاد عند إعلان قيام الدولة.' },
  { id: 11, difficulty: 'medium', question: 'أين رُفع علم الإمارات مع إعلان الاتحاد عام 1971؟', options: ['قصر الحصن في أبوظبي', 'دار الاتحاد في دبي', 'قلعة الجاهلي في العين', 'ساحة الوصل'], correct: 1, fact: 'شهدت دار الاتحاد في دبي لحظة إعلان قيام دولة الإمارات ورفع علمها.' },
  { id: 12, difficulty: 'medium', question: 'ألوان العلم الأربعة مستلهمة من بيت شعر شهير لأي شاعر؟', options: ['أبو الطيب المتنبي', 'صفي الدين الحلي', 'أحمد شوقي', 'حسان بن ثابت'], correct: 1, fact: 'يرتبط اختيار الألوان ببيت صفي الدين الحلي: «بيضٌ صنائعنا، سودٌ وقائعنا، خضرٌ مرابعنا، حمرٌ مواضينا».' },
  { id: 13, difficulty: 'medium', question: 'إلى ماذا يرتبط اللون الأسود في دلالات ألوان العلم؟', options: ['النفط والثروة فقط', 'القوة والمنعة وشدة البأس', 'الليل والهدوء', 'الجبال الشاهقة'], correct: 1, fact: 'يُربط اللون الأسود في البيت الشعري بالقوة والوقائع، وليس بالنفط وحده.' },
  { id: 14, difficulty: 'medium', question: 'من أطلق مبادرة الاحتفال بـ «يوم العلم» عام 2013؟', options: ['الشيخ محمد بن راشد آل مكتوم', 'الشيخ خليفة بن زايد آل نهيان', 'الشيخ سلطان القاسمي', 'الشيخ حمدان بن محمد'], correct: 0, fact: 'أُطلقت مبادرة يوم العلم في عام 2013 بمبادرة من صاحب السمو الشيخ محمد بن راشد آل مكتوم.' },
  { id: 15, difficulty: 'medium', question: 'ما المعنى الأقرب لعبارة «بيضٌ صنائعنا» في البيت الشعري المرتبط بألوان العلم؟', options: ['أعمال الخير والسلام والعطاء', 'الرمال البيضاء', 'الملابس الرسمية', 'اللؤلؤ الطبيعي'], correct: 0, fact: '«صنائعنا» تعني أعمالنا ومآثرنا، وترتبط العبارة بالخير والعطاء.' },
  { id: 16, difficulty: 'medium', question: 'ما اسم النشيد الوطني لدولة الإمارات؟', options: ['عيشي بلادي', 'موطني', 'حماة الحمى', 'دار زايد'], correct: 0, fact: '«عيشي بلادي» هو السلام الوطني لدولة الإمارات العربية المتحدة.' },
  { id: 17, difficulty: 'hard', question: 'من كتب كلمات النشيد الوطني «عيشي بلادي»؟', options: ['مانع سعيد العتيبة', 'عارف الشيخ عبدالله الحسن', 'سعد جمعة', 'سلطان بن علي العويس'], correct: 1, fact: 'كتب كلمات النشيد الوطني الدكتور عارف الشيخ عبدالله الحسن.' },
  { id: 18, difficulty: 'hard', question: 'ما النسبة القياسية لطول علم الإمارات إلى عرضه؟', options: ['الطول ضعف العرض (2:1)', 'الطول يساوي العرض (1:1)', 'ثلاثة أضعاف العرض (3:1)', 'مرة ونصف (1.5:1)'], correct: 0, fact: 'تكون نسبة طول العلم إلى عرضه 2:1.' },
  { id: 19, difficulty: 'hard', question: 'ما نسبة عرض الجزء الأحمر العمودي إلى طول العلم الكلي؟', options: ['نصف طول العلم', 'ربع طول العلم', 'ثلث طول العلم', 'خُمس طول العلم'], correct: 1, fact: 'يشغل الجزء الأحمر العمودي ربع طول العلم، وتمتد الأشرطة الأفقية على بقية المساحة.' },
  { id: 20, difficulty: 'hard', question: 'كم بلغ عدد التصاميم المشاركة في مسابقة تصميم علم الإمارات عام 1971؟', options: ['نحو 100 تصميم', 'نحو 500 تصميم', '1030 تصميماً', '3000 تصميم'], correct: 2, fact: 'تذكر الروايات التاريخية أن المسابقة استقبلت 1030 تصميماً.' },
  { id: 21, difficulty: 'hard', question: 'لماذا اختير يوم 3 نوفمبر للاحتفال بيوم العلم؟', options: ['تزامناً مع ذكرى تولي الشيخ خليفة بن زايد رئاسة الدولة', 'ذكرى إعلان مسابقة التصميم', 'ذكرى افتتاح برج خليفة', 'اليوم الوطني الأول'], correct: 0, fact: 'يتزامن يوم 3 نوفمبر مع ذكرى تولي المغفور له الشيخ خليفة بن زايد آل نهيان رئاسة الدولة عام 2004.' },
  { id: 22, difficulty: 'hard', question: 'ما أهم ما يجب مراعاته عند تعليق العلم عمودياً؟', options: ['اتباع الاتجاه المعتمد للألوان كما في الدليل الرسمي', 'جعل الأحمر في الأسفل دائماً', 'وضع الأسود على السارية', 'أنه لا يجوز تعليقه عمودياً مطلقاً'], correct: 0, fact: 'عند عرض العلم عمودياً ينبغي الالتزام بالاتجاه المعتمد في الدليل الرسمي لرفع وعرض العلم.' },
  { id: 23, difficulty: 'hard', question: 'في أي صحيفة نُشر إعلان مسابقة تصميم علم الإمارات عام 1971؟', options: ['جريدة الاتحاد', 'جريدة الخليج', 'جريدة البيان', 'جريدة الوحدة'], correct: 0, fact: 'نُشر إعلان المسابقة في جريدة الاتحاد، وشارك فيها عبدالله محمد المعينة.' },
  { id: 24, difficulty: 'hard', question: 'في أي إمارة تقع جزيرة العلم التي تضم سارية وطنية بارزة؟', options: ['الشارقة', 'عجمان', 'الفجيرة', 'أم القيوين'], correct: 0, fact: 'تقع جزيرة العلم في إمارة الشارقة وتضم سارية علم وطنية بارزة.' },
];

function getDifficulty(level: number): Difficulty {
  if (level <= 2) return 'easy';
  if (level <= 4) return 'medium';
  return 'hard';
}

function pickQuestion(level: number, usedIds: number[]): FlagQuestion {
  const difficulty = getDifficulty(level);
  let pool = QUESTION_BANK.filter((question) => question.difficulty === difficulty && !usedIds.includes(question.id));
  if (pool.length === 0) pool = QUESTION_BANK.filter((question) => question.difficulty === difficulty);
  return pool[Math.floor(Math.random() * pool.length)] ?? QUESTION_BANK[0];
}

function getNameFromRecord(record: Record<string, unknown> | null | undefined): string | null {
  if (!record) return null;
  const keys = ['student_name', 'full_name', 'fullName', 'arabic_name', 'display_name', 'name', 'student_full_name'];
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  const first = [record['first_name'], record['given_name']].find((value) => typeof value === 'string' && value.trim());
  const last = [record['last_name'], record['family_name']].find((value) => typeof value === 'string' && value.trim());
  const composed = [first, last].filter((value): value is string => typeof value === 'string' && Boolean(value.trim())).join(' ').trim();
  return composed || null;
}

function getCachedStudent(): StoredStudent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem('current_user');
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as StoredStudent) : null;
  } catch {
    return null;
  }
}

function playTone(type: 'up' | 'down' | 'victory') {
  try {
    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const notes = type === 'up'
      ? [523.25, 659.25, 783.99]
      : type === 'down'
        ? [350, 260]
        : [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
    const start = context.currentTime;
    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const at = start + index * (type === 'victory' ? 0.13 : 0.09);
      oscillator.type = type === 'down' ? 'sine' : 'triangle';
      oscillator.frequency.setValueAtTime(frequency, at);
      gain.gain.setValueAtTime(type === 'down' ? 0.065 : 0.095, at);
      gain.gain.exponentialRampToValueAtTime(0.001, at + (type === 'victory' ? 0.34 : 0.24));
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(at);
      oscillator.stop(at + (type === 'victory' ? 0.35 : 0.25));
    });
    window.setTimeout(() => { void context.close().catch(() => undefined); }, 1600);
  } catch {
    // الصوت تحسين اختياري؛ تستمر اللعبة حتى إذا منع المتصفح تشغيله.
  }
}

interface FlagDayChallengeProps {
  onClose?: () => void;
}

export default function FlagDayChallenge({ onClose }: FlagDayChallengeProps) {
  const [flagLevel, setFlagLevel] = useState(0);
  const [usedQuestionIds, setUsedQuestionIds] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<FlagQuestion>(() => pickQuestion(0, []));
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);
  const [isVictory, setIsVictory] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [studentName, setStudentName] = useState('بطل الراية');
  const [awardStatus, setAwardStatus] = useState<'idle' | 'saving' | 'saved' | 'unavailable' | 'error'>('idle');
  const awardStarted = useRef(false);
  const victoryTimer = useRef<number | null>(null);

  const currentDifficulty = getDifficulty(flagLevel);
  const currentLandmark = UAE_LANDMARKS[flagLevel] ?? UAE_LANDMARKS[0];
  const flagHeightPercent = 4 + (flagLevel / MAX_LEVEL) * 72;
  const progressPercent = Math.round((flagLevel / MAX_LEVEL) * 100);

  const difficultyLabel = useMemo(() => {
    if (currentDifficulty === 'easy') return 'سهلة · بداية الصعود';
    if (currentDifficulty === 'medium') return 'متوسطة · بين المعالم';
    return 'متقدمة · الاقتراب من القمة';
  }, [currentDifficulty]);

  useEffect(() => {
    let alive = true;
    const loadStudentName = async () => {
      const cached = getCachedStudent();
      const cachedName = getNameFromRecord(cached);
      if (cachedName && alive) setStudentName(cachedName);
      if (typeof window === 'undefined' || window.localStorage.getItem('user_type') !== 'student' || !cached?.student_id) return;
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('student_id', cached.student_id)
          .maybeSingle();
        if (!error && data && alive) {
          const databaseName = getNameFromRecord(data as Record<string, unknown>);
          if (databaseName) setStudentName(databaseName);
        }
      } catch (error) {
        console.error('Could not load student name for Flag Day Challenge:', error);
      }
    };
    void loadStudentName();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!isVictory || awardStarted.current) return;
    awardStarted.current = true;
    playTone('victory');
    setAwardStatus('saving');

    const awardPointsToStudent = async () => {
      try {
        if (typeof window === 'undefined' || window.localStorage.getItem('user_type') !== 'student') {
          setAwardStatus('unavailable');
          return;
        }
        const cached = getCachedStudent();
        if (!cached?.student_id) {
          setAwardStatus('unavailable');
          return;
        }
        const { data: student, error: readError } = await supabase
          .from('students')
          .select('*')
          .eq('student_id', cached.student_id)
          .maybeSingle();
        if (readError || !student) {
          console.error('Could not read student record for Flag Day points:', readError);
          setAwardStatus('error');
          return;
        }
        const databaseName = getNameFromRecord(student as Record<string, unknown>);
        if (databaseName) setStudentName(databaseName);
        const currentPoints = Number((student as StoredStudent).points) || 0;
        const { error: updateError } = await supabase
          .from('students')
          .update({ points: currentPoints + 100 })
          .eq('student_id', cached.student_id);
        if (updateError) {
          console.error('Could not update student points for Flag Day Challenge:', updateError);
          setAwardStatus('error');
          return;
        }
        setAwardStatus('saved');
      } catch (error) {
        console.error('Error awarding Flag Day points:', error);
        setAwardStatus('error');
      }
    };

    void awardPointsToStudent();
  }, [isVictory]);

  useEffect(() => () => {
    if (victoryTimer.current !== null) window.clearTimeout(victoryTimer.current);
  }, []);

  const handleOptionSelect = (index: number) => {
    if (isAnswered || isVictory) return;
    setSelectedOption(index);
    setIsAnswered(true);
    const isCorrect = index === currentQuestion.correct;

    if (isCorrect) {
      setLastResult('correct');
      setCorrectAnswersCount((previous) => previous + 1);
      playTone('up');
      const nextLevel = Math.min(MAX_LEVEL, flagLevel + 1);
      setFlagLevel(nextLevel);
      if (nextLevel === MAX_LEVEL) {
        victoryTimer.current = window.setTimeout(() => setIsVictory(true), 900);
      }
    } else {
      setLastResult('wrong');
      playTone('down');
      setFlagLevel((previous) => Math.max(0, previous - 1));
    }
  };

  const handleNextQuestion = () => {
    const nextUsed = usedQuestionIds.includes(currentQuestion.id)
      ? usedQuestionIds
      : [...usedQuestionIds, currentQuestion.id];
    setUsedQuestionIds(nextUsed);
    setCurrentQuestion(pickQuestion(flagLevel, nextUsed));
    setSelectedOption(null);
    setIsAnswered(false);
    setLastResult(null);
  };

  const handleFeedbackAction = () => {
    if (flagLevel === MAX_LEVEL) {
      if (victoryTimer.current !== null) window.clearTimeout(victoryTimer.current);
      victoryTimer.current = null;
      setIsVictory(true);
      return;
    }
    handleNextQuestion();
  };

  const handleRestart = () => {
    if (victoryTimer.current !== null) window.clearTimeout(victoryTimer.current);
    victoryTimer.current = null;
    awardStarted.current = false;
    setFlagLevel(0);
    setUsedQuestionIds([]);
    setCurrentQuestion(pickQuestion(0, []));
    setSelectedOption(null);
    setIsAnswered(false);
    setLastResult(null);
    setIsVictory(false);
    setCorrectAnswersCount(0);
    setAwardStatus('idle');
  };

  return (
    <div className="flag-game" dir="rtl">
      <style>{`
        .flag-game{--page:#edf3f6;--panel:#ffffff;--panel-soft:#f6f9fb;--ink:#172638;--muted:#637487;--line:#dce5eb;--accent:#087e58;--accent2:#0d9a6a;--gold:#f6c453;--shadow:0 24px 75px rgba(22,43,65,.17);min-height:100dvh;padding:clamp(10px,2.3vw,28px);display:flex;align-items:center;justify-content:center;background:radial-gradient(ellipse at 8% 8%,rgba(14,165,119,.10),transparent 28%),radial-gradient(ellipse at 95% 90%,rgba(246,196,83,.17),transparent 30%),var(--page);color:var(--ink);font-family:Tahoma,Arial,sans-serif;box-sizing:border-box;isolation:isolate}
        .flag-game *{box-sizing:border-box}
        /* يرث المكوّن الوضع الداكن من إعدادات الموقع بدلاً من امتلاك زر تبديل مستقل. */
        .dark .flag-game, html.dark .flag-game, body.dark .flag-game, [data-theme="dark"] .flag-game, .flag-game.dark, .flag-game[data-theme="dark"]{--page:#0b1220;--panel:#111c2d;--panel-soft:#152237;--ink:#f2f7fb;--muted:#a5b5c8;--line:#283a50;--accent:#34d399;--accent2:#10b981;--gold:#f7cc70;--shadow:0 24px 75px rgba(0,0,0,.36);background:radial-gradient(ellipse at 8% 8%,rgba(16,185,129,.10),transparent 28%),radial-gradient(ellipse at 95% 90%,rgba(246,196,83,.08),transparent 30%),var(--page)}
        .fg-ribbon{position:fixed;z-index:20;top:0;left:0;right:0;height:7px;display:flex;box-shadow:0 2px 12px #0002}.fg-ribbon span{flex:1}.fg-ribbon .r{background:#ff0000}.fg-ribbon .g{background:#00732f}.fg-ribbon .w{background:#fff}.fg-ribbon .b{background:#000}
        .fg-shell{width:min(1380px,100%);min-height:min(850px,calc(100dvh - 40px));display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);background:var(--panel);border:1px solid var(--line);border-radius:30px;overflow:hidden;box-shadow:var(--shadow);position:relative}
        .fg-scene{min-height:750px;position:relative;overflow:hidden;color:#fff;background:linear-gradient(180deg,#102c50 0%,#1d5273 40%,#eea65e 100%);padding:22px;display:flex;flex-direction:column;justify-content:space-between;isolation:isolate}
        .fg-scene:before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(circle at 78% 20%,rgba(255,242,190,.5),transparent 17%),linear-gradient(0deg,rgba(4,18,37,.42),transparent 55%)}
        .fg-stars{position:absolute;inset:0;pointer-events:none;opacity:.75;background-image:radial-gradient(circle,#fff 1px,transparent 1.7px),radial-gradient(circle,#ffe8a4 1px,transparent 1.7px);background-size:83px 91px,131px 117px;background-position:7px 13px,42px 23px;animation:fg-twinkle 3.6s ease-in-out infinite alternate}
        .fg-cloud{position:absolute;color:#eaf6ff;opacity:.17;font-size:50px;animation:fg-drift 11s ease-in-out infinite}.fg-cloud.c1{top:17%;left:8%}.fg-cloud.c2{top:30%;right:6%;font-size:38px;animation-delay:-5s}
        .fg-scene-head{z-index:4;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 15px;border:1px solid #ffffff35;border-radius:19px;background:#06192b77;backdrop-filter:blur(12px)}
        .fg-school-brand{display:flex;align-items:center;gap:10px;min-width:0}.fg-school-mark{flex:0 0 37px;height:37px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(145deg,#0bb981,#f2c451);color:#0b2a30;font-size:20px;box-shadow:0 5px 18px #0002}.fg-school-name{font-size:11px;color:#f8d78a;font-weight:900;line-height:1.6}.fg-scene-title{font-size:13px;font-weight:900;line-height:1.5}.fg-level-pill{white-space:nowrap;border:1px solid #7ee5b49c;background:#0e9b6755;color:#d6ffeb;padding:8px 11px;border-radius:999px;font-size:11px;font-weight:900}
        .fg-visual{position:relative;flex:1;min-height:475px;margin:12px -7px 8px;overflow:hidden}.fg-skyline{position:absolute;inset:0;width:100%;height:100%;z-index:0}.fg-pole{position:absolute;left:17%;bottom:5%;height:82%;width:12px;z-index:3;filter:drop-shadow(4px 5px 4px #09152755)}.fg-pole-shaft{position:absolute;inset:0 3px 0 3px;border-radius:99px 99px 2px 2px;background:linear-gradient(90deg,#a8b8c7,#fff 35%,#dce4ec 66%,#8596a8);box-shadow:0 0 17px #d7ecff55}.fg-pole-tip{position:absolute;top:-12px;left:50%;transform:translateX(-50%);width:19px;height:19px;border-radius:50%;background:radial-gradient(circle at 30% 25%,#fff5c2,#e5a52c 53%,#8c4d12);border:1px solid #ffedac;z-index:2}.fg-flag-holder{position:absolute;left:8px;width:clamp(120px,15vw,176px);height:clamp(61px,7.6vw,88px);display:flex;align-items:stretch;filter:drop-shadow(0 10px 9px #0005);transition:bottom 900ms cubic-bezier(.2,.8,.2,1);transform-origin:left center;z-index:3}.fg-flag-ties{position:absolute;left:-6px;top:7px;bottom:7px;width:7px;display:flex;flex-direction:column;justify-content:space-between}.fg-flag-ties span{height:5px;border-radius:4px;background:#f7cf69;box-shadow:0 0 4px #f7cf69}.fg-flag{display:flex;direction:ltr;width:100%;height:100%;overflow:hidden;border:1px solid #ffffff80;border-radius:2px 8px 8px 2px;animation:fg-flag-wave 2.4s ease-in-out infinite;transform-origin:left center}.fg-flag-red{width:25%;height:100%;background:#ff0000;flex-shrink:0}.fg-flag-stripes{width:75%;display:flex;flex-direction:column}.fg-flag-stripes span{height:33.333%;width:100%}.fg-flag-stripes .green{background:#00732f}.fg-flag-stripes .white{background:#fff}.fg-flag-stripes .black{background:#000}
        .fg-pole-base{position:absolute;left:calc(17% - 14px);bottom:4%;z-index:4;width:39px;height:23px;border-radius:7px 7px 3px 3px;background:linear-gradient(90deg,#98672e,#f6d071 45%,#b17a32);box-shadow:0 7px 0 #663f20,0 12px 17px #08172855}.fg-loc-tag{position:absolute;z-index:2;right:2%;top:43%;max-width:43%;padding:10px 12px;border:1px solid #ffffff55;background:#06192b70;backdrop-filter:blur(9px);border-radius:14px;box-shadow:0 6px 20px #07182d22}.fg-loc-tag small{display:block;color:#d0e3ef;font-size:10px;font-weight:800;margin-bottom:4px}.fg-loc-tag strong{display:block;color:#ffe093;font-size:12px;line-height:1.7}
        .fg-step-track{position:absolute;top:10%;right:2%;bottom:18%;width:4px;border-radius:10px;background:#ffffff42;z-index:1}.fg-step-fill{position:absolute;bottom:0;right:0;width:100%;background:linear-gradient(#ffe59b,#22d69a);border-radius:10px;transition:height 800ms ease}.fg-step-dots{position:absolute;inset:10% 0 18%;display:flex;flex-direction:column;justify-content:space-between;align-items:center;z-index:2}.fg-step-dots span{width:12px;height:12px;border-radius:50%;border:2px solid #f2fbff;background:#537c91;box-shadow:0 2px 6px #07182d55;transition:all .35s}.fg-step-dots span.done{background:#45e0a6;border-color:#e4fff2;box-shadow:0 0 0 4px #45e0a633}.fg-step-dots span.current{background:#ffd268;border-color:#fff5ca;transform:scale(1.35);box-shadow:0 0 0 5px #ffd26844}
        .fg-scene-foot{z-index:4;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 15px;border:1px solid #ffffff38;border-radius:18px;background:#07172b99;backdrop-filter:blur(10px)}.fg-scene-foot small{display:block;color:#c5d6e4;font-size:10px;font-weight:800;margin-bottom:3px}.fg-scene-foot strong{font-size:12px;line-height:1.7;color:#ffe19a}.fg-mini-progress{min-width:78px;text-align:left}.fg-mini-progress strong{font-size:20px;color:#fff}.fg-mini-progress small{font-size:10px}
        .fg-panel{padding:clamp(19px,3vw,36px);display:flex;flex-direction:column;min-width:0;background:var(--panel);color:var(--ink)}.fg-panel-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding-bottom:20px;margin-bottom:20px;border-bottom:1px solid var(--line)}.fg-title-wrap{min-width:0}.fg-title{font-size:clamp(22px,2.2vw,32px);font-weight:1000;line-height:1.35;letter-spacing:-.5px;margin:0;background:linear-gradient(95deg,#0b9967,#08734f 53%,#d89f37);-webkit-background-clip:text;background-clip:text;color:transparent}.dark .flag-game .fg-title,html.dark .flag-game .fg-title,body.dark .flag-game .fg-title,[data-theme="dark"] .flag-game .fg-title,.flag-game.dark .fg-title,.flag-game[data-theme="dark"] .fg-title{background-image:linear-gradient(95deg,#5ee8af,#b5f5dc 53%,#ffd77b)}.fg-subtitle{margin:7px 0 0;color:var(--muted);font-size:12px;font-weight:700;line-height:1.9}.fg-head-actions{display:flex;gap:7px;align-items:center;flex-shrink:0}.fg-close-btn{padding:0 11px;height:39px;border:1px solid var(--line);border-radius:12px;background:var(--panel-soft);color:var(--muted);font-size:11px;font-weight:900;cursor:pointer}
        .fg-stats{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px}.fg-stat{border:1px solid var(--line);border-radius:16px;padding:12px 14px;background:var(--panel-soft)}.fg-stat-line{display:flex;justify-content:space-between;align-items:center;gap:10px;font-size:11px;font-weight:900;color:var(--muted)}.fg-stat strong{color:var(--ink);font-size:13px}.fg-difficulty{padding:5px 9px;border-radius:99px;font-size:10px;font-weight:900;white-space:nowrap}.fg-difficulty.easy{background:#d9fbe8;color:#087147}.fg-difficulty.medium{background:#fff0c5;color:#8c5b00}.fg-difficulty.hard{background:#ffe0e0;color:#a32626}.dark .flag-game .fg-difficulty.easy,html.dark .flag-game .fg-difficulty.easy,body.dark .flag-game .fg-difficulty.easy,[data-theme="dark"] .flag-game .fg-difficulty.easy,.flag-game.dark .fg-difficulty.easy,.flag-game[data-theme="dark"] .fg-difficulty.easy{background:#124632;color:#9af1c2}.dark .flag-game .fg-difficulty.medium,html.dark .flag-game .fg-difficulty.medium,body.dark .flag-game .fg-difficulty.medium,[data-theme="dark"] .flag-game .fg-difficulty.medium,.flag-game.dark .fg-difficulty.medium,.flag-game[data-theme="dark"] .fg-difficulty.medium{background:#4a3713;color:#ffe09a}.dark .flag-game .fg-difficulty.hard,html.dark .flag-game .fg-difficulty.hard,body.dark .flag-game .fg-difficulty.hard,[data-theme="dark"] .flag-game .fg-difficulty.hard,.flag-game.dark .fg-difficulty.hard,.flag-game[data-theme="dark"] .fg-difficulty.hard{background:#4e242a;color:#ffb9c0}.fg-progress{height:8px;border-radius:99px;background:var(--line);overflow:hidden;margin-top:10px}.fg-progress-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,#0d9b67,#77d5a7,#f5c45d);transition:width 700ms ease}
        .fg-question-card{position:relative;border:1px solid color-mix(in srgb,var(--accent) 23%,var(--line));background:linear-gradient(140deg,color-mix(in srgb,var(--accent) 7%,var(--panel)),var(--panel-soft));border-radius:23px;padding:20px 19px;margin-bottom:16px;overflow:hidden}.fg-question-card:after{content:"؟";position:absolute;left:13px;bottom:-37px;font-size:110px;line-height:1;color:var(--accent);opacity:.055;font-weight:1000;pointer-events:none}.fg-question-label{display:flex;align-items:center;gap:8px;color:var(--accent);font-size:11px;font-weight:1000;margin-bottom:10px}.fg-question-label span{display:grid;place-items:center;width:29px;height:29px;border-radius:10px;color:white;background:linear-gradient(145deg,#0ba36d,#08734f);box-shadow:0 5px 12px #00865b26}.fg-question-text{position:relative;z-index:1;font-size:clamp(15px,1.55vw,19px);font-weight:950;line-height:2;margin:0;color:var(--ink)}
        .fg-options{display:grid;gap:10px;margin-bottom:16px}.fg-option{width:100%;min-height:56px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border-radius:16px;border:1.5px solid var(--line);background:var(--panel);color:var(--ink);font-family:inherit;text-align:right;font-size:13px;font-weight:850;line-height:1.8;cursor:pointer;transition:transform .18s,border-color .18s,background .18s,box-shadow .18s;touch-action:manipulation;-webkit-tap-highlight-color:transparent}.fg-option:not(:disabled):hover{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 5%,var(--panel));transform:translateY(-1px);box-shadow:0 5px 15px #07182d0b}.fg-option:focus-visible{outline:3px solid #21b98180;outline-offset:2px}.fg-option:disabled{cursor:default}.fg-option-leading{display:flex;align-items:center;gap:11px;min-width:0}.fg-option-number{flex:0 0 30px;width:30px;height:30px;display:grid;place-items:center;border-radius:10px;background:var(--panel-soft);border:1px solid var(--line);color:var(--muted);font-size:11px;font-weight:1000}.fg-option-text{overflow-wrap:anywhere}.fg-option.correct{background:#0f9f68;border-color:#0b8c5b;color:white;box-shadow:0 7px 18px #07955a27}.fg-option.correct .fg-option-number{background:#ffffff26;border-color:#ffffff47;color:#fff}.fg-option.wrong{background:#dc4b59;border-color:#c73547;color:white}.fg-option.wrong .fg-option-number{background:#ffffff23;border-color:#ffffff55;color:white}.fg-option.dimmed{opacity:.48}
        .fg-feedback{border-radius:17px;padding:14px 15px;border:1px solid;margin-bottom:15px;animation:fg-rise .35s ease both}.fg-feedback.good{background:color-mix(in srgb,#16a36b 8%,var(--panel));border-color:color-mix(in srgb,#16a36b 32%,var(--line))}.fg-feedback.bad{background:color-mix(in srgb,#e14754 7%,var(--panel));border-color:color-mix(in srgb,#e14754 31%,var(--line))}.fg-feedback-heading{font-size:12px;font-weight:1000;line-height:1.8;margin-bottom:5px}.fg-feedback.good .fg-feedback-heading{color:#0c9b63}.fg-feedback.bad .fg-feedback-heading{color:#d43d4b}.dark .flag-game .fg-feedback.good .fg-feedback-heading,html.dark .flag-game .fg-feedback.good .fg-feedback-heading,body.dark .flag-game .fg-feedback.good .fg-feedback-heading,[data-theme="dark"] .flag-game .fg-feedback.good .fg-feedback-heading,.flag-game.dark .fg-feedback.good .fg-feedback-heading,.flag-game[data-theme="dark"] .fg-feedback.good .fg-feedback-heading{color:#62e9b1}.dark .flag-game .fg-feedback.bad .fg-feedback-heading,html.dark .flag-game .fg-feedback.bad .fg-feedback-heading,body.dark .flag-game .fg-feedback.bad .fg-feedback-heading,[data-theme="dark"] .flag-game .fg-feedback.bad .fg-feedback-heading,.flag-game.dark .fg-feedback.bad .fg-feedback-heading,.flag-game[data-theme="dark"] .fg-feedback.bad .fg-feedback-heading{color:#ff9ba7}.fg-fact{font-size:11px;line-height:1.9;color:var(--muted);font-weight:700;margin:0 0 11px}.fg-next-btn,.fg-play-again{width:100%;border:0;border-radius:14px;min-height:47px;padding:12px 15px;color:#fff;background:linear-gradient(100deg,#087b53,#0da973);font-size:12px;font-weight:1000;cursor:pointer;box-shadow:0 8px 17px #087e5828;transition:transform .18s,filter .18s}.fg-next-btn:hover,.fg-play-again:hover{transform:translateY(-1px);filter:brightness(1.04)}
        .fg-hint{display:flex;align-items:flex-start;gap:9px;padding:12px 13px;border:1px dashed var(--line);border-radius:15px;color:var(--muted);font-size:11px;line-height:1.9;font-weight:700;margin-top:auto}.fg-hint-icon{font-size:17px;line-height:1.5}.fg-panel-foot{margin-top:22px;padding-top:13px;border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:12px;color:var(--muted);font-size:10px;font-weight:800;line-height:1.8}
        .fg-victory{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;position:relative;isolation:isolate;padding:24px 0 10px;animation:fg-rise .6s ease both}.fg-win-emblem{width:100px;height:100px;border-radius:50%;padding:5px;background:conic-gradient(#ec5147,#1aa96e,#f2c552,#ec5147);box-shadow:0 13px 35px #dca33c2b;animation:fg-win-bob 2.4s ease-in-out infinite}.fg-win-emblem-inner{width:100%;height:100%;border-radius:50%;display:grid;place-items:center;background:var(--panel);font-size:46px}.fg-victory-kicker{display:inline-flex;align-items:center;gap:7px;padding:8px 13px;border:1px solid #e6bd56;background:color-mix(in srgb,#f4c858 15%,var(--panel));color:#a77108;border-radius:99px;font-size:10px;font-weight:1000;margin-top:19px}.dark .flag-game .fg-victory-kicker,html.dark .flag-game .fg-victory-kicker,body.dark .flag-game .fg-victory-kicker,[data-theme="dark"] .flag-game .fg-victory-kicker,.flag-game.dark .fg-victory-kicker,.flag-game[data-theme="dark"] .fg-victory-kicker{color:#ffdc83}.fg-victory-title{font-size:clamp(26px,3.4vw,43px);font-weight:1000;line-height:1.5;margin:10px 0 4px;background:linear-gradient(95deg,#e53e3e,#079b63 50%,#d9a328);-webkit-background-clip:text;background-clip:text;color:transparent}.fg-victory-name{font-size:clamp(20px,2.4vw,28px);font-weight:1000;line-height:1.7;color:var(--ink);margin:3px 0}.fg-victory-copy{max-width:420px;color:var(--muted);font-size:12px;font-weight:750;line-height:2;margin:4px 0 17px}.fg-reward-card{width:100%;max-width:420px;padding:16px;border-radius:20px;border:1px solid color-mix(in srgb,var(--accent) 38%,var(--line));background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 7%,var(--panel)),var(--panel-soft));margin-bottom:17px}.fg-reward-label{font-size:10px;font-weight:900;color:var(--muted);margin-bottom:5px}.fg-reward-points{font-size:21px;font-weight:1000;color:var(--accent);line-height:1.7}.fg-award-status{font-size:10px;font-weight:800;color:var(--muted);margin-top:3px}.fg-medal{font-size:11px;font-weight:900;color:var(--ink);margin-top:6px}.fg-victory-actions{display:flex;width:100%;max-width:420px;gap:10px}.fg-victory-actions .fg-play-again{flex:1}.fg-return-btn{padding:0 17px;border:1px solid var(--line);border-radius:14px;background:var(--panel-soft);color:var(--ink);font-size:11px;font-weight:900;cursor:pointer}
        .fg-victory-banner{position:absolute;z-index:8;top:17%;left:50%;transform:translateX(-50%);width:max-content;max-width:82%;text-align:center;padding:12px 20px;border:1px solid #ffe3a6;border-radius:19px;background:#07182edb;box-shadow:0 12px 35px #06152555;animation:fg-banner-in .8s cubic-bezier(.2,.9,.2,1) both;pointer-events:none}.fg-victory-banner strong{display:block;font-size:clamp(20px,2.5vw,31px);font-weight:1000;line-height:1.45;color:#ffe6a2;text-shadow:0 2px 14px #ffbd3d44}.fg-victory-banner span{display:block;color:#e5fff3;font-size:10px;font-weight:900;margin-top:3px}.fg-fireworks{position:absolute;inset:0;z-index:6;overflow:hidden;pointer-events:none}.fg-burst{position:absolute;width:14px;height:14px;animation:fg-burst-life 2.7s ease-out infinite}.fg-spark{position:absolute;left:50%;top:50%;width:5px;height:19px;border-radius:99px;transform-origin:50% 44px;transform:translate(-50%,-50%) rotate(var(--angle)) translateY(-30px);background:#ffd66b;box-shadow:0 0 9px currentColor;animation:fg-spark-life 2.7s ease-out infinite}.fg-burst:nth-child(2) .fg-spark{background:#ff6373}.fg-burst:nth-child(3) .fg-spark{background:#69ebbb}.fg-burst:nth-child(4) .fg-spark{background:#a8dcff}.fg-burst:nth-child(5) .fg-spark{background:#fff1ab}
        @keyframes fg-flag-wave{0%,100%{transform:perspective(500px) rotateY(0) skewY(0)}25%{transform:perspective(500px) rotateY(-8deg) skewY(1.4deg)}55%{transform:perspective(500px) rotateY(5deg) skewY(-1.2deg)}78%{transform:perspective(500px) rotateY(-4deg) skewY(.8deg)}}@keyframes fg-twinkle{from{opacity:.35}to{opacity:.8}}@keyframes fg-drift{0%,100%{transform:translateX(0)}50%{transform:translateX(-20px)}}@keyframes fg-rise{from{opacity:0;transform:translateY(11px)}to{opacity:1;transform:translateY(0)}}@keyframes fg-win-bob{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-7px) rotate(3deg)}}@keyframes fg-banner-in{from{opacity:0;transform:translate(-50%,-12px) scale(.86)}to{opacity:1;transform:translate(-50%,0) scale(1)}}@keyframes fg-burst-life{0%,7%{opacity:0;transform:scale(.1)}12%{opacity:1;transform:scale(1)}62%{opacity:.85}100%{opacity:0;transform:scale(1.3)}}@keyframes fg-spark-life{0%{opacity:0}12%{opacity:1}58%{opacity:.9}100%{opacity:0}}@media(prefers-reduced-motion:reduce){.flag-game *, .flag-game *:before,.flag-game *:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}}
        @media(max-width:980px){.fg-shell{grid-template-columns:minmax(0,1fr);max-width:760px}.fg-scene{min-height:560px;order:0}.fg-panel{order:1;padding:24px}.fg-visual{min-height:390px;max-height:470px}.fg-pole{left:19%;height:79%}.fg-pole-base{left:calc(19% - 14px)}.fg-flag-holder{width:clamp(130px,23vw,175px);height:clamp(65px,11vw,86px)}.fg-loc-tag{top:40%;max-width:45%}.fg-victory-banner{top:15%}}
        @media(max-width:560px){.flag-game{padding:8px}.fg-shell{border-radius:22px;min-height:calc(100dvh - 25px)}.fg-scene{min-height:430px;padding:12px;border-radius:0}.fg-scene-head{padding:10px;border-radius:15px}.fg-school-mark{width:32px;height:32px;flex-basis:32px;font-size:17px}.fg-school-name{font-size:9px}.fg-scene-title{font-size:11px}.fg-level-pill{font-size:9px;padding:7px 8px}.fg-visual{min-height:300px;margin:7px -4px}.fg-pole{left:16%;height:80%;width:10px}.fg-pole-shaft{inset:0 2px}.fg-pole-base{left:calc(16% - 14px);bottom:3%;width:35px}.fg-flag-holder{left:7px;width:clamp(115px,37vw,150px);height:clamp(57px,18vw,72px)}.fg-loc-tag{right:0;top:42%;max-width:53%;padding:8px 9px}.fg-loc-tag small{font-size:9px}.fg-loc-tag strong{font-size:10px}.fg-step-track{right:1%;top:8%;bottom:17%}.fg-step-dots{top:8%;bottom:17%}.fg-step-dots span{width:10px;height:10px}.fg-scene-foot{padding:10px;border-radius:15px}.fg-scene-foot strong{font-size:10px}.fg-mini-progress{min-width:55px}.fg-mini-progress strong{font-size:17px}.fg-panel{padding:18px 14px 15px}.fg-panel-head{padding-bottom:15px;margin-bottom:15px;gap:7px}.fg-title{font-size:22px}.fg-subtitle{font-size:10px}.fg-head-actions{gap:5px}.fg-close-btn{height:34px;min-width:34px;border-radius:10px;font-size:14px}.fg-close-btn{padding:0 8px;font-size:10px}.fg-stats{gap:7px;margin-bottom:13px}.fg-stat{padding:10px;border-radius:13px}.fg-stat-line{font-size:9px;align-items:flex-start;flex-direction:column;gap:5px}.fg-stat strong{font-size:11px}.fg-difficulty{font-size:9px}.fg-question-card{padding:16px 14px;border-radius:18px;margin-bottom:12px}.fg-question-label{font-size:10px}.fg-question-text{font-size:15px;line-height:1.95}.fg-options{gap:8px;margin-bottom:12px}.fg-option{min-height:52px;padding:9px 10px;border-radius:14px;font-size:11px;gap:7px}.fg-option-number{flex-basis:27px;width:27px;height:27px;border-radius:9px}.fg-feedback{padding:12px;border-radius:14px}.fg-feedback-heading{font-size:11px}.fg-fact{font-size:10px}.fg-hint{font-size:10px;padding:10px;border-radius:13px}.fg-panel-foot{font-size:9px;gap:8px;margin-top:16px}.fg-victory{padding-top:12px}.fg-win-emblem{width:82px;height:82px}.fg-win-emblem-inner{font-size:38px}.fg-victory-kicker{font-size:9px;margin-top:14px}.fg-victory-title{font-size:28px}.fg-victory-name{font-size:21px}.fg-victory-copy{font-size:11px}.fg-reward-card{padding:13px}.fg-reward-points{font-size:19px}.fg-victory-actions{gap:7px}.fg-victory-actions .fg-play-again{font-size:10px;padding:10px}.fg-return-btn{padding:0 10px;font-size:10px}.fg-victory-banner{max-width:90%;top:14%;padding:8px 13px;border-radius:14px}.fg-victory-banner strong{font-size:19px}.fg-victory-banner span{font-size:9px}}
      `}</style>

      <div className="fg-ribbon" aria-hidden="true"><span className="r" /><span className="g" /><span className="w" /><span className="b" /></div>

      <main className="fg-shell">
        <section className="fg-scene" aria-label="مشهد سارية علم الإمارات ومعالم الدولة">
          <div className="fg-stars" aria-hidden="true" />
          <div className="fg-cloud c1" aria-hidden="true">☁</div>
          <div className="fg-cloud c2" aria-hidden="true">☁</div>

          {isVictory && (
            <>
              <div className="fg-fireworks" aria-hidden="true">
                {[{ left: '22%', top: '24%', delay: '0s' }, { left: '72%', top: '26%', delay: '.45s' }, { left: '48%', top: '39%', delay: '.8s' }, { left: '83%', top: '44%', delay: '1.15s' }].map((burst, burstIndex) => (
                  <div className="fg-burst" key={burstIndex} style={{ left: burst.left, top: burst.top, animationDelay: burst.delay }}>
                    {Array.from({ length: 12 }, (_, index) => (
                      <span className="fg-spark" key={index} style={{ '--angle': `${index * 30}deg`, animationDelay: burst.delay } as CSSProperties} />
                    ))}
                  </div>
                ))}
              </div>
              <div className="fg-victory-banner">
                <strong>دام عزك يا إمارات</strong>
                <span>رايتنا عالية… ومجدنا مستمر 🇦🇪</span>
              </div>
            </>
          )}

          <header className="fg-scene-head">
            <div className="fg-school-brand">
              <div className="fg-school-mark" aria-hidden="true">🇦🇪</div>
              <div>
                <div className="fg-school-name">مدرسة صقر الإمارات الدولية الخاصة</div>
                <div className="fg-scene-title">رحلة راية المجد إلى القمة</div>
              </div>
            </div>
            <div className="fg-level-pill">المستوى {flagLevel} / {MAX_LEVEL}</div>
          </header>

          <div className="fg-visual">
            <svg className="fg-skyline" viewBox="0 0 620 560" role="img" aria-label="رسم كرتوني لمعالم من دولة الإمارات" preserveAspectRatio="xMidYMax slice">
              <defs>
                <linearGradient id="fg-burj" x1="0" x2="1"><stop offset="0" stopColor="#8ec6d4"/><stop offset=".46" stopColor="#edf6ed"/><stop offset="1" stopColor="#83b8d1"/></linearGradient>
                <linearGradient id="fg-building" x1="0" x2="1"><stop offset="0" stopColor="#54859f"/><stop offset=".5" stopColor="#b4d4dc"/><stop offset="1" stopColor="#42677f"/></linearGradient>
                <linearGradient id="fg-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#467d69"/><stop offset="1" stopColor="#163e48"/></linearGradient>
              </defs>
              <circle cx="490" cy="92" r="45" fill="#ffe7a2" opacity=".58" />
              <g opacity=".4" fill="#d7eef4">
                <ellipse cx="150" cy="104" rx="54" ry="12"/><ellipse cx="178" cy="94" rx="32" ry="20"/><ellipse cx="209" cy="106" rx="36" ry="12"/>
                <ellipse cx="400" cy="147" rx="39" ry="9"/><ellipse cx="420" cy="138" rx="23" ry="15"/><ellipse cx="443" cy="148" rx="30" ry="10"/>
              </g>
              {/* أبراج المدينة البعيدة */}
              <g opacity=".72" fill="#274e6a">
                <path d="M18 475V348h20v-23h26v150z"/><path d="M68 475V375h17v-32h24v132z"/><path d="M121 475V360h30v-18h15v133z"/>
                <path d="M455 475V355h20v-27h30v147z"/><path d="M510 475V385h17v-45h27v135z"/><path d="M566 475V365h29v110z"/>
              </g>
              {/* برج خليفة الكرتوني في المنتصف */}
              <g stroke="#c9e7ed" strokeWidth="2" strokeLinejoin="round">
                <path d="M292 478 L292 402 L300 402 L300 354 L306 354 L306 310 L312 310 L312 254 L318 254 L318 195 L322 195 L322 146 L326 146 L326 104 L330 104 L330 65 L333 65 L336 17 L340 65 L343 65 L343 104 L347 104 L347 146 L351 146 L351 195 L355 195 L355 254 L361 254 L361 310 L367 310 L367 354 L374 354 L374 402 L384 402 L384 478 Z" fill="url(#fg-burj)"/>
                <path d="M319 196L357 196M313 255L362 255M306 311L367 311M300 354L374 354M293 403L383 403" stroke="#5f96aa" opacity=".8"/>
                <path d="M333 18L333 477" stroke="#fff" opacity=".48"/>
              </g>
              {/* متحف المستقبل: حلقة بيضاوية منقوشة */}
              <g transform="translate(190 379) rotate(-7)">
                <path d="M-49 89 C-73 54 -65 3 -25 -27 C8 -52 50 -38 60 -7 C69 23 47 49 27 65 L15 91 Z" fill="#d4e4de" stroke="#f6e2a6" strokeWidth="7"/>
                <path d="M-39 79 C-59 47 -52 7 -20 -16 C7 -35 39 -26 47 -4 C54 17 37 39 19 53 L7 80 Z" fill="#426d77" stroke="#8fbeb5" strokeWidth="3"/>
                <path d="M-27 4L22 31M-34 20L12 46M-14 -10L34 12M-42 39L0 63" stroke="#f1e3ad" strokeWidth="3" opacity=".9"/>
              </g>
              {/* برواز دبي */}
              <g transform="translate(75 363)">
                <path d="M0 120V0H83V120H65V18H18V120Z" fill="#f7d171" stroke="#fff0bb" strokeWidth="3"/>
                <rect x="-9" y="115" width="101" height="12" rx="3" fill="#d49a3f"/>
                <path d="M17 22H66M17 36H66M17 50H66" stroke="#b17d36" strokeWidth="3" opacity=".7"/>
              </g>
              {/* برج العرب */}
              <g transform="translate(431 346)">
                <path d="M29 136 L39 42 Q42 13 73 0 Q96 31 91 74 L101 136Z" fill="#f2eee0" stroke="#fff" strokeWidth="3"/>
                <path d="M45 130L51 49Q55 27 72 15Q82 45 81 76L87 130Z" fill="#4aa5b1"/>
                <path d="M39 42L70 58L91 74" stroke="#fff0c5" strokeWidth="4" fill="none"/>
                <path d="M29 136H101" stroke="#dbbb75" strokeWidth="7"/>
              </g>
              {/* جامع بقبة ومآذن */}
              <g transform="translate(508 390)">
                <path d="M0 86V36H115V86Z" fill="#e8e2cc" stroke="#fff" strokeWidth="2"/>
                <path d="M23 37Q56 -7 89 37Z" fill="#f7f0dd" stroke="#fff" strokeWidth="2"/>
                <path d="M18 35V0H25V35M91 35V-9H98V35" fill="#f2ead6" stroke="#fff" strokeWidth="2"/>
                <path d="M9 86V56Q15 42 21 56V86M45 86V55Q56 39 67 55V86M87 86V56Q93 42 99 56V86" fill="#4b8490"/>
              </g>
              {/* قاعدة المدينة */}
              <path d="M0 475 Q120 456 240 476 T480 471 T620 471V560H0Z" fill="url(#fg-ground)"/>
              <path d="M0 495 Q130 477 260 498 T520 493 T620 493" fill="none" stroke="#8ac9a0" strokeWidth="4" opacity=".65"/>
              <g fill="#234d46">
                <path d="M0 484l13-45 13 45zM12 484l18-59 18 59zM576 490l18-53 18 53zM595 490l13-37 12 37z"/>
              </g>
              <g fill="#f7ca6b" opacity=".9"><circle cx="49" cy="512" r="2"/><circle cx="142" cy="522" r="2"/><circle cx="449" cy="518" r="2"/><circle cx="555" cy="506" r="2"/></g>
            </svg>

            <div className="fg-step-track" aria-hidden="true"><div className="fg-step-fill" style={{ height: `${progressPercent}%` }} /></div>
            <div className="fg-step-dots" aria-hidden="true">
              {UAE_LANDMARKS.slice().reverse().map((landmark) => {
                const reached = flagLevel >= landmark.level;
                const current = flagLevel === landmark.level;
                return <span key={landmark.level} className={`${reached ? 'done' : ''} ${current ? 'current' : ''}`} />;
              })}
            </div>

            <div className="fg-pole" aria-label={`ارتفاع العلم: المستوى ${flagLevel} من ${MAX_LEVEL}`}>
              <div className="fg-pole-shaft" />
              <div className="fg-pole-tip" />
              <div className="fg-flag-holder" style={{ bottom: `${flagHeightPercent}%` }}>
                <div className="fg-flag-ties" aria-hidden="true"><span /><span /></div>
                <div className="fg-flag" aria-label="علم دولة الإمارات العربية المتحدة">
                  <div className="fg-flag-red" />
                  <div className="fg-flag-stripes"><span className="green" /><span className="white" /><span className="black" /></div>
                </div>
              </div>
            </div>
            <div className="fg-pole-base" aria-hidden="true" />

            <div className="fg-loc-tag">
              <small>المحطة الحالية · {currentLandmark.city}</small>
              <strong>{currentLandmark.icon} {currentLandmark.name}</strong>
            </div>
          </div>

          <footer className="fg-scene-foot">
            <div><small>هدف الرحلة</small><strong>ارفع العلم حتى قمة برج خليفة</strong></div>
            <div className="fg-mini-progress"><small>التقدّم</small><strong>{progressPercent}%</strong></div>
          </footer>
        </section>

        <section className="fg-panel" aria-live="polite">
          <header className="fg-panel-head">
            <div className="fg-title-wrap">
              <h1 className="fg-title">تحدّي راية المجد 🇦🇪</h1>
              <p className="fg-subtitle">أجب عن أسئلة العلم الإماراتي. الإجابة الصحيحة ترفع الراية، والخاطئة تُنزلها درجة.</p>
            </div>
            {onClose && <div className="fg-head-actions"><button className="fg-close-btn" type="button" onClick={onClose}>إغلاق ✕</button></div>}
          </header>

          {!isVictory ? (
            <>
              <div className="fg-stats">
                <div className="fg-stat">
                  <div className="fg-stat-line"><span>درجة الصعوبة</span><span className={`fg-difficulty ${currentDifficulty}`}>{difficultyLabel}</span></div>
                </div>
                <div className="fg-stat">
                  <div className="fg-stat-line"><span>المتبقي للقمة</span><strong>{MAX_LEVEL - flagLevel} {MAX_LEVEL - flagLevel === 1 ? 'خطوة' : 'خطوات'} 🚀</strong></div>
                  <div className="fg-progress" role="progressbar" aria-valuemin={0} aria-valuemax={MAX_LEVEL} aria-valuenow={flagLevel} aria-label="التقدم نحو القمة"><div className="fg-progress-fill" style={{ width: `${progressPercent}%` }} /></div>
                </div>
              </div>

              <article className="fg-question-card">
                <div className="fg-question-label"><span>؟</span> سؤال الرحلة</div>
                <h2 className="fg-question-text">{currentQuestion.question}</h2>
              </article>

              <div className="fg-options" role="group" aria-label="خيارات الإجابة">
                {currentQuestion.options.map((option, index) => {
                  let optionClass = '';
                  if (isAnswered) {
                    if (index === currentQuestion.correct) optionClass = 'correct';
                    else if (selectedOption === index) optionClass = 'wrong';
                    else optionClass = 'dimmed';
                  }
                  return (
                    <button className={`fg-option ${optionClass}`} key={`${currentQuestion.id}-${index}`} type="button" disabled={isAnswered} onClick={() => handleOptionSelect(index)}>
                      <span className="fg-option-leading"><span className="fg-option-number">{['أ', 'ب', 'ج', 'د'][index]}</span><span className="fg-option-text">{option}</span></span>
                      {isAnswered && index === currentQuestion.correct && <span aria-label="الإجابة الصحيحة">✅</span>}
                      {isAnswered && selectedOption === index && index !== currentQuestion.correct && <span aria-label="إجابة غير صحيحة">↘️</span>}
                    </button>
                  );
                })}
              </div>

              {isAnswered ? (
                <div className={`fg-feedback ${lastResult === 'correct' ? 'good' : 'bad'}`} role="status">
                  <div className="fg-feedback-heading">
                    {lastResult === 'correct'
                      ? (flagLevel === MAX_LEVEL ? '🎉 إجابة صحيحة! وصلت الراية إلى القمة!' : '🎉 أحسنت! ارتفعت الراية درجة نحو القمة.')
                      : (flagLevel === 0 ? '💪 إجابة غير صحيحة؛ العلم باقٍ عند نقطة الانطلاق. حاول مجدداً!' : '↘️ ليست الإجابة الصحيحة؛ نزل العلم درجة. لا تستسلم!')}
                  </div>
                  <p className="fg-fact">💡 معلومة مفيدة: {currentQuestion.fact}</p>
                  <button className="fg-next-btn" type="button" onClick={handleFeedbackAction}>{flagLevel === MAX_LEVEL ? 'عرض النتيجة والاحتفال 🏆' : 'السؤال التالي ←'}</button>
                </div>
              ) : (
                <div className="fg-hint"><span className="fg-hint-icon">💡</span><span>اختر إجابة واحدة. تذكّر: كل إجابة صحيحة تقرّب علم الإمارات من قمة برج خليفة، ويمكنك المحاولة من جديد بعد كل سؤال.</span></div>
              )}
            </>
          ) : (
            <div className="fg-victory">
              <div className="fg-win-emblem"><div className="fg-win-emblem-inner">🇦🇪</div></div>
              <div className="fg-victory-kicker">🏆 وصلت إلى قمة برج خليفة · 828 متراً</div>
              <h2 className="fg-victory-title">دام عزك يا إمارات</h2>
              <p className="fg-victory-name">أحسنت يا {studentName}!</p>
              <p className="fg-victory-copy">رفعت راية الاتحاد عالياً بعلمك واجتهادك. تستحق أن تحتفل بهذا الإنجاز الوطني الجميل!</p>
              <div className="fg-reward-card">
                <div className="fg-reward-label">مكافأة التحدي الوطني</div>
                <div className="fg-reward-points">{awardStatus === 'saved' ? '+100 نقطة مكتبية 🌟' : awardStatus === 'saving' ? 'جارٍ تسجيل المكافأة…' : awardStatus === 'error' ? 'تعذّر تسجيل النقاط' : awardStatus === 'unavailable' ? 'إنجاز وطني يستحق الفخر 🇦🇪' : 'إنجاز وطني يستحق الفخر 🇦🇪'}</div>
                <div className="fg-award-status">
                  {awardStatus === 'saved' ? 'تمت إضافة 100 نقطة إلى رصيدك في قاعدة بيانات المدرسة.' : awardStatus === 'saving' ? 'يتم التحقق من سجل الطالب وتحديث رصيد النقاط.' : awardStatus === 'error' ? 'تم الوصول إلى القمة، لكن لم نتمكن من تحديث النقاط. يرجى مراجعة مسؤول النظام.' : awardStatus === 'unavailable' ? 'تم إكمال التحدي. تُسجّل النقاط عند اللعب بحساب طالب مرتبط بقاعدة البيانات.' : 'اكتمل التحدي بنجاح.'}
                </div>
                <div className="fg-medal">🎖️ وسام «فارس الراية الإماراتية» · {correctAnswersCount} إجابة صحيحة</div>
              </div>
              <div className="fg-victory-actions">
                <button className="fg-play-again" type="button" onClick={handleRestart}>🔄 العب مرة أخرى</button>
                {onClose && <button className="fg-return-btn" type="button" onClick={onClose}>العودة</button>}
              </div>
            </div>
          )}

          <footer className="fg-panel-foot"><span>ارفعه عالياً ليبقى شامخاً 🇦🇪</span><span>المكتبة الذكية · مدرسة صقر الإمارات الدولية الخاصة</span></footer>
        </section>
      </main>
    </div>
  );
}
