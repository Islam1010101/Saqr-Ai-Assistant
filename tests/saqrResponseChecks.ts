/**
 * Zero-network Saqr regression checks.
 * Run in a TypeScript-capable runner: import { runSaqrResponseChecks } from this module
 * and invoke it. No personal data, live AI tokens or Supabase writes.
 */
import { cleanReader, resolveReplyMode, rankReading, resourcesFor, evaluateSaqrReply, verifiedRoutes } from '../src/utils/saqrResponseLayer';
import type { SaqrBookMatch } from '../src/utils/saqrCatalogSearch';

const check=(cond:boolean,message:string):void=>{if(!cond)throw new Error('Saqr QA: '+message)};
const book=(title:string,subject:string,shelf:number):SaqrBookMatch=>({
  title,author:'Catalog author',subject,shelf,row:2,pageLocation:'Physical Library',matchBasis:'Catalog subject/topic'
});
export const runSaqrResponseChecks=()=>{
  const cases:Array<[string,string,boolean]>=[];
  const test=(name:string,fn:()=>boolean)=>{const pass=fn();cases.push([name,'deterministic',pass]);check(pass,name)};
  test('Arabic book request',()=>resolveReplyMode('عايز كتب عن التربية')==='catalog');
  test('English book request',()=>resolveReplyMode('Books about education')==='catalog');
  test('Reading recommendation',()=>resolveReplyMode('Recommend a suitable book for grade 9')==='recommend');
  test('Discussion query',()=>resolveReplyMode('ناقشني عن التراث الإماراتي')==='discussion');
  test('Assistant identity',()=>resolveReplyMode('عرفني بنفسك وبخدماتك')==='help');
  test('Protected lesson plans',()=>resolveReplyMode('تحضير درس عن الهوية الوطنية')==='protected');
  test('Protected little author',()=>resolveReplyMode('تحدي المؤلف الصغير')==='protected');
  test('Protect writing followups',()=>resolveReplyMode('في اليوم التالي',[
    {role:'user',content:'تحدي المؤلف الصغير'}
  ])==='protected');
  test('Grade sanitization',()=>cleanReader({role:'student',grade:18}).grade===null);
  test('Invalid user role sanitization',()=>cleanReader({role:'superadmin',grade:8}).role==='guest');
  const result=rankReading([book('Professional Accounting','Finance',4),book('Children Storybook','Children',35),book('Our UAE Heritage','History',14)],
    {role:'student',grade:4});
  test('No automatic specialist for young students',()=>result.every(item=>item.audience!=='specialist'));
  test('Young reading recommendation prioritizes children',()=>result.length>0 && result[0].audience==='children');
  test('External resources use allowlisted HTTPS',()=>resourcesFor('علوم وفضاء',{role:'student',grade:10}).every(s=>s.url.startsWith('https://')));
  test('External references are not library holdings',()=>resourcesFor('space and science',{role:'student',grade:4}).every(s=>!s.url.includes('efipslibrary')));
  test('Correct school routes',()=>verifiedRoutes.some(s=>s.route==='/#/search')&&verifiedRoutes.some(s=>s.route==='/#/smart-search')===false);
  const reply=evaluateSaqrReply('Book: Children Storybook, Shelf 35 Row 2','catalog',[book('Children Storybook','Children',35)]);
  test('Catalog grounding quality check',()=>reply.checks.titleGrounded&&reply.checks.shelfGrounded);
  const ungrounded=evaluateSaqrReply('Unknown Book: Shelf 99','catalog',[book('Children Storybook','Children',35)]);
  test('Detect unverified catalog shelf',()=>!ungrounded.checks.shelfGrounded);
  return {passed:cases.filter(x=>x[2]).length,total:cases.length,results:cases};
};
