import React, { useCallback, useEffect, useRef, useState } from 'react';
import { clampPdfPage, parsePdfPage, readPdfState, writePdfState } from '../utils/pdfReadingState';

export type ImageBookPage = {page:number; fileId:string};

/* Fetch a smaller Drive-hosted image for ordinary reading. Full resolution is
 * still available on demand, without fetching a 1600px thumbnail on every tap.
 * Keep the URL exactly the same for <img> and preloading, so browser cache
 * reuse does not require any proxy, storage provider, or new Google scopes. */
export const fastImageWidth = (viewportWidth:number) => viewportWidth <= 720 ? 840 : 1100;
export const driveReaderImage = (id:string,width:number) =>
  'https://drive.google.com/thumbnail?id='+encodeURIComponent(id)+'&sz=w'+width;
const driveImagePreview = (id:string) =>
  'https://drive.google.com/file/d/'+encodeURIComponent(id)+'/preview';

export default function ImageBookPages({pages,storageKey,ar}:{
  pages:ReadonlyArray<ImageBookPage>;storageKey:string|null;ar:boolean;
}){
  const initial=useRef(readPdfState(storageKey)).current;
  const baseWidth=useRef(typeof window!=='undefined' ? fastImageWidth(window.innerWidth) : 1100).current;
  const [highQuality,setHighQuality]=useState(false);
  const width=highQuality ? 1600 : baseWidth;
  const [page,setPage]=useState(()=>clampPdfPage(initial.page,pages.length));
  const [pageInput,setPageInput]=useState(String(clampPdfPage(initial.page,pages.length)));
  const [zoom,setZoom]=useState(initial.zoom);
  const [bookmarks,setBookmarks]=useState<number[]>(initial.bookmarks.filter(n=>n<=pages.length));
  const [loaded,setLoaded]=useState(false);
  const [thumbnailFailed,setThumbnailFailed]=useState(false);
  const [refresh,setRefresh]=useState(0);
  // Keep prefetched Image objects alive across page changes. The previous
  // reader cancelled its next-page request on every navigation, causing waits.
  const preloadCache=useRef(new Map<string,HTMLImageElement>());
  const furthestPage=useRef(initial.furthestPage||initial.page);
  const swipeStart=useRef<{x:number;y:number}|null>(null);
  const current=pages[page-1];
  const imageUrl=(fileId:string)=>driveReaderImage(fileId,width);
  const isCached=(fileId:string)=>{
    const cached=preloadCache.current.get(imageUrl(fileId));
    return !!cached && cached.complete && cached.naturalWidth>0;
  };
  const go=useCallback((to:number)=>{
    const next=clampPdfPage(to,pages.length);
    if(next===page)return;
    setPage(next);setPageInput(String(next));
    const cached=pages[next-1] && preloadCache.current.get(driveReaderImage(pages[next-1].fileId,width));
    setLoaded(Boolean(cached?.complete && cached.naturalWidth>0));
    setThumbnailFailed(false);
  },[pages,page,width]);
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

  // Preload ahead only AFTER the current page has appeared. A small, ordered
  // look-ahead buffer makes normal forward reading instant when Drive responds
  // promptly. Sequential requests avoid competing with the visible page on a
  // slow mobile connection. Never cancel an in-flight preload during turns.
  useEffect(()=>{
    if(!loaded || thumbnailFailed)return;
    let cancelled=false;
    const create=(index:number):HTMLImageElement|null=>{
      const entry=pages[index];
      if(!entry)return null;
      const url=driveReaderImage(entry.fileId,width);
      const cache=preloadCache.current;
      const existing=cache.get(url);
      if(existing)return existing;
      const img=new Image();
      img.decoding='async';
      img.referrerPolicy='no-referrer';
      cache.set(url,img);
      // A bounded image buffer avoids keeping dozens of decoded textbook
      // pages in mobile memory. The browser HTTP cache handles older pages.
      while(cache.size > (baseWidth===840 ? 5 : 8)){
        const oldest=cache.keys().next().value;
        if(oldest===undefined)break;
        cache.delete(oldest);
      }
      img.src=url;
      return img;
    };
    const next=create(page);
    if(next && !highQuality){
      const thenSecond=()=>{if(!cancelled)create(page+1);};
      if(next.complete && next.naturalWidth>0)thenSecond();
      else next.addEventListener('load',thenSecond,{once:true});
      return()=>{cancelled=true;next.removeEventListener('load',thenSecond);};
    }
    return()=>{cancelled=true;};
  },[page,pages,width,loaded,thumbnailFailed,highQuality,baseWidth]);

  const toggleBookmark=()=>setBookmarks(old=>
    old.includes(page)?old.filter(n=>n!==page):[...old,page].sort((a,b)=>a-b)
  );
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
  const changeQuality=()=>{
    const nextWidth=!highQuality?1600:baseWidth;
    setLoaded(Boolean(current && preloadCache.current.get(driveReaderImage(current.fileId,nextWidth))?.complete &&
      preloadCache.current.get(driveReaderImage(current.fileId,nextWidth))?.naturalWidth));
    setThumbnailFailed(false);
    setHighQuality(v=>!v);
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
      <button type="button" aria-pressed={highQuality} onClick={changeQuality}
        title={ar?'حمّل صورة عالية الدقة عند الحاجة فقط':'Load high-resolution pages only when needed'}>
        {highQuality?(ar?'وضع سريع':'Fast mode'):(ar?'جودة عالية':'HD')}
      </button>
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
        : <img key={current.fileId+'-'+width+'-'+refresh} className="efips-image-book-page"
            src={imageUrl(current.fileId)} loading="eager" decoding="async"
            alt={ar?'صفحة '+page+' من '+pages.length:'Page '+page+' of '+pages.length}
            referrerPolicy="no-referrer"
            style={{width:(zoom*100)+'%',maxWidth:'none',display:loaded?'block':'none'}}
            onLoad={()=>setLoaded(true)} onError={()=>{setThumbnailFailed(true);setLoaded(false);}}/>}
    </div>
    {bookmarks.length>0&&<div className="efips-image-book-bookmarks">
      <span>{ar?'الصفحات المحفوظة:':'Bookmarks:'}</span>
      {bookmarks.map(n=><button key={n} type="button" onClick={()=>go(n)}>{n}</button>)}
    </div>
    <div className="efips-image-book-footer" role="status">
      {ar?'وضع القراءة السريع · المصدر Google Drive':'Fast image reading · Source: Google Drive'}
      {' · '}
      {ar?'آخر صفحة يتم حفظها على الجهاز':'Reading position saved on this device'}
    </div>
  </div>;
}
