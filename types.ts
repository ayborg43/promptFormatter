export interface Persona {
  role: string;
  description: string;
  reasoning: string;
}

export interface ExamplePair {
  input: string;
  output: string;
}

export interface PromptContext {
  constraints: string;
  negativeConstraints: string;
  examples: ExamplePair[];
  useChainOfThought: boolean;
  useSelfCorrection: boolean;
  verbosity: 'concise' | 'detailed' | 'default';
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
  selectedPersonas: Persona[];
  context: PromptContext;
  finalPrompt: string;
  isGenerating: boolean;
  error: string | null;
}