import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {supabase} from '../utils/supabase';

type Summary = {
  requests:number;groqServed:number;cloudflareServed:number;fallbacks:number;failedRequests:number;
  groqAttempts:number;groqSuccesses:number;cloudflareAttempts:number;cloudflareSuccesses:number;
  avgLatencyMs:number;
};
type Day = {date:string;groq:number;cloudflare:number;fallbacks:number;failed:number};
type Metrics = {last7d:Summary;last30d:Summary;daily:Day[]};
type Range = 'last7d'|'last30d';
const zero:Summary={requests:0,groqServed:0,cloudflareServed:0,fallbacks:0,failedRequests:0,groqAttempts:0,groqSuccesses:0,cloudflareAttempts:0,cloudflareSuccesses:0,avgLatencyMs:0};
const number=(v:unknown):number=>Number.isFinite(Number(v))?Math.max(0,Number(v)):0;
const readSummary=(v:any):Summary=>Object.fromEntries(Object.keys(zero).map(key=>[key,number(v?.[key])])) as unknown as Summary;
const percentage=(numerator:number,denominator:number)=>denominator?((numerator/denominator)*100).toFixed(1)+'%':'0.0%';
const format=(v:number,ar:boolean)=>Math.round(v).toLocaleString(ar?'ar-EG':'en-US');

