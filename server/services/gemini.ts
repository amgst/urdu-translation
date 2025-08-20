import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function correctUrduText(text: string): Promise<string> {
  try {
    const prompt = `You are an expert in Urdu language grammar and spelling. Please correct any spelling mistakes, grammar errors, and improve the clarity of the following Urdu text while preserving its original meaning and context. Only return the corrected text without any explanations or additional commentary.

Original text: ${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || text;
  } catch (error) {
    throw new Error(`Failed to correct Urdu text: ${error}`);
  }
}

export function isGeminiConfigured(): boolean {
  return !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
}
