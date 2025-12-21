import { GoogleGenAI, Type } from "@google/genai";
import { Persona, PromptContext, ExamplePair } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const checkApiKey = (): boolean => !!process.env.API_KEY;

export const generatePersonas = async (idea: string): Promise<Persona[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User Task: "${idea}". Provide 3 distinct expert personas.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              role: { type: Type.STRING },
              description: { type: Type.STRING },
              reasoning: { type: Type.STRING }
            },
            required: ["role", "description", "reasoning"],
          },
        },
      },
    });
    return response.text ? JSON.parse(response.text) : [];
  } catch (error) {
    throw new Error("Persona generation failed.");
  }
};

export const craftFinalPrompt = async (
  idea: string,
  personas: Persona[],
  context: PromptContext
): Promise<string> => {
  const masterPersona = personas[0];
  const verbosityMap = {
    concise: "STRICTLY CONCISE. Max 2 paragraphs or 5 points.",
    detailed: "STRICTLY DETAILED. Exhaustive analysis, deep-dives, and multiple perspectives.",
    default: "Standard length with necessary depth."
  };

  const fewShot = context.examples.length > 0 
    ? context.examples.map((ex, i) => `<example_${i}>\nINPUT: ${ex.input}\nOUTPUT: ${ex.output}\n</example_${i}>`).join('\n')
    : "None";

  const systemInstruction = `You are a World-Class Prompt Engineer. 
    Construct a high-performance prompt using XML tags and horizontal dividers. 
    Focus on creating a single, powerful Persona block (<role>) and explicit logic gates.`;

  const inputData = `
    CORE_TASK: ${idea}
    MASTER_PERSONA: ${masterPersona.role} (${masterPersona.description})
    VERBOSITY: ${verbosityMap[context.verbosity]}
    RULES: ${context.constraints || "None"}
    NEGATIVE_RULES: ${context.negativeConstraints || "None"}
    FEW_SHOT: ${fewShot}
    LOGIC_CoT: ${context.useChainOfThought}
    LOGIC_CRITIQUE: ${context.useSelfCorrection}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: inputData,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.3,
    }
  });

  return response.text || "Prompt generation failed.";
};