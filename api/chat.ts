// /api/chat.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

// ✅ التعديل هنا: بما أن الملف أصبح بجانب هذا الملف، نستخدم نقطة واحدة ./
// ونحذف .js لأن TypeScript سيفهم الامتداد تلقائياً أثناء البناء
import { books } from '../api/bookData';

// 1. Define Type Definitions (Clean & English)
type Book = {
  title: string;
  author: string;
  shelf: number; // Cabinet number
  row: number;   // Shelf row number
  subject: string;
  summary: string;
  language: 'AR' | 'EN';
};

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Helper: Normalize text for consistent searching.
 * Lowers case and removes extra spaces.
 */
function normalize(text: string) {
  return (text || '').toString().toLowerCase().trim();
}

/**
 * Core Logic: Search the local inventory.
 * Returns an array of matches.
 */
function searchInventory(query: string): Book[] {
  const normalizedQuery = normalize(query);
  const queryTokens = normalizedQuery.split(/[\s,\/\-\_,.]+/).filter(Boolean);

  // Cast bookData to Book[] to ensure type safety
  return (books as Book[]).filter((book) => {
    // Combine searchable fields into one string
    const searchableText = [book.title, book.author, book.subject]
      .map((field) => normalize(String(field ?? '')))
      .join(' ');
    
    // Check if the full query exists OR if all individual words exist in the book data
    return searchableText.includes(normalizedQuery) || 
           queryTokens.every((token) => searchableText.includes(token));
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Security: Only allow POST requests
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages = [], locale = 'en' } = (req.body ?? {}) as {
      messages: Array<{ role: string; content: string }>;
      locale: 'ar' | 'en';
    };

    // Get the latest message from the user
    const userMessage = messages[messages.length - 1]?.content || '';
    
    // ------------------------------------------------------------------
    // STEP 1: Check Internal Database
    // ------------------------------------------------------------------
    const matches = searchInventory(userMessage).slice(0, 3); // Limit to top 3 matches

    let systemInstructions = '';

    // ------------------------------------------------------------------
    // STEP 2: Construct System Prompt based on Availability
    // ------------------------------------------------------------------

    if (matches.length > 0) {
      // === SCENARIO A: Book Exists in Library ===
      
      // Format the location data for the AI
      const inventoryDetails = matches.map(book => {
        const locationStr = locale === 'ar'
          ? `دولاب رقم ${book.shelf}، رف رقم ${book.row}`
          : `Cabinet ${book.shelf}, Shelf Row ${book.row}`;
        
        return `- Title: "${book.title}" | Author: "${book.author}" | Location: [${locationStr}]`;
      }).join('\n');

      // Instructions: Confirm availability + Give Location
      if (locale === 'ar') {
        systemInstructions = `
          أنت "صقر"، أمين المكتبة.
          وجدنا الكتاب الذي يسأل عنه الطالب في السجلات:
          ${inventoryDetails}
          
          المطلوب:
          1. أخبر الطالب أن الكتاب **موجود** واذكر موقعه (الدولاب والرف) بدقة.
          2. قدم ملخصاً بسيطاً ومشوقاً عن الكتاب من معلوماتك العامة.
        `;
      } else {
        systemInstructions = `
          You are "Saqr", the library assistant.
          We found the book the student is asking about in our inventory:
          ${inventoryDetails}
          
          Task:
          1. Confirm the book is **available** and state its exact location (Cabinet/Shelf).
          2. Provide a short, engaging summary of the book from your general knowledge.
        `;
      }

    } else {
      // === SCENARIO B: Book Does NOT Exist ===
      
      // Instructions: Discuss book content BUT apologize for unavailability.
      // STRICT RULE: DO NOT INVENT LOCATIONS.
      
      if (locale === 'ar') {
        systemInstructions = `
          أنت "صقر"، أمين المكتبة. الطالب يسأل عن كتاب: "${userMessage}".
          
          🔴 تنبيه: هذا الكتاب **غير موجود** في مكتبتنا حالياً.
          
          المطلوب:
          1. تحدث عن الكتاب (معلومات عامة، المؤلف، القصة) لتفيد الطالب.
          2. ولكن في النهاية، اعتذر بوضوح وقل: "للأسف، هذا الكتاب غير متوفر في المكتبة حالياً".
          3. ⛔ ممنوع منعاً باتاً اختراع أي أرقام رفوف أو دواليب.
        `;
      } else {
        systemInstructions = `
          You are "Saqr", the library assistant. The student is asking about: "${userMessage}".
          
          🔴 IMPORTANT: This book is **NOT** in our current inventory.
          
          Task:
          1. Provide helpful info about the book (Author, Plot, Genre) from your general knowledge.
          2. However, clearly state: "Unfortunately, this book is not currently available in our library."
          3. ⛔ DO NOT invent any shelf or cabinet numbers.
        `;
      }
    }

    // ------------------------------------------------------------------
    // STEP 3: Send to AI (Groq)
    // ------------------------------------------------------------------
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemInstructions },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.5, // Keep it balanced between creative and factual
      max_tokens: 500,
    });

    const reply = completion.choices?.[0]?.message?.content || 
                  (locale === 'ar' ? 'عذراً، لا يوجد رد.' : 'Sorry, no response.');

    return res.status(200).json({ reply });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return res.status(500).json({ error: error?.message || 'Internal Server Error' });
  }
}
