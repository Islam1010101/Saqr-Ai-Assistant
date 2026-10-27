export const handhalDictionary={title:'معجم الألفاظ العامية في دولة الإمارات العربية المتحدة',author:'الدكتور فالح حنظل',shelf:6,row:2,url:'https://noorlib.ir/book/view/20858/%D9%85%D8%B9%D8%AC%D9%85-%D8%A7%D9%84%D8%A3%D9%84%D9%81%D8%A7%D8%B8-%D8%A7%D9%84%D8%B9%D8%A7%D9%85%D9%8A%D8%A9-%D9%81%D9%8A-%D8%AF%D9%88%D9%84%D8%A9-%D8%A7%D9%84%D8%A7%D9%85%D8%A7%D8%A7%D8%B1%D8%A7%D8%AA-%D8%A7%D9%84%D8%B9%D8%B1%D8%A8%D9%8A%D8%A9-%D8%A7%D9%84%D9%85%D8%AA%D8%AD%D8%AF%D8%A9?pageNumber=5&viewType=pdf'} as const;
export const dictionaryTasks=([
['أ',1,'اختر لفظًا يبدأ بالألف من المعجم وسجل معناه.','Find an entry under Alef and note its meaning.'],
['ب',1,'اختر لفظًا يبدأ بالباء وسجل معناه.','Find a Ba entry and its meaning.'],
['م',1,'اختر لفظًا يبدأ بالميم وسجل معناه.','Find a Meem entry and its meaning.'],
['س',1,'اختر لفظًا يبدأ بالسين وسجل معناه.','Find a Seen entry and its meaning.'],
['د',2,'اختر لفظًا يبدأ بالدال واكتبه في جملة.','Find a Dal entry and use it in a sentence.'],
['ق',2,'اختر لفظًا يبدأ بالقاف واشرح استعماله.','Find a Qaf entry and describe its use.'],
['ن',2,'اختر لفظًا يبدأ بالنون واذكر سياقه.','Find a Noon entry and its context.'],
['ح',2,'اختر لفظًا يبدأ بالحاء وبيّن المعنى.','Find a Ha entry and state its meaning.'],
['ع',3,'اختر لفظًا يبدأ بالعين وقارن بين المعنى والسياق.','Find an Ain entry and compare meaning with context.'],
['خ',3,'اختر لفظًا يبدأ بالخاء واشرح استعماله.','Find a Kha entry and explain its use.'],
['غ',3,'اختر لفظًا يبدأ بالغين وافحص التعريف.','Find a Ghayn entry and examine the definition.'],
['ر',4,'اختر لفظًا يبدأ بالراء وحلّل الدليل اللغوي إن توفر.','Find a Ra entry and analyse evidence if given.'],
['ص',4,'اختر لفظًا يبدأ بالصاد وقارن استعمالين إن وُجدا.','Find a Sad entry and compare usages if available.'],
['ط',4,'اختر لفظًا يبدأ بالطاء وميّز المعنى عن استنتاجك.','Find a Ta entry and separate the definition from your inference.'],
['ك',4,'اختر لفظًا يبدأ بالكاف وعلّل شرحك بالمعجم.','Find a Kaf entry and justify your explanation from the dictionary.']
] as const).map(([letter,difficulty,ar,en])=>({letter,difficulty,ar,en}));
