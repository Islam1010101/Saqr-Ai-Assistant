import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';
// 👇 1. استيراد بيانات الكتب الحقيقية بدلاً من كتابتها يدوياً
// تأكد أن ملف bookData.ts موجود في نفس مجلد api
import { bookData } from './bookData';

// تعريف نوع البيانات (للتأكد من توافق الأنواع)
type Book = {
  id: string;
  title: string;
  author: string;
  subject: string;
  shelf: number;
  row: number;
  summary?: string; 
};

// إعداد عميل Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// 👇 2. دالة تنظيف النصوص (مهمة جداً للغة العربية)
// تجعل البحث يتجاهل الهمزات (أ، إ، آ -> ا) والتاء المربوطة (ة -> هـ) والتشكيل
function normalize(text: string) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    // إزالة التشكيل
    .replace(/[\u064B-\u065F]/g, '')
    // توحيد الألفات
    .replace(/[أإآ]/g, 'ا')
    // توحيد الياء والألف المقصورة
    .replace(/[ى]/g, 'ي')
    // توحيد التاء المربوطة والهاء
    .replace(/[ة]/g, 'ه');
}

// 👇 3. منطق البحث المحسن
function searchInventory(query: string): Book[] {
  const q = normalize(query);
  
  if (!q) return [];
  
  // تجاهل الكلمات القصيرة جداً إلا إذا كانت أرقاماً
  if (q.length < 2) return [];

  return bookData.filter((book) => {
    // تنظيف بيانات الكتاب أيضاً للمقارنة
    const title = normalize(book.title);
    const author = normalize(book.author);
    const subject = normalize(book.subject);
    const summary = normalize(book.summary || ''); // البحث في الملخص أيضاً إذا وجد

    // البحث: هل الكلمة موجودة في العنوان أو المؤلف أو الموضوع؟
    return title.includes(q) || author.includes(q) || subject.includes(q) || summary.includes(q);
  });
}

// المعالج الرئيسي (API Handler)
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body || {};
    const messages = body.messages || [];
    const locale = body.locale || 'en'; 

    const userMessage = messages[messages.length - 1]?.content || '';
    
    // 1. إجراء البحث في مكتبتك الحقيقية
    // نزيد عدد النتائج لـ 10 لزيادة فرصة إيجاد الكتاب المناسب
    const matches = searchInventory(userMessage).slice(0, 10);

    // 2. تجهيز السياق للذكاء الاصطناعي
    const booksContext = matches.length > 0
      ? matches.map(b => `- الكتاب: "${b.title}" | المؤلف: ${b.author} | التصنيف: ${b.subject} | مكان الكتاب: (رف ${b.shelf}، صف ${b.row})`).join('\n')
      : "No specific books found matching this query in the library database.";

    // 3. التعليمات (System Prompt)
    // تمييز التعليمات بناءً على اللغة
    const isArabic = locale === 'ar';

    const systemInstructions = `
      You are Saqr, a smart and helpful librarian.
      
      ### LIBRARY DATABASE RESULTS (Real books we have):
      ${booksContext}

      ### User Input:
      "${userMessage}"

      ### INSTRUCTIONS:
      1. **Direct Answer:** If the user asks for a book and it appears in the "LIBRARY DATABASE RESULTS" above, you MUST say "Yes, we have it!" and provide its Title, Author, and Location (Shelf/Row).
      2. **Not Found:** If the book is NOT in the "LIBRARY DATABASE RESULTS", apologize and say it's not currently available in the physical library, but briefly define the topic using your general knowledge.
      3. **Search Logic:** If the user describes a topic (e.g., "books about history"), look at the "subject" or "title" in the database results and recommend the best matches.
      4. **Language:** Reply in ${isArabic ? 'ARABIC' : 'ENGLISH'}.
    `;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemInstructions },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.3, // تقليل العشوائية لضمان دقة المعلومات
      max_tokens: 500,
    });

    const reply = completion.choices?.[0]?.message?.content || '...';
    return res.status(200).json({ reply });

  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
