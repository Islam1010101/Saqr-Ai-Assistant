// /api/chat.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

// ---------------------------------------------------------
// 1. البيانات (هنا نضع الكتب مباشرة لحل مشكلة الاستيراد)
// ---------------------------------------------------------
const books = [
  { "title": "CREATING EXCELLENCE", "author": "Craig R. Hickman", "shelf": 4, "row": 1 },
  // 👇 انسخ باقي الكتب الخاصة بك وألصقها هنا تحت هذا السطر 👇
  // { "title": "كتاب آخر...", ... },
  
];

// ---------------------------------------------------------
// 2. تعريف الأنواع (Types)
// ---------------------------------------------------------
type Book = {
  title: string;
  author: string;
  shelf: number;
  row: number;
  subject?: string; // جعلناها اختيارية لأن بياناتك قد لا تحتوي عليها
  summary?: string; // جعلناها اختيارية
  language?: 'AR' | 'EN';
};

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * دالة مساعدة لتوحيد النصوص للبحث
 */
function normalize(text: string) {
  return (text || '').toString().toLowerCase().trim();
}

/**
 * منطق البحث داخل القائمة الموجودة في نفس الملف
 */
function searchInventory(query: string): Book[] {
  const normalizedQuery = normalize(query);
  const queryTokens = normalizedQuery.split(/[\s,\/\-\_,.]+/).filter(Boolean);

  return (books as Book[]).filter((book) => {
    const searchableText = [book.title, book.author, book.subject]
      .map((field) => normalize(String(field ?? '')))
      .join(' ');
    
    return searchableText.includes(normalizedQuery) || 
           queryTokens.every((token) => searchableText.includes(token));
  });
}

// ---------------------------------------------------------
// 3. معالج الطلبات (Handler)
// ---------------------------------------------------------
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages = [], locale = 'en' } = (req.body ?? {}) as {
      messages: Array<{ role: string; content: string }>;
      locale: 'ar' | 'en';
    };

    const userMessage = messages[messages.length - 1]?.content || '';
    
    // البحث في الكتب
    const matches = searchInventory(userMessage).slice(0, 3);

    let systemInstructions = '';

    // تجهيز الرد بناءً على النتائج
    if (matches.length > 0) {
      const inventoryDetails = matches.map(book => {
        const locationStr = locale === 'ar'
          ? `دولاب رقم ${book.shelf}، رف رقم ${book.row}`
          : `Cabinet ${book.shelf}, Shelf Row ${book.row}`;
        
        return `- Title: "${book.title}" | Author: "${book.author}" | Location: [${locationStr}]`;
      }).join('\n');

      if (locale === 'ar') {
        systemInstructions = `
          أنت "صقر"، أمين المكتبة.
          وجدنا الكتاب:
          ${inventoryDetails}
          المطلوب: أكد وجود الكتاب واذكر موقعه بدقة.
        `;
      } else {
        systemInstructions = `
          You are "Saqr". Book found:
          ${inventoryDetails}
          Task: Confirm availability and state location exactly.
        `;
      }

    } else {
      if (locale === 'ar') {
        systemInstructions = `
          أنت "صقر". الطالب يسأل عن: "${userMessage}".
          الكتاب غير موجود. اعتذر بأدب ولا تختلق مكاناً.
        `;
      } else {
        systemInstructions = `
          You are "Saqr". Asking about: "${userMessage}".
          Book NOT in inventory. Apologize and do NOT invent a location.
        `;
      }
    }

    // إرسال الطلب للذكاء الاصطناعي
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemInstructions },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.5,
      max_tokens: 500,
    });

    const reply = completion.choices?.[0]?.message?.content || 'No response';

    return res.status(200).json({ reply });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return res.status(500).json({ error: error?.message || 'Internal Server Error' });
  }
}
