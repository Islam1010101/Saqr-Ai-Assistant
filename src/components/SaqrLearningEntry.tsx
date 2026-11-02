import React,{useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {getSaqrLearningAccess} from '../utils/saqrLearningAccess';
export default function SaqrLearningEntry({isAr}:{isAr:boolean}){
 const [allowed,setAllowed]=useState(false);
 useEffect(()=>{let live=true;getSaqrLearningAccess().then(x=>{if(live)setAllowed(x.allowed)}).catch(()=>{if(live)setAllowed(false)});return()=>{live=false}},[]);
 if(!allowed)return null;
 return <Link to="/saqr-learning" className="group relative flex items-center gap-5 rounded-[2.5rem] border-b-8 border-[#145740] bg-[#08785a] p-6 text-white shadow-xl transition-transform duration-300 hover:-translate-y-2 active:translate-y-1">
 <span aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15"><svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1zm0 0v14"/></svg></span>
 <span><strong className="block text-xl font-black">{isAr?'صقر يساعدني':'Saqr Helps Me'}</strong><small className="mt-1 block text-xs sm:text-sm">{isAr?'مساحتك الخاصة للتعلم':'Your personal learning space'}</small></span>
 </Link>;
}