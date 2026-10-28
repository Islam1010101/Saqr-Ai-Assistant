/** Source: user-uploaded tableConvert.com_uha7wj.json, 2026-10-28.
 * The source keys were 'book tittle', 'auther', 'shelf', 'raw', 'ISBN'.
 * We retain titles and authors verbatim; raw -> row and terminal .00 on
 * digit-string ISBNs was removed without altering the 13 ISBN digits.
 * ISBN-13 check digits have been validated, but an ISBN's assignment to
 * a particular edition has not been independently verified.
 */
export type ImportedLibraryBook = {
  title:string; author:string; shelf:number; row:number; isbn:string;
};
export const uploadedLibraryBooks:ImportedLibraryBook[]=[
  {
    "title": "كرمة كاراميلا",
    "author": "ماريا دعدوش",
    "shelf": 36,
    "row": 2,
    "isbn": "9789957682279"
  },
  {
    "title": "الاسم الحركي نبضه",
    "author": "رانيا بده",
    "shelf": 36,
    "row": 2,
    "isbn": "9789771464327"
  },
  {
    "title": "قط اسمه قمر",
    "author": "نادية النجار",
    "shelf": 37,
    "row": 2,
    "isbn": "9789948667360"
  },
  {
    "title": "مؤتمر الطيور السنوي",
    "author": "مي صالح زيتون",
    "shelf": 37,
    "row": 2,
    "isbn": "9789957043056"
  },
  {
    "title": "حرس القلعة",
    "author": "شيخة الزيارة",
    "shelf": 35,
    "row": 2,
    "isbn": "9789923831083"
  },
  {
    "title": "صديقي الوفي",
    "author": "عمرو مجدي البيومي",
    "shelf": 35,
    "row": 2,
    "isbn": "9786338316716"
  }
];
