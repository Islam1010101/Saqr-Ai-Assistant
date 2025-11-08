export const config = { runtime: "edge" }; // أسرع وأرخص على فيرسل

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json", ...cors },
    });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing GROQ_API_KEY" }), {
      status: 500,
      headers: { "content-type": "application/json", ...cors },
    });
  }

  let body: { messages: ChatMessage[]; temperature?: number; top_p?: number };
  try {
    body = (await req.json()) as any;
  } catch {
    return new Response(JSON.stringify({ error: "Bad JSON" }), {
      status: 400,
      headers: { "content-type": "application/json", ...cors },
    });
  }

  const model = "llama-3.1-70b-versatile"; // موديل قوي من Groq
  const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: body.messages,
      temperature: body.temperature ?? 0.4,
      top_p: body.top_p ?? 0.95,
      stream: false, // ممكن نفعّل ستريمنج لاحقًا
    }),
  });

  if (!resp.ok) {
    const t = await resp.text();
    return new Response(JSON.stringify({ error: "Groq error", detail: t }), {
      status: 500,
      headers: { "content-type": "application/json", ...cors },
    });
  }

  const json = await resp.json();
  const reply = json.choices?.[0]?.message?.content ?? "";

  return new Response(JSON.stringify({ reply, raw: json }), {
    status: 200,
    headers: { "content-type": "application/json", ...cors },
  });
}
