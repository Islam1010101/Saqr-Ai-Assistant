import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';
// ✅ التصحيح هنا: إضافة الشرطة السفلية ليتمكن من قراءة الملف
import { findInCatalog } from './_bookData';

const GREETINGS = [
  'hi', 'hello', 'hey', 'salam', 'marhaba',
  'مرحبا', 'سلام', 'هلا', 'اهلين',
  'صباح الخير', 'مساء الخير'
];

function normalize(text: string): string {
  return (text || '').toLowerCase().trim();
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // السماح فقط بطلبات POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // التحقق من مفتاح الـ API
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY is missing in environment variables' });
  }

  try {
    const body = req.body || {};
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const locale = body.locale === 'ar' ? 'ar' : 'en';
    
    // الحصول على آخر رسالة من المستخدم
    const userMessage = messages[messages.length - 1]?.content || '';
    const clean = normalize(userMessage);

    // 1. الرد على التحية فوراً (لتوفير التوكنز)
    if (GREETINGS.some(g => clean.includes(g))) {
      return res.status(200).json({
        reply: locale === 'ar'
          ? 'أهلاً بك! أنا صقر 🦅، مساعد مكتبة مدرسة صقر الإمارات. كيف أساعدك؟'
          : 'Hello! I am Saqr 🦅, the school library assistant. How can I help you?'
      });
    }

    // 2. البحث في الكتالوج
    const books = findInCatalog(userMessage);
    
    // تجهيز سياق المكتبة للذكاء الاصطناعي
    const context = books.length > 0
        ? books.map(b => `- ${b.title} by ${b.author} (Shelf ${b.shelf}, Row ${b.row})`).join('\n')
        : 'No specific books found matching this exact query in the catalog.';

    // 3. إعداد Groq AI
    const groq = new Groq({ apiKey });
    
    const completion = await groq.chat.completions.create({
      // ✅ استخدام الموديل الجديد والمدعوم
      model: 'llama-3.3-70b-versatile', 
      messages: [
        {
          role: 'system',
          content: `You are Saqr, a helpful school librarian. 
          Reply within the context of the library.
          Current Language: ${locale === 'ar' ? 'Arabic' : 'English'}.
          
          Here is the library catalog data related to the user's request:
          ${context}
          
          Instructions:
          1. If books are found in the context, list them clearly with Shelf and Row numbers.
          2. If no books are found, apologize politely and suggest general topics.
          3. Keep answers concise and helpful.`
        },
        ...messages
      ],
      temperature: 0.5,
      max_tokens: 600
    });

    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    
    return res.status(200).json({ reply });

  } catch (error: any) {
    console.error('CHAT API ERROR:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error', 
      details: error.message 
    });
  }
}
