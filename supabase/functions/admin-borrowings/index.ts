import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const email = payload.email || payload.to;
    const book = payload.book || payload.book_name;
    const borrowDate = payload.borrow_date || new Date().toISOString().split("T")[0];
    const returnDate = payload.return_date || payload.date;
    const durationDays = payload.duration_days || 15;
    const subject = payload.subject || `تأكيد استعارة كتاب: ${book} | Book Borrowing Confirmation`;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const EMAIL_FROM = Deno.env.get("EMAIL_FROM") || "EFIPS Library <library@efipslibrary.online>";

    const htmlContent = payload.html || `
    <div style="font-family: 'Cairo', Tahoma, sans-serif; max-width: 650px; margin: auto; border: 2px solid #e2e8f0; border-radius: 20px; overflow: hidden;">
        <div style="background: #1e3a8a; color: white; padding: 20px; text-align: center;">
            <img src="https://www.efipslibrary.online/school-logo.png" style="width: 70px; margin-bottom: 10px;" />
            <h2 style="margin: 0;">مكتبة مدرسة صقر الإمارات الدولية الخاصة</h2>
            <p style="margin: 5px 0 0; color: #fbbf24;">EFIPS Smart Library</p>
        </div>
        <div dir="rtl" style="padding: 20px; text-align: right; border-bottom: 2px dashed #cbd5e1; color: #1e293b; line-height: 1.8;">
            <h3 style="color: #059669;">✅ تم تأكيد استعارة الكتاب بنجاح</h3>
            <p>نفيدكم بالموافقة على استعارة الكتاب التالي:</p>
            <ul>
                <li><strong>الكتاب:</strong> ${book}</li>
                <li><strong>تاريخ الاستعارة:</strong> ${borrowDate}</li>
                <li><strong>مدة الاستعارة:</strong> ${durationDays} يوماً</li>
                <li><strong>تاريخ الإرجاع الإلزامي:</strong> <span style="color: #e11d48; font-weight: bold;">${returnDate}</span></li>
            </ul>
            <p style="background: #fff1f2; padding: 10px; border-right: 4px solid #e11d48; color: #9f1239;">
                ⚠️ <strong>تنبيه هام:</strong> يجب إرجاع الكتاب في الموعد المحدد أعلاه تجنباً لاعتبار الكتاب تالفاً أو مفقوداً.
            </p>
        </div>
        <div dir="ltr" style="padding: 20px; text-align: left; color: #1e293b; line-height: 1.8;">
            <h3 style="color: #059669;">✅ Book Borrowing Confirmed</h3>
            <p>Your borrowing request has been approved:</p>
            <ul>
                <li><strong>Book Title:</strong> ${book}</li>
                <li><strong>Borrow Date:</strong> ${borrowDate}</li>
                <li><strong>Period:</strong> ${durationDays} days</li>
                <li><strong>Return Deadline:</strong> <span style="color: #e11d48; font-weight: bold;">${returnDate}</span></li>
            </ul>
            <p style="background: #fff1f2; padding: 10px; border-left: 4px solid #e11d48; color: #9f1239;">
                ⚠️ <strong>Notice:</strong> The book must be returned by the due date to avoid being considered lost or damaged.
            </p>
        </div>
    </div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [email],
        subject: subject,
        html: htmlContent,
      }),
    });

    const resData = await res.json();
    return new Response(JSON.stringify({ ok: true, resData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
