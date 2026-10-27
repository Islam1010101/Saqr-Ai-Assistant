import React from 'react';

type Language = 'ar' | 'en';
type EmirateId = 'abu-dhabi' | 'dubai' | 'sharjah' | 'ajman' | 'umm-al-quwain' | 'ras-al-khaimah' | 'fujairah';

type PassportStampCardProps = {
  emirate: {id:string;name:{ar:string;en:string}};
  language:Language;
  beneficiaryName?:string;
  issuedAt?:string;
  compact?:boolean;
  animate?:boolean;
};

const PassportLandmark:React.FC<{id:string;ar:boolean}>=({id,ar})=>{
 const names:Record<string,[string,string]>={
 'abu-dhabi':['قصر الحصن','Qasr Al Hosn'],'dubai':['برج خليفة','Burj Khalifa'],
 'sharjah':['قلب الشارقة','Heart of Sharjah'],'ajman':['قلعة مصفوت','Masfout Castle'],
 'umm-al-quwain':['حصن أم القيوين','Umm Al Quwain Fort'],
 'ras-al-khaimah':['قلعة ضاية','Dhayah Fort'],'fujairah':['قلعة الفجيرة','Fujairah Fort']};
 const castle=(x:number)=> <><path d={`M${x} 89V44h70v45M${x+8} 44V31h14v13m9 0V30h13v14m9 0V31h14v13M${x+24} 89V65q11-17 22 0v24`}/><path d={`M${x-4} 89h78M${x+8} 56h7m32 0h7`}/></>;
 return <figure className="nh-paper-landmark">
 <svg viewBox="0 0 170 105" role="img" aria-label={ar?names[id]?.[0]:names[id]?.[1]} fill="none" stroke="#137154" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="143" cy="19" r="12" fill="#E8C88C" stroke="none"/><path d="M3 93h164" stroke="#BE9864"/>
 {id==='dubai'?<><path d="M69 92V40h12V23h5V8l5 15h5v17h12v52M62 92h55M81 47h14m-14 13h14m-14 13h14M58 92V64h10m41-6h12v34" /></>:
 id==='abu-dhabi'?castle(45):
 id==='sharjah'?<><path d="M24 90V52h122v38M43 90V62h20v28M90 90V62h20v28M31 52V39h14v13m33 0V35h14v17m31 0V38h14v14" /><path d="M15 93h140" /></>:
 id==='ajman'?<><path d="M42 92V53h84v39M52 53V39h15v14m18 0V32h15v21m15 0V39h11v14M76 92V70q8-12 16 0v22" /><path d="M32 93h107" /></>:
 id==='umm-al-quwain'?<><path d="M32 92V49h106v43M42 49V37h15v12m18 0V31h15v18m25 0V37h14v12M79 92V66h19v26" /><path d="M20 95h132" /></>:
 id==='ras-al-khaimah'?<><path d="M3 75 34 29l23 29 22-43 37 60M41 89V51h81v38M53 51V39h13v12m25 0V38h13v13M73 89V67h18v22" /><path d="M22 92h128" /></>:
 <><path d="M3 78 34 32l20 25 22-39 35 57M42 91V54h87v37M55 54V42h14v12m19 0V38h14v16M73 91V67h22v24" /><path d="M23 94h130" /></>}
 </svg><figcaption>{ar?names[id]?.[0]:names[id]?.[1]}</figcaption></figure>;
};

const EmirateSeal:React.FC<{id:string}> = ({id}) => {
  const shared={viewBox:'0 0 100 100',fill:'none',stroke:'currentColor',strokeWidth:3.2,strokeLinecap:'round' as const,strokeLinejoin:'round' as const,'aria-hidden':true as const};
  switch(id as EmirateId){
    case 'abu-dhabi':
      return <svg {...shared}><path d="M21 76h58M28 75V44h44v31M36 43Q50 19 64 43M21 43h58M44 75V58q6-9 12 0v17"/><path d="M50 18v-7M23 33l-7-6M77 33l7-6"/></svg>;
    case 'dubai':
      return <svg {...shared}><path d="M21 77h58M43 75V34h7V15l4-9 3 9v19h7v41M28 75V46h13M66 75V51h12M48 41h11M48 54h11M48 65h11"/></svg>;
    case 'sharjah':
      return <svg {...shared}><path d="M18 76h64M25 75V38h50v37M35 75V51q15-21 30 0v24M25 39l25-21 25 21M38 29h24M34 75V63M66 75V63"/></svg>;
    case 'ajman':
      return <svg {...shared}><path d="M17 67q16 11 33 0t33 0M15 77q20 9 35 0t35 0M33 59l10 9h24l10-9H33ZM54 56V18M54 21 31 54h23M59 29 77 55H59"/></svg>;
    case 'umm-al-quwain':
      return <svg {...shared}><path d="M16 67q16 11 34 0t34 0M16 79q18 9 34 0t34 0M26 52q25-21 48 0-23 21-48 0Z"/><circle cx="38" cy="51" r="2" fill="currentColor"/><path d="m27 51-10-11v22l10-11"/></svg>;
    case 'ras-al-khaimah':
      return <svg {...shared}><path d="m13 76 22-38 13 18 14-29 25 49H13ZM38 75l11-18 11 18M58 37l6 13 8-7M19 82h66"/></svg>;
    default:
      return <svg {...shared}><path d="m10 65 25-40 19 22 12-15 24 33H10ZM13 78q15-9 31 0t31 0M18 86q13-7 28 0t30 0M33 44l7 8 8-8"/></svg>;
  }
};

