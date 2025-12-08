import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

// ---------------------------------------------------------
// 1. تعريف الأنواع (Types)
// ---------------------------------------------------------
type Book = {
  title: string;
  author: string;
  shelf: number;
  row: number;
  subject?: string;
  summary?: string;
  language?: 'AR' | 'EN';
};

// تعريف نوع البيانات القادمة من الواجهة الأمامية
interface ChatRequestBody {
  messages: Array<{ role: string; content: string }>;
  locale?: 'ar' | 'en'; // ? تعني اختياري
}

// ---------------------------------------------------------
// 2. البيانات (ضع بيانات كتبك هنا)
// ---------------------------------------------------------
const books: Book[] = [
  { "title": "EUPHORIA", "author": "LILY KING", "shelf": 16, "row": 6 },
  { "title": "CREATING EXCELLENCE", "author": "Craig R. Hickman", "shelf": 4, "row": 1 },
  // ... (تأكد من نسخ باقي كتبك هنا)
];

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function normalize(text: string) {
  return (text || '').toString().toLowerCase().trim();
}

// ---------------------------------------------------------
// 3. منطق البحث
// ---------------------------------------------------------
function searchInventory(query: string): Book[] {
  const q = normalize(query);
  if (!q) return [];
  
  // تجاهل الكلمات القصيرة جداً لمنع التطابق الخاطئ (مثل Hi)
  if (q.length < 3 && !/^\d+$/.test(q)) {
    return [];
  }

  return books.filter((book) => {
    const title = normalize(book.title);
    const author = normalize(book.author);
    const subject = normalize(book.subject || '');

    return title.includes(q) || author.includes(q) || subject.includes(q);
  });
}

// ---------------------------------------------------------
// 4. المعالج الرئيسي (API Handler)
// ---------------------------------------------------------
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // حل مشكلة الـ Type Error: نحدد النوع صراحةً هنا
    const body = (req.body || {}) as ChatRequestBody;
    const messages = body.messages || [];
    // الآن TypeScript يفهم أن locale يمكن أن يكون 'ar' أو 'en'
    const locale = body.locale || 'en'; 

    const userMessage = messages[messages.length - 1]?.content || '';
    
    // 1. إجراء البحث
    const matches = searchInventory(userMessage).slice(0, 4);

    // 2. تحويل النتائج لنص
    const booksContext = matches.length > 0
      ? matches.map(b => `- "${b.title}" by ${b.author} (Shelf ${b.shelf}, Row ${b.row})`).join('\n')
      : "No matching books found in the catalog.";

    // 3. صياغة التعليمات
    let systemInstructions = '';

    // تمييز التعليمات بناءً على اللغة لمنع الخلط
    const isArabic = locale === 'ar';

    systemInstructions = `
      You are Saqr, a friendly and helpful school librarian.
      
      ### Database Context (Search Results):
      ${booksContext}

      ### User Input:
      "${userMessage}"

      ### YOUR INSTRUCTIONS (Follow Strictly):
      
      1. **CHECK FOR GREETINGS FIRST:**
         - If the user says "Hi", "Hello", "Marhaba", "Salam", or simply greets you:
         - **IGNORE** the database context completely.
         - Reply with a warm, short welcome.
         - **DO NOT** explain the definition of the word "Hello".

      2. **CHECK FOR BOOK REQUESTS:**
         - If the user is asking for a book, topic, or author:
         - **IF books are found in Context:** Say "Yes, we have them!" and list the Title, Author, and Location (Shelf/Row).
         - **IF NO books are found:** Apologize that we don't have physical copies, but use your general knowledge to briefly discuss the topic/book, then end with "Currently, this is not in our physical library."

      3. **RESPONSE LANGUAGE:**
         - The user preferred language is: ${isArabic ? 'ARABIC (Reply in Arabic)' : 'ENGLISH (Reply in English)'}.
    `;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemInstructions },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const reply = completion.choices?.[0]?.message?.content || '...';
    return res.status(200).json({ reply });

  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
