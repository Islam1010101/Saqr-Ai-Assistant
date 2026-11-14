import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {isSaqrLessonPreparationRequest,isSaqrExplicitProofreadingRequest,saqrProofreadingInstructions}
  from '../src/utils/saqrProofreading.ts';

for(const sample of ['حضّر لي درس عن الماء','تحضير حصة عن الفضاء','خطة درس للصف الخامس',
  'Prepare a lesson about space','English lesson plan for Grade 5']){
  assert.equal(isSaqrLessonPreparationRequest(sample),true,'Lesson preparation detection: '+sample);
}
for(const sample of ['دقق لي الأخطاء الإملائية','راجع الإملاء والقواعد في قصتي',
  'تدقيق لغوي للنص','Please proofread my lesson','Check my grammar and spelling']){
  assert.equal(isSaqrExplicitProofreadingRequest(sample),true,'Proofreading request: '+sample);
}
for(const sample of ['مرحبا','رشحلي كتاب عن الفضاء','اكتب قصة عن البحر']){
  assert.equal(isSaqrExplicitProofreadingRequest(sample),false,'Do not infer an explicit correction request: '+sample);
}
const storyAr=saqrProofreadingInstructions({locale:'ar',creativeTurn:true,lessonTurn:false,explicitReview:false});
assert.match(storyAr,/Arabic FUSHA/);
assert.match(storyAr,/actual|genuine/);
assert.match(storyAr,/incorrect|wrong|تصحيح|الصحيح/);
assert.match(storyAr,/formal Modern Standard Arabic \(الفصحى\)/,
  'All Little Author guidance and corrections must be formal Arabic');
assert.match(storyAr,/NEVER Emirati or other dialect/,
  'Every Little Author turn must avoid colloquial speech');
assert.match(storyAr,/hamza and ta marbuta/,
  'Student correction rules must cover frequent Arabic spelling errors');
assert.match(storyAr,/exact original fragment and its minimal correct form/,
  'Only actual student writing errors may be quoted and corrected');
assert.doesNotMatch(storyAr,/هني خطأ بسيط|brief Emirati-language note/,
  'Old Emirati correction template must never enter Little Author');
assert.match(storyAr,/If no genuine errors|If there is NO mistake|If no actual mistakes/i);
const storyEn=saqrProofreadingInstructions({locale:'en',creativeTurn:true,lessonTurn:false,explicitReview:false});
assert.match(storyEn,/latest English story contribution/);
assert.match(storyEn,/original phrase/);
assert.match(storyEn,/ONE vivid new English story sentence/);
const lessonAr=saqrProofreadingInstructions({locale:'ar',creativeTurn:false,lessonTurn:true,explicitReview:false});
assert.match(lessonAr,/LESSON QUALITY CONTROL/);
assert.match(lessonAr,/Arabic FUSHA/);
assert.match(lessonAr,/Bloom/);
const lessonEn=saqrProofreadingInstructions({locale:'en',creativeTurn:false,lessonTurn:true,explicitReview:false});
assert.match(lessonEn,/LESSON QUALITY CONTROL/);
assert.match(lessonEn,/English grammar, spelling/);
const requested=saqrProofreadingInstructions({locale:'en',creativeTurn:false,lessonTurn:false,explicitReview:true});
assert.match(requested,/EXPLICIT PROOFREADING REQUEST/);
assert.match(requested,/only provide a fully rewritten corrected passage when requested/);

const page=readFileSync('pages/SmartSearchPage.tsx','utf8');
assert.ok(page.includes('saqrProofreadingInstructions({'),'Saqr must actually apply proofreading instructions');
assert.ok(page.includes('EVERY Little Author response must be in correct formal Modern Standard Arabic'),
  'Main Little Author rules must require formal Arabic for instructions and encouragement');
assert.ok(page.includes('ALL instructions, dialogue, encouragement, spelling/grammar feedback'),
  'The active Little Author turn must override the ordinary Emirati chat voice');
assert.ok(page.includes('NEVER Little Author')===false,
  'Story correction instructions should remain constructive');
assert.ok(page.includes('creativeTurn,'));
assert.ok(page.includes('isSaqrLessonPreparationRequest(userQuery)'));
assert.ok(page.includes('isSaqrExplicitProofreadingRequest(userQuery)'));
assert.ok(page.includes("\${proofreadingContext ? '\\n\\n'+proofreadingContext : ''}"),
  'Bilingual proofreading context must be included in the AI system request');
assert.ok(page.includes("certTitle: 'شهادة المؤلف الصغير'"));
assert.ok(page.includes("certTitle: 'LITTLE AUTHOR ACHIEVEMENT CERTIFICATE'"));
assert.ok(page.includes('className="cert-title-group"'));
assert.ok(page.includes('className="cert-title-rule"'));
assert.ok(page.includes('className="cert-seal-disc"><img src="/school-logo.png"'));
assert.ok(page.includes('className="cert-header"'));
assert.ok(page.includes('className="cert-winner"'));
assert.ok(page.includes('width:100%;text-align:center;font-size:36px'));
assert.ok(page.includes('className="cert-summary"'));
const exportCode=page.slice(page.indexOf('const handleDownloadCertificatePDF'),page.indexOf('const handleQuickPrompt'));
assert.ok(exportCode.includes('cloneNode(true)'), 'Certificate must capture a visible isolated clone');
assert.ok(exportCode.includes('document.body.appendChild(exportSurface)'));
assert.ok(exportCode.includes("await img.decode().catch(()=>undefined)"));
assert.ok(exportCode.includes("if(logos.some(img=>!img.naturalWidth))"));
assert.ok(exportCode.includes("summary.scrollHeight<=available()"));
assert.ok(exportCode.includes("width:794"));
assert.ok(exportCode.includes("height:1123"));
assert.ok(exportCode.includes("pdf.getNumberOfPages()!==1"),'Ensure exactly one page');
assert.ok(exportCode.includes('exportSurface.remove()'), 'Cleanup export container after any PDF attempt');
assert.ok(exportCode.includes("pdf.addImage("));
assert.ok(!exportCode.includes("pdf.addPage("));
assert.ok(!exportCode.includes("Math.ceil(canvas.height"));
console.log('PASS: Emirati/fusha story corrections, bilingual lesson proofreading and one-page EFIPS certificate export.');
