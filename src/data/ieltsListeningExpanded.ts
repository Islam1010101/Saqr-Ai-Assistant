/**
 * Saqr IELTS Listening graded practice — original Saqr question sets aligned with
 * the FORMAT of IELTS Listening, not copied IELTS recordings, papers or answer keys.
 * Source: https://learningenglish.voanews.com/p/6861.html (original VOA media public domain)
 * Sample task types: https://ielts.org/take-a-test/preparation-resources/sample-test-questions/academic-test
 *
 * Stages 1–4 are Saqr's instructional progression, not an official IELTS band,
 * score, or a claim that VOA lessons reproduce IELTS test Parts 1–4.
 * Any abbreviated audio passage is explicitly described as a transcript EXCERPT.
 */
import { IELTS_LISTENING_LESSONS, type IeltsListeningLesson } from './ieltsListeningLessons';

export type IeltsListeningStage = 1 | 2 | 3 | 4;
export type IeltsGradedListeningLesson = IeltsListeningLesson & {
  stage: IeltsListeningStage;
  contextAr: string;
  contextEn: string;
};

const originalStages: ReadonlyArray<{
  stage:IeltsListeningStage;
  contextAr:string;
  contextEn:string;
}> = [
  {stage:1, contextAr:'التحية وتهجئة الأسماء', contextEn:'Greetings and spelling names'},
  {stage:1, contextAr:'التعارف والسكن', contextEn:'Introductions and accommodation'},
  {stage:2, contextAr:'مكالمة هاتفية وعنوان', contextEn:'Telephone enquiry and addresses'},
  {stage:4, contextAr:'إشاعات العمل وفهم التفاصيل', contextEn:'Workplace rumours and detailed listening'},
];

