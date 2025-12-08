import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

// ---------------------------------------------------------
// 1. البيانات (تأكد من وضع بياناتك الكاملة هنا)
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

// ⚠️ ضع مصفوفة كتبك الحقيقية هنا
const books: Book[] = [
  { "title": "EUPHORIA", "author": "LILY KING", "shelf": 16, "row": 6 },
  { "title": "CREATING EXCELLENCE", "author": "Craig R. Hickman", "shelf": 4, "row": 1 },
  // ... باقي الكتب
];

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function normalize(text: string) {
  return (text || '').toString().toLowerCase().trim();
}

// ---------------------------------------------------------
// 2. تحديث منطق البحث (لمنع مطابقة HI مع Children)
// ---------------------------------------------------------
function searchInventory(query: string): Book[] {
  const q = normalize(query);
  if (!q) return [];
  
  // ⛔ تجاهل البحث إذا كانت الكلمة أقل من 3 حروف (إلا لو كانت رقم)
  // هذا يمنع البحث عن Hi, Is, Of
  if (q.length < 3 && !/^\d+$/.test(q)) {
    return [];
  }

  return books.filter((book) => {
    const title = normalize(book.title);
    const author = normalize(book.author);
    const subject = normalize(book.subject || '');

    // ✅ استخدام includes للبحث، لكن مع شرط الطول السابق لن تحدث مشاكل في الكلمات القصيرة
    return title.includes(q) || author.includes(q) || subject.includes(q);
  });
}

// ---------------------------------------------------------
// 3. المعالج الرئيسي
// ---------------------------------------------------------
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages = [], locale = 'en' } = req.body;
    const userMessage = messages[messages.length - 1]?.content || '';
    
    // 1. إجراء البحث
    const matches = searchInventory(userMessage).slice(0, 4);

    // 2. تحويل النتائج لنص
    const booksContext = matches.length > 0
      ? matches.map(b => `- "${b.title}" by ${b.author} (Shelf ${b.shelf}, Row ${b.row})`).join('\n')
      : "No matching books found in the catalog.";

    // 3. صياغة التعليمات (Prompt) - هنا الحل الجذري لمشكلة التحية
    const systemInstructions = `
      You are Saqr, a friendly and helpful school librarian.
      
      ### Database Context (Search Results):
      ${booksContext}

      ### User Input:
      "${userMessage}"

      ### YOUR INSTRUCTIONS (Follow Strictly):
      
      1. **CHECK FOR GREETINGS FIRST:**
         - If the user says "Hi", "Hello", "Marhaba", "Salam", or simply greets you:
         - **IGNORE** the database context completely.
         - Reply with a warm, short welcome (e.g., "Hello! How can I help you find a book today?").
         - **DO NOT** explain the definition of the word "Hello".
         - **DO NOT** list books unless the user explicitly asked for them.

      2. **CHECK FOR BOOK REQUESTS:**
         - If the user is asking for a book, topic, or author:
         - **IF books are found in Context:** Say "Yes, we have them!" and list the Title, Author, and Location (Shelf/Row).
         - **IF NO books are found:** Apologize that we don't have physical copies, but use your general knowledge to briefly discuss the topic/book, then end with "Currently, this is not in our physical library."

      3. **TONE:**
         - Be concise. Do not write long paragraphs.
         - If the user speaks Arabic, reply in Arabic.
         - If the user speaks English, reply in English.
    `;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemInstructions },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.3, // تقليل العشوائية ليلتزم بالتعليمات
      max_tokens: 300,
    });

    const reply = completion.choices?.[0]?.message?.content || '...';
    return res.status(200).json({ reply });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Server Error' });
  }
}
