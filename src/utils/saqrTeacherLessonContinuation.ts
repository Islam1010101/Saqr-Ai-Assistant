/** Staged, teacher-only lesson preparation; no library or creative mode changes. */
export const SAQR_TEACHER_LESSON_PARTS=[
 'عنوان الدرس والبيانات الأساسية، أهداف بلوم، ونواتج التعلم لكل هدف',
 'المفردات الجديدة، الربط بمادة أخرى، الحياة اليومية، والهوية الوطنية الإماراتية',
 'التهيئة الحافزة، خطوات التنفيذ بالأزمنة المقترحة، دور المعلم ودور الطلاب',
 'التحقق من الفهم، النشاط الرئيس، أوراق العمل وتعليمات تنفيذها',
 'توظيف مصادر المكتبة، تقييم النشاط الرئيس والأدلة ومعايير التقييم',
 'التمايز ودعم مستويات الطلاب، التقويم الختامي، الواجب ومراجعة اتساق التحضير'
] as const;
export type SaqrTeacherLessonSession={
 request:string;stage:number;attempts:number;parts:string[];done:boolean;lastMessageCount:number
};
export const startSaqrTeacherLesson=(request:string):SaqrTeacherLessonSession=>
 ({request:request.trim(),stage:0,attempts:0,parts:[],done:false,lastMessageCount:0});
const normalizeConsent=(value:string):string=>String(value||'').normalize('NFKC').toLowerCase()
 .replace(/[\u064b-\u065f\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه')
 .replace(/[.,،؟?!]+/g,' ').replace(/\s+/g,' ').trim();
export const isSaqrLessonContinueConsent=(input:string):boolean=>
 /^(?:نعم|ايوه|ايوا|اه|تمام|اكمل|كمل|واصل|تابع|yes|continue|go on|next|ok|okay|sure)(?: (?:اكمل|كمل|التحضير|باقي التحضير|الباقي|من فضلك|please))*$/iu
 .test(normalizeConsent(input));
export const isSaqrLessonPrintConsent=(input:string):boolean=>
 /^(?:نعم|ايوه|ايوا|اه|تمام|اطبع|اطبعه|اطبعهولي|اطبعها|طباعه|طباعة|جهزه للطباعه|yes|print|print it|please print|ok|okay|sure)$/iu
 .test(normalizeConsent(input));
export const readSaqrTeacherLessonPart=(response:string):{content:string;finished:boolean}=>{
 const text=String(response||'').trim();
 const finished=/\[\[SAQR_LESSON_PART_DONE\]\]\s*$/i.test(text);
 const content=text.replace(/\[\[SAQR_LESSON_PART_DONE\]\]/gi,'').trim();
 return {content,finished:finished && content.length>=75};
};
export function advanceSaqrTeacherLesson(
 session:SaqrTeacherLessonSession,part:{content:string;finished:boolean}
):SaqrTeacherLessonSession{
 if(session.done||!part.content.trim())return session;
 const stage=part.finished?Math.min(session.stage+1,SAQR_TEACHER_LESSON_PARTS.length):session.stage;
 return {...session,stage,attempts:part.finished?0:session.attempts+1,
  parts:[...session.parts,part.content],
  done:part.finished && stage===SAQR_TEACHER_LESSON_PARTS.length};
}
export function saqrTeacherLessonPartInstructions(
 session:SaqrTeacherLessonSession,locale:'ar'|'en'
):string{
 const section=SAQR_TEACHER_LESSON_PARTS[Math.min(session.stage,SAQR_TEACHER_LESSON_PARTS.length-1)];
 const continuation=session.attempts>0
   ? 'Previous response ended in the middle of this section. Continue exactly where it stopped; finish missing details of the SAME section without repeating completed items.'
   : 'Start this section with a clear heading and finish ONLY this section, not subsequent sections.';
 return 'SAQR SIX-PART TEACHER LESSON PREPARATION. Original request: '
  +JSON.stringify(session.request.slice(0,1200))
  +'. Part '+(session.stage+1)+' of '+SAQR_TEACHER_LESSON_PARTS.length+': '+section+'. '
  +continuation+' Keep original grade, subject, language and educational scope. '
  +'Write detailed, usable teaching content in '+(locale==='ar'?'formal Arabic FUSHA':'academic English')
  +', with specific actionable activities and Bloom objectives. Avoid invented textbook sources. '
  +'Do not ask whether to continue or print; the interface adds that question. '
  +'Never claim the entire plan is complete before part six. '
  +'Only once this section is fully covered, finish with [[SAQR_LESSON_PART_DONE]] as the final standalone line. '
  +'If output is interrupted mid-section, DO NOT use that marker.';
}
export const saqrTeacherLessonContinueQuestion=(locale:'ar'|'en'):string=>
 locale==='ar'?'التحضير لسه ما اكتمل. تحب أكمل لك باقي التحضير؟'
  :'The lesson plan is not finished yet. Would you like me to continue?';
export const saqrTeacherLessonPrintQuestion=(locale:'ar'|'en'):string=>
 locale==='ar'?'كده اكتمل التحضير بكل أجزائه. تحب أجهزهولك للطباعة؟'
  :'The complete lesson plan is ready. Would you like me to prepare it for printing?';
