import { IELTS_RESOURCES } from '../data/ieltsResources';

export type IeltsSelfTestSkill = 'listening' | 'reading' | 'writing' | 'speaking' | 'mixed';
export type IeltsSelfTestLocale = 'ar' | 'en';

export const IELTS_SELF_TEST_CHOICES: ReadonlyArray<{
  id: IeltsSelfTestSkill; ar: string; en: string;
}> = [
  {id:'listening',ar:'الاستماع',en:'Listening'},
  {id:'reading',ar:'القراءة',en:'Reading'},
  {id:'writing',ar:'الكتابة',en:'Writing'},
  {id:'speaking',ar:'المحادثة',en:'Speaking'},
  {id:'mixed',ar:'اختبار شامل',en:'Mixed practice'},
];

/**
 * IELTS-only preparation text is submitted as an ordinary user message to
 * the *existing* Saqr send handler. No system prompts, providers, teacher
 * workflows, story challenges or catalog routing are modified.
 *
 * PDFs are not imported as text: references are verified Drive catalog
 * METADATA only. Do not claim questions were extracted from PDF pages.
 */
export function ieltsSaqrPracticeRequest(
  skill: IeltsSelfTestSkill,
  locale: IeltsSelfTestLocale
): string {
  const selected = IELTS_SELF_TEST_CHOICES.find(item => item.id === skill);
  if (!selected) throw new Error('UNKNOWN_IELTS_SKILL');

  const list = IELTS_RESOURCES.map(item =>
    item.title + (item.track === 'general' ? ' [General Training]' : '')
  ).join('؛ ');
  const count = IELTS_RESOURCES.length;
  const isAr = locale === 'ar';

  // These prompts never ask Saqr to find a catalog title or claim access to
  // private PDF pages. Questions must be original and clearly non-official.
  return isAr
    ? 'أريد تدريب IELTS تفاعليًا في مهارة ' + selected.ar + '. هذا تدريب تعليمي وليس طلب بحث في فهارس المكتبة. ' +
      'مركز IELTS المدرسي لديه ' + count + ' مرجع PDF؛ قائمة المراجع المسجلة: ' + list + '. ' +
      'استخدم هذه القائمة للاستدلال على نطاق التحضير ومهارات IELTS، لكن لا تدّعي أنك قرأت صفحات PDF أو استخرجت أسئلة من أي مرجع لم يصل نصه إليك. ' +
      'أنشئ أسئلة أصلية غير منسوخة من الامتحانات، واستخدم الإنجليزية في نصوص الأسئلة والنماذج والإجابات، والعربية الإماراتية المبسطة في الحوار معي. ' +
      'ابدأ بسؤالي هل أستعد لـ Academic أم General Training وما الدرجة المستهدفة، وانتظر إجابتي، ثم اسأل سؤالاً واحدًا في كل رسالة، ' +
      'صححني بدقة واشرح لي أخطائي قبل التالي. لا تمنح درجة IELTS رسمية. ' +
      (skill === 'listening'
        ? 'ملفات الصوت غير موجودة ضمن جرد المركز الحالي؛ لا تدّعي تشغيل صوت، وسمّ التمرين محاكاة فهم نص مكتوب بدل اختبار استماع حقيقي. '
        : '') +
      (skill === 'speaking'
        ? 'إذا أجبت كتابةً فلا تدّعي تقييم النطق أو الطلاقة الصوتية. '
        : '') +
      (skill === 'mixed'
        ? 'وزع التدريب على القراءة والكتابة والاستماع والمحادثة بالتتابع، مع مراعاة غياب الصوت. '
        : '')
    : 'I want an interactive IELTS ' + selected.en + ' self-test. This is learning practice, not a request to search library holdings. ' +
      'The school IELTS center has ' + count + ' indexed PDF references: ' + list + '. ' +
      'Use the inventory to guide IELTS skill coverage, but do not claim to have read PDF pages or reproduced questions from texts you have not received. ' +
      'Create original, unofficial practice questions. First ask if I am preparing for Academic or General Training and my target band; wait for my answer. ' +
      'Then test me with ONE question per turn, explain any mistakes, and progress naturally. Do not claim an official IELTS band score. ' +
      (skill === 'listening'
        ? 'No separate audio files are listed in the school inventory. Do not pretend to play audio; label any written-transcript activity as text-based comprehension rather than a real listening test. '
        : '') +
      (skill === 'speaking'
        ? 'If I answer in writing, do not claim to assess spoken pronunciation or audio fluency. '
        : '') +
      (skill === 'mixed'
        ? 'Mix reading, writing, listening strategy and speaking practice, making clear when audio is unavailable. '
        : '');
}

export function ieltsSaqrOpening(locale: IeltsSelfTestLocale): string {
  return locale === 'ar'
    ? 'هلا بك في اختبار IELTS مع صقر! تبا تختبر نفسك في الاستماع، ولا القراءة، ولا الكتابة، ولا المحادثة؟ أو تفضّل اختبار شامل؟'
    : 'Welcome to IELTS practice with Saqr! Would you like to test your listening, reading, writing or speaking skills—or try a mixed practice session?';
}
