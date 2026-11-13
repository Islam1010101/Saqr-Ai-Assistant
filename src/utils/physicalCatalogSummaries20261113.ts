/**
 * Conservative, language-aware physical-library descriptions.
 * Verified synopses are restricted to identifiable works and grounded
 * published bibliographic descriptions. Other entries receive a clearly
 * labelled CATALOGUE note, never an invented account of the book's content.
 */
export type PhysicalSummaryLanguage='AR'|'EN';
export type PhysicalSummaryInput={
  title:string;author:string;subject:string;language:PhysicalSummaryLanguage
};
const key=(value:string)=>String(value||'').normalize('NFKC').toLocaleLowerCase()
  .replace(/[^\p{L}\p{N}]+/gu,'');
const verifiedEnglishSynopses:Record<string,string>={
  [key('SACAGAWEA')]:
    'Judith St. George tells the story of Sacagawea, the young Shoshone woman who accompanied the Lewis and Clark expedition. Drawing on expedition journals, the biography explores her work as an interpreter, guide and peacemaker amid difficult journeys and changing landscapes.',
  [key('Buttermilk Hill')]:
    'Ten-year-old Piper Berry is unsettled when her parents separate and their lives change. With the support of friends, family stories and her growing love of poetry, she works through feelings about belonging and begins finding her own voice.',
  [key('The White Stallion')]:
    'In 1845, Gretchen becomes separated from her family’s wagon train while travelling west. Lost in unfamiliar country, she encounters a remarkable white stallion that helps guide her toward safety and home.',
  [key('Death Of a Salesman')]:
    'Arthur Miller’s play follows Willy Loman, an ageing travelling salesman whose hopes of success clash with his family’s realities. Through memories and conversations with his sons and wife, the drama explores identity, ambition, expectations and the American Dream.',
  [key('african american quilting : The Warmth of Tradition')]:
    'Sule Greg C. Wilson introduces African American quilting as an artistic and cultural tradition, exploring distinctive designs and methods while placing quilt-making within wider histories of textile art and community creativity.',
  [key('The Good Fat Bad Fat')]:
    'Sheila Buff’s nutrition guide compares types of dietary fat and explains how different food choices relate to health. It helps readers distinguish saturated and trans fats from other fats and consider practical everyday nutrition decisions.'
};
export const isPhysicalCatalogMetadataNote=(value:string):boolean=>
  /^(?:Catalogue note:|ملاحظة فهرسية:)/i.test(String(value||'').trim());
export const isPhysicalCatalogPlaceholder=(value:string):boolean=>(
  /^(?:a summary for the book|a verified (?:book )?description is not yet available|a verified description is not yet available for this physical library book|this book is available in the efips physical library|catalogued from the school orison inventory|listed in the school orison inventory|ملخص كتاب|الوصف التفصيلي لهذا الكتاب غير متاح|هذا الكتاب متوفر في مكتبة المدرسة الورقية|بيانات الكتاب مأخوذة من الفهرس الورقي)/i.test(String(value||'').trim())
);
export const physicalCatalogSummary=(book:PhysicalSummaryInput):string=>{
  const title=String(book.title||'').trim(),author=String(book.author||'').trim();
  if(book.language==='EN'){
    const confirmed=verifiedEnglishSynopses[key(title)];
    if(confirmed)return confirmed;
    const subject=String(book.subject||'General Knowledge').trim();
    const authorText=author && author!=='Unknown Author'? ` by ${author}`:'';
    return `Catalogue note: “${title}”${authorText} is listed under “${subject}”. This is a subject guide based on the library record, not a content-verified synopsis of this edition.`;
  }
  const subject=String(book.subject||'كتب معرفية عامة').trim();
  const authorText=author && author!=='مؤلف غير معروف' && author!=='مؤلف غير مسجل'?` للمؤلف ${author}`:'';
  return `ملاحظة فهرسية: «${title}»${authorText} مصنّف ضمن «${subject}». هذا تعريف استرشادي مستند إلى بيانات الفهرس، وليس ملخصًا موثّقًا لمحتوى هذه الطبعة.`;
};
