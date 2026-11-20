import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {createClient} from "npm:@supabase/supabase-js@2.58.0";

// Independent administration endpoint. It never edits original catalogs,
// login, user permissions, Saqr prompt, or other service functions.
const table="efips_admin_catalog_books";
const editTable="efips_admin_physical_edits";
const controlTable="efips_admin_catalog_controls";
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
 // Keep original location requirements and ISBN checksum checks. A physical
 // holding without an ISBN is valid library stock if title, author and location
 // are known; never invent a missing ISBN or accept UPC as an ISBN.
 if(kind==="digital"){
  if(!author)throw Error("AUTHOR_REQUIRED");
  if(!text(v.subject,160))throw Error("SUBJECT_REQUIRED");
  if(!book_url)throw Error("DIGITAL_BOOK_HTTPS_URL_REQUIRED");
  if(text(v.audio_url)&&!audio_url)throw Error("AUDIO_HTTPS_URL_REQUIRED");
 }
 if(source==="manual"&&kind==="physical"){
  if(!author)throw Error("AUTHOR_REQUIRED");
  if(!cabinet)throw Error("CABINET_NUMBER_REQUIRED");
  if(!shelf_row)throw Error("SHELF_ROW_REQUIRED");
  if(text(v.isbn)&&!isbn)throw Error("INVALID_ISBN");
 }
 const pending=kind==="physical"&&(!author||!cabinet||!shelf_row||(!!text(v.isbn)&&!isbn));
 const record={
  kind,status:pending?"pending":"approved",language,title,author,isbn,cabinet,shelf_row,
  national_identity:v.national_identity===true||(kind==="digital"&&v.language==="national"),
  subject,book_url,audio_url,summary:text(v.summary,2000),publisher:text(v.publisher,200),bio:text(v.bio,2000),source,
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

  if(action==="edit_physical"){
   const id=text(body.catalog_id,180);
   if(!id||id!==text(body.catalog_id,1000))throw Error("INVALID_RECORD_ID");
   const input=(body.book||{}) as Input;
   const next=makeRecord(input,user.id,"manual","physical");
   const values={title:next.title,author:next.author,isbn:next.isbn,
    cabinet:next.cabinet,shelf_row:next.shelf_row,national_identity:next.national_identity};
   const added=/^efips-added-([a-f0-9]{32})$/i.exec(id);
   if(added){
    const hex=added[1].toLowerCase();
    const uuid=[hex.slice(0,8),hex.slice(8,12),hex.slice(12,16),hex.slice(16,20),hex.slice(20)].join("-");
    const {data:record,error:foundError}=await admin.from(table).select("id,kind,status").eq("id",uuid).maybeSingle();
    if(foundError||!record||record.kind!=="physical"||record.status!=="approved")throw Error("PHYSICAL_RECORD_NOT_FOUND");
    const {data:updated,error}=await admin.from(table).update({...values,language:next.language,source_fingerprint:next.source_fingerprint})
     .eq("id",uuid).eq("kind","physical").eq("status","approved").select("id").maybeSingle();
    if(error?.code==="23505")throw Error("DUPLICATE_PHYSICAL_HOLDING");
    if(error||!updated)throw Error("PHYSICAL_EDIT_FAILED");
    return respond(200,{ok:true,updated:true});
   }
   if(id.startsWith("efips-added-"))throw Error("INVALID_RECORD_ID");
   const {error}=await admin.from(editTable).upsert({catalog_id:id,...values,edited_at:new Date().toISOString()},{onConflict:"catalog_id"});
   if(error)throw Error("PHYSICAL_EDIT_FAILED");
   return respond(200,{ok:true,updated:true});
  }

  // Edits and removals use stable catalog IDs. Only this verified-admin route can write them.
  if(action==="edit_digital"){
   const library=text(body.library,20),id=text(body.book_id,190);
   if(!["ar","en","national"].includes(library)||!/^[A-Za-z0-9_.:-]{1,190}$/.test(id))throw Error("INVALID_RECORD_ID");
   const book=(body.book||{}) as Input;
   const title=text(book.title),author=text(book.author,200),subject=text(book.subject,160);
   const publisher=text(book.publisher,200),bio=text(book.bio,2000),summary=text(book.summary,2000);
   const link=https(book.book_url),audio=text(book.audio_url,2000);
   if(!title)throw Error("TITLE_REQUIRED");
   if(!author)throw Error("AUTHOR_REQUIRED");
   if(!subject)throw Error("SUBJECT_REQUIRED");
   if(!link)throw Error("DIGITAL_BOOK_HTTPS_URL_REQUIRED");
   // Existing audio files may use the site's same-origin /audio/*.mp3 links.
   if(audio&&!https(audio)&&!/^\/audio\/[^?#\s<>]+\.mp3(?:\?[^#\s<>]*)?$/i.test(audio))throw Error("AUDIO_HTTPS_URL_REQUIRED");
   const update={title,author,subject,publisher,bio,summary,book_url:link,audio_url:audio};
   const existing=/^EFIPS_ADD_([a-f0-9]{32})$/i.exec(id);
   if(existing){
    const hex=existing[1].toLowerCase();
    const uuid=[hex.slice(0,8),hex.slice(8,12),hex.slice(12,16),hex.slice(16,20),hex.slice(20)].join("-");
    const {data:record,error:findErr}=await admin.from(table).select("id,kind,status,language,national_identity").eq("id",uuid).maybeSingle();
    const originalCollection=record?.national_identity?"national":record?.language;
    if(findErr||!record||record.kind!=="digital"||record.status!=="approved"||originalCollection!==library)throw Error("DIGITAL_RECORD_NOT_FOUND");
    const finger="d:"+record.language+":"+norm(link.split("?")[0]);
    const {data:changed,error}=await admin.from(table).update({...update,source_fingerprint:finger})
     .eq("id",uuid).eq("kind","digital").eq("status","approved").select("id").maybeSingle();
    if(error?.code==="23505")throw Error("DUPLICATE_DIGITAL_HOLDING");
    if(error||!changed)throw Error("DIGITAL_EDIT_FAILED");
    return respond(200,{ok:true,updated:true});
   }
   if(id.startsWith("EFIPS_ADD_"))throw Error("DIGITAL_RECORD_NOT_FOUND");
   const {error}=await admin.from(controlTable).upsert({
    library,book_id:id,action:"update",...update,updated_at:new Date().toISOString()
   },{onConflict:"library,book_id"});
   if(error)throw Error("DIGITAL_EDIT_FAILED");
   return respond(200,{ok:true,updated:true});
  }
  if(action==="delete_book"){
   const library=text(body.library,20),id=text(body.book_id,190);
   if(!["physical","ar","en","national"].includes(library)||!/^[A-Za-z0-9_.:-]{1,190}$/.test(id))throw Error("INVALID_RECORD_ID");
   const title=text(body.title),author=text(body.author,200);
   if(!title)throw Error("TITLE_REQUIRED");
   // Preserve current loans and borrowers' reading history; block removal of an outstanding physical loan.
   if(library==="physical"){
    const {data:open,error:loanErr}=await admin.from("borrowings").select("id").eq("book_name",title)
      .in("status",["active","pending"]).limit(1);
    if(loanErr)throw Error("CATALOG_OPERATION_FAILED");
    if(open?.length)throw Error("BOOK_HAS_ACTIVE_LOAN");
   }
   const addedPhysical=/^efips-added-([a-f0-9]{32})$/i.exec(id);
   const addedDigital=/^EFIPS_ADD_([a-f0-9]{32})$/i.exec(id);
   const match=library==="physical"?addedPhysical:addedDigital;
   if(match){
    const hex=match[1].toLowerCase();
    const uuid=[hex.slice(0,8),hex.slice(8,12),hex.slice(12,16),hex.slice(16,20),hex.slice(20)].join("-");
    const {data:record,error:findErr}=await admin.from(table)
      .select("id,kind,status,language,national_identity").eq("id",uuid).maybeSingle();
    const kind=library==="physical"?"physical":"digital";
    const collection=record?.kind==="physical"?"physical":record?.national_identity?"national":record?.language;
    if(findErr||!record||record.kind!==kind||record.status!=="approved"||collection!==library)throw Error("BOOK_NOT_FOUND");
    const {data:removed,error}=await admin.from(table).delete()
      .eq("id",uuid).eq("kind",kind).eq("status","approved").select("id").maybeSingle();
    if(error||!removed)throw Error("BOOK_DELETE_FAILED");
    return respond(200,{ok:true,deleted:true});
   }
   if(id.startsWith("efips-added-")||id.startsWith("EFIPS_ADD_"))throw Error("BOOK_NOT_FOUND");
   const sourceShelf=library==="physical"?positive(body.source_shelf):null;
   const sourceRow=library==="physical"?positive(body.source_row):null;
   const {error}=await admin.from(controlTable).upsert({
    library,book_id:id,action:"delete",title,author,source_title:text(body.source_title||title),
    source_author:text(body.source_author||author,200),source_shelf:sourceShelf,source_row:sourceRow,
    updated_at:new Date().toISOString()
   },{onConflict:"library,book_id"});
   if(error)throw Error("BOOK_DELETE_FAILED");
   return respond(200,{ok:true,deleted:true});
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
  if(/^(TITLE_REQUIRED|AUTHOR_REQUIRED|ISBN_REQUIRED|INVALID_ISBN|CABINET_NUMBER_REQUIRED|SHELF_ROW_REQUIRED|SUBJECT_REQUIRED|DIGITAL_BOOK_HTTPS_URL_REQUIRED|AUDIO_HTTPS_URL_REQUIRED|DIGITAL_REQUIRED_FIELDS|PHYSICAL_REQUIRED_FIELDS|EMPTY_SHEET|FILE_TOO_LARGE|FILE_TOO_MANY_ROWS|EXCEL_NEEDS_TITLE_AUTHOR_HEADERS|EXCEL_XLSX_OR_CSV_ONLY|IMPORT_BATCH_TOO_LARGE|PENDING_PHYSICAL_NOT_FOUND|LOCATION_AUTHOR_REQUIRED|INVALID_RECORD_ID|PHYSICAL_RECORD_NOT_FOUND|DUPLICATE_PHYSICAL_HOLDING|PHYSICAL_EDIT_FAILED|PHYSICAL_REQUIRED_FIELDS|DIGITAL_RECORD_NOT_FOUND|DUPLICATE_DIGITAL_HOLDING|DIGITAL_EDIT_FAILED|BOOK_HAS_ACTIVE_LOAN|BOOK_NOT_FOUND|BOOK_DELETE_FAILED)$/.test(message))
    return respond(400,{ok:false,error:message});
  console.error("Admin catalog action failed",{code:err?.code||"UNKNOWN"});
  return respond(500,{ok:false,error:"CATALOG_OPERATION_FAILED"});
 }
});
