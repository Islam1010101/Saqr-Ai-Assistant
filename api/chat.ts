// /api/chat.ts — Edge Runtime
import Groq from "groq-sdk";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  if (!process.env.GROQ_API_KEY) {
    return new Response(JSON.stringify({ error: "Missing GROQ_API_KEY" }), { status: 500 });
  }

  const { messages, locale } = await req.json();

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const system = `
You are Saqr — the smart assistant of Emirates Falcon International Private School Library.
Respond in ${locale === "ar" ? "Arabic" : "English"}.
Keep the tone friendly, educational, and helpful.
Provide book suggestions and library help.
If unknown, ask user to try manual search.
`;

  try {
    const chat = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: system },
        ...messages
      ],
      temperature: 0.3,
    });

    const reply = chat.choices?.[0]?.message?.content?.trim() || "";

    return new Response(JSON.stringify({ reply }), { status: 200 });

  } catch (err) {
    console.error("Groq API Error:", err);
    return new Response(JSON.stringify({ error: "AI request failed" }), { status: 500 });
  }
}
