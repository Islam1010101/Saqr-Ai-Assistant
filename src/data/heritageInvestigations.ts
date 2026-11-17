/**
 * Verified, source-first investigations. Evidence is a pedagogical paraphrase,
 * never presented as a scan or quotation from an original archival document.
 * "Unverified" cards are fictional classroom claims, NOT historical records.
 */
export type Bilingual = { ar: string; en: string };
export type HeritageEvidence = {
  id: string;
  title: Bilingual;
  summary: Bilingual;
  publisher: Bilingual;
  url?: string;
  official: boolean;
};
export type HeritageTimelineEntry = { id: string; label: Bilingual; order: number };
export type HeritageInvestigation = {
  id: string;
  level: 1 | 2 | 3 | 4;
  title: Bilingual;
  allegation: Bilingual;
  briefing: Bilingual;
  verdict: 'false' | 'misleading' | 'supported';
  evidence: [HeritageEvidence, HeritageEvidence, HeritageEvidence];
  timeline?: HeritageTimelineEntry[];
  conclusion: Bilingual;
  reasoningPrompt: Bilingual;
};
const l = (ar: string, en: string): Bilingual => ({ ar, en });
const official = (id: string, title: Bilingual, summary: Bilingual, publisher: Bilingual, url: string): HeritageEvidence =>
  ({ id, title, summary, publisher, url, official: true });
const unverified = (id: string, title: Bilingual, summary: Bilingual): HeritageEvidence =>
  ({ id, title, summary, publisher: l('منشور تدريبي بلا جهة موثقة','Fictional unattributed practice card'), official: false });
