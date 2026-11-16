import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.58.0";

// Service-level permissions are deliberately separate from school login roles.
// Never use localStorage, request email, user_metadata or caller-supplied roles.
const keys = [
 "catalog","saqr_ai","digital_library","ielts","creators","saqr_learning",
 "schedule","national_identity","passport","emirati_language","heritage_detective",
 "flag_glory","voice_union","national_books","challenges","reading_quest",
 "sort_library","saqr_studio","podcast","suggestions"
] as const;
const nationalChildren = ["passport","emirati_language","heritage_detective","flag_glory","voice_union","national_books"] as const;
const challengeChildren = ["sort_library","saqr_studio","podcast"] as const;
const allowedOrigin = (origin:string) =>
  origin === "https://www.efipslibrary.com" || origin === "https://efipslibrary.com" ||
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin);

Deno.serve(async (req:Request) => {
  const origin=req.headers.get("origin")||"";
  const headers:Record<string,string> = {
    "Content-Type":"application/json","Cache-Control":"no-store","Vary":"Origin",
    "Access-Control-Allow-Headers":"authorization,apikey,content-type,x-client-info",
    "Access-Control-Allow-Methods":"POST,OPTIONS"
  };
  if (allowedOrigin(origin)) headers["Access-Control-Allow-Origin"]=origin;
  const respond=(status:number,body:object)=>new Response(JSON.stringify(body),{status,headers});
  if (req.method==="OPTIONS") return new Response(null,{status:allowedOrigin(origin)?204:403,headers});
  if (req.method!=="POST" || !allowedOrigin(origin)) return respond(403,{error:"FORBIDDEN"});
  const jwt=req.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!jwt) return respond(401,{error:"AUTH_REQUIRED"});
  const url=Deno.env.get("SUPABASE_URL"), anon=Deno.env.get("SUPABASE_ANON_KEY"), secret=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url||!anon||!secret) return respond(503,{error:"UNAVAILABLE"});
  const auth=createClient(url,anon,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:{user},error:authError}=await auth.auth.getUser(jwt);
  if(authError || !user?.email_confirmed_at || !user.email) return respond(401,{error:"INVALID_SESSION"});
  const email=user.email.trim().toLowerCase();
  if (!/^[^@\s]+@falcon-school\.com$/.test(email)) return respond(403,{error:"SCHOOL_REQUIRED"});
  const google=user.identities?.some(i=>i.provider==="google" &&
    i.identity_data?.email_verified===true &&
    String(i.identity_data?.email||"").trim().toLowerCase()===email);
  if (!google) return respond(403,{error:"VERIFIED_GOOGLE_REQUIRED"});

  let request:any={};try{request=await req.json();}catch{return respond(400,{error:"INVALID_BODY"});}
  if(request?.action!=="my-features") return respond(400,{error:"UNSUPPORTED_ACTION"});
  const db=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
  const [control,staff,overrides] = await Promise.all([
    db.from("efips_account_access_controls").select("disabled_at,login_role").eq("email",email).maybeSingle(),
    db.from("efips_google_staff_accounts").select("teacher_id,role").eq("email",email).maybeSingle(),
    db.from("efips_user_feature_overrides").select("feature_key,allowed").eq("email",email)
  ]);
  if(control.error||staff.error||overrides.error) return respond(503,{error:"LOOKUP_UNAVAILABLE"});
  if(control.data?.disabled_at) return respond(403,{error:"ACCOUNT_DISABLED"});
  let role:"student"|"teacher"|"admin", teacherId="";
  if(staff.data?.teacher_id && ["teacher","admin"].includes(staff.data.role)) {
    role=staff.data.role;
    teacherId=staff.data.teacher_id;
  } else {
    const match=/^([0-9]{6,7})@falcon-school\.com$/.exec(email);
    if(!match)return respond(403,{error:"ACCOUNT_NOT_REGISTERED"});
    const student=await db.from("students").select("student_id").eq("student_id",match[1]).maybeSingle();
    if(student.error)return respond(503,{error:"STUDENT_LOOKUP_FAILED"});
    if(!student.data)return respond(403,{error:"ACCOUNT_NOT_REGISTERED"});
    const linked=await db.from("efips_verified_school_readers")
      .select("school_user_id,user_type").eq("auth_user_id",user.id).maybeSingle();
    if(linked.error || linked.data && (linked.data.school_user_id!==match[1] || linked.data.user_type!=="student"))
      return respond(403,{error:"IDENTITY_MISMATCH"});
    role="student";
  }
  if(control.data?.login_role && control.data.login_role!=="both" && control.data.login_role!==role)
    return respond(403,{error:"ROLE_NOT_PERMITTED"});

  let studentLearning=false;
  if(role==="student"){
    const learning=await db.from("saqr_learning_access").select("enabled").eq("student_id",email.split("@")[0]).maybeSingle();
    if(learning.error)return respond(503,{error:"LEARNING_LOOKUP_FAILED"});
    studentLearning=learning.data?.enabled===true;
  }
  const baseIdentity=role==="admin" || role==="student" || (role==="teacher" && teacherId.toUpperCase()==="HR040");
  const studentOrAdmin=role==="student"||role==="admin";
  const defaultValues:Record<string,boolean>={
    catalog:true,saqr_ai:true,digital_library:true,ielts:true,creators:true,
    suggestions:true,saqr_learning:role==="admin"||studentLearning,
    schedule:role==="teacher"||role==="admin",
    national_identity:baseIdentity,
    passport:baseIdentity,emirati_language:baseIdentity,heritage_detective:baseIdentity,
    flag_glory:baseIdentity,voice_union:baseIdentity,national_books:baseIdentity,
    challenges:studentOrAdmin,
    reading_quest:true,sort_library:studentOrAdmin,saqr_studio:studentOrAdmin,podcast:studentOrAdmin
  };
  const choices=new Map<string,boolean>((overrides.data||[])
    .filter(x=>role==="teacher" || (role==="student" && x.allowed===false))
    .map(x=>[x.feature_key,x.allowed===true]));
  const resolved:Record<string,boolean>={};
  for (const key of keys) resolved[key]=choices.get(key)??defaultValues[key]??false;
  // A single granted heritage activity exposes only its container, not siblings.
  if(choices.get("national_identity")===false){
    resolved.national_identity=false;
    for(const key of nationalChildren) resolved[key]=false;
  }else{
    if(nationalChildren.some(key=>choices.get(key)===true))resolved.national_identity=true;
    if(choices.get("national_identity")===true){
      for(const key of nationalChildren)resolved[key]=choices.get(key)??true;
    }
  }
  // A specific challenge grant can reveal the hub without granting its other games.
  if(choices.get("challenges")!==false && challengeChildren.some(key=>choices.get(key)===true))
    resolved.challenges=true;
  if(choices.get("challenges")===false)resolved.challenges=false;
  return respond(200,{ok:true,role,features:resolved});
});
