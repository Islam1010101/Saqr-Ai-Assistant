import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';
// استدعاء بيانات الكتب
import { bookData } from './bookData';

// ---------------------------------------------------------
// 1. الإعدادات
// ---------------------------------------------------------
const GREETINGS = [
  'hi', 'hello', 'hey', 'salam', 'marhaba', 'alo', 'hola', 
  'مرحبا', 'سلام', 'هلا', 'اهلين', 'هاي', 'عليكم السلام', 'صباح الخير'
];

function normalize(text: string) {
  if (!text) return '';
  return text.toString().toLowerCase().trim();
}

// ---------------------------------------------------------
// 2. المعالج الرئيسي
// ---------------------------------------------------------
export default async function handler(req: VercelRequest, res: VercelResponse) {
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // فحص المفتاح
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API Key missing in Vercel." });
  }

  try {
    // تشغيل Groq
    const groq = new Groq({ apiKey: apiKey });

    // قراءة رسالة المستخدم
    const body = req.body || {};
    const messages = body.messages || [];
    const locale = body.locale || 'en'; 
    const userMessage = messages[messages.length - 1]?.content || '';
    const cleanUserMessage = normalize(userMessage);

    // --- منطق 1: التحية (Greeting) ---
    const isGreeting = GREETINGS.includes(cleanUserMessage) || 
                       (cleanUserMessage.length < 3 && /^[a-zA-Z\u0600-\u06FF]+$/.test(cleanUserMessage));

    if (isGreeting) {
      return res.status(200).json({ 
        reply: locale === 'ar' 
          ? "أهلاً بك! أنا صقر 🦅، أمين المكتبة. كيف يمكنني مساعدتك في إيجاد كتاب اليوم؟" 
          : "Hello! I am Saqr 🦅, the librarian. How can I help you find a book today?"
      });
    }

    // --- منطق 2: استخراج الكلمات المفتاحية ---
    const keywordCompletion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: 'Extract 3 main English search keywords. Output ONLY comma-separated words.' },
        { role: 'user', content: userMessage }
      ],
      temperature: 0,
      max_tokens: 50,
    });

    const keywordText = keywordCompletion.choices[0]?.message?.content || '';
    const searchKeywords = keywordText.split(',').map(s => normalize(s)).filter(s => s.length > 2);
    
    // --- منطق 3: البحث الآمن (Safe Search) ---
    // نتأكد أن bookData موجودة ومصفوفة لتجنب الخطأ 500
    const safeLibrary = Array.isArray(bookData) ? bookData : [];
    
    const matchingBooks = safeLibrary.filter(book => {
      const content = `${normalize(book.title)} ${normalize(book.author)} ${normalize(book.subject)}`.toLowerCase();
      return searchKeywords.some(key => content.includes(key));
    }).slice(0, 5);

    // --- منطق 4: الرد النهائي ---
    let systemContext = "";
    if (matchingBooks.length > 0) {
      const list = matchingBooks.map(b => `- "${b.title}" (Shelf ${b.shelf})`).join('\n');
      systemContext = `Found books in library:\n${list}`;
    } else {
      systemContext = `No books found for "${searchKeywords}". Suggest a general topic.`;
    }

    const chatCompletion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', 
      messages: [
        { role: 'system', content: `You are Saqr the librarian. Reply in ${locale === 'ar' ? 'Arabic' : 'English'}.\nContext: ${systemContext}` },
        { role: 'user', content: userMessage },
      ],
    });

    return res.status(200).json({ reply: chatCompletion.choices[0]?.message?.content });

  } catch (error: any) {
    console.error('SERVER ERROR:', error);
    // حتى لو حدث خطأ، نرجعه كرسالة JSON للمستخدم ليفهم السبب
    return res.status(500).json({ error: error.message || "Unknown Error" });
  }
}
