import {handhalEntries} from './handhalScannedEntries.ts';
/** Only the physical book is linked to the learner's challenge. */
export const handhalDictionary={
 title:'معجم الألفاظ العامية في دولة الإمارات العربية المتحدة',
 author:'الدكتور فالح حنظل',
 shelf:6,row:2
} as const;
type Bilingual={ar:string;en:string};
export type DictionaryMultipleChoice={
 id:string;word:string;difficulty:1|2|3|4;
 question:Bilingual;options:[Bilingual,Bilingual,Bilingual];correct:number;
 explanation:Bilingual;sourcePdfPage:number
};
const normalize=(s:string)=>s.normalize('NFKC').replace(/[\u064B-\u065F\u0670]/g,'');
export const dictionaryTasks:DictionaryMultipleChoice[]=handhalEntries.map((entry,i)=>{
 const rivals=handhalEntries.filter(e=>e!==entry && e.meaning!==entry.meaning && normalize(e.word)!==normalize(entry.word) && e.category!==entry.category);
 const first=rivals[(i*7)%rivals.length];
 const second=rivals[(i*7+9)%rivals.length]===first?rivals[(i*7+10)%rivals.length]:rivals[(i*7+9)%rivals.length];
 const correct=i%3;
 const meanings=[first.meaning,second.meaning];meanings.splice(correct,0,entry.meaning);
 return {
 id:'handhal-scanned-'+String(i+1).padStart(3,'0'),word:entry.word,
 difficulty:(i%4+1) as 1|2|3|4,
 question:{ar:'ما المعنى الذي يذكره المعجم للفظ «'+entry.word+'»؟',en:'What meaning does the printed dictionary give for «'+entry.word+'»?'},
 options:meanings.map(ar=>({ar,en:ar})) as [Bilingual,Bilingual,Bilingual],
 correct,
 explanation:{ar:'معنى اللفظ في المرجع: '+entry.meaning,en:'Dictionary meaning: '+entry.meaning},
 sourcePdfPage:entry.pdfPage
 };
});
/** A randomized ten-question round; unique words only; easy to advanced. */
export const newDictionaryRound=(bank:DictionaryMultipleChoice[]=dictionaryTasks):DictionaryMultipleChoice[]=>{
 const levels:[1,2,3,4]=[1,2,3,4];
 const quotas=[3,3,2,2];
 const result:DictionaryMultipleChoice[]=[];
 for(let i=0;i<levels.length;i++){
  const list=bank.filter(x=>x.difficulty===levels[i]&&!result.some(y=>y.word===x.word));
  for(let j=list.length-1;j>0;j--){const k=Math.floor(Math.random()*(j+1));[list[j],list[k]]=[list[k],list[j]];}
  result.push(...list.slice(0,quotas[i]));
 }
 if(result.length<10){
  const rest=bank.filter(x=>!result.some(y=>y.word===x.word));
  for(let i=rest.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[rest[i],rest[j]]=[rest[j],rest[i]];}
  result.push(...rest.slice(0,10-result.length));
 }
 return result.slice(0,10).sort((a,b)=>a.difficulty-b.difficulty);
};
