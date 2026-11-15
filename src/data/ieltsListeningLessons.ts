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
  }
];
