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
