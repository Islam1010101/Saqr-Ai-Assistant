import {physicalReadingCatalog, type ReadingBook} from './readingPassport';
import {ARABIC_LIBRARY_DATABASE,ENGLISH_LIBRARY_DATABASE} from '../../api/digitalBookData';

const catalogs:ReadingBook[]=[
 ...physicalReadingCatalog,
 ...ARABIC_LIBRARY_DATABASE.map(b=>({key:'digital:ar:'+b.id,title:b.title,author:b.author,subject:b.subject,format:'ar' as const,href:b.driveLink})),
 ...ENGLISH_LIBRARY_DATABASE.map(b=>({key:'digital:en:'+b.id,title:b.title,author:b.author,subject:b.subject,format:'en' as const,href:b.driveLink}))
];
const byKey=new Map(catalogs.map(x=>[x.key,x]));
const compact=(v:unknown)=>String(v??'').trim();
export type BorrowingRecord={title:string;due:string};
export type ReaderShelf={borrowed:BorrowingRecord[];saved:ReadingBook[];completed:ReadingBook[];goal:number};

export function readingShelfFromDevice(storageKey:string,store:{getItem(key:string):string|null}):Omit<ReaderShelf,'borrowed'> {
 let data:any=null;
 try{data=JSON.parse(store.getItem(storageKey)||'null');}catch{}
 const keys=(v:unknown)=>Array.isArray(v)?[...new Set(v.filter((x):x is string=>typeof x==='string'))].slice(0,40):[];
 return {saved:keys(data?.saved).map(k=>byKey.get(k)).filter((v):v is ReadingBook=>!!v),
 completed:keys(data?.completed).map(k=>byKey.get(k)).filter((v):v is ReadingBook=>!!v),
 goal:Number.isFinite(Number(data?.goal))?Math.max(1,Math.min(20,Number(data.goal))):3};
}
export const deviceReadingKey=(user:Record<string,any>,role:string):string=>{
 const id=compact(user?.student_id||user?.teacher_id||user?.user_id||user?.id);
 return 'efips-reading-passport-v1:'+role+':'+id;
};
const active=new Set(['active','approved','confirmed','borrowed','issued','checked_out','checkedout','on_loan','قيد_الاستعارة','مستعار','مستعارة','معار','نشط','نشطة']);
export const borrowerIds=(user:Record<string,any>,role:string):string[]=>
 [...new Set((role==='student'?[user.student_id,user.id,user.user_id]:[user.teacher_id,user.id,user.user_id,user.employee_id,user.staff_id]).map(compact).filter(Boolean))];
export const filterActiveBorrowings=(rows:any[]):BorrowingRecord[]=>rows.filter(r=>active.has(compact(r?.status).toLowerCase().replace(/[\s-]+/g,'_')))
 .map(r=>({title:compact(r.book_name||r.book_title||r.title||r.name),due:compact(r.return_date||r.due_date||r.expected_return_date)}))
 .filter(b=>!!b.title).slice(0,12);
export const toSaqrShelfContext=(shelf:ReaderShelf,locale:'ar'|'en'):string=>{
 const book=(b:ReadingBook)=>({title:b.title,author:b.author,format:b.format,location:b.format==='physical'?'Physical shelf '+b.shelf+', row '+b.row:b.href,subject:b.subject});
 return 'CURRENT READER LIBRARY (verified only within data readable to this account; do not claim a remote record if not visible): '+JSON.stringify({
 borrowed:shelf.borrowed,saved:shelf.saved.slice(0,12).map(book),completed:shelf.completed.slice(0,12).map(book),monthlyGoal:shelf.goal
 })+'. Summarize or encourage reading of these actual books only. If details are incomplete, ask for the title or text; never pretend to have read its full content. Distinguish physical loans, digital/physical saved reading and completed reading. Language: '+locale+'.';
};
