/**
 * Export the current 502-book Arabic catalogue and all verified image-page
 * manifests for the OPTIONAL Saqr full-text pipeline.
 * Read-only: never changes the books, their IDs, sources or the Saqr chat.
 *
 * Run: node tools/arabic-knowledge/export-manifest.mjs /tmp/arabic-manifest.json
 */
import {createServer} from 'vite';
import {readdir,readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';

const output=resolve(process.argv[2]||'/tmp/saqr-arabic-book-manifest.json');
const root=process.cwd();
const dataDir=resolve(root,'src/data');
const filePattern=/^(?:verifiedArabicImageBooks20261110[A-B]|migratedArabicPhotoPages20261110[A-O]|seriesArabicPhotoPages20261110[A-Z]{1,2}|manImpossible20261112Pages\d{2}|photoOnlyHarryPotter20261110[A-B]|photoOnlyNationalGeographic20261110[A-C]|photoOnlyNewHeritage20261110|additionalArabicPhotoBooks20261110)\.(?:ts|js)$/;

function parsePageManifest(text,path){
  // Page files are generated TypeScript wrappers around literal JSON maps.
  // Never evaluate arbitrary source code or import the React book-reader.
  const decl=/export const (?:[A-Z][A-Z0-9_]*)\s*(?::[^=\n]+)?\s*=\s*(\{)/g;
  let match, last;
  while((match=decl.exec(text)))last=match;
  if(!last)throw Error('Missing literal page map: '+path);
  const start=last.index+last[0].length-1;
  // Some generated page files add a TypeScript "as const" or "satisfies"
  // annotation after the JSON map. Scan only the balanced object literal.
  let depth=0,inString=false,escaped=false,end=-1;
  for(let i=start;i<text.length;i++){
    const char=text[i];
    if(inString){
      if(escaped)escaped=false;
      else if(char==='\\')escaped=true;
      else if(char==='"')inString=false;
      continue;
    }
    if(char==='"'){inString=true;continue;}
    if(char==='{')depth++;
    else if(char==='}' && --depth===0){end=i+1;break;}
  }
  if(end<0)throw Error('Unterminated page map: '+path);
  const map=JSON.parse(text.slice(start,end));
  if(!map||typeof map!=='object'||Array.isArray(map))throw Error('Invalid page map: '+path);
  return map;
}
const server=await createServer({root,logLevel:'error',server:{middlewareMode:true},appType:'custom'});
try{
  const mod=await server.ssrLoadModule('/api/digitalBookData.ts');
  const books=mod.ARABIC_LIBRARY_DATABASE;
  if(!Array.isArray(books)||!books.length)throw Error('Cannot load Arabic catalogue');
  const ids=new Set(books.map(book=>String(book.id)));
  const pageMaps=new Map();
  const manifestFiles=(await readdir(dataDir)).filter(name=>filePattern.test(name)).sort();
  for(const name of manifestFiles){
    const map=parsePageManifest(await readFile(resolve(dataDir,name),'utf8'),name);
    for(const [id,pages] of Object.entries(map)){
      if(!ids.has(id)||!Array.isArray(pages)||pageMaps.has(id))continue;
      // Preserve the exact photographed page order and verify every page.
      const good=pages.length>0&&pages.every((p,i)=>p?.page===i+1&&/^[\w-]{10,}$/.test(p.fileId||''));
      if(good)pageMaps.set(id,pages);
    }
  }
  const entries=books.map(book=>{
    const pageTotal=Number(book.pageCount)||0;
    const pages=pageMaps.get(String(book.id));
    const imagePages=pages&&(!pageTotal||pages.length===pageTotal)?pages:undefined;
    const match=String(book.driveLink||'').match(/^https:\/\/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/);
    return {
      id:String(book.id),title:book.title,author:book.author,
      subject:book.subject,readingAudience:book.reviewedAgeGroup||book.readingAudience||null,
      pageCount:pageTotal,reviewStatus:book.reviewStatus||null,
      source:imagePages?'images':match?'pdf':'unavailable',
      ...(imagePages?{imagePages}:{}),
      ...(!imagePages&&match?{pdfFileId:match[1]}:{})
    };
  });
  const summary={
    books:entries.length,photos:entries.filter(b=>b.source==='images').length,
    pdfs:entries.filter(b=>b.source==='pdf').length,
    missingSources:entries.filter(b=>b.source==='unavailable').map(b=>({id:b.id,title:b.title})),
    imagePages:entries.reduce((n,b)=>n+(b.imagePages?.length||0),0)
  };
  await mkdir(dirname(output),{recursive:true});
  await writeFile(output,JSON.stringify({schemaVersion:1,generatedAt:new Date().toISOString(),summary,books:entries}),'utf8');
  process.stdout.write(JSON.stringify(summary)+'\n');
} finally {
  await server.close();
}
