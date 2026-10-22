import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../App';

const EVENT = 'efips-digital-ratings-change';
const accountPrefix = () => {
  try {
    const user = JSON.parse(localStorage.getItem('current_user') || '{}');
    const role = localStorage.getItem('user_type') || '';
    const id = String(user.student_id || user.teacher_id || user.user_id || user.id || '').trim();
    return 'efips-digital-ratings-v1:' + role + ':' + id;
  } catch { return 'efips-digital-ratings-v1:local'; }
};
const readRating = (key: string, bookId: string): number => {
  try {
    const ratings = JSON.parse(localStorage.getItem(key) || '{}');
    const value = ratings?.[bookId];
    return Number.isInteger(value) && value >= 1 && value <= 5 ? value : 0;
  } catch { return 0; }
};
const saveRating = (key: string, bookId: string, rating: number) => {
  try {
    const ratings = JSON.parse(localStorage.getItem(key) || '{}');
    const next = ratings && typeof ratings === 'object' && !Array.isArray(ratings) ? ratings : {};
    next[bookId] = rating;
    localStorage.setItem(key, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { key, bookId } }));
  } catch { /* Do not submit ratings to unsafe public tables. */ }
};
const DigitalBookRating: React.FC<{ bookId: string; compact?: boolean }> = ({ bookId, compact = true }) => {
  const { locale } = useLanguage();
  const ar = locale === 'ar';
  const key = accountPrefix();
  const [rating, setRating] = useState(() => readRating(key, bookId));
  const [hovered, setHovered] = useState(0);
  useEffect(() => {
    const refresh = () => setRating(readRating(key, bookId));
    const onEvent = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (!detail || (detail.key === key && detail.bookId === bookId)) refresh();
    };
    refresh();
    window.addEventListener(EVENT, onEvent);
    window.addEventListener('storage', refresh);
    return () => { window.removeEventListener(EVENT, onEvent); window.removeEventListener('storage', refresh); };
  }, [key, bookId]);
  const handleRating = (value: number) => { setRating(value); saveRating(key, bookId, value); };
  return (
    <div className={compact
      ? 'relative z-30 mt-3 rounded-2xl border border-white/30 bg-black/20 backdrop-blur-md px-3 py-2 w-fit ms-auto max-w-full'
      : 'relative z-30 rounded-2xl border border-amber-200 dark:border-slate-700 bg-amber-50 dark:bg-slate-900/70 px-4 py-3'}
      onClick={e=>e.stopPropagation()} onPointerDown={e=>e.stopPropagation()} onKeyDown={e=>e.stopPropagation()}
      role="group" aria-label={ar ? 'قيّم هذا الكتاب من نجمة إلى خمس نجوم' : 'Rate this book from one to five stars'}>
      <div className={'flex flex-wrap items-center gap-2 ' + (compact ? 'text-white' : 'text-slate-800 dark:text-white')}>
        <span className="text-[11px] font-black">{ar ? 'تقييمي' : 'My rating'}</span>
        <div dir="ltr" className="flex items-center gap-0.5" onMouseLeave={()=>setHovered(0)}>
          {[1,2,3,4,5].map(value=><button
            key={value} type="button"
            aria-label={ar ? 'تقييم ' + value + ' من 5 نجوم' : 'Rate ' + value + ' of 5 stars'}
            aria-pressed={rating === value}
            title={ar ? value + ' من 5' : value + ' of 5'}
            onMouseEnter={()=>setHovered(value)}
            onFocus={()=>setHovered(value)}
            onBlur={()=>setHovered(0)}
            onClick={(e)=>{e.preventDefault();e.stopPropagation();handleRating(value);}}
            className="p-0.5 transition-transform duration-200 hover:scale-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 touch-manipulation"
          ><svg className={'w-4 h-4 sm:w-5 sm:h-5 transition-colors ' + (value <= (hovered || rating) ? 'text-amber-300 fill-amber-300' : compact ? 'text-white/70' : 'text-slate-400')} viewBox="0 0 24 24" fill={value <= (hovered || rating) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m12 2 3.1 6.35 7 .99-5.05 4.94 1.19 6.97L12 17.96l-6.24 3.29 1.19-6.97L1.9 9.34l7-.99L12 2Z"/></svg></button>)}
        </div>
        {rating > 0 && <span className="text-[11px] font-black tabular-nums">{rating}/5</span>}
      </div>
      {!compact && <p className="mt-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">{ar ? 'تقييمك الشخصي محفوظ على هذا الجهاز.' : 'Your personal rating is saved on this device.'}</p>}
    </div>
  );
};
export default DigitalBookRating;
