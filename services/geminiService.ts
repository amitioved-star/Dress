
import { GoogleGenAI, Type } from "@google/genai";

// Fixed: Initialized GoogleGenAI according to strict @google/genai guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDressDescription = async (dressName: string, color: string, category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `כתבי תיאור שיווקי קצר, יוקרתי ומזמין בעברית עבור שמלה בשם "${dressName}", בצבע ${color}, בקטגוריית ${category}. התיאור צריך להיות באורך של 2-3 משפטים ולגרום ללקוחה לרצות להשכיר אותה.`,
    });
    // .text is a property, not a method
    return response.text || "שמלה מרהיבה ומעוצבת לאירוע המושלם שלך.";
  } catch (error) {
    console.error("Error generating description:", error);
    return "שמלה מרהיבה ומעוצבת לאירוע המושלם שלך.";
  }
};
