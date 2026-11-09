import React, { useCallback, useEffect, useRef, useState } from 'react';
import { clampPdfPage, parsePdfPage, readPdfState, writePdfState } from '../utils/pdfReadingState';

export type ImageBookPage = {page:number; fileId:string};
const driveThumbnail = (id:string) =>
  'https://drive.google.com/thumbnail?id='+encodeURIComponent(id)+'&sz=w1600';
const driveImagePreview = (id:string) =>
  'https://drive.google.com/file/d/'+encodeURIComponent(id)+'/preview';

/**
 * A single-book pilot: the original big PDF stays on Drive; only its
 * individually-uploaded JPEG pages are displayed inside the EFIPS reader.
 * Avoids Drive PDF previews, and requests only one small page at a time.
 */
export default function ImageBookPages({pages,storageKey,ar}:{
  pages:ReadonlyArray<ImageBookPage>;storageKey:string|null;ar:boolean;
}){
  const initial=useRef(readPdfState(storageKey)).current;
  const [page,setPage]=useState(()=>clampPdfPage(initial.page,pages.length));
  const [pageInput,setPageInput]=useState(String(clampPdfPage(initial.page,pages.length)));
  const [zoom,setZoom]=useState(initial.zoom);
  const [bookmarks,setBookmarks]=useState<number[]>(initial.bookmarks.filter(n=>n<=pages.length));
  const [loaded,setLoaded]=useState(false);
  const [thumbnailFailed,setThumbnailFailed]=useState(false);
  const [refresh,setRefresh]=useState(0);
  const furthestPage=useRef(initial.furthestPage||initial.page);
  const swipeStart=useRef<{x:number;y:number}|null>(null);
  const current=pages[page-1];
  const go=useCallback((to:number)=>{
    const next=clampPdfPage(to,pages.length);
    setPage(next);setPageInput(String(next));setLoaded(false);setThumbnailFailed(false);
  },[pages.length]);
  useEffect(()=>{
    const listener=(event:KeyboardEvent)=>{
      if(event.altKey||event.ctrlKey||event.metaKey||
        event.target instanceof HTMLInputElement||
        event.target instanceof HTMLTextAreaElement||
        event.target instanceof HTMLSelectElement)return;
      if(event.key==='ArrowRight'){event.preventDefault();go(page+1);}
      if(event.key==='ArrowLeft'){event.preventDefault();go(page-1);}
    };
    window.addEventListener('keydown',listener);
    return()=>window.removeEventListener('keydown',listener);
  },[page,go]);
  useEffect(()=>{
    if(!loaded)return;
    furthestPage.current=Math.max(furthestPage.current,page);
    writePdfState(storageKey,{
      page,zoom,bookmarks,furthestPage:furthestPage.current,
      totalPages:pages.length,lastReadAt:Date.now()
    });
  },[page,loaded,zoom,bookmarks,storageKey,pages.length]);
  useEffect(()=>{
    const next=pages[page];
    if(!next)return;
    const image=new Image();
    image.src=driveThumbnail(next.fileId);
    return()=>{image.src='';};
  },[page,pages]);
  const toggleBookmark=()=>{
    setBookmarks(old=>old.includes(page)?old.filter(n=>n!==page):[...old,page].sort((a,b)=>a-b));
  };
  const onTouchStart=(event:React.TouchEvent)=>{
    const t=event.touches[0];swipeStart.current=t?{x:t.clientX,y:t.clientY}:null;
  };
  const onTouchEnd=(event:React.TouchEvent)=>{
    const start=swipeStart.current;swipeStart.current=null;
    const t=event.changedTouches[0];
    if(!start||!t)return;
    const dx=t.clientX-start.x,dy=t.clientY-start.y;
    if(Math.abs(dx)>75&&Math.abs(dy)<Math.abs(dx)*.55){
      go(page+(dx<0?1:-1));
    }
  };
  const onJump=(event:React.FormEvent)=>{
    event.preventDefault();
    const n=parsePdfPage(pageInput);
    if(Number.isFinite(n))go(n);
  };
  if(!current)return <p role="alert">{ar?'لا توجد صفحات مرفوعة لهذا الكتاب.':'No uploaded pages are available.'}</p>;
  return <div className="efips-image-book" dir={ar?'rtl':'ltr'}>
    <div className="efips-image-book-toolbar">
      <button type="button" disabled={page<=1} onClick={()=>go(page-1)}>{ar?'السابق':'Previous'}</button>
      <form onSubmit={onJump}>
        <label htmlFor="efips-image-page-jump">{ar?'الصفحة':'Page'}</label>
        <input id="efips-image-page-jump" aria-label={ar?'رقم الصفحة':'Page number'}
          inputMode="numeric" type="number" min={1} max={pages.length}
          value={pageInput} onChange={e=>setPageInput(e.target.value)}/>
        <span>{ar?'من':'of'} {pages.length}</span>
        <button type="submit">{ar?'انتقل':'Go'}</button>
      </form>
      <button type="button" disabled={page>=pages.length} onClick={()=>go(page+1)}>{ar?'التالي':'Next'}</button>
      <button type="button" aria-pressed={bookmarks.includes(page)} onClick={toggleBookmark}>
        {bookmarks.includes(page)?(ar?'إزالة العلامة':'Remove bookmark'):(ar?'حفظ الصفحة':'Bookmark')}
      </button>
      <button type="button" onClick={()=>setZoom(z=>Math.max(.75,Number((z-.25).toFixed(2))))}
        aria-label={ar?'تصغير':'Zoom out'}>−</button>
      <strong aria-live="polite">{Math.round(zoom*100)}%</strong>
      <button type="button" onClick={()=>setZoom(z=>Math.min(2,Number((z+.25).toFixed(2))))}
        aria-label={ar?'تكبير':'Zoom in'}>+</button>
    </div>
    <div className="efips-image-book-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {!loaded && !thumbnailFailed && <div className="efips-image-book-loading" role="status">
        {ar?'جاري تحميل صفحة الكتاب...':'Loading page...'}
      </div>}
      {thumbnailFailed
        ? <div className="efips-image-book-fallback">
            <p>{ar?'تعذر تحميل الصورة مباشرة. جرب معاينة هذه الصفحة داخل النافذة.':
              'Direct image loading failed. Showing this single page in a Drive frame.'}</p>
            <iframe title={ar?'معاينة الصفحة':'Page preview'} src={driveImagePreview(current.fileId)}
              allow="fullscreen" allowFullScreen loading="eager" referrerPolicy="no-referrer"/>
            <button type="button" onClick={()=>{setThumbnailFailed(false);setLoaded(false);setRefresh(v=>v+1);}}>
              {ar?'إعادة محاولة الصورة':'Retry image'}
            </button>
          </div>
        : <img key={current.fileId+'-'+refresh} className="efips-image-book-page" 
            src={driveThumbnail(current.fileId)} loading="eager" decoding="async"
            alt={ar?'صفحة '+page+' من '+pages.length:'Page '+page+' of '+pages.length}
            referrerPolicy="no-referrer"
            style={{width:(zoom*100)+'%',maxWidth:'none',display:loaded?'block':'none'}}
            onLoad={()=>setLoaded(true)} onError={()=>{setThumbnailFailed(true);setLoaded(false);}}/>}
    </div>
    {bookmarks.length>0&&<div className="efips-image-book-bookmarks">
      <span>{ar?'الصفحات المحفوظة:':'Bookmarks:'}</span>
      {bookmarks.map(n=><button key={n} type="button" onClick={()=>go(n)}>{n}</button>)}
    </div>}
    <div className="efips-image-book-footer" role="status">
      {ar?'نسخة صور للقراءة التجريبية · المصدر Google Drive':'Image-reading pilot · Source: Google Drive'}
      {' · '}
      {ar?'آخر صفحة يتم حفظها على الجهاز':'Reading position saved on this device'}
    </div>
  </div>;
}
