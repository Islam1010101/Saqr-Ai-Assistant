/**
 * Human-authored, bilingual comprehension scaffolds.
 * These explanations quote evidence from the existing approved story text;
 * the story narrations, question prompts, and answer keys are unchanged.
 */
export type ReadingQuestionSupport = {
  evidenceLine: number;
  hintAr: string;
  hintEn: string;
  explanationAr: string;
  explanationEn: string;
};

export const questionSupport: Record<string, ReadingQuestionSupport> = {
  "saqr-library-1": {
    "evidenceLine": 0,
    "hintAr": "فكّر في المكان الذي تُرتّب فيه الكتب على الرفوف.",
    "hintEn": "Think of the place where books are kept on shelves.",
    "explanationAr": "دخل صقر إلى المكتبة؛ فهي المكان الذي بدأت فيه أحداث القصة.",
    "explanationEn": "Saqr entered the library, where the story began."
  },
  "saqr-library-2": {
    "evidenceLine": 2,
    "hintAr": "تذكّر نوع الحكاية التي طلبها صقر من أمين المكتبة.",
    "hintEn": "Remember the kind of story Saqr asked the librarian to find.",
    "explanationAr": "طلب صقر قصة عن الصداقة ومساعدة الآخرين، لا عن موضوع آخر.",
    "explanationEn": "Saqr specifically asked for a story about friendship and helping others."
  },
  "saqr-library-3": {
    "evidenceLine": 5,
    "hintAr": "فكّر: ما الفائدة من القراءة دون عجلة؟",
    "hintEn": "Think: why might someone read without rushing?",
    "explanationAr": "قرأ صقر ببطء لأنه أراد فهم كل جملة، وليس مجرد الانتهاء من الكتاب.",
    "explanationEn": "Saqr read slowly to understand every sentence, not just to finish quickly."
  },
  "saqr-library-4": {
    "evidenceLine": 6,
    "hintAr": "تذكّر ماذا فعل الطفل عندما فقد صديقه حقيبته.",
    "hintEn": "Recall what the child did when a friend lost a school bag.",
    "explanationAr": "كان التصرف لطيفًا لأنه ساعد صديقه على إيجاد الحقيبة المفقودة.",
    "explanationEn": "The action was kind because the child helped a friend find a lost bag."
  },
  "saqr-library-5": {
    "evidenceLine": 9,
    "hintAr": "ما السلوك الجميل الذي أعجب صقر وأراد تقليده؟",
    "hintEn": "Which kind action did Saqr admire and want to copy?",
    "explanationAr": "تُظهر القصة أن مساعدة الآخرين قيمة يمكننا تطبيقها مع أصدقائنا.",
    "explanationEn": "The story shows that helping others is a useful lesson we can practice."
  },
  "little-tree-1": {
    "evidenceLine": 0,
    "hintAr": "ما أول شيء وضعته ليلى داخل التراب؟",
    "hintEn": "What did Layla first place in the soil?",
    "explanationAr": "بدأت ليلى بزراعة بذرة صغيرة في حديقة المدرسة.",
    "explanationEn": "Layla began by planting a tiny seed in the school garden."
  },
  "little-tree-2": {
    "evidenceLine": 2,
    "hintAr": "ماذا أحضرت ليلى في الكوب؟",
    "hintEn": "What did Layla bring in the cup?",
    "explanationAr": "سقت ليلى البذرة بالماء لتعتني بها بعد زراعتها.",
    "explanationEn": "Layla gave the seed water to care for it after planting."
  },
  "little-tree-3": {
    "evidenceLine": 4,
    "hintAr": "لاحظ ما الذي ظهر فوق سطح التراب بعد عدة أيام.",
    "hintEn": "Notice what appeared above the soil after several days.",
    "explanationAr": "ظهور الورقة الخضراء الصغيرة كان علامة على بدء نمو البذرة.",
    "explanationEn": "The small green leaf showed that the seed had started to grow."
  },
  "little-tree-4": {
    "evidenceLine": 6,
    "hintAr": "ما الذي تحتاجه النبتة خلال الأيام والأسابيع؟",
    "hintEn": "What does a plant need over days and weeks?",
    "explanationAr": "واصلت ليلى السقي والعناية لأن النمو يحتاج وقتًا ورعاية.",
    "explanationEn": "Layla kept watering and caring for the plant because growing takes time and care."
  },
  "little-tree-5": {
    "evidenceLine": 9,
    "hintAr": "فكّر في نتيجة العناية بالشجرة مع مرور الوقت.",
    "hintEn": "Think about what happened after the tree received care over time.",
    "explanationAr": "الصبر والرعاية ساعدا الشجرة على النمو، حتى استطاع طائر أن يستريح على غصنها.",
    "explanationEn": "Patience and care helped the tree grow until a bird could rest on a branch."
  },
  "school-morning-1": {
    "evidenceLine": 2,
    "hintAr": "تذكّر أحد الأشياء التي راجعها سالم قبل الذهاب للمدرسة.",
    "hintEn": "Remember an item Salem packed before school.",
    "explanationAr": "وضع سالم كتاب القراءة في الحقيبة مع دفتره وقلمه.",
    "explanationEn": "Salem packed his reading book along with his notebook and pencil."
  },
  "school-morning-2": {
    "evidenceLine": 3,
    "hintAr": "فكّر فيما فعله سالم ليبدأ يومه مستعدًا.",
    "hintEn": "Think about what Salem did to get ready for his day.",
    "explanationAr": "تناول سالم فطوره وشرب الماء قبل أن يذهب للمدرسة.",
    "explanationEn": "Salem ate breakfast and drank water before going to school."
  },
  "school-morning-3": {
    "evidenceLine": 5,
    "hintAr": "لاحظ كيف جهّز سالم مكانه عندما دخل الفصل.",
    "hintEn": "Notice how Salem prepared his space when he entered class.",
    "explanationAr": "ترتيب الأدوات على الطاولة أظهر استعداد سالم للبدء والتعلّم.",
    "explanationEn": "Putting his supplies neatly on the desk showed that Salem was ready to learn."
  },
  "school-morning-4": {
    "evidenceLine": 7,
    "hintAr": "ماذا يفعل الطالب عندما يحتاج مساعدة المعلم؟",
    "hintEn": "What can a student do when they need the teacher's help?",
    "explanationAr": "رفع سالم يده وطلب المساعدة بهدوء بدل أن يتوقف دون سؤال.",
    "explanationEn": "Salem raised his hand and asked for help calmly instead of giving up."
  },
  "school-morning-5": {
    "evidenceLine": 9,
    "hintAr": "تأمل كيف ساعد التنظيم سالم على إنهاء يومه.",
    "hintEn": "Think about how being organized helped Salem finish his day.",
    "explanationAr": "شعر سالم بالفخر لأنه أنجز أعماله بترتيب وهدوء.",
    "explanationEn": "Salem felt proud because he completed his work calmly and stayed organized."
  },
  "friendly-ball-1": {
    "evidenceLine": 0,
    "hintAr": "ما الشيء الذي حمله راشد إلى الساحة؟",
    "hintEn": "What did Rashid carry into the playground?",
    "explanationAr": "جاء راشد إلى ساحة المدرسة حاملًا كرة ملونة.",
    "explanationEn": "Rashid arrived at the playground with a colorful ball."
  },
  "friendly-ball-2": {
    "evidenceLine": 1,
    "hintAr": "من كان واقفًا وحده قرب الملعب؟",
    "hintEn": "Who was standing alone near the field?",
    "explanationAr": "لاحظ راشد طالبًا جديدًا يقف بمفرده، فاقترب منه.",
    "explanationEn": "Rashid noticed a new student standing alone and went over to him."
  },
  "friendly-ball-3": {
    "evidenceLine": 2,
    "hintAr": "تذكّر الكلمات الودودة التي قالها راشد للطالب الجديد.",
    "hintEn": "Recall the friendly words Rashid said to the new student.",
    "explanationAr": "ابتسم الطالب لأن راشد دعاه للمشاركة في اللعب، فشعر بالترحيب.",
    "explanationEn": "The new student smiled because Rashid invited him to play and feel welcome."
  },
  "friendly-ball-4": {
    "evidenceLine": 4,
    "hintAr": "كيف نجعل اللعب منصفًا لجميع الأطفال؟",
    "hintEn": "How can children make a game fair for everyone?",
    "explanationAr": "التناوب في اللعب أعطى كل طفل فرصة للمشاركة بدل استبعاد أحد.",
    "explanationEn": "Taking turns gave each child a chance to join instead of leaving someone out."
  },
  "friendly-ball-5": {
    "evidenceLine": 9,
    "hintAr": "كيف شعر الطالب عندما دعاه راشد إلى اللعب؟",
    "hintEn": "How did the new student feel after Rashid invited him to play?",
    "explanationAr": "دعوة راشد اللطيفة ساعدت الطالب الجديد على الشعور بأنه مرحّب به.",
    "explanationEn": "Rashid's kind invitation helped the new student feel welcome."
  },
  "rainy-day-1": {
    "evidenceLine": 0,
    "hintAr": "ما الذي أضاء غرفة صقر في الصباح؟",
    "hintEn": "What made Saqr's room bright in the morning?",
    "explanationAr": "رأى صقر ضوء الشمس يدخل من نافذته عندما استيقظ.",
    "explanationEn": "Saqr saw sunlight coming through his window when he woke up."
  },
  "rainy-day-2": {
    "evidenceLine": 2,
    "hintAr": "أين ذهب صقر ليجد كتابًا يشرح سؤاله؟",
    "hintEn": "Where did Saqr go to find a book that explained his question?",
    "explanationAr": "اتجه صقر إلى مكتبة المدرسة ليبحث عن الإجابة.",
    "explanationEn": "Saqr went to the school library to look for an answer."
  },
  "rainy-day-3": {
    "evidenceLine": 4,
    "hintAr": "فكّر فيما يحدث عندما تدور الأرض حول محورها.",
    "hintEn": "Think about what happens as Earth turns on its axis.",
    "explanationAr": "دوران الأرض حول نفسها يسبب تعاقب الليل والنهار.",
    "explanationEn": "Earth's rotation on its axis causes day and night."
  },
  "rainy-day-4": {
    "evidenceLine": 6,
    "hintAr": "كيف يمكن للرسم أن يساعدنا في شرح فكرة علمية؟",
    "hintEn": "How might a drawing help explain a science idea?",
    "explanationAr": "استخدم صقر رسم الشمس والأرض ثم شرح الصورة، فقرّب الفكرة لأصدقائه.",
    "explanationEn": "Saqr drew the Sun and Earth and explained the picture to help his friends understand."
  },
  "rainy-day-5": {
    "evidenceLine": 9,
    "hintAr": "لماذا نطرح أسئلة جديدة بعد أن نتعلم شيئًا؟",
    "hintEn": "Why might learning something lead us to ask more questions?",
    "explanationAr": "فضول صقر وأصدقائه شجّعهم على مواصلة البحث وتعلّم أشياء جديدة.",
    "explanationEn": "Saqr and his friends were curious, so they wanted to keep exploring and learning."
  },
  "my-small-project-1": {
    "evidenceLine": 1,
    "hintAr": "في أي جزء من المكتبة رأى صقر صورة القارب الخشبي؟",
    "hintEn": "Which part of the library had the picture of a wooden boat?",
    "explanationAr": "رأى صقر صورة السفينة في جناح التراث بمكتبة المدرسة.",
    "explanationEn": "Saqr saw the wooden boat picture in the library's heritage corner."
  },
  "my-small-project-2": {
    "evidenceLine": 3,
    "hintAr": "ما العمل الذي كان يقوم به أهل البحر في الماضي؟",
    "hintEn": "What jobs did people do at sea in the past?",
    "explanationAr": "كان بعض أهل الإمارات يبحرون للصيد والبحث عن اللؤلؤ.",
    "explanationEn": "Some people in the UAE sailed to fish and search for pearls."
  },
  "my-small-project-3": {
    "evidenceLine": 5,
    "hintAr": "تذكّر كيف تعامل الغواصون مع العمل الصعب معًا.",
    "hintEn": "Remember how the divers approached difficult work together.",
    "explanationAr": "أظهرت حكايات الغواصين الشجاعة والتعاون ومساعدة بعضهم بعضًا.",
    "explanationEn": "The divers showed courage and teamwork by helping one another."
  },
  "my-small-project-4": {
    "evidenceLine": 7,
    "hintAr": "تأمل الكلمات الثلاث التي كتبها صقر تحت رسمته.",
    "hintEn": "Think about the three words Saqr wrote under his drawing.",
    "explanationAr": "كتب صقر شجاعة وتعاونًا وعزيمة لأنها قيم تعلّمها من تراث الغوص.",
    "explanationEn": "Saqr wrote courage, teamwork, and determination because these were values he learned from pearl diving."
  },
  "my-small-project-5": {
    "evidenceLine": 9,
    "hintAr": "ماذا نتعلم عن وطننا عندما نقرأ قصص أهل البحر؟",
    "hintEn": "What can stories about people at sea teach us about our country?",
    "explanationAr": "قراءة التراث تعرّفنا بحياة أهل الإمارات وعملهم وقيمهم في الماضي.",
    "explanationEn": "Reading about heritage helps us understand UAE people's past lives, work, and values."
  }
};
