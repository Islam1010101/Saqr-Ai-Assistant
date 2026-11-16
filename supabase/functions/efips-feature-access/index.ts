import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.58.0";

/**
 * Individual service access is NOT a login role and cannot grant system-admin,
 * teaching authority, booking/edit rights or database write privileges.
 * All reads/writes are server-verified against the live school Google identity.
 */
const KEYS = [
  "catalog","digital_library","creators","national_identity","schedule",
  "saqr_learning","challenges","sort_library","studio","reading_quest","podcast"
] as const;
type Key = typeof KEYS[number];
type Role = "admin"|"teacher"|"student";
const VALID = new Set<string>(KEYS);
const school = /^[^@\s]+@falcon-school\.com$/i;
const origins = new Set(["https://www.efipslibrary.com","https://efipslibrary.com"]);
const allowedOrigin = (origin:string) =>
  origins.has(origin) || /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin);
const enabled = (v:unknown):v is boolean => typeof v === "boolean";

Deno.serve(async (req:Request) => {
  const origin=req.headers.get("origin")||"";
  const cors:Record<string,string>={
    "Content-Type":"application/json","Cache-Control":"no-store","Vary":"Origin",
    "Access-Control-Allow-Headers":"authorization,apikey,content-type,x-client-info",
    "Access-Control-Allow-Methods":"OPTIONS,POST"
  };
  if(allowedOrigin(origin))cors["Access-Control-Allow-Origin"]=origin;
  const reply=(status:number,value:object)=>new Response(JSON.stringify(value),{status,headers:cors});
  if(req.method==="OPTIONS")return new Response(null,{status:allowedOrigin(origin)?204:403,headers:cors});
  if(req.method!=="POST"||!allowedOrigin(origin))return reply(403,{error:"ORIGIN_DENIED"});
  const token=req.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  const url=Deno.env.get("SUPABASE_URL");
  const anon=Deno.env.get("SUPABASE_ANON_KEY");
  const secret=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if(!url||!anon||!secret)return reply(503,{error:"NOT_CONFIGURED"});
  if(!token)return reply(401,{error:"AUTH_REQUIRED"});
  const auth=createClient(url,anon,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:{user},error:authError}=await auth.auth.getUser(token);
  const email=String(user?.email||"").toLowerCase().trim();
  if(authError||!user?.email_confirmed_at||!school.test(email))return reply(401,{error:"VERIFIED_SCHOOL_ACCOUNT_REQUIRED"});
  const googleVerified=user.identities?.some(identity=>
    identity.provider==="google"&&
    String(identity.identity_data?.email||"").toLowerCase()===email&&
    identity.identity_data?.email_verified===true);
  if(!googleVerified)return reply(403,{error:"VERIFIED_GOOGLE_ACCOUNT_REQUIRED"});

  const db=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
  const findRole=async(targetEmail:string):Promise<{role:Role,teacherId:string,studentId:string}|null>=>{
    if(!school.test(targetEmail))return null;
    const {data:staff,error:staffError}=await db.from("efips_google_staff_accounts")
      .select("teacher_id,role").eq("email",targetEmail).maybeSingle();
    if(staffError)throw new Error("STAFF_LOOKUP_FAILED");
    if(staff&&["teacher","admin"].includes(staff.role))
      return {role:staff.role as Role,teacherId:String(staff.teacher_id||""),studentId:""};
    const match=/^(\d{6,7})@falcon-school\.com$/.exec(targetEmail);
    if(!match)return null;
    const {data:student,error:studentError}=await db.from("students")
      .select("student_id").eq("student_id",match[1]).maybeSingle();
    if(studentError)throw new Error("STUDENT_LOOKUP_FAILED");
    return student?{role:"student",teacherId:"",studentId:match[1]}:null;
  };

  let body:Record<string,unknown>;
  try{body=await req.json();if(!body||typeof body!=="object"||Array.isArray(body))throw Error();}
  catch{return reply(400,{error:"INVALID_REQUEST"});}
  const action=String(body.action||"");
  try {
    const {data:controls,error:controlError}=await db.from("efips_account_access_controls")
      .select("disabled_at,login_role").eq("email",email).maybeSingle();
    if(controlError)return reply(503,{error:"ACCESS_LOOKUP_FAILED"});
    if(controls?.disabled_at)return reply(403,{error:"ACCOUNT_DISABLED"});
    const self=await findRole(email);
    if(!self)return reply(403,{error:"SCHOOL_ROSTER_REQUIRED"});

    const getOverrides=async(targetEmail:string):Promise<Partial<Record<Key,boolean>>>=>{
      const {data,error}=await db.from("efips_feature_permissions")
        .select("feature_key,enabled").eq("email",targetEmail);
      if(error)throw new Error("FEATURE_LOOKUP_FAILED");
      return Object.fromEntries((data||[]).filter(x=>VALID.has(x.feature_key))
        .map(x=>[x.feature_key,x.enabled===true])) as Partial<Record<Key,boolean>>;
    };
    const getDefaults=async(targetEmail:string,profile:{role:Role,teacherId:string,studentId:string}):Promise<Record<Key,boolean>>=>{
      const role=profile.role;
      let learning=false;
      if(role==="admin"){
        // Keep the original Saqr Helps Me private admin policy, without expansion.
        learning=targetEmail==="islam.ahmed@falcon-school.com";
      }else if(role==="student"){
        const {data:studentGrant,error:grantError}=await db.from("saqr_learning_access")
          .select("enabled").eq("student_id",profile.studentId).maybeSingle();
        if(grantError)throw new Error("LEARNING_LOOKUP_FAILED");
        learning=studentGrant?.enabled===true;
      }
      return {
        catalog:true,digital_library:true,creators:true,
        national_identity:role==="student"||role==="admin"||profile.teacherId.toUpperCase()==="HR040",
        schedule:role==="teacher"||role==="admin",
        saqr_learning:learning,
        challenges:role==="student"||role==="admin",
        sort_library:role==="student"||role==="admin",
        studio:role==="student"||role==="admin",
        reading_quest:true,podcast:true
      };
    };
    const getEffective=async(targetEmail:string,profile:{role:Role,teacherId:string,studentId:string})=>{
      const [defaults,overrides]=await Promise.all([getDefaults(targetEmail,profile),getOverrides(targetEmail)]);
      const features={...defaults};
      for(const key of KEYS)if(enabled(overrides[key]))features[key]=overrides[key] as boolean;
      return {features,overrides};
    };
    if(action==="my-access"){
      const effective=await getEffective(email,self);
      return reply(200,{ok:true,role:self.role,...effective});
    }
    if(action==="my-schedule"){
      if(self.role!=="student")return reply(403,{error:"STUDENT_VIEW_ONLY"});
      const {features}=await getEffective(email,self);
      if(!features.schedule)return reply(403,{error:"SCHEDULE_NOT_ALLOWED"});
      const {data,error}=await db.from("library_schedule").select("id,teacher,grade");
      if(error)return reply(503,{error:"SCHEDULE_UNAVAILABLE"});
      // Students see booked/free slots, never teacher identifiers, names or writes.
      const slots=(data||[]).map(row=>({id:String(row.id||"").slice(0,60),
        booked:Boolean(row.teacher),grade:String(row.grade||"").slice(0,80)}));
      return reply(200,{ok:true,slots,mode:"view-only"});
    }

    if(self.role!=="admin")return reply(403,{error:"ADMIN_REQUIRED"});
    const targetEmail=String(body.email||"").trim().toLowerCase();
    if(!school.test(targetEmail))return reply(400,{error:"INVALID_SCHOOL_EMAIL"});
    const target=await findRole(targetEmail);
    if(!target)return reply(404,{error:"SCHOOL_USER_NOT_FOUND"});
    if(action==="admin-read"){
      const effective=await getEffective(targetEmail,target);
      return reply(200,{ok:true,email:targetEmail,role:target.role,...effective});
    }
    if(action==="admin-set"){
      const key=String(body.feature_key||"");
      const mode=String(body.mode||"");
      if(!VALID.has(key)||!["default","allow","deny"].includes(mode))
        return reply(400,{error:"INVALID_SERVICE_OR_MODE"});
      const {data:existing,error:oldError}=await db.from("efips_feature_permissions")
        .select("enabled").eq("email",targetEmail).eq("feature_key",key).maybeSingle();
      if(oldError)return reply(503,{error:"PERMISSION_READ_FAILED"});
      const previous=existing?(existing.enabled?"allow":"deny"):"default";
      if(mode==="default"){
        const {error}=await db.from("efips_feature_permissions")
          .delete().eq("email",targetEmail).eq("feature_key",key);
        if(error)return reply(503,{error:"RESET_FAILED"});
      }else{
        const {error}=await db.from("efips_feature_permissions").upsert({
          email:targetEmail,feature_key:key,enabled:mode==="allow",
          updated_by:email,updated_at:new Date().toISOString()
        },{onConflict:"email,feature_key"});
        if(error)return reply(503,{error:"SERVICE_UPDATE_FAILED"});
      }
      if(previous!==mode){
        const {error:auditError}=await db.from("efips_feature_permissions_audit")
          .insert({email:targetEmail,feature_key:key,previous_state:previous,
            new_state:mode,changed_by:email});
        if(auditError)console.error("EFIPS feature audit save failed",auditError.code);
      }
      const effective=await getEffective(targetEmail,target);
      return reply(200,{ok:true,email:targetEmail,role:target.role,...effective});
    }
    return reply(400,{error:"UNSUPPORTED_ACTION"});
  }catch(err){
    console.error("EFIPS feature access failure",err instanceof Error?err.message:"UNEXPECTED");
    return reply(503,{error:"FEATURE_ACCESS_UNAVAILABLE"});
  }
});
