import { GoogleGenAI, Type } from "@google/genai";
import { ClefType, RewardData } from "../types";

// Safety check for API Key. 
// In a real app, we handle this more gracefully, but for this demo assume it's there or handle error.
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generateReward = async (
  clef: ClefType, 
  score: number, 
  levelName: string
): Promise<RewardData> => {
  if (!apiKey) {
    // Fallback if no API key is present
    return {
      nickname: "小小音樂家",
      funFact: "你知道嗎？五線譜最早起源於中世紀的紐姆記譜法喔！"
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        The user is a child learning music theory. 
        They just passed the level "${levelName}" (${clef} Clef) with a score of ${score}/100.
        
        Generate a JSON response with:
        1. "nickname": A fun, encouraging, music-related nickname for them (in Traditional Chinese). e.g., "高音王子", "節奏大師", "小小莫札特".
        2. "funFact": A very short, interesting fact about the ${clef} clef or general music theory suitable for a primary school student (in Traditional Chinese).
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nickname: { type: Type.STRING },
            funFact: { type: Type.STRING },
          },
          required: ["nickname", "funFact"],
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    
    return JSON.parse(text) as RewardData;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      nickname: "超級音樂學徒",
      funFact: "熟能生巧！每天練習五線譜，看譜速度會越來越快喔！"
    };
  }
};
