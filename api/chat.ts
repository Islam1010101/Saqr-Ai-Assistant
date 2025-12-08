import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

// ---------------------------------------------------------
// 1. إعداد البيانات (ضع بياناتك هنا)
// ---------------------------------------------------------

// تعريف نوع الكتاب
type Book = {
  title: string;
  author: string;
  shelf: number;
  row: number;
  subject?: string;
  summary?: string;
  language?: 'AR' | 'EN';
};

// ⚠️ هام: ألصق هنا مصفوفة الكتب الكاملة الخاصة بك بدلاً من هذا المثال
const books: Book[] = [
  { "title": "EUPHORIA", "author": "LILY KING", "shelf": 16, "row": 6 },
  { "title": "THE MARTIAN", "author": "ANDY WEIR", "shelf": 12, "row": 3 },
  // ... ضع باقي كتبك هنا ...
];

// ---------------------------------------------------------
// 2. إعداد Groq والدوال المساعدة
// ---------------------------------------------------------
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function normalize(text: string) {
  return (text || '').toString().toLowerCase().trim();
}

function searchInventory(query: string): Book[] {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];

  // تقسيم البحث إلى كلمات (Tokens)
  const queryTokens = normalizedQuery.split(/[\s,\/\-\_,.]+/).filter(Boolean);

  return books.filter((book) => {
    const searchableText = [book.title, book.author, book.subject]
      .map((field) => normalize(String(field ?? '')))
      .join(' ');
    
    // البحث عن الجملة كاملة أو الكلمات متفرقة
    return searchableText.includes(normalizedQuery) || 
           queryTokens.every((token) => searchableText.includes(token));
  });
}

// ---------------------------------------------------------
// 3. معالج الطلبات (API Handler)
// ---------------------------------------------------------
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // السماح فقط بطلبات POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages = [], locale = 'en' } = (req.body ?? {}) as {
      messages: Array<{ role: string; content: string }>;
      locale: 'ar' | 'en'; // افتراضياً الإنجليزية لو لم يحدد
    };

    // نأخذ آخر رسالة من المستخدم للبحث عنها
    const userMessage = messages[messages.length - 1]?.content || '';
    
    // نبحث في الكتب (نأخذ أول 5 نتائج فقط لتقليل حجم البيانات المرسلة)
    const matches = searchInventory(userMessage).slice(0, 5);

    let systemInstructions = '';

    // =========================================================
    // السيناريو الأول: الكتاب موجود في المكتبة
    // =========================================================
    if (matches.length > 0) {
      
      const inventoryDetails = matches.map(book => {
        const locationStr = locale === 'ar'
          ? `الرف (Shelf): ${book.shelf}، الصف (Row): ${book.row}`
          : `Shelf: ${book.shelf}, Row: ${book.row}`;
        
        return `- Book: "${book.title}" by "${book.author}" | Location: [${locationStr}]`;
      }).join('\n');

      if (locale === 'ar') {
        systemInstructions = `
          أنت "صقر"، أمين مكتبة EFIPS الذكي.
          
          ✅ وجدنا الكتب التالية في فهرس المكتبة تطابق بحث الطالب:
          ${inventoryDetails}

          المطلوب منك:
          1. أخبر الطالب بوضوح أن الكتاب متوفر.
          2. اذكر موقع الكتاب (رقم الرف والصف) بدقة من القائمة أعلاه.
          3. كن لطيفاً ومساعداً.
        `;
      } else {
        systemInstructions = `
          You are "Saqr", the intelligent librarian at EFIPS.

          ✅ We found the following books in our physical catalog matching the student's request:
          ${inventoryDetails}

          Your Task:
          1. Confirm to the student that the book is available.
          2. Clearly state the exact **Shelf** and **Row** from the list above.
          3. Be helpful and encouraging.
        `;
      }

    } 
    // =========================================================
    // السيناريو الثاني: الكتاب غير موجود (استخدام الذكاء العام)
    // =========================================================
    else {
      
      if (locale === 'ar') {
        systemInstructions = `
          أنت "صقر"، مساعد ذكي وموسوعي في مكتبة مدرسة.
          الطالب يسأل عن موضوع أو كتاب بعنوان: "${userMessage}".
          
          🔴 الحالة: بحثنا في فهرس المكتبة ولم نجد نسخة ورقية لهذا الكتاب بالتحديد.
          
          ✅ المطلوب منك (أظهر ذكاءك):
          1. تجاهل عدم وجود الكتاب مؤقتاً، وقم بالإجابة على استفسار الطالب أو اشرح له ملخصاً عن الكتاب/الموضوع الذي يبحث عنه اعتماداً على "معلوماتك العامة الضخمة".
          2. كن مفيداً ومرحاً، اقترح كتباً مشابهة عالمياً أو تحدث عن المؤلف.
          3. **في نهاية الرد فقط**، أضف ملاحظة لطيفة: "ولكن للأسف، بحثت في النظام ولم أجد نسخة ورقية متوفرة في مكتبتنا حالياً."
          4. ⛔ ممنوع منعاً باتاً اختراع "رقم رف" أو "دولاب" وهمي.
        `;
      } else {
        systemInstructions = `
          You are "Saqr", a smart and knowledgeable library assistant.
          The student is asking about: "${userMessage}".
          
          🔴 Status: We searched the inventory and did NOT find a physical copy.
          
          ✅ Task (Show your intelligence):
          1. Use your vast general knowledge to discuss the book/topic, provide a summary, or answer the student's question in detail.
          2. Be helpful and engaging. Suggest similar popular books.
          3. **Only at the very end**, add a polite note: "However, I searched our records and unfortunately, we don't have a physical copy available right now."
          4. ⛔ DO NOT invent a fake Shelf or Cabinet number.
        `;
      }
    }

    // إرسال الطلب لـ Groq
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // موديل سريع وقوي
      messages: [
        { role: 'system', content: systemInstructions },
        { role: 'user', content: userMessage }, // نرسل رسالة المستخدم الأصلية
      ],
      temperature: 0.5, // تقليل العشوائية ليكون دقيقاً في المعلومات
      max_tokens: 500,
    });

    const reply = completion.choices?.[0]?.message?.content || 'Sorry, no response available.';

    return res.status(200).json({ reply });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return res.status(500).json({ error: error?.message || 'Internal Server Error' });
  }
}
