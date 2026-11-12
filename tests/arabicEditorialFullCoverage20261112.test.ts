import assert from 'node:assert/strict';
import { ARABIC_LIBRARY_DATABASE, ENGLISH_LIBRARY_DATABASE } from '../api/digitalBookData.ts';
import { NATIONAL_IDENTITY_DIGITAL_BOOKS } from '../api/nationalIdentityDigitalBooks.ts';
import { MAN_IMPOSSIBLE_20261112_CATALOG } from '../src/data/manImpossible20261112Index.ts';
import { ARABIC_AUTHOR_BIOS_20261112 } from '../src/data/arabicEditorialBios20261112.ts';

assert.equal(ARABIC_LIBRARY_DATABASE.length,502,'All Arabic digital books must remain available');
assert.equal(ENGLISH_LIBRARY_DATABASE.length,71,'The new English photo library must remain complete');
assert.equal(NATIONAL_IDENTITY_DIGITAL_BOOKS.length,9,'National-identity holdings must remain unchanged');
assert.equal(MAN_IMPOSSIBLE_20261112_CATALOG.length,167);
const ids = new Set<string>();
for (const book of ARABIC_LIBRARY_DATABASE) {
  const id=String(book.id);
  assert.ok(!ids.has(id),'Duplicate book ID: '+id);
  ids.add(id);
  assert.ok(book.title.trim(),'Missing title for '+id);
  assert.ok(book.author.trim(),'Missing author for '+id);
  assert.ok(book.summary.trim().length>30,'Missing book-specific summary or honest pending explanation: '+id);
  assert.ok(book.bio.trim().length>20,'Missing author biography/attribution note: '+id);
  assert.ok(book.driveLink,'Missing unchanged reading source for '+id);
  assert.ok(!book.summary.includes('كتاب مستقل ضمن سلسلة'),'Generic inherited summary: '+id);
  assert.ok(!book.summary.includes('إصدار مصور من سلسلة رجل المستحيل'),'Old blanket summary: '+id);
  assert.ok(!book.summary.includes('كتاب مصور متاح للقراءة داخل منصة صقر'),'Old blank book summary: '+id);
}
for (const book of MAN_IMPOSSIBLE_20261112_CATALOG) {
  const record=ARABIC_LIBRARY_DATABASE.find(entry=>entry.id===book.id);
  assert.ok(record,'Missing photo edition '+book.title);
  assert.equal(record?.driveLink,book.driveLink);
  assert.equal(record?.pageCount,book.pageCount);
  assert.equal(record?.bio,ARABIC_AUTHOR_BIOS_20261112['نبيل فاروق']);
}
const byID=new Map(ARABIC_LIBRARY_DATABASE.map(book=>[String(book.id),book]));
assert.match(byID.get('AR_48')?.summary||'',/أرض زيكولا/,'Third Zikola book series misidentified');
assert.doesNotMatch(byID.get('AR_48')?.summary||'',/قواعد جارتين/,'Do not mislabel Zikola 3 as a different series');
assert.match(byID.get('AR_54')?.summary||'',/الحُصين/);
assert.match(byID.get('AR_52')?.bio||'',/النمسا/);
assert.match(byID.get('AR_56')?.bio||'',/بيركلي/);
assert.match(byID.get('AR_PH_20261110_AI_WORLD')?.summary||'',/لم تتحقق/);
assert.match(byID.get('AR_PH_20261110_AI_WORLD')?.bio||'',/لم يُتحقق/);
for(const id of ['AR_PH_HP_1','AR_PH_HP_2','AR_PH_HP_3','AR_PH_HP_4','AR_PH_HP_5','AR_PH_HP_6','AR_PH_HP_7']){
  assert.match(byID.get(id)?.bio||'',/هاري بوتر/);
}
const pending=ARABIC_LIBRARY_DATABASE.filter(book=>book.reviewStatus==='pending');
const reviewed=ARABIC_LIBRARY_DATABASE.filter(book=>book.reviewStatus!=='pending');
console.log('PASS Arabic catalog audit:',{
  total:ARABIC_LIBRARY_DATABASE.length,verifiedOrExisting:reviewed.length,pendingPlotVerification:pending.length,
  authorsCovered:Object.keys(ARABIC_AUTHOR_BIOS_20261112).length,
  manOfImpossible:MAN_IMPOSSIBLE_20261112_CATALOG.length
});
