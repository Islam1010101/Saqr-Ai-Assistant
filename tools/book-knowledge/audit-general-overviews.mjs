/**
 * Offline, read-only evidence audit for the two current EFIPS digital libraries.
 * Exports an honest, book-by-book GENERAL overview catalogue.
 * It does not OCR books or pretend a series description is a verified plot.
 *
 * node tools/book-knowledge/audit-general-overviews.mjs /tmp/saqr-general-book-overviews.json
 */
import {createServer} from 'vite';
import {writeFile,mkdir} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';

const output=resolve(process.argv[2]||'/tmp/saqr-general-book-overviews.json');
const server=await createServer({root:process.cwd(),logLevel:'error',
  server:{middlewareMode:true},appType:'custom'});
try{
  const mod=await server.ssrLoadModule('/api/digitalBookData.ts');
  const lists=[
    {language:'ar',label:'Arabic',books:mod.ARABIC_LIBRARY_DATABASE},
    {language:'en',label:'English',books:mod.ENGLISH_LIBRARY_DATABASE}
  ];
  const hasConcern=/لم\s|يحتاج\s|تحتاج\s|يلزم\s|قيد التحقق|غير موثق|لم يُراجع|لم تُراجع|not yet verified|being reviewed|pending verification/i;
  const rows=[],statistics={};
  for(const {language,label,books} of lists){
    if(!Array.isArray(books)||!books.length)throw Error('Empty '+label+' catalogue');
    const seen=new Set();
    const stats={books:books.length,withOverview:0,provisional:0,missingDetails:0,
      withKeywords:0,declaredPageCount:0,readerAccessLinks:0};
    for(const book of books){
      const id=String(book.id),summary=String(book.summary||'').trim();
      if(seen.has(id))throw Error('Duplicate '+label+' book id '+id);
      seen.add(id);
      const pending=book.reviewStatus==='pending'||hasConcern.test(summary);
      const generic=!summary || /^(?:كتاب مستقل ضمن سلسلة|illustrated photo-page edition|كتاب مصور متاح|نسخة مصورة)/i.test(summary);
      const certainty=generic?'insufficient_description'
        :pending?'provisional_series_or_metadata':'catalogue_summary';
      if(summary)stats.withOverview++;
      if(pending)stats.provisional++;
      if(generic)stats.missingDetails++;
      if(book.keywords?.length)stats.withKeywords++;
      if(Number(book.pageCount)>0)stats.declaredPageCount+=Number(book.pageCount);
      if(String(book.driveLink||'').startsWith('https://drive.google.com/'))stats.readerAccessLinks++;
      rows.push({
        bookId:id,language,title:book.title,author:book.author,
        subject:book.subject,overview:summary,
        themes:[book.subject,...(book.keywords||[])].filter(Boolean).slice(0,12),
        readingAudience:book.reviewedAgeGroup||book.readingAudience||null,
        reviewedAgeGroup:book.reviewedAgeGroup||null,
        reviewStatus:book.reviewStatus||null,certainty,
        sourceBasis:'existing_school_catalogue_editorial_metadata_not_full_book_reading',
        editionPages:Number(book.pageCount)||null
      });
    }
    statistics[language]=stats;
  }
  const report={
    version:1,generatedAt:new Date().toISOString(),
    description:'General book-topic profiles from existing editorial catalogue; not 575 full-text analyses',
    totals:{books:rows.length,arabic:statistics.ar.books,english:statistics.en.books},
    statistics,books:rows
  };
  await mkdir(dirname(output),{recursive:true});
  await writeFile(output,JSON.stringify(report,null,2),'utf8');
  process.stdout.write(JSON.stringify({totals:report.totals,statistics:report.statistics})+'\n');
}finally{await server.close();}
