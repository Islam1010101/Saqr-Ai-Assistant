import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';
// تأكد أن ملف bookData.ts موجود بجانب هذا الملف
import { bookData } from './bookData';

// ---------------------------------------------------------
// 1. تعريف الأنواع والإعدادات
// ---------------------------------------------------------
type Book = {
  id: string;
  title: string;
  author: string;
  subject: string;
  shelf: number;
  row: number;
  summary?: string; 
};

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// قائمة التحيات لتجاهل البحث وتوفير الموارد
const GREETINGS = ['hi', 'hello', 'hey', 'salam', 'marhaba', 'alo', 'hola', 'مرحبا', 'سلام', 'هلا', 'اهلين', 'هاي'];

// دالة مساعدة لتنظيف النصوص للمقارنة
function normalize(text: string) {
  if (!text) return '';
  return text.toString().toLowerCase().trim();
}

// ---------------------------------------------------------
// 2. المترجم ومستخرج الأفكار (العقل المدبر 🧠)
// ---------------------------------------------------------
async function extractSmartKeywords(userText: string): Promise<string[]> {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192', // سريع وذكي كفاية للاستخراج
      messages: [
        { 
          role: 'system', 
          content: `
            You are an expert Librarian AI. 
            Task: Analyze the user's input (which might be in Arabic or English) and extract the core **English Search Keywords**.
            
            Rules:
            1. If the user asks about a specific topic (e.g., "Space", "History"), include synonyms (e.g., "Astronomy", "Universe", "Past").
            2. If the user asks about a feeling (e.g., "I'm sad"), suggest genres (e.g., "Comedy", "Self-help", "Uplifting").
            3. Output ONLY a comma-separated list of English keywords. No explanations.
            
            Examples:
            - User: "عايز حاجة عن الفضاء" -> Output: Space, Astronomy, Universe, NASA, Planets
            - User: "روايات رعب" -> Output: Horror, Thriller, Ghosts, Mystery, Stephen King
            - User: "Harry Potter" -> Output: Harry Potter, Rowling, Magic, Fantasy
          ` 
        },
        { role: 'user', content: userText }
      ],
      temperature: 0.3,
      max_tokens: 60,
    });

    const text = completion.choices[0]?.message?.content || '';
    // تنظيف النتيجة وتحويلها لمصفوفة
    return text.split(',').map(s => normalize(s)).filter(s => s.length > 2);
  } catch (e) {
    console.error("Keyword extraction failed", e);
    return [normalize(userText)];
  }
}

// ---------------------------------------------------------
// 3. محرك البحث (الباحث 🔍)
// ---------------------------------------------------------
function searchLibrary(keywords: string[]): Book[] {
  if (keywords.length === 0) return [];

  // نستخدم Set لمنع تكرار نفس الكتاب في النتائج
  const foundBooks = new Set<Book>();

  bookData.forEach(book => {
    // نجمع كل بيانات الكتاب في نص واحد للبحث داخله
    const bookContent = `
      ${normalize(book.title)} 
      ${normalize(book.author)} 
      ${normalize(book.subject)} 
      ${normalize(book.summary || '')}
    `;

    // هل يحتوي الكتاب على أي من الكلمات المفتاحية؟
    const isMatch = keywords.some(keyword => bookContent.includes(keyword));
    
    if (isMatch) {
      foundBooks.add(book);
    }
  });

  // تحويل الـ Set إلى Array وإرجاع أول 6 نتائج فقط
  return Array.from(foundBooks).slice(0, 6);
}

// ---------------------------------------------------------
// 4. المعالج الرئيسي (The Handler)
// ---------------------------------------------------------
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // التحقق من وجود مفتاح API لتجنب الخطأ 500
  if (!process.env.GROQ_API_KEY) {
    console.error("Critical Error: GROQ_API_KEY is missing in environment variables.");
    return res.status(500).json({ error: "Server Configuration Error: API Key missing." });
  }

  // السماح فقط بطلبات POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body || {};
    const messages = body.messages || [];
    const locale = body.locale || 'en'; 
    const userMessage = messages[messages.length - 1]?.content || '';
    const cleanUserMessage = normalize(userMessage);
    
    // --- إصلاح مشكلة الرد العجيب على "Hi" ---
    // إذا كانت الرسالة مجرد تحية، نرد فوراً بدون بحث
    if (GREETINGS.includes(cleanUserMessage) || cleanUserMessage.length < 2) {
      const welcomeMsg = locale === 'ar' 
        ? "أهلاً بك يا صديقي! أنا صقر، أمين المكتبة الذكي. 🦅\nأخبرني، عما تبحث اليوم؟ (مثلاً: كتب عن الفضاء، روايات غموض...)" 
        : "Hello my friend! I am Saqr, the smart librarian. 🦅\nTell me, what are you looking for today? (e.g., Space books, Mystery novels...)";
      
      return res.status(200).json({ reply: welcomeMsg });
    }

    // --- الخطوة 1: الفهم والترجمة ---
    const searchKeywords = await extractSmartKeywords(userMessage);
    console.log(`User: "${userMessage}" -> Keywords: [${searchKeywords.join(', ')}]`);

    // --- الخطوة 2: البحث في المكتبة ---
    const matchingBooks = searchLibrary(searchKeywords);

    // --- الخطوة 3: صياغة السياق للذكاء الاصطناعي ---
    let systemContext = "";
    
    if (matchingBooks.length > 0) {
      const booksList = matchingBooks.map(b => 
        `- Title: "${b.title}" | Author: ${b.author} | Subject: ${b.subject} | Location: Shelf ${b.shelf}, Row ${b.row}`
      ).join('\n');

      systemContext = `
        GREAT NEWS! We found these specific books in our library that match the user's request:
        ${booksList}
      `;
    } else {
      systemContext = `
        RESULT: No specific physical books were found in our catalog matching "${searchKeywords.join(', ')}".
        However, you should still be helpful and explain the topic generally.
      `;
    }

    // --- الخطوة 4: تعليمات الشخصية (صقر) ---
    const isArabic = locale === 'ar';
    
    const systemPrompt = `
      You are **Saqr**, the intelligent and friendly librarian of this school.
      
      ### CURRENT SITUATION:
      User Input: "${userMessage}"
      Database Search Results: 
      ${systemContext}

      ### YOUR MISSION:
      1. **If books are found:** - Be enthusiastic! Say something like "I found exactly what you are looking for!".
         - List the books clearly. **IMPORTANT:** Even if you reply in Arabic, keep the **Book Title in English** (so they can find it on the cover) but translate the description/reasoning.
         - Mention the Location (Shelf/Row) for each book.
         - Tell the user *why* this book is good for their request based on the title/subject.

      2. **If NO books are found:**
         - Apologize politely that we don't have physical copies right now.
         - Suggest the closest relevant section (e.g., "You might want to check the Science section on Shelf 5 generally").
         - Give a brief, interesting fact about the topic to show you are smart.

      3. **Tone:** Professional, encouraging, and helpful.
      4. **Language:** Reply in ${isArabic ? 'ARABIC' : 'ENGLISH'}.
    `;

    // --- الخطوة 5: توليد الرد النهائي ---
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', 
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.5, 
      max_tokens: 800,
    });

    const reply = completion.choices?.[0]?.message?.content || 'Sorry, I am thinking...';
    return res.status(200).json({ reply });

  } catch (error: any) {
    console.error('API Error:', error);
    // إرجاع رسالة خطأ واضحة بدلاً من انهيار السيرفر
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
