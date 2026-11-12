#!/usr/bin/env python3
"""OCR and index ONLY verified EFIPS Arabic-book pages into isolated Supabase evidence.
Runs in an authenticated ingestion environment; never modifies Saqr, books or readers.
Standard-library networking; requires tesseract-ocr-ara and poppler-utils on PATH.
Usage:
  python3 tools/arabic-knowledge/index-books.py --manifest /tmp/saqr-arabic-book-manifest.json --upload
  python3 tools/arabic-knowledge/index-books.py --manifest ... --book-id AR_PH_20261110_CHILD_LITERATURE --max-pages 20 --upload
Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY as secret environment variables.
"""
import argparse
import hashlib
import json
import os
import pathlib
import re
import subprocess
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone

def utc():
    return datetime.now(timezone.utc).isoformat()

def run(cmd, timeout=35):
    proc=subprocess.run(cmd,stdout=subprocess.PIPE,stderr=subprocess.PIPE,timeout=timeout,check=False)
    if proc.returncode:
        raise RuntimeError(cmd[0] + ': ' + proc.stderr.decode('utf8','replace')[:180])
    return proc.stdout.decode('utf8','replace')

def clean(text):
    text=re.sub(r'[ \t]+',' ',text.replace('\x00',' ')).replace('\r','')
    return re.sub(r'\n{3,}','\n\n',text).strip()

def plausible(text):
    letters=len(re.findall(r'[\u0600-\u06FFa-zA-Z]',text))
    return letters>=40 and letters/max(len(text),1)>=0.25

def segments(text, limit=2400, overlap=100):
    text=clean(text)
    if not plausible(text):
        return []
    chunks=[]
    while text and len(chunks)<50:
        if len(text)<=limit:
            chunks.append(text);break
        cut=text.rfind(' ',int(limit*.75),limit)
        if cut<0:cut=limit
        chunks.append(text[:cut].strip())
        text=text[max(0,cut-overlap):].strip()
    return [chunk for chunk in chunks if len(chunk)>=35]

def download(file_id, path, *, pdf=False, max_bytes=240_000_000):
    if not re.fullmatch(r'[a-zA-Z0-9_-]{10,100}',file_id):
        raise RuntimeError('Invalid manifest Google file ID')
    query=urllib.parse.urlencode({'export':'download','id':file_id})
    url='https://drive.google.com/uc?'+query
    request=urllib.request.Request(url,headers={'User-Agent':'EFIPS-LibraryIndex/1.0'})
    read=0
    with urllib.request.urlopen(request,timeout=45) as response, open(path,'wb') as out:
        if response.headers.get('Content-Length') and int(response.headers['Content-Length'])>max_bytes:
            raise RuntimeError('File exceeds ingestion size limit')
        while True:
            block=response.read(262144)
            if not block:break
            read+=len(block)
            if read>max_bytes:raise RuntimeError('File exceeds ingestion size limit')
            out.write(block)
    with open(path,'rb') as source:
        magic=source.read(12)
    if not (magic.startswith(b'%PDF-') if pdf else magic.startswith((b'\xff\xd8\xff',b'\x89PNG'))):
        raise RuntimeError('Source is not accessible as a public '+('PDF' if pdf else 'image')+' download')
    return hashlib.sha256(open(path,'rb').read()).hexdigest()

def ocr_file(path):
    return clean(run(['tesseract',str(path),'stdout','-l','ara+eng','--psm','3'],timeout=100))

def pages_in_pdf(path):
    details=run(['pdfinfo',str(path)],timeout=20)
    m=re.search(r'^Pages:\s*(\d+)',details,re.M)
    if not m:raise RuntimeError('Cannot inspect PDF page count')
    return int(m.group(1))

def pdf_page_text(path, n, tmp):
    txt=clean(run(['pdftotext','-f',str(n),'-l',str(n),'-layout','-enc','UTF-8',str(path),'-'],timeout=35))
    if plausible(txt):return txt,'pdf_text'
    prefix=str(tmp/'rendered')
    run(['pdftoppm','-f',str(n),'-l',str(n),'-singlefile','-scale-to','1550','-png',str(path),prefix],timeout=90)
    return ocr_file(pathlib.Path(prefix+'.png')),'arabic_ocr'

def sb_request(url,key,path,method='GET',data=None):
    headers={'apikey':key,'Authorization':'Bearer '+key,'Content-Type':'application/json'}
    if method=='POST':headers['Prefer']='resolution=merge-duplicates,return=minimal'
    payload=json.dumps(data,ensure_ascii=False).encode() if data is not None else None
    req=urllib.request.Request(url.rstrip('/')+'/rest/v1/'+path,
        data=payload,headers=headers,method=method)
    with urllib.request.urlopen(req,timeout=50) as r:
        body=r.read()
        return json.loads(body) if body else []

def indexed_pages(url,key,book_id):
    q=urllib.parse.urlencode({'select':'page_number','book_id':'eq.'+book_id,'limit':10000})
    return {int(x['page_number']) for x in sb_request(url,key,'saqr_arabic_page_passages?'+q)}

