// /api/chat.ts
export const config = { runtime: 'edge' }; // مفيش Node ولا @vercel/node

type Msg = { role: 'system' | 'user' | 'assistant'; content: string };

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'GET') {
    return new Response(JSON.stringify({ ok: true, hint: 'POST here with {messages, locale}' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing GROQ_API_KEY' }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
    }

    const { messages = [], locale = 'ar' } = (await req.json()) as {
      messages: Msg[];
      locale: 'ar' | 'en';
    };

    const system: Msg = {
      role: 'system',
      content:
        locale === 'ar'
          ? `اسمك "صقر". انت مساعد مكتبة لمدرسة Emirates Falcon International Private School. 
- تجاوب بالعربية أو الإنجليزية حسب رسالة المستخدم.
- لو السؤال عن كتاب، اقترح عناوين مناسبة للفئة العمرية، واذكر الرف/الدولاب لو متاح، واعرض ملخص قصير.
- لو السؤال عام عن المكتبة/المدرسة، جاوب بإيجاز وبأسلوب رسمي مهذب.
- لو البيانات ناقصة قول "لا توجد بيانات كافية" وما تفتيش.`
          : `Your name is "Saqr". You are the library assistant for Emirates Falcon International Private School.
- Reply in the user's language (English/Arabic).
- For book queries: recommend age-appropriate titles, include shelf/cabinet when available, give a short summary.
- For school/library info: answer briefly and formally.
- If data is missing, say so—don’t hallucinate.`,
    };

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        temperature: 0.3,
        messages: [system, ...messages],
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.text().catch(() => '');
      return new Response(JSON.stringify({ error: `Groq ${groqRes.status}: ${err}` }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
    }

    const data = await groqRes.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() || (locale === 'ar' ? 'عذراً، لا رد.' : 'Sorry, no reply.');

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Server error' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
