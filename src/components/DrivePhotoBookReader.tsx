import React, { useCallback, useEffect, useRef, useState } from 'react';
import DigitalLibraryDialog from './DigitalLibraryDialog';
import { digitalReaderSource } from '../utils/digitalReaderSource';
import {
  clampPdfPage, parsePdfPage, pdfReadingStorageKey, readPdfState,
  readerDeviceAccount, writePdfState
} from '../utils/pdfReadingState';
import './drivePhotoBookReader.css';

/** Google-hosted previews fetch only the selected image; never request the original PDF. */
export function googleImagePageUrl(id:string, variant=0):string {
  if(!/^[A-Za-z0-9_-]{10,150}$/.test(id))return '';
  return variant===0
    ? 'https://drive.google.com/thumbnail?id='+encodeURIComponent(id)+'&sz=w1600'
    : 'https://lh3.googleusercontent.com/d/'+encodeURIComponent(id)+'=w1600';
}

export default function DrivePhotoBookReader({ title, source, bookKey, pages, locale, onBack, onClose }: {
  title:string; source:string; bookKey:string; pages:readonly string[];
  locale:string; onBack:()=>void; onClose:()=>void;
}) {
  const ar=locale==='ar';
  const storageKey=pdfReadingStorageKey(readerDeviceAccount(),bookKey,digitalReaderSource(source)||source);
  const [initial]=useState(()=>readPdfState(storageKey));
  const [page,setPage]=useState(()=>clampPdfPage(initial.page,pages.length));
  const [pageInput,setPageInput]=useState(()=>String(clampPdfPage(initial.page,pages.length)));
  const [zoom,setZoom]=useState(()=>Math.max(.75,Math.min(2.5,initial.zoom)));
  const [bookmarks,setBookmarks]=useState<number[]>(initial.bookmarks.filter(n=>n<=pages.length));
  const [loadedPage,setLoadedPage]=useState(0);
  const [sourceVariant,setSourceVariant]=useState(0);
  const [failed,setFailed]=useState(false);
  const [retryCount,setRetryCount]=useState(0);
  const furthest=useRef(initial.furthestPage||initial.page);
  const touchStart=useRef<number|null>(null);
  const backButton=useRef<HTMLButtonElement>(null);
  const total=pages.length;
  const imageId=pages[page-1];
  const currentSource=googleImagePageUrl(imageId,sourceVariant);
  const progress=Math.round(100*(Math.max(page,furthest.current))/Math.max(1,total));

  const changePage=useCallback((target:number)=>{
    const next=clampPdfPage(target,total);
    setPage(next);setPageInput(String(next));
    setLoadedPage(0);setSourceVariant(0);setFailed(false);setRetryCount(0);
  },[total]);

  useEffect(()=>{backButton.current?.focus();},[]);
  useEffect(()=>{
    const onKey=(event:KeyboardEvent)=>{
      if(['INPUT','TEXTAREA','SELECT'].includes((event.target as HTMLElement)?.tagName))return;
      if(event.key==='ArrowRight'){event.preventDefault();changePage(page+1);}
      else if(event.key==='ArrowLeft'){event.preventDefault();changePage(page-1);}
    };
    window.addEventListener('keydown',onKey);
    return()=>window.removeEventListener('keydown',onKey);
  },[page,changePage]);

  useEffect(()=>{
    if(loadedPage!==page)return;
    furthest.current=Math.max(page,furthest.current);
    writePdfState(storageKey,{
      page,bookmarks,zoom,totalPages:total,furthestPage:furthest.current,lastReadAt:Date.now()
    });
  },[page,loadedPage,bookmarks,zoom,total,storageKey]);

  // Prefetch only one adjacent JPEG to avoid loading a whole illustrated book.
  useEffect(()=>{
    if(loadedPage!==page || page>=total)return;
    const next=new Image();
    next.src=googleImagePageUrl(pages[page]);
    return()=>{next.src='';};
  },[loadedPage,page,pages,total]);

  const toggleBookmark=()=>{
    setBookmarks(old=>old.includes(page)?old.filter(n=>n!==page):[...old,page].sort((a,b)=>a-b).slice(0,200));
  };
  const submitPage=()=>{
    const candidate=parsePdfPage(pageInput);
    if(!Number.isSafeInteger(candidate)){setPageInput(String(page));return;}
    changePage(candidate);
  };
  const retry=()=>{setFailed(false);setSourceVariant(0);setLoadedPage(0);setRetryCount(n=>n+1);};
  const imageError=()=>{setLoadedPage(0);if(sourceVariant===0)setSourceVariant(1);else setFailed(true);};
  const onTouchEnd=(event:React.TouchEvent<HTMLDivElement>)=>{
    if(touchStart.current===null)return;
    const distance=event.changedTouches[0].clientX-touchStart.current;
    touchStart.current=null;
    if(Math.abs(distance)>80 && zoom<=1.05)changePage(page+(distance<0?1:-1));
  };

  return <DigitalLibraryDialog title={title} onClose={onClose} variant="reader">
    <section className="efips-book-reader efips-photo-book" dir={ar?'rtl':'ltr'}>
      <header className="efips-reader-header">
        <div className="efips-reader-brand">
          <img src="/school-logo.png" width={64} height={64}
            alt={ar?'شعار مدرسة صقر الإمارات الدولية الخاصة':'EFIPS school logo'}/>
        </div>
        <h2 dir="auto">{title}</h2>
        <nav aria-label={ar?'أدوات قراءة الكتاب':'Book reader actions'}>
          <button type="button" ref={backButton} onClick={onBack}>
            {ar?'تفاصيل الكتاب':'Book details'}
          </button>
          <button type="button" data-book-close onClick={onClose}>
            {ar?'إغلاق القارئ':'Close reader'}
          </button>
        </nav>
      </header>

      <div className="efips-photo-toolbar" aria-label={ar?'التنقل بين صفحات الكتاب':'Page navigation'}>
        <button type="button" onClick={()=>changePage(page-1)} disabled={page<=1}>
          {ar?'السابق':'Previous'}
        </button>
        <label>
          <span>{ar?'الصفحة':'Page'}</span>
          <input type="number" inputMode="numeric" min={1} max={total}
            aria-label={ar?'رقم الصفحة':'Page number'} value={pageInput}
            onChange={event=>setPageInput(event.target.value)}
            onKeyDown={event=>{if(event.key==='Enter')submitPage();}}
            onBlur={submitPage}/>
          <span>{ar?'من':'of'} {total}</span>
        </label>
        <button type="button" onClick={()=>changePage(page+1)} disabled={page>=total}>
          {ar?'التالي':'Next'}
        </button>
        <div className="efips-photo-zoom" aria-label={ar?'التكبير':'Zoom'}>
          <button type="button" onClick={()=>setZoom(z=>Math.max(.75,Math.round((z-.25)*100)/100))}
            disabled={zoom<=.75} aria-label={ar?'تصغير':'Zoom out'}>−</button>
          <span>{Math.round(zoom*100)}%</span>
          <button type="button" onClick={()=>setZoom(z=>Math.min(2.5,Math.round((z+.25)*100)/100))}
            disabled={zoom>=2.5} aria-label={ar?'تكبير':'Zoom in'}>+</button>
        </div>
        <button type="button" onClick={toggleBookmark} aria-pressed={bookmarks.includes(page)}>
          {bookmarks.includes(page)?(ar?'إزالة العلامة':'Remove bookmark'):(ar?'حفظ الصفحة':'Bookmark')}
        </button>
      </div>
      <div className="efips-photo-progress" role="progressbar"
        aria-label={ar?'تقدم القراءة':'Reading progress'} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div style={{width:progress+'%'}}/>
      </div>
      <div className="efips-reader-stage">
        <div className="efips-photo-scroll" onTouchStart={e=>{touchStart.current=e.touches[0]?.clientX??null;}}
          onTouchEnd={onTouchEnd}>
          {failed
            ? <div className="efips-photo-error" role="alert">
                <strong>{ar?'تعذر عرض صورة الصفحة':'Could not load this page image'}</strong>
                <p>{ar
                  ?'تأكد من صلاحيات الصور على Google Drive، ثم أعد المحاولة. لم يتم تغيير الملف الأصلي.'
                  :'Check this image’s Google Drive access and retry. The original PDF was not changed.'}</p>
                <button type="button" onClick={retry}>{ar?'إعادة المحاولة':'Retry page'}</button>
              </div>
            : <>
                {loadedPage!==page && <p className="efips-photo-loading" role="status">
                  {ar?'جاري تحميل الصفحة...':'Loading page...'}
                </p>}
                <img key={imageId+':'+sourceVariant+':'+retryCount} src={currentSource}
                  alt={ar?`صفحة ${page} من ${total}`:`Page ${page} of ${total}`}
                  decoding="async" loading="eager" draggable={false}
                  onLoad={()=>{setLoadedPage(page);setFailed(false);}}
                  onError={imageError}
                  style={{width:zoom===1?'auto':Math.round(zoom*100)+'%',maxWidth:zoom===1?'100%':'none'}}
                  className={loadedPage===page?'efips-photo-image':'efips-photo-image efips-photo-loading-image'}/>
              </>}
        </div>
      </div>
      <div className="efips-photo-bottom">
        <button type="button" disabled={page<=1} onClick={()=>changePage(page-1)}>
          {ar?'الصفحة السابقة':'Previous page'}
        </button>
        <span>{ar?'كتاب تجريبي بالصور':'Image-reader pilot'} · {page}/{total}</span>
        <button type="button" disabled={page>=total} onClick={()=>changePage(page+1)}>
          {ar?'الصفحة التالية':'Next page'}
        </button>
      </div>
    </section>
  </DigitalLibraryDialog>;
}
