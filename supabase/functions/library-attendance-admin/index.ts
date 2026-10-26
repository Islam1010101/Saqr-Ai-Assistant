import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.57.0';

const cors={'Access-Control-Allow-Origin':'https://www.efipslibrary.com','Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info','Access-Control-Allow-Methods':'POST, OPTIONS'};
const reply=(status:number,result:unknown)=>new Response(JSON.stringify(result),{status,headers:{...cors,'Content-Type':'application/json'}});
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response(null,{headers:cors});
 if(req.method!=='POST')return reply(405,{error:'Method not allowed'});
 try{
  const bearer=req.headers.get('Authorization')?.match(/^Bearer (.+)$/i)?.[1];
  if(!bearer)return reply(401,{error:'Admin Supabase Auth session required'});
  const url=Deno.env.get('SUPABASE_URL')!,anon=Deno.env.get('SUPABASE_ANON_KEY')!,secret=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const auth=createClient(url,anon,{global:{headers:{Authorization:'Bearer '+bearer}},auth:{persistSession:false}});
  const {data:{user},error}=await auth.auth.getUser(bearer);
  if(error||!user||!user.email_confirmed_at||user.email?.trim().toLowerCase()!=='islam.ahmed@falcon-school.com'||user.app_metadata?.efips_library_attendance_admin!==true)return reply(403,{error:'Attendance administrator not authorized'});
  const db=createClient(url,secret,{auth:{persistSession:false}});
  const data=await req.json();
  const week=String(data.week||'');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(week)||new Date(week+'T12:00:00').getUTCDay()!==1)return reply(400,{error:'Invalid Monday week'});
  const end=new Date(week+'T12:00:00');end.setUTCDate(end.getUTCDate()+4);
  const friday=end.toISOString().slice(0,10);
  const operation=String(data.action||'list');
  if(operation==='list'){
   const [records,archive]=await Promise.all([
    db.from('library_attendance_records').select('*').eq('week_start',week).order('session_date'),
    db.from('library_attendance_archives').select('week_start').eq('week_start',week).maybeSingle()
   ]);
   if(records.error||archive.error)return reply(500,{error:'Attendance records unavailable'});
   return reply(200,{rows:records.data||[],archived:!!archive.data});
  }
  const {data:archived}=await db.from('library_attendance_archives').select('week_start').eq('week_start',week).maybeSingle();
  if(archived)return reply(409,{error:'Week already archived'});
  if(operation==='mark'){
   const date=String(data.date||''),slot=String(data.slot_id||''),status=String(data.status||'');
   const teacher=String(data.teacher_name||'').trim(),subject=String(data.subject||''),grade=String(data.grade||''),teacherId=String(data.teacher_id||'');
   if(date<week||date>friday||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!['attended','absent','unmarked'].includes(status)||slot.length>120||teacher.length>200||!teacher||subject.length>300||grade.length>150)return reply(400,{error:'Invalid attendance record'});
   // Verify the reference slot against recurring bookings; no writes to that table.
   const {data:booking,error:bookingError}=await db.from('library_schedule').select('id,teacher,user_id,subject,grade').eq('id',slot).maybeSingle();
   if(bookingError||!booking||!booking.teacher)return reply(409,{error:'Original booking not found'});
   if(String(booking.teacher)!==teacher)return reply(409,{error:'Booking changed; reload before marking'});
   const {error:saveError}=await db.from('library_attendance_records').upsert({week_start:week,session_date:date,slot_id:slot,teacher_name:teacher,teacher_id:teacherId,grade,subject,status,recorded_at:status==='unmarked'?null:new Date().toISOString(),updated_at:new Date().toISOString()},{onConflict:'session_date,slot_id'});
   if(saveError)return reply(500,{error:'Could not save attendance'});
   return reply(200,{ok:true});
  }
  if(operation==='archive'){
   if(friday>=new Date().toISOString().slice(0,10))return reply(400,{error:'Week not complete'});
   if(data.pdf_saved!==true)return reply(400,{error:'PDF confirmation required'});
   const {error:archiveError}=await db.from('library_attendance_archives').insert({week_start:week,archived_by:user.id});
   if(archiveError)return reply(500,{error:'Unable to archive week'});
   const {error:deleteError}=await db.from('library_attendance_records').delete().eq('week_start',week);
   if(deleteError)return reply(500,{error:'Archive marker saved; cleanup requires administrator review'});
   return reply(200,{archived:true});
  }
  return reply(400,{error:'Invalid action'});
 }catch{return reply(500,{error:'Attendance service unavailable'});}
});
