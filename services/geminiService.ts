
import { GoogleGenAI } from "@google/genai";
import { Archetype } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getAIPersonalizedSummary = async (primary: Archetype, secondary: Archetype): Promise<string> => {
  if (!API_KEY) {
      return Promise.resolve("Gemini API key not configured. This feature is disabled.");
  }
  
  const model = 'gemini-2.5-flash-lite';
  
  const prompt = `
    Analyze the ELA archetype combination of a Primary Mask: "${primary.maskName}" (Sacred Archetype: ${primary.sacredArchetype}) and a Secondary Mask: "${secondary.maskName}" (Sacred Archetype: ${secondary.sacredArchetype}).

    Primary Mask Details:
    - Wound: ${primary.wound}
    - Theme: ${primary.theme}
    - Light Gifts: ${primary.lightGifts.join(', ')}

    Secondary Mask Details:
    - Wound: ${secondary.wound}
    - Theme: ${secondary.theme}
    - Light Gifts: ${secondary.lightGifts.join(', ')}

    Based on this information, provide a short, insightful, and empowering summary (2-3 paragraphs) for the user. Address the following:
    1.  How the primary and secondary masks might interact or reinforce each other.
    2.  A key insight into the core challenge this combination presents.
    3.  A gentle, actionable suggestion for integrating the gifts of their sacred archetypes (${primary.sacredArchetype} and ${secondary.sacredArchetype}) to find more balance.
    
    Write in a supportive and encouraging tone. Use markdown for formatting (bolding, lists).
    `;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    return "There was an error generating your personalized summary. Please try again later.";
  }
};
