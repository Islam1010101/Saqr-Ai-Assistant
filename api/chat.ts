// /api/chat.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';
// تأكد أن المسار هنا صحيح ويشير لملف الداتا بتاعك
import { bookData } from '../data/bookData';

// 1. تعريف نوع البيانات ليطابق ملف data/bookData.ts
type Book = {
  title: string;
  author: string;
  shelf: number; // رقم الدولاب/الخزانة
  row: number;   // رقم الرف
  subject: string;
  summary: string;
  language: 'AR' | 'EN';
};

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// دالة تنظيف النصوص للبحث
function normalize(s: string) {
  return (s || '').toString().toLowerCase().trim();
}

// دالة البحث في القائمة المحلية
function searchCatalog(q: string): Book[] {
  const n = normalize(q);
  // تقسيم جملة المستخدم لكلمات مفتاحية
  const tokens = n.split(/[\s,\/\-\_,.]+/).filter(Boolean);

  // نستخدم (as Book[]) للتأكد من النوع
  return (bookData as Book[]).filter((b) => {
    const fields = [b.title, b.author, b.subject].map((x) => normalize(String(x ?? ''))).join(' ');
    // البحث: هل النص موجود بالكامل؟ أو هل كل الكلمات المتفرقة موجودة؟
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
    
    // 1. البحث في قاعدة البيانات أولاً
    // نأخذ أول نتيجة فقط لأنها الأقرب (أو يمكنك أخذ أول 3)
    const matches = searchCatalog(userText).slice(0, 3);

    let systemPrompt = '';

    // =========================================================
    // الحالة الأولى: الكتاب موجود في البيانات (Found)
    // =========================================================
    if (matches.length > 0) {
      // تجهيز بيانات الموقع من الداتا
      const inventoryDetails = matches.map(b => {
        // تنسيق المكان حسب اللغة
        const locationText = locale === 'ar' 
          ? `دولاب رقم ${b.shelf}، رف رقم ${b.row}`
          : `Cabinet ${b.shelf}, Shelf Row ${b.row}`;
        
        return `- الكتاب: "${b.title}" \n  المؤلف: "${b.author}" \n  المكان في المكتبة: [${locationText}]`;
      }).join('\n\n');

      systemPrompt = locale === 'ar'
        ? `أنت "صقر"، أمين مكتبة مدرسة صقر الإمارات الدولية.
           المستخدم يسأل عن كتاب، وهذا الكتاب **موجود بالفعل** في مكتبتنا.
           
           تفاصيل الكتاب من سجلاتنا:
           ${inventoryDetails}

           المطلوب منك:
           1. أكد للمستخدم أن الكتاب متوفر، واذكر موقعه (الدولاب والرف) بدقة كما هو مذكور بالأعلى.
           2. قم بكتابة ملخص شيق ومفيد عن محتوى هذا الكتاب من معلوماتك العامة (General Knowledge) لأن الملخص في النظام فارغ.
           3. كن مشجعاً ولطيفاً مع الطلاب.`
        : `You are "Saqr", the library assistant. The user is asking about a book that IS available in our library.
           
           Library Records:
           ${inventoryDetails}

           Your Task:
           1. Confirm availability and state the exact location (Cabinet/Shelf) provided above.
           2. Provide an engaging summary of the book's content from your own general knowledge (ignore the placeholder summary in the database).
           3. Be encouraging to the student.`;
    } 
    
    // =========================================================
    // الحالة الثانية: الكتاب غير موجود (Not Found)
    // =========================================================
    else {
      systemPrompt = locale === 'ar'
        ? `أنت "صقر"، أمين مكتبة ذكي. المستخدم يسأل عن كتاب: "${userText}".
           
           🔴 تنبيه هام: بحثت في السجلات ولم أجد هذا الكتاب. الكتاب **غير متوفر** حالياً.
           
           المطلوب منك:
           1. قدم معلومات مفيدة عن الكتاب (المؤلف، القصة، الفائدة) بناءً على ذاكرتك ومعلوماتك العامة.
           2. في نهاية الرد، يجب أن تقول بوضوح ولطف: "لكن للأسف، هذه النسخة غير موجودة في مكتبة المدرسة حالياً".
           3. ممنوع نهائياً تأليف رقم رف أو مكان للكتاب.`
        : `You are "Saqr", a helpful library assistant. The user is asking about: "${userText}".
           
           🔴 IMPORTANT: This book is **NOT** in our current inventory.
           
           Your Task:
           1. Provide rich details about the book (author, plot, themes) based on your general knowledge.
           2. Clearly state at the end: "Unfortunately, this book is not currently available in our school library."
           3. DO NOT invent a shelf location.`;
    }

    // إرسال البرومبت النهائي للـ AI
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userText },
      ],
      temperature: 0.6, // درجة إبداع متوسطة
      max_tokens: 600,
    });

    const reply = completion.choices?.[0]?.message?.content || 
                  (locale === 'ar' ? 'عذراً، لا يوجد رد حالياً.' : 'Sorry, no response.');

    return res.status(200).json({ reply });

  } catch (err: any) {
    console.error('API error:', err);
    return res.status(500).json({ error: err?.message || 'Internal Server Error' });
  }
}
