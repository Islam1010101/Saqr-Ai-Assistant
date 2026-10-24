// Additive Saqr learning workflows: no changes to original lesson, author,
// certificate, game, or reward logic.
export type SaqrRole = 'student'|'teacher'|'admin'|'guest';
export type SaqrLearningIntent = 'research'|'tutoring'|'schedule'|'personal-library'|'none';

export const STORY_IDEAS = [
  {ar:'لغز رسالة قديمة عُثر عليها داخل قلعة الجاهلي في العين',en:'a mysterious letter discovered at Al Jahili Fort in Al Ain'},
  {ar:'مغامرة طفل يتعلم أسرار الملاحة مع جده على متن سفينة شراعية تراثية',en:'a child learning traditional navigation with a grandparent on a dhow'},
  {ar:'حكاية خيالية عن صقر يكتشف واحة سحرية ويحمي أشجار النخيل',en:'a falcon finding an enchanted oasis and protecting its palm trees'},
  {ar:'رحلة علمية يتخيل فيها الطلبة زراعة نبات إماراتي على سطح المريخ',en:'students imagining how to grow an Emirati plant on Mars'},
  {ar:'موقف طريف في مجلس العائلة أثناء تعليم ضيف معنى الضيافة الإماراتية',en:'a funny scene in a family majlis explaining Emirati hospitality'},
  {ar:'طفلة تحاول إنقاذ قطعة نسيج من السدو وتتعلم فن الحياكة التقليدي',en:'a child protecting an Al Sadu textile while learning traditional weaving'},
  {ar:'لغز اختفاء لؤلؤة في قرية ساحلية قديمة قبل رحلة غوص',en:'the mystery of a missing pearl in an old coastal diving village'},
  {ar:'قصة تعاون بين أطفال الإمارات السبع لإحياء حديقة مدرسية',en:'children from the seven emirates working to revive a school garden'},
  {ar:'حكاية مسافر يجد خريطة تقوده إلى نظام أفلاج قديم في واحة العين',en:'a traveler following a map to a traditional falaj in Al Ain'},
  {ar:'مغامرة مستقبلية لطلاب يبتكرون تقنية لترشيد المياه في الصحراء',en:'students in the future inventing a way to save desert water'},
  {ar:'قصة مشاعر عن طفل يتعلم احترام كبار السن وتوثيق ذكريات الوطن',en:'a child learning to respect elders and preserve national memories'},
  {ar:'منافسة ودية في يوم العلم تجمع بين الإبداع وحب الإمارات',en:'a friendly Flag Day contest celebrating creativity and the UAE'}
] as const;
export const storyIdeaAt=(n:number,locale:'ar'|'en'):string=>
  STORY_IDEAS[Math.abs(Math.trunc(n))%STORY_IDEAS.length][locale];

const protectedRequest=/(?:تحدي\s*المؤلف|المؤلف\s*الصغير|little author|نؤلف\s*قص|نألف\s*قص|تحضير\s*(?:درس|حصة)|خطة\s*درس|lesson\s*plan|presentation\s*(?:slides|structure)|عرض\s*تقديمي)/i;
export const isStoryBeginning=(question:string):boolean =>
  /(?:تحدي\s*المؤلف|المؤلف\s*الصغير|little author|نؤلف\s*قص[ةه]|نألف\s*قص[ةه]|ابدأ\s*قص[ةه]|let.s\s*(?:write|create)\s*(?:a\s*)?story)/i.test(question);
