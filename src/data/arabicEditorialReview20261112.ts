import type { DigitalLibraryBook } from '../../api/digitalBookData';
import { ARABIC_AUTHOR_BIOS_20261112, ARABIC_STANDALONE_UPDATES_20261112 } from './arabicEditorialBios20261112';
import { ARABIC_SERIES_SUMMARIES_20261112_A } from './arabicSeriesSummaries20261112A';
import { ARABIC_SERIES_SUMMARIES_20261112_B } from './arabicSeriesSummaries20261112B';

/** Shared Arabic-library editorial review.
 * A precise plot is supplied only for identified works; all other
 * volumes receive a TRANSPARENT pending-verification notice rather than a fabricated story.
 * Source URLs, image manifests, book IDs, page counts and reader integration are untouched.
 */
const normalize = (s: string):string => s.normalize('NFKC')
  .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
  .replace(/[أإآ]/g, 'ا').replace(/ى/g,'ي').replace(/ة/g,'ه')
  .replace(/[^\p{L}\p{N}]+/gu,' ').toLowerCase().trim();

const summaries:Readonly<Record<string,Readonly<Record<string,string>>>> = {
  ...ARABIC_SERIES_SUMMARIES_20261112_A,
  ...ARABIC_SERIES_SUMMARIES_20261112_B
};
const normalisedSummaries = new Map<string,Map<string,string>>();
for (const [group, entries] of Object.entries(summaries)) {
  normalisedSummaries.set(group,new Map(Object.entries(entries).map(([title,summary])=>[normalize(title),summary])));
}
const groupPrefixes = ['AR_1','AR_7','AR_19','AR_20','AR_21','AR_42','AR_43','AR_51'];
function seriesGroup(id:string):string|undefined {
  return groupPrefixes.find(prefix => id.startsWith(prefix+'-'));
}
function unnumberedTitle(title:string):string {
  return title.replace(/^\s*0*\d+\s*/,'').replace(/\s+ج\s*\d+\s*$/,'').trim();
}
function verifiedSeriesSummary(book:DigitalLibraryBook,group:string):string|undefined {
  return normalisedSummaries.get(group)?.get(normalize(book.title));
}
function pendingSeriesSummary(book:DigitalLibraryBook, group:string):string {
  const title = book.title;
  switch(group) {
    case 'AR_1':
      return '«'+title+'» من مجموعة أعمال أجاثا كريستي البوليسية. لم تُطابق المكتبة هذه الترجمة مع النص الأصلي بعد، لذلك لن نذكر المجرم أو الشخصيات أو أحداثًا غير موثقة.';
    case 'AR_7':
      return '«'+title+'» حكاية مستقلة من المكتبة الخضراء للأطفال. لم يُراجع نص هذه الطبعة لتحديد الشخصيات وتسلسل الأحداث والعبرة بدقة.';
    case 'AR_19':
      return '«'+title+'» إصدار من سلسلة «ما وراء الطبيعة» لأحمد خالد توفيق، التي يروي فيها رفعت إسماعيل مواجهاته مع الظواهر والأساطير الغامضة. تفاصيل هذا العدد لم تُراجع بعد.';
    case 'AR_20':
      return '«'+title+'» مغامرة مستقلة من سلسلة «الشياطين الـ13» التي تتبع فريقًا من الشباب العرب في مهام بوليسية. لم تُراجع بعد وقائع القضية في هذا العدد.';
    case 'AR_21':
      return '«'+title+'» مجلد من تفسير القرآن لابن كثير، يشرح الآيات بالاستناد إلى الروايات والتفسير المأثور؛ يلزم فهرس المجلد لتحديد السور التي يتضمنها.';
    case 'AR_42':
      return '«'+title+'» قصة تربوية مصورة ضمن «سلطان وقصص القرآن». لم تُراجع بعد أحداثها والآيات المرتبطة بها، فلا يصح التخمين من العنوان.';
    case 'AR_43':
      return '«'+title+'» من كتب قصص الأنبياء المصورة للصغار، ويتناول النبي المذكور في عنوان الجزء؛ تفاصيل سرد هذه الطبعة لم تُطابق بالنص بعد.';
    case 'AR_51':
      return '«'+title+'» نادرة تراثية مستقلة من حكايات جحا التي تعتمد على الفكاهة والمفارقة. لم تُراجع بعد صياغة الحكاية ونهايتها في هذه الطبعة.';
    default:
      return '«'+title+'» عنوان ضمن سلسلة مصوّرة. يحتاج نص هذا الإصدار إلى مراجعة قبل اعتماد ملخص للأحداث.';
  }
}
function impossibleSummary(book:DigitalLibraryBook):{text:string;verified:boolean} {
  const title = unnumberedTitle(book.title);
  const order = book.seriesOrder;
  if (order === 1 && /الاختفاء الغامض/.test(normalize(title))) {
    return {text:'يختفي عالم مصري من فندق في باريس؛ ويتدخل أدهم صبري في سباق مع خاطفيه لمنع نقله إلى جهة أخرى وكشف مخطط الاختطاف.',verified:true};
  }
  if (order === 160 && /الوداع/.test(normalize(title))) {
    return {text:'في ختام سلسلة «رجل المستحيل» تتحد قوى استخباراتية وتنظيمات إجرامية لملاحقة أدهم صبري، الذي يواجه خطرًا واسعًا في معركته الأخيرة. هذا الملف من أجزاء العدد الختامي «الوداع».',verified:true};
  }
  if (/^أدهم\b|^ادهم\b/u.test(title)) {
    return {text:'في عدد خاص يأتي بعد خاتمة السلسلة، يحاول قدري البحث عن أدهم ومنى بعد غيابهما، ويواجه أسئلة عجزت جهات أخرى عن الإجابة عنها؛ هذه نبذة عن العمل المتداول بعنوان «أدهم».',verified:true};
  }
  const unit = order ? 'العدد '+order : 'إصدار خاص';
  return {text:'«'+title+'» ('+unit+') من أعمال نبيل فاروق المصورة المرتبطة بسلسلة رجل المستحيل. لم تُراجع المكتبة وقائع هذا الجزء من النص، لذلك لا تُنسب إليه حبكة أو شخصيات غير مؤكدة.',verified:false};
}
const unverifiedAuthors = new Set(['غير محدد','مؤلفون','مؤلفين','متنوع']);
const genericDescription = /(?:إصدار مصور من سلسلة رجل المستحيل|كتاب مستقل ضمن سلسلة|كتاب مصور متاح للقراءة داخل منصة صقر|نسخة مصورة كاملة للقراءة داخل مكتبة صقر الرقمية)/;

