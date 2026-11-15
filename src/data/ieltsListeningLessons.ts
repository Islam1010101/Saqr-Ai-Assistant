/**
 * Curated independently sourced listening lessons, not Cambridge/official IELTS audio.
 * Original VOA Learning English texts and MP3s are public domain when credited:
 * https://learningenglish.voanews.com/p/6861.html
 * https://learningenglish.voanews.com/p/5374.html
 * Each audio URL was taken from the Conversation MP3 link on the lesson page.
 * Audio is streamed from the original VOA host; it is not copied to our server.
 * Level labels are VOA's, NOT CEFR or a predicted IELTS band.
 * For Level 2 the excerpt is explicitly marked and the rest is summarized.
 */
export type IeltsListeningQuestion = Readonly<{
  prompt: string;
  options: readonly string[];
  correctIndex: number;
  explanation: string;
}>;
export type IeltsListeningLesson = Readonly<{
  id: string;
  title: string;
  level: string;
  sourceUrl: string;
  audioUrl: string;
  durationSeconds: number;
  transcriptKind: 'complete' | 'excerpt';
  transcript: string;
  verifiedSummary?: string;
  /** Learning-path stage (1 = easiest, 4 = most demanding); not an official IELTS band. */
  stage?: 1 | 2 | 3 | 4;
  /** Context shown in the level selector; descriptions are editorial, not IELTS classification. */
  context?: string;
  questions: readonly IeltsListeningQuestion[];
}>;