export const IELTS_LISTENING_EXTRA: readonly IeltsGradedListeningLesson[] = [
  {
    "id": "voa-home-5",
    "title": "Where Are You?",
    "stage": 1,
    "contextAr": "غرف المنزل والأنشطة",
    "contextEn": "Rooms at home & daily activities",
    "level": "VOA Level 1 · Beginner",
    "sourceUrl": "https://learningenglish.voanews.com/a/lets-learn-english-lesson-5-where-are-you/3168971.html",
    "audioUrl": "https://voa-audio.voanews.eu/vle/2016/03/01/ab9c2944-eddc-4806-9296-290bfa8c6ff2_hq.mp3",
    "durationSeconds": 0,
    "transcriptKind": "complete",
    "transcript": "Anna: Hello, everyone! Today my friend Marsha is at her friend's house. She says it is beautiful. I want to see this house! Here we are!\nAnna: Marsha, I am in the kitchen! It is a beautiful kitchen!\nMarsha: It is beautiful. We cook in the kitchen.\nAnna: I eat in the kitchen.\nMarsha: We relax in the living room.\nAnna: I relax in the living room. Marsha, let’s go upstairs!\nMarsha: Anna? Where are you?\nAnna: Marsha, I am in the bathroom! I wash in the bathroom.\nMarsha: I am in the bedroom. We sleep in the bedroom.\nAnna: I sleep in the bedroom!",
    "questions": [
      {
        "prompt": "Where do Anna and Marsha cook?",
        "options": [
          "In the bedroom",
          "In the kitchen",
          "In the garage"
        ],
        "correctIndex": 1,
        "explanation": "Marsha says they cook in the kitchen."
      },
      {
        "prompt": "Which room is for relaxing?",
        "options": [
          "The living room",
          "The bedroom",
          "The bathroom"
        ],
        "correctIndex": 0,
        "explanation": "Marsha says they relax in the living room."
      },
      {
        "prompt": "Complete the note: Marsha says they sleep in the ______.",
        "options": [],
        "correctIndex": -1,
        "explanation": "Marsha says, 'We sleep in the bedroom.'",
        "kind": "note-completion",
        "answerText": "bedroom",
        "acceptedAnswers": []
      },
      {
        "prompt": "Where is Anna when Marsha asks where she is?",
        "options": [
          "In the bathroom",
          "On the roof",
          "At the bus station"
        ],
        "correctIndex": 0,
        "explanation": "Anna says she is in the bathroom."
      }
    ]
  },
  {
    "id": "voa-gym-6",
    "title": "Where Is the Gym?",
    "stage": 2,
    "contextAr": "الاتجاهات في المباني",
    "contextEn": "Finding rooms & following directions",
    "level": "VOA Level 1 · Developing",
    "sourceUrl": "https://learningenglish.voanews.com/a/lets-learn-english-lesson-6-where-is-the-gym/3225958.html",
    "audioUrl": "https://voa-audio.voanews.eu/vle/2016/03/10/66b63229-1dc5-40ab-886d-1f4b891adf6b_hq.mp3",
    "durationSeconds": 108,
    "transcriptKind": "complete",
    "transcript": "Anna: I live in Washington, D.C. People in Washington like to work out! Oh, hi, Pete. How’s it going?\nPete: Hi, Anna. It’s going great.\nAnna: Pete, I want to work out. Where is the gym?\nPete: The gym is across from the lounge. It’s next to the mailroom. Go that way.\nAnna: Thanks, Pete!\nPete: No, Anna! Not that way! Go that way!\nAnna: Oh, Pete. This is not the gym.\nPete: That’s right, Anna. This is the mailroom.\nAnna: The gym is across from … what?\nPete: The gym is across from the lounge.\nAnna: Across from the lounge. Right. Thanks!\nAnna: Pete! This is not the gym!\nPete: The gym is across from the lounge. It is behind the lobby.\nAnna: This is not the gym. This is a parking garage.\nAnna: This is not a gym. This is a rooftop.\nAnna: Pete! Pete?\nPete: I want to work out too! Join me!\nAnna: I’m good.",
    "questions": [
      {
        "prompt": "Where is the gym compared with the lounge?",
        "options": [
          "Across from the lounge",
          "Inside the mailroom",
          "Above the rooftop"
        ],
        "correctIndex": 0,
        "explanation": "Pete repeatedly says the gym is across from the lounge."
      },
      {
        "prompt": "Building directions: The gym is behind the ______.",
        "options": [],
        "correctIndex": -1,
        "explanation": "Pete says the gym is behind the lobby.",
        "kind": "note-completion",
        "answerText": "lobby",
        "acceptedAnswers": []
      },
      {
        "prompt": "Which place does Anna accidentally reach?",
        "options": [
          "The swimming pool",
          "The mailroom",
          "The library"
        ],
        "correctIndex": 1,
        "explanation": "Anna finds the mailroom instead of the gym."
      },
      {
        "prompt": "What does Pete want Anna to do at the end?",
        "options": [
          "Join his workout",
          "Call the police",
          "Go to the rooftop"
        ],
        "correctIndex": 0,
        "explanation": "Pete invites Anna to work out with him."
      }
    ]
  },
  {
    "id": "voa-workplace-7",
    "title": "What Are You Doing?",
    "stage": 2,
    "contextAr": "بدء العمل وزملاء المكتب",
    "contextEn": "Workplace orientation & colleagues",
    "level": "VOA Level 1 · Developing",
    "sourceUrl": "https://learningenglish.voanews.com/a/lets-learn-english-lesson-7-what-are-you-doing/3240468.html",
    "audioUrl": "https://voa-audio.voanews.eu/vle/2016/03/16/5d724fbc-a907-4a48-9221-c1813d248168_hq.mp3",
    "durationSeconds": 0,
    "transcriptKind": "excerpt",
    "transcript": "Caty: Come in. Well, Anna, welcome.\nAnna: Thank you.\nCaty: I am your boss, Caty Weaver. But, please call me Caty.\nAnna: Thank you, Ms. Weaver.\nCaty: Just Caty. Are you excited?\nAnna: Yes, I am excited!\nCaty: So sorry, but I am busy. Please meet your co-workers. But remember, they are busy working.\nAnna: Hi there! I’m Anna.\nAnne: Hi, Anna. I’m Anne.\nAnna: Nice to meet you. What are you doing?\nAnne: Um, I’m writing.\nAnna: You are writing! You are writing a lot!\nAnne: No! That's okay. Really.\nAnna: I am sorry!",
    "verifiedSummary": "Later Anna interrupts Jonathan while he is recording a show and Amelia while she is reading for her show. At the end Ms. Weaver suggests they talk in her office.",
    "questions": [
      {
        "prompt": "Who is Anna's new boss?",
        "options": [
          "Anne",
          "Caty Weaver",
          "Jonathan"
        ],
        "correctIndex": 1,
        "explanation": "Caty Weaver explicitly introduces herself as Anna's boss."
      },
      {
        "prompt": "What is Anne doing?",
        "options": [
          "Writing",
          "Exercising",
          "Cooking"
        ],
        "correctIndex": 0,
        "explanation": "Anne says she is writing when Anna approaches."
      },
      {
        "prompt": "Complete the work note: Caty asks Anna to meet her ______.",
        "options": [],
        "correctIndex": -1,
        "explanation": "Caty tells Anna to meet her co-workers.",
        "kind": "note-completion",
        "answerText": "co-workers",
        "acceptedAnswers": [
          "coworkers",
          "colleagues"
        ]
      },
      {
        "prompt": "Why does Caty warn Anna before meeting the others?",
        "options": [
          "They are already working",
          "The building is closed",
          "They are on vacation"
        ],
        "correctIndex": 0,
        "explanation": "Caty says her colleagues are busy working."
      }
    ]
  },
  {
    "id": "voa-schedule-8",
    "title": "Are You Busy?",
    "stage": 2,
    "contextAr": "المواعيد والجدول اليومي",
    "contextEn": "Appointments & work schedules",
    "level": "VOA Level 1 · Developing",
    "sourceUrl": "https://learningenglish.voanews.com/a/lets-learn-english-lesson-8-are-you-busy/3253185.html",
    "audioUrl": "https://voa-audio.voanews.eu/vle/2016/03/25/ae6c5055-13ae-485b-995d-b347125ecf10_hq.mp3",
    "durationSeconds": 0,
    "transcriptKind": "complete",
    "transcript": "Anna: Here I am at my new job! Today I want to apologize to my co-workers.\nAnna: Hi, Anne. Are you busy?\nAnne: Yes. At 10 a.m. I am writing. Every day I do my morning show. Sorry!\nAnna: Okay. See you later, maybe.\nAnna: Hi, Jonathan. Are you busy?\nJonathan: Yes, I’m busy. When the studio light is on, I am recording my evening show.\nAnna: Right. Sorry about yesterday.\nJonathan: No worries.\nAnna: May I see the studio?\nJonathan: Um, maybe another time? Right now I am busy.\nAnna: Hi, Amelia! Are you busy?\nAmelia: I’m a little busy.\nAnna: I want to say I’m sorry for yesterday.\nAmelia: It’s okay, Anna. Come by this afternoon.\nCaty: Anna. Are you busy?\nAnna: Yes, Ms. Weaver. I am busy.\nCaty: My office. 5:00 p.m.\nAnna: 5:00 p.m.\nCo-Workers: Surprise!\nAnna: A party! Awesome! And I still have my job!",
    "questions": [
      {
        "prompt": "Office appointment: Ms. Weaver's meeting time is ______.",
        "options": [],
        "correctIndex": -1,
        "explanation": "Caty says, 'My office. 5:00 p.m.'",
        "kind": "note-completion",
        "answerText": "5:00 p.m.",
        "acceptedAnswers": [
          "5pm",
          "5 pm",
          "5:00 pm",
          "5 o'clock"
        ]
      },
      {
        "prompt": "What does Anne do at 10 a.m.?",
        "options": [
          "Record the evening show",
          "Write for her morning show",
          "Attend a lesson"
        ],
        "correctIndex": 1,
        "explanation": "Anne says she is writing for her morning show at 10 a.m."
      },
      {
        "prompt": "When can Anna visit Amelia?",
        "options": [
          "This afternoon",
          "Tomorrow morning",
          "At midnight"
        ],
        "correctIndex": 0,
        "explanation": "Amelia asks Anna to come by that afternoon."
      },
      {
        "prompt": "What surprises Anna at the end?",
        "options": [
          "A surprise party",
          "A pay cut",
          "A delayed flight"
        ],
        "correctIndex": 0,
        "explanation": "Her co-workers throw a surprise party."
      }
    ]
  },
  {
    "id": "voa-metro-10",
    "title": "Come Over to My Place",
    "stage": 2,
    "contextAr": "المواصلات والوصول للمنزل",
    "contextEn": "Metro, bus stops & street directions",
    "level": "VOA Level 1 · Developing",
    "sourceUrl": "https://learningenglish.voanews.com/a/lets-learn-english-lesson-10/3285228.html",
    "audioUrl": "https://voa-audio.voanews.eu/vle/2016/04/14/442a6a50-693e-411f-8cff-99e40d16614c_hq.mp3",
    "durationSeconds": 90,
    "transcriptKind": "complete",
    "transcript": "Anna: Hi! Today, my friend Ashley, is coming over. I am showing her my new apartment! Oh! That’s Ashley calling.\nAshley: Hi Anna! I’m coming to your apartment. Where is your apartment?\nAnna: My apartment is near the Columbia Heights Metro.\nAshley: Is it near the Columbia Heights Metro?\nAnna: Yes. Exit the Metro and turn right. Then at the bus station turn left. Then walk straight ahead.\nAshley: Exit Metro, turn right, turn left, then go straight ahead?\nAnna: Yes. My apartment is near a coffee shop.\nAshley: Anna, which coffee shop? There are three coffee shops.\nAnna: Okay, my apartment is across from a big department store.\nAshley: A big department store? Ah, I see it!\nAnna: Ashley! Over here! It’s Anna!\nAnna: I love having my friends over.",
    "questions": [
      {
        "prompt": "What should Ashley do immediately after leaving the Metro?",
        "options": [
          "Turn right",
          "Turn left",
          "Go back down the steps"
        ],
        "correctIndex": 0,
        "explanation": "Anna says to exit the Metro and turn right."
      },
      {
        "prompt": "Location note: Anna's home is near the ______ Heights Metro.",
        "options": [],
        "correctIndex": -1,
        "explanation": "Anna identifies the Columbia Heights Metro station.",
        "kind": "note-completion",
        "answerText": "Columbia",
        "acceptedAnswers": []
      },
      {
        "prompt": "Where should Ashley turn left?",
        "options": [
          "At a library",
          "At the bus station",
          "After the rooftop"
        ],
        "correctIndex": 1,
        "explanation": "Anna says to turn left at the bus station."
      },
      {
        "prompt": "Which landmark is across from Anna's apartment?",
        "options": [
          "A big department store",
          "A river",
          "A university"
        ],
        "correctIndex": 0,
        "explanation": "Anna uses the department store to make her directions clear."
      }
    ]
  },
  {
    "id": "voa-meeting-l2-3",
    "title": "He Said – She Said",
    "stage": 3,
    "contextAr": "اجتماع مهني وتضارب الروايات",
    "contextEn": "Business meeting & differing viewpoints",
    "level": "VOA Level 2 · Intermediate",
    "sourceUrl": "https://learningenglish.voanews.com/a/lets-learn-english-level-2-lesson-3/4027340.html",
    "audioUrl": "https://voa-audio.voanews.eu/vle/2017/09/15/078ffce1-f691-4e1e-811e-058154119d2d_hq.mp3",
    "durationSeconds": 0,
    "transcriptKind": "excerpt",
    "transcript": "Anna: Today, Pete and I are meeting with a consultant who will help us with our new show. Yesterday, Pete had promised to meet me here at 8:00 am, but he did not come on time.\nKelly: You two are late — exactly 43 minutes late! What happened?\nAnna: He had to get his special coffee!\nPete: She had to feed her birds!\nKelly: You can’t both talk at the same time. You have to take turns.\nAnna: Pete and I live in the same building. We decided to meet at 8:00 a.m. to come to work together. I had waited 15 minutes when Pete arrived!",
    "verifiedSummary": "Later Anna and Pete describe the delays very differently. Consultant Kelly proposes a new show named He Said, She Said, presenting different points of view.",
    "questions": [
      {
        "prompt": "Meeting record: The consultant says the pair arrived ______ minutes late.",
        "options": [],
        "correctIndex": -1,
        "explanation": "Kelly says the pair are exactly 43 minutes late.",
        "kind": "table-completion",
        "answerText": "43",
        "acceptedAnswers": [
          "forty-three",
          "forty three"
        ]
      },
      {
        "prompt": "Why does Anna say Pete was late?",
        "options": [
          "He stopped for special coffee",
          "He visited a university",
          "He was at a restaurant"
        ],
        "correctIndex": 0,
        "explanation": "Anna blames the delay on Pete's special coffee."
      },
      {
        "prompt": "How does Pete explain some of the delay?",
        "options": [
          "Anna had to feed birds",
          "The office was closed",
          "He lost his wallet"
        ],
        "correctIndex": 0,
        "explanation": "Pete says Anna had to feed her birds."
      },
      {
        "prompt": "Scheduled meeting time: ______ a.m.",
        "options": [],
        "correctIndex": -1,
        "explanation": "Anna states that they had agreed to meet at 8:00 a.m.",
        "kind": "note-completion",
        "answerText": "8:00",
        "acceptedAnswers": [
          "8",
          "eight"
        ]
      }
    ]
  },
  {
    "id": "voa-tour-l2-6",
    "title": "Will It Float?",
    "stage": 3,
    "contextAr": "جولة سياحية داخل المدينة",
    "contextEn": "City tour & visitor information",
    "level": "VOA Level 2 · Intermediate",
    "sourceUrl": "https://learningenglish.voanews.com/a/lesson-6-will-it-float/4064553.html",
    "audioUrl": "https://voa-audio.voanews.eu/vle/2017/10/10/4814fa95-feaa-447a-a081-499d11b1d5f3_hq.mp3",
    "durationSeconds": 0,
    "transcriptKind": "excerpt",
    "transcript": "Penelope: Anna, thanks for taking me on a tour of D.C. today.\nAnna: Sure thing, Penelope. You are new to town. And a tour is the best way to see more of the city!\nPenelope: Which tour are we taking — the one that goes through the city on a bus? Or the one that goes along the river in a boat?\nAnna: Both!\nPenelope: What? This isn’t going to be one of those trips, is it?\nAnna: No. Follow me.\nAnna: Well, Penelope, there’s our ride!\nPenelope: What is it?\nAnna: It’s the famous DC Ducks — the boat with wheels! We will ride on the road and then sail on the water!",
    "verifiedSummary": "Later their tour passes the White House. A boy offers a fun fact about its indoor facilities, and Anna and Penelope tip him for the information.",
    "questions": [
      {
        "prompt": "What two types of transport does the vehicle combine?",
        "options": [
          "Train and bicycle",
          "Boat and road vehicle",
          "Helicopter and bus"
        ],
        "correctIndex": 1,
        "explanation": "Anna describes a boat with wheels that drives on roads and sails on water."
      },
      {
        "prompt": "The unusual tour vehicle is called the DC ______.",
        "options": [],
        "correctIndex": -1,
        "explanation": "Anna introduces the vehicle as the DC Ducks.",
        "kind": "note-completion",
        "answerText": "Ducks",
        "acceptedAnswers": [
          "duck"
        ]
      },
      {
        "prompt": "Why is Penelope visiting the city?",
        "options": [
          "She is new to town",
          "She is taking an examination",
          "She has lost her passport"
        ],
        "correctIndex": 0,
        "explanation": "Anna says Penelope is new to the town."
      },
      {
        "prompt": "What is the first transport option Penelope mentions?",
        "options": [
          "A bus tour",
          "An airplane trip",
          "A cycling trip"
        ],
        "correctIndex": 0,
        "explanation": "Penelope initially asks about the tour on a bus."
      }
    ]
  },
  {
    "id": "voa-peru-l2-10",
    "title": "Visit to Peru",
    "stage": 3,
    "contextAr": "مهرجان ثقافي ومواعيد العمل",
    "contextEn": "Museum festival, culture & deadlines",
    "level": "VOA Level 2 · Intermediate",
    "sourceUrl": "https://learningenglish.voanews.com/a/lets-learn-english-lesson-10-visit-to-peru/4079037.html",
    "audioUrl": "https://voa-audio.voanews.eu/vle/2017/10/27/863aecf4-1d6a-4fe1-9789-5251ac1e0be1_hq.mp3",
    "durationSeconds": 0,
    "transcriptKind": "excerpt",
    "transcript": "Bruna: I thought we could meet for lunch today.\nAnna: I wish I could, but I can’t. I have to research Peru for a story.\nAnna: I’ve been reading about Peru and listening to Peruvian music. I really want to understand Peru.\nBruna: You should visit Peru.\nAnna: I don’t have the money or time to go to Peru. My deadline is tomorrow!\nBruna: No, I don’t mean to really go there. The museum where I work is having a Peruvian festival today!\nBruna: Dance and music are very important to Peruvian culture, so let’s watch the dancers.\nBruna: There’s a special Peruvian dance called Marinera Norteña.\nBruna: The dancers are giving lessons after their performance. You should try it!",
    "verifiedSummary": "Later Anna explores a Peruvian art activity at the museum and returns to watch and learn more about the Marinera Norteña dance.",
    "questions": [
      {
        "prompt": "Research deadline: Anna's story is due ______.",
        "options": [],
        "correctIndex": -1,
        "explanation": "Anna directly says that her deadline is tomorrow.",
        "kind": "note-completion",
        "answerText": "tomorrow",
        "acceptedAnswers": [
          "the next day"
        ]
      },
      {
        "prompt": "Where is the Peruvian festival?",
        "options": [
          "In Bruna's museum",
          "In Anna's apartment",
          "At an airport"
        ],
        "correctIndex": 0,
        "explanation": "Bruna invites Anna to the museum where she works."
      },
      {
        "prompt": "What is the name of the dance?",
        "options": [
          "Salsa Cubana",
          "Marinera Norteña",
          "Flamenco"
        ],
        "correctIndex": 1,
        "explanation": "Bruna introduces the dance as Marinera Norteña."
      },
      {
        "prompt": "What happens after the dance performance?",
        "options": [
          "There are dance lessons",
          "The museum closes at once",
          "The guests leave Peru"
        ],
        "correctIndex": 0,
        "explanation": "Bruna says that dancers give lessons after their performance."
      }
    ]
  },
  {
    "id": "voa-snow-l2-11",
    "title": "The Big Snow",
    "stage": 4,
    "contextAr": "تقرير طقس وعاصفة ثلجية",
    "contextEn": "Weather report & severe storms",
    "level": "VOA Level 2 · Extended Listening",
    "sourceUrl": "https://learningenglish.voanews.com/a/lets-learn-english-level-2-lesson-11-the-big-snow/4102755.html",
    "audioUrl": "https://voa-audio.voanews.eu/vle/2017/11/21/0117495a-4165-48c3-8972-61491413ad7a_hq.mp3",
    "durationSeconds": 267,
    "transcriptKind": "excerpt",
    "transcript": "Kelly: Hi, Anna. Why do you have all this weather stuff?\nAnna: I love weather.\nKelly: Me too! Weather is so important.\nAnna: It is. It affects people’s lives!\nKelly: Have you ever reported on a big weather event?\nAnna: I have. I’ve reported on a blizzard.\nKelly: Do you mean the one last weekend?\nAnna: Yes! I had been waiting for that blizzard for years. When it came, I was ready.\nProf. Bot: Today we are reviewing the present perfect and past perfect verb tenses.",
    "verifiedSummary": "VOA Level 2 Lesson 11 uses Anna's report about a blizzard to demonstrate how weather affects people and to practise present-perfect and past-perfect forms. See the full original source for the complete spoken story.",
    "questions": [
      {
        "prompt": "What kind of extreme weather event did Anna report?",
        "options": [
          "A blizzard",
          "A flood",
          "A drought"
        ],
        "correctIndex": 0,
        "explanation": "Anna says she has reported on a blizzard."
      },
      {
        "prompt": "Weather note: Anna has reported on a ______.",
        "options": [],
        "correctIndex": -1,
        "explanation": "Anna names a blizzard as the weather event.",
        "kind": "table-completion",
        "answerText": "blizzard",
        "acceptedAnswers": [
          "snowstorm",
          "snow storm"
        ]
      },
      {
        "prompt": "According to Anna, why is weather important?",
        "options": [
          "It affects people's lives",
          "It decides election results",
          "It makes all flights free"
        ],
        "correctIndex": 0,
        "explanation": "Anna explains that weather affects people's lives."
      },
      {
        "prompt": "Which two grammar forms does Professor Bot discuss?",
        "options": [
          "Present perfect and past perfect",
          "Only future simple",
          "Past continuous and passive voice"
        ],
        "correctIndex": 0,
        "explanation": "The lesson introduces a review of present and past perfect verb tenses."
      }
    ]
  },
  {
    "id": "voa-carshow-l2-20",
    "title": "The Test Drive",
    "stage": 4,
    "contextAr": "تقرير معرض سيارات وتعليمات العمل",
    "contextEn": "News reporting & event coverage",
    "level": "VOA Level 2 · Extended Listening",
    "sourceUrl": "https://learningenglish.voanews.com/a/lets-learn-english-level-2-lesson-20/4254704.html",
    "audioUrl": "https://voa-audio.voanews.eu/vle/2018/02/15/8b42c321-07ea-4eb1-a1f9-e7cc6019606e_hq.mp3",
    "durationSeconds": 0,
    "transcriptKind": "excerpt",
    "transcript": "Anna: Rick, I think we should use this as the opening shot.\nPenelope: Anna, did Ms. Weaver give us instructions for covering the car show?\nAnna: She did. She said that we need to show lots of cars. She said we need to interview people. And she also said that we should have fun.\nPenelope: Those were her exact words?\nAnna: Yeah. She said, 'Have fun, Anna!' And she is the boss.\nAnna: Welcome to the Washington Car Show!\nAnna: People all over town are saying that if you like cars, this is the place to be!\nProfessor Bot: Anna, Penelope and Rick are making a news story about the Washington Car Show.",
    "verifiedSummary": "VOA Level 2 Lesson 20 teaches direct and reported speech in the setting of covering a Washington car show. The official source page provides the full dialogue and audio.",
    "questions": [
      {
        "prompt": "What event are Anna, Penelope and Rick covering?",
        "options": [
          "A book festival",
          "The Washington Car Show",
          "A sports tournament"
        ],
        "correctIndex": 1,
        "explanation": "Anna opens the report by welcoming people to the Washington Car Show."
      },
      {
        "prompt": "Reporting task: The team must show cars and ______ people.",
        "options": [],
        "correctIndex": -1,
        "explanation": "Ms. Weaver instructs the team to interview people.",
        "kind": "table-completion",
        "answerText": "interview",
        "acceptedAnswers": [
          "interviewing"
        ]
      },
      {
        "prompt": "Who gives the team's instructions?",
        "options": [
          "Ms. Weaver",
          "A museum director",
          "A school principal"
        ],
        "correctIndex": 0,
        "explanation": "Anna says her boss Ms. Weaver gave the instructions."
      },
      {
        "prompt": "What additional instruction does Anna report?",
        "options": [
          "Have fun",
          "Cancel all interviews",
          "Stay inside the office"
        ],
        "correctIndex": 0,
        "explanation": "Anna says Ms. Weaver told her to have fun."
      }
    ]
  }
];

export const IELTS_GRADED_LISTENING_LESSONS: readonly IeltsGradedListeningLesson[] =
  [...IELTS_LISTENING_LESSONS.map((lesson,index)=>({...lesson,...originalStages[index]})),
   ...IELTS_LISTENING_EXTRA]
  .sort((a,b)=>a.stage-b.stage);
