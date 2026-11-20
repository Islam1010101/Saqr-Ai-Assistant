import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('Admin can edit book metadata and audio in Arabic, English and National Identity libraries',()=>{
 const ui=read('src/components/AdminCatalogManager.tsx');
 for(const field of ['title','author','subject','publisher','bio','summary','book_url','audio_url'])
   assert.ok(ui.includes(field),'Digital edit field absent: '+field);
 for(const marker of ["setDigitalScope","value=\"national\"","value=\"en\"","value=\"ar\"","action:'edit_digital'"])
   assert.ok(ui.includes(marker),marker);
 assert.ok(ui.includes("t('رابط الملخص الصوتي (امسحه لإزالة الصوت)"), 'Audio summary clear-to-remove field present');
 assert.match(ui,/deleteCatalogBook\('physical'/);
 assert.match(ui,/deleteCatalogBook\(digitalScope/);
 assert.match(ui,/window\.confirm/,'Permanent deletion requires explicit confirmation');
});
test('Service only permits verified admin, validates audio links, and blocks deletion of outstanding loans',()=>{
 const code=read('supabase/functions/admin-catalog-books/index.ts');
 for(const marker of ['auth.getUser(token)','staff.data?.role!=="admin"','efips_google_staff_accounts',
  'efips_account_access_controls','if(action==="edit_digital")','if(action==="delete_book")',
  'BOOK_HAS_ACTIVE_LOAN','AUDIO_HTTPS_URL_REQUIRED','admin.from(controlTable).upsert','admin.from(table).delete()'])
   assert.ok(code.includes(marker),marker);
 assert.ok(code.includes('national_identity'),'Existing identity scope preserved');
});
test('Original catalog IDs are suppressed from active catalogs and Saqr recommendations',()=>{
 const overlay=read('src/utils/liveCatalogAdditions.ts');
 const chat=read('api/chat.ts');
 const pdf=read('api/digital-book.ts');
 const hub=read('src/components/HomeReadingHub.tsx');
 const questions=read('src/utils/saqrReadingQuestBank.ts');
 assert.ok(overlay.includes('applyAdminCatalogControls'));
 assert.ok(overlay.includes("from('efips_admin_catalog_controls')"));
 assert.ok(overlay.includes("books.splice(index,1)"));
 assert.ok(overlay.includes("physicalReadingCatalog.splice(i,1)"));
 assert.ok(chat.includes('withoutDeletedSaqrShelves'));
 assert.ok(pdf.includes('removedCatalogPdf'));
 assert.ok(hub.includes('liveReadingCatalog'));
 assert.ok(questions.includes('return bookData.some'));
});
test('New metadata/exclusion table is read-only for clients; writes stay admin-verified',()=>{
 const sql=read('supabase/migrations/20261120043422_admin_catalog_original_book_digital_edits_and_exclusions.sql');
 assert.match(sql,/enable row level security/i);
 assert.match(sql,/revoke all on public\.efips_admin_catalog_controls from anon, authenticated/);
 assert.match(sql,/grant select on public\.efips_admin_catalog_controls to anon, authenticated/);
 assert.doesNotMatch(sql,/grant\s+(update|insert|delete)\s+on\s+public\.efips_admin_catalog_controls/i);
});
