import React, { useMemo, useRef, useState } from "react";
// لو عندك types جاهزة، استوردها. وإلا خليه محلي:
type Msg = { role: "system" | "user" | "assistant"; content: string };

// عدّل المسار حسب ملفك
// مثال: export const bookData: Book[] في data/bookData.ts
type Book = {
  id: string;
  title: string;
  author?: string;
  shelf?: number;
  row?: number;
  cabinet?: string;
  summary?: string;
  topics?: string[];
};
import { bookData } from "../data/bookData"; // ← تأكد من الاسم والـ export

const SYSTEM_PROMPT = `
أنت "صقر" — مساعد مكتبة مدرسة Emirates Falcon International Private School.
- الهوية: رسمية وبسيطة، عربي/إنجليزي.
- المهام:
  1) مساعدة الطلاب والمعلمين في إيجاد الكتب (الموقع: رف/دولاب/صف).
  2) اقتراح كتب مناسبة حسب الاهتمامات/الموضوعات.
  3) تزويد معلومات مختصرة عن المدرسة والمكتبة وسياسات الاستعارة.
  4) مساعدة أمين المكتبة بتقارير شائعة الطلب (ملخّصات نصية).
- القواعد:
  • لو السؤال بحث كتاب: استخدم البيانات المتاحة وأرجع العنوان + المكان + ملخص قصير.
  • الرد يكون موجز وواضح، افصل عربي ثم English لو الطلب عام.
  • ممنوع اختراع بيانات رف/دولاب إن لم تتوفر — اذكر أنها غير متاحة.
`;

export default function ChatAssistant() {
  const [input, setInput] = useState("");
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Msg[]>([]);

  const messages = useMemo<Msg[]>(() => {
    return [{ role: "system", content: SYSTEM_PROMPT }, ...history];
  }, [history]);

  // فلتر بحث سريع من الـ bookData
  const quickResults = useMemo(() => {
    const q = input.trim().toLowerCase();
    if (!q) return [];
    return bookData
      .filter(b =>
        [b.title, b.author, ...(b.topics ?? [])]
          .filter(Boolean)
          .some(v => String(v).toLowerCase().includes(q))
      )
      .slice(0, 5);
  }, [input]);

  const onSend = async () => {
    const text = input.trim();
    if (!text) return;
    setHistory(h => [...h, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: messages.concat({ role: "user", content: text }) }),
      });
      const data = await res.json();
      const reply = data?.reply ?? "…";
      setHistory(h => [...h, { role: "assistant", content: reply }]);
    } catch (e: any) {
      setHistory(h => [...h, { role: "assistant", content: "حصل خطأ في الاتصال بالخادم." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* هيدر وهوية */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <img src="/logo.png" alt="EFIPS" className="h-10 w-10 object-contain" />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold">مساعد المكتبة — صقر</h1>
            <p className="text-xs text-gray-500">
              Emirates Falcon International Private School • Library Assistant
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              className={`px-3 py-1 rounded ${lang === "ar" ? "bg-black text-white" : "bg-gray-200"}`}
              onClick={() => setLang("ar")}
            >
              العربية
            </button>
            <button
              className={`px-3 py-1 rounded ${lang === "en" ? "bg-black text-white" : "bg-gray-200"}`}
              onClick={() => setLang("en")}
            >
              English
            </button>
          </div>
        </div>
      </header>

      {/* المحتوى */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* نتائج سريعة من الداتا */}
        {quickResults.length > 0 && (
          <div className="mb-4 rounded-xl border bg-white">
            <div className="px-4 py-2 border-b font-semibold">نتائج سريعة من فهرس الكتب</div>
            <ul className="divide-y">
              {quickResults.map(b => (
                <li key={b.id} className="px-4 py-3 text-sm">
                  <div className="font-medium">{b.title}</div>
                  <div className="text-gray-500">
                    {b.author ? `by ${b.author} • ` : ""}
                    {b.cabinet ? `Cabinet: ${b.cabinet} • ` : ""}
                    {typeof b.shelf === "number" ? `Shelf: ${b.shelf} • ` : ""}
                    {typeof b.row === "number" ? `Row: ${b.row}` : ""}
                  </div>
                  {b.summary && <div className="text-gray-600 mt-1">{b.summary}</div>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* الشات */}
        <div className="rounded-2xl border bg-white p-4">
          <div className="space-y-3 max-h-[60vh] overflow-auto">
            {history.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "text-right"
                    : "text-left"
                }
              >
                <div
                  className={
                    "inline-block px-3 py-2 rounded-2xl " +
                    (m.role === "user" ? "bg-black text-white" : "bg-gray-100")
                  }
                  dir={lang === "ar" ? "rtl" : "ltr"}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-sm text-gray-500">…جاري التفكير</div>}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              dir={lang === "ar" ? "rtl" : "ltr"}
              className="flex-1 rounded-xl border px-3 py-2 outline-none"
              placeholder={lang === "ar" ? "اكتب سؤالك عن الكتب أو المكتبة…" : "Ask about books or the library…"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSend()}
            />
            <button
              onClick={onSend}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-60"
            >
              إرسال
            </button>
          </div>
        </div>

        {/* فوتر بسيط */}
        <footer className="text-center text-xs text-gray-400 mt-6">
          Powered by Groq • Built with Vite + React • “Saqr”
        </footer>
      </main>
    </div>
  );
}

