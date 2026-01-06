import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';
// تأكد أن مسار ملف البيانات صحيح
import { bookData } from './bookData';

// ---------------------------------------------------------
// 1. الإعدادات والثوابت
// ---------------------------------------------------------

// قائمة التحيات (لتجاهل البحث وتوفير التكلفة)
const GREETINGS = [
  'hi', 'hello', 'hey', 'salam', 'marhaba', 'alo', 'hola', 
  'مرحبا', 'سلام', 'هلا', 'اهلين', 'هاي', 'عليكم السلام', 'صباح الخير', 'مساء الخير'
];

// دالة تنظيف النصوص
function normalize(text: string) {
  if (!text) return '';
  return text.toString().toLowerCase().trim();
}

// ---------------------------------------------------------
// 2. المعالج الرئيسي (Main Handler)
// ---------------------------------------------------------
export default async function handler(req: VercelRequest, res: VercelResponse) {
  
  // السماح فقط بطلبات POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // --- خطوة الأمان: التحقق من وجود المفتاح ---
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("❌ Critical Error: GROQ_API_KEY is missing in Vercel env vars.");
    return res.status(500).json({ 
      error: "Configuration Error", 
      message: "مفتاح API غير موجود. تأكد من إضافته في إعدادات Vercel ثم عمل Redeploy." 
    });
  }

  try {
    // ✅ تهيئة Groq هنا (داخل الدالة) لمنع انهيار الملف بالكامل عند التحميل
    const groq = new Groq({ apiKey: apiKey });

    const body = req.body || {};
    const messages = body.messages || [];
    const locale = body.locale || 'en'; 
    const userMessage = messages[messages.length - 1]?.content || '';
    const cleanUserMessage = normalize(userMessage);

    // ---------------------------------------------------------
    // 3. معالجة التحية (Greeting Logic)
    // ---------------------------------------------------------
    // إذا قال المستخدم "Hi" أو كلمة قصيرة جداً، نرد بترحيب فقط
    const isGreeting = GREETINGS.includes(cleanUserMessage) || 
                       (cleanUserMessage.length < 3 && /^[a-zA-Z\u0600-\u06FF]+$/.test(cleanUserMessage));

    if (isGreeting) {
      const welcomeMsg = locale === 'ar' 
        ? "أهلاً بك! أنا صقر 🦅، أمين المكتبة الذكي.\nأنا هنا لمساعدتك في العثور على الكتب. أخبرني، عما تبحث اليوم؟" 
        : "Hello! I am Saqr 🦅, the smart librarian.\nI am here to help you find books. What topic are you interested in today?";
      
      return res.status(200).json({ reply: welcomeMsg });
    }

    // ---------------------------------------------------------
    // 4. استخراج الكلمات المفتاحية (AI Extraction)
    // ---------------------------------------------------------
    const keywordCompletion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        { 
          role: 'system', 
          content: 'Extract 3 main English search keywords from the user text. Output ONLY a comma-separated list (e.g., Space, NASA, Mars).' 
        },
        { role: 'user', content: userMessage }
      ],
      temperature: 0,
      max_tokens: 50,
    });

    const keywordText = keywordCompletion.choices[0]?.message?.content || '';
    const searchKeywords = keywordText.split(',').map(s => normalize(s)).filter(s => s.length > 2);

    console.log(`User: "${userMessage}" -> Keywords: [${searchKeywords.join(', ')}]`);

    // ---------------------------------------------------------
    // 5. البحث في المكتبة (Search Logic)
    // ---------------------------------------------------------
    const matchingBooks = bookData.filter(book => {
      const content = `${normalize(book.title)} ${normalize(book.author)} ${normalize(book.subject)} ${normalize(book.summary || '')}`;
      return searchKeywords.some(key => content.includes(key));
    }).slice(0, 5);

    // ---------------------------------------------------------
    // 6. صياغة الرد النهائي (Final Reply)
    // ---------------------------------------------------------
    let systemContext = "";
    if (matchingBooks.length > 0) {
      const booksList = matchingBooks.map(b => 
        `- "${b.title}" by ${b.author} (Shelf ${b.shelf}, Row ${b.row})`
      ).join('\n');
      systemContext = `We found these books:\n${booksList}`;
    } else {
      systemContext = `No specific physical books found for keywords: "${searchKeywords.join(', ')}". Suggest a general section instead.`;
    }

    const systemPrompt = `
      You are Saqr, a helpful school librarian.
      
      CONTEXT (Search Results):
      ${systemContext}

      USER MESSAGE: "${userMessage}"

      INSTRUCTIONS:
      1. If books are found: Recommend them enthusiastically with their location (Shelf/Row).
      2. If NO books found: Apologize politely, explain the topic briefly, and suggest a relevant section.
      3. Language: Reply in ${locale === 'ar' ? 'ARABIC' : 'ENGLISH'}.
    `;

    const chatCompletion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', 
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.5, 
      max_tokens: 800,
    });

    const reply = chatCompletion.choices?.[0]?.message?.content || 'Thinking...';
    return res.status(200).json({ reply });

  } catch (error: any) {
    console.error('SERVER ERROR:', error);
    // إرجاع رسالة خطأ JSON واضحة بدلاً من Crash
    return res.status(500).json({ 
      error: "Internal Server Error", 
      details: error.message || "Unknown error occurred" 
    });
  }
}
