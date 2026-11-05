import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Retired: the approved EFIPS stories are now served as recorded MP3s from /public.
// No Azure, browser speech, text generation or per-sentence network service remains.
const allowedOrigin = (origin: string) =>
  origin === "https://www.efipslibrary.com" ||
  origin === "https://efipslibrary.com" ||
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin);

Deno.serve((req: Request) => {
  const origin = req.headers.get("origin") || "";
  const headers: Record<string, string> = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Vary": "Origin",
    "Access-Control-Allow-Headers": "authorization, apikey, x-client-info, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };
  if (allowedOrigin(origin)) headers["Access-Control-Allow-Origin"] = origin;
  if (req.method === "OPTIONS") {
    return new Response(null, { status: allowedOrigin(origin) ? 204 : 403, headers });
  }
  // Retain a safe endpoint for older clients while preventing further synthesis.
  return new Response(JSON.stringify({ error: "RECORDED_AUDIO_ONLY" }), {
    status: 410, headers
  });
});
