export const config = { runtime: "edge" }; // يشتغل كـ Edge Function على فيرسيل

type Msg = { role: "system" | "user" | "assistant"; content: string };

const systemPrompt = `
You are "Saqr" (صقر), a bilingual (AR/EN) smart library assistant for
"Emirates Falcon International Private School" library.
- Keep answers concise and helpful.
- If user speaks Arabic, reply in Arabic; if English, reply in English.
- You can recommend books, help with topics, and answer about the school/library.
- If asked about book location, format like: "Shelf: X | Cabinet: Y".
`;

function toGroqMessages(messages: Msg[], locale?: "ar" | "en"): Msg[] {
  const sys = {
    role: "system" as const,
    content:
      systemPrompt +
      (locale === "ar"
        ? `\nPrefer Arabic responses when possible.`
        : `\nPrefer English responses when possible.`),
  };
  return [sys, ...messages];
}

// قراءة ستريم SSE من Groq وإرجاع نص متدفق للواجهة
async function streamGroqToClient(resp: Response) {
  const reader = resp.body!.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // SSE: سطور بتبدأ بـ "data:"
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";
        for (const chunk of parts) {
          const line = chunk.trim();
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const delta = json?.choices?.[0]?.delta?.content || "";
            if (delta) controller.enqueue(encoder.encode(delta));
          } catch {
            // تجاهل أي تشانك مش JSON
          }
        }
      }
      controller.close();
    },
  });
}

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response("Missing GROQ_API_KEY", { status: 500 });
  }

  let body: { messages: Msg[]; locale?: "ar" | "en" };
  try {
    body = (await req.json()) as any;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const { messages = [], locale } = body;
  const groqRes = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile", // اختَر موديل Groq
        temperature: 0.2,
        stream: true,
        messages: toGroqMessages(messages, locale),
      }),
    }
  );

  if (!groqRes.ok || !groqRes.body) {
    const err = await groqRes.text().catch(() => "");
    return new Response(`Groq error: ${err}`, { status: 500 });
  }

  const stream = await streamGroqToClient(groqRes);
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
