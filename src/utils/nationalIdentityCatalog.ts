import {bookData, type Book} from '../../api/bookData';
const norm=(s:string)=>String(s||'').normalize('NFKC').toLowerCase().replace(/[\u064b-\u065f\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').trim();
const nationalSignal=/(?:الامارات|اماراتي|اماراتيه|ابوظبي|ابو ظبي|دبي|الشارقه|الفجيره|عجمان|راس الخيمه|محمد بن زايد|زايد بن سلطان|وادي الوريعه|احمد بن ماجد|ابن ماجد|صقار|وطني|الوطن)/;
export const isNationalIdentityBook=(book:Book):boolean=>
  book.shelf===41||nationalSignal.test(norm(book.title));
export const nationalIdentityBooks:Book[]=bookData.filter(isNationalIdentityBook);
export const searchNationalIdentityBooks=(query:string):Book[]=>{
  const q=norm(query);if(!q)return nationalIdentityBooks;
  return nationalIdentityBooks.filter(book=>norm(book.title).includes(q)||norm(book.author).includes(q));
};
