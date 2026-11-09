import React, { useCallback, useEffect, useRef, useState } from 'react';
import { clampPdfPage, parsePdfPage, readPdfState, writePdfState } from '../utils/pdfReadingState';

export type ImageBookPage = {page:number; fileId:string};

/** Image editions use Google Drive for storage, NEVER its PDF/image preview UI. */
export const fastImageWidth = (viewportWidth:number) => viewportWidth <= 720 ? 840 : 1100;
export const driveReaderImage = (id:string,width:number) =>
  'https://lh3.googleusercontent.com/d/'+encodeURIComponent(id)+'=w'+width;
export const driveBackupImage = (id:string,width:number) =>
  'https://drive.google.com/thumbnail?id='+encodeURIComponent(id)+'&sz=w'+width;

export default function ImageBookPages({pages,storageKey,ar,title,onBack,onClose}:{
  pages:ReadonlyArray<ImageBookPage>;storageKey:string|null;ar:boolean;
  title:string;onBack:()=>void;onClose:()=>void;
}){
  const initial=useRef(readPdfState(storageKey,.25)).current;
  const baseWidth=useRef(typeof window!=='undefined' ? fastImageWidth(window.innerWidth) : 1100).current;
  const [highQuality,setHighQuality]=useState(false);
  const width=highQuality ? 1600 : baseWidth;
  const [page,setPage]=useState(()=>clampPdfPage(initial.page,pages.length));
  const [pageInput,setPageInput]=useState(String(clampPdfPage(initial.page,pages.length)));
  const [turnDirection,setTurnDirection]=useState<'next'|'prev'|null>(null);
  const [zoom,setZoom]=useState(initial.zoom);
  const [bookmarks,setBookmarks]=useState<number[]>(initial.bookmarks.filter(n=>n<=pages.length));
  const [bookmarksOpen,setBookmarksOpen]=useState(false);
  const [loaded,setLoaded]=useState(false);
  const [sourceMode,setSourceMode]=useState<'cdn'|'drive'>('cdn');
  const [thumbnailFailed,setThumbnailFailed]=useState(false);
  const [refresh,setRefresh]=useState(0);
  const [controlsVisible,setControlsVisible]=useState(true);
  const preloadCache=useRef(new Map<string,HTMLImageElement>());
  const furthestPage=useRef(initial.furthestPage||initial.page);
  const swipeStart=useRef<{x:number;y:number}|null>(null);
  const suppressClick=useRef(false);
  const hideTimer=useRef<number|null>(null);
  const current=pages[page-1];

  const imageUrl=(fileId:string)=>sourceMode==='cdn'
    ? driveReaderImage(fileId,width):driveBackupImage(fileId,width);

  const armHide=useCallback(()=>{
    if(hideTimer.current!==null)window.clearTimeout(hideTimer.current);
    hideTimer.current=window.setTimeout(()=>{
      // Do not hide the controls while someone is entering a page number.
      if(document.activeElement?.tagName==='INPUT')return;
      setControlsVisible(false);
    },5200);
  },[]);
  const revealControls=useCallback(()=>{
    setControlsVisible(true);
    armHide();
  },[armHide]);
  useEffect(()=>{
    armHide();
    return()=>{if(hideTimer.current!==null)window.clearTimeout(hideTimer.current);};
  },[armHide]);

  const go=useCallback((to:number)=>{
    const next=clampPdfPage(to,pages.length);
    if(next===page)return;
    setTurnDirection(next>page?'next':'prev');
    setPage(next);setPageInput(String(next));setSourceMode('cdn');
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

  // Never enter Google Drive's embedded viewer. Use one alternate image URL,
  // then show a proper retry screen if neither image endpoint responds.
  const advanceImageSource=()=>{
    setLoaded(false);
    if(sourceMode==='cdn')setSourceMode('drive');
    else setThumbnailFailed(true);
  };
  useEffect(()=>{
    if(loaded || thumbnailFailed)return;
    const timeout=window.setTimeout(()=>{
      if(sourceMode==='cdn')setSourceMode('drive');
      else {setThumbnailFailed(true);setControlsVisible(true);}
    },4500);
    return()=>window.clearTimeout(timeout);
  },[page,width,sourceMode,loaded,thumbnailFailed,refresh]);

  useEffect(()=>{
    if(!loaded)return;
    furthestPage.current=Math.max(furthestPage.current,page);
    writePdfState(storageKey,{
      page,zoom,bookmarks,furthestPage:furthestPage.current,
      totalPages:pages.length,lastReadAt:Date.now()
    });
  },[page,loaded,zoom,bookmarks,storageKey,pages.length]);

  // Sequential low-priority preloads make forward turns faster without
  // loading every book page or retaining the original multi-hundred-MB PDF.
  useEffect(()=>{
    if(!loaded || thumbnailFailed || sourceMode!=='cdn')return;
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
      while(cache.size>(baseWidth===840?5:8)){
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
  },[page,pages,width,loaded,thumbnailFailed,highQuality,baseWidth,sourceMode]);

  const toggleBookmark=()=>{
    setBookmarks(old=>old.includes(page)?old.filter(n=>n!==page):[...old,page].sort((a,b)=>a-b));
    revealControls();
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
      suppressClick.current=true;
      window.setTimeout(()=>{suppressClick.current=false;},350);
      go(page+(dx<0?1:-1));
    }
  };
  const onJump=(event:React.FormEvent)=>{
    event.preventDefault();
    const n=parsePdfPage(pageInput);
    if(Number.isFinite(n))go(n);
    revealControls();
    // Mobile numeric keyboards must not remain over the page after navigation.
    if(document.activeElement instanceof HTMLElement)document.activeElement.blur();
  };
  const changeQuality=()=>{
    const nextWidth=!highQuality?1600:baseWidth;
    const cache= current && preloadCache.current.get(driveReaderImage(current.fileId,nextWidth));
    setLoaded(Boolean(cache?.complete && cache.naturalWidth>0));
    setThumbnailFailed(false);setSourceMode('cdn');
    setHighQuality(v=>!v);
    revealControls();
  };
  const retry=()=>{
    setThumbnailFailed(false);setLoaded(false);setSourceMode('cdn');
    setRefresh(v=>v+1);revealControls();
  };
  const toggleFromPage=()=>{
    if(suppressClick.current)return;
    if(controlsVisible){
      if(hideTimer.current!==null)window.clearTimeout(hideTimer.current);
      setControlsVisible(false);
    } else revealControls();
  };

  if(!current)return <p role="alert">{ar?'لا توجد صفحات مرفوعة لهذا الكتاب.':'No uploaded pages are available.'}</p>;
  return <div className="efips-image-book efips-image-book--immersive" dir={ar?'rtl':'ltr'}>
    <div className="efips-image-book-stage" role="region" tabIndex={0}
      aria-label={ar?'صفحة الكتاب، المس لإظهار أدوات القراءة أو إخفائها':'Book page, tap to show or hide controls'}
      onClick={event=>{
        if((event.target as HTMLElement).closest('button,input,form'))return;
        toggleFromPage();
      }}
      onKeyDown={event=>{
        if((event.key==='Enter'||event.key===' ')&&event.target===event.currentTarget){
          event.preventDefault();toggleFromPage();
        }
      }}
      onContextMenu={event=>event.preventDefault()}
      onDragStart={event=>event.preventDefault()}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {!loaded && !thumbnailFailed && <div className="efips-image-book-loading" role="status">
        <span className="efips-image-book-loader" aria-hidden="true"/>
        {ar?'جاري تجهيز الصفحة...':'Preparing page...'}
      </div>}
      {thumbnailFailed
        ? <div className="efips-image-book-fallback efips-image-book-error" role="alert">
            <strong>{ar?'تعذر عرض هذه الصفحة':'This page could not be displayed'}</strong>
            <p>{ar?'الصورة لم تستجب. يمكنك إعادة المحاولة أو الانتقال لصفحة أخرى.':
              'The image did not respond. Retry or move to another page.'}</p>
            <button type="button" onClick={retry}>{ar?'إعادة تحميل الصفحة':'Retry page'}</button>
          </div>
        : <div key={current.fileId} onContextMenu={event=>event.preventDefault()} className={
            'efips-image-book-sheet'+
            (loaded && turnDirection ? ' efips-image-book-sheet--'+turnDirection : '')
          } style={{width:(zoom*100)+'%',height:(zoom*100)+'%',maxWidth:'none',display:loaded?'flex':'none'}}>
            <img key={current.fileId+'-'+width+'-'+sourceMode+'-'+refresh}
              className="efips-image-book-page" draggable={false}
              onContextMenu={event=>event.preventDefault()}
              onDragStart={event=>event.preventDefault()}
              src={imageUrl(current.fileId)} loading="eager" decoding="async"
              alt={ar?'صفحة '+page+' من '+pages.length:'Page '+page+' of '+pages.length}
              referrerPolicy="no-referrer"
              onLoad={()=>setLoaded(true)} onError={advanceImageSource}/>
          </div>}
    </div>

    <div className="efips-image-book-glass-ui" data-visible={controlsVisible?'true':'false'}
      aria-hidden={!controlsVisible} onPointerDown={revealControls}
      onFocusCapture={revealControls} onBlurCapture={armHide}>
      <div className="efips-glass-image-top">
        <div className="efips-glass-image-title efips-glass-material" dir="auto">
          <img src="/school-logo.png" width={32} height={32}
            alt={ar?'شعار المدرسة':'School logo'} aria-hidden="true"/>
          <span title={title}>{title}</span>
        </div>
        <div className="efips-glass-image-top-actions efips-glass-material">
          <button type="button" onClick={onBack} title={ar?'تفاصيل الكتاب':'Book details'}>
            {ar?'التفاصيل':'Details'}
          </button>
          <button type="button" data-book-close onClick={onClose}
            aria-label={ar?'إغلاق القارئ':'Close reader'} title={ar?'إغلاق القارئ':'Close reader'}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 5l14 14M19 5L5 19"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="efips-glass-image-bottom">
        {bookmarksOpen&&bookmarks.length>0&&
          <div className="efips-glass-image-saved efips-glass-material" role="group"
            aria-label={ar?'الصفحات المحفوظة':'Saved page bookmarks'}>
            <span>{ar?'صفحات محفوظة':'Saved pages'}</span>
            {bookmarks.map(n=><button key={n} type="button"
              onClick={()=>{go(n);revealControls();}}>{n}</button>)}
          </div>}
        <div className="efips-glass-image-pager efips-glass-material" role="group"
          aria-label={ar?'التنقل بين صفحات الكتاب':'Book page navigation'}>
          <button type="button" disabled={page<=1} onClick={()=>{go(page-1);revealControls();}}
            aria-label={ar?'الصفحة السابقة':'Previous page'} title={ar?'السابق':'Previous'}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <form onSubmit={onJump}>
            <label htmlFor="efips-image-page-jump">{ar?'الصفحة':'Page'}</label>
            <input id="efips-image-page-jump" aria-label={ar?'رقم الصفحة':'Page number'}
              inputMode="numeric" type="number" min={1} max={pages.length}
              value={pageInput} onChange={event=>setPageInput(event.target.value)}/>
            <span>{ar?'من':'of'} {pages.length}</span>
            <button type="submit" className="efips-glass-image-go"
              aria-label={ar?'انتقل للصفحة المحددة':'Go to selected page'}>
              {ar?'انتقل':'Go'}
            </button>
          </form>
          <button type="button" disabled={page>=pages.length} onClick={()=>{go(page+1);revealControls();}}
            aria-label={ar?'الصفحة التالية':'Next page'} title={ar?'التالي':'Next'}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        <div className="efips-glass-image-tools efips-glass-material" role="group"
          aria-label={ar?'أدوات القراءة':'Reading tools'}>
          <button type="button" aria-pressed={bookmarks.includes(page)} onClick={toggleBookmark}
            title={ar?'حفظ الصفحة أو إلغاء حفظها':'Toggle bookmark'}
            aria-label={ar?'حفظ الصفحة أو إلغاء حفظها':'Toggle bookmark'}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill={bookmarks.includes(page)?'currentColor':'none'}
              stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
              <path d="M6 3.75h12v17l-6-4-6 4v-17z"/>
            </svg>
          </button>
          <button type="button" disabled={zoom<=.25}
            onClick={()=>{setZoom(z=>Math.max(.25,Number((z-.25).toFixed(2))));revealControls();}}
            aria-label={ar?'تصغير':'Zoom out'}>−</button>
          <strong aria-live="polite">{Math.round(zoom*100)}%</strong>
          <button type="button" disabled={zoom>=2}
            onClick={()=>{setZoom(z=>Math.min(2,Number((z+.25).toFixed(2))));revealControls();}}
            aria-label={ar?'تكبير':'Zoom in'}>+</button>
          <button type="button" aria-pressed={highQuality} onClick={changeQuality}
            title={ar?'التبديل بين الجودة العالية والوضع السريع':'Toggle HD and fast mode'}>
            {highQuality?(ar?'سريع':'Fast'):'HD'}
          </button>
          <button type="button" aria-expanded={bookmarksOpen} disabled={!bookmarks.length}
            onClick={()=>{setBookmarksOpen(v=>!v);revealControls();}}
            title={ar?'الصفحات المحفوظة':'Saved pages'}
            aria-label={ar?'عرض الصفحات المحفوظة':'Show bookmarks'}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 5h13M7 12h13M7 19h13M3 5h.01M3 12h.01M3 19h.01"/>
            </svg>
            <span className="efips-glass-image-bookmark-count">{bookmarks.length}</span>
          </button>
        </div>
        <span className="efips-glass-image-hint">
          {ar?'المس الصفحة لإخفاء الأدوات':'Tap the page to hide controls'}
        </span>
      </div>
    </div>

    {!controlsVisible&&
      <button type="button" className="efips-glass-image-reveal"
        onClick={revealControls} aria-label={ar?'إظهار أدوات القراءة':'Show reading tools'}
        title={ar?'إظهار أدوات القراءة':'Show reading tools'}>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.9" strokeLinecap="round">
          <path d="M4 8l8 8 8-8"/>
        </svg>
      </button>}
  </div>;
}