export function reviewArabicDigitalLibrary(books:ReadonlyArray<DigitalLibraryBook>):DigitalLibraryBook[] {
  return books.map(original=>{
    const book = {...original};
    const id = String(book.id);
    const main = ARABIC_STANDALONE_UPDATES_20261112[id];
    const group = seriesGroup(id);
    let summary = main?.summary || book.summary || '';
    let verified = Boolean(main?.summary) || (!group && !id.startsWith('AR_RM_') && !genericDescription.test(summary));
    if (group) {
      const specific = verifiedSeriesSummary(book,group);
      summary = specific || pendingSeriesSummary(book,group);
      verified = Boolean(specific);
    } else if (id.startsWith('AR_RM_20261112_')) {
      const entry = impossibleSummary(book);
      summary = entry.text; verified = entry.verified;
    }
    // Descriptions that are only "a photo book" are not mistaken for content summaries.
    if (!group && !id.startsWith('AR_RM_') && genericDescription.test(summary)) {
      summary = '«'+book.title+'» مدرج في المكتبة الرقمية العربية. لم يُتحقق من فصول هذه الطبعة بما يكفي لنشر ملخص مفصل عنها.';
      verified = false;
    }
    const bio = main?.bio || ARABIC_AUTHOR_BIOS_20261112[main?.author || book.author] || book.bio
      || 'اسم مؤلف هذا الكتاب أو بيانات سيرته يحتاج إلى توثيق من صفحة العنوان وحقوق النشر.';
    const summaryNeedingEvidence = /(?:لم\s|تحتاج\s|يلزم\s|قيد التحقق|غير موثقة|من دون مراجعة)/u.test(summary);
    const authorNeedingEvidence = unverifiedAuthors.has(main?.author || book.author)
      || /(?:يحتاج إلى مراجعة|يحتاج إلى التحقق|تتطلب|لم يُتحقق|لم تتوفر)/u.test(bio);
    const pendingEditorial = !verified || summaryNeedingEvidence || authorNeedingEvidence;
    return {
      ...book,
      ...(main?.author ? {author:main.author} : {}),
      summary,
      bio,
      ...(pendingEditorial ? {reviewStatus:'pending' as const} : {})
    };
  });
}
