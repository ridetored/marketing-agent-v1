import { GoogleGenAI } from "@google/genai";

export async function getAIStrategy(data: string, apiKey: string) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not provided.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `
    Analyze the following weekly ad performance data as a Lead Strategist:
    ${data}
    
    1. Which platform is currently performing more efficiently? 
    2. Which campaigns are wasting budget (High spend/Low conversions)?
    3. Provide a 3-point action plan for immediate optimization.
    `,
  });
  return response.text;
}
