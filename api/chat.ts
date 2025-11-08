// /api/chat.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

const SYS_PROMPT = `
You are "Saqr" — a bilingual (Arabic/English) library assistant for
"Emirates Falcon International Private School" (EFIPS).
- Answer briefly, friendly, and helpful.
- If user asks about books, you can use provided "contextBooks" (JSON).
- If user wants shelves/rows, return them clearly.
- Keep Arabic UI-first when locale = "ar", else English-first.
- If you don't know, say so and suggest what info you need.
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages = [], locale = 'ar', contextBooks = [] } = req.body ?? {};

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const systemPreamble =
      SYS_PROMPT +
      `\nCurrent locale: ${locale}\n` +
      (Array.isArray(contextBooks) && contextBooks.length
        ? `Context books (JSON, up to 20): ${JSON.stringify(contextBooks.slice(0, 20))}`
        : 'No contextBooks provided.');

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-70b-versatile',
      temperature: 0.2,
      top_p: 0.9,
      messages: [
        { role: 'system', content: systemPreamble },
        // مرر تاريخ المحادثة القادم من الواجهة
        ...messages,
      ],
    });

    const reply = completion.choices?.[0]?.message?.content ?? '';
    return res.status(200).json({ reply });
  } catch (err: any) {
    console.error('Groq error:', err?.message || err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
