// /api/chat.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';
// Ensure this path correctly points to your data file
import { bookData } from '../data/bookData';

// 1. Define the Book type to match data/bookData.ts
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

// Helper function: Normalize text for search (lowercase, trim)
function normalize(s: string) {
  return (s || '').toString().toLowerCase().trim();
}

// Helper function: Search in the local catalog
function searchCatalog(q: string): Book[] {
  const n = normalize(q);
  // Split user query into tokens/keywords
  const tokens = n.split(/[\s,\/\-\_,.]+/).filter(Boolean);

  // Cast bookData to Book[] to ensure type safety
  return (bookData as Book[]).filter((b) => {
    const fields = [b.title, b.author, b.subject].map((x) => normalize(String(x ?? ''))).join(' ');
    // Logic: Match full phrase OR match all individual tokens
    return fields.includes(n) || tokens.every((t) => fields.includes(t));
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages = [], locale = 'en' } = (req.body ?? {}) as {
      messages: Array<{ role: string; content: string }>;
      locale: 'ar' | 'en';
    };

    // Get the last user message
    const userText = messages[messages.length - 1]?.content || '';
    
    // 1. Search the database first
    // We take the top 3 matches
    const matches = searchCatalog(userText).slice(0, 3);

    let systemPrompt = '';

    // =========================================================
    // Scenario 1: Book FOUND in inventory
    // =========================================================
    if (matches.length > 0) {
      // Prepare inventory details from the database
      const inventoryDetails = matches.map(b => {
        // Format location string based on locale
        const locationText = locale === 'ar' 
          ? `دولاب رقم ${b.shelf}، رف رقم ${b.row}` // Arabic format
          : `Cabinet ${b.shelf}, Shelf Row ${b.row}`; // English format
        
        return `- Title: "${b.title}" \n  Author: "${b.author}" \n  Location: [${locationText}]`;
      }).join('\n\n');

      // Construct System Prompt
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
    // Scenario 2: Book NOT FOUND (Fall back to AI knowledge)
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

    // Send final prompt to Groq AI
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userText },
      ],
      temperature: 0.6, // Moderate creativity
      max_tokens: 600,
    });

    // Handle response or fallback error
    const reply = completion.choices?.[0]?.message?.content || 
                  (locale === 'ar' ? 'عذراً، لا يوجد رد حالياً.' : 'Sorry, no response.');

    return res.status(200).json({ reply });

  } catch (err: any) {
    console.error('API error:', err);
    return res.status(500).json({ error: err?.message || 'Internal Server Error' });
  }
}