const research=/(?:\b(?:research\s+(?:paper|project|report)|school\s+research|write\s+(?:a\s+)?report|help (?:me )?research)\b|بحث\s*(?:دراسي|مدرسي|علمي)|(?:اكتب|اعملي|اعمل|جهز|ساعدني\s*(?:في|على))\s*(?:لي\s*)?بحث)/i;
const tutoring=/(?:\b(?:homework|math(?:s|ematics)?\s+(?:problem|question)|physics\s+(?:problem|question)|solve\s+(?:this|the)\s+(?:equation|problem)|help\s+me\s+(?:solve|understand))\b|واجب|حل\s*(?:المس[أا]لة|مسائل|السؤال)|مسائل\s*(?:رياضيات|فيزياء|حساب)|شرح\s*(?:معادلة|مس[أا]لة)|سؤال\s*(?:رياضي|فيزياء))/i;
const scheduling=/(?:حجز\s*(?:حصة|حصص|المكتبة|المكتبه)|(?:احجز|احجزلي|احجزلى|احجزهالي|احجزهالى|عايز\s*احجز|محتاج\s*احجز|عاوز\s*احجز)\s*(?:لي|لى|حصة|حصه|المكتبه|المكتبة)?|احجز\s*(?:لي\s*)?(?:حصة|المكتبة)|جدول\s*(?:حجز\s*)?(?:المكتبة|المكتبه)|book\s+(?:a\s+)?library\s+(?:period|slot|session)|library\s+(?:booking|schedule))/i;
const personal=/(?:كتبي\s*المستعارة|استعاراتي|الكتب\s*(?:اللي\s*)?(?:استعرتها|مستعيرها)|قائمة\s*القراءة|تحدي\s*القراءة\s*الشهري|الكتب\s*(?:اللي\s*)?(?:حفظتها|حاططها|أضفتها)|my\s+(?:borrowed|saved)\s+books|my\s+reading\s+(?:list|challenge))/i;
export const detectLearningIntent=(question:string,role:SaqrRole,history:Array<{role:string;content:string}>=[]):SaqrLearningIntent=>{
  if(protectedRequest.test(question)||history.some(m=>m.role==='user' && isStoryBeginning(m.content)))return 'none';
  if((role==='teacher'||role==='admin') && history.slice(-8).some(m=>m.role==='user'&&scheduling.test(m.content)) && /^(?:ال[إا]ثنين|الثلاثاء|ال[أا]ربعاء|الخميس|الجمعة|الاحد|monday|tuesday|wednesday|thursday|friday|الحصة\s*\d+|[1-8]|(?:ال[أا]ولى|الثانية|الثالثة|الرابعة|الخامسة|السادسة|السابعة|الثامنة))\b/i.test(question.trim()))return 'schedule';
  if(scheduling.test(question) && (role==='teacher'||role==='admin'))return 'schedule';
  if(personal.test(question) && (role==='student'||role==='teacher'))return 'personal-library';
  if(research.test(question))return 'research';
  if(tutoring.test(question))return 'tutoring';
  return 'none';
};
export const researchHasTopic=(question:string):boolean=> {
  const rest=question.replace(research,'').replace(/^(?:عن|حول|في|on|about|the|لي)\s*/i,'').trim();
  return rest.length>=4;
};
export const researchPdfPrompt=(locale:'ar'|'en')=>locale==='ar'
  ? 'هل ترغب أن أجهز لك هذا البحث في ملف PDF للطباعة؟ استخدم زر «تحميل البحث PDF» الظاهر أسفل الرد.'
  : 'Would you like a printable PDF of this research? Use the “Download research PDF” button below.';

const roleGuidance=(role:SaqrRole,grade:number|null):string=>
  role==='teacher'||role==='admin'?'Speak at a professional teacher level.':
  grade!==null&&grade<=5?'Use very simple sentences and one small concrete example.':
  grade!==null&&grade<=8?'Use clear examples and an age-appropriate reasoning question.':
  grade!==null?'Use intermediate and evidence-based explanations suitable for a secondary student.':
  'Use clear school-level language; the grade is unknown.';

const trustedResearchPortals=[
  'UAE government portal https://u.ae/en/',
  'UAE Ministry of Education https://www.moe.gov.ae/en/',
  'UNESCO digital library https://unesdoc.unesco.org/',
  'NASA learning resources https://www.nasa.gov/learning-resources/',
  'Library of Congress primary source collections https://www.loc.gov/programs/teachers/classroom-materials/primary-source-sets/',
  'OpenStax free textbooks https://openstax.org/subjects'
].join('\n');

export function saqrLearningInstructions(intent:SaqrLearningIntent,role:SaqrRole,grade:number|null,locale:'ar'|'en'):string{
  if(intent==='none')return '';
  const prefix='ADDITIVE SAQR STUDY HELP. Keep the original Saqr identity and all existing protected Little Author, lesson and certificate rules. Respond in '+(locale==='ar'?'Arabic':'English')+'. '+roleGuidance(role,grade)+' ';
  if(intent==='research')return prefix+
    'Help prepare a student research report with a clear title, introduction, question, organized short sections, conclusion and references. Ask for the topic if missing. State explicitly that no live web verification was performed. Never invent source titles, authors, quotes, page numbers, DOIs, dates or URLs. Include only relevant trusted institutional PORTAL links from this allowlist as starting points for the student to inspect, and distinguish them from sources actually consulted. Encourage the student to verify claims against specific pages before submission. End your substantive answer with ONE relevant learner-check question about the report topic, not a generic offer of help. The interface separately provides the PDF invitation. Trusted portal links:\n'+trustedResearchPortals;
  if(intent==='tutoring')return prefix+
    'Act as a patient math/physics/homework tutor. Identify what is asked, given values and units. Work through logical steps and show dimensional analysis where applicable; check arithmetic and plausibility. Explain the reasoning, not just a final answer. If unclear, ask for the complete problem. For subsequent learner attempts, explicitly evaluate their answer and explain any mistake before advancing. End with exactly ONE small checking question related to the just-solved problem to see if the student understands; evaluate their follow-up answer on the next turn. No fabricated sources.';
  return '';
}
