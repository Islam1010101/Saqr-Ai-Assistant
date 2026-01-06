import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';
// استدعاء دالة البحث والبيانات
// تأكد أن المسار صحيح لملف bookData.ts
import { findInCatalog } from './bookData'; 

// ---------------------------------------------------------
// 1. الإعدادات والتحقق من المدخلات
// ---------------------------------------------------------
const GREETINGS = [
  'hi', 'hello', 'hey', 'salam', 'marhaba', 'alo', 'hola', 
  'مرحبا', 'سلام', 'هلا', 'اهلين', 'هاي', 'عليكم السلام', 'صباح الخير', 'مساء الخير'
];

function normalize(text: string) {
  return (text || '').toString().toLowerCase().trim();
}

// ---------------------------------------------------------
// 2. المعالج الرئيسي
// ---------------------------------------------------------
export default async function handler(req: VercelRequest, res: VercelResponse) {
  
  // منع أي طلب غير POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // التحقق من وجود مفتاح API في بيئة Vercel
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API Key missing. Please add GROQ_API_KEY in Vercel environment variables." });
  }

  const groq = new Groq({ apiKey });

  try {
    const body = req.body || {};
    const messages = body.messages || [];
    const locale = body.locale || 'en'; 
    const userMessage = messages[messages.length - 1]?.content || '';
    const cleanUserMessage = normalize(userMessage);

    // --- منطق 1: التعامل مع التحية (Greetings) ---
    const isGreeting = GREETINGS.some(g => cleanUserMessage.includes(g)) || 
                       (cleanUserMessage.length < 4 && /^[a-zA-Z\u0600-\u06FF]+$/.test(cleanUserMessage));

    if (isGreeting) {
      const greetingReply = locale === 'ar' 
        ? "أهلاً بك! أنا صقر 🦅، مساعدك الذكي في مكتبة صقر الإمارات. كيف يمكنني مساعدتك في العثور على كتاب اليوم؟" 
        : "Hello! I am Saqr 🦅, your smart assistant at Saqr Al Emarat Library. How can I help you find a book today?";
      return res.status(200).json({ reply: greetingReply });
    }

    // --- منطق 2: استخراج الكلمات المفتاحية للبحث ---
    // نستخدم موديل صغير وسريع لاستخراج الكلمات فقط
    const keywordCompletion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: 'Extract 1 or 2 main search keywords (books, authors, or topics). Output ONLY the keywords separated by space.' },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.2,
      max_tokens: 20,
    });

    const keywords = keywordCompletion.choices[0]?.message?.content || userMessage;
    
    // --- منطق 3: البحث المحلي في الكتالوج ---
    // نستخدم الدالة التي صنعناها لتقليل حجم البيانات (أول 5 نتائج فقط)
    const matchingBooks = findInCatalog(keywords);

    // --- منطق 4: بناء السياق والرد النهائي ---
    let context = "";
    if (matchingBooks.length > 0) {
      const bookList = matchingBooks.map(b => `- ${b.title} by ${b.author} (Location: Shelf ${b.shelf}, Row ${b.row})`).join('\n');
      context = `Found these books in our library:\n${bookList}\n\nAnswer the user based on these results. If they asked for a summary, provide a brief helpful one.`;
    } else {
      context = "No specific books found for this query in the catalog. Ask the user for more details or suggest looking for topics like Science, History, or Literature.";
    }

    const finalCompletion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', 
      messages: [
        { 
          role: 'system', 
          content: `You are Saqr, a helpful and friendly school librarian at Saqr Al Emarat School. 
          Respond in ${locale === 'ar' ? 'Arabic' : 'English'}.
          Always be professional and encouraging to students.
          Context from our catalog:\n${context}` 
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return res.status(200).json({ reply: finalCompletion.choices[0]?.message?.content });

  } catch (error: any) {
    console.error('GROQ/SERVER ERROR:', error);
    return res.status(500).json({ 
      error: "حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى.",
      details: error.message 
    });
  }
}
