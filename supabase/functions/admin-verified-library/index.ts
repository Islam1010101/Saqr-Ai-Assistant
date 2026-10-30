import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.58.0";
const permitted=(o:string|null)=>!!o&&(o==="https://www.efipslibrary.com"||o==="https://efipslibrary.com"||/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(o));
Deno.serve(async(req:Request)=>{
 const origin=req.headers.get("origin");const h:Record<string,string>={"Access-Control-Allow-Headers":"authorization,apikey,content-type,x-client-info","Access-Control-Allow-Methods":"OPTIONS,POST","Vary":"Origin","Content-Type":"application/json"};
 if(permitted(origin))h["Access-Control-Allow-Origin"]=origin!;
 const res=(status:number,data:object)=>new Response(JSON.stringify(data),{status,headers:{...h,"Cache-Control":"no-store"}});
 if(req.method==="OPTIONS")return new Response(null,{status:permitted(origin)?204:403,headers:h});
 if(req.method!=="POST"||!permitted(origin))return res(403,{error:"Forbidden"});
 const url=Deno.env.get("SUPABASE_URL"),anon=Deno.env.get("SUPABASE_ANON_KEY"),secret=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 if(!url||!anon||!secret)return res(503,{error:"Service unavailable"});
 const jwt=req.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];if(!jwt)return res(401,{error:"Sign in required"});
 const client=createClient(url,anon,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:{user},error}=await client.auth.getUser(jwt);if(error||!user?.email_confirmed_at||!user.email)return res(401,{error:"Invalid session"});
 const email=user.email.toLowerCase().trim();
 if(!user.identities?.some(i=>i.provider==="google"&&String(i.identity_data?.email||"").toLowerCase()===email&&i.identity_data?.email_verified===true))return res(403,{error:"Verified Google account required"});
 const admin=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:staff}=await admin.from("efips_google_staff_accounts").select("teacher_id,role").eq("email",email).maybeSingle();
 if(staff?.teacher_id!=="HR785"||staff.role!=="admin")return res(403,{error:"Admin required"});
 let body:any;try{body=await req.json()}catch{return res(400,{error:"Invalid request"})}
 const action=String(body.action||"");
 if(action==="request"){
  const book=String(body.book_name||"").trim().slice(0,240);
  if(!book)return res(400,{error:"Book title required"});
  let borrowerId="",borrowerRole="",name="",grade="";
  const studentMatch=/^([0-9]{6,7})@falcon-school\.com$/.exec(email);
  if(studentMatch){
    const {data:st}=await admin.from("students").select("student_id,name_ar,name_en,grade").eq("student_id",studentMatch[1]).maybeSingle();
    if(!st)return res(403,{error:"Student is not enrolled"});
    borrowerId=st.student_id;borrowerRole="student";name=st.name_ar||st.name_en||"";grade=st.grade||"";
  }else{
    const {data:staff}=await admin.from("efips_google_staff_accounts").select("teacher_id,role").eq("email",email).maybeSingle();
    if(!staff)return res(403,{error:"Staff email is not approved"});
    const {data:teacher}=await admin.from("efips_google_staff_source").select("name_ar,name_en").eq("email",email).maybeSingle();
    borrowerId=staff.teacher_id;borrowerRole=staff.role==="admin"?"admin":"teacher";name=teacher?.name_ar||teacher?.name_en||"";
  }
  const {data:existing}=await admin.from("borrowings").select("id").eq("user_id",borrowerId).eq("book_name",book).in("status",["pending","active"]).limit(1);
  if(existing?.length)return res(409,{error:"Borrowing request already exists"});
  const {error:insertError}=await admin.from("borrowings").insert([{user_id:borrowerId,user_type:borrowerRole,user_email:email,user_name:name,user_grade:grade,book_name:book,
    book_shelf:String(body.book_shelf||"").slice(0,40),book_row:String(body.book_row||"").slice(0,40),status:"pending"}]);
  if(insertError)return res(503,{error:"Could not create borrowing request"});
  return res(200,{ok:true});
 }

 if(action==="directory"){
  const {data:staffList,error:staffErr}=await admin.from("efips_google_staff_accounts").select("email,teacher_id,role");
  if(staffErr)return res(503,{error:"Staff directory unavailable"});
  return res(200,{ok:true,staff:staffList});
 }
 if(action==="approve"){
  const id=Number(body.borrowing_id);if(!Number.isSafeInteger(id)||id<=0)return res(400,{error:"Invalid borrowing"});
  const {data:loan,error:loanErr}=await admin.from("borrowings").select("*").eq("id",id).maybeSingle();
  if(loanErr||!loan||loan.status!=="pending")return res(409,{error:"Borrowing is not pending"});
  let target="";
  if(loan.user_type==="student"&&/^[0-9]{6,7}$/.test(String(loan.user_id||""))){
   target=String(loan.user_id)+"@falcon-school.com";
   const {data:student}=await admin.from("students").select("student_id").eq("student_id",loan.user_id).maybeSingle();
   if(!student)return res(404,{error:"Student not found"});
  }else if(["teacher","admin"].includes(String(loan.user_type))){
   const {data:row}=await admin.from("efips_google_staff_accounts").select("email").eq("teacher_id",String(loan.user_id)).maybeSingle();
   if(!row?.email)return res(404,{error:"Staff email unavailable"});target=row.email;
  }else return res(400,{error:"Unrecognized borrower"});
  const today=new Date().toISOString().slice(0,10);
  const due=new Date(Date.now()+15*86400000).toISOString().slice(0,10);
  const {data:updated,error:updateError}=await admin.from("borrowings")
    .update({status:"active",user_email:target,borrow_date:today,return_date:due,approval_email_status:"pending"})
    .eq("id",id).eq("status","pending").select("id").maybeSingle();
  if(updateError||!updated)return res(409,{error:"Could not approve borrowing"});
  const resend=Deno.env.get("RESEND_API_KEY");
  if(!resend)return res(200,{ok:true,emailSent:false,notice:"Email service not configured",email:target,return_date:due});
  const safe=(v:unknown)=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"} as Record<string,string>)[c]);
  const book=safe(loan.book_name),person=safe(loan.user_name||loan.user_id);
  const html=`<div style="font-family:Tahoma,Arial,sans-serif;max-width:680px;margin:auto;padding:24px;color:#183044"><h2 style="color:#076b5e">EFIPS Library | مكتبة صقر الإمارات</h2><div dir="rtl"><h3>تأكيد استعارة كتاب</h3><p>مرحباً ${person}، تمت الموافقة على استعارة الكتاب <strong>${book}</strong>.</p><p>تاريخ الاستعارة: ${today}</p><p>تاريخ الإرجاع: ${due}</p></div><hr/><h3>Borrowing Approved</h3><p>Dear ${person}, your request to borrow <strong>${book}</strong> has been approved.</p><p>Borrowed: ${today} | Return by: ${due}</p></div>`;
  // Only the verified server-side address is used. No client-supplied "to".
  const {data:claimed}=await admin.from("borrowings").update({approval_email_status:"sending",approval_email_attempted_at:new Date().toISOString()}).eq("id",id).eq("approval_email_status","pending").select("id").maybeSingle();
  if(!claimed)return res(200,{ok:true,emailSent:false,notice:"Email already in progress",email:target,return_date:due});
  try{
   const result=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":`Bearer ${resend}`,"Content-Type":"application/json"},body:JSON.stringify({from:"EFIPS Library <library@efipslibrary.com>",to:[target],subject:"EFIPS Library | Borrowing Confirmation",html})});
   const receipt=await result.json().catch(()=>({}));
   if(!result.ok||!receipt?.id)throw new Error("Delivery rejected");
   await admin.from("borrowings").update({approval_email_status:"sent",approval_email_sent_at:new Date().toISOString(),approval_email_error:null}).eq("id",id).eq("approval_email_status","sending");
   return res(200,{ok:true,emailSent:true,email:target,return_date:due});
  }catch{
   await admin.from("borrowings").update({approval_email_status:"failed",approval_email_error:"Automated email delivery failed"}).eq("id",id).eq("approval_email_status","sending");
   return res(200,{ok:true,emailSent:false,notice:"Email delivery failed",email:target,return_date:due});
  }
 }
 return res(400,{error:"Unsupported action"});
});