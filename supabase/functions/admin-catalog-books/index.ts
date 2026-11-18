import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {createClient} from "npm:@supabase/supabase-js@2.58.0";

// Independent administration endpoint. It never edits original catalogs,
// login, user permissions, Saqr prompt, or other service functions.
const table="efips_admin_catalog_books";
const originAllowed=(v:string|null):boolean=>!!v&&(v==="https://www.efipslibrary.com"||
 v==="https://efipslibrary.com"||/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(v));
const text=(v:unknown,max=240)=>String(v??"").trim().slice(0,max);
const norm=(v:unknown)=>text(v,400).normalize("NFKC").toLowerCase()
 .replace(/[\u064b-\u065f\u0670\u0640]/g,"").replace(/[أإآٱ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه")
 .replace(/[^\p{L}\p{N}]+/gu,"");
const positive=(v:unknown):number|null=>{
 const s=text(v).replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-0x660));
 if(!s)return null;const n=Number(s);return Number.isInteger(n)&&n>0&&n<=9999?n:null;
};
const isbnValid=(v:unknown):string=>{
 const s=text(v,42).toUpperCase().replace(/^ISBN(?:-1[03])?:?\s*/,"").replace(/[\s-]/g,"");
 if(/^\d{13}$/.test(s)&&[...s].reduce((a,c,i)=>a+Number(c)*(i%2?3:1),0)%10===0)return s;
 if(/^\d{9}[\dX]$/.test(s)&&[...s].reduce((a,c,i)=>a+(10-i)*(c==="X"?10:Number(c)),0)%11===0)return s;
 return "";
};
const https=(v:unknown):string=>{
 const s=text(v,2000);if(!s)return "";
 try{const u=new URL(s);return u.protocol==="https:"&&u.hostname!=="localhost"&&!u.hostname.startsWith("127.")?s:"";}
 catch{return "";}
};
type Input=Record<string,unknown>;
const fingerprint=(v:Record<string,any>):string=>v.kind==="digital"
 ?"d:"+v.language+":"+norm(v.book_url.split("?")[0])
 :"p:"+norm(v.title)+":"+norm(v.author)+":"+text(v.isbn)+":"+(v.cabinet??"pending")+":"+(v.shelf_row??"pending");
function makeRecord(v:Input,uid:string,source:"manual"|"excel",forced?:"physical"|"digital"){
 const kind=forced||(v.kind==="digital"?"digital":"physical");
 const title=text(v.title),author=text(v.author,200);
 if(!title)throw Error("TITLE_REQUIRED");
 const language=kind==="digital"?(v.language==="en"?"en":"ar"):/[\u0600-\u06ff]/.test(title)?"ar":"en";
 const cabinet=kind==="physical"?positive(v.cabinet):null;
 const shelf_row=kind==="physical"?positive(v.shelf_row):null;
 const isbn=kind==="physical"?isbnValid(v.isbn):"";
 const book_url=kind==="digital"?https(v.book_url):"";
 const audio_url=kind==="digital"?https(v.audio_url):"";
 const subject=text(v.subject,160)||(language==="ar"?"غير مصنف":"Unclassified");
 if(kind==="digital"&&(!author||!text(v.subject,160)||!book_url||(text(v.audio_url)&&!audio_url)))
  throw Error("DIGITAL_REQUIRED_FIELDS");
 if(source==="manual"&&kind==="physical"&&(!author||!isbn||!cabinet||!shelf_row))
  throw Error("PHYSICAL_REQUIRED_FIELDS");
 const pending=kind==="physical"&&(!author||!cabinet||!shelf_row||(!!text(v.isbn)&&!isbn));
 const record={
  kind,status:pending?"pending":"approved",language,title,author,isbn,cabinet,shelf_row,
  subject,book_url,audio_url,summary:text(v.summary,2000),source,
  review_note:pending?"Verify missing author, location or ISBN against physical copy":"",
  created_by:uid
 };
 return {...record,source_fingerprint:fingerprint(record)};
}
const headerKey=(v:unknown)=>text(v,120).normalize("NFKC").toLowerCase()
 .replace(/[\u064b-\u065f\u0670\u0640]/g,"").replace(/[\s\-_()\/\\:]+/g,"");
