import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.58.0";
const originAllowed=(origin:string|null)=>!!origin&&(origin==="https://www.efipslibrary.com"||origin==="https://efipslibrary.com"||/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin));
const text=(value:unknown,max=240)=>String(value??"").trim().slice(0,max);
Deno.serve(async(req:Request)=>{
 const origin=req.headers.get("origin");
 const headers:Record<string,string>={"Content-Type":"application/json","Access-Control-Allow-Headers":"authorization,apikey,content-type,x-client-info","Access-Control-Allow-Methods":"POST,OPTIONS","Vary":"Origin","Cache-Control":"no-store"};
 if(originAllowed(origin))headers["Access-Control-Allow-Origin"]=origin!;
 const respond=(status:number,data:unknown)=>new Response(JSON.stringify(data),{status,headers});
 if(req.method==="OPTIONS")return new Response(null,{status:originAllowed(origin)?204:403,headers});
 if(req.method!=="POST"||!originAllowed(origin))return respond(403,{error:"Forbidden"});
 const url=Deno.env.get("SUPABASE_URL"),anon=Deno.env.get("SUPABASE_ANON_KEY"),secret=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 if(!url||!anon||!secret)return respond(503,{error:"Service unavailable"});
 // Public catalog gets only approved, non-sensitive book metadata; never exposes reviewer details.
 let earlyBody:any;
 try{earlyBody=await req.clone().json()}catch{return respond(400,{error:"Bad JSON"})}
 if(earlyBody.action==="catalog"){
  const catalogUrl=Deno.env.get("SUPABASE_URL"),catalogSecret=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if(!catalogUrl||!catalogSecret)return respond(503,{error:"Service unavailable"});
  const db=createClient(catalogUrl,catalogSecret,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data,error}=await db.from("efips_children_book_reviews").select("catalog_id,title,author,shelf,row_number,isbn,publisher,reading_tier,original_title,original_author,original_shelf,original_row").eq("decision","approved").limit(5000);
  return error?respond(503,{error:"Catalog corrections unavailable"}):respond(200,{ok:true,records:data});
 }
 const token=req.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
 if(!token)return respond(401,{error:"Verified administrator sign-in required"});
 const publicClient=createClient(url,anon,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:{user},error}=await publicClient.auth.getUser(token);
 if(error||!user?.email_confirmed_at||!user.email)return respond(401,{error:"Invalid session"});
 const email=user.email.toLowerCase().trim();
 if(!user.identities?.some(i=>i.provider==="google"&&String(i.identity_data?.email||"").toLowerCase()===email&&i.identity_data?.email_verified===true))return respond(403,{error:"Verified Google sign-in required"});
 const admin=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:staff,error:staffError}=await admin.from("efips_google_staff_accounts").select("role").eq("email",email).maybeSingle();
 if(staffError||staff?.role!=="admin")return respond(403,{error:"Admin role required"});
 const {data:control}=await admin.from("efips_account_access_controls").select("disabled_at").eq("email",email).maybeSingle();
 if(control?.disabled_at)return respond(403,{error:"Account disabled"});
 let body:any;try{body=await req.json()}catch{return respond(400,{error:"Bad JSON"})}
 if(body.action==="list"){
  const {data,error}=await admin.from("efips_children_book_reviews").select("*").order("reviewed_at",{ascending:false}).limit(5000);
  return error?respond(503,{error:"Review records unavailable"}):respond(200,{ok:true,records:data});
 }
 if(body.action==="lookup"){
  const title=text(body.title,160),author=text(body.author,120),isbn=text(body.isbn,32).replace(/[^0-9Xx]/g,"");
  if(!title&&!isbn)return respond(400,{error:"Title or ISBN required"});
  const suggestions:any[]=[];
  const add=(record:any)=>{
    if(!record?.title)return;
    suggestions.push({title:text(record.title),author:text(record.author),publisher:text(record.publisher),isbn:text(record.isbn,32),source_name:text(record.source_name,80),source_url:text(record.source_url,600)});
  };
  const query=new URLSearchParams({limit:"6",fields:"key,title,author_name,isbn,publisher,edition_key"});
  if(isbn)query.set("q","isbn:"+isbn);else {query.set("title",title);if(author)query.set("author",author);}
  const googleQ=isbn?"isbn:"+isbn:("intitle:"+title+(author?" inauthor:"+author:""));
  const sources=await Promise.allSettled([
    fetch("https://openlibrary.org/search.json?"+query.toString(),{headers:{"Accept":"application/json"},signal:AbortSignal.timeout(8500)}).then(r=>{if(!r.ok)throw Error("Open Library unavailable");return r.json()}),
    fetch("https://www.googleapis.com/books/v1/volumes?"+new URLSearchParams({q:googleQ,maxResults:"6"}),{headers:{"Accept":"application/json"},signal:AbortSignal.timeout(8500)}).then(r=>{if(!r.ok)throw Error("Google Books unavailable");return r.json()})
  ]);
  if(sources[0].status==="fulfilled")for(const d of (sources[0].value.docs||[]))add({title:d.title,author:d.author_name?.[0],publisher:d.publisher?.[0],isbn:d.isbn?.find((x:string)=>x.length===13)||d.isbn?.[0],source_name:"Open Library",source_url:"https://openlibrary.org"+String(d.key||"")});
  if(sources[1].status==="fulfilled")for(const d of (sources[1].value.items||[])){const v=d.volumeInfo||{};add({title:v.title,author:v.authors?.join(", "),publisher:v.publisher,isbn:v.industryIdentifiers?.[0]?.identifier,source_name:"Google Books",source_url:v.infoLink||"https://books.google.com/books?id="+encodeURIComponent(d.id||"")});}
  return respond(200,{ok:true,suggestions:suggestions.slice(0,12),source_errors:sources.map((result,i)=>result.status==="rejected"?(i===0?"Open Library":"Google Books"):null).filter(Boolean)});
 }
 if(body.action!=="save")return respond(400,{error:"Unknown action"});
 const record=body.record||{},id=text(record.catalog_id,120),title=text(record.title),author=text(record.author),sourceUrl=text(record.source_url,600),decision=text(record.decision,20),tier=record.reading_tier||null;
 const shelf=Number(record.shelf),row=Number(record.row_number);
 if(!id||!title||!author||!Number.isSafeInteger(shelf)||shelf<1||shelf>999||!Number.isSafeInteger(row)||row<1||row>999)return respond(400,{error:"Valid title, author, shelf and row are required"});
 if(!["pending","approved","rejected"].includes(decision)||tier&&!["beginner","intermediate","advanced"].includes(tier))return respond(400,{error:"Invalid decision or reading tier"});
 if(sourceUrl&&(!/^https:\/\//i.test(sourceUrl)||sourceUrl.length>600))return respond(400,{error:"HTTPS source link required"});
 if(decision==="approved"&&(!sourceUrl||!text(record.source_name)||!tier))return respond(400,{error:"Approval requires a source and reviewed reading tier"});
 const {data:previous}=await admin.from("efips_children_book_reviews").select("original_title,original_author,original_shelf,original_row").eq("catalog_id",id).maybeSingle();
 const originalTitle=text(previous?.original_title||record.original_title||record.title);
 const originalAuthor=text(previous?.original_author||record.original_author||record.author);
 const originalShelf=Number(previous?.original_shelf||record.original_shelf||shelf);
 const originalRow=Number(previous?.original_row||record.original_row||row);
 if(!originalTitle||!originalAuthor||!Number.isSafeInteger(originalShelf)||!Number.isSafeInteger(originalRow))return respond(400,{error:"Original catalog identity required"});
 const payload={catalog_id:id,title,author,shelf,row_number:row,isbn:text(record.isbn,32),publisher:text(record.publisher),source_name:text(record.source_name),source_url:sourceUrl,reading_tier:tier,decision,notes:text(record.notes,1000),original_title:originalTitle,original_author:originalAuthor,original_shelf:originalShelf,original_row:originalRow,reviewed_by:email,reviewed_at:new Date().toISOString()};
 const {data,error:saveError}=await admin.from("efips_children_book_reviews").upsert(payload,{onConflict:"catalog_id"}).select("*").single();
 return saveError?respond(503,{error:"Could not save review"}):respond(200,{ok:true,record:data});
});