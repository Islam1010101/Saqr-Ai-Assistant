import React,{type ReactNode} from 'react';
import {Navigate} from 'react-router-dom';
import {useSchoolServiceAllowed,type SchoolServiceKey} from '../../utils/schoolServiceAccess';
import SaqrStudentScheduleView from '../SaqrStudentScheduleView';

/** Route access is checked against the Edge Function on every mount/focus.
 * This is NOT authorization for underlying writes: server RLS, booking APIs,
 * and Saqr Helps Me entitlement checks keep their original protections.
 */
export default function SchoolServiceGate({feature,children}:{
  feature:SchoolServiceKey;
  children:ReactNode;
}){
  const {allowed,loading,role}=useSchoolServiceAllowed(feature);
  if(loading)return <div role="status" className="mx-auto my-20 max-w-lg p-6 text-center text-sm font-bold text-emerald-800 dark:text-emerald-200">
    Checking school service access...
  </div>;
  if(!allowed)return <Navigate to="/home" replace/>;
  if(feature==='schedule'&&role==='student')return <SaqrStudentScheduleView/>;
  return <>{children}</>;
}
