import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';
import { findInCatalog } from './_lib/bookData';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY missing' });
  }

  try {
    const { messages = [], locale = 'en' } = req.body || {};
    const userMessage = messages[messages.length - 1]?.content || '';

    const matchingBooks = findInCatalog(userMessage);

    const context =
      matchingBooks?.length
        ? matchingBooks.map(b =>
            `- ${b.title} (Author: ${b.author}, Shelf ${b.shelf}, Row ${b.row})`
          ).join('\n')
        : 'No matching books found.';

    const safeMessages = messages.filter(
      (m: any) => m?.role && m?.content && typeof m.content === 'string'
    );

    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are Saqr, a school librarian. Respond in ${locale === 'ar' ? 'Arabic' : 'English'}.\n${context}`
        },
        ...safeMessages
      ],
      temperature: 0.5,
      max_tokens: 600
    });

    return res.status(200).json({
      reply:
        completion.choices?.[0]?.message?.content ||
        'No response generated'
    });

  } catch (err: any) {
    console.error('API ERROR:', err);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}
