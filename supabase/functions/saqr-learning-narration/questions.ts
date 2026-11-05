// Approved, fictional classroom questions only. No pupil details or diagnoses.
// The same bank is used for visual activities and server-side narration.
export type LearningPicture = 'book' | 'sun' | 'tree' | 'apple' | 'house' | 'desk' | 'ball' | 'pencil';
export type StoryQuizOption = { ar: string; en: string; picture?: LearningPicture };
export type StoryQuizQuestion = {
  id: string; storyId: string; afterLine: number; level: 1|2|3;
  promptAr: string; promptEn: string; options: StoryQuizOption[]; correctIndex: number;
};
export const learningQuestions: StoryQuizQuestion[] = [
  {
    "id": "saqr-library-1",
    "storyId": "saqr-library",
    "afterLine": 1,
    "level": 1,
    "promptAr": "أين دخل صقر في الصباح؟",
    "promptEn": "Where did Saqr go in the morning?",
    "options": [
      {
        "ar": "المكتبة",
        "en": "The library",
        "picture": "book"
      },
      {
        "ar": "الملعب",
        "en": "The playground",
        "picture": "ball"
      },
      {
        "ar": "الحديقة",
        "en": "The garden",
        "picture": "tree"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "saqr-library-2",
    "storyId": "saqr-library",
    "afterLine": 3,
    "level": 1,
    "promptAr": "أي قصة طلب صقر؟",
    "promptEn": "What kind of story did Saqr ask for?",
    "options": [
      {
        "ar": "الصداقة والمساعدة",
        "en": "Friendship and helping"
      },
      {
        "ar": "السيارات السريعة",
        "en": "Fast cars"
      },
      {
        "ar": "رحلة البحر",
        "en": "A sea trip"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "saqr-library-3",
    "storyId": "saqr-library",
    "afterLine": 5,
    "level": 2,
    "promptAr": "لماذا كان صقر يقرأ الكتاب بهدوء؟",
    "promptEn": "Why did Saqr read the book slowly?",
    "options": [
      {
        "ar": "ليفهم الجمل جيدًا",
        "en": "To understand every sentence"
      },
      {
        "ar": "لينهي الكتاب بسرعة",
        "en": "To finish as fast as possible"
      },
      {
        "ar": "ليمنع الآخرين من القراءة",
        "en": "To stop others from reading"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "saqr-library-4",
    "storyId": "saqr-library",
    "afterLine": 7,
    "level": 2,
    "promptAr": "لماذا كان موقف الطفل في القصة جميلًا؟",
    "promptEn": "Why was the child's action in the story kind?",
    "options": [
      {
        "ar": "لأنه ساعد صديقه في العثور على الحقيبة",
        "en": "He helped a friend find a lost bag"
      },
      {
        "ar": "لأنه أخفى حقيبة صديقه",
        "en": "He hid a friend's bag"
      },
      {
        "ar": "لأنه رفض مساعدة صديقه",
        "en": "He refused to help a friend"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "saqr-library-5",
    "storyId": "saqr-library",
    "afterLine": 9,
    "level": 3,
    "promptAr": "ماذا نتعلم من قصة صقر؟",
    "promptEn": "What can we learn from Saqr's story?",
    "options": [
      {
        "ar": "نساعد الآخرين",
        "en": "We help others"
      },
      {
        "ar": "نؤذي الكتب",
        "en": "We damage books"
      },
      {
        "ar": "نترك الأشياء مبعثرة",
        "en": "We leave things messy"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "little-tree-1",
    "storyId": "little-tree",
    "afterLine": 1,
    "level": 1,
    "promptAr": "ماذا زرعت ليلى في الحديقة؟",
    "promptEn": "What did Layla plant in the garden?",
    "options": [
      {
        "ar": "بذرة صغيرة",
        "en": "A tiny seed",
        "picture": "tree"
      },
      {
        "ar": "كرة ملونة",
        "en": "A colorful ball",
        "picture": "ball"
      },
      {
        "ar": "كتابًا",
        "en": "A book",
        "picture": "book"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "little-tree-2",
    "storyId": "little-tree",
    "afterLine": 3,
    "level": 1,
    "promptAr": "ماذا أعطت ليلى البذرة؟",
    "promptEn": "What did Layla give the seed?",
    "options": [
      {
        "ar": "الماء",
        "en": "Water"
      },
      {
        "ar": "العصير",
        "en": "Juice"
      },
      {
        "ar": "الطلاء",
        "en": "Paint"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "little-tree-3",
    "storyId": "little-tree",
    "afterLine": 5,
    "level": 2,
    "promptAr": "كيف عرفت ليلى أن البذرة بدأت تنمو؟",
    "promptEn": "How did Layla know the seed was beginning to grow?",
    "options": [
      {
        "ar": "ظهرت ورقة خضراء صغيرة",
        "en": "A small green leaf appeared"
      },
      {
        "ar": "اختفت الحديقة",
        "en": "The garden disappeared"
      },
      {
        "ar": "تحولت البذرة إلى كرة",
        "en": "The seed turned into a ball"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "little-tree-4",
    "storyId": "little-tree",
    "afterLine": 7,
    "level": 2,
    "promptAr": "لماذا استمرت ليلى في العناية بالنبتة؟",
    "promptEn": "Why did Layla keep caring for the plant?",
    "options": [
      {
        "ar": "لتساعدها على النمو",
        "en": "To help it grow"
      },
      {
        "ar": "لتنقلها إلى البيت",
        "en": "To move it inside"
      },
      {
        "ar": "لتجعلها تختفي",
        "en": "To make it disappear"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "little-tree-5",
    "storyId": "little-tree",
    "afterLine": 9,
    "level": 3,
    "promptAr": "لماذا كان صبر ليلى وعنايتها بالشجرة مهمين؟",
    "promptEn": "Why were Layla's patience and care important?",
    "options": [
      {
        "ar": "لأنهما ساعدا الشجرة على النمو وأصبحت مأوى لطائر",
        "en": "They helped the tree grow and shelter a bird"
      },
      {
        "ar": "لأن الشجرة تنمو دون ماء أو رعاية",
        "en": "Because trees need no water or care"
      },
      {
        "ar": "لأن الطائر زرع الشجرة بدلًا منها",
        "en": "Because the bird planted the tree for her"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "school-morning-1",
    "storyId": "school-morning",
    "afterLine": 1,
    "level": 1,
    "promptAr": "ماذا وضع سالم في حقيبته؟",
    "promptEn": "What did Salem put in his bag?",
    "options": [
      {
        "ar": "كتاب القراءة",
        "en": "A reading book",
        "picture": "book"
      },
      {
        "ar": "كرة القدم",
        "en": "A football",
        "picture": "ball"
      },
      {
        "ar": "تفاحة فوق الحقيبة",
        "en": "An apple on the bag",
        "picture": "apple"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "school-morning-2",
    "storyId": "school-morning",
    "afterLine": 3,
    "level": 1,
    "promptAr": "ماذا تناول سالم قبل المدرسة؟",
    "promptEn": "What did Salem have before school?",
    "options": [
      {
        "ar": "الفطور والماء",
        "en": "Breakfast and water"
      },
      {
        "ar": "الحلوى فقط",
        "en": "Only sweets"
      },
      {
        "ar": "لم يأكل شيئًا",
        "en": "Nothing"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "school-morning-3",
    "storyId": "school-morning",
    "afterLine": 5,
    "level": 2,
    "promptAr": "أي تصرف أظهر أن سالم مستعد للتعلم؟",
    "promptEn": "Which action showed Salem was ready to learn?",
    "options": [
      {
        "ar": "رتب أدواته على الطاولة",
        "en": "He organized his school supplies"
      },
      {
        "ar": "ترك أدواته في الممر",
        "en": "He left his supplies in the hallway"
      },
      {
        "ar": "بدأ الركض في الفصل",
        "en": "He ran around the classroom"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "school-morning-4",
    "storyId": "school-morning",
    "afterLine": 7,
    "level": 2,
    "promptAr": "لماذا رفع سالم يده أثناء المهمة؟",
    "promptEn": "Why did Salem raise his hand during the task?",
    "options": [
      {
        "ar": "ليطلب مساعدة المعلمة بهدوء",
        "en": "To ask his teacher for help calmly"
      },
      {
        "ar": "ليتجنب إكمال المهمة",
        "en": "To avoid finishing his task"
      },
      {
        "ar": "ليشتت زملاءه",
        "en": "To distract his classmates"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "school-morning-5",
    "storyId": "school-morning",
    "afterLine": 9,
    "level": 3,
    "promptAr": "لماذا شعر سالم بالفخر والسعادة في نهاية اليوم؟",
    "promptEn": "Why did Salem feel proud and happy at the end of the day?",
    "options": [
      {
        "ar": "لأنه نظم وقته وأكمل مهامه بهدوء",
        "en": "He managed his time and completed tasks calmly"
      },
      {
        "ar": "لأنه ترك أعماله دون إكمال",
        "en": "He left his work unfinished"
      },
      {
        "ar": "لأنه نسي أدواته المدرسية",
        "en": "He forgot his school supplies"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "friendly-ball-1",
    "storyId": "friendly-ball",
    "afterLine": 1,
    "level": 1,
    "promptAr": "ماذا أحضر راشد إلى الملعب؟",
    "promptEn": "What did Rashid bring to the playground?",
    "options": [
      {
        "ar": "كرة ملونة",
        "en": "A colorful ball",
        "picture": "ball"
      },
      {
        "ar": "قلمًا",
        "en": "A pencil",
        "picture": "pencil"
      },
      {
        "ar": "كتابًا",
        "en": "A book",
        "picture": "book"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "friendly-ball-2",
    "storyId": "friendly-ball",
    "afterLine": 3,
    "level": 1,
    "promptAr": "مَن رأى راشد قرب الملعب؟",
    "promptEn": "Who did Rashid notice near the field?",
    "options": [
      {
        "ar": "طالبًا جديدًا",
        "en": "A new student"
      },
      {
        "ar": "قطة",
        "en": "A cat"
      },
      {
        "ar": "معلمًا يحمل حقيبة",
        "en": "A teacher with a bag"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "friendly-ball-3",
    "storyId": "friendly-ball",
    "afterLine": 5,
    "level": 2,
    "promptAr": "لماذا ابتسم الطالب الجديد عندما اقترب منه راشد؟",
    "promptEn": "Why did the new student smile when Rashid approached?",
    "options": [
      {
        "ar": "لأن راشد دعاه للعب مع المجموعة",
        "en": "Rashid invited him to join the game"
      },
      {
        "ar": "لأن راشد طلب منه المغادرة",
        "en": "Rashid asked him to leave"
      },
      {
        "ar": "لأن اللعب انتهى فورًا",
        "en": "Playtime ended immediately"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "friendly-ball-4",
    "storyId": "friendly-ball",
    "afterLine": 7,
    "level": 2,
    "promptAr": "لماذا اتفق الأصدقاء على اللعب بالتناوب؟",
    "promptEn": "Why did the friends agree to take turns?",
    "options": [
      {
        "ar": "حتى يحصل كل طفل على فرصة للمشاركة",
        "en": "So every child could take part"
      },
      {
        "ar": "حتى يحتفظ راشد بالكرة دائمًا",
        "en": "So Rashid could keep the ball"
      },
      {
        "ar": "حتى لا يلعب الطالب الجديد",
        "en": "So the new student would not play"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "friendly-ball-5",
    "storyId": "friendly-ball",
    "afterLine": 9,
    "level": 3,
    "promptAr": "ماذا تعلم راشد؟",
    "promptEn": "What did Rashid learn?",
    "options": [
      {
        "ar": "الدعوة الطيبة تجعل الآخرين مرحبًا بهم",
        "en": "A kind invitation makes others welcome"
      },
      {
        "ar": "منع الآخرين من اللعب",
        "en": "Keep others out of games"
      },
      {
        "ar": "نسيان الأصدقاء",
        "en": "Forget friends"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "rainy-day-1",
    "storyId": "rainy-day",
    "afterLine": 1,
    "level": 1,
    "promptAr": "ماذا رأى صقر يدخل من نافذته؟",
    "promptEn": "What did Saqr see coming through his window?",
    "options": [
      {
        "ar": "أشعة الشمس",
        "en": "Sunlight"
      },
      {
        "ar": "قطرات المطر",
        "en": "Raindrops"
      },
      {
        "ar": "أوراق الشجر",
        "en": "Tree leaves"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "rainy-day-2",
    "storyId": "rainy-day",
    "afterLine": 3,
    "level": 1,
    "promptAr": "أين بحث صقر عن إجابة لسؤاله؟",
    "promptEn": "Where did Saqr search for an answer?",
    "options": [
      {
        "ar": "مكتبة المدرسة",
        "en": "The school library"
      },
      {
        "ar": "الملعب",
        "en": "The playground"
      },
      {
        "ar": "غرفة الرياضة",
        "en": "The gym"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "rainy-day-3",
    "storyId": "rainy-day",
    "afterLine": 5,
    "level": 2,
    "promptAr": "ماذا يسبب دوران الأرض حول نفسها؟",
    "promptEn": "What does Earth's rotation cause?",
    "options": [
      {
        "ar": "تعاقب الليل والنهار",
        "en": "Day and night"
      },
      {
        "ar": "توقف الشمس",
        "en": "The Sun to stop"
      },
      {
        "ar": "اختفاء الكواكب",
        "en": "Planets to disappear"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "rainy-day-4",
    "storyId": "rainy-day",
    "afterLine": 7,
    "level": 2,
    "promptAr": "كيف ساعد رسم صقر أصدقاءه على التعلم؟",
    "promptEn": "How did Saqr's drawing help his friends learn?",
    "options": [
      {
        "ar": "وضّح فكرة الشمس والأرض وشرحها لهم",
        "en": "It showed the Sun and Earth and he explained the idea"
      },
      {
        "ar": "أخفى الكتاب عن أصدقائه",
        "en": "He hid the book from his friends"
      },
      {
        "ar": "منعهم من طرح الأسئلة",
        "en": "It stopped them from asking questions"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "rainy-day-5",
    "storyId": "rainy-day",
    "afterLine": 9,
    "level": 3,
    "promptAr": "لماذا كان صقر وأصدقاؤه متحمسين للبحث عن أسرار أخرى في الكون؟",
    "promptEn": "Why were Saqr and his friends excited to explore more of the universe?",
    "options": [
      {
        "ar": "لأن فضولهم شجعهم على طرح أسئلة جديدة والتعلم",
        "en": "Their curiosity inspired more questions and learning"
      },
      {
        "ar": "لأنهم قرروا التوقف عن القراءة",
        "en": "They decided to stop reading"
      },
      {
        "ar": "لأنهم ظنوا أنه لا توجد أشياء جديدة ليتعلموها",
        "en": "They thought nothing new could be learned"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "my-small-project-1",
    "storyId": "my-small-project",
    "afterLine": 1,
    "level": 1,
    "promptAr": "أين شاهد صقر صورة السفينة الخشبية؟",
    "promptEn": "Where did Saqr see the picture of a wooden boat?",
    "options": [
      {
        "ar": "في جناح التراث بالمكتبة",
        "en": "In the library heritage corner"
      },
      {
        "ar": "في الملعب",
        "en": "On the playground"
      },
      {
        "ar": "في حافلة المدرسة",
        "en": "On the school bus"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "my-small-project-2",
    "storyId": "my-small-project",
    "afterLine": 3,
    "level": 1,
    "promptAr": "لماذا كان بعض أهل الإمارات يذهبون إلى البحر؟",
    "promptEn": "Why did some people in the UAE go to sea?",
    "options": [
      {
        "ar": "للصيد والبحث عن اللؤلؤ",
        "en": "To fish and search for pearls"
      },
      {
        "ar": "لجمع الكتب",
        "en": "To collect books"
      },
      {
        "ar": "للعب بالكرة",
        "en": "To play football"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "my-small-project-3",
    "storyId": "my-small-project",
    "afterLine": 5,
    "level": 2,
    "promptAr": "ما القيم التي تعلمها صقر عن الغواصين؟",
    "promptEn": "What did Saqr learn about the divers?",
    "options": [
      {
        "ar": "الشجاعة والتعاون",
        "en": "Courage and teamwork"
      },
      {
        "ar": "الكسل والخوف",
        "en": "Laziness and fear"
      },
      {
        "ar": "نسيان الأصدقاء",
        "en": "Forgetting friends"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "my-small-project-4",
    "storyId": "my-small-project",
    "afterLine": 7,
    "level": 2,
    "promptAr": "ماذا أراد صقر أن يوضح بالكلمات المكتوبة تحت رسم السفينة؟",
    "promptEn": "What did Saqr want to show with the words under his boat drawing?",
    "options": [
      {
        "ar": "قيم الغواصين مثل الشجاعة والتعاون والعزيمة",
        "en": "The divers' values: courage, teamwork, determination"
      },
      {
        "ar": "أسماء زملائه في الفصل",
        "en": "The names of his classmates"
      },
      {
        "ar": "ألوان الأمواج في البحر",
        "en": "The colors of the sea waves"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "my-small-project-5",
    "storyId": "my-small-project",
    "afterLine": 9,
    "level": 3,
    "promptAr": "لماذا تساعدنا قراءة قصص الغوص واللؤلؤ على فهم وطننا؟",
    "promptEn": "Why can reading stories of pearl diving help us understand our country?",
    "options": [
      {
        "ar": "لأنها تعرفنا بعمل أهل الإمارات وقيمهم في الماضي",
        "en": "They teach us about UAE history, work, and values"
      },
      {
        "ar": "لأنها تجعلنا ننسى تاريخنا",
        "en": "They help us forget our history"
      },
      {
        "ar": "لأنها تؤكد أن التعاون غير مهم",
        "en": "They show teamwork was unimportant"
      }
    ],
    "correctIndex": 0
  }
];
