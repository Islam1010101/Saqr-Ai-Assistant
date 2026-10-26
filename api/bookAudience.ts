import {audienceByShelf} from './shelfAudience.ts';
// Reader-audience discovery labels are provisional, based on catalog metadata only.
// No inference about a student's identity and no claim of verified publisher age ratings.
export type BookAudience = 'children' | 'youth' | 'teens' | 'specialist' | 'nationalIdentity' | 'review';
type AudienceBook = { title: string; subject: string; shelf: number; level?: string };
const normalize = (s: string) => (s || '').toLowerCase().replace(/[إأآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه');
const matches = (text:string, expression:RegExp) => expression.test(text);
export function classifyBookAudience(book: AudienceBook): BookAudience {
  const shelfCategory=audienceByShelf(book.shelf);
  if(shelfCategory==='specialist')return 'specialist';
  if(shelfCategory==='children')return 'children';
  if(shelfCategory==='youth')return 'youth';
  if(shelfCategory==='youthTeens')return 'teens';
  if(shelfCategory==='nationalIdentity')return 'nationalIdentity';
  if(shelfCategory==='review')return 'review';
  const title = normalize(book.title);
  const subject = normalize(book.subject);
  const text = title + ' ' + subject;
  // Professional content has priority over broad story and study keywords.
  const professional = /(?:accounting|taxation|tax law|mortgage|financial management|corporate|clinical|pharmacolog|medical dictionary|psychotherap|business statistics|management of information|professional|university|postgraduate|graduate level|encyclopedia of mortgage|microeconomics|macroeconomics|advanced engineering|industrial engineering|construction safety|theory and practice|handbook of law|legal practice|law and policy|statistics for business|الطب السريري|الطب النفسي|الصيدله|المحاسبه|الضرائب|التمويل|الاستثمار|الاقتصاد الكلي|الاقتصاد الجزئي|الدراسات العليا|القانون التجاري|المصارف|الاداره الماليه|الهندسه المتقدمه|التحليل الاحصائي|نظريه النقد|النقد الثقافي|الدراسات النقديه|المعجم الموسوعي)/i;
  if (matches(text,professional)) return 'specialist';
  // Require explicit child-friendly signals for the youngest readers.
  const child = /(?:children'?s (?:book|story|stories|encyclopedia)|for children|for kids|kids' (?:books|stories)|picture books?|early readers?|beginning reader|beginner readers?|first readers?|bedtime stor|nursery rhyme|fairy tales?|grade[s]? [1-5]\b|grades? [1-5]\b|kindergarten|preschool|phonics|first grade|second grade|third grade|fourth grade|fifth grade|baby.sitters club|boxcar children|amelia bedelia|geronimo stilton|little sister karen|sticker book|pinocchio|mary poppins|the very hungry caterpillar|قصص الاطفال|قصه للاطفال|حكايات الاطفال|قصص للصغار|الطفوله المبكره|رياض الاطفال|التلوين للاطفال|القراءه المبكره|مغامرات الاطفال|قصه مصوره|قصص مصوره|الصف الاول|الصف الثاني|الصف الثالث|الصف الرابع|الصف الخامس|المرحله الابتدائيه|سلسله الحيوانات)/i;
  if (matches(text,child) || book.shelf===35) return 'children';
  // Grade 9–12: secondary-school texts, teen-specific material or clear secondary reading.
  const teen = /(?:young adult|young readers?|teenage readers?|for teens?|teen fiction|young adult fiction|senior high|secondary school|high school|grades? (?:9|10|11|12)\b|grade (?:9|10|11|12)\b|gcse|igcse|a.level|sat prep|act prep|to kill a mockingbird|the great gatsby|lord of the rings|harry potter|little women|the old man and the sea|a wrinkle in time|adventures of huckleberry finn|موجه لليافعين|ادب اليافعين|روايات اليافعين|قصص اليافعين|الشباب الناشئ|للمراهقين|مرحله ثانويه|المرحله الثانويه|الصف التاسع|الصف العاشر|الصف الحادي عشر|الصف الثاني عشر|تحضير السات|الثانويه العامه)/i;
  if (matches(text,teen)) return 'teens';
  // Subjects can confirm a level only if they are specifically age-directed.
  if (/children.s stories|early reading|juvenile fiction|قصص الاطفال|كتب الناشئه/.test(subject)) return 'children';
  if (/young adult|teen fiction|secondary school|ادب اليافعين/.test(subject)) return 'teens';
  // Adult reference shelves: mark specialist without treating mixed literary shelves as age-safe.
  if ([2,3,4,5,7,9,10,11].includes(book.shelf) && /(?:management|business|accounting|finance|economics|technology|science|medical|politics|psychology|research|computer|encyclopedia|dictionary|تجاره|اقتصاد|اداره|طب|علم النفس|القانون|فلسفه|موسوعه)/i.test(text)) return 'specialist';
  return 'review';
}
