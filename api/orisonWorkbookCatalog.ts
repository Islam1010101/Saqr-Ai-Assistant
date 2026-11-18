import type {Book} from './bookData.ts';
import {orisonWorkbookRows} from '../src/data/orisonWorkbook20261118.ts';

/** Add missing catalog entries and fill only blank, unambiguous metadata.
 * Existing IDs, physical locations, classifications, descriptions and loan keys stay intact.
 */
const norm=(s:string):string=>String(s||'').normalize('NFKC').toLocaleLowerCase()
  .replace(/[\u064b-\u065f\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا')
  .replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[^\p{L}\p{N}]+/gu,'');
const missingAuthor=(s:string):boolean=>!String(s||'').trim()||
  /^(unknown author|none|not recorded|مؤلف غير مسجل|غير معروف)$/i.test(String(s||'').trim());
const isbnValue=(raw:string):string=>{
  let s=String(raw||'').trim().toUpperCase().replace(/\.00$/,'')
    .replace(/^ISBN(?:-1[03])?:?\s*/,'').replace(/[\s-]/g,'');
  const valid10=(v:string)=>/^\d{9}[\dX]$/.test(v)&&
    [...v].reduce((n,c,i)=>n+(10-i)*(c==='X'?10:Number(c)),0)%11===0;
  const valid13=(v:string)=>/^\d{13}$/.test(v)&&
    [...v].reduce((n,c,i)=>n+(i%2?3:1)*Number(c),0)%10===0;
  if(s.length===9&&valid10('0'+s))s='0'+s;
  if(s.length===12&&valid13('0'+s))s='0'+s;
  return valid10(s)||valid13(s)?s:'';
};
type Group={title:string;author:string;isbn:string;barcodes:Set<string>};
export function mergeOrisonWorkbookCatalog(
  original:Book[],inferSubject:(title:string,author:string,topic:string,shelf:number)=>string
):Book[]{
  const output=[...original], byTitle=new Map<string,number[]>(), byIsbn=new Map<string,number[]>();
  const add=(map:Map<string,number[]>,key:string,i:number)=>{
    if(!key)return;
    const entries=map.get(key)||[];if(!entries.includes(i)){entries.push(i);map.set(key,entries);}
  };
  output.forEach((b,i)=>{add(byTitle,norm(b.title),i);add(byIsbn,isbnValue(b.isbn||''),i);});
  const groups=new Map<string,Group>();
  for(const [title,barcode,rawAuthor,rawIsbn] of orisonWorkbookRows){
    const key=norm(title),isbn=isbnValue(rawIsbn);
    if(!key||!barcode)continue;
    const author=missingAuthor(rawAuthor)?'Unknown Author':rawAuthor.trim();
    // Keep editions separate in provenance; do not mix barcodes across different ISBNs.
    const groupKey=key+'|'+(isbn||norm(author));
    let group=groups.get(groupKey);
    if(!group){group={title:title.trim(),author,isbn,barcodes:new Set()};groups.set(groupKey,group);}
    group.barcodes.add(barcode.trim());
  }
  for(const group of groups.values()){
    const key=norm(group.title), titles=byTitle.get(key)||[],isbns=group.isbn?(byIsbn.get(group.isbn)||[]):[];
    const exactIsbn=isbns.filter(i=>norm(output[i].title)===key);
    const exactAuthor=titles.filter(i=>norm(output[i].author)===norm(group.author));
    let match:number|undefined;
    if(exactIsbn.length===1)match=exactIsbn[0];
    else if(exactAuthor.length===1&&(!isbns.length||isbns.includes(exactAuthor[0])))match=exactAuthor[0];
    else if(titles.length===1&&(!isbns.length||isbns.includes(titles[0])))match=titles[0];
    if(match!==undefined){
      const old=output[match],next:Book={...old};
      next.barcodes=[...new Set([...(old.barcodes||[]),...group.barcodes])];
      if(!old.isbn&&group.isbn){next.isbn=group.isbn;next.isbnStatus='candidate';add(byIsbn,group.isbn,match);}
      if(missingAuthor(old.author)&&!missingAuthor(group.author))next.author=group.author;
      output[match]=next;continue;
    }
    // Conflicting title/edition is held in raw provenance, never silently duplicated.
    if(titles.length||isbns.length)continue;
    const barcodes=[...group.barcodes],author=group.author,lang=/[\u0600-\u06ff]/.test(group.title)?'AR':'EN';
    const entry:Book={
      id:'orison-xlsx-20261118-'+barcodes[0],title:group.title,author,
      shelf:0,row:0,locationPending:true,needsReview:true,
      language:lang,subject:inferSubject(group.title,author,'',0),level:'General',
      summary:lang==='AR'?'كتاب ورقي مسجل في الجرد. موقعه وملخص محتواه لم يوثقا بعد.':
        'Physical inventory entry; shelf, row and synopsis have not yet been verified.',
      barcodes,copies:barcodes.length,
      ...(group.isbn?{isbn:group.isbn,isbnStatus:'candidate' as const}:{})
    };
    const i=output.length;output.push(entry);add(byTitle,key,i);if(group.isbn)add(byIsbn,group.isbn,i);
  }
  return output;
}
