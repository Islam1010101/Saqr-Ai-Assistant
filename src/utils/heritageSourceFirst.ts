/**
 * EFIPS internal curriculum authoring references ONLY.
 * Learners see the PRINTED Handhal dictionary exclusively.
 * The specified Noorlib viewer was inaccessible at authoring time.
 * Entries below were selected from published textual citations naming Faleh
 * Handhal's dictionary; specific pagination belongs to the CITED editions and
 * is deliberately NOT shown as EFIPS edition pagination.
 * No student-facing hyperlinks, guessed definitions or auto-graded meanings.
 */
export const handhalDictionary={
 title:'معجم الألفاظ العامية في دولة الإمارات العربية المتحدة',
 author:'الدكتور فالح حنظل',
 shelf:6,
 row:2
} as const;

export type DictionaryResearchTask={
 word:string;
 difficulty:1|2|3|4;
 topic:string;
 ar:string;
 en:string;
 /** Evidence used by content editors; never rendered or linked to students. */
 source:string;
 sourceNote:string;
};
export const dictionaryTasks:DictionaryResearchTask[] = [
  {
    "word": "جواني",
    "difficulty": 1,
    "topic": "النخيل",
    "ar": "ابحث عن «جواني» في معجم فالح حنظل، واكتب معنى اللفظ وفق شرح المؤلف.",
    "en": "Look up «جواني» in Faleh Handhal's printed dictionary and write its meaning.",
    "source": "https://folkculturebh.org/ar/index.php?id=1137&issue=59&page=article",
    "sourceNote": "إحالة منشورة: طبعة 1978 ص 146"
  },
  {
    "word": "الزانة",
    "difficulty": 1,
    "topic": "الحياة القديمة",
    "ar": "ارجع إلى مادة «زانة/الزانة»؛ ما المعنى الذي يذكره المؤلف؟",
    "en": "Find the entry «الزانة» and record the author's definition.",
    "source": "https://www.masaha.org/book/view/4432/page/232",
    "sourceNote": "إحالة منشورة: ص 295"
  },
  {
    "word": "قشع",
    "difficulty": 1,
    "topic": "الأفعال",
    "ar": "ابحث عن «قشع» في المعجم، ثم اكتب معناها كما ورد في المرجع.",
    "en": "Find «قشع» and note its dictionary meaning.",
    "source": "https://www.masaha.org/book/view/4432/page/232",
    "sourceNote": "إحالة منشورة: ص 528"
  },
  {
    "word": "دار صيني",
    "difficulty": 1,
    "topic": "الأطعمة والتوابل",
    "ar": "ابحث عن لفظ «دار صيني»، واكتب المعنى أو الشيء الذي يدل عليه في المعجم.",
    "en": "Find «دار صيني» and identify what it denotes in the dictionary.",
    "source": "https://arabic-books.amuslim.org/%D8%A7%D9%84%D8%AA%D8%A7%D8%B1%D9%8A%D8%AE/Web/11790/001.htm",
    "sourceNote": "إحالة منشورة: ص 208"
  },
  {
    "word": "دكيكة",
    "difficulty": 2,
    "topic": "اللفظ والنطق",
    "ar": "ابحث عن «دكيكة» في المادة التي تناقش نطق حرف القاف، وبيّن أصل الكلمة الفصيح الذي ذكره المؤلف.",
    "en": "Find «دكيكة» in the discussion of Qaf pronunciation. Record its cited standard form.",
    "source": "https://almolltaqa.com/vb/node/94882",
    "sourceNote": "إحالة منشورة: ص 517"
  },
  {
    "word": "جاسم",
    "difficulty": 2,
    "topic": "الأسماء",
    "ar": "تتبّع «جاسم» في شرح نطق حرف القاف، ثم اكتب الصورة الأصلية التي قارن بها المؤلف.",
    "en": "Look for «جاسم» in the Qaf discussion and report the original form compared by the author.",
    "source": "https://almolltaqa.com/vb/node/94882",
    "sourceNote": "إحالة منشورة: ص 517"
  },
  {
    "word": "الشارجة",
    "difficulty": 2,
    "topic": "أسماء الأماكن",
    "ar": "ابحث عن «الشارجة» في فقرة نطق القاف، وبيّن الاسم الذي يقابله في الكتاب.",
    "en": "Find «الشارجة» in the Qaf section and record the corresponding place name.",
    "source": "https://almolltaqa.com/vb/node/94882",
    "sourceNote": "إحالة منشورة: ص 517"
  },
  {
    "word": "يواني",
    "difficulty": 2,
    "topic": "النخيل",
    "ar": "ابحث عن «يواني»؛ هل يذكر المعجم لفظًا قريبًا منه؟ دوّن ما وجدته دون تخمين.",
    "en": "Find «يواني». Does the dictionary give a related form? Record what you see.",
    "source": "https://folkculturebh.org/ar/index.php?id=1137&issue=59&page=article",
    "sourceNote": "إحالة منشورة: طبعة 1978 ص 146"
  },
  {
    "word": "غبايل",
    "difficulty": 3,
    "topic": "التحوّل الصوتي",
    "ar": "ابحث عن «غبايل» ضمن مبحث نطق القاف، وفسّر التحوّل الصوتي الذي ورد فيه.",
    "en": "Locate «غبايل» in the Qaf discussion and explain the sound change described.",
    "source": "https://almolltaqa.com/vb/node/94882",
    "sourceNote": "إحالة منشورة: ص 517"
  },
  {
    "word": "غصايد",
    "difficulty": 3,
    "topic": "التحوّل الصوتي",
    "ar": "ابحث عن «غصايد» في المعجم، وقارن نطقها بالصورة الفصيحة المذكورة.",
    "en": "Find «غصايد» and compare its pronunciation with the recorded standard form.",
    "source": "https://almolltaqa.com/vb/node/94882",
    "sourceNote": "إحالة منشورة: ص 517"
  },
  {
    "word": "غصر",
    "difficulty": 3,
    "topic": "التحوّل الصوتي",
    "ar": "ابحث عن «غصر»، ثم وضّح الحرف الذي تغيّر في نطقها كما يناقشه المؤلف.",
    "en": "Find «غصر» and describe the consonant shift discussed by the author.",
    "source": "https://almolltaqa.com/vb/node/94882",
    "sourceNote": "إحالة منشورة: ص 517"
  },
  {
    "word": "جواني",
    "difficulty": 3,
    "topic": "النخيل",
    "ar": "ارجع مرة أخرى إلى «جواني»، وقارنها بلفظ «يواني» إن كانت طبعتك تعرضهما معًا.",
    "en": "Revisit «جواني» and compare it with «يواني» if both appear in your edition.",
    "source": "https://folkculturebh.org/ar/index.php?id=1137&issue=59&page=article",
    "sourceNote": "إحالة منشورة: طبعة 1978 ص 146"
  },
  {
    "word": "قشع",
    "difficulty": 4,
    "topic": "السياق والمعنى",
    "ar": "اعثر على «قشع»، ثم اكتب جملة توضح استعمالها، وافصل بين تعريف المعجم والجملة من تأليفك.",
    "en": "Look up «قشع», use it in a sentence, and separate the dictionary definition from your own example.",
    "source": "https://www.masaha.org/book/view/4432/page/232",
    "sourceNote": "إحالة منشورة: ص 528"
  },
  {
    "word": "الزانة",
    "difficulty": 4,
    "topic": "الموروث اللفظي",
    "ar": "ابحث عن «الزانة» وحلل سياق استعمالها في التراث، مع توضيح ما نقله المعجم وما استنتجته.",
    "en": "Study «الزانة», distinguish its recorded meaning from your inference about historical use.",
    "source": "https://www.masaha.org/book/view/4432/page/232",
    "sourceNote": "إحالة منشورة: ص 295"
  },
  {
    "word": "دكيكة",
    "difficulty": 4,
    "topic": "المقارنة الصوتية",
    "ar": "اقرأ مناقشة «دكيكة» في نطق القاف؛ اشرح الفرق بين طريقة النطق والصورة الفصيحة واذكر دليلك.",
    "en": "Analyse «دكيكة» in the Qaf discussion: compare dialect pronunciation with the standard form, citing the dictionary.",
    "source": "https://almolltaqa.com/vb/node/94882",
    "sourceNote": "إحالة منشورة: ص 517"
  }
];
