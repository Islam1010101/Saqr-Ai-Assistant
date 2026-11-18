import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('New records are stored separately and have RLS with restricted public columns',()=>{
 const ddl=read('supabase/migrations/20261118183000_admin_catalog_books.sql');
 const privacy=read('supabase/migrations/20261118184500_catalog_public_columns.sql');
 assert.match(ddl,/create table if not exists public\.efips_admin_catalog_books/);
 assert.match(ddl,/enable row level security/i);
 assert.match(ddl,/status='approved'/);
 assert.match(ddl,/current_school_identity/);
 assert.match(ddl,/revoke all on public\.efips_admin_catalog_books/);
 assert.match(privacy,/revoke select on public\.efips_admin_catalog_books/);
 assert.doesNotMatch(privacy,/created_by\s*,/);
 assert.doesNotMatch(privacy,/source_fingerprint\s*,/);
});
test('School Google authentication and admin-only ingestion are enforced server-side',()=>{
 const code=read('supabase/functions/admin-catalog-books/index.ts');
 for(const value of ['auth.getUser(token)','@falcon-school','provider==="google"','email_verified===true',
  'efips_google_staff_accounts','efips_account_access_controls','staff.data?.role!=="admin"',
  'add_physical','add_digital','parse_excel','import_physical','approve_pending','EXCEL_XLSX_OR_CSV_ONLY']) {
  assert.ok(code.includes(value),'Missing safeguard '+value);
 }
 assert.match(code,/source_fingerprint/);
 assert.match(code,/FILE_TOO_MANY_ROWS/);
});
test('New data is an append-only overlay of existing catalogs and counts',()=>{
 const overlay=read('src/utils/liveCatalogAdditions.ts');
 const app=read('App.tsx');
 const admin=read('pages/AdminDashboard.tsx');
 for(const x of ['bookData.push(book)','ARABIC_LIBRARY_DATABASE','ENGLISH_LIBRARY_DATABASE','physicalReadingCatalog.push',
  "eq('status','approved')",'samePhysicalHolding']) assert.ok(overlay.includes(x));
 assert.match(app,/refreshAdminCatalogAdditions/);
 assert.match(admin,/useAdminCatalogRevision/);
 for(const id of ['overview','reports','library','analytics','attendance','reading','children','orison','management','add-books']) 
  assert.ok(admin.includes("id:'"+id+"'"),'Missing section '+id);
 assert.match(admin,/<AdminCatalogManager isAr=\{isAr\}/);
});
test('Only newly-entered digital editions get their independent reader; prior photo readers stay untouched',()=>{
 const ar=read('pages/ArabicLibraryInternalPage.tsx');
 const en=read('pages/EnglishLibraryInternalPage.tsx');
 assert.match(ar,/EFIPS_ADD_/);
 assert.match(ar,/VerifiedArabicPhotoBookReader/);
 assert.match(en,/EFIPS_ADD_/);
 assert.match(en,/EnglishPhotoBookReader/);
 assert.match(ar,/NewCatalogDigitalReader/);
 assert.match(en,/NewCatalogDigitalReader/);
});
test('Protected Saqr prompt and authentication integration paths are not changed by feature wiring',()=>{
 const app=read('App.tsx');
 assert.match(app,/syncApprovedPhysicalCatalog/);
 assert.match(app,/GoogleSchoolReturn/);
 assert.match(app,/GoogleTeacherReturn/);
 const shelf=read('src/utils/saqrReaderContext.ts');
 assert.match(shelf,/catalogByKey\(\)/);
});
