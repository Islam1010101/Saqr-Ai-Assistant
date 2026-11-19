import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=(path)=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const client=read('src/components/AdminCatalogManager.tsx');
const server=read('supabase/functions/admin-catalog-books/index.ts');

test('Admin UI extracts Supabase FunctionsHttpError JSON instead of hiding with a generic HTTP status',()=>{
 assert.match(client,/import\s*\{FunctionsHttpError\}\s*from\s*'@supabase\/supabase-js'/);
 assert.match(client,/error instanceof FunctionsHttpError/);
 assert.match(client,/error\.context as Response/);
 assert.match(client,/response\.clone\(\)\.json\(\)/);
 assert.match(client,/catalogErrorText\(backendCode\|\|error\.message/);
 assert.match(client,/INVALID_ISBN:/);
 assert.match(client,/CABINET_NUMBER_REQUIRED:/);
 assert.match(client,/SHELF_ROW_REQUIRED:/);
});
test('Existing auth restrictions and workflow actions remain',()=>{
 for(const marker of ['auth.getUser(token)','staff.data?.role!=="admin"','email_verified===true','efips_google_staff_accounts',
 'efips_account_access_controls','ADMIN_REQUIRED','add_physical','add_digital','import_physical','parse_excel','approve_pending']){
  assert.ok(server.includes(marker),'Existing service guard or operation removed: '+marker);
 }
 assert.match(client,/supabase\.auth\.getSession\(\)/);
 assert.match(client,/supabase\.functions\.invoke\('admin-catalog-books'/);
});
test('Physical ISBN is optional, but supplied ISBN must remain genuine and shelf location required',()=>{
 assert.match(client,/field\('isbn',t\('ISBN \(اختياري\)'/);
 assert.doesNotMatch(server, /!author\|\|!isbn\|\|!cabinet\|\|!shelf_row/);
 assert.match(server,/if\(!cabinet\)throw Error\("CABINET_NUMBER_REQUIRED"\)/);
 assert.match(server,/if\(!shelf_row\)throw Error\("SHELF_ROW_REQUIRED"\)/);
 assert.match(server,/if\(text\(v\.isbn\)&&!isbn\)throw Error\("INVALID_ISBN"\)/);
 assert.match(server,/const pending=kind==="physical"&&\(!author\|\|!cabinet\|\|!shelf_row/);
 assert.match(server,/source==="excel"/);
});
test('Digital requirements and existing catalog RLS are not modified',()=>{
 for(const marker of ['DIGITAL_BOOK_HTTPS_URL_REQUIRED','AUDIO_HTTPS_URL_REQUIRED','SUBJECT_REQUIRED']){
  assert.ok(server.includes(marker),'Digital error classification missing: '+marker);
 }
 assert.match(server,/if\(kind==="digital"\)/);
 assert.match(server,/return respond\(400,\{ok:false,error:message\}\)/);
});
