import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createServer} from 'vite';

const page=readFileSync('pages/SmartSearchPage.tsx','utf8');
assert.ok(page.includes("const generalBookContext=librarySearchIntent && learningIntent==='none'"));
assert.ok(page.includes("saqrGeneralBookKnowledgeContext(namedBookTitle?namedBookHoldings:foundBooks,"));
assert.ok(page.includes("const librarySearchIntent = isSaqrLibrarySearchIntent(userQuery, messages)"));
assert.ok(page.includes("ACTIVE LITTLE AUTHOR CHALLENGE: NO catalogue searches"));
assert.ok(page.includes("const response = await fetch('/api/chat'"));

const server=await createServer({root:process.cwd(),logLevel:'error',
  server:{middlewareMode:true},appType:'custom'});
try{
  const books=await server.ssrLoadModule('/api/digitalBookData.ts');
  const helper=await server.ssrLoadModule('/src/utils/saqrBookGeneralKnowledge.ts');
  const ar=books.ARABIC_LIBRARY_DATABASE,en=books.ENGLISH_LIBRARY_DATABASE;
  assert.ok(ar.length>=500,'Arabic catalogue must retain existing books');
  assert.ok(en.length>=70,'English photo catalogue must retain existing books');
  assert.ok(ar.every(b=>String(b.id)&&b.title&&b.driveLink));
  assert.ok(en.every(b=>String(b.id)&&b.title&&b.driveLink));
  assert.ok(ar.every(b=>typeof b.summary==='string'&&b.summary.length>0));
  assert.ok(en.every(b=>typeof b.summary==='string'&&b.summary.length>0));

  const english=en.find(book=>book.title==='Wonder');
  const arabic=ar.find(book=>String(book.id)==='AR_PH_20261110_CHILD_LITERATURE');
  assert.ok(english&&arabic,'Both libraries need representative verified titles');
  const match=book=>({title:book.title,author:book.author,
    subject:book.subject,driveLink:book.driveLink,matchBasis:'Book title',pageLocation:'Digital'});
  const records=helper.saqrGeneralBookRecords([match(english),match(arabic)],ar,en);
  assert.equal(records.length,2);
  assert.equal(records[0].language,'en');
  assert.equal(records[1].language,'ar');
  assert.ok(records.every(r=>r.overview.length>35&&r.themes.length>0));
  assert.ok(helper.saqrGeneralBookKnowledgeContext([match(english),match(arabic)],ar,en).includes('NOT proof of reading'));

  assert.deepEqual(helper.saqrGeneralBookRecords([{title:'False',driveLink:english.driveLink}],ar,en),[],
    'Shared links or aliases may not be treated as another book');
  assert.deepEqual(helper.saqrGeneralBookRecords([{title:english.title}],ar,en),[],
    'Physical or unspecified books may not be assigned a digital synopsis');
  console.log('PASS general-knowledge Arabic/English catalogue isolation',ar.length,en.length);
}finally{await server.close();}
