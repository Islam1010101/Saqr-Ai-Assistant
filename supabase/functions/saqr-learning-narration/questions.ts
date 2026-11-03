// Approved, fictional classroom questions only. No pupil details or diagnoses.
// The same bank is used for visual activities and server-side narration.
import type { LearningPicture } from "../../../src/components/saqrLearning/LearningPictureArt";
export type StoryQuizOption = { ar: string; en: string; picture?: LearningPicture };
export type StoryQuizQuestion = {
  id: string; storyId: string; afterLine: number; level: 1|2;
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
    "correctIndex": 1
  },
  {
    "id": "saqr-library-3",
    "storyId": "saqr-library",
    "afterLine": 5,
    "level": 2,
    "promptAr": "أين جلس صقر ليقرأ؟",
    "promptEn": "Where did Saqr sit to read?",
    "options": [
      {
        "ar": "قرب النافذة",
        "en": "Near the window"
      },
      {
        "ar": "وسط الملعب",
        "en": "In the playground"
      },
      {
        "ar": "تحت المطر",
        "en": "In the rain"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "saqr-library-4",
    "storyId": "saqr-library",
    "afterLine": 7,
    "level": 1,
    "promptAr": "ماذا فعل الطفل في القصة؟",
    "promptEn": "What did the child in the story do?",
    "options": [
      {
        "ar": "ساعد صديقه",
        "en": "Helped a friend"
      },
      {
        "ar": "أخفى الحقيبة",
        "en": "Hid the bag"
      },
      {
        "ar": "ترك صديقه وحده",
        "en": "Left a friend alone"
      }
    ],
    "correctIndex": 1
  },
  {
    "id": "saqr-library-5",
    "storyId": "saqr-library",
    "afterLine": 9,
    "level": 2,
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
    "promptAr": "ماذا ظهر فوق التراب؟",
    "promptEn": "What appeared above the soil?",
    "options": [
      {
        "ar": "ورقة خضراء",
        "en": "A green leaf",
        "picture": "tree"
      },
      {
        "ar": "قلم",
        "en": "A pencil",
        "picture": "pencil"
      },
      {
        "ar": "كرة",
        "en": "A ball",
        "picture": "ball"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "little-tree-4",
    "storyId": "little-tree",
    "afterLine": 7,
    "level": 1,
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
    "level": 2,
    "promptAr": "ماذا حدث عندما كبرت الشجرة؟",
    "promptEn": "What happened when the tree grew?",
    "options": [
      {
        "ar": "وقف طائر على غصن",
        "en": "A bird rested on a branch"
      },
      {
        "ar": "أصبحت كرة",
        "en": "It became a ball"
      },
      {
        "ar": "تحولت إلى كتاب",
        "en": "It became a book"
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
    "promptAr": "ماذا فعل عندما وصل إلى الفصل؟",
    "promptEn": "What did Salem do when he arrived in class?",
    "options": [
      {
        "ar": "رتّب أدواته",
        "en": "Organized his supplies"
      },
      {
        "ar": "ركض بين المقاعد",
        "en": "Ran between desks"
      },
      {
        "ar": "أخفى كتابه",
        "en": "Hid his book"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "school-morning-4",
    "storyId": "school-morning",
    "afterLine": 7,
    "level": 1,
    "promptAr": "كيف طلب سالم المساعدة؟",
    "promptEn": "How did Salem ask for help?",
    "options": [
      {
        "ar": "رفع يده وسأل المعلمة",
        "en": "Raised his hand and asked"
      },
      {
        "ar": "صرخ على أصدقائه",
        "en": "Shouted at friends"
      },
      {
        "ar": "ترك المهمة",
        "en": "Abandoned the task"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "school-morning-5",
    "storyId": "school-morning",
    "afterLine": 9,
    "level": 2,
    "promptAr": "بماذا شعر سالم في النهاية؟",
    "promptEn": "How did Salem feel at the end?",
    "options": [
      {
        "ar": "بالفخر والسعادة",
        "en": "Proud and happy"
      },
      {
        "ar": "بالغضب",
        "en": "Angry"
      },
      {
        "ar": "بالخوف",
        "en": "Afraid"
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
    "promptAr": "ماذا قال راشد للطالب الجديد؟",
    "promptEn": "What did Rashid say to the new student?",
    "options": [
      {
        "ar": "هل تحب اللعب معنا؟",
        "en": "Would you like to play?"
      },
      {
        "ar": "ابتعد من هنا",
        "en": "Go away"
      },
      {
        "ar": "لا يوجد مكان لك",
        "en": "There is no room for you"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "friendly-ball-4",
    "storyId": "friendly-ball",
    "afterLine": 7,
    "level": 1,
    "promptAr": "كيف شارك الجميع في اللعب؟",
    "promptEn": "How did everyone get a turn?",
    "options": [
      {
        "ar": "لعبوا بالتناوب",
        "en": "They took turns"
      },
      {
        "ar": "لعب راشد وحده",
        "en": "Only Rashid played"
      },
      {
        "ar": "تركوا الكرة",
        "en": "They left the ball"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "friendly-ball-5",
    "storyId": "friendly-ball",
    "afterLine": 9,
    "level": 2,
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
    "promptAr": "ماذا سمعت مريم عند الاستيقاظ؟",
    "promptEn": "What did Maryam hear when she woke up?",
    "options": [
      {
        "ar": "صوت المطر",
        "en": "The rain"
      },
      {
        "ar": "صوت كرة",
        "en": "A ball"
      },
      {
        "ar": "صوت قلم",
        "en": "A pencil"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "rainy-day-2",
    "storyId": "rainy-day",
    "afterLine": 3,
    "level": 1,
    "promptAr": "ماذا أخذت مريم عندما خرجت؟",
    "promptEn": "What did Maryam take outside?",
    "options": [
      {
        "ar": "مظلة",
        "en": "An umbrella"
      },
      {
        "ar": "كتابًا مفتوحًا",
        "en": "An open book"
      },
      {
        "ar": "لعبة كبيرة",
        "en": "A big toy"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "rainy-day-3",
    "storyId": "rainy-day",
    "afterLine": 5,
    "level": 2,
    "promptAr": "أين رأت مريم العصفور؟",
    "promptEn": "Where did Maryam see the bird?",
    "options": [
      {
        "ar": "بين أغصان شجرة",
        "en": "In a tree",
        "picture": "tree"
      },
      {
        "ar": "في كتاب",
        "en": "In a book",
        "picture": "book"
      },
      {
        "ar": "على كرة",
        "en": "On a ball",
        "picture": "ball"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "rainy-day-4",
    "storyId": "rainy-day",
    "afterLine": 7,
    "level": 1,
    "promptAr": "ماذا فعلت مريم بعد العودة للبيت؟",
    "promptEn": "What did Maryam do after returning home?",
    "options": [
      {
        "ar": "قرأت كتابًا عن الفصول",
        "en": "Read about the seasons"
      },
      {
        "ar": "رمت المظلة",
        "en": "Threw away the umbrella"
      },
      {
        "ar": "ركضت في المطر",
        "en": "Ran outside again"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "rainy-day-5",
    "storyId": "rainy-day",
    "afterLine": 9,
    "level": 2,
    "promptAr": "كيف يساعد المطر الطبيعة؟",
    "promptEn": "How does rain help nature?",
    "options": [
      {
        "ar": "يساعد النباتات على النمو",
        "en": "It helps plants grow"
      },
      {
        "ar": "يجفف الأشجار",
        "en": "It dries trees"
      },
      {
        "ar": "يوقف نمو الأزهار",
        "en": "It stops flowers growing"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "my-small-project-1",
    "storyId": "my-small-project",
    "afterLine": 1,
    "level": 1,
    "promptAr": "ماذا طلبت المعلمة؟",
    "promptEn": "What did the teacher ask students to make?",
    "options": [
      {
        "ar": "بطاقة عن كتاب مفضل",
        "en": "A favorite book card",
        "picture": "book"
      },
      {
        "ar": "كرة",
        "en": "A ball",
        "picture": "ball"
      },
      {
        "ar": "منزلًا",
        "en": "A house",
        "picture": "house"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "my-small-project-2",
    "storyId": "my-small-project",
    "afterLine": 3,
    "level": 1,
    "promptAr": "ما الأدوات التي حضرتها دانة؟",
    "promptEn": "What supplies did Dana prepare?",
    "options": [
      {
        "ar": "ورقة وأقلامًا ملونة",
        "en": "Paper and colored pencils"
      },
      {
        "ar": "حذاء رياضيًا",
        "en": "Sports shoes"
      },
      {
        "ar": "مظلة",
        "en": "An umbrella"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "my-small-project-3",
    "storyId": "my-small-project",
    "afterLine": 5,
    "level": 2,
    "promptAr": "ماذا رسمت دانة على بطاقتها؟",
    "promptEn": "What did Dana draw on her card?",
    "options": [
      {
        "ar": "شجرة وكتابًا",
        "en": "A tree and a book",
        "picture": "tree"
      },
      {
        "ar": "كرة كبيرة",
        "en": "A big ball",
        "picture": "ball"
      },
      {
        "ar": "منزلًا فقط",
        "en": "Only a house",
        "picture": "house"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "my-small-project-4",
    "storyId": "my-small-project",
    "afterLine": 7,
    "level": 1,
    "promptAr": "ماذا فعلت دانة عندما لاحظت خطأ؟",
    "promptEn": "What did Dana do after finding a mistake?",
    "options": [
      {
        "ar": "صححت الحرف",
        "en": "Corrected the letter"
      },
      {
        "ar": "مزقت البطاقة",
        "en": "Tore up the card"
      },
      {
        "ar": "تركت الكتاب",
        "en": "Put the book away"
      }
    ],
    "correctIndex": 0
  },
  {
    "id": "my-small-project-5",
    "storyId": "my-small-project",
    "afterLine": 9,
    "level": 2,
    "promptAr": "بماذا شعرت دانة بعد عرض مشروعها؟",
    "promptEn": "How did Dana feel after presenting her project?",
    "options": [
      {
        "ar": "بالسعادة والفخر",
        "en": "Happy and proud"
      },
      {
        "ar": "بالحزن الشديد",
        "en": "Very sad"
      },
      {
        "ar": "بالغضب",
        "en": "Angry"
      }
    ],
    "correctIndex": 0
  }
];
