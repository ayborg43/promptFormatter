export interface Persona {
  role: string;
  description: string;
  reasoning: string;
}

export interface PromptContext {
  audience: string;
  constraints: string;
  format: string;
  examples: string;
}

export enum AppStep {
  IDEA = 0,
  PERSONA = 1,
  CONTEXT = 2,
  RESULT = 3,
}

export interface AppState {
  step: AppStep;
  idea: string;
  personas: Persona[];
  selectedPersona: Persona | null;
  context: PromptContext;
  finalPrompt: string;
  isGenerating: boolean;
  error: string | null;
}