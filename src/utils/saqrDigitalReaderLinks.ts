import type { SaqrBookMatch } from './saqrCatalogSearch.ts';

/**
 * Link a *verified, individual digital holding* to EFIPS's existing reader.
 * The book ID is looked up again against the destination library's own
 * allow-listed records; a catalogue link never grants read permissions.
 * We do not use untrusted Drive folder URLs as the reading destination.
 */
export function saqrDigitalReaderHref(book: Pick<SaqrBookMatch,'bookKey'|'driveLink'>): string | null {
  const match=/^digital:(ar|en):([A-Za-z0-9_-]{2,150})$/.exec(book.bookKey||'');
  if(!match || !book.driveLink)return null;
  try {
    const source=new URL(book.driveLink);
    if(source.protocol!=='https:')return null;
  } catch { return null; }
  const [,language,id]=match;
  const page=language==='en'?'english':id.startsWith('NI_')?'national-identity':'arabic';
  return '/#/digital-library/'+page+'?open='+encodeURIComponent(id);
}

/** Only the in-platform reading action receives button styling in Saqr chat. */
export function isSaqrDigitalReaderHref(href:string|undefined):boolean {
  return /^\/#\/digital-library\/(?:arabic|english|national-identity)\?open=[A-Za-z0-9_-]{2,150}$/.test(href||'');
}

export function saqrDigitalReadAction(
  book:Pick<SaqrBookMatch,'bookKey'|'driveLink'>,locale:'ar'|'en'
):string|null {
  const href=saqrDigitalReaderHref(book);
  return href ? '['+(locale==='ar'?'اقرأ الكتاب':'Read book')+']('+href+')' : null;
}