def upload_page(url,key,book_id,page,method,fingerprint,content):
    payload=[{
      'book_id':book_id,'page_number':page,'chunk_number':i,
      'content_text':chunk,'extraction_method':method,
      'source_fingerprint':fingerprint,'reviewed':False,'updated_at':utc()
    } for i,chunk in enumerate(segments(content))]
    if not payload:return 0
    sb_request(url,key,'saqr_arabic_page_passages?on_conflict=book_id,page_number,chunk_number',
               method='POST',data=payload)
    return len(payload)

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--manifest',required=True)
    parser.add_argument('--book-id',default='')
    parser.add_argument('--start-id',default='')
    parser.add_argument('--offset',type=int,default=0,help='Zero-based position in the 502-book catalog')
    parser.add_argument('--max-books',type=int,default=5,
                        help='0 means all books; process in batches to protect free quotas')
    parser.add_argument('--max-pages',type=int,default=80,
                        help='0 means all unindexed pages per book')
    parser.add_argument('--time-budget-minutes',type=int,default=140)
    parser.add_argument('--upload',action='store_true')
    parser.add_argument('--report',default='/tmp/saqr-arabic-index-report.json')
    args=parser.parse_args()
    data=json.loads(pathlib.Path(args.manifest).read_text(encoding='utf8'))
    if data.get('schemaVersion')!=1:raise SystemExit('Unexpected manifest schema')
    books=data.get('books',[])
    if args.book_id:
        books=[b for b in books if b['id']==args.book_id]
        if not books:raise SystemExit('Unknown Arabic book ID')
    if args.start_id:
        books=[b for b in books if b['id']>=args.start_id]
    if args.offset>0:
        books=books[args.offset:]
    if args.max_books>0:books=books[:args.max_books]
    url=os.environ.get('SUPABASE_URL','').rstrip('/')
    key=os.environ.get('SUPABASE_SERVICE_ROLE_KEY','')
    if args.upload and (not url.startswith('https://') or not key):
        raise SystemExit('Index upload requires server-side Supabase secrets')
    deadline=time.monotonic()+max(1,args.time_budget_minutes)*60
    report={'startedAt':utc(),'catalogBooks':len(data.get('books',[])),
       'selectedBooks':len(books),'completedBooks':0,'pagesInserted':0,
       'pagesSkippedExisting':0,'extractionFailures':[],'books':[]}
    for book in books:
        if time.monotonic()>deadline:break
        book_id=book['id']
        stats={'id':book_id,'title':book['title'],'source':book['source'],
               'expectedPages':book.get('pageCount',0),'pagesIndexed':0,
               'pagesSkipped':0,'pagesFailed':0,'status':'pending'}
        report['books'].append(stats)
        if book['source']=='unavailable':
            stats['status']='source_missing';continue
        try: existing=indexed_pages(url,key,book_id) if args.upload else set()
        except Exception as exc:
            stats['status']='database_unavailable'
            report['extractionFailures'].append({'id':book_id,'reason':str(exc)[:170]})
            continue
        with tempfile.TemporaryDirectory() as folder:
            tmp=pathlib.Path(folder)
            pdf_file=tmp/'source.pdf'
            pages=book.get('imagePages',[])
            if book['source']=='pdf':
                try:
                    pdf_hash=download(book['pdfFileId'],pdf_file,pdf=True)
                    total=pages_in_pdf(pdf_file)
                except Exception as exc:
                    stats['status']='source_unavailable'
                    report['extractionFailures'].append({'id':book_id,'reason':str(exc)[:170]})
                    continue
                page_pairs=[(n,None) for n in range(1,total+1)]
                stats['expectedPages']=total
            else:
                page_pairs=[(int(p['page']),p['fileId']) for p in pages]
                pdf_hash=''
            attempt=0
            for n,file_id in page_pairs:
                if time.monotonic()>deadline:break
                if n in existing:
                    stats['pagesSkipped']+=1
                    report['pagesSkippedExisting']+=1
                    continue
                if args.max_pages>0 and attempt>=args.max_pages:break
                attempt+=1
                try:
                    if file_id:
                        path=tmp/'page.img'
                        fingerprint=download(file_id,path,max_bytes=24_000_000)
                        text=ocr_file(path)
                        method='arabic_ocr'
                    else:
                        fingerprint=pdf_hash+':'+str(n)
                        text,method=pdf_page_text(pdf_file,n,tmp)
                    if not plausible(text):
                        raise RuntimeError('No sufficiently legible text extracted')
                    if args.upload:
                        inserted=upload_page(url,key,book_id,n,method,fingerprint,text)
                    else:
                        inserted=len(segments(text))
                    if not inserted:raise RuntimeError('Page has no indexable text')
                    stats['pagesIndexed']+=1
                    report['pagesInserted']+=1
                except Exception as exc:
                    stats['pagesFailed']+=1
                    if len(report['extractionFailures'])<500:
                        report['extractionFailures'].append({
                            'id':book_id,'page':n,'reason':str(exc)[:170]})
            stats['status']=('complete' if stats['pagesIndexed']+stats['pagesSkipped']==stats['expectedPages']
                 and stats['pagesFailed']==0 else 'partial')
            if stats['status']=='complete':report['completedBooks']+=1
        print(json.dumps(stats,ensure_ascii=False),flush=True)
    report['finishedAt']=utc()
    pathlib.Path(args.report).parent.mkdir(parents=True,exist_ok=True)
    pathlib.Path(args.report).write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
    print(json.dumps({k:report[k] for k in
        ('catalogBooks','selectedBooks','completedBooks','pagesInserted','pagesSkippedExisting')},ensure_ascii=False))

if __name__=='__main__':
    main()
