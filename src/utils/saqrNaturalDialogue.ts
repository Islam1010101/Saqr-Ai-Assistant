/**
 * Saqr Brain 2.0 pilot: resolve short book follow-ups without modifying the
 * user's actual utterance, the verified catalogue, or protected story flows.
 * Everything here is advisory context for the existing AI providers.
 */
export type SaqrDialogueTurn = {role:string;content:string};
export type SaqrFollowUpResolution = {
  searchQuery:string;
  anchoredTurn:string|null;
  continued:boolean;
};

const bookSubject = /(?:\b(?:book|books|novel|novels|reading|recommend|catalogue|catalog)\b|كتاب|كتب|الكتب|رواي[ةه]|قراءة|القراءة|رشح|اقترح|فهرس|مكتبة|المكتبة)/i;
const followUpClue = /(?:\b(?:easier|simpler|harder|more|another|similar|instead|same|those|these|that|this|it|one)\b|(?:^|\s)(?:طب|طيب|ممكن|اسهل|أسهل|اصعب|أصعب|اكتر|أكتر|غيره|غيرها|نفس|ده|دا|دي|دول|عنه|عنها|فيه|فين|حاجة)(?=\s|$|[؟?!]))/i;
const newBookTopic = /(?:كتب?|كتاب|رواي[ةه]|books?|novels?)\s+(?:عن|في|about|on)\s+(?!ه\b|ها\b)/i;
const protectedStory = /(?:تحدي\s*المؤلف|المؤلف\s*الصغير|نؤلف\s*قص[ةه]|نألف\s*قص[ةه]|ابدأ\s*قص[ةه]|little\s*author|let.s\s*(?:write|create)\s*a?\s*story)/i;

export function resolveSaqrBookFollowUp(
  question:string,history:ReadonlyArray<SaqrDialogueTurn>
):SaqrFollowUpResolution{
  const q=String(question||'').trim();
  const unchanged={searchQuery:q,anchoredTurn:null,continued:false};
  if(!q||q.length>160||protectedStory.test(q)||
    history.some(turn=>turn.role==='user'&&protectedStory.test(turn.content))||
    !followUpClue.test(q)||newBookTopic.test(q)) return unchanged;

  // Only the most recent conversational topic may be inherited. Don't reuse
  // a book query after the user switches to a lesson, homework, or new subject.
  const recent=history.filter(turn=>turn.role==='user').slice(-5);
  const last=recent[recent.length-1]?.content?.trim()||'';
  const changedTopic=/(?:اشرح|شرح|فهمني|تحضير|درس|واجب|مس[أا]لة|homework|lesson|explain)/i.test(last);
  const lastIsLinked=bookSubject.test(last)||(followUpClue.test(last)&&!changedTopic);
  if(!lastIsLinked)return unchanged;
  const prior=[...recent].reverse().find(turn=>bookSubject.test(turn.content));
  if(!prior)return unchanged;
  const anchor=prior.content.trim().slice(0,240);
  return {searchQuery:anchor+' '+q,anchoredTurn:anchor,continued:true};
}

export function saqrNaturalDialogueInstructions(args:{
  question:string;
  history:ReadonlyArray<SaqrDialogueTurn>;
  role:'student'|'teacher'|'admin'|'guest';
  grade:number|null;
  locale:'ar'|'en';
  resolution:SaqrFollowUpResolution;
}):string{
  if(protectedStory.test(args.question)||
    args.history.some(turn=>turn.role==='user'&&protectedStory.test(turn.content))) return '';
  const learning=/مش\s*فاهم|مش\s*فهم|افهمني|اشرحلي|فهمني|explain|don.t\s*understand|struggling|help\s*me\s*understand/i.test(args.question);
  const dialogue=/ناقشني|نتناقش|نناقش|نتكلم|discussion|discuss|debate/i.test(args.question);
  const parts=[
    'SAQR NATURAL CONVERSATION PILOT: Keep Saqr identity and all strict school/catalogue safety rules.',
    'Treat this as one continuous human-friendly written chat, not independent FAQ queries. Respond directly to the latest message and build on what the user already said. Never restart with a generic introduction.',
    'Avoid repeating full previous responses or the same book list unless asked. Use natural, concise Arabic/English matching the user, with detail when explicitly requested. Avoid emojis and mechanical numbered headings for short conversational turns.',
    'Do not add a generic or canned ending question. Ask only ONE specific, helpful question when it would genuinely move the task forward; a direct factual answer may end without a question.',
    'Never invent book holdings, citations, shelf numbers, links, lessons already created or files already generated.',
    args.role==='student'
      ? 'Learner role: student'+(args.grade?' in grade '+args.grade:' of unknown grade')+'. Explain at an appropriate level, encourage independent thinking, and do not simply complete assessed homework.'
      : args.role==='teacher'||args.role==='admin'
        ? 'Educator role: prioritize actionable educational guidance and clarify only missing essentials; do not claim a Word or PowerPoint file exists unless an actual export tool created it.'
        : 'Reader role: age unknown; avoid assumptions about grade.',
  ];
  if(learning)parts.push('TUTORING: Start with one concrete example, then ask one small diagnostic question and wait for the learner answer. Adapt the next explanation to that answer.');
  if(dialogue)parts.push('DISCUSSION: Acknowledge the specific preceding idea before asking one thoughtful follow-up related to it; do not jump to a new topic.');
  if(args.resolution.continued&&args.resolution.anchoredTurn)
    parts.push('CONVERSATIONAL BOOK REFERENCE: The short new message refers to this earlier user request: '+JSON.stringify(args.resolution.anchoredTurn)+'. Keep that topic and constraints. If asked for easier alternatives, adjust reading level; if asked where a title is, cite verified holdings only. The current actual user words take precedence over this reference.');
  return parts.join('\n');
}
