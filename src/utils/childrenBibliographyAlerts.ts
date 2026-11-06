/**
 * Library research alerts that require verification against the physical copy.
 * These are NOT automatic corrections to EFIPS catalogue metadata.
 */
export type ChildrenBibliographyAlert = {
  title: string;
  author: string;
  shelf: number;
  issueAr: string;
  issueEn: string;
  evidenceUrl: string;
  evidenceSource: string;
};

const alerts: readonly ChildrenBibliographyAlert[] = [
  {
    title: 'M is for Mitten: A Michigan Alphabet',
    author: 'Cynthia Furlong Reynolds',
    shelf: 30,
    issueAr: 'المؤلفة المسجلة قد تكون غير صحيحة. سجلات مكتبات مدرسية تشير إلى Annie Appleford لهذا العنوان؛ راجع غلاف نسخة المدرسة وصفحة حقوق النشر.',
    issueEn: 'Catalogue author may be incorrect. Multiple school/library records attribute this title to Annie Appleford; inspect the actual copy and copyright page.',
    evidenceUrl: 'https://teachersfirst.org/content/booklist-titles.cfm?id=16',
    evidenceSource: 'TeachersFirst / M is for Mitten'
  },
  {
    title: 'Give Me a Kiss, Miss Lilly',
    author: 'Nancy White Carlstrom',
    shelf: 30,
    issueAr: 'قد يكون العنوان مسجلًا بصيغة غير دقيقة؛ المراجع تذكر Blow Me a Kiss, Miss Lilly للمؤلفة نفسها. راجع صفحة العنوان الأصلية قبل التصحيح.',
    issueEn: 'Title may have been transcribed incorrectly. Library and educational sources list Blow Me a Kiss, Miss Lilly by the same author; verify the EFIPS copy.',
    evidenceUrl: 'https://files.eric.ed.gov/fulltext/ED366959.pdf',
    evidenceSource: 'ERIC / Literature bibliography'
  }
];

export function getChildrenBibliographyAlert(book: {
  title: string; author: string; shelf: number
}): ChildrenBibliographyAlert | undefined {
  // Strict match avoids incorrectly flagging other books or editions.
  return alerts.find(item =>
    item.title === book.title && item.author === book.author && item.shelf === book.shelf);
}
