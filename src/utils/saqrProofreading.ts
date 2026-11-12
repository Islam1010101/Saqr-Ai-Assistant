/**
 * Editorial QA guidance for Saqr's EXISTING AI call.
 * No second provider invocation, no student-text rewriting, and no changes
 * to catalogue, Little Author award rules or lesson structure.
 */
export type SaqrProofreadingContext={
  locale:'ar'|'en';
  creativeTurn:boolean;
  lessonTurn:boolean;
  explicitReview:boolean;
};

export const isSaqrLessonPreparationRequest=(input:string):boolean=>
  /(?:تحضير\s*(?:درس|حصة|حصه)|خطة\s*(?:درس|حصة|حصه)|تحضير\s*الدرس|تحضير\s*الدروس|جهز\s*(?:لي\s*)?(?:درس|حصة)|حضّر\s*(?:لي\s*)?(?:درس|حصة)|lesson\s*(?:plan|prepar(?:ation|e))|prepar(?:e|ing)\s+(?:a\s+)?lesson|teaching\s*plan|lesson\s*objectives)/i.test(input);

export const isSaqrExplicitProofreadingRequest=(input:string):boolean=>
  /(?:دق[قك]\s*(?:لي\s*)?(?:املائيا|إملائي(?:ا|ً)?|لغويا|لغوي(?:ا|ً)?)|تدقيق\s*(?:إملائي|املائي|لغوي|نحوي)|صح[حح]\s*(?:لي\s*)?(?:الاخطاء|الأخطاء|الإملاء|الاملاء|اللغة)|راجع\s*(?:لي\s*)?(?:اللغة|الإملاء|الاملاء|النص|القصة|الدرس)|أخطاء\s*(?:إملائية|املائية|نحوية|لغوية)|proofread|spell[\s-]?check|grammar[\s-]?check|check\s+(?:my\s+)?(?:spelling|grammar|writing)|correct\s+(?:my\s+)?(?:spelling|grammar|text))/i.test(input);

export function saqrProofreadingInstructions(ctx:SaqrProofreadingContext):string{
  const ar=ctx.locale==='ar';
  const rules=[
    'SAQR BILINGUAL LANGUAGE QUALITY: Before responding, silently review YOUR OWN generated Arabic/English text for spelling, grammar, punctuation, subject-verb agreement and clarity. Keep exact book titles, student names, school names, quoted user text and curriculum terminology unchanged. Never pretend linguistic correctness is mechanically guaranteed.',
    ar
      ? 'Arabic outputs: use correct Arabic orthography (hamza, ta marbuta, alif maqsura), agreement, punctuation and legible word spacing. Formal academic writing, authored story prose and certificate synopses must be Modern Standard Arabic (الفصحى). Only everyday dialogue and feedback can use a light, natural Emirati dialect.'
      : 'English outputs: use accurate English spelling, tense, agreement and punctuation; keep natural age-appropriate vocabulary and consistent school terminology.',
    'Only point out errors actually present in USER writing, with their original fragment and a minimal suggested correction. Never fabricate mistakes, criticize stylistic choices as errors, or silently rewrite what a student authored.'
  ];
  if(ctx.creativeTurn)rules.push(ar
    ? 'LITTLE AUTHOR PROOFREADING: Inspect only the latest student story contribution. If it has genuine spelling/grammar errors, give a brief Emirati-language note such as «هني خطأ بسيط: "..." والصحيح "..."»، listing the actual correction(s) only. Do not rewrite the student sentence or replace their ideas. Then add exactly ONE new imaginative, grammatically correct story sentence in Arabic FUSHA. If no genuine errors, do not mention proofreading at all; simply continue the story sentence. The certificate summary must be correctly proofread Arabic FUSHA.'
    : 'LITTLE AUTHOR PROOFREADING: Check only the student’s latest English story contribution. If there are genuine grammar/spelling errors, briefly show the exact original phrase → corrected phrase, without rewriting their plot. Then add exactly ONE vivid new English story sentence. If no actual mistakes, skip the correction note entirely. Proofread the final certificate synopsis in English.');
  if(ctx.lessonTurn)rules.push(ar
    ? 'TEACHER LESSON QUALITY CONTROL: Review the entire generated lesson plan silently BEFORE presenting it. Use formal, correct Arabic FUSHA for the lesson text, objectives, lesson stages, tasks, learner outcomes and assessment; ensure Bloom-verb wording, consistent terminology, clear punctuation and no English-language grammar errors in any accompanying bilingual segments. Preserve objectives and facts; do not introduce invented curriculum citations.'
    : 'TEACHER LESSON QUALITY CONTROL: Silently proofread every part of the generated English lesson plan—learning objectives, Bloom verbs, outcomes, instructions, differentiation and assessment—before presenting the final organized plan. Use correct English grammar, spelling and consistent terminology without inventing curriculum sources.');
  if(ctx.explicitReview)rules.push(ar
    ? 'EXPLICIT PROOFREADING REQUEST: Identify the genuine spelling and grammatical errors in the text supplied by the user, quoting each short original and its corrected form, then offer a cleaned-up copy only when the user asks for a corrected version. Leave correct passages and all proper names intact. Explain in short Emirati conversational Arabic, but write any corrected formal text in Arabic FUSHA.'
    : 'EXPLICIT PROOFREADING REQUEST: Identify real spelling and grammar mistakes from the supplied text, show original → correction for each, and only provide a fully rewritten corrected passage when requested. Keep proper names and the student’s voice intact.');
  return rules.join('\n');
}
