// api/chat.ts - يعمل داخل Vercel Functions
import type { VercelRequest, VercelResponse } from "@vercel/node";
import Groq from "groq-sdk";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages[] is required" });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile", // أقدر أغيره لك
      messages,
      temperature: 0.3,
      max_tokens: 700,
    });

    const text = completion.choices?.[0]?.message?.content || "";
    return res.status(200).json({ text });

  } catch (err: any) {
    console.error("Chat API error:", err);
    return res.status(500).json({ error: err?.message || "Server Error" });
  }
}

