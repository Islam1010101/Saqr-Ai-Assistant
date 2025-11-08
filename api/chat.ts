// /api/chat.ts  — Vercel Edge Function
export const config = { runtime: "edge" };

type InMsg = { role: "system" | "user" | "assistant"; content: string };
type InBody = { messages?: InMsg[]; locale?: "ar" | "en" };

const SYS_PROMPT = `You are "Saqr" (صقر), a bilingual (Arabic/English) library assistant for Emirates Falcon International Private School.
- Be concise, helpful, and formal-friendly.
- If user asks about a book, return: brief summary + shelf/cabinet hint if provided by the client + reading level guess.
- If user asks general school/library info, answer in the user language.
- Default to Arabic if locale is "ar".`;

export default async function handler(req: Request) {
  try {
    const body = (await req.json()) as InBody;

    const userMsgs: InMsg[] = Array.isArray(body?.messages) ? body!.messages! : [];
    const locale = body?.locale === "en" ? "en" : "ar";

    const messages: InMsg[] = [
      { role: "system", content: SYS_PROMPT + `\nUser locale: ${locale}` },
      ...userMsgs,
    ];

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY ?? ""}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.4,
        messages,
      }),
    });

    if (!groqRes.ok) {
      const errTxt = await groqRes.text().catch(() => "");
      return new Response(
        JSON.stringify({ error: `Groq error ${groqRes.status}: ${errTxt}` }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await groqRes.json();
    const reply: string =
      data?.choices?.[0]?.message?.content ??
      (locale === "ar"
        ? "عذراً، لم أتمكن من توليد رد حالياً."
        : "Sorry, I couldn't generate a reply right now.");

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
