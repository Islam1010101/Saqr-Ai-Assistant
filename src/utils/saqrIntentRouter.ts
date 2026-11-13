import {isStoryBeginning} from './saqrLearning.ts';
import {isSaqrRecommendationRequest} from './saqrCatalogReply.ts';
import {isCrossLanguageTitleQuery, isSaqrNamedAuthorQuery} from './saqrCatalogSearch.ts';

export type SaqrRoutingTurn={role:string;content:string};
const challenge=/(?:تحدي\s*(?:المؤلف|التأليف|كتابه\s*قصه)|المؤلف\s*الصغير|little\s*author|young\s*author|نؤلف\s*قص[ةه]|نألف\s*قص[ةه]|اكتب\s*(?:لي\s*)?قص[ةه]|اكتب\s*قص[ةه]|تأليف\s*قص[ةه]|تصحيح\s*قص[ةه]|نكمل\s*قصتنا|story\s*(?:challenge|writing)|(?:write|create|continue)\s*(?:a\s*)?story)/i;
const catalogWords=/(?:\b(?:books?|novels?|stories|authors?|catalog(?:ue)?|shelves|library)\b|كتاب|الكتاب|كتب|الكتب|رواي[ةه]|الرواي[ةه]|روايات|قصص|مؤلف|كاتب|الرف|فهرس|الدولاب|المكتبة|مكتبتكم)/i;
const locationRequest=/(?:في\s+(?:المكتبة|مكتبتكم|مكتبتنا)|عندكم|متاح\s*(?:في|عند)|متوفر\s*(?:في|عند)|موجود\s*(?:في|عند)|دليل\s*المكتبة|فهرس|رقم\s*الرف|مكان\s*(?:الكتاب|الرواية)|(?:الرف|الدولاب)\s*\d+|in\s+(?:the|our|your)\s+library|library\s+(?:catalog|catalogue|shelf)|available\s+(?:at|in)\s+(?:efips|the\s+library)|do\s+you\s+have)/i;
const discoveryRequest=/(?:ابحث|إبحث|دورلي|دور\s*لي|دور\s+على|دور\s+عن|ابغى\s+كتب|أبغى\s+كتب|عايز\s+كتب|أريد\s+كتب|ابي\s+كتب|هاتلي|وريني|رشح|ترشح|اقترح|recommend|suggest|find|search|show\s+me|looking\s+for|books?\s+(?:about|by|on)|(?:كتب|كتاب|روايات|رواية)\s+(?:عن|في|ل|لـ)|^(?:كتب|مؤلفات|روايات)\s+\S+|مؤلفات\s+|روايات\s+(?:عن|ل)|(?:books?|novels?)\s+by)/i;
const literaryExplanation=/(?:اشرح|لخص|تلخيص|ملخص|حلل|ناقش|رأيك|ايه\s+معني|ما\s+معنى|مين\s+|من\s+هو|تعرف\s+عن|احكيلي\s+عن|خبرني\s+عن|tell\s+me\s+about|explain|summari[sz]e|analyse|analyze|what\s+is|who\s+(?:is|was))/i;
const pureTask=/(?:تحضير|حصة|درس|ورقه\s+عمل|ورقة\s+عمل|نشاط|شهادة|عرض\s+تقديمي|تصميم|مشروع|مسابقة|تحدي|تعليمات|واجب|رياضيات|اختبار|ورشة|وركشوب|discussion|worksheet|lesson|certificate|presentation|homework|quiz|activity)/i;
const continuation=/(?:اسهل|أسهل|اصعب|أصعب|غيره|غيرها|واحد\s+ثاني|حاجة\s+ثانية|شي\s+ثاني|another|easier|simpler|harder|similar|shorter|is\s+it\s+available|موجود\s+عندكم|وينه|فينه|مكانه)/i;

export const isSaqrCreativeTurn=(question:string,history:ReadonlyArray<SaqrRoutingTurn>=[]):boolean=>
  challenge.test(question) || isStoryBeginning(question) ||
  history.some(turn=>turn.role==='user'&&(challenge.test(turn.content)||isStoryBeginning(turn.content)));

export const isSaqrLibrarySearchIntent=(
  question:string,
  history:ReadonlyArray<SaqrRoutingTurn>=[]
):boolean=>{
  const q=String(question||'').trim();
  if(!q)return false;
  // Writing a story is never a request to search the school catalogue, even
  // when the fictional scene happens inside the library or features a book.
  if(challenge.test(q)||isStoryBeginning(q))return false;
  // A fresh explicit book request is permitted after a story, but ordinary
  // replies to a writing challenge must never turn into catalogue searches.
  const lastUser=[...history].reverse().find(turn=>turn.role==='user');
  const followUpToLibrary=continuation.test(q)&&!!lastUser&&
    (discoveryRequest.test(lastUser.content)||locationRequest.test(lastUser.content))&&
    catalogWords.test(lastUser.content);
  // Explicit lookups of recognized bilingual book titles must reach the
  // real catalogue even when the reader omits the word "book": e.g.
  // "ابحث عن هاري بوتر". Never treat a bare creative/lesson prompt as lookup.
  const namedTitleSearch=isCrossLanguageTitleQuery(q) && discoveryRequest.test(q);
  const explicitNewSearch=locationRequest.test(q)||followUpToLibrary||(
    discoveryRequest.test(q)&&(catalogWords.test(q)||namedTitleSearch)&&!pureTask.test(q)
  );
  if(isSaqrCreativeTurn(q,history)&&!explicitNewSearch)return false;
  if(pureTask.test(q)&&!explicitNewSearch)return false;
  if(locationRequest.test(q) && (!pureTask.test(q) || /(?:فهرس|الرف|مكان\s+(?:الكتاب|الرواية)|catalog)/i.test(q)))return true;
  if(literaryExplanation.test(q)&&!discoveryRequest.test(q))return false;
  // Queries like "Agatha Christie novels" name both the author and book type,
  // even if they do not start with an explicit "find" instruction.
  if(isSaqrNamedAuthorQuery(q)&&catalogWords.test(q)&&!pureTask.test(q))return true;
  if(discoveryRequest.test(q)&&(catalogWords.test(q)||namedTitleSearch))return true;
  if(isSaqrRecommendationRequest(q)&&catalogWords.test(q))return true;
  // A follow-up to a book-recommendation request may keep using catalogue
  // evidence only if it is clearly continuing that selection.
  if(continuation.test(q)) {
    const lastUser=[...history].reverse().find(turn=>turn.role==='user');
    return !!lastUser && !pureTask.test(lastUser.content) &&
      (discoveryRequest.test(lastUser.content)||locationRequest.test(lastUser.content)) &&
      catalogWords.test(lastUser.content);
  }
  return false;
};
