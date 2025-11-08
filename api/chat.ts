// /api/chat.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

// ملاحظة مهمة: ضيف GROQ_API_KEY في بيئة Vercel (Settings → Environment Variables)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // السماح لـ POST فقط
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, locale } = req.body as {
      messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
      locale?: 'ar' | 'en';
    };

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'Server is missing GROQ_API_KEY' });
    }

    // System prompt — هوية وطنية + دور المساعد + لغتين
    const system = `
You are "Saqr" — the smart library assistant for "Emirates Falcon International Private School Library".
- Answer in ${locale === 'ar' ? 'Arabic' : 'English'} by default; keep responses brief and helpful.
- Capabilities:
  * Help users find books by title/author/topic.
  * If the user asks for a book, respond with: shelf number + cabinet/row if provided + a 1–2 line summary.
  * Recommend books by interest/age/topic when asked.
  * Provide simple stats phrasing like "most searched/asked" (the FE will compute later).
  * Provide school/library info politely.
- If data is missing, say you don’t have it and suggest manual search.
- Keep tone friendly and professional, aligned with UAE school identity.
`;

    // نداء Groq
    const chat = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // اختياري: استخدم موديل آخر متاح عندك
      temperature: 0.3,
      messages: [
        { role: 'system', content: system },
        // هنمرّر رسائل المستخدم كما هي
        ...(messages || []).map(m => ({ role: m.role, content: m.content })),
      ],
    });

    const reply = chat.choices?.[0]?.message?.content?.trim() || '';
    return res.status(200).json({ reply });
  } catch (e: any) {
    console.error('API error:', e?.response?.data || e?.message || e);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