const PassportStampCard: React.FC<PassportStampCardProps> = ({
  emirate, language, beneficiaryName, issuedAt, compact=false, animate=false
}) => {
  const ar=language==='ar';
  const validDate=issuedAt && !Number.isNaN(Date.parse(issuedAt)) ? new Date(issuedAt) : null;
  const formattedDate=validDate?.toLocaleDateString(ar?'ar-AE':'en-GB',{year:'numeric',month:'long',day:'numeric'});
  const regionIndex:(number | undefined)=({
    'abu-dhabi':1,'dubai':2,'sharjah':3,'ajman':4,'umm-al-quwain':5,'ras-al-khaimah':6,'fujairah':7
  } as Record<string,number>)[emirate.id];

  return <article dir={ar?'rtl':'ltr'} className={'nh-passport-paper'+(compact?' nh-passport-paper-small':'')+(animate?' nh-paper-animate':'')}
    aria-label={ar?'وثيقة إنجاز ختم إمارة '+emirate.name.ar:'Cultural passport stamp for '+emirate.name.en}>
    <div className="nh-paper-flagline" aria-hidden="true"><i/><i/><i/><i/></div>
    <div className="nh-paper-body">
      <div className="nh-paper-letterhead">
        <img src="/school-logo.png" alt={ar?'شعار مدرسة صقر الإمارات الدولية الخاصة':'EFIPS school logo'} className="nh-paper-logo"/>
        <div className="nh-paper-letterhead-text">
          <strong>{ar?'مدرسة صقر الإمارات الدولية الخاصة':'Emirates Falcon International Private School'}</strong>
          <span>EFIPS • {ar?'المكتبة المدرسية':'School Library'}</span>
        </div>
        <span className="nh-paper-serial">EFIPS–CP–{String(regionIndex??0).padStart(2,'0')}</span>
      </div>
      <div className="nh-paper-rule"/>
      <div className="nh-paper-title">
        <span>{ar?'جواز صقر الثقافي':'SAQR CULTURAL PASSPORT'}</span>
        <h3>{ar?'بطاقة اجتياز مهمة':'Mission Achievement Card'}</h3>
        <p>{ar?'رحلة اكتشاف تراث الإمارات السبع':'Discovering the heritage of the seven emirates'}</p>
      </div>
      <PassportLandmark id={emirate.id} ar={ar}/>
      <div className="nh-paper-details">
        {beneficiaryName && <div><span>{ar?'حامل الجواز':'Passport holder'}</span><strong>{beneficiaryName}</strong></div>}
        <div><span>{ar?'الإمارة':'Emirate'}</span><strong>{emirate.name[language]}</strong></div>
        <div><span>{ar?'حالة المهمة':'Mission status'}</span><strong>{ar?'تم الاجتياز بنجاح':'Successfully completed'}</strong></div>
        <div><span>{ar?'تاريخ الإنجاز':'Completion date'}</span><strong>{formattedDate || (ar?'إنجاز محفوظ سابقًا':'Previously completed')}</strong></div>
      </div>
      <div className="nh-paper-lower">
        <div className="nh-paper-official-note">
          <span>{ar?'ختم الجواز الثقافي':'Cultural passport mark'}</span>
          <small>{ar?'أُضيفت الإمارة إلى سجل الإنجازات':'Emirate added to your achievements'}</small>
        </div>
        <div className="nh-ink-seal" aria-hidden="true">
          <span className="nh-ink-seal-ring"/>
          <span className="nh-seal-top">{ar?'تم الاجتياز':'COMPLETED'}</span>
          <EmirateSeal id={emirate.id}/>
          <span className="nh-seal-bottom">{emirate.name[language]}</span>
        </div>
      </div>
      <div className="nh-paper-footer"><span>{ar?'تراثنا هويتنا':'OUR HERITAGE • OUR IDENTITY'}</span><span>{ar?'جواز صقر الثقافي':'SAQR CULTURAL PASSPORT'}</span></div>
    </div>
  </article>;
};
export default PassportStampCard;
