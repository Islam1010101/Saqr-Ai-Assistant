// /api/chat.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';
import { bookData } from '../data/bookData';

// تعريف نوع البيانات
type Book = {
  title: string;
  author?: string;
  shelf?: number; // الدولاب
  row?: number;   // الرف
  subject?: string;
  summary?: string;
};

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function normalize(s: string) {
  return (s || '').toString().toLowerCase().trim();
}

function searchCatalog(q: string): Book[] {
  const n = normalize(q);
  // تقسيم النص للبحث بكلمات متفرقة
  const tokens = n.split(/[\s,\/\-\_,.]+/).filter(Boolean);

  return (bookData as Book[]).filter((b) => {
    const fields = [b.title, b.author, b.subject].map((x) => normalize(String(x ?? ''))).join(' ');
    // البحث عن تطابق كامل أو وجود كل الكلمات
    return fields.includes(n) || tokens.every((t) => fields.includes(t));
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages = [], locale = 'en' } = (req.body ?? {}) as {
      messages: Array<{ role: string; content: string }>;
      locale: 'ar' | 'en';
    };

    const userText = messages[messages.length - 1]?.content || '';
    
    // نبحث في الداتا أولاً
    const matches = searchCatalog(userText).slice(0, 3); // نكتفي بأفضل 3 نتائج

    let systemPrompt = '';

    // ---------------------------------------------------------
    // السيناريو الأول: الكتاب موجود في الداتا
    // ---------------------------------------------------------
    if (matches.length > 0) {
      // نجهز بيانات المخزون لنرسلها للذكاء الاصطناعي
      const inventoryDetails = matches.map(b => {
        const loc = (b.shelf && b.row) 
          ? (locale === 'ar' ? `رف رقم ${b.row}، دولاب رقم ${b.shelf}` : `Shelf ${b.row}, Cabinet ${b.shelf}`)
          : (locale === 'ar' ? 'الموقع غير محدد بدقة' : 'Location not specified');
        
        return `- Title: ${b.title}, Author: ${b.author || 'Unknown'}, Location: [${loc}]`;
      }).join('\n');

      systemPrompt = locale === 'ar'
        ? `أنت "صقر"، أمين مكتبة مدرسة صقر الإمارات الدولية.
           المستخدم يسأل عن كتاب، وهذا الكتاب **موجود بالفعل** في مكتبتنا.
           
           بيانات الكتاب من المخزون:
           ${inventoryDetails}

           المطلوب منك:
           1. أخبر المستخدم بأسلوب لطيف أن الكتاب متاح، واذكر موقعه (الرف والدولاب) بدقة كما هو مذكور أعلاه.
           2. أضف نبذة مختصرة وشيقة عن محتوى الكتاب أو مؤلفه من معلوماتك العامة (General Knowledge) لتشجيع الطالب على قراءته.`
        : `You are "Saqr", the library assistant. The user is asking about a book that IS available in our library.
           Inventory Details:
           ${inventoryDetails}

           Task:
           1. Confirm the book is available and state its location exactly as provided above.
           2. Add a brief, engaging summary about the book content or author from your general knowledge.`;
    } 
    
    // ---------------------------------------------------------
    // السيناريو الثاني: الكتاب غير موجود
    // ---------------------------------------------------------
    else {
      systemPrompt = locale === 'ar'
        ? `أنت "صقر"، أمين مكتبة ذكي ومفيد. المستخدم يسأل عن كتاب: "${userText}".
           
           تحذير هام: هذا الكتاب **غير موجود** في سجلات المكتبة الحالية.
           
           المطلوب منك:
           1. قدم معلومات ثرية عن هذا الكتاب (اسم المؤلف، سنة النشر، وعن ماذا يتحدث الكتاب) بناءً على معرفتك العامة.
           2. في نهاية الرد، يجب أن تعتذر بوضوح وتقول: "لكن للأسف، هذا الكتاب غير متوفر في مكتبتنا حالياً".
           3. ممنوع منعاً باتاً اختراع رقم رف أو دولاب وهمي.`
        : `You are "Saqr", a helpful library assistant. The user is asking about: "${userText}".
           
           IMPORTANT: This book is **NOT** in our current inventory.
           
           Task:
           1. Provide rich details about this book (Author, summary, genre) based on your general knowledge.
           2. Clearly state at the end: "Unfortunately, this specific book is not currently available in our library."
           3. Do NOT invent any shelf or cabinet numbers.`;
    }

    // إرسال الطلب للذكاء الاصطناعي لتكوين الرد النهائي
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // موديل ممتاز وسريع
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userText }, // نرسل سؤال المستخدم الأصلي
      ],
      temperature: 0.5, // حرارة متوسطة لإبداع متزن
      max_tokens: 500,
    });

    const reply = completion.choices?.[0]?.message?.content || 
                  (locale === 'ar' ? 'عذراً، حدث خطأ في الاتصال.' : 'Sorry, connection error.');

    return res.status(200).json({ reply });

  } catch (err: any) {
    console.error('API error:', err);
    return res.status(500).json({ error: err?.message || 'Internal Server Error' });
  }
}
