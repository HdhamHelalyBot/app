import { GoogleGenerativeAI } from "@google/generative-ai";

// استخدم الـ API KEY من ملف .env.local
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function runQuery(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);

    return result.response.text();
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return "حدث خطأ أثناء الاتصال بـ Google Gemini. تأكد من أن API KEY صحيح.";
  }
}
