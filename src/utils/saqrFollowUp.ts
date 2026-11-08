import { isStoryBeginning } from './saqrLearning.ts';

/**
 * Presentation-only final sentence for normal Saqr chat replies.
 * Never change content, call the model, or affect any existing feature.
 * In particular, Little Author's one-sentence/no-question rule and its
 * certificate conversation are intentionally protected.
 */
export type SaqrFollowUpKind =
  'auto' | 'introduction' | 'catalog' | 'named-book' | 'identity' |
  'schedule' | 'reading-list' | 'research' | 'tutoring' | 'lesson' | 'discussion' | 'error';

export type SaqrFollowUpOptions = {
  locale: 'ar' | 'en';
  question: string;
  history?: ReadonlyArray<{ role: string; content: string }>;
  kind?: SaqrFollowUpKind;
};

export function isProtectedSaqrStory(
  question: string,
  history: ReadonlyArray<{ role: string; content: string }> = []
): boolean {
  return isStoryBeginning(question) ||
    history.some(turn => turn.role === 'user' && isStoryBeginning(turn.content));
}

export function endsWithSaqrQuestion(reply: string): boolean {
  // Formatting marks may follow a real final question, but a question
  // earlier in a paragraph does not count as the ending.
  const end = String(reply || '').trimEnd()
    .replace(/(?:\*\*|__|[*_\x60"'”»)\]])+$/g, '').trimEnd();
  return /[؟?]$/.test(end);
}

const arQuestions: Record<Exclude<SaqrFollowUpKind, 'auto'>, string> = {
  introduction: 'ما أول شيء تحب أن أساعدك فيه داخل المكتبة؟',
  catalog: 'هل ترغب في أن أساعدك في اختيار كتاب من النتائج أو البحث عن موضوع آخر؟',
  'named-book': 'هل تحب أن نتناقش في فكرة من هذا الكتاب أو نبحث عن كتب مشابهة؟',
  identity: 'هل ترغب في استكشاف كتاب آخر من كتب الهوية الوطنية؟',
  schedule: 'ما اليوم ورقم الحصة اللذان يناسبانك؟',
  'reading-list': 'هل تحب أن نختار كتابًا مناسبًا لقراءته بعد ذلك؟',
  research: 'ما الفكرة التي ترغب في التعمق فيها من هذا البحث؟',
  tutoring: 'ما الخطوة التي تريد أن نتأكد من فهمها معًا؟',
  lesson: 'هل ترغب في تخصيص الأنشطة لتناسب المستوى الدراسي لطلابك؟',
  discussion: 'ما رأيك في هذه الفكرة، ولماذا؟',
  error: 'هل ترغب في إعادة المحاولة؟'
};
const enQuestions: Record<Exclude<SaqrFollowUpKind, 'auto'>, string> = {
  introduction: 'What would you like me to help you with first?',
  catalog: 'Would you like help choosing one of these books or exploring another subject?',
  'named-book': 'Would you like to discuss an idea from this book or explore similar titles?',
  identity: 'Would you like to explore another book about UAE national identity?',
  schedule: 'Which day and class period would work best for you?',
  'reading-list': 'Would you like help choosing what to read next?',
  research: 'Which idea from this research would you like to explore further?',
  tutoring: 'Which step would you like us to check together?',
  lesson: 'Would you like to tailor the activities to your students’ grade level?',
  discussion: 'What do you think about this idea, and why?',
  error: 'Would you like to try again?'
};

function relevantKind(question: string): Exclude<SaqrFollowUpKind, 'auto'> | null {
  if (/(?:تحضير\s*(?:درس|حصة)|خطة\s*درس|عرض\s*تقديمي|lesson\s*plan|presentation\s*(?:slides|structure))/i.test(question))
    return 'lesson';
  if (/(?:بحث\s*(?:علمي|دراسي|مدرسي)|research\s*(?:paper|project|report))/i.test(question))
    return 'research';
  if (/(?:واجب|مس[أا]لة|معادلة|homework|solve\s*(?:this|the)|math\s*problem)/i.test(question))
    return 'tutoring';
  if (/(?:نتناقش|نناقش|ناقشني|خلينا\s*نتكلم|discuss|discussion|debate)/i.test(question))
    return 'discussion';
  if (/(?:كتاب|الكتاب|رواي[ةه]|قص[ةه]|\bbook\b|\bnovel\b)/i.test(question))
    return 'named-book';
  return null;
}

export function withSaqrFollowUpQuestion(reply: string, options: SaqrFollowUpOptions): string {
  if (!reply?.trim() || isProtectedSaqrStory(options.question, options.history) ||
      reply.includes('[WINNER:') || endsWithSaqrQuestion(reply))
    return reply;

  const kind = options.kind && options.kind !== 'auto'
    ? options.kind : relevantKind(options.question);
  const ar = options.locale === 'ar';
  const followUp = kind
    ? (ar ? arQuestions[kind] : enQuestions[kind])
    : ar
      ? 'ما الجانب الذي ترغب في استكشافه أكثر؟'
      : 'Which part would you like to explore further?';

  // Add one question ONLY, at the end. Retain every original word, link and
  // Markdown section of the response, including source/availability evidence.
  return reply.trimEnd() + '\n\n' + followUp;
}
