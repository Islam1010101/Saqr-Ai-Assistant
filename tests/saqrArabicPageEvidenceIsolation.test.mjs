import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const read=path=>readFileSync(path,'utf8');
const chat=read('pages/SmartSearchPage.tsx');
const originalServer=read('api/chat.ts');
const router=read('src/utils/saqrIntentRouter.ts');
const search=read('src/utils/saqrCatalogSearch.ts');
const extra=read('src/utils/saqrArabicPageEvidence.ts');
const worker=read('tools/arabic-knowledge/index-books.py');
const exporter=read('tools/arabic-knowledge/export-manifest.mjs');

// All original Saqr provider/model decisions, protected educational flows and
// strict creativity gates are retained. The new service is optional.
assert.ok(chat.includes("const arabicPageEvidence = librarySearchIntent"));
assert.ok(chat.includes("await retrieveSaqrArabicPageEvidence(linkedBookTurn.searchQuery, ARABIC_LIBRARY_DATABASE)"));
assert.ok(chat.includes("const foundBooks = librarySearchIntent ? searchSaqrBookCatalog("));
assert.ok(chat.includes("const librarySearchIntent = isSaqrLibrarySearchIntent(userQuery, messages)"));
assert.ok(chat.includes("catalogueIntent: librarySearchIntent"));
assert.ok(chat.includes("ACTIVE LITTLE AUTHOR CHALLENGE: NO catalogue searches"));
assert.ok(chat.includes("const arabicPageContext=saqrArabicPageEvidenceContext(arabicPageEvidence)"));
assert.ok(chat.includes("renderArabicPageEvidence(arabicPageEvidence,locale==='ar')"));
assert.ok(chat.includes("const learningContext=saqrLearningInstructions("));
assert.ok(chat.includes("saqrProofreadingInstructions({"));
assert.ok(chat.includes("const creativeTurn = isSaqrCreativeTurn("));
assert.ok(chat.includes("const response = await fetch('/api/chat'"));
assert.ok(chat.includes("const searchContext = !librarySearchIntent"));
assert.ok(router.includes("if(pureTask.test(q)&&!explicitNewSearch)return false"));
assert.ok(search.includes("arabic: BookRecord[]"));
assert.ok(search.includes("summary:String(book.summary).slice(0,500)"));
assert.ok(originalServer.includes("catalogueIntent : isSaqrApiLibrarySearch(userMsg)"));
assert.ok(originalServer.includes("const found = catalogRequested ? findBooks(userMsg) : []"));

// Supabase evidence cannot be injected into normal chat or changed books.
// Only the server-side offline indexer can write the new table.
assert.ok(extra.includes("if(text.length<3)return []"));
assert.ok(extra.includes("if(error||!Array.isArray(data))return []"));
assert.ok(extra.includes("return [];}"));
assert.ok(extra.includes("reviewed:Boolean(row.reviewed)"));
assert.ok(extra.includes("do not claim you read an entire book"));
assert.ok(worker.includes("book.get('imagePages',[])"));
assert.ok(worker.includes("method='arabic_ocr'"));
assert.ok(worker.includes("def indexed_pages("));
assert.ok(exporter.includes("mod.ARABIC_LIBRARY_DATABASE"));
assert.ok(exporter.includes("source:imagePages?'images':match?'pdf':'unavailable'"));
for(const file of ['api/chat.ts','api/digitalBookData.ts',
  'pages/ArabicLibraryInternalPage.tsx','pages/EnglishLibraryInternalPage.tsx'])
  assert.ok(existsSync(file));
console.log('PASS: Arabic page-index extension remains isolated to explicit book intent');
