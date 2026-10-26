import {createClient} from '@supabase/supabase-js';
import {supabase} from './supabase';
import type {AttendanceRow,AttendanceMark} from './adminLibraryAttendance';

// A separate Supabase Auth client prevents attendance verification from
// changing school teacher/student logins or other Supabase session consumers.
export const attendanceAuth=createClient(supabase.supabaseUrl,supabase.supabaseKey,{
 auth:{storageKey:'efips-library-attendance-admin-session-v1',persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
});
export async function attendanceAdminSession(){
 const {data:{session},error}=await attendanceAuth.auth.getSession();
 if(error||!session)return null;
 const {data:{user}}=await attendanceAuth.auth.getUser();
 if(user?.app_metadata?.efips_library_attendance_admin!==true)return null;
 return session;
}
export async function attendanceAdminSignIn(email:string){
 if(!/^\S+@\S+\.\S+$/.test(email))throw new Error('Enter a valid school email');
 const {error}=await attendanceAuth.auth.signInWithOtp({
   email,
   options:{emailRedirectTo:window.location.origin+'/#/admin',shouldCreateUser:false}
 });
 if(error)throw error;
}
type ApiResult={rows?:Array<Record<string,unknown>>;archived?:boolean;ok?:boolean;error?:string};
const call=async(body:Record<string,unknown>):Promise<ApiResult>=>{
 const session=await attendanceAdminSession();
 if(!session)throw new Error('Verified attendance-admin session required');
 const url=attendanceAuth.supabaseUrl.replace(/\/$/,'')+'/functions/v1/library-attendance-admin';
 const response=await fetch(url,{method:'POST',headers:{
  Authorization:'Bearer '+session.access_token,apikey:attendanceAuth.supabaseKey,'Content-Type':'application/json'
 },body:JSON.stringify(body)});
 const data=await response.json() as ApiResult;
 if(!response.ok)throw new Error(data.error||'Attendance service unavailable');
 return data;
};
export const fetchCloudAttendance=(week:string)=>call({action:'list',week});
export const markCloudAttendance=(week:string,row:AttendanceRow,mark:AttendanceMark)=>call({
 action:'mark',week,date:row.date,slot_id:row.slotId,teacher_name:row.teacher,
 teacher_id:row.userId,subject:row.subject,grade:row.grade,status:mark
});
export const archiveCloudAttendance=(week:string)=>call({action:'archive',week,pdf_saved:true});
