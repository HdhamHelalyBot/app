
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available, but do not handle user input for it.
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set. Please configure it in your environment.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Sends a prompt to the Gemini model and returns the text response.
 * @param prompt The user's question or prompt.
 * @returns A promise that resolves to the model's text response.
 */
export async function runQuery(prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const text = response.text;

        if (!text) {
          throw new Error("لم يتم استلام أي نص من Gemini. قد تكون الاستجابة فارغة أو محظورة.");
        }
        
        return text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        if (error instanceof Error) {
            throw new Error(`خطأ في واجهة برمجة تطبيقات Gemini: ${error.message}`);
        }
        throw new Error("حدث خطأ غير معروف أثناء الاتصال بـ Gemini API.");
    }
}
