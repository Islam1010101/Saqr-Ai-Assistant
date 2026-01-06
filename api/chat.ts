import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';
// تصحيح مسار الاستيراد (بدون _lib)
import { findInCatalog } from './bookData';

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY missing' });
  }

  try {
    const body = req.body || {};
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const locale = body.locale === 'ar' ? 'ar' : 'en';
    const userMessage = messages[messages.length - 1]?.content || '';
    const clean = normalize(userMessage);

    // 1. التحية
    if (GREETINGS.some(g => clean.includes(g))) {
      return res.status(200).json({
        reply: locale === 'ar'
          ? 'أهلاً بك! أنا صقر 🦅، مساعد مكتبة مدرسة صقر الإمارات. كيف أساعدك؟'
          : 'Hello! I am Saqr 🦅, the school library assistant. How can I help you?'
      });
    }

    // 2. البحث
    const books = findInCatalog(userMessage);
    const context = books.length > 0
        ? books.map(b => `- ${b.title} by ${b.author} (Shelf ${b.shelf}, Row ${b.row})`).join('\n')
        : 'No specific books found for this query in the catalog.';

    // 3. الذكاء الاصطناعي
    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      // هام جداً: هذا هو الموديل الجديد الذي يعمل
      model: 'llama-3.3-70b-versatile', 
      messages: [
        {
          role: 'system',
          content: `You are Saqr, a school librarian. Reply in ${locale === 'ar' ? 'Arabic' : 'English'}.
          Use this library data if relevant:
          ${context}
          If the user asks for a book not in the list, guide them generally.`
        },
        ...messages
      ],
      temperature: 0.5,
      max_tokens: 500
    });

    const reply = completion.choices[0]?.message?.content || 'No response generated.';
    return res.status(200).json({ reply });

  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
