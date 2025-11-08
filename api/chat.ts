// /api/chat.ts
import Groq from "groq-sdk";

// IMPORTANT: حط المفتاح في إعدادات Vercel > Project > Settings > Environment Variables
const client = new Groq({ apiKey: process.env.GROQ_API_KEY! });

// اختياري: لو عايز تستخدم الداتا داخليًا في البرومبت
// لو عندك /data/bookData.ts بتصدّر bookData
import { bookData } from "../data/bookData";

export const config = { runtime: "edge" }; // ينفع برضه تشيلها لو عايز Node runtime

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { messages, locale } = await req.json();

    const sys = [
      {
        role: "system",
        content:
          `You are "Saqr" — a bilingual (Arabic/English) smart library assistant for Emirates Falcon International Private School (EFIPS).
- Answer shortly and clearly first, then elaborate if asked.
- Be formal with teachers, friendly with students.
- Prefer Arabic if locale=ar, else English.
- Capabilities:
  1) Help find books by title/author/topic.
  2) Tell shelf & cabinet from local bookData when available.
  3) Suggest suitable books by age/topic and give 2–3 options.
  4) Produce short summaries (2–4 lines).
  5) Provide simple school/library info & policies.
- If info is missing in bookData, say you will check with the librarian and propose close matches.
- Never invent shelf codes not in data.
- Keep answers safe for school.
- Assistant name is "Saqr".`,
      },
      {
        role: "system",
        content:
          `Local catalog snapshot (bookData): ` +
          JSON.stringify(bookData).slice(0, 15000) + // قصّ طويل لتفادي الضخامة
          `\n(Use it for shelves/locations & quick matches.)`,
      },
      {
        role: "system",
        content:
          locale === "ar"
            ? "اكتب بالعربية الفصحى المبسطة ما لم يُطلب غير ذلك."
            : "Write in clear English unless user asks Arabic.",
      },
    ];

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      messages: [...sys, ...(messages ?? [])],
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      (locale === "ar"
        ? "عذرًا، لم أستطع توليد رد الآن."
        : "Sorry, I couldn't generate a reply.");

    return new Response(JSON.stringify({ reply }), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  } catch (err: any) {
    console.error("API error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      headers: { "content-type": "application/json" },
      status: 500,
    });
  }
}
