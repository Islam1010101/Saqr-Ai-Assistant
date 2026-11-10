import type { DigitalLibraryBook } from './digitalBookData';
import {NEW_PHOTO_ONLY_ARABIC_BOOKS} from '../src/data/photoOnlyArabicCatalog20261110';

/**
 * National Identity e-books: metadata and reading URLs supplied by the school.
 * Separate from the physical National Identity catalog and the Arabic general collection.
 * No author biography, full-text summary or approved age rating is inferred from a link.
 * Reading audience labels below are editorial suggestions, not verified age ratings.
 */
export const NATIONAL_IDENTITY_DIGITAL_BOOKS: DigitalLibraryBook[] = [
  { id: "NI_1", pageCount: 97, readingAudience: 'teens', title: "الدهريز", author: "علي محمد المطروشي", publisher: "مركز حمدان بن محمد لإحياء التراث", subject: "تراث وطني", driveLink: "https://drive.google.com/file/d/1qmi3qg9qaRqrYyd3owuif0u8caHkZu1-/view?usp=sharing", bio: '', summary: '' },
  { id: "NI_2", pageCount: 48, readingAudience: 'adults', title: "ديوان وريث الشعر", author: "محمد مبارك الرفيسا الكتبي", publisher: "مركز حمدان بن محمد لإحياء التراث", subject: "شعر إماراتي", driveLink: "https://drive.google.com/file/d/1SZx8nBWuokEGGLzN8Kq2PBCKGQi0xA_G/view?usp=sharing", bio: '', summary: '' },
  { id: "NI_3", pageCount: 266, readingAudience: 'adults', title: "ديوان أحمد علي الكندي", author: "أحمد علي الكندي", publisher: "نادي تراث الإمارات", subject: "شعر إماراتي", driveLink: "https://drive.google.com/file/d/1BTEwJPbYJG0WHlnT4MtGew1am6SrK9JW/view?usp=sharing", bio: '', summary: '' },
  { id: "NI_4", pageCount: 226, readingAudience: 'teens', title: "العيّالة", author: "إدارة البحوث والدراسات", publisher: "مركز حمدان بن محمد لإحياء التراث", subject: "تراث وطني", driveLink: "https://drive.google.com/file/d/1KDamhV1sX73vOWAGnlxOKDnLOM4d5ZSc/view?usp=sharing", bio: '', summary: '' },
  { id: "NI_5", pageCount: 336, readingAudience: 'adults', title: "قصائد الماجدي ابن ظاهر", author: "سيف السعدي", publisher: "مركز حمدان بن محمد لإحياء التراث", subject: "شعر إماراتي", driveLink: "https://drive.google.com/file/d/1nk_Q5CqC3LaltHgh0t9ZbEGrM6O6wV7q/view?usp=sharing", bio: '', summary: '' },
  { id: "NI_6", pageCount: 55, readingAudience: 'adults', title: "مزنة شعر", author: "مزنة العامري", publisher: "المتحدة للطباعة والنشر", subject: "شعر إماراتي", driveLink: "https://drive.google.com/file/d/1bLlXtIAY2yYEr2x-_-3RIu69a9X7HaNB/view?usp=sharing", bio: '', summary: '' },
  // Fully numbered image-only UAE history titles from the school Photo Books folder.
  ...NEW_PHOTO_ONLY_ARABIC_BOOKS.filter(book=>String(book.id).startsWith('NI_PH_')),
];
