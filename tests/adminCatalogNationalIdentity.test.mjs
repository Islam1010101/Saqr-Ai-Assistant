import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=(path)=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('Identity catalog includes explicitly flagged books outside legacy UAE shelf',()=>{
 const identity=read('src/utils/nationalIdentityCatalog.ts');
 assert.ok(identity.includes('book.nationalIdentity===true'));
 assert.ok(identity.includes('book.nationalIdentity!==false'));
 assert.ok(identity.includes('refreshNationalIdentityBooks'));
 assert.ok(read('src/components/NationalIdentityBookCorner.tsx').includes('useAdminCatalogRevision()'));
});
test('Approved digital National Identity titles go only to their own existing reader collection',()=>{
 const admin=read('src/components/AdminCatalogManager.tsx');
 const overlay=read('src/utils/liveCatalogAdditions.ts');
 assert.ok(admin.includes('<option value="national">'));
 assert.ok(admin.includes("form.language==='national'"));
 assert.ok(overlay.includes("h.national_identity===true?NATIONAL_IDENTITY_DIGITAL_BOOKS"));
 assert.ok(overlay.includes('NATIONAL_IDENTITY_DIGITAL_BOOKS.push')===false);
 assert.ok(overlay.includes("books.push(book)"));
 const national=read('pages/NationalIdentityDigitalBooksPage.tsx');
 assert.ok(national.includes('NATIONAL_IDENTITY_DIGITAL_BOOKS'));
 const arabic=read('pages/ArabicLibraryInternalPage.tsx');
 assert.ok(arabic.includes('EFIPS_ADD_'));
});
test('Admin edits existing physical records through metadata overlays without touching login roles',()=>{
 const ui=read('src/components/AdminCatalogManager.tsx');
 const overlay=read('src/utils/liveCatalogAdditions.ts');
 const server=read('supabase/functions/admin-catalog-books/index.ts');
 const migration=read('supabase/migrations/20261120041441_add_national_identity_and_physical_book_edits.sql');
 assert.ok(ui.includes("action:'edit_physical'"));
 assert.ok(ui.includes('physicalEdit.national_identity'));
 assert.ok(overlay.includes('applyAdminPhysicalEdits'));
 assert.ok(overlay.includes("from('efips_admin_physical_edits')"));
 assert.ok(server.includes('if(action==="edit_physical")'));
 assert.ok(server.includes('staff.data?.role!=="admin"'));
 assert.ok(server.includes('efips_google_staff_accounts'));
 assert.ok(migration.includes('enable row level security'));
 assert.ok(migration.includes('grant select'));
 assert.ok(migration.includes('national_identity'));
});
