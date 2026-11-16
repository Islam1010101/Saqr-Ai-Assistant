import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.58.0";

/**
 * School-verified, server-enforced, per-person service switches.
 * Neither localStorage role flags nor client-side submitted role values confer access.
 * Only server-authenticated school administrators may modify grants.
 * Overrides NEVER change login roles, create users or confer system-admin rights.
 */
const keys = [
  "catalog","saqr_ai","digital_library","creators","suggestions","ielts",
  "saqr_learning","national_identity","passport","emirati_language",
  "heritage_detective","flag_glory","voice_union","national_books",
  "challenges","reading_quest","sort_library","saqr_studio","podcast","schedule",
] as const;
type Key = typeof keys[number];
type Role = "student" | "teacher" | "admin";
type Override = Record<string, boolean>;
const identityChildren:Key[]=["passport","emirati_language","heritage_detective","flag_glory","voice_union","national_books"];
const challengeChildren:Key[]=["reading_quest","sort_library","saqr_studio","podcast"];
const schoolEmail=(s:string)=>/^[^@\s]+@falcon-school\.com$/.test(s);
const originAllowed=(s:string|null)=>!!s&&(
  s==="https://www.efipslibrary.com"||s==="https://efipslibrary.com"||
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(s)
);

Deno.serve(async(req:Request)=>{
  const origin=req.headers.get("origin");
  const headers:Record<string,string>={
    "Content-Type":"application/json","Cache-Control":"no-store","Vary":"Origin",
    "Access-Control-Allow-Headers":"authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods":"POST, OPTIONS",
  };
  if(originAllowed(origin))headers["Access-Control-Allow-Origin"]=origin!;
  const reply=(status:number,body:object)=>new Response(JSON.stringify(body),{status,headers});
  if(req.method==="OPTIONS")return new Response(null,{status:originAllowed(origin)?204:403,headers});
  if(req.method!=="POST"||!originAllowed(origin))return reply(403,{error:"ORIGIN_OR_METHOD_DENIED"});
  const token=req.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  if(!token)return reply(401,{error:"AUTH_REQUIRED"});
  const url=Deno.env.get("SUPABASE_URL"),anon=Deno.env.get("SUPABASE_ANON_KEY"),secret=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if(!url||!anon||!secret)return reply(503,{error:"SERVER_UNAVAILABLE"});
  const auth=createClient(url,anon,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:{user},error:authErr}=await auth.auth.getUser(token);
  if(authErr||!user?.id||!user.email_confirmed_at||!user.email)return reply(401,{error:"INVALID_SESSION"});
  const email=user.email.trim().toLowerCase();
  if(!schoolEmail(email)||!user.identities?.some(i=>i.provider==="google"&&i.identity_data?.email_verified===true&&
    String(i.identity_data?.email||"").trim().toLowerCase()===email))return reply(403,{error:"VERIFIED_SCHOOL_GOOGLE_REQUIRED"});
  const db=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
  let body:any={};
  try{body=await req.json()}catch{return reply(400,{error:"INVALID_BODY"})}
  const action=String(body.action||"my-access");
  const {data:ctrl,error:ctrlError}=await db.from("efips_account_access_controls")
    .select("disabled_at,login_role").eq("email",email).maybeSingle();
  if(ctrlError)return reply(503,{error:"ACCESS_DIRECTORY_UNAVAILABLE"});
  if(ctrl?.disabled_at)return reply(403,{error:"ACCOUNT_DISABLED"});

  const getRole=async(target:string):Promise<{role:Role;teacherId?:string;studentId?:string}|null>=>{
    if(!schoolEmail(target))return null;
    const {data:staff,error:staffError}=await db.from("efips_google_staff_accounts")
      .select("teacher_id,role").eq("email",target).maybeSingle();
    if(staffError)throw Error("STAFF_DIRECTORY_UNAVAILABLE");
    if(staff && (staff.role==="admin"||staff.role==="teacher") && staff.teacher_id)
      return {role:staff.role,teacherId:String(staff.teacher_id)};
    const studentId=/^(\d{6,7})@falcon-school\.com$/.exec(target)?.[1];
    if(!studentId)return null;
    const {data:student,error:studentError}=await db.from("students").select("student_id")
      .eq("student_id",studentId).maybeSingle();
    if(studentError)throw Error("STUDENT_DIRECTORY_UNAVAILABLE");
    return student?{role:"student",studentId}:null;
  };
  try{
    const who=await getRole(email);
    if(!who || (ctrl?.login_role && !["both",who.role].includes(ctrl.login_role)))
      return reply(403,{error:"REGISTERED_SCHOOL_ACCOUNT_REQUIRED"});
    const getOverrides=async(target:string)=>{
      const {data,error}=await db.from("efips_user_feature_overrides")
        .select("feature_key,allowed").eq("email",target);
      if(error)throw Error("FEATURE_DIRECTORY_UNAVAILABLE");
      return Object.fromEntries((data||[]).map(row=>[row.feature_key,row.allowed])) as Override;
    };
    const defaults=async(target:string,profile:{role:Role;teacherId?:string;studentId?:string})=>{
      const role=profile.role, isAdmin=role==="admin";
      let pilot=false;
      if(role==="student"){
        const {data,error}=await db.from("saqr_learning_access").select("enabled")
          .eq("student_id",profile.studentId).maybeSingle();
        if(error)throw Error("LEARNING_DIRECTORY_UNAVAILABLE");
        pilot=data?.enabled===true;
      }
      const identity=role==="student"||isAdmin||
        (role==="teacher"&&profile.teacherId?.toUpperCase()==="HR040");
      const challenges=role==="student"||isAdmin;
      const defaults:Record<Key,boolean>={
        catalog:true,saqr_ai:true,digital_library:true,creators:true,
        suggestions:true,ielts:true,
        saqr_learning:(isAdmin&&target==="islam.ahmed@falcon-school.com")||pilot,
        schedule:role==="teacher"||isAdmin,
        national_identity:identity,passport:identity,emirati_language:identity,
        heritage_detective:identity,flag_glory:identity,voice_union:identity,national_books:identity,
        challenges,reading_quest:true,sort_library:challenges,
        saqr_studio:challenges,podcast:challenges,
      };
      return defaults;
    };
    const resolve=async(target:string,profile:{role:Role;teacherId?:string;studentId?:string})=>{
      const [base,overrides]=await Promise.all([defaults(target,profile),getOverrides(target)]);
      const features={...base};
      for(const key of keys)if(typeof overrides[key]==="boolean")features[key as Key]=overrides[key];
      // An explicitly granted challenge makes its parent discoverable, but
      // never grants sibling challenges or the system administrator role.
      if(overrides.national_identity===undefined&&identityChildren.some(key=>overrides[key]===true))
        features.national_identity=true;
      if(overrides.challenges===undefined&&challengeChildren.some(key=>overrides[key]===true))
        features.challenges=true;
      // A parent grant enables its unmodified children; individual deny wins.
      if(overrides.national_identity===true)
        for(const key of identityChildren)if(overrides[key]===undefined)features[key]=true;
      if(overrides.challenges===true)
        for(const key of challengeChildren)if(overrides[key]===undefined)features[key]=true;
      return {role:profile.role,features,overrides,defaults:base};
    };
    if(action==="my-access"){
      const resolved=await resolve(email,who);
      return reply(200,{ok:true,role:resolved.role,features:resolved.features});
    }
    if(who.role!=="admin")return reply(403,{error:"ADMIN_REQUIRED"});
    const target=String(body.email||"").trim().toLowerCase();
    if(!schoolEmail(target))return reply(400,{error:"VALID_SCHOOL_EMAIL_REQUIRED"});
    const {data:targetControl,error:targetError}=await db.from("efips_account_access_controls")
      .select("disabled_at").eq("email",target).maybeSingle();
    if(targetError)return reply(503,{error:"TARGET_DIRECTORY_UNAVAILABLE"});
    const targetProfile=await getRole(target);
    if(!targetProfile)return reply(404,{error:"TARGET_NOT_FOUND"});
    if(action==="admin-get"){
      return reply(200,{ok:true,email:target,...await resolve(target,targetProfile),disabled:!!targetControl?.disabled_at});
    }
    if(action!=="admin-set")return reply(400,{error:"UNKNOWN_ACTION"});
    const key=String(body.feature||"");
    const value=body.value;
    if(!keys.some(item=>item===key)||!(value===null||typeof value==="boolean"))
      return reply(400,{error:"INVALID_FEATURE_OR_VALUE"});
    // No self-admin promotion, cross-account authority or role edits.
    if(value===null){
      const {error}=await db.from("efips_user_feature_overrides").delete()
        .eq("email",target).eq("feature_key",key);
      if(error)throw Error("FEATURE_WRITE_FAILED");
    }else{
      const {error}=await db.from("efips_user_feature_overrides").upsert({
        email:target,feature_key:key,allowed:value,
        updated_by:email,updated_at:new Date().toISOString()
      },{onConflict:"email,feature_key"});
      if(error)throw Error("FEATURE_WRITE_FAILED");
    }
    return reply(200,{ok:true,email:target,...await resolve(target,targetProfile)});
  }catch(e){
    console.error("efips-feature-access",e instanceof Error?e.message:"UNKNOWN");
    return reply(503,{error:"FEATURE_SERVICE_UNAVAILABLE"});
  }
});
