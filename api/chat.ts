import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';
import { findInCatalog } from './_lib/bookData';

// ---------------------------------------------------------
// 1. ثوابت وأدوات مساعدة
// ---------------------------------------------------------

const GREETINGS = [
  'hi', 'hello', 'hey', 'salam', 'marhaba', 'alo', 'hola',
  'مرحبا', 'سلام', 'هلا', 'اهلين', 'هاي',
  'عليكم السلام', 'صباح الخير', 'مساء الخير'
];

function normalize(text: string): string {
  return (text || '').toString().toLowerCase().trim();
}

// ---------------------------------------------------------
// 2. المعالج الرئيسي
// ---------------------------------------------------------

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // السماح فقط بـ POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // التحقق من وجود مفتاح Groq
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'GROQ_API_KEY is missing in Vercel Environment Variables'
    });
  }

  try {
    // -----------------------------------------------------
    // قراءة البيانات القادمة من الواجهة
    // -----------------------------------------------------
    const body = req.body || {};
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const locale = body.locale === 'ar' ? 'ar' : 'en';

    const userMessage =
      messages[messages.length - 1]?.content || '';

    const cleanUserMessage = normalize(userMessage);

    // -----------------------------------------------------
    // 1) التعامل مع التحية بدون استهلاك AI
    // -----------------------------------------------------
    const isGreeting =
      GREETINGS.some(g => cleanUserMessage.includes(g)) ||
      (cleanUserMessage.length < 4 &&
        /^[a-zA-Z\u0600-\u06FF]+$/.test(cleanUserMessage));

    if (isGreeting) {
      return res.status(200).json({
        reply:
          locale === 'ar'
            ? 'أهلاً بك! أنا صقر 🦅، مساعدك الذكي في مكتبة مدرسة صقر الإمارات. كيف أساعدك اليوم؟'
            : 'Hello! I am Saqr 🦅, your smart assistant at Saqr Al Emarat School Library. How can I help you today?'
      });
    }

    // -----------------------------------------------------
    // 2) البحث المحلي في كتالوج المكتبة
    // -----------------------------------------------------
    const matchingBooks = findInCatalog(userMessage);

    let context = '';
    if (matchingBooks && matchingBooks.length > 0) {
      const bookList = matchingBooks
        .map(
          b =>
            `- ${b.title} (Author: ${b.author}, Shelf ${b.shelf}, Row ${b.row})`
        )
        .join('\n');

      context = `The following books were found in the library catalog:\n${bookList}`;
    } else {
      context =
        'No specific books were found. Suggest general topics like Science, History, or Arabic Literature.';
    }

    // -----------------------------------------------------
    // 3) فلترة الرسائل لمنع أي crash
    // -----------------------------------------------------
    const safeMessages = messages.filter(
      (m: any) =>
        m &&
        typeof m === 'object' &&
        typeof m.role === 'string' &&
        typeof m.content === 'string'
    );

    // -----------------------------------------------------
    // 4) استدعاء Groq
    // -----------------------------------------------------
    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are Saqr, a professional and friendly school librarian.
Respond in ${locale === 'ar' ? 'Arabic' : 'English'}.
Keep responses concise and student-friendly.
Library Context:
${context}`
        },
        ...safeMessages
      ],
      temperature: 0.5,
      max_tokens: 600
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      (locale === 'ar'
        ? 'عذرًا، لم أتمكن من توليد رد مناسب حاليًا.'
        : 'Sorry, I could not generate a response at the moment.');

    return res.status(200).json({ reply });

  } catch (error: any) {
    console.error('SERVER ERROR:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: error?.message || 'Unknown error'
    });
  }
}
