import assert from 'node:assert/strict';
import {searchSaqrBookCatalog} from '../src/utils/saqrCatalogSearch.ts';
import {isSaqrCatalogLookup,renderSaqrCatalogAnswer} from '../src/utils/saqrCatalogReply.ts';
import {extractSaqrSpecificBookTitle,findSaqrBookTitleHoldings} from '../src/utils/saqrBookExpert.ts';

// A real Arabic preposition "على" must not become the author's name "علي".
// Only titles/series truly recorded as Harry Potter belong in the results.
const catalogs={
  physical:[
    {title:'طاعة الشمس (كلمات علي الكتبي)',author:'علي الكتبي',subject:'History & Culture',shelf:31,row:1},
    {title:'الأجوبة الفقهية على الأسئلة التعليمية والتربوية',author:'سالم الشامسي',subject:'Islamic Studies',shelf:31,row:1},
    {title:'التغلب على الملل من الكتب المدرسية',author:'غير محدد',subject:'General Reference',shelf:39,row:4}
  ],
  arabic:[
    {title:'ديوان أحمد علي الكندي',author:'أحمد علي الكندي',subject:'شعر إماراتي'},
    {title:'القبض على النايل سات',author:'محمود سالم',subject:'أدب خيالي'}
  ],
  english:[
    {title:'Harry Potter And The Chamber Of Secrets',author:'J. K. Rowling',subject:'Fantasy',
      driveLink:'https://drive.google.com/file/d/sampleHarryOne/view'},
    {title:'Harry Potter And The Deathly Hallows',author:'J. K. Rowling',subject:'Fantasy',
      driveLink:'https://drive.google.com/file/d/sampleHarryTwo/view'},
    {title:'The Little Prince',author:'Antoine de Saint-Exupéry',subject:'Fiction'}
  ]
};

for(const query of ['دورلي على كتاب هاري بوتر','ابحث عن هاري بوتر','Find Harry Potter books']){
  const matches=searchSaqrBookCatalog(query,catalogs);
  assert.equal(matches.length,2,'Only catalogued Harry Potter titles for: '+query);
  assert.ok(matches.every(book=>book.title.startsWith('Harry Potter')),
    'No unrelated Arabic paper/digital books for: '+query);
  const reply=renderSaqrCatalogAnswer(query,matches,'ar');
  assert.match(reply,/Harry Potter And The Chamber Of Secrets/);
  assert.doesNotMatch(reply,/طاعة الشمس|النايل سات|ديوان أحمد/);
}
assert.equal(searchSaqrBookCatalog('هاري بوتر',{
  ...catalogs,english:[catalogs.english[2]]
}).length,0,'Do not present unrelated titles if the named series is not held');

// Important collision regression: the actual Arabic author name "علي" must
// remain searchable when the user writes it as a name, not a preposition.
const authorMatches=searchSaqrBookCatalog('كتب علي الكتبي',catalogs);
assert.ok(authorMatches.some(book=>book.author==='علي الكتبي'),
  'Ali is still searchable as an author');

// Distinguish explicit catalog search from a request for an explanation.
assert.equal(isSaqrCatalogLookup('دورلي على كتاب هاري بوتر'),true);
assert.equal(isSaqrCatalogLookup('عايز اعرف اكتر عن هاري بوتر'),false);
assert.equal(isSaqrCatalogLookup('Tell me more about Harry Potter'),false);
assert.equal(extractSaqrSpecificBookTitle('عايز اعرف اكتر عن هاري بوتر'),'هاري بوتر');
assert.equal(extractSaqrSpecificBookTitle('أريد معرفة المزيد عن هاري بوتر'),'هاري بوتر');
assert.equal(extractSaqrSpecificBookTitle('Tell me more about Harry Potter'),'Harry Potter');
assert.equal(extractSaqrSpecificBookTitle('معلومات عن روايات الخيال العلمي'),null,
  'Broad topic requests must remain broad');
const holdings=findSaqrBookTitleHoldings('هاري بوتر',
  searchSaqrBookCatalog('هاري بوتر',catalogs));
assert.equal(holdings.length,2,'Information route retains exact EFIPS holdings');

console.log('PASS: Arabic stopwords, bilingual Harry Potter series matching and catalog vs explanation intent');
