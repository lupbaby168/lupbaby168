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
      funFact: "你知道嗎？五線譜最早起源於中世紀的紐姆記譜法喔！那時候的豆芽菜長得跟現在不太一樣，經過了好幾百年才演變成我們現在看到的樣子呢！"
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
        2. "funFact": An engaging and slightly longer fun fact (2-3 sentences) about the ${clef} clef, instruments that read it, or general music theory. Write it in Traditional Chinese for a primary school student. Make it sound exciting, like a secret tip or a cool story!
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
      funFact: "熟能生巧！每天練習五線譜，看譜速度會越來越快喔！音樂就像魔法語言，學會了就能聽懂作曲家想說的故事呢！"
    };
  }
};

export const editDollImage = async (base64Data: string, prompt: string): Promise<string | null> => {
  if (!apiKey) return null;

  try {
    // base64Data might include the prefix "data:image/png;base64,". We need to strip it.
    const match = base64Data.match(/^data:(image\/[a-z]+);base64,(.+)$/);
    const mimeType = match ? match[1] : 'image/png';
    const data = match ? match[2] : base64Data;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: data,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;

  } catch (error) {
    console.error("Gemini Image Edit Error:", error);
    return null;
  }
};