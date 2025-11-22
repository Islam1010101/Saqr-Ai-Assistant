// /api/chat.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';
import { bookData } from '../data/bookData';

// نوع بسيط للداتا بتاعة الكتب
type Book = {
  title: string;
  author?: string;
  shelf?: number; // الدولاب
  row?: number;   // الرف
  subject?: string;
  summary?: string;
};

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function normalize(s: string) {
  return (s || '').toString().toLowerCase().trim();
}

function searchCatalog(q: string): Book[] {
  const n = normalize(q);
  const tokens = n.split(/[\s,\/\-\_,.]+/).filter(Boolean);

  return (bookData as Book[]).filter((b) => {
    const fields = [b.title, b.author, b.subject].map((x) => normalize(String(x ?? ''))).join(' ');
    return fields.includes(n) || tokens.every((t) => fields.includes(t));
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages = [], locale = 'en' } = (req.body ?? {}) as {
      messages: Array<{ role: string; content: string }>;
      locale: 'ar' | 'en';
    };

    const userText = messages[messages.length - 1]?.content || '';
    const matches = searchCatalog(userText).slice(0, 5);

    if (matches.length > 0) {
      // رد من الكتالوج فقط — مفيش هلوسة
      const header =
        locale === 'ar'
          ? 'وجدت النتائج التالية في فهرس المكتبة (من بياناتنا الداخلية):'
          : 'I found these in the library catalog (from our internal data):';

      const lines = matches
        .map((b) => {
          const loc =
            b.shelf != null && b.row != null
              ? locale === 'ar'
                ? `رف ${b.row}، دولاب ${b.shelf}`
                : `Shelf Row ${b.row}, Cabinet ${b.shelf}`
              : locale === 'ar'
                ? 'الموقع غير محدد'
                : 'Location not specified';

          const base =
            locale === 'ar'
              ? `• ${b.title}${b.author ? ` — ${b.author}` : ''}\n   الموقع: ${loc}`
              : `• ${b.title}${b.author ? ` — ${b.author}` : ''}\n   Location: ${loc}`;

          const sum = b.summary ? `\n   ${b.summary}` : '';
          return base + sum;
        })
        .join('\n\n');

      return res.status(200).json({ reply: `${header}\n\n${lines}` });
    }

    // مفيش مطابقات: روح لـ Groq بس قول صراحة انه مش متاح عندنا واقترح بدائل
    const system =
      locale === 'ar'
        ? `أنت "صقر" مساعد مكتبة مدرسة صقر الإمارات الدولية. إذا لم يوجد العنوان في الكتالوج الداخلي، اذكر بوضوح: "هذا العنوان غير متاح حالياً في مكتبتنا." ثم اقترح بدائل مناسبة من نفس الموضوع أو للمستوى العمري المدرسي. إجابتك عربية مختصرة وواضحة.`
        : `You are "Saqr", the library assistant at Emirates Falcon International Private School. If the title is not in the internal catalog, clearly state: "This title is not currently available in our library." Then suggest suitable alternatives for school levels. Keep it concise and clear in English.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userText },
      ],
      temperature: 0.4,
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      (locale === 'ar' ? 'عذراً، لا يوجد رد حالياً.' : 'Sorry, no response.');

    return res.status(200).json({ reply });
  } catch (err: any) {
    console.error('API error:', err);
    return res.status(500).json({ error: err?.message || 'Internal Server Error' });
  }
}
