import { GoogleGenAI, Type } from "@google/genai";
import { Persona, PromptContext } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to check for API key
export const checkApiKey = (): boolean => {
  return !!apiKey;
};

export const generatePersonas = async (idea: string): Promise<Persona[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `The user wants to perform the following task with an AI: "${idea}".
      Suggest 3 distinct, high-quality personas that an AI could adopt to best perform this task. 
      For each persona, provide the specific role name, a brief description of their expertise, and why this persona is suitable.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              role: { type: Type.STRING, description: "The specific role title (e.g., Senior Data Scientist)" },
              description: { type: Type.STRING, description: "A brief description of the persona's expertise and tone." },
              reasoning: { type: Type.STRING, description: "Why this persona is good for the user's task." }
            },
            required: ["role", "description", "reasoning"],
          },
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as Persona[];
    }
    throw new Error("No data returned from Gemini");
  } catch (error) {
    console.error("Error generating personas:", error);
    throw new Error("Failed to generate personas. Please try again.");
  }
};

export const craftFinalPrompt = async (
  idea: string,
  personas: Persona[],
  context: PromptContext
): Promise<string> => {
  try {
    const personasDescription = personas
      .map((p, index) => `${index + 1}. ${p.role}: ${p.description}`)
      .join('\n');

    const promptInputs = `
    TASK: ${idea}
    SELECTED PERSONA(S):
    ${personasDescription}
    
    AUDIENCE: ${context.audience || "Not specified"}
    TONE: ${context.tone || "Professional and Objective"}
    CONSTRAINTS: ${context.constraints || "None"}
    DESIRED FORMAT: ${context.format || "Markdown"}
    EXAMPLES/DATA: ${context.examples || "None provided"}
    INCLUDE CHAIN OF THOUGHT: ${context.useChainOfThought ? "YES (Critical)" : "NO (Optional)"}
    `;

    const systemInstruction = `You are an expert Prompt Engineer. Your goal is to write the *perfect* prompt for another Large Language Model (LLM) based on the user's requirements. 
    Construct a comprehensive, structured system prompt that includes:
    1. Role definition (synthesizing the selected persona(s) into a cohesive expert identity).
    2. Clear task objective.
    3. Context and Tone guidelines (${context.tone}).
    4. Step-by-step instructions${context.useChainOfThought ? " (You MUST include explicit instructions for the model to think step-by-step or use a Chain of Thought approach before answering)" : " (Chain of thought is optional based on complexity)"}.
    5. Formatting rules (${context.format}).
    
    The output should be ONLY the optimized prompt itself, ready to be copied and pasted by the user. Do not add conversational filler like "Here is your prompt".`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptInputs,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "Failed to generate prompt.";
  } catch (error) {
    console.error("Error crafting prompt:", error);
    throw new Error("Failed to craft the final prompt.");
  }
};