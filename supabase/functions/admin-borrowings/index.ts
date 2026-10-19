import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json; charset=utf-8',
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char] as string);
}

function dubaiDateOffset(days = 0): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Dubai', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((part) => part.type === type)?.value || '';
  const year = Number(get('year'));
  const month = Number(get('month'));
  const day = Number(get('day'));
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

async function constantTimeEqual(a: string, b: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let i = 0; i < left.length; i++) difference |= left[i] ^ right[i];
  return difference === 0;
}

async function sendBilingualEmail(email: string, book: string, borrowDate: string, returnDate: string) {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  const from = Deno.env.get('EMAIL_FROM');
  if (!apiKey || !from) {
    return {
      emailSent: false,
      emailError: 'Email service is not configured. Set RESEND_API_KEY and EMAIL_FROM in Supabase Edge Function Secrets.',
    };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { emailSent: false, emailError: `Invalid recipient email: ${email || '(empty)'}` };
  }

  const safeBook = escapeHtml(book);
  const safeBorrowDate = escapeHtml(borrowDate);
  const safeReturnDate = escapeHtml(returnDate);
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.8;color:#1e293b;max-width:720px;margin:auto">
      <section dir="rtl" lang="ar" style="padding:20px;border-bottom:1px solid #e2e8f0">
        <h2 style="color:#047857">تمت الموافقة على طلب استعارة الكتاب</h2>
        <p>نحيطكم علمًا بأنه تمت بنجاح الموافقة على طلب استعارة الكتاب الذي عنوانه: <strong>${safeBook}</strong>.</p>
        <p>تاريخ الموافقة وبداية الاستعارة: <strong>${safeBorrowDate}</strong>.</p>
        <p>تاريخ إعادة الكتاب: <strong>${safeReturnDate}</strong>، وذلك بعد 15 يومًا من تاريخ الموافقة.</p>
        <p><strong>يرجى الالتزام بموعد الإعادة المحدد حتى لا يتم تطبيق لوائح الإتلاف المعمول بها في المكتبة.</strong></p>
        <p>مع تحيات إدارة المكتبة، مدرسة فالكون الإمارات الدولية.</p>
      </section>
      <section lang="en" style="padding:20px">
        <h2 style="color:#047857">Your book borrowing request has been approved</h2>
        <p>Your request to borrow the book titled <strong>${safeBook}</strong> has been approved successfully.</p>
        <p>Approval date and start of loan: <strong>${safeBorrowDate}</strong>.</p>
        <p>Return deadline: <strong>${safeReturnDate}</strong>, 15 days from the approval date.</p>
        <p><strong>Please return the book by the due date to avoid the library's applicable damage and loss policies.</strong></p>
        <p>Regards, Library Administration, Falcon Emirates International Private School.</p>
      </section>
    </div>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [email],
        subject: `تمت الموافقة على الاستعارة | Borrowing approved: ${book}`,
        html,
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detail = typeof result?.message === 'string' ? result.message : `Email provider returned HTTP ${response.status}`;
      return { emailSent: false, emailError: detail };
    }
    return { emailSent: true, emailError: '' };
  } catch (error) {
    return { emailSent: false, emailError: error instanceof Error ? error.message : String(error) };
  }
}

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'Method not allowed.' }, 405);

  const configuredAdminKey = Deno.env.get('BORROW_ADMIN_KEY');
  const suppliedAdminKey = request.headers.get('x-admin-key') || '';
  if (!configuredAdminKey) {
    return jsonResponse({ ok: false, error: 'BORROW_ADMIN_KEY is not configured in Edge Function Secrets.' }, 500);
  }
  if (!(await constantTimeEqual(suppliedAdminKey, configuredAdminKey))) {
    return jsonResponse({ ok: false, error: 'Invalid borrowing admin key.' }, 401);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ ok: false, error: 'Supabase server credentials are not available to this function.' }, 500);
  }
  const db = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let payload: Record<string, any>;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Request body must be valid JSON.' }, 400);
  }

  try {
    if (payload.action === 'list') {
      const [pendingResult, activeResult] = await Promise.all([
        db.from('borrowings').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
        db.from('borrowings').select('*').eq('status', 'active').order('created_at', { ascending: false }),
      ]);
      if (pendingResult.error) throw pendingResult.error;
      if (activeResult.error) throw activeResult.error;
      return jsonResponse({ ok: true, pending: pendingResult.data || [], active: activeResult.data || [] });
    }

    if (payload.action === 'approve') {
      const id = payload.id;
      if (id === undefined || id === null || id === '') return jsonResponse({ ok: false, error: 'Request ID is required.' }, 400);
      const { data: row, error: readError } = await db.from('borrowings').select('*').eq('id', id).maybeSingle();
      if (readError) throw readError;
      if (!row) return jsonResponse({ ok: false, error: 'Borrowing request was not found.' }, 404);
      if (row.status !== 'pending') return jsonResponse({ ok: false, error: `Request is not pending (current status: ${row.status}).` }, 409);

      const borrowDate = dubaiDateOffset(0);
      const returnDate = dubaiDateOffset(15);
      const email = row.user_type === 'student'
        ? `${String(row.user_id || '').trim()}@falcon-school.com`
        : String(row.user_email || '').trim();
      if (!email || (row.user_type !== 'student' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
        return jsonResponse({ ok: false, error: 'A valid borrower email is required. Check the teacher email saved in this request.' }, 400);
      }

      const { error: updateError } = await db.from('borrowings').update({
        status: 'active', user_email: email, borrow_date: borrowDate, return_date: returnDate,
      }).eq('id', id).eq('status', 'pending');
      if (updateError) throw updateError;

      const emailResult = await sendBilingualEmail(email, String(row.book_name || ''), borrowDate, returnDate);
      return jsonResponse({
        ok: true, emailSent: emailResult.emailSent, emailError: emailResult.emailError,
        email, borrowDate, returnDate,
      });
    }

    if (payload.action === 'reject') {
      const id = payload.id;
      const { data, error } = await db.from('borrowings').update({ status: 'rejected' })
        .eq('id', id).eq('status', 'pending').select('id').maybeSingle();
      if (error) throw error;
      if (!data) return jsonResponse({ ok: false, error: 'Pending request was not found or was already handled.' }, 404);
      return jsonResponse({ ok: true });
    }

    if (payload.action === 'return') {
      const { data, error } = await db.from('borrowings').update({ status: 'returned' })
        .eq('id', payload.id).eq('status', 'active').select('id').maybeSingle();
      if (error) throw error;
      if (!data) return jsonResponse({ ok: false, error: 'Active borrowing was not found.' }, 404);
      return jsonResponse({ ok: true });
    }

    if (payload.action === 'direct') {
      const userId = String(payload.user_id || '').trim();
      const userType = String(payload.user_type || 'student');
      const bookName = String(payload.book_name || '').trim();
      const borrowDate = dubaiDateOffset(0);
      const returnDate = String(payload.return_date || '').trim();
      const email = userType === 'student' ? `${userId}@falcon-school.com` : String(payload.user_email || '').trim();
      if (!userId || !bookName || !returnDate || !email) {
        return jsonResponse({ ok: false, error: 'Borrower ID, book title, email and return date are required.' }, 400);
      }
      const { data: created, error } = await db.from('borrowings').insert([{
        user_id: userId, user_type: userType, user_email: email, book_name: bookName,
        borrow_date: borrowDate, return_date: returnDate, status: 'active',
      }]).select('*').single();
      if (error) throw error;
      const emailResult = await sendBilingualEmail(email, bookName, borrowDate, returnDate);
      return jsonResponse({ ok: true, borrowing: created, emailSent: emailResult.emailSent, emailError: emailResult.emailError });
    }

    return jsonResponse({ ok: false, error: 'Unsupported action.' }, 400);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('admin-borrowings error:', message);
    return jsonResponse({ ok: false, error: message }, 500);
  }
});
