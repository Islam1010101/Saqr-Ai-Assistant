import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

// لاحظ: قمت بإلغاء استيراد bookData مؤقتاً للتأكد أنه ليس سبب المشكلة
// import { bookData } from './bookData'; 

export default async function handler(req: VercelRequest, res: VercelResponse) {
  
  // 1. السماح بطلبات POST فقط
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. كشف حالة المفتاح
  const apiKey = process.env.GROQ_API_KEY;
  let keyStatus = "MISSING";
  if (apiKey) {
    // نظهر أول 4 حروف وآخر 4 حروف للتأكد من صحته دون كشفه كاملاً
    keyStatus = `Present (${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)})`;
  }

  try {
    // محاولة تشغيل Groq
    if (!apiKey) throw new Error("API Key is null/undefined");

    const groq = new Groq({ apiKey: apiKey });

    // تجربة استدعاء بسيط جداً (بدون منطق كتب)
    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: 'Say "System Operational"' }],
    });

    // إذا وصلنا هنا، فكل شيء سليم!
    return res.status(200).json({ 
      reply: `✅ TEST PASSED!\nKey Status: ${keyStatus}\nAI Reply: ${completion.choices[0]?.message?.content}` 
    });

  } catch (error: any) {
    // 3. طباعة الخطأ الحقيقي للمستخدم
    console.error("FULL ERROR:", error);
    
    return res.status(200).json({ 
      reply: `❌ DIAGNOSTIC FAILURE\n\nKey Status: ${keyStatus}\nError Name: ${error.name}\nError Message: ${error.message}\n\n(صور هذه الشاشة وأرسلها لي)` 
    });
  }
}
