/**
 * Saqr recommendation availability: books known to the model are allowed as
 * external suggestions. A title is a verified EFIPS holding ONLY if its name
 * matches an actual recorded print or digital catalogue entry.
 *
 * The absence of a catalog record is NOT proof of physical absence.
 * Never invent a shelf/row or school-hosted download link.
 */
export type SaqrCatalogTitle = {title?: string | null};
const normalize = (value:string):string => String(value||'').normalize('NFKC').toLowerCase()
  .replace(/[\u064b-\u065f\u0670\u0640]/g,'')
  .replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه')
  .replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const unverifiedShelf = /(?:\s*[-–—:,،]?\s*)(?:(?:مكتبة|المكتبة)\s+(?:العادية|الورقية)\s*[:،-]?\s*)?(?:الرف|رف|shelf)\s*[:：#-]?\s*\d{1,3}\s*[-–—,،]?\s*(?:الصف|صف|row)\s*[:：#-]?\s*\d{1,3}/gi;
const alreadyLabeled = /(?:اقتراح خارجي|خارج(?:ي|\s+المكتبة)|غير متاح|غير مسجل|غير موجود(?:\s+في\s+الفهرس)?|external suggestion|not (?:listed|in|held by)|outside (?:the|our) library)/i;

function candidateTitle(line:string):string|null {
  // Match actual suggested titles, not arbitrary emphasized prose or questions.
  const bullet=/^\s*(?:[-•*]\s+|\d+[.)]\s+)/.test(line);
  const emphatic= /^\s*(?:[-•*]\s+|\d+[.)]\s+)?\*\*(.{3,125}?)\*\*/.exec(line);
  const quoted=/(?:رواي[ةه]|كتاب|قص[ةه]|novel|book|story)?\s*[«“"]([^«»“”"]{3,125})[»”"]/i.exec(line);
  if(quoted)return quoted[1].trim();
  if(emphatic && bullet) {
    const first=emphatic[1].replace(/^["«“]|["»”]$/g,'').trim();
    if(first.length<=100 && !/[؟?]$/.test(first))return first;
  }
  // Require a concrete book-title-looking phrase before a separator.
  if(bullet) {
    const plain=line.replace(/^\s*(?:[-•*]\s+|\d+[.)]\s+)/,'').trim();
    const match=/^(?:رواي[ةه]|كتاب|قص[ةه]|novel|book|story)?\s*(.{4,95}?)\s+[-–—:]\s+/.exec(plain);
    if(match && match[1].split(/\s+/).length<=13)return match[1].replace(/\*\*/g,'').trim();
  }
  return null;
}

/**
 * Label model-generated titles that have no exact EFIPS catalog match.
 * Leaves verified books, conversational answers, and unparseable free prose
 * untouched. This is a narrow safeguard, not a bibliographic verifier.
 */
export function annotateSaqrExternalRecommendations(
  reply:string,
  catalog:ReadonlyArray<SaqrCatalogTitle>,
  locale:'ar'|'en'
):string{
  const titleSet=new Set(catalog.map(x=>normalize(String(x.title||''))).filter(Boolean));
  const seen=new Set<string>();
  return String(reply||'').split('\n').map(line=>{
    const title=candidateTitle(line);
    if(!title)return line;
    const key=normalize(title);
    if(!key || key.length<5 || titleSet.has(key)||seen.has(key))return line;
    seen.add(key);
    // A model may know a real outside book; that is not a verified school holding.
    // Remove only falsely attached local shelf/row pairs from this title's line.
    const cleaned=line.replace(unverifiedShelf,'').replace(/\s+[-–—]\s*$/,'').trimEnd();
    if(alreadyLabeled.test(cleaned))return cleaned;
    const label=locale==='ar'
      ? 'اقتراح من خارج فهرس EFIPS — ما له سجل مطابق في المكتبة الورقية أو الرقمية حاليًا'
      : 'External suggestion — no matching record in the current EFIPS physical or digital catalogues';
    return cleaned+'\n\n  *'+label+'*';
  }).join('\n');
}