export const IELTS_LISTENING_LESSONS: readonly IeltsListeningLesson[] = [
  {
    "id": "voa-welcome-1",
    "title": "Welcome!",
    "level": "VOA Level 1 · Foundation",
    "sourceUrl": "https://learningenglish.voanews.com/a/lets-learn-english-lesson-one/3111026.html",
    "audioUrl": "https://voa-audio.voanews.eu/vle/2016/02/08/49485bf8-4277-47f6-9abe-617ee2473f8c.mp3",
    "durationSeconds": 29,
    "transcriptKind": "complete",
    "transcript": "Pete: Hi! Are you Anna?\nAnna: Yes! Hi there! Are you Pete?\nPete: I am Pete.\nAnna: Nice to meet you.\nAnna: Let's try that again. I'm Anna. Nice to meet you.\nPete: I'm Pete. \"Anna\" Is that A-N-A?\nAnna: No. A-N-N-A\nPete: Well, Anna with two \"n's\" ... Welcome to ... 1400 Irving Street!\nAnna: My new apartment! Yes!",
    "questions": [
      {
        "prompt": "How does Anna spell her name?",
        "options": [
          "A-N-A",
          "A-N-N-A",
          "A-N-N-E"
        ],
        "correctIndex": 1,
        "explanation": "Anna corrects Pete by spelling her name A-N-N-A."
      },
      {
        "prompt": "Which address does Pete mention?",
        "options": [
          "1400 Irving Street",
          "1500 Irving Street",
          "Apartment B4"
        ],
        "correctIndex": 0,
        "explanation": "Pete welcomes Anna to 1400 Irving Street."
      },
      {
        "prompt": "Who welcomes Anna to her new apartment?",
        "options": [
          "Marsha",
          "Jonathan",
          "Pete"
        ],
        "correctIndex": 2,
        "explanation": "Pete is the person who welcomes Anna at the start of the conversation."
      }
    ]
  },
  {
    "id": "voa-anna-2",
    "title": "Hello, I'm Anna!",
    "level": "VOA Level 1 · Foundation",
    "sourceUrl": "https://learningenglish.voanews.com/a/lets-learn-english-lesson-2-hello/3113733.html",
    "audioUrl": "https://voa-audio.voanews.eu/vle/2016/02/10/56246d7b-5fa4-42d2-90b0-d403e6b46227.mp3",
    "durationSeconds": 48,
    "transcriptKind": "complete",
    "transcript": "Jonathan: Hey, Pete! Who’s your friend?\nPete: She is Anna. She is new to D.C.\nJonathan: Where are you from?\nAnna: I am from a small town.\nJonathan: Well, welcome to D.C.\nAnna: Thank you.\nJonathan: I am Jonathan. I am in apartment B4.\nAnna: I am in apartment C2. Marsha is my roommate.\nJonathan: I know Marsha. She is nice.\nPete: And I am in Apartment D7. I have to go now.\nAnna: Oh!\nPete: Remember to call Marsha at work. Tell her you’re here.\nAnna: Right, thanks, Pete. Nice to meet you!\nJonathan: You too, Bye.\nAnna: Apartment C2, here I come!",
    "questions": [
      {
        "prompt": "Which apartment does Anna live in?",
        "options": [
          "B4",
          "C2",
          "D7"
        ],
        "correctIndex": 1,
        "explanation": "Anna says that her apartment is C2."
      },
      {
        "prompt": "Who is Anna's roommate?",
        "options": [
          "Marsha",
          "Jonathan",
          "Pete"
        ],
        "correctIndex": 0,
        "explanation": "Anna clearly introduces Marsha as her roommate."
      },
      {
        "prompt": "Which apartment does Jonathan live in?",
        "options": [
          "C2",
          "D7",
          "B4"
        ],
        "correctIndex": 2,
        "explanation": "Jonathan says, 'I am in apartment B4.'"
      }
    ]
  },
  {
    "id": "voa-im-here-3",
    "title": "I'm Here!",
    "level": "VOA Level 1 · Foundation",
    "sourceUrl": "https://learningenglish.voanews.com/a/lets-learn-english-lesson-3-i-am-here/3126527.html",
    "audioUrl": "https://voa-audio.voanews.eu/vle/2016/02/18/a82baaf4-0a91-4d43-8ab6-78f72cef8fce.mp3",
    "durationSeconds": 120,
    "transcriptKind": "complete",
    "transcript": "Anna: I am in my new apartment! Great!\nI live with Marsha. We’re roommates.\nI want to cook dinner. Oh! Hmmm. Is there a supermarket near here?\nMarsha knows. Marsha's work number is 555-8986.\nMan: Hello.\nAnna: Hello. Is this Marsha? It is Anna.\nMan: I am sorry. You have the wrong number.\nAnna: Oh. Is this 555-8986?\nMan: No. This is 555-8689.\nAnna: Oh. Excuse me!\nMan: Okay. 'Bye.\nAnna: One more time. 555-8986. Please be Marsha.\nMarsha: Hello. This is Marsha.\nAnna: Yes, Marsha. I want to cook dinner.\nMarsha: Excuse me? Anna? Is that you?\nAnna: Oh, yes. I am here!\nMarsha: Good. You are there.\nAnna: I want to find a supermarket.\nMarsha: Oh, okay. The supermarket is at 1500 Irving Street. It is near the apartment.\nAnna: Great! Goodbye!\nMarsha: Goodbye, Anna.\n(Later)\nAnna: There is a big supermarket on our street. And Marsha says I am a good cook! Until next time! Bye!",
    "questions": [
      {
        "prompt": "Why does Anna call Marsha?",
        "options": [
          "To ask where the supermarket is",
          "To invite her to school",
          "To book an appointment"
        ],
        "correctIndex": 0,
        "explanation": "Anna wants to cook dinner and asks Marsha where to find a supermarket."
      },
      {
        "prompt": "What was the wrong number Anna called?",
        "options": [
          "555-8986",
          "555-8689",
          "1500 Irving Street"
        ],
        "correctIndex": 1,
        "explanation": "The man tells Anna his number is 555-8689."
      },
      {
        "prompt": "What is the supermarket address?",
        "options": [
          "1400 Irving Street",
          "Apartment D7",
          "1500 Irving Street"
        ],
        "correctIndex": 2,
        "explanation": "Marsha says the supermarket is at 1500 Irving Street."
      }
    ]
  },
  {
    "id": "voa-budget-cuts-4",
    "title": "Budget Cuts",
    "level": "VOA Level 2 · Intermediate",
    "sourceUrl": "https://learningenglish.voanews.com/a/lets-learn-english-level-2-lesson1/3960391.html",
    "audioUrl": "https://voa-audio.voanews.eu/vle/2017/08/31/3bf697ff-3ef5-4d59-8dcd-52613e2e7e9d.mp3",
    "durationSeconds": 247,
    "transcriptKind": "excerpt",
    "transcript": "Anna: Hum. Oh! “Important meeting. Everyone must come.” Well, back to work! And my boss has called a meeting. I wonder what it's about. Maybe we're all getting raises! Ooo, there's Jonathan! Maybe he knows.\nProfessor Bot: Hi! I'm Professor Bot! This video is all about work. People talk about jobs and things that happen at work. Your assignment is to find as many work words as you can. Don't worry, I'll help.\nAnna: So, Jonathan, what do you think today's meeting is about? The email sounded important.\nJonathan: Well, I have heard people in the building talking about budget cuts.\nAnna: Oh! Budget cuts? Wait, who has been talking about budget cuts?\nJonathan: Mark in Accounting.\nAnna: Mark in Accounting? That's one person. That's not “people.”\nJonathan: I know, but Mark knows everything that goes on at The Studio.",
    "verifiedSummary": "Later colleagues spread a rumor that the meeting is about budget cuts. Ms. Weaver explains that she is not firing her team: the meeting is about their strong performance and new assignments, although Mark in Accounting has lost his job. The full transcript is available at the credited VOA source page.",
    "questions": [
      {
        "prompt": "What does Jonathan initially think the meeting may be about?",
        "options": [
          "Budget cuts",
          "A new building",
          "A company holiday"
        ],
        "correctIndex": 0,
        "explanation": "Jonathan reports hearing about budget cuts from Mark in Accounting."
      },
      {
        "prompt": "Who does Jonathan name as the original source?",
        "options": [
          "Ms. Weaver",
          "Mark in Accounting",
          "Amelia"
        ],
        "correctIndex": 1,
        "explanation": "Jonathan explicitly names Mark in Accounting."
      },
      {
        "prompt": "What is the meeting actually about?",
        "options": [
          "Firing the entire team",
          "Closing The Studio",
          "Praising the team and giving new assignments"
        ],
        "correctIndex": 2,
        "explanation": "Ms. Weaver says staff have done good work and announces new assignments."
      }
    ]
  },
{
  "id": "voa-objects-4",
  "title": "What Is It?",
  "level": "VOA Level 1 · Foundation",
  "stage": 1,
  "context": "Everyday objects · café meeting",
  "sourceUrl": "https://learningenglish.voanews.com/a/lets-learn-english-lesson-4/3168920.html",
  "audioUrl": "https://voa-audio.voanews.eu/vle/2016/02/26/af0324f6-67c5-4c0c-ab42-abb0cd33817c_hq.mp3",
  "durationSeconds": 89,
  "transcriptKind": "complete",
  "transcript": "Anna: Pete, hi! Hi, we are here!\nPete: Hi, Anna! Hi, Marsha!\nAnna: Hi!\nPete: How are you two?\nMarsha: I am great!\nAnna: You know, Pete, I am new to D.C. The city is big.\nPete: Yeah. But you learn a little more every day. How's the new apartment?\nAnna: The new apartment is great! Let's get coffee!\nMarsha: Anna, do you have a pen?\nAnna: Yes. I have a pen in my bag.\nPete: It is not a pen. It is a book. It is a big book.\nAnna: Yes. Yes it is, Pete. I know I have a pen, though…\nMarsha: It is not a pen, Anna ... a toy?\nPete: And it is a pillow!\nAnna: Pete, Marsha, I know I have a pen.\nMarsha: Anna, it is a map.\nPete: Why do you have a map of the world?\nAnna: Pete, Marsha. Now I know I have a pen.\nPete: And now you have a lamp.\nMarsha: Anna.\nAnna: I have a pen! Let’s get coffee!",
  "questions": [
    {
      "prompt": "What does Marsha first ask Anna to find?",
      "options": [
        "A pen",
        "A map",
        "A pillow"
      ],
      "correctIndex": 0,
      "explanation": "Marsha asks Anna whether she has a pen."
    },
    {
      "prompt": "What does Pete say the first object is?",
      "options": [
        "A toy",
        "A book",
        "A lamp"
      ],
      "correctIndex": 1,
      "explanation": "Pete says the first item is a large book."
    },
    {
      "prompt": "What do the friends plan to do together?",
      "options": [
        "Visit a museum",
        "Go running",
        "Get coffee"
      ],
      "correctIndex": 2,
      "explanation": "Anna repeatedly says they should get coffee."
    }
  ]
},
{
  "id": "voa-house-5",
  "title": "Where Are You?",
  "level": "VOA Level 1 · Foundation",
  "stage": 1,
  "context": "Rooms in a house · daily activities",
  "sourceUrl": "https://learningenglish.voanews.com/a/lets-learn-english-lesson-5-where-are-you/3168971.html",
  "audioUrl": "https://voa-audio.voanews.eu/vle/2016/03/01/ab9c2944-eddc-4806-9296-290bfa8c6ff2_hq.mp3",
  "durationSeconds": 60,
  "transcriptKind": "complete",
  "transcript": "Anna: Hello, everyone! Today my friend Marsha is at her friend's house. She says it is beautiful. I want to see this house! Here we are!\nAnna: Marsha, I am in the kitchen! It is a beautiful kitchen!\nMarsha: It is beautiful. We cook in the kitchen.\nAnna: I eat in the kitchen.\nMarsha: We relax in the living room.\nAnna: I relax in the living room. Marsha, let’s go upstairs!\nMarsha: Anna? Where are you?\nAnna: Marsha, I am in the bathroom! I wash in the bathroom.\nMarsha: I am in the bedroom. We sleep in the bedroom.\nAnna: I sleep in the bedroom!",
  "questions": [
    {
      "prompt": "Which room does Marsha say they cook in?",
      "options": [
        "The bedroom",
        "The kitchen",
        "The living room"
      ],
      "correctIndex": 1,
      "explanation": "Marsha says, 'We cook in the kitchen.'"
    },
    {
      "prompt": "Where do they relax?",
      "options": [
        "In the living room",
        "In the bathroom",
        "On the roof"
      ],
      "correctIndex": 0,
      "explanation": "Marsha describes the living room as the place to relax."
    },
    {
      "prompt": "Where does Anna go after going upstairs?",
      "options": [
        "The garage",
        "The dining room",
        "The bathroom"
      ],
      "correctIndex": 2,
      "explanation": "Anna says she is in the bathroom."
    }
  ]
},
{
  "id": "voa-gym-6",
  "title": "Where Is the Gym?",
  "level": "VOA Level 1 · Developing",
  "stage": 2,
  "context": "Directions · building facilities",
  "sourceUrl": "https://learningenglish.voanews.com/a/lets-learn-english-lesson-6-where-is-the-gym/3225958.html",
  "audioUrl": "https://voa-audio.voanews.eu/vle/2016/03/10/66b63229-1dc5-40ab-886d-1f4b891adf6b_hq.mp3",
  "durationSeconds": 108,
  "transcriptKind": "excerpt",
  "transcript": "Anna: I live in Washington, D.C. Every day I learn more about this great city. People in Washington like to work out!\nAnna: Hi, Pete. I want to work out. Where is the gym?\nPete: The gym is across from the lounge. It's next to the mailroom. Go that way.\nAnna: Thanks, Pete!\nPete: No, Anna! Not that way! Go that way!\nAnna: This is not the gym. This is the mailroom.\nPete: The gym is across from the lounge.\nAnna: Across from the lounge. Right. Thanks!",
  "verifiedSummary": "Anna visits the lounge and is told the gym is across from it and behind the lobby. She accidentally goes to the parking garage and rooftop before finding Pete at the gym.",
  "questions": [
    {
      "prompt": "Where is the gym in relation to the lounge?",
      "options": [
        "Inside the lounge",
        "Across from the lounge",
        "Behind the parking garage"
      ],
      "correctIndex": 1,
      "explanation": "Pete repeatedly describes the gym as across from the lounge."
    },
    {
      "prompt": "Which room does Anna accidentally enter first?",
      "options": [
        "The mailroom",
        "The library",
        "The cafeteria"
      ],
      "correctIndex": 0,
      "explanation": "Anna discovers that she is in the mailroom, not the gym."
    },
    {
      "prompt": "Where does Anna also go before reaching the gym?",
      "options": [
        "The airport",
        "The supermarket",
        "The rooftop"
      ],
      "correctIndex": 2,
      "explanation": "She visits the rooftop after the garage."
    }
  ]
},
{
  "id": "voa-work-7",
  "title": "What Are You Doing?",
  "level": "VOA Level 1 · Developing",
  "stage": 2,
  "context": "Workplace · colleagues and duties",
  "sourceUrl": "https://learningenglish.voanews.com/a/lets-learn-english-lesson-7-what-are-you-doing/3240468.html",
  "audioUrl": "https://voa-audio.voanews.eu/vle/2016/03/16/5d724fbc-a907-4a48-9221-c1813d248168_hq.mp3",
  "durationSeconds": 149,
  "transcriptKind": "excerpt",
  "transcript": "Caty: Come in. Well, Anna, welcome.\nAnna: Thank you.\nCaty: I am your boss, Caty Weaver. But please call me Caty.\nAnna: Thank you, Ms. Weaver.\nCaty: I am busy. Please meet your co-workers. But remember, they are busy working.\nAnna: Hi there! I'm Anna.\nAnne: Hi, Anna. I'm Anne.\nAnna: What are you doing?\nAnne: Um, I'm writing.\nAnna: You are writing a lot!\nAnne: No! No! That's okay.\nAnna: I am sorry!",
  "verifiedSummary": "Anna interrupts Jonathan recording a show and Amelia reading for a show. She apologizes repeatedly, and Caty asks her to come to the office to talk.",
  "questions": [
    {
      "prompt": "Who is Anna's boss?",
      "options": [
        "Anne",
        "Caty Weaver",
        "Amelia"
      ],
      "correctIndex": 1,
      "explanation": "Caty introduces herself as Anna's boss."
    },
    {
      "prompt": "What is Anne doing?",
      "options": [
        "Writing",
        "Cooking",
        "Sleeping"
      ],
      "correctIndex": 0,
      "explanation": "Anne says she is writing."
    },
    {
      "prompt": "Why does Jonathan have to record again?",
      "options": [
        "He forgot his microphone",
        "The programme was cancelled",
        "Anna interrupted his show"
      ],
      "correctIndex": 2,
      "explanation": "Anna interrupts Jonathan while he is recording."
    }
  ]
},
{
  "id": "voa-schedule-8",
  "title": "Are You Busy?",
  "level": "VOA Level 1 · Developing",
  "stage": 2,
  "context": "Work schedules · appointment times",
  "sourceUrl": "https://learningenglish.voanews.com/a/lets-learn-english-lesson-8-are-you-busy/3253185.html",
  "audioUrl": "https://voa-audio.voanews.eu/vle/2016/03/25/ae6c5055-13ae-485b-995d-b347125ecf10_hq.mp3",
  "durationSeconds": 118,
  "transcriptKind": "excerpt",
  "transcript": "Anna: Today I want to apologize to my co-workers.\nAnna: Hi, Anne. Are you busy?\nAnne: Yes. At 10 a.m. I am writing. Every day I do my morning show.\nAnna: Hi, Jonathan. Are you busy?\nJonathan: Yes, I'm busy. When the studio light is on, I am recording my evening show.\nAnna: Right. Sorry about yesterday.\nJonathan: No worries.\nAnna: Hi, Amelia! Are you busy?\nAmelia: I'm a little busy. Come by this afternoon.",
  "verifiedSummary": "Caty Weaver asks Anna to come to her office at 5:00 p.m. Anna expects a serious conversation but finds a surprise party hosted by her colleagues.",
  "questions": [
    {
      "prompt": "What does Anne do at 10 a.m.?",
      "options": [
        "Writes for her morning show",
        "Eats breakfast",
        "Goes to a meeting"
      ],
      "correctIndex": 0,
      "explanation": "Anne specifies that she writes at ten each morning."
    },
    {
      "prompt": "What time does Ms. Weaver ask Anna to visit her office?",
      "options": [
        "10:00 a.m.",
        "3:00 p.m.",
        "5:00 p.m."
      ],
      "correctIndex": 2,
      "explanation": "The invitation to Ms. Weaver's office is for 5:00 p.m."
    },
    {
      "prompt": "What does Anna find when she arrives at the office?",
      "options": [
        "A disciplinary interview",
        "A surprise party",
        "An empty meeting room"
      ],
      "correctIndex": 1,
      "explanation": "Her colleagues have prepared a surprise party."
    }
  ]
},
{
  "id": "voa-weather-9",
  "title": "Is It Cold?",
  "level": "VOA Level 1 · Developing",
  "stage": 2,
  "context": "Weather forecast · temperatures and cities",
  "sourceUrl": "https://learningenglish.voanews.com/a/lets-learn-english-lesson-9-is-it-cold/3261789.html",
  "audioUrl": "https://voa-audio.voanews.eu/vle/2016/04/01/fe67e651-87d0-4b62-9c68-749b2d3c2f21_hq.mp3",
  "durationSeconds": 121,
  "transcriptKind": "complete",
  "transcript": "Anna: Here in Washington, DC, the weather changes often. So every day I check the forecast. Hello, Phone? What is today's temperature?\nPhone: Today it is 18 degrees ...\nAnna: Eighteen degrees! That is cold!\nPhone: ... eighteen degrees Celsius.\nAnna: Oh, Celsius. That is 65 degrees Fahrenheit. That's warm.\nPhone: Yes, Anna. It is warm.\nAnna: Excuse me, Phone. Is it windy today?\nPhone: No, it is not windy today.\nAnna: Is it sunny today?\nPhone: Yes, Anna. It is sunny.\nAnna: Excuse me, Phone? Is it snowy today?\nPhone: No, Anna. It is not snowy.\nAnna: Thank you, Phone!\nAnna: Today the weather is warm and sunny — great for seeing Washington, D.C.\nAnna: Phone! It is not warm and sunny! It is cold and windy and snowy!\nPhone: Anna, it is not cold, windy, or snowy. It is warm and sunny ... in Mexico City, Mexico.\nAnna: Oh. I see. Mexico. Remember to check the right forecast.",
  "questions": [
    {
      "prompt": "What temperature does the phone announce?",
      "options": [
        "18°C",
        "18°F",
        "65°C"
      ],
      "correctIndex": 0,
      "explanation": "The phone gives a temperature of 18 degrees Celsius."
    },
    {
      "prompt": "Which city's forecast was the phone describing?",
      "options": [
        "Washington, D.C.",
        "New York City",
        "Mexico City"
      ],
      "correctIndex": 2,
      "explanation": "The phone admits that the warm, sunny forecast was for Mexico City."
    },
    {
      "prompt": "What is the weather actually like in Washington?",
      "options": [
        "Hot and sunny",
        "Cold, windy and snowy",
        "Warm and dry"
      ],
      "correctIndex": 1,
      "explanation": "Anna reports cold, wind and snow in Washington."
    }
  ]
},
{
  "id": "voa-interview-10",
  "title": "The Interview",
  "level": "VOA Level 2 · Intermediate",
  "stage": 3,
  "context": "Job interview · new assignments",
  "sourceUrl": "https://learningenglish.voanews.com/a/lets-learn-english-level-2-lesson-2/3960471.html",
  "audioUrl": "https://voa-audio.voanews.eu/vle/2017/09/05/676d9800-cee0-4a59-9e79-b9378e0061ad_hq.mp3",
  "durationSeconds": 245,
  "transcriptKind": "excerpt",
  "transcript": "Anna: Ms. Weaver is giving new assignments out. I am ready to take on anything she gives me.\nMs. Weaver: I have new assignments for everyone at The Studio. Anna, you're good at asking questions. I want you to go back to hosting and reporting.\nAnna: That sounds great.\nMs. Weaver: I want you to team up with someone who is very different from you.\nAnna: Pete, I have a job offer for you! My boss wants me to team up with someone to host a talk show.\nPete: Different from you? What do you mean?",
  "verifiedSummary": "Pete interviews with Ms. Weaver for the joint talk show. He describes preferring solitude and having written a book alone in a cabin. Ms. Weaver thinks he is grumpy, but he gets the job.",
  "questions": [
    {
      "prompt": "What job does Ms. Weaver offer Anna?",
      "options": [
        "Hosting and reporting",
        "Flying a helicopter",
        "Working in accounting"
      ],
      "correctIndex": 0,
      "explanation": "Ms. Weaver specifically asks Anna to return to hosting and reporting."
    },
    {
      "prompt": "What does Ms. Weaver want in Anna's partner?",
      "options": [
        "A person exactly like Anna",
        "A person very different from Anna",
        "A professional athlete"
      ],
      "correctIndex": 1,
      "explanation": "She wants someone with contrasting personality traits."
    },
    {
      "prompt": "What happens after Pete's interview?",
      "options": [
        "He moves abroad",
        "He refuses the position",
        "He gets the job"
      ],
      "correctIndex": 2,
      "explanation": "Despite Ms. Weaver's reservations, Pete is hired."
    }
  ]
},
{
  "id": "voa-perspectives-11",
  "title": "He Said – She Said",
  "level": "VOA Level 2 · Challenging",
  "stage": 4,
  "context": "Workplace disagreement · comparing accounts",
  "sourceUrl": "https://learningenglish.voanews.com/a/lets-learn-english-level-2-lesson-3/4027340.html",
  "audioUrl": "https://voa-audio.voanews.eu/vle/2017/09/15/078ffce1-f691-4e1e-811e-058154119d2d_hq.mp3",
  "durationSeconds": 295,
  "transcriptKind": "excerpt",
  "transcript": "Anna: Pete and I are meeting with a consultant who will help us with our new show. Yesterday, Pete had promised to meet me here at 8:00 a.m., but he did not come on time.\nKelly: You two are late — exactly 43 minutes late! What happened?\nAnna: He had to get his special coffee!\nPete: She had to feed her birds!\nKelly: You can't both talk at the same time. You have to take turns.\nAnna: I had waited 15 minutes when Pete arrived!",
  "verifiedSummary": "Anna says Pete's coffee made them late. Pete claims Anna wasted time with a scooter and fed birds beside a pond. Consultant Kelly observes that they tell the same event from different viewpoints and proposes calling the show 'He Said, She Said.'",
  "questions": [
    {
      "prompt": "How late are Anna and Pete for the meeting?",
      "options": [
        "15 minutes",
        "30 minutes",
        "43 minutes"
      ],
      "correctIndex": 2,
      "explanation": "Kelly states they are exactly 43 minutes late."
    },
    {
      "prompt": "What does Anna blame for the delay?",
      "options": [
        "Pete's coffee",
        "The weather",
        "Traffic lights"
      ],
      "correctIndex": 0,
      "explanation": "Anna complains that Pete bought special coffee."
    },
    {
      "prompt": "Why does Kelly suggest the show title 'He Said, She Said'?",
      "options": [
        "Both prefer the same stories",
        "The two describe events differently",
        "The show is about travel"
      ],
      "correctIndex": 1,
      "explanation": "Kelly wants them to present contrasting viewpoints on the same events."
    }
  ]
},
{
  "id": "voa-circus-12",
  "title": "Run Away With the Circus!",
  "level": "VOA Level 2 · Challenging",
  "stage": 4,
  "context": "Art and athletics · comparing arguments",
  "sourceUrl": "https://learningenglish.voanews.com/a/lets-learn-english-level-2-lesson-4-run-away-with-the-circus/4034187.html",
  "audioUrl": "https://voa-audio.voanews.eu/vle/2017/09/19/56dbc988-a70f-4417-8668-c3916f6b73e7_hq.mp3",
  "durationSeconds": 301,
  "transcriptKind": "excerpt",
  "transcript": "Anna: Today's show is about Circus Arts!\nPete: Circus? That's not an art form.\nAnna: Yes, it is.\nProfessor Bot: Anna and Pete do not agree about circus arts. Today's lesson is about agreeing and disagreeing.\nAnna: Recently, I went to a circus festival. It was a celebration of circus arts!\nPete: That looks fun, Anna. But I don't think circus performers are artists. I think they're athletes with interesting skills.\nAnna: That's an interesting point of view, Pete. And I completely disagree.\nPete: I know it's not easy to swing from a bar and catch someone by the hands. You have to be very athletic.",
  "verifiedSummary": "Anna argues circus performance tells stories and includes artistic expression. Pete initially emphasizes athletic skills, but interviews with performers persuade him that the activity can be both artistic and athletic. He eventually agrees with Anna.",
  "questions": [
    {
      "prompt": "What is the main disagreement between the speakers?",
      "options": [
        "Whether circuses are expensive",
        "Whether circus performers are artists",
        "Whether the event takes place outdoors"
      ],
      "correctIndex": 1,
      "explanation": "Pete calls performers athletes rather than artists; Anna disagrees."
    },
    {
      "prompt": "What does Pete initially emphasize?",
      "options": [
        "The performers' physical ability",
        "Ticket prices",
        "The history of museums"
      ],
      "correctIndex": 0,
      "explanation": "He focuses on athletic skills such as swinging and catching."
    },
    {
      "prompt": "How does Pete's opinion change?",
      "options": [
        "He leaves the interview early",
        "He continues to reject all evidence",
        "He accepts the artistic side of circus performances"
      ],
      "correctIndex": 2,
      "explanation": "After hearing the performers, Pete agrees that circus arts can be artistic."
    }
  ]
}
];
