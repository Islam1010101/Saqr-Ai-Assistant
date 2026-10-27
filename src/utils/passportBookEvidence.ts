import {verifiedHeritageBookQuestions} from './verifiedHeritageBookQuestions.ts';
/** Only claims explicitly supported by a published book synopsis can be
 * auto-marked; a catalogue title alone is never proof of a book's content.
 * Keep all passport emirate IDs / achievements unchanged.
 */
type L={ar:string;en:string};
export type PassportBookEvidence={
 question:L;choices:[L,L,L];correct:number;explanation:L;source:string;
 difficulty:1|2|3|4;physicalBook:{title:string;author:string;shelf:number;row:number};
};
const planned:Record<string,Partial<Record<1|2|3|4,string>>>={
 'abu-dhabi':{2:'verified-book-zayed-1',3:'verified-book-fort-1'},
 'dubai':{1:'verified-book-heroes-1',3:'verified-book-story-1'}
};
export const getPassportBookEvidence=(emirateId:string,tier:1|2|3|4):PassportBookEvidence|null=>{
 const id=planned[emirateId]?.[tier];
 if(!id)return null;
 const evidence=verifiedHeritageBookQuestions.find(q=>q.id===id);
 if(!evidence)throw new Error('Missing publicly documented passport book evidence '+id);
 return {question:evidence.question,choices:evidence.choices,correct:evidence.correct,
  explanation:evidence.explanation,source:evidence.source,difficulty:tier,physicalBook:evidence.book};
};
export const passportBookEvidenceAssignments=planned;
