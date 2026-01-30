
import { GoogleGenAI } from "@google/genai";
import { TradingSession } from "../types";

export const getTradingInsight = async (session: Partial<TradingSession>): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
  const prompt = `
    Analyze this trading session and provide a short (max 2 sentences) encouraging or critical insight.
    Market: ${session.market}
    P&L: ${session.pnl > 0 ? '+' : ''}${session.pnl}
    Duration: ${session.duration} minutes
    Notes: ${session.notes || 'No notes provided'}
    
    Format your response as a direct feedback to the trader.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Keep refining your strategy. Consistency is key!";
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Nice work logging your session. Data is power!";
  }
};
