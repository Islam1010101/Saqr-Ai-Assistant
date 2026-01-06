import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';
import { findInCatalog } from './_lib/bookData';

// ---------------------------------------
// أدوات مساعدة
// ---------------------------------------
const GREETINGS = [
  'hi', 'hello', 'hey', 'salam', 'marhaba',
  'مرحبا', 'سلام', 'هلا', 'اهلين',
  'صباح الخير', 'مساء الخير'
];

function normalize(text: string): string {
  return (text || '').toLowerCase().trim();
}

// ---------------------------------------
// API Handler
// ---------------------------------------
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'GROQ_API_KEY is missing in Vercel settings'
    });
  }

  try {
    const body = req.body || {};
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const locale = body.locale === 'ar' ? 'ar' : 'en';

    const userMessage = messages[messages.length - 1]?.content || '';
    const clean = normalize(userMessage);

    // -----------------------------------
    // 1) التحية
    // -----------------------------------
    if (GREETINGS.some(g => clean.includes(g))) {
      return res.status(200).json({
        reply: locale === 'ar'
          ? 'أهلاً بك! أنا صقر 🦅، مساعد مكتبة مدرسة صقر الإمارات. كيف أساعدك؟'
          : 'Hello! I am Saqr 🦅, the school library assistant. How can I help you?'
      });
    }

    // -----------------------------------
    // 2) البحث في الكتالوج
    // -----------------------------------
    const books = findInCatalog(userMessage);

    const context =
      books.length > 0
        ? books.map(
            b => `- ${b.title} by ${b.author} (Shelf ${b.shelf}, Row ${b.row})`
          ).join('\n')
        : 'No matching books found in the catalog.';

    // -----------------------------------
    // 3) فلترة الرسائل
    // -----------------------------------
    const safeMessages = messages.filter(
      (m: any) =>
        m &&
        typeof m.role === 'string' &&
        typeof m.content === 'string'
    );

    // -----------------------------------
    // 4) Groq AI
    // -----------------------------------
    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are Saqr, a helpful school librarian.
Respond in ${locale === 'ar' ? 'Arabic' : 'English'}.
Library Context:
${context}`
        },
        ...safeMessages
      ],
      temperature: 0.4,
      max_tokens: 500
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      (locale === 'ar'
        ? 'عذرًا، لم أستطع توليد رد الآن.'
        : 'Sorry, I could not generate a response.');

    return res.status(200).json({ reply });

  } catch (error: any) {
    console.error('CHAT API ERROR:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
}
