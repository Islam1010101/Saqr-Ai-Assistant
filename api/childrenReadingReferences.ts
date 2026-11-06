/**
 * EFIPS children's reading pilot: externally sourced, edition-unverified references.
 * Never treat these as an assessed pupil level or as certified local-copy levels.
 * A title + author + shelf exact match is required to avoid homonyms.
 */
import { normalizeCatalogText } from '../src/utils/catalogTextSearch.ts';
export type Children'sReadingTier = 'beginner'|'intermediate'|'advanced';
export type ReadingReference = {
 title:string; author:string; shelf:number; tier:Children'sReadingTier;
 publisherLevel:string; sourceName:string; sourceUrl:string; noteAr:string; noteEn:string;
 status:'reference_only'; editionMatched:false;
};
const curated: ReadonlyArray<ReadingReference> = [
  {
    "title": "Little Bear's Friend",
    "author": "Else Holmelund Minarik",
    "shelf": 30,
    "tier": "beginner",
    "publisherLevel": "I Can Read, Level 1 · GRL J · 470L",
    "sourceName": "Booksource",
    "sourceUrl": "https://www.booksource.com/products/little-bears-friend__0064440516.aspx",
    "noteEn": "Repetitive language and a supported early-reader format.",
    "noteAr": "لغة متكررة وقصة قصيرة مناسبة لبدايات القراءة المستقلة.",
    "status": "reference_only",
    "editionMatched": false
  },
  {
    "title": "The Fire Cat",
    "author": "Esther Averill",
    "shelf": 30,
    "tier": "beginner",
    "publisherLevel": "I Can Read, Level 1 · GRL J · 490L",
    "sourceName": "Booksource",
    "sourceUrl": "https://www.booksource.com/products/fire-cat--the__0064440389.aspx",
    "noteEn": "Publisher series identifies an early-reader text.",
    "noteAr": "سلسلة قراءة مبكرة مدعومة بالصور.",
    "status": "reference_only",
    "editionMatched": false
  },
  {
    "title": "Curious George Flies a Kite",
    "author": "H. A. Rey & Margret Rey",
    "shelf": 30,
    "tier": "beginner",
    "publisherLevel": "First-grade independent reading · 510L · 80 pp",
    "sourceName": "Reading Is Fundamental",
    "sourceUrl": "https://www.rif.org/literacy-central/book/curious-george-flies-kite",
    "noteEn": "Simplified illustrated text explicitly recommended for first-grade independent readers.",
    "noteAr": "نص مصوّر مبسّط موصوف بأنه مناسب للقراء المستقلين في الصف الأول.",
    "status": "reference_only",
    "editionMatched": false
  },
  {
    "title": "Good Work, Amelia Bedelia",
    "author": "Peggy Parish",
    "shelf": 30,
    "tier": "intermediate",
    "publisherLevel": "I Can Read, Level 2 · GRL L · 430L",
    "sourceName": "TeachingBooks",
    "sourceUrl": "https://school.teachingbooks.net/tb.cgi?tid=20492",
    "noteEn": "Independent reading with figurative language and wordplay.",
    "noteAr": "قراءة مستقلة تتطلب فهم معاني الكلمات والتعبيرات المجازية.",
    "status": "reference_only",
    "editionMatched": false
  },
  {
    "title": "Thank You, Amelia Bedelia",
    "author": "Peggy Parish",
    "shelf": 30,
    "tier": "intermediate",
    "publisherLevel": "I Can Read, Level 2 · GRL L · 510L",
    "sourceName": "Reading Is Fundamental",
    "sourceUrl": "https://www.rif.org/literacy-central/book/thank-you-amelia-bedelia",
    "noteEn": "Longer independent-reader text and playful literal versus intended meanings.",
    "noteAr": "نص أطول نسبيًا وتمييز بين المعاني الحرفية والمقصودة.",
    "status": "reference_only",
    "editionMatched": false
  },
  {
    "title": "Amelia Bedelia Goes Camping",
    "author": "Peggy Parish",
    "shelf": 30,
    "tier": "intermediate",
    "publisherLevel": "I Can Read, Level 2 · GRL L · 380L",
    "sourceName": "Booksource",
    "sourceUrl": "https://www.booksource.com/products/amelia-bedelia-goes-camping__0060511060.aspx",
    "noteEn": "Reading-with-help series; understanding literal language supports comprehension.",
    "noteAr": "قراءة بمساعدة مع مواقف لغوية تحتاج تفسيرًا.",
    "status": "reference_only",
    "editionMatched": false
  },
  {
    "title": "Happy Birthday, Good Knight",
    "author": "Shelley Moore Thomas",
    "shelf": 30,
    "tier": "intermediate",
    "publisherLevel": "Penguin Young Readers, Level 3 · 48 pp",
    "sourceName": "Penguin Random House",
    "sourceUrl": "https://www.penguinrandomhouse.com/books/288023/happy-birthday-good-knight-by-shelley-moore-thomas-illustrated-by-jennifer-plecas/",
    "noteEn": "Transitional young-reader level with multiple characters and more dialogue.",
    "noteAr": "قارئ انتقالي يتعامل مع حوار وشخصيات أكثر.",
    "status": "reference_only",
    "editionMatched": false
  },
  {
    "title": "Koko's Kitten",
    "author": "Dr. Francine Patterson",
    "shelf": 30,
    "tier": "intermediate",
    "publisherLevel": "670L · 2,463 words · ATOS 3.5",
    "sourceName": "TeachingBooks",
    "sourceUrl": "https://library.teachingbooks.net/tb.cgi?tid=37861",
    "noteEn": "Illustrated nonfiction with more technical vocabulary and a longer text.",
    "noteAr": "كتاب معلوماتي مصوّر بمفردات أدق ونص أطول.",
    "status": "reference_only",
    "editionMatched": false
  },
  {
    "title": "Jacob Two-Two and the Dinosaur",
    "author": "Mordecai Richler",
    "shelf": 30,
    "tier": "advanced",
    "publisherLevel": "96 pp · chapter book · ages 9+ review",
    "sourceName": "Common Sense Media",
    "sourceUrl": "https://www.commonsensemedia.org/book-reviews/jacob-two-two-and-the-dinosaur",
    "noteEn": "Longer chapter-based satire and inference; verify content and edition in person.",
    "noteAr": "حكاية أطول بفصول وسخرية واستنتاجات؛ تتطلب مراجعة المحتوى والطبعة.",
    "status": "reference_only",
    "editionMatched": false
  },
  {
    "title": "Lincoln",
    "author": "Russell Freedman",
    "shelf": 30,
    "tier": "advanced",
    "publisherLevel": "Lincoln: A Photobiography · GRL V · NC1040L · 160 pp",
    "sourceName": "Booksource",
    "sourceUrl": "https://www.booksource.com/products/lincoln--a-photobiography__0395518482.aspx",
    "noteEn": "Dense historical nonfiction, high vocabulary load and source-based explanations; confirm this is the full photobiography.",
    "noteAr": "سيرة تاريخية بمفردات وتراكيب أكثر كثافة؛ يلزم تأكيد أنها طبعة السيرة المصورة الكاملة.",
    "status": "reference_only",
    "editionMatched": false
  }
];
export const childReadingReferenceCount = curated.length;
export const childReadingReferenceEntries = curated;
export function getChildReadingReference(book:{title:string;author:string;shelf:number}):ReadingReference|undefined {
 const title=normalizeCatalogText(book.title); const author=normalizeCatalogText(book.author);
 return curated.find(item=>item.shelf===book.shelf && normalizeCatalogText(item.title)===title && normalizeCatalogText(item.author)===author);
}
export function readingTierLabel(tier:Children'sReadingTier,locale:'ar'|'en'):string {
 const labels={beginner:{ar:'مبتدئ',en:'Beginner'},intermediate:{ar:'متوسط',en:'Intermediate'},advanced:{ar:'متقدم',en:'Advanced'}};
 return labels[tier][locale];
}
