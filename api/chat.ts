// /api/chat.ts — يعمل على Vercel (Edge Function)

export const config = { runtime: "edge" };

type Msg = { role: "system" | "user" | "assistant"; content: string };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Missing GROQ_API_KEY on the server" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }

  const { messages = [], locale = "ar" } = (await req.json().catch(() => ({}))) as {
    messages: Msg[];
    locale: "ar" | "en";
  };

  const systemPrompt = `
You are "Saqr" — the bilingual library assistant for "Emirates Falcon International Private School".
- Default to Arabic if the user writes Arabic, otherwise English.
- Be concise and friendly.
- You can suggest books by topic/age and answer about shelves/rows if provided by the app.
- If data is missing, say so briefly and suggest manual search.
  `.trim();

  const body = {
    model: "llama-3.1-70b-versatile",
    temperature: 0.2,
    messages: [{ role: "system", content: systemPrompt }, ...messages],
  };

  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!r.ok) {
    const detail = await r.text().catch(() => "");
    return new Response(
      JSON.stringify({ error: "Upstream Groq error", detail }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }

  const data = await r.json();
  const reply =
    data?.choices?.[0]?.message?.content ??
    (locale === "ar" ? "تعذّر توليد رد." : "Failed to generate a reply.");

  return new Response(JSON.stringify({ reply }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