function extractRows(lines:unknown[][]){
 if(!lines.length)throw Error("EMPTY_SHEET");
 const headers=lines[0].map(headerKey);
 const aliases:Record<string,string[]>={
  title:["title","booktitle","bookname","العنوان","عنوانالكتاب","اسمالكتاب"],
  author:["author","authorname","writer","المؤلف","اسمالمؤلف","الكاتب"],
  isbn:["isbn","isbn13","isbn10","الترقيمالدولي","الرقمالدولي"],
  cabinet:["shelfnumber","shelf","cabinet","cabinetnumber","cupboard","رقمالدولاب","الدولاب"],
  shelf_row:["row","rowpage","rownumber","shelfrow","الرف","رقمالرف","الصف","رقمالصف"],
  subject:["subject","topic","category","التصنيف","الموضوع"]
 };
 const positions=Object.fromEntries(Object.entries(aliases).map(([k,a])=>[k,headers.findIndex(x=>a.includes(x))]));
 if(positions.title<0||positions.author<0)throw Error("EXCEL_NEEDS_TITLE_AUTHOR_HEADERS");
 const result:Input[]=[];
 if(lines.length>5001)throw Error("FILE_TOO_MANY_ROWS");
 for(const fields of lines.slice(1,5001)){
  const get=(k:string)=>positions[k]>=0?fields[positions[k]]??"":"";
  if(!text(get("title")))continue;
  result.push({title:text(get("title")),author:text(get("author")),isbn:text(get("isbn")),
   cabinet:get("cabinet"),shelf_row:get("shelf_row"),subject:text(get("subject"))});
 }
 return result;
}
function parseCsv(s:string):unknown[][]{
 const rows:string[][]=[];let cells:string[]=[],part="",quoted=false;
 s=s.replace(/^\uFEFF/,"");
 for(let i=0;i<s.length;i++){
  const ch=s[i];
  if(ch==='"'&&quoted&&s[i+1]==='"'){part+='"';i++;continue;}
  if(ch==='"'){quoted=!quoted;continue;}
  if(ch===','&&!quoted){cells.push(part);part="";continue;}
  if((ch==='\n'||ch==='\r')&&!quoted){
   cells.push(part);if(cells.some(x=>x.trim()))rows.push(cells);
   part="";cells=[];if(ch==='\r'&&s[i+1]==='\n')i++;continue;
  }
  part+=ch;
 }
 cells.push(part);if(cells.some(x=>x.trim()))rows.push(cells);
 return rows;
}
async function parseFile(body:Input):Promise<Input[]>{
 const name=text(body.filename,160).toLowerCase();
 if(name.endsWith(".csv")){
  const source=text(body.csv_text,1500000);
  if(!source)throw Error("EMPTY_SHEET");
  if(String(body.csv_text??"").length>1500000)throw Error("FILE_TOO_LARGE");
  return extractRows(parseCsv(source));
 }
 if(!name.endsWith(".xlsx"))throw Error("EXCEL_XLSX_OR_CSV_ONLY");
 const base64=text(body.file_base64,3500001);
 if(!base64||base64.length>3500000)throw Error("FILE_TOO_LARGE");
 const bytes=Uint8Array.from(atob(base64),c=>c.charCodeAt(0));
 if(bytes.length>2500000)throw Error("FILE_TOO_LARGE");
 const ExcelJS=(await import("npm:exceljs@4.4.0")).default;
 const workbook=new ExcelJS.Workbook();
 await workbook.xlsx.load(bytes as any);
 const sheet=workbook.worksheets[0];if(!sheet)throw Error("EMPTY_SHEET");
 if(sheet.rowCount>5001)throw Error('FILE_TOO_MANY_ROWS');
 const values:unknown[][]=[];
 sheet.eachRow({includeEmpty:false},(r:any)=>{
  if(values.length>5000)return;
  const cells:unknown[]=[];
  for(let i=1;i<=Math.min(r.cellCount,45);i++)cells.push(r.getCell(i).text||"");
  values.push(cells);
 });
 return extractRows(values);
}
Deno.serve(async(req:Request)=>{
 const origin=req.headers.get("origin");
 const cors:Record<string,string>={"Access-Control-Allow-Headers":"authorization,apikey,x-client-info,content-type",
 "Access-Control-Allow-Methods":"POST,OPTIONS","Vary":"Origin"};
 if(originAllowed(origin))cors["Access-Control-Allow-Origin"]=origin!;
 const respond=(status:number,payload:Record<string,unknown>)=>new Response(JSON.stringify(payload),
  {status,headers:{...cors,"Content-Type":"application/json","Cache-Control":"no-store"}});
 if(req.method==="OPTIONS")return new Response(null,{status:originAllowed(origin)?204:403,headers:cors});
 if(req.method!=="POST"||!originAllowed(origin))return respond(403,{ok:false,error:"ORIGIN_NOT_ALLOWED"});
 const token=req.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
 const url=Deno.env.get("SUPABASE_URL"),anon=Deno.env.get("SUPABASE_ANON_KEY"),secret=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 if(!token||!url||!anon||!secret)return respond(401,{ok:false,error:"AUTH_REQUIRED"});
 const auth=createClient(url,anon,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:{user},error:authError}=await auth.auth.getUser(token);
 const email=text(user?.email).toLowerCase();
 if(authError||!user?.email_confirmed_at||!/^[^@\s]+@falcon-school\.com$/.test(email)||
 !user.identities?.some(x=>x.provider==="google"&&text(x.identity_data?.email).toLowerCase()===email&&x.identity_data?.email_verified===true))
  return respond(403,{ok:false,error:"VERIFIED_SCHOOL_GOOGLE_REQUIRED"});
 const admin=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
 const [staff,control]=await Promise.all([
  admin.from("efips_google_staff_accounts").select("role,teacher_id").eq("email",email).maybeSingle(),
  admin.from("efips_account_access_controls").select("disabled_at,login_role").eq("email",email).maybeSingle()
 ]);
 if(staff.error||control.error)return respond(503,{ok:false,error:"DIRECTORY_UNAVAILABLE"});
 if(staff.data?.role!=="admin"||!staff.data.teacher_id||control.data?.disabled_at||control.data?.login_role==="student")
  return respond(403,{ok:false,error:"ADMIN_REQUIRED"});
 const {data:roster}=await admin.from("teachers").select("teacher_id").eq("teacher_id",staff.data.teacher_id).maybeSingle();
 if(!roster)return respond(403,{ok:false,error:"ADMIN_PROFILE_UNAVAILABLE"});
 let body:Input;try{body=await req.json()}catch{return respond(400,{ok:false,error:"BAD_JSON"})}
 try{
  const action=text(body.action,30);
  if(action==="list"){
   const {data,error}=await admin.from(table).select("*").order("created_at",{ascending:false}).limit(750);
   if(error)throw error;return respond(200,{ok:true,records:data||[]});
  }
  if(action==="parse_excel"){
   const records=await parseFile(body);
   return respond(200,{ok:true,records,total:records.length});
  }
  if(action==="add_physical"||action==="add_digital"){
   const item=makeRecord((body.book||{}) as Input,user.id,"manual",action==="add_digital"?"digital":"physical");
   const {data,error}=await admin.from(table).upsert(item,{onConflict:"source_fingerprint",ignoreDuplicates:true})
    .select("id,status").maybeSingle();
   if(error)throw error;return respond(200,{ok:true,added:!!data,status:data?.status||"duplicate"});
  }
  if(action==="import_physical"){
   if(!Array.isArray(body.rows)||body.rows.length>100)throw Error("IMPORT_BATCH_TOO_LARGE");
   const items:Record<string,unknown>[]=[];const seen=new Set<string>();let invalid=0;
   for(const candidate of body.rows){
    try{
     const record=makeRecord(candidate as Input,user.id,"excel","physical");
     if(!seen.has(record.source_fingerprint)){seen.add(record.source_fingerprint);items.push(record);}
    }catch{invalid++}
   }
   if(!items.length)return respond(200,{ok:true,added:0,pending:0,invalid});
   const {data,error}=await admin.from(table).upsert(items,{onConflict:"source_fingerprint",ignoreDuplicates:true})
    .select("id,status");
   if(error)throw error;
   return respond(200,{ok:true,added:data?.length||0,pending:(data||[]).filter(r=>r.status==="pending").length,invalid});
  }
  if(action==="approve_pending"){
   const id=text(body.id,60);
   if(!/^[0-9a-f-]{36}$/i.test(id))throw Error("INVALID_RECORD_ID");
   const {data:old,error:readError}=await admin.from(table).select("*").eq("id",id).eq("status","pending").maybeSingle();
   if(readError||!old||old.kind!=="physical")throw Error("PENDING_PHYSICAL_NOT_FOUND");
   const next=makeRecord({...old,...(body.book as Record<string,unknown>||{})},user.id,"excel","physical");
   if(next.status!=="approved")throw Error("LOCATION_AUTHOR_REQUIRED");
   const {error}=await admin.from(table).update(next).eq("id",id).eq("status","pending");
   if(error)throw error;return respond(200,{ok:true,added:true});
  }
  return respond(400,{ok:false,error:"UNKNOWN_ACTION"});
 }catch(e){
  const err=e as {message?:string;code?:string};
  const message=err?.message||"";
  if(/^(TITLE_REQUIRED|DIGITAL_REQUIRED_FIELDS|PHYSICAL_REQUIRED_FIELDS|EMPTY_SHEET|FILE_TOO_LARGE|FILE_TOO_MANY_ROWS|EXCEL_NEEDS_TITLE_AUTHOR_HEADERS|EXCEL_XLSX_OR_CSV_ONLY|IMPORT_BATCH_TOO_LARGE|PENDING_PHYSICAL_NOT_FOUND|LOCATION_AUTHOR_REQUIRED|INVALID_RECORD_ID)$/.test(message))
    return respond(400,{ok:false,error:message});
  console.error("Admin catalog action failed",{code:err?.code||"UNKNOWN"});
  return respond(500,{ok:false,error:"CATALOG_OPERATION_FAILED"});
 }
});
