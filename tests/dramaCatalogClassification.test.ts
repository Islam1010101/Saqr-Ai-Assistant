import assert from 'node:assert/strict';
import { bookData, getLocalizedSubject } from '../api/bookData.ts';

const norm=(v:string)=>v.normalize('NFKC').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu,'');
const at=(title:string,shelf:number,row:number)=>{
  const b=bookData.find(b=>norm(b.title)===norm(title)&&b.shelf===shelf&&b.row===row);
  assert.ok(b,'Missing original physical record: '+title); return b;
};

// A stage script is not a dramatic novel; journals/notes about theatre are not plays.
for(const [title,shelf,row] of [
  ['MACBETH',19,6],["A Midsummer Night's Dream",15,2],['As You Like It',15,3],
  ['Hamlet',40,4],['Measure for Measure',40,4],
  ['Fifteen American One-Act (Plays)',21,1],['The Ecstasy of Rita Joe',14,1]
] as const) assert.equal(at(title,shelf,row).subject,'Theatre & Plays',title);
for(const [title,shelf,row] of [
  ['النص والعرض المسرحي في الإمارات',33,1],
  ['Julius Caesar Note',40,4],
  ['المسرح، العدد 38 (نوفمبر 2022)',41,8]
] as const) assert.equal(at(title,shelf,row).subject,'Theatre Studies',title);

// Major literary genres have different primary headings based on verified works.
for(const [title,subject] of [
  ['Oliver Twist','Dramatic Fiction'],
  ['David Copperfield','Dramatic Fiction'],
  ['Great Expectations','Dramatic Fiction'],
  ['A Tale of Two Cities','Historical Fiction'],
  ['War and Peace','Historical Fiction'],
  ['Bridge to Terabithia','Realistic & Family Fiction'],
  ['Little Women','Realistic & Family Fiction'],
  ['The Notebook','Romance Fiction'],
  ['The Bridges of Madison County','Romance Fiction'],
  ['The Red Badge of Courage','Historical Fiction'],
  ['The Scarlet Letter','Historical Fiction'],
  ['The Great Gatsby','Dramatic Fiction']
] as const){
  const found=bookData.filter(b=>norm(b.title)===norm(title));
  assert.ok(found.length>0,'Missing verified fiction title: '+title);
  assert.ok(found.every(b=>b.subject===subject),'Wrong literary genre: '+title);
}
assert.equal(getLocalizedSubject('Dramatic Fiction','ar'),'الدراما الروائية والاجتماعية');
assert.equal(getLocalizedSubject('Theatre & Plays','ar'),'المسرح والمسرحيات');
assert.equal(getLocalizedSubject('Theatre Studies','ar'),'الدراسات المسرحية');
for(const x of ["CHILD'S PLAY",'Play As Development','PLAY BETTER GOLF','POWER PLAY']){
  assert.ok(bookData.filter(b=>norm(b.title)===norm(x)).every(b=>
    b.subject!=='Theatre & Plays'&&b.subject!=='Theatre Studies'),
    'Play is not always a dramatic script: '+x);
}
assert.equal(new Set(bookData.map(b=>b.id)).size,bookData.length,'Catalog IDs must stay unique');
console.log('PASS: dramatic fiction, historical and family novels, plays and theatre studies correctly distinguished');