const portal = l('البوابة الرسمية لحكومة الإمارات','UAE Government Portal');
const mofa = l('وزارة الخارجية الإماراتية','UAE Ministry of Foreign Affairs');
const unesco = l('اليونسكو - سجل التراث','UNESCO Heritage Register');
const uaeHistory = 'https://u.ae/ar/about-the-uae/History';
const mofaHistory = 'https://www.mofa.gov.ae/ar-ae/the-uae/history';
const founders = 'https://u.ae/ar/about-the-uae/founders-of-the-union';
const alAin = 'https://whc.unesco.org/en/list/1343';
const aflaj = 'https://ich.unesco.org/en/RL/al-aflaj-traditional-irrigation-network-system-in-the-uae-oral-traditions-knowledge-and-skills-of-construction-maintenance-and-equitable-water-distribution-01577';
const sadu = 'https://ich.unesco.org/en/RL/al-sadu-traditional-weaving-skills-in-the-united-arab-emirates-02223';
const majlis = 'https://ich.unesco.org/en/RL/majlis-a-cultural-and-social-space-01076';
const ayyala = 'https://ich.unesco.org/en/RL/al-ayyala-a-traditional-performing-art-of-the-sultanate-of-oman-and-the-united-arab-emirates-01012';
const talli = 'https://ich.unesco.org/en/RL/al-talli-traditional-embroidery-skills-in-the-united-arab-emirates-01712';
const harees = 'https://ich.unesco.org/en/RL/harees-dish-know-how-skills-and-practices-01744';
const falconry = 'https://ich.unesco.org/en/RL/falconry-a-living-human-heritage-01708';
const timelineUnion: HeritageTimelineEntry[] = [
  {id:'1968',order:0,label:l('فبراير 1968: مباحثات تأسيس الاتحاد','February 1968: federation talks')},
  {id:'1971-july',order:1,label:l('18 يوليو 1971: قرار حكام ست إمارات','18 July 1971: six rulers decide')},
  {id:'1971-dec',order:2,label:l('2 ديسمبر 1971: إعلان الدولة','2 December 1971: federation proclaimed')},
  {id:'1972',order:3,label:l('10 فبراير 1972: انضمام رأس الخيمة','10 February 1972: Ras Al Khaimah joins')}
];
export const heritageInvestigations: HeritageInvestigation[] = [
  {
    id:'formation-six',level:1,title:l('لغز الإمارات الست والسبع','The six-versus-seven puzzle'),
    allegation:l('«الإمارات السبع أعلنت الاتحاد معًا يوم 2 ديسمبر 1971»','“All seven emirates founded the federation together on 2 December 1971.”'),
    briefing:l('وصل بلاغ إلى أرشيف صقر عن صورة منشور يخلط بين يوم تأسيس الدولة واكتمال عدد الإمارات. افحص المستندات، ثم رتب الوقائع واحسم الادعاء.','A post confuses the day the UAE was founded with the date all seven emirates joined. Examine the records, order the events and issue a finding.'),
    verdict:'false',
    evidence:[
      official('a',l('سجل قيام الدولة','State foundation record'),l('تسجل البوابة الرسمية إعلان الدولة يوم 2 ديسمبر 1971 بست إمارات، وانضمام رأس الخيمة في 10 فبراير 1972.','The government portal records six founding emirates in December 1971 and Ras Al Khaimah joining in February 1972.'),portal,uaeHistory),
      official('b',l('سجل وزارة الخارجية','Foreign Ministry chronology'),l('تؤكد الوزارة قرار حكام ست إمارات في يوليو 1971، ثم إعلان الاتحاد في ديسمبر وانضمام رأس الخيمة لاحقًا.','The ministry confirms the July 1971 decision by six rulers, the December declaration and the later accession of Ras Al Khaimah.'),mofa,mofaHistory),
      unverified('c',l('منشور يدمج التاريخين','Unattributed merged timeline'),l('يزعم منشور تدريبي بلا إسناد أن التأسيس والاكتمال حدثا في اليوم نفسه.','An invented unsourced social post treats founding and completion as one date.'))
    ],
    timeline:timelineUnion,
    reasoningPrompt:l('اشرح الفرق بين تأسيس الاتحاد واكتمال انضمام الإمارات السبع، مع ذكر تاريخ أو اسم مصدر.','Explain founding versus completion, citing at least one date or named source.'),
    conclusion:l('الادعاء خاطئ: أُعلن الاتحاد بست إمارات في 2 ديسمبر 1971، ثم انضمت رأس الخيمة في 10 فبراير 1972.','False. The UAE was proclaimed by six emirates on 2 December 1971; Ras Al Khaimah joined on 10 February 1972.')
  },
  {
    id:'foundation-prelude',level:2,title:l('وثيقة من عام 1968','The 1968 document'),
    allegation:l('«اجتماع 1968 هو نفسه إعلان دولة الإمارات المستقلة»','“The meeting in 1968 was the official proclamation of the independent UAE.”'),
    briefing:l('قُدمت للمحقق ورقة تخلط بين بدء مباحثات الاتحاد والإعلان القانوني للدولة. اكتشف الخط الزمني الصحيح قبل اعتماد الحكم.','A file confuses early federation discussions with the formal declaration. Reconstruct the timeline before deciding.'),
    verdict:'false',
    evidence:[
      official('a',l('مبادرات فبراير 1968','February 1968 talks'),l('تحدد البوابة الرسمية مباحثات الشيخ زايد والشيخ راشد في السمحة عام 1968 بوصفها خطوة مبكرة نحو الاتحاد.','The portal identifies the 1968 talks in Al Samha as an early step toward federation.'),portal,uaeHistory),
      official('b',l('بيان عام 1971','The 1971 declaration'),l('توضح وزارة الخارجية أن الدولة أُعلنت رسميًا في 2 ديسمبر 1971، بعد مباحثات استمرت سنوات.','The Foreign Ministry dates the formal establishment to 2 December 1971, years after initial talks.'),mofa,mofaHistory),
      unverified('c',l('ورقة بتاريخ ملتبس','Misdated classroom card'),l('بطاقة تدريبية تفترض أن كل اجتماع تمهيدي يعني صدور إعلان دولة مستقلة.','A fictional card assumes every preliminary meeting creates an independent country.'))
    ],
    timeline:timelineUnion,
    reasoningPrompt:l('ميّز بين المفاوضات التمهيدية والقرار والإعلان، ولا تخلط بين سنة 1968 و1971.','Differentiate negotiations, decision and proclamation; do not confuse 1968 with 1971.'),
    conclusion:l('اجتماع 1968 كان من الخطوات التأسيسية، لكن الإعلان الرسمي للدولة تم في 2 ديسمبر 1971.','The 1968 meeting was a precursor; the formal state proclamation came on 2 December 1971.')
  },
  {
    id:'ain-ancient',level:2,title:l('حفريات العين ليست حديثة','Al Ain: ancient or new?'),
    allegation:l('«العين أصبحت موقعًا تاريخيًا فقط حين سُجلت في اليونسكو عام 2011»','“Al Ain only became a historical site when UNESCO listed it in 2011.”'),
    briefing:l('تاريخ على موقع إلكتروني جعل أحد الزوار يخلط بين سنة الإدراج وعمر الآثار نفسها. افحص وصف الموقع ومكوناته الأثرية.','A website date was mistaken for the age of the remains. Inspect the World Heritage record and its archaeological description.'),
    verdict:'false',
    evidence:[
      official('a',l('وصف أثري من اليونسكو','UNESCO archaeological record'),l('تصف اليونسكو آثارًا من العصر الحجري الحديث، ومدافن حجرية تعود إلى نحو 2500 قبل الميلاد، وآثار حضارات متعاقبة.','UNESCO describes Neolithic occupation and circular tombs dating to about 2500 BCE.'),unesco,alAin),
      official('b',l('سجل الإدراج الدولي','World Heritage inscription'),l('2011 هو تاريخ تسجيل مواقع العين الثقافية على قائمة التراث العالمي، وليس تاريخ إنشاء المواقع.','2011 marks the World Heritage inscription, not the construction or first occupation of the sites.'),unesco,alAin),
      unverified('c',l('خلط سنة التسجيل بالتاريخ','Confused date card'),l('بطاقة مختلقة تقول إن اكتساب صفة «تراث عالمي» يعني نشأة الموقع في السنة نفسها.','An invented card equates a modern recognition date with the age of an ancient site.'))
    ],
    reasoningPrompt:l('فرّق بين عمر الآثار وتاريخ الاعتراف الدولي بها، واذكر مثالًا أثريًا محددًا.','Distinguish the age of the remains from their inscription date; cite an archaeological example.'),
    conclusion:l('الآثار أقدم بآلاف السنين من إدراج الموقع في 2011؛ من بينها مدافن ومستوطنات وقنوات ري تاريخية.','The remains are thousands of years older than their 2011 listing, including tombs, settlements and historic irrigation systems.')
  },
  {
    id:'falaj-network',level:2,title:l('مسار الماء المخفي','The hidden water route'),
    allegation:l('«الأفلاج مجرد قنوات مكشوفة، ولا تتطلب معرفة بطرق المياه الجوفية»','“Aflaj are only open channels and involve no knowledge of underground water.”'),
    briefing:l('رسم متداول حذف الممرات تحت الأرض من نظام الفلج. تتبع طريقة وصول الماء للواحة، ثم أثبت موضع الخلل.','A drawing leaves underground passages out of an irrigation network. Trace the water path and find the omission.'),
    verdict:'false',
    evidence:[
      official('a',l('شرح نظام الفلج','How the aflaj work'),l('تصف اليونسكو نفقًا تحت الأرض ينقل الماء بانحدار تدريجي، ثم قنوات سطحية توزعه على المزارع.','UNESCO documents underground tunnels flowing by gravity and surface channels delivering water to farms.'),unesco,aflaj),
      official('b',l('آثار الري في هيلي','Irrigation traces at Hili'),l('تؤكد مواقع العين الثقافية وجود بقايا أفلاج أثرية تعود إلى العصر الحديدي في هيلي.','The Al Ain heritage record notes Iron Age aflaj remains at Hili.'),unesco,alAin),
      unverified('c',l('رسم تخطيطي ناقص','Incomplete classroom diagram'),l('يفترض وصف تدريبي أن قنوات الماء لا توجد إلا فوق سطح الأرض.','A fictional diagram omits the underground sections entirely.'))
    ],
    reasoningPrompt:l('صف انتقال الماء من باطن الأرض إلى الحقول، وبيّن لماذا لا يكفي الرسم الناقص.','Trace water from underground passages to fields and explain the flaw in the simplified drawing.'),
    conclusion:l('الأفلاج تجمع في بعض أنظمتها أنفاقًا تحت الأرض وقنوات سطحية، وهي خبرة تقنية متوارثة في إدارة المياه.','Aflaj systems can combine underground passages with surface channels and reflect inherited water-management expertise.')
  },
  {
    id:'sadu-transition',level:3,title:l('ملف السدو: هل اختفى؟','Al Sadu: a disappearing craft?'),
    allegation:l('«السدو لم يخرج من فئة الصون العاجل ولم يُحفظ حتى عام 2025»','“Al Sadu remained on urgent safeguarding status and had not recovered by 2025.”'),
    briefing:l('يظهر ملف قديم قائمة الصون العاجل، بينما يُظهر سجل أحدث وضعًا مختلفًا. اكتشف ما تغير، ولا تعتمد على نسخة قديمة وحدها.','An older file shows urgent safeguarding while a newer register describes a change. Determine what happened using dated evidence.'),
    verdict:'false',
    evidence:[
      official('a',l('تسجيل السدو عام 2011','2011 safeguarding status'),l('أُدرج السدو سنة 2011 ضمن التراث الذي يحتاج إلى صون عاجل بسبب تراجع الممارسة آنذاك.','Al Sadu was placed on the urgent safeguarding list in 2011 after a decline in practice.'),unesco,sadu),
      official('b',l('تطور وضع السدو في 2025','2025 status update'),l('تصف اليونسكو جهود الصون ونقل المهارات بين 2011 و2023، ثم إدراج العنصر سنة 2025 على القائمة التمثيلية.','UNESCO describes safeguarding work and knowledge transfer, with inscription on the Representative List in 2025.'),unesco,sadu),
      unverified('c',l('لقطة قديمة بلا تاريخ','Outdated practice screenshot'),l('ادعاء تدريبي يستشهد بحالة 2011 على أنها الوضع النهائي للسدو سنة 2025.','An invented post treats the 2011 status as if it never changed.'))
    ],
    timeline:[
      {id:'2011',order:0,label:l('2011: إدراج للحماية العاجلة','2011: urgent safeguarding listing')},
      {id:'2011-2023',order:1,label:l('2011–2023: برنامج صون ونقل المهارات','2011–2023: safeguarding and teaching')},
      {id:'2025',order:2,label:l('2025: الإدراج بالقائمة التمثيلية','2025: Representative List inscription')}
    ],
    reasoningPrompt:l('اشرح كيف يؤدي تجاهل تاريخ المصدر إلى استنتاج مضلل بشأن حالة السدو.','Explain how ignoring a source date can distort conclusions about Al Sadu.'),
    conclusion:l('الادعاء غير صحيح: خضع السدو لصون عاجل سنة 2011، ثم أظهرت اليونسكو انتقاله إلى القائمة التمثيلية سنة 2025.','False. Al Sadu entered urgent safeguarding in 2011 and the Representative List in 2025.')
  },
  {
    id:'majlis-memory',level:3,title:l('سرّ الروايات داخل المجلس','Stories in the Majlis'),
    allegation:l('«المجلس الإماراتي مكان للضيافة، وليس لتناقل المعرفة الشفوية»','“The Emirati majlis is for hospitality, not the transfer of oral knowledge.”'),
    briefing:l('يركز وصف قصير للمجلس على تقديم القهوة فقط. افحص سجل التراث لتحديد الوظائف الاجتماعية والثقافية التي أغفلها.','A short description mentions only serving guests. Check the heritage record for overlooked cultural roles.'),
    verdict:'false',
    evidence:[
      official('a',l('وظائف المجلس الاجتماعية','Social role of the majlis'),l('تصف اليونسكو المجلس مكانًا للنقاش وتبادل الأخبار واستقبال الضيوف وحل المشكلات.','UNESCO describes a space for discussion, news exchange, hospitality and resolving problems.'),unesco,majlis),
      official('b',l('نقل التراث الشفهي','Oral heritage transmission'),l('تذكر اليونسكو نقل الحكايات والأغاني الشعبية والشعر النبطي ومهارات الحوار والإنصات بين الأجيال.','UNESCO identifies storytelling, folk songs, Nabati poetry and intergenerational dialogue.'),unesco,majlis),
      unverified('c',l('بطاقة ضيافة فقط','Hospitality-only classroom card'),l('ادعاء تدريبي يستبعد أي نشاط تعليمي أو تناقل للقصص في المجلس.','A fictional card excludes all knowledge-sharing from the majlis.'))
    ],
    reasoningPrompt:l('اذكر وظيفتين موثقتين للمجلس تتجاوزان استقبال الضيوف.','Identify two documented majlis roles beyond hosting guests.'),
    conclusion:l('المجلس مساحة اجتماعية لنقل الخبرة والتراث الشفهي، إضافة إلى الضيافة والحوار.','The majlis helps transfer oral traditions and knowledge, alongside hospitality and social dialogue.')
  },
  {
    id:'ayyala-not-just-dance',level:3,title:l('الصوت المفقود من العيّالة','The missing voice of Al-Ayyala'),
    allegation:l('«العيّالة رقصة صامتة لا تستخدم الشعر أو الإيقاع»','“Al-Ayyala is a silent dance with no poetry or percussion.”'),
    briefing:l('وصف ناقص حذف أهم عناصر الأداء. قارن الوصف المبتور بما تسجله منظمة التراث الثقافي رسميًا.','A shortened description omits core elements of the performance. Compare it with the heritage record.'),
    verdict:'false',
    evidence:[
      official('a',l('مكوّنات العيّالة','Al-Ayyala performance'),l('تؤكد اليونسكو أن العيّالة تشمل إنشاد الشعر وإيقاعات الطبول والأداء الحركي في صفين متقابلين.','UNESCO describes chanted poetry, drums and coordinated movement in facing rows.'),unesco,ayyala),
      official('b',l('التوثيق متعدد الدول','Joint heritage registration'),l('تحدد اليونسكو إدراج العيّالة سنة 2014 ضمن تراث الإمارات وسلطنة عُمان.','UNESCO records Al-Ayyala in 2014 as shared heritage of the UAE and Oman.'),unesco,ayyala),
      unverified('c',l('وصف أداء صامت','Silent-performance claim'),l('بطاقة تدريبية تنفي وجود الغناء والطبول رغم وصف السجل الرسمي.','An invented note denies chanting and drums despite the UNESCO record.'))
    ],
    reasoningPrompt:l('استخرج عنصرين من الأداء من وصف اليونسكو، ووضح أثر حذفهما على فهم التراث.','Identify two performance elements from UNESCO and explain why omitting them distorts the record.'),
    conclusion:l('العيّالة تشمل الشعر المنشود والطبول والحركة الجماعية وليست أداءً صامتًا.','Al-Ayyala includes chanted poetry, percussion and coordinated movement, not silent dance.')
  },
  {
    id:'talli-threads',level:3,title:l('ستة خيوط وخيط فضي','Six threads and silver'),
    allegation:l('«فن التلي مجرد زينة صناعية حديثة، ولا يُتوارث تعلّمه»','“Al Talli is just a modern industrial decoration, not a transmitted heritage craft.”'),
    briefing:l('بطاقة تجارية وصفت المنتج وحده. هل يكفي ذلك لنفي قيمة الممارسة التراثية؟ افتح وصف الحرفة وآليات توريثها.','A commercial tag describes only the finished trim. Examine how this craft is made and taught.'),
    verdict:'false',
    evidence:[
      official('a',l('تقنية صناعة التلي','Technique of Al Talli'),l('تصف اليونسكو التلي حرفة إماراتية، غالبًا ما تجمع ستة خيوط قطنية مع خيط فضي وسطي.','UNESCO describes a traditional Emirati craft often using six cotton strands with a central silver thread.'),unesco,talli),
      official('b',l('التوارث والتعليم','How the skill is transmitted'),l('تُنقل مهارات التلي بين الأجيال داخل الأسر ومن خلال الورش والمؤسسات التعليمية والتجمعات الاجتماعية.','The craft is passed through families, workshops and educational and community gatherings.'),unesco,talli),
      unverified('c',l('بطاقة متجر تدريبية','Fictional shop label'),l('تدعي بطاقة غير موثقة أن الزخارف كلها تنتج آليًا بلا صانعات أو نقل للمهارات.','A fictional sales label claims the craft uses only machines and has no inherited skill.'))
    ],
    reasoningPrompt:l('استخدم دليلًا عن طريقة الصناعة وآخر عن نقل المهارات لإثبات طبيعة الحرفة.','Use evidence about the technique and its transmission to establish the craft’s character.'),
    conclusion:l('التلي حرفة تقليدية ذات مهارات وطرق تعليم موثقة، وأُدرج في قائمة اليونسكو التمثيلية سنة 2022.','Al Talli is a traditional craft with documented techniques and transmission; it was listed by UNESCO in 2022.')
  },
  {
    id:'harees-shared',level:4,title:l('الهريس: وصفة أم ذاكرة مجتمع؟','Harees: a recipe or community memory?'),
    allegation:l('«توثيق الهريس يتناول المكونات وحدها، دون عادات المجتمع»','“The heritage documentation of Harees is only about ingredients, not community customs.”'),
    briefing:l('تتطابق مكونات الأكلة في وصفين، لكن أحدهما حذف كل ما يتعلق بالاحتفالات والضيافة ونقل المعرفة. أي وصف أوفى للأدلة؟','Two summaries mention the dish, but one leaves out hospitality and shared customs. Determine what the official record establishes.'),
    verdict:'false',
    evidence:[
      official('a',l('المكونات وطريقة التقديم','Ingredients and sharing'),l('تورد اليونسكو القمح واللحم والسمن، وتذكر إعداد الطبق بكميات كبيرة وتقديمه في أطباق مشتركة.','UNESCO records wheat, meat and ghee, large-scale preparation and shared serving.'),unesco,harees),
      official('b',l('علاقة الهريس بالمجتمع','Community significance'),l('يرتبط الهريس بالمناسبات ورمضان والضيافة، وتنقل مهاراته بين الأجيال في الإمارات وعُمان والسعودية.','Harees is tied to Ramadan, hospitality, celebrations and knowledge transfer in the UAE, Oman and Saudi Arabia.'),unesco,harees),
      unverified('c',l('وصفة بلا سياق','Context-free classroom recipe'),l('بطاقة تدريبية تصر على أن الطعام لا يمكن أن يحمل قيمة اجتماعية أو ذاكرة مشتركة.','An invented card argues that food cannot carry shared cultural memory.'))
    ],
    reasoningPrompt:l('اذكر دليلاً على المكونات ودليلاً على الممارسة الاجتماعية، مع فصل الحقيقة عن الرأي.','Cite one fact about the dish and one about its social practice, separating evidence from opinion.'),
    conclusion:l('تغطي وثيقة الهريس المكونات ومهارات الإعداد إلى جانب الضيافة والتواصل الاجتماعي، وأُدرج سنة 2023.','The heritage record covers ingredients, preparation, hospitality and social connections; it was inscribed in 2023.')
  },
  {
    id:'falconry-living',level:4,title:l('أين اختفت حماية الصقور؟','The missing conservation story'),
    allegation:l('«الصقارة اليوم لا تعني سوى الصيد، ولا علاقة لها بحماية الطيور»','“Falconry today is only hunting and has no role in safeguarding birds.”'),
    briefing:l('مقتطف تاريخي يصف الصقارة وسيلة للحصول على الغذاء، بينما تؤكد وثيقة حديثة وظائف أخرى. حدد إن كان الادعاء كاملًا أم مضللًا.','An old account focuses on obtaining food while a living-heritage record describes modern roles. Assess whether the claim is complete or misleading.'),
    verdict:'misleading',
    evidence:[
      official('a',l('الجذور التاريخية للصقارة','Origins of falconry'),l('تذكر اليونسكو أن الصقارة بدأت تاريخيًا وسيلة للحصول على الغذاء، ثم اكتسبت قيمًا اجتماعية وثقافية أخرى.','UNESCO describes food acquisition as an original purpose, with later social and cultural roles.'),unesco,falconry),
      official('b',l('مسؤولية الصقار المعاصر','Modern safeguarding'),l('تصف اليونسكو اهتمام الممارسين اليوم بصون الصقور والفرائس والموائل الطبيعية، وتوثق نقل المهارات بين الأجيال.','UNESCO describes modern concern for falcons, quarry and habitats as well as transmission of skills.'),unesco,falconry),
      unverified('c',l('اختزال الصقارة في غرض واحد','One-purpose fictional claim'),l('تزعم بطاقة تدريبية أن وظيفة الصقارة لم تتغير وأن الحماية البيئية ليست جزءًا من ممارستها.','An invented summary insists that falconry has no social or conservation dimension.'))
    ],
    reasoningPrompt:l('كيف يمكن أن تكون معلومة عن الماضي صحيحة لكن توظيفها للحكم على الحاضر مضللًا؟','Explain how a correct historical fact can be used to make a misleading claim about current practice.'),
    conclusion:l('الادعاء مضلل: للصقارة جذور في الصيد، لكنها اليوم تشمل هوية اجتماعية وتوارث مهارات والاهتمام بحماية الطيور وموائلها.','Misleading. Falconry has hunting origins but now also involves cultural transmission and safeguarding birds and habitats.')
  }
];
