import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';
// تم تعديل المسار هنا ليفهم السيرفر أن البيانات موجودة في مجلد data الخارجي
import { findInCatalog } from '../data/bookData'; 

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
// 2. المعالج الرئيسي (Serverless Function)
// ---------------------------------------------------------
export default async function handler(req: VercelRequest, res: VercelResponse) {
  
  // منع أي طلب غير POST لضمان أمان الـ API
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // التحقق من وجود مفتاح API في إعدادات Vercel
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GROQ_API_KEY is missing in Vercel settings." });
  }

  const groq = new Groq({ apiKey });

  try {
    const body = req.body || {};
    const messages = body.messages || [];
    const locale = body.locale || 'en'; 
    const userMessage = messages[messages.length - 1]?.content || '';
    const cleanUserMessage = normalize(userMessage);

    // --- منطق 1: التعامل مع التحية لتقليل استهلاك الـ Tokens ---
    const isGreeting = GREETINGS.some(g => cleanUserMessage.includes(g)) || 
                       (cleanUserMessage.length < 4 && /^[a-zA-Z\u0600-\u06FF]+$/.test(cleanUserMessage));

    if (isGreeting) {
      const greetingReply = locale === 'ar' 
        ? "أهلاً بك! أنا صقر 🦅، مساعدك الذكي في مكتبة مدرسة صقر الإمارات. كيف يمكنني مساعدتك في العثور على كتاب اليوم؟" 
        : "Hello! I am Saqr 🦅, your smart assistant at Saqr Al Emarat School Library. How can I help you find a book today?";
      return res.status(200).json({ reply: greetingReply });
    }

    // --- منطق 2: البحث المحلي السريع في الكتالوج ---
    // نمرر رسالة المستخدم مباشرة لدالة البحث التي تجلب أول 5 نتائج فقط
    const matchingBooks = findInCatalog(userMessage);

    // --- منطق 3: بناء السياق (Context) للذكاء الاصطناعي ---
    let context = "";
    if (matchingBooks && matchingBooks.length > 0) {
      const bookList = matchingBooks.map(b => `- ${b.title} (Author: ${b.author}, Location: Shelf ${b.shelf}, Row ${b.row})`).join('\n');
      context = `The following books were found in our library catalog:\n${bookList}\n\nPlease use this information to answer the user. If they asked for a summary, provide a very brief one from your knowledge.`;
    } else {
      context = "No specific books found for this query in the library catalog. Be polite and suggest searching for general topics like 'Science', 'History', or 'Arabic Literature'.";
    }

    // --- منطق 4: الرد النهائي عبر Groq ---
    const chatCompletion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', 
      messages: [
        { 
          role: 'system', 
          content: `You are Saqr, a helpful and professional school librarian at Saqr Al Emarat School. 
          Respond in ${locale === 'ar' ? 'Arabic' : 'English'}.
          Keep your answers concise and student-friendly.
          Library Context:\n${context}` 
        },
        ...messages
      ],
      temperature: 0.5, // تقليل العشوائية لضمان دقة المعلومات المستخرجة من الكتالوج
      max_tokens: 600,
    });

    return res.status(200).json({ reply: chatCompletion.choices[0]?.message?.content });

  } catch (error: any) {
    console.error('SERVER ERROR:', error);
    return res.status(500).json({ 
      error: "Service Error",
      details: error.message 
    });
  }
}