export default function AdminSaqrProviderMetrics({isAr}:{isAr:boolean}){
  const [data,setData]=useState<Metrics|null>(null);
  const [range,setRange]=useState<Range>('last7d');
  const [loading,setLoading]=useState(true);
  const [unavailable,setUnavailable]=useState(false);
  const [refreshedAt,setRefreshedAt]=useState<Date|null>(null);
  const fetchMetrics=useCallback(async()=>{
    try {
      const {data:result,error}=await supabase.rpc('get_saqr_ai_provider_metrics');
      if(error||!result?.last7d||!result?.last30d)throw error||new Error('Missing aggregate');
      setData({last7d:readSummary(result.last7d),last30d:readSummary(result.last30d),
        daily:Array.isArray(result.daily)?result.daily.map((d:any)=>({
          date:String(d.date||''),groq:number(d.groq),cloudflare:number(d.cloudflare),
          fallbacks:number(d.fallbacks),failed:number(d.failed)
        })):[]});
      setUnavailable(false);setRefreshedAt(new Date());
    }catch{setUnavailable(true);}finally{setLoading(false);}
  },[]);
  useEffect(()=>{
    void fetchMetrics();
    const timer=window.setInterval(()=>void fetchMetrics(),60000);
    return ()=>window.clearInterval(timer);
  },[fetchMetrics]);
  const chosen=(data?.[range]||zero);
  const success=chosen.groqServed+chosen.cloudflareServed;
  const series=useMemo(()=>{
    const days=data?.daily||[];
    return days.map(d=>({...d,total:d.groq+d.cloudflare,day:d.date.slice(5)}));
  },[data]);
  const maxDaily=Math.max(1,...series.map(d=>d.total));
  const providerStats=[
    {id:'groq',label:'Groq',color:'bg-emerald-500',soft:'bg-emerald-50 dark:bg-emerald-950/30',text:'text-emerald-700 dark:text-emerald-300',
      served:chosen.groqServed,attempts:chosen.groqAttempts,successes:chosen.groqSuccesses},
    {id:'cloudflare',label:'Cloudflare',color:'bg-sky-500',soft:'bg-sky-50 dark:bg-sky-950/30',text:'text-sky-700 dark:text-sky-300',
      served:chosen.cloudflareServed,attempts:chosen.cloudflareAttempts,successes:chosen.cloudflareSuccesses}
  ];
  return <section className="lg:col-span-4 efips-panel rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm" aria-labelledby="saqr-provider-metrics">
    <div className="flex flex-wrap gap-3 items-start justify-between mb-5">
      <div><div className="flex items-center gap-2">
        <span className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 grid place-items-center" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M4 19V7m5 12V4m5 15v-8m5 8V6M2 19h20" strokeLinecap="round"/></svg>
        </span>
        <h3 id="saqr-provider-metrics" className="text-lg font-black text-slate-900 dark:text-white">{isAr?'مراقبة خدمات صقر الذكية':'Saqr AI Provider Monitor'}</h3>
      </div>
      <p className="text-xs mt-2 text-slate-500 dark:text-slate-400">{isAr?'مراقبة فعلية للطلبات المنفذة عبر Groq وCloudflare، للأدمن فقط.':'Verified request activity across Groq and Cloudflare. Admin only.'}</p></div>
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1" role="group" aria-label={isAr?'نطاق التقرير':'Report period'}>
          {(['last7d','last30d'] as Range[]).map(period=><button type="button" key={period} aria-pressed={range===period}
            onClick={()=>setRange(period)} className={`rounded-lg px-3 py-2 text-xs font-black transition-colors ${range===period?'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-200 shadow-sm':'text-slate-500 dark:text-slate-300'}`}>
            {period==='last7d'?(isAr?'7 أيام':'7 days'):(isAr?'30 يومًا':'30 days')}
          </button>)}
        </div>
        <button type="button" onClick={()=>void fetchMetrics()} className="rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-emerald-400">{isAr?'تحديث':'Refresh'}</button>
      </div>
    </div>
    {loading && !data?<div className="py-12 text-center text-sm text-slate-500">{isAr?'جاري قراءة الإحصائيات...':'Loading provider metrics...'}</div>:
      unavailable && !data?<div className="border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20 rounded-2xl p-4 text-sm font-bold text-amber-800 dark:text-amber-200" role="status">
        {isAr?'تعذر قراءة إحصائيات المزوّدين. تأكد من دخولك بحساب مدير النظام المخوّل أو اتصال قاعدة البيانات.':'Unable to read provider metrics. Check approved administrator access or database connectivity.'}
      </div>:
      <>
        {unavailable&&<p className="mb-4 text-xs text-amber-700 dark:text-amber-300">{isAr?'تعذر تحديث البيانات؛ المعروض آخر قراءة ناجحة.':'Refresh failed; showing the last successful data.'}</p>}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
          {[
            {label:isAr?'إجمالي الطلبات':'Requests',value:format(chosen.requests,isAr),help:isAr?'طلبات مسجلة':'Recorded'},
            {label:isAr?'نجحت':'Successful',value:format(success,isAr),help:percentage(success,chosen.requests)},
            {label:isAr?'تحويل احتياطي':'Fallbacks',value:format(chosen.fallbacks,isAr),help:percentage(chosen.fallbacks,chosen.requests)},
            {label:isAr?'فشلت تمامًا':'Failed',value:format(chosen.failedRequests,isAr),help:percentage(chosen.failedRequests,chosen.requests)},
            {label:isAr?'متوسط الاستجابة':'Avg. latency',value:chosen.requests?Math.round(chosen.avgLatencyMs).toLocaleString(isAr?'ar-EG':'en-US')+' ms':'—',help:isAr?'يشمل محاولة الاحتياط':'Includes failover'}
          ].map(item=><div key={item.label} className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-black tabular-nums text-slate-900 dark:text-white">{item.value}</div><div className="text-xs font-black mt-2 text-slate-700 dark:text-slate-200">{item.label}</div><div className="text-[11px] mt-1 text-slate-500 dark:text-slate-400">{item.help}</div>
          </div>)}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
            <h4 className="text-sm font-black mb-4 text-slate-900 dark:text-white">{isAr?'الاستجابات حسب المزوّد':'Responses by provider'}</h4>
            {providerStats.map(p=><div key={p.id} className="mb-5 last:mb-0">
              <div className="flex justify-between gap-3 text-xs sm:text-sm mb-2">
                <span className="font-black">{p.label}</span><span className={`font-black tabular-nums ${p.text}`}>{format(p.served,isAr)} / {format(success,isAr)}</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden" role="img" aria-label={p.label+': '+p.served}>
                <div className={`h-full rounded-full transition-all ${p.color}`} style={{width:success?100*p.served/success+'%':'0%'}}/>
              </div>
              <p className="text-[11px] mt-2 text-slate-500 dark:text-slate-400">{isAr?'نجاح المحاولات':'Successful attempts'}: {format(p.successes,isAr)} / {format(p.attempts,isAr)} ({percentage(p.successes,p.attempts)})</p>
            </div>)}
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
            <h4 className="text-sm font-black mb-4 text-slate-900 dark:text-white">{isAr?'آخر سبعة أيام':'Last 7 days'}</h4>
            <div className="grid grid-cols-7 gap-2 h-36 sm:h-44 items-end">
              {series.map(day=><div key={day.date} className="min-w-0 flex flex-col items-center justify-end gap-2 h-full">
                <span className="text-[10px] tabular-nums text-slate-500">{day.total||' '}</span>
                <div className="w-full max-w-10 h-28 sm:h-32 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 flex flex-col justify-end" role="img" aria-label={day.date+': Groq '+day.groq+', Cloudflare '+day.cloudflare}>
                  <div className="bg-sky-500 w-full" style={{height:(100*day.cloudflare/maxDaily)+'%'}}/>
                  <div className="bg-emerald-500 w-full" style={{height:(100*day.groq/maxDaily)+'%'}}/>
                </div><span className="text-[10px] sm:text-xs font-bold tabular-nums text-slate-500">{day.day}</span>
              </div>)}
            </div>
            <div className="flex flex-wrap gap-4 text-xs font-bold mt-4 text-slate-500 dark:text-slate-300">
              <span><i className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-500 me-1" />Groq</span>
              <span><i className="inline-block w-2.5 h-2.5 rounded-sm bg-sky-500 me-1" />Cloudflare</span>
            </div>
          </div>
        </div>
        <div className="mt-4 text-xs leading-6 text-slate-500 dark:text-slate-400">
          {chosen.requests===0?(isAr?'لم تُسجل طلبات منذ تفعيل المراقبة؛ لا نعرض بيانات تاريخية تخمينية.':'No requests have been recorded since monitoring was enabled; no historical activity is inferred.') :
            (isAr?'التبادل المثبت: وجود استجابات ناجحة من المزوّدين، مع صفر تحويلات احتياطية، يثبت تشغيلهما المستقل ضمن الفترة.':'Independent activity is confirmed when both providers respond successfully with zero fallbacks.')}
          {refreshedAt&&<span className="ms-2">{isAr?'آخر تحديث':'Updated'}: {refreshedAt.toLocaleTimeString(isAr?'ar-AE':'en-US')}</span>}
        </div>
      </>}
  </section>;
}
